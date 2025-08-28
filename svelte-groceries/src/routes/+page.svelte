<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Tabs from '$lib/components/ui/tabs/';
	import { ShoppingBasketIcon } from '@lucide/svelte';
	import Settings from '@lucide/svelte/icons/settings';
	import { Ingredient, ingredientStore } from '../stores/ingredient';
	import { onMount } from 'svelte';
	import Groceries from '$lib/components/Groceries.svelte';

	let ingredients: Ingredient[] | undefined;

	onMount(async () => {
		ingredients = await ingredientStore.get();
	});
</script>

<div
	class="w-full bg-gradient-to-r from-teal-900 from-10% via-cyan-900 via-40% to-background to-100% absolute h-10 -z-10"
></div>
<div class="flex flex-col align-center justify-center container lg:container-xl mx-auto">
	<div class="flex flex-row p-2 gap-2">
		<ShoppingBasketIcon class="text-cyan-500 size-6" />
		<h1
			class="bg-gradient-to-r from-cyan-500 to-teal-500 bg-clip-text text-transparent inline-block text-lg"
		>
			Grocery Helper
		</h1>
		<span class="grow"></span>
		<Button variant="secondary" size="icon" class="size-8">
			<Settings />
		</Button>
	</div>
	<Tabs.Root value="groceries" class="flex w-full p-2">
		<Tabs.List class="flex w-full">
			<Tabs.Trigger value="groceries">Groceries</Tabs.Trigger>
			<Tabs.Trigger value="ingredients">Ingredients</Tabs.Trigger>
			<Tabs.Trigger value="meals">Meals</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="groceries">
			<Groceries />
		</Tabs.Content>
		<Tabs.Content value="ingredients">
			<ul>
				{#if ingredients}
					{#each ingredients as ingredient}
						<li class="flex flex-row">
							{ingredient.name}
						</li>
					{/each}
				{/if}
			</ul>
		</Tabs.Content>
		<Tabs.Content value="meals">Enter meals here.</Tabs.Content>
	</Tabs.Root>
</div>
