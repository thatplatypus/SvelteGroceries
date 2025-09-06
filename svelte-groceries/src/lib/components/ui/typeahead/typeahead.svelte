<script lang="ts" generics="T">
	import { createEventDispatcher, onMount } from 'svelte';
	import { cn } from '$lib/utils.js';
	import { Input } from '$lib/components/ui/input/';
	import { Button } from '$lib/components/ui/button/';
	import { ChevronDownIcon, XIcon } from '@lucide/svelte';
	import Fuse from 'fuse.js';
	import type { IFuseOptions } from 'fuse.js';

	type Props<T> = {
		items: T[];
		value?: T | null;
		searchValue?: string;
		placeholder?: string;
		disabled?: boolean;
		class?: string;
		getItemKey: (item: T) => string;
		getItemLabel: (item: T) => string;
		getItemDescription?: (item: T) => string;
		fuseOptions?: IFuseOptions<T>;
		maxHeight?: string;
		allowCustomValue?: boolean;
		onCustomValue?: (value: string) => void;
	};

	let {
		items,
		value = $bindable(null),
		searchValue = $bindable(''),
		placeholder = 'Search...',
		disabled = false,
		class: className,
		getItemKey,
		getItemLabel,
		getItemDescription,
		fuseOptions = {},
		maxHeight = '200px',
		allowCustomValue = false,
		onCustomValue,
		...restProps
	}: Props<T> = $props();

	const dispatch = createEventDispatcher<{
		select: { item: T };
		clear: {};
	}>();

	let isOpen = $state(false);
	let containerRef: HTMLDivElement | undefined = $state();
	let fuse: Fuse<T> | undefined = $state();
	let filteredItems: T[] = $state([]);
	let selectedIndex = $state(-1);

	const defaultFuseOptions: IFuseOptions<T> = {
		keys: ['name'],
		threshold: 0.3,
		includeScore: true,
		includeMatches: true,
		...fuseOptions
	};

	$effect(() => {
		if (items.length > 0) {
			fuse = new Fuse(items, defaultFuseOptions);
		}
	});

	$effect(() => {
		if (!fuse || !searchValue.trim()) {
			filteredItems = items;
			return;
		}

		const results = fuse.search(searchValue);
		filteredItems = results.map(result => result.item);
	});

	const handleInput = (event: Event) => {
		const target = event.target as HTMLInputElement;
		searchValue = target.value;
		isOpen = true;
		selectedIndex = -1;
	};

	const handleKeyDown = (event: KeyboardEvent) => {
		if (!isOpen) {
			if (event.key === 'Enter' || event.key === 'ArrowDown') {
				isOpen = true;
				event.preventDefault();
			}
			return;
		}

		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault();
				selectedIndex = Math.min(selectedIndex + 1, filteredItems.length - 1);
				break;
			case 'ArrowUp':
				event.preventDefault();
				selectedIndex = Math.max(selectedIndex - 1, -1);
				break;
			case 'Enter':
				event.preventDefault();
				if (selectedIndex >= 0 && selectedIndex < filteredItems.length) {
					selectItem(filteredItems[selectedIndex]);
				} else if (allowCustomValue && searchValue.trim()) {
					onCustomValue?.(searchValue.trim());
				}
				break;
			case 'Escape':
				event.preventDefault();
				closeDropdown();
				break;
		}
	};

	const selectItem = (item: T) => {
		value = item;
		searchValue = getItemLabel(item);
		isOpen = false;
		selectedIndex = -1;
		dispatch('select', { item });
	};

	const clearValue = () => {
		value = null;
		searchValue = '';
		isOpen = false;
		selectedIndex = -1;
		dispatch('clear', {});
	};

	const closeDropdown = () => {
		isOpen = false;
		selectedIndex = -1;
	};

	const handleClickOutside = (event: MouseEvent) => {
		if (containerRef && !containerRef.contains(event.target as Node)) {
			closeDropdown();
		}
	};

	onMount(() => {
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});

	$effect(() => {
		if (value) {
			searchValue = getItemLabel(value);
		}
	});
</script>

<div bind:this={containerRef} class={cn('relative', className)} {...restProps}>
	<div class="relative">
		<Input
			bind:value={searchValue}
			{placeholder}
			{disabled}
			oninput={handleInput}
			onkeydown={handleKeyDown}
			onfocus={() => (isOpen = true)}
			class="pr-8"
		/>
		<div class="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
			{#if value}
				<Button
					variant="ghost"
					size="icon"
					class="h-6 w-6 p-0 hover:bg-transparent"
					onclick={clearValue}
				>
					<XIcon class="h-3 w-3" />
				</Button>
			{/if}
			<Button
				variant="ghost"
				size="icon"
				class="h-6 w-6 p-0 hover:bg-transparent"
				onclick={() => (isOpen = !isOpen)}
			>
				<ChevronDownIcon class={cn('h-3 w-3 transition-transform', isOpen && 'rotate-180')} />
			</Button>
		</div>
	</div>

	{#if isOpen}
		<div
			class="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg"
			style="max-height: {maxHeight};"
		>
			{#if filteredItems.length > 0}
				<div class="max-h-[200px] overflow-auto">
					{#each filteredItems as item, index (getItemKey(item))}
						<button
							type="button"
							class={cn(
								'w-full px-3 py-2 text-left text-sm transition-colors',
								index === selectedIndex
									? 'bg-accent text-accent-foreground'
									: 'hover:bg-accent/50'
							)}
							onclick={() => selectItem(item)}
							onmouseenter={() => (selectedIndex = index)}
						>
							<div class="font-medium">{getItemLabel(item)}</div>
							{#if getItemDescription}
								<div class="text-xs text-muted-foreground">{getItemDescription(item)}</div>
							{/if}
						</button>
					{/each}
				</div>
			{:else if allowCustomValue && searchValue.trim()}
				<button
					type="button"
					class="w-full px-3 py-2 text-left text-sm hover:bg-accent/50"
					onclick={() => onCustomValue?.(searchValue.trim())}
				>
					<div class="font-medium">Add "{searchValue.trim()}"</div>
					<div class="text-xs text-muted-foreground">Create custom item</div>
				</button>
			{:else}
				<div class="px-3 py-2 text-sm text-muted-foreground">
					No items found
				</div>
			{/if}
		</div>
	{/if}
</div>
