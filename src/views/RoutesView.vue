<script setup>
import Loading from '../components/Loading.vue';

import { ref, onMounted } from 'vue';
import { onAuthStateChanged, getAuth } from 'firebase/auth'
import { auth } from '../firebase.js'
import router from '../router/index.js';
import { ref as ref2, getStorage, uploadBytes, getDownloadURL } from 'firebase/storage'
import { addDoc, collection, getFirestore, doc, getDoc, getDocs, query, where, orderBy, deleteDoc, updateDoc, setDoc } from 'firebase/firestore'
import { useCollection, useFirestore } from 'vuefire'
import { db, storage } from '../firebase.js'
import { onBeforeMount } from 'vue'
import { set } from 'date-fns';

var loading = ref(true)
onMounted(() => {
  loading.value = true
  document.title = 'Rutas Favoritas | MuseoGRX';
  window.scrollTo({
    top: 0,
    behavior: "instant"
  });
  obtenerRutasParaUser()
});

onBeforeMount(() => {
  if (props.registrado == false) {
    router.push({ name: 'home' });
  }
})

const props = defineProps(['adminConfirmado', 'registrado'])

onAuthStateChanged(auth, (user) => {
  if (user) {

    } else {
      router.push({ name: 'home' });
  }
})

var arrayRutas = ref([])
var mapObrasPorRuta = ref(new Map())
var arrayRutasModal = ref([])


const obtenerRutasParaUser = async () =>{
  loading.value = true
  mapObrasPorRuta.value = new Map()
  arrayRutas.value = []
  const q = query(collection(db, "rutas"), where('uidUser', '==', auth.currentUser.uid));
  const querySnapshot = await getDocs(q);
  if(!querySnapshot.empty){
    querySnapshot.forEach((doc) => {
      arrayRutas.value.push({id: doc.id, nombre: doc.data().nombre, uidAutor: doc.data().uidAutor});
    });
    obtenerObrasPorRuta(arrayRutas.value)
  }
  else{
  }
  loading.value = false
}

const obtenerObrasPorRuta = async (rutas) => {
  let auxIdRuta = rutas.map(item => item.id)
  let auxObraPorRuta = []
  try{
    const q = query(collection(db, "obrasPorRuta"),where('idRuta', 'in', auxIdRuta), where('uidUser', '==', auth.currentUser.uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      auxObraPorRuta.push( {idRuta: doc.data().idRuta, idObra: doc.data().idObra});
    });
    for (let i = 0; i < Math.min(auxIdRuta.length); i++) {
      mapObrasPorRuta.value.set(auxIdRuta[i], auxObraPorRuta.filter(item => item.idRuta == auxIdRuta[i]).map(item => item.idObra))
    }

  }
  catch(e){
    console.log(e)
  }
}

const obtenerObrasModal = async (arrayObras) => {
  arrayRutasModal.value = []
  const q = query(collection(db, "obras"), where('idAuxiliar', 'in', arrayObras));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    arrayRutasModal.value.push({id: doc.id, titulo: doc.data().titulo, imagen: doc.data().imagenObra});
  });
}

const eliminarRuta = async (idRuta) => {
  try{
    const q = query(collection(db, "obrasPorRuta"), where("idRuta", "==", idRuta))
        const querySnapshot = await getDocs(q)
        if(!querySnapshot.empty){
        querySnapshot.forEach((doc) => {
            deleteDoc(doc.ref)
        })
      }
        deleteDoc(doc(db, "rutas", idRuta))
    obtenerRutasParaUser()
  }
  catch(e){
    console.log(e)
  }
}


var creandoRuta = ref(false)
var nombreNuevaRuta = ref('')

function crearNuevaRuta(e){
  e.preventDefault()
  if(nombreNuevaRuta.value == ''){
    return
  }
  const nuevaRuta = {
    nombre: nombreNuevaRuta.value,
    uidUser: auth.currentUser.uid,
  }
  addDoc(collection(db, "rutas"), nuevaRuta)
  .then((docRef) => {
    creandoRuta.value = false
    nombreNuevaRuta.value = ''
  })
  obtenerRutasParaUser()
}

function iniciarCreacionRuta ()  {
  creandoRuta.value = true
  setTimeout(() => {
    document.getElementById('inputNombreRuta').focus()
  }, 100);
}

function cancelarNuevaRuta ()  {
  creandoRuta.value = false
  nombreNuevaRuta.value = ''
}

function irAObra(idObra){
  router.push({ name: 'detalle', params: { id: idObra } });
}

</script>
<template>
  <Loading v-if="loading" buscando=true />
  <main id="rutas">
    <h2 class="resaltado mb-4">Rutas <span>Favoritas</span></h2>
    <section class="listaRutas">
      <article class="elementoRuta añadirRuta" @click="iniciarCreacionRuta">
        <div>
          <h2><font-awesome-icon :icon="['fas', 'plus']" /></h2>
          <h4>Crear nueva ruta</h4>
        </div>
        <!-- <figcaption class="titulo">
          <h4>A&nacute;adir obra</h4>
        </figcaption> -->
      </article>
      <article class="elementoRuta nuevaRuta" v-if="creandoRuta">
        <div>
          <h4><font-awesome-icon :icon="['far', 'image']" /></h4>
        </div>
        <figcaption class="titulo">
          <form @submit="crearNuevaRuta">
            <h4><input v-model="nombreNuevaRuta" id="inputNombreRuta" name="Nombre" type="text" @blur="cancelarNuevaRuta" ></h4>
          </form>
        </figcaption>
      </article>
      <article class="elementoRuta" v-for="ruta in arrayRutas" :key="ruta.id">
        <div @click="obtenerObrasModal(mapObrasPorRuta.get(ruta.id))" data-bs-toggle="modal" data-bs-target="#modalObrasDeRuta">
          <h4><font-awesome-icon :icon="['far', 'image']" /></h4>
          <h3 v-if="mapObrasPorRuta.get(ruta.id)!=undefined">{{ mapObrasPorRuta.get(ruta.id).length }} Obras</h3>
          <h3 v-else>No hay obras</h3>
        </div>
        <figcaption class="titulo">
          <h4>{{ ruta.nombre }}</h4>
          <span @click="eliminarRuta(ruta.id)" title="Eliminar ruta"><font-awesome-icon :icon="['fas', 'trash']" /></span>
        </figcaption>
      </article>
    </section>
  <div class="modal fade" id="modalObrasDeRuta" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog modal-fullscreen-sm-down modal-dialog-scrollable">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-2" id="staticBackdropLabel">Obras Actuales</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <template v-for="(obra, index) in arrayRutasModal" :key="index" v-if="arrayRutasModal.length>0">
                <figure class="objetoListaObras" :id="'obraRuta-'+index" @click="irAObra(obra.id)" data-bs-dismiss="modal">
                    <div class="objetoListaObras-imagen">
                        <img :src="obra.imagen" :alt="'Imagen de '+ obra.titulo">
                    </div>
                    <figcaption class="objetoListaObras-texto">
                        <h4>{{obra.titulo}}</h4>
                    </figcaption>
                </figure>
        </template>
        <template v-if="arrayRutasModal.length==0">
          <h3>No hay obras en esta ruta</h3>
        </template>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn customBtn" data-bs-dismiss="modal">Salir</button>
      </div>
    </div>
  </div>
</div>
  </main>
</template>

<style></style>