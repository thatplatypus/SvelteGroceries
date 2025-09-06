<script lang="ts">
	import type { Ingredient } from '../../stores/ingredient';
	import { ingredientStore } from '../../stores/ingredient';
	import { Button } from '$lib/components/ui/button/';
	import { Input } from '$lib/components/ui/input/';
	import { TypeAhead } from '$lib/components/ui/typeahead/';
	import { Select, SelectContent, SelectItem, SelectTrigger } from '$lib/components/ui/select/';
	import { PlusCircleIcon } from '@lucide/svelte';
	import { groceryListStore } from '../../stores/groceryList';
	import { RingLoader } from 'svelte-loading-spinners';

	const ingredientList = groceryListStore;
	let selectedIngredient: Ingredient | null = $state(null);
	let searchValue = $state('');
	let availableIngredients: Ingredient[] = $state([]);
	let nameFilter = $state('');
	let selectedCategories: string[] = $state([]);
	let filteredIngredients: Ingredient[] = $state([]);
	let availableCategories: string[] = $state([]);

	$effect(() => {
		ingredientList.initialize();
		(async () => {
			try {
				availableIngredients = await $ingredientStore;
				availableCategories = [
					...new Set(
						availableIngredients.map((i) => i.category).filter((cat): cat is string => Boolean(cat))
					)
				].sort();
			} catch (error) {
				console.error('IngredientsTab: Failed to load ingredients:', error);
				availableIngredients = [];
				availableCategories = [];
			}
		})();
	});

	$effect(() => {
		filteredIngredients = availableIngredients.filter((ingredient) => {
			const matchesName =
				!nameFilter || ingredient.name.toLowerCase().includes(nameFilter.toLowerCase());
			const matchesCategory =
				selectedCategories.length === 0 ||
				(ingredient.category && selectedCategories.includes(ingredient.category));
			return matchesName && matchesCategory;
		});
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

	const toggleCategory = (category: string) => {
		if (selectedCategories.includes(category)) {
			selectedCategories = selectedCategories.filter((c) => c !== category);
		} else {
			selectedCategories = [...selectedCategories, category];
		}
	};

	const clearFilters = () => {
		nameFilter = '';
		selectedCategories = [];
	};
</script>

<div class="flex flex-col gap-4">
	<div class="flex flex-row gap-2">
		<Input bind:value={nameFilter} placeholder="Filter by name..." class="grow" />
		<div class="flex relative grow">
			<Select>
				<SelectTrigger>
					<span class="truncate">
						{selectedCategories.length === 0
							? 'All categories'
							: selectedCategories.length === 1
								? selectedCategories[0]
								: `${selectedCategories.length} categories`}
					</span>
				</SelectTrigger>
				<SelectContent>
					{#each availableCategories as category}
						<SelectItem value={category}>
							<button
								type="button"
								class="flex items-center gap-2 w-full text-left"
								onclick={() => toggleCategory(category)}
							>
								<input
									type="checkbox"
									checked={selectedCategories.includes(category)}
									class="rounded"
									readonly
								/>
								{category}
							</button>
						</SelectItem>
					{/each}
				</SelectContent>
			</Select>
		</div>
		{#if nameFilter || selectedCategories.length > 0}
			<Button variant="outline" onclick={clearFilters} class="px-3">Clear</Button>
		{/if}
	</div>

	{#if availableIngredients.length > 0}
		<ul class="space-y-2">
			{#each filteredIngredients as ingredient (ingredient.id)}
				<li class="flex flex-row p-2 items-center border rounded">
					<span class="grow truncate">{ingredient.name}</span>
					{#if ingredient.category}
						<span class="text-sm text-muted-foreground mr-2 truncate">{ingredient.category}</span>
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
		{#if filteredIngredients.length === 0 && (nameFilter || selectedCategories.length > 0)}
			<div class="text-center text-muted-foreground py-4">No ingredients match your filters</div>
		{/if}
	{:else}
		<div class="text-center text-muted-foreground"><RingLoader color="#14b8a6" /></div>
	{/if}
</div>
