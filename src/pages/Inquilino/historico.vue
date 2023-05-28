<template>
  <q-page>
    <div class="q-pa-md">
      <q-table :rows="rows" :filter="filter" :columns="columns" class=" q-pa-md tabelaHistorico">
        <template v-slot:top-left>
          <div style="font-weight: bolder; font-size: large;">Histórico</div>
        </template>
        <template v-slot:top-right>
          <q-input dense debounce="300" label="Pesquisar"
          color="primary" v-model="filter" aria-label="Pesquisar" labe
            class="customizar-input bg-grey-3">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue';
import axios from 'axios';

export default defineComponent({
  name: 'Historico',
  setup() {
    const pesquisar = ref('');
    return {
      pesquisar,
    };
  },
  data() {
    return {
      filter: '',
      rows: [],
      columns: [
        {
          name: 'data',
          required: true,
          label: 'Data da Retirada',
          field: 'dataRetirada',
          align: 'left',
          sortable: true,
        },
        {
          name: 'encomenda',
          align: 'left',
          label: 'Encomenda',
          field: 'identificacaoItem',
          sortable: true,
        },
        {
          name: 'coletor',
          align: 'left',
          label: 'Coletor',
          field: 'coletor',
          sortable: true,
        },
        {
          name: 'status',
          align: 'left',
          label: 'Status',
          field: 'status',
          sortable: true,
        },
      ],
    };
  },
  async created() {
    const { identificacao } = this.decodificarToken();
    const responseEncomendas = await axios.get(`http://localhost:3000/encomendas?destinatario=${identificacao}`);
    responseEncomendas.data.forEach(async (element) => {
      if (element.dataRetirada) {
        const responseUsuario = await axios.get(`http://localhost:3000/usuarios?cpf=${element.coletor}`);
        this.rows.push({
          destinatario: element.destinatario,
          coletor: responseUsuario.data[0].nome,
          dataRecebimento: this.formatarData(element.dataRecebimento),
          dataRetirada: this.formatarData(element.dataRetirada),
          identificacaoItem: element.identificacao,
          status: 'Entregue',
        });
      }
    });
  },
  methods: {
    decodificarToken() {
      const tokenUsuario = sessionStorage.getItem('token');
      const tokenParts = tokenUsuario.split('.');
      const encodedPayload = tokenParts[1];
      const decodedPayload = decodeURIComponent(window.atob(encodedPayload).split('').map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`).join(''));
      return JSON.parse(decodedPayload);
    },
    formatarData(dt) {
      const dataSplit = dt.split('-');
      const dia = dataSplit[2];
      const mes = dataSplit[1];
      const ano = dataSplit[0];
      const dataFormatada = `${dia}/${mes}/${ano}`;
      return dataFormatada;
    },
  },
});
</script>

<style>
.textoPesquisar {
  color: rgb(99, 99, 99);
  font-size: 19px;
  margin-left: 15px;
}

.tabelaHistorico td:nth-child(2) {
  font-weight: bold;
}

.tabelaHistorico td:nth-child(4) {
  color: rgb(1, 108, 19);
}

.customizar-item {
  flex: 1 1 auto;
}

.customizar-input {
  height: 40px;
  padding-left: 10px;
  border-radius: 15px;
}
</style>
