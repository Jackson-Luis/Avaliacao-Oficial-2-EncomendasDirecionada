<!-- eslint-disable no-alert -->
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

              <div class="row justify-center">
                <div class="col-auto">
                  <q-btn @click = 'cadastrar()'
                  color="green" label="Cadastrar"></q-btn>
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
import { defineComponent } from 'vue';
import axios from 'axios';
<script>
import { defineComponent } from 'vue';
import axios from 'axios';

export default defineComponent({
  data() {
    return {
      cadastro: {},
      identificacaoItem: '',
      coletor: '',
      dataRecebimento: '',
      dataRetirada: '',
      recebedor: null,
      apartamentoNumero: null,
      usuariosNome: [],
      apartamentosNumero: [],
    };
  },
  async created() {
    try {
      const usuariosResponse = await axios.get('http://localhost:3000/usuarios?tipo=porteiro', {
        headers: {
          Accept: 'application/json',
        },
      });
      const usuarios = usuariosResponse.data;
      this.usuariosNome = usuarios.reduce((acc, usuario) => [...acc, usuario.nome], []);

      const apartamentosResponse = await axios.get('http://localhost:3000/apartamentos', {
        headers: {
          Accept: 'application/json',
        },
      });
      const apartamentos = apartamentosResponse.data;
      this.apartamentosNumero = apartamentos.reduce((
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
    async cadastrar() {
      if (
        this.identificacaoItem === ''
        || this.dataRecebimento === ''
        || this.recebedor === null
        || this.apartamentoNumero === null
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

      this.identificacaoItem = '';
      this.dataRecebimento = '';
      this.dataRetirada = '';
      this.recebedor = null;
      this.coletor = null;
      this.apartamentoNumero = null;

      try {
        const response = await axios.post('http://localhost:3000/encomendas/create', this.cadastro, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });
        const encomendas = response.data;
        // eslint-disable-next-line consistent-return
        return encomendas;
      } catch (error) {
        console.error(error);
        // eslint-disable-next-line consistent-return
        return null;
      }
    },
  },
});
</script>
<!-- eslint-disable linebreak-style -->
<style lang="scss">
.cadastrar {
  color: $red-1;
  background-color: $grey-2;
}
</style>
