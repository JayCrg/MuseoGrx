<script setup>
import { ref } from 'vue'
import { db, storage } from '../../firebase.js'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import router from '../../router/index.js';

import { ref as ref2, getStorage, uploadBytes, getDownloadURL, updateMetadata } from 'firebase/storage'
import { addDoc, collection, getFirestore, doc, getDoc, getDocs, query, where, orderBy, deleteDoc, updateDoc, setDoc } from 'firebase/firestore'
import { useCollection, useFirestore } from 'vuefire'



var completadoExito = ref(0)


const emit = defineEmits(['actualizarLista'])

var refImagenAutor = ref()
var refTextoAutor = ref()
const archivarObra = async (credential, urlTexto, urlImagen) => {
  try {
    const docRef = await addDoc(collection(db, "autores"), {
      nombre: credential["fichaTécnica"]["nombreAutor"],
      muerte: credential["fichaTécnica"]["muerte"],
      vida: credential["fichaTécnica"]["vida"],
      nombre_minusculas: credential["fichaTécnica"]["nombreAutor"].toLowerCase().split(' '),
      textoAutor: urlTexto,
      imagenAutor: urlImagen,
    });
    completadoExito.value = 1
    refImagenAutor.value = ''
    refTextoAutor.value = ''

    emit('actualizarLista') // Emitir evento para actualizar la lista del componente padre
    timeOut()

  } catch (e) {
    console.error("Error adding document: ", e);
    if(e.code == "id-already-in-use"){
      completadoExito.value = 3
    }
    else{
      completadoExito.value = 2
      console.log(e)
    }
    timeOut()
  }
}



function subirTexto(credential) {
  let metadata = {
    contentType: 'text/plain'
  };
  const storageRef = ref2(storage, refTextoAutor.value[0].name, metadata);
  uploadBytes(storageRef, refTextoAutor.value[0].file).then((snapshot) => {
    getDownloadURL(storageRef).then((urlTexto) => {
      console.log('texto: '+urlTexto)
      subirImagen(credential, urlTexto)
    })
  });
}

function subirImagen(credential, urlTexto) {
  let metadata = {
    contentType: 'image/jpeg'
  };
  const storageRef2 = ref2(storage, refImagenAutor.value[0].name, metadata);
  uploadBytes(storageRef2, refImagenAutor.value[0].file).then((snapshot) => {
    getDownloadURL(storageRef2).then((urlImagen) => {
      console.log('imagen: '+urlImagen)
      archivarObra(credential, urlTexto, urlImagen)
    })
  });
}

function guardarAutor(credentials) {
  for (const key in credentials) {
    console.log(key)
    if (key.startsWith("multi")) {
      console.log(credentials[key])
      subirTexto(credentials[key])
    }
  }
}

function test(credentials) {
  console.log(refImagenAutor.value[0].file)
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
    <FormKit type="form" :actions="false" @submit="guardarAutor" id="subirArchivo" submit-label="signup" v-if="completadoExito == 0">
      <FormKit type="multi-step" tab-style="progress" :hide-progress-labels="false" valid-step-icon="star">
        <FormKit type="step" title="Ficha Técnica" name="fichaTécnica">

          <FormKit   type="text" name="nombreAutor" label="Nombre del autor" validation="required|alpha_spaces" placeholder="Ej: Diego Rodriguez de Silva y Velázquez"/>
 
          <FormKit  type="text" name="vida" label="Nacimiento" validation="required|number" placeholder="Ej:1843"/>
          
          <FormKit   type="text" name="muerte" label="Defunción" validation="required|number" placeholder="Ej:1924" />
 

        </FormKit>

        <FormKit type="step" title="Retrato" name="ImagenAutor">
          <FormKit type="file" label="Imagen del Autor" name="imagenAutor" accept=".jpg, .jpeg, .webp"
            help="Inserte una imagen del autor" multiple="false" validation="required" v-model="refImagenAutor" />
        </FormKit>

        <FormKit type="step" title="Texto" name="Texto">
          <FormKit type="file" label="Texto del Autor" name="textoAutor" accept=".txt"
            help="Inserte un texto del autor en formato .txt" multiple="false" validation="required" v-model="refTextoAutor" />

          <template #stepNext>
            <div class="formkit-outer" data-family="button" data-type="submit" data-empty="true">
              <div class="formkit-wrapper">
                <button class="formkit-input customBtn-signup" type="submit" name="crearAutor" title="Crear Autor"
                  id="input_obra">Guardar</button>
              </div>
            </div>
          </template>
        </FormKit>
      </FormKit>
    </FormKit>
  

</template>

<style></style>