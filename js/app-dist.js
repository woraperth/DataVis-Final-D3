// D3Plus Scale
// Source: https://cdnjs.cloudflare.com/ajax/libs/d3plus/1.9.8/d3plus.full.js
"use strict";

var colorAry = ["#b22200", "#282F6B", "#b39600", "#224F20", "#993F88", "#5F487C", "#759143", "#419391", "#993F88", "#e89c89", "#ffee8d", "#afd5e8", "#f7ba77", "#a5c697", "#c5b5e5", "#d1d392", "#bbefd0", "#e099cf"];
var colorList = d3.scale.ordinal().range(colorAry);
// How to use: colorList(cat_id) e.g. colorList(1) to colorList(19)

// Add D3 Plus Scale Color to CSS
var css = "",
    head = document.head || document.getElementsByTagName("head")[0],
    style = document.createElement("style");

// Generate dynamic text color for section 4
for (var i = 0; i < 6; i++) {
    css += ".topcomp-list li:nth-child(" + (i + 1) + ") { color: " + colorAry[i] + "; }";
}

style.type = "text/css";
if (style.styleSheet) {
    style.styleSheet.cssText = css;
} else {
    style.appendChild(document.createTextNode(css));
}
head.appendChild(style);

// Initialize variables
var showCBD = true;

// Utility function from Elias Zamaria
// Referenece: http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/*
* STEP 1
*/

// Show / hide CBD when clicked
document.getElementById("showHideCBD").addEventListener("click", function (e) {
    // Toggle show CBD
    showCBD = !showCBD;
    // Clear bar chart
    document.getElementById("step1stack").innerHTML = "";
    // Rerender bar chart
    createStackbar();
    // Stop page from jumping
    e.preventDefault();
});

// Create stack bar chart
function createStackbar() {
    var wStack = d3.select("#step1stack").node().getBoundingClientRect().width;
    var hStack = 600;

    var svg = d3.select("#step1stack").append("svg").attr("width", wStack).attr("height", hStack);

    var padStack = 5;
    var botStack = 150;
    var leftStack = 80;
    var topStack = 20;

    var empColor = "#D1D1D1";
    var busColor = "#666";

    // Check show/hide CBD
    if (showCBD) {
        var step1data_data = step1data;
    } else {
        // Hide CBD
        var step1data_data = step1data.slice();
        step1data_data.shift();
    }

    // Add stacked bar chart
    var l_converter = d3.scale.linear().domain([0, d3.max(step1data_data, function (d) {
        return d.total;
    })]).range([0, hStack - botStack - topStack]);

    var barWidth = (wStack - leftStack) / step1data_data.length - padStack;

    // Add axis
    var xScale = d3.scale.ordinal().domain(d3.map(step1data_data, function (d) {
        return d.areaname;
    }).keys()).rangePoints([0, wStack - leftStack - barWidth]);

    var yScale = d3.scale.linear().domain([1, d3.max(step1data_data, function (d) {
        return d.total;
    })]).range([hStack, botStack + topStack]);

    var xAxis = d3.svg.axis().orient("bottom").scale(xScale);

    var yAxis = d3.svg.axis().orient("left").scale(yScale);

    var xAxisG = d3.svg.axis().orient("bottom").scale(xScale);

    var yAxisG = d3.svg.axis().orient("left").scale(yScale);

    // Draw background grid
    svg.append("rect").attr("class", "gridbg").attr("fill", "#FAFAFA").attr("width", wStack - leftStack).attr("height", hStack - botStack).attr("transform", "translate(" + (leftStack - 5) + "," + 0 + ")");

    // add the X gridlines
    svg.append("g").attr("class", "grid").attr("transform", "translate(" + (leftStack + barWidth) + "," + (hStack - botStack) + ")").call(xAxisG.tickSize(-hStack).tickFormat(""));

    // add the Y gridlines
    svg.append("g").attr("class", "grid").attr("transform", "translate(" + leftStack + "," + -botStack + ")").call(yAxisG.tickSize(-wStack).tickFormat(""));

    svg.append("g").attr("class", "xaxeStack") // give it a class so it can be used to select only xaxis labels  below
    .attr("transform", "translate(" + (leftStack + barWidth / 2) + "," + (hStack - botStack + 5) + ")").call(xAxis);

    svg.append("g").attr("class", "yaxeStack").attr("transform", "translate(" + (leftStack - 5) + "," + -botStack + ")").call(yAxis);

    // Style the axis
    svg.selectAll(".xaxeStack text") // select all the text elements for the xaxis
    .attr("transform", function (d) {
        return "translate(" + (this.getBBox().height * -2 + 10) + "," + (this.getBBox().height - 10) + ")rotate(-45)";
    }).attr("font-size", 20);

    svg.selectAll(".xaxeStack text, .yaxeStack text").attr("fill", "#666");

    // Tooltip
    var tooltip = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);

    // Draw Graph
    var empgroup = svg.append("g").attr("class", "empbar");
    var empbar = svg.select(".empbar").selectAll("rect").data(step1data_data);
    var estgroup = svg.append("g").attr("class", "estbar");
    var estbar = svg.select(".estbar").selectAll("rect").data(step1data_data);

    empbar.enter().append("rect").attr("x", function (d, i) {
        return i * ((wStack - leftStack) / step1data_data.length) + leftStack;
    }).attr("y", hStack - botStack).attr("width", barWidth).attr("height", 0).attr("fill", empColor).attr("stroke", "#ADADAD").attr("opacity", 0.8).transition("empenter").duration(1000).attr("y", function (d, i) {
        return hStack - l_converter(d.emp) - botStack;
    }).attr("height", function (d, i) {
        return l_converter(d.emp);
    });

    estbar.enter().append("rect").attr("x", function (d, i) {
        return i * ((wStack - leftStack) / step1data_data.length) + leftStack;
    }).attr("y", function (d, i) {
        return hStack - l_converter(d.emp) - botStack;
    }).attr("width", barWidth).attr("height", 0).attr("fill", busColor).attr("stroke", "#ADADAD").attr("opacity", 0.8).transition("estenter").duration(500).delay(1000).attr("y", function (d, i) {
        return hStack - l_converter(d.emp) - l_converter(d.bus) - botStack;
    }).attr("height", function (d, i) {
        return l_converter(d.bus);
    });

    // Add mouse interactions
    var step1mover = function step1mover(d) {
        // Show tooltip		
        tooltip.transition("st1tooltip").duration(200).style("opacity", .9);
        // Set data in tooltip	
        tooltip.html("Employment: " + numberWithCommas(d.emp)).style("left", function () {
            return d3.event.pageX + "px";
        }).style("top", function () {
            return d3.event.pageY - 30 + "px";
        });
        // Highlight the current link
        d3.select(this).attr("opacity", 1);
    };

    var step1moverBus = function step1moverBus(d) {
        // Show tooltip		
        tooltip.transition("st1movebus").duration(200).style("opacity", .9);
        // Set data in tooltip	
        tooltip.html("Business: " + numberWithCommas(d.bus)).style("left", function () {
            return d3.event.pageX + "px";
        }).style("top", function () {
            return d3.event.pageY - 30 + "px";
        });
        // Highlight the current link
        d3.select(this).attr("opacity", 1);
    };

    var step1mout = function step1mout(d) {
        // Hide tooltip
        tooltip.transition("st1mout").duration(500).style("opacity", 0);
        // Cancel highlight
        d3.select(this).attr("opacity", 0.8);
    };

    var step1mmov = function step1mmov(d) {
        tooltip.style("left", d3.event.pageX + "px").style("top", d3.event.pageY - 30 + "px");
    };

    empbar.on("mouseover", step1mover).on("mouseout", step1mout).on("mousemove", step1mmov);

    estbar.on("mouseover", step1moverBus).on("mouseout", step1mout).on("mousemove", step1mmov);

    // Add Axis Label
    svg.append("text").attr("transform", "translate(10, " + (hStack - botStack) / 2 + ") rotate(-90)").attr("font-size", "12px").text("Number of people");

    // Add Legend
    var legendList = [{ "name": "Employment", "color": empColor }, { "name": "Business", "color": busColor }];

    svg.append("g").attr("class", "legendOrdinal").attr("transform", "translate(" + (wStack - 100) + ",0)");

    svg.select(".legendOrdinal").call(function (thisele) {
        thisele.selectAll("rect").data(legendList).enter().append("rect").attr("width", 12).attr("height", 12).attr("x", 0).attr("y", function (d, i) {
            return i * 18 + 5;
        }).attr("fill", function (d, i) {
            return d.color;
        });

        thisele.selectAll("text").data(legendList).enter().append("text").text(function (d, i) {
            return d.name;
        }).attr("x", 18).attr("y", function (d, i) {
            return i * 18 + 15;
        }).attr("font-size", "12px").attr("fill", "#666");
    });

    // End function createStackbar
}

// Leaflet Map
var layer, geojson;
function createChoroMap() {
    var openmap = L.map("choro", {
        doubleClickZoom: false,
        zoomControl: false,
        scrollWheelZoom: false
    }).setView([-37.8354, 144.9437], 11.5);

    L.tileLayer("http://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png", {
        attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>",
        maxZoom: 18
    }).addTo(openmap);

    // Custom Legend

    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function (map) {

        var div = L.DomUtil.create("div", "info legend"),
            grades = [0, 40000, 80000, 120000, 160000, 200000],
            labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML += "<i style=\"background:" + mycolor(Math.log(grades[i])) + "\"></i> " + numberWithCommas(grades[i]) + (grades[i + 1] ? "&ndash;" + numberWithCommas(grades[i + 1]) + "<br>" : "+");
        }

        return div;
    };

    legend.addTo(openmap);

    geojson = L.geoJson(melbarea, {
        style: openmapStyle,
        onEachFeature: openmapOnEach
    }).addTo(openmap);
}

function openmapOnEach(feature, layer) {
    layer.bindPopup(feature.properties.featurenam, { closeButton: true, offset: L.point(0, 30), autoPan: false });
    layer.on({
        mouseover: openmapMouseOver,
        mouseout: openmapMouseOut
    });
}

var mycolor = chroma.scale(["#F5D76E", "#D35400"]).domain([0, d3.max(step1data, function (d) {
    return Math.log(d.total);
})]);

// Show highlighted color
function getColor(featurenick) {
    var c = "#666";

    for (var i = 0; i < step1data.length; i++) {
        if (step1data[i].areanick == featurenick) {
            c = mycolor(Math.floor(Math.log(step1data[i].total)));
            break;
        }
    }

    return c;
}

function openmapStyle(feature) {
    return {
        fillColor: getColor(feature.properties.nickname),
        weight: 2,
        color: "#666",
        dashArray: "",
        fillOpacity: 1
    };
}

// When hovering on map
function openmapMouseOver(e) {
    layer = e.target;

    layer.setStyle({
        fillColor: "#BB3C1C",
        weight: 0,
        color: "white",
        dashArray: "",
        fillOpacity: 1
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    // Open Popup
    layer.openPopup();

    // Highlight Stack Bar Chart

    // - Based on showing / hiding CBD
    if (showCBD) {
        var step1data_data = step1data;
    } else {
        // Hide CBD
        var step1data_data = step1data.slice();
        step1data_data.shift();
    }

    var labelBar = -1;
    for (var i = 0; i < step1data_data.length; i++) {
        if (step1data_data[i].areanick == layer.feature.properties.nickname) {
            labelBar = i;
            break;
        }
    }

    d3.select(".xaxeStack g:nth-child(" + (labelBar + 1) + ") text").transition("hoverx").attr("fill", "#BB3C1C");

    d3.selectAll(".empbar rect:nth-child(" + (labelBar + 1) + "), .estbar rect:nth-child(" + (labelBar + 1) + ")").transition("hovery").attr("fill", "#BB3C1C");
}

// Mouse Out
function openmapMouseOut(e) {
    geojson.resetStyle(e.target);

    // Close Popup
    layer.closePopup();

    d3.selectAll(".xaxeStack text").transition("outx").attr("fill", "#666");

    d3.selectAll(".empbar rect").transition("outemp").attr("fill", "#D1D1D1");

    d3.selectAll(".estbar rect").transition("outest").attr("fill", "#666");
}

/*
* STEP 2
*
*/
function createTreeMap() {

    var visualization = d3plus.viz().container("#step2tree").data(step2data).type("tree_map").id(["industry", "type"]).size("value").labels({ "align": "left", "valign": "top" }).font({ "family": "system-ui", "size": 16 }).draw();
}

/*
* STEP 3
*
*/
function createCompBar() {

    var attributes = [{ "type": "Employment", "hex": "#CCC" }, { "type": "Graduated Students", "hex": "#C00" }];

    var bWidth = d3.select("body").node().getBoundingClientRect().width;
    var comp_fsize = 16;
    var comp_legsize = 100;
    var comp_fsize_s = 12;
    var comp_legsize_s = 20;
    if (bWidth < 767) {
        // Small screen font size
        comp_fsize = 10;
        comp_fsize_s = 10;
        comp_legsize = 60;
        comp_legsize_s = 20;
    }

    var visualization = d3plus.viz().container("#step3bar").data(step3data).type("bar").id("type").x({ "value": "value", "label": "Number of people" }).y({ "scale": "discrete", "value": "industry" }).font({ "size": comp_fsize, "weight": 400 }).legend({ "filters": true, "size": comp_legsize }).attrs(attributes).color("hex").order({ "sort": "desc", "value": "value" }).draw();

    var visualization = d3plus.viz().container("#step3empmore").data(step3empmore).type("bar").id("type").x({ "value": "value", "label": "Number of people" }).y({ "scale": "discrete", "value": "industry" }).font({ "size": comp_fsize_s, "weight": 400 }).legend({ "filters": true, "size": comp_legsize_s }).attrs(attributes).color("hex").order({ "sort": "desc", "value": "value" }).draw();

    var visualization = d3plus.viz().container("#step3gradmore").data(step3gradmore).type("bar").id("type").x({ "value": "value", "label": "Number of people" }).y({ "scale": "discrete", "value": "industry" }).font({ "size": comp_fsize_s, "weight": 400 }).legend({ "filters": true, "size": comp_legsize_s }).attrs(attributes).color("hex").order({ "sort": "desc", "value": "value" }).draw();
}

/*
* STEP 4
*
*/
function createLinePlot() {

    var attributes = [{ "name": "7-Eleven", "hex": colorAry[0] }, { "name": "RMIT", "hex": colorAry[1] }, { "name": "Subway", "hex": colorAry[2] }, { "name": "Telstra", "hex": colorAry[3] }, { "name": "Wilson Parking", "hex": colorAry[4] }];

    var visualization = d3plus.viz().container("#step4line") // container DIV to hold the visualization
    .data(step4data) // data to use with the visualization
    .type("line") // visualization type
    .id("name") // key for which our data is unique on
    .text("name") // key to use for display text
    .y({ "value": "value", "label": "Number of blocks" }) // key to use for y-axis
    .x("year") // key to use for x-axis
    .attrs(attributes).color("hex").legend({ filters: true }).font({ "size": 16, "weight": 400 }).draw(); // finally, draw the visualization!

    // Hover name & highlight line
    var st4TopElem = document.querySelectorAll(".topcomp-list li");
    for (var i = 0; i < st4TopElem.length; i++) {
        var thisEle = st4TopElem[i];

        // When hover
        thisEle.addEventListener("mouseover", function (e) {
            var thisName = e.target.innerHTML;
            var thisLineID = "d3plus_group_nesting_" + thisName.replace(/ /g, "_");
            e.target.className = "st4-highlight";

            var allLines = d3.select("#step4line svg").selectAll("g.d3plus_line");
            for (var j = 0; j < allLines[0].length; j++) {
                // Hide if it is not the focused line
                if (allLines[0][j].id != thisLineID) {
                    d3.select("#" + allLines[0][j].id).attr("opacity", 0.2);
                }
            }
        });

        // When mouse out
        thisEle.addEventListener("mouseout", function (e) {
            // Clear class
            e.target.className = "";
            // Show all lines
            var allLines = d3.select("#step4line svg").selectAll("g.d3plus_line").attr("opacity", 1);
        });
    }
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
