<script setup>
import { onBeforeMount, ref } from 'vue'
import { onMounted } from 'vue'
import Loading from '../components/Loading.vue';
import router from '../router/index.js';

import { ref as ref2, getStorage, uploadBytes, getDownloadURL, updateMetadata } from 'firebase/storage'
import { addDoc, collection, getFirestore, doc, getDoc, getDocs, query, where, orderBy, deleteDoc, updateDoc, setDoc } from 'firebase/firestore'
import { useCollection, useFirestore } from 'vuefire'
import { db, storage } from '../firebase.js'
import * as cors from 'cors';

const props = defineProps(['tipo', 'id'])

var mostrarVista = ref(0)

var nombre = ref('')
var vida = ref('')
var muerte = ref('')
var texto = ref('')
var imagen = ref('')

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

onMounted(() => {
    loading.value = true
    document.title = 'Detalle | MuseoGRX';
    window.scrollTo({
        top: 0,
        behavior: "instant"
    });
    if (props.tipo == "autor") {
        cargarAutor()
    }
    else if (props.tipo == "obra") {
        cargarObra()
    }
    else {
        mostrarVista.value = 1
    }
});

const cargarAutor = async (autor=props.id) => {
    const docRef = doc(db, "autores", autor);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        nombre.value = docSnap.data()["nombre"]
        vida.value = docSnap.data()["vida"]
        muerte.value = docSnap.data()["muerte"]
        texto.value = docSnap.data()["textoAutor"]
        imagen.value = docSnap.data()["imagenAutor"]
    }
    else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        mostrarVista.value = 1
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
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        mostrarVista.value = 1
    }
    loading.value = false
}



</script>
<template>
    <Loading v-if="loading" buscando=true />
    <main id="detalle">
        <template v-if="mostrarVista == 1">
            <h1 class="ms-3">Error de coincidencias</h1>
            <h2 class="ms-3">Lo sentimos, no hemos encontrado su obra o autor</h2>
            <p class="ms-3"><button class="btn customBtn" @click="router.push('/')">Volver al inicio</button></p>
        </template>
        <template v-if="mostrarVista == 0">
        <section class="imagenPresentacion">
            <img v-if="props.tipo=='autor'" :src=imagen :alt="'Imagen de ' + nombre">
            <img v-if="props.tipo=='obra'" :src=imagenObra :alt="'Imagen de ' + nombreObra">
            <div >
                <h5>{{ nombre }}</h5>
            </div>
        </section>
        <section id="detalleObra">
            <div class="cabeceraInformacion">
                <h1>{{ nombreObra }}</h1>
                <p>{{ fechaObra }}. {{ tecnicaObra }}, {{ dimensionesObra }}</p>
            </div>
            <article class="cuerpoInformacion">
                <p v-for="parrafo in textoObra">{{ parrafo }}</p>
            </article>
            <article class="fichaTecnia">
                <div>
                    <img :src=imagenObra :alt="'Imagen de ' + nombreObra">
                </div>
                <div>
                    <h5>Ficha técnica</h5>
                    <p><span>N&uacute;mero de cat&aacute;logo:</span> {{ numeroId }}</p>
                    <p><span>Nombre:</span> {{ nombreObra }}</p>
                    <p><span>Autor:</span> {{ nombre }}</p>
                    <p><span>Fecha:</span> {{ fechaObra }}</p>
                    <p><span>T&eacute;cnica:</span> {{ tecnicaObra }}</p>
                    <p><span>Dimensiones:</span> {{ dimensionesObra }}</p>
                </div>
            </article>
            <aside>
                <div class="cabeceraInformacion-Auxiliar">
                    <h5>{{ nombre }}</h5>
                    <p>{{ vida }} - {{ muerte }}</p>
                </div>
                <div>
                    <img :src=imagen :alt="'Imagen de ' + nombre">
                </div>
                <div>
                    <p>{{ texto }}</p>
                </div>
            </aside>
        </section>
        <section id="detalleAutor">

        </section>
        </template>
    </main>
</template>