<!-- eslint-disable linebreak-style -->
<script setup>
import { ref } from 'vue';

const cadastro = ref({});
const identificacaoItem = ref('');
const coletor = ref(null);
const dataRecebimento = ref('');
const dataRetirada = ref('');
const recebedor = ref(null);
const apartamentoNumero = ref(null);

const usuarios = await fetch('http://localhost:3000/usuarios', {
  method: 'GET',
  headers: {
    Accept: 'application/json',
  },
}).then((response) => response.json());

const apartamentos = await fetch('http://localhost:3000/apartamentos', {
  method: 'GET',
  headers: {
    Accept: 'application/json',
  },
}).then((response) => response.json());

const usuariosNome = usuarios.reduce((acc, usuario) => [...acc, usuario.nome], []);
const apartamentosNumero = apartamentos.reduce((
  acc,
  apartamento,
) => [...acc, apartamento.identificacao], []);

const cadastrar = async () => {
  if (identificacaoItem.value === ''
  || dataRecebimento.value === ''
  || dataRetirada.value === ''
  || recebedor.value === null
  || coletor.value === null
  || apartamentoNumero.value === null) {
    return;
  }

  // eslint-disable-next-line no-shadow
  const apartamento = apartamentos.find((apartamento) => apartamento
    .identificacao === apartamentoNumero.value);

  cadastro.value = {
    identificacao: identificacaoItem.value,
    dataRcebimento: dataRecebimento.value,
    dataRetirada: dataRetirada.value,
    destinatario: apartamentoNumero.value,
    recebedor: recebedor.value,
    coletor: coletor.value,
    idApartamento: apartamento.id,
  };

  identificacaoItem.value = '';
  dataRecebimento.value = '';
  dataRetirada.value = '';
  recebedor.value = null;
  coletor.value = null;
  apartamentoNumero.value = null;

  const encomendas = await fetch('http://localhost:3000/encomendas/create', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cadastro.value),
  }).then((response) => response.json());

  // eslint-disable-next-line consistent-return
  return encomendas;
};

</script>
<!-- eslint-disable linebreak-style -->
<template>
  <q-page>
    <q-header elevated>
        <q-toolbar class="bg-green text-white">
          <q-btn flat round dense icon="arrow_back"/>
                <q-toolbar-title class="text-center" >Cadastro de encomendas</q-toolbar-title>
        </q-toolbar>
      </q-header>
    <div id="q-app" style="min-height: 100vh;">
      <div class="q-pa-md">
        <div class="q-pa-md cadastro">
          <div class="q-gutter-y-md column" style="">

            <q-input outlined v-model="identificacaoItem" label="Identificação do item"
            placeholder="Ex:Caixa da cabum"></q-input>

            <q-select outlined v-model="apartamentoNumero" :options="apartamentosNumero"
            label="Apartamento destinatario"></q-select>

            <q-select outlined v-model="coletor" :options="usuariosNome" label="Coletor"></q-select>

            <q-input outlined v-model="dataRecebimento" label="Data de recebimento" type="date"
            placeholder="01/01/2000"></q-input>

            <q-input outlined v-model="dataRetirada" label="Data de retirada" type="date"
            placeholder="01/01/2000"></q-input>

            <q-select outlined v-model="recebedor" :options="usuariosNome"
            label="Recebedor"></q-select>

              <div class="row justify-center">
                <div class="col-auto">
                  <q-btn @click = 'cadastrar()' color="green" label="Cadastrar"></q-btn>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>
<!-- eslint-disable linebreak-style -->
<style lang="scss">
.cadastro {
  color: $red-1;
  background-color: $grey-2;
}
</style>
