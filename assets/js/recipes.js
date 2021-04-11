var recipeListEl = document.getElementById("event-list-group");
var savedItemsEl = document.getElementById("#saved-list-content");

//Specifically for saving recipes
var savedRecipes = [];

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
  var RecipeDiv = document.getElementById("event-list-group");
  var recipeBox = $("<div>")
    .addClass("container border-black bg-gray my-2")
    .attr("id", "recipe-container");
  recipeBox.appendTo(recipeListEl);

  var RecipeImg = document.createElement("img");
  RecipeImg.id = "::img";
  RecipeImg.style.cssText = "width:300px;height:300px;";
  $(RecipeImg).addClass("inline-img");
  RecipeImg.src = Recipe.strMealThumb;
  RecipeDiv.appendChild(RecipeImg);

  var RecipeIngredients = document.createElement("ul");
  $(RecipeIngredients).addClass("inline-ul");
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

  var getArea = Object.keys(Recipe)
    .filter(function (ingredient) {
      return ingredient.indexOf("strArea") == 0;
    })
    .reduce(function (ingredients, ingredient) {
      if (Recipe[ingredient] != null) {
        ingredients[ingredient] = Recipe[ingredient];
      }
      return ingredients;
    }, {});

  var getCategory = Object.keys(Recipe)
    .filter(function (ingredient) {
      return ingredient.indexOf("strCategory") == 0;
    })
    .reduce(function (ingredients, ingredient) {
      if (Recipe[ingredient] != null) {
        ingredients[ingredient] = Recipe[ingredient];
      }
      return ingredients;
    }, {});

  var getSource = Object.keys(Recipe)
    .filter(function (ingredient) {
      return ingredient.indexOf("strSource") == 0;
    })
    .reduce(function (ingredients, ingredient) {
      if (Recipe[ingredient] != null) {
        ingredients[ingredient] = Recipe[ingredient];
      }
      return ingredients;
    }, {});

  var getVideo = Object.keys(Recipe)
    .filter(function (ingredient) {
      return ingredient.indexOf("strYoutube") == 0;
    })
    .reduce(function (ingredients, ingredient) {
      if (Recipe[ingredient] != null) {
        ingredients[ingredient] = Recipe[ingredient];
      }
      return ingredients;
    }, {});

  //pushing recipe object into saved recipes array
  function saveRecipe(recipeObject) {
    savedRecipes.push(recipeObject);
  }

  let recipeName = getIngredients["strMeal"];
  listItem = document.createElement("li");
  listItem.innerHTML = recipeName;
  RecipeIngredients.appendChild(listItem);

  let area = getArea["strArea"];
  listItem = document.createElement("li");
  listItem.innerHTML = area;
  RecipeIngredients.appendChild(listItem);

  let category = getCategory["strCategory"];
  listItem = document.createElement("li");
  listItem.innerHTML = category;
  RecipeIngredients.appendChild(listItem);

  let recipeSource = getSource["strSource"];
  if (recipeSource) {
    var link = $("<li>").appendTo(listItem);
    $("<a>")
      .text("Recipe Link")
      .attr("href", `${recipeSource}`)
      .attr("target", "_blank")
      .appendTo(link);
  }

  let recipeVideo = getVideo["strYoutube"];
  if (recipeVideo) {
    var videolink = $("<li>").appendTo(listItem);
    $("<a>")
      .text("Recipe YouTube Video")
      .attr("href", `${recipeVideo}`)
      .attr("target", "_blank")
      .appendTo(videolink);
    console.log(Recipe);
  }
}

$("#recipe").on("click", function () {
  getRecipeData();
});

function saveListToStorage() {
  localStorage.setItem("savedList", JSON.stringify(savedList));
}

//Load the global list from local storage and set it
function loadListFromStorage() {
  var storageList = JSON.parse(localStorage.getItem("savedList"));

  if (storageList) {
    savedList = storageList;
  }
}

function createRecipeObject(recipe) {
  var recipeObject = {
    name: recipe.strMeal,
    category: recipe.strCategory,
    url: recipe.strSource,
  };
  return recipeObject;
}
