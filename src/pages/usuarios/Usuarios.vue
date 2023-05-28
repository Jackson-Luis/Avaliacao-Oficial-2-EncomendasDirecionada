<!-- eslint-disable max-len -->
<template>
  <q-page>
    <div class="q-pa-md">
      <q-table :rows="rows" row-key="name" grid hide-header virtual-scroll>
        <template v-slot:item="props">
          <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition">
            <q-card bordered>
              <q-list dense>
                <q-item>
                  <q-item-section>
                    <q-item-label style="font-size: 20px;font-weight: bold;">
                      {{ props.cols[1].value }}
                    </q-item-label>
                    <q-item-label>CPF {{ props.cols[2].value }}</q-item-label>
                    <q-item-label>{{ props.cols[3].value }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label>
                      <q-td :props="props.cols[0].props" class="no-wrap">
                        <q-btn flat round icon="mdi-pencil" @click="editItem(props.row)" icon-right="mdi-pencil" />
                      </q-td>
                      <q-td :props="props.cols[0].props" class="no-wrap">
                        <q-btn flat round icon="mdi-delete" @click="exibirDialogoDeletar(props.row)" />
                      </q-td>
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card>
          </div>
        </template>
        <q-pagination v-model="current" max="5" direction-links push color="teal" active-design="push"
          active-color="orange" />
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
          <q-btn label="Deletar" color="negative" @click="deleteItem(this.guardarUsuario)" />
        </q-card-actions>
      </q-card>
    </q-dialog>
      <q-btn flat round style="margin-top: 20%;
      margin-left: 80%;
      background-color: #6cac2c;
      width: 60px;
      height: 60px;
      color: white;
      font-size: large;" icon="mdi-plus" @click.prevent="createItem()" />
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';
import axios from 'axios';

export default defineComponent({
  name: 'Usuarios',
  data() {
    return {
      mostrarDialogoDeletar: false,
      mensagemAlerta: '',
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
    const token = this.decodificarToken();
    console.log(token.tipoUsuario === 'sindico');
    if (token.tipoUsuario === 'sindico') {
      const response = await axios.post('http://localhost:3000/usuarios/list');
      this.rows = response.data.usuarios;
    } else {
      const response = await axios.post('http://localhost:3000/usuarios/list');
      // eslint-disable-next-line eqeqeq
      this.rows = response.data.usuarios.filter((val) => !['sindico', 'porteiro'].includes(val.tipo) || val.id === token.id);
    }
  },
  methods: {
    editItem(item) {
      console.log(item.id);
      this.$router.push({ name: `UsuarioEdit-${this.decodificarToken().tipoUsuario}`, params: { id: item.id } });
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
      this.guardarUsuario = item;
      this.mensagemAlerta = `Deseja excluir o usuario ${this.guardarUsuario.identificacao}?`;
    },
    fecharDialogoDeletar() {
      this.mostrarDialogoDeletar = false;
    },
    async deleteItem(item) {
      try {
        await axios.delete(`http://localhost:3000/usuarios/delete/${item.id}`);
        const token = this.decodificarToken();
        console.log(token.tipoUsuario === 'sindico');

        if (token.tipoUsuario === 'sindico') {
          const response = await axios.post('http://localhost:3000/usuarios/list');
          this.rows = response.data.usuarios;
          this.fecharDialogoDeletar();
        } else {
          const response = await axios.post('http://localhost:3000/usuarios/list');
          // eslint-disable-next-line eqeqeq
          this.rows = response.data.usuarios.filter((val) => !['sindico', 'porteiro'].includes(val.tipo) || val.id === token.id);
          this.fecharDialogoDeletar();
        }
      } catch (error) {
        console.error('Erro ao excluir o item:', error);
        // Aqui você pode lidar com o erro
      }
    },
    createItem() {
      this.$router.push({ name: `UsuarioCreate-${this.decodificarToken().tipoUsuario}` });
    },
  },
});
</script>
