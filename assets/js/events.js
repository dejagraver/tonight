//Consumer Key: 9MbzzCg3cSnWRYXGAvroFdbBihxg6rgn
//Consumer Secret: xISar1JtBhcLCcBk

//Initialize a global storage array for saving to local storage
var savedList = {
  movies: [],
  events: [],
  recipes: [],
};

//Initialize a variable for the main event search list and saved event list
var eventListGroupEl = $("#event-list-group");
var savedListEl = $("#saved-list-content");

//Initialize an event container for saving/loading
var savedEvents = [];
var savedRecipes = [];
var savedMovies = [];

//Initialize and provide a default value for the user's latitude and logitude in case we cannot take their location
var userLat = 43.653226;
var userLon = -79.3831843;

//Request the user's geographic location
function getLocation() {
  //Check if geolocation is available to the browser
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      geolocationSuccess,
      geolocationFailure
    );
  } else {
    openModal("Geolocation is not supported by this browser.", "Error");
  }
}

//Called if we were given access to the user location
function geolocationSuccess(position) {
  //store the user location data in global variable for use in the API call
  userLat = position.coords.latitude;
  userLon = position.coords.longitude;
}

//Called if the user location request was denied
function geolocationFailure(error) {
  var errorMEssage;

  //Return an error message depending on the reason for location failure
  switch (error.code) {
    case error.PERMISSION_DENIED:
      errorMEssage = "User denied the request for Geolocation.";
      break;
    case error.POSITION_UNAVAILABLE:
      errorMEssage = "Location information is unavailable.";
      break;
    case error.TIMEOUT:
      errorMEssage = "The request to get user location timed out.";
      break;
    case error.UNKNOWN_ERROR:
      errorMEssage = "An unknown error occurred.";
      break;
  }

  openModal(errorMEssage, "Error");
}

//Fetch Ticketmaster data using the API
function fetchEventData() {
  //searches ticketmaster for events at the user's location within a 200km radius
  var apiUrl =
    "https://app.ticketmaster.com/discovery/v2/events?apikey=9MbzzCg3cSnWRYXGAvroFdbBihxg6rgn&radius=200&unit=km&locale=*&sort=date,asc&geoPoint=" +
    userLat +
    "," +
    userLon;

  //Fetch the data from the api server and display the events if it is valid
  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          //Log the event data for troubleshooting and render event items to the screen
          console.log(data);
          displayEventsList(data);
        });
      } else {
        console.log("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      console.log("Error: cannot connect to server");
    });
}

//Display events derived from event data
function displayEventsList(eventData) {
  //Clear the current search box
  eventListGroupEl.html("");
  //Reset our saved events array for saving
  savedEvents = [];

  //Run through each of the events provided in the event array
  for (var i = 0; i < eventData._embedded.events.length; i++) {
    //Collect all the variable from an individual event that we will be utilizing
    var event = eventData._embedded.events[i];
    displaySingleEvent(event);
  }
}

//Renders a single event
function displaySingleEvent(event) {
  //Collect all the variable from an individual event that we will be utilizing
  var eventData = createEventObject(event);
  saveEvent(eventData);

  //Find a 4 by 3 image to keep a consistent layout
  var imgSource = get4by3Image(event.images);

  //Initialize containers to hold the important event information
  var eventBoxEl = $("<div>")
    .addClass("container border-black bg-gray my-2")
    .attr("id", "event-container");
  var columnBoxEl = $("<div>").addClass("columns").appendTo(eventBoxEl);
  var imageBoxEl = $("<div>").addClass("col-2").appendTo(columnBoxEl);
  var bodyBoxEl = $("<div>").addClass("col-10 p-2").appendTo(columnBoxEl);

  //Create elements that have the event data fed into them
  var imageLinkRef = $("<a>")
    .attr({ href: eventData["url"], target: "_blank" })
    .appendTo(imageBoxEl);
  $("<img>")
    .attr("src", imgSource)
    .addClass("img-responsive")
    .appendTo(imageLinkRef);

  $("<div>")
    .addClass("card-title h5")
    .text(eventData["name"])
    .appendTo(bodyBoxEl);
  $("<label>")
    .addClass("form-checkbox")
    .html(
      "<input class='event-checkbox'type='checkbox'><i class='form-icon'></i> Save event for later"
    )
    .appendTo(bodyBoxEl);
  $("<div>")
    .addClass("card-subtitle text-gray")
    .text(eventData["date"])
    .appendTo(bodyBoxEl);
  $("<p>")
    .text("Start Time: " + eventData["time"])
    .appendTo(bodyBoxEl);

  //Append the final event grouping into our list group with the other events
  eventBoxEl.appendTo(eventListGroupEl);
}

//return an object with event data for DOM manipulation and saving
function createEventObject(event) {
  var eventData = {
    name: event.name,
    date: event.dates.start.localDate,
    time: event.dates.start.localTime,
    url: event.url,
    id: event.id,
  };

  return eventData;
}

function createRecipeObject() {
  var recipeData = {
    name: recipe.strMeal,
    category: recipe.strCategory,
    url: strSource
  };

  return recipeData;
}

function createMovieObject() {
  var movieData = {
    //enter movies values here
  };

  return movieData;
}

//Provide an event to save into the user's saved list
function saveEvent(eventData) 
{
  savedEvents.push(eventData);
}

function saveRecipe(recipeData) 
{
  savedRecipes.push(recipeData);
}

function saveRecipe(movieData) 
{
  savedMovies.push(movieData);
}

//Return a 4 by 3 image from an image array
function get4by3Image(imageArray) 
{
  //runs through and array of images
  for (var i = 0; i < imageArray.length; i++) {
    //return the first image url we find that has a 4 by 3 ratio
    if (imageArray[i].ratio === "4_3") {
      return imageArray[i].url;
    }
  }

  //If none are found return a placeholder
  return "http://placehold.it/150";
}

//Called when an event checkbox is changed (clicked to on or off)
function toggleEventSave(event) 
{
  console.log("event clicked");
  //Initialize the index of the event that was clicked
  var eventIndex = $(this).closest("#event-container").index();

  //If the box is checked, then save the event otherwise remove event from saved list
  if (event.target.checked) {
    //push our event data at the event index to the saved list to save
    savedList.events.push(savedEvents[eventIndex]);
    console.log(savedList);
  } else {
    //scan through the saved event list and remove the event with a matching ID to the event that was checked
    for (var i = 0; i < savedList.events.length; i++) {
      if (savedEvents[eventIndex].id === savedList.events[i].id) {
        savedList.events.splice(i, 1);
      }
    }
    console.log(savedList);
  }

  //Save the storage list every time an event is added or removed
  saveListToStorage();
}

function toggleRecipeSave(event)
{
  console.log("recipe clicked");
  //Initialize the index of the event that was clicked
  var recipeIndex = $(this).closest("#recipe-container").index();

  //If the box is checked, then save the event otherwise remove event from saved list
  if (event.target.checked) {
    //push our event data at the event index to the saved list to save
    savedList.recipes.push(savedRecipes[recipeIndex]);
    console.log(savedList);
  } 
  else {
    //scan through the saved event list and remove the event with a matching ID to the event that was checked
    // for (var i = 0; i < savedList.events.length; i++) {
    //   if (savedEvents[eventIndex].id === savedList.events[i].id) {
    //     savedList.events.splice(i, 1);
    //   }
    // }
    // console.log(savedList);
  }

  //Save the storage list every time an event is added or removed
  saveListToStorage();
}

function toggleMovieSave(event)
{
  console.log("movie clicked");
  //Initialize the index of the event that was clicked
  var movieIndex = $(this).closest("#movie-container").index();

  //If the box is checked, then save the event otherwise remove event from saved list
  if (event.target.checked) {
    //push our event data at the event index to the saved list to save
    savedList.movies.push(savedMovies[movieIndex]);
    console.log(savedList);
  } 
  else {
    //scan through the saved event list and remove the event with a matching ID to the event that was checked
    // for (var i = 0; i < savedList.events.length; i++) {
    //   if (savedEvents[eventIndex].id === savedList.events[i].id) {
    //     savedList.events.splice(i, 1);
    //   }
    // }
    // console.log(savedList);
  }

  //Save the storage list every time an event is added or removed
  saveListToStorage();
}

//Presents an error modal to the user with a specified message
function openModal(message, modalTitle) {
  $("#modal-message-title").text(modalTitle);

  //create a p element with a message and add it to the modal content
  $("<p>").text(message).appendTo("#modal-message .content");

  //show the modal
  $("#modal-message").addClass("active");
}

function closeModal(event) {
  //hide the modal
  $("#modal-message").removeClass("active");
  $("#modal-list").removeClass("active");
}

//Opens the saved list with the users stored items
function openSavedList(event) {
  savedListEl.html("");

  if (savedList.events.length > 0) {
    for (var i = 0; i < savedList.events.length; i++) {
      var eventRef = savedList.events[i];
      displaySavedItem(eventRef);
    }
  }
  
  if (savedList.recipes.length > 0){
    for (var i = 0; i < savedList.recipes.length; i++) {
      var recipeRef = savedList.recipes[i];
      //displaySavedItem(recipeRef);
    }
  } 

  if (savedList.movies.length > 0){
    for (var i = 0; i < savedList.movies.length; i++) {
      var movieRef = savedList.movies[i];
      //displaySavedItem(movieRef);
    }
  } 
  
  if (!savedList.events && !savedList.recipes && !savedList.movies) {
    savedListEl.html("No Saved Events");
  }

  //Open the saved list modal
  $("#modal-list").addClass("active");
}

//Dynamically create the html for a saved event to appear in the saved list container
function displaySavedItem(eventRef) 
{
  var eventBoxEl = $("<div>").addClass("border-black bg-secondary p-2 saved-item-box");
  var columnBoxEl = $("<div>").addClass("columns").appendTo(eventBoxEl);
  var bodyBoxEl = $("<div>").addClass("col-auto").appendTo(columnBoxEl);
  var buttonBoxEl = $("<div>")
    .addClass("col-auto col-ml-auto")
    .appendTo(columnBoxEl);

  $("<p>")
    .addClass("m-0 p-2")
    .text(eventRef.name + " on " + eventRef.date + " @ " + eventRef.time)
    .appendTo(bodyBoxEl);

  var webpageLinkEl = $("<a>")
    .attr({ href: eventRef.url, target: "_blank" })
    .appendTo(buttonBoxEl);
  $("<button>")
    .addClass("btn btn-primary mx-2")
    .text("Webpage")
    .appendTo(webpageLinkEl);
  $("<button>")
    .addClass("btn mx-2 remove-btn")
    .text("Remove")
    .appendTo(buttonBoxEl);

  eventBoxEl.appendTo(savedListEl);
}

function displaySavedRecipe(recipeRef) 
{
  var eventBoxEl = $("<div>").addClass("border-black bg-secondary p-2 saved-item-box");
  var columnBoxEl = $("<div>").addClass("columns").appendTo(eventBoxEl);
  var bodyBoxEl = $("<div>").addClass("col-auto").appendTo(columnBoxEl);
  var buttonBoxEl = $("<div>")
    .addClass("col-auto col-ml-auto")
    .appendTo(columnBoxEl);

  // $("<p>")
  //   .addClass("m-0 p-2")
  //   .text(eventRef.name + " on " + eventRef.date + " @ " + eventRef.time)
  //   .appendTo(bodyBoxEl);

  // var webpageLinkEl = $("<a>")
  //   .attr({ href: eventRef.url, target: "_blank" })
  //   .appendTo(buttonBoxEl);
  // $("<button>")
  //   .addClass("btn btn-primary mx-2")
  //   .text("Webpage")
  //   .appendTo(webpageLinkEl);
  // $("<button>")
  //   .addClass("btn mx-2 remove-btn")
  //   .text("Remove")
  //   .appendTo(buttonBoxEl);

  eventBoxEl.appendTo(savedListEl);
}

function displaySavedMovie(movieRef) 
{
  var eventBoxEl = $("<div>").addClass("border-black bg-secondary p-2 saved-item-box");
  var columnBoxEl = $("<div>").addClass("columns").appendTo(eventBoxEl);
  var bodyBoxEl = $("<div>").addClass("col-auto").appendTo(columnBoxEl);
  var buttonBoxEl = $("<div>")
    .addClass("col-auto col-ml-auto")
    .appendTo(columnBoxEl);

  // $("<p>")
  //   .addClass("m-0 p-2")
  //   .text(eventRef.name + " on " + eventRef.date + " @ " + eventRef.time)
  //   .appendTo(bodyBoxEl);

  // var webpageLinkEl = $("<a>")
  //   .attr({ href: eventRef.url, target: "_blank" })
  //   .appendTo(buttonBoxEl);
  // $("<button>")
  //   .addClass("btn btn-primary mx-2")
  //   .text("Webpage")
  //   .appendTo(webpageLinkEl);
  // $("<button>")
  //   .addClass("btn mx-2 remove-btn")
  //   .text("Remove")
  //   .appendTo(buttonBoxEl);

  eventBoxEl.appendTo(savedListEl);
}

function removeSavedItem(event) {
  //Get the index of the event that was clicked to remove
  var itemIndex = $(this).closest(".saved-item-box").index();

  //Remove the item from saved list
  savedList.events.splice(itemIndex, 1);

  if (savedList.events.length === 0) {
    savedListEl.html("No saved events");
  } else {
    savedListEl.html("");

    for (var i = 0; i < savedList.events.length; i++) {
      var eventRef = savedList.events[i];
      displaySavedItem(eventRef);
    }
  }

  //Save the list to storage after it has been removed
  saveListToStorage();
}

//Save the global list to local storage
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





/***** Event Listeners *****/

//Show the saved list modal when clicking the show list button
$("#show-saved-list").on("click", openSavedList);

//Click event for the 'events' button
$("#events").on("click", fetchEventData);

//Change save status when clicking the checkboxes
$(eventListGroupEl).on("change", ".event-checkbox", toggleEventSave);
$(eventListGroupEl).on("change", ".recipe-checkbox", toggleRecipeSave);
$(eventListGroupEl).on("change", ".movie-checkbox", toggleMovieSave);

//Closes the modal when the x or close button are clicked
$(".modal-close, #close-modal-btn").on("click", closeModal);

$(savedListEl).on("click", ".remove-btn", removeSavedItem);





/***** Program Start *****/

//Call get location at the start of the program so that we can use the user's geographic location
//getLocation();

loadListFromStorage();
