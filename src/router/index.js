import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/songs',
      name: 'artists',
      component: () => import('@/views/ArtistsView.vue'),
    },
    {
      path: '/songs/:artistSlug',
      name: 'artist',
      component: () => import('@/views/ArtistView.vue'),
    },
    {
      path: '/songs/:artistSlug/:songId/:songSlug',
      name: 'song',
      component: () => import('@/views/SongView.vue'),
    },
    {
      path: '/add',
      name: 'song-new',
      component: () => import('@/views/SongFormView.vue'),
    },
    {
      path: '/edit/:id',
      name: 'song-edit',
      component: () => import('@/views/SongFormView.vue'),
    },
  ],
})

export default router
