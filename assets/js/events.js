//Consumer Key: 9MbzzCg3cSnWRYXGAvroFdbBihxg6rgn
//Consumer Sectret: xISar1JtBhcLCcBk
//Toronto: 527

function fetchEventData(){
    var apiUrl = "https://app.ticketmaster.com/discovery/v2/events.json?dmaId=527&apikey=9MbzzCg3cSnWRYXGAvroFdbBihxg6rgn";

    fetch(apiUrl)
    .then(function(response){
        if(response.ok){
            console.log(response);
            response.json().then(function(data){
                 console.log(data);
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

fetchEventData();