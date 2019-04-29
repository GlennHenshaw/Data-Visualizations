


var data = [{x:0,y:0},
             {x:1,y:1},
             {x:2,y:2},
             {x:3,y:3},
             {x:4,y:4}];

/* Build data */

var y_min = 0
var y_max = 100;
var g = - 32 // feet per second per second

function height(t){
	return y_max + (.5)*g*t*t;
}


var margin = {top: 30, right: 20, bottom: 50, left: 50},
        width, // width gets defined below
    height = 500 - margin.top - margin.bottom;

var svg = d3.select("#chart-area")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom);

var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");




var xScale = d3.scaleLinear();
var yScale = d3.scaleLinear()
               .domain([y_min,y_max])
               .range([height, 0]);



// Define the axes

xScale.domain(d3.extent(data, function(d) { return d.x; }));


var xAxis = d3.axisBottom().scale(xScale);
var yAxis = d3.axisLeft().scale(yScale);

var xAxisEl = g.append("g")
        .attr("transform", "translate(0," + height + ")");

var yAxisEl = g.append("g")
        .call(yAxis);

circles = g.selectAll("circle")
	       .data(data)
	       .enter()
	       .append("circle")
	       .attr("cy",function(d){
	 	       return yScale(d.y);
	       })
	       .attr("r", 5);

function drawChart(){
	width = parseInt(d3.select('.jumbotron').style('width'), 10) - margin.left - margin.right;
	svg.attr("width", width + margin.left + margin.right);
	xScale.range([0, width]);
	xAxis.scale(xScale);
	xAxisEl.call(xAxis);
	
	circles.attr("cx",function(d){
	 	return xScale(d.x);
	 });
	 
}

drawChart();



window.addEventListener('resize', drawChart);