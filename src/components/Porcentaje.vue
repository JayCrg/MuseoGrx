<script setup>
import { onMounted } from 'vue';
onMounted(() => {
	window.addEventListener('scroll', () => {
		const scrollTotal = document.documentElement.scrollTop;
		const heightWin = document.documentElement.scrollHeight - document.documentElement.clientHeight;
		const scroll = `${(scrollTotal / heightWin) * 100}%`;
		document.querySelector('.scrollProgress-bar').style.width = scroll;
	});
});

</script>
<template>
    <div class="scrollProgress">
			<span class="scrollProgress-bar"></span>
		</div>
</template>

<style>
.scrollProgress {
	position: fixed;
	top: 0;
	left: 0;
	z-index: 9999;
	width: 100%;
	height: 3px;
	background-color: #2c2c2c;
}
.scrollProgress-bar {
	display: block;
	width: 0;
	height: inherit;
	background-image: linear-gradient(90deg,rgb(45, 33, 33), #a71c15);
}</style>