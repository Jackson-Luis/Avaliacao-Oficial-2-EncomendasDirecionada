<!-- eslint-disable linebreak-style -->
<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container class="bg-positive">
      <suspense>
        <router-view />
      </suspense>
    </q-page-container>
  </q-layout>
</template>
<!-- eslint-disable linebreak-style -->
<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MainLayout',
  setup() {
    return {};
  },
});
</script>
