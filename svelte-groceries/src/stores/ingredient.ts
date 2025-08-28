import { asyncable } from '../lib/asyncable'
import type { Asyncable } from '../lib/asyncable'

export class Ingredient {
    constructor(public id: number, public name: string, public category?: string, public allergens?: string[]) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.allergens = allergens;
    }
}

let cachedIngredients: Ingredient[] | undefined = undefined;
export const ingredientStore: Asyncable<Ingredient[]> = asyncable<Ingredient[]>(async () => {
    return cachedIngredients ??= await fetch('./ingredients_slim.json').then(resp => {
        if (!resp.ok) {
            throw new Error(`Failed to fetch ingredients: ${resp.status}`);
        }
        return resp.json();
    }).then(data => {
        return data.ingredients.map((ingredient: any) => 
            new Ingredient(
                ingredient.id,
                ingredient.name,
                ingredient.category,
                ingredient.allergens
            )
        );
    });
});