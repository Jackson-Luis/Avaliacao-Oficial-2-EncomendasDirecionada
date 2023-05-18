<template>
  <q-page>
  </q-page>
</template>
<script>
import { defineComponent } from 'vue';

export default defineComponent({
  async created() {
    this.$router.push('/inquilino/pendente');
  },
});
</script>

<style></style>
