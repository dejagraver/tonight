//Consumer Key: 9MbzzCg3cSnWRYXGAvroFdbBihxg6rgn
//Consumer Secret: xISar1JtBhcLCcBk

//Initialize a global storage array for saving to local storage
var savedList = {
    movies: [],
    events: [],
    recipes: []
}

//Initialize a variable for the main event search list
var eventListGroupEl = $("#event-list-group");

//Initialize an event container for saving/loading
var savedEvents = [];

//Initialize and provide a default value for the user's latitude and logitude in case we cannot take their location
var userLat = 43.6532260;
var userLon = -79.3831843;


//Request the user's geographic location
function getLocation()
{
    //Check if geolocation is available to the browser
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationFailure);
    }
    else{
        openModal("Geolocation is not supported by this browser.", "Error");
    }
}


//Called if we were given access to the user location
function geolocationSuccess(position)
{
    //store the user location data in global variable for use in the API call
    userLat = position.coords.latitude;
    userLon = position.coords.longitude;
}


//Called if the user location request was denied
function geolocationFailure(error)
{
    var errorMEssage; 

    //Return an error message depending on the reason for location failure
    switch(error.code){
        case error.PERMISSION_DENIED:
            errorMEssage = "User denied the request for Geolocation."
            break;
        case error.POSITION_UNAVAILABLE:
            errorMEssage = "Location information is unavailable."
            break;
        case error.TIMEOUT:
            errorMEssage = "The request to get user location timed out."
            break;
        case error.UNKNOWN_ERROR:
            errorMEssage = "An unknown error occurred."
            break;
    }

    openModal(errorMEssage, "Error");
}


//Fetch Ticketmaster data using the API
function fetchEventData()
{    
    //searches ticketmaster for events at the user's location within a 200km radius
    var apiUrl = "https://app.ticketmaster.com/discovery/v2/events?apikey=9MbzzCg3cSnWRYXGAvroFdbBihxg6rgn&radius=200&unit=km&locale=*&sort=date,asc&geoPoint="+userLat+","+userLon;

    //Fetch the data from the api server and display the events if it is valid
    fetch(apiUrl).then(function(response){
        if(response.ok){
            response.json().then(function(data){
                //Log the event data for troubleshooting and render event items to the screen
                displayEventsList(data);
            })
        }
        else{
            console.log("Error: " + response.statusText);
        }
    })
    .catch(function(error){
        console.log("Error: cannot connect to server");
    });
}


//Display events derived from event data
function displayEventsList(eventData)
{
    //Clear the current search box
    eventListGroupEl.html("");

    //Run through each of the events provided in the event array
    for(var i = 0; i < eventData._embedded.events.length; i++){

        //Collect all the variable from an individual event that we will be utilizing
        var event = eventData._embedded.events[i];
        displaySingleEvent(event);
    }
}


//Renders a single event
function displaySingleEvent(event)
{
        //Collect all the variable from an individual event that we will be utilizing
        var eventData = createEventObject(event);
        saveEvent(eventData);

        //Find a 4 by 3 image to keep a consistent layout
        var imgSource = get4by3Image(event.images);
        
        //Initialize containers to hold the important event information
        var eventBoxEl = $("<div>").addClass("container border-black bg-gray").attr("id", "event-container");
        var columnBoxEl = $("<div>").addClass("columns").appendTo(eventBoxEl);
        var imageBoxEl = $("<div>").addClass("col-2").appendTo(columnBoxEl);
        var bodyBoxEl = $("<div>").addClass("col-10").appendTo(columnBoxEl);
    
        //Create elements that have the event data fed into them
        $("<img>").attr("src",imgSource).addClass("img-responsive").appendTo(imageBoxEl);
    
        $("<div>").addClass("card-title h5").text(eventData["name"]).appendTo(bodyBoxEl);
        $("<div>").addClass("card-subtitle text-gray").text(eventData["date"]).appendTo(bodyBoxEl);
        $("<p>").text(eventData["time"]).appendTo(bodyBoxEl);
        $("<a>").text("Web URL").attr({href: eventData["url"], target: "_blank"}).appendTo(bodyBoxEl); 

        $("<label>").addClass("form-checkbox").html("<input type='checkbox'><i class='form-icon'></i> Add Event").appendTo(bodyBoxEl);
        
        //Append the final event grouping into our list group with the other events
        eventBoxEl.appendTo(eventListGroupEl);
}


//return an object with event data for DOM manipulation and saving
function createEventObject(event)
{
    var eventData = {
        name: event.name,
        date: event.dates.start.localDate,
        time: event.dates.start.localTime,
        url: event.url,
        id: event.id
    }

    return eventData;
}


//Return a 4 by 3 image from an image array
function get4by3Image(imageArray)
{
    //runs through and array of images 
    for(var i = 0; i < imageArray.length; i++){
        //return the first image url we find that has a 4 by 3 ratio
        if(imageArray[i].ratio === "4_3"){
            return imageArray[i].url;
        }
    }

    //If none are found return a placeholder
    return "http://placehold.it/150";
}


//Provide an event to save into the user's saved list
function saveEvent(eventData)
{
    savedEvents.push(eventData);
}

//Called when an event checkbox is changed (clicked to on or off)
function toggleEventSave(event)
{
    //Initialize the index of the event that was clicked
    var eventIndex = $(this).closest("#event-container").index();

    //If the box is checked, then save the event otherwise remove event from saved list
    if(event.target.checked){
        //push our event data at the event index to the saved list to save
        savedList.events.push(savedEvents[eventIndex]);
        console.log(savedList);
    }
    else{
        //scan through the saved event list and remove the event with a matching ID to the event that was checked
        for(var i = 0; i < savedList.events.length; i++){
            if(savedEvents[eventIndex].id === savedList.events[i].id){
                savedList.events.splice(i, 1);
            }
        }
        console.log(savedList);
    }
}


//Presents an erro modal to the user with a specified message
function openModal(message, modalTitle)
{
  $(".modal-title").text(modalTitle);
  //create a p element with a message and add it to the modal content
  $("<p>").text(message).appendTo("#modal-id .content");

  //show the modal
  $("#modal-id").addClass("active");
}


//Close the active modal by removing 'active class'
function closeModal(event)
{
  //hide the modal
  $("#modal-id").removeClass("active");
}


/***** Event Listeners *****/

//Click event for the 'events' button
$("#events").on("click", fetchEventData);

//Change save status when clicking the checkboxes
$(eventListGroupEl).on("change", "input", toggleEventSave);

//Closes the modal when clicked
$("#modal-close").on("click", closeModal);


/***** Program Start *****/

//Call get location at the start of the program so that we can use the user's geographic location
getLocation();