<script lang="ts">
	import { Button } from '$lib/components/ui/button/';
	import { Input } from '$lib/components/ui/input/';
	import { Plus } from '@lucide/svelte';
	import type { Ingredient } from '../../stores/ingredient';

	let ingredientList: Ingredient[] = [];
	let ingredientSearch: string = '';

	const AddCustomIngredient = (name: string) => {
		console.log('Adding ingredient');
		ingredientList = [
			...ingredientList,
			{
				id: ingredientList.length ? 1 : 0,
				name
			}
		];
	};
</script>

<div class="flex flex-row gap-2">
	<Input type="text" placeholder="Enter ingredient..." class="grow" bind:value={ingredientSearch} />
	<Button variant="ghost" onclick={() => AddCustomIngredient(ingredientSearch)}><Plus /></Button>
</div>
{#each ingredientList as ingredient}
	<div class="flex flex-row gap-2">
		{ingredient.name}
	</div>
{/each}
