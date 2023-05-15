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
  async created() {
    const response = await axios.post('http://localhost:3000/encomendas/list');
    this.rows = response.data.usuarios;
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
});
</script>
