import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/svgs',
    component: () => import('@/views/Svgs.vue')
  },
  {
    path: '/circle-d3',
    component: () => import('@/views/CircleDiagramm.vue')
  },
  {
    path: '/legend-circle',
    component: () => import('@/views/LegendCircle.vue')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
