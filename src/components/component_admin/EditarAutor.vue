<script setup>
import { ref } from 'vue'
import { db, storage } from '../../firebase.js'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import router from '../../router/index.js';

import { ref as ref2, getStorage, uploadBytes, getDownloadURL } from 'firebase/storage'
import { addDoc, collection, getFirestore, doc, getDoc, getDocs, query, where, orderBy, deleteDoc, updateDoc, setDoc } from 'firebase/firestore'
import { useCollection, useFirestore } from 'vuefire'



var completadoExito = ref(0)

var nombreAutor = ref('')
var vida = ref('')
var muerte = ref('')
var textoAutor = ref('')
var imagenAutor = ref('')
var idDocument = ref(undefined)


const props = defineProps(['autores'])

const emit = defineEmits(['actualizarLista'])

const archivarObra = async (credential, urlTexto, urlImagen) => {
  try {
    const docRef = await setDoc(doc(db, "autores", credential["fichaTécnica"]["idDocumento"]), {
      nombre: credential["fichaTécnica"]["nombreAutor"],
      vida: credential["fichaTécnica"]["vida"],
      muerte: credential["fichaTécnica"]["muerte"],
      textoAutor: urlTexto,
      imagenAutor: urlImagen,
    });
    console.log(credential);
    console.log('archivo texto' + urlTexto)
    console.log('archivo imagen' + urlImagen)
    completadoExito.value = 1
    emit('actualizarLista') // Emitir evento para actualizar la lista del componente padre
    timeOut()


  } catch (e) {
    console.error("Error adding document: ", e)
      completadoExito.value = 2
    timeOut()
  }
}



function subirTexto(credential) {
  if (credential["Texto"]["textoAutor"][0] == undefined || credential["Texto"]["textoAutor"][0] == "") {
    subirImagen(credential, credential["Texto"]["urlTextoAutor"])
  }
  else {
    const storageRef = ref2(storage, credential["Texto"]["textoAutor"][0].name);
    uploadBytes(storageRef, credential["Texto"]["textoAutor"][0]).then((snapshot) => {
      getDownloadURL(storageRef).then((urlTexto) => {
        subirImagen(credential, urlTexto)

      })
    });
  }
}

function subirImagen(credential, urlTexto) {
  if(credential["ImagenAutor"]["imagenAutor"][0]==undefined || credential["ImagenAutor"]["imagenAutor"][0]==""){
    archivarObra(credential, urlTexto, credential["ImagenAutor"]["urlImagenAutor"])
  }
  else{
  const storageRef2 = ref2(storage, credential["ImagenAutor"]["imagenAutor"][0].name);
  uploadBytes(storageRef2, credential["ImagenAutor"]["imagenAutor"][0]).then((snapshot) => {
    getDownloadURL(storageRef2).then((urlImagen) => {
      archivarObra(credential, urlTexto, urlImagen)
    })
  });
}
}

function editarObra(credentials) {
  for (const key in credentials) {
    console.log(key)
    if (key.startsWith("multi")) {
      console.log(credentials[key])
      subirTexto(credentials[key])
    }
  }
}

const timeOut = async () => {
  await new Promise((r) => setTimeout(r, 2000))
  completadoExito.value = 0;
}

const cargarAutor = async (credentials) => {
  const docRef = doc(db, "autores", credentials["idAutor"]);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    nombreAutor.value = docSnap.data()["nombre"]
    vida.value = docSnap.data()["vida"]
    muerte.value = docSnap.data()["muerte"]
    textoAutor.value = docSnap.data()["textoAutor"]
    imagenAutor.value = docSnap.data()["imagenAutor"]
    idDocument.value = docSnap.id
    console.log("Document data:", textoAutor.value);
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
  }

}




</script>
<template>
  
  <FormKit type="form" :actions="false" @submit=cargarAutor id="cargarAutor" submit-label="cargar">
    
    <FormKit type="select" name="idAutor" label="Seleccine Autor" validation="required" :options="autores"
    placeholder="Selecciona autor" />
    
    <div class="formkit-outer" data-family="button" data-type="submit" data-empty="true">
      <div class="formkit-wrapper">
        <button class="formkit-input customBtn-signup" type="submit" name="cargarAutor" title="Cargar Autor"
        id="load_autor">Seleccionar</button>
      </div>
    </div>
  </FormKit>
  


  <FormKit type="form" :actions="false" @submit="editarObra" id="subirArchivo" submit-label="signup">
    <FormKit type="multi-step" tab-style="progress" :hide-progress-labels="false" valid-step-icon="star">
      <FormKit type="step" title="Ficha Técnica" name="fichaTécnica">
        
        <FormKit v-model="nombreAutor" type="text" name="nombreAutor" label="Número del autor"
        validation="required|alpha_spaces" placeholder="Ej: Diego Rodriguez de Silva y Velázquez" />
        
        <FormKit v-model="vida" type="text" name="vida" label="Nacimiento"
        validation="required|number" placeholder="Ej:1599" />

        <FormKit v-model="muerte" type="text" name="muerte" label="Defunción" validation="required|number"
        placeholder="Ej:1660" />
        
        <FormKit name="idDocumento" type="hidden" v-model="idDocument" validation="required" />
        
      </FormKit>

      <FormKit type="step" title="Obra" name="ImagenAutor">
        <FormKit type="file" label="Imagen de la obra" name="imagenAutor" accept=".jpg, .jpeg, .webp"
          help="Inserte una imagen de la obra" multiple="false" />
          
          <FormKit name="urlImagenAutor" v-model="imagenAutor" type="hidden" validation="required" />
          
        </FormKit>

        <FormKit type="step" title="Texto" name="Texto">
          <FormKit type="file" label="Texto del autor" name="textoAutor" accept=".txt"
          help="Inserte un texto del autor en formato .txt" multiple="false" />
          
          <FormKit name="urlTextoAutor" v-model="textoAutor" type="hidden" validation="required" />
          
          
          <template #stepNext>
            <div class="formkit-outer" data-family="button" data-type="submit" data-empty="true">
              <div class="formkit-wrapper">
                <button class="formkit-input customBtn-signup" type="submit" name="editarAutor" title="Editar Autor"
                id="input_obra">Guardar</button>
            </div>
          </div>
        </template>
      </FormKit>
    </FormKit>
  </FormKit>
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
</template>
  
<style></style>