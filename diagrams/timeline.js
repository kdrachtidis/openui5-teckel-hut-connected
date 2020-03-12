function createTimeline(){
    document.getElementById('timeline').innerHTML = '';
    var parentWidth = document.getElementById('timeline').offsetWidth;
    if(parentWidth == 0 || parentWidth == null){
        parentWidth = 600;
    }
    
    // Get the data
    if(window.currentStory == undefined){
    	return;
    }
    var data = d3.csv.parse(window.timeline);

    // set the dimensions and margins of the graph
    var margin = {top: 40, right: 70, bottom: 30, left: 20},
        width = parentWidth - margin.left - margin.right,
        height = 220 - margin.top - margin.bottom;

    // set the ranges
    var x = d3.scale.ordinal().rangeRoundBands([0, width], 1);
    var y = d3.scale.linear().range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    // define the area
    var	area = d3.svg.area()	
        .x(function(d) { return x(d.date); })	
        .y0(height)					
        .y1(function(d) { return y(d.close); });

    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select("#timeline").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // format the data
    data.forEach(function(d) {
        d.date = d.date;
        d.close = d.close;
    });

    x.domain(data.map(function(d) { return d.date; }));
    y.domain([d3.min(data, function(d) { return d.close; }), d3.max(data, function(d) { return d.close; })]);
    //y.domain([0, d3.max(data, function(d) { return d.close; })]);

    // set the gradient
    svg.append("linearGradient")				
        .attr("id", "area-gradient")			
        .attr("gradientUnits", "userSpaceOnUse")	
        .attr("x1", 0).attr("y1", y(0))			
        .attr("x2", 0).attr("y2", y(10))		
        .selectAll("stop")						
        .data([								
        {offset: "0%", color: "#5cbae6"},
        {offset: "100%", color: "#5cbae6"}	
        ])					
        .enter().append("stop")			
        .attr("offset", function(d) { return d.offset; })	
        .attr("stop-color", function(d) { return d.color; });

    // Add the area.
    svg.append("path")
        .data([data])
        .attr("class", "area")
        .attr("d", area);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .style("text-anchor", "middle");

    svg.append("text")
        .attr("transform", "translate(" + -20 + " ," + -10 + ")")
        .style("text-anchor", "left")
        .style("font-size", "14px")
        .text("Participants");

    svg.append("text")
        .attr("transform", "translate(" + width  + " ," + height + ")")
        .attr("dx", "35px")
        .attr("dy", ".3em")
        .style("text-anchor", "middle")
        .style("font-size", "14px")
        .style("fill","#333333")
        .text("Days ago");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end");

}

var currentTimeline = "";
setInterval(function(){ checkForUpdatesTimeline();}, 500);
function checkForUpdatesTimeline(){
    if (!(window.timeline === currentTimeline)){
        currentTimeline = window.timeline;
        createTimeline();
    }
}

window.addEventListener("resize", createTimeline);