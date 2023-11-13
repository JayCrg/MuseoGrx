<script setup>
import { onBeforeMount, ref } from 'vue'
import { onMounted } from 'vue'
import Loading from '../components/Loading.vue';
import router from '../router/index.js';

const  props = defineProps(['tipo', 'id'])

</script>
<template>
    <main>
        <p>{{ props.tipo }}</p>
    </main>
</template>