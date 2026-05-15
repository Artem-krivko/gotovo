import { createSign } from "node:crypto";

const SITE_URL = process.env.SITE_URL ?? "https://gotovo.studio";
const KEY_JSON = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

if (!KEY_JSON) {
  console.error("GOOGLE_SERVICE_ACCOUNT_KEY is not set");
  process.exit(1);
}

async function getSitemapUrls() {
  const res = await fetch(`${SITE_URL}/sitemap.xml`);
  if (!res.ok) throw new Error(`Sitemap fetch failed: ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
}

function makeJWT(sa) {
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(JSON.stringify({
    iss: sa.client_email,
    scope: "https://www.googleapis.com/auth/indexing",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  })).toString("base64url");

  const sign = createSign("RSA-SHA256");
  sign.update(`${header}.${payload}`);
  const sig = sign.sign(sa.private_key, "base64url");
  return `${header}.${payload}.${sig}`;
}

async function getToken(sa) {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: makeJWT(sa),
    }),
  });
  const data = await res.json();
  if (!data.access_token) throw new Error(`Auth failed: ${JSON.stringify(data)}`);
  return data.access_token;
}

async function pingUrl(url, token) {
  const res = await fetch("https://indexing.googleapis.com/v3/urlNotifications:publish", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ url, type: "URL_UPDATED" }),
  });
  return res.ok;
}

async function main() {
  const sa = JSON.parse(KEY_JSON);
  const token = await getToken(sa);
  const urls = await getSitemapUrls();

  console.log(`Found ${urls.length} URLs in sitemap\n`);

  let ok = 0;
  let fail = 0;
  for (const url of urls) {
    const success = await pingUrl(url, token);
    console.log(`${success ? "✓" : "✗"} ${url}`);
    if (success) ok++; else fail++;
  }

  console.log(`\nDone: ${ok} sent, ${fail} failed`);
  if (fail > 0) process.exit(1);
}

main().catch((err) => { console.error(err); process.exit(1); });
