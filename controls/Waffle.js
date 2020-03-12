jQuery.sap.declare("UI5FioriForTools.controls.Waffle");

sap.ui.core.Element.extend("UI5FioriForTools.controls.WaffleItem", {
	metadata: {
		properties: {
			"category": {
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
sap.ui.core.Control.extend("UI5FioriForTools.controls.Waffle", {
	metadata: {
		properties: {
			"title": {
				type: "string",
				group: "Misc"
			}
		},
		aggregations: {
			"items": {
				type: "UI5FioriForTools.controls.WaffleItem",
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
	},

	createWaffle: function() {
		var oMiniWaffleLayout = new sap.m.VBox({
			alignItems: sap.m.FlexAlignItems.Start,
			justifyContent: sap.m.FlexJustifyContent.Start
		});
		var oMiniWaffleFlexBox = new sap.m.FlexBox({
			alignItems: sap.m.FlexAlignItems.Start,
			direction: sap.m.FlexDirection.Column,
			height: "auto"
		});
		this.sParentId = oMiniWaffleFlexBox.getIdForLabel();
		oMiniWaffleLayout.addItem(oMiniWaffleFlexBox);

		return oMiniWaffleLayout;
	},

	renderer: function(oRm, oControl) {
		var layout = oControl.createWaffle();
		oRm.write("<div");
		oRm.writeControlData(layout);
		oRm.writeClasses();
		oRm.write(">");
		oRm.renderControl(layout);
		oRm.addClass('verticalAlignment');
		oRm.write("</div>");
	},

	onAfterRendering: function() {
		var cItems = this.getItems();
		var data = [];
		for (var i = 0; i < cItems.length; i++) {
			var oEntry = {};
			for (var j in cItems[i].mProperties) {
				oEntry[j] = cItems[i].mProperties[j];
			}
			data.push(oEntry);
		}

		var waffle = d3.select("#" + this.sParentId);

		var total = 0;
		var width,
			height,
			widthSquares = 10,
			heightSquares = 10,
			squareSize = 15,
			squareValue = 0,
			gap = 1,
			theData = [];

		var color = ['#5cbae6', '#b6d957', '#fac364', '#8cd3ff', '#d998cb', '#f2d249'];

		//total
		total = d3.sum(data, function(d) {
			return d.count;
		});

		//value of a square
		squareValue = total / (widthSquares * heightSquares);

		//remap data
		data.forEach(function(d, i) {
			d.count = +d.count;
			d.units = Math.round(d.count / squareValue);
			theData = theData.concat(
				Array(d.units + 1).join(1).split('').map(function() {
					return {
						squareValue: squareValue,
						units: d.units,
						count: d.count,
						groupIndex: i
					};
				})
			);
		});

		width = (squareSize * widthSquares) + widthSquares * gap + 50;
		height = (squareSize * heightSquares) + heightSquares * gap + 20;

		waffle.append("svg")
			.attr("width", width)
			.attr("height", height)
			.append("g")
			.selectAll("div")
			.data(theData)
			.enter()
			.append("rect")
			.attr("width", squareSize)
			.attr("height", squareSize)

			.attr("y", function(d, i) {
				row = i % heightSquares;
				return (heightSquares * squareSize) - ((row * squareSize) + (row * gap))
			})
			//add color animation
			.attr("fill", color[0])
			.transition()
			.delay(function(d, i) {
				return i * 10;
			})
			.duration(100)
			.attr("fill", function(d) {
				return color[d.groupIndex];
			})
			.attr("x", function(d, i) {
				//group n squares for column
				col = Math.floor(i / heightSquares);
				return (col * squareSize) + (col * gap);
			})
			;

		//add legend with categorical data
		var legend = d3.select("#" + this.sParentId)
			.append("svg")
			.attr('width', 160)
			.attr('height', 60)
			.append('g')
			.selectAll("div")
			.data(data)
			.enter()
			.append("g")
			.attr("transform", function(d, i) {
				xOff = (i % 2) * 90
				yOff = Math.floor(i / 2) * 20
				return "translate(" + xOff + "," + yOff + ")"
			});

		legend.append("rect")
			.attr("width", squareSize)
			.attr("height", squareSize)
			.style("fill", function(d, i) {
				return color[i]
			});

		legend.append("text")
			.attr("x", 25)
			.attr("y", 13)
			.style('fill', '#333333')
			.style('font-size', '12px')
			.text(function(d) {
				return d.category
			});
		
	}

});