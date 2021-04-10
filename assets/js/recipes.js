var recipeListEl = document.getElementById("recipe-list");

function getRecipeData() {
  let times = 20;
  let arr = [];
  for (let i = 0; i < times; i++) {
    //loop 20 times for 20 random recipes
    fetch("https://www.themealdb.com/api/json/v1/1/random.php")
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("There is an error");
        }
      })
      .then(function (data) {
        console.log(data);
        arr.push(data.meals[0]); //push data into array
        displayRecipe(data); //display the recipe 20 times
      })
      .catch((error) => {
        console.error("FETCH ERROR:", error);
      });
  } //once loop is done
  console.log(arr);
  recipeListEl.innerHTML = "";
}


//display random recipes in an array

function displayRecipe(data) {
  var Recipe = data.meals[0];
  var RecipeDiv = document.getElementById("recipe-list"); ``

  var RecipeImg = document.createElement("img");
  RecipeImg.id = "::img";
  RecipeImg.style.cssText = "width:300px;height:300px;";
  RecipeImg.src = Recipe.strMealThumb;
  RecipeDiv.appendChild(RecipeImg);

  var RecipeIngredients = document.createElement("ul");
  RecipeDiv.appendChild(RecipeIngredients);
  $("<label>")
    .addClass("form-checkbox")
    .html("<input type='checkbox'><i class='form-icon'></i> Add Recipe")
    .appendTo(recipeListEl);
  $("<label>")
    .addClass("linebreak")
    .html("<hr style=width: 100%>")
    .appendTo(recipeListEl);

  var getIngredients = Object.keys(Recipe)
    .filter(function (ingredient) {
      return ingredient.indexOf("strMeal") == 0;
    })
    .reduce(function (ingredients, ingredient) {
      if (Recipe[ingredient] != null) {
        ingredients[ingredient] = Recipe[ingredient];
      }
      return ingredients;
    }, {});

  for (let key in getIngredients) {
    let value = getIngredients[key];
    listItem = document.createElement("li");
    listItem.innerHTML = value;
    RecipeIngredients.appendChild(listItem);
  }
}

$("#recipe").on("click", function () {
  getRecipeData();
});

// function saveRecipe(data) {

// }
