<script setup>
import { onBeforeMount, ref } from 'vue'
import { onMounted } from 'vue'
import Loading from '../components/Loading.vue';
import router from '../router/index.js';

import { ref as ref2, getStorage, uploadBytes, getDownloadURL } from 'firebase/storage'
import { addDoc, collection, getFirestore, doc, getDoc, getDocs, query, where, orderBy, deleteDoc, updateDoc, setDoc, limit, startAfter } from 'firebase/firestore'
import { useCollection, useFirestore } from 'vuefire'
import { db, storage } from '../firebase.js'


const props = defineProps(['busqueda', 'adminConfirmado', 'registrado',
 'loading', 'palabra', 'ultimasReferencias', 'limite'])

 var ultimaObra = ref(null);
var ultimoAutor = ref(null);
var noHayMasObras = ref(false)
var noHayMasAutores = ref(false)
onMounted(() => {
    window.scrollTo({
        top: 0,
        behavior: "instant"
    });
});

function enviarADetalle(id, tipo) {
    if(tipo == "autor"){
        router.push({ name: 'detalleAutor', params: { id: id } })
    }
    else if(tipo == "obra"){
        router.push({ name: 'detalle', params: { id: id } })
    }
    // else{
    //     router.push({ name: 'not-found' })
    // }
}

const cargarMasCoincidenciasAutor = async () => {
    const qAutores = query(collection(db, "autores"), where('nombre_minusculas', 'array-contains-any',
    props.palabra.toLowerCase().split(' ')), orderBy("nombre_minusculas"),
    startAfter(ultimoAutor.value == null?props.ultimasReferencias.refAutor: ultimoAutor.value), limit(props.limite));

    const querySnapshot = await getDocs(qAutores);
    if (!querySnapshot.empty) {
        if(querySnapshot.docs.length < props.limite)
            noHayMasAutores.value = true
        ultimoAutor.value = querySnapshot.docs[querySnapshot.docs.length - 1];
        querySnapshot.forEach((doc) => {
            props.busqueda.push({
                titulo: doc.data().nombre,
                id: doc.id,
                imagen: doc.data().imagenAutor,
                tipo: 'autor'
            })
        });
    }
    else {
        noHayMasAutores.value = true
    }
}

const cargarMasCoincidenciasObras = async () => {
    const qObra = query(collection(db, "obras"), where('titulo_minusculas', 'array-contains-any',
    props.palabra.toLowerCase().split(' ')), orderBy("titulo_minusculas"),
    startAfter(ultimaObra.value == null?props.ultimasReferencias.refObra: ultimaObra.value), limit(props.limite));

    const querySnapshot = await getDocs(qObra);
    if (!querySnapshot.empty) {
        if(querySnapshot.docs.length < props.limite)
            noHayMasObras.value = true
        ultimaObra.value = querySnapshot.docs[querySnapshot.docs.length - 1];
        querySnapshot.forEach((doc) => {
            props.busqueda.push({
                titulo: doc.data().titulo,
                id: doc.id,
                imagen: doc.data().imagenObra,
                tipo: 'obra'
            })
        });
    }
    else {
        noHayMasObras.value = true
    }
}

const cargarMas = async () => {
        cargarMasCoincidenciasObras()
        cargarMasCoincidenciasAutor()
}

</script>
<template>
    <Loading v-if="props.loading" buscando=true />
    <main id="coincidencias">
        <h2 class="resaltado">Resultados
            <span class="resaltado">encontrados</span>
        </h2>
        <h3>B&uacute;squeda: "{{ props.palabra }}"</h3>
        <section v-if="props.busqueda.length >0" class="resultadoBusqueda">
            <template v-for="(coincidencia, index) in props.busqueda" :key="index">
                <article class="coincidencia" :id="'coincidencias-'+index" @click="enviarADetalle(coincidencia.id, coincidencia.tipo)">
                    <div class="coincidencia-imagen">
                        <img :src="coincidencia.imagen" :alt="'Imagen de '+ coincidencia.titulo">
                    </div>
                    <div class="coincidencia-texto">
                        <h4>{{coincidencia.titulo}}</h4>
                        <p>{{coincidencia.descripcion}}</p>
                    </div>
                </article>
            </template>
            <button @click="cargarMas" v-if="!(noHayMasObras && noHayMasAutores)" class="cargarMas" title="Cargar más">
                        <font-awesome-icon :icon="['fas', 'plus']" />
            </button>
        </section>
        <section class="notFound" v-if="props.busqueda.length <=0">
            <h3 class="">No se han encontrado resultados</h3>
            <p>Por favor, revise los datos introducidos y vuelva a intentarlo</p>
        </section>
    </main>
    </template>