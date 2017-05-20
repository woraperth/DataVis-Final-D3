// var width = 300;
// var height = 300;

// var svg = d3.select("body").append("svg")

// var projection = d3.geoMercator()
// //   .scale(width / 2 / Math.PI)
//     .scale(50000)
//     .center([144.901, -37.8052])
//     .translate([100, 100]);

// var path = d3.geoPath()
//     .projection(projection);

// d3.json("data/smallarea.geojson", function(err, geojson) {
//     var features = geojson.features;

//     svg.selectAll("path")
//         .data(features)
//         .enter().append('path')
//         .attr('d', path)
//         .on('mouseover', mapMouseOver)      
// })

// var data = [
//     {"year": 1991, "name":"alpha", "value": 15},
//     {"year": 1991, "name":"beta", "value": 10},
//     {"year": 1991, "name":"gamma", "value": 5},
//     {"year": 1991, "name":"delta", "value": 50},
//     {"year": 1992, "name":"alpha", "value": 20},
//     {"year": 1992, "name":"beta", "value": 10},
//     {"year": 1992, "name":"gamma", "value": 10},
//     {"year": 1992, "name":"delta", "value": 43},
//     {"year": 1993, "name":"alpha", "value": 30},
//     {"year": 1993, "name":"beta", "value": 40},
//     {"year": 1993, "name":"gamma", "value": 20},
//     {"year": 1993, "name":"delta", "value": 17},
//     {"year": 1994, "name":"alpha", "value": 60},
//     {"year": 1994, "name":"beta", "value": 60},
//     {"year": 1994, "name":"gamma", "value": 25},
//     {"year": 1994, "name":"delta", "value": 32}
// ]
// var visualization = d3plus.viz()
//     .container("#viz")
//     .data(data)
//     .type("bar")
//     .id("name")
//     .x("year")
//     .y("value")
//     .draw()

var sample_data = [
  {"value": 100, "name": "alpha", "group": "group 1"},
  {"value": 70, "name": "beta", "group": "group 2"},
  {"value": 40, "name": "gamma", "group": "group 2"},
  {"value": 15, "name": "delta", "group": "group 2"},
  {"value": 5, "name": "epsilon", "group": "group 1"},
  {"value": 1, "name": "zeta", "group": "group 1"}
]
var visualization = d3plus.viz()
  .container("#viz")
  .data(sample_data)
  .type("tree_map")
  .id(["group","name"])
  .size("value")
  .draw()


// Leaflet Map
var layer, geojson;
function createOpenMap() {
    var openmap = L.map('mapid', {
        zoomControl: false,
        doubleClickZoom: false  
    }).setView([-37.8154, 144.9437], 12);

    // L.tileLayer('http://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
    L.tileLayer('http://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    // L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png', {
    // L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoid29yYXRhbmEiLCJhIjoiY2oxcHhvc2l5MDA0aTJ3bnR1emtudzdpZyJ9.dS_4_26aDa1ZiKtL4yIaWA', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
        maxZoom: 18,
    }).addTo(openmap);

    geojson = L.geoJson(melbarea,
    {
        style: openmapStyle,
        onEachFeature: openmapOnEach
    }
    ).addTo(openmap);
}

function openmapOnEach(feature, layer) {
    layer.bindPopup(feature.properties.featurenam, {closeButton: true, offset: L.point(0, 0)});
    layer.on({
        mouseover: openmapMouseOver,
        mouseout: openmapMouseOut,
        click: openmapClick
    });
}

// Show highlighted color if it is the top 3 places
function getColor(featurename) {
    var open_toparea = ['South Yarra', 'North Melbourne', 'Docklands'];
    if(open_toparea.includes(featurename)) {
        return '#00D1B2';
    } else {
        return '#666';
    }
}

function openmapStyle(feature) {
    return {
        fillColor: getColor(feature.properties.featurenam),
        weight: 2,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    }
}

function openmapMouseOver(e) {
    layer = e.target;

    layer.setStyle({
        fillColor: 'white',
        weight: 0,
        color: 'white',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    // Open Popup
    layer.openPopup();
}

// Mouse Out
function openmapMouseOut(e) {
    geojson.resetStyle(e.target);

    // Close Popup
    layer.closePopup();
}

// Click
function openmapClick(e) {
    layer = e.target;
    console.log(layer.feature.properties.featurenam)
}

// Start map
createOpenMap();

// Test Vue
var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
  }
})