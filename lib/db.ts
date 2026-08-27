import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "./generated/prisma/client"

// Пул создаётся лениво: раньше `process.env.DATABASE_URL!` вычислялся при
// импорте модуля, поэтому отсутствие переменной роняло любой маршрут,
// который просто импортировал db — даже если обращения к БД в нём не было.
function createClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error("DATABASE_URL не задан")
  }
  const pool = new Pool({ connectionString })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient
}

/**
 * Прокси вместо готового клиента: соединение поднимается при первом реальном
 * обращении, а не при импорте. Если DATABASE_URL нет, ошибка возникнет внутри
 * try/catch вызывающего маршрута — а маршруты генерации и заявок именно так
 * и написаны, чтобы сбой БД не уничтожал результат.
 */
export const db: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const client = (globalForPrisma.prisma ??= createClient())
    const value = Reflect.get(client, prop, receiver)
    return typeof value === "function" ? value.bind(client) : value
  },
})
