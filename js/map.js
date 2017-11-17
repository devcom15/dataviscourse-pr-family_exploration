// var latlong = null
// d3.csv("worldcitiespop.csv")
//   .row(function(d) { return {key: d.City, value: [d.Region, d.Latitude, d.Longitude]}; })
//   .get(function(error, rows) {
//     latlong = rows;// Now you can assign it
//     });
let map = L.map('mainmap').setView([41.89193, 12.51133], 7);
mapLink = '<a href="https://openstreetmap.org">OpenStreetMap</a>';
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
var m = new L.Marker([41.89193, 12.51133]);
map.addLayer(m);

d3.json('data/clint_family.json', function(error, data) {
  console.log(data);

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
  let circles = d3.select('#barChart').selectAll('circle').data(data);
  circles.exit().remove();
  circles.enter().append('circle').merge(circles)
        .attr('cy', 40)
        .attr('cx', function(d,i){return i*40 + 40})
        .attr('r', 10)
        .attr('stroke', "black")
        .attr('stroke-width', 3)
        .attr('fill', 'red')
        .on('mouseover', function(d){
              tooltip.text(d.firstname + ' ' + d.lastname + ", " + d.city);
              tooltip.append('div')
                    .attr('id', 'tipmap')
                    .attr('class', 'map');
              let map2 = L.map('tipmap').setView([d.latitude, d.longitude], 7);
              map2Link = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
              L.tileLayer(
                    'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map2);
              let m2 = new L.Marker([d.latitude, d.longitude]);
              map2.addLayer(m2);
              tooltip.style("visibility", "visible");
        })
        .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
        .on('mouseout', function(){return tooltip.style("visibility", "hidden");})
        //.on('click', function(){console.log(latlong);})
});
