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

var yScale = d3.scaleLinear().range([0, height]);
var yAxis = d3.axisLeft(yScale).tickFormat(d3.format('d'));
var color = d3.scaleOrdinal(d3.schemeCategory10);
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
  let xScale = d3.scaleTime()
                 .domain(d3.extent(data, d => d.timestamp)) // extent returns [min, max] of the provided data
                 .range([0, width]);

  let xAxis = d3.axisBottom(xScale)
                .ticks(24)
                .tickFormat(d3.timeFormat("%m-%d %H-%M"));;


  // todo how to create the y axis dynamically

  yScale.domain([0, d3.max(series, s => d3.max(s.values, d => d.value))]) // This should cover all values in your data
  .range([height, 0]);

  svg
  .append('g')
  .attr('class', 'x axis')
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
  .attr('class', 'y axis')
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

  let line = d3.line()
    .x(d => xScale(d.date))
    .y(d => yScale(d.value));

  series.forEach(s => {
    svg.append('path')
      .datum(s.values)  // Assuming 'values' is the array of data points for this series
      .attr('fill', 'none')
      .attr('stroke', s.color)  // Assuming 'color' is a property of the series
      .attr('stroke-width', 1.5)
      .attr('d', line);
  });

  // add legend
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
  // .text(function (d) {
  //   if (d) {
  //     return 'Riders with doping allegations';
  //   } else {
  //     return 'No doping allegations';
  //   }
  // });


})
.catch((err) => console.log(err));

// TODO
// 1. read csv file to json? done
// 2. use csv data in d3