import { Injectable } from "@angular/core";
import { Recipe } from "./recipe.model";
import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Subject } from "rxjs";

@Injectable()
export class RecipeService{

    recipesChanged = new Subject<Recipe[]>();

    private recipes: Recipe[] = [
        new Recipe('A Tasty Sandwich', 'This is simply a test', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQlEadJnTOLNLeFPCGpSDn_ODtIgoV7oaC0g&usqp=CAU', [
            new Ingredient('Meat', 5),
            new Ingredient('Bread', 1),
            new Ingredient('Cheese',2)
    ]),
        new Recipe('A Tasty Burger', 'This is simply a test', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwKZkLMDo4ExjtmUNBao6thxa1O893RtXKYA&usqp=CAU',[
        new Ingredient('Meat', 1),
        new Ingredient('Bun', 2),
        new Ingredient('Cheese',2)
    ])];
    

    constructor(private shoppingListService: ShoppingListService) { }
    


    getRecipes() {
        return this.recipes.slice();
    }

    getIngredients() {
        return this.recipes['ingredients'].slice()
    }

    addRecipe(recipe:Recipe) {
        this.recipes.push(recipe);
        this.recipesChanged.next(this.recipes.slice());
    }

    updateRecipe(index: number, newRecipe: Recipe) {
        this.recipes[index] = newRecipe;
        this.recipesChanged.next(this.recipes.slice());
    }

    addIngredientsToShoppingList(ingredients:Ingredient[]) {
        this.shoppingListService.addIngredients(ingredients);
    }

    getRecipe(id: number) {
        return this.recipes[id];
    }

    getIndex() {
        return +(this.recipes.length-1);
    }

    deleteRecipe(index: number) {
        this.recipes.splice(index, 1);
        this.recipesChanged.next(this.recipes.slice());
    }
}