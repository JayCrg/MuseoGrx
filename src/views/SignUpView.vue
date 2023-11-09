<script setup>
import { onMounted, ref } from 'vue';
import { auth, storage, db } from '../firebase.js'
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import router from '../router/index.js';
import { collection, addDoc, setDoc, doc } from "firebase/firestore"; 


var registrado = ref(0)
var disabled = ref(false)

const patternEmail = "[a-zA-Z0-9!#$%&'*\/=?^_`{|}~+-]([\.]?[a-zA-Z0-9!#$%&'*\/=?^_`{|}~+-])+@[a-zA-Z0-9]([^@&%$\/()=?¿!.,:;]|\d)+[a-zA-Z0-9][\.][a-zA-Z]{2,4}([\.][a-zA-Z]{2,3})?"
const patternEmailAlt = "/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}(\.[a-zA-Z]{2,3})?/"
const patternPassword = "/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/"

onMounted(() => {
  document.title = 'Sign Up | MuseoGRX';
});

const guardarEnFirestore = async (name, email, uid) => {
  try {
    const docRef = await setDoc(doc(db, "usuarios", uid), {
      name: name,
      email: email,
      uid: uid,
      admin: false,
    });
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}


async function login(credentials) {
  createUserWithEmailAndPassword(auth, credentials.email, credentials.Contraseña)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    registrado.value = 1
    //guardar en firestore database
    // por estilo

      guardarEnFirestore(credentials.name, credentials.email, user.uid)
      submitHandler()
      
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode == 'auth/email-already-in-use') {
        registrado.value = 2
        disabled.value = true
        setTimeout(() => {
          disabled.value = false
        }, 2500)
        
      }
      // ..
    });
    
    
  }
  const submitHandler = async () => {
    await new Promise((r) => setTimeout(r, 1500))
    registrado.value = 0;
    router.push({ name: 'home' });

  }
  
  
</script>
<template>
  <main id="signup">
    <div id="formSignUp">
      <FormKit type="form" id="registration-example" submit-label="signup" @submit="login" :actions="false"
      #default="{ value }">
        <h1>Resg&iacute;strate</h1>
        <p>
          ¿Ya tienes una cuenta? <router-link class="volverMenu" :to="{ name: 'home' }">Inicia sesión</router-link>
        </p>
        <div class="alert alert-success d-flex align-items-center" role="alert" v-if="registrado == 1">
          <div>
            ¡Te has registrado correctamente!
          </div>
        </div>
        <div :class="{ shake: disabled, 'alert alert-danger d-flex align-items-center' : true}" role="alert" v-if="registrado == 2">
          <div>
            ¡El email ya está en uso!
          </div>
        </div>
        <FormKit type="text" name="name" label="Tu nombre" help="¿Cómo te llamamos?" validation="required" :floating-label="true"/>

        <FormKit type="email" name="email" label="Tu email" help="¿Qué email quieres usar? Ej: user3@email.com"
          :validation="[['required'], ['matches', patternEmailAlt], ['email']]" validation-visible="live" :floating-label="true"/>

        <FormKit type="password" name="Contraseña" label="Contraseña" validation-visible="live" :validation-messages="{
          matches: 'Debe contener al menos 6 caracteres, una mayúscula, una minúscula, un número y un caracter especial(!@#$%^&*)'
        }" :validation="[['required'], ['matches', patternPassword]]" :floating-label="true"/>

        <FormKit type="password" name="Confirmacion"  label="Confirmar tu contraseña"
          validation="required|confirm:Contraseña" validation-visible="live" :floating-label="true"/>

        <div class="formkit-outer" data-family="button" data-type="submit" data-empty="true">
          <div class="formkit-wrapper">
            <button class="formkit-input btn customBtn-signup" type="submit" name="crearCuenta" title="Crear Cuenta" id="input_4">Crear
              cuenta</button>
          </div>
        </div>
      </FormKit>

    </div>

    <div id="imgSingUp">
      <img src="/12291223_Wavy_Tech-28_Single-10.svg" alt="Imagen decorativa">
      <p><a
          href="https://www.freepik.es/vector-gratis/ilustracion-concepto-abstracto-pagina-inicio-sesion_12291223.htm#query=sign%20up&from_query=signup&position=11&from_view=search&track=sph"
          target="_blank">Imagen de vectorjuice</a> en Freepik</p>
    </div>
  </main>
</template>

<style></style>