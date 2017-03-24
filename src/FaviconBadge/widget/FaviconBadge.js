/*global logger*/
/*
    FaviconBadge
    ========================

    @file      : FaviconBadge.js
    @version   : 1.2
    @author    : Paul Ketelaars
    @date      : 2017-03-17
    @copyright : TimeSeries 2017
    @license   : Apache 2

    Documentation
    ========================
    Show a badge next to your favicon
*/

// Required module list. Remove unnecessary modules, you can always get them back from the boilerplate.
define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",

    "mxui/dom",
    "dojo/dom",
    "dojo/dom-style",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/text",
    "dojo/html",
    "dojo/_base/event",

    "FaviconBadge/lib/favico"
], function (declare, _WidgetBase, dom, dojoDom, dojoStyle, dojoArray, dojoLang, dojoText, dojoHtml, dojoEvent, favico) {
    "use strict";


    // Declare widget's prototyp
    return declare("FaviconBadge.widget.FaviconBadge", [ _WidgetBase ], {

        // Parameters configured in the Modeler.
        mfToExecute: "",
        animation: "",
        parseToInt: "",
        bgColor: "",
        textColor: "",
        fontFamily: "",
        fontStyle: "",
        badgeType: "",
        badgePosition: "",

        // Internal variables. Non-primitives created in the prototype are shared between all widget instances.
        _handles: null,
        _contextObj: null,
        _readOnly: false,
        _badgeValue: null,

        favicon: null,

        // dojo.declare.constructor is called to construct the widget instance. Implement to initialize non-primitive properties.
        constructor: function () {
            logger.level(DEBUG);
            logger.debug(this.id + ".constructor");
            this._handles = [];
        },

        // dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
        postCreate: function () {
            logger.debug(this.id + ".postCreate");

            if (this.readOnly || this.get("disabled") || this.readonly) {
              this._readOnly = true;
            }

            this.favicon=new favico(
                {
                    animation:this.animation,
                    bgColor:this.bgColor,
                    textColor:this.textColor,
                    fontFamily:this.fontFamily,
                    fontStyle:this.fontStyle,
                    type:this.badgeType,
                    position:this.badgePosition,
                });
            this._updateRendering();
        },



        // mxui.widget._WidgetBase.update is called when context is changed or initialized. Implement to re-render and / or fetch data.
        update: function (obj, callback) {
            logger.debug(this.id + ".update");
            this._contextObj = obj;
            if (this._contextObj !== null){
            this._getBadgeValue(this.mfToExecute, this._contextObj.getGuid(), dojoLang.hitch(this, function(string) {
            this._badgeValue = string;
            this._setFavicon(string, callback);
                }));
          }

            this._resetSubscriptions();
            this._updateRendering(callback); // We're passing the callback to updateRendering to be called after DOM-manipulation
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
                    console.warn(this.id + ".getBadgeValue error: " + error.description);
                })
            }, this);
        },

        _setFavicon: function(string, callback) {
            logger.debug(this.id + "._setFavicon");

            if(this.parseToInt) {
                var stringAsInt = Number(string);
                if(isNaN(stringAsInt)) {
                    //console.log(stringAsInt + " is NaN!")
                    this.favicon.badge(string);
                } else {
                    //console.log(string + "parsed to Integer")
                    if(stringAsInt == 0) {
                    //console.log("badge set to zero");
                    this.favicon.badge(0); }
                    else {
                    this.favicon.badge(stringAsInt);
                    }
                }
            } else {
                this.favicon.badge(string);
            }
        },

        // Reset subscriptions.
        _resetSubscriptions: function () {
            logger.debug(this.id + "._resetSubscriptions");
            // Release handles on previous object, if any.
            this._unsubscribe();

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
