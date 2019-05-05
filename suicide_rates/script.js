



var max_width = 800;
var max_height = 600;

var total_width = Math.min(max_width,window.innerWidth);
var total_height = Math.min(max_height,window.innerHeight);

var svg = d3.select('#chart-area').append('svg')
            .attr("width",total_width)
            .attr("height",total_height)

var margin = {top:30,right:200,bottom:30,left:30};

var width = total_width - margin.left - margin.right;
var height = total_height - margin.top - margin.bottom;

var chart = svg.append('g')
               .attr("transform",
               	"translate("+margin.left+","+margin.bottom+")");

var circles = chart.selectAll('circle');

var parse = d3.timeParse("%Y");               

var x = d3.scaleLinear().range([0,width]);
var y = d3.scaleLinear().range([height,0]);


d3.csv('master.csv').then(function(data){

	
    
    data.forEach(function(d){
    	d.rate = Number(d['suicides/100k pop']);
    	d.year = Number(d.year);
    });

/* data = data.filter(function(d){
    	     return (d.country == 'United States');
          }); */

    
  

    var lineFunction = d3.line()
               .x(function(d) { return x(d.year); })
               .y(function(d) { return y(d.rate); });


    x.domain(d3.extent(data,(d) => d.year));
    y.domain([0,d3.max(data,(d) => d.rate)]);

    var xAxis = d3.axisBottom().scale(x);
    var yAxis = d3.axisLeft().scale(y);

    chart.append('g').attr("class",'axis')
                     .call(xAxis)
                     .attr("transform","translate("+0+","+height+")");
    chart.append('g').attr("class",'axis')
                     .call(yAxis)
                     .attr("transform","translate("+0+","+0+")");

    circles.data(data).enter().append('circle')
                      .attr("cx", (d) => x(d.year))
                      .attr("cy", (d) => y(d.rate))
                      .attr("r",4)
                      .attr("opacity",".05")
                      .attr("fill", function(d){
                      	return (d.sex == 'male') ? 'blue' : '#eca1a6';
                      }).on("mouseover", function(d){
                      	drawLines(d.age,d.country,d.rate,d.year);


                      	return;
                      })
                        .on("mouseout", function(){
                        	male_line.transition().duration(750)
                                                  .ease(d3.easeLinear)//.attr("opacity","0");
                        	female_line.transition().duration(750)
                                                  .ease(d3.easeLinear)//.attr("opacity","0");
                        	d3.selectAll(".labels").ease(d3.easeLinear).attr("opacity","0");

                           
                         });
   var text = chart.append('text')
   
   var male_line = chart.append("g").append("path")
                                    .attr("class", "maleline");
   var female_line = chart.append("path")
                          .attr("class", "femaleline");

   function drawLines(age,country,rate,year){

   	 lineDatamale = data.filter(function(d){
    	     condition = (d.sex == 'male')
    	                && (d.age == age) 
    	                && (d.country == country);
    	     return condition;
          });
     lineDatafemale = data.filter(function(d){
    	     condition = (d.sex == 'female')
    	                && (d.age == age)
    	                && (d.country == country);
    	     return condition;
          });

   	 
   	
      male_line.data([lineDatamale])
               .attr("d", lineFunction)
               .attr("opacity","1");

      female_line.data([lineDatafemale])
                 .attr("d", lineFunction)
                 .attr("opacity","1");


      text.attr("y", y(rate)-60)
          .attr("x", width-200)
          .attr("class","labels")
          .text(country+": "+age)
          .attr("font-family", "sans-serif")
          .attr("font-size", "20px")
          .attr("fill", "black")
          .attr("opacity","1");


   }

    




	
});
