<script lang="ts">
	import type { PageProps } from './$types';
	import { superForm } from 'sveltekit-superforms';
	import { onMount } from 'svelte';

	let { data }: PageProps = $props();
	let open = $state(true);
	const { form, errors, constraints, message, enhance, submitting } = superForm(data.form);
	// let maxContentHeight = 1536;
	let scale = $state(1.6);

	let displaySchedule = $derived($message?.week ? $message : null);

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
		{#if $submitting}
			<div class="flex flex-col items-center justify-center space-y-4">
				<svg
					aria-hidden="true"
					class="h-16 w-16 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
					viewBox="0 0 100 101"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
						fill="currentColor"
					/>
					<path
						d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
						fill="currentFill"
					/>
				</svg>
				<p class="text-xl text-gray-700">Generating your calendar schedule...</p>
			</div>
		{:else if displaySchedule != null}
			{#each displaySchedule.week as day}
				<div class="space-y-2">
					<div>
						<h2 class="text-3xl leading-none font-bold text-[#2e426c]">{day.dayOfWeek}</h2>
					</div>

					<div class="space-y-2">
						{#if day.events.length > 0}
							{#each day.events as event}
								<div class="flex justify-between gap-8 text-[1.3rem] leading-none">
									{#if event.time && event.time.trim() !== ''}
										<span class=" w-40 shrink-0 text-gray-900">{event.time}</span>
									{/if}
									<span class="text-gray-800">{event.activities.join(', ')}</span>
								</div>
							{/each}
						{:else}
							<div class="flex justify-between gap-8 text-[1.3rem] leading-none">
								<span class="w-40 shrink-0"></span>
								<span class="text-gray-800">No Activities Scheduled</span>
							</div>
						{/if}
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>

{#if open}
	<div
		class="fixed bottom-10 left-10 z-90 border border-gray-100 bg-white p-4 text-sm shadow-lg print:hidden"
	>
		<button
			class="absolute -top-3 -right-3 rounded-full bg-gray-800 p-2 text-white transition-colors hover:bg-gray-700"
			onclick={() => {
				open = !open;
			}}
			aria-label="Close panel"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="size-5"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
			</svg>
		</button>

		<div>
			<label for="scale">Scale</label>
			<input
				name="scale"
				type="number"
				class="border [&::-webkit-inner-spin-button]:opacity-100 [&::-webkit-outer-spin-button]:opacity-100"
				bind:value={scale}
				step="0.1"
			/>
		</div>

		<form method="POST" use:enhance>
			<div class="flex flex-col gap-y-2">
				<label for="text">Calendar Data (copy paste mon-sun)</label>
				<input
					class="border"
					type="text"
					name="text"
					aria-invalid={$errors.text ? 'true' : undefined}
					bind:value={$form.text}
					{...$constraints.text}
				/>
				{#if $errors.text}<span class="text-red-500">{$errors.text}</span>{/if}
				<button class="btn" disabled={$submitting}>
					{#if $submitting}
						<span class="flex items-center gap-x-2">
							Generating
							<svg
								aria-hidden="true"
								class="h-4 w-4 animate-spin fill-white text-gray-200 dark:text-gray-600"
								viewBox="0 0 100 101"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
									fill="currentColor"
								/>
								<path
									d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
									fill="currentFill"
								/>
							</svg>
						</span>
					{:else}
						Submit
					{/if}
				</button>
			</div>
		</form>

		<button
			class="btn mt-2 flex items-center gap-x-2"
			onclick={(e) => {
				e.preventDefault();
				window.print();
			}}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="size-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z"
				/>
			</svg>
			Print
		</button>
	</div>
{:else}
	<button
		class="fixed bottom-10 left-10 z-90 rounded-full bg-gray-800 p-3 text-white shadow-lg transition-colors hover:bg-gray-700 print:hidden"
		onclick={() => {
			open = !open;
		}}
		aria-label="Open panel"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="size-6"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
			/>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
			/>
		</svg>
	</button>
{/if}
