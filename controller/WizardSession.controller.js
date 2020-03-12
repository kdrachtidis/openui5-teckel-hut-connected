sap.ui.define([
	'jquery.sap.global',
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel',
	"sap/m/MessageToast",
	"sap/m/MessageBox"
], function(jQuery, Controller, JSONModel, MessageToast, MessageBox) {
	"use strict";

	var WizardController = Controller.extend("UI5FioriForTools.controller.WizardSession", {

		onInit: function() {
			this._wizard = this.getView().byId("SessionWizard");
			WizardController.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this._oNavContainer = this.getView().byId("wizardNavContainer");
			this._oWizardContentPage = this.getView().byId("wizardContentPage");
			this._oWizardReviewPage = sap.ui.xmlfragment("UI5FioriForTools.view.ReviewPageSession", this);

			var fileUploader = this.getView().byId("fileUploader");
			fileUploader.setUploadUrl("https://teckelwebappd060345trial.hanatrial.ondemand.com/teckel-webapp/uploadedFiles/" + window.currentStory);

			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData({
				nameState: "Error",
				fileValueState: "Error",
				roleState: "Error",
				experienceState: "Error"
			});
			sap.ui.getCore().setModel(oModel, "states");

			var oModel1 = new sap.ui.model.json.JSONModel();
			oModel1.setData({
				name: "",
				file: "",
				role: "",
				experience: ""
			});
			sap.ui.getCore().setModel(oModel1, "inputs");

			this._oNavContainer.addPage(this._oWizardReviewPage);
		},
		eventValidation: function() {
			var name = this.getView().byId("nameInput").getValue();
			var role = this.getView().byId("roleInput").getValue();
			var experience = this.getView().byId("experienceInput").getValue();

			name.length < 1 ? sap.ui.getCore().getModel("states").setProperty("/nameState", "Error") : sap.ui.getCore().getModel("states").setProperty(
				"/nameState", "None");
			role.length < 1 ? sap.ui.getCore().getModel("states").setProperty("/roleState", "Error") : sap.ui.getCore().getModel("states").setProperty(
				"/roleState", "None");
			experience.length < 1 ? sap.ui.getCore().getModel("states").setProperty("/experienceState", "Error") : sap.ui.getCore().getModel(
				"states").setProperty("/experienceState", "None");

			if (name.length < 1 || role.length < 1 || experience.length < 1) {
				this._wizard.invalidateStep(this.getView().byId("infoStep"));
			} else {
				this._wizard.validateStep(this.getView().byId("infoStep"));
			}
		},
		wizardCompletedHandler: function() {
			this._oNavContainer.to(this._oWizardReviewPage);
		},
		backToWizardContent: function() {
			this._oNavContainer.backToPage(this._oWizardContentPage.getId());
		},
		editStepOne: function() {
			this._handleNavigationToStep(0);
		},
		editStepTwo: function() {
			this._handleNavigationToStep(1);
		},
		_handleNavigationToStep: function(iStepNumber) {
			var that = this;

			function fnAfterNavigate() {
				that._wizard.goToStep(that._wizard.getSteps()[iStepNumber]);
				that._oNavContainer.detachAfterNavigate(fnAfterNavigate);
			}

			this._oNavContainer.attachAfterNavigate(fnAfterNavigate);
			this.backToWizardContent();
		},
		_handleMessageBoxOpen: function(sMessage, sMessageBoxType, isSubmit) {
			var that = this;
			MessageBox[sMessageBoxType](sMessage, {
				actions: [MessageBox.Action.YES, MessageBox.Action.NO],
				onClose: function(oAction) {
					if (oAction === MessageBox.Action.YES) {
						if (isSubmit) {
							that.getView().byId("fileUploader").upload();
						} else {
							WizardController.oRouter.navTo("data");
						}
						that.discardProgress();
					}
				}
			});
		},
		_setEmptyValue: function(sPath) {
			this.model.setProperty(sPath, "n/a");
		},
		onFileChanged: function() {
			var value = this.getView().byId("fileUploader").getValue();
			if (value.endsWith(".csv")) {
				sap.ui.getCore().getModel("states").setProperty("/fileValueState", "None");
				this._wizard.validateStep(this.getView().byId("uploadStep"));
			} else {
				sap.ui.getCore().getModel("states").setProperty("/fileValueState", "Error");
				this._wizard.invalidateStep(this.getView().byId("uploadStep"));
			}
		},
		onFileUploaded: function() {
			var oModel = new JSONModel();
			var aData = jQuery.ajax({
				type: "GET",
				contentType: "application/text",
				url: "https://teckelwebappd060345trial.hanatrial.ondemand.com/teckel-webapp/uploadedFiles/" + window.currentStory,
				dataType: "text",
				async: false,
				success: function(data) {
					oModel.setData(JSON.parse(data));
					sap.ui.getCore().setModel(oModel, "files");
				},
				error: function(error) {
					console.log(error);
				},
				crossDomain: true
			});
			WizardController.oRouter.navTo("data");
		},
		handleWizardCancel: function() {
			this._handleMessageBoxOpen("Are you sure you want to cancel the process?", "warning", false);
		},
		handleWizardSubmit: function() {
			this._handleMessageBoxOpen("Are you sure you want to submit your story?", "confirm", true);
		},
		discardProgress: function() {
			this.backToWizardContent();
			this._wizard.discardProgress(this.getView().byId("uploadStep"));

			var clearContent = function(content) {
				for (var i = 0; i < content.length; i++) {
					if (content[i].setValue) {
						content[i].setValue("");
					}

					if (content[i].getContent) {
						clearContent(content[i].getContent());
					}
				}
			};

			clearContent(this._wizard.getSteps());

			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData({
				nameState: "Error",
				fileValueState: "Error",
				roleState: "Error",
				experienceState: "Error"
			});
			sap.ui.getCore().setModel(oModel, "states");

			sap.ui.core.UIComponent.getRouterFor(this).navTo("data");
		}
	});

	return WizardController;
});