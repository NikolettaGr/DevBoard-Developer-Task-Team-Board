import { Hono } from 'hono'
import { prisma } from '../db.js'

const columns = new Hono()

// POST /boards/:boardId/columns { name, order }
columns.post('/boards/:boardId/columns', async (c) => {
  const boardId = c.req.param('boardId')
  const body = await c.req.json<{ name: string; order: number }>()
  const col = await prisma.column.create({ data: { boardId, name: body.name, order: body.order } })
  return c.json(col, 201)
})

// GET /boards/:boardId/columns
columns.get('/boards/:boardId/columns', async (c) => {
  const boardId = c.req.param('boardId')
  const cols = await prisma.column.findMany({ where: { boardId }, orderBy: { order: 'asc' } })
  return c.json(cols)
})

export default columns
