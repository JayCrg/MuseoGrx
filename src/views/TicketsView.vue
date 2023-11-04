<script setup>
import { ref, onMounted } from 'vue';
import { addDays, format} from 'date-fns';
import { es } from 'date-fns/locale';


var date = ref(null);
const maniana = addDays(new Date(), 1);
const dosMeses = addDays(maniana,60);

const entradas = [
  { tipo: 'General', precio: 10.00 },
  { tipo: 'Reducida', precio: 7.00 },
  { tipo: '10 años o menos', precio: 5.00 },
];

var general = ref(0);
var reducida = ref(0);
var menor = ref(0);
var dictEntradas = ref({'General': general, 'Reducida': reducida, '10 años o menos': menor});


</script>
<template>
  <main id="tickets">
    <h2 class="resaltado">Comprar <span>Entradas</span></h2>
    <section class="calendario">
      <h4>Elija un d&iacute;a</h4>
      <VDatePicker v-model="date" mode="date" 
        :min-date="maniana"
        :max-date="dosMeses" expanded />
        <p v-if="date==null">Por favor, elija el día de su entrada</p>
        <p v-else >{{ format(date, 'eeee, dd ' + ' MMMM ' + 'yyyy', { locale: es }) }}</p>
    </section>
    <section class="entradas" v-if="date!=null">
      <h4>Elija entradas</h4>
      <div>
        <template v-for="entrada in entradas" :key="entrada.tipo">
          <article class="entrada">
            <div>
              <h5 :class="{'seleccionado' : dictEntradas[entrada.tipo]>0?true:false }" >{{ entrada.tipo }}</h5>
              <p>{{ entrada.precio.toFixed(2) }}€</p>
            </div>
            <div>
              <button class="btn customBtn-entradas" @click="entrada.tipo=='General'?general++:entrada.tipo=='Reducida'?reducida++:menor++"><font-awesome-icon :icon="['fas', 'plus']" /></button>
              <p>{{ entrada.tipo=='General'?general:entrada.tipo=='Reducida'?reducida:menor }}</p>
              <button class="btn customBtn-entradas" @click="entrada.tipo=='General'&&general>0?general--:entrada.tipo=='Reducida'&&reducida>0?reducida--:entrada.tipo=='10 años o menos'&&menor>0?menor--:''"><font-awesome-icon :icon="['fas', 'minus']" /></button>
            </div>
          </article>
        </template>
        <article class="confirmar" v-if="general>0||reducida>0||menor>0">
            <h5 class="resaltado"><span>Total</span>: {{ (general * entradas[0].precio + reducida * entradas[1].precio + menor * entradas[2].precio).toFixed(2) }}€</h5>
            <button class="btn customBtn">Confirmar</button>
        </article>
      </div>
    </section>
    <section class="pago">

    </section>
    <section class="horario">
      <h4>Horario</h4>
      <div>
        <article class="abierto resaltado">
        <p>Abierto</p>
        <p>De lunes a sábado de 10:00 h a 20:00 h</p>
        <p>Domingo y festivos de 10:00 h a 19:00 h</p>
      </article>
      <article class="reducido resaltado">
        <p>Horario reducido</p>
        <p>1 y 6 de enero de 10:00 h a 14:00 h</p>
        <p>24, 25 y 31 de diciembre de 10:00 h a 14:00 h</p>
      </article>  
      </div>
    </section>

  </main>
</template>

<style></style>