<script setup>
import { ref } from 'vue'
import { db, storage } from '../../firebase.js'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import router from '../../router/index.js';

import { ref as ref2, getStorage, uploadBytes, getDownloadURL } from 'firebase/storage'
import { addDoc, collection, getFirestore, doc, getDoc, getDocs, query, where, orderBy, deleteDoc, updateDoc, setDoc } from 'firebase/firestore'
import { useCollection, useFirestore } from 'vuefire'



var completadoExito = ref(0)

const props = defineProps(['obras'])

const emit = defineEmits(['actualizarLista'])

const borrarObra = async(credential) => {
    try {
        const q = query(collection(db, "obrasPorRuta"), where("idObra", "==", credential["obra"]))
        const querySnapshot = await getDocs(q)
        querySnapshot.forEach((doc) => {
            deleteDoc(doc.ref)
        })
        deleteDoc(doc(db, "obras", credential["obra"]))
        completadoExito.value = 1
        emit('actualizarLista') // Emitir evento para actualizar la lista del componente padre
        timeOut()
    }
    catch (e) {
        completadoExito.value = 2
        timeOut()
    }
}


const timeOut = async () => {
    await new Promise((r) => setTimeout(r, 1500))
    completadoExito.value = 0;
}


</script>
<template>
    <div class="alert alert-success d-flex align-items-center" role="alert" v-if="completadoExito == 1">
        <div>
            Obra borrada con éxito
        </div>
    </div>
    <div :class="{ shake: disabled, 'alert alert-danger d-flex align-items-center': true }" role="alert"
        v-if="completadoExito == 2">
        <div>
            Error al borrar la obra
        </div>
    </div>
    <FormKit type="form" :actions="false" @submit="borrarObra" id="borrarObra" submit-label="signup">

        <FormKit type="select" name="obra" label="Seleccine Obra" validation="required" :options="obras"
            placeholder="Selecciona obra" />

            <button type="button" class="btn customBtn" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Borrar
            </button>

            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalLabel">¿Est&aacute;s seguro?</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            Al aceptar borrar&aacute;s la obra de la base de datos y no podr&aacute;s recuperarla.
                        </div>
                        <div class="modal-footer">
                            <div class="formkit-outer" data-family="button" data-type="submit" data-empty="true">
                                <div class="formkit-wrapper">
                                    <button class="formkit-input customBtn-signup" type="submit" name="borrarObra"
                                        title="Borrar Obra" id="delete_obra" data-bs-dismiss="modal" aria-label="Close">Estoy
                                        seguro</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </FormKit>
    </template>

<style></style>