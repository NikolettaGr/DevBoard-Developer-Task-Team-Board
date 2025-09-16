import { Hono } from 'hono'
import { prisma } from '../db.js'

const tasks = new Hono()

// POST /columns/:columnId/tasks { title, description? , order? }
tasks.post('/columns/:columnId/tasks', async (c) => {
  const columnId = c.req.param('columnId')
  const body = await c.req.json<{ title: string; description?: string; order?: number }>()
  const task = await prisma.task.create({ data: { columnId, title: body.title, description: body.description, order: body.order ?? 0 } })
  return c.json(task, 201)
})

// PATCH /tasks/:taskId { title?, description?, columnId?, order? }
tasks.patch('/tasks/:taskId', async (c) => {
  const id = c.req.param('taskId')
  const data = await c.req.json<Partial<{ title: string; description: string; columnId: string; order: number }>>()
  const task = await prisma.task.update({ where: { id }, data })
  return c.json(task)
})

// GET /boards/:boardId/tasks (flattened)
tasks.get('/boards/:boardId/tasks', async (c) => {
  const boardId = c.req.param('boardId')
  const list = await prisma.task.findMany({
    where: { column: { boardId } },
    orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
  })
  return c.json(list)
})

export default tasks
