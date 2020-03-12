function createExperience(){

    // Get the data
    if(window.currentStory == undefined){
    	return;
    }
    var data = window.experience;
	
    document.getElementById('experience').innerHTML = '';

    var parentWidth = document.getElementById('experience').offsetWidth;
    if(parentWidth == 0 || parentWidth == null){
        parentWidth = 600;
    }

    var count = data.length;

    var axisMargin = -10,
        margin = 20,
        valueMargin = 4,
        width = parentWidth - margin - margin,
        barHeight = 16,
        barPadding = 4,
        height = count * (barHeight + barPadding) + 2 * margin,
        data, bar, svg, scale, xAxis, labelWidth = 0;

    max = d3.max(data, function(d) { return d.years; });

    svg = d3.select('#experience')
        .append("svg")
        .attr("width", width)
        .attr("height", height);


    bar = svg.selectAll("g")
        .data(data)
        .enter()
        .append("g");

    bar.attr("class", "bar")
        .attr("cx",0)
        .attr("transform", function(d, i) {
            return "translate(" + margin + "," + (i * (barHeight + barPadding) + barPadding) + ")";
        });

    bar.append("text")
        .attr("class", "session")
        .attr("y", margin + (barHeight / 2))
        .attr("dy", ".35em") //vertical align middle
        .attr("dx", "-.35em")
        .style("fill", "#333333")
        .style("font-size","12px")
        .text(function(d){
            return d.session;
        }).each(function() {
            labelWidth = Math.ceil(Math.max(labelWidth, this.getBBox().width));
        });

    scale = d3.scale.linear()
        .domain([0, max])
        .range([0, width - margin*2 - labelWidth]);

    xAxis = d3.svg.axis()
        .scale(scale)
        .tickSize(-height + 2*margin + axisMargin)
        .orient("bottom");

    bar.append("rect")
            .attr("transform", "translate("+labelWidth+", "+margin+")")
            .attr("height", barHeight)
            .attr("width", function(d){
                return scale(d.years);
            })
            .attr("fill",'#5cbae6');

    svg.insert("g",":first-child")
            .attr("class", "axisHorizontal")
            .attr("transform", "translate(" + (margin + labelWidth) + ","+ (height - axisMargin - margin)+")")
            .call(xAxis);
}

var currentExperience = "";
setInterval(function(){ checkForUpdatesExperience();}, 500);
function checkForUpdatesExperience(){
    if (!(window.experience === currentExperience)){
        currentExperience = window.experience;
        createExperience();
    }
}

window.addEventListener("resize", createExperience);
