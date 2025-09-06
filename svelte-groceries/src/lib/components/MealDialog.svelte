<script lang="ts">
	import { Button } from '$lib/components/ui/button/';
	import { Input } from '$lib/components/ui/input/';
	import { TypeAhead } from '$lib/components/ui/typeahead/';
	import {
		Dialog,
		DialogContent,
		DialogDescription,
		DialogFooter,
		DialogHeader,
		DialogTitle
	} from '$lib/components/ui/dialog/';
	import type { Ingredient } from '../../stores/ingredient';
	import { ingredientStore } from '../../stores/ingredient';
	import type { Meal } from '../../stores/meal';
	import IngredientListItem from './IngredientListItem.svelte';

	interface Props {
		open: boolean;
		meal?: Meal | null;
		onClose: () => void;
		onSave: (meal: Meal) => void;
	}

	let { open, meal, onClose, onSave }: Props = $props();

	let mealName = $state('');
	let mealIngredients: Ingredient[] = $state([]);
	let selectedIngredient: Ingredient | null = $state(null);
	let searchValue = $state('');
	let availableIngredients: Ingredient[] = $state([]);

	$effect(() => {
		if (open) {
			if (meal) {
				mealName = meal.name;
				mealIngredients = [...meal.ingredients];
			} else {
				mealName = '';
				mealIngredients = [];
			}
			selectedIngredient = null;
			searchValue = '';
		}
	});

	$effect(() => {
		if (open) {
			(async () => {
				try {
					availableIngredients = await $ingredientStore;
				} catch (error) {
					console.error('MealDialog: Failed to load ingredients:', error);
					availableIngredients = [];
				}
			})();
		}
	});

	const addIngredient = (ingredient: Ingredient) => {
		const existingIngredient = mealIngredients.find((i) => i.id === ingredient.id);
		if (existingIngredient) {
			updateQuantity(existingIngredient, 1);
		} else {
			const newIngredient: Ingredient = {
				...ingredient,
				quantity: 1
			};
			mealIngredients = [...mealIngredients, newIngredient];
		}
		selectedIngredient = null;
		searchValue = '';
	};

	const addCustomIngredient = (name: string) => {
		if (!name.trim()) return;

		const newIngredient: Ingredient = {
			id: mealIngredients.length ? Math.max(...mealIngredients.map((i) => i.id)) + 1 : 1,
			name: name.trim(),
			quantity: 1
		};

		mealIngredients = [...mealIngredients, newIngredient];
		selectedIngredient = null;
		searchValue = '';
	};

	const updateQuantity = (ingredient: Ingredient, delta: number) => {
		mealIngredients = mealIngredients.map((i) =>
			i.id === ingredient.id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i
		);
	};

	const deleteIngredient = (ingredient: Ingredient) => {
		mealIngredients = mealIngredients.filter((i) => i.id !== ingredient.id);
	};

	const handleSelect = (event: any) => {
		addIngredient(event.detail.item);
	};

	const handleSave = () => {
		if (!mealName.trim()) return;

		const mealToSave: Meal = {
			id: meal?.id || Date.now(),
			name: mealName.trim(),
			ingredients: mealIngredients
		};

		onSave(mealToSave);
		onClose();
	};
</script>

<Dialog bind:open>
	<DialogContent class="w-full md:max-w-2xl">
		<DialogHeader>
			<DialogTitle>{meal ? 'Edit Meal' : 'Add Meal'}</DialogTitle>
			<DialogDescription>
				{meal
					? 'Modify the ingredients for this meal.'
					: 'Create a new meal by adding ingredients.'}
			</DialogDescription>
		</DialogHeader>

		<div class="space-y-4">
			<div>
				<Input bind:value={mealName} placeholder="Meal name..." class="w-full" />
			</div>

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
					onCustomValue={addCustomIngredient}
					on:select={handleSelect}
				/>
			</div>

			<div class="space-y-2">
				{#each mealIngredients as ingredient (ingredient.id)}
					<IngredientListItem
						{ingredient}
						onUpdateQuantity={updateQuantity}
						onDelete={deleteIngredient}
						onQuantityChange={(ingredient, quantity) => {
							mealIngredients = mealIngredients.map((i) =>
								i.id === ingredient.id ? { ...i, quantity } : i
							);
						}}
					/>
				{/each}
			</div>
		</div>

		<DialogFooter>
			<Button variant="outline" onclick={onClose}>Cancel</Button>
			<Button onclick={handleSave} disabled={!mealName.trim()}>
				{meal ? 'Update Meal' : 'Add Meal'}
			</Button>
		</DialogFooter>
	</DialogContent>
</Dialog>
