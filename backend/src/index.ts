import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { cors } from 'hono/cors'
import { prisma } from './db.js'
import teams from './routes/teams.js'
import boards from './routes/boards.js'
import columns from './routes/columns.js'
import tasks from './routes/tasks.js'

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

// /api
app.route('/api/teams', teams)
app.route('/api', boards)
app.route('/api', columns)
app.route('/api', tasks)

const port = Number(process.env.PORT) || 3000
serve({ fetch: app.fetch, port })
console.log(`🚀 Server running on http://localhost:${port}`)
