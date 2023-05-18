<!-- eslint-disable linebreak-style -->
<template>
  <div id="q-app" style="">
          <div class="q-gutter-y-md q-pa-lg column" style="">
            <q-select @change = outlined
              v-model="apartamentoNumero" :options="apartamentosNumero"
              label="Escolha o apartamento">
            </q-select>
          </div>
      <div class="q-pa-md">
        <q-table
            flat bordered
            title="Encomendas"
            :rows="rows"
            :columns="columns"
            row-key="id"
            :filter="filter"
            :loading="loading"
        >
        <template v-slot:body-cell-actions="acoes">
            <q-td :props="props">
              <q-btn dense round flat color="grey" @click="editar(acoes.row)" icon="edit"></q-btn>
              <q-btn dense round flat color="grey" @click="deletar(acoes.row)"
               icon="delete"></q-btn>
            </q-td>
          </template>
        </q-table>
      </div>
  </div>
<q-fab flat round
  class="sticky-fab"
  icon="mdi-plus"
  @click="goToCadastrarApartamentos"
/>
</template>
<!-- eslint-disable linebreak-style -->
<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

const apartamentos = await fetch('http://localhost:3000/apartamentos', {
  method: 'GET',
  headers: {
    Accept: 'application/json',
  },
}).then((response) => response.json());

const apartamentosNumero = apartamentos.reduce((
  acc,
  apartamento,
) => [...acc, apartamento.identificacao], []);

const apartamentoNumero = ref('');

const columns = [
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
];
const loading = ref(false);
const filter = ref('');
const rows = ref([]);

const getEncomendas = async () => {
  fetch(`http://localhost:3000/encomendas?destinatario=${apartamentoNumero.value}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  }).then((response) => response.json())
    .then((data) => {
      rows.value = data;
    });
};

const goToCadastrarApartamentos = () => {
  router.push('/cadastrarApartamentos');
};

const editar = () => {
  router.push('/editarEncomendas');
};

const deletar = async (item) => {
  console.log(item);
  // eslint-disable-next-line no-restricted-globals, no-alert
  const result = confirm(`Deseja excluir o item ${item.identificacao}?`);
  if (result && item.id) {
    const response = await axios.delete(`http://localhost:3000/encomendas/delete/${item.id}`);
    if (response.status === 200) {
      getEncomendas();
    }
  }
};

watch(apartamentoNumero, () => {
  getEncomendas();
});
</script>
<!-- eslint-disable linebreak-style -->
<style>
.sticky-fab {
  position: fixed;
  bottom: 20px; /* Adjust the value as per your requirements */
  right: 20px; /* Adjust the value as per your requirements */
  background-color: #6cac2c;
  width: 60px;
  height: 60px;
  color: white;
  font-size: large;
}
</style>
