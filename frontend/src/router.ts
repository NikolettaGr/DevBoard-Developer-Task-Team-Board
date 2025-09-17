import { createRouter, createWebHistory } from 'vue-router'
import Teams from './views/Teams.vue'
import Boards from './views/Boards.vue'
import Board from './views/Board.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/teams' },
    { path: '/teams', component: Teams },
    { path: '/teams/:teamId/boards', component: Boards, props: true },
    { path: '/boards/:boardId', component: Board, props: true },
  ],
})
