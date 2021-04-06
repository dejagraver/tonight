//Consumer Key: 9MbzzCg3cSnWRYXGAvroFdbBihxg6rgn
//Consumer Sectret: xISar1JtBhcLCcBk
//Toronto: 527

var eventListGroupEl = $("#event-list-group");

//Fetch Ticketmaster data using the API
function fetchEventData(){
    var apiUrl = "https://app.ticketmaster.com/discovery/v2/events.json?dmaId=527&apikey=9MbzzCg3cSnWRYXGAvroFdbBihxg6rgn";

    fetch(apiUrl)
    .then(function(response){
        if(response.ok){
            response.json().then(function(data){
                //console.log(data);
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
    
    for(var i = 0; i < eventData._embedded.events.length; i++){
        var event = eventData._embedded.events[i];
        var name = event.name;
        var date = event.dates.start.localDate;
        var time = event.dates.start.localTime;
        var url = event.url;
        var description = event.description;
        var imgSource = get4by3Image(event.images);
    
        console.log(event);
        console.log(name, date, time, url);
    
        var eventBoxEl = $("<div>").addClass("container border-black bg-gray")
        var columnBoxEl = $("<div>").addClass("columns").appendTo(eventBoxEl);
        var imageBoxEl = $("<div>").addClass("col-2").appendTo(columnBoxEl);
        var bodyBoxEl = $("<div>").addClass("col-10").appendTo(columnBoxEl);
    
        $("<img>").attr("src",imgSource).addClass("img-responsive").appendTo(imageBoxEl);
    
        $("<div>").addClass("card-title h5").text(name).appendTo(bodyBoxEl);
        $("<div>").addClass("card-subtitle text-gray").text(date).appendTo(bodyBoxEl);
        $("<p>").text(time).appendTo(bodyBoxEl);
        $("<a>").text("Web URL").attr({href: url, target: "_blank"}).appendTo(bodyBoxEl); 

        $("<label>").addClass("form-checkbox").html("<input type='checkbox'><i class='form-icon'></i> Add Event").appendTo(bodyBoxEl);
        
    
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


