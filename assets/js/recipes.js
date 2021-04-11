var recipeListEl = document.getElementById("event-list-group");

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
  // var RecipeDiv = document.getElementById("event-list-group");
  var RecipeImg = document.createElement("img");

  //Collect all the variable from an individual event that we will be utilizing
  var recipeData = createEventObject(Recipe);
  saveEvent(recipeData);

  //Initialize containers to hold the important event information
  var eventBoxEl = $("<div>")
    .addClass("container border-black bg-gray")
    .attr("id", "recipe-container");
  var columnBoxEl = $("<div>").addClass("columns").appendTo(eventBoxEl);
  var imageBoxEl = $("<div>").addClass("col-2").appendTo(columnBoxEl);
  var bodyBoxEl = $("<div>").addClass("col-10").appendTo(columnBoxEl);

  //Create elements that have the event data fed into them
  $("<img>")
    .attr("src", RecipeImg)
    .addClass("img-responsive")
    .appendTo(imageBoxEl);

  $("<div>")
    .addClass("card-title h5")
    .text(recipeData["name"])
    .appendTo(bodyBoxEl);
  $("<div>")
    .addClass("card-subtitle text-gray")
    .text(recipeData["info"])
    .appendTo(bodyBoxEl);
  $("<p>").text(recipeData["time"]).appendTo(bodyBoxEl);
  $("<a>")
    .text("Web URL")
    .attr({ href: recipeData["url"], target: "_blank" })
    .appendTo(bodyBoxEl);

  $("<label>")
    .addClass("form-checkbox")
    .html("<input type='checkbox'><i class='form-icon'></i> Add Event")
    .appendTo(bodyBoxEl);

  //Append the final event grouping into our list group with the other events
  recipeBoxEl.appendTo(recipeListEl);
}

$("#recipe").on("click", function () {
  getRecipeData();
});

/* 

var recipeContainer = $("<div>").addClass("container").appendTo(recipeListEl);
  var imageBoxEl = $("<div>").addClass("col-2").appendTo(recipeListEl);
  var bodyBoxEl = $("<div>").addClass("col-10").appendTo(recipeListEl);

  var RecipeImg = document.createElement("img");
  RecipeImg.id = "::img";
  RecipeImg.style.cssText = "width:300px;height:300px;";
  RecipeImg.src = Recipe.strMealThumb;
  RecipeDiv.appendChild(RecipeImg);

  var RecipeIngredients = document.createElement("div"); //put ul back if necessary
  RecipeDiv.appendChild(RecipeIngredients);

  // $("<img>")
  //   .attr("src", RecipeImg)
  //   .addClass("img-responsive")
  //   .appendTo(imageBoxEl);

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

  let value = getIngredients["strMeal"];
  listItem = document.createElement("li");
  listItem.innerHTML = value;
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
  listItem = document.createElement("li");
  listItem.innerHTML = recipeSource;
  RecipeIngredients.appendChild(listItem);

  if (
    recipeSource === null ||
    recipeSource === undefined ||
    recipeSource === ""
  ) {
    let recipeVideo = getVideo["strYoutube"];
    listItem = document.createElement("li");
    listItem.innerHTML = recipeVideo;
    RecipeIngredients.appendChild(listItem);
  }

*/
