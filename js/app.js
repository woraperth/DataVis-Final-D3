// sample data (for step 1)
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
    {"year": "Food and Beverage Services", "name":"South Yarra 2", "value": 60, "value2": 15},
]

// sample data array (for step 2)
var treeData = [
    {"value": 100, "name": "Employment", "group": "Finance and Insurance"},
    {"value": 70, "name": "Employment", "group": "Accommodation"},
    {"value": 40, "name": "Business", "group": "Accommodation"},
    {"value": 15, "name": "Employment", "group": "Information Media and Telecommunications"},
    {"value": 50, "name": "Business", "group": "Information Media and Telecommunications"},
    {"value": 60, "name": "Business", "group": "Food and Beverage Services"}
]

// sample data (for step 3)
var step3data = [
  {"year": "Finance and Insurance", "name":"Employment", "value": 15},
  {"year": "Finance and Insurance", "name":"Graduated", "value": 10},
  {"year": "Education and Training", "name":"Employment", "value": 5},
  {"year": "Education and Training", "name":"Graduated", "value": 50},
  {"year": "Accommodation", "name":"Employment", "value": 20},
  {"year": "Accommodation", "name":"Graduated", "value": 10},
  {"year": "Health Care and Social Assistance", "name":"Employment", "value": 10},
  {"year": "Health Care and Social Assistance", "name":"Graduated", "value": 43},
  {"year": "Information Media and Telecommunications", "name":"Employment", "value": 30},
  {"year": "Information Media and Telecommunications", "name":"Graduated", "value": 40},
  {"year": "Public Administration and Safety", "name":"Employment", "value": 20},
  {"year": "Public Administration and Safety", "name":"Graduated", "value": 17},
  {"year": "Food and Beverage Services", "name":"Employment", "value": 60},
  {"year": "Food and Beverage Services", "name":"Graduated", "value": 60},
  {"year": "Real Estate Services", "name":"Employment", "value": 25},
  {"year": "Real Estate Services", "name":"Graduated", "value": 32}
]

// sample data (for step 4)
var step4data = [
    {"year": 1991, "name":"KFC", "value": 17},
    {"year": 1992, "name":"KFC", "value": 20},
    {"year": 1993, "name":"KFC", "value": 25},
    {"year": 1994, "name":"KFC", "value": 33},
    {"year": 1995, "name":"KFC", "value": 52},
    {"year": 1991, "name":"7-Eleven", "value": 36},
    {"year": 1992, "name":"7-Eleven", "value": 32},
    {"year": 1993, "name":"7-Eleven", "value": 40},
    {"year": 1994, "name":"7-Eleven", "value": 58},
    {"year": 1995, "name":"7-Eleven", "value": 13},
    {"year": 1991, "name":"Wilson Parking", "value": 24},
    {"year": 1992, "name":"Wilson Parking", "value": 27},
    {"year": 1993, "name":"Wilson Parking", "value": 27},
    {"year": 1994, "name":"Wilson Parking", "value": 35},
    {"year": 1995, "name":"Wilson Parking", "value": 40}
  ]





/*
* STEP 1
*/

function createStackbar() {
    var wStack = d3.select('#step1stack').node().getBoundingClientRect().width;
    var hStack = 350;

    var svg = d3.select("#step1stack")
                .append('svg')
                .attr("width", wStack)
                .attr("height", hStack);

    var padStack = 5;
    var botStack = 120;
    var leftStack = 80;

    var empColor = '#D1D1D1';
    var busColor = '#D21F1C';

    // Add stacked bar chart
    var l_converter = d3.scale.linear()
    .domain([0, 100])
    .range([0, hStack - botStack]);

    var estbar = svg.selectAll("rect")
        .data(stackdata);

    var empbar = svg.selectAll("rect")
    .data(stackdata);

    var barWidth = ((wStack - leftStack) / stackdata.length) - padStack;

    // Add axis
    var xScale = d3.scale.ordinal()
        .domain( d3.map(stackdata, function(d){return d.name;}).keys() )
        .rangePoints([0, wStack - leftStack - barWidth]);

    var yScale = d3.scale.linear()
        .domain([0, d3.max(stackdata, function(d) { return d.value + d.value2; }) ])
        .range([hStack, botStack]);

    var xAxis = d3.svg.axis()
        .orient("bottom")
        .scale(xScale);

    var yAxis = d3.svg.axis()
        .orient("left")
        .scale(yScale);

    var xAxisG = d3.svg.axis()
        .orient("bottom")
        .scale(xScale);

    var yAxisG = d3.svg.axis()
        .orient("left")
        .scale(yScale);

    // Draw background grid
    svg.append("rect")
        .attr("class", "gridbg")
        .attr("fill", "#FAFAFA")
        .attr("width", wStack - leftStack)
        .attr("height", hStack - botStack)
        .attr("transform", "translate(" + (leftStack - 5) + "," + (0) + ")")

    // add the X gridlines
    svg.append("g")			
        .attr("class", "grid")
        .attr("transform", "translate(" + (leftStack + barWidth) + "," + (hStack - botStack) + ")")
        .call(xAxisG
            .tickSize(-hStack)
            .tickFormat("")
        )

    // add the Y gridlines
    svg.append("g")			
        .attr("class", "grid")
        .attr("transform", "translate(" + (leftStack) + "," + (-botStack) + ")")
        .call(yAxisG
            .tickSize(-wStack)
            .tickFormat("")
        )

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
            return "translate(" + ((this.getBBox().height*-2)+10) + "," + (this.getBBox().height - 10) + ")rotate(-45)";
        })
        .attr('font-size', 20);

    svg.selectAll('.xaxeStack text, .yaxeStack text')
        .attr('fill', '#666')

    // Tooltip
    var tooltip = d3.select("body").append("div")	
        .attr("class", "tooltip")				
        .style("opacity", 0);

    // Draw Graph
    empbar.enter()
        .append("rect")
        .attr("x", function(d, i) { return i * ((wStack - leftStack) / stackdata.length) + leftStack; })
        .attr("y", hStack - botStack)
        .attr("width", barWidth)
        .attr('height', 0)
        .attr('fill', empColor)
        .attr('stroke', '#ADADAD')
        .transition().duration(1000)
            .attr("y", function(d, i) { return hStack - l_converter(d.value) - botStack })
            .attr("height", function(d, i) { return l_converter(d.value) } );
    
    estbar.enter()
        .append("rect")
        .attr("x", function(d, i) { return i * ((wStack - leftStack) / stackdata.length) + leftStack ; })
        .attr("y", function(d, i) { return hStack - l_converter(d.value) - botStack })
        .attr("width", barWidth)
        .attr('height', 0)
        .attr('fill', busColor)
        .attr('stroke', '#ADADAD')
        .transition().duration(500).delay(1000)
            .attr("y", function(d, i) { return hStack - l_converter(d.value) - l_converter(d.value2) - botStack })
            .attr("height", function(d, i) { return l_converter(d.value2) } )

      // Add mouse interactions
    var step1mover = function(d) {
        // Show tooltip		
        tooltip.transition()
            .duration(200)
            .style("opacity", .9);
        // Set data in tooltip	
        tooltip.html("Employment: " + d.value)
            .style("left", function() { return (d3.event.pageX) + "px"; })		
            .style("top", function() { return (d3.event.pageY - 30) + "px"; });
        // Highlight the current link
        d3.select(this).attr("opacity", .8);
    }

    var step1moverBus = function(d) {
        // Show tooltip		
        tooltip.transition()
            .duration(200)
            .style("opacity", .9);
        // Set data in tooltip	
        tooltip.html("Business: " + d.value2)
            .style("left", function() { return (d3.event.pageX) + "px"; })		
            .style("top", function() { return (d3.event.pageY - 30) + "px"; });
        // Highlight the current link
        d3.select(this).attr("opacity", .8);
    }
    
    var step1mout = function(d) {
        // Hide tooltip
        tooltip.transition()
            .duration(500)
            .style("opacity", 0);
        // Cancel highlight
        d3.select(this).attr("opacity", 1);
    }

    var step1mmov = function(d) {
        tooltip.style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 30) + "px");
    }

    empbar.on("mouseover", step1mover)
    .on("mouseout", step1mout)
    .on("mousemove", step1mmov);

    estbar.on("mouseover", step1moverBus)
    .on("mouseout", step1mout)
    .on("mousemove", step1mmov);


    // Add Axis Label
    svg.append("text")
        .attr("transform", "translate(30, 120) rotate(-90)")
        .attr('font-size', '12px')
        .text("Count")
    
    // Add Legend
    var legendList = [
        {"name": "Employment", "color": empColor},
        {"name": "Business",  "color": busColor}
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
                .attr('width', 12)
                .attr('height', 12)
                .attr('x', 0)
                .attr('y', function(d, i) { return (i*18) + 5 })
                .attr('fill', function(d,i) { return d.color; });

            thisele.selectAll('text')
                .data(legendList)
                .enter()
                .append('text')
                .text(function(d, i) { return d.name; })
                .attr('x', 18)
                .attr('y', function(d, i) { return (i*18) + 15; })
                .attr('font-size', '12px')
                .attr('fill', '#666');
        });


// End function createStackbar
}

// Leaflet Map
var layer, geojson;
function createChoroMap() {
    var openmap = L.map('choro', {
        doubleClickZoom: false,
        zoomControl: false,
        scrollWheelZoom: false,
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
    layer.bindPopup(feature.properties.featurenam, {closeButton: true, offset: L.point(0, 30), autoPan: false});
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
        fillColor: '#BB3C1C',
        weight: 0,
        color: 'white',
        dashArray: '',
        fillOpacity: 1
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    // Open Popup
    layer.openPopup();

    // Highlight Stack Bar Chart
    // - TODO: Change 3 to the right number
    d3.selectAll(".xaxeStack text")
        .attr('fill', '#666');
    d3.select(".xaxeStack g:nth-child(3) text")
        .attr('fill', '#BB3C1C');
}

// Mouse Out
function openmapMouseOut(e) {
    geojson.resetStyle(e.target);

    // Close Popup
    layer.closePopup();
}









/*
* STEP 2
*
*/
function createTreeMap() {

    var visualization = d3plus.viz()
        .container("#step2tree")
        .data(treeData)
        .type("tree_map")
        .id(["group","name"])
        .size("value")
        .labels({"align": "left", "valign": "top"})
        .font({ "family": "system-ui", "size": 10 })
        .draw()

}






/*
* STEP 3
*
*/
function createCompBar() {

    var attributes = [
        {"name": "Employment", "hex": "#CCC"},
        {"name": "Graduated", "hex": "#C00"}
    ]

    var visualization = d3plus.viz()
    .container("#step3bar")
    .data(step3data)
    .type("bar")
    .id("name")
    .x("value")
    .y({"scale": "discrete", "value":"year"})
    .font({"size": 16, "weight": 400})
    .legend({ "filters": true, "size": 100})
    .attrs(attributes)
    .color("hex")
    .order({"sort":"desc", "value": "value"})
    .draw()

}







/*
* STEP 4
*
*/
function createLinePlot() {

    var color = d3.scale.ordinal(d3.schemeCategory10);
    
    var visualization = d3plus.viz()
        .container("#step4line")  // container DIV to hold the visualization
        .data(step4data)  // data to use with the visualization
        .type("line")       // visualization type
        .id("name")         // key for which our data is unique on
        .text("name")       // key to use for display text
        .y("value")         // key to use for y-axis
        .x("year")          // key to use for x-axis
        .font({"size": 16, "weight": 400})
        .legend({ "size": 100})
        .draw()             // finally, draw the visualization!
}



// Start map
// Step 1
createChoroMap();
createStackbar();
// Step 2
createTreeMap();
// Step 3
createCompBar();
// Step 4
createLinePlot();