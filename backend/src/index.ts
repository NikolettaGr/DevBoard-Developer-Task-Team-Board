import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { cors } from 'hono/cors'
import { prisma } from './db.js'

const app = new Hono()

app.use('*', cors({
  origin: '*',
  allowMethods: ['GET','POST','PATCH','DELETE','OPTIONS'],
  allowHeaders: ['Content-Type','Authorization']
}))

app.get('/', (c) => c.text('Hello from backend!'))

app.get('/health', async (c) => {
  const result = await prisma.$queryRawUnsafe('SELECT now()')
  const time = (result as { now: Date }[])[0]?.now ?? null
  return c.json({ ok: true, time })
})

const port = Number(process.env.PORT) || 3000
serve({ fetch: app.fetch, port })
console.log(`🚀 Server running on http://localhost:${port}`)
