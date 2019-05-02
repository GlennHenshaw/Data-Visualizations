
export class BasicChart {
     constructor(data) {
       var d3 = require('d3'); // Require D3 via Webpack
       this.data = data;
       this.svg = d3.select('div#chart').append('svg');


       this.max_width=300;
       this.max_height=200;

       this.margin = {
                 left: 40,
                 top: 30,
                 right: 0,
                 bottom: 30
                 };

       let w = Math.min(window.innerWidth,this.max_width);
       let h = Math.min(window.innerWidth,this.max_height);

       this.svg.attr('width', w);
       this.svg.attr('height', h);
       this.width = w - this.margin.left -
       this.margin.right;
       this.height = h - this.margin.top -
       this.margin.bottom;
       this.chart = this.svg.append('g')
         .attr('width', this.width)
         .attr('height', this.height)
         .attr('transform', `translate(${this.margin.left},
          ${this.margin.top})`);

} }


export class BasicBarChart extends BasicChart {
     constructor(data) {
       super(data);

       //scales and axes
       let x = d3.scale.ordinal()
                       .rangeRoundBands([this.margin.left, this.width -
                                         this.margin.right], .1);
       let y = d3.scale.linear().range([this.height,
                                        this.margin.bottom]);
       let xAxis = d3.svg.axis().scale(x).orient('bottom');
       let yAxis = d3.svg.axis().scale(y).orient('left');

       x.domain(data.map((d) => { return d.name }));
       y.domain([0, d3.max(data, (d) => { return d.population; })]);


       let yticks = 4;

       this.chart.append('g')
           .attr('class', 'axis')
           .attr('transform', `translate(0, ${this.height})`)
           .call(xAxis);

       this.chart.append('g')
           .attr('class', 'axis')
           .attr('transform', `translate(${this.margin.left}, 0)`)
           .call(yAxis.ticks(yticks));
       


       let gridlines = d3.svg.axis().scale(y)
                              .tickSize(-this.width)
                              .orient('left');

       this.chart.selectAll('rect')
           .data(data)
           .enter()
           .append('rect')
           .attr('class', 'bar')
           .attr("fill","gray")
           .attr("opacity",".5")
           .attr('x', (d) => { return x(d.name); })
           .attr('width', x.rangeBand())    
           .attr('y', (d) => { return y(d.population); })
           .attr('height', (d) => {return this.height -
                                   y(d.population); });  

        
        
        	this.chart.append('g')
                .attr('class','grid')
                .attr('transform', `translate(${45},0)`)
                .attr("fill","red")
                .call(gridlines.ticks(yticks));

    

     }
}

let data = require('./data/chapter1.json'); // Data from UNHCR, 2015.11.01: http://data.unhcr.org/api/population/regional.json

console.log(data);
let totalNumbers = data.filter((obj) => {return obj.population.length; })
  .map((obj) => {
    return {
      name: obj.name,
      population: Number(obj.population[0].value)
    };
  });

var myChart = new BasicBarChart(totalNumbers);
