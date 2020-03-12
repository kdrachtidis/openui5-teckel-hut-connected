sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel'
], function(Controller, JSONModel) {
	"use strict";

	return Controller.extend("UI5FioriForTools.controller.UseCase", {

		onInit() {
			this._oRouter = this.getOwnerComponent().getRouter();
			this._oRouter.getRoute("useCase").attachPatternMatched(this._onObjectMatched, this);
		},

		_onObjectMatched(oEvent) {
			window.index = 0;
			this.refreshData();
			this.createTabs(0);
		},

		onAfterRendering() {
			window.index = 0;
			this.refreshData();
			this.createTabs(0);
		},

		refreshData() {
			if (window.currentStory == null) {
				sap.ui.core.UIComponent.getRouterFor(this).navTo("hut");
			} else {
				var aData = jQuery.ajax({
					type: "GET",
					contentType: "application/text",
					url: "https://teckelwebappd060345trial.hanatrial.ondemand.com/teckel-webapp/action/all/" + window.currentStory + "?" + $.param({ uc: window.index }),
					dataType: "text",
					async: false,
					success: function(data) {
						window.allActions = data;
					},
					error: function(error) {

					},
					crossDomain: true
				});

				var aData = jQuery.ajax({
					type: "GET",
					contentType: "application/text",
					url: "https://teckelwebappd060345trial.hanatrial.ondemand.com/teckel-webapp/action/single/" + window.currentStory + "?" + $.param({ uc: window.index }),
					dataType: "text",
					async: false,
					success: function(data) {
						var test;
						for (var i = 0; i < 20; i++) {
							eval("window.Action" + i + "= JSON.parse(data).Action" + i + ";");
							eval("test = window.Action" + i + ";");
							if (test === undefined) {
								break;
							}
						}
					},
					error: function(error) {

					},
					crossDomain: true
				});
				
			}
		},

		onListItemPress: function(evt) {
			window.index = evt.getSource().indexOfItem(evt.getSource().getSelectedItem());
			refreshData();
			this.createTabs(window.index);
		},

		createTabs: function(index) {
			var page = this.byId('useCasePage');
			page.destroySections();

			var aData = jQuery.ajax({
				type: "GET",
				contentType: "application/text",
				url: "https://teckelwebappd060345trial.hanatrial.ondemand.com/teckel-webapp/useCaseData/" + window.currentStory,
				dataType: "text",
				async: false,
				success: function(data) {
					data = JSON.parse(data);
					var oModel = new sap.ui.model.json.JSONModel();
					
					oModel.setData({
						id: data.UseCases[index].UseCaseTitle,
						description: data.UseCases[index].UseCaseDescription
					});
					sap.ui.getCore().setModel(oModel, "currentUseCase");

					window.useCase = data.UseCases[index].UseCaseTitle;

					var numberActions = data.UseCases[index].UseCaseActions.length;

					var oSubSection1 = new sap.uxap.ObjectPageSubSection({
						title: ""
					});
					var form = new sap.ui.layout.form.SimpleForm({
						layout: "ResponsiveGridLayout",
						singleContainerFullSize: true,
						content: [
							new sap.m.Label({
								textAlign: sap.ui.core.TextAlign.Left,
								text: "Description"
							}),
							new sap.m.Text({
								text: "{useCaseData>/UseCases/" + index + "/UseCaseDescription}"
							}),
							new sap.m.Label({
								text: "Actions"
							})
						]
					});
					for (var i = 0; i < numberActions; i++) {
						form.addContent(new sap.m.Text({
							text: (i + 1) + ". {useCaseData>/UseCases/" + index + "/UseCaseActions/" + i + "/ActionTitle}"
						}));
						form.addContent(new sap.m.Label({}));
					}

					var html = new sap.ui.core.HTML({
						content: "<div id='allSessions' class='bar-chart'> </div>"
					});
					var verticalLayout = new sap.ui.layout.VerticalLayout({
						width: "100%",
						content: [form, html]
					});
					oSubSection1.addBlock(verticalLayout);

					var oSection1 = new sap.uxap.ObjectPageSection({
						title: "All Actions"
					});
					oSection1.addSubSection(oSubSection1);
					page.addSection(oSection1);
					$.getScript("diagrams/UseCase-allActions.js", function() {});

					for (var i = 0; i < numberActions; i++) {
						var oSubSection1 = new sap.uxap.ObjectPageSubSection({
							title: ""
						});
						var form = new sap.ui.layout.form.SimpleForm({
							layout: "ResponsiveGridLayout",
							singleContainerFullSize: true,
							content: [
								new sap.m.Label({
									textAlign: sap.ui.core.TextAlign.Left,
									text: "Title"
								}),
								new sap.m.Text({
									text: "{useCaseData>/UseCases/" + index + "/UseCaseActions/" + i + "/ActionTitle}"
								}),
								new sap.m.Label({
									textAlign: sap.ui.core.TextAlign.Left,
									text: "Description"
								}),
								new sap.m.Text({
									text: "{useCaseData>/UseCases/" + index + "/UseCaseActions/" + i + "/ActionDescription}"
								}),
								new sap.m.Label({
									text: "Ideal Steps"
								})
							]
						});
						var numberSteps = data.UseCases[index].UseCaseActions[i].ActionSteps.length;
						for (var j = 0; j < numberSteps; j++) {
							form.addContent(new sap.m.Text({
								text: (j + 1) + ". {useCaseData>/UseCases/" + index + "/UseCaseActions/" + i + "/ActionSteps/" + j +
									"/ActionStepDescription}"
							}));
							form.addContent(new sap.m.Label({}));
						}

						var html = new sap.ui.core.HTML({
							content: "<div id='UseCase-Action" + (i + 1) + "' class='bar-chart'> </div>"
						});
						var verticalLayout = new sap.ui.layout.VerticalLayout({
							width: "100%",
							content: [form, html]
						});
						oSubSection1.addBlock(verticalLayout);
						var oSection1 = new sap.uxap.ObjectPageSection({
							title: "Action {useCaseData>/UseCases/" + index + "/UseCaseActions/" + i + "/ActionID}"
						});
						oSection1.addSubSection(oSubSection1);
						page.addSection(oSection1);
						$.getScript("diagrams/UseCase-Action" + (i + 1) + ".js", function() {});
					}

				},
				error: function(error) {},
				crossDomain: true
			});

		}

	});
});