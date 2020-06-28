/*============ MARKERS ===========*/
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";


// Function to determine the color of the circles and labels
function getColor(d) {
    return d > 6 ? '#800026' :
           d > 5  ? '#BD0026' :
           d > 4  ? '#E31A1C' :
           d > 3  ? '#FC4E2A' :
           d > 2   ? '#FD8D3C' :
           d > 1   ? '#FEB24C' :
           d > 0   ? '#FED976' :
                      '#FFEDA0';
}

//function to make bigger the circles, given that they are associated to the 
// magnitud and they are small.
function markersize(points){
    return points * 5500
}

var earthquakeMarkers =[];
// loading the data
d3.json(url,function(data){
    //loop through all the features
   for (var i = 0;i<data.features.length;i++){ 
       // retrieving the magnitud of each eartquake   
        var mag = data.features[i].properties.mag;
       // retrieving the coordinates 
        var location = data.features[i].geometry.coordinates;
       //creating the circles 
       earthquakeMarkers.push(
        L.circle([location[1],location[0]],{
            color:"none",
            fillColor:getColor(mag),
            fillOpacity:0.75,
            radius:markersize(mag)
        }).bindPopup(`<h1>Information</h1><hr><h2>Location: ${data.features[i].properties.place}</h2><h2>Magnitud: ${mag}</h2>`)
       );        
     
   }  
   var eartquakeLayer = L.layerGroup(earthquakeMarkers);
   console.log(eartquakeLayer);
   /*============ MAPS ===========*/
// Define variables for our tile layers
var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "satellite-v9",
    accessToken: API_KEY
  });
  
  var grayscale = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
  });
  
  var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "outdoors-v11",
    accessToken: API_KEY
  });
  
  var baseMaps = {
      Satellite: satellite,
      Grayscale: grayscale,
      Outdoors:outdoors
  };
  
  /*==== Tectonicplates ==== */
  
  var boundariesLayer = L.geoJson(boundaries,{
      color:"#FC4E2A"
  });
  
  
  var overlayMaps = {
      Earthquake: eartquakeLayer,
      Boundaries:boundariesLayer
  };
  
  
  // Creating map object
  var myMap = L.map("map", {
      center: [33.451,-116.5811667],
      zoom: 11,
      layers:[satellite,eartquakeLayer]
  });
  
  
  
  
  L.control.layers(baseMaps,overlayMaps,{
      collapsed:false
  }).addTo(myMap);
  
  /*=======Legend for the circles ======= */
  var legend = L.control({position: 'bottomright'});
  
  legend.onAdd = function (map) {
  
      var div = L.DomUtil.create('div', 'info legend'),
          grades = [0,1,2,3,4,5,6],
          labels = [];
  
      // loop through the intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }
  
      return div;
  };
  
  legend.addTo(myMap);
   
});







