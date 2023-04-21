import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.css']
})
export class RecipeDetailsComponent implements OnInit{

  passedRecipe: Recipe;

  constructor(private recipeService:RecipeService, private route:ActivatedRoute, private router:Router){}
  ngOnInit(): void {
    this.route.params.subscribe((param: Params) => {
      this.passedRecipe = this.recipeService.getRecipe(+param['id']);
    })
  }

  onAddToShoppingList() {
    this.recipeService.addIngredientsToShoppingList(this.passedRecipe.ingredients);
  }

  onEditRecipe() {
    this.router.navigate(['edit'],{relativeTo:this.route});
  }

}
