import { createRouter, createWebHistory } from 'vue-router'
import Pacotes from './views/Pacotes.vue'
import Pessoas from './views/Pessoas.vue'

const routes = [
  { path: '/', redirect: '/pacotes' },
  { path: '/pacotes', component: Pacotes },
  { path: '/pessoas', component: Pessoas }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
