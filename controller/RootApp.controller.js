sap.ui.define([
  'sap/ui/core/mvc/Controller',
  'sap/ui/model/json/JSONModel'
], function(Controller, JSONModel ) {
  "use strict";

  return Controller.extend("UI5FioriForTools.controller.RootApp", {
    model: new sap.ui.model.json.JSONModel(),
    data: {
      navigation: [{
        title: 'Event Overview',
        icon: 'sap-icon://home',
        key: 'dashboard'
      },{
        title: 'Event Statistics',
        icon: 'sap-icon://area-chart',
        key: 'general'
      },{
        title: 'Data per Use Case',
        icon: 'sap-icon://task',
        key: 'useCase'
      },{
        title: 'Data per Session',
        icon: 'sap-icon://employee-lookup',
        key: 'session'
      },{
        title: 'Recording Files',
        icon: 'sap-icon://request',
        key: 'data'
      }],
      fixedNavigation: [{
        title: 'Contact Information',
        icon: 'sap-icon://business-card',
        key: 'contact'
      }]
    },
    onInit: function() {
      this.model.setData(this.data);
      this.getView().setModel(this.model);
      this._setToggleButtonTooltip(!sap.ui.Device.system.desktop);

      
      var sViewId = this.getView().getId();
      var oToolPage = sap.ui.getCore().byId(sViewId + "--RootApp");
      var bSideExpanded = oToolPage.getSideExpanded();
      this._setToggleButtonTooltip(false);
      
    },
	
	onHutPressed: function(){
      this.getRouter().navTo("hut");
    },

    onItemSelect: function(oEvent) {
      var oItem = oEvent.getParameter('item');
      var sKey = oItem.getKey();
      this.getRouter().navTo(sKey);
    },

    onSideNavButtonPress: function() {
      var sViewId = this.getView().getId();
      var oToolPage = sap.ui.getCore().byId(sViewId + "--RootApp");
      var bSideExpanded = oToolPage.getSideExpanded();
      this._setToggleButtonTooltip(bSideExpanded);
      oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
    },

    _setToggleButtonTooltip: function(bLarge) {
      var oToggleButton = this.getView().byId('sideNavigationToggleButton');
      if (bLarge) {
        oToggleButton.setTooltip('Large Size Navigation');
      } else {
        oToggleButton.setTooltip('Small Size Navigation');
      }
    },
    /**
     * Convenience method for accessing the router.
     * @public
     * @returns {sap.ui.core.routing.Router} the router for this component
     */
    getRouter: function() {
      return sap.ui.core.UIComponent.getRouterFor(this);
    }
  });
  
});