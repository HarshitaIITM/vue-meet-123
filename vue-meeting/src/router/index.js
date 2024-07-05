import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../routes/HomePage.vue'
import Room from '../routes/RoomPage.vue'
import CreateRoom from '../routes/CreateRoom.vue'

const routes = [
    {
      path: '/',
      name: 'Home',
      component: HomePage
    },
    {
      path: '/room',
      name: 'Room',
      component: Room
    },
    {
      path: '/host',
      name: 'CreateRoom',
      component: CreateRoom
    }
];

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
