<!-- eslint-disable max-len -->
<!-- eslint-disable radix -->
<template>
  <div class="q-pa-md" style="max-width: 400px">
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">

      <q-input filled v-model="identificacao" label="Identificação do apartamento" lazy-rules

        :rules="[val => val && val.length > 0 || 'O Campo é obrigatório']" />

        <q-input filled v-model="cpf" label="Digite o seu CPF" lazy-rules
        :rules="[val => !!val || 'Campo obrigatório']" />

      <div>
        <q-btn label="Salvar" type="submit" color="primary" />
        <q-btn label="Cancelar" color="primary" flat class="q-ml-sm" />
      </div>
    </q-form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ApartamentoEditar',
  data() {
    return {
      id: null,
      identificacao: '',
      cpf: '',

      rules: {
        // eslint-disable-next-line no-mixed-operators
        cpf: [(val) => val && val.length > 0 || 'O Campo é obrigatório'],
      },
    };
  },
  async mounted() {
    this.id = this.$route.params.id; // Obtenha o ID da rota
    console.log(this.id);
    try {
      const response = await axios.get(`http://localhost:3000/apartamentos/${this.id}`);

      this.identificacao = response.data.identificacao;
      this.cpf = response.data.cpf;

    } catch (error) {
      console.error(error);
    }
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
        id, identificacao, cpf,
      } = this;
      const apartamentos = {
        id,
        identificacao,
        cpf,
      };

      try {
        await axios.put(`http://localhost:3000/apartamentos/update/${id}`, apartamentos);

        // Lógica de redirecionamento ou exibição de mensagem de sucesso
      } catch (error) {
        // Lógica de exibição de mensagem de erro
      }
    },

    onReset() {
      this.$refs.form.reset();
    },
  },
};
</script>
