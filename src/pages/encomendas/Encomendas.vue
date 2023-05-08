<!-- eslint-disable linebreak-style -->
<template>
  <q-page>
    <div class="q-pa-md">
      <q-table
        flat
        bordered
        title="Treats"
        :rows="rows"
        :columns="columns"
        row-key="nome"
        separator="cell"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td
              v-for="col in props.cols"
              :key="col.name"
              :props="col.props"
            >
              <div v-if="col.name !== 'acoes'">
                {{ col.value }}
              </div>
              <div v-else>
                <q-td :props="props.cols[0].props" class="no-wrap">
                  <q-btn
                    flat
                    round
                    icon="mdi-pencil"
                    @click="editItem(props.row)"
                    icon-right="mdi-pencil"
                  />
                </q-td>
                <q-td :props="props.cols[0].props" class="no-wrap">
                  <q-btn
                    flat
                    round
                    icon="mdi-delete"
                    @click="deleteItem(props.row)"
                  />
                </q-td>
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <q-fab flat round
      style="margin-top: 20%;
      margin-left: 80%;
      background-color: #6cac2c;
      width: 60px;
      height: 60px;
      color: white;
      font-size: large;"
      icon="mdi-plus"
      @click.prevent="goToPage()"/>
    </div>
  </q-page>
</template>
<!-- eslint-disable linebreak-style -->
<script>
import { defineComponent } from 'vue';
import axios from 'axios';

export default defineComponent({
  name: 'Encomendas',
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
    const response = await axios.post('http://localhost:3000/encomendas/list');
    this.rows = response.data.usuarios;
  },
  methods: {
    editItem(item) {
      console.log(item.id);
    },
    deleteItem(item) {
      console.log(item.id);
    },
    goToPage() {
      this.$router.push('/cadastrarEncomendas');
    },
  },
});
</script>
