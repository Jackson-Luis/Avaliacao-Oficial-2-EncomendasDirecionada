<template>
  <div class="q-pa-md" style="max-width: 400px">

    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <q-input filled v-model="name" label="Your name *" hint="Name and surname" lazy-rules
        :rules="[val => val && val.length > 0 || 'Please type something']" />

      <q-input filled type="number" v-model="age" label="Your age *" lazy-rules :rules="[
        val => val !== null && val !== '' || 'Please type your age',
        val => val > 0 && val < 100 || 'Please type a real age'
      ]" />

      <div>
        <q-btn label="Submit" type="submit" color="primary" />
        <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
      </div>
    </q-form>

  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'UsuarioEdit',
  data() {
    return {
      id: this.$route.params.id,
    };
  },
  async mounted() {
    const { id } = this.$route.params; // Obtenha o ID da rota
    console.log(id);
    const responseDelete = await axios.get(`http://localhost:3000/usuarios/${id}`);
    console.log(responseDelete);
  },

};
</script>

<style>
</style>
