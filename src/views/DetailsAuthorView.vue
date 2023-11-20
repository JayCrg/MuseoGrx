<script setup>
import { onBeforeMount, ref } from 'vue'
import { onMounted } from 'vue'
import Loading from '../components/Loading.vue';
import router from '../router/index.js';

import { ref as ref2, getStorage, uploadBytes, getDownloadURL, updateMetadata } from 'firebase/storage'
import { addDoc, collection, getFirestore, doc, getDoc, getDocs, query, where, orderBy, deleteDoc, updateDoc, setDoc, limit, startAfter } from 'firebase/firestore'
import { useCollection, useFirestore } from 'vuefire'
import { db, storage } from '../firebase.js'
import * as cors from 'cors';
import { id } from 'date-fns/locale';

const props = defineProps(['id'])
const batchSize = 3
let ultimaEntrada = ref(null);

var mostrarVista = ref(0)

var nombre = ref('')
var vida = ref('')
var muerte = ref('')
var texto = ref('')
var imagen = ref('')
var idAutor = ref('')

var loading = ref(true)
var textoAuxiliarAutor = ref('')
var mostrarTextoCompleto = ref(false)
var arrayObras = ref([])
var noHayMasObras = ref(false)

onMounted(() => {
    loading.value = true
    document.title = 'Detalle | MuseoGRX';
    window.scrollTo({
        top: 0,
        behavior: "instant"
    });
    cargarAutor(props.id)
});

const cargarAutor = async (autor) => {
    const docRef = doc(db, "autores", autor);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        nombre.value = docSnap.data()["nombre"]
        vida.value = docSnap.data()["vida"]
        muerte.value = docSnap.data()["muerte"]
        texto.value = docSnap.data()["textoAutor"]
        imagen.value = docSnap.data()["imagenAutor"]
        idAutor.value = docSnap.id
        textoAuxiliarAutor.value = formatearSegmentoTexto(docSnap.data()["textoAutor"])
        cargarObras()
    }
    else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        mostrarVista.value = 1
        loading.value = false
    }
    loading.value = false
}

const cargarObras = async (autor = idAutor.value) => {
    const q = query(collection(db, "obras"), where("autor", "==", autor), orderBy("titulo", "desc"), limit(batchSize));
    const q2 = query(collection(db, "obras"), where("autor", "==", autor), orderBy("titulo", "desc"), startAfter(ultimaEntrada.value), limit(batchSize));

    var querySnapshot = null;
    if (ultimaEntrada.value == null)
        querySnapshot = await getDocs(q);
    else
        querySnapshot = await getDocs(q2);

    
    if (!querySnapshot.empty) {
        if(querySnapshot.docs.length < batchSize)
            noHayMasObras.value = true
        ultimaEntrada.value = querySnapshot.docs[querySnapshot.docs.length - 1];
        querySnapshot.forEach((doc) => {
            arrayObras.value.push({
                id: doc.id,
                titulo: doc.data()["titulo"],
                imagenObr: doc.data()["imagenObra"],
                fecha: doc.data()["fecha"],
                tecnica: doc.data()["tecnica"],
                dimensiones: doc.data()["dimensiones"],
            })

        });
    }
    else {
        noHayMasObras.value = true
    }
}


function formatearSegmentoTexto(texto) {
    let textoFormateado = texto[0].substring(0, Math.min(1000, texto[0].length));
    textoFormateado += "..."
    return textoFormateado
}

function irObra(idobra) {
    // console.log(idobra)
    router.push({ name: 'detalle', params: { id: idobra } })
}

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
                <img :src=imagen :alt="'Imagen de ' + nombre">
                <div>
                    <h5>{{ nombre }}</h5>
                </div>
            </section>
            <section id="detalleAutor">
                <article class="cuerpoInformacion infoautor">
                    <div class="cabeceraInformacion">
                        <h3>{{ nombre }}</h3>
                        <p class="subtitulo">{{ vida }} - {{ muerte }}</p>
                    </div>
                    <template v-if="mostrarTextoCompleto">
                        <p v-for="parrafo in texto">{{ parrafo }}</p>
                        <button @click="mostrarTextoCompleto = false" class="btn customBtn-signup">Ver menos</button>
                    </template>
                    <template v-else>
                        <p>{{ textoAuxiliarAutor }}</p>
                        <button @click="mostrarTextoCompleto = true" class="btn customBtn-signup">Ver más</button>
                    </template>
                </article>
                <article class="coleccionObras">
                    <div class="titulo-con-lineas">
                        <h3>Galer&iacute;a de obras</h3>
                    </div>
                    <div class="galeria" v-if="arrayObras.length > 0">
                        <div class="obra" v-for="obra in arrayObras" :key="obra.id" @click="irObra(obra.id)">
                            <div>
                                <img :src="obra.imagenObr" :alt="'Imagen de ' + obra.titulo">
                            </div>
                            <div class="titulo">
                                <h4>{{ obra.titulo }}</h4>
                                <p>{{ obra.fecha }}. {{ obra.tecnica }}</p>
                            </div>
                        </div>
                    </div>
                    <button @click="cargarObras(idAutor)" v-if="!noHayMasObras" class="cargarMas" title="Cargar más">
                        <font-awesome-icon :icon="['fas', 'plus']" />
                    </button>

                    <div v-else>
                        <br>
                        <p>No hay más obras para este autor por el momento</p>
                    </div>
                </article>
            </section>
        </template>
    </main>
</template>