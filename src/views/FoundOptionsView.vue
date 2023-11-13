<script setup>
import { onBeforeMount, ref } from 'vue'
import { onMounted } from 'vue'
import Loading from '../components/Loading.vue';
import router from '../router/index.js';

import { ref as ref2, getStorage, uploadBytes, getDownloadURL } from 'firebase/storage'
import { addDoc, collection, getFirestore, doc, getDoc, getDocs, query, where, orderBy, deleteDoc, updateDoc, setDoc } from 'firebase/firestore'
import { useCollection, useFirestore } from 'vuefire'
import { db, storage } from '../firebase.js'


const props = defineProps(['busqueda', 'adminConfirmado', 'registrado', 'loading', 'palabra'])
onMounted(() => {
    window.scrollTo({
        top: 0,
        behavior: "instant"
    });
});

function enviarADetalle(id, tipo) {
    router.push({ name: 'detalle', params: { tipo: tipo, id: id } })
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
        </section>
        <section class="notFound" v-else>
            <h3 class="">No se han encontrado resultados</h3>
            <p>Por favor, revise los datos introducidos y vuelva a intentarlo</p>
        </section>
    </main>
    </template>