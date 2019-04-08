
map_url = "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}"
map_attribution = "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>"
// Adding satellite tile layer to the map
satellite = L.tileLayer(map_url, {
  attribution: map_attribution, 
  maxZoom: 18,
  id: "mapbox.satellite",
  accessToken: API_KEY
})

// Adding  tile layer to the map
light = L.tileLayer(map_url, {
  attribution: map_attribution, 
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
})

// Adding  tile layer to the map
streets = L.tileLayer(map_url, {
  attribution: map_attribution, 
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
})

// Creating map object
var myMap = L.map("map", {
  center: [48.8, 2.4],
  zoom: 2,
  layers: [satellite, light, streets]
});

var baseMaps = { "Satellite" : satellite, "Light" : light, "StreetMap": streets };


// Store API query variables
var baseURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";


// Assemble API query URL
var url = baseURL;
console.log(url);

// Grab the data with d3
d3.json(url, function(response) {
  features = response.features;
  console.log(response.features);

  // Create the markers, which will be cirles with tooltip popups on click

  // Create an empty array to hold the markers
  var markers = [];

  // Loop through data to construct the markers and add them to array
  for (var i = 0; i < features.length; i++) {

    // Set the data location property to a variable
    var location = features[i].geometry;
    console.log(location);

    // Check for location property
    if (location) {

      // Add a new marker to the cluster group and bind a pop-up
      info = features[i].properties.place + " Magnitude " + String(features[i].properties.mag);
      console.log("Adding marker at ", location, " info ", info);
      circle = L.circleMarker([location.coordinates[1], location.coordinates[0]], {
        radius : Math.pow(features[i].properties.mag, 2) / 2,
        color : "black", 
        fillColor : "blue",
        fillOpacity : Math.pow(features[i].properties.mag, 2) / 100
      })
        .bindPopup(info);
    }
    markers.push(circle);
  }

  // Add our marker cluster layer to the map
  earthquakes = L.layerGroup(markers);
  // var overlayMaps = {"Earthquakes" : earthquakes};
  var overlayMaps = {}
  overlayMaps.Earthquakes = earthquakes;

  console.log(overlayMaps);
  L.control.layers(baseMaps, overlayMaps).addTo(myMap);

  // Set the earthquakes active by default
  earthquakes.addTo(myMap);

});
