jQuery.sap.registerModulePath("UI5FioriForTools.controls.Waffle", "controls/Waffle");
jQuery.sap.require("UI5FioriForTools.controls.Waffle");
jQuery.sap.registerModulePath("UI5FioriForTools.controls.WaffleItem", "controls/Waffle");
jQuery.sap.require("UI5FioriForTools.controls.WaffleItem");
jQuery.sap.registerModulePath("UI5FioriForTools.controls.HorizontalBarChart", "controls/HorizontalBarChart");
jQuery.sap.require("UI5FioriForTools.controls.HorizontalBarChart");
jQuery.sap.registerModulePath("UI5FioriForTools.controls.HorizontalBarChartItem", "controls/HorizontalBarChart");
jQuery.sap.require("UI5FioriForTools.controls.HorizontalBarChartItem");

sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel'
], function(Controller, JSONModel) {
	"use strict";

	return Controller.extend("UI5FioriForTools.controller.General", {

		onInit() {
			this._oRouter = this.getOwnerComponent().getRouter();
			this._oRouter.getRoute("general").attachPatternMatched(this._onObjectMatched, this);
		},

		_onObjectMatched(oEvent) {
			this.refreshData();
		},

		onAfterRendering() {
			if (window.currentStory == null) {
				sap.ui.core.UIComponent.getRouterFor(this).navTo("hut");
			}
		},

		refreshData() {
			if (window.currentStory == null) {
				sap.ui.core.UIComponent.getRouterFor(this).navTo("hut");
			} else {
				/*--------------------------Refresh Browser-----------------------------------*/
				var controller = this;
				var aData = jQuery.ajax({
					type: "GET",
					contentType: "application/text",
					url: "https://teckelwebappd060345trial.hanatrial.ondemand.com/teckel-webapp/browser/" + window.currentStory,
					dataType: "text",
					async: false,
					success: function(data) {
						var oModel = new JSONModel();
						oModel.setData(JSON.parse(data));
						sap.ui.getCore().setModel(oModel, "browser");

						var oWaffleHolder = controller.getView().byId("waffleHolderBrowser");
						if (oWaffleHolder.getItems().length == 0) {
							var oWaffleItem = new UI5FioriForTools.controls.WaffleItem({
								category: "{browser}",
								count: "{count}"
							});

							var oWaffle = new UI5FioriForTools.controls.Waffle({
								items: {
									path: "/",
									template: oWaffleItem
								}
							});

							oWaffle.setModel(oModel);

							oWaffleHolder.addItem(oWaffle);
						}
					},
					error: function(error) {
						var dataModel = sap.ui.getCore().getModel("browser"); 
						if(dataModel){
						    dataModel.setData(null);
						    dataModel.updateBindings(true);
						}
					},
					crossDomain: true
				});

				/*--------------------------Refresh OS-----------------------------------*/
				var aData = jQuery.ajax({
					type: "GET",
					contentType: "application/text",
					url: "https://teckelwebappd060345trial.hanatrial.ondemand.com/teckel-webapp/os/" + window.currentStory,
					dataType: "text",
					async: false,
					success: function(data) {
						var oModel = new JSONModel();
						oModel.setData(JSON.parse(data));
						sap.ui.getCore().setModel(oModel, "os");
						
						var oWaffleHolder = controller.getView().byId("waffleHolderOS");
						if (oWaffleHolder.getItems().length == 0) {
							var oWaffleItem = new UI5FioriForTools.controls.WaffleItem({
								category: "{os}",
								count: "{count}"
							});

							var oWaffle = new UI5FioriForTools.controls.Waffle({
								items: {
									path: "/",
									template: oWaffleItem
								}
							});

							oWaffle.setModel(oModel);

							oWaffleHolder.addItem(oWaffle);
						}
					},
					error: function(error) {
						var dataModel = sap.ui.getCore().getModel("os"); 
						if(dataModel){
						    dataModel.setData(null);
						    dataModel.updateBindings(true);
						}
					},
					crossDomain: true
				});

				/*--------------------------Refresh ScreenSize-----------------------------------*/
				var aData = jQuery.ajax({
					type: "GET",
					contentType: "application/text",
					url: "https://teckelwebappd060345trial.hanatrial.ondemand.com/teckel-webapp/screenSize/" + window.currentStory,
					dataType: "text",
					async: false,
					success: function(data) {
						var oModel = new JSONModel();
						oModel.setData(JSON.parse(data));
						sap.ui.getCore().setModel(oModel, "screen");
						
						var oWaffleHolder = controller.getView().byId("waffleHolderScreen");
						if (oWaffleHolder.getItems().length == 0) {
							var oWaffleItem = new UI5FioriForTools.controls.WaffleItem({
								category: "{screenWidth}",
								count: "{count}"
							});

							var oWaffle = new UI5FioriForTools.controls.Waffle({
								items: {
									path: "/",
									template: oWaffleItem
								}
							});

							oWaffle.setModel(oModel);

							oWaffleHolder.addItem(oWaffle);
						}
					},
					error: function(error) {
						var dataModel = sap.ui.getCore().getModel("screen"); 
						if(dataModel){
						    dataModel.setData(null);
						    dataModel.updateBindings(true);
						}
					},
					crossDomain: true
				});

				/*--------------------------Refresh Role-----------------------------------*/
				var form = this.getView().byId('roleForm');
				form.removeAllContent();
				
				var aData = jQuery.ajax({
					type: "GET",
					contentType: "application/text",
					url: "https://teckelwebappd060345trial.hanatrial.ondemand.com/teckel-webapp/role/" + window.currentStory,
					dataType: "text",
					async: false,
					success: function(data) {
						var oModel = new JSONModel();
						oModel.setData(JSON.parse(data));
						sap.ui.getCore().setModel(oModel, "role");

						for (var i = 0; i < JSON.parse(data).length; i++) {
							form.addContent(new sap.m.Label({
								text: "{role>/" + i + "/role}"
							}));
							form.addContent(new sap.m.Text({
								text: "{role>/" + i + "/count} participant(s)"
							}));
							form.addContent(new sap.m.Text({
								text: "{role>/" + i + "/percentage}%"
							}));
						}
						
						var oWaffleHolder = controller.getView().byId("waffleHolderRole");
						if (oWaffleHolder.getItems().length == 0) {
							var oWaffleItem = new UI5FioriForTools.controls.WaffleItem({
								category: "{role}",
								count: "{count}"
							});

							var oWaffle = new UI5FioriForTools.controls.Waffle({
								items: {
									path: "/",
									template: oWaffleItem
								}
							});

							oWaffle.setModel(oModel);

							oWaffleHolder.addItem(oWaffle);
						}
					},
					error: function(error) {
						var dataModel = sap.ui.getCore().getModel("role"); 
						if(dataModel){
						    dataModel.setData(null);
						    dataModel.updateBindings(true);
						}
					},
					crossDomain: true
				});
				
				/*--------------------------Refresh Java-----------------------------------*/
				var aData = jQuery.ajax({
					type: "GET",
					contentType: "application/text",
					url: "https://teckelwebappd060345trial.hanatrial.ondemand.com/teckel-webapp/java/" + window.currentStory,
					dataType: "text",
					async: false,
					success: function(data) {
						var oModel = new JSONModel();
						oModel.setData(JSON.parse(data));
						sap.ui.getCore().setModel(oModel, "java");
						
						var oWaffleHolder = controller.getView().byId("waffleHolderJava");
						if (oWaffleHolder.getItems().length == 0) {
							var oWaffleItem = new UI5FioriForTools.controls.WaffleItem({
								category: "{java}",
								count: "{count}"
							});

							var oWaffle = new UI5FioriForTools.controls.Waffle({
								items: {
									path: "/",
									template: oWaffleItem
								}
							});

							oWaffle.setModel(oModel);

							oWaffleHolder.addItem(oWaffle);
						}
					},
					error: function(error) {
						var dataModel = sap.ui.getCore().getModel("java"); 
						if(dataModel){
						    dataModel.setData(null);
						    dataModel.updateBindings(true);
						}
					},
					crossDomain: true
				});

				/*--------------------------Refresh Cookie-----------------------------------*/
				var aData = jQuery.ajax({
					type: "GET",
					contentType: "application/text",
					url: "https://teckelwebappd060345trial.hanatrial.ondemand.com/teckel-webapp/cookie/" + window.currentStory,
					dataType: "text",
					async: false,
					success: function(data) {
						var oModel = new JSONModel();
						oModel.setData(JSON.parse(data));
						sap.ui.getCore().setModel(oModel, "cookie");
						
						var oWaffleHolder = controller.getView().byId("waffleHolderCookie");
						if (oWaffleHolder.getItems().length == 0) {
							var oWaffleItem = new UI5FioriForTools.controls.WaffleItem({
								category: "{cookie}",
								count: "{count}"
							});

							var oWaffle = new UI5FioriForTools.controls.Waffle({
								items: {
									path: "/",
									template: oWaffleItem
								}
							});

							oWaffle.setModel(oModel);

							oWaffleHolder.addItem(oWaffle);
						}
					},
					error: function(error) {
						var dataModel = sap.ui.getCore().getModel("cookie"); 
						if(dataModel){
						    dataModel.setData(null);
						    dataModel.updateBindings(true);
						}
					},
					crossDomain: true
				});
				
				/*--------------------------Refresh Timeline-----------------------------------*/
				var aData = jQuery.ajax({
					type: "GET",
					contentType: "application/text",
					url: "https://teckelwebappd060345trial.hanatrial.ondemand.com/teckel-webapp/timeline/" + window.currentStory,
					dataType: "text",
					async: false,
					success: function(data) {
						window.timeline = data;
					},
					error: function(error) {
						window.timeline = "";
					},
					crossDomain: true
				});

				/*--------------------------Refresh Experience-----------------------------------*/
				var aData = jQuery.ajax({
					type: "GET",
					contentType: "application/text",
					url: "https://teckelwebappd060345trial.hanatrial.ondemand.com/teckel-webapp/experience/" + window.currentStory,
					dataType: "text",
					async: false,
					success: function(data) {
						var oModel = new JSONModel();
						oModel.setData(JSON.parse(data));
						
						var oHorizontalBarChartHolder = controller.getView().byId("horizontalBarChartHolderExperience");
						if (oHorizontalBarChartHolder.getItems().length == 0) {
							var oHorizontalBarChartItem = new UI5FioriForTools.controls.HorizontalBarChartItem({
								item: "{session}",
								count: "{years}"
							});

							var oHorizontalBarChart = new UI5FioriForTools.controls.HorizontalBarChart({
								items: {
									path: "/",
									template: oHorizontalBarChartItem
								}
							});

							oHorizontalBarChart.setModel(oModel);

							oHorizontalBarChartHolder.addItem(oHorizontalBarChart);
						}
					},
					error: function(error) {
						window.experience = JSON.parse('{"error":"true"}');
					},
					crossDomain: true
				});
			}
		}

	});

});