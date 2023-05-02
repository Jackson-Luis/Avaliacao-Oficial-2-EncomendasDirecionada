<template>
  <q-page>
    <q-input debounce="400" filled v-model="search" placeholder="Pesquisar">
      <template v-slot:append>
        <q-icon name="search" />
      </template>
    </q-input>
    <div class="q-pa-md">
      <q-table :rows="pesquisarEncomendas" :columns="columns" row-key="name"></q-table>
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
    const responseEncomendas = await axios.post('http://localhost:3000/encomendas/list');
    const responseApartamento = await axios.post('http://localhost:3000/apartamentos/list');
    responseEncomendas.data.usuarios.forEach(async (element) => {
      responseApartamento.data.apartamentos.forEach(async (el) => {
        if (el.identificacao === element.identificacao_apartamento && element.status === 'entregue') {
          this.rows.push(element);
        }
      });
    });
  },
  computed: {
    pesquisarEncomendas() {
      // eslint-disable-next-line max-len
      return this.rows.filter((row) => row.identificacao_item.toLowerCase().trim().includes(this.search.toLowerCase()));
    },
  },
  methods: {

  },
});
</script>

<style>
td:nth-child(2) {
  font-weight: bold;
}

td:nth-child(3) {
  color: red;
}
</style>
