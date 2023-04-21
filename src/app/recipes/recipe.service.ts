import { EventEmitter, Injectable } from "@angular/core";
import { Recipe } from "./recipe.model";
import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";

@Injectable()
export class RecipeService{

    recipeSelected = new EventEmitter<Recipe>();

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
    }

    addIngredientsToShoppingList(ingredients:Ingredient[]) {
        this.shoppingListService.addIngredients(ingredients);
    }

    getRecipe(id: number) {
        return this.recipes[id];
    }
}