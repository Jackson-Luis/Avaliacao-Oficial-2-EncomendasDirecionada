<!-- eslint-disable max-len -->
<template>
  <q-page>
    <q-item style="margin-top:2%">
      <q-item-section class="customizar-item">
        <q-input label="Pesquisar" labe borderless class="customizar-input bg-grey-3" v-model="pesquisar" aria-label="Pesquisar">
          <template v-slot:append>
            <q-icon style="margin:10px; margin-bottom:60%" name="pesquisar" />
          </template>
        </q-input>
      </q-item-section>
    </q-item>
    <div class="q-pa-md">
      <q-table flat bordered title="Encomendas" :rows="pesquisarEncomenda" :columns="columns" row-key="id" :filter="filter"
        :loading="loading">
        <template v-slot:body-cell-actions="acoes">
          <q-td :props="props">
            <q-btn dense round flat color="grey" @click="editar(acoes.row)" icon="edit"></q-btn>
<<<<<<< Updated upstream
            <q-btn dense round flat color="grey" @click="mostrarDialogo(acoes.row)" icon="delete"></q-btn>
=======
            <q-btn dense round flat color="grey" @click="exibirDialogoDeletar(acoes.row)" icon="delete"></q-btn>
>>>>>>> Stashed changes
          </q-td>
        </template>
      </q-table>
    </div>
<<<<<<< Updated upstream
    <q-dialog v-model="mostrarDialogoExcluir" persistent>
      <q-card>
        <q-card-section>
          <q-card-title class="text-primary">Confirmação excluir</q-card-title>
          <q-card-main>
            <p>{{ mensagemAlerta }}</p>
          </q-card-main>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Cancelar" color="primary" flat @click="fecharDialogoSair()" />
          <q-btn label="Sim" color="negative" @click="deletar(linhaExcluir)" />
=======
    <q-dialog v-model="mostrarDialogoDeletar" persistent>
      <q-card>
        <q-card-section>
          <q-card-title class="text-primary">Confirmar saída</q-card-title>
          <q-card-main>
            <p>Tem certeza de que deseja deletar esse item?</p>
          </q-card-main>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Cancelar" color="primary" flat @click="fecharDialogoDeletar" />
          <q-btn label="Deletar" color="primary" @click="deletar(this.guardarEncomenda)" />
>>>>>>> Stashed changes
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
  <q-btn flat round style="margin-top: 20%;
      margin-left: 80%;
      background-color: #6cac2c;
      width: 60px;
      height: 60px;
      color: white;
      font-size: large;" icon="mdi-plus" @click.prevent="irParaCadastrarEncomendas" />
</template>
<!-- eslint-disable linebreak-style -->
<script>
import { ref } from 'vue';
import axios from 'axios';

export default {
  name: 'Encomendas',
  setup() {
    const pesquisar = ref('');
    return {
      pesquisar,
    };
  },
  data() {
    return {
      apartamentosNumero: [],
      mostrarDialogoDeletar: false,
      apartamentoNumero: ref(''),
      columns: [
        {
          name: 'identificacaoItem',
          label: 'Identificacao do item',
          field: 'identificacao',
          sortable: true,
        },
        {
          name: 'Destinatario',
          label: 'Destinatario',
          field: 'destinatario',
          sortable: true,
        },
        {
          name: 'Recebedor',
          label: 'Recebedor',
          field: 'recebedor',
          sortable: true,
        },
        {
          name: 'DataRecebimento',
          label: 'Data de recebimento',
          field: 'dataRecebimento',
          sortable: true,
        },
        {
          name: 'DataRetirada',
          label: 'Data de retirada',
          field: 'dataRetirada',
          sortable: true,
        },
        {
          name: 'Coletor',
          label: 'Coletor',
          field: 'coletor',
          sortable: true,
        },
        {
          name: 'actions',
          label: 'Action',
        },
      ],
      loading: false,
      filter: '',
      rows: [],
      mostrarDialogoExcluir: false,
      linhaExcluir: '',
      mensagemAlerta: '',
    };
  },
  async created() {
    try {
      const respostaEncomendas = await axios.get('http://localhost:3000/encomendas', {
        headers: {
          Accept: 'application/json',
        },
      });

      const encomendas = respostaEncomendas.data;
      const cpfList = encomendas.map((encomenda) => encomenda.recebedor);
      cpfList.push(...encomendas.map((encomenda) => encomenda.coletor));
      const cpfSet = new Set(cpfList);
      const cpfArray = Array.from(cpfSet);
      const usuariosResponse = await axios.post('http://localhost:3000/usuarios/list', { cpfs: cpfArray });
      const { usuarios } = usuariosResponse.data;

      this.rows = encomendas.map((encomenda) => ({
        ...encomenda,
        recebedor: usuarios.find((usuario) => usuario.cpf === encomenda.recebedor)?.nome || '',
        coletor: usuarios.find((usuario) => usuario.cpf === encomenda.coletor)?.nome || '',
      }));
    } catch (error) {
      console.error(error);
    }
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
  computed: {
    pesquisarEncomenda() {
      return this.rows.filter((row) => row.destinatario.toLowerCase().trim()
        .includes(this.pesquisar.toLowerCase()));
    },
  },
  methods: {
    async getEncomendas() {
      try {
        const respostaEncomendas = await axios.get('http://localhost:3000/encomendas', {
          headers: {
            Accept: 'application/json',
          },
        });

        const encomendas = respostaEncomendas.data;
        const cpfList = encomendas.map((encomenda) => encomenda.recebedor);
        cpfList.push(...encomendas.map((encomenda) => encomenda.coletor));
        const cpfSet = new Set(cpfList);
        const cpfArray = Array.from(cpfSet);

        const usuariosResponse = await axios.post('http://localhost:3000/usuarios/list', { cpfs: cpfArray });
        const { usuarios } = usuariosResponse.data;

        this.rows = encomendas.map((encomenda) => ({
          ...encomenda,
          recebedor: usuarios.find((usuario) => usuario.cpf === encomenda.recebedor)?.nome || '',
          coletor: usuarios.find((usuario) => usuario.cpf === encomenda.coletor)?.nome || '',
        }));
      } catch (error) {
        console.error(error);
      }
    },
    decodificarToken() {
      const tokenUsuario = sessionStorage.getItem('token');
      const tokenParts = tokenUsuario.split('.');
      const encodedPayload = tokenParts[1];
      const decodedPayload = decodeURIComponent(window.atob(encodedPayload).split('').map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`).join(''));
      return JSON.parse(decodedPayload);
    },
    Voltar() {
      this.$router.push({ name: `Encomendas-${this.decodificarToken().tipoUsuario}` });
    },
    irParaCadastrarEncomendas() {
      this.$router.push({ name: `EncomendasCreate-${this.decodificarToken().tipoUsuario}` });
    },
    editar(item) {
      this.$router.push({ name: `EncomendasEdit-${this.decodificarToken().tipoUsuario}`, params: { id: item.id } });
    },
    exibirDialogoDeletar(item) {
      this.mostrarDialogoDeletar = true;
      this.guardarEncomenda = item;
    },
    fecharDialogoDeletar() {
      this.mostrarDialogoDeletar = false;
    },
    async deletar(item) {
      // eslint-disable-next-line no-restricted-globals, no-alert
<<<<<<< Updated upstream
      if (this.mostrarDialogoExcluir && item.id) {
        try {
          const response = await axios.delete(`http://localhost:3000/encomendas/delete/${item.id}`);
          this.mostrarDialogoExcluir = false;
          if (response.status === 200) {
            this.getEncomendas();
          }
        } catch (error) {
          console.error(error);
=======
      try {
        const response = await axios.delete(`http://localhost:3000/encomendas/delete/${item.id}`);
        if (response.status === 200) {
          this.getEncomendas();
          this.fecharDialogoDeletar();
>>>>>>> Stashed changes
        }
      } catch (error) {
        console.error(error);
      }
    },
    mostrarDialogo(row) {
      this.mostrarDialogoExcluir = true;
      this.linhaExcluir = row;
      this.mensagemAlerta = `Deseja excluir o item ${row.identificacao}?`;
    },
    fecharDialogoSair() {
      this.mostrarDialogoExcluir = false;
    },
  },
};
</script>
