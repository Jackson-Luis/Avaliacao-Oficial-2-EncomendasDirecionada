<template>
  <q-dialog v-model="showDialog" position="bottom" class="alert-dialog">
    <q-card class="alert-card">
      <q-card-section class="row items-center justify-center">
        <q-icon name="check" size="40px" class="text-green" />
        <div class="text-center text-green">{{ texto }}</div>
      </q-card-section>
      <q-separator dark />
      <q-card-actions align="center">
        <q-btn label="Fechar" color="green" text-color="white" @click="close" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  props: {
    texto: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      showDialog: false,
    };
  },
  methods: {
    open() {
      this.showDialog = true;
    },
    close() {
      this.showDialog = false;
      this.$router.back();
    },
  },
};
</script>

<style scoped>
.alert-dialog {
  max-width: 200px;
  margin: auto;
  bottom: 16px;
}

.alert-card {
  background-color: #0fe94d;
}

.text-green {
  color: #4caf50;
}
</style>
