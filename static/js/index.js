// Create the tile layer that will be the background of our map
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
});


var map = L.map("map-id"), {
    center: [
        40.7, -94.5
    ],
    zoom: 3
});

// Add our 'lightmap' tile layer to the map
lightmap.addTo(map);

// Perform an API call to get significant earthquake data from the last 7 days
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson", function(data) {
    function styleInfo(feature) {
        return{
            opacity: 1,
            fillOpacity: 1,
            fillColor: getColor(feature.geometry.coordinates[2]),
            color: "#000000",
            radius: getRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    }

    // Pick a color based on the depth of the earthquake
    function getColor(depth) {
        switch (true) {
        case depth > 90:
        return "#ea2c2c";
        case depth > 70:
        return "#ea822c";
        case depth > 50:
        return "#ee9c00";
        case depth > 30:
        return "#eecc00";
        case depth > 10:
        return "#d4ee00";
        default:
        return "#98ee00";
        }
    }

    // This function determines the radius of the earthquake marker based on its magnitude.
    // Earthquakes with a magnitude of 0 were being plotted with the wrong radius.
    function getRadius(magnitude) {
        if (magnitude === 0) {
        return 1;
        }

        return magnitude * 4;
    }

    // Here we add a GeoJSON layer to the map once the file is loaded.
    L.geoJson(data, {
        // We turn each feature into a circleMarker on the map.
        pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng);
        },
        // We set the style for each circleMarker using our styleInfo function.
        style: styleInfo,
        // We create a popup for each marker to display the magnitude and location of the earthquake after the marker has been created and styled
        onEachFeature: function(feature, layer) {
        layer.bindPopup(
            "Magnitude: "
            + feature.properties.mag
            + "<br>Depth: "
            + feature.geometry.coordinates[2]
            + "<br>Location: "
            + feature.properties.place
        );
        }
    }).addTo(map);

// Create a legend to display information about our map
var info = L.control({
    position: "bottomright"
});

// When the layer control is added, insert a div with the class of "legend"
info.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    //add color and grade numbers here
    var colors = [
        "#98ee00",
        "#d4ee00",
        "#eecc00",
        "#ee9c00",
        "#ea822c",
        "#ea2c2c"
        ];

        // Looping through our intervals to generate a label with a colored square for each interval.
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
            + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
        }
        return div;  
    };
    // Add the info legend to the map
    info.addTo(map);
});

