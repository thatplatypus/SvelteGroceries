import type { Ingredient } from './ingredient';
import { localStore } from './localStore.svelte';

export const groceryListStore = localStore<Ingredient[]>('ingredientList', []);
