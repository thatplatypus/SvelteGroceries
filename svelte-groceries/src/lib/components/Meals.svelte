<script lang="ts">
	import { Button } from '$lib/components/ui/button/';
	import { Input } from '$lib/components/ui/input/';
	import {
		Accordion,
		AccordionContent,
		AccordionItem,
		AccordionTrigger
	} from '$lib/components/ui/accordion/';
	import { PlusIcon, EditIcon, ChevronDownIcon, ChevronUpIcon, HamburgerIcon } from '@lucide/svelte';
	import type { Meal } from '../../stores/meal';
	import { mealStore } from '../../stores/meal';
	import { groceryListStore } from '../../stores/groceryList';
	import IngredientListItem from './IngredientListItem.svelte';
	import MealDialog from './MealDialog.svelte';

	const meals = mealStore;
	const groceryList = groceryListStore;

	let searchValue = $state('');
	let filteredMeals: Meal[] = $state([]);
	let allExpanded = $state(false);
	let editMealDialogOpen = $state(false);
	let addMealDialogOpen = $state(false);
	let selectedMeal: Meal | null = $state(null);

	$effect(() => {
		meals.initialize();
		filterMeals();
	});

	$effect(() => {
		filterMeals();
	});

	const filterMeals = () => {
		if (!searchValue.trim()) {
			filteredMeals = meals.value;
			return;
		}

		const searchLower = searchValue.toLowerCase();
		filteredMeals = meals.value.filter((meal) => {
			const nameMatch = meal.name.toLowerCase().includes(searchLower);
			const ingredientMatch = meal.ingredients.some((ingredient) =>
				ingredient.name.toLowerCase().includes(searchLower)
			);
			return nameMatch || ingredientMatch;
		});
	};

	const addMealToGroceryList = (meal: Meal) => {
		meal.ingredients.forEach((mealIngredient) => {
			const existingIngredient = groceryList.value.find((i) => i.id === mealIngredient.id);
			if (existingIngredient) {
				groceryList.value = groceryList.value.map((i) =>
					i.id === mealIngredient.id ? { ...i, quantity: i.quantity + mealIngredient.quantity } : i
				);
			} else {
				groceryList.value = [...groceryList.value, { ...mealIngredient }];
			}
		});
	};

	const saveMeal = (meal: Meal) => {
		if (meal.id && meals.value.find((m) => m.id === meal.id)) {
			meals.value = meals.value.map((m) => (m.id === meal.id ? meal : m));
		} else {
			meals.value = [...meals.value, meal];
		}
		meals.save();
	};

	const deleteMeal = (meal: Meal) => {
		meals.value = meals.value.filter((m) => m.id !== meal.id);
		meals.save();
	};

	const toggleAllExpanded = () => {
		allExpanded = !allExpanded;
	};

	const openEditDialog = (meal: Meal) => {
		selectedMeal = meal;
		editMealDialogOpen = true;
	};

	const closeEditDialog = () => {
		editMealDialogOpen = false;
		selectedMeal = null;
	};

	const openAddDialog = () => {
		addMealDialogOpen = true;
	};

	const closeAddDialog = () => {
		addMealDialogOpen = false;
	};
</script>

<div class="flex flex-col gap-4">
	<div class="flex flex-row gap-2">
		<Input bind:value={searchValue} placeholder="Search meals..." class="grow" />
		<Button variant="outline" size="icon" onclick={toggleAllExpanded}>
			{#if allExpanded}
				<ChevronUpIcon />
			{:else}
				<ChevronDownIcon />
			{/if}
		</Button>
	</div>

	{#if filteredMeals.length > 0}
		<Accordion
			value={allExpanded ? filteredMeals.map((m) => m.id.toString()) : []}
			type="multiple"
			class="flex w-full flex-col"
		>
			{#each filteredMeals as meal (meal.id)}
				<AccordionItem value={meal.id.toString()} class="flex w-full grow flex-col items-center">
					<div class="flex flex-row grow w-full items-center">
						<AccordionTrigger class="flex-1 grow w-full">
							<div class="flex flex-col items-center gap-2 w-full">
								<div class="flex flex-row items-center gap-2">
									<span>{meal.name}</span>
									<span class="text-muted-foreground text-sm">
										{meal.ingredients.length} ingredient{meal.ingredients.length !== 1 ? 's' : ''}
									</span>
								</div>
							</div>
						</AccordionTrigger>

						<span class="flex grow"></span>

						<Button variant="ghost" size="icon" onclick={() => openEditDialog(meal)}>
							<EditIcon />
						</Button>

						<Button
							variant="ghost"
							size="icon"
							onclick={() => addMealToGroceryList(meal)}
							class="hover:bg-green-100 dark:hover:bg-green-900"
						>
							<PlusIcon />
						</Button>
					</div>

					<AccordionContent>
						<div class="flex space-y-1 pl-4 flex-col">
							{#each meal.ingredients as ingredient (ingredient.id)}
								<IngredientListItem {ingredient} readonly={true} />
							{/each}
						</div>
					</AccordionContent>
				</AccordionItem>
			{/each}
		</Accordion>

		{#if filteredMeals.length === 0 && searchValue}
			<div class="text-center text-muted-foreground py-4">No meals match your search</div>
		{/if}
	{:else}
	<div class="flex items-center justify-center w-full h-[50vh] flex-col gap-4">
		<span class="w-[15%] h-[15%] text-cyan-700"><HamburgerIcon size="large" /></span>
		<span class="text-2xl">No meals saved!</span>
		<span class="text-muted-foreground">Create your first meal below</span>
		<Button onclick={openAddDialog} class="w-75 mx-auto mt-4 bg-gradient-to-r from-cyan-500 to-cyan-600">
			<PlusIcon class="mr-2" />
			Create Meal
		</Button>
	</div>
	{/if}

	<MealDialog
		open={editMealDialogOpen}
		meal={selectedMeal}
		onClose={closeEditDialog}
		onSave={saveMeal}
	/>

	<MealDialog open={addMealDialogOpen} onClose={closeAddDialog} onSave={saveMeal} />
</div>
