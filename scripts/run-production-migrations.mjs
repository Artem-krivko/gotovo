import { execFileSync } from "node:child_process"

if (process.env.VERCEL_ENV === "production") {
  for (const file of [
    "prisma/migrations/20260831110000_add_order_attribution/migration.sql",
    "prisma/migrations/20260901120000_add_order_qualification/migration.sql",
  ]) {
    execFileSync("prisma", ["db", "execute", "--file", file], { stdio: "inherit" })
  }
}
