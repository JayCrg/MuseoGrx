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

</style>