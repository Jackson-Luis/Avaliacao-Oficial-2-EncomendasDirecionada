<!-- eslint-disable max-len -->
<!-- eslint-disable linebreak-style -->
<template>
  <div id="q-app" style="">
    <div class="q-gutter-y-md q-pa-lg column" style="">
      <q-select v-model="apartamentoNumero" :options="apartamentosNumero" label="Escolha o apartamento">
      </q-select>
    </div>
    <div class="q-pa-md">
      <q-table flat bordered title="Encomendas" :rows="rows" :columns="columns" row-key="id" :filter="filter"
        :loading="loading">
        <template v-slot:body-cell-actions="acoes">
          <q-td :props="props">
            <q-btn dense round flat color="grey" @click="editar(acoes.row)" icon="edit"></q-btn>
            <q-btn dense round flat color="grey" @click="deletar(acoes.row)" icon="delete"></q-btn>
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
<q-fab flat round
  class="sticky-fab"
  icon="mdi-plus"
  @click="irParaCadastrarEncomendas"
/>
</template>
<!-- eslint-disable linebreak-style -->
<script>
import { ref } from 'vue';
import axios from 'axios';

export default {
  data() {
    return {
      apartamentosNumero: [],
      apartamentoNumero: ref(''),
      columns: [
        {
          name: 'identificacaoItem', label: 'Identificacao do item', field: 'identificacao', sortable: true,
        },
        {
          name: 'Destinatario', label: 'Destinatario', field: 'destinatario', sortable: true,
        },
        { name: 'Recebedor', label: 'Recebedor', field: 'recebedor' },
        { name: 'DataRecebimento', label: 'Data de recebimento', field: 'dataRecebimento' },
        {
          name: 'DataRetirada', label: 'Data de retirada', field: 'dataRetirada', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
        },
        { name: 'Coletor', label: 'Coletor', field: 'coletor' },
        { name: 'actions', label: 'Action' },
      ],
      loading: false,
      filter: '',
      rows: [],
    };
  },
  async created() {
    try {
      const respostaApartamentos = await axios.get('http://localhost:3000/apartamentos', {
        headers: {
          Accept: 'application/json',
        },
      });

      this.apartamentosNumero = respostaApartamentos.data.reduce((
        acc,
        apartamento,
      ) => [...acc, apartamento.identificacao], []);
    } catch (error) {
      console.error(error);
    }
  },
  methods: {
    async getEncomendas() {
      try {
        const respostaEncomendas = await axios.get(`http://localhost:3000/encomendas?destinatario=${this.apartamentoNumero}`, {
          headers: {
            Accept: 'application/json',
          },
        });
        this.rows = respostaEncomendas.data;
      } catch (error) {
        console.error(error);
      }
    },
    irParaCadastrarEncomendas() {
      // Use the appropriate method to navigate to the desired route
      this.$router.push({
        name: 'EncomendasCreate-sindico',
      });
    },
    editar(item) {
      // Use the appropriate method to navigate to the desired route
      this.$router.push({
        name: 'EncomendasEdit-sindico',
        params: { id: item.id },
      });
    },
    async deletar(item) {
      console.log(item);
      // eslint-disable-next-line no-restricted-globals, no-alert
      const result = confirm(`Deseja excluir o item ${item.identificacao}?`);
      if (result && item.id) {
        try {
          const response = await axios.delete(`http://localhost:3000/encomendas/delete/${item.id}`);
          if (response.status === 200) {
            this.getEncomendas();
          }
        } catch (error) {
          console.error(error);
        }
      }
    },
  },
  watch: {
    apartamentoNumero() {
      this.getEncomendas();
    },
  },
};
</script>
<!-- eslint-disable linebreak-style -->
<style>
.sticky-fab {
  position: fixed;
  bottom: 20px;
  /* Adjust the value as per your requirements */
  right: 20px;
  /* Adjust the value as per your requirements */
  background-color: #6cac2c;
  width: 60px;
  height: 60px;
  color: white;
  font-size: large;
}
</style>
