window.addEventListener("resize", createAction2Chart);

setTimeout(function(){ createAction2Chart(); }, 100);

function createAction2Chart(){

    document.getElementById('UseCase-Action2').innerHTML = '';

    var parentWidth = document.getElementById('UseCase-Action2').offsetWidth;
    if(parentWidth == 0 || parentWidth == null){
        parentWidth = 600;
    }

    var margin = {top: 40, right: 20, bottom: 80, left: 40},
        width = parentWidth - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    var count = 0;
    var sum = 0;
    
    if(window.Action1 == undefined){
    	return;
    }
    
    var data = d3.csv.parse(window.Action1);

    var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

    var y = d3.scale.linear().range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var svg = d3.select("#UseCase-Action2").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var filename = window.useCase.replace(/\s/g, '');

    data.forEach(function(d) {
        d.session = d.session;
        d.duration = +d.duration;
        count = count + 1;
        sum = sum + d.duration;
    });
    var average = sum/count;
    
    x.domain(data.map(function(d) { return d.session; }));
    y.domain([0, d3.max(data, function(d) { return d.duration; })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-90)" );

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
        .attr("x", function(d) { return x(d.session); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return height; })
        .attr("height", 0)      
        .transition()
        .duration(800)
        .attr("y", function(d) { return y(d.duration); })
        .attr("height", function(d) { return height - y(d.duration); 
    });

    svg.append("line")
        .style("stroke", "#156489")
        .attr("x1",0)
        .attr("y1",function(d) { return  (y(average) ); })
        .attr("x2",parentWidth - margin.left - margin.right)
        .attr("y2",function(d) { return  (y(average) ); });

    svg.append("text")
        .attr("x", parentWidth - margin.left - margin.right)
        .attr("y", y(average)-5)
        .style("text-anchor", "end")
        .style("font-size", "14px")
        .attr("fill","#156489")
        .text("Average");
 
}

var currentAction1 = "";
setInterval(function(){ checkForUpdatesAction2();}, 500);
function checkForUpdatesAction2(){
	if (!(window.Action1 === currentAction1)){
    	currentAction1 = window.Action1;
        createAction2Chart();
    }
}

window.addEventListener("resize", createAction2Chart);