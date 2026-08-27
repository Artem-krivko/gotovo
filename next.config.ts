import type { NextConfig } from "next";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

// Путь к самому конфигу, а не к process.cwd(): cwd при загрузке конфига
// может отличаться, и тогда root уезжает в родительскую папку, ломая
// резолв tailwindcss и остальных зависимостей.
const projectRoot = dirname(fileURLToPath(import.meta.url));

// Заголовки безопасности для всего сайта.
// CSP основного приложения здесь намеренно не задаётся: inline-скрипты Next
// требуют nonce-пайплайна через middleware — это отдельная задача.
// Превью генератора при этом закрыто собственной строгой CSP
// (см. PREVIEW_CSP в lib/templates и app/api/design/[id]/route.ts).
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  // Из-за лишнего /Users/artem/package-lock.json Next выбирал корнем workspace
  // домашнюю папку и предупреждал об этом на каждом старте.
  turbopack: {
    root: projectRoot,
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
