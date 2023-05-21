<!-- eslint-disable prefer-destructuring -->
<!-- eslint-disable linebreak-style -->
<template>
  <q-page>
    <div id="q-app" style="min-height: 100vh;">
      <div class="q-pa-md">
        <div class="q-pa-md cadastrar">
          <div class="q-gutter-y-md column" style="">

            <q-input outlined v-model="identificacaoItem" label="Identificação do item"
            placeholder="Ex:Caixa da cabum"></q-input>

            <q-select outlined v-model="apartamentoNumero" :options="apartamentosNumero"
            label="Apartamento destinatario"></q-select>

            <q-input outlined v-model="dataRecebimento" label="Data de recebimento" type="date"
            placeholder="01/01/2000"></q-input>

            <q-select outlined v-model="recebedor" :options="usuariosNome"
            label="Recebedor"></q-select>

            <q-checkbox v-model="mostrarEncomendaRecebida" label="Encomenda foi retirada?"
            class="custom-label" style="color: black;"/>

            <div v-if="mostrarEncomendaRecebida" class="q-gutter-sm">

            <q-input outlined v-model="coletor" label="Coletor"></q-input>

            <q-input class="q-mt-md" outlined v-model="dataRetirada"
            label="Data de retirada" type="date" placeholder="01/01/2000"></q-input>

            </div>

              <div class="row justify-center">
                <div class="col-auto">
                  <q-btn @click = 'editar()'
                  color="green" label="Editar"></q-btn>
                  <q-btn @click = 'voltar()' color="green"
                  class="q-ml-md" label="Voltar"></q-btn>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>
<!-- eslint-disable linebreak-style -->
<script>
import axios from 'axios';

export default {
  data() {
    return {
      idEncomenda: null,
      encomendaSelecionada: {},
      cadastro: {},
      identificacaoItem: '',
      coletor: '',
      dataRecebimento: '',
      dataRetirada: '',
      recebedor: '',
      apartamentoNumero: '',
      mostrarEncomendaRecebida: false,
      usuarios: [],
      apartamentos: [],
      usuariosNome: [],
      apartamentosNumero: [],
    };
  },
  async created() {
    const route = this.$route;
    this.idEncomenda = route.params.id;

    try {
      const encomendaResponse = await axios.get(`http://localhost:3000/encomendas?id=${this.idEncomenda}`);
      // eslint-disable-next-line prefer-destructuring
      this.encomendaSelecionada = encomendaResponse.data[0];
      this.identificacaoItem = this.encomendaSelecionada.identificacao;
      this.coletor = this.encomendaSelecionada.coletor;
      this.dataRecebimento = this.encomendaSelecionada.dataRecebimento;
      this.dataRetirada = this.encomendaSelecionada.dataRetirada;
      this.recebedor = this.encomendaSelecionada.recebedor;
      this.apartamentoNumero = this.encomendaSelecionada.destinatario;

      const usuariosResponse = await axios.get('http://localhost:3000/usuarios');
      this.usuarios = usuariosResponse.data;
      this.usuariosNome = this.usuarios.reduce((acc, usuario) => [...acc, usuario.nome], []);

      const apartamentosResponse = await axios.get('http://localhost:3000/apartamentos');
      this.apartamentos = apartamentosResponse.data;
      this.apartamentosNumero = this.apartamentos.reduce((
        acc,
        apartamento,
      ) => [...acc, apartamento.identificacao], []);
    } catch (error) {
      console.error(error);
    }
  },
  methods: {
    decodificarToken() {
      const tokenUsuario = sessionStorage.getItem('token');
      const tokenParts = tokenUsuario.split('.');
      const encodedPayload = tokenParts[1];
      const decodedPayload = decodeURIComponent(window.atob(encodedPayload).split('').map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`).join(''));
      return JSON.parse(decodedPayload);
    },
    voltar() {
      this.$router.push({ name: `Encomendas-${this.decodificarToken().tipoUsuario}` });
    },
    editar() {
      if (
        this.identificacaoItem === ''
        || this.dataRecebimento === ''
        || this.recebedor === ''
        || this.apartamentoNumero === ''
      ) {
        return;
      }
      if (
        (this.mostrarEncomendaRecebida === true && this.coletor === '')
        || (this.mostrarEncomendaRecebida === true && this.dataRetirada === '')
      ) {
        return;
      }

      this.cadastro = {
        identificacao: this.identificacaoItem,
        dataRecebimento: this.dataRecebimento,
        dataRetirada: this.dataRetirada,
        destinatario: this.apartamentoNumero,
        recebedor: this.recebedor,
        coletor: this.coletor,
      };

      axios
        .put(`http://localhost:3000/encomendas/update/${this.idEncomenda}`, this.cadastro, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          // Handle the response here
          console.log(response.data);
          alert('Editado com sucesso!');
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
};
</script>
<!-- eslint-disable linebreak-style -->
<style lang="scss">
.cadastrar {
  color: $red-1;
  background-color: $grey-2;
}
</style>
