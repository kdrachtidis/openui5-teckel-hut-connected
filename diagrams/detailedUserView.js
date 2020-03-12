window.addEventListener("resize", createDetailedSessionsChart);

setTimeout(function(){ createDetailedSessionsChart(); }, 100);

var currentSessionDetailed = "Session-1";

setInterval(function(){ checkForUpdatesDetails();}, 500);

function checkForUpdatesDetails(){
    if (window.session != currentSessionDetailed){
        currentSessionDetailed = window.session;
        createDetailedSessionsChart();
    }
}

function createDetailedSessionsChart(){

    document.getElementById('allUseCasesNested').innerHTML = '';

    var parentWidth = document.getElementById('allUseCasesNested').offsetWidth;
    if(parentWidth == 0 || parentWidth == null){
        parentWidth = 600;
    }
    
    var margin = {top: 40, right: 20, bottom: 160, left: 40},
        width = parentWidth - margin.left - margin.right,
        height = 380 - margin.top - margin.bottom;
        
    var barSpacing = 3;

    var x0 = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var x1 = d3.scale.ordinal();

    var y = d3.scale.linear()
        .range([height, 0]);

    var color = ['#d5dadc','#5cbae6','#b6d957','#fac364','#8cd3ff','#d998cb','#f2d249','#93b9c6','#ccc5a8','#52bacc','#dbdb46'];

    var xAxis = d3.svg.axis()
        .scale(x0)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(d3.format(".2s"));

    var svg = d3.select("#allUseCasesNested").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.json("./model/" + currentSessionDetailed + "-details.json", function(error, data) {

        var options = d3.keys(data[0]).filter(function(key) { return key !== "label"; });

        var maximumActions = 1;
        data.forEach(function(d) {
            d.valores = options.map(function(name) { return {name: name, value: +d[name]}; });
            
            if(d.TimeForAction2 > 0){
                if(d.TimeForAction3 > 0){
                    if(d.TimeForAction4 > 0){
                        if(d.TimeForAction5 > 0){
                            if(d.TimeForAction6 > 0){
                                if(d.TimeForAction7 > 0){
                                    if(d.TimeForAction8 > 0){
                                        if(d.TimeForAction9 > 0){
                                            if(d.TimeForAction10 > 0){
                                                maximumActions = 10;
                                            }else{
                                                maximumActions = Math.max(maximumActions,9);
                                            }
                                        }else{
                                            maximumActions = Math.max(maximumActions,8);
                                        }
                                    }else{
                                        maximumActions = Math.max(maximumActions,7);
                                    }
                                }else{
                                    maximumActions = Math.max(maximumActions,6);
                                }
                            }else{
                                maximumActions = Math.max(maximumActions,5);
                            }
                        }else{
                            maximumActions = Math.max(maximumActions,4);
                        }
                    }else{
                        maximumActions = Math.max(maximumActions,3);
                    }
                }else{
                    maximumActions = Math.max(maximumActions,2);
                }
            }
        });

        var x = d3.scale.ordinal().rangeRoundBands([0, width], 1);
        x0.domain(data.map(function(d) { return d.label; }));
        x1.domain(options).rangeRoundBands([0, x0.rangeBand()]);
        y.domain([0, d3.max(data, function(d) { return d3.max(d.valores, function(d) { return d.value; }); })]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "translate(" + 0 + " ," + -10 + ")")
            .style("text-anchor", "middle")
            .style("font-size", "14px")
            .text("Seconds");

        var bar = svg.selectAll(".bar")
            .data(data)
            .enter().append("g")
            .attr("class", "rect")
            .attr("transform", function(d) { return "translate(" + x0(d.label) + ",0)"; });

        bar.selectAll("rect")
            .data(function(d) { return d.valores; })
            .enter().append("rect")
            .attr("width", function(d) { 
                if(d.name == "TotalProcessingTime"){
                    return (x1.rangeBand() * (maximumActions+1));
                } else {
                    return x1.rangeBand() - barSpacing;
                }
            })
            .attr("x", function(d) { 
                if(d.name == "TotalProcessingTime"){
                    return x1(d.name);
                }else{
                    return x1(d.name) - x1.rangeBand()/2 + barSpacing/2; 
                }
            })
            .attr("height", 0)
            .attr("y", function(d) { return height; })
            //return correct coloring
            .style("fill", function(d) { 
                if(d.name == "TotalProcessingTime"){
                    return color[0];
                }
                else {
                    return color[d.name.replace(/\D/g,'')];
                }
            })
            .transition()
            .duration(800)
            .attr("y", function(d) { return (y(d.value)); })
            .attr("value", function(d){return d.name;})
            .attr("height", function(d) { return (height - y(d.value)); });
        
        if (width > 600){
            var legend = svg.selectAll(".legend")
                .data(options.slice())
                .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function(d, i) { return "translate(" + (i)%4 * 150 + "," + Math.floor(i  / 4) * 20 + ")"; });

            legend.append("rect")
                .attr("x", margin.left - 20)
                .attr("y", ( height + margin.top) )
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", function(d, i) { return color[i]});

            legend.append("text")
                .attr("x", margin.left)
                .attr("y", height + margin.top + 9)
                .attr("dy", ".35em")
                .style("text-anchor", "begin")
                .style("font-size","12px")
                .text(function(d) { return d; });
        }else{
            var legend = svg.selectAll(".legend")
                .data(options.slice())
                .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function(d, i) { return "translate(" + (i)%2 * 150 + "," + Math.floor(i  / 2) * 20 + ")"; });

            legend.append("rect")
                .attr("x", margin.left - 20)
                .attr("y", ( height + margin.top) )
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", function(d, i) { return color[i]});

            legend.append("text")
                .attr("x", margin.left)
                .attr("y", height + margin.top + 9)
                .attr("dy", ".35em")
                .style("font-size","12px")
                .style("text-anchor", "begin")
                .text(function(d) { return d; });
        }

        
    });
}