<script lang="ts">
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" type="image/x-icon" href="/SvelteGroceries/favicon.ico" />
</svelte:head>

<ModeWatcher defaultMode="system" />
{@render children?.()}
