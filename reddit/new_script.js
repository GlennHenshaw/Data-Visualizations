var margin = {top: 30, right: 30, bottom: 70, left: 70};
var height = 500 - margin.top - margin.bottom;
var width = 800 - margin.left - margin.right;

var slider_value = 10;

// Basic additions to html

slider = d3.select("#slider")
			.attr("type", "range")
			.attr("step", "60")
			.attr("class","slider")
			.attr("list","tickmarks");
			
var svg = d3.select("#chart-area")
            .append("svg")
            .attr("width",width + margin.left + margin.right)
            .attr("height",height + margin.top + margin.bottom);
var g = svg.append("g")
           .attr("id","graph")
           .attr("transform","translate("+margin.left+","+margin.top+")");

var circles = d3.select("#graph")
                    .selectAll("circle");

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

d3.select("#red-bubble")
  .append("circle")
  .attr("cx","1em")
  .attr("cy","1em")
  .attr("r","10")
  .attr("fill","red");

d3.select("#blue-bubble")
  .append("circle")
  .attr("cx","1em")
  .attr("cy","1em")
  .attr("r","10")
  .attr("fill","blue");

for (var i=0; i<3; i++){
  d3.select("#size")
    .append("circle")
    .attr("cx",1.5*i+1 +"em")
    .attr("cy","1em")
    .attr("r",3*i+5)
    .attr("fill","none")
    .attr("stroke","white");
     };



var ylabel = g.append("text")
     .attr("class","y-label")
     .attr("text-anchor","middle")
     .attr("x","-50")
     .attr("y",height/2)
     .text("User Comment karma(Log 10)")
     .attr("fill","#CCCCCC");



var xlabel = g.append("text")
     .attr("class","x-label")
     .attr("text-anchor","middle")
     .attr("x",width/2)
     .attr("y",height + 50)
     .text("User Post karma (Log 10)")
     .attr("fill","#CCCCCC");





d3.csv("data.csv").then(function(data){
  // clean data	
  //
  //
  data.forEach(function(d){
    d.price = +d.price;
    d.profit = +d.profit;
    d.popularity = +d.popularity;
    d.time = +d.time;
  })
  // constants
  //
  //
  //
  var max_time = d3.max(data, function(d){
                return d.time;
              });
  var min_time = d3.min(data, function(d){
                return d.time;
              });
  console.log(max_time);
  var max_price = d3.max(data, function(d){
                return d.price;
              });
  var min_price = d3.min(data, function(d){
                return d.price;
              });
  var max_profit = d3.max(data, function(d){
                return d.profit;
              });
  var min_profit = d3.min(data, function(d){
                return d.profit;
              });
  var names = data.map(function(d){
    return d.name;
  });
  // scales/axes
  //
  //
  var xscale = d3.scaleLog()
               .domain([min_price,max_price])
               .range([0,width]);
  var yscale = d3.scaleLog()
               .domain([min_profit,max_profit])
               .range([height,0]);
  var xaxiscallable = d3.axisBottom(xscale);
  var yaxiscallable = d3.axisLeft(yscale);

  var xaxis = d3.select("#graph")
                  .append("g")
                  .call(xaxiscallable
                    .tickFormat(d3.format(".2s"))
                    .ticks(3))
                  .attr("transform","translate("+0+","+height+")")
                  .attr("id","xaxis");

  var yaxis = d3.select("#graph")
                  .append("g")
                  .call(yaxiscallable
                    .tickFormat(d3.format(".2s"))
                    .ticks(2))
                  .attr("id","yaxis");

  //make slider
  //
  //
  //
  slider.attr("min", 0)
		.attr("max", 1598)
		.attr("value", 0)
        .on("input", function input() {
					update(data,xscale,yscale);
				});

  update(data,xscale,yscale);

});

function gettime(minutes){
	var hours = Math.floor(minutes/60);
    var min = 
    Math.floor(60*(minutes/60 - Math.floor(minutes/60)));
    console.log(minutes);
    console.log(hours);
    console.log(min);
    if (minutes == 0){
    	return "April 1st, 12:00AM";
    }
    else if (hours < 12){
    	return "April 1st, "+hours + ":00AM";
    } else if (hours == 12){
    	return "April 1st, 12:00PM";
    } else if ((hours > 12)&&(hours<24)){
    	return "April 1st, "+(hours-12) + ":00PM";
    } else if (hours == 24){
    	return "April 2nd, 12:00AM";
    } else {
    	return "April 2nd, "+(hours -  24)+":00AM";
    }

}

function getFilteredData(data,slider_value) {
	return data.filter(function(d) { 
		return (d.time < slider_value); });
}


function update(data, xscale, yscale){

	var slider_value = document.getElementById("slider").value;
	var new_data = getFilteredData(data,slider_value);


    d3.select("#time")
      .html(gettime(slider_value));


    var circles = d3.select("#graph")
                    .selectAll("circle");
	
    //join data
    var join = circles.data(new_data);
    //enter exit
    var enter= join.enter();
    var exit = join.exit()

    enter.append("circle")
         .attr("r",function(d){
           return Math.sqrt(d.popularity)/3 +2;
       })
       .attr("cx", function(d,i){
           return xscale(d.price);
       })
       .attr("cy", function(d,i){
           return yscale(d.profit);
       })
       .attr("fill",function(d){
           if (d.original == "True"){
               return "red";
           }else{
            return "blue";
           };
           
       })
       .attr("opacity",.3)
       .on("mouseover", function(d){
            div.transition()
               .duration(100)
               .style("opacity", .9);
               var hours = Math.floor(d.time/60);
               var minutes = 
               Math.floor(60*(d.time/60 - Math.floor(d.time/60)));

            div.html("<p>"+
              "<strong>"+d.name+"</strong><br>"+
              "post karma: "+d.price+"<br>"+
              "comment karma: "+d.profit+"<br>"+
              "score: "+d.popularity+"<br>"+
              "Time: "+hours+" hrs "+minutes+" min<br>"+
              "</p>")
               .style("left", (d3.event.pageX) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
       })
       .on("mouseout", function(){
            div.transition()
               .duration(100)
               .style("opacity", 0);;
       });

     exit.remove();


}