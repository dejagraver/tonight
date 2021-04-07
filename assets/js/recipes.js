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
    displayRecipe(data);
  })
  .catch((error) => {
    console.error("FETCH ERROR:", error);
  });

function displayRecipe(data) {
  var Recipe = data.meals[0];
  var RecipeDiv = document.getElementById("recipe");

  var RecipeImg = document.createElement("img");
  RecipeImg.src = Recipe.strMealThumb;
  RecipeDiv.appendChild(RecipeImg);
  // document.body.style.backgroundImage = "url('" + Recipe.strMealThumb + "')";

  var RecipeIngredients = document.createElement("ul");
  RecipeDiv.appendChild(RecipeIngredients);

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