<template>
  <q-page>
    <q-input debounce="400" filled v-model="search" placeholder="Pesquisar">
      <template v-slot:append>
        <q-icon name="search" />
      </template>
    </q-input>
    <div class="q-pa-md">
      <q-table class="tabelaHistorico"
      :rows="pesquisarEncomendas"
      :columns="columns"
      row-key="name"></q-table>
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
          label: 'Data',
          field: 'data_recebimento',
          align: 'center',
          sortable: true,
        },
        {
          name: 'encomenda',
          align: 'center',
          label: 'Encomenda',
          field: 'identificacao_item',
          sortable: true,
        },
        {
          name: 'status',
          align: 'center',
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
        if (el.identificacao === element.identificacao_apartamento
        && element.data_retirada && cpf === el.cpf_inquilino) {
          this.rows.push({
            identificacao_item: `${element.identificacao_item}
            Apartamento: ${element.identificacao_apartamento}
            Retirado por: ${element.destinatário}`,
            destinatário: element.coletor,
            coletor: element.coletor,
            recebedor: element.recebedor,
            data_recebimento: element.data_recebimento,
            data_retirada: element.data_retirada,
            identificacao_apartamento: element.identificacao_apartamento,
            status: 'Aguardando a retirada',
          });
        }
      });
    });
  },
  computed: {
    pesquisarEncomendas() {
      return this.rows.filter((row) => row.identificacao_item.toLowerCase().trim()
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
  },
});
</script>

<style>
.tabelaHistorico td:nth-child(2) {
  font-weight: bold;
}

.tabelaHistorico td:nth-child(3) {
  color: rgb(1, 108, 19);
}
</style>
