<script lang="ts">
	import { Button } from '$lib/components/ui/button/';
	import { Input } from '$lib/components/ui/input/';
	import { MinusCircleIcon, Plus, PlusCircleIcon, TrashIcon } from '@lucide/svelte';
	import type { Ingredient } from '../../stores/ingredient';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { localStore } from '../../stores/localStore.svelte';

	const ingredientList = localStore<Ingredient[]>('ingredientList', []);
	let ingredientSearch: string = '';

	const AddCustomIngredient = (name: string) => {
		if (!name.trim()) return;

		const newIngredient: Ingredient = {
			id: ingredientList.value.length ? Math.max(...ingredientList.value.map((i) => i.id)) + 1 : 1,
			name: name.trim(),
			quantity: 1
		};

		ingredientList.value = [...ingredientList.value, newIngredient];
		ingredientSearch = '';
	};

	const updateQuantity = (ingredient: Ingredient, delta: number) => {
		ingredientList.value = ingredientList.value.map((i) =>
			i.id === ingredient.id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i
		);
	};

	const deleteIngredient = (ingredient: Ingredient) => {
		ingredientList.value = ingredientList.value.filter((i) => i.id !== ingredient.id);
	};
</script>

<div class="flex flex-row gap-2">
	<Input type="text" placeholder="Enter ingredient..." class="grow" bind:value={ingredientSearch} />
	<Button variant="ghost" onclick={() => AddCustomIngredient(ingredientSearch)}><Plus /></Button>
</div>
{#each ingredientList.value as ingredient (ingredient.id)}
	<div class="flex flex-row gap-2 p-1 items-center">
		<Input
			value={ingredient.quantity}
			type="number"
			class="max-w-10"
			oninput={(e) => {
				const target = e.target as HTMLInputElement | null;
				if (!target) return;
				const newQuantity = parseInt(target.value) || 1;
				ingredientList.value = ingredientList.value.map((i) =>
					i.id === ingredient.id ? { ...i, quantity: Math.max(1, newQuantity) } : i
				);
			}}
		/>
		<Button variant="ghost" onclick={() => updateQuantity(ingredient, -1)}
			><MinusCircleIcon /></Button
		>
		<Button variant="ghost" onclick={() => updateQuantity(ingredient, 1)}><PlusCircleIcon /></Button
		>
		<Separator orientation="vertical" class="mx-2" />
		<span class="grow">{ingredient.name}</span>
		<Button variant="ghost" size="icon" onclick={() => deleteIngredient(ingredient)}
			><TrashIcon class="text-red-500" /></Button
		>
	</div>
{/each}
