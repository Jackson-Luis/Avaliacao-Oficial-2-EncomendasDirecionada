const routes = [

  {
    path: '/',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      { path: '', name: 'login', component: () => import('pages/Login.vue') },
      { path: 'login', name: 'loginDefault', component: () => import('pages/Login.vue') },
    ],
  },

  {
    path: '/auth',
    component: () => import('layouts/InquilinoAutenticado.vue'),
    children: [
      { path: 'auth', name: 'auth', component: () => import('pages/Inquilino.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
