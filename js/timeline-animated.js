var margin = {top: 20, right: 10, bottom: 20, left: 10};
    
var width = (window.innerWidth / 1.25) - margin.left - margin.right,
    height = (window.innerHeight / 1.25) - margin.top - margin.bottom;

var svg = d3.select("#viz2").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var g = svg.append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var innerRadius = 120, // magic number
    outerRadius = Math.min(width, height) / 2 - 6;

var fullCircle = 2 * Math.PI;

var x = d3.scaleTime().range([0, fullCircle]);

var y = d3.scaleRadial().range([innerRadius, outerRadius]);

var line = d3.lineRadial()
    .curve(d3.curveBasis)
    .angle(function(d) { return x(d.index); })
    .radius(function(d) { return y(d.value); });

times = [];

d3.csv("data/timeData_highschool.csv" ,function(d) {
    d.index = +d.index;
    d.value = +d.value;
    times.push(d.time);
    return d;
}, function(error, data) {
    if (error) throw error;
    
    x.domain(d3.extent(data, function(d) { return d.index; }));
    y.domain(d3.extent(data, function(d) { return d.value; }));
    
    linePlot = g.append("path")
        .datum(data)
        .attr("id", "highschoolLine")
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("d", line);
    
    var yAxis = g.append("g")
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
    
    var xAxis = g.append("g");

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

    g.append("g")
        .attr("class", "title")
        .append("text")
        .attr("dy", "-0.2em")
        .attr("text-anchor", "middle")
        .text("Highschool")
        .attr("id", "hsLabel");
    
    g.append("text")
        .attr("dy", "1em")
        .attr("text-anchor", "middle")
        .text("College")
        .attr("id", "collegeLabel");

    var lineLength = linePlot.node().getTotalLength();
    
    });

college = 0;

function update(){
    
    if (college == 0){

        college = 1;
        d3.select("#collegeLabel").attr("font-weight","bold");
        d3.select("#collegeLabel").attr("fill","red");
        d3.select("#collegeLabel").attr("opacity", 1);

        d3.select("#hsLabel").attr("font-weight","normal");
        d3.select("#hsLabel").attr("fill","gray");
        d3.select("#hsLabel").attr("opacity", 0.5);

        d3.csv("data/timeData_college.csv" ,function(d) {
            d.index = +d.index;
            d.value = +d.value;
            times.push(d.time);
            return d;
        }, function(error, data) {
            if (error) throw error;
            
            // Make the changes
            svg.select("#highschoolLine")   // change the line
                .transition()
                .duration(750)
                .attr("d", line(data))
                .attr("stroke", "red");

        });
    }
    else{

        college = 0;
        d3.select("#collegeLabel").attr("font-weight","normal");
        d3.select("#collegeLabel").attr("fill","gray");
        d3.select("#collegeLabel").attr("opacity", 0.5);

        d3.select("#hsLabel").attr("font-weight","bold");
        d3.select("#hsLabel").attr("fill","blue");
        d3.select("#hsLabel").attr("opacity", 1);
        
        d3.csv("data/timeData_highschool.csv" ,function(d) {
            d.index = +d.index;
            d.value = +d.value;
            times.push(d.time);
            return d;
        }, function(error, data) {
            if (error) throw error;
            
            // Make the changes
            svg.select("#highschoolLine")   // change the line
                .transition()
                .duration(750)
                .attr("d", line(data))
                .attr("stroke", "blue");;

        });
    }
}

function go(){
    update();
    timer = setTimeout(arguments.callee, 2500);
};
function pause(){
    clearTimeout(timer);
}
go();