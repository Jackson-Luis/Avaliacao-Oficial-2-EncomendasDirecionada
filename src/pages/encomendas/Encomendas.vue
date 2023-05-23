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
  data() {
    return {
      apartamentosNumero: [],
      apartamentoNumero: ref(''),
      columns: [
        {
          name: 'identificacaoItem', label: 'Identificacao do item', field: 'identificacao',
        },
        {
          name: 'Destinatario', label: 'Destinatario', field: 'destinatario', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
        },
        { name: 'Recebedor', label: 'Recebedor', field: 'recebedor' },
        {
          name: 'DataRecebimento', label: 'Data de recebimento', field: 'dataRecebimento',
        },
        {
          name: 'DataRetirada', label: 'Data de retirada', field: 'dataRetirada',
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
  methods: {
    async getEncomendas() {
      try {
        const respostaEncomendas = await axios.get(`http://localhost:3000/encomendas?destinatario=${this.apartamentoNumero}`, {
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
    async deletar(item) {
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
