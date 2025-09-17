export type Team = { id: string; name: string; createdAt: string }
export type Board = { id: string; name: string; teamId: string; createdAt: string }
export type Column = { id: string; name: string; order: number; boardId: string }
export type Task = { id: string; title: string; columnId: string; order: number; description?: string }

const API = import.meta.env.VITE_API_URL as string

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
  if (!res.ok) throw new Error(await res.text().catch(() => `HTTP ${res.status}`))
  return res.json() as Promise<T>
}

export const api = {
  // Teams
  listTeams: (): Promise<Team[]> => request<Team[]>('/api/teams'),
  createTeam: (name: string): Promise<Team> =>
    request<Team>('/api/teams', { method: 'POST', body: JSON.stringify({ name }) }),

  // Boards
  listBoards: (teamId: string): Promise<Board[]> =>
    request<Board[]>(`/api/teams/${teamId}/boards`),
  createBoard: (teamId: string, name: string): Promise<Board> =>
    request<Board>(`/api/teams/${teamId}/boards`, {
      method: 'POST',
      body: JSON.stringify({ name }),
    }),

  // Columns
  listColumns: (boardId: string): Promise<Column[]> =>
    request<Column[]>(`/api/boards/${boardId}/columns`),
  createColumn: (boardId: string, name: string, order: number): Promise<Column> =>
    request<Column>(`/api/boards/${boardId}/columns`, {
      method: 'POST',
      body: JSON.stringify({ name, order }),
    }),

  // Tasks
  listTasks: (boardId: string): Promise<Task[]> =>
    request<Task[]>(`/api/boards/${boardId}/tasks`),
  createTask: (columnId: string, title: string): Promise<Task> =>
    request<Task>(`/api/columns/${columnId}/tasks`, {
      method: 'POST',
      body: JSON.stringify({ title }),
    }),
}
