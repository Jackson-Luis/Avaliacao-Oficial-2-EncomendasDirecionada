<template>
  <q-page class="login-container">
    <q-card class="login-card">
      <q-card-section>
        <h2 class="text-h6">Login</h2>
      </q-card-section>

      <q-card-section>
        <q-form @submit="login">
          <q-input
            outlined
            v-model="email"
            label="Email"
            type="email"
            required
          ></q-input>

          <q-input
            outlined
            v-model="password"
            label="Password"
            type="password"
            required
          ></q-input>

          <q-btn
            color="primary"
            label="Login"
            type="submit"
            class="q-mt-md"
          ></q-btn>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MainLayout',
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    login() {
      // Lógica de autenticação aqui
    },
  },
});
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.login-card {
  max-width: 400px;
  padding: 20px;
  text-align: center;
}
</style>
