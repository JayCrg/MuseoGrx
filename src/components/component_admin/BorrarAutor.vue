<script setup>
import { ref } from 'vue'
import { db, storage } from '../../firebase.js'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import router from '../../router/index.js';

import { ref as ref2, getStorage, uploadBytes, getDownloadURL } from 'firebase/storage'
import { addDoc, collection, getFirestore, doc, getDoc, getDocs, query, where, orderBy, deleteDoc, updateDoc, setDoc } from 'firebase/firestore'
import { useCollection, useFirestore } from 'vuefire'



var completadoExito = ref(0)

const props = defineProps(['autores'])

const emit = defineEmits(['actualizarListaAutores', 'actualizarListaObras'])

const borrarAutor = async(credential) => {
    // console.log(credential)
    try {
        const q = query(collection(db, "obras"), where("autor", "==", credential["autor"]))
        const querySnapshot = await getDocs(q)
        querySnapshot.forEach(async(doc) => {
            const q2 = query(collection(db, "obrasPorRuta"), where("idObra", "==", doc.id))
            const querySnapshot2 = await getDocs(q2)
            querySnapshot2.forEach(async(doc2) => {
                // console.log('borrando obraporruta: ' + doc2.id)
                await deleteDoc(doc2.ref)
            })
            // console.log('borrando obra: ' + doc.id)
            await deleteDoc(doc.ref) 
        })
        // console.log('borrando autor: ' + credential["autor"])
        deleteDoc(doc(db, "autores", credential["autor"]))
        completadoExito.value = 1
        emit('actualizarListaObras')
        emit('actualizarListaAutores')

        timeOut()
    }
    catch (e) {
        console.log(e)
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
            Autor borrado con éxito
        </div>
    </div>
    <div :class="{ shake: true, 'alert alert-danger d-flex align-items-center': true }" role="alert"
        v-if="completadoExito == 2">
        <div>
            Error al borrar el autor
        </div>
    </div>
    <FormKit type="form" :actions="false" @submit="borrarAutor" id="borrarAutor" submit-label="signup">

        <FormKit type="select" name="autor" label="Seleccine Autor" validation="required" :options="autores"
            placeholder="Selecciona autor" />

            <button type="button" class="btn customBtn" data-bs-toggle="modal" data-bs-target="#exampleModal2">
                Borrar
            </button>

            <div class="modal fade" id="exampleModal2" tabindex="-1" aria-labelledby="exampleModal2Label" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModal2Label">¿Est&aacute;s seguro?</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            Al aceptar borrar&aacute;s al autor, así como sus obras, de la base de datos y no podr&aacute;s recuperarlas.
                        </div>
                        <div class="modal-footer">
                            <div class="formkit-outer" data-family="button" data-type="submit" data-empty="true">
                                <div class="formkit-wrapper">
                                    <button class="formkit-input customBtn-signup" type="submit" name="borrarAutor"
                                        title="Borrar Obra" id="delete_autor" data-bs-dismiss="modal" aria-label="Close">Estoy
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