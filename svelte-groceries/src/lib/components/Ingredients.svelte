<script lang="ts">
	import type { Ingredient } from '../../stores/ingredient';
	import { RingLoader } from 'svelte-loading-spinners';
	import Button from './ui/button/button.svelte';
	import { PlusCircleIcon } from '@lucide/svelte';

	export let ingredients: Ingredient[] | undefined;
</script>

<ul>
	{#if ingredients}
		{#each ingredients as ingredient}
			<li class="flex flex-row p-4">
				{ingredient.name}
				<Button variant="ghost"><PlusCircleIcon /></Button>
			</li>
		{/each}
	{:else}<RingLoader color="#14b8a6" />{/if}
</ul>
