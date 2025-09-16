import { Hono } from 'hono'
import { prisma } from '../db.js'

const teams = new Hono()

// GET /teams - list all teams
teams.get('/', async (c) => {
  const allTeams = await prisma.team.findMany({ orderBy: { createdAt: 'desc' } })
  return c.json(allTeams)
})

// POST /teams - create new teams
teams.post('/', async (c) => {
  const body = await c.req.json<{ name: string }>()
  const team = await prisma.team.create({ data: {name: body.name} })
  return c.json(team, 201)
})

export default teams
