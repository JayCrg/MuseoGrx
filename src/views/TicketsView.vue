<script setup>
import { ref } from 'vue';
const date = ref(new Date());

const masks = ref({
  modelValue: 'YYYY-MM-DD',
});



</script>
<template>
  <main id="tickets">
    <h2 class="resaltado">Comprar <span>Entradas</span></h2>
    <section class="calendario">
      <h4>Elija un d&iacute;a</h4>
      <VDatePicker v-model="date" mode="date" :masks="masks" expanded/>
    </section>
    
  </main>
</template>

<style>
</style>