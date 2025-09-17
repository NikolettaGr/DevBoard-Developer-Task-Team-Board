import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function run() {
  // Check if any team already exists
  const count = await prisma.team.count()
  if (count > 0) {
    console.log('🌱 Database already has data — skipping seed.')
    return
  }

  // Create Team
  const team = await prisma.team.create({ data: { name: 'Demo Team' } })

  // Create Board
  const board = await prisma.board.create({
    data: { name: 'Demo Board', teamId: team.id },
  })

  // Create Columns
  const todo = await prisma.column.create({
    data: { name: 'To Do', order: 1, boardId: board.id },
  })
  const doing = await prisma.column.create({
    data: { name: 'Doing', order: 2, boardId: board.id },
  })
  const done = await prisma.column.create({
    data: { name: 'Done', order: 3, boardId: board.id },
  })

  // Create Tasks
  await prisma.task.createMany({
    data: [
      { title: 'Set up repo', columnId: todo.id, order: 1 },
      { title: 'Create DB schema', columnId: doing.id, order: 1 },
      { title: 'Deploy', columnId: done.id, order: 1 },
    ],
  })

  console.log('✅ Seeded demo data 🚀')
}

run().finally(() => prisma.$disconnect())
