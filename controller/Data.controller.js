sap.ui.define([
		'sap/m/MessageToast',
		'sap/m/UploadCollectionParameter',
		'sap/ui/core/mvc/Controller',
		'sap/ui/model/json/JSONModel'
	], function(MessageToast, UploadCollectionParameter, Controller, JSONModel) {
	"use strict";
 
	  return Controller.extend("UI5FioriForTools.controller.Data", {

		onInit: function () {
			this._oRouter = this.getOwnerComponent().getRouter();
	    	this._oRouter.getRoute("data").attachPatternMatched(this._onObjectMatched, this);
	    },
	    
	    _onObjectMatched(oEvent){
	    	this.refreshData();
	    },
	    
	    onBeforeRendering(){
	    	if(window.currentStory == null){
	    		sap.ui.core.UIComponent.getRouterFor(this).navTo("hut");
	    	}else{
	    		this.refreshData();
	    	}
	    },
	    
	    refreshData: function(){
	    	var oModel = new JSONModel();
	        var aData = jQuery.ajax({
	            type : "GET",
	            contentType : "application/text",
	            url : "https://teckelwebappd060345trial.hanatrial.ondemand.com/teckel-webapp/uploadedFiles/"+window.currentStory,
	            dataType : "text",
	            async: false, 
	            success: function(data) { 
			      oModel.setData(JSON.parse(data));
			      sap.ui.getCore().setModel(oModel,"files");
			    }, 
			    error: function(error) { }, 
			    crossDomain: true
	        });
		},
		
		/*onEdit: function(){
			this.getView().byId("editButton").setVisible(false);
			this.getView().byId("saveButton").setVisible(true);
			this.getView().byId("cancelButton").setVisible(true);
		},*/
		
		onNew: function(){
			sap.ui.core.UIComponent.getRouterFor(this).navTo("wizardSession");
		},
		
		/*onSave: function(){
			this.getView().byId("saveButton").setVisible(false);
			this.getView().byId("cancelButton").setVisible(false);
			this.getView().byId("editButton").setVisible(true);
		},
		
		onCancel: function(){
			this.getView().byId("cancelButton").setVisible(false);
			this.getView().byId("saveButton").setVisible(false);
			this.getView().byId("editButton").setVisible(true);
		}*/

	});

});