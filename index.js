// read csv file
let csvDataArray
function readSingleFile(file) {
  var f = file;
  // console.log(f)
  if (f) {
    var r = new FileReader();
    r.onloadstart = function(e) {
      document.getElementById('file-selector').innerHTML = "parsing file...";
    };
    r.onload = function(e) {
      const contents = e.target.result;
      const raw = r.result
      // console.log(raw)
      csvDataArray = csvToJson(raw)
      // console.log(csvDataArray)
    }
    r.readAsText(f);
  } else {
    alert("Failed to load file:")
  }
}

function csvToJson(str, delimiter = ",") {
  let dataArray = []
  const headers = str.slice(0, str.indexOf("\r\n")).split(delimiter);
  console.log(headers)
  const rows = str.slice(str.indexOf("\n") + 1).split("\r\n")
  // console.log(rows)
  const arr = rows.map(function (row) {
    // console.log(row)
    dataJson = {}
    const values = row.split(delimiter);
    values.map(function (v, i) {
      dataJson[headers[i]] = v
    })
    dataArray.push(dataJson)
  });
  // console.log(dataArray)
  // return JSON.stringify(dataArray);
}

function zoomed(event) {
  let transform = event.transform;

  // Update the scales
  let updatedXScale = transform.rescaleX(xScale);
  // If you want to allow zooming on y-axis as well
  // let updatedYScale = transform.rescaleY(yScale);

  // Update the axes
  svg.select('.x-axis').call(d3.axisBottom(updatedXScale));
  // If you want to allow zooming on y-axis as well
  // svg.select('.y-axis').call(d3.axisLeft(updatedYScale));

  // Update the lines
  // line.x(d => updatedXScale(d.date));
  // If you want to allow zooming on y-axis as well
  // line.y(d => updatedYScale(d.value));

  svg.selectAll('.line')
      .attr('d', d => line(d.values))
      .attr('d', line.x(d => updatedXScale(d.date)));
      // .attr('d', d => line(d.values));
}



d3.select('body')
  .append('h1')
  .text('Hello World')

var margin = {
  top: 100,
  right: 20,
  bottom: 30,
  left: 60 }

width = 1600 - margin.left - margin.right,
height = 630 - margin.top - margin.bottom;
let legendWidth = 360;
let legendSpacing = 4;
let legendRectSize = 10;
let scrollWidth = legendWidth - 10;
let scrollHeight = height;

let xScale = d3.scaleTime()
let xAxis = d3.axisBottom(xScale)
              .ticks(24)
              .tickFormat(d3.timeFormat("%m-%d %H-%M"));;

var yScale = d3.scaleLinear().range([0, height]);
var yAxis = d3.axisLeft(yScale).tickFormat(d3.format('d'));
var color = d3.scaleOrdinal(d3.schemeCategory10);

let line = d3.line()

// let parseTime = d3.timeParse("%Y-%m-%d-%h");
// Define the div for the tooltip
var div = d3.
select('body').
append('div').
attr('class', 'tooltip').
attr('id', 'tooltip').
style('opacity', 0);

// Define svg
var svg = d3.
select('body').
append('svg').
attr('width', width + margin.left + margin.right).
attr('height', height + margin.top + margin.bottom).
attr('class', 'graph').
append('g').
attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

svg.append('defs').append('clipPath')
    .attr('id', 'clip')
  .append('rect')
    .attr('width', width - legendWidth) // width of the chart area
    .attr('height', height); // height of the chart area

// if use json
// d3.json("data.json").
// then(data => {
//   data.forEach(function (d) {
//     date = d["Date/Time"].split(" ")[1]
//     time = d["Date/Time"].split(" ")[3]
//     // console.log(date)
//   })

// if use csv
d3.csv("eplusout copy.csv").
then(data => {
  console.log(data.columns)
  let columns = data.columns
  data = data.map((d) => {
    let datePart = d["Date/Time"].split(" ")[1].split("/");
    let timePart = d["Date/Time"].split(" ")[3];
    let dateTimeString = `2007-${datePart[0]}-${datePart[1]}T${timePart}`; // 2007 as placeholder
    return {
      ...d,
      "timestamp": new Date(dateTimeString)
    };
  })
  console.log(data)

  // Get the column names, excluding "Date/Time" and "timestamp"
  let columnNames = columns.filter(name => name !== "Date/Time" && name !== "timestamp");
  // Create a series for each column
  let series = columnNames.map((name, i) => {
    return {
      name: name,
      values: data.map(d => ({date: d.timestamp, value: +d[name]})),
      color: color(i)
    };
  });
  console.log(series)

  xScale.domain(d3.extent(data, d => d.timestamp)) // extent returns [min, max] of the provided data
        .range([0, width - legendWidth]);




  // todo how to create the y axis dynamically

  yScale.domain([0, d3.max(series, s => d3.max(s.values, d => d.value))]) // This should cover all values in your data
  .range([height, 0]);

  svg
  .append('g')
  .attr('class', 'x-axis')
  .attr('id', 'x-axis')
  .attr('transform', 'translate(0,' + height + ')')
  .call(xAxis)
  .append('text')
  .attr('class', 'x-axis-label')
  .attr('x', width)
  .attr('y', -6)
  .style('text-anchor', 'end')
  .text('Year');

  svg
  .append('g')
  .attr('class', 'y-axis')
  .attr('id', 'y-axis')
  .call(yAxis)
  .append('text')
  .attr('class', 'label')
  .attr('transform', 'rotate(-90)')
  .attr('y', 6)
  .attr('dy', '.71em')
  .style('text-anchor', 'end')
  .text('Best Time (minutes)');

  svg
  .append('text')
  .attr('transform', 'rotate(-90)')
  .attr('x', -300)
  .attr('y', -30)
  .style('font-size', 12)
  .text('OUTDOOR CO2 SCHEDULE:Schedule Value [](Hourly)');

  // title
  svg
  .append('text')
  .attr('id', 'title')
  .attr('x', width / 2)
  .attr('y', 0 - margin.top / 2)
  .attr('text-anchor', 'middle')
  .style('font-size', '30px')
  .text('Multiline Chart');

  // subtitle
  svg
  .append('text')
  .attr('x', width / 2)
  .attr('y', 0 - margin.top / 2 + 25)
  .attr('text-anchor', 'middle')
  .style('font-size', '20px')
  .text("Subtitle");

  // add lines
  line.x(d => xScale(d.date))
      .y(d => yScale(d.value));


  series.forEach(s => {
    svg.append('path')
      .datum(s.values)  // Assuming 'values' is the array of data points for this series
      .attr('fill', 'none')
      .attr('stroke', s.color)  // Assuming 'color' is a property of the series
      .attr('stroke-width', 1.5)
      .attr('clip-path', 'url(#clip)')
      .attr('d', line)
      .attr('class', 'line');
  });

  // Set up the zoom behavior
  let zoom = d3.zoom()
      .scaleExtent([1, Infinity])
      // .translateExtent([[0, 0], [width, height]])
      .translateExtent([[0, 0], [width, 0]]) // restrict vertical translation
      .extent([[0, 0], [width, height]])
      .on('zoom', zoomed);

  // Append a 'rect' to capture the zoom events
  svg.append('rect')
      .attr('width', width - legendWidth)
      .attr('height', height)
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .call(zoom);

  // add legend
  let foreignObject = svg.append("foreignObject")
    .attr("width", scrollWidth)
    .attr("height", scrollHeight)
    .attr('x', width - legendWidth * 0.9);

  // Create a div within the foreignObject
  let legendDiv = foreignObject.append("xhtml:div")
      .style("width", scrollWidth + "px")
      .style("height", scrollHeight + "px")
      .style("overflow", "scroll");

  // Select all the data items and bind the data
  let legend = legendDiv.selectAll('.legend')
      .data(series)
      .enter()
      .append('div')
      .attr('class', 'legend')
      .attr('transform', function(d, i) { 
          let height = legendRectSize + legendSpacing;
          // let offset =  height * series.length / 2;
          let offset = 0
          let horz = width - legendWidth * 0.9;
          let vert = i * height - offset;
          return 'translate(' + horz + ',' + vert + ')';
      });

  // Add the colored squares
  legend.append('svg')
      .attr('width', legendRectSize)
      .attr('height', legendRectSize)
      .append('rect')
      .attr('width', legendRectSize)
      .attr('height', legendRectSize)
      .style('fill', d => d.color)
      .style('stroke', d => d.color);

  // Add the text labels
  legend.append('text')
      .style('font-size', '10px')
      .style('padding-left', '4px')
      .text(d => d.name);

  // let legend = svg.selectAll('.legend')  // note that .legend is not a pre-existing class, but is created here
  //   .data(series)
  //   .enter()
  //   .append('g')
  //   .attr('class', 'legend')
  //   .attr('transform', function(d, i) { 
  //       let height = legendRectSize + legendSpacing;
  //       // let offset =  height * series.length / 2;
  //       let offset = 0
  //       let horz = width - legendWidth * 0.9;
  //       let vert = i * height - offset;
  //       return 'translate(' + horz + ',' + vert + ')';
  //   });

  // Add the colored squares
  // legend.append('rect')
  //       .attr('width', legendRectSize)
  //       .attr('height', legendRectSize)
  //       .style('fill', d => d.color)  // Assuming 'color' is a property of the series
  //       .style('stroke', d => d.color);

  // legend.append('text')
  //       .attr('x', legendRectSize + legendSpacing)
  //       .attr('y', legendRectSize - legendSpacing)
  //       .style('font-size', '10px')
  //       .text(d => d.name);  // Assuming 'name' is a property of the series
  // var legendContainer = svg.append('g').attr('id', 'legend');

  // var legend = legendContainer
  //   .selectAll('#legend')
  //   .data(color.domain())
  //   .enter()
  //   .append('g')
  //   .attr('class', 'legend-label')
  //   .attr('transform', function (d, i) {
  //     return 'translate(0,' + (height / 2 - i * 20) + ')';
  //   });

  // legend
  // .append('rect')
  // .attr('x', width - 18)
  // .attr('width', 18)
  // .attr('height', 18)
  // .style('fill', color);

  // legend
  // .append('text')
  // .attr('x', width - 24)
  // .attr('y', 9)
  // .attr('dy', '.35em')
  // .style('text-anchor', 'end')
  // .text((d) => d.name);



})
.catch((err) => console.log(err));

// TODO
// 1. read csv file to json? done
// 2. use csv data in d3