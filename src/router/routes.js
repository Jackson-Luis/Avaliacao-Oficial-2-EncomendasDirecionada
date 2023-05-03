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
        component: () => import('src/pages/Inquilino/index.vue'),
      },
      {
        path: 'encomendas',
        name: 'Encomendas-inquilino',
        component: () => import('src/pages/encomendas/Encomendas.vue'),
      },
      {
        path: 'historico',
        name: 'Historico-inquilino',
        component: () => import('src/pages/inquilino/historico.vue')
      },
      { path: 'pendente',
        name: 'pendente-inquilino',
        component: () => import('src/pages/inquilino/pendente.vue')
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
        component: () => import('src/pages/Porteiro/index.vue'),
      },
      {
        path: 'encomendas',
        name: 'Encomendas-porteiro',
        component: () => import('src/pages/encomendas/Encomendas.vue'),
      },
      {
        path: 'apartamentos',
        name: 'Apartamentos-porteiro',
        component: () => import('src/pages/apartamentos/Apartamentos.vue'),
      },
      {
        path: 'usuarios',
        name: 'Usuarios-porteiro',
        component: () => import('src/pages/usuarios/Usuarios.vue'),
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
        component: () => import('src/pages/Sindico/index.vue'),
      },
      {
        path: 'encomendas',
        name: 'Encomendas-sindico',
        component: () => import('src/pages/encomendas/Encomendas.vue'),
      },
      {
        path: 'apartamentos',
        name: 'Apartamentos-sindico',
        component: () => import('src/pages/apartamentos/Apartamentos.vue'),
      },
      {
        path: 'usuarios',
        name: 'Usuarios-sindico',
        component: () => import('src/pages/usuarios/Usuarios.vue'),
      },
      {
        path: 'usuarios/create',
        name: 'UsuarioCreate-sindico',
        component: () => import('src/pages/usuarios/UsuarioCreate.vue'),
      },
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
