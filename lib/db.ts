import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"
// @ts-ignore — Prisma 7 generated client
import { PrismaClient } from "./generated/prisma/client"

function createClient() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL! })
  const adapter = new PrismaPg(pool)
  // @ts-ignore
  return new PrismaClient({ adapter })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalForPrisma = globalThis as any
export const db = globalForPrisma.prisma ?? createClient()
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db
