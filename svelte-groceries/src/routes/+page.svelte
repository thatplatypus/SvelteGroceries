<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Tabs from '$lib/components/ui/tabs/';
	import { MoonIcon, SunIcon, ShoppingBasketIcon, TrashIcon } from '@lucide/svelte';
	import Groceries from '$lib/components/Groceries.svelte';
	import { toggleMode } from 'mode-watcher';
	import IngredientsTab from '$lib/components/IngredientsTab.svelte';
	import Meals from '$lib/components/Meals.svelte';
	import SettingsDialog from '$lib/components/SettingsDialog.svelte';
</script>

<div
	class="w-full bg-gradient-to-r from-teal-900 from-10% via-cyan-900 via-40% to-background to-100% absolute h-11 -z-10"
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
		<Button onclick={toggleMode} variant="secondary" size="icon" class="size-8">
			<SunIcon class="rotate-0 scale-100 !transition-all dark:-rotate-90 dark:scale-0" />
			<MoonIcon class="absolute rotate-90 scale-0 !transition-all dark:rotate-0 dark:scale-100" />
			<span class="sr-only">Toggle theme</span>
		</Button>
		<SettingsDialog />
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
			<IngredientsTab />
		</Tabs.Content>
		<Tabs.Content value="meals"><Meals /></Tabs.Content>
	</Tabs.Root>
</div>
