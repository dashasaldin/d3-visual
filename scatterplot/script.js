const dataset = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"

d3.json(dataset).then((data) => {
    d3.select("body")
    .append("div")
    .attr("id", "tooltip")
    .attr("style", "position: absolute; opacity: 0;");

    const margin = {
        top: 120,
        right: 20,
        bottom: 30,
        left: 140
    },
    width = 960 - margin.left - margin.right;
    height = 500 - margin.top - margin.bottom;

    data.forEach((d) => {
        parseDate = d3.timeParse("%Y");
        d.Year = parseDate(d.Year);
        parseTime = d3.timeParse("%M:%S");
        d.Time = parseTime(d.Time);
    })
    let groups = ["No doping allegations", "Riders with doping allegations"];
    let dataForLegend = groups.map((groupName) => ({
      name: groupName,
      values: data.map((d) => (
        {doping: d.Doping, value: +d[groupName]}
      ))
    }))

    let color = d3.scaleOrdinal()
          .domain(groups)
          .range(d3.schemeSet2);

const svg = d3.select("body").append('svg')
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const xScale = d3.scaleTime()
                 .domain(d3.extent(data, (d) => d.Year))
                 .range ([0, width]);

svg.append("g")
.attr("transform", "translate(0," + height + ")")
.attr("id", "x-axis")
.call(d3.axisBottom(xScale));


const yScale = d3.scaleTime()
                 .domain(d3.extent(data,(d) => d.Time))
                 .range ([0, height]);

svg.append("g")
.attr("id", "y-axis")
.call(d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S")))
.append("text")
.style("fill", "black")
.attr("class", "label")
.attr("transform", "rotate(-90)")
.attr("y", -50)
.attr("x", -100)
.style("text-anchor", "middle")
.text("Time in Minutes");


svg
 .selectAll("dot")
 .data(data)
 .enter().append("circle")
 .attr("class", (d) => `dot ${d.Doping  ? 'doping-dot' : 'nondoping-dot'}`)
 .attr("data-xvalue", (d) => d.Year)
 .attr("data-yvalue", (d) => d.Time)
 .attr("cx", (d) => xScale(d.Year))
 .attr("cy", (d) => yScale(d.Time))
 .attr("r", 5)
 .on('mouseover', function(e, d) {
    d3
       .select('#tooltip')
       .transition()
       .duration(200)
       .attr("data-year", d.Year)
       .style('opacity', 1)
       .style('left', (e.clientX + 20) + 'px')
       .style('top', (e.clientY - 10) + 'px')
       .text(`${d.Name} : ${d.Nationality} \n Year: ${d3.timeFormat("%Y")(d.Year)} Time: ${d3.timeFormat("%M:%S")(d.Time)} \n ${d.Doping}`)
    })
 .on('mouseout', function() {
    d3.select('#tooltip').style('opacity', 0)
    });
 
svg.append("text")
 .attr("transform", "translate(100,0)")
 .attr("x", 50)
 .attr("y", -30)
 .style("color", " black")
 .attr("id", "title")
 .text("Doping in Professional Bicycle Racing")


 

 let legend = svg.selectAll("#legend")
 .data(dataForLegend)
 .enter().append("g")
 .attr("id", "legend")
 .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

// draw legend colored rectangles
legend.append("rect")
 .attr("x", width - 18)
 .attr("width", 18)
 .attr("height", 18)
 .style("fill", function(d) { return color(d.name)});

// draw legend text
legend.append("text")
 .attr("x", width - 24)
 .attr("y", 9)
 .attr("dy", ".35em")
 .style("text-anchor", "end")
 .text(function(d) { return d.name;})

})