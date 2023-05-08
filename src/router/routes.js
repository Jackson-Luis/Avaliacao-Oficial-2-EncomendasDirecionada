/* eslint-disable linebreak-style */
const routes = [
  {
    path: '/login',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      {
        path: '',
        name: 'Login-usuario',
        component: () => import('pages/Login.vue'),
      },
    ],
  },

  {
    path: '/inquilino',
    component: () => import('layouts/InquilinoAutenticado.vue'),
    children: [
      {
        path: 'index',
        name: 'inquilino',
        component: () => import('../pages/Inquilino/index.vue'),
      },
      {
        path: 'encomendas',
        name: 'Encomendas-inquilino',
        component: () => import('../pages/encomendas/Encomendas.vue'),
      },
      {
        path: 'historico',
        name: 'Historico-inquilino',
        component: () => import('../pages/inquilino/historico.vue'),
      },
      {
        path: 'pendente',
        name: 'pendente-inquilino',
        component: () => import('../pages/inquilino/pendente.vue'),
      },
    ],
  },
  {
    path: '/porteiro',
    component: () => import('layouts/PorteiroAutenticado.vue'),
    children: [
      {
        path: 'index',
        name: 'porteiro',
        component: () => import('../pages/Porteiro/index.vue'),
      },
      {
        path: 'encomendas',
        name: 'Encomendas-porteiro',
        component: () => import('../pages/encomendas/Encomendas.vue'),
      },
      {
        path: 'apartamentos',
        name: 'Apartamentos-porteiro',
        component: () => import('../pages/apartamentos/Apartamentos.vue'),
      },
      {
        path: 'usuarios',
        name: 'Usuarios-porteiro',
        component: () => import('../pages/usuarios/Usuarios.vue'),
      },
    ],
  },
  {
    path: '/sindico',
    component: () => import('layouts/SindicoAutenticado.vue'),
    children: [
      {
        path: 'index',
        name: 'sindico',
        component: () => import('../pages/Sindico/index.vue'),
      },
      {
        path: 'encomendas',
        name: 'Encomendas-sindico',
        component: () => import('../pages/encomendas/Encomendas.vue'),
      },
      {
        path: 'apartamentos',
        name: 'Apartamentos-sindico',
        component: () => import('../pages/apartamentos/Apartamentos.vue'),
      },
      {
        path: 'usuarios',
        name: 'Usuarios-sindico',
        component: () => import('../pages/usuarios/Usuarios.vue'),
      },
    ],
  },
  {
    path: '/cadastrarEncomendas',
    component: () => import('layouts/CadastrarEncomendas.vue'),
    children: [
      { path: '', name: 'CadastroEncomendas-sindico', component: () => import('src/pages/CadastrarEncomendas.vue') },
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
