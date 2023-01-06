

// set map options

var mylatlng = { lat: 20.5937, lng: 78.9629 }
var mapOptions = {
    center: mylatlng,
    zoom: 5,
    mapTypeId: google.maps.MapTypeId.ROADMAP
};

//create map
var waypoints = [];
var map = new google.maps.Map(document.getElementById("googleMap"), mapOptions);

//create a direction service object to use the route method and get the result for our request
var directionsService = new google.maps.DirectionsService();

// create a directionsRenderer object which we will use to display the route.
var directionsDisplay = new google.maps.DirectionsRenderer();

//bind the directionsrenderer to map
directionsDisplay.setMap(map);

//Action to be done after hitting AddStop Button
document.getElementById("haltButton").onclick = function (e) {
    e.preventDefault();
    document.getElementById("myTextBox").style.display = "block";
    document.getElementById("haltButton").style.display = "none";
    document.getElementById("removeStop").style.display = "block";
    document.getElementById("removeStop").style.fontSize = "x-small";
    // document.getElementById("stop").value;
    
}

//Action to be done after hitting removeStop Button
document.getElementById("removeStop").onclick = function (e) {
    e.preventDefault();
    document.getElementById("myTextBox").style.display = "none";
    document.getElementById("haltButton").style.display = "block";
    document.getElementById("removeStop").style.display = "none";
    document.getElementById("stop").value="";
}


// Main function 
document.getElementById('myButton').addEventListener('click', function () {

    var stop = document.getElementById("stop").value;
    if (stop) {
        var request = {
            origin: document.getElementById("from").value,
            destination: document.getElementById("to").value,
            waypoints: [{ location: stop }],
            optimizeWaypoints: true,
            travelMode: google.maps.TravelMode.DRIVING, //WALKING, BYCYCLING
            unitSystem: google.maps.UnitSystem.IMPERIAL
        };
    }
    else {
        var request = {
            origin: document.getElementById("from").value,
            destination: document.getElementById("to").value,
            travelMode: google.maps.TravelMode.DRIVING, //WALKING, BYCYCLING
            unitSystem: google.maps.UnitSystem.IMPERIAL
        };
    }

    // pass the request to the route method
    directionsService.route(request, (result, status) => {
        if (status == google.maps.DirectionsStatus.OK) {

            //Display route     
            directionsDisplay.setDirections(result);

            //Let us calculate distance...

                var originAddress = document.getElementById("from").value;
                var destinationAddress = document.getElementById("to").value;
                var geocoder = new google.maps.Geocoder();

                geocoder.geocode({ address: originAddress }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        var origin = results[0].geometry.location;
                        geocoder.geocode({ address: destinationAddress }, function (results, status) {
                            if (status == google.maps.GeocoderStatus.OK) {
                                var destination = results[0].geometry.location;
                                var service = new google.maps.DistanceMatrixService();
                                service.getDistanceMatrix(
                                    {
                                        origins: [origin],
                                        destinations: [destination],
                                        travelMode: google.maps.TravelMode.DRIVING,
                                    },
                                    callback
                                );
                            }
                        });
                    }
                });

            
            function callback(response, status) {
                if (status == google.maps.DistanceMatrixStatus.OK) {
                    var distance = response.rows[0].elements[0].distance.text;
                    inputDistance.innerHTML = `<span>&nbsp&nbsp&nbsp&nbsp</span>` + distance;
                    output.innerHTML = `<div>Distance between <b>${originAddress}</b> and <b>${destinationAddress}</b> is ` + distance;
                }
            }

        } else {

            //delete the route from map
            directionsDisplay.setDirections({ routes: [] });

            //center map in india
            map.setCenter(mylatlng);

            //show error message 
            inputDistance.innerHTML = `<span>&nbsp&nbsp&nbsp&nbsp</span>`;
            output.innerHTML = "<div class='alter-danger'><i class='fa-solid fa-triangle-exclamation'></i> Could not retrive driving distance.</div>";
        }
    });

});


//Create auto complete objects for all input
var options = {
    types: ['(cities)']
}

var input1 = document.getElementById("from");
var autocomplete1 = new google.maps.places.Autocomplete(input1, options);

var input2 = document.getElementById("to");
var autocomplete2 = new google.maps.places.Autocomplete(input2, options);

var input3 = document.getElementById("stop");
var autocomplete3 = new google.maps.places.Autocomplete(input3, options);


