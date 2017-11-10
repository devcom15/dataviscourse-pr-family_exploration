var map = L.map('mainmap').setView([40.758701, -111.876183], 11);
mapLink = 
      '<a href="http://openstreetmap.org">OpenStreetMap</a>';
// L.tileLayer(
//       'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//       attribution: '&copy; ' + mapLink + ' Contributors',
//       maxZoom: 18,
//       }).addTo(map);
L.tileLayer(
      'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
var m = new L.Marker([40.758701, -111.876183]);
map.addLayer(m);
var tooltip = d3.select("body")
.append("div")
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
d3.select('#circ')
      .on('mouseover', function(d){
            tooltip.text('Salt Lake City');
            tooltip.append('div')
                  .attr('id', 'tipmap')
                  .attr('class', 'map');
            var map2 = L.map('tipmap').setView([40.758701, -111.876183], 11);
            map2Link = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
            L.tileLayer(
                  'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map2);
            let m2 = new L.Marker([40.758701, -111.876183]);
            map2.addLayer(m2);
            tooltip.style("visibility", "visible");
      })
      .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
      .on('mouseout', function(){return tooltip.style("visibility", "hidden");})
