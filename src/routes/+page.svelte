<script lang="ts">
	import type { PageProps } from './$types';
	import { onMount } from 'svelte';

	let { data }: PageProps = $props();

	// let maxContentHeight = 1536;
	let scale = $state(1.6);
	onMount(() => {
		const container = document.querySelector('.textToResize');
		let screenHeight = screen.height;
		let containerHeight = container?.clientHeight;
		console.log(screenHeight);
		console.log(containerHeight);
	});
</script>

<div class="flex h-full items-center justify-center">
	<div
		class="textToResize mx-auto flex h-[80%] max-w-[90%] origin-center flex-col justify-center space-y-10 px-10"
		style={`transform: scale(${scale});`}
	>
		{#each data.schedule.week as day}
			<div class="space-y-2">
				<div>
					<h2 class="text-3xl leading-none font-bold text-[#2e426c]">{day.dayOfWeek}</h2>
					<!-- <h3 class="mt-2 text-xl leading-none font-thin text-gray-700">{day.date}</h3> -->
				</div>

				<div class="space-y-2">
					{#each day.events as event}
						<div class="flex justify-between gap-8 text-[1.3rem] leading-none">
							<span class=" w-40 shrink-0 text-gray-900">{event.time}</span>
							<span class="text-gray-800">{event.activities.join(', ')}</span>
						</div>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>

<div class="fixed bottom-10 left-10 z-90 text-3xl print:hidden">
	<input type="number" bind:value={scale} step="0.1" />
	<button
		onclick={(e) => {
			e.preventDefault();
			window.print();
		}}
		>Print
	</button>
</div>
