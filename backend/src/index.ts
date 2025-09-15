import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const app = new Hono()

app.get('/', (c) => c.text('Hello from backend!'))

app.get('/health', async (c) => {
  const result = await prisma.$queryRawUnsafe('SELECT now()')
  const time = (result as { now: Date }[])[0]?.now ?? null

  return c.json({ ok: true, time })
})

// Start the server
serve({ fetch: app.fetch, port: 3000 })
console.log('🚀 Server running on http://localhost:3000')

