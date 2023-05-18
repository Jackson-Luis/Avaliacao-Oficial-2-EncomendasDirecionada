<!-- eslint-disable no-alert -->
<!-- eslint-disable linebreak-style -->
<template>
  <q-page>
    <q-header elevated>
        <q-toolbar class="bg-green text-white">
          <q-btn @click="$router.go(-1)" flat round dense icon="arrow_back"/>
                <q-toolbar-title class="text-center" >Cadastrar apartamentos</q-toolbar-title>
        </q-toolbar>
      </q-header>
    <div id="q-app" style="min-height: 100vh;">
      <div class="q-pa-md">
        <div class="q-pa-md cadastrar">
          <div class="q-gutter-y-md column" style="">

            <q-input outlined v-model="identificacaoApartamento"
            label="Identificação do apartamento"
            placeholder="Ex: 123B"></q-input>

            <q-input outlined v-model="cpf"
            label="CPF Inquilino"
            placeholder="Ex: 545545454455"></q-input>
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
<script setup>
import { ref } from 'vue';

const cadastro = ref({});
const identificacaoApartamento = ref('');
const cpf = ref('');

const cadastrar = async () => {
  if (identificacaoApartamento.value === ''
  || cpf.value === '') {
    return;
  }

  cadastro.value = {
    identificacao: identificacaoApartamento.value,
    cpf: cpf.value,
  };

  identificacaoApartamento.value = '';
  cpf.value = '';
  const encomendas = await fetch('http://localhost:3000/apartamentos/create', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cadastro.value),
  }).then((response) => response.json());
  // eslint-disable-next-line no-alert
  alert('Cadastro feito com sucesso!');
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
