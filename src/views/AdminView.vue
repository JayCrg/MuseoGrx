<script setup>
import { onMounted, ref } from 'vue'
import IngresarObra from '../components/component_admin/IngresarObra.vue'
import BorrarObra from '../components/component_admin/BorrarObra.vue'
import EditarObra from '../components/component_admin/EditarObra.vue'
import IngresasAutor from '../components/component_admin/IngresasAutor.vue'
import BorrarAutor from '../components/component_admin/BorrarAutor.vue'
import EditarAutor from '../components/component_admin/EditarAutor.vue'
// import ConsultarEntradas from '../components/component_admin/ConsultarEntradas.vue'
import CrearAdmin from '../components/component_admin/CrearAdmin.vue'
import EditarAdmin from '../components/component_admin/EditarAdmin.vue'

import {onAuthStateChanged, getAuth} from 'firebase/auth'
import { auth } from '../firebase.js'
import router from '../router/index.js';
import { ref as ref2, getStorage, uploadBytes, getDownloadURL } from 'firebase/storage'
import { addDoc, collection, getFirestore, doc, getDoc, getDocs, query, where, orderBy, deleteDoc, updateDoc, setDoc } from 'firebase/firestore'
import { useCollection, useFirestore } from 'vuefire'
import { db, storage } from '../firebase.js'
import { onBeforeMount } from 'vue'



const props = defineProps(['adminConfirmado', 'registrado'])

var apartado = ref('')

var dicAutores = ref([])
var dicObras = ref([])
var dicUsuarios = ref({'admin':[], 'usuario':[]})



onAuthStateChanged(auth, (user) => {
  if (user) {

    } else {
      router.push({ name: 'home' });

  }
})
onBeforeMount(() => {
  if(props.adminConfirmado == false){
    router.push({ name: 'home' });
  }
})

const obtenerAutores = async () => {
  const q = query(collection(db, "autores"), orderBy("nombre"));
  const querySnapshot = await getDocs(q);
  dicAutores.value = []
  querySnapshot.forEach((doc) => {
    dicAutores.value.push({ value: doc.id, label: doc.data().nombre });
  });
}

const obtenerObras = async () => {
  const q = query(collection(db, "obras"), orderBy("titulo"));
  const querySnapshot = await getDocs(q);
  dicObras.value = []
  querySnapshot.forEach((doc) => {
    dicObras.value.push({ value: doc.id, label: doc.data().titulo });
  });
}

const obtenerUsuarios = async () => {
    const q = query(collection(db, "usuarios"));
    const querySnapshot = await getDocs(q);
    dicUsuarios.value = {'admin':[], 'usuario':[]} // Limpiar el array
    querySnapshot.forEach((doc) => {
        if(doc.data().admin == true){
            dicUsuarios.value['admin'].push({ value: doc.id, label: doc.data().name });
        }
        else{
            dicUsuarios.value['usuario'].push({ value: doc.id, label: doc.data().name });
        }
    });
}

onMounted(() => {
  obtenerAutores()
  obtenerObras()
  obtenerUsuarios()
})

</script>
<template>
  <main id="administration">
    <section class="accordion accordion-flush" id="accordionFlushExample">
  <div class="accordion-item">
    <p class="accordion-header">
      <button class="accordion-button collapsed customBtn-acordeon" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
        Autores
      </button>
    </p>
    <div id="flush-collapseOne" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
      <div class="accordion-body">
        <button class="btn customBtn" @click="apartado='crearAutor'">Crear Nueva Autor</button >
        <button  class="btn customBtn" @click="apartado='editarAutor'">Editar Autor</button >
        <button  class="btn customBtn" @click="apartado='borrarAutor'">Borrar Autor</button >
      </div>
    </div>
  </div>
  <div class="accordion-item">
    <p class="accordion-header">
      <button class="accordion-button collapsed customBtn-acordeon" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
        Obras
      </button>
    </p>
    <div id="flush-collapseTwo" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
      <div class="accordion-body ">
        <button class="btn customBtn" @click="apartado='crearObra'">Crear Nueva Obra</button>
        <button class="btn customBtn" @click="apartado='editarObra'">Editar Obra</button>
        <button class="btn customBtn" @click="apartado='borrarObra'">Borrar Obra</button>
      </div>
    </div>
  </div>
  <div class="accordion-item">
    <p class="accordion-header">
      <button class="accordion-button collapsed customBtn-acordeon" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseThree" aria-expanded="false" aria-controls="flush-collapseThree">
        Miscel&aacute;neos
      </button>
    </p>
    <div id="flush-collapseThree" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
      <div class="accordion-body">
        <button class="btn customBtn" @click="apartado='crearAdmin'">Crear Admin</button>
        <button class="btn customBtn" @click="apartado='cambiarAdmin'">Editar Admin</button>
        <button class="btn customBtn" @click="apartado='infoEntradas'">Consultar Entradas</button>
    </div>
  </div>
</div>
  <!-- relleno -->
  <div class="accordion-item">
  </div>
</section>

<!-- Secion en la que aparecen los formularios varios -->
<section class="cuerpo">

 <article class="vacio" v-if="apartado==''">
  <h2 class="texto"> Bienvenido a la sección de administraci&oacute;n <font-awesome-icon :icon="['fas', 'file']" /></h2>
<p>Seleccione qu&eacute; quiere hacer</p>
</article>

<article class="formulario" v-if="apartado=='crearObra'">
  <h2 id="crearObra" class="resaltado">Crear <span>Obra</span></h2>
  <IngresarObra @actualizarLista="obtenerObras" :autores=dicAutores />
</article>

<article class="formulario" v-if="apartado=='borrarObra'">
  <h2 id="borrarObra" class="resaltado">Borrar <span>Obra</span></h2>
  <BorrarObra @actualizarLista="obtenerObras" :obras=dicObras />
</article>

<article class="formulario" v-if="apartado=='editarObra'">
  <h2 id="editarObra" class="resaltado">Editar <span>Obra</span></h2>
  <EditarObra @actualizarLista="obtenerObras" :obras=dicObras :autores=dicAutores />
</article>

<article class="formulario" v-if="apartado=='crearAutor'">
  <h2 id="crearAutor" class="resaltado">Crear <span>Autor</span></h2>
  <IngresasAutor @actualizarLista="obtenerAutores" />
</article>

<article class="formulario" v-if="apartado=='borrarAutor'">
  <h2 id="borrarAutor" class="resaltado">Borrar <span>autor</span></h2>
  <BorrarAutor @actualizarListaAutores="obtenerAutores" @actualizarListaObras="obtenerObras" :autores=dicAutores />
</article>

<article class="formulario" v-if="apartado=='editarAutor'">
  <h2 id="editarAutor" class="resaltado">Editar <span>Autor</span></h2>
  <EditarAutor @actualizarLista="obtenerAutores" :autores=dicAutores />
</article>

<article class="formulario" v-if="apartado=='crearAdmin'">
  <h2 id="editarAutor" class="resaltado">Crear <span>Admin</span></h2>
  <CrearAdmin @actualizarLista="obtenerUsuarios"/>
</article>

<article class="formulario" v-if="apartado=='cambiarAdmin'">
  <h2 id="editarAutor" class="resaltado">Editar <span>Admin</span></h2>
  <EditarAdmin :usuarios="dicUsuarios" @actualizarLista="obtenerUsuarios"/>
</article>

<article class="formulario" v-if="apartado=='infoEntradas'">
  <h2 id="editarAutor" class="resaltado">Consultar <span>Entradas</span></h2>
  <!-- <ConsultarEntradas /> -->
</article>

</section>

 </main>
</template>

<style></style>