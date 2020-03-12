sap.ui.define([
  'sap/ui/core/mvc/Controller',
  'sap/ui/model/json/JSONModel'
], function(Controller, JSONModel) {
  "use strict";

  return Controller.extend("UI5FioriForTools.controller.Hut", {
    onInit (){
    	var oModel = new JSONModel();
        var aData = jQuery.ajax({
            type : "GET",
            contentType : "application/text",
            url : "https://teckelwebappd060345trial.hanatrial.ondemand.com/teckel-webapp/tests",
            dataType : "text",
            async: false, 
            success: function(data) { 
		      oModel.setData(JSON.parse(data));
		      sap.ui.getCore().setModel(oModel,"projects");
		    }, 
		    error: function(error) { 
		      console.log(error); 
		    }, 
		    crossDomain: true
        });
    	
    },

    itemPressed(evt){
    	var index = this.getView().byId("list").indexOfItem(evt.getSource());
		var data = sap.ui.getCore().getModel("projects").getData().currentProjects[index].title;
    	window.currentStory = data;
    	sap.ui.core.UIComponent.getRouterFor(this).navTo("dashboard");
    },
    
    sharePressed(evt){
    	sap.m.MessageToast.show('Link copied to clipboard.');
    },

    deletePressed(evt){
      var index = evt.getSource().getId().slice(-1);
      var dialog = new sap.m.Dialog({
				title: 'Confirm',
				type: 'Message',
				content: new sap.m.Text({ text: 'Are you sure you want to delete this story?' }),
				beginButton: new sap.m.Button({
					text: 'Delete',
					press: function () {
						
		            var oModel = new JSONModel();
		        	var aData = jQuery.ajax({
		            type : "DELETE",
		            contentType : "application/text",
		            url : "https://teckelwebappd060345trial.hanatrial.ondemand.com/teckel-webapp/tests?" + $.param({ title: sap.ui.getCore().getModel("projects").getData().currentProjects[index].title }),
		            data: { index : sap.ui.getCore().getModel("projects").getData().currentProjects[index].title },
		            dataType : "text",
		            async: false, 
		            success: function(data) { 
				      oModel.setData(JSON.parse(data));
				      sap.ui.getCore().setModel(oModel,"projects");
				    }, 
				    error: function(error) { 
				      console.log(error); 
				    }, 
				    crossDomain: true
		        });
				sap.m.MessageToast.show('Story deleted!');
            	dialog.close();
					}
				}),
				endButton: new sap.m.Button({
					text: 'Cancel',
					press: function () {
						dialog.close();
					}
				}),
				afterClose: function() {
					dialog.destroy();
				}
			});

			dialog.open();
    },

    addPressed(){
			sap.ui.core.UIComponent.getRouterFor(this).navTo("wizard");
    }

  });

});