import { Hono } from 'hono'
import { prisma } from '../db.js'

const boards = new Hono()

// GET /teams/:teamId/boards
boards.get('/teams/:teamId/boards', async (c) => {
  const teamId = c.req.param('teamId')
  const list = await prisma.board.findMany({ where: { teamId }, orderBy: { createdAt: 'desc' } })
  return c.json(list)
})

// POST /teams/:teamId/boards { name }
boards.post('/teams/:teamId/boards', async (c) => {
  const teamId = c.req.param('teamId')
  const body = await c.req.json<{ name: string }>()
  const board = await prisma.board.create({ data: { teamId, name: body.name } })
  return c.json(board, 201)
})

export default boards
