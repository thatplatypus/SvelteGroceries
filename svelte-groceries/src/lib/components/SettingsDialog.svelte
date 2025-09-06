<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/';
	import { Button } from '$lib/components/ui/button/index.js';
	import { TrashIcon, Settings } from '@lucide/svelte';
	import { groceryListStore } from '../../stores/groceryList';
	import { mealStore } from '../../stores/meal';

	let open = $state(false);

	const clearIngredients = () => {
		groceryListStore.value = [];
		groceryListStore.save();
		open = false;
	};

	const clearMeals = () => {
		mealStore.value = [];
		mealStore.save();
		open = false;
	};
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger>
		<Button variant="secondary" size="icon" class="size-8">
			<Settings />
		</Button>
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title>Settings</Dialog.Title>
			<Dialog.Description>
				Manage your data and application settings.
			</Dialog.Description>
		</Dialog.Header>
		<div class="space-y-4 py-4">
			<div class="space-y-2">
				<h3 class="text-sm font-medium">Clear Data</h3>
				<p class="text-sm text-muted-foreground">
					Remove all stored data. This action cannot be undone.
				</p>
			</div>
			<div class="flex flex-col gap-2">
				<Button 
					variant="destructive" 
					onclick={clearIngredients}
					class="w-full justify-start"
				>
					<TrashIcon class="mr-2 h-4 w-4" />
					Clear All Ingredients
				</Button>
				<Button 
					variant="destructive" 
					onclick={clearMeals}
					class="w-full justify-start"
				>
					<TrashIcon class="mr-2 h-4 w-4" />
					Clear All Meals
				</Button>
			</div>
		</div>
		<Dialog.Footer>
			<Dialog.Close>
				<Button variant="outline">
					Close
				</Button>
			</Dialog.Close>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
