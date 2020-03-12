jQuery.sap.declare("UI5FioriForTools.controls.HorizontalBarChart");

sap.ui.core.Element.extend("UI5FioriForTools.controls.HorizontalBarChartItem", {
	metadata: {
		properties: {
			"item": {
				type: "string",
				group: "Misc",
				defaultValue: null
			},
			"count": {
				type: "string",
				group: "Misc",
				defaultValue: null
			}
		}
	}
});
sap.ui.core.Control.extend("UI5FioriForTools.controls.HorizontalBarChart", {
	metadata: {
		properties: {
			"title": {
				type: "string",
				group: "Misc"
			}
		},
		aggregations: {
			"items": {
				type: "UI5FioriForTools.controls.HorizontalBarChartItem",
				multiple: true,
				singularName: "item"
			}
		},
		defaultAggregation: "items",
		events: {
			"onPress": {},
			"onChange": {}
		}
	},

	init: function() {
		this.sParentId = "";
		this.checkForResizing();
	},

	createHorizontalBarChart: function() {
		var oHorizontalBarChartLayout = new sap.m.VBox({
			alignItems: sap.m.FlexAlignItems.Start,
			justifyContent: sap.m.FlexJustifyContent.Start,
			width: "100%"
		});
		var oHorizontalBarChartFlexBox = new sap.m.FlexBox({
			alignItems: sap.m.FlexAlignItems.Start,
			direction: sap.m.FlexDirection.Column,
			height: "auto",
			width: "100%"
		});
		this.sParentId = oHorizontalBarChartFlexBox.getIdForLabel();
		oHorizontalBarChartLayout.addItem(oHorizontalBarChartFlexBox);

		return oHorizontalBarChartLayout;
	},

	renderer: function(oRm, oControl) {
		var layout = oControl.createHorizontalBarChart();
		oRm.write("<div");
		oRm.writeControlData(layout);
		oRm.writeClasses();
		oRm.write(">");
		oRm.renderControl(layout);
		oRm.addClass('verticalAlignment');
		oRm.write("</div>");
	},
	
	//Not working yet!
	checkForResizing: function(){
		var that = this;
		window.onresize = function(event) {
    		//that.draw();
		};
	},
	
	onAfterRendering: function() {
		this.draw();
	},
	
	draw: function(){
		var cItems = this.getItems();
		var data = [];
		for (var i = 0; i < cItems.length; i++) {
			var oEntry = {};
			for (var j in cItems[i].mProperties) {
				oEntry[j] = cItems[i].mProperties[j];
			}
			data.push(oEntry);
		}
		
		//TODO: delete old data
		var horizontalBarChart = d3.select("#" + this.sParentId);
		horizontalBarChart.node().innerHtml = '';
		
		var parentWidth = horizontalBarChart.node().offsetWidth;
		if (parentWidth == 0){
			setInterval(function(){ 
				parentWidth = horizontalBarChart.node().offsetWidth;
			}, 1000);
		}
	    if(parentWidth == 0 || parentWidth == null){
	        parentWidth = 600;
	    }
	    parentWidth = 600;
	    
	    //remap data
		var count = data.length;

	    var axisMargin = -5,
	        margin = 20,
	        valueMargin = 4,
	        width = parentWidth - margin - margin,
	        barHeight = 16,
	        barPadding = 4,
	        height = count * (barHeight + barPadding) + 2 * margin,
	        data, bar, svg, scale, xAxis, labelWidth = 0;

		var color = ['#5cbae6', '#b6d957', '#fac364', '#8cd3ff', '#d998cb', '#f2d249'];
		
	    var max = d3.max(data, function(d) { return d.count; });
	
	    svg = horizontalBarChart.append("svg")
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
	        .attr("class", "item")
	        .attr("y", margin + (barHeight / 2))
	        .attr("dy", ".35em") //vertical align middle
	        .attr("dx", "-.35em")
	        .style("fill", "#333333")
	        .style("font-size","12px")
	        .text(function(d){
	            return d.item;
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
	                return scale(d.count);
	            })
	            .attr("fill",'#5cbae6');
	
	    svg.insert("g",":first-child")
	            .attr("class", "axisHorizontal")
	            .attr("transform", "translate(" + (margin + labelWidth) + ","+ (height - axisMargin - margin)+")")
	            .call(xAxis);
	}

});