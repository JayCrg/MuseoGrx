<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Footer from './components/Footer.vue';
import { onMounted } from 'vue';
import { addDoc, collection, getFirestore, doc, getDoc, getDocs, query, where, orderBy, deleteDoc, updateDoc, setDoc, limit } from 'firebase/firestore'
import { db, storage } from './firebase.js'



import Porcentaje from './components/Porcentaje.vue';
import router from './router/index.js';

import {
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBCollapse,
} from 'mdb-vue-ui-kit';
import { ref } from 'vue';
import { auth } from './firebase.js'
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, onAuthStateChanged, getAuth, signOut } from "firebase/auth";
import { vi } from 'date-fns/locale';

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


///////////////////////////////Apartado de login///////////////////////////////

function login(e) {
  e.preventDefault();
  signInWithEmailAndPassword(auth, userEmail.value, password.value)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      router.push({ name: 'home' });
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
    // if (user.displayName !== null) 
    //   NombreUsuario.value = formatearNombre(user.displayName)
    // else 
      obtenerDatosUsuarioDeLogin(user.displayName)
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
const obtenerDatosUsuarioDeLogin = async (displayName) => {
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
  else
    NombreUsuario.value = formatearNombre(displayName)
}

function formatearNombre(nombre) {
  var nombreFormateado = nombre.split(' ')
  if (nombreFormateado.length >= 2) {
    return nombreFormateado[0] + ' ' + nombreFormateado[1]
  }
  return nombreFormateado[0]
}

////////////////////Apartado de búsqueda/////////////

var busqueda = ref('')
var loading = ref(false)
var posiblesCoincidencias = ref([])
var palabraBuscada = ref('')
const firstQueryLimit = 2;
var ultimaObra = ref('')
var ultimaAutor = ref('')
function buscar(e) {
  e.preventDefault();
  if(busqueda.value != ""){
    palabraBuscada.value = busqueda.value
    posiblesCoincidencias.value = []
    loading.value = true
    buscarCoincidenciasObras()
    buscarCoincidenciasAutores() 

    router.push({ name: 'encontradas'})
    busqueda.value = ''
    
  }
  
}

const buscarCoincidenciasObras = async () => {
    const qObras = query(collection(db, "obras"), where('titulo_minusculas', 'array-contains-any', busqueda.value.toLowerCase().split(' ')), orderBy("titulo_minusculas"), limit(firstQueryLimit));
    const querySnapshot2 = await getDocs(qObras);
    ultimaObra.value = querySnapshot2.docs[querySnapshot2.docs.length - 1]
    querySnapshot2.forEach((doc) => {
      posiblesCoincidencias.value.push({
        titulo: doc.data().titulo,
        id: doc.id,
        imagen: doc.data().imagenObra,
        tipo: 'obra'
      });
    });
    loading.value = false
    document.getElementsByTagName("body")[0].style.overflow = "auto"
  }
  
  const buscarCoincidenciasAutores = async () => {
    const qAutores = query(collection(db, "autores"), where('nombre_minusculas', 'array-contains-any', busqueda.value.toLowerCase().split(' ')), orderBy("nombre_minusculas"), limit(firstQueryLimit));
  const querySnapshot = await getDocs(qAutores);
  ultimaAutor.value = querySnapshot.docs[querySnapshot.docs.length - 1]
  querySnapshot.forEach((doc) => {
      posiblesCoincidencias.value.push({
        titulo: doc.data().nombre,
        id: doc.id,
        imagen: doc.data().imagenAutor,
        tipo: 'autor'
      });
  });
  document.getElementsByTagName("body")[0].style.overflow = "auto"
    loading.value = false

}

//////////////////////////////

var visionPwd = ref(false)
function mostrarContrasena(){
  var tipo = document.getElementById("currentPassword");
  if(tipo.type == "password")
    tipo.type = "text";
  else
    tipo.type = "password";
  visionPwd.value = !visionPwd.value
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
              <RouterLink :to="{name: 'rutas'}"><a class="dropdown-item" href="#">Mis rutas</a></RouterLink>
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
        <form class="d-flex input-group w-auto" @submit="buscar">
          <input type="search" class="form-control" id="SearchBar" v-model="busqueda" placeholder="Ej: Las Meninas" aria-label="Search" />
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
          <form class="needs-validation" @submit="login">
            <div class="mb-3">
              <label for="exampleInputEmail1" class="form-label">Direcci&oacute;n Email</label>
              <input v-model="userEmail" type="email" class="form-control" id="exampleInputEmail1"
                @keyup.enter=focusNextInput aria-describedby="emailHelp" title="Inserta tu email" required>
              <div id="emailHelp" class="form-text">¡Hola de nuevo!</div>
            </div>
            <div class="mb-3 ">
              <label for="currentPassword" class="form-label">Contrase&ntilde;a</label>
              <div class="pwd">
                <font-awesome-icon icon="fa-regular fa-eye" class="visionPwd" @click="mostrarContrasena" v-if="!visionPwd"/>
                <font-awesome-icon icon="fa-regular fa-eye-slash" class="visionPwd" @click="mostrarContrasena" v-else/>
                <input v-model="password" type="password" class="form-control" id="currentPassword"
                title="Inserta tu contraseña"
                required>
              </div>

            </div>
            <button title="Iniciar sesión" type="submit" class="btn customBtn">Entrar</button>
            <button @click="google" title="Iniciar sesión con Google" 
              class="btn customBtn icono-google"><font-awesome-icon :icon="['fab', 'google']" size="xl" /></button>
            <button @click="github" title="Iniciar sesión con Github"
              class="btn customBtn icono-github"><font-awesome-icon :icon="['fab', 'github']" size="xl" /></button>
          </form>
          <p class="mt-3">¿No tienes todavía una cuenta? <a @click="goToSignUp" data-bs-dismiss="offcanvas"
              aria-label="Close" class="crearCuenta">Crea una nueva</a></p>
        </div>
      </div>
    </aside>
  </header>

  <RouterView :adminConfirmado="isAdmin" :registrado="estaAutentificado" :busqueda="posiblesCoincidencias"
   :palabra="palabraBuscada" :loading="loading"
    :ultimasReferencias="{refAutor: ultimaAutor, noHayMasAutores:ultimaAutor==undefined?true:false , refObra: ultimaObra, noHayMasObras:ultimaObra==undefined?true:false}"
     :limite="firstQueryLimit" />

  <Footer/>
</template>
<style></style>