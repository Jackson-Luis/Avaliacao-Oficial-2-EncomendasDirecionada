<!-- eslint-disable linebreak-style -->
<!-- eslint-disable linebreak-style -->
<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

export default defineComponent({
  name: 'Encomendas',
  data() {
    return {
      rows: [],
      columns: [
        {
          name: 'identificacao_item',
          required: true,
          label: 'Nome',
          field: 'identificacao_item',
          align: 'center',
          sortable: true,
        },
        {
          name: 'cpf',
          align: 'center',
          label: 'CPF',
          field: 'cpf',
          sortable: true,
        },
        {
          name: 'tipo',
          align: 'center',
          label: 'Tipo',
          field: 'tipo',
          sortable: true,
        },
        {
          name: 'acoes',
          align: 'center',
          label: 'Ações',
          key: 'acoes',
        },
      ],
    };
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
  methods: {
    editItem(item) {
      console.log(item.id);
    },
    async deleteItem(item) {
      // eslint-disable-next-line no-restricted-globals, no-alert
      const result = confirm(`Deseja excluir o item ${item.identificacao_item}?`);

      if (result && item.id) {
        const response = await axios.delete(`http://localhost:3000/encomendas/delete/${item.id}`);
        if (response.status === 200) {
          // eslint-disable-next-line no-alert
          alert('Item excluido com sucesso!');
        }
      }
    },
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

const goToCadastrarEncomendas = () => {
  router.push('/cadastrarEncomendas');
};

const editar = (item) => {
  console.log(item);
  router.push({ name: 'EditarEncomendas', params: item });
  // router.push('/editarEncomendas');
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
  @click="goToCadastrarEncomendas"
/>
</template>
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
