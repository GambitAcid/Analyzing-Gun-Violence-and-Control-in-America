console.log("using new Logic")

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
// Extra Outdoor Map
var outdoormap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/outdoors-v11",
    accessToken: API_KEY
});

// Satellite Map with api_key reference 
var satellite = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: 'mapbox.satellite',
    accessToken: API_KEY
});

var myMap = L.map("nics_map", {
    center: [39, -98],
    zoom: 3,
    layers: [satellite]
    });

// Base Map to hold all other maps
var baseMaps = {
    "Street Map": streetmap,
    "Terrain Map": terrainmap,
    "Outdoors Map": outdoormap,
    "Sattelite": satellite
};

//Creating Layer Groups
var TotalsLayer = new L.layerGroup();
var PermitLayer = new L.layerGroup();
var HandgunLayer = new L.layerGroup();
var LonggunLayer = new L.layerGroup();
console.log("This is hooked up")

// Overlay Object for state.html map
var overlayMaps = {
    "FBI Checks Totals": TotalsLayer,
    // "FBI Concealed Carry Permit": PermitLayer,
    // "Handguns Per State": HandgunLayer,
    // "Long Guns Per State": LonggunLayer
};

// Adding layer control 
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);

////////// NICs Concealed Carry Totals Data /////////////
d3.json("/api/v1.0/NICsStates").then(function(stateData) {

    console.log(stateData);
    
        //  Style and populate State Regulations Layer
        L.geoJson(stateData, {
    
            onEachFeature: function(feature, layer){
            layer.bindPopup(`<strong>State: </strong> ${feature.properties.state}<br><strong>Concealed Carry Permits: </strong> ${feature.properties.permit}<br><strong>Total Number of Handguns: </strong> ${feature.properties.handgun}<br><strong>Total Number of Long Guns: </strong> ${feature.properties.long_gun}`);
            }
        }).addTo(TotalsLayer);
    
        TotalsLayer.addTo(myMap);
})

// ////////// NICs Hand Gun Per State Data /////////////
// d3.json("/api/v1.0/NICsStates").then(function(stateData) {

//     console.log(stateData);
    
//         //  Style and populate State Regulations Layer
//         L.geoJson(stateData, {
    
//             onEachFeature: function(feature, layer){
//             layer.bindPopup(`<strong>State: </strong> ${feature.properties.state}<br><strong>Total Number of Handguns: </strong> ${feature.properties.handgun}`);
//             }
//         }).addTo(HandgunLayer);
    
//         HandgunLayer.addTo(myMap);
// })

// ////////// NICs Long Gun Per State Data/////////////
// d3.json("/api/v1.0/NICsStates").then(function(stateData) {

//     console.log(stateData);
    
//         //  Style and populate State Regulations Layer
//         L.geoJson(stateData, {
    
//             onEachFeature: function(feature, layer){
//             layer.bindPopup(`<strong>State: </strong> ${feature.properties.state}<br><strong>Total Number of Long Guns: </strong> ${feature.properties.long_gun}`);
//             }
//         }).addTo(LonggunLayer);
    
//         LonggunLayer.addTo(myMap);
// })

// // Overlay Object for state.html map
// var overlayMaps = {
//     "FBI Checks Totals": TotalsLayer,
//     "FBI Concealed Carry Permit": PermitLayer,
//     "Handguns Per State": HandgunLayer,
//     "Long Guns Per State": LonggunLayer
// };

