<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<main class="relative mx-auto h-[1920px] w-[1080px] overflow-clip bg-white">
	<!-- top wave-->
	<img
		src="/img/waves.svg"
		alt="wave graphic"
		class="pointer-events-none absolute -top-[175px] right-0 left-0 z-10"
	/>
	{@render children()}
	<!-- bottom wave -->
	<img
		src="/img/waves.svg"
		alt="wave graphic"
		class="pointer-events-none absolute right-0 -bottom-[175px] left-0 z-10 scale-y-[-1]"
	/>
</main>

<style>
	@media print {
		@page {
			size: 1080px 1920px;
			margin: 0;
		}

		main {
			width: 1080px;
			height: 1920px;
		}
	}
</style>
