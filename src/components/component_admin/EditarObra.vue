<script setup>
import { ref } from 'vue'
import { db, storage } from '../../firebase.js'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import router from '../../router/index.js';

import { ref as ref2, getStorage, uploadBytes, getDownloadURL } from 'firebase/storage'
import { addDoc, collection, getFirestore, doc, getDoc, getDocs, query, where, orderBy, deleteDoc, updateDoc, setDoc } from 'firebase/firestore'
import { useCollection, useFirestore } from 'vuefire'



var completadoExito = ref(0)

var numeroId = ref('')
var tituloObra = ref('')
var autorObra = ref('')
var fechaObra = ref('')
var tecnicaObra = ref('')
var dimensionesObra = ref('')
var textoObra = ref('')
var imagenObra = ref('')
var idDocument = ref(undefined)


const props = defineProps(['autores', 'obras'])

const emit = defineEmits(['actualizarLista'])

var refImagenObra = ref()
var refTextoObra = ref()

const archivarObra = async (credential, urlTexto, urlImagen) => {
  try {
    const docRef = await setDoc(doc(db, "obras", credential["fichaTécnica"]["idDocumento"]), {
      idObra: credential["fichaTécnica"]["numeroId"],
      titulo: credential["fichaTécnica"]["tituloObra"],
      autor: credential["fichaTécnica"]["autorObra"],
      fecha: credential["fichaTécnica"]["fechaObra"],
      tecnica: credential["fichaTécnica"]["tecnicaObra"],
      dimensiones: credential["fichaTécnica"]["dimensionesObra"],
      titulo_minusculas: credential["fichaTécnica"]["tituloObra"].toLowerCase().split(' '),
      textoObra: urlTexto,
      imagenObra: urlImagen,
      idAuxiliar : credential["fichaTécnica"]["idDocumento"]

    });
    completadoExito.value = 1
    emit('actualizarLista') // Emitir evento para actualizar la lista del componente padre
    timeOut()


  } catch (e) {
    console.error("Error adding document: ", e);
    if (e.code == "id-already-in-use") {
      completadoExito.value = 3
    }
    else {
      completadoExito.value = 2
    }
    timeOut()
  }
}



function subirTexto(credential) {
  if (credential["Texto"]["textoObra"][0] == undefined || credential["Texto"]["textoObra"][0] == "") {
    subirImagen(credential, credential["Texto"]["textoPrecedente"])
  }
  else {
    // let metadata = {
    //   contentType: 'text/plain'
    // };
    // const storageRef = ref2(storage, refTextoObra.value[0].name, metadata);
    // uploadBytes(storageRef, refTextoObra.value[0].file).then((snapshot) => {
    //   getDownloadURL(storageRef).then((urlTexto) => {
    //     subirImagen(credential, urlTexto)

    //   })
    // });
    let lector = new FileReader();
  lector.onload = function (evento) {
    let textoObra = evento.target.result.split('\n');
    for (let i = 0; i < textoObra.length; i++) {
      if (textoObra[i] === "" || textoObra[i] === '\r') {
        textoObra.splice(i, 1); 
        i--; 
      }
    }
    subirImagen(credential, textoObra)
  };
  lector.readAsText(refTextoObra.value[0].file);
  }
}

function subirImagen(credential, urlTexto) {
  if(credential["ImagenObra"]["imagenObra"][0]==undefined || credential["ImagenObra"]["imagenObra"][0]==""){
    archivarObra(credential, urlTexto, credential["ImagenObra"]["imagenPrecedente"])
  }
  else{
  let metadata = {
    contentType: 'image/jpeg'
  };
  const storageRef2 = ref2(storage, refImagenObra.value[0].name, metadata);
  uploadBytes(storageRef2, refImagenObra.value[0].file).then((snapshot) => {
    getDownloadURL(storageRef2).then((urlImagen) => {
      archivarObra(credential, urlTexto, urlImagen)
    })
  });
}
}

function editarObra(credentials) {
  for (const key in credentials) {
    if (key.startsWith("multi")) {
      subirTexto(credentials[key])
    }
  }
}

const timeOut = async () => {
  await new Promise((r) => setTimeout(r, 2000))
  completadoExito.value = 0;
}

const cargarObra = async (credentials) => {
  const docRef = doc(db, "obras", credentials["idObra"]);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    numeroId.value = docSnap.data()["idObra"]
    tituloObra.value = docSnap.data()["titulo"]
    autorObra.value = docSnap.data()["autor"]
    fechaObra.value = docSnap.data()["fecha"]
    tecnicaObra.value = docSnap.data()["tecnica"]
    dimensionesObra.value = docSnap.data()["dimensiones"]
    textoObra.value = docSnap.data()["textoObra"]
    imagenObra.value = docSnap.data()["imagenObra"]
    idDocument.value = docSnap.id
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
  }

}




</script>
<template>
  <div class="alert alert-success d-flex align-items-center" role="alert" v-if="completadoExito == 1">
    <div>
      Obra actulizada con éxito
    </div>
  </div>
  <div :class="{ shake: disabled, 'alert alert-danger d-flex align-items-center': true }" role="alert"
    v-if="completadoExito == 2">
    <div>
      Error al actualizar la obra
    </div>
  </div>

  <FormKit type="form" :actions="false" @submit=cargarObra id="cargarObra" submit-label="cargar">

    <FormKit type="select" name="idObra" label="Seleccine Obra" validation="required" :options="obras"
      placeholder="Selecciona obra" />

    <div class="formkit-outer" data-family="button" data-type="submit" data-empty="true">
      <div class="formkit-wrapper">
        <button class="formkit-input customBtn-signup" type="submit" name="cargarObra" title="Cargar Obra"
          id="load_obra">Seleccionar</button>
      </div>
    </div>
  </FormKit>



  <FormKit type="form" :actions="false" @submit="editarObra" id="subirArchivo" submit-label="signup">
    <FormKit type="multi-step" tab-style="progress" :hide-progress-labels="false" valid-step-icon="star">
      <FormKit type="step" title="Ficha Técnica" name="fichaTécnica">

        <FormKit v-model="numeroId" type="text" name="numeroId" label="Número de Id"
          validation="required|alphanumeric|length:6,6" placeholder="Ej:000000" />

        <FormKit v-model="tituloObra" type="text" name="tituloObra" label="Título"
          validation="required|alpha_spaces" placeholder="Ej:Las meninas" />

        <FormKit v-model="autorObra" type="select" name="autorObra" label="Autor" validation="required" :options="autores"
          placeholder="Selecciona autor" />

        <FormKit v-model="fechaObra" type="text" name="fechaObra" label="Fecha" validation="required"
          placeholder="Ej:1843" />

        <FormKit v-model="tecnicaObra" type="text" name="tecnicaObra" label="Técnica" validation="required"
          placeholder="Ej:Óleo sobre lienzo" />

        <FormKit v-model="dimensionesObra" type="text" name="dimensionesObra" label="Dimensiones" validation="required"
          placeholder="Ej:20cm x 40cm" />

        <FormKit name="idDocumento" type="hidden" v-model="idDocument" validation="required" />

      </FormKit>

      <FormKit type="step" title="Obra" name="ImagenObra">
        <FormKit type="file" label="Imagen de la obra" name="imagenObra" accept=".jpg, .jpeg, .webp"
          help="Inserte una imagen de la obra" multiple="false" v-model="refImagenObra" />

        <FormKit name="imagenPrecedente" v-model="imagenObra" type="hidden" validation="required" />

      </FormKit>

      <FormKit type="step" title="Texto" name="Texto">
        <FormKit type="file" label="Texto de la obra" name="textoObra" accept=".txt"
          help="Inserte un texto de la obra en formato .txt" multiple="false" v-model="refTextoObra" />

        <FormKit name="textoPrecedente" v-model="textoObra" type="hidden" validation="required" />


        <template #stepNext>
          <div class="formkit-outer" data-family="button" data-type="submit" data-empty="true">
            <div class="formkit-wrapper">
              <button class="formkit-input customBtn-signup" type="submit" name="editarObra" title="Editar Obra"
                id="input_obra">Guardar</button>
            </div>
          </div>
        </template>
      </FormKit>
  </FormKit>
</FormKit>
</template>

<style></style>