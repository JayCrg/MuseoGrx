<script setup>
setting = {
  "centerMode": true,
  "centerPadding": "20px",
  "focusOnSelect": true,
  "infinite": true,
  "slidesToShow": 3,
  "speed": 500
}
</script>
<template>
<VueSlickCarousel v-bind="settings">
  <div><h3>1</h3></div>
  <div><h3>2</h3></div>
  <div><h3>3</h3></div>
  <div><h3>4</h3></div>
  <div><h3>5</h3></div>
  <div><h3>6</h3></div>
  <div><h3>7</h3></div>

</VueSlickCarousel>
</template>