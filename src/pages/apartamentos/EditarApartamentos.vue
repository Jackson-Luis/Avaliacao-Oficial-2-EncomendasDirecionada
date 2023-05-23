<!-- eslint-disable max-len -->
<!-- eslint-disable radix -->
<template>
  <AlertVue ref="alertaVue" :texto="textoAlert" />
  <div class="q-pa-md" style="max-width: 400px">

    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <q-input filled v-model="identificacao" label="Identificação do apartamento" lazy-rules
        :rules="[val => val && val.length > 0 || 'O Campo é obrigatório']" />
      <q-select filled v-model="cpf" use-input input-debounce="0" label="Buscar o CPF" :options="options"
        @filter="filterFn">
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              No results
            </q-item-section>
          </q-item>
        </template>
      </q-select>

      <div>
        <q-btn label="Salvar" type="submit" color="primary" />
        <q-btn label="Cancelar" type="reset" color="primary" flat class="q-ml-sm" @click="cancelar" />
      </div>
    </q-form>

  </div>
</template>

<script>
import axios from 'axios';
import AlertVue from 'src/components/Alert.vue';

export default {
  name: 'ApartamentoEditar',
  components: {
    AlertVue,
  },
  data() {
    return {
      options: '',
      identificacao: '',
      cpf: '',
      stringOptions: [],
    };
  },
  async created() {
    const response = await axios.post('http://localhost:3000/usuarios/list');
    this.stringOptions = response.data.usuarios.filter((val) => !['sindico', 'porteiro'].includes(val.tipo)).map((item) => {
      item.label = `${item.nome} - ${item.cpf}`;
      item.value = item.cpf;
      delete item.tipo;
      delete item.cpf;
      delete item.nome;
      delete item.id;
      return item;
    });
  },
  async mounted() {
    this.id = this.$route.params.id; // Obtenha o ID da rota
    console.log(this.id);
    try {
      const response = await axios.get(`http://localhost:3000/apartamentos/${this.id}`);
      const responseUsuario = await axios.get(`http://localhost:3000/usuarios/cpf/${response.data.cpf}`);
      this.identificacao = response.data.identificacao;
      console.log(responseUsuario);
      this.cpf = {
        label: `${responseUsuario.data.usuario.nome} - ${response.data.cpf}`,
        value: response.data.cpf,
      };
    } catch (error) {
      console.error(error);
    }
  },
  methods: {
    async onSubmit() {
      // Fazer a chamada para salvar os dados do usuário
      const {
        id, identificacao, cpf,
      } = this;
      const apartamentos = {
        id,
        identificacao,
        cpf: cpf.value,
      };

      try {
        await axios.put(`http://localhost:3000/apartamentos/update/${id}`, apartamentos);
        // Lógica de redirecionamento ou exibição de mensagem de sucesso
        this.textoAlert = 'Apartamento editado com sucesso';
        this.$refs.alertaVue.open();
      } catch (error) {
        // Lógica de exibição de mensagem de erro
        console.error('Erro ao criar o apartamento:', error);
      }
    },
    filterFn(val, update) {
      if (val === '') {
        update(() => {
          this.options = this.stringOptions;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.options = this.stringOptions.filter((v) => (
          v.label.toLowerCase().indexOf(needle) > -1
        ));
      });
    },
    cancelar() {
      this.$router.back();
    },
  },
};
</script>
