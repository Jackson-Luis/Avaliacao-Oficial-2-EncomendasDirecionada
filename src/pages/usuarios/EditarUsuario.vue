<!-- eslint-disable max-len -->
<!-- eslint-disable radix -->
<template>
  <AlertVue ref="alertaVue" :texto="textoAlert" />
  <div class="q-pa-md" style="max-width: 400px">
    <q-form @submit="onSubmit" class="q-gutter-md">
      <q-input filled v-model="nome" label="Digite seu nome" lazy-rules
        :rules="[val => val && val.length > 0 || 'O Campo é obrigatório']" />

      <q-input filled v-model="cpf" label="Digite o seu CPF" :error="!cpfValido"
        :rules="[val => !!val || 'Campo obrigatório', verificacao]" />

      <q-select filled v-model="tipo" label="Selecione a função"
        :options="tipoUsuario == 'sindico' ? ['inquilino', 'sindico', 'porteiro'] : ['inquilino']"
        :rules="[val => val && val.length > 0 || 'O Campo é obrigatório']" />

      <q-input v-if="tipo !== 'inquilino'" filled v-model="chaveAcesso" label="Digite a chave privada" type="password"
        lazy-rules :rules="[val => val && val.length > 0 || 'O Campo é obrigatório']" />

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
  name: 'UsuarioEdit',
  components: {
    AlertVue,
  },
  data() {
    return {
      showPassword: false,
      cpfValido: true,
      id: null,
      idLogin: null,
      nome: '',
      cpf: '',
      tipo: '',
      chaveAcesso: '',
      rules: {
        // eslint-disable-next-line no-mixed-operators
        cpf: [(val) => val && val.length > 0 || 'O Campo é obrigatório'],
      },
    };
  },
  created() {
    this.tipoUsuario = this.decodificarToken().tipoUsuario;
  },
  async mounted() {
    this.id = this.$route.params.id; // Obtenha o ID da rota
    this.idLogin = this.decodificarToken().id;
    console.log(this.idLogin);
    try {
      const response = await axios.get(`http://localhost:3000/usuarios/${this.id}`);
      const { usuario } = response.data;
      console.log(usuario);
      this.nome = usuario.nome;
      this.tipo = usuario.tipo;
      this.cpf = usuario.cpf;
      this.chaveAcesso = usuario.senha;
    } catch (error) {
      console.error(error);
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
    verificacao(cpf) {
      // Remover caracteres não numéricos do CPF
      console.log(cpf);
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
        id, nome, cpf, tipo, chaveAcesso,
      } = this;
      let usuario;
      // eslint-disable-next-line eqeqeq
      if ((this.tipoUsuario == 'sindico' && this.tipo != 'inquilino') || (this.tipoUsuario == 'porteiro' && this.idLogin == this.id)) {
        usuario = {
          id,
          nome,
          cpf,
          tipo,
          senha: chaveAcesso,
        };
      } else {
        usuario = {
          id,
          nome,
          cpf,
          tipo,
        };
      }
      try {
        await axios.put(`http://localhost:3000/usuarios/update/${id}`, usuario);
        // Lógica de redirecionamento ou exibição de mensagem de sucesso
        this.textoAlert = 'Usuário editado com sucesso';
        this.$refs.alertaVue.open();
      } catch (error) {
        // Lógica de exibição de mensagem de erro
        console.error('Erro ao criar o usuário:', error);
      }
    },
    cancelar() {
      this.$router.back();
    },
  },
};
</script>
