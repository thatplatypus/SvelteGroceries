<script lang="ts">
	import { Button } from '$lib/components/ui/button/';
	import { Input } from '$lib/components/ui/input/';
	import { MinusCircleIcon, PlusCircleIcon, TrashIcon } from '@lucide/svelte';
	import type { Ingredient } from '../../stores/ingredient';
	import { Separator } from '$lib/components/ui/separator/index.js';

	interface Props {
		ingredient: Ingredient;
		readonly?: boolean;
		onUpdateQuantity?: (ingredient: Ingredient, delta: number) => void;
		onDelete?: (ingredient: Ingredient) => void;
		onQuantityChange?: (ingredient: Ingredient, quantity: number) => void;
	}

	let { 
		ingredient, 
		readonly = false, 
		onUpdateQuantity, 
		onDelete, 
		onQuantityChange 
	}: Props = $props();
</script>

<div class="flex flex-row gap-2 p-1 items-center">
	{#if readonly}
		<span class="w-10 lg:w-16 text-center">{ingredient.quantity}</span>
	{:else}
		<Input
			value={ingredient.quantity}
			type="number"
			class="w-10 lg:w-16"
			oninput={(e) => {
				const target = e.target as HTMLInputElement | null;
				if (!target || !onQuantityChange) return;
				const newQuantity = parseInt(target.value) || 0;
				onQuantityChange(ingredient, Math.max(0, newQuantity));
			}}
		/>
	{/if}
	
	{#if !readonly && onUpdateQuantity}
		<Button variant="ghost" onclick={() => onUpdateQuantity(ingredient, -1)}
			><MinusCircleIcon /></Button
		>
		<Button variant="ghost" onclick={() => onUpdateQuantity(ingredient, 1)}><PlusCircleIcon /></Button
		>
	{/if}
	
	<Separator orientation="vertical" class="mx-2" />
	<span class="grow truncate {ingredient.quantity === 0 ? 'line-through text-green-600 dark:text-green-400' : ''}">{ingredient.name}</span>
	
	{#if !readonly && onDelete}
		<Button variant="ghost" size="icon" onclick={() => onDelete(ingredient)}
			><TrashIcon class="text-red-500" /></Button
		>
	{/if}
</div>


