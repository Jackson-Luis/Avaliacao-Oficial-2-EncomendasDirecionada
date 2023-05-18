<template>
  <div class="q-pa-md" style="max-width: 400px">

    <q-form
      @submit="onSubmit"
      @reset="onReset"
      class="q-gutter-md"
    >
      <q-input
        filled
        v-model="nome"
        label="Identificação do apartamento"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'O Campo é obrigatório']"
      />

      <q-input
        filled
        v-model="cpf"
        label="Digite o  CPF"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'O Campo é obrigatório']"
      />

      <div>
        <q-btn label="Submit" type="submit" color="primary"/>
        <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
      </div>
    </q-form>

  </div>
</template>

<script>
export default {
  name: 'CadastrarApartamento',
};
</script>

<style>

</style>
