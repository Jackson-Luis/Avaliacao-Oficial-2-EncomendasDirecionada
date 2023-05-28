<template>
  <q-page>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  async created() {
    if (this.decodificarToken().tipoUsuario === this.$route.name) {
      this.$router.push({ name: 'Encomendas-porteiro' });
    }
  },
  methods: {
    decodificarToken() {
      const tokenUsuario = sessionStorage.getItem('token');
      if (tokenUsuario == null) {
        this.$router.push('/login');
        sessionStorage.clear('token');
        return null;
      }
      const tokenParts = tokenUsuario.split('.');
      const encodedPayload = tokenParts[1];
      const decodedPayload = decodeURIComponent(
        window.atob(encodedPayload)
          .split('')
          .map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
          .join(''),
      );
      return JSON.parse(decodedPayload);
    },
  },
});
</script>

<style>

</style>
