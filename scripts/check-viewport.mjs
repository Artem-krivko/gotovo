// scripts/check-viewport.mjs — проверка превью на desktop и mobile.
//
// Ловит то, что нельзя увидеть анализом строки HTML: горизонтальное
// переполнение, съехавшую вёрстку и элементы шире вьюпорта. Именно такие
// дефекты делают результат «непрофессиональным» на телефоне, где его и
// смотрит большинство пользователей.
//
// Запуск:
//   node scripts/check-viewport.mjs <путь-к-html> [ещё файлы...]
//
// Использует headless Chrome через DevTools Protocol. Никаких зависимостей:
// WebSocket есть в Node 22+ нативно.

import { spawn } from "node:child_process"
import { existsSync, writeFileSync } from "node:fs"
import { basename, join, resolve } from "node:path"

const CHROME_CANDIDATES = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
]

const VIEWPORTS = [
  { name: "mobile", width: 390, height: 844 },
  { name: "desktop", width: 1280, height: 900 },
]

function findChrome() {
  const fromEnv = process.env.CHROME_PATH
  if (fromEnv && existsSync(fromEnv)) return fromEnv
  return CHROME_CANDIDATES.find((p) => existsSync(p)) ?? null
}

async function waitForDevTools(port, timeoutMs = 15000) {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/version`)
      if (res.ok) return (await res.json()).webSocketDebuggerUrl
    } catch {
      // Chrome ещё не поднялся — пробуем снова.
    }
    await new Promise((r) => setTimeout(r, 150))
  }
  throw new Error("Chrome не поднял DevTools за отведённое время")
}

/** Минимальный CDP-клиент поверх нативного WebSocket. */
function createClient(wsUrl) {
  const ws = new WebSocket(wsUrl)
  const pending = new Map()
  let nextId = 1

  const ready = new Promise((resolveReady, rejectReady) => {
    ws.addEventListener("open", () => resolveReady())
    ws.addEventListener("error", (e) => rejectReady(new Error(`WebSocket: ${e.message ?? "ошибка"}`)))
  })

  ws.addEventListener("message", (event) => {
    const msg = JSON.parse(event.data)
    const entry = pending.get(msg.id)
    if (!entry) return
    pending.delete(msg.id)
    if (msg.error) entry.reject(new Error(msg.error.message))
    else entry.resolve(msg.result)
  })

  return {
    ready,
    send(method, params = {}, sessionId) {
      const id = nextId++
      return new Promise((res, rej) => {
        pending.set(id, { resolve: res, reject: rej })
        ws.send(JSON.stringify({ id, method, params, sessionId }))
      })
    },
    close: () => ws.close(),
  }
}

/**
 * Скрипт исполняется В СТРАНИЦЕ. Ищем не «что-то сломалось», а конкретно:
 * документ шире вьюпорта и какие элементы за него вылезают.
 */
const PROBE = `(() => {
  const vw = document.documentElement.clientWidth;
  const scrollWidth = document.documentElement.scrollWidth;
  const offenders = [];
  for (const el of document.querySelectorAll("body *")) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    const overflowRight = Math.round(r.right - vw);
    if (overflowRight > 1) {
      offenders.push({
        tag: el.tagName.toLowerCase(),
        cls: (el.className && typeof el.className === "string" ? el.className : "").slice(0, 60),
        width: Math.round(r.width),
        right: Math.round(r.right),
        over: overflowRight,
      });
    }
  }
  offenders.sort((a, b) => b.over - a.over);
  const h1 = document.querySelector("h1");
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && s.display !== "none" && s.visibility !== "hidden";
  };
  const smallText = [...document.querySelectorAll("p,li,a,button")].filter((el) => {
    if (!visible(el) || el.classList.contains("credit")) return false;
    return parseFloat(getComputedStyle(el).fontSize) < 11;
  }).length;
  const smallTargets = [...document.querySelectorAll(".btn,.site-phone,summary")].filter((el) => {
    if (!visible(el) || el.classList.contains("credit")) return false;
    const r = el.getBoundingClientRect();
    return r.width < 40 || r.height < 40;
  }).length;
  const heroImage = document.querySelector(".hero-img,.hero-bg");
  const collapsedSections = [...document.querySelectorAll("section")].filter((el) => {
    if (!visible(el)) return false;
    return el.getBoundingClientRect().height < 40;
  }).length;
  return JSON.stringify({
    vw,
    scrollWidth,
    overflow: scrollWidth - vw,
    offenders: offenders.slice(0, 6),
    h1Height: h1 ? Math.round(h1.getBoundingClientRect().height) : 0,
    viewportHeight: window.innerHeight,
    smallText,
    smallTargets,
    collapsedSections,
    heroNaturalWidth: heroImage instanceof HTMLImageElement ? heroImage.naturalWidth : null,
    ctaInViewport: (() => {
      const cta = document.querySelector(".hero-cta a");
      if (!cta) return null;
      return Math.round(cta.getBoundingClientRect().top) < window.innerHeight;
    })(),
  });
})()`

async function checkFile(client, sessionId, fileUrl) {
  const results = []

  for (const vp of VIEWPORTS) {
    await client.send(
      "Emulation.setDeviceMetricsOverride",
      { width: vp.width, height: vp.height, deviceScaleFactor: 1, mobile: vp.name === "mobile" },
      sessionId
    )
    await client.send("Page.navigate", { url: fileUrl }, sessionId)
    // Ждём стабилизации layout: шрифты подгружаются асинхронно.
    await new Promise((r) => setTimeout(r, 900))

    const { result } = await client.send(
      "Runtime.evaluate",
      { expression: PROBE, returnByValue: true },
      sessionId
    )
    results.push({ viewport: vp.name, ...JSON.parse(result.value) })

    if (process.env.SCREENSHOT_DIR) {
      const shot = await client.send(
        "Page.captureScreenshot",
        { format: "png", captureBeyondViewport: false },
        sessionId
      )
      const name = basename(fileUrl).replace(/\.html$/, "")
      const out = join(process.env.SCREENSHOT_DIR, `${name}-${vp.name}.png`)
      writeFileSync(out, Buffer.from(shot.data, "base64"))
      console.log(`      скриншот: ${out}`)
    }
  }

  return results
}

async function main() {
  const files = process.argv.slice(2)
  if (files.length === 0) {
    console.error("Укажите хотя бы один HTML-файл")
    process.exit(2)
  }

  const chromePath = findChrome()
  if (!chromePath) {
    console.error("Chrome не найден. Задайте CHROME_PATH.")
    process.exit(2)
  }

  const port = 9222 + Math.floor(Math.random() * 400)
  const chrome = spawn(
    chromePath,
    [
      "--headless=new",
      "--disable-gpu",
      "--no-first-run",
      "--hide-scrollbars",
      `--remote-debugging-port=${port}`,
      `--user-data-dir=/tmp/gotovo-viewport-check-${port}`,
      "about:blank",
    ],
    { stdio: "ignore" }
  )

  let failed = false
  try {
    const wsUrl = await waitForDevTools(port)
    const client = createClient(wsUrl)
    await client.ready

    const { targetId } = await client.send("Target.createTarget", { url: "about:blank" })
    const { sessionId } = await client.send("Target.attachToTarget", { targetId, flatten: true })
    await client.send("Page.enable", {}, sessionId)

    for (const file of files) {
      const url = `file://${resolve(file)}`
      console.log(`\n${file}`)
      const results = await checkFile(client, sessionId, url)

      for (const r of results) {
        const label = `  ${r.viewport.padEnd(8)} ${r.vw}px`
        if (r.overflow > 1) {
          failed = true
          console.log(`${label}  ❌ горизонтальное переполнение: +${r.overflow}px`)
          for (const o of r.offenders) {
            console.log(`      ${o.tag}.${o.cls || "(без класса)"} — ширина ${o.width}px, вылезает на ${o.over}px`)
          }
        } else {
          console.log(`${label}  ✅ переполнения нет`)
        }

        // Заголовок выше половины экрана вытесняет CTA за первый экран.
        if (r.h1Height > r.viewportHeight * 0.55) {
          failed = true
          console.log(
            `      ❌ h1 занимает ${r.h1Height}px из ${r.viewportHeight}px — CTA уходит за первый экран`
          )
        }
        if (r.ctaInViewport === false) {
          failed = true
          console.log(`      ❌ кнопка CTA не попадает в первый экран`)
        }
        if (r.smallText > 0) {
          failed = true
          console.log(`      ❌ найдено слишком мелких текстов: ${r.smallText}`)
        }
        if (r.smallTargets > 0) {
          failed = true
          console.log(`      ❌ интерактивных целей меньше 40px: ${r.smallTargets}`)
        }
        if (r.collapsedSections > 0) {
          failed = true
          console.log(`      ❌ подозрительно схлопнутых секций: ${r.collapsedSections}`)
        }
        if (r.heroNaturalWidth !== null && r.heroNaturalWidth < 800) {
          failed = true
          console.log(`      ❌ hero-изображение загружено только в ${r.heroNaturalWidth}px`)
        }
      }
    }

    client.close()
  } finally {
    chrome.kill()
  }

  process.exit(failed ? 1 : 0)
}

main().catch((e) => {
  console.error(e)
  process.exit(2)
})
