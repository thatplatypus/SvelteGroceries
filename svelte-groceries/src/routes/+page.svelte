<script lang="ts">
    import { Button } from "$lib/components/ui/button/index.js";
    import { Input } from "$lib/components/ui/input/";
	import * as Tabs from "$lib/components/ui/tabs/";
	import { ShoppingBasketIcon } from "@lucide/svelte";
    import Settings from "@lucide/svelte/icons/settings"
</script>
<div class="flex flex-row p-2 gap-2">
    <ShoppingBasketIcon class="text-cyan-500 size-6" />
    <h1 class="bg-gradient-to-r from-cyan-500 to-teal-500 bg-clip-text text-transparent inline-block text-lg">Grocery Helper</h1>
    <span class="grow"></span>
    <Button variant="secondary" size="icon" class="size-8">
        <Settings />
    </Button>
</div>
<Tabs.Root value="groceries" class="flex w-full p-2">
    <Tabs.List class="flex w-full">
      <Tabs.Trigger value="groceries">Groceries</Tabs.Trigger>
      <Tabs.Trigger value="meals">Meals</Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content value="groceries">
        <div class="flex flex-row">
        <Input type="email" placeholder="email" class="max-w-xs" />
        <Button>Add</Button>
    </div>
    </Tabs.Content>
    <Tabs.Content value="meals">Enter meals here.</Tabs.Content>
  </Tabs.Root>