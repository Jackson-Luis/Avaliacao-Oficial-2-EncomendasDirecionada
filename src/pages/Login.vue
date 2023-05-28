<!-- eslint-disable max-len -->
<template>
  <q-page padding style="background-color: #6cac2c">
    <q-form class="absolute-center" rounded @submit.prevent="login">
      <img style="margin: auto" src="../assets/Logo-marca.svg" />
      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">
        <q-input @keyup="removeErro()" label="CPF" color="green" v-model="cpf" outlined bg-color="white"
          :rules="[(val) => (val && val.length > 0) || 'O Campo é obrigatório']" />
        <q-input v-if="!sindicoporteiro" @keyup="removeErro()" label="Digite o número do apartamento" color="green"
          v-model="apartamento" outlined bg-color="white" :rules="[
            (val) => (val && val.length > 0) || 'O Campo é obrigatório',
            (val) =>
              (val && val.length <= 4) || 'Número de apartamento inválido',
          ]" :type="ehsenha ? 'password' : 'text'">
          <template v-slot:append>
            <q-icon :name="ehsenha ? 'visibility_off' : 'visibility'" class="cursor-pointer"
              @click="ehsenha = !ehsenha" />
          </template>
        </q-input>
        <q-input v-else @keyup="removeErro()" label="Digite a chave de acesso" color="green" v-model="chaveacesso"
          outlined bg-color="white" :rules="[(val) => (val && val.length > 0) || 'O Campo é obrigatório']"
          :type="ehsenha ? 'password' : 'text'">
          <template v-slot:append>
            <q-icon :name="ehsenha ? 'visibility_off' : 'visibility'" class="cursor-pointer"
              @click="ehsenha = !ehsenha" />
          </template>
        </q-input>
        <div class="q-mb-md">
          <q-card class="alert-card" v-if="alertaError">
            <q-card-section class="alert-card__content">
              <q-icon name="warning" class="alert-card__icon" />
              <p class="alert-card__message">
                CPF, chave de acesso ou numero do apartamento inválidos
              </p>
            </q-card-section>
          </q-card>
        </div>
        <q-toggle class="text-h5" v-model="sindicoporteiro" label="Acesso Sindico/Porteiro" @click="limparChave" />
        <div class="full-width q-pt-md">
          <q-btn label="Entrar" color="dark" class="full-width" outlined rounded size="lg" type="submit" />
        </div>
      </div>
    </q-form>
  </q-page>
</template>

<script>
import { ref, defineComponent } from 'vue';
import axios from 'axios';

export default defineComponent({
  name: 'Login-usuario',
  data() {
    return {
      alertaError: false,
      cpf: '',
      apartamento: '',
      chaveacesso: '',
      sindicoporteiro: ref(false),
      ehsenha: ref(true),
    };
  },
  created() {
    sessionStorage.clear('token');
    localStorage.clear('token');
  },
  methods: {
    removeErro() {
      this.alertaError = false;
    },
    async login() {
      if (this.sindicoporteiro) {
        if (this.cpf !== '' && this.chaveacesso !== '') {
          const response = await axios.post('http://localhost:3000/usuarios', {
            cpf: this.cpf,
            senha: this.chaveacesso,
            tipo: 'sindico/porteiro',
          });
          // eslint-disable-next-line no-console
          if (response.data.token) {
            sessionStorage.setItem('token', response.data.token);
            // eslint-disable-next-line no-console
            console.log('SUCCESS');
            this.$router.push({
              name: `${this.decodificarToken().tipoUsuario}`,
            });
          } else {
            this.alertaError = true;
          }
        }
      } else if (this.cpf !== '' && this.apartamento !== '') {
        const response = await axios.post('http://localhost:3000/usuarios', {
          cpf: this.cpf,
          senha: this.apartamento,
          tipo: 'inquilino',
        });
        // eslint-disable-next-line no-console
        if (response.data.token) {
          sessionStorage.setItem('token', response.data.token);
          this.$router.push({ name: `${this.decodificarToken().tipoUsuario}` });
        } else {
          this.alertaError = true;
        }
      }
    },
    decodificarToken() {
      const tokenUsuario = sessionStorage.getItem('token');
      const tokenParts = tokenUsuario.split('.');
      const encodedPayload = tokenParts[1];
      const decodedPayload = decodeURIComponent(
        window
          .atob(encodedPayload)
          .split('')
          .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
          .join(''),
      );
      return JSON.parse(decodedPayload);
    },
    limparChave() {
      this.chaveacesso = '';
    },
  },
});
</script>
<style>
.alert-card {
  background-color: red;
  color: white;
  height: 50%;
}

.alert-card__content {
  display: flex;
  align-items: center;
}

.alert-card__icon {
  font-size: 16px;
  margin-right: 10px;
}

.alert-card__message {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
}
</style>
