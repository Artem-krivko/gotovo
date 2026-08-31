import { spawn } from "node:child_process";
import { resolve } from "node:path";

const PRODUCTION_URL = "https://www.usegotovo.by";
const REDIRECT_PATH = "/razrabotka-sajtov-ceny";
const REDIRECT_DESTINATION = "/pricing";
const EXTRA_INDEXABLE_PATHS = ["/privacy"];
const port = Number(process.env.SEO_CHECK_PORT ?? 4300 + (process.pid % 500));
const localOrigin = `http://127.0.0.1:${port}`;

function write(message = "") {
  process.stdout.write(`${message}\n`);
}

function getAttribute(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"));
  return match?.[1] ?? match?.[2] ?? match?.[3] ?? null;
}

function tags(html, name) {
  return html.match(new RegExp(`<${name}\\b[^>]*>`, "gi")) ?? [];
}

function metaContent(html, attribute, value) {
  const tag = tags(html, "meta").find((candidate) => getAttribute(candidate, attribute) === value);
  return tag ? getAttribute(tag, "content") : null;
}

function canonicalUrls(html) {
  return tags(html, "link")
    .filter((tag) => getAttribute(tag, "rel")?.toLowerCase().split(/\s+/).includes("canonical"))
    .map((tag) => getAttribute(tag, "href"))
    .filter(Boolean);
}

function titleText(html) {
  return html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? "";
}

function productionUrl(pathname) {
  return new URL(pathname, `${PRODUCTION_URL}/`).toString();
}

function metadataUrl(pathname) {
  // Next.js Metadata API сериализует origin без завершающего слеша.
  return pathname === "/" ? PRODUCTION_URL : productionUrl(pathname);
}

function localUrl(pathname) {
  return new URL(pathname, `${localOrigin}/`).toString();
}

async function waitForServer(server, timeoutMs = 30_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) {
      throw new Error(`Next.js завершился до запуска с кодом ${server.exitCode}`);
    }
    try {
      const response = await fetch(localUrl("/robots.txt"));
      if (response.ok) return;
    } catch {
      // Сервер ещё запускается.
    }
    await new Promise((resolveWait) => setTimeout(resolveWait, 200));
  }
  throw new Error("Next.js production server не запустился за 30 секунд");
}

async function stopServer(server) {
  if (server.exitCode !== null) return;
  server.kill("SIGTERM");
  await Promise.race([
    new Promise((resolveExit) => server.once("exit", resolveExit)),
    new Promise((resolveTimeout) => setTimeout(resolveTimeout, 5_000)),
  ]);
  if (server.exitCode === null) server.kill("SIGKILL");
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function checkIndexablePage(pathname) {
  const response = await fetch(localUrl(pathname), { redirect: "manual" });
  const html = await response.text();
  const expectedUrl = metadataUrl(pathname);
  const canonicals = canonicalUrls(html);
  const description = metaContent(html, "name", "description");
  const robots = metaContent(html, "name", "robots") ?? "";
  const ogTitle = metaContent(html, "property", "og:title");
  const ogDescription = metaContent(html, "property", "og:description");
  const ogUrl = metaContent(html, "property", "og:url");
  const ogImage = metaContent(html, "property", "og:image");

  assert(response.status === 200, `${pathname}: ожидался HTTP 200, получен ${response.status}`);
  assert(canonicals.length === 1, `${pathname}: ожидался один canonical, найдено ${canonicals.length}`);
  assert(canonicals[0] === expectedUrl, `${pathname}: canonical ${canonicals[0]} не совпадает с ${expectedUrl}`);
  assert(titleText(html), `${pathname}: отсутствует title`);
  assert(description, `${pathname}: отсутствует description`);
  assert(ogTitle, `${pathname}: отсутствует og:title`);
  assert(ogDescription, `${pathname}: отсутствует og:description`);
  assert(ogUrl === expectedUrl, `${pathname}: og:url ${ogUrl} не совпадает с ${expectedUrl}`);
  assert(ogImage, `${pathname}: отсутствует og:image`);
  assert(!robots.toLowerCase().includes("noindex"), `${pathname}: индексируемая страница содержит noindex`);

  return { pathname, status: response.status, canonical: canonicals[0], ogUrl };
}

async function main() {
  const nextBin = resolve("node_modules/next/dist/bin/next");
  let serverOutput = "";
  const server = spawn(process.execPath, [nextBin, "start", "-H", "127.0.0.1", "-p", String(port)], {
    env: { ...process.env, NODE_ENV: "production" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  server.stdout.on("data", (chunk) => { serverOutput += chunk.toString(); });
  server.stderr.on("data", (chunk) => { serverOutput += chunk.toString(); });

  try {
    await waitForServer(server);

    const sitemapResponse = await fetch(localUrl("/sitemap.xml"));
    const sitemapXml = await sitemapResponse.text();
    assert(sitemapResponse.status === 200, `sitemap.xml: ожидался HTTP 200, получен ${sitemapResponse.status}`);
    const sitemapUrls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
    assert(sitemapUrls.length > 0, "sitemap.xml не содержит URL");
    assert(new Set(sitemapUrls).size === sitemapUrls.length, "sitemap.xml содержит дубли URL");
    assert(!sitemapXml.includes("<lastmod>"), "sitemap.xml содержит неподтверждённые lastModified");
    assert(sitemapUrls.every((url) => new URL(url).origin === PRODUCTION_URL), "sitemap.xml содержит не-production домен");
    assert(sitemapUrls.includes(productionUrl("/goroda")), "sitemap.xml не содержит /goroda");
    assert(sitemapUrls.includes(productionUrl("/uslugi")), "sitemap.xml не содержит /uslugi");
    assert(!sitemapUrls.includes(productionUrl(REDIRECT_PATH)), `sitemap.xml содержит redirect URL ${REDIRECT_PATH}`);
    assert(!sitemapUrls.includes(productionUrl("/thank-you")), "sitemap.xml содержит /thank-you");

    const indexablePaths = [...new Set([
      ...sitemapUrls.map((url) => new URL(url).pathname),
      ...EXTRA_INDEXABLE_PATHS,
    ])];
    const pageResults = [];
    for (const pathname of indexablePaths) {
      pageResults.push(await checkIndexablePage(pathname));
    }

    const redirectResponse = await fetch(localUrl(REDIRECT_PATH), { redirect: "manual" });
    const redirectLocation = redirectResponse.headers.get("location");
    assert([301, 308].includes(redirectResponse.status), `${REDIRECT_PATH}: ожидался 301/308, получен ${redirectResponse.status}`);
    assert(
      redirectLocation && new URL(redirectLocation, localOrigin).pathname === REDIRECT_DESTINATION,
      `${REDIRECT_PATH}: неверный Location ${redirectLocation}`,
    );

    const thankYouResponse = await fetch(localUrl("/thank-you"), { redirect: "manual" });
    const thankYouHtml = await thankYouResponse.text();
    const thankYouRobots = metaContent(thankYouHtml, "name", "robots") ?? "";
    assert(thankYouResponse.status === 200, `/thank-you: ожидался HTTP 200, получен ${thankYouResponse.status}`);
    assert(thankYouRobots.toLowerCase().includes("noindex"), "/thank-you: отсутствует noindex");

    const robotsResponse = await fetch(localUrl("/robots.txt"));
    const robotsText = await robotsResponse.text();
    assert(robotsResponse.status === 200, `robots.txt: ожидался HTTP 200, получен ${robotsResponse.status}`);
    assert(!/Disallow:\s*\/thank-you/i.test(robotsText), "robots.txt блокирует /thank-you");
    assert(robotsText.includes(`Sitemap: ${productionUrl("/sitemap.xml")}`), "robots.txt содержит неверный Sitemap URL");

    write("URL                                      status  canonical = og:url");
    for (const result of pageResults) {
      write(`${result.pathname.padEnd(40)} ${String(result.status).padEnd(7)} ${result.canonical === result.ogUrl ? "yes" : "no"}`);
    }
    write(`${REDIRECT_PATH.padEnd(40)} ${String(redirectResponse.status).padEnd(7)} → ${REDIRECT_DESTINATION}`);
    write(`${"/thank-you".padEnd(40)} ${String(thankYouResponse.status).padEnd(7)} noindex`);
    write();
    write(`SEO check passed: ${pageResults.length} indexable pages, sitemap, robots and redirect.`);
  } catch (error) {
    if (serverOutput.trim()) process.stderr.write(`\nNext.js output:\n${serverOutput}\n`);
    throw error;
  } finally {
    await stopServer(server);
  }
}

main().catch((error) => {
  process.stderr.write(`SEO check failed: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
});
