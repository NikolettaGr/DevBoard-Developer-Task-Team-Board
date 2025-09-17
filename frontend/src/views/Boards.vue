<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from '../lib/api'

const props = defineProps<{ teamId: string }>()
type Board = { id: string; name: string }

const boards = ref<Board[]>([])
const name = ref(''); const error = ref<string | null>(null)

async function load() {
  try { boards.value = await api.listBoards(props.teamId) } catch (e:any) { error.value = e.message }
}
async function createBoard() {
  if (!name.value.trim()) return
  try {
    const b = await api.createBoard(props.teamId, name.value.trim())
    boards.value.unshift(b); name.value = ''
  } catch (e:any) { error.value = e.message }
}
onMounted(load)
</script>

<template>
  <main style="max-width:720px;margin:2rem auto">
    <h1>Boards</h1>
    <form @submit.prevent="createBoard" style="display:flex;gap:.5rem;margin:.75rem 0">
      <input v-model="name" placeholder="New board name" />
      <button>Create</button>
    </form>
    <p v-if="error" style="color:red">{{ error }}</p>
    <ul>
      <li v-for="b in boards" :key="b.id">
        <router-link :to="`/boards/${b.id}`">{{ b.name }}</router-link>
      </li>
    </ul>
  </main>
</template>

