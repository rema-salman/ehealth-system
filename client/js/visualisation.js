// TO DO: creating annotations and adding them to graphs
// //////////////////////////

/**
 * Renders the visualisations
 * @param {String} id - A DataURL based id of a specific data
 * @param {Array} data - The array of objects bassed on cell header names
 */
const visualiseData = (id, data) => {
  if ('correct' in data[0]) {
    barChart(id, data); // 5 columns
  } else {
    scarletData(id, data); // 3 columns
  }
};

/**
 * Renders the visualisations of 3 columns data X,Y, and time
 * @param {String} id - A DataURL based id of a specific data
 * @param {Array} data - The array of objects bassed on cell header names
 */
const scarletData = (id, data) => {
  const timeArr = [];
  const timeDifArr = [];
  //create an array of time in data
  data.forEach(element => {
    timeArr.push(element.time);
  });
  // creating array for time difference between clicks
  for (let i = 0; i < timeArr.length; i++) {
    if (i != 0 && timeArr[i] != 0) {
      timeDifArr.push(timeArr[i] - timeArr[i - 1]);
    } else if (i > 0 && timeArr[i] == 0) {
      break;
    } else {
      timeDifArr.push(0);
    }
  }
  // gets maxValues of the time  and time difference array (between clicks)
  const maxValueTime = Math.max(...timeArr);
  const maxValueDif = Math.max(...timeDifArr);
  console.log(maxValueDif);
  // set the dimensions and margins of the graph
  var margin = { top: 10, right: 30, bottom: 30, left: 60 },
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  // append the svg object to the body(id) of the page
  var svg = d3
    .select(id)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // Add X axis
  var x = d3
    .scaleLinear()
    .domain([0, maxValueTime / 100])
    .range([0, width]);
  svg
    .append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3
    .scaleLinear()
    .domain([0, maxValueDif / 4])
    .range([height, 0]);
  svg.append('g').call(d3.axisLeft(y));

  // text label for the x axis
  svg
    .append('text')
    .attr(
      'transform',
      'translate(' + width / 2 + ' ,' + (height + margin.top + 20) + ')',
    )
    .style('text-anchor', 'middle')
    .text('Duration in minutes');

  // text label for the y axis
  svg
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 0 - margin.left)
    .attr('x', 0 - height / 2)
    .attr('dy', '1em')
    .style('text-anchor', 'middle')
    .text('Pixels');

  drawPoints(svg, x, y, data, '#000000');
};

/**
 * Draws points of the scatterplots
 * @param {svg} svg - svg object appended to the page
 * @param {Object} x - X axis scale
 * @param {Object} y - y axis scale
 * @param {Array} data - The array of objects bassed on cell header names
 * @param {String} color - Hex code of the color
 */

const drawPoints = (svg, x, y, data, color) => {
  svg
    .append('g')
    .selectAll('dot')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', function(d) {
      return x(d.X);
    })
    .attr('cy', function(d) {
      return y(d.Y);
    })
    .attr('r', 1.5)
    .style('fill', color);
};

/**
 * Renders the visualisations of 5 columns data X,Y, time,
 * button, and correct, after creating a new array that
 * maps different buttons and correct columns.
 * @param {String} id - A DataURL based id of a specific data
 * @param {Array} data - The array of objects bassed on cell header names
 */
const barChart = (id, data) => {
  scarletData(id, data);
  const correct0 = data.filter(d => d.button == '0' && d.correct == '1');
  const correct1 = data.filter(d => d.button == '1' && d.correct == '1');
  const correct2 = data.filter(d => d.button == '2' && d.correct == '1');

  const wrong0 = data.filter(d => d.button == '0' && d.correct == '0');
  const wrong1 = data.filter(d => d.button == '1' && d.correct == '0');
  const wrong2 = data.filter(d => d.button == '2' && d.correct == '0');

  data = [
    {
      label: 'Button 0 Correct',
      count: correct0.length,
    },
    {
      label: 'Button 0 Wrong',
      count: wrong0.length,
    },
    {
      label: 'Button 1 Correct',
      count: correct1.length,
    },
    {
      label: 'Button 1 Wrong',
      count: wrong1.length,
    },
    {
      label: 'Button 2 Correct',
      count: correct2.length,
    },
    {
      label: 'Button 2 Wrong',
      count: wrong2.length,
    },
  ];

  // set the dimensions and margins of the graph
  var margin = { top: 30, right: 30, bottom: 70, left: 60 },
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3
    .select(id)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // X axis
  var x = d3
    .scaleBand()
    .range([0, width])
    .domain(
      data.map(function(d) {
        return d.label;
      }),
    )
    .padding(0.2);
  svg
    .append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(x))
    .selectAll('text')
    .attr('transform', 'translate(-10,0)rotate(-45)')
    .style('text-anchor', 'end');

  var yVals = data.map(e => e.count);
  // Add Y axis
  var y = d3
    .scaleLinear()
    .domain([0, Math.max(...yVals)])
    .range([height, 0]);
  svg.append('g').call(d3.axisLeft(y));

  // text label for the y axis
  svg
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 0 - margin.left)
    .attr('x', 0 - height / 2)
    .attr('dy', '1em')
    .style('text-anchor', 'middle')
    .text('number of attempts');

  // drawing Bars
  drawBar(
    svg,
    x,
    y,
    height,
    data.filter(x => x.label.includes('Correct')),
    '#0000ff',
  );
  drawBar(
    svg,
    x,
    y,
    height,
    data.filter(x => x.label.includes('Wrong')),
    '#ff0000',
  );
};

/**
 * Draws the bars with colors
 * @param {svg} svg - svg object appended to the page
 * @param {Object} x - X axis scale
 * @param {Object} y - y axis scale
 * @param {Number} height - y axis scale
 * @param {Array} data - The array of objects bassed on cell header names
 * @param {String} color - Hex code of the color
 */
const drawBar = (svg, x, y, height, data, color) => {
  svg
    .selectAll('mybar')
    .data(data)
    .enter()
    .append('rect')
    .attr('x', function(d) {
      return x(d.label);
    })
    .attr('y', function(d) {
      return y(d.count);
    })
    .attr('width', x.bandwidth())
    .attr('height', function(d) {
      return height - y(d.count);
    })
    .attr('fill', color);
};
