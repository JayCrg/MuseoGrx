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
onMounted(() => {
    window.scrollTo({
        top: 0,
        behavior: "instant"
    });
    document.title = 'Coincidencias | MuseoGRX';

});

function enviarADetalle(id, tipo) {
    if (tipo == "autor") {
        router.push({ name: 'detalleAutor', params: { id: id } })
    }
    else if (tipo == "obra") {
        router.push({ name: 'detalle', params: { id: id } })
    }

}

const cargarMasCoincidenciasAutor = async () => {
    if (!props.ultimasReferencias.noHayMasAutores) {
        const qAutores = query(collection(db, "autores"), where('nombre_minusculas', 'array-contains-any',
            props.palabra.toLowerCase().split(' ')), orderBy("nombre_minusculas"),
            startAfter(ultimoAutor.value == null ? props.ultimasReferencias.refAutor : ultimoAutor.value), limit(props.limite));
        const querySnapshot = await getDocs(qAutores);
        if (!querySnapshot.empty) {
            if (querySnapshot.docs.length < props.limite)
                props.ultimasReferencias.noHayMasAutores = true
            else
                props.ultimasReferencias.noHayMasAutores = false
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
        else
            props.ultimasReferencias.noHayMasAutores = true
    }
    else
        props.ultimasReferencias.noHayMasAutores = true
}

const cargarMasCoincidenciasObras = async () => {
    if (!props.ultimasReferencias.noHayMasObras) {
        const qObra = query(collection(db, "obras"), where('titulo_minusculas', 'array-contains-any',
            props.palabra.toLowerCase().split(' ')), orderBy("titulo_minusculas"),
            startAfter(ultimaObra.value == null ? props.ultimasReferencias.refObra : ultimaObra.value), limit(props.limite));
        const querySnapshot = await getDocs(qObra);
        if (!querySnapshot.empty) {
            if (querySnapshot.docs.length < props.limite)
                props.ultimasReferencias.noHayMasObras = true
            else
                props.ultimasReferencias.noHayMasObras = false
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
        else
            props.ultimasReferencias.noHayMasObras = true
    }
    else
        props.ultimasReferencias.noHayMasObras = true
}

const cargarMas = async () => {
    cargarMasCoincidenciasObras()
    cargarMasCoincidenciasAutor()
}
// function test() {
//     console.log(props.busqueda)
//     console.log(props.ultimasReferencias)
// }

</script>
<template>
    <Loading v-if="props.loading" buscando=true />
    <main id="coincidencias">
        <h2 class="resaltado">Resultados
            <span class="resaltado">encontrados</span>
        </h2>
        <h3>B&uacute;squeda: "{{ props.palabra }}"</h3>
        <section v-if="props.busqueda.length > 0" class="resultadoBusqueda">
            <template v-for="(coincidencia, index) in props.busqueda" :key="index">
                <figure class="objetoListaObras" :id="'coincidencias-' + index"
                    @click="enviarADetalle(coincidencia.id, coincidencia.tipo)">
                    <div class="objetoListaObras-imagen">
                        <img :src="coincidencia.imagen" :alt="'Imagen de ' + coincidencia.titulo">
                    </div>
                    <figcaption class="objetoListaObras-texto">
                        <h4>{{ coincidencia.titulo }}</h4>
                        <p>{{ coincidencia.descripcion }}</p>
                    </figcaption>
                </figure>
            </template>
            <button @click="cargarMas"
                class="cargarMas" title="Cargar más">
                <font-awesome-icon :icon="['fas', 'plus']" />
            </button>
        </section>
        <section class="notFound" v-if="props.busqueda.length <= 0">
            <h3 class="">No se han encontrado resultados</h3>
            <p>Por favor, revise los datos introducidos y vuelva a intentarlo</p>
        </section>
    </main>
</template>