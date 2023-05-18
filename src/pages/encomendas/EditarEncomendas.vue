<!-- eslint-disable linebreak-style -->
<template>
  <q-page>
    <q-header elevated>
        <q-toolbar class="bg-green text-white">
          <q-btn @click="$router.go(-1)" flat round dense icon="arrow_back"/>
                <q-toolbar-title class="text-center" >Editar encomendas</q-toolbar-title>
        </q-toolbar>
      </q-header>
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
                  <q-btn @click = 'editar()' color="green" label="Editar"></q-btn>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>
<!-- eslint-disable linebreak-style -->
<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
// import axios from 'src/boot/axios';

const route = useRoute();
const idEncomenda = route.params.id;

const encomendaSelecionada = await
fetch(`http://localhost:3000/encomendas?id=${idEncomenda}`, {
  method: 'GET',
  headers: {
    Accept: 'application/json',
  },
}).then((response) => response.json());
const cadastro = ref({});
const identificacaoItem = ref(`${encomendaSelecionada[0].identificacao}`);
const coletor = ref(`${encomendaSelecionada[0].coletor}`);
const dataRecebimento = ref(`${encomendaSelecionada[0].dataRecebimento}`);
const dataRetirada = ref(`${encomendaSelecionada[0].dataRetirada}`);
const recebedor = ref(`${encomendaSelecionada[0].recebedor}`);
const apartamentoNumero = ref(`${encomendaSelecionada[0].destinatario}`);
const mostrarEncomendaRecebida = ref(false);

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

const editar = async () => {
  if (identificacaoItem.value === ''
  || dataRecebimento.value === ''
  || recebedor.value === null
  || apartamentoNumero.value === null) {
    return;
  }
  if ((mostrarEncomendaRecebida.value === true && coletor.value === '') || (mostrarEncomendaRecebida.value === true && dataRetirada.value === '')) {
    return;
  }
  // eslint-disable-next-line no-shadow
  const apartamento = apartamentos.find((apartamento) => apartamento
    .identificacao === apartamentoNumero.value);

  cadastro.value = {
    identificacao: identificacaoItem.value,
    dataRecebimento: dataRecebimento.value,
    dataRetirada: dataRetirada.value,
    destinatario: apartamentoNumero.value,
    recebedor: recebedor.value,
    coletor: coletor.value,
    idApartamento: apartamento.id,
  };

  const encomendas = await fetch(`http://localhost:3000/encomendas/update/${idEncomenda}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cadastro.value),
  }).then((response) => response.json());

  alert('Editado com sucesso!');
  // eslint-disable-next-line consistent-return
  return encomendas;
};
</script>
<!-- eslint-disable linebreak-style -->
<style lang="scss">
.cadastrar {
  color: $red-1;
  background-color: $grey-2;
}
</style>
