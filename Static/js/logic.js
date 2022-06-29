
createMap(violenceGun);
function createMap(violenceGun) {

    // Street Map with api_key reference 
var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.mapbox-streets-v8",
    accessToken: API_KEY
});
   // Terrain Map with api_key reference 
var terrainmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.mapbox-terrain-v2",
    accessToken: API_KEY
});
   // Satellite Map with api_key reference 
var satellite = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: 'mapbox.satellite',
    accessToken: API_KEY
});

    // Base Map to hold all other maps
var baseMaps = {
    "Street Map": streetmap,
    "Terrain Map": terrainmap,
    "Sattelite": satellite
};

    // Layering overlayMaps
var overlayMaps = {
    GunIncidents: violenceGun
};

   // Create our map, giving it the sattelite and earthquakes layers to display on load
var myMap = L.map("map", {
    center: [
    37.09, -95.71
    ],
    zoom: 5,
    layers: [satellite, violenceGun]
});

  // Adding layer control to Maps then 2pass in baseMaps and overlayMaps
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);


}

