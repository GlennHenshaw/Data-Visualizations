
var margin = {top: 30, right: 20, bottom: 70, left: 70};
var height = 500 - margin.top - margin.bottom;
var width = 800 - margin.left - margin.right;

var slider = document.getElementById("myRange");
var slider_value = 0;

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


slider.oninput = function() {
  slider_value = this.value;
}


var flag = true;


var svg = d3.select("#chart-area")
            .append("svg")
            .attr("width",width + margin.left + margin.right)
            .attr("height",height + margin.top + margin.bottom);
var g = svg.append("g")
           .attr("id","graph")
           .attr("transform","translate("+margin.left+","+margin.top+")");

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
	data.forEach(function(d){
		d.price = +d.price;
		d.profit = +d.profit;
		d.popularity = +d.popularity;
		d.time = +d.time;
	})
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
	var max_time = d3.max(data, function(d){
		            return d.time;
	            });
	var min_time = d3.min(data, function(d){
		            return d.time;
	            });
	var names = data.map(function(d){
		return d.name;
	});

	d3.select("#myRange")
	  .attr("min",min_time - 1)
	  .attr("max",max_time + 1);

    var xscale = d3.scaleLog()
               .domain([min_price,max_price])
               .range([0,width]);
    var yscale = d3.scaleLog()
               .domain([min_profit,max_profit])
               .range([height,0]);

    var colorscale = d3.scaleOrdinal()
                   .domain(names)
                   .range(['red','green','blue','black','yellow','orange']);
    
    var xaxiscallable = d3.axisBottom(xscale);
    var yaxiscallable = d3.axisLeft(yscale)


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


   
    

    d3.interval(function(){
 	    update(data,xscale,yscale,colorscale);
    },50);
    update(data,xscale,yscale,colorscale);

      

}).catch(function(error){
	console.log(error);
})

function update(data,xscale,yscale,colorscale){

    
    var newdata = data.filter(function(d){
    	return d["time"] <= Number(slider_value);
    });

   
	      

    var circles = d3.select("#graph")
                    .selectAll("circle")
                    .data(newdata);

   
    circles.exit().remove();
      

       
    circles.enter()
       .append("circle") 
       .attr("r",function(d){
       	   return Math.sqrt(d.popularity)/3 +.4;
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
       



};



