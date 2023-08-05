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

width = 920 - margin.left - margin.right,
height = 630 - margin.top - margin.bottom;

var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([0, height]);
var xAxis = d3.axisBottom(x).tickFormat(d3.format('d'));
var yAxis = d3.axisLeft(y).tickFormat(d3.format('d'));

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

d3.json("data.json").
then(data => {
  data.forEach(function (d) {
    date = d["Date/Time"].split(" ")[1]
    time = d["Date/Time"].split(" ")[3]
    console.log(date)

  })
  // data.forEach(function (d) {
  //   d.Place = +d.Place;
  //   var parsedTime = d.Time.split(':');
  //   d.Time = new Date(1970, 0, 1, 0, parsedTime[0], parsedTime[1]);
  // });
})
// TODO
// 1. read csv file to json? done
// 2. use csv data in d3