<script lang="ts">
	import { AlertTriangleIcon, ShieldIcon, ShieldPlusIcon } from '@lucide/svelte';
	import AllergyIcon from './AllergyIcon.svelte';

	interface Props {
		allergens?: string[];
	}

	let { allergens = [] }: Props = $props();
</script>

{#if allergens && allergens.length > 0}
	<div class="flex flex-col gap-2">
		<div class="flex items-center gap-2 text-sm font-medium text-amber-600 dark:text-amber-400">
			<AlertTriangleIcon class="h-4 w-4" />
			<span>Allergens</span>
		</div>
		<div class="flex flex-wrap gap-1">
			{#each allergens as allergen}
				<span class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
					<AllergyIcon {allergen} />
					{allergen}
				</span>
			{/each}
		</div>
	</div>
{:else}
	<div class="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
		<ShieldPlusIcon class="h-4 w-4" />
		<span>No known allergens</span>
	</div>
{/if}
