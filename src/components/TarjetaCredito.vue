<script setup>
import { collection, addDoc } from 'firebase/firestore';
import { ref } from 'vue'
import { db } from '../firebase.js'
import { ActionCodeOperation, onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase.js'
import router from '../router/index.js'
import sendEmail from '../email';

const props = defineProps(['general', 'reducida', 'menor', 'fechaVisita'])
const patternEmailAlt = "/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}(\.[a-zA-Z]{2,3})?/";
const EmailUser = ref('')


onAuthStateChanged(auth, (user) => {
  if (user) {
    EmailUser.value = user.email
  } else {
    EmailUser.value = ''
  }
})


var numerotj = ref('');
var isValid = ref(false);
var validado = ref(0);

function checkTj() {

  if (numerotj.value.replace(' ', '').length >= numerotj.value.length || numerotj.value.length <= 15) {
    isValid.value = false;
  }
  else {
    isValid.value = true;
  }
}


const submitHandler = async () => {
  await new Promise((r) => setTimeout(r, 4000))
  validado.value = 0;
}

function guardarDatos(e) {
  e.preventDefault();
  if (props.fechaVisita == null || (props.general.cantidad == 0 && props.reducida.cantidad == 0 && props.menor.cantidad == 0)) {
    validado.value = 2;
    submitHandler();
  }
  else {
    if (isValid.value) {
      guardarEnFirestore(EmailUser.value);
      sendEmail(EmailUser.value, [{tipo: 'General', acc: props.general.cantidad, precio: props.general.precio}, {tipo: 'Reducida', acc: props.reducida.cantidad, precio:props.reducida.precio}, {tipo: '10 años o menos', acc: props.menor.cantidad, precio: props.menor.precio}], props.fechaVisita);
      validado.value = 1;
      resetarTarjeta();
      submitHandler();

    }
    else {
      validado.value = 2;

      submitHandler();
    }
  }
}

const guardarEnFirestore = async (correo) => {
  try {
    const docRef = await addDoc(collection(db, "ventaEntradas"), {
      correo: correo,
      fechaCompra: new Date(),
      fechaVisita: props.fechaVisita,
      tipo1: props.general.cantidad,
      tipo2: props.reducida.cantidad,
      tipo3: props.menor.cantidad,
    });
  } catch (e) {
    console.error("Error adding document: ", e);
    validado.value = 3;
    submitHandler();
  }

}


function resetarTarjeta(){
  numerotj.value = '';
  isValid.value = false;
  document.getElementById("titularTarjeta").value = '';
  document.getElementById("caducidadTarjeta").value = '';
  document.getElementById("CVCTarjeta").value = '';
  document.getElementById("numeroTarjeta").value = '';

}

</script>


<template>
  <div class="alert alert-success d-flex align-items-center" role="alert" v-if="validado == 1">
    <div>
      Realizado con éxito, puede salir de esta p&aacute;gina y comprobar su correo (si no encuentra el correo, revise spam)
    </div>
  </div>
  <div :class="{ 'alert alert-danger d-flex align-items-center': true }" role="alert" v-if="validado == 2">
    <div>
      Error al realizar el pago
    </div>
  </div>
  <div :class="{ 'alert alert-danger d-flex align-items-center': true }" role="alert" v-if="validado == 3">
    <div>
      Aseg&uacute;rese de que ha introducido de haber seleccionado una fecha y sus entradas
    </div>
  </div>
  <form @submit="guardarDatos" class="tarjetaCredito">
    <div>
      <label for="emailTarjeta">Email</label>
      <input v-model="EmailUser" type="email" class="form-control" id="emailTarjeta" aria-describedby="emailHelp"
        title="Inserta tu email" required pattern='[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}(\.[a-zA-Z]{2,3})'>
      <div id="emailHelp" class="form-text">¿A qu&eacute; correo te avisamos?</div>
      
    </div>

    <div class="cuerpoTarjeta delantera">
      <div>
        <label for="titularTarjeta">Titular</label>
        <input class="form-control" id="titularTarjeta" required>
      </div>
      <div>
        <label for="caducidadTarjeta">Caducidad</label>
        <input type="tel" required class="form-control" id="caducidadTarjeta" v-cardformat:formatCardExpiry
          placeholder="XX/XXXX" maxlength="7">
      </div>
      <div>
        <label for="numeroTarjeta">N&uacute;mero de Tarjeta</label>
        <input type="tel" required class="form-control" id="numeroTarjeta" @keydown="checkTj"
          v-cardformat:formatCardNumber v-model="numerotj" placeholder="#### #### #### ####">
      </div>
    </div>
    <div class="cuerpoTarjeta trasera">
      <div>
        <label for="CVCTarjeta">CVC</label>
        <input type="tel" required class="form-control" id="CVCTarjeta" v-cardformat:formatCardCVC placeholder="###">
      </div>
    </div>
    <button class="btn customBtn-signup">Confirmar</button>
  </form>
</template>