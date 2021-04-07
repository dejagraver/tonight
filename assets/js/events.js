//Consumer Key: 9MbzzCg3cSnWRYXGAvroFdbBihxg6rgn
//Consumer Sectret: xISar1JtBhcLCcBk

//Initialize a variable for the main event search list
var eventListGroupEl = $("#event-list-group");

//Initialize and provide a default value for the user's latitude and logitude in case we cannot take their location
var userLat = 43.6532260;
var userLon = -79.3831843;

//Request the user's geographic location
function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(geolocationSuccess);
    }
}

//Called if we were given access to the user location
function geolocationSuccess(position){

    //store the user location data in global variable for use in the API call
    userLat = position.coords.latitude;
    userLon = position.coords.longitude;

    console.log(userLat, userLon);
}

//Fetch Ticketmaster data using the API
function fetchEventData(){
    
    //searches ticketmaster for events at the user's location within a 200km radius
    var apiUrl = "https://app.ticketmaster.com/discovery/v2/events?apikey=9MbzzCg3cSnWRYXGAvroFdbBihxg6rgn&radius=200&unit=km&locale=*&sort=date,asc&geoPoint="+userLat+","+userLon;

    //Fetch the data from the api server and display the events if it is valid
    fetch(apiUrl).then(function(response){
        if(response.ok){
            response.json().then(function(data){
                //Log the event data for troubleshooting and render event items to the screen
                console.log(data);
                displayEvents(data);
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
function displayEvents(eventData){
    
    //Run through each of the events provided in the event array
    for(var i = 0; i < eventData._embedded.events.length; i++){

        //Collect all the variable from an individual event that we will be utilizing
        var event = eventData._embedded.events[i];
        var name = event.name;
        var date = event.dates.start.localDate;
        var time = event.dates.start.localTime;
        var url = event.url;

        //Find a 4 by 3 image to keep a consistent layout
        var imgSource = get4by3Image(event.images);
        
        //Initialize containers to hold the important event information
        var eventBoxEl = $("<div>").addClass("container border-black bg-gray")
        var columnBoxEl = $("<div>").addClass("columns").appendTo(eventBoxEl);
        var imageBoxEl = $("<div>").addClass("col-2").appendTo(columnBoxEl);
        var bodyBoxEl = $("<div>").addClass("col-10").appendTo(columnBoxEl);
    
        //Create elements that have the event data fed into them
        $("<img>").attr("src",imgSource).addClass("img-responsive").appendTo(imageBoxEl);
    
        $("<div>").addClass("card-title h5").text(name).appendTo(bodyBoxEl);
        $("<div>").addClass("card-subtitle text-gray").text(date).appendTo(bodyBoxEl);
        $("<p>").text(time).appendTo(bodyBoxEl);
        $("<a>").text("Web URL").attr({href: url, target: "_blank"}).appendTo(bodyBoxEl); 

        $("<label>").addClass("form-checkbox").html("<input type='checkbox'><i class='form-icon'></i> Add Event").appendTo(bodyBoxEl);
        
        //Append the final event grouping into our list group with the other events
        eventBoxEl.appendTo(eventListGroupEl);
    }
}

//Return a 4 by 3 image from an image array
function get4by3Image(imageArray){

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

//Call get location at the start of the program so that we can use the user's geographic location
getLocation();