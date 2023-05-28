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
      <q-checkbox v-model="mostrarEncomendaRecebida" label="Encomenda foi retirada?"
      class="custom-label" style="color: black;"/>
      <div v-if="mostrarEncomendaRecebida">
        <q-select filled v-model="coletor" :options="coletorCPF"
        label="Coletor"></q-select>
        <q-input filled  class="q-mt-md" outlined v-model="dataRetirada"
        label="Data de retirada" type="date" placeholder="01/01/2000" lazy-rules
      :rules="[val => val && val.length > 0 || 'O Campo é obrigatório']"></q-input>
      </div>
      <div>
        <q-btn label="Salvar" type="submit" color="primary"/>
        <q-btn label="Cancelar" type="reset" color="primary" flat class="q-ml-sm" @click="cancelar" />
      </div>
    </q-form>

  </div>
</template>
<!-- eslint-disable linebreak-style -->
<script>
import axios from 'axios';
import AlertVue from 'src/components/Alert.vue';

export default {
  name: 'EditarEncomenda',
  components: {
    AlertVue,
  },
  data() {
    return {
      encomendaSelecionada: {},
      idEncomenda: null,
      cadastro: {},
      identificacaoItem: '',
      apartamentoNumero: '',
      apartamentosNumero: [],
      dataRecebimento: '',
      recebedor: '',
      recebedorCPF: [],
      coletor: '',
      coletorCPF: [],
      dataRetirada: '',
      mostrarEncomendaRecebida: false,
      textoAlert: '',
    };
  },
  async created() {
    const route = this.$route;
    this.idEncomenda = route.params.id;
    const recebedorResponse = await axios.get('http://localhost:3000/usuarios?tipo=porteiro', {
      headers: {
        Accept: 'application/json',
      },
    });
    const recebedores = recebedorResponse.data;
    const coletorResponse = await axios.get('http://localhost:3000/usuarios?tipo=inquilino', {
      headers: {
        Accept: 'application/json',
      },
    });
    const coletores = coletorResponse.data;
    this.recebedorCPF = recebedores.reduce((
      acc,
      recebedor,
    ) => [...acc, { value: recebedor.cpf, label: recebedor.nome }], []);
    this.coletorCPF = coletores.reduce((
      acc,
      coletor,
    ) => [...acc, { value: coletor.cpf, label: coletor.nome }], []);
    try {
      const encomendaResponse = await axios.get(`http://localhost:3000/encomendas?id=${this.idEncomenda}`);
      // eslint-disable-next-line prefer-destructuring
      this.encomendaSelecionada = encomendaResponse.data[0];
      this.identificacaoItem = this.encomendaSelecionada.identificacao;
      this.apartamentoNumero = this.encomendaSelecionada.destinatario;
      const apartamentosResponse = await axios.get('http://localhost:3000/apartamentos');
      this.apartamentos = apartamentosResponse.data;
      this.dataRecebimento = this.encomendaSelecionada.dataRecebimento;
      console.log(apartamentosResponse);
      this.recebedor = this.recebedorCPF.find((
        recebedor,
      ) => recebedor.value === this.encomendaSelecionada.recebedor);
      if (this.encomendaSelecionada.coletor !== '') {
        this.coletor = this.coletorCPF.find((
          coletor,
        ) => coletor.value === this.encomendaSelecionada.coletor);
        this.mostrarEncomendaRecebida = true;
      } else {
        this.coletor = '';
      }
      this.dataRetirada = this.encomendaSelecionada.dataRetirada;
      this.apartamentosNumero = this.apartamentos.reduce((
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
      this.$router.back();
    },
    onSubmit() {
      if (
        this.identificacaoItem === ''
        || this.dataRecebimento === ''
        || this.recebedor === ''
        || this.apartamentoNumero === ''
      ) {
        return;
      }
      if (
        (this.mostrarEncomendaRecebida === true && this.coletor === '')
        || (this.mostrarEncomendaRecebida === true && this.dataRetirada === '')
      ) {
        return;
      }
      if (this.mostrarEncomendaRecebida === false) {
        this.cadastro = {
          identificacao: this.identificacaoItem,
          dataRecebimento: this.dataRecebimento,
          dataRetirada: '',
          destinatario: this.apartamentoNumero,
          recebedor: this.recebedor.value,
          coletor: '',
        };
      } else {
        this.cadastro = {
          identificacao: this.identificacaoItem,
          dataRecebimento: this.dataRecebimento,
          dataRetirada: this.dataRetirada,
          destinatario: this.apartamentoNumero,
          recebedor: this.recebedor.value,
          coletor: this.coletor.value,
        };
      }
      axios
        .put(`http://localhost:3000/encomendas/update/${this.idEncomenda}`, this.cadastro, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          console.log(response);
          // Handle the response here
          this.textoAlert = 'Encomenda editada com sucesso';
          this.$refs.alertaVue.open();
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
};
</script>
<!-- eslint-disable linebreak-style -->
<style lang="scss">
.cadastrar {
  color: $red-1;
  background-color: $grey-2;
}
</style>
