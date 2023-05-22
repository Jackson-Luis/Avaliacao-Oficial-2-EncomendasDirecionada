<template>
  <router-view/>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
  async created() {
    console.log(sessionStorage.getItem('token'));
    if (sessionStorage.getItem('token') == null) {
      this.$router.push('/login');
    } else {
      if (!sessionStorage.getItem('token')) {
        this.$router.push('/login');
      }
      this.tokenVerificationInterval = setInterval(() => {
        if (this.verificarToken(this.decodificarToken()) === false) {
          this.$router.push('/login');
          sessionStorage.clear('token');
          clearInterval(this.tokenVerificationInterval);
        }
      }, 1000);
    }
  },
  computed: {
    rotaAcesso() {
      if (sessionStorage.getItem('token') !== null) {
        return false;
      }
      return true;
    },
  },
  methods: {
    verificarToken(token) {
      try {
        const expiracao = token.exp;
        const dataAtual = Math.floor(Date.now() / 1000);
        if (dataAtual > expiracao) {
          // Token expirado
          return false;
        }
        return true;
      } catch (error) {
        // Erro ao verificar o token
        return false;
      }
    },
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
