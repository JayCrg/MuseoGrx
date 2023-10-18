<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HeaderComp from './components/HeaderComp.vue';
import FooterComp from './components/FooterComp.vue';
import CarruselFamiliares from './components/CarruselFamiliares.vue';
import Calendar from './components/Calendar.vue';
import pruebamdb from './components/pruebamdb.vue';
import { onMounted } from 'vue';
import { auth } from './firebase.js'
import { onAuthStateChanged } from "firebase/auth";
import { ref } from 'vue';

</script>

<template>
<HeaderComp></HeaderComp>
<RouterView/>
<pruebamdb/>

</template>
<style>

</style>