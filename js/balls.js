


var data = {x: [0,1,2,3,4,5,6], y:[0,1,2,3,4,5,6]};

var margin = {top: 30, right: 20, bottom: 50, left: 50},
        width, // width gets defined below
    height = 500 - margin.top - margin.bottom;

var svg = d3.select("#chart-area")
    .append("svg")
        .attr("height", height + margin.top + margin.bottom);

var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var xScale = d3.scaleLinear();
var yScale = d3.scaleLinear().range([height, 0]);

// Define the axes


xScale.domain(d3.extent(data, function(d) { return d.x; }));
yScale.domain([
        d3.min(data, function(d) { return d.y; }), 
        d3.max(data, function(d) { return d.y; })
    ]);

var xAxis = d3.axisBottom().scale(xScale);
var yAxis = d3.axisLeft().scale(yScale);

var xAxisEl = g.append("g")
        .attr("transform", "translate(0," + height + ")");

var yAxisEl = g.append("g")
        .call(yAxis);

function drawChart(){
	width = parseInt(d3.select('.jumbotron').style('width'), 10) - margin.left - margin.right;
	svg.attr("width", width + margin.left + margin.right);
	xScale.range([0, width]);
	xAxis.scale(xScale);
	xAxisEl.call(xAxis);

/*	g.selectAll("circle")
	 .data(data)
	 .enter()
	 .append("circle")
	 .attr("cx",function(d){
	 	return d.x;
	 })
	 .attr("cy",function(d){
	 	return d.y;
	 })
	 .attr("r", 20);*/
}

drawChart();



window.addEventListener('resize', drawChart);