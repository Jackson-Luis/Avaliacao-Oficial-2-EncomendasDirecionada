<!-- eslint-disable linebreak-style -->
<template>
  <q-page>
    <div id="q-app" style="min-height: 100vh;">
      <div class="q-pa-md">
          <div class="q-pa-md cadastro">
            <div class="q-gutter-y-md column" style="">
          <q-input outlined v-model="ph" label="Identificação do item"
          placeholder="Ex:Caixa da cabum" :dense="dense"></q-input>

          <q-select outlined v-model="model" :options="options" label="Destinatário"></q-select>

          <q-select outlined v-model="model" :options="options" label="Coletor"></q-select>

          <q-input outlined v-model="ph" label="Data de recebimento"
          placeholder="01/01/2000 " :dense="dense"></q-input>

          <q-input outlined v-model="ph" label="Data de retirada" placeholder="01/01/2000"
          :dense="dense"></q-input>

          <q-select outlined v-model="model" :options="options" label="Recebedor"></q-select>

          <div class="row justify-center">
            <div class="col-auto">
              <q-btn color="positive" label="Cadastrar"></q-btn>
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

</script>
<!-- eslint-disable linebreak-style -->
<style lang="scss">
.cadastro {
  color: $red-1;
  background-color: $grey-2;
}
</style>
