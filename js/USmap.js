class USmap{
  constructor(){
    this.svg = d3.select("svg").attr("id", "USsvg").attr('transform', 'translate(100,-10)');
    this.tree = null;
    this.width = 480
    this.height = 300
    this.tooltip = d3.select("body").append("div").attr('id', 'mapdiv')
      .style("position", "absolute")
      .style("z-index", "10")
      .style("width","60px")                  
      .style("height","60px")                 
      .style("padding","2px")             
      .style("font","12px sans-serif")
      .style("border","0px")      
      .style("border-radius","8px")  
      .style("background", "lightsteelblue")
      .style("visibility", "hidden");
  }

  add_tree(treeObj){
    this.tree = treeObj;
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
    var treeObj = this.tree
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

      svg.selectAll("path").attr('fill', '#f5f5f5');

      var treeJson = treeObj
      d3.json('data/clint_family.json', function(error, data) {
        
        var treeFam = treeJson
        function on_click(d, treeObj){
          circles = d3.select("#USsvg").selectAll('circle')
          circles.attr('fill', '#ffa5a5')
            .style('opacity', 0.5)
          circles.filter(function(dat) { return dat.id === d.id }).attr('fill', '#f5ebb2').style('opacity', 1);
          treeFam.circleOnClick(d.id, treeFam, true);
          let tooltip = d3.select('#mapdiv');
          tooltip.text(d.firstname + ' ' + d.lastname + ", " + d.city);
          tooltip.append('div')
              .attr('id', 'tipmap')
              .attr('class', 'map');
        let map2 = L.map('tipmap').setView([d.latitude, d.longitude], 7);
        L.tileLayer(
         'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map2);
          let m2 = new L.Marker([d.latitude, d.longitude]);
          map2.addLayer(m2);
        }
        let projection = d3.geoAlbersUsa().scale(643).translate([svg_width/2, svg_height/2]);

        let circles = svg.selectAll('circle').data(data);
        circles.exit().remove();
        circles.enter().append('circle').merge(circles)
          .attr('cy', d => (projection([+d.longitude, +d.latitude])[1]))
          .attr('cx', d => (projection([+d.longitude, +d.latitude])[0]))
          .attr('r', 0)
          .attr('stroke', "black")
          .attr('stroke-width', 1)
          .attr('fill', '#ffa5a5')
          .style('opacity', 0.5)
          .on('mouseover', function(d){
            let tooltip = d3.select('#mapdiv');
            tooltip.text(d.firstname + ' ' + d.lastname + ", " + d.city);
            tooltip.append('div')
                  .attr('id', 'tipmap')
                  .attr('class', 'map');
            let map2 = L.map('tipmap').setView([d.latitude, d.longitude], 7);
            L.tileLayer(
             'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map2);
              let m2 = new L.Marker([d.latitude, d.longitude]);
              map2.addLayer(m2);
              tooltip.style("visibility", "visible");
          })
          .on("mousemove", function(){return d3.select('#mapdiv').style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
          .on('mouseout', function(){return d3.select('#mapdiv').style("visibility", "hidden");})
          .on("click", function(d){on_click(d, treeFam)})
          .transition().duration(2000).attr('r', 8);
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
    var treeFam = this.tree
    function on_click(d, treeObj){
      circles = d3.select("#USsvg").selectAll('circle');
      circles.attr('fill', '#ffa5a5')
        .style('opacity', 0.5);
      circles.filter(function(dat) { return dat.id === d.id }).attr('fill', '#f5ebb2').style('opacity', 1);
      treeFam.circleOnClick(d.id, treeFam, true);
      let tooltip = d3.select('#mapdiv');
        tooltip.text(d.firstname + ' ' + d.lastname + ", " + d.city);
        tooltip.append('div')
          .attr('id', 'tipmap')
          .attr('class', 'map');
        let map2 = L.map('tipmap').setView([d.latitude, d.longitude], 7);
        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map2);
          let m2 = new L.Marker([d.latitude, d.longitude]);
          map2.addLayer(m2);
    }
    let projection = d3.geoAlbersUsa().scale(643).translate([this.width/2, this.height/2]);
    let circles = this.svg.selectAll('circle').data(new_data);
    circles.exit().remove();
    circles.enter().append('circle').merge(circles)
      .attr('cy', d => (projection([+d.longitude, +d.latitude])[1]))
      .attr('cx', d => (projection([+d.longitude, +d.latitude])[0]))
      .attr('r', 0)
      .attr('stroke', "black")
      .attr('stroke-width', 1)
      .attr('fill', '#ffa5a5')
      .style('opacity', 0.5)
      .on('mouseover', function(d){
        let tooltip = d3.select('#mapdiv');
        tooltip.text(d.firstname + ' ' + d.lastname + ", " + d.city);
        tooltip.append('div')
          .attr('id', 'tipmap')
          .attr('class', 'map');
        let map2 = L.map('tipmap').setView([d.latitude, d.longitude], 7);
        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map2);
          let m2 = new L.Marker([d.latitude, d.longitude]);
          map2.addLayer(m2);
          tooltip.style("visibility", "visible");
      })
      .on("mousemove", function(){return d3.select('#mapdiv').style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
      .on('mouseout', function(){return d3.select('#mapdiv').style("visibility", "hidden");})
      .on("click", function(d){on_click(d, treeFam)})
      .transition().duration(2000).attr('r', 8)
  }

  tree_clicked(id){
    function circle_color(d, selected) {
      if (d.id === selected){
        return '#f5ebb2'
      }
      return '#ffa5a5'
    }
    function circle_opacity(d, selected){
      if (d.id === selected){
        return 1
      }
      return 0.5
    }
    let circles = this.svg.selectAll('circle')
      .attr('fill', d => circle_color(d, id))
      .style('opacity', d => circle_opacity(d, id))
    circles.filter(function(d) { return d.id === id }).raise()
  }
}
