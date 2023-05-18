<template>
  <q-page>
    <q-item style="margin-top:2%">
      <q-item-section class="custom-item-section">
        <div class="textSearch">Pesquisar</div>
      </q-item-section>
      <q-item-section>
        <q-input borderless class="custom-input bg-grey-3" v-model="search">
          <template v-slot:append>
            <q-icon style="margin:10px; margin-bottom:60%" name="search" />
          </template>
        </q-input>
      </q-item-section>
    </q-item>
    <div class="q-pa-md">
      <q-table
      :rows="searchPackage"
      :columns="columns"
      row-key="name"
      class=" q-pa-md historyTable">
      </q-table>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue';
import axios from 'axios';

export default defineComponent({
  name: 'historico',
  setup() {
    const search = ref('');
    return {
      search,
    };
  },
  data() {
    return {
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
    const { cpf } = this.decodificarToken();
    const responseEncomendas = await axios.post('http://localhost:3000/encomendas/list');
    const responseApartamento = await axios.post('http://localhost:3000/apartamentos/list');
    responseEncomendas.data.usuarios.forEach(async (element) => {
      responseApartamento.data.apartamentos.forEach(async (el) => {
        if (el.id === element.idApartamento
          && element.dataRetirada && cpf === el.cpf) {
          element.dataRetirada = this.formatarData(element.dataRetirada);
          this.rows.push({
            identificacaoItem: `${element.identificacao}`,
            destinatario: element.destinatario,
            coletor: element.coletor,
            recebedor: element.recebedor,
            dataRecebimento: element.dataRecebimento,
            dataRetirada: element.dataRetirada,
            identificacaoApartamento: el.identificacao,
            status: 'Entregue',
          });
        }
      });
    });
  },
  computed: {
    searchPackage() {
      return this.rows.filter((row) => row.identificacaoItem.toLowerCase().trim()
        .includes(this.search.toLowerCase()));
    },
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
.textSearch {
  color: rgb(99, 99, 99);
  font-size: 19px;
  margin-left: 15px;
}

.historyTable td:nth-child(2) {
  font-weight: bold;
}

.historyTable td:nth-child(3) {
  color: rgb(1, 108, 19);
}

.custom-item-section {
  flex: 1 1 auto;
}

.custom-input {
  height: 40px;
  padding-left: 10px;
  border-radius: 15px;
}
</style>
