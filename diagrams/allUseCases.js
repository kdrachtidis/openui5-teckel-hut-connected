window.addEventListener("resize", createUseCaseChart);

setTimeout(function(){ createUseCaseChart(); }, 100);
//var session = document.currentScript.getAttribute('session');

var currentSessionOverview = "Session-1";

setInterval(function(){ checkForUpdatesOverview();}, 500);

function checkForUpdatesOverview(){
    if (window.session != currentSessionOverview){
        currentSessionOverview = window.session;
        createUseCaseChart();
    }
}

function createUseCaseChart(){
    document.getElementById('allUseCases').innerHTML = '';

    var parentWidth = document.getElementById('allUseCases').offsetWidth;
    if(parentWidth == 0 || parentWidth == null){
        parentWidth = 600;
    }
    
    var margin = {top: 40, right: 20, bottom: 70, left: 40},
        width = parentWidth - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    var x = d3.scale.ordinal().rangeRoundBands([0, width], .1);

    var y = d3.scale.linear().range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var svg = d3.select("#allUseCases").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", 
            "translate(" + margin.left + "," + margin.top + ")");

    //d3.json("./model/" + session + "-overview.json", function(error, data) {
    d3.json("./model/" + currentSessionOverview + "-overview.json", function(error, data) {

        data.forEach(function(d) {
            d.date = d.useCase;
            d.duration = +d.duration;
        });
        
    x.domain(data.map(function(d) { return d.useCase; }));
    y.domain([0, d3.max(data, function(d) { return d.duration; })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "center");

    svg.append("text")
        .attr("transform", "translate(" + 0 + " ," + -10 + ")")
        .style("text-anchor", "middle")
        .style("font-size", "14px")
        .text("Seconds");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end");

    svg.selectAll("bar")
        .data(data)
        .enter().append("rect")
        .style("fill", "#5cbae6")
        .attr("x", function(d) { return x(d.useCase); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return height; })
        .attr("height", 0)      
        .transition()
        .duration(800)
        .attr("y", function(d) { return y(d.duration); })
        .attr("height", function(d) { return height - y(d.duration); 
    });

    // Place Y axis labels in g element for easy maneuvering 
    var label_group = svg.append("g").attr("class", "labelContainer").attr("transform", "translate(0,15)");

    // Draw the labels.
    label_group.selectAll("text").data(data).enter().append("text")
        .attr("x", function(d) { return x(d.useCase) + (x.rangeBand()/2); })
        .attr("y", function(d) { return  (y(d.duration) ); })
        .attr("text-anchor","middle")
        .attr("fill","white")
        .style("font-size", "14px")
        .attr("class", "label")
        .text(function(d) { return d.duration;});
    });

}