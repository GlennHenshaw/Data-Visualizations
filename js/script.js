//////////////////////////////////////////////
// Data //////////////////////////////////////
//////////////////////////////////////////////
// fake data
var data = [
    {year: 2000, population: 1192},
    {year: 2001, population: 1234},
    {year: 2002, population: 1463},
    {year: 2003, population: 1537},
    {year: 2004, population: 1334},
    {year: 2005, population: 1134},
    {year: 2006, population: 1234},
    {year: 2007, population: 1484},
    {year: 2008, population: 1562},
    {year: 2009, population: 1427},
    {year: 2010, population: 1325},
    {year: 2011, population: 1484},
    {year: 2012, population: 1661},
    {year: 2013, population: 1537},
    {year: 2014, population: 1334},
    {year: 2015, population: 1134},
    {year: 2016, population: 1427}
];


// Parse the date / time
var parseDate = d3.timeParse("%Y");

// force types
function type(dataArray) {
    dataArray.forEach(function(d) {
        d.year = parseDate(d.year);
        d.retention = +d.population;
    });
    return dataArray;
}
data = type(data);

//////////////////////////////////////////////
// Chart Config /////////////////////////////
//////////////////////////////////////////////

// Set the dimensions of the canvas / graph
var margin = {top: 30, right: 20, bottom: 30, left: 50},
        width, // width gets defined below
    height = 500 - margin.top - margin.bottom;

// Set the scales ranges
var xScale = d3.scaleTime();
var yScale = d3.scaleLinear().range([height, 0]);

// Define the axes
var xAxis = d3.axisBottom().scale(xScale);
var yAxis = d3.axisLeft().scale(yScale);

// create a line
var line = d3.line();

// Add the svg canvas
var svg = d3.select("#chart-area")
    .append("svg")
        .attr("height", height + margin.top + margin.bottom);

var artboard = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// set the domain range from the data
xScale.domain(d3.extent(data, function(d) { return d.year; }));
yScale.domain([
        d3.min(data, function(d) { return Math.floor(d.population - 200); }), 
        d3.max(data, function(d) { return Math.floor(d.population + 200); })
    ]);

// draw the line created above
var path = artboard.append("path").data([data])
        .style('fill', 'none')
        .style('stroke', 'steelblue')
        .style('stroke-width', '2px');

// Add the X Axis
var xAxisEl = artboard.append("g")
        .attr("transform", "translate(0," + height + ")");

// Add the Y Axis
// we aren't resizing height in this demo so the yAxis stays static, we don't need to call this every resize
var yAxisEl = artboard.append("g")
        .call(yAxis);

//////////////////////////////////////////////
// Drawing ///////////////////////////////////
//////////////////////////////////////////////
function drawChart() {
    // reset the width
    width = parseInt(d3.select('.jumbotron').style('width'), 10) - margin.left - margin.right;
    // set the svg dimensions
    svg.attr("width", width + margin.left + margin.right);
    
    // Set new range for xScale
    xScale.range([0, width]);
    
    // give the x axis the resized scale
    xAxis.scale(xScale);
    
    // draw the new xAxis
    xAxisEl.call(xAxis);
    
    // specify new properties for the line
    line.x(function(d) { return xScale(d.year); })
        .y(function(d) { return yScale(d.population); });
    
    // draw the path based on the line created above
    path.attr('d', line);
}

// call this once to draw the chart initially
drawChart();


//////////////////////////////////////////////
// Resizing //////////////////////////////////
//////////////////////////////////////////////

// redraw chart on resize
window.addEventListener('resize', drawChart);