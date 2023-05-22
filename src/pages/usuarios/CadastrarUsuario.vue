<!-- eslint-disable max-len -->
<!-- eslint-disable radix -->
<template>
  <AlertVue ref="alertaVue" :texto="textoAlert" />
  <div class="q-pa-md" style="max-width: 400px">
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <q-input filled v-model="nome" label="Digite seu nome" lazy-rules
        :rules="[val => val && val.length > 0 || 'O Campo é obrigatório']" />

      <q-input filled v-model="cpf" label="Digite o seu CPF" :error="!cpfValido" lazy-rules
        :rules="[val => !!val || 'Campo obrigatório', verificacao]" />

      <q-select filled v-model="tipo" label="Selecione a função" :options="['inquilino', 'sindico', 'porteiro']"
        lazy-rules :rules="[val => val && val.length > 0 || 'O Campo é obrigatório']" />

      <q-input v-if="tipo !== 'inquilino'" filled v-model="chaveAcesso" label="Digite a chave privada" lazy-rules
        :rules="[val => val && val.length > 0 || 'O Campo é obrigatório']" />

      <div>
        <q-btn label="Salvar" type="submit" color="primary" />
        <q-btn label="Cancelar" color="primary" flat class="q-ml-sm" @click="cancelar" />
      </div>
    </q-form>
  </div>
</template>

<script>
import axios from 'axios';
import AlertVue from 'src/components/Alert.vue';

export default {
  name: 'UsuarioCreate',
  components: {
    AlertVue,
  },
  data() {
    return {
      nome: '',
      cpf: '',
      tipo: 'inquilino',
      chaveAcesso: '',
      cpfValido: true, // Variável para armazenar a validade do CPF
      textoAlert: '',
    };
  },
  methods: {
    verificacao(cpf) {
      // Remover caracteres não numéricos do CPF

      if (!cpf) return 'Campo obrigatório'; // Verificar se o campo está preenchido
      cpf = cpf.replace(/\D/g, '');

      // Verificar se o CPF possui 11 dígitos
      if (cpf.length !== 11) {
        this.cpfValido = false;
        return 'CPF inválido';
      }

      // Verificar se todos os dígitos são iguais, o que invalida o CPF
      if (/^(\d)\1{10}$/.test(cpf)) {
        this.cpfValido = false;
        return 'CPF inválido';
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
        this.cpfValido = false;
        return 'CPF inválido';
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
        this.cpfValido = false;
        return 'CPF inválido';
      }

      // CPF válido
      this.cpfValido = true;
      return true;
    },
    async onSubmit() {
      // Fazer a chamada para salvar os dados do usuário
      const {
        nome, cpf, tipo, chaveAcesso,
      } = this;
      let usuario;
      if (tipo === 'inquilino') {
        usuario = {
          nome,
          cpf,
          tipo,
        };
      } else {
        usuario = {
          nome,
          cpf,
          senha: chaveAcesso, // Renomear 'chaveAcesso' para 'senha' no objeto 'usuario'
          tipo,
        };
      }

      try {
        await axios.post('http://localhost:3000/usuarios/create', usuario);
        // Lógica de redirecionamento ou exibição de mensagem de sucesso
        this.textoAlert = 'Usuário criado com sucesso';
        this.$refs.alertaVue.open();
      } catch (error) {
        // Lógica de exibição de mensagem de erro
        console.error('Erro ao criar o usuário:', error);
      }
    },

    onReset() {
      this.$refs.form.reset();
    },
    cancelar() {
      this.$router.back();
    },
  },
};
</script>
