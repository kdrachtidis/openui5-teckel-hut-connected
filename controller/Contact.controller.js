sap.ui.define([
  'sap/ui/core/mvc/Controller'
], function(Controller) {
  "use strict";

  return Controller.extend("UI5FioriForTools.controller.Contact", {

    onInit: function() {
    	if(window.currentStory == null){
    		sap.ui.core.UIComponent.getRouterFor(this).navTo("hut");
    	}
    }

  });
});