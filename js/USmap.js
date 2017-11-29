var svg = d3.select("svg");

var path = d3.geoPath();

d3.json("https://d3js.org/us-10m.v1.json", function(error, us) {
  if (error) throw error;

  
  svg.append("g")
    .attr("class", "states")
      .selectAll("path")
      .data(topojson.feature(us, us.objects.states).features)
      .enter().append("path")
      .attr("d", path);

    svg.append("path")
      .attr("class", "state-borders")
      .attr("d", path(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; })));

    svg.selectAll("path").attr('fill', '#eeeeee');
    
    d3.json('data/clint_family.json', function(error, data) {
    	var width = 960;
    	var height = 600;
    	console.log(data.length)
	    var projection = d3.geoAlbersUsa().scale(1270).translate([width/2, height/2]);

    	let circles = svg.selectAll('circle').data(data);
	    circles.exit().remove();
    	circles.enter().append('circle').merge(circles)
    	.attr('cy', d => projection([+d.longitude, +d.latitude])[1])
    	.attr('cx', d => projection([+d.longitude, +d.latitude])[0])
    	.attr('r', 5)
    	.attr('stroke', "black")
    	.attr('stroke-width', 1)
    	.attr('fill', 'red')
    	.attr('opacity', 0.5)
  	});
});