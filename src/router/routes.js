const routes = [

  {
    path: '/login',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      { path: '', name: 'Login-usuario', component: () => import('pages/Login.vue') },
    ],
  },

  {
    path: '/inquilino',
    component: () => import('layouts/InquilinoAutenticado.vue'),
    children: [
      { path: 'index', name: 'inquilino', component: () => import('src/pages/Inquilino/index.vue') },
      { path: 'encomendas', name: 'Encomendas-inquilino', component: () => import('src/pages/Encomendas.vue') },
    ],
  },
  {
    path: '/porteiro',
    component: () => import('layouts/PorteiroAutenticado.vue'),
    children: [
      { path: 'index', name: 'porteiro', component: () => import('src/pages/Porteiro/index.vue') },
      { path: 'encomendas', name: 'Encomendas-porteiro', component: () => import('src/pages/Encomendas.vue') },
      { path: 'apartamentos', name: 'Apartamentos-porteiro', component: () => import('src/pages/Apartamentos.vue') },
      { path: 'usuarios', name: 'Usuarios-porteiro', component: () => import('src/pages/Usuarios.vue') },
    ],
  },
  {
    path: '/sindico',
    component: () => import('layouts/SindicoAutenticado.vue'),
    children: [
      { path: 'index', name: 'sindico', component: () => import('src/pages/Sindico/index.vue') },
      { path: 'encomendas', name: 'Encomendas-sindico', component: () => import('src/pages/Encomendas.vue') },
      { path: 'apartamentos', name: 'Apartamentos-sindico', component: () => import('src/pages/Apartamentos.vue') },
      { path: 'usuarios', name: 'Usuarios-sindico', component: () => import('src/pages/Usuarios.vue') },
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
