/*global logger*/
/*
    FaviconBadge
    ========================

    @file      : FaviconBadge.js
    @version   : 1.0.0
    @author    : Paul Ketelaars
    @date      : 2017-02-03
    @copyright : TimeSeries 2016
    @license   : Apache 2

    Documentation
    ========================
    Describe your widget here.
*/

// Required module list. Remove unnecessary modules, you can always get them back from the boilerplate.
define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",

    "mxui/dom",
    "dojo/dom",
    "dojo/dom-prop",
    "dojo/dom-geometry",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/text",
    "dojo/html",
    "dojo/_base/event",

    "FaviconBadge/lib/favico"
], function (declare, _WidgetBase, dom, dojoDom, dojoProp, dojoGeometry, dojoClass, dojoStyle, dojoConstruct, dojoArray, dojoLang, dojoText, dojoHtml, dojoEvent, favico) {
    "use strict";


    // Declare widget's prototyp
    return declare("FaviconBadge.widget.FaviconBadge", [ _WidgetBase ], {
        // _TemplatedMixin will create our dom node using this HTML template.

        // DOM elements
        // Parameters configured in the Modeler.
        mfToExecute: "",
        animation: "",

        // Internal variables. Non-primitives created in the prototype are shared between all widget instances.
        _handles: null,
        _contextObj: null,
        _readOnly: false,
        _badgeValue: null,

        // dojo.declare.constructor is called to construct the widget instance. Implement to initialize non-primitive properties.
        constructor: function () {
            logger.debug(this.id + ".constructor");
            this._handles = [];
        },

        // dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
        postCreate: function () {
            logger.debug(this.id + ".postCreate");

            if (this.readOnly || this.get("disabled") || this.readonly) {
              this._readOnly = true;
            }
            this._updateRendering();
        },



        // mxui.widget._WidgetBase.update is called when context is changed or initialized. Implement to re-render and / or fetch data.
        update: function (obj, callback) {
            logger.debug(this.id + ".update");
                        this._contextObj = obj;

            this._getBadgeValue(this.mfToExecute, this._contextObj.getGuid(), dojoLang.hitch(this, function(string) {
            this._badgeValue = string;
            this._setFavicon(string, callback);
                }));


            this._resetSubscriptions();
            this._updateRendering(callback); // We're passing the callback to updateRendering to be called after DOM-manipulation
        },

        // mxui.widget._WidgetBase.enable is called when the widget should enable editing. Implement to enable editing if widget is input widget.
        enable: function () {
          logger.debug(this.id + ".enable");
        },

        // mxui.widget._WidgetBase.enable is called when the widget should disable editing. Implement to disable editing if widget is input widget.
        disable: function () {
          logger.debug(this.id + ".disable");
        },

        // mxui.widget._WidgetBase.resize is called when the page's layout is recalculated. Implement to do sizing calculations. Prefer using CSS instead.
        resize: function (box) {
          logger.debug(this.id + ".resize");
        },

        // mxui.widget._WidgetBase.uninitialize is called when the widget is destroyed. Implement to do special tear-down work.
        uninitialize: function () {
          logger.debug(this.id + ".uninitialize");
            // Clean up listeners, helper objects, etc. There is no need to remove listeners added with this.connect / this.subscribe / this.own.
        },

        // We want to stop events on a mobile device
        _stopBubblingEventOnMobile: function (e) {
            logger.debug(this.id + "._stopBubblingEventOnMobile");
            if (typeof document.ontouchstart !== "undefined") {
                dojoEvent.stop(e);
            }
        },


        // Rerender the interface.
        _updateRendering: function (callback) {
            logger.debug(this.id + "._updateRendering");

            if (this._contextObj !== null) {

            this._getBadgeValue(this.mfToExecute, this._contextObj.getGuid(), dojoLang.hitch(this, function(string) {
            this._badgeValue = string;
            this._setFavicon(string, callback);
                }));

            } else {
                dojoStyle.set(this.domNode, "display", "none");
            }



            // The callback, coming from update, needs to be executed, to let the page know it finished rendering
            mendix.lang.nullExec(callback);
        },

 

        _unsubscribe: function () {
          if (this._handles) {
              dojoArray.forEach(this._handles, function (handle) {
                  mx.data.unsubscribe(handle);
              });
              this._handles = [];
          }
        },

        _getBadgeValue: function(mf, guid, cb) {
            logger.debug(this.id + "._getBadgeValue");

            var mfParams = {};
            if (guid) {
                mfParams.applyto = "selection";
                mfParams.guids = [guid];
            }

            mx.ui.action(mf, {
                params: mfParams,
                callback: dojoLang.hitch(this, function(res) {
                    if (cb && typeof cb === "function") {
                        cb(res);
                    }
                }),
                error: dojoLang.hitch(this, function(error) {
                    console.warn(this.id + "._getTooltipMessage error: " + error.description);
                })
            }, this);
        },

        _setFavicon: function(string, callback) {
            logger.debug(this.id + "._setFavicon");

            var favicon=new favico({
                animation:this.animation});
                favicon.badge(string);
        },

        // Reset subscriptions.
        _resetSubscriptions: function () {
            logger.debug(this.id + "._resetSubscriptions");
            // Release handles on previous object, if any.
            this._unsubscribe();

            // When a mendix object exists create subscribtions.
            if (this._contextObj) {
                var objectHandle = mx.data.subscribe({
                    guid: this._contextObj.getGuid(),
                    callback: dojoLang.hitch(this, function (guid) {
                        this._updateRendering();
                    })
                });


                this._handles = [ objectHandle ];
            }
        }
    });
});

require(["FaviconBadge/widget/FaviconBadge"]);
