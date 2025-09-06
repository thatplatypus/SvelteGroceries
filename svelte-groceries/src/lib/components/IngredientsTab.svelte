<script lang="ts">
	import type { Ingredient } from '../../stores/ingredient';
	import { ingredientStore } from '../../stores/ingredient';
	import { Button } from '$lib/components/ui/button/';
	import { Input } from '$lib/components/ui/input/';
	import { TypeAhead } from '$lib/components/ui/typeahead/';
	import { PlusCircleIcon } from '@lucide/svelte';
	import { groceryListStore } from '../../stores/groceryList';
	import { RingLoader } from 'svelte-loading-spinners';

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
				console.error('IngredientsTab: Failed to load ingredients:', error);
				availableIngredients = [];
			}
		})();
	});

	const AddIngredient = (ingredient: Ingredient) => {
		console.log('Adding ingredient:', ingredient.name, 'to grocery list');
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
		console.log('Current grocery list:', ingredientList.value);
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

	const handleSelect = (event: any) => {
		AddIngredient(event.detail.item);
	};
</script>

<div class="flex flex-col gap-4">
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

	{#if availableIngredients.length > 0}
		<ul class="space-y-2">
			{#each availableIngredients as ingredient (ingredient.id)}
				<li class="flex flex-row p-2 items-center border rounded">
					<span class="grow">{ingredient.name}</span>
					{#if ingredient.category}
						<span class="text-sm text-muted-foreground mr-2">{ingredient.category}</span>
					{/if}
					<Button 
						variant="ghost" 
						size="icon" 
						onclick={() => AddIngredient(ingredient)}
						class="hover:bg-green-100 dark:hover:bg-green-900"
					>
						<PlusCircleIcon />
					</Button>
				</li>
			{/each}
		</ul>
	{:else}
		<div class="text-center text-muted-foreground"><RingLoader color="#14b8a6" /></div>
	{/if}
</div>
