// Create an outdoor map tiles layer
var outdoor = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
"access_token={access_token}", {access_token: API_KEY});

// Create a map object
var myMap = L.map("map", {
center: [39, -98],
zoom: 4,
layers: [outdoor]
});
createMap(myMap);
function createMap(myMap) {

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

//Creating Layer Groups
var TotalsLayer = new L.layerGroup();
var PermitLayer = new L.layerGroup();
var HandgunLayer = new L.layerGroup();
var LonggunLayer = new L.layerGroup();

// Import Data
d3.csv("Data/FBI_NICs_Data.csv", function(stateData) {

    console.log(stateData);

// Parsing and casting as numbers
    stateData.forEach(function(data) {
        data.permit = parseFloat(data.permit);
        data.totals = parseFloat(data.totals);
        data.age = parseFloat(data.handgun);
        data.long_gun = parseFloat(data.long_gun);
        data.multiple = parseFloat(data.multiple);
});

// Looping through the stateData array 
    stateData.forEach(state=> {

        console.log(state);

        ////// NICs FBI State Totals ////// 

    // Conditionals for state circles
    var color = 'red';
    if (state.totals < 150000) { color = 'green'; }
    else if (state.totals < 100000) { color = 'greenyellow'; }
    else if (state.totals < 50000) { color = 'yellow'; }
    else if (state.totals < 25000) { color = 'orange'; }
    else if (state.totals < 10000) { color = 'darkorange'; }
    else if (state.totals < 5000) { color = 'coral'; }

    // Add circles to map
    L.circle([state.lat, state.long], {
    color: color,
    opacity: 0.3,
    fillColor: color,
    fillOpacity: 0.3,
      radius: state.totals * 5000
    }).bindPopup("<h6>" + state.state + "</h6>Totals: " + state.totals + "%")
    .addTo(TotalsLayer);

    // Add layer to the map
    TotalsLayer.addTo(myMap);
});

        ////// NICs Concealed Carry Permit By State //////
        
    // Conditionals for state circles
    var color = 'red';
    if (state.permit < 300000) { color = 'green'; }
    else if (state.permit < 250000) { color = 'greenyellow'; }
    else if (state.permit < 200000) { color = 'yellow'; }
    else if (state.permit < 100000) { color = 'orange'; }
    else if (state.permit < 50000) { color = 'darkorange'; }
    else if (state.permit < 10000) { color = 'coral'; }

    // Add circles to map
    L.circle([state.lat, state.long], {
    color: color,
    opacity: 0.3,
    fillColor: color,
    fillOpacity: 0.7,
      radius: state.permit * 5000
    }).bindPopup("<h6>" + state.state + "</h6>Permits: " + state.permit + "%")
    .addTo(PermitLayer);

    // Add layer to the map
    PermitLayer.addTo(myMap);

            ////// NICs FBI Handgun Totals ////// 

 // Conditionals for state circles
    var color = 'red';
    if (state.handgun < 5) { color = 'green'; }
    else if (state.handgun < 10) { color = 'greenyellow'; }
    else if (state.handgun < 15) { color = 'yellow'; }
    else if (state.handgun < 20) { color = 'orange'; }
    else if (state.handgun < 35) { color = 'darkorange'; }
    else if (state.handgun < 30) { color = 'coral'; }

 // Add circles to map
    L.circle([state.lat, state.long], {
    color: color,
    opacity: 0.3,
    fillColor: color,
    fillOpacity: 0.5,
    radius: state.handgun * 5000
    }).bindPopup("<h6>" + state.state + "</h6>Handguns Per State : " + state.handgun + "%")
    .addTo(HandgunLayer);

 // Add poverty layer to the map
    HandgunLayer.addTo(myMap);

        ////// NICs FBI Long gun Totals ////// 

 // Conditionals for state circles
    var color = 'red';
    if (state.long_gun < 5000) { color = 'green'; }
    else if (state.long_gun < 4000) { color = 'greenyellow'; }
    else if (state.long_gun < 2500) { color = 'yellow'; }
    else if (state.long_gun < 2000) { color = 'orange'; }
    else if (state.long_gun < 1000) { color = 'darkorange'; }
    else if (state.long_gun < 500) { color = 'coral'; }

 // Add circles to map
    L.circle([state.lat, state.long], {
    color: color,
    opacity: 0.3,
    fillColor: color,
    fillOpacity: 0.5,
    radius: state.long_gun * 5000
    }).bindPopup("<h6>" + state.state + "</h6>Handguns Per State : " + state.long_gun + "%")
    .addTo(LonggunLayer);

 // Add poverty layer to the map
    LonggunLayer.addTo(myMap);



   // Create our map, giving it the sattelite and layers to display on load
//var myMap = L.map("map", {
  //  center: [
   // 37.09, -95.71
   // ],
  //  zoom: 5,
  //  layers: [satellite, violenceGun]
});

// Overlay Object for state.html map
var overlayMaps = {
    "FBI Checks Totals": TotalsLayer,
    "FBI Concealed Carry Permit": PermitLayer,
    "Handguns Per State": HandgunLayer,
    "Long Guns Per State": LonggunLayer
};

  // Adding layer control 
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    //var html = [$('<option>', {val: 0, text: 'Select a state'})],
       // dropdown = $('#selector_menu_1');

   // $.each(map_cfg.map_data, function(i, obj) {
     //   html.push($('<option>', {id:'st'+obj.id, val:'st'+obj.id, text: obj.name}))
    //});

    //dropdown.html(html);
}
d3.json('/api/v1.0/NICsStates').then(function(response) {
    // Call createMap with response.features
    createMap(response.features);
});
