<script setup>


import { VueElement, ref } from "vue";
let input = ref("");
const fruits = ["apple", "banana", "orange"];
function filteredList() {
  return fruits.filter((fruit) =>
  fruit.toLowerCase().includes(input.value.toLowerCase())
  );
}

const buttons = document.querySelectorAll("a");
buttons.forEach((button) => {
// Listen for click event
button.onclick = function (e) {
// Get position of X
let x = e.clientX - e.target.offsetLeft;
// Get position of Y
let y = e.clientY - e.target.offsetTop;
// Create span element
let ripple = document.createElement("span");
// Position the span element
ripple.style.left = `${x}px`;
ripple.style.top = `${y}px`;
// Add ripple class to span
this.appendChild(ripple);
// Remove span after 0.3s
setTimeout(function () {
ripple.remove();
}, 600); // 1second = 1000ms
};
});
</script>
<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
  <input type="text" v-model="input" placeholder="Search fruits..." />
  <div class="item fruit" v-for="fruit in filteredList()" :key="fruit">
    <p>{{ fruit }}</p>
  </div>
  <div class="item error" v-if="input&&!filteredList().length">
     <p>No results found!</p>
  </div>

  <img v-prlx="{
  preserveInitialPosition: false,
  limit: { min: -30, max: 30 }
}" src="../../public/mirador.webp">



</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}




input {
  display: block;
  width: 350px;
  margin: 20px auto;
  padding: 10px 45px;
  background: white url("assets/search-icon.svg") no-repeat 15px center;
  background-size: 15px 15px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
    rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
}

.item {
  width: 350px;
  margin: 0 auto 10px auto;
  padding: 10px 20px;
  color: white;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px,
    rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
}

.fruit {
  background-color: rgb(97, 62, 252);
  cursor: pointer;
}

.error {
  background-color: tomato;
}
</style>
