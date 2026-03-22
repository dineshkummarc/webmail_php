const routes = [
  {
    component: () => import('src/pages/AppNotLoaded.vue'),
    name: 'app-not-loaded',
    path: '/app-not-loaded',
  },
]

export default routes
