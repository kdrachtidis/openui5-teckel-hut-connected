sap.ui.define([
	'jquery.sap.global',
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel',
	"sap/m/MessageToast",
	"sap/m/MessageBox"
], function(jQuery, Controller, JSONModel, MessageToast, MessageBox) {
	"use strict";
 
	var WizardController = Controller.extend("UI5FioriForTools.controller.Wizard", {
        
        onInit: function () {
            this._wizard = this.getView().byId("CreateProductWizard");
            WizardController.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this._oNavContainer = this.getView().byId("wizardNavContainer");
			this._oWizardContentPage = this.getView().byId("wizardContentPage");
			this._oWizardReviewPage = sap.ui.xmlfragment("UI5FioriForTools.view.ReviewPage", this);
			
			this.model = new sap.ui.model.json.JSONModel();
			this.model.setData({
				fileValueState:"Error",
				eventNameState:"Error",
				moderatorNameState:"Error",
				noteNameState:"Error"
			});
			sap.ui.getCore().setModel(this.model);

			this._oNavContainer.addPage(this._oWizardReviewPage);
            
            var oMultiInput = this.getView().byId("tags");
            oMultiInput.addValidator(function(args){
                var oToken = new sap.m.Token({key: args.text, text:args.text});
                args.asyncCallback(oToken);
			});
		},
		eventValidation : function () {
			var eventName = this.getView().byId("EventName").getValue();
			var moderatorName = this.getView().byId("ModeratorName").getValue();
			var noteName = this.getView().byId("NoteName").getValue();
			
			eventName.length<1 ?  this.model.setProperty("/eventNameState", "Error") : this.model.setProperty("/eventNameState", "None");
			moderatorName.length<1 ?  this.model.setProperty("/moderatorNameState", "Error") : this.model.setProperty("/moderatorNameState", "None");
			noteName.length<1 ?  this.model.setProperty("/noteNameState", "Error") : this.model.setProperty("/noteNameState", "None");
 
			if (eventName.length < 1 || moderatorName.length < 1 || noteName.length < 1){
				this._wizard.invalidateStep(this.getView().byId("eventStep"));
			}else{
				this._wizard.validateStep(this.getView().byId("eventStep"));
			}
		},
		wizardCompletedHandler : function () {
			this._oNavContainer.to(this._oWizardReviewPage);
		},
		backToWizardContent : function () {
			this._oNavContainer.backToPage(this._oWizardContentPage.getId());
		},
		editStepOne : function () {
			this._handleNavigationToStep(0);
		},
		editStepTwo : function () {
			this._handleNavigationToStep(1);
		},
		editStepThree : function () {
			this._handleNavigationToStep(2);
		},
		_handleNavigationToStep : function (iStepNumber) {
			var that = this;
			function fnAfterNavigate () {
				that._wizard.goToStep(that._wizard.getSteps()[iStepNumber]);
				that._oNavContainer.detachAfterNavigate(fnAfterNavigate);
			}
 
			this._oNavContainer.attachAfterNavigate(fnAfterNavigate);
			this.backToWizardContent();
		},
		_handleMessageBoxOpen : function (sMessage, sMessageBoxType,isSubmit) {
			var that = this;
			MessageBox[sMessageBoxType](sMessage, {
				actions: [MessageBox.Action.YES, MessageBox.Action.NO],
				onClose: function (oAction) {
					if (oAction === MessageBox.Action.YES) {
						if(isSubmit){
							that.getView().byId("fileUploader").upload();
						}else{
							WizardController.oRouter.navTo("hut");
						}
						that.discardProgress();
					}
				}
			});
		},
		_setEmptyValue : function (sPath) {
			this.model.setProperty(sPath, "n/a");
		},
		onFileChanged : function(){
			var value = this.model.getProperty("/file");
			if(value.endsWith(".json")){
				this.model.setProperty("/fileValueState","None");
				this._wizard.validateStep(this.getView().byId("uploadStep"));
			}else{
				this.model.setProperty("/fileValueState","Error");
				this._wizard.invalidateStep(this.getView().byId("uploadStep"));
			}
		},
		onFileUploaded : function(){
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
	        WizardController.oRouter.navTo("hut");
		},
		handleWizardCancel : function () {
            this._handleMessageBoxOpen("Are you sure you want to cancel the process?", "warning",false);
		},
		handleWizardSubmit : function () {
            this._handleMessageBoxOpen("Are you sure you want to submit your story?", "confirm",true);
		},
		discardProgress: function () {
			this.backToWizardContent();
			this._wizard.discardProgress(this.getView().byId("uploadStep"));
 
			var clearContent = function (content) {
				for (var i = 0; i < content.length ; i++) {
					if (content[i].setValue) {
						content[i].setValue("");
					}
 
					if (content[i].getContent) {
						clearContent(content[i].getContent());
					}
				}
			};
 
            clearContent(this._wizard.getSteps());
            
            this.model = new sap.ui.model.json.JSONModel();
			this.model.setData({
				fileValueState:"Error",
				eventNameState:"Error",
				moderatorNameState:"Error",
				noteNameState:"Error"
			});
			sap.ui.getCore().setModel(this.model);
			
            sap.ui.core.UIComponent.getRouterFor(this).navTo("hut");
		}
	});
 
	return WizardController;
});