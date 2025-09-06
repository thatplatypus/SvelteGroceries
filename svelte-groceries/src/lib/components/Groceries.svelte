<script lang="ts">
	import { TypeAhead } from '$lib/components/ui/typeahead/';
	import type { Ingredient } from '../../stores/ingredient';
	import { ingredientStore } from '../../stores/ingredient';
	import { groceryListStore } from '../../stores/groceryList';
	import IngredientListItem from './IngredientListItem.svelte';

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
		ingredientList.save();
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
		ingredientList.save();
		selectedIngredient = null;
		searchValue = '';
	};

	const updateQuantity = (ingredient: Ingredient, delta: number) => {
		ingredientList.value = ingredientList.value.map((i) =>
			i.id === ingredient.id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i
		);
		ingredientList.save();
	};

	const deleteIngredient = (ingredient: Ingredient) => {
		ingredientList.value = ingredientList.value.filter((i) => i.id !== ingredient.id);
		ingredientList.save();
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
	<IngredientListItem 
		{ingredient}
		onUpdateQuantity={updateQuantity}
		onDelete={deleteIngredient}
		onQuantityChange={(ingredient, quantity) => {
			ingredientList.value = ingredientList.value.map((i) =>
				i.id === ingredient.id ? { ...i, quantity } : i
			);
			ingredientList.save();
		}}
	/>
{/each}
