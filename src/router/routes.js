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
        component: () => import('../pages/Inquilino/historico.vue'),
      },
      {
        path: 'pendente',
        name: 'pendente-inquilino',
        component: () => import('../pages/Inquilino/pendente.vue'),
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
        component: () => import('../pages/porteiro/index.vue'),
      },
      {
        path: 'encomendas',
        name: 'Encomendas-porteiro',
        component: () => import('../pages/encomendas/Encomendas.vue'),
      },
      {
        path: 'encomendas',
        name: 'Encomendas-porteiro',
        component: () => import('../pages/encomendas/Encomendas.vue'),
      },
      {
        path: 'encomendas/create',
        name: 'EncomendasCreate-porteiro',
        component: () => import('../pages/encomendas/CadastrarEncomenda.vue'),
      },
      {
        path: 'encomendas/:id',
        name: 'EncomendasEdit-porteiro',
        component: () => import('../pages/encomendas/EditarEncomenda.vue'),
      },
      {
        path: 'apartamentos',
        name: 'Apartamentos-porteiro',
        component: () => import('../pages/apartamentos/Apartamentos.vue'),
      },
      {
        path: 'apartamentos/create',
        name: 'ApartamentosCreate-porteiro',
        component: () => import('../pages/apartamentos/CadastrarApartamentos.vue'),
      },
      {
        path: 'apartamentos/:id',
        name: 'ApartamentosEdit-porteiro',
        component: () => import('../pages/apartamentos/EditarApartamentos.vue'),
      },
      {
        path: 'usuarios',
        name: 'Usuarios-porteiro',
        component: () => import('../pages/usuarios/Usuarios.vue'),
      },
      {
        path: 'usuarios/create',
        name: 'UsuarioCreate-porteiro',
        component: () => import('../pages/usuarios/CadastrarUsuario.vue'),
      },
      {
        path: '/usuarios/:id',
        name: 'UsuarioEdit-porteiro',
        component: () => import('../pages/usuarios/EditarUsuario.vue'),
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
        path: 'encomendas',
        name: 'Encomendas-sindico',
        component: () => import('../pages/encomendas/Encomendas.vue'),
      },
      {
        path: 'encomendas/create',
        name: 'EncomendasCreate-sindico',
        component: () => import('../pages/encomendas/CadastrarEncomenda.vue'),
      },
      {
        path: 'encomendas/:id',
        name: 'EncomendasEdit-sindico',
        component: () => import('../pages/encomendas/EditarEncomenda.vue'),
      },
      {
        path: 'apartamentos',
        name: 'Apartamentos-sindico',
        component: () => import('../pages/apartamentos/Apartamentos.vue'),
      },
      {
        path: 'apartamentos/create',
        name: 'ApartamentosCreate-sindico',
        component: () => import('../pages/apartamentos/CadastrarApartamentos.vue'),
      },
      {
        path: 'apartamentos/:id',
        name: 'ApartamentosEdit-sindico',
        component: () => import('../pages/apartamentos/EditarApartamentos.vue'),
      },
      {
        path: 'usuarios',
        name: 'Usuarios-sindico',
        component: () => import('../pages/usuarios/Usuarios.vue'),
      },
      {
        path: 'usuarios/create',
        name: 'UsuarioCreate-sindico',
        component: () => import('../pages/usuarios/CadastrarUsuario.vue'),
      },
      {
        path: '/usuarios/:id',
        name: 'UsuarioEdit-sindico',
        component: () => import('../pages/usuarios/EditarUsuario.vue'),
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
