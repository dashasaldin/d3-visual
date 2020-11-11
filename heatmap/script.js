const dataset = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"

d3.json(dataset).then((data) => {
    d3.select("body")
    .append("div")
    .attr("id", "tooltip")
    .attr("style", "position: absolute; opacity: 0;");

    const margin = {
        top: 130,
        right: 20,
        bottom: 30,
        left: 140
    },
    width = 1200 - margin.left - margin.right;
    height = 650 - margin.top - margin.bottom;

    data.monthlyVariance.forEach((d) => {
        d.temperature = data.baseTemperature + d.variance;
    })
    
    const min = d3.min(data.monthlyVariance.map(d => d.variance));
    const max = d3.max(data.monthlyVariance.map(d => d.variance));
    const color = d3.scaleSequential()
    .interpolator(d3.interpolateInferno)
    .domain([min + data.baseTemperature, max + data.baseTemperature])

const svg = d3.select("body").append('svg')
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

let length = data.monthlyVariance.length-1, year0 = data.monthlyVariance[0].year;
const xScale = d3.scaleTime()
                 .domain([ new Date(year0, 0), new Date(data.monthlyVariance[length].year, 0) ])
                 .range ([0, width]);

svg.append("g")
.attr("transform", "translate(0," + height + ")")
.attr("id", "x-axis")
.call(d3.axisBottom(xScale))
.append("text")
.attr("x", 550)
.attr("y", 30)
.style("fill", "black")
.attr("class", "label")
.style("text-anchor", "middle")
.text("Years")



const yScale = d3.scaleTime()
                 .domain([new Date(2020, 0, 1), new Date(2020, 11, 31)])
                 .range ([0, height]);

svg.append("g")
.attr("id", "y-axis")
.call(d3.axisLeft(yScale).tickFormat(d3.timeFormat("%B")))
.append("text")
.style("fill", "black")
.attr("class", "label")
.attr("transform", "rotate(-90)")
.attr("y", -50)
.attr("x", -100)
.style("text-anchor", "middle")
.text("Months");

let barWidth = width / (length/12);
let barHeight = height/12;

svg.append("g")
 .selectAll("rect")
 .data(data.monthlyVariance)
 .enter().append("rect")
 .attr("class", "cell")
 .attr("data-year", (d) => d.year)
 .attr("data-month", (d) => d.month - 1)
 .attr("data-temp", (d) => d.temperature)
 .attr("x", (d) => (d.year - year0) * barWidth)
 .attr("y", (d) => (d.month -1) * barHeight)
 .attr("width", barWidth)
 .attr("height", barHeight)
 .style("fill", (d) => color(d.temperature))
 .on('mouseover', function(e, d) { 
    d3
       .select('#tooltip')
       .transition()
       .duration(200)
       .style('opacity', 1)
       .style('left', (e.clientX + 20) + 'px')
       .style('top', (e.clientY - 10) + 'px')
       .attr("data-year", d.year)
       .text(`${d3.timeFormat("%Y")(d.year)} - ${d3.timeFormat("%B") (d.month)}\n ${(d.temperature).toFixed(2)}°C \n ${d.variance.toFixed(2)}°C`)
    })
 .on('mouseout', function() {
    d3.select('#tooltip').style('opacity', 0)
    });
 
svg.append("text")
 .attr("transform", "translate(100,0)")
 .attr("x", 50)
 .attr("y", -60)
 .style("color", " black")
 .attr("id", "title")
 .text("Monthly Global Land-Surface Temperature")
 svg.append("text")
        .attr("x", 80)
        .attr("y", -30)
        .attr("id", "description")
        .attr("text-anchor", "left")
        .style("font-size", "20px")
        .style("color", "black")
        .attr("transform", "translate(100,0)")
        .text("1753 - 2015: base temperature 8.66℃");


 

const legend = [0,2.8,3.9,5.1,6.1,7.2,8.3,9.5,10.6,11.7,12.8];
const x_axis = 520;
const y_axis = 0;
        
let rectWidth = 30;
        
let svgContainer = d3.select("body").append("svg")
                                      .attr("width", rectWidth*legend.length+x_axis)
                                      .attr("height", 200);
        
let rect = svgContainer.selectAll(".rect")
                       .data(legend)
                       .enter()
                       .append("rect");
let rectAttributes = rect
                    .attr("x", (d,i) => x_axis + (rectWidth*i))
                    .attr("y", (d, i) => y_axis)
                    .attr("width", rectWidth)
                    .attr("height", 20)
                    .style("fill", (d) => color(d));
svgContainer.selectAll('.text')
            .data(legend)
            .enter().append('text')
            .attr("id", "legend")
            .text((d) => d.toString())
            .attr("x", (d,i) => x_axis + (rectWidth*i))
            .attr("y", y_axis + 35);
        

})
