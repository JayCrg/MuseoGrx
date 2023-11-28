<script setup>
import { onBeforeMount, ref } from 'vue'
import { onMounted } from 'vue'
import Loading from '../components/Loading.vue';
import router from '../router/index.js';

import { ref as ref2, getStorage, uploadBytes, getDownloadURL, updateMetadata } from 'firebase/storage'
import { addDoc, collection, getFirestore, doc, getDoc, getDocs, query, where, orderBy, deleteDoc, updateDoc, setDoc } from 'firebase/firestore'
import { useCollection, useFirestore } from 'vuefire'
import { db, storage } from '../firebase.js'
import { auth } from '../firebase.js'
import {onAuthStateChanged } from "firebase/auth";


const props = defineProps(['id','registrado'])

var mostrarVista = ref(0)

var nombre = ref('')
var vida = ref('')
var muerte = ref('')
// var texto = ref('')
var imagen = ref('')
var idAutor = ref('')

var nombreObra = ref('')
var imagenObra = ref('')
var textoObra = ref('')
var numeroId = ref('')
var autorObra = ref('')
var fechaObra = ref('')
var tecnicaObra = ref('')
var dimensionesObra = ref('')
var idDocument = ref('')

var loading = ref(true)
var textoAuxiliarAutor = ref('')
var textoAuxiliarObra = ref('')

var mostrarTextoCompleto = ref(false)

onMounted(() => {
    loading.value = true
    document.title = 'Detalle | MuseoGRX';
    window.scrollTo({
        top: 0,
        behavior: "instant"
    });
    cargarObra()
});

const cargarAutor = async (autor) => {
    const docRef = doc(db, "autores", autor);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        nombre.value = docSnap.data()["nombre"]
        vida.value = docSnap.data()["vida"]
        muerte.value = docSnap.data()["muerte"]
        // texto.value = docSnap.data()["textoAutor"]
        imagen.value = docSnap.data()["imagenAutor"]
        idAutor.value = docSnap.id
        textoAuxiliarAutor.value = formatearSegmentoTextoAutor(docSnap.data()["textoAutor"])
    }
    else {
        // doc.data() will be undefined in this case
        console.log("No such document! 2");
        mostrarVista.value = 1
        loading.value = false
    }
    loading.value = false

}
const cargarObra = async () => {
    const docRef = doc(db, "obras", props.id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        numeroId.value = docSnap.data()["idObra"]
        nombreObra.value = docSnap.data()["titulo"]
        autorObra.value = docSnap.data()["autor"]
        fechaObra.value = docSnap.data()["fecha"]
        tecnicaObra.value = docSnap.data()["tecnica"]
        dimensionesObra.value = docSnap.data()["dimensiones"]
        textoObra.value = docSnap.data()["textoObra"]
        imagenObra.value = docSnap.data()["imagenObra"]
        idDocument.value = docSnap.id
        cargarAutor(docSnap.data()["autor"])
        textoAuxiliarObra.value = formatearSegmentoTextoObra(docSnap.data()["textoObra"])
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document! 1");
        mostrarVista.value = 1
        loading.value = false
    }
}

function formatearSegmentoTextoAutor(texto) {
    let textoFormateado = texto[0].substring(0, Math.min(150, texto[0].length));
    textoFormateado += "..."
    return textoFormateado
}

function formatearSegmentoTextoObra(texto) {
    let textoFormateado = texto[0].substring(0, Math.min(1000, texto[0].length));
    textoFormateado += "..."
    return textoFormateado
}

function irAutor() {
    router.push({ name: 'detalleAutor', params: { id: idAutor.value } })
}


var sinRutas = ref(true)
var arrayRutas = ref([])
const cargarElementosDeRutas = async () => {
    const q = query(collection(db, "rutas"), where("uidUser", "==", auth.currentUser.uid ));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        arrayRutas.value = []
        sinRutas.value = false
        querySnapshot.forEach((doc) => {
            arrayRutas.value.push({
                id: doc.id,
                nombre: doc.data()["nombre"],
            })
        });
        comprobarSiObraFavorita()
    }
}
const anadirARuta = async (idRuta) => {
    try {
    const docRef = await addDoc(collection(db, "obrasPorRuta"), {
        idObra: props.id,
        idRuta: idRuta,
        uidUser: auth.currentUser.uid,
    });
    ananida.value = true
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

const borrarDeRuta = async () => {
    const q = query(collection(db, "obrasPorRuta"), where("idObra", "==", props.id), where("uidUser", "==", auth.currentUser.uid));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        querySnapshot.forEach(async(doc2) => {
                await deleteDoc(doc2.ref)
            })

        ananida.value = false
    }
}

var ananida = ref(false)
const comprobarSiObraFavorita = async () => {
    const q = query(collection(db, "obrasPorRuta"), where("idObra", "==", props.id), where("uidUser", "==", auth.currentUser.uid));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty)
        ananida.value = true
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        cargarElementosDeRutas()
    } else {
        // User is signed out
        // ...
    }
})


</script>
<template :key="componentKey">
    <Loading v-if="loading" buscando=true />
    <main id="detalle">
        <template v-if="mostrarVista != 0">
            <h1 class="ms-3">Error de coincidencias</h1>
            <h2 class="ms-3">Lo sentimos, no hemos encontrado su obra o autor</h2>
            <p class="ms-3"><button class="btn customBtn" @click="router.push('/')">Volver al inicio</button></p>
        </template>
        <template v-if="mostrarVista == 0">
            <section class="imagenPresentacion">
                <img :src=imagenObra :alt="'Imagen de ' + nombreObra">
                <div>
                    <h5>{{ nombreObra }}</h5>
                    <article class="sumarARuta" v-if="registrado">
                        <button title="Añadir a ruta" data-bs-toggle="modal"
                            data-bs-target="#cargarRutas" v-if="!ananida" ><font-awesome-icon :icon="['far', 'heart']" /></button>

                        <button @click="borrarDeRuta" title="Eliminar de ruta" v-else ><font-awesome-icon :icon="['fas', 'heart']" /></button>
                    </article>
                </div>
            </section>
            <section id="detalleObra">
                <article class="cuerpoInformacion infoobra">
                    <div class="cabeceraInformacion">
                        <h3>{{ nombreObra }}</h3>
                        <p class="subtitulo">{{ fechaObra }}. {{ tecnicaObra }}, {{ dimensionesObra }}</p>
                    </div>
                    <template v-if="mostrarTextoCompleto">
                        <p v-for="parrafo in textoObra">{{ parrafo }}</p>
                        <button @click="mostrarTextoCompleto = false" class="btn customBtn-signup">Ver menos</button>
                    </template>
                    <template v-else>
                        <p>{{ textoAuxiliarObra }}</p>
                        <button @click="mostrarTextoCompleto = true" class="btn customBtn-signup">Ver más</button>
                    </template>
                </article>
                <aside class="asideAutor">
                    <div class=cabeceraInformacion>
                        <h3>{{ nombre }}</h3>
                        <p class="subtitulo">{{ vida }} - {{ muerte }}</p>
                    </div>
                    <div class="imgAux">
                        <img :src=imagen :alt="'Imagen de ' + nombre">
                    </div>
                    <div class="textoAux">
                        <p>{{ textoAuxiliarAutor }}</p>
                    </div>
                    <button @click="irAutor" class="btn customBtn-signup">Ver autor</button>
                </aside>
                <article class="fichaTecnica">
                    <div class="titulo-con-lineas">
                        <h3>Ficha técnica</h3>
                    </div>
                    <div class="cartilla">
                        <div class="imgFT" data-bs-toggle="modal" data-bs-target="#imagenCompleta"
                            title="Visualización ampliada">
                            <img :src=imagenObra :alt="'Imagen de ' + nombreObra">
                        </div>
                        <div class="infoFT">
                            <hr>
                            <p class="resaltado"><span>N&uacute;mero de cat&aacute;logo:</span> {{ numeroId }}</p>
                            <hr>
                            <p class="resaltado"><span>Nombre:</span>{{ nombreObra }} </p>
                            <hr>
                            <p class="resaltado" @click="irAutor" title="Ir a autor"><span>Autor:</span> {{ nombre }}</p>
                            <hr>
                            <p class="resaltado"><span>Fecha:</span> {{ fechaObra }}</p>
                            <hr>
                            <p class="resaltado"><span>T&eacute;cnica:</span> {{ tecnicaObra }}</p>
                            <hr>
                            <p class="resaltado"><span>Dimensiones:</span> {{ dimensionesObra }}</p>
                            <hr>
                        </div>
                    </div>

                    <div class="modal fade" id="imagenCompleta" tabindex="-1" aria-labelledby="exampleModalLabel"
                        aria-hidden="true">
                        <div class="modal-dialog modal-fullscreen">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h1 class="modal-title fs-5" id="exampleModalLabel">Visualizaci&oacute;n ampliada</h1>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal"
                                        aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <img :src=imagenObra :alt="'Imagen de ' + nombreObra">

                                </div>
                            </div>
                        </div>
                    </div>
                </article>
            </section>
            

        </template>
        <div class="modal fade" id="cargarRutas" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-3" id="exampleModalLabel">Seleccione ruta</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body listadoRutasModal">
        <template v-for="ruta in arrayRutas" v-if="!sinRutas">
            <article data-bs-dismiss="modal" class="ruta" @click="anadirARuta(ruta.id)">
                <h4>{{ ruta.nombre }}</h4>
            </article>
        </template>
        <template v-if="sinRutas">
            <h4 class="mt-2 mb-4">No tienes rutas creadas</h4>
        </template>
    </div>
    <div class="modal-footer">
          <button @click="router.push('/rutas')" data-bs-dismiss="modal" v-if='sinRutas' class="btn customBtn-signup">Crear ruta</button>
      </div>
    </div>
  </div>
</div>

</main>
</template>