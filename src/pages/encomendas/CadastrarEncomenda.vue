<!-- eslint-disable max-len -->
<template>
  <AlertVue ref="alertaVue" :texto="textoAlert" />
  <div class="q-pa-md" style="max-width: 400px">
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <q-input filled v-model="identificacaoItem" label="Identificação da encomenda" lazy-rules
      :rules="[val => val && val.length > 0 || 'O Campo é obrigatório']" />
      <q-select filled v-model="apartamentoNumero" :options="apartamentosNumero"
      label="Apartamento destinatario" lazy-rules
      :rules="[val => val && val.length > 0 || 'O Campo é obrigatório']"></q-select>
      <q-input filled v-model="dataRecebimento" label="Data de recebimento" type="date"
      placeholder="01/01/2000" lazy-rules
      :rules="[val => val && val.length > 0 || 'O Campo é obrigatório']"></q-input>
      <q-select filled v-model="recebedor" :options="recebedorCPF"
      label="Recebedor"></q-select>

      <div>
        <q-btn label="Salvar" type="submit" color="primary"/>
        <q-btn label="Cancelar" type="reset" color="primary" flat class="q-ml-sm" @click="cancelar" />
      </div>
    </q-form>

  </div>
</template>

<script>
import axios from 'axios';
import AlertVue from 'src/components/Alert.vue';

export default ({
  name: 'CadastrarEncomenda',
  components: {
    AlertVue,
  },
  data() {
    return {
      cadastro: {},
      identificacaoItem: '',
      apartamentoNumero: '',
      apartamentosNumero: [],
      dataRecebimento: '',
      recebedor: '',
      recebedorCPF: [],
      dataRetirada: '',
      coletor: '',
      textoAlert: '',
    };
  },
  async created() {
    try {
      const recebedorResponse = await axios.get('http://localhost:3000/usuarios?tipo=porteiro', {
        headers: {
          Accept: 'application/json',
        },
      });
      const recebedores = recebedorResponse.data;
      this.recebedorCPF = recebedores.reduce((
        acc,
        usuario,
      ) => [...acc, { value: usuario.cpf, label: usuario.nome }], []);

      const apartamentosResponse = await axios.get('http://localhost:3000/apartamentos', {
        headers: {
          Accept: 'application/json',
        },
      });
      const apartamentos = apartamentosResponse.data;
      this.apartamentosNumero = apartamentos.reduce((
        acc,
        apartamento,
      ) => [...acc, apartamento.identificacao], []);
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
    cancelar() {
      this.$router.push({ name: `Encomendas-${this.decodificarToken().tipoUsuario}` });
    },
    async onSubmit() {
      if (
        this.identificacaoItem === ''
        || this.dataRecebimento === ''
        || this.recebedor === ''
        || this.apartamentoNumero === ''
      ) {
        return;
      }
      this.cadastro = {
        identificacao: this.identificacaoItem,
        dataRecebimento: this.dataRecebimento,
        dataRetirada: this.dataRetirada,
        destinatario: this.apartamentoNumero,
        recebedor: this.recebedor.value,
        coletor: this.coletor,
      };

      try {
        const response = await axios.post('http://localhost:3000/encomendas/create', this.cadastro, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });
        const encomendas = response.data;
        this.textoAlert = 'Encomenda cadastrada com sucesso';
        this.$refs.alertaVue.open();
        // eslint-disable-next-line consistent-return
        return encomendas;
      } catch (error) {
        console.error(error);
        // eslint-disable-next-line consistent-return
        return null;
      }
    },
  },
});
</script>

<style lang="scss">
.cadastrar {
  color: $red-1;
  background-color: $grey-2;
}
</style>
