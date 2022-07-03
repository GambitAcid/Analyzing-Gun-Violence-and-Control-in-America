// Multi-layer gun violence map  v1 06.27.2022

// ------------------------------------------
// Get selections from HTML **
//--------------------------------------------

// var sType = document.getElementById("searchType").value;
// var sValue = document.getElementById("searchValue").value;

// // ------------------------------------------
// // geojson url 
// //--------------------------------------------

var url = "/api/v1.0/incidents"
var url ='/api/v1.0/massShootings'
var url ='/api/v1.0/regulations'
var url ='/api/v1.0/incidentsByYears'
var url ='/api/v1.0/incidentsByDate'

//--------------------------------------------
// Get layers for selectable backgrounds.
//--------------------------------------------

var graymap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  accessToken: API_KEY
});

var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/satellite-v9",
  accessToken: API_KEY
});

var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/outdoors-v11",
  accessToken: API_KEY
});

var dark = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/dark-v10",
  accessToken: API_KEY
});

//--------------------------------------------
// Create Map Obect
//--------------------------------------------
var map = L.map("map", {
  center: [
    40.7, -94.5
  ],
  zoom: 5,
  layers: [graymap, satellitemap, outdoors, dark]
});

//--------------------------------------------
// Layers for incidents and Regulations
//--------------------------------------------
var incidents = new L.LayerGroup();
var regulations = new L.LayerGroup();
var massshootings = new L.LayerGroup();
var overlays = {
    Incidents: incidents,
    Regulations: regulations,
    'Mass Shootings': massshootings
};

//--------------------------------------------
// Background map and layer control
//--------------------------------------------
var baseMaps = {
  Satellite: satellitemap,
  Outdoors: outdoors,
  Grayscale: graymap,
  Dark: dark};

L.control
 .layers(baseMaps, overlays)
 .addTo(map);

//--------------------------------------------
// Set Map Features 
//--------------------------------------------
function createMap(response) {
 
  //--------------------------------------------
  // Create a GeoJSON layer containing the features 
  //--------------------------------------------
  L.geoJSON(response, {

    // use pointToLayer to create circle markers for each data's coordinates
    pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, {
            radius: markerSize(feature.properties.killed),
            fillColor: DColor(feature.properties.killed),
            color: "#000",
            weight: 0.5,
            opacity: 0.3,
            fillOpacity: .7
        });
    },
    onEachFeature: onEachFeature
  }).addTo(incidents)

  //--------------------------------------------
  // Binding a pop-up to each layer
  //--------------------------------------------
  function onEachFeature(feature, layer) {

      layer.bindPopup(`<strong>Incident ID: </strong> ${feature.properties.incidentID}<br><strong>Date: </strong> ${feature.properties.date}<br><strong>Location: </strong> ${feature.properties.city} , ${feature.properties.state}<br><br><strong>Number of people killed: </strong>${feature.properties.killed}`);
  };
  //add incidents to map
  incidents.addTo(map);

  //--------------------------------------------
  // Set up the legend
  //--------------------------------------------
    var legend = L.control({
      position: "bottomright"
  });

  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var k = [0, 1, 2, 3, 4, 10, 25, 50, 100];
    var labels = [];
    
    // Label and color the legend
       for (var i = 0; i < k.length; i++) {

           labels.push('<li style="background-color:' + DColor(k[i] + 1) + '"><span>' + k[i] + (k[i + 1] ? '&ndash;' + k[i + 1] + '' : '+') + '</span></li>');
        }
        // Add Legend HTML
        div.innerHTML = "<h6>Incidents (2017)</h6><h6>Number Killed</h6>";
        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    
    return div;
  };
  // Add legend to map.
  legend.addTo(map);

  //--------------------------------------------
  // Define color function 
  // Set color based on fatalities
  //--------------------------------------------
  function DColor(killed) {
    switch (true) {
    case killed > 100:
      return "#a7fb09";
    case killed > 50:
      return "#dcf900";
    case killed > 25:
      return "#f6de1a";
    case killed > 10:
      return "#fbb92e";
    case killed > 4:
      return "#faa35f";
    case killed > 3:
      return "#ff6666";
    case killed > 2:
      return "#ffb3b3";
    case killed > 1:
      return "#ffffff";
    default:
      return "#ffe6e6";
    }
  };

  //--------------------------------------------
  // Define a markerSize
  // Set size based on fatalities
  //--------------------------------------------
  function markerSize(killed) {
    if (killed === 0) {
        return .5;
      }
    return killed * 5;
  }
  };
//----------------------------------------
// Set State Regulations Map Features
//----------------------------------------

function createState(regulationsdata) {
  // // Style and populate State Regulations Layer
  L.geoJson(regulationsdata, {

    onEachFeature: function(feature, layer){
     layer.bindPopup(`<strong>State: </strong> ${feature.properties.stateName}<br><strong>Total Number of Gun Control Laws: </strong> ${feature.properties.lawTotal}`);
   }
 }).addTo(regulations);

   regulations.addTo(map);
}
//--------------------------------------------
// Set Mass Shooting Map Features 
//--------------------------------------------
function createMMap(mresponse) {
 
  //--------------------------------------------
  // Create a GeoJSON for Mass Shootings
  //--------------------------------------------
  L.geoJSON(mresponse, {

    // use pointToLayer to create circle markers for each data's coordinates
    pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, {
            radius: markerSize(feature.properties.fatalities),
            fillColor: DColor(feature.properties.fatalities),
            color: "#000",
            weight: 0.5,
            opacity: 0.3,
            fillOpacity: .7
        });
    },
    onEachFeature: onEachFeature
}).addTo(massshootings)

  //--------------------------------------------
  // Binding a pop-up to each layer
  //--------------------------------------------
  function onEachFeature(feature, layer) {

    // date formatter for popup
    var format = d3.timeFormat("%d-%b-%Y");
  
    layer.bindPopup(`<strong>Event : </strong> ${feature.properties.case}<br><strong>Date: </strong> ${format(new Date(feature.properties.date))}<br><strong>Location: </strong> ${feature.properties.location}<br><br><strong>Number of people killed: </strong>${feature.properties.fatalities}`);
  };
  //add mass shootings to map
  massshootings.addTo(map);

  //--------------------------------------------
  // Set up the legend Mass Shootings
  //--------------------------------------------
  var legend = L.control({
    position: "bottomright"
  });

  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var k = [0, 4, 10, 25, 50, 100];
    var labels = [];
    
    // Label and color the legend
       for (var i = 0; i < k.length; i++) {

           labels.push('<li style="background-color:' + DColor(k[i] + 1) + '"><span>' + k[i] + (k[i + 1] ? '&ndash;' + k[i + 1] + '' : '+') + '</span></li>');
        }
        // Add Legend HTML
        div.innerHTML = "<h6>Mass Shootings</h6><h6>Number Killed</h6>";
        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    
    return div;
  };
  // Add legend to map.
  legend.addTo(map);

  //--------------------------------------------
  // Define a color function 
  // Set color based on  fatalities
  //--------------------------------------------
  function DColor(killed) {
    switch (true) {
    case killed > 100:
      return "#f7ffe6";
    case killed > 50:
      return "#ddff99";
    case killed > 25:
      return "#c4ff4d";
    case killed > 10:
      return " #99e600";
    case killed > 4:
      return "#008000";
    default:
      return "#008000";
    }
  };

  //--------------------------------------------
  // Define a marker size function
  // Set size based on fatalities
  //--------------------------------------------
  function markerSize(killed) {
    if (killed === 0) {
        return .5;
      }
    return killed * 2;
  }
};
//----------------------------------------
// Determine Search type **
//----------------------------------------
function GetSelection(type){
  switch (true) {
  case "All":
    var url = "http://127.0.0.1:8000//api/v1.0/incidents"
    return url
    break;
  case date:
    var url = "http://127.0.0.1:8000//api/v1.0/incidentsByDate(sValue)"
    return url
    break;
  case year:
    var url = "http://127.0.0.1:8000//api/v1.0/incidentsByYear(sValue)"
     return url
    break;
  case state:
    var url = "http://127.0.0.1:8000//api/v1.0/incidentsByState(sValue)"
    return url
    break;
  default:
    var url = "http://127.0.0.1:8000//api/v1.0/incidents"
    return url
}
};

//----------------------------------------
// Get Data and Build Maps 
//----------------------------------------
// Get Incidents geoJSON data.
d3.json('/api/v1.0/incidents').then(function(response) {
    // Call createMap with response.features
    createMap(response.features);
});

// Get Regulations geoJSON data.
d3.json('/api/v1.0/regulations').then(function(regulationsdata) {
   createState(regulationsdata);
})

// Get Mass Shooting geoJSON data.
d3.json('/api/v1.0/massShootings').then(function(mresponse) {
  createMMap(mresponse);
})