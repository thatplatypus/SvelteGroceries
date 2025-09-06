import type { Ingredient } from './ingredient';
import { localStore } from './localStore.svelte';

export interface Meal {
	id: number;
	name: string;
	ingredients: Ingredient[];
}

export const mealStore = localStore<Meal[]>('meals', []);
