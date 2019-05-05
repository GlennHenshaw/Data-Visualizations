



var max_width = 700;
var max_height = 500;

var total_width = Math.min(max_width,window.innerWidth);
var total_height = Math.min(max_height,window.innerHeight);

var svg = d3.select('#chart-area').append('svg')
            .attr("width",total_width)
            .attr("height",total_height)

var margin = {top:20,right:40,bottom:30,left:160};

var width = total_width - margin.left - margin.right;
var height = total_height - margin.top - margin.bottom;

var chart = svg.append('g')
               .attr("transform",
               	"translate("+margin.left+","+margin.top+")");

var circles = chart.selectAll('circle');

var parse = d3.timeParse("%Y");               

var x = d3.scaleLinear().range([0,width]);
var y = d3.scaleLinear().range([height,0]);

d3.select("#blue-bubble").append("circle")
                         .attr("cx","10")
                         .attr("cy","10")
                         .attr("r","8")
                         .attr("fill","#08708A");
d3.select("#red-bubble").append("circle")
                         .attr("cx","10")
                         .attr("cy","10")
                         .attr("r","8")
                         .attr("fill","#D73A31");


d3.csv('master2.csv').then(function(data){

	
    
    data.forEach(function(d){
    	d.rate = Number(d['rate']);
    	d.year = Number(d.year);
    });




    
  

    var lineFunction = d3.line()
               .x(function(d) { return x(d.year); })
               .y(function(d) { return y(d.rate); });


    x.domain(d3.extent(data,(d) => d.year));
    y.domain([0,d3.max(data,(d) => d.rate)]);

    var xAxis = d3.axisBottom().scale(x);
    var yAxis = d3.axisLeft().scale(y);

    chart.append('g').attr("class",'axis')
                     .call(xAxis.ticks(8).tickFormat(d3.format("0")))
                     .attr("transform","translate("+0+","+height+")");
    chart.append('g').attr("class",'axis')
                     .call(yAxis)
                     .attr("transform","translate("+0+","+0+")");

    var ylabel = chart.append("text")
                      .attr("class","y-label")
                      .attr("text-anchor","middle")
                      .attr("x","-20")
                      .attr("y",height/2 -50);
    ylabel.append("tspan")
          .text("Suicides")
          .attr("dy","1.2em")
          .attr("x","-80");
    ylabel.append("tspan")
          .text("per 100,000")
          .attr("dy","1.2em")
          .attr("x","-80");
    ylabel.append("tspan")
          .text("population")
          .attr("dy","1.2em")
          .attr("x","-80");
                      

    circles.data(data).enter().append('circle')
                      .attr("cx", (d) => x(d.year))
                      .attr("cy", (d) => y(d.rate))
                      .attr("r",8)
                      .attr("opacity",".1")
                      .attr("fill", function(d){
                      	return (d.sex == 'male') ? '#08708A' : '#D73A31';
                      }).on("mouseover", function(d){
                      	drawLines(d.country,d.rate);
                      	return;
                      })
                        .on("mouseout", function(){
   
                         });

   
   
   



       var male_line_outter = chart.append("path")
                          .attr("class", "malelineoutter");
  
       var male_line = chart.append("g").append("path")
                                    .attr("class", "maleline");

       var female_line_outter = chart.append("path")
                          .attr("class", "femalelineoutter");

       var female_line = chart.append("path")
                          .attr("class", "femaleline");

       var text = chart.append('text');

       drawLines('Ukraine',45);


   

   function drawLines(country,rate){

   	 lineDatamale = data.filter(function(d){
    	     condition = (d.sex == 'male')
    	                && (d.country == country);
    	     return condition;
          });
     lineDatafemale = data.filter(function(d){
    	     condition = (d.sex == 'female')
    	                && (d.country == country);
    	     return condition;
          });

   	 
   	
      male_line.data([lineDatamale])
               .attr("d", lineFunction)
               .attr("opacity","1");

      male_line_outter.data([lineDatamale])
                 .attr("d", lineFunction)
                 .attr("opacity","1");

      

      female_line.data([lineDatafemale])
                 .attr("d", lineFunction)
                 .attr("opacity","1");

      female_line_outter.data([lineDatafemale])
                 .attr("d", lineFunction)
                 .attr("opacity","1");

      


      text.attr("y", Math.max(y(rate)-60,0))
          .attr("x", width-200)
          .attr("class","labels")
          .text(country)
          .attr("font-family", "sans-serif")
          .attr("font-size", "20px")
          .attr("fill", "black")
          .attr("opacity","1");


   }

    




	
});
