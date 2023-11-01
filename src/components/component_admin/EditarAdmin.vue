<script setup>
import { onBeforeMount, onMounted, ref } from 'vue'
import { db, storage } from '../../firebase.js'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import router from '../../router/index.js';

import { ref as ref2, getStorage, uploadBytes, getDownloadURL } from 'firebase/storage'
import { addDoc, collection, getFirestore, doc, getDoc, getDocs, query, where, orderBy, deleteDoc, updateDoc, setDoc } from 'firebase/firestore'
import { useCollection, useFirestore } from 'vuefire'



var completadoExito = ref(0)

const props = defineProps(['usuarios'])
const emit = defineEmits(['actualizarLista'])


const editarAdmin = async (credential) => {
    let admin = false
    if (props.usuarios["admin"].some(item => item.value === credential["user"])) {
        admin = true
    }
    try {
        const docRef = await updateDoc(doc(db, "usuarios", credential["user"]), {
            admin: !admin,
        });
        completadoExito.value = 1
        emit('actualizarLista') // Emitir evento para actualizar la lista del componente padre
        timeOut()
    } catch (e) {
        console.error("Error adding document: ", e);
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
            Cambio realizado con &eacute;xito
        </div>
    </div>
    <div :class="{ shake: true, 'alert alert-danger d-flex align-items-center': true }" role="alert"
        v-if="completadoExito == 2">
        <div>
            Error al actualizar los usuarios
        </div>
    </div>
    <div>

        
        <FormKit type="form" :actions="false" @submit="editarAdmin" id="editarAdmin" submit-label="signup">
            
            <FormKit type="select" name="user" label="Seleccine Usuario" validation="required" 
            :options="[{group: 'Admin', options: props.usuarios['admin']}, {group: 'Usuario', options: props.usuarios['usuario']}]"
            placeholder="Selecciona usuario" />

            <button type="button" class="btn customBtn" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Alternar estado de administrador
            </button>

            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalLabel">¿Est&aacute;s seguro?</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            Al aceptar se cambiar&aacute; el estado de administrador del usuario seleccionado, brind&aacute;ndole o quit&aacute;ndole permisos de administrador.
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
    </div>
    </template>

<style></style>