var margin = {top: 20, right: 10, bottom: 20, left: 10};
    
var width = (window.innerWidth / 1.25) - margin.left - margin.right,
    height = (window.innerHeight / 1.25) - margin.top - margin.bottom;

var svg1 = d3.select("#viz1").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var g1 = svg1.append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var innerRadius = 100, // magic number
    outerRadius = Math.min(width, height) / 2 - 6;

var fullCircle = 2 * Math.PI;

var x = d3.scaleTime().range([0, fullCircle]);

var y = d3.scaleRadial().range([innerRadius, outerRadius]);

var line = d3.lineRadial()
    .curve(d3.curveBasis)
    .angle(function(d) { return x(d.index); })
    .radius(function(d) { return y(d.value); });

times = [];

d3.csv("data/timeData.csv" ,function(d) {
    d.index = +d.index;
    d.value = +d.value;
    times.push(d.time);
    return d;
}, function(error, data) {
    if (error) throw error;
    
    x.domain(d3.extent(data, function(d) { return d.index; }));
    y.domain(d3.extent(data, function(d) { return d.value; }));
    
    var linePlot = g1.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("d", line);
    
    var yAxis = g1.append("g")
        .attr("text-anchor", "middle");

    var yTick = yAxis
        .selectAll("g")
        .data(y.ticks(3))
        .enter().append("g");
    
    yTick.append("circle")
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("opacity", 0.2)
        .attr("r", y);
    
    yAxis.append("circle")
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("opacity", 0.2)
        .attr("r", function() { return y(y.domain()[0])});
    
    var labels = yTick.append("text")
        .attr("y", function(d) { return -y(d); })
        .attr("dy", "0.35em")
        .attr("fill", "none")
        .attr("stroke", "#fff")
        .attr("stroke-width", 5)
        .attr("stroke-linejoin", "round")
        .text(function(d) { return d; });

    yTick.append("text")
        .attr("y", function(d) { return -y(d); })
        .attr("dy", "0.35em")
        .text(function(d) { return d; });
    
    var xAxis = g1.append("g");

    var xTick = xAxis
        .selectAll("g")
        .data(x.ticks(1440))
        .enter().append("g")
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
            return "rotate(" + ((x(d)) * 180 / Math.PI - 90) + ")translate(" + innerRadius + ",0)";
        });
    
    xTick.append("line")
        .attr("x2", 0)
        .attr("stroke", "#000");

    xTick.append("text")
        .attr("transform", function(d) { 
        var angle = x(d);
        return ((angle < Math.PI / 2) || (angle > (Math.PI * 3 / 2))) ? "rotate(90)translate(0,22)" : "rotate(-90)translate(0, -15)"; })
        .text(function(d, i) { 
            if (i==0){
                return "12:00 AM";
            }
            else if (i==360){
                return "6:00 AM";
            }
            else if (i==720){
                return "12:00 PM";
            }
            else if (i==1080){
                return "6:00 PM";
            }
            else{
                return "";
            }
        })
        .style("font-size", 14);
            
    var title = g1.append("g")
        .attr("class", "title")
        .append("text")
        .attr("dy", "-0.2em")
        .attr("text-anchor", "middle")
        .text("Time Of Messages")
    
    var subtitle = g1.append("text")
        .attr("dy", "1em")
        .attr("text-anchor", "middle")
        .attr("opacity", 0.6)
        .text("2011-2020");  
        
    var lineLength = linePlot.node().getTotalLength();
    
    linePlot
        .attr("stroke-dasharray", lineLength + " " + lineLength)
        .attr("stroke-dashoffset", -lineLength)
        .transition()
        .duration(5000)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);
    });


var footnote1 = document.getElementById("footnote1");
footnote1.onclick = function() {
    currentStyle = document.getElementById("footnote1Text").style.display;
    document.getElementById("footnote1Text").style.display = (currentStyle === 'block') ? 'none' : 'block';

    currentText = footnote1.innerHTML;
    footnote1.innerHTML = (currentText === 'x') ? '1' : 'x';
};
document.getElementById("footnote1Text").onclick = function() {
    this.style.display = 'none';
    document.getElementById("footnote1").innerHTML = "1";
};