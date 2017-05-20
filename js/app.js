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


// sample data array
var sample_data = [
  {"value": 100, "name": "alpha", "group": "group 1"},
  {"value": 70, "name": "beta", "group": "group 1"},
  {"value": 40, "name": "gamma", "group": "group 1"},
  {"value": 15, "name": "delta", "group": "group 1"},
  {"value": 5, "name": "epsilon", "group": "group 1"},
  {"value": 1, "name": "zeta", "group": "group 1"}
]
// instantiate d3plus
var visualization = d3plus.viz()
  .container("#viz")     // container DIV to hold the visualization
  .data(sample_data)     // data to use with the visualization
  .type("bubbles")       // visualization type
  .id(["group", "name"]) // nesting keys
  .depth(1)              // 0-based depth
  .size("value")         // key name to size bubbles
  .color("name")        // color by each group
  .legend(false)
  .mouse({
      'click': function(x) {
          console.log(x.name)
      }
  })
  .draw()                // finally, draw the visualization!





var stackdata = [
  {"year": 1991, "name":"West Melb (Indus)", "value": 15, "value2": 15},
  {"year": 1991, "name":"South Yarra", "value": 80, "value2": 15},
  {"year": 1991, "name":"West Melb (Res)", "value": 5, "value2": 15},
  {"year": 1991, "name":"Southbank", "value": 50, "value2": 15},
  {"year": 1992, "name":"Melb CBD", "value": 20, "value2": 15},
  {"year": 1992, "name":"East Melbourne", "value": 10, "value2": 15},
  {"year": 1992, "name":"North Melbourne", "value": 10, "value2": 15},
  {"year": 1992, "name":"Docklands", "value": 43, "value2": 15},
  {"year": 1993, "name":"Port Melbourne", "value": 30, "value2": 15},
  {"year": 1993, "name":"East Melbourne 2", "value": 40, "value2": 15},
  {"year": 1993, "name":"West Melb (Indus) 2", "value": 20, "value2": 15},
  {"year": 1993, "name":"West Melb (Res) 2", "value": 17, "value2": 15},
  {"year": 1994, "name":"South Yarra 2", "value": 60, "value2": 15},
]

function createStackbar() {
    var wStack = d3.select('#step1stack').node().getBoundingClientRect().width;
    var hStack = 300;

    var svg = d3.select("#step1stack")
                .append('svg')
                .attr("width", wStack)
                .attr("height", hStack);

    var padStack = 2;
    var botStack = 100;
    var leftStack = 80;

    // Add stacked bar chart
    var l_converter = d3.scale.linear()
    .domain([0, 100])
    .range([0, hStack - botStack]);

    var estbar = svg.selectAll("rect")
        .data(stackdata);

    var empbar = svg.selectAll("rect")
    .data(stackdata);

    var barWidth = ((wStack - leftStack) / stackdata.length) - padStack;

    empbar.enter()
        .append("rect")
        .attr("x", function(d, i) { return i * ((wStack - leftStack) / stackdata.length) + leftStack; })
        .attr("y", hStack - botStack)
        .attr("width", barWidth)
        .attr('height', 0)
        .attr('fill', 'gray')
        .transition().duration(1000)
            .attr("y", function(d, i) { return hStack - l_converter(d.value) - botStack })
            .attr("height", function(d, i) { return l_converter(d.value) } )
    
    estbar.enter()
        .append("rect")
        .attr("x", function(d, i) { return i * ((wStack - leftStack) / stackdata.length) + leftStack ; })
        .attr("y", function(d, i) { return hStack - l_converter(d.value) - botStack })
        .attr("width", barWidth)
        .attr('height', 0)
        .attr('fill', 'red')
        .transition().duration(500).delay(1000)
            .attr("y", function(d, i) { return hStack - l_converter(d.value) - l_converter(d.value2) - botStack })
            .attr("height", function(d, i) { return l_converter(d.value2) } )

    // Add axis
    var xScale = d3.scale.ordinal()
        .domain( d3.map(stackdata, function(d){return d.name;}).keys() )
        .rangePoints([0, wStack - leftStack - barWidth]);

    console.log(d3.max(stackdata, function(d) { return d.value + d.value2; }))

    var yScale = d3.scale.linear()
        .domain([0, d3.max(stackdata, function(d) { return d.value + d.value2; }) ])
        .range([hStack, botStack]);

    var xAxis = d3.svg.axis()
        .orient("bottom")
        .scale(xScale);

    var yAxis = d3.svg.axis()
        .orient("left")
        .scale(yScale);

    svg.append("g")
        .attr("class", "xaxeStack")   // give it a class so it can be used to select only xaxis labels  below
        .attr("transform", "translate(" + (leftStack + barWidth/2 ) + "," + (hStack - botStack + 5) + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "yaxeStack")
        .attr("transform", "translate(" + (leftStack - 5) + "," + -botStack + ")")
        .call(yAxis);

    // Style the axis
    svg.selectAll(".xaxeStack text")  // select all the text elements for the xaxis
        .attr("transform", function(d) {
            return "translate(" + this.getBBox().height*-2 + "," + this.getBBox().height + ")rotate(-45)";
        });
    
    // Add Legend
    var legendList = [
        {"name": "Employment", "color": "grey"},
        {"name": "Business",  "color": "red"}
    ]

    svg.append("g")
        .attr("class", "legendOrdinal")
        .attr("transform", "translate(" + (wStack - 200) + ",0)");

    svg.select(".legendOrdinal")
        .call(function(thisele) {
            thisele.selectAll('rect')
                .data(legendList)
                .enter()
                .append('rect')
                .attr('width', 10)
                .attr('height', 10)
                .attr('x', 0)
                .attr('y', function(d, i) { return (i*15) })
                .attr('fill', function(d,i) { return d.color; });

            thisele.selectAll('text')
                .data(legendList)
                .enter()
                .append('text')
                .text(function(d, i) { return d.name; })
                .attr('x', 15)
                .attr('y', function(d, i) { return (i*15) + 8; })
                .attr('font-size', '10px');
        });


// End function createStackbar
}



// var sample_data = [
//   {"value": 100, "name": "alpha", "group": "group 1"},
//   {"value": 70, "name": "beta", "group": "group 2"},
//   {"value": 40, "name": "gamma", "group": "group 2"},
//   {"value": 15, "name": "delta", "group": "group 2"},
//   {"value": 5, "name": "epsilon", "group": "group 1"},
//   {"value": 1, "name": "zeta", "group": "group 1"}
// ]
// var visualization = d3plus.viz()
//   .container("#viz")
//   .data(sample_data)
//   .type("tree_map")
//   .id(["group","name"])
//   .size("value")
//   .draw()







// Leaflet Map
var layer, geojson;
function createChoroMap() {
    var openmap = L.map('choro', {
        doubleClickZoom: false  
    }).setView([-37.8154, 144.9437], 11.5);

    L.tileLayer('http://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
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
    });
}

// Show highlighted color if it is the top 3 places
function getColor(featurename) {
    return '#666';
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
        fillColor: '#00D1B2',
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

    // Highlight Stack Bar Chart
    // - TODO: Change 3 to the right number
    d3.select(".xaxeStack text")
        .attr('fill', 'black');
    d3.select(".xaxeStack g:nth-child(3) text")
        .attr('fill', '#00D1B2');
}

// Mouse Out
function openmapMouseOut(e) {
    geojson.resetStyle(e.target);

    // Close Popup
    layer.closePopup();
}





// Start map
createChoroMap();
createStackbar();