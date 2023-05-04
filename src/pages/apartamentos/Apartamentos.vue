<template>
  <q-page>
    <div class="q-pa-md">
      <q-table flat bordered title="Treats" :rows="rows"
      :columns="columns" row-key="nome" separator="cell">
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td v-for="col in props.cols" :key="col.name" :props="col.props">
              <div v-if="col.name !== 'acoes'">
                {{ col.value }}
              </div>
              <div v-else>
                <q-td :props="props.cols[0].props" class="no-wrap">
                <q-btn flat round icon="mdi-pencil"
                @click="editItem(props.row)" icon-right="mdi-pencil"/>
              </q-td>
              <q-td :props="props.cols[0].props" class="no-wrap">
                <q-btn flat round icon="mdi-delete"
                @click="deleteItem(props.row)"/>
              </q-td>
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';
import axios from 'axios';

export default defineComponent({
  name: 'Apartamentos',
  data() {
    return {
      rows: [],
      columns: [
        {
          name: 'nome',
          required: true,
          label: 'Nome',
          field: 'nome',
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
  async created() {
    const response = await axios.post('http://localhost:3000/apartamentos/list');
    this.rows = response.data.usuarios;
  },
  methods: {
    editItem(item) {
      console.log(item.id);
    },
    deleteItem(item) {
      console.log(item.id);
    },
  },
});
</script>
