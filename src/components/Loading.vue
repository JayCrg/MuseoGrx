<script setup>
const props = defineProps(['buscando'])

</script>

<template>
    <div class="pantallaCarga">
        <div class="text-center">
                <img src="../../public/2.png" alt="Logo MGR">
                <p v-if="buscando==false" class="text-center">Bienvenido</p>
                <p v-else class="text-center">Buscando...</p>
        </div>
    </div>
</template>
