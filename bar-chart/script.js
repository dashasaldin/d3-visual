const dataset = "GDP-data.json";

d3.json(dataset).then((data) => {
d3.select("body")
  .append("div")
  .attr("id", "tooltip")
  .attr("style", "position: absolute; opacity: 0;");

   const svg = d3.select('svg'),
         margin = 200,
         width = svg.attr("width") - margin,
         height = svg.attr("height") - margin;
   
   const xScale = d3.scaleBand().range ([0, width]).padding(0.1),
         yScale = d3.scaleLinear().range ([height, 0]);

   const g = svg.append("g")
                .attr("transform", "translate(" + 100 + "," + 100 + ")");
   
   xScale.domain(data.data.map((d) => d[0]));
   yScale.domain([0, d3.max(data.data, (d) => d[1])]);
   let lastYear = null;
   const tickValuesForAxis = data.data.map((d) => {
      const year = parseInt(d[0].split('-')[0])
      if(year % 5 === 0 && year != lastYear) {
         lastYear = year;
         return d[0];
      }
   })
   g.append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr("id", "x-axis")
    .call(d3.axisBottom(xScale)
            .tickValues(tickValuesForAxis)
            .tickFormat((d) => {
               if(!d) {
                  return "";
               }
               const year = parseInt(d.split('-')[0])
               if(year % 5 === 0)
                  return year;
               return "";
            }))
   
   g.append("g")
    .attr("id", "y-axis")
    .call(d3.axisLeft(yScale));

   svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 130)
    .attr("x", -100)
    .style("text-anchor", "end")
    .text("Gross Domestic Product")
    
   
    g.selectAll(".bar")
      .data(data.data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("data-date", (d) => d[0])
      .attr("data-gdp", (d) => d[1])
      .attr("x", (d) => xScale(d[0]))
      .attr("y", (d) => yScale(d[1]))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => height - yScale(d[1]))
      .on('mouseover', function(e, d) {
         d3
            .select('#tooltip')
            .transition()
            .attr("data-date", d[0])
            .duration(200)
            .style('opacity', 1)
            .style('left', (e.clientX + 20) + 'px')
            .style('top', (e.clientY - 10) + 'px')
            .text(`${d[0]} \n ${"$" + d[1] +  " Billion"}`)
         })
      .on('mouseout', function() {
         d3.select('#tooltip').style('opacity', 0)
         });
      
   svg.append("text")
      .attr("transform", "translate(100,0)")
      .attr("x", 250)
      .attr("y", 100)
      .style("color", "black")
      .attr("id", "title")
      .text("Unites States GDP")
             
})



    