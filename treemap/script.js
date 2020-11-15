const width = 960;
        height = 570;

let svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height)    
 
let tooltip = d3.select("body")
    .append("div")
    .attr("id", "tooltip")
    .attr("style", "position: absolute; opacity: 0;");


d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json", function(data) {

let root = d3.hierarchy(data).sum(function(d){ return d.value});

d3.treemap()
    .size([width, height])
    (root)

color = d3.scaleOrdinal()
    .domain(["Action", "Drama", "Adventure", "Family", "Animation", "Comedy", "Biography"])
    .range(d3.schemePastel2)

svg
    .selectAll("rect")
    .data(root.leaves())
    .enter()
    .append("rect")
      .attr("class", "tile")
      .attr("data-name", (d) => d.data.name)
      .attr("data-category", (d) => d.data.category)
      .attr("data-value", (d) => d.data.value)
      .attr('x', function (d) { return d.x0; })
      .attr('y', function (d) { return d.y0; })
      .attr('width', function (d) { return d.x1 - d.x0; })
      .attr('height', function (d) { return d.y1 - d.y0; })
      .style("stroke", "black")
      .style("fill", function(d){ return color(d.parent.data.name)} )
      .on('mouseover', function(d) {
      d3
            .select('#tooltip')
            .transition()
            .duration(200)
            .attr("data-value", d.data.value)
            .style('opacity', 1)
            .style('left', (d3.event.pageX + 20) + 'px')
            .style('top', (d3.event.pageY - 10) + 'px')
            .text(`Name: ${d.data.name}\n Category: ${d.data.category}\n Value: ${d.data.value}`)
            })
         .on('mouseout', function() {
            d3.select('#tooltip').style('opacity', 0)
            })
svg
        .selectAll("text")
        .data(root.leaves())
        .enter()
        .append("text")
        .attr("id", "text")
        .selectAll("tspan")
        .data(d => {
            return d.data.name.split(/(?=[A-Z][^A-Z])/g) 
                .map(v => {
                    return {
                        text: v,
                        x0: d.x0,                        
                        y0: d.y0                         
                    }
                });
        })
        .enter()
        .append("tspan")  
        .attr("x", (d) => d.x0 + 5)
        .attr("y", (d, i) => d.y0 + 10 + (i * 7))
        .text((d) => d.text)
        .style("color", "black")
        .style("font-size", "8px")

let Scale = d3.scaleOrdinal()
        .domain(["Action", "Drama", "Adventure", "Family", "Animation", "Comedy", "Biography"])
        .range(d3.schemePastel2)
let legend = d3.select("body");
      
legend.append("svg")
        .attr("class", "legendSequential")
        .attr("transform", "translate(20,20)")
        .attr("id", "legend")
      
let legendSequential = d3.legendColor()
          .shapeWidth(30)
          .cells(10)
          .scale(Scale) 
      
legend.select(".legendSequential")
        .call(legendSequential);
                
})