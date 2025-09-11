<script lang="ts">
	import type { Ingredient } from '../../stores/ingredient';
	import {
		Dialog,
		DialogContent,
		DialogDescription,
		DialogHeader,
		DialogTitle
	} from '$lib/components/ui/dialog/';
	import { Button } from '$lib/components/ui/button/';
	import { PlusCircleIcon, TagIcon } from '@lucide/svelte';
	import AllergyInfo from './AllergyInfo.svelte';

	interface Props {
		ingredient: Ingredient | null;
		onAddIngredient?: (ingredient: Ingredient) => void;
		open: boolean;
	}

	let { ingredient, onAddIngredient, open = $bindable(false) }: Props = $props();
</script>

<Dialog bind:open>
	<DialogContent class="w-full max-w-sm md:max-w-md absolute">
		<DialogHeader>
			<DialogTitle class="text-xl font-semibold">{ingredient?.name}</DialogTitle>
			{#if ingredient?.category}
				<DialogDescription class="flex items-center gap-2 truncate">
					<TagIcon class="h-4 w-4" />
					<span>{ingredient.category}</span>
				</DialogDescription>
			{/if}
		</DialogHeader>
		{#if ingredient}
		<div class="space-y-4">
			<AllergyInfo allergens={ingredient.allergens} />
			
			{#if onAddIngredient}
				<div class="flex w-full pt-4 border-t">
					<Button onclick={() => {
						onAddIngredient(ingredient);
						open = false;
					}} class="flex w-full items-center gap-2 bg-gradient-to-r from-cyan-500 to-cyan-600">
						<PlusCircleIcon class="h-4 w-4" />
						Add to Grocery List
					</Button>
				</div>
			{/if}
		</div>
		{/if}
	</DialogContent>
</Dialog>
