// 2. Use the margin convention practice 
var margin = {top: 50, right: 50, bottom: 50, left: 50}
  , width = window.innerWidth - margin.left - margin.right // Use the window's width 
  , height = window.innerHeight - margin.top - margin.bottom; // Use the window's height

var state = {
    x: 0,
    y: 0,
    scale: height / 2
};

var lineOpacity = "0.25";
var lineOpacityHover = "0.85";
var otherLinesOpacityHover = "0.1";
var lineStroke = "1.5px";
var lineStrokeHover = "2.5px";

// The number of datapoints

var dataset;

var projection = d3.geoMercator()
.scale(state.scale);
//.clipAngle(90)
//.translate([width , height]);

var path = d3.geoPath()
.projection(projection);

// 1. Add the SVG to the page and employ #2
var svg = d3.select("body").append("svg")
    .attr("width", width  )
    .attr("height", height );

var colorScale = d3.scaleOrdinal(d3.schemeDark2)
var g = svg.append("g");
var lines = svg.append("lines");

var circles;

// REQUEST DATA
d3.json('ne_10m_airports.json')
 .then(function(json) {
   circles = g.selectAll(".circle")
	.data(json.features)
    .enter()
    .append("circle")
    .attr("class", "circle")
    .attr("cx", function(d){ return projection(d.geometry.coordinates)[0]})
    .attr("cy", function(d){ return projection(d.geometry.coordinates)[1]})
    .attr('r',2)
    .attr("opacity", 1)
    .attr("fill", "blue");
});

// 8. An array of objects of length N. Each object has key -> value pair, the key being "y" and the value is a random number
d3.json("data_file2.json")
.then(function (json) {
  dataset = json;

  var alpha = svg.selectAll(".line")
	.data(dataset.features)
    .enter()
    .append("path")
    .attr("class", "line")
    .attr("d", path)
    .attr("fill", "none")
    .attr("stroke-width", lineStroke)
    .attr("opacity", lineOpacity)
    .attr("stroke", function(d,i) {return(colorScale(i))})
    .on("mouseover", function(d) {
        d3.selectAll('.line')
                      .style('opacity', otherLinesOpacityHover);
        d3.select(this)
          .style('opacity', lineOpacityHover)
          .style("stroke-width", lineStrokeHover)
          .style("cursor", "pointer");
      })
    .on("mouseout", function(d) {
        d3.selectAll(".line")
                      .style('opacity', lineOpacity);
        d3.select(this)
          .style("stroke-width", lineStroke)
          .style("cursor", "none");
      });

//   var Viz_center_x_min = d3.min(dataset, function(d) { 
//       return d3.min(d.value, function(d) {return parseFloat(d.lon)})
//   }),
//    Viz_center_x_max = d3.max(dataset, function(d) { 
//     return d3.max(d.value, function(d) {return parseFloat(d.lon)})
// }),
//    Viz_center_y_min =d3.min(dataset, function(d) { 
//     return d3.min(d.value, function(d) {return parseFloat(d.lat)})
// }),
//    Viz_center_y_max = d3.max(dataset, function(d) { 
//     return d3.max(d.value, function(d) {return parseFloat(d.lat)})
// }),
//    Viz_center_y_mid = (Viz_center_y_min + Viz_center_y_max)/2,
//    Viz_center_x_mid = (Viz_center_x_min + Viz_center_x_max)/2,
//    Viz_rad = d3.max([(Viz_center_y_max - Viz_center_y_min), (Viz_center_x_max - Viz_center_x_min)]);
//   // 7. d3's line generator
//   var line = d3.line()
//       .defined(d => !isNaN(d.lon))
//       .x(function(d) { return projection([d.lon, d.lat])[0]; }) // set the x values for the line generator
//       .y(function(d) { return projection([d.lon, d.lat])[1]; }) // set the y values for the line generator 
//       .curve(d3.curveCardinalOpen); // apply smoothing to the line
//       console.log("fairly abz");

//   // 9. Append the path, bind the data, and call the line generator 
//   var alpha = svg.selectAll(".line")
//     .data(dataset) // 10. Binds data to the line 
//     .enter()
//     .append("path")
//     .attr("class", "line") // Assign a class for styling 
//   //s  .attr("opacity",0)

  
    console.log("fairly local");

  function Viz_Center() {
        d3.transition()
        .delay(450)
        .duration(1750)
        .tween("rotate", function() {
          var point = [-90, 0],
              rotate = d3.interpolate(projection.rotate(), [-point[0], -point[1]]),
              rescale = d3.interpolate(projection.scale(), (90/100)*height/2);
          return function(t) {
            projection.rotate(rotate(t));
            projection.scale(rescale(t));
            svg.selectAll("path").attr("d", path);

            alpha
            .attr("d", path);;
            circles
            .attr("cx", function(d){ return projection(d.geometry.coordinates)[0]})
            .attr("cy", function(d){ return projection(d.geometry.coordinates)[1]});
        };
    })
    }
  
    Viz_Center();
    //Viz_Animate();
    g.on("wheel.zoom",function(){
        var currScale = projection.scale();
        var newScale = currScale - 0.8*d3.event.deltaY;
        //var currTranslate = projection.translate();
        //var coords = projection.invert([d3.event.offsetX, d3.event.offsetY]);
        projection.scale(newScale);
        //var newPos = projection(coords);
        //projection.translate([currTranslate[0] + (d3.event.offsetX - newPos[0]), currTranslate[1] + (d3.event.offsetY - newPos[1])]);
        g.selectAll("path").attr("d", path);

        alpha
        .attr("d", path);;
        circles
        .attr("cx", function(d){ return projection(d.geometry.coordinates)[0]})
        .attr("cy", function(d){ return projection(d.geometry.coordinates)[1]});
    })
    
    .call(d3.drag().on("drag", function(){
        var currTranslate = projection.rotate();
        projection.rotate([currTranslate[0] + 50/projection.scale()*d3.event.dx,
                              currTranslate[1] - 50/projection.scale()*d3.event.dy,
                              currTranslate[2]
                            ]);
        g.selectAll("path").attr("d", path);

        alpha
        .attr("d", path);;
        circles
        .attr("cx", function(d){ return projection(d.geometry.coordinates)[0]})
        .attr("cy", function(d){ return projection(d.geometry.coordinates)[1]});
    }));
});


var rect = g.append("rect")
.attr("height", height)
.attr("width", width)
.attr("x", margin.left/2)
.attr("y", margin.top/2)
.attr("fill", "white")
.attr("opacity", 1);

// REQUEST DATA
d3.json('ne_10m_admin_0_countries.json')
 .then(function(json) {
  geojson = json;
  g.selectAll("path")
	.data(geojson.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("opacity", 0.3)
    .attr("fill", "orange")
    .attr("stroke", "white")
});
svg.call(d3.zoom());