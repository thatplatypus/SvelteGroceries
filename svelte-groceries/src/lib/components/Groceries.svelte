<script lang="ts">
	import { Button } from '$lib/components/ui/button/';
	import { Input } from '$lib/components/ui/input/';
	import { TypeAhead } from '$lib/components/ui/typeahead/';
	import { MinusCircleIcon, PlusCircleIcon, TrashIcon } from '@lucide/svelte';
	import type { Ingredient } from '../../stores/ingredient';
	import { ingredientStore } from '../../stores/ingredient';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { groceryListStore } from '../../stores/groceryList';

	const ingredientList = groceryListStore;
	let selectedIngredient: Ingredient | null = $state(null);
	let searchValue = $state('');
	let availableIngredients: Ingredient[] = $state([]);

	$effect(() => {
		ingredientList.initialize();
		(async () => {
			try {
				availableIngredients = await $ingredientStore;
			} catch (error) {
				console.error('Groceries: Failed to load ingredients:', error);
				availableIngredients = [];
			}
		})();
	});

	const AddIngredient = (ingredient: Ingredient) => {
		const existingIngredient = ingredientList.value.find((i) => i.id === ingredient.id);
		if (existingIngredient) {
			updateQuantity(existingIngredient, 1);
		} else {
			const newIngredient: Ingredient = {
				...ingredient,
				quantity: 1
			};
			ingredientList.value = [...ingredientList.value, newIngredient];
		}
		selectedIngredient = null;
		searchValue = '';
	};

	const AddCustomIngredient = (name: string) => {
		if (!name.trim()) return;

		const newIngredient: Ingredient = {
			id: ingredientList.value.length ? Math.max(...ingredientList.value.map((i) => i.id)) + 1 : 1,
			name: name.trim(),
			quantity: 1
		};

		ingredientList.value = [...ingredientList.value, newIngredient];
		selectedIngredient = null;
		searchValue = '';
	};

	const updateQuantity = (ingredient: Ingredient, delta: number) => {
		ingredientList.value = ingredientList.value.map((i) =>
			i.id === ingredient.id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i
		);
	};

	const deleteIngredient = (ingredient: Ingredient) => {
		ingredientList.value = ingredientList.value.filter((i) => i.id !== ingredient.id);
	};

	const handleSelect = (event: any) => {
		AddIngredient(event.detail.item);
	};
</script>

<div class="flex flex-row gap-2">
	<TypeAhead
		items={availableIngredients}
		bind:value={selectedIngredient}
		bind:searchValue
		placeholder="Search ingredients..."
		class="grow"
		getItemKey={(ingredient) => ingredient.id.toString()}
		getItemLabel={(ingredient) => ingredient.name}
		getItemDescription={(ingredient) => ingredient.category || ''}
		fuseOptions={{
			keys: ['name', 'category'],
			threshold: 0.3
		}}
		allowCustomValue={true}
		onCustomValue={AddCustomIngredient}
		on:select={handleSelect}
	/>
</div>
{#each ingredientList.value as ingredient (ingredient.id)}
	<div class="flex flex-row gap-2 p-1 items-center">
		<Input
			value={ingredient.quantity}
			type="number"
			class="w-10 lg:w-16"
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
		<span class="grow truncate">{ingredient.name}</span>
		<Button variant="ghost" size="icon" onclick={() => deleteIngredient(ingredient)}
			><TrashIcon class="text-red-500" /></Button
		>
	</div>
{/each}
