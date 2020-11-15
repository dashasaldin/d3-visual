
const width = 1000;
    height = 700;

let svg = d3.select("body")
    .append("svg")
    .attr('viewBox', `0 0 ${width} ${height}`) 
    .attr('preserveAspectRatio', 'xMidYMid meet') 
    .attr('transform', 'scale(1.05)')

    
let tooltip = d3.select("body")
    .append("div")
    .attr("id", "tooltip")
    .attr("style", "position: absolute; opacity: 0;");

d3.queue()
    .defer(d3.json, "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json")
    .defer(d3.json, "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json")
    .await(ready)

function ready (error, education, us) {
    if(error) throw error;
let minBachelors = d3.min(education, (d) => d.bachelorsOrHigher);
let maxBachelors = d3.max(education, (d) => d.bachelorsOrHigher);

const colorScale = d3
    .scaleQuantize()
    .domain([0,70])
    .range(d3.schemeOranges[8]);
let path = d3.geoPath();
let countyData = topojson.feature(us, us.objects.counties).features;
svg.append("g")
    .attr("class", "counties")
    .selectAll("path")
    .data(countyData)
    .enter()
    .append("path")
    .attr("class","county")
    .attr("data-fips", (d) => d.id)
    .attr("data-education", (d) => education.filter(obj => obj.fips == d.id)
                                        .map(obj => obj.bachelorsOrHigher))
    .attr("fill", (d) => colorScale(education.filter(obj => obj.fips == d.id)
                                        .map(obj => obj.bachelorsOrHigher)))
    .attr("d", path)
    .on('mouseover', function(d) {
        let data = education.find(obj => obj.fips == d.id);
        d3
            .select('#tooltip')
            .transition()
            .duration(200)
            .attr("data-education", data.bachelorsOrHigher)
            .style('opacity', 1)
            .style('left', (d3.event.pageX + 20) + 'px')
            .style('top', (d3.event.pageY - 10) + 'px')
            .text(`${data.area_name}, ${data.state}: ${data.bachelorsOrHigher}%`)
            })
         .on('mouseout', function() {
            d3.select('#tooltip').style('opacity', 0)
            })
svg.append("path")
    .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
    .attr("fill", "none")
    .attr("stroke", "white")
    .attr("d", path);

let formatNumber = d3.format(".0%");
let area = d3.scaleThreshold()
            .domain(d3.range(minBachelors, maxBachelors, (maxBachelors-minBachelors)/7))
            .range(colorScale.range());
const legendWidth = 210;
let x = d3.scaleLinear()
    .domain(colorScale.domain())
    .range([0, legendWidth]);
let xAxis = d3.axisBottom(x)
    .tickSize(18)
    .tickValues([0,10,20,30,40,50,60,70])
    .tickFormat( (t) => { return formatNumber(t*.01) });
let g = d3.select("g")
    .append("g")
    .attr("id", "legend")
    .call(xAxis)
    .attr("transform", "translate(625," + 60 + ")")
    g.select(".domain")
    .remove();
g.selectAll("rect")
  .data(area.range()
        .map(function(colorScale) {
            var d = area.invertExtent(colorScale);
              if (d[0] == null) d[0] = x.domain()[0];
              if (d[1] == null) d[1] = x.domain()[1];
              return d;
            }))
  .enter()
    .insert("rect")
      .attr("stroke", "black")
      .attr("height", 10)
      .attr("x", (d,i) => i*30)
      .attr("width", (width/28))
      .attr("fill", (d) => { return area(d[0]); })
}

