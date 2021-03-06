sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/m/Text'
], function (Controller, Text) {
	"use strict";
	return Controller.extend("com.epam.ui.controller.base", {
		onInit: function () {
			var oMap = this.getMapControl();
			var oMapConfig = {
				"MapProvider": [{
					"name": "GMAP",
					"Source": [{
						"id": "s1",
						"url": "https://mt.google.com/vt/lyrs=m&x={X}&y={Y}&z={LOD}"
					}]
				}],
				"MapLayerStacks": [{
					"name": "DEFAULT",
					"MapLayer": {
						"name": "layer1",
						"refMapProvider": "GMAP",
						"opacity": "1",
						"colBkgnd": "RGB(255,255,255)"
					}
				}]
			};
			oMap.setMapConfiguration(oMapConfig);
			oMap.setRefMapLayerStack("DEFAULT");
			if(this.MODELS){
				var modelsNames = Object.keys(this.MODELS);
				for(var i=0; i < modelsNames.length; i++){
					this.getView().setModel(this.MODELS[modelsNames[i]], modelsNames[i]);
				}
			}
		},

		onAfterRendering: function () {
			var oMap = this.getMapControl();
			if (!this._spotDetailPointer) {
				var that = this;
				setTimeout(function(){
					var textView = new Text(that.createId("SpotDetailPointer"));
					var contentId = oMap.getId() + "-geoscene-winlayer";
					var cont = document.getElementById(contentId);
					var rm = sap.ui.getCore().createRenderManager();
					rm.renderControl(textView);
					rm.flush(cont);
					rm.destroy();
					that._spotDetailPointer = textView;
				},1000);
			}
		},

		onZoomChanged: function (evt) {
			if (this._oPopover) {
				this._oPopover.close();
			}
		},

		onExit: function () {
			if (this._oPopover) {
				this._oPopover.destroy();
			}
		},
		
		onHideView : function(evt){
		},

		getMapControl: function () {
			return this.getView().byId("vbi");
		},

		getMapLegend: function () {
			return this.getMapControl().getLegend();
		},

		onLegendItemClick: function (evt) {

		},

		createPeriodicalyTask: function (taskToExecute, delay) {
			var timer;
			var start = function () {
				function run() {
					taskToExecute();
					timer = setTimeout(run, delay);
				};
				timer = setTimeout(run, 1);
			};
			return {
				start: start,
				stop: function () {
					if (timer) {
						clearTimeout(timer);
						timer = null;
					}
				}
			};
		}
	});
});