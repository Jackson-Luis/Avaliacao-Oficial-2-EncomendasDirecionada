<template>
  <q-page padding>
    <q-form class="absolute-center" rounded @submit.prevent="login">
        <img style="margin:auto" src="../assets/Logo-marca.svg"/>
      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">
        <q-input
        label="EMAIL"
        color="green"
        v-model="email"
        outlined
        type="email"
        bg-color="white"
        />
        <q-input
        label="Chave de acesso"
        color="green"
        v-model="senha"
        type="password"
        outlined
        bg-color="white"
        />
        <div class="full-width q-pt-md" >
          <q-btn
            label="Login"
            color="dark"
            class="full-width"
            outlined
            rounded
            size="lg"
            type="submit"
          />
        </div>
      </div>
    </q-form>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';
import axios from 'axios';

export default defineComponent({
  name: 'MainLayout',
  data() {
    return {
      email: '',
      senha: '',
    };
  },
  methods: {
    async login(email, senha) {
      if (email !== '' && senha !== '') {
        const response = await axios.post('http://localhost:3000/usuarios', { email: this.email, senha: this.senha });
        // eslint-disable-next-line no-console
        console.log(response.data); // Autenticação bem-sucedida
        if (response.data.token) {
          this.$router.push({ name: 'auth' });
          sessionStorage.setItem('token', response.data.token);
          // eslint-disable-next-line no-console
          console.log('SUCCESS');
        } else {
          // eslint-disable-next-line no-console, no-alert
          alert('Autenticação não efetuada, Email ou senha incorreta');
        }
      }
    },
  },
});
</script>
