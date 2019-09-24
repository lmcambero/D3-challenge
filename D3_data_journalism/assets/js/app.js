// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20 ,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("data/data.csv", function (err, povertyData) {
  if (err) throw err;
   povertyData.forEach(function (data) {
    data.poverty = +data.poverty;
    data.healthcare = parseInt(data.healthcare);
  });

  var xLinearScale = d3.scaleLinear()
    .domain([2, d3.max(povertyData, d => d.poverty)])
    .range([2, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([20, d3.max(povertyData, d => d.healthcare)])
    .range([height, 20]);

  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  chartGroup.append("g")
    .attr("transform", `translate(6, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

  var circlesGroup = chartGroup.selectAll("circle")
  .data(povertyData)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d.poverty))
  .attr("cy", d => yLinearScale(d.healthcare))
  .attr("r", "15")
  .attr("fill", "blue")
  .attr("opacity", ".5")

  var textGroup = chartGroup.selectAll("#circleText")
  .data(povertyData)
  .enter()
  .append("text")
  .text(d => d.stateAbbr)
  .attr("id", "circleText")
  .attr("x", d => xLinearScale(d.poverty)-5)
  .attr("y", d => yLinearScale(d.healthcare)+4)
  .attr("stroke-width", "1")
  .attr("fill", "white")
  .attr("font-size", 8);
  
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([90, -60])
    .html(d =>
      `${d.state}<br>Poverty: ${d.poverty}<br>Healthcare: ${d.healthcare}`
    );

  chartGroup.call(toolTip);

  circlesGroup.on("mouseover", function (data) {
      toolTip.show(data);
    })

    .on("mouseout", function (data, index) {
      toolTip.hide(data);
    });

  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Lacks Healthcare (%)");

  chartGroup.append("text")
    .attr("transform", `translate(${width/2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("In Poverty (%)");
});