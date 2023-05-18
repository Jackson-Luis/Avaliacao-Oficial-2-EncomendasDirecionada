<template>
  <q-page>
    <div class="q-pa-md">
    <q-table
      :rows="rows"
      row-key="name"
      :filter="filter"
      grid
      hide-header
      hide-pagination
    >
      <template v-slot:item="props">
        <div
          class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition">
          <q-card bordered>
            <q-list dense>
              <q-item>
                <q-item-section>
                  <q-item-label style="font-size: 20px;font-weight: bold;">
                    Apartamento: {{ props.cols[2].value  }}
                  </q-item-label>
                  <q-item-label>CPF {{ props.cols[1].value }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label>
                    <q-td :props="props.cols[0].props" class="no-wrap">
                      <q-btn flat round icon="mdi-pencil"
                      @click="editItem(props.row)" icon-right="mdi-pencil"/>
                    </q-td>
                    <q-td :props="props.cols[0].props" class="no-wrap">
                      <q-btn flat round icon="mdi-delete"
                      @click="deleteItem(props.row)"/>
                    </q-td>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>
      </template>
    </q-table>
    <q-btn flat round
      style="margin-top: 20%;
      margin-left: 80%;
      background-color: #6cac2c;
      width: 60px;
      height: 60px;
      color: white;
      font-size: large;"
      icon="mdi-plus"
      @click.prevent="createItem()"/>
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
          name: 'identificacao',
          required: true,
          label: 'Identificão',
          field: 'identificao',
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
          name: 'acoes',
          align: 'center',
          label: 'Ações',
          key: 'acoes',
        },
      ],
    };
  },
  async created() {
    const response = await axios.get('http://localhost:3000/apartamentos/list');
    this.rows = response.data.apartamentos;
    console.log(response.data.apartamentos);
  },
  methods: {
    editItem(item) {
      console.log(item.id);
      this.$router.push({ name: 'EditarApartamento', params: { id: item.id } });
    },
    async deleteItem(item) {
      const responseDelete = await axios.delete(`http://localhost:3000/apartamentos/delete/${item.id}`);
      console.log(responseDelete);
      const response = await axios.get('http://localhost:3000/apartamentos/list');
      this.rows = response.data.usuarios;
    },
    createItem() {
      this.$router.push({ name: 'CadastrarApartamentos' });
    },
  },
});
</script>
