<!-- eslint-disable linebreak-style -->
<!-- eslint-disable no-restricted-globals -->
<template>
  <q-layout view="hHh lpR fFf">

    <q-header reveal bordered class="text-white"
    style="background-color: #6cac2c;" height-hint="98">
      <q-toolbar>
        <q-toolbar-title>
          <img style="margin:auto; width: 100px;display: flex;" src="../assets/Logo-marca.svg" />
        </q-toolbar-title>
      </q-toolbar>

      <q-tabs align="left">
        <q-route-tab to="/sindico/encomendas" label="Encomendas" />
        <q-route-tab to="/sindico/apartamentos" label="Apartamento" />
        <q-route-tab to="/sindico/usuarios" label="Usuarios" />
      </q-tabs>
    </q-header>

    <q-page-container>
      <suspense>
        <router-view />
      </suspense>
    </q-page-container>

  </q-layout>
</template>
<!-- eslint-disable linebreak-style -->
<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'sindico',
  setup() {
    return {
    };
  },
  data() {
    return {
      layout: 'sindico',
    };
  },
  created() {
    if (sessionStorage.getItem('token') === null) {
      this.$router.push('/login');
    }
    if (this.decodificarToken().tipoUsuario !== this.layout) {
      this.$router.back();
    }
  },
  methods: {
    decodificarToken() {
      const tokenUsuario = sessionStorage.getItem('token');
      const tokenParts = tokenUsuario.split('.');
      const encodedPayload = tokenParts[1];
      const decodedPayload = decodeURIComponent(window.atob(encodedPayload).split('').map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`).join(''));
      return JSON.parse(decodedPayload);
    },
  },
});
</script>
