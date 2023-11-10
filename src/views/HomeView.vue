<script setup>
import { ref } from 'vue'
import { onMounted } from 'vue'
import rellax from 'rellax'
import { ref as ref2, getStorage, uploadBytes, getDownloadURL } from 'firebase/storage'
import { addDoc, collection, getFirestore, doc, getDoc, getDocs, query, where, orderBy, deleteDoc, updateDoc, setDoc } from 'firebase/firestore'
import { useCollection, useFirestore } from 'vuefire'
import { db, storage } from '../firebase.js'
import Loading from '../components/Loading.vue'
import router from '../router/index.js';



const rellaxValue = ref(true)
var loading = ref(true)
const dicExposiciones = ref([])
var invisible = ref(true)
onMounted(() => {
  document.getElementsByTagName("body")[0].style.overflow = "hidden"
  document.title = 'Inicio | MuseoGRX';
  new rellax('.rellax', { breakpoints: [426, 767, 992] });
  obtenerExposiciones()
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  window.addEventListener('scroll', verificarDesplazamiento);
});

function verificarDesplazamiento(){
    invisible.value = window.scrollY < 400
}

function inicio(){
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}



const obtenerExposiciones = async () => {
  const q = query(collection(db, "exposiciones"), orderBy("titulo"));
  const querySnapshot = await getDocs(q);
  dicExposiciones.value = []
  querySnapshot.forEach((doc) => {
    dicExposiciones.value.push({ titulo: doc.data().titulo, cuerpo: doc.data().cuerpo, imagen: doc.data().obra });
  });
  console.log(dicExposiciones.value)
  loading.value = false
  document.getElementsByTagName("body")[0].style.overflow = "auto"
}

function empezar() {
  const element = document.getElementById(0)
  element.scrollIntoView({ behavior: 'smooth' })

}

function siguiente(index) {
  var alturaElemento = document.getElementById(index).offsetTop
  window.scrollTo({
    top: alturaElemento + window.innerHeight,
    behavior: "smooth"
  });
}

</script>

<template>
  <Loading v-if="loading" />
  <main id="home">
    <section :class="{ 'p-5 text-center bg-image': true, rellax: rellaxValue }" data-rellax-zindex="-1"
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
            <font-awesome-icon icon="angle-down" :class="{ 'pasarArticulo primero': true }" 
            data-rellax-speed="2" data-rellax-mobile-speed="1"  @click="empezar" />
          </div>
        </div>
      </div>
    </section>
    <section class="cuerpo">
      <template v-for="(exposicion, index) in dicExposiciones" :key="exposicion.titulo">
        <div class="card text-bg-dark exposicion" :id="index">
          <img :src=exposicion.imagen class="card-img" :alt=exposicion.titulo>
          <div class="card-img-overlay presentacion">
            <h5 class="card-title">{{ exposicion.titulo }}</h5>
            <button class="btn customBtn-home" data-bs-toggle="modal" :data-bs-target="'#modal'+index"><font-awesome-icon :icon="['fas', 'plus']" /></button>
          </div>
          <font-awesome-icon icon="angle-down" class="pasarArticulo centrar" @click="siguiente(index)" />
        </div>
        <!-- modal -->
        <div class="modal fade textoExpo" :id="'modal'+index" tabindex="-1" :aria-labelledby="'exampleModalLabel'+index" aria-hidden="true">
          <div class="modal-dialog modal-fullscreen-sm-down">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" :id="'exampleModalLabel'+index">{{ exposicion.titulo }}</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                {{ exposicion.cuerpo }}
              </div>
              <div class="modal-footer">
                <button class="btn customBtn-signup" name="comprarEntrada"
                title="Ir a entradas" id="comprar_entrada" data-bs-dismiss="modal" aria-label="Close" @click="router.push({name: 'entradas'})">Comprar Entrada</button>
              </div>
            </div>
          </div>
        </div>
      </template>
    </section>
    <aside id="volverInicio" :class="{'invisible': invisible}">
      <font-awesome-icon icon="angle-down" rotation="180" class="volver" @click="inicio" title="Volver al inicio" />
    </aside>
  </main>
</template>
