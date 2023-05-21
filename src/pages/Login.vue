<!-- eslint-disable max-len -->
<template>
  <q-page padding style="background-color: #6cac2c">
    <q-form class="absolute-center" rounded @submit.prevent="login">
      <img style="margin: auto" src="../assets/Logo-marca.svg" />
      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">
        <q-input label="CPF" color="green" v-model="cpf" outlined bg-color="white" />
        <q-input v-if="!sindicoporteiro" label="Digite o número do apartamento" color="green" v-model="apartamento"
          type="password" outlined bg-color="white" :rules="[
            (val) => (val && val.length <= 4) || 'Número de apartamento inválido',
          ]" />
        <q-input v-else label="Digite a chave de acesso" color="green" v-model="chaveacesso" type="password" outlined
          bg-color="white" />
        <q-toggle class="text-h5" v-model="sindicoporteiro" label="Acesso Sindico/Porteiro" />
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
      cpf: '',
      apartamento: '',
      chaveacesso: '',
      sindicoporteiro: ref(false),
    };
  },
  created() {
    sessionStorage.clear('token');
  },
  methods: {
    async login() {
      if (this.sindicoporteiro) {
        if (this.cpf !== '' && this.chaveacesso !== '') {
          const response = await axios.post('http://localhost:3000/usuarios', {
            cpf: this.cpf,
            senha: this.chaveacesso,
          });
          // eslint-disable-next-line no-console
          console.log(response.data); // Autenticação bem-sucedida
          if (response.data.token) {
            sessionStorage.setItem('token', response.data.token);
            console.log(this.decodificarToken());
            // eslint-disable-next-line no-console
            console.log('SUCCESS');
            this.$router.push({
              name: `${this.decodificarToken().tipoUsuario}`,
            });
          } else {
            // eslint-disable-next-line no-console, no-alert
            alert('Autenticação não efetuada, Email ou senha incorreta');
          }
        }
      } else if (this.cpf !== '' && this.apartamento !== '') {
        const response = await axios.post('http://localhost:3000/usuarios', {
          cpf: this.cpf,
          senha: this.apartamento,
        });
        // eslint-disable-next-line no-console
        console.log(response.data); // Autenticação bem-sucedida
        if (response.data.token) {
          sessionStorage.setItem('token', response.data.token);
          console.log(this.decodificarToken());
          // eslint-disable-next-line no-console
          console.log('SUCCESS');
          this.$router.push({ name: `${this.decodificarToken().tipoUsuario}` });
        } else {
          // eslint-disable-next-line no-console, no-alert
          alert('Autenticação não efetuada, Email ou senha incorreta');
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
    validarCPF(cpf) {
      // Remover caracteres não numéricos do CPF
      cpf = cpf.replace(/\D/g, '');

      // Verificar se o CPF possui 11 dígitos
      if (cpf.length !== 11) {
        return false;
      }

      // Verificar se todos os dígitos são iguais, o que invalida o CPF
      if (/^(\d)\1{10}$/.test(cpf)) {
        return false;
      }

      // Validar os dígitos verificadores
      let soma = 0;
      let resto;

      // Verificar o primeiro dígito verificador
      // eslint-disable-next-line no-plusplus
      for (let i = 1; i <= 9; i++) {
        // eslint-disable-next-line radix
        soma += parseInt(cpf.charAt(i - 1)) * (11 - i);
      }

      resto = (soma * 10) % 11;

      if (resto === 10 || resto === 11) {
        resto = 0;
      }
      // eslint-disable-next-line radix
      if (resto !== parseInt(cpf.charAt(9))) {
        return false;
      }

      // Verificar o segundo dígito verificador
      soma = 0;

      // eslint-disable-next-line no-plusplus
      for (let i = 1; i <= 10; i++) {
        // eslint-disable-next-line radix
        soma += parseInt(cpf.charAt(i - 1)) * (12 - i);
      }

      resto = (soma * 10) % 11;

      if (resto === 10 || resto === 11) {
        resto = 0;
      }
      // eslint-disable-next-line radix
      if (resto !== parseInt(cpf.charAt(10))) {
        return false;
      }

      // CPF válido
      return true;
    },
  },
});
</script>
