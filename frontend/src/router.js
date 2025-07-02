import { createRouter, createWebHistory } from 'vue-router'
import Pacotes from './views/Pacotes.vue'
import Pessoas from './views/Pessoas.vue'
import Lojas from './views/Lojas.vue'

const routes = [
  { path: '/', redirect: '/pacotes' },
  { path: '/pacotes', component: Pacotes },
  { path: '/pessoas', component: Pessoas },
  { path: '/lojas', component: Lojas }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
