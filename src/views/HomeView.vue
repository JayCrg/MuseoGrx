<script setup>
import { ref } from 'vue'
import { onMounted } from 'vue'
import { onUnmounted } from 'vue'
import rellax from 'rellax'
import { ref as ref2, getStorage, uploadBytes, getDownloadURL } from 'firebase/storage'
import { addDoc, collection, getFirestore, doc, getDoc, getDocs, query, where, orderBy, deleteDoc, updateDoc, setDoc } from 'firebase/firestore'
import { useCollection, useFirestore } from 'vuefire'
import { db, storage } from '../firebase.js'



const rellaxValue = ref(true)
const dicExposiciones = ref([])
onMounted(() => {
  document.title = 'Inicio | MuseoGRX';
    new rellax('.rellax', {breakpoints:[426, 767, 992]});
    window.scrollTo({
            top: 0,
            behavior: "smooth"
    });
    obtenerExposiciones()
  
  });
  
  const obtenerExposiciones = async () => {
    const q = query(collection(db, "exposiciones"), orderBy("titulo"));
    const querySnapshot = await getDocs(q);
    dicExposiciones.value = []
    querySnapshot.forEach((doc) => {
      dicExposiciones.value.push({ titulo: doc.data().titulo, cuerpo: doc.data().cuerpo, imagen: doc.data().obra });
    });
    console.log(dicExposiciones.value)
}
</script>

<template>
  <main id="home">
    <section :class="{'p-5 text-center bg-image' : true, rellax: rellaxValue}" data-rellax-zindex="-1" 
    data-rellax-speed="-3" data-rellax-mobile-speed="-2" id="hero">
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
    <template v-for="exposicion in dicExposiciones" :key="exposicion.titulo">
      <div class="card text-bg-dark">
  <img :src=exposicion.imagen class="card-img" :alt=exposicion.titulo>
  <div class="card-img-overlay">
    <h5 class="card-title">Card title</h5>
    <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
    <p class="card-text"><small>Last updated 3 mins ago</small></p>
  </div>
</div>
</template>
</section>
  </main>
</template>
