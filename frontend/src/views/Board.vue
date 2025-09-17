<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from '../lib/api'

const props = defineProps<{ boardId: string }>()
type Column = { id: string; name: string; order: number }
type Task = { id: string; title: string; columnId: string; order: number }

const cols = ref<Column[]>([])
const tasks = ref<Task[]>([])
const newColName = ref('')
const newTaskTitle = ref<Record<string, string>>({}) // keyed by columnId

async function load() {
  cols.value = await api.listColumns(props.boardId)
  tasks.value = await api.listTasks(props.boardId)
}
async function addColumn() {
  const last = cols.value.length ? cols.value[cols.value.length - 1] : undefined
  const order = (last?.order ?? 0) + 1

  const col = await api.createColumn(props.boardId, newColName.value.trim(), order)
  cols.value.push(col)
  newColName.value = ''
}
async function addTask(colId: string) {
  const title = (newTaskTitle.value[colId] || '').trim()
  if (!title) return
  const t = await api.createTask(colId, title)
  tasks.value.push(t)
  newTaskTitle.value[colId] = ''
}
function tasksIn(colId: string) {
  return tasks.value.filter(t => t.columnId === colId).sort((a,b)=>a.order-b.order)
}
onMounted(load)
</script>

<template>
  <main style="max-width:1100px;margin:2rem auto">
    <h1>Board</h1>

    <div style="display:flex;gap:.5rem;margin:.75rem 0">
      <input v-model="newColName" placeholder="New column name" />
      <button @click="addColumn">Add Column</button>
    </div>

    <section style="display:flex;gap:1rem;align-items:flex-start">
      <div v-for="c in cols" :key="c.id" style="flex:1;border:1px solid #eee;padding:.75rem;border-radius:.5rem">
        <h3>{{ c.name }}</h3>

        <ul style="list-style:none;padding:0;margin:0 0 .5rem 0">
          <li v-for="t in tasksIn(c.id)" :key="t.id"
              style="border:1px solid #ddd;padding:.5rem;border-radius:.5rem;margin-bottom:.5rem">
            {{ t.title }}
          </li>
        </ul>

        <form @submit.prevent="addTask(c.id)" style="display:flex;gap:.5rem">
          <input v-model="newTaskTitle[c.id]" placeholder="New task title" />
          <button>Add</button>
        </form>
      </div>
    </section>
  </main>
</template>
