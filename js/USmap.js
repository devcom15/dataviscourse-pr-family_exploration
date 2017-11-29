class USmap{
  constructor(){
    this.svg = d3.select("svg").attr('transform', 'translate(80,0)');
    this.width = 480
    this.height = 300
    this.draw_map()
  }


  draw_map(){
    function map_scale(scaleFactor, width, height ) {
      return d3.geoTransform({
        point: function(x, y) {
          this.stream.point((x * scaleFactor), (y  * scaleFactor));
        }
      })
    }
    let path = d3.geoPath().projection(map_scale(0.5, this.width, this.height));
    let svg = this.svg
    let svg_width = this.width
    let svg_height = this.height
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
      
        let projection = d3.geoAlbersUsa().scale(643).translate([svg_width/2, svg_height/2]);

        let circles = svg.selectAll('circle').data(data);
        circles.exit().remove();
        circles.enter().append('circle').merge(circles)
          .attr('cy', d => (projection([+d.longitude, +d.latitude])[1]))  //+(svg_height/2))
          .attr('cx', d => (projection([+d.longitude, +d.latitude])[0])) //+(svg_width/2))
          .attr('r', 7)
          .attr('stroke', "black")
          .attr('stroke-width', 1)
          .attr('fill', 'red')
          .attr('opacity', 0.5)
      });
    });
  }

  update(data){
    let new_data= []
    for (let i=0; i < data.length; i++){
      for (let j=0; j < data[i].length; j++){
        new_data.push(data[i][j])
      }
    }
    console.log('Update chiamato!')
    console.log(new_data)
    let projection = d3.geoAlbersUsa().scale(643).translate([this.width/2, this.height/2]);
    let circles = this.svg.selectAll('circle').data(new_data);
    circles.exit().remove();
    circles.enter().append('circle').merge(circles)
      .attr('cy', d => (projection([+d.longitude, +d.latitude])[1]))  //+(svg_height/2))
      .attr('cx', d => (projection([+d.longitude, +d.latitude])[0])) //+(svg_width/2))
      .attr('r', 7)
      .attr('stroke', "black")
      .attr('stroke-width', 1)
      .attr('fill', 'red')
      .attr('opacity', 0.5)
  }
}
// var svg = d3.select("svg").attr('transform', 'translate(80,0)');
// var svg_width = 960/2;
// var svg_height = 600/2;

// function map_scale(scaleFactor, width, height ) {
//   return d3.geoTransform({
//     point: function(x, y) {
//          this.stream.point((x * scaleFactor), (y  * scaleFactor));
//     }
//   });
//  }
// var path = d3.geoPath().projection(map_scale(0.5, svg_width, svg_height));

// d3.json("https://d3js.org/us-10m.v1.json", function(error, us) {
//   if (error) throw error;

  
//   svg.append("g")
//     .attr("class", "states")
//       .selectAll("path")
//       .data(topojson.feature(us, us.objects.states).features)
//       .enter().append("path")
//       .attr("d", path);

//     svg.append("path")
//       .attr("class", "state-borders")
//       .attr("d", path(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; })));

//     svg.selectAll("path").attr('fill', '#eeeeee');
    
//     d3.json('data/clint_family.json', function(error, data) {
    	
    	
// 	    var projection = d3.geoAlbersUsa().scale(643).translate([svg_width/2, svg_height/2]);

//     	let circles = svg.selectAll('circle').data(data);
// 	    circles.exit().remove();
//     	circles.enter().append('circle').merge(circles)
//     	.attr('cy', d => (projection([+d.longitude, +d.latitude])[1]))
//     	.attr('cx', d => (projection([+d.longitude, +d.latitude])[0]))
//     	.attr('r', 5)
//     	.attr('stroke', "black")
//     	.attr('stroke-width', 1)
//     	.attr('fill', 'red')
//     	.attr('opacity', 0.5)
//   	});
// });