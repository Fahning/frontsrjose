
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '/atender', component: () => import('pages/Index.vue')
      },
      {
        path: '/cardapio', component: () => import('pages/Cardapio.vue')
      },
      {
        path: '/', component: () => import('pages/Dashboard.vue')
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
