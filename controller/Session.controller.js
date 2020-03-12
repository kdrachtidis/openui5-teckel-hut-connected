sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel'
], function(Controller, JSONModel) {
	"use strict";

	return Controller.extend("UI5FioriForTools.controller.Session", {

		onInit() {
			this._oRouter = this.getOwnerComponent().getRouter();
			this._oRouter.getRoute("session").attachPatternMatched(this._onObjectMatched, this);
		},

		_onObjectMatched(oEvent) {
			this.refreshData();
		},

		onBeforeRendering() {
			this.refreshData();
		},

		refreshData() {
			if (window.currentStory == null) {
				sap.ui.core.UIComponent.getRouterFor(this).navTo("hut");
			} else {
				var aData = jQuery.ajax({
					type: "GET",
					contentType: "application/text",
					url: "https://teckelwebappd060345trial.hanatrial.ondemand.com/teckel-webapp/uploadedFiles/" + window.currentStory,
					dataType: "text",
					async: false,
					success: function(data) {
						data = JSON.parse(data);
						var oModel = new sap.ui.model.json.JSONModel();
						oModel.setData({
							session: "Session-1",
							sessionName: data[0].attributes[0].text,
							sessionDate: data[0].attributes[1].text,
							sessionRole: data[0].attributes[2].text
						});
						sap.ui.getCore().setModel(oModel, "selectedSession");

						var oModel2 = new JSONModel();
						oModel2.setData(data);
						sap.ui.getCore().setModel(oModel2, "holdSessions");

						window.session = "Session-1"; //global variable for diagram update

						//TODO: select first item in list
					},
					error: function(error) {},
					crossDomain: true
				});

				var aData = jQuery.ajax({
					type: "GET",
					contentType: "application/text",
					url: "https://teckelwebappd060345trial.hanatrial.ondemand.com/teckel-webapp/sessions/" + window.currentStory,
					dataType: "text",
					async: false,
					success: function(data) {
						console.log(JSON.parse(data).Session0);
						var oModel = new sap.ui.model.json.JSONModel();
						oModel.setData(JSON.parse(data));
						sap.ui.getCore().setModel(oModel, "allSessions");
					},
					error: function(error) {},
					crossDomain: true
				});
			}
		},

		onListItemPress: function(evt) {
			var index = evt.getSource().indexOfItem(evt.getSource().getSelectedItem());
			var shortName = evt.getSource().getSelectedItem().getTitle();
			var aData = jQuery.ajax({
				type: "GET",
				contentType: "application/text",
				url: "https://teckelwebappd060345trial.hanatrial.ondemand.com/teckel-webapp/uploadedFiles/" + window.currentStory,
				dataType: "text",
				async: false,
				success: function(data) {
					data = JSON.parse(data);
					var oModel = new sap.ui.model.json.JSONModel();
					oModel.setData({
						session: shortName,
						sessionName: data[index].attributes[0].text,
						sessionDate: data[index].attributes[1].text,
						sessionRole: data[index].attributes[2].text
					});
					sap.ui.getCore().setModel(oModel, "selectedSession");

					window.session = evt.getSource().getSelectedItem().getTitle(); //global variable for diagram update

				},
				error: function(error) {},
				crossDomain: true
			});
		}

	});

});