var svg = d3.select("svg");
var svg_width = 960/2;
var svg_height = 600/2;
// svg.append('rect').attr('x', 0).attr('y', 0).attr('width',svg_width).attr('height', svg_height).attr('fill', 'black');

function map_scale(scaleFactor, width, height ) {
  return d3.geoTransform({
    point: function(x, y) {
         // this.stream.point((x * scaleFactor)+(width/2), (y  * scaleFactor) +(height/2));
         this.stream.point((x * scaleFactor), (y  * scaleFactor));
    }
  });
 }
var path = d3.geoPath().projection(map_scale(0.5, svg_width, svg_height));

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
    	
    	
	    var projection = d3.geoAlbersUsa().scale(643).translate([svg_width/2, svg_height/2]);

    	let circles = svg.selectAll('circle').data(data);
	    circles.exit().remove();
    	circles.enter().append('circle').merge(circles)
    	.attr('cy', d => (projection([+d.longitude, +d.latitude])[1]))  //+(svg_height/2))
    	.attr('cx', d => (projection([+d.longitude, +d.latitude])[0])) //+(svg_width/2))
    	.attr('r', 5)
    	.attr('stroke', "black")
    	.attr('stroke-width', 1)
    	.attr('fill', 'red')
    	.attr('opacity', 0.5)
  	});
});