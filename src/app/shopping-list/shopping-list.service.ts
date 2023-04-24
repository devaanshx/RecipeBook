import { Subject } from "rxjs";
import { Ingredient } from "../shared/ingredient.model";

export class ShoppingListService{

    ingredientsChanged = new Subject<Ingredient[]>();
    startedEditing = new Subject<number>();
    
    private Ingredients: Ingredient[] = [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 10)
    ];
    

    getIngredients() {
        return this.Ingredients.slice()
    }

    addIngredient(ingredient:Ingredient) {
        this.Ingredients.push(ingredient);
        this, this.ingredientsChanged.next(this.Ingredients);
    }

    addIngredients(ingredients: Ingredient[]) {
        this.Ingredients.push(...ingredients);
        this.ingredientsChanged.next(this.Ingredients.slice());
    }

    getIngredient(index: number) {
        return this.Ingredients[index];
    }

    updateIngredient(index: number, newIngredient: Ingredient) {
        this.Ingredients[index] = newIngredient;
        this.ingredientsChanged.next(this.Ingredients.slice());
    }

    deleteIngredient(index: number) {
        this.Ingredients.splice(index, 1);
        this.ingredientsChanged.next(this.Ingredients.slice());
    }
}