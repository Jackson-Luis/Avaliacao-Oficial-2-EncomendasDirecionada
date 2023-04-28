<template>
  <router-view />
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
  created() {
    if (!sessionStorage.getItem('token')) {
      this.$router.push('/login');
    }
  },
});
</script>
