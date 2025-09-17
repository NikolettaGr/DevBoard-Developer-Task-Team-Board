<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../lib/api'

type Team = { id: string; name: string; createdAt?: string }

const router = useRouter()
const teams = ref<Team[]>([])
const name = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

async function load() {
  try { teams.value = await api.listTeams() } catch (e:any) { error.value = e.message }
}
async function createTeam() {
  if (!name.value.trim()) return
  loading.value = true
  try {
    const t = await api.createTeam(name.value.trim())
    teams.value.unshift(t); name.value = ''
  } catch (e:any) { error.value = e.message } finally { loading.value = false }
}
onMounted(load)
</script>

<template>
  <main style="max-width:720px;margin:2rem auto">
    <h1>Teams</h1>
    <form @submit.prevent="createTeam" style="display:flex;gap:.5rem;margin:.75rem 0">
      <input v-model="name" placeholder="New team name" />
      <button :disabled="loading">{{ loading ? 'Creating...' : 'Create' }}</button>
    </form>
    <p v-if="error" style="color:red">{{ error }}</p>
    <ul>
      <li v-for="t in teams" :key="t.id">
        <a href="" @click.prevent="router.push(`/teams/${t.id}/boards`)">{{ t.name }}</a>
      </li>
    </ul>
  </main>
</template>
