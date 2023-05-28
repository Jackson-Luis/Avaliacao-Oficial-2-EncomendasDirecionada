<template>
  <q-layout view="hHh lpR fFf">
    <q-header reveal bordered class="text-white"
    style="background-color: #6cac2c;" height-hint="98">
      <q-toolbar>
          <div class="header-logo">
            <img style="margin:auto; width: 100px;display: flex;" src="../assets/Logo-marca.svg" />
          </div>
          <q-btn flat round dense>
          <q-icon name="person" color="white"/>
          {{ nomeUsuario }}
        </q-btn>
            <q-btn color="primary" flat round dense @click="exibirDialogoSair">
              <q-icon name="exit_to_app" color="white" />
            </q-btn>
      </q-toolbar>

      <q-tabs align="center">
        <q-route-tab to="/sindico/encomendas" label="Encomendas" />
        <q-route-tab to="/sindico/apartamentos" label="Apartamento" />
        <q-route-tab to="/sindico/usuarios" label="Usuários" />
      </q-tabs>
    </q-header>

    <q-page-container align="center">
      <suspense>
        <router-view />
      </suspense>
    </q-page-container>

    <q-dialog v-model="mostrarDialogoSair" persistent>
      <q-card>
        <q-card-section>
          <q-card-title class="text-primary">Confirmar saída</q-card-title>
          <q-card-main>
            <p>Tem certeza de que deseja sair do sistema?</p>
          </q-card-main>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Cancelar" color="primary" flat @click="fecharDialogoSair" />
          <q-btn label="Sair" color="primary" @click="sairDoSistema" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'sindico',
  setup() {
    return {};
  },
  data() {
    return {
      layout: 'sindico',
      mostrarDialogoSair: false,
      nomeUsuario: '',
    };
  },
  created() {
    console.log(this.decodificarToken().tipoUsuario);
    if (sessionStorage.getItem('token') === null) {
      this.$router.push('/login');
    }
    if (this.decodificarToken() !== null && this.decodificarToken().tipoUsuario !== this.layout) {
      this.$router.push({ name: `${this.decodificarToken().tipoUsuario}` });
    }
    this.obtemNomeUsuario();
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
    exibirDialogoSair() {
      this.mostrarDialogoSair = true;
    },
    fecharDialogoSair() {
      this.mostrarDialogoSair = false;
    },
    sairDoSistema() {
      // Lógica para realizar o logout ou redirecionar para a página de login
      sessionStorage.removeItem('token');

      // Exemplo de redirecionamento para a página de login:
      this.$router.push('/login');
    },
    obtemNomeUsuario() {
      const token = this.decodificarToken();
      this.nomeUsuario = token.usuario;
    },
  },
});
</script>

<style scoped>
.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-logo {
  flex: 1;
  display: flex;
  align-items: center;
}

.header-button {
  margin-left: 10px;
}
</style>
