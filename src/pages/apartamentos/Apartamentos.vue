<template>
  <q-page>
    <div class="q-pa-md">
    <q-table
      :rows="rows"
      row-key="name"
      grid
      hide-header
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
                      @click="exibirDialogoDeletar(props.row)"/>
                    </q-td>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>
      </template>
    </q-table>
    <q-dialog v-model="mostrarDialogoDeletar" persistent>
      <q-card>
        <q-card-section>
          <q-card-title class="text-primary">Confirmar saída</q-card-title>
          <q-card-main>
            <p>{{ mensagemAlerta }}</p>
          </q-card-main>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Cancelar" color="primary" flat @click="fecharDialogoDeletar" />
          <q-btn label="Deletar" color="negative" @click="deleteItem(this.guardarApartamento)" />
        </q-card-actions>
      </q-card>
    </q-dialog>
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
      mostrarDialogoDeletar: false,
      mensagemAlerta: '',
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
      this.$router.push({ name: `ApartamentosEdit-${this.decodificarToken().tipoUsuario}`, params: { id: item.id } });
    },
    decodificarToken() {
      const tokenUsuario = sessionStorage.getItem('token');
      const tokenParts = tokenUsuario.split('.');
      const encodedPayload = tokenParts[1];
      const decodedPayload = decodeURIComponent(window.atob(encodedPayload).split('').map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`).join(''));
      return JSON.parse(decodedPayload);
    },
    exibirDialogoDeletar(item) {
      this.mostrarDialogoDeletar = true;
      this.guardarApartamento = item;
      this.mensagemAlerta = `Deseja excluir o apartamento ${this.guardarApartamento.identificacao}?`;
    },
    fecharDialogoDeletar() {
      this.mostrarDialogoDeletar = false;
    },
    async deleteItem(item) {
      // eslint-disable-next-line no-restricted-globals, no-alert
      try {
        await axios.delete(`http://localhost:3000/apartamentos/delete/${item.id}`);

        const response = await axios.get('http://localhost:3000/apartamentos/list');
        this.rows = response.data.apartamentos;
        this.fecharDialogoDeletar();
      } catch (error) {
        console.error(error);
      }
    },
    createItem() {
      this.$router.push({ name: `ApartamentosCreate-${this.decodificarToken().tipoUsuario}` });
    },
  },
});
</script>
