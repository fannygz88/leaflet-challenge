
// Creating map object
var myMap = L.map("map", {
    center: [33.451,-116.5811667],
    zoom: 11
  });
// Adding tile layer to the map
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
}).addTo(myMap);

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

// loading the data
d3.json(url,function(data){
    //loop through all the features
   for (var i = 0;i<data.features.length;i++){ 
       // retrieving the magnitud of each eartquake   
        var mag = data.features[i].properties.mag;
       // retrieving the coordinates 
        var location = data.features[i].geometry.coordinates;
       //creating the circles 
        L.circle([location[1],location[0]],{
            color:"none",
            fillColor:getColor(mag),
            fillOpacity:0.75,
            radius:markersize(mag)

        }).bindPopup(`<h1>Information</h1><hr><h2>Location: ${data.features[i].properties.place}</h2><h2>Magnitud: ${mag}</h2>`)
          .addTo(myMap)
       
   }
    
   
});

// creating the labels to describe the magnitudes

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