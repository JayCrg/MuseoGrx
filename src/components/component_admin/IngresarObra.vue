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

const emit = defineEmits(['actualizarLista'])

var refImagenObra = ref()
var refTextoObra = ref()

const archivarObra = async (credential, textoObra, urlImagen) => {
  try {
    const docRef = await addDoc(collection(db, "obras"), {
      idObra: credential["fichaTécnica"]["numeroId"],
      titulo: credential["fichaTécnica"]["tituloObra"],
      autor: credential["fichaTécnica"]["autorObra"],
      fecha: credential["fichaTécnica"]["fechaObra"],
      tecnica: credential["fichaTécnica"]["tecnicaObra"],
      dimensiones: credential["fichaTécnica"]["dimensionesObra"],
      titulo_minusculas: credential["fichaTécnica"]["tituloObra"].toLowerCase().split(' '),
      textoObra: textoObra,
      imagenObra: urlImagen,
    });
    await updateDoc(docRef, {
      idAuxiliar: docRef.id
    })
    completadoExito.value = 1
    refImagenObra.value = ''
    refTextoObra.value = ''
    textoObra.value = ''
    emit('actualizarLista') // Emitir evento para actualizar la lista del componente padre
    timeOut()

  } catch (e) {
    console.error("Error adding document: ", e);
    if (e.code == "id-already-in-use") {
      completadoExito.value = 3
    }
    else {
      completadoExito.value = 2
      console.log(e)
    }
    timeOut()
  }
}



// function subirTexto(credential) {
//   let metadata = {
//     contentType: 'text/plain'
//   };
//   const storageRef = ref2(storage, refTextoObra.value[0].name, metadata);
//   uploadBytes(storageRef, refTextoObra.value[0].file).then((snapshot) => {
//     getDownloadURL(storageRef).then((urlTexto) => {
//       subirImagen(credential, urlTexto)

//     })
//   });
// }

function subirImagen(credential, textoObra) {
  let metadata = {
    contentType: 'image/jpeg'
  };
  const storageRef2 = ref2(storage, refImagenObra.value[0].name, metadata);
  uploadBytes(storageRef2, refImagenObra.value[0].file).then((snapshot) => {
    getDownloadURL(storageRef2).then((urlImagen) => {
      archivarObra(credential, textoObra, urlImagen)
    })
  });
}

function guardarObra(credentials) {
  for (const key in credentials) {
    if (key.startsWith("multi")) {
      subirTexto(credentials[key])
    }
  }
}

function subirTexto(credential) {
  let lector = new FileReader();
  lector.onload = function (evento) {
    let textoObra = evento.target.result.split('\n');
    for (let i = 0; i < textoObra.length; i++) {
      if (textoObra[i] === "" || textoObra[i] ==='\r') {
        textoObra.splice(i, 1); // Elimina el elemento
        i--;  // Ajusta el índice para compensar la eliminación
      }
    }
    subirImagen(credential, textoObra)
  };
  lector.readAsText(refTextoObra.value[0].file);
}

const timeOut = async () => {
  await new Promise((r) => setTimeout(r, 2000))
  completadoExito.value = 0;
}




</script>
<template>
  <div class="alert alert-success d-flex align-items-center" role="alert" v-if="completadoExito == 1">
    <div>
      Obra guardada con éxito
    </div>
  </div>
  <div :class="{ shake: disabled, 'alert alert-danger d-flex align-items-center': true }" role="alert"
    v-if="completadoExito == 2">
    <div>
      Error al guardar la obra
    </div>
  </div>
  <div :class="{ shake: disabled, 'alert alert-danger d-flex align-items-center': true }" role="alert"
    v-if="completadoExito == 3">
    <div>
      Id ya está en uso
    </div>
  </div>
  <FormKit type="form" :actions="false" @submit="guardarObra" id="subirArchivo" submit-label="signup"
    v-if="completadoExito == 0">
    <FormKit type="multi-step" tab-style="progress" :hide-progress-labels="false" valid-step-icon="star">
      <FormKit type="step" title="Ficha Técnica" name="fichaTécnica">

        <FormKit type="text" name="numeroId" label="Número de Id" validation="required|alphanumeric|length:6,6"
          placeholder="Ej:000000" />

        <FormKit type="text" name="tituloObra" label="Título" validation="required|alpha_spaces"
          placeholder="Ej:Las meninas" />

        <FormKit type="select" name="autorObra" label="Autor" validation="required" :options="autores"
          placeholder="Selecciona autor" />

        <FormKit type="text" name="fechaObra" label="Fecha" validation="required|" placeholder="Ej:1843" />

        <FormKit type="text" name="tecnicaObra" label="Técnica" validation="required"
          placeholder="Ej:Óleo sobre lienzo" />

        <FormKit type="text" name="dimensionesObra" label="Dimensiones" validation="required"
          placeholder="Ej:20cm x 40cm" />


      </FormKit>

      <FormKit type="step" title="Obra" name="ImagenObra">
        <FormKit type="file" label="Imagen de la obra" name="imagenObra" accept=".jpg, .jpeg, .webp"
          help="Inserte una imagen de la obra" multiple="false" validation="required" v-model="refImagenObra" />
      </FormKit>

      <FormKit type="step" title="Texto" name="Texto">
        <FormKit type="file" label="Texto de la obra" name="textoObra" accept=".txt"
          help="Inserte un texto de la obra en formato .txt" multiple="false" validation="required"
          v-model="refTextoObra" />

        <template #stepNext>
          <div class="formkit-outer" data-family="button" data-type="submit" data-empty="true">
            <div class="formkit-wrapper">
              <button class="formkit-input customBtn-signup" type="submit" name="crearObra" title="Crear Obra"
                id="input_obra">Guardar</button>
            </div>
          </div>
        </template>
      </FormKit>
  </FormKit>
</FormKit></template>

<style></style>