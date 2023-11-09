<script setup>
import { RouterLink, RouterView } from 'vue-router'
import FooterComp from './components/FooterComp.vue';
import CarruselFamiliares from './components/CarruselFamiliares.vue';
import pruebamdb from './components/pruebamdb.vue';
import { onMounted } from 'vue';


import Porcentaje from './components/Porcentaje.vue';
import router from './router/index.js';
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from './firebase.js'

import {
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBCollapse,
} from 'mdb-vue-ui-kit';
import { ref } from 'vue';
import { auth } from './firebase.js'
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, onAuthStateChanged, getAuth, signOut } from "firebase/auth";

function goToSignUp() {
  router.push({ name: 'nueva-cuenta' });
};
const collapse5 = ref(false);
var password = ref('');
var userEmail = ref('');
var disabled = ref(false)
var NombreUsuario = ref('')
var isAdmin = ref(false)
const patternEmailAlt = "/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}(\.[a-zA-Z]{2,3})?/"
const patternPassword = "/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/"


onMounted(() => {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 5){
      collapse5.value = false
    }
  })
})



function login() {
  signInWithEmailAndPassword(auth, userEmail.value, password.value)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      router.push({ name: 'home' });
      obtenerDatosUsuarioDeLogin()
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      disabled.value = true
      setTimeout(() => {
        disabled.value = false
      }, 4000)
    });
}

function google() {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      router.push({ name: 'home' });

      // ...
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
}

function github() {
  const provider = new GithubAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a GitHub Access Token. You can use it to access the GitHub API.
      const credential = GithubAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      router.push({ name: 'home' });
      // ...
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The AuthCredential type that was used.
      const credential = GithubAuthProvider.credentialFromError(error);
      // ...
    });
}

function salir() {
  signOut(auth).then(() => {
    NombreUsuario.value = ''
    // Sign-out successful.
  }).catch((error) => {
    // An error happened.
  })
}


const uid = ref('')
var estaAutentificado = ref(false)
onAuthStateChanged(auth, (user) => {
  if (user) {
    userEmail.value = ''
    password.value = ''
    uid.value = user.uid
    if (user.displayName !== null) {
      NombreUsuario.value = formatearNombre(user.displayName)
    }
    else {
      obtenerDatosUsuarioDeLogin()
    }
    estaAutentificado.value = true
  } else {
    estaAutentificado.value = false
    isAdmin.value = false
  }
})

function rotateCollapse() {
  collapse5.value = !collapse5.value
  //rotar elemento collapse
  if (collapse5.value) {
    document.getElementById("collapse").style.transform = "rotate(0deg)";
  } else {
    document.getElementById("collapse").style.transform = "rotate(90deg)";
  }
}


function focusNextInput() {
  // Obtén la referencia al segundo campo de entrada
  const secondInput = document.getElementById('currentPassword');
  // Aplica el foco al segundo campo
  secondInput.focus();

}
const obtenerDatosUsuarioDeLogin = async () => {
  const q = query(collection(db, 'usuarios'), where('uid', '==', uid.value));
  const querySnapshot = await getDocs(q);
  // Comprueba si se encontraron documentos que coincidan con el 'uid'
  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0];
    NombreUsuario.value = formatearNombre(doc.data().name);
    if (doc.data().admin) {
      isAdmin.value = true
    }
  }
}

function formatearNombre(nombre) {
  var nombreFormateado = nombre.split(' ')
  if (nombreFormateado.length >= 2) {
    return nombreFormateado[0] + ' ' + nombreFormateado[1]
  }
  return nombreFormateado[0]
}




</script>

<template>
  <Porcentaje />
  <header>
    <MDBNavbar expand="md" container class="cabecera">
      <RouterLink :to="{ name: 'home' }">
        <MDBNavbarBrand class="cabecera-logo" title="Inicio">Museo<span>GRX</span></MDBNavbarBrand>
      </RouterLink>
      <!-- Toggle button -->
      <button target="#navbarRightAlignExample" class="customBtn-collapse" @click="rotateCollapse"><font-awesome-icon
          id="collapse" rotation=90 :icon="['fas', 'caret-down']" size="xl" /></button>
      <!-- Collapsible wrapper -->
      <MDBCollapse v-model="collapse5" id="navbarRightAlignExample">
        <MDBNavbarNav right class="mb-2 mb-lg-0 centrar">
          <!-- Modal Login/SignUp -->
          <button v-if=!estaAutentificado class="btn customBtn-destacado" type="button" data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
            Log In &nbsp;
            <font-awesome-icon :icon="['far', 'user']" size="lg" /></button>
          <li class="nav-item dropdown customList" v-if=estaAutentificado>
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              {{ (NombreUsuario) }}
            </a>
            <ul class="dropdown-menu">
              <RouterLink :to="{ name: 'admin' }" v-if="isAdmin"><a class="dropdown-item"
                  href="#">Administraci&oacute;n</a></RouterLink>
              <li><a class="dropdown-item" href="#">Mis rutas</a></li>
              <li>
                <hr class="dropdown-divider">
              </li>
              <li><button @click="salir" class="dropdown-item customBtn-destacado" type="button">
                  Log Out &nbsp;
                  <font-awesome-icon :icon="['far', 'user']" size="lg" /></button></li>
            </ul>
          </li>
          <!-- Ticket -->
          <RouterLink :to="{ name: 'entradas' }" class="routerLink desplazado">
            <button active title="Comprar Entradas" class="btn customBtn">
              Entradas &nbsp; <font-awesome-icon icon="fa-solid fa-ticket" />
            </button>
          </RouterLink>


        </MDBNavbarNav>
        <!-- Search -->
        <form class="d-flex input-group w-auto">
          <input type="search" class="form-control" id="SearchBar" placeholder="Ej: Las Meninas" aria-label="Search" />
          <button class="btn btn-outline-primary customBtn-slide"> <font-awesome-icon :icon="['fas', 'magnifying-glass']"
              size="lg" /></button>
        </form>
      </MDBCollapse>
    </MDBNavbar>


    <!-- OffCanvas -->
    <aside id="joinForm" v-if=!estaAutentificado>
      <div class="offcanvas offcanvas-start" tabindex="-1" data-bs-scroll="true" data-bs-backdrop="true"
        id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
        <div class="offcanvas-header">
          <h5 class="offcanvas-title" id="offcanvasExampleLabel">Inicia Sesión</h5>
          <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
          <div :class="{ shake: disabled, 'alert alert-danger d-flex align-items-center': true }" role="alert"
            v-if=disabled>
            <div>
              ¡El email o la contraseña son incorrectos!
            </div>
          </div>
          <form class="needs-validation">
            <div class="mb-3">
              <label for="exampleInputEmail1" class="form-label">Direcci&oacute;n Email</label>
              <input v-model="userEmail" type="email" class="form-control" id="exampleInputEmail1"
                @keyup.enter=focusNextInput aria-describedby="emailHelp" title="Inserta tu email" required
                pattern="/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}(\.[a-zA-Z]{2,3})?/">
              <div id="emailHelp" class="form-text">¡Hola de nuevo!</div>
            </div>
            <div class="mb-3">
              <label for="currentPassword" class="form-label">Contrase&ntilde;a</label>
              <input v-model="password" type="password" class="form-control" id="currentPassword" @keyup.enter="login"
                title="Inserta tu contraseña" pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})"
                required>
              <!-- The password must have at least 6 characters, an uppercase, a lowercase, a number and a special character (! @ # $ % ^ & *)' -->
            </div>
          </form>
          <button @click="login" title="Iniciar sesión" type="submit" class="btn customBtn">Entrar</button>
          <button @click="google" title="Iniciar sesión con Google" type="submit"
            class="btn customBtn icono-google"><font-awesome-icon :icon="['fab', 'google']" size="xl" /></button>
          <button @click="github" title="Iniciar sesión con Github" type="submit"
            class="btn customBtn icono-github"><font-awesome-icon :icon="['fab', 'github']" size="xl" /></button>
          <p class="mt-3">¿No tienes todavía una cuenta? <a @click="goToSignUp" data-bs-dismiss="offcanvas"
              aria-label="Close" class="crearCuenta">Crea una nueva</a></p>
        </div>
      </div>
    </aside>
  </header>

  <RouterView :adminConfirmado="isAdmin" :registrado="estaAutentificado" />

  <pruebamdb/>
</template>
<style></style>