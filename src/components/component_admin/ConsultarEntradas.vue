<script setup>
import { ref } from 'vue'
import { onMounted } from 'vue'

const props = defineProps(['entradas'])
onMounted(() => {
// console.log(props.entradas)
formatearDatosEntradas()
});

var totalTipo1 = ref(0)
var totalTipo2 = ref(0)
var totalTipo3 = ref(0)
var tipo1Mes = ref(0)
var tipo2Mes = ref(0)
var tipo3Mes = ref(0)
var ultimoMes = ref([])
function formatearDatosEntradas(){
    totalTipo1.value = 0
    totalTipo2.value = 0
    totalTipo3.value = 0

    props.entradas.forEach(entrada => {
        totalTipo1.value += entrada.tipo1
        totalTipo2.value += entrada.tipo2
        totalTipo3.value += entrada.tipo3
    });
    ultimoMes.value = props.entradas.filter(entrada => new Date(entrada.fechaCompra.seconds * 1000 + entrada.fechaCompra.nanoseconds / 1000000).getMonth() == new Date().getMonth())
    ultimoMes.value.forEach(entrada => {
        tipo1Mes.value += entrada.tipo1
        tipo2Mes.value += entrada.tipo2
        tipo3Mes.value += entrada.tipo3
    });
}

</script>


<template>
<article >
    <table class="tablaEntradas">
    <thead>
      <tr>
        <th>Tipo de Entrada</th>
        <th>Últimos 30 d&iacute;as</th>
        <th>Último Año</th>
      </tr>
    </thead>
    <tbody>
        <tr>
        <td>Ventas individuales</td>
        <td id="generalMes"> {{ ultimoMes.length }} </td>
        <td id="generalAnio"> {{ props.entradas.length }}</td>
      </tr>
      <tr>
        <td>General</td>
        <td id="generalMes"> {{ tipo1Mes }} </td>
        <td id="generalAnio"> {{ totalTipo1 }}</td>
      </tr>
      <tr>
        <td>Reducida</td>
        <td id="reducidaMes">{{ tipo2Mes }}</td>
        <td id="reducidaAnio">{{ totalTipo2}}</td>
      </tr>
      <tr>
        <td>Menor de Edad</td>
        <td id="menorEdadMes"> {{ tipo3Mes }}</td>
        <td id="menorEdadAnio">{{ totalTipo3 }}</td>
      </tr>
      <tr>
        <td>Total</td>
        <td id="totalMes">{{ tipo1Mes*10 + tipo2Mes*7 + tipo3Mes*5 }}€</td>
        <td id="totalAnio">{{ totalTipo1*10 + totalTipo2*7 + totalTipo3*5 }}€</td>
      </tr>
    </tbody>
  </table>
</article>
</template>
    
<style scoped>

</style>