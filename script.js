var parentDiv = document.getElementById('graph-wrapper'),
  svg = d3.select('svg'),
  svgWidth = parentDiv.offsetWidth,
  svgHeight = parentDiv.offsetHeight,
  margin = { top: 20, right: 30, bottom: 30, left: 60 },
  innerWidth = svgWidth - margin.left - margin.right,
  innerHeight = svgHeight - margin.top - margin.bottom,
  colors = ['#D65076', '#45B8AC', '#EFC050', '#5B5EA6', '#9B2335'],
  aspect = svgWidth / svgHeight;

function renderData(data) {
  var xScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.amount)])
      .range([0, innerWidth]),
    yScale = d3
      .scaleBand()
      .domain(data.map((d) => d.item))
      .range([0, innerHeight])
      .padding(0.04);

  var g = svg
    .append('g')
    .attr('transform', `translate( ${margin.left}, ${margin.top} )`);

  // format x axis. Replace default G w/ B for billion
  var formattedVal = (number) => d3.format('.3s')(number).replace('G', 'B');

  var yAxis = d3.axisLeft(yScale);
  var xAxis = d3.axisBottom(xScale).tickFormat(formattedVal);
  yAxis(g.append('g'));
  xAxis(g.append('g').attr('transform', 'translate(0, ' + innerHeight + ')'));

  g.selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('transform', 'translate(4, 0)')
    .attr('y', (d) => yScale(d.item))
    .attr('fill', (d, i) => {
      return colors[i];
    })
    .attr('width', (d) => xScale(d.amount))
    .attr('height', yScale.bandwidth()); // computed width of a single bar
}

function resizeGraph() {
  var targetWidth = parentDiv.clientWidth;
  svg.attr('width', targetWidth);
  svg.attr('height', Math.round(targetWidth / aspect));
}

svg
  .attr('width', svgWidth)
  .attr('height', svgHeight)
  .attr('viewBox', '0 0 ' + svgWidth + ' ' + svgHeight)
  .attr('perserveAspectRatio', 'xMinYMid')
  .call(resizeGraph);

d3.json('/data.json').then(function (data) {
  renderData(data);
});

window.addEventListener('resize', resizeGraph);
