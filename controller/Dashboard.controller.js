jQuery.sap.registerModulePath("UI5FioriForTools.controls.Waffle", "controls/Waffle");
jQuery.sap.require("UI5FioriForTools.controls.Waffle");
jQuery.sap.registerModulePath("UI5FioriForTools.controls.WaffleItem", "controls/Waffle");
jQuery.sap.require("UI5FioriForTools.controls.WaffleItem");

sap.ui.define([
  'sap/ui/core/mvc/Controller',
  'sap/ui/model/json/JSONModel',
], function(Controller, JSONModel) {
  "use strict";

  return Controller.extend("UI5FioriForTools.controller.Dashboard", {
    onInit (){
    	this._oRouter = this.getOwnerComponent().getRouter();
    	this._oRouter.getRoute("dashboard").attachPatternMatched(this._onObjectMatched, this);
    },
    
    _onObjectMatched(oEvent){
    	this.refreshData();
    },
    
    onAfterRendering() {
		if (window.currentStory == null) {
			sap.ui.core.UIComponent.getRouterFor(this).navTo("hut");
		}
	},
    
    refreshData(){
    	if(window.currentStory == null){
    		sap.ui.core.UIComponent.getRouterFor(this).navTo("hut");
    	}else{
    		var controller = this; 
    		var oModel = new JSONModel();
	        var aData = jQuery.ajax({
	            type : "GET",
	            contentType : "application/text",
	            url : "https://teckelwebappd060345trial.hanatrial.ondemand.com/teckel-webapp/general/"+window.currentStory,
	            dataType : "text",
	            async: false, 
	            success: function(data) { 
			      oModel.setData(JSON.parse(data));
			      sap.ui.getCore().setModel(oModel,"general");
			    }, 
			    error: function(error) { 
			      oModel.setData(JSON.parse('{"error":"true"}'));
			      sap.ui.getCore().setModel(oModel,"general");
			    }, 
			    crossDomain: true
	        });
	        
	        //TODO: Better place in RootApp.controller etc.
	        var oModel2 = new JSONModel();
	        var aData = jQuery.ajax({
	            type : "GET",
	            contentType : "application/text",
	            url : "https://teckelwebappd060345trial.hanatrial.ondemand.com/teckel-webapp/useCaseData/"+window.currentStory,
	            dataType : "text",
	            async: false, 
	            success: function(data) { 
			      oModel2.setData(JSON.parse(data));
			      sap.ui.getCore().setModel(oModel2,"useCaseData");
			      
			      var oModel3 = new JSONModel();
			      oModel3.setData({
			          numberUseCases: JSON.parse(data).UseCases.length
			      });
			      sap.ui.getCore().setModel(oModel3,"numberUseCases");
			    }, 
			    error: function(error) { 
			      oModel2.setData(JSON.parse("{}"));
			      sap.ui.getCore().setModel(oModel2,"useCaseData");
			      
			      var oModel3 = new JSONModel();
			      oModel3.setData({
			          numberUseCases: 0
			      });
			      sap.ui.getCore().setModel(oModel3,"numberUseCases");
			    }, 
			    crossDomain: true
	        });
	        
	        var aData = jQuery.ajax({
	            type : "GET",
	            contentType : "application/text",
	            url : "https://teckelwebappd060345trial.hanatrial.ondemand.com/teckel-webapp/browser/"+window.currentStory,
	            dataType : "text",
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
	        
	        var aData = jQuery.ajax({
	            type : "GET",
	            contentType : "application/text",
	            url : "https://teckelwebappd060345trial.hanatrial.ondemand.com/teckel-webapp/os/"+window.currentStory,
	            dataType : "text",
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
	        
	        var aData = jQuery.ajax({
	            type : "GET",
	            contentType : "application/text",
	            url : "https://teckelwebappd060345trial.hanatrial.ondemand.com/teckel-webapp/screenSize/"+window.currentStory,
	            dataType : "text",
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
    	}
    }

  });

});