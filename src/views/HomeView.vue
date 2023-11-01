<script setup>
import { ref } from 'vue'
import { onMounted } from 'vue'
import { onUnmounted } from 'vue'
import rellax from 'rellax'


const rellaxValue = ref(true)
onMounted(() => {
    new rellax('.rellax', {});
  });





</script>

<template>
  <main id="home">
    <section :class="{'p-5 text-center bg-image' : true, rellax: rellaxValue}" data-rellax-zindex="-1" id="hero">
    <div class="mask">
      <div class="d-flex justify-content-center align-items-center h-100">
        <div class="text">
          <blockquote class="texto-hero">
            <h3>
              No tengas miedo de la perfección, nunca la alcanzarás.
            </h3>
            <footer>
              <cite title="Source Title">Salvador Dalí</cite>
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  </section>
  <section class="cuerpo">

  </section>
  </main>
</template>
