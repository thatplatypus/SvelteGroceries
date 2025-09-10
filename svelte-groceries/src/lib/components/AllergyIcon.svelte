<script lang="ts">
	import { 
		NutIcon, 
		EggIcon, 
		MilkIcon, 
		WheatIcon, 
		CroissantIcon, 
		FishIcon, 
		BeanIcon, 
		SproutIcon, 
		ShrimpIcon,
		ShieldIcon
	} from '@lucide/svelte';

	interface Props {
		allergen: string;
	}

	let { allergen }: Props = $props();

	const allergenIconMap: Record<string, any> = {
		tree_nut: NutIcon,
		egg: EggIcon,
		milk: MilkIcon,
		gluten: WheatIcon,
		wheat: CroissantIcon,
		fish: FishIcon,
		soy: BeanIcon,
		peanut: NutIcon,
		sesame: SproutIcon,
		shellfish: ShrimpIcon
	};

	function getIconForAllergen(allergen: string) {
		return allergenIconMap[allergen] || ShieldIcon;
	}
</script>

{#if true}
	{@const IconComponent = getIconForAllergen(allergen)}
	<IconComponent class="h-3 w-3" />
{/if}
