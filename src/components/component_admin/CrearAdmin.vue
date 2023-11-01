<script setup>
import { ref } from 'vue';
import { auth, storage, db } from '../../firebase.js'
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";


var registrado = ref(0)
var disabled = ref(false)

const emit = defineEmits(['actualizarLista'])


const patternEmail = "[a-zA-Z0-9!#$%&'*\/=?^_`{|}~+-]([\.]?[a-zA-Z0-9!#$%&'*\/=?^_`{|}~+-])+@[a-zA-Z0-9]([^@&%$\/()=?¿!.,:;]|\d)+[a-zA-Z0-9][\.][a-zA-Z]{2,4}([\.][a-zA-Z]{2,3})?"
const patternEmailAlt = "/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}(\.[a-zA-Z]{2,3})?/"
const patternPassword = "/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/"


const guardarEnFirestore = async (name, email, uid) => {
    try {
        const docRef = await setDoc(doc(db, "usuarios", uid), {
            name: name,
            email: email,
            uid: uid,
            admin: true,
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
            emit('actualizarLista') // Emitir evento para actualizar la lista del componente padre
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
    }



</script>
<template>
    <div class="alert alert-success d-flex align-items-center" role="alert" v-if="registrado == 1">
        <div>
            ¡Te has registrado correctamente!
        </div>
    </div>
    <div :class="{ shake: disabled, 'alert alert-danger d-flex align-items-center': true }" role="alert"
        v-if="registrado == 2">
        <div>
            ¡El email ya está en uso!
        </div>
    </div>
    <div v-if="registrado==0">
        <FormKit type="form" id="registration-example" submit-label="signup" @submit="login" :actions="false"
            #default="{ value }">
            <FormKit  type="text" name="name" label="Nombre" validation="required" />

            <FormKit  type="text" name="email" label="Email" placeholder="Ej: user3@email.com"
                :validation="[['required'], ['matches', patternEmailAlt], ['email']]" validation-visible="live" />

            <FormKit  type="password" name="Contraseña" label="Contraseña" validation-visible="live" :validation-messages="{
                matches: 'Debe contener al menos 6 caracteres, una mayúscula, una minúscula, un número y un caracter especial(!@#$%^&*)'
            }" :validation="[['required'], ['matches', patternPassword]]" />

            <FormKit  type="password" name="Confirmacion" label="Confirmar contraseña"
                validation="required|confirm:Contraseña" validation-visible="live" />

            <div class="formkit-outer" data-family="button" data-type="submit" data-empty="true">
                <div class="formkit-wrapper">
                    <button class="formkit-input btn customBtn-signup" type="submit" name="crearAdmin" title="Crear Admin"
                        id="create_admin">Crear
                        Admin</button>
                </div>
            </div>
        </FormKit>

    </div>
</template>

<style></style>