(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Things still to implement:
//
// 1. click limit - after 6 clicks, the map is revealed and the goal country is shown, with the previous clicks indicated
// 3. positive and negative feedback to user varies based upon how many attempts/clicks remaining
// 4. Keep a record of previous countries clicked/not clicked and how many clicks it took to get it
// 5. Tell the user how far away from the desired country their last click was!!!!!

$(document).ready( function () {
  "use strict";

  var countryToClick;
  var countryToClickCode;
  var countryList = [];

  /**
  http://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
  * Returns a random integer between min (inclusive) and max (inclusive)
  * Using Math.round() will give you a non-uniform distribution!
  */

  $.ajax({
    method: 'GET',
    url: 'https://restcountries.eu/rest/v1/all',
    success: function (data) {
      countryList = data;
      setupCountry(countryList);
    }, error: function (request,error) {
      console.error(request);
    }
  });

  function setupCountry(data) {
    var randCountryNum = Math.floor(Math.random() * (246 - 0 + 1)) + 0;
    countryToClickCode = data[randCountryNum].alpha2Code;
    countryToClick = data[randCountryNum].name;
    $(".modal").modal('show');
    $(".modal").html("Click on " + countryToClick + "<div class='modalInstructions'>(Click anywhere to start)</div>");
    $(".well").html("Click on " + countryToClick);
  }

// this stackoverflow helped me get my google maps call working: http://stackoverflow.com/questions/34466718/googlemaps-does-not-load-on-page-load

  var map;
  var markers = [];
  var markersLength;

  function resetMarkers() {
    for (var i=0;i<markers.length;i++) {
      markers[i].setMap(null);
    }
    markers = [];
  }

  window.initMap = function() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 42.29, lng: -85.585833},
      zoom: 3,
      mapTypeId: google.maps.MapTypeId.SATELLITE,
      disableDefaultUI: true,
      zoomControl: true,
      draggableCursor: 'crosshair'
    });

    //this gets the latitude and longitude of a user's click
    google.maps.event.addListener(map, "click", function(event) {

    var MarkerWithLabel = require('markerwithlabel')(google.maps);

    function placeMarker(location) {
      markersLength = (markers.length + 1).toString();

      var clickMarker = new MarkerWithLabel({
        position: location,
        map: map,
        labelContent: markersLength,
        labelAnchor: new google.maps.Point(10, 50),
        labelClass: "labels", // the CSS class for the label
        labelInBackground: false,
        icon: pinSymbol('red')
      });

      markers.push(clickMarker);
    }

    function pinSymbol(color) {
        return {
            path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
            fillColor: color,
            fillOpacity: 1,
            strokeColor: '#000',
            strokeWeight: 2,
            scale: 1.5
        };
    }

    //create an object with the clickevent's latlng information within it
    var clickedSpot = {position: event.latLng, map: map};
    // console.log(clickedSpot);
    //fetch the latitude of the click
    var latitude = clickedSpot.position.lat();
    // console.log(latitude);
    //fetch the longitude of the click
    var longitude = clickedSpot.position.lng();
    // console.log(longitude);

    //this function below gets the country name based on the latLng coordinates of the click
    // this documentation provided all of my answers: https://developers.google.com/maps/documentation/javascript/geocoding#ReverseGeocoding

      var geocoder = new google.maps.Geocoder;
      var latlng = {lat: latitude, lng: longitude};
      geocoder.geocode({'location': latlng}, function(results, status) {
        console.info(results);
        if (status === google.maps.GeocoderStatus.OK) {
          for (var i=0; i < results.length; i++){
            if (results[i].types[0] === "country"){
              var countryClicked = results[i].formatted_address;
              var clickedCountryCode = results[i].address_components[0].short_name;
              if (clickedCountryCode === countryToClickCode){
                placeMarker(event.latLng);
                victoryDisplay(countryClicked);
                // map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
                // $(".modal").modal('show');
                // $(".modal").html("You clicked on " + countryToClick + "<br>Awesome Job!<div class='modalInstructions'>(Refresh the page to have another go!)</div>");
              } else {
                placeMarker(event.latLng);
                $(".modal").modal('show');
                $(".modal").html("You clicked on " + countryClicked + "<br>Try again!");
              }
            } else {
              // do nothing - this level of results[i] does not contain the country name
            }
          }
        } else {
          console.log("geolocator is not ok");
          $(".modal").modal('show');
          $(".modal").html("Whoops! You clicked on unclaimed territory! <br>Try again!");
        }

      });

    });

  }

  function victoryDisplay(countryClicked) {
    map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
    $(".modal").modal('show');
    var msg = "";
    if (markers.length == 1) {
      msg = "You got "+ countryClicked + " on the first try!"
    } else {
      msg = "You clicked on " + countryClicked + " after "+ markers.length +" tries!"
    }
    $(".modal").html(msg + "<br>Awesome Job!<div class='modalInstructions'>Click anywhere to see all your clicks!</div>");
    $(".well").html("<div class='well'><a href='javascript:window.location.reload();'>Find a new country!</a></div>");
  }

  // $(document).on('keydown',function(e) {
  //   if (e.which == 78) {
  //     startNewRound();
  //   }
  // });
  //
  function startNewRound() {
    map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
    resetMarkers();
    setupCountry(countryList);
  }

});

},{"markerwithlabel":2}],2:[function(require,module,exports){
/**
 * @name MarkerWithLabel for V3
 * @version 1.1.9 [June 30, 2013]
 * @author Gary Little (inspired by code from Marc Ridey of Google).
 * @copyright Copyright 2012 Gary Little [gary at luxcentral.com]
 * @fileoverview MarkerWithLabel extends the Google Maps JavaScript API V3
 *  <code>google.maps.Marker</code> class.
 *  <p>
 *  MarkerWithLabel allows you to define markers with associated labels. As you would expect,
 *  if the marker is draggable, so too will be the label. In addition, a marker with a label
 *  responds to all mouse events in the same manner as a regular marker. It also fires mouse
 *  events and "property changed" events just as a regular marker would. Version 1.1 adds
 *  support for the raiseOnDrag feature introduced in API V3.3.
 *  <p>
 *  If you drag a marker by its label, you can cancel the drag and return the marker to its
 *  original position by pressing the <code>Esc</code> key. This doesn't work if you drag the marker
 *  itself because this feature is not (yet) supported in the <code>google.maps.Marker</code> class.
 */

/*!
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*jslint browser:true */
/*global document,google */

/**
 * @param {Function} childCtor Child class.
 * @param {Function} parentCtor Parent class.
 */
function inherits(childCtor, parentCtor) {
  /** @constructor */
  function tempCtor() {};
  tempCtor.prototype = parentCtor.prototype;
  childCtor.superClass_ = parentCtor.prototype;
  childCtor.prototype = new tempCtor();
  /** @override */
  childCtor.prototype.constructor = childCtor;
}

/**
 * @param {Object} gMapsApi The Google Maps API instance (usually `google.maps`)
 * @return {Function} The instantiable MarkerWithLabel class
 */
module.exports = function(gMapsApi) {

  /**
   * This constructor creates a label and associates it with a marker.
   * It is for the private use of the MarkerWithLabel class.
   * @constructor
   * @param {Marker} marker The marker with which the label is to be associated.
   * @param {string} crossURL The URL of the cross image =.
   * @param {string} handCursor The URL of the hand cursor.
   * @private
   */
  function MarkerLabel_(marker, crossURL, handCursorURL) {
    this.marker_ = marker;
    this.handCursorURL_ = marker.handCursorURL;

    this.labelDiv_ = document.createElement("div");
    this.labelDiv_.style.cssText = "position: absolute; overflow: hidden;";

    // Set up the DIV for handling mouse events in the label. This DIV forms a transparent veil
    // in the "overlayMouseTarget" pane, a veil that covers just the label. This is done so that
    // events can be captured even if the label is in the shadow of a google.maps.InfoWindow.
    // Code is included here to ensure the veil is always exactly the same size as the label.
    this.eventDiv_ = document.createElement("div");
    this.eventDiv_.style.cssText = this.labelDiv_.style.cssText;

    // This is needed for proper behavior on MSIE:
    this.eventDiv_.setAttribute("onselectstart", "return false;");
    this.eventDiv_.setAttribute("ondragstart", "return false;");

    // Get the DIV for the "X" to be displayed when the marker is raised.
    this.crossDiv_ = MarkerLabel_.getSharedCross(crossURL);
  }
  inherits(MarkerLabel_, gMapsApi.OverlayView);

  /**
   * Returns the DIV for the cross used when dragging a marker when the
   * raiseOnDrag parameter set to true. One cross is shared with all markers.
   * @param {string} crossURL The URL of the cross image =.
   * @private
   */
  MarkerLabel_.getSharedCross = function (crossURL) {
    var div;
    if (typeof MarkerLabel_.getSharedCross.crossDiv === "undefined") {
      div = document.createElement("img");
      div.style.cssText = "position: absolute; z-index: 1000002; display: none;";
      // Hopefully Google never changes the standard "X" attributes:
      div.style.marginLeft = "-8px";
      div.style.marginTop = "-9px";
      div.src = crossURL;
      MarkerLabel_.getSharedCross.crossDiv = div;
    }
    return MarkerLabel_.getSharedCross.crossDiv;
  };

  /**
   * Adds the DIV representing the label to the DOM. This method is called
   * automatically when the marker's <code>setMap</code> method is called.
   * @private
   */
  MarkerLabel_.prototype.onAdd = function () {
    var me = this;
    var cMouseIsDown = false;
    var cDraggingLabel = false;
    var cSavedZIndex;
    var cLatOffset, cLngOffset;
    var cIgnoreClick;
    var cRaiseEnabled;
    var cStartPosition;
    var cStartCenter;
    // Constants:
    var cRaiseOffset = 20;
    var cDraggingCursor = "url(" + this.handCursorURL_ + ")";

    // Stops all processing of an event.
    //
    var cAbortEvent = function (e) {
      if (e.preventDefault) {
        e.preventDefault();
      }
      e.cancelBubble = true;
      if (e.stopPropagation) {
        e.stopPropagation();
      }
    };

    var cStopBounce = function () {
      me.marker_.setAnimation(null);
    };

    this.getPanes().markerLayer.appendChild(this.labelDiv_);
    this.getPanes().overlayMouseTarget.appendChild(this.eventDiv_);
    // One cross is shared with all markers, so only add it once:
    if (typeof MarkerLabel_.getSharedCross.processed === "undefined") {
      this.getPanes().markerLayer.appendChild(this.crossDiv_);
      MarkerLabel_.getSharedCross.processed = true;
    }

    this.listeners_ = [
      gMapsApi.event.addDomListener(this.eventDiv_, "mouseover", function (e) {
        if (me.marker_.getDraggable() || me.marker_.getClickable()) {
          this.style.cursor = "pointer";
          gMapsApi.event.trigger(me.marker_, "mouseover", e);
        }
      }),
      gMapsApi.event.addDomListener(this.eventDiv_, "mouseout", function (e) {
        if ((me.marker_.getDraggable() || me.marker_.getClickable()) && !cDraggingLabel) {
          this.style.cursor = me.marker_.getCursor();
          gMapsApi.event.trigger(me.marker_, "mouseout", e);
        }
      }),
      gMapsApi.event.addDomListener(this.eventDiv_, "mousedown", function (e) {
        cDraggingLabel = false;
        if (me.marker_.getDraggable()) {
          cMouseIsDown = true;
          this.style.cursor = cDraggingCursor;
        }
        if (me.marker_.getDraggable() || me.marker_.getClickable()) {
          gMapsApi.event.trigger(me.marker_, "mousedown", e);
          cAbortEvent(e); // Prevent map pan when starting a drag on a label
        }
      }),
      gMapsApi.event.addDomListener(document, "mouseup", function (mEvent) {
        var position;
        if (cMouseIsDown) {
          cMouseIsDown = false;
          me.eventDiv_.style.cursor = "pointer";
          gMapsApi.event.trigger(me.marker_, "mouseup", mEvent);
        }
        if (cDraggingLabel) {
          if (cRaiseEnabled) { // Lower the marker & label
            position = me.getProjection().fromLatLngToDivPixel(me.marker_.getPosition());
            position.y += cRaiseOffset;
            me.marker_.setPosition(me.getProjection().fromDivPixelToLatLng(position));
            // This is not the same bouncing style as when the marker portion is dragged,
            // but it will have to do:
            try { // Will fail if running Google Maps API earlier than V3.3
              me.marker_.setAnimation(gMapsApi.Animation.BOUNCE);
              setTimeout(cStopBounce, 1406);
            } catch (e) {}
          }
          me.crossDiv_.style.display = "none";
          me.marker_.setZIndex(cSavedZIndex);
          cIgnoreClick = true; // Set flag to ignore the click event reported after a label drag
          cDraggingLabel = false;
          mEvent.latLng = me.marker_.getPosition();
          gMapsApi.event.trigger(me.marker_, "dragend", mEvent);
        }
      }),
      gMapsApi.event.addListener(me.marker_.getMap(), "mousemove", function (mEvent) {
        var position;
        if (cMouseIsDown) {
          if (cDraggingLabel) {
            // Change the reported location from the mouse position to the marker position:
            mEvent.latLng = new gMapsApi.LatLng(mEvent.latLng.lat() - cLatOffset, mEvent.latLng.lng() - cLngOffset);
            position = me.getProjection().fromLatLngToDivPixel(mEvent.latLng);
            if (cRaiseEnabled) {
              me.crossDiv_.style.left = position.x + "px";
              me.crossDiv_.style.top = position.y + "px";
              me.crossDiv_.style.display = "";
              position.y -= cRaiseOffset;
            }
            me.marker_.setPosition(me.getProjection().fromDivPixelToLatLng(position));
            if (cRaiseEnabled) { // Don't raise the veil; this hack needed to make MSIE act properly
              me.eventDiv_.style.top = (position.y + cRaiseOffset) + "px";
            }
            gMapsApi.event.trigger(me.marker_, "drag", mEvent);
          } else {
            // Calculate offsets from the click point to the marker position:
            cLatOffset = mEvent.latLng.lat() - me.marker_.getPosition().lat();
            cLngOffset = mEvent.latLng.lng() - me.marker_.getPosition().lng();
            cSavedZIndex = me.marker_.getZIndex();
            cStartPosition = me.marker_.getPosition();
            cStartCenter = me.marker_.getMap().getCenter();
            cRaiseEnabled = me.marker_.get("raiseOnDrag");
            cDraggingLabel = true;
            me.marker_.setZIndex(1000000); // Moves the marker & label to the foreground during a drag
            mEvent.latLng = me.marker_.getPosition();
            gMapsApi.event.trigger(me.marker_, "dragstart", mEvent);
          }
        }
      }),
      gMapsApi.event.addDomListener(document, "keydown", function (e) {
        if (cDraggingLabel) {
          if (e.keyCode === 27) { // Esc key
            cRaiseEnabled = false;
            me.marker_.setPosition(cStartPosition);
            me.marker_.getMap().setCenter(cStartCenter);
            gMapsApi.event.trigger(document, "mouseup", e);
          }
        }
      }),
      gMapsApi.event.addDomListener(this.eventDiv_, "click", function (e) {
        if (me.marker_.getDraggable() || me.marker_.getClickable()) {
          if (cIgnoreClick) { // Ignore the click reported when a label drag ends
            cIgnoreClick = false;
          } else {
            gMapsApi.event.trigger(me.marker_, "click", e);
            cAbortEvent(e); // Prevent click from being passed on to map
          }
        }
      }),
      gMapsApi.event.addDomListener(this.eventDiv_, "dblclick", function (e) {
        if (me.marker_.getDraggable() || me.marker_.getClickable()) {
          gMapsApi.event.trigger(me.marker_, "dblclick", e);
          cAbortEvent(e); // Prevent map zoom when double-clicking on a label
        }
      }),
      gMapsApi.event.addListener(this.marker_, "dragstart", function (mEvent) {
        if (!cDraggingLabel) {
          cRaiseEnabled = this.get("raiseOnDrag");
        }
      }),
      gMapsApi.event.addListener(this.marker_, "drag", function (mEvent) {
        if (!cDraggingLabel) {
          if (cRaiseEnabled) {
            me.setPosition(cRaiseOffset);
            // During a drag, the marker's z-index is temporarily set to 1000000 to
            // ensure it appears above all other markers. Also set the label's z-index
            // to 1000000 (plus or minus 1 depending on whether the label is supposed
            // to be above or below the marker).
            me.labelDiv_.style.zIndex = 1000000 + (this.get("labelInBackground") ? -1 : +1);
          }
        }
      }),
      gMapsApi.event.addListener(this.marker_, "dragend", function (mEvent) {
        if (!cDraggingLabel) {
          if (cRaiseEnabled) {
            me.setPosition(0); // Also restores z-index of label
          }
        }
      }),
      gMapsApi.event.addListener(this.marker_, "position_changed", function () {
        me.setPosition();
      }),
      gMapsApi.event.addListener(this.marker_, "zindex_changed", function () {
        me.setZIndex();
      }),
      gMapsApi.event.addListener(this.marker_, "visible_changed", function () {
        me.setVisible();
      }),
      gMapsApi.event.addListener(this.marker_, "labelvisible_changed", function () {
        me.setVisible();
      }),
      gMapsApi.event.addListener(this.marker_, "title_changed", function () {
        me.setTitle();
      }),
      gMapsApi.event.addListener(this.marker_, "labelcontent_changed", function () {
        me.setContent();
      }),
      gMapsApi.event.addListener(this.marker_, "labelanchor_changed", function () {
        me.setAnchor();
      }),
      gMapsApi.event.addListener(this.marker_, "labelclass_changed", function () {
        me.setStyles();
      }),
      gMapsApi.event.addListener(this.marker_, "labelstyle_changed", function () {
        me.setStyles();
      })
    ];
  };

  /**
   * Removes the DIV for the label from the DOM. It also removes all event handlers.
   * This method is called automatically when the marker's <code>setMap(null)</code>
   * method is called.
   * @private
   */
  MarkerLabel_.prototype.onRemove = function () {
    var i;
    this.labelDiv_.parentNode.removeChild(this.labelDiv_);
    this.eventDiv_.parentNode.removeChild(this.eventDiv_);

    // Remove event listeners:
    for (i = 0; i < this.listeners_.length; i++) {
      gMapsApi.event.removeListener(this.listeners_[i]);
    }
  };

  /**
   * Draws the label on the map.
   * @private
   */
  MarkerLabel_.prototype.draw = function () {
    this.setContent();
    this.setTitle();
    this.setStyles();
  };

  /**
   * Sets the content of the label.
   * The content can be plain text or an HTML DOM node.
   * @private
   */
  MarkerLabel_.prototype.setContent = function () {
    var content = this.marker_.get("labelContent");
    if (typeof content.nodeType === "undefined") {
      this.labelDiv_.innerHTML = content;
      this.eventDiv_.innerHTML = this.labelDiv_.innerHTML;
    } else {
      // Remove current content
      while (this.labelDiv_.lastChild) {
        this.labelDiv_.removeChild(this.labelDiv_.lastChild);
      }

      while (this.eventDiv_.lastChild) {
        this.eventDiv_.removeChild(this.eventDiv_.lastChild);
      }

      this.labelDiv_.appendChild(content);
      content = content.cloneNode(true);
      this.eventDiv_.appendChild(content);
    }
  };

  /**
   * Sets the content of the tool tip for the label. It is
   * always set to be the same as for the marker itself.
   * @private
   */
  MarkerLabel_.prototype.setTitle = function () {
    this.eventDiv_.title = this.marker_.getTitle() || "";
  };

  /**
   * Sets the style of the label by setting the style sheet and applying
   * other specific styles requested.
   * @private
   */
  MarkerLabel_.prototype.setStyles = function () {
    var i, labelStyle;

    // Apply style values from the style sheet defined in the labelClass parameter:
    this.labelDiv_.className = this.marker_.get("labelClass");
    this.eventDiv_.className = this.labelDiv_.className;

    // Clear existing inline style values:
    this.labelDiv_.style.cssText = "";
    this.eventDiv_.style.cssText = "";
    // Apply style values defined in the labelStyle parameter:
    labelStyle = this.marker_.get("labelStyle");
    for (i in labelStyle) {
      if (labelStyle.hasOwnProperty(i)) {
        this.labelDiv_.style[i] = labelStyle[i];
        this.eventDiv_.style[i] = labelStyle[i];
      }
    }
    this.setMandatoryStyles();
  };

  /**
   * Sets the mandatory styles to the DIV representing the label as well as to the
   * associated event DIV. This includes setting the DIV position, z-index, and visibility.
   * @private
   */
  MarkerLabel_.prototype.setMandatoryStyles = function () {
    this.labelDiv_.style.position = "absolute";
    this.labelDiv_.style.overflow = "hidden";
    // Make sure the opacity setting causes the desired effect on MSIE:
    if (typeof this.labelDiv_.style.opacity !== "undefined" && this.labelDiv_.style.opacity !== "") {
      this.labelDiv_.style.MsFilter = "\"progid:DXImageTransform.Microsoft.Alpha(opacity=" + (this.labelDiv_.style.opacity * 100) + ")\"";
      this.labelDiv_.style.filter = "alpha(opacity=" + (this.labelDiv_.style.opacity * 100) + ")";
    }

    this.eventDiv_.style.position = this.labelDiv_.style.position;
    this.eventDiv_.style.overflow = this.labelDiv_.style.overflow;
    this.eventDiv_.style.opacity = 0.01; // Don't use 0; DIV won't be clickable on MSIE
    this.eventDiv_.style.MsFilter = "\"progid:DXImageTransform.Microsoft.Alpha(opacity=1)\"";
    this.eventDiv_.style.filter = "alpha(opacity=1)"; // For MSIE

    this.setAnchor();
    this.setPosition(); // This also updates z-index, if necessary.
    this.setVisible();
  };

  /**
   * Sets the anchor point of the label.
   * @private
   */
  MarkerLabel_.prototype.setAnchor = function () {
    var anchor = this.marker_.get("labelAnchor");
    this.labelDiv_.style.marginLeft = -anchor.x + "px";
    this.labelDiv_.style.marginTop = -anchor.y + "px";
    this.eventDiv_.style.marginLeft = -anchor.x + "px";
    this.eventDiv_.style.marginTop = -anchor.y + "px";
  };

  /**
   * Sets the position of the label. The z-index is also updated, if necessary.
   * @private
   */
  MarkerLabel_.prototype.setPosition = function (yOffset) {
    var position = this.getProjection().fromLatLngToDivPixel(this.marker_.getPosition());
    if (typeof yOffset === "undefined") {
      yOffset = 0;
    }
    this.labelDiv_.style.left = Math.round(position.x) + "px";
    this.labelDiv_.style.top = Math.round(position.y - yOffset) + "px";
    this.eventDiv_.style.left = this.labelDiv_.style.left;
    this.eventDiv_.style.top = this.labelDiv_.style.top;

    this.setZIndex();
  };

  /**
   * Sets the z-index of the label. If the marker's z-index property has not been defined, the z-index
   * of the label is set to the vertical coordinate of the label. This is in keeping with the default
   * stacking order for Google Maps: markers to the south are in front of markers to the north.
   * @private
   */
  MarkerLabel_.prototype.setZIndex = function () {
    var zAdjust = (this.marker_.get("labelInBackground") ? -1 : +1);
    if (typeof this.marker_.getZIndex() === "undefined") {
      this.labelDiv_.style.zIndex = parseInt(this.labelDiv_.style.top, 10) + zAdjust;
      this.eventDiv_.style.zIndex = this.labelDiv_.style.zIndex;
    } else {
      this.labelDiv_.style.zIndex = this.marker_.getZIndex() + zAdjust;
      this.eventDiv_.style.zIndex = this.labelDiv_.style.zIndex;
    }
  };

  /**
   * Sets the visibility of the label. The label is visible only if the marker itself is
   * visible (i.e., its visible property is true) and the labelVisible property is true.
   * @private
   */
  MarkerLabel_.prototype.setVisible = function () {
    if (this.marker_.get("labelVisible")) {
      this.labelDiv_.style.display = this.marker_.getVisible() ? "block" : "none";
    } else {
      this.labelDiv_.style.display = "none";
    }
    this.eventDiv_.style.display = this.labelDiv_.style.display;
  };

  /**
   * @name MarkerWithLabelOptions
   * @class This class represents the optional parameter passed to the {@link MarkerWithLabel} constructor.
   *  The properties available are the same as for <code>google.maps.Marker</code> with the addition
   *  of the properties listed below. To change any of these additional properties after the labeled
   *  marker has been created, call <code>google.maps.Marker.set(propertyName, propertyValue)</code>.
   *  <p>
   *  When any of these properties changes, a property changed event is fired. The names of these
   *  events are derived from the name of the property and are of the form <code>propertyname_changed</code>.
   *  For example, if the content of the label changes, a <code>labelcontent_changed</code> event
   *  is fired.
   *  <p>
   * @property {string|Node} [labelContent] The content of the label (plain text or an HTML DOM node).
   * @property {Point} [labelAnchor] By default, a label is drawn with its anchor point at (0,0) so
   *  that its top left corner is positioned at the anchor point of the associated marker. Use this
   *  property to change the anchor point of the label. For example, to center a 50px-wide label
   *  beneath a marker, specify a <code>labelAnchor</code> of <code>google.maps.Point(25, 0)</code>.
   *  (Note: x-values increase to the right and y-values increase to the top.)
   * @property {string} [labelClass] The name of the CSS class defining the styles for the label.
   *  Note that style values for <code>position</code>, <code>overflow</code>, <code>top</code>,
   *  <code>left</code>, <code>zIndex</code>, <code>display</code>, <code>marginLeft</code>, and
   *  <code>marginTop</code> are ignored; these styles are for internal use only.
   * @property {Object} [labelStyle] An object literal whose properties define specific CSS
   *  style values to be applied to the label. Style values defined here override those that may
   *  be defined in the <code>labelClass</code> style sheet. If this property is changed after the
   *  label has been created, all previously set styles (except those defined in the style sheet)
   *  are removed from the label before the new style values are applied.
   *  Note that style values for <code>position</code>, <code>overflow</code>, <code>top</code>,
   *  <code>left</code>, <code>zIndex</code>, <code>display</code>, <code>marginLeft</code>, and
   *  <code>marginTop</code> are ignored; these styles are for internal use only.
   * @property {boolean} [labelInBackground] A flag indicating whether a label that overlaps its
   *  associated marker should appear in the background (i.e., in a plane below the marker).
   *  The default is <code>false</code>, which causes the label to appear in the foreground.
   * @property {boolean} [labelVisible] A flag indicating whether the label is to be visible.
   *  The default is <code>true</code>. Note that even if <code>labelVisible</code> is
   *  <code>true</code>, the label will <i>not</i> be visible unless the associated marker is also
   *  visible (i.e., unless the marker's <code>visible</code> property is <code>true</code>).
   * @property {boolean} [raiseOnDrag] A flag indicating whether the label and marker are to be
   *  raised when the marker is dragged. The default is <code>true</code>. If a draggable marker is
   *  being created and a version of Google Maps API earlier than V3.3 is being used, this property
   *  must be set to <code>false</code>.
   * @property {boolean} [optimized] A flag indicating whether rendering is to be optimized for the
   *  marker. <b>Important: The optimized rendering technique is not supported by MarkerWithLabel,
   *  so the value of this parameter is always forced to <code>false</code>.
   * @property {string} [crossImage="http://maps.gstatic.com/intl/en_us/mapfiles/drag_cross_67_16.png"]
   *  The URL of the cross image to be displayed while dragging a marker.
   * @property {string} [handCursor="http://maps.gstatic.com/intl/en_us/mapfiles/closedhand_8_8.cur"]
   *  The URL of the cursor to be displayed while dragging a marker.
   */
  /**
   * Creates a MarkerWithLabel with the options specified in {@link MarkerWithLabelOptions}.
   * @constructor
   * @param {MarkerWithLabelOptions} [opt_options] The optional parameters.
   */
  function MarkerWithLabel(opt_options) {
    opt_options = opt_options || {};
    opt_options.labelContent = opt_options.labelContent || "";
    opt_options.labelAnchor = opt_options.labelAnchor || new gMapsApi.Point(0, 0);
    opt_options.labelClass = opt_options.labelClass || "markerLabels";
    opt_options.labelStyle = opt_options.labelStyle || {};
    opt_options.labelInBackground = opt_options.labelInBackground || false;
    if (typeof opt_options.labelVisible === "undefined") {
      opt_options.labelVisible = true;
    }
    if (typeof opt_options.raiseOnDrag === "undefined") {
      opt_options.raiseOnDrag = true;
    }
    if (typeof opt_options.clickable === "undefined") {
      opt_options.clickable = true;
    }
    if (typeof opt_options.draggable === "undefined") {
      opt_options.draggable = false;
    }
    if (typeof opt_options.optimized === "undefined") {
      opt_options.optimized = false;
    }
    opt_options.crossImage = opt_options.crossImage || "http" + (document.location.protocol === "https:" ? "s" : "") + "://maps.gstatic.com/intl/en_us/mapfiles/drag_cross_67_16.png";
    opt_options.handCursor = opt_options.handCursor || "http" + (document.location.protocol === "https:" ? "s" : "") + "://maps.gstatic.com/intl/en_us/mapfiles/closedhand_8_8.cur";
    opt_options.optimized = false; // Optimized rendering is not supported

    this.label = new MarkerLabel_(this, opt_options.crossImage, opt_options.handCursor); // Bind the label to the marker

    // Call the parent constructor. It calls Marker.setValues to initialize, so all
    // the new parameters are conveniently saved and can be accessed with get/set.
    // Marker.set triggers a property changed event (called "propertyname_changed")
    // that the marker label listens for in order to react to state changes.
    gMapsApi.Marker.apply(this, arguments);
  }
  inherits(MarkerWithLabel, gMapsApi.Marker);

  /**
   * Overrides the standard Marker setMap function.
   * @param {Map} theMap The map to which the marker is to be added.
   * @private
   */
  MarkerWithLabel.prototype.setMap = function (theMap) {

    // Call the inherited function...
    gMapsApi.Marker.prototype.setMap.apply(this, arguments);

    // ... then deal with the label:
    this.label.setMap(theMap);
  };

  return MarkerWithLabel;
}

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImFzc2V0cy9qcy9zY3JpcHRzLmpzIiwibm9kZV9tb2R1bGVzL21hcmtlcndpdGhsYWJlbC9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyBUaGluZ3Mgc3RpbGwgdG8gaW1wbGVtZW50OlxuLy9cbi8vIDEuIGNsaWNrIGxpbWl0IC0gYWZ0ZXIgNiBjbGlja3MsIHRoZSBtYXAgaXMgcmV2ZWFsZWQgYW5kIHRoZSBnb2FsIGNvdW50cnkgaXMgc2hvd24sIHdpdGggdGhlIHByZXZpb3VzIGNsaWNrcyBpbmRpY2F0ZWRcbi8vIDMuIHBvc2l0aXZlIGFuZCBuZWdhdGl2ZSBmZWVkYmFjayB0byB1c2VyIHZhcmllcyBiYXNlZCB1cG9uIGhvdyBtYW55IGF0dGVtcHRzL2NsaWNrcyByZW1haW5pbmdcbi8vIDQuIEtlZXAgYSByZWNvcmQgb2YgcHJldmlvdXMgY291bnRyaWVzIGNsaWNrZWQvbm90IGNsaWNrZWQgYW5kIGhvdyBtYW55IGNsaWNrcyBpdCB0b29rIHRvIGdldCBpdFxuLy8gNS4gVGVsbCB0aGUgdXNlciBob3cgZmFyIGF3YXkgZnJvbSB0aGUgZGVzaXJlZCBjb3VudHJ5IHRoZWlyIGxhc3QgY2xpY2sgd2FzISEhISFcblxuJChkb2N1bWVudCkucmVhZHkoIGZ1bmN0aW9uICgpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgdmFyIGNvdW50cnlUb0NsaWNrO1xuICB2YXIgY291bnRyeVRvQ2xpY2tDb2RlO1xuICB2YXIgY291bnRyeUxpc3QgPSBbXTtcblxuICAvKipcbiAgaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xNTI3ODAzL2dlbmVyYXRpbmctcmFuZG9tLXdob2xlLW51bWJlcnMtaW4tamF2YXNjcmlwdC1pbi1hLXNwZWNpZmljLXJhbmdlXG4gICogUmV0dXJucyBhIHJhbmRvbSBpbnRlZ2VyIGJldHdlZW4gbWluIChpbmNsdXNpdmUpIGFuZCBtYXggKGluY2x1c2l2ZSlcbiAgKiBVc2luZyBNYXRoLnJvdW5kKCkgd2lsbCBnaXZlIHlvdSBhIG5vbi11bmlmb3JtIGRpc3RyaWJ1dGlvbiFcbiAgKi9cblxuICAkLmFqYXgoe1xuICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgdXJsOiAnaHR0cHM6Ly9yZXN0Y291bnRyaWVzLmV1L3Jlc3QvdjEvYWxsJyxcbiAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgY291bnRyeUxpc3QgPSBkYXRhO1xuICAgICAgc2V0dXBDb3VudHJ5KGNvdW50cnlMaXN0KTtcbiAgICB9LCBlcnJvcjogZnVuY3Rpb24gKHJlcXVlc3QsZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IocmVxdWVzdCk7XG4gICAgfVxuICB9KTtcblxuICBmdW5jdGlvbiBzZXR1cENvdW50cnkoZGF0YSkge1xuICAgIHZhciByYW5kQ291bnRyeU51bSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICgyNDYgLSAwICsgMSkpICsgMDtcbiAgICBjb3VudHJ5VG9DbGlja0NvZGUgPSBkYXRhW3JhbmRDb3VudHJ5TnVtXS5hbHBoYTJDb2RlO1xuICAgIGNvdW50cnlUb0NsaWNrID0gZGF0YVtyYW5kQ291bnRyeU51bV0ubmFtZTtcbiAgICAkKFwiLm1vZGFsXCIpLm1vZGFsKCdzaG93Jyk7XG4gICAgJChcIi5tb2RhbFwiKS5odG1sKFwiQ2xpY2sgb24gXCIgKyBjb3VudHJ5VG9DbGljayArIFwiPGRpdiBjbGFzcz0nbW9kYWxJbnN0cnVjdGlvbnMnPihDbGljayBhbnl3aGVyZSB0byBzdGFydCk8L2Rpdj5cIik7XG4gICAgJChcIi53ZWxsXCIpLmh0bWwoXCJDbGljayBvbiBcIiArIGNvdW50cnlUb0NsaWNrKTtcbiAgfVxuXG4vLyB0aGlzIHN0YWNrb3ZlcmZsb3cgaGVscGVkIG1lIGdldCBteSBnb29nbGUgbWFwcyBjYWxsIHdvcmtpbmc6IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMzQ0NjY3MTgvZ29vZ2xlbWFwcy1kb2VzLW5vdC1sb2FkLW9uLXBhZ2UtbG9hZFxuXG4gIHZhciBtYXA7XG4gIHZhciBtYXJrZXJzID0gW107XG4gIHZhciBtYXJrZXJzTGVuZ3RoO1xuXG4gIGZ1bmN0aW9uIHJlc2V0TWFya2VycygpIHtcbiAgICBmb3IgKHZhciBpPTA7aTxtYXJrZXJzLmxlbmd0aDtpKyspIHtcbiAgICAgIG1hcmtlcnNbaV0uc2V0TWFwKG51bGwpO1xuICAgIH1cbiAgICBtYXJrZXJzID0gW107XG4gIH1cblxuICB3aW5kb3cuaW5pdE1hcCA9IGZ1bmN0aW9uKCkge1xuICAgIG1hcCA9IG5ldyBnb29nbGUubWFwcy5NYXAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcCcpLCB7XG4gICAgICBjZW50ZXI6IHtsYXQ6IDQyLjI5LCBsbmc6IC04NS41ODU4MzN9LFxuICAgICAgem9vbTogMyxcbiAgICAgIG1hcFR5cGVJZDogZ29vZ2xlLm1hcHMuTWFwVHlwZUlkLlNBVEVMTElURSxcbiAgICAgIGRpc2FibGVEZWZhdWx0VUk6IHRydWUsXG4gICAgICB6b29tQ29udHJvbDogdHJ1ZSxcbiAgICAgIGRyYWdnYWJsZUN1cnNvcjogJ2Nyb3NzaGFpcidcbiAgICB9KTtcblxuICAgIC8vdGhpcyBnZXRzIHRoZSBsYXRpdHVkZSBhbmQgbG9uZ2l0dWRlIG9mIGEgdXNlcidzIGNsaWNrXG4gICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIobWFwLCBcImNsaWNrXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG5cbiAgICB2YXIgTWFya2VyV2l0aExhYmVsID0gcmVxdWlyZSgnbWFya2Vyd2l0aGxhYmVsJykoZ29vZ2xlLm1hcHMpO1xuXG4gICAgZnVuY3Rpb24gcGxhY2VNYXJrZXIobG9jYXRpb24pIHtcbiAgICAgIG1hcmtlcnNMZW5ndGggPSAobWFya2Vycy5sZW5ndGggKyAxKS50b1N0cmluZygpO1xuXG4gICAgICB2YXIgY2xpY2tNYXJrZXIgPSBuZXcgTWFya2VyV2l0aExhYmVsKHtcbiAgICAgICAgcG9zaXRpb246IGxvY2F0aW9uLFxuICAgICAgICBtYXA6IG1hcCxcbiAgICAgICAgbGFiZWxDb250ZW50OiBtYXJrZXJzTGVuZ3RoLFxuICAgICAgICBsYWJlbEFuY2hvcjogbmV3IGdvb2dsZS5tYXBzLlBvaW50KDEwLCA1MCksXG4gICAgICAgIGxhYmVsQ2xhc3M6IFwibGFiZWxzXCIsIC8vIHRoZSBDU1MgY2xhc3MgZm9yIHRoZSBsYWJlbFxuICAgICAgICBsYWJlbEluQmFja2dyb3VuZDogZmFsc2UsXG4gICAgICAgIGljb246IHBpblN5bWJvbCgncmVkJylcbiAgICAgIH0pO1xuXG4gICAgICBtYXJrZXJzLnB1c2goY2xpY2tNYXJrZXIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBpblN5bWJvbChjb2xvcikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcGF0aDogJ00gMCwwIEMgLTIsLTIwIC0xMCwtMjIgLTEwLC0zMCBBIDEwLDEwIDAgMSwxIDEwLC0zMCBDIDEwLC0yMiAyLC0yMCAwLDAgeicsXG4gICAgICAgICAgICBmaWxsQ29sb3I6IGNvbG9yLFxuICAgICAgICAgICAgZmlsbE9wYWNpdHk6IDEsXG4gICAgICAgICAgICBzdHJva2VDb2xvcjogJyMwMDAnLFxuICAgICAgICAgICAgc3Ryb2tlV2VpZ2h0OiAyLFxuICAgICAgICAgICAgc2NhbGU6IDEuNVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8vY3JlYXRlIGFuIG9iamVjdCB3aXRoIHRoZSBjbGlja2V2ZW50J3MgbGF0bG5nIGluZm9ybWF0aW9uIHdpdGhpbiBpdFxuICAgIHZhciBjbGlja2VkU3BvdCA9IHtwb3NpdGlvbjogZXZlbnQubGF0TG5nLCBtYXA6IG1hcH07XG4gICAgLy8gY29uc29sZS5sb2coY2xpY2tlZFNwb3QpO1xuICAgIC8vZmV0Y2ggdGhlIGxhdGl0dWRlIG9mIHRoZSBjbGlja1xuICAgIHZhciBsYXRpdHVkZSA9IGNsaWNrZWRTcG90LnBvc2l0aW9uLmxhdCgpO1xuICAgIC8vIGNvbnNvbGUubG9nKGxhdGl0dWRlKTtcbiAgICAvL2ZldGNoIHRoZSBsb25naXR1ZGUgb2YgdGhlIGNsaWNrXG4gICAgdmFyIGxvbmdpdHVkZSA9IGNsaWNrZWRTcG90LnBvc2l0aW9uLmxuZygpO1xuICAgIC8vIGNvbnNvbGUubG9nKGxvbmdpdHVkZSk7XG5cbiAgICAvL3RoaXMgZnVuY3Rpb24gYmVsb3cgZ2V0cyB0aGUgY291bnRyeSBuYW1lIGJhc2VkIG9uIHRoZSBsYXRMbmcgY29vcmRpbmF0ZXMgb2YgdGhlIGNsaWNrXG4gICAgLy8gdGhpcyBkb2N1bWVudGF0aW9uIHByb3ZpZGVkIGFsbCBvZiBteSBhbnN3ZXJzOiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9nZW9jb2RpbmcjUmV2ZXJzZUdlb2NvZGluZ1xuXG4gICAgICB2YXIgZ2VvY29kZXIgPSBuZXcgZ29vZ2xlLm1hcHMuR2VvY29kZXI7XG4gICAgICB2YXIgbGF0bG5nID0ge2xhdDogbGF0aXR1ZGUsIGxuZzogbG9uZ2l0dWRlfTtcbiAgICAgIGdlb2NvZGVyLmdlb2NvZGUoeydsb2NhdGlvbic6IGxhdGxuZ30sIGZ1bmN0aW9uKHJlc3VsdHMsIHN0YXR1cykge1xuICAgICAgICBjb25zb2xlLmluZm8ocmVzdWx0cyk7XG4gICAgICAgIGlmIChzdGF0dXMgPT09IGdvb2dsZS5tYXBzLkdlb2NvZGVyU3RhdHVzLk9LKSB7XG4gICAgICAgICAgZm9yICh2YXIgaT0wOyBpIDwgcmVzdWx0cy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICBpZiAocmVzdWx0c1tpXS50eXBlc1swXSA9PT0gXCJjb3VudHJ5XCIpe1xuICAgICAgICAgICAgICB2YXIgY291bnRyeUNsaWNrZWQgPSByZXN1bHRzW2ldLmZvcm1hdHRlZF9hZGRyZXNzO1xuICAgICAgICAgICAgICB2YXIgY2xpY2tlZENvdW50cnlDb2RlID0gcmVzdWx0c1tpXS5hZGRyZXNzX2NvbXBvbmVudHNbMF0uc2hvcnRfbmFtZTtcbiAgICAgICAgICAgICAgaWYgKGNsaWNrZWRDb3VudHJ5Q29kZSA9PT0gY291bnRyeVRvQ2xpY2tDb2RlKXtcbiAgICAgICAgICAgICAgICBwbGFjZU1hcmtlcihldmVudC5sYXRMbmcpO1xuICAgICAgICAgICAgICAgIHZpY3RvcnlEaXNwbGF5KGNvdW50cnlDbGlja2VkKTtcbiAgICAgICAgICAgICAgICAvLyBtYXAuc2V0TWFwVHlwZUlkKGdvb2dsZS5tYXBzLk1hcFR5cGVJZC5ST0FETUFQKTtcbiAgICAgICAgICAgICAgICAvLyAkKFwiLm1vZGFsXCIpLm1vZGFsKCdzaG93Jyk7XG4gICAgICAgICAgICAgICAgLy8gJChcIi5tb2RhbFwiKS5odG1sKFwiWW91IGNsaWNrZWQgb24gXCIgKyBjb3VudHJ5VG9DbGljayArIFwiPGJyPkF3ZXNvbWUgSm9iITxkaXYgY2xhc3M9J21vZGFsSW5zdHJ1Y3Rpb25zJz4oUmVmcmVzaCB0aGUgcGFnZSB0byBoYXZlIGFub3RoZXIgZ28hKTwvZGl2PlwiKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwbGFjZU1hcmtlcihldmVudC5sYXRMbmcpO1xuICAgICAgICAgICAgICAgICQoXCIubW9kYWxcIikubW9kYWwoJ3Nob3cnKTtcbiAgICAgICAgICAgICAgICAkKFwiLm1vZGFsXCIpLmh0bWwoXCJZb3UgY2xpY2tlZCBvbiBcIiArIGNvdW50cnlDbGlja2VkICsgXCI8YnI+VHJ5IGFnYWluIVwiKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgLy8gZG8gbm90aGluZyAtIHRoaXMgbGV2ZWwgb2YgcmVzdWx0c1tpXSBkb2VzIG5vdCBjb250YWluIHRoZSBjb3VudHJ5IG5hbWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJnZW9sb2NhdG9yIGlzIG5vdCBva1wiKTtcbiAgICAgICAgICAkKFwiLm1vZGFsXCIpLm1vZGFsKCdzaG93Jyk7XG4gICAgICAgICAgJChcIi5tb2RhbFwiKS5odG1sKFwiV2hvb3BzISBZb3UgY2xpY2tlZCBvbiB1bmNsYWltZWQgdGVycml0b3J5ISA8YnI+VHJ5IGFnYWluIVwiKTtcbiAgICAgICAgfVxuXG4gICAgICB9KTtcblxuICAgIH0pO1xuXG4gIH1cblxuICBmdW5jdGlvbiB2aWN0b3J5RGlzcGxheShjb3VudHJ5Q2xpY2tlZCkge1xuICAgIG1hcC5zZXRNYXBUeXBlSWQoZ29vZ2xlLm1hcHMuTWFwVHlwZUlkLlJPQURNQVApO1xuICAgICQoXCIubW9kYWxcIikubW9kYWwoJ3Nob3cnKTtcbiAgICB2YXIgbXNnID0gXCJcIjtcbiAgICBpZiAobWFya2Vycy5sZW5ndGggPT0gMSkge1xuICAgICAgbXNnID0gXCJZb3UgZ290IFwiKyBjb3VudHJ5Q2xpY2tlZCArIFwiIG9uIHRoZSBmaXJzdCB0cnkhXCJcbiAgICB9IGVsc2Uge1xuICAgICAgbXNnID0gXCJZb3UgY2xpY2tlZCBvbiBcIiArIGNvdW50cnlDbGlja2VkICsgXCIgYWZ0ZXIgXCIrIG1hcmtlcnMubGVuZ3RoICtcIiB0cmllcyFcIlxuICAgIH1cbiAgICAkKFwiLm1vZGFsXCIpLmh0bWwobXNnICsgXCI8YnI+QXdlc29tZSBKb2IhPGRpdiBjbGFzcz0nbW9kYWxJbnN0cnVjdGlvbnMnPkNsaWNrIGFueXdoZXJlIHRvIHNlZSBhbGwgeW91ciBjbGlja3MhPC9kaXY+XCIpO1xuICAgICQoXCIud2VsbFwiKS5odG1sKFwiPGRpdiBjbGFzcz0nd2VsbCc+PGEgaHJlZj0namF2YXNjcmlwdDp3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7Jz5GaW5kIGEgbmV3IGNvdW50cnkhPC9hPjwvZGl2PlwiKTtcbiAgfVxuXG4gIC8vICQoZG9jdW1lbnQpLm9uKCdrZXlkb3duJyxmdW5jdGlvbihlKSB7XG4gIC8vICAgaWYgKGUud2hpY2ggPT0gNzgpIHtcbiAgLy8gICAgIHN0YXJ0TmV3Um91bmQoKTtcbiAgLy8gICB9XG4gIC8vIH0pO1xuICAvL1xuICBmdW5jdGlvbiBzdGFydE5ld1JvdW5kKCkge1xuICAgIG1hcC5zZXRNYXBUeXBlSWQoZ29vZ2xlLm1hcHMuTWFwVHlwZUlkLlNBVEVMTElURSk7XG4gICAgcmVzZXRNYXJrZXJzKCk7XG4gICAgc2V0dXBDb3VudHJ5KGNvdW50cnlMaXN0KTtcbiAgfVxuXG59KTtcbiIsIi8qKlxuICogQG5hbWUgTWFya2VyV2l0aExhYmVsIGZvciBWM1xuICogQHZlcnNpb24gMS4xLjkgW0p1bmUgMzAsIDIwMTNdXG4gKiBAYXV0aG9yIEdhcnkgTGl0dGxlIChpbnNwaXJlZCBieSBjb2RlIGZyb20gTWFyYyBSaWRleSBvZiBHb29nbGUpLlxuICogQGNvcHlyaWdodCBDb3B5cmlnaHQgMjAxMiBHYXJ5IExpdHRsZSBbZ2FyeSBhdCBsdXhjZW50cmFsLmNvbV1cbiAqIEBmaWxlb3ZlcnZpZXcgTWFya2VyV2l0aExhYmVsIGV4dGVuZHMgdGhlIEdvb2dsZSBNYXBzIEphdmFTY3JpcHQgQVBJIFYzXG4gKiAgPGNvZGU+Z29vZ2xlLm1hcHMuTWFya2VyPC9jb2RlPiBjbGFzcy5cbiAqICA8cD5cbiAqICBNYXJrZXJXaXRoTGFiZWwgYWxsb3dzIHlvdSB0byBkZWZpbmUgbWFya2VycyB3aXRoIGFzc29jaWF0ZWQgbGFiZWxzLiBBcyB5b3Ugd291bGQgZXhwZWN0LFxuICogIGlmIHRoZSBtYXJrZXIgaXMgZHJhZ2dhYmxlLCBzbyB0b28gd2lsbCBiZSB0aGUgbGFiZWwuIEluIGFkZGl0aW9uLCBhIG1hcmtlciB3aXRoIGEgbGFiZWxcbiAqICByZXNwb25kcyB0byBhbGwgbW91c2UgZXZlbnRzIGluIHRoZSBzYW1lIG1hbm5lciBhcyBhIHJlZ3VsYXIgbWFya2VyLiBJdCBhbHNvIGZpcmVzIG1vdXNlXG4gKiAgZXZlbnRzIGFuZCBcInByb3BlcnR5IGNoYW5nZWRcIiBldmVudHMganVzdCBhcyBhIHJlZ3VsYXIgbWFya2VyIHdvdWxkLiBWZXJzaW9uIDEuMSBhZGRzXG4gKiAgc3VwcG9ydCBmb3IgdGhlIHJhaXNlT25EcmFnIGZlYXR1cmUgaW50cm9kdWNlZCBpbiBBUEkgVjMuMy5cbiAqICA8cD5cbiAqICBJZiB5b3UgZHJhZyBhIG1hcmtlciBieSBpdHMgbGFiZWwsIHlvdSBjYW4gY2FuY2VsIHRoZSBkcmFnIGFuZCByZXR1cm4gdGhlIG1hcmtlciB0byBpdHNcbiAqICBvcmlnaW5hbCBwb3NpdGlvbiBieSBwcmVzc2luZyB0aGUgPGNvZGU+RXNjPC9jb2RlPiBrZXkuIFRoaXMgZG9lc24ndCB3b3JrIGlmIHlvdSBkcmFnIHRoZSBtYXJrZXJcbiAqICBpdHNlbGYgYmVjYXVzZSB0aGlzIGZlYXR1cmUgaXMgbm90ICh5ZXQpIHN1cHBvcnRlZCBpbiB0aGUgPGNvZGU+Z29vZ2xlLm1hcHMuTWFya2VyPC9jb2RlPiBjbGFzcy5cbiAqL1xuXG4vKiFcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKmpzbGludCBicm93c2VyOnRydWUgKi9cbi8qZ2xvYmFsIGRvY3VtZW50LGdvb2dsZSAqL1xuXG4vKipcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNoaWxkQ3RvciBDaGlsZCBjbGFzcy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHBhcmVudEN0b3IgUGFyZW50IGNsYXNzLlxuICovXG5mdW5jdGlvbiBpbmhlcml0cyhjaGlsZEN0b3IsIHBhcmVudEN0b3IpIHtcbiAgLyoqIEBjb25zdHJ1Y3RvciAqL1xuICBmdW5jdGlvbiB0ZW1wQ3RvcigpIHt9O1xuICB0ZW1wQ3Rvci5wcm90b3R5cGUgPSBwYXJlbnRDdG9yLnByb3RvdHlwZTtcbiAgY2hpbGRDdG9yLnN1cGVyQ2xhc3NfID0gcGFyZW50Q3Rvci5wcm90b3R5cGU7XG4gIGNoaWxkQ3Rvci5wcm90b3R5cGUgPSBuZXcgdGVtcEN0b3IoKTtcbiAgLyoqIEBvdmVycmlkZSAqL1xuICBjaGlsZEN0b3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gY2hpbGRDdG9yO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7T2JqZWN0fSBnTWFwc0FwaSBUaGUgR29vZ2xlIE1hcHMgQVBJIGluc3RhbmNlICh1c3VhbGx5IGBnb29nbGUubWFwc2ApXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gVGhlIGluc3RhbnRpYWJsZSBNYXJrZXJXaXRoTGFiZWwgY2xhc3NcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihnTWFwc0FwaSkge1xuXG4gIC8qKlxuICAgKiBUaGlzIGNvbnN0cnVjdG9yIGNyZWF0ZXMgYSBsYWJlbCBhbmQgYXNzb2NpYXRlcyBpdCB3aXRoIGEgbWFya2VyLlxuICAgKiBJdCBpcyBmb3IgdGhlIHByaXZhdGUgdXNlIG9mIHRoZSBNYXJrZXJXaXRoTGFiZWwgY2xhc3MuXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge01hcmtlcn0gbWFya2VyIFRoZSBtYXJrZXIgd2l0aCB3aGljaCB0aGUgbGFiZWwgaXMgdG8gYmUgYXNzb2NpYXRlZC5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGNyb3NzVVJMIFRoZSBVUkwgb2YgdGhlIGNyb3NzIGltYWdlID0uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBoYW5kQ3Vyc29yIFRoZSBVUkwgb2YgdGhlIGhhbmQgY3Vyc29yLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZnVuY3Rpb24gTWFya2VyTGFiZWxfKG1hcmtlciwgY3Jvc3NVUkwsIGhhbmRDdXJzb3JVUkwpIHtcbiAgICB0aGlzLm1hcmtlcl8gPSBtYXJrZXI7XG4gICAgdGhpcy5oYW5kQ3Vyc29yVVJMXyA9IG1hcmtlci5oYW5kQ3Vyc29yVVJMO1xuXG4gICAgdGhpcy5sYWJlbERpdl8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIHRoaXMubGFiZWxEaXZfLnN0eWxlLmNzc1RleHQgPSBcInBvc2l0aW9uOiBhYnNvbHV0ZTsgb3ZlcmZsb3c6IGhpZGRlbjtcIjtcblxuICAgIC8vIFNldCB1cCB0aGUgRElWIGZvciBoYW5kbGluZyBtb3VzZSBldmVudHMgaW4gdGhlIGxhYmVsLiBUaGlzIERJViBmb3JtcyBhIHRyYW5zcGFyZW50IHZlaWxcbiAgICAvLyBpbiB0aGUgXCJvdmVybGF5TW91c2VUYXJnZXRcIiBwYW5lLCBhIHZlaWwgdGhhdCBjb3ZlcnMganVzdCB0aGUgbGFiZWwuIFRoaXMgaXMgZG9uZSBzbyB0aGF0XG4gICAgLy8gZXZlbnRzIGNhbiBiZSBjYXB0dXJlZCBldmVuIGlmIHRoZSBsYWJlbCBpcyBpbiB0aGUgc2hhZG93IG9mIGEgZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdy5cbiAgICAvLyBDb2RlIGlzIGluY2x1ZGVkIGhlcmUgdG8gZW5zdXJlIHRoZSB2ZWlsIGlzIGFsd2F5cyBleGFjdGx5IHRoZSBzYW1lIHNpemUgYXMgdGhlIGxhYmVsLlxuICAgIHRoaXMuZXZlbnREaXZfID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICB0aGlzLmV2ZW50RGl2Xy5zdHlsZS5jc3NUZXh0ID0gdGhpcy5sYWJlbERpdl8uc3R5bGUuY3NzVGV4dDtcblxuICAgIC8vIFRoaXMgaXMgbmVlZGVkIGZvciBwcm9wZXIgYmVoYXZpb3Igb24gTVNJRTpcbiAgICB0aGlzLmV2ZW50RGl2Xy5zZXRBdHRyaWJ1dGUoXCJvbnNlbGVjdHN0YXJ0XCIsIFwicmV0dXJuIGZhbHNlO1wiKTtcbiAgICB0aGlzLmV2ZW50RGl2Xy5zZXRBdHRyaWJ1dGUoXCJvbmRyYWdzdGFydFwiLCBcInJldHVybiBmYWxzZTtcIik7XG5cbiAgICAvLyBHZXQgdGhlIERJViBmb3IgdGhlIFwiWFwiIHRvIGJlIGRpc3BsYXllZCB3aGVuIHRoZSBtYXJrZXIgaXMgcmFpc2VkLlxuICAgIHRoaXMuY3Jvc3NEaXZfID0gTWFya2VyTGFiZWxfLmdldFNoYXJlZENyb3NzKGNyb3NzVVJMKTtcbiAgfVxuICBpbmhlcml0cyhNYXJrZXJMYWJlbF8sIGdNYXBzQXBpLk92ZXJsYXlWaWV3KTtcblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgRElWIGZvciB0aGUgY3Jvc3MgdXNlZCB3aGVuIGRyYWdnaW5nIGEgbWFya2VyIHdoZW4gdGhlXG4gICAqIHJhaXNlT25EcmFnIHBhcmFtZXRlciBzZXQgdG8gdHJ1ZS4gT25lIGNyb3NzIGlzIHNoYXJlZCB3aXRoIGFsbCBtYXJrZXJzLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gY3Jvc3NVUkwgVGhlIFVSTCBvZiB0aGUgY3Jvc3MgaW1hZ2UgPS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIE1hcmtlckxhYmVsXy5nZXRTaGFyZWRDcm9zcyA9IGZ1bmN0aW9uIChjcm9zc1VSTCkge1xuICAgIHZhciBkaXY7XG4gICAgaWYgKHR5cGVvZiBNYXJrZXJMYWJlbF8uZ2V0U2hhcmVkQ3Jvc3MuY3Jvc3NEaXYgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XG4gICAgICBkaXYuc3R5bGUuY3NzVGV4dCA9IFwicG9zaXRpb246IGFic29sdXRlOyB6LWluZGV4OiAxMDAwMDAyOyBkaXNwbGF5OiBub25lO1wiO1xuICAgICAgLy8gSG9wZWZ1bGx5IEdvb2dsZSBuZXZlciBjaGFuZ2VzIHRoZSBzdGFuZGFyZCBcIlhcIiBhdHRyaWJ1dGVzOlxuICAgICAgZGl2LnN0eWxlLm1hcmdpbkxlZnQgPSBcIi04cHhcIjtcbiAgICAgIGRpdi5zdHlsZS5tYXJnaW5Ub3AgPSBcIi05cHhcIjtcbiAgICAgIGRpdi5zcmMgPSBjcm9zc1VSTDtcbiAgICAgIE1hcmtlckxhYmVsXy5nZXRTaGFyZWRDcm9zcy5jcm9zc0RpdiA9IGRpdjtcbiAgICB9XG4gICAgcmV0dXJuIE1hcmtlckxhYmVsXy5nZXRTaGFyZWRDcm9zcy5jcm9zc0RpdjtcbiAgfTtcblxuICAvKipcbiAgICogQWRkcyB0aGUgRElWIHJlcHJlc2VudGluZyB0aGUgbGFiZWwgdG8gdGhlIERPTS4gVGhpcyBtZXRob2QgaXMgY2FsbGVkXG4gICAqIGF1dG9tYXRpY2FsbHkgd2hlbiB0aGUgbWFya2VyJ3MgPGNvZGU+c2V0TWFwPC9jb2RlPiBtZXRob2QgaXMgY2FsbGVkLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgTWFya2VyTGFiZWxfLnByb3RvdHlwZS5vbkFkZCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbWUgPSB0aGlzO1xuICAgIHZhciBjTW91c2VJc0Rvd24gPSBmYWxzZTtcbiAgICB2YXIgY0RyYWdnaW5nTGFiZWwgPSBmYWxzZTtcbiAgICB2YXIgY1NhdmVkWkluZGV4O1xuICAgIHZhciBjTGF0T2Zmc2V0LCBjTG5nT2Zmc2V0O1xuICAgIHZhciBjSWdub3JlQ2xpY2s7XG4gICAgdmFyIGNSYWlzZUVuYWJsZWQ7XG4gICAgdmFyIGNTdGFydFBvc2l0aW9uO1xuICAgIHZhciBjU3RhcnRDZW50ZXI7XG4gICAgLy8gQ29uc3RhbnRzOlxuICAgIHZhciBjUmFpc2VPZmZzZXQgPSAyMDtcbiAgICB2YXIgY0RyYWdnaW5nQ3Vyc29yID0gXCJ1cmwoXCIgKyB0aGlzLmhhbmRDdXJzb3JVUkxfICsgXCIpXCI7XG5cbiAgICAvLyBTdG9wcyBhbGwgcHJvY2Vzc2luZyBvZiBhbiBldmVudC5cbiAgICAvL1xuICAgIHZhciBjQWJvcnRFdmVudCA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICBpZiAoZS5wcmV2ZW50RGVmYXVsdCkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB9XG4gICAgICBlLmNhbmNlbEJ1YmJsZSA9IHRydWU7XG4gICAgICBpZiAoZS5zdG9wUHJvcGFnYXRpb24pIHtcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIGNTdG9wQm91bmNlID0gZnVuY3Rpb24gKCkge1xuICAgICAgbWUubWFya2VyXy5zZXRBbmltYXRpb24obnVsbCk7XG4gICAgfTtcblxuICAgIHRoaXMuZ2V0UGFuZXMoKS5tYXJrZXJMYXllci5hcHBlbmRDaGlsZCh0aGlzLmxhYmVsRGl2Xyk7XG4gICAgdGhpcy5nZXRQYW5lcygpLm92ZXJsYXlNb3VzZVRhcmdldC5hcHBlbmRDaGlsZCh0aGlzLmV2ZW50RGl2Xyk7XG4gICAgLy8gT25lIGNyb3NzIGlzIHNoYXJlZCB3aXRoIGFsbCBtYXJrZXJzLCBzbyBvbmx5IGFkZCBpdCBvbmNlOlxuICAgIGlmICh0eXBlb2YgTWFya2VyTGFiZWxfLmdldFNoYXJlZENyb3NzLnByb2Nlc3NlZCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgdGhpcy5nZXRQYW5lcygpLm1hcmtlckxheWVyLmFwcGVuZENoaWxkKHRoaXMuY3Jvc3NEaXZfKTtcbiAgICAgIE1hcmtlckxhYmVsXy5nZXRTaGFyZWRDcm9zcy5wcm9jZXNzZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIHRoaXMubGlzdGVuZXJzXyA9IFtcbiAgICAgIGdNYXBzQXBpLmV2ZW50LmFkZERvbUxpc3RlbmVyKHRoaXMuZXZlbnREaXZfLCBcIm1vdXNlb3ZlclwiLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAobWUubWFya2VyXy5nZXREcmFnZ2FibGUoKSB8fCBtZS5tYXJrZXJfLmdldENsaWNrYWJsZSgpKSB7XG4gICAgICAgICAgdGhpcy5zdHlsZS5jdXJzb3IgPSBcInBvaW50ZXJcIjtcbiAgICAgICAgICBnTWFwc0FwaS5ldmVudC50cmlnZ2VyKG1lLm1hcmtlcl8sIFwibW91c2VvdmVyXCIsIGUpO1xuICAgICAgICB9XG4gICAgICB9KSxcbiAgICAgIGdNYXBzQXBpLmV2ZW50LmFkZERvbUxpc3RlbmVyKHRoaXMuZXZlbnREaXZfLCBcIm1vdXNlb3V0XCIsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmICgobWUubWFya2VyXy5nZXREcmFnZ2FibGUoKSB8fCBtZS5tYXJrZXJfLmdldENsaWNrYWJsZSgpKSAmJiAhY0RyYWdnaW5nTGFiZWwpIHtcbiAgICAgICAgICB0aGlzLnN0eWxlLmN1cnNvciA9IG1lLm1hcmtlcl8uZ2V0Q3Vyc29yKCk7XG4gICAgICAgICAgZ01hcHNBcGkuZXZlbnQudHJpZ2dlcihtZS5tYXJrZXJfLCBcIm1vdXNlb3V0XCIsIGUpO1xuICAgICAgICB9XG4gICAgICB9KSxcbiAgICAgIGdNYXBzQXBpLmV2ZW50LmFkZERvbUxpc3RlbmVyKHRoaXMuZXZlbnREaXZfLCBcIm1vdXNlZG93blwiLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBjRHJhZ2dpbmdMYWJlbCA9IGZhbHNlO1xuICAgICAgICBpZiAobWUubWFya2VyXy5nZXREcmFnZ2FibGUoKSkge1xuICAgICAgICAgIGNNb3VzZUlzRG93biA9IHRydWU7XG4gICAgICAgICAgdGhpcy5zdHlsZS5jdXJzb3IgPSBjRHJhZ2dpbmdDdXJzb3I7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1lLm1hcmtlcl8uZ2V0RHJhZ2dhYmxlKCkgfHwgbWUubWFya2VyXy5nZXRDbGlja2FibGUoKSkge1xuICAgICAgICAgIGdNYXBzQXBpLmV2ZW50LnRyaWdnZXIobWUubWFya2VyXywgXCJtb3VzZWRvd25cIiwgZSk7XG4gICAgICAgICAgY0Fib3J0RXZlbnQoZSk7IC8vIFByZXZlbnQgbWFwIHBhbiB3aGVuIHN0YXJ0aW5nIGEgZHJhZyBvbiBhIGxhYmVsXG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICAgZ01hcHNBcGkuZXZlbnQuYWRkRG9tTGlzdGVuZXIoZG9jdW1lbnQsIFwibW91c2V1cFwiLCBmdW5jdGlvbiAobUV2ZW50KSB7XG4gICAgICAgIHZhciBwb3NpdGlvbjtcbiAgICAgICAgaWYgKGNNb3VzZUlzRG93bikge1xuICAgICAgICAgIGNNb3VzZUlzRG93biA9IGZhbHNlO1xuICAgICAgICAgIG1lLmV2ZW50RGl2Xy5zdHlsZS5jdXJzb3IgPSBcInBvaW50ZXJcIjtcbiAgICAgICAgICBnTWFwc0FwaS5ldmVudC50cmlnZ2VyKG1lLm1hcmtlcl8sIFwibW91c2V1cFwiLCBtRXZlbnQpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjRHJhZ2dpbmdMYWJlbCkge1xuICAgICAgICAgIGlmIChjUmFpc2VFbmFibGVkKSB7IC8vIExvd2VyIHRoZSBtYXJrZXIgJiBsYWJlbFxuICAgICAgICAgICAgcG9zaXRpb24gPSBtZS5nZXRQcm9qZWN0aW9uKCkuZnJvbUxhdExuZ1RvRGl2UGl4ZWwobWUubWFya2VyXy5nZXRQb3NpdGlvbigpKTtcbiAgICAgICAgICAgIHBvc2l0aW9uLnkgKz0gY1JhaXNlT2Zmc2V0O1xuICAgICAgICAgICAgbWUubWFya2VyXy5zZXRQb3NpdGlvbihtZS5nZXRQcm9qZWN0aW9uKCkuZnJvbURpdlBpeGVsVG9MYXRMbmcocG9zaXRpb24pKTtcbiAgICAgICAgICAgIC8vIFRoaXMgaXMgbm90IHRoZSBzYW1lIGJvdW5jaW5nIHN0eWxlIGFzIHdoZW4gdGhlIG1hcmtlciBwb3J0aW9uIGlzIGRyYWdnZWQsXG4gICAgICAgICAgICAvLyBidXQgaXQgd2lsbCBoYXZlIHRvIGRvOlxuICAgICAgICAgICAgdHJ5IHsgLy8gV2lsbCBmYWlsIGlmIHJ1bm5pbmcgR29vZ2xlIE1hcHMgQVBJIGVhcmxpZXIgdGhhbiBWMy4zXG4gICAgICAgICAgICAgIG1lLm1hcmtlcl8uc2V0QW5pbWF0aW9uKGdNYXBzQXBpLkFuaW1hdGlvbi5CT1VOQ0UpO1xuICAgICAgICAgICAgICBzZXRUaW1lb3V0KGNTdG9wQm91bmNlLCAxNDA2KTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgICAgICAgfVxuICAgICAgICAgIG1lLmNyb3NzRGl2Xy5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgICAgbWUubWFya2VyXy5zZXRaSW5kZXgoY1NhdmVkWkluZGV4KTtcbiAgICAgICAgICBjSWdub3JlQ2xpY2sgPSB0cnVlOyAvLyBTZXQgZmxhZyB0byBpZ25vcmUgdGhlIGNsaWNrIGV2ZW50IHJlcG9ydGVkIGFmdGVyIGEgbGFiZWwgZHJhZ1xuICAgICAgICAgIGNEcmFnZ2luZ0xhYmVsID0gZmFsc2U7XG4gICAgICAgICAgbUV2ZW50LmxhdExuZyA9IG1lLm1hcmtlcl8uZ2V0UG9zaXRpb24oKTtcbiAgICAgICAgICBnTWFwc0FwaS5ldmVudC50cmlnZ2VyKG1lLm1hcmtlcl8sIFwiZHJhZ2VuZFwiLCBtRXZlbnQpO1xuICAgICAgICB9XG4gICAgICB9KSxcbiAgICAgIGdNYXBzQXBpLmV2ZW50LmFkZExpc3RlbmVyKG1lLm1hcmtlcl8uZ2V0TWFwKCksIFwibW91c2Vtb3ZlXCIsIGZ1bmN0aW9uIChtRXZlbnQpIHtcbiAgICAgICAgdmFyIHBvc2l0aW9uO1xuICAgICAgICBpZiAoY01vdXNlSXNEb3duKSB7XG4gICAgICAgICAgaWYgKGNEcmFnZ2luZ0xhYmVsKSB7XG4gICAgICAgICAgICAvLyBDaGFuZ2UgdGhlIHJlcG9ydGVkIGxvY2F0aW9uIGZyb20gdGhlIG1vdXNlIHBvc2l0aW9uIHRvIHRoZSBtYXJrZXIgcG9zaXRpb246XG4gICAgICAgICAgICBtRXZlbnQubGF0TG5nID0gbmV3IGdNYXBzQXBpLkxhdExuZyhtRXZlbnQubGF0TG5nLmxhdCgpIC0gY0xhdE9mZnNldCwgbUV2ZW50LmxhdExuZy5sbmcoKSAtIGNMbmdPZmZzZXQpO1xuICAgICAgICAgICAgcG9zaXRpb24gPSBtZS5nZXRQcm9qZWN0aW9uKCkuZnJvbUxhdExuZ1RvRGl2UGl4ZWwobUV2ZW50LmxhdExuZyk7XG4gICAgICAgICAgICBpZiAoY1JhaXNlRW5hYmxlZCkge1xuICAgICAgICAgICAgICBtZS5jcm9zc0Rpdl8uc3R5bGUubGVmdCA9IHBvc2l0aW9uLnggKyBcInB4XCI7XG4gICAgICAgICAgICAgIG1lLmNyb3NzRGl2Xy5zdHlsZS50b3AgPSBwb3NpdGlvbi55ICsgXCJweFwiO1xuICAgICAgICAgICAgICBtZS5jcm9zc0Rpdl8uc3R5bGUuZGlzcGxheSA9IFwiXCI7XG4gICAgICAgICAgICAgIHBvc2l0aW9uLnkgLT0gY1JhaXNlT2Zmc2V0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbWUubWFya2VyXy5zZXRQb3NpdGlvbihtZS5nZXRQcm9qZWN0aW9uKCkuZnJvbURpdlBpeGVsVG9MYXRMbmcocG9zaXRpb24pKTtcbiAgICAgICAgICAgIGlmIChjUmFpc2VFbmFibGVkKSB7IC8vIERvbid0IHJhaXNlIHRoZSB2ZWlsOyB0aGlzIGhhY2sgbmVlZGVkIHRvIG1ha2UgTVNJRSBhY3QgcHJvcGVybHlcbiAgICAgICAgICAgICAgbWUuZXZlbnREaXZfLnN0eWxlLnRvcCA9IChwb3NpdGlvbi55ICsgY1JhaXNlT2Zmc2V0KSArIFwicHhcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGdNYXBzQXBpLmV2ZW50LnRyaWdnZXIobWUubWFya2VyXywgXCJkcmFnXCIsIG1FdmVudCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIENhbGN1bGF0ZSBvZmZzZXRzIGZyb20gdGhlIGNsaWNrIHBvaW50IHRvIHRoZSBtYXJrZXIgcG9zaXRpb246XG4gICAgICAgICAgICBjTGF0T2Zmc2V0ID0gbUV2ZW50LmxhdExuZy5sYXQoKSAtIG1lLm1hcmtlcl8uZ2V0UG9zaXRpb24oKS5sYXQoKTtcbiAgICAgICAgICAgIGNMbmdPZmZzZXQgPSBtRXZlbnQubGF0TG5nLmxuZygpIC0gbWUubWFya2VyXy5nZXRQb3NpdGlvbigpLmxuZygpO1xuICAgICAgICAgICAgY1NhdmVkWkluZGV4ID0gbWUubWFya2VyXy5nZXRaSW5kZXgoKTtcbiAgICAgICAgICAgIGNTdGFydFBvc2l0aW9uID0gbWUubWFya2VyXy5nZXRQb3NpdGlvbigpO1xuICAgICAgICAgICAgY1N0YXJ0Q2VudGVyID0gbWUubWFya2VyXy5nZXRNYXAoKS5nZXRDZW50ZXIoKTtcbiAgICAgICAgICAgIGNSYWlzZUVuYWJsZWQgPSBtZS5tYXJrZXJfLmdldChcInJhaXNlT25EcmFnXCIpO1xuICAgICAgICAgICAgY0RyYWdnaW5nTGFiZWwgPSB0cnVlO1xuICAgICAgICAgICAgbWUubWFya2VyXy5zZXRaSW5kZXgoMTAwMDAwMCk7IC8vIE1vdmVzIHRoZSBtYXJrZXIgJiBsYWJlbCB0byB0aGUgZm9yZWdyb3VuZCBkdXJpbmcgYSBkcmFnXG4gICAgICAgICAgICBtRXZlbnQubGF0TG5nID0gbWUubWFya2VyXy5nZXRQb3NpdGlvbigpO1xuICAgICAgICAgICAgZ01hcHNBcGkuZXZlbnQudHJpZ2dlcihtZS5tYXJrZXJfLCBcImRyYWdzdGFydFwiLCBtRXZlbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgICBnTWFwc0FwaS5ldmVudC5hZGREb21MaXN0ZW5lcihkb2N1bWVudCwgXCJrZXlkb3duXCIsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmIChjRHJhZ2dpbmdMYWJlbCkge1xuICAgICAgICAgIGlmIChlLmtleUNvZGUgPT09IDI3KSB7IC8vIEVzYyBrZXlcbiAgICAgICAgICAgIGNSYWlzZUVuYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIG1lLm1hcmtlcl8uc2V0UG9zaXRpb24oY1N0YXJ0UG9zaXRpb24pO1xuICAgICAgICAgICAgbWUubWFya2VyXy5nZXRNYXAoKS5zZXRDZW50ZXIoY1N0YXJ0Q2VudGVyKTtcbiAgICAgICAgICAgIGdNYXBzQXBpLmV2ZW50LnRyaWdnZXIoZG9jdW1lbnQsIFwibW91c2V1cFwiLCBlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICAgZ01hcHNBcGkuZXZlbnQuYWRkRG9tTGlzdGVuZXIodGhpcy5ldmVudERpdl8sIFwiY2xpY2tcIiwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKG1lLm1hcmtlcl8uZ2V0RHJhZ2dhYmxlKCkgfHwgbWUubWFya2VyXy5nZXRDbGlja2FibGUoKSkge1xuICAgICAgICAgIGlmIChjSWdub3JlQ2xpY2spIHsgLy8gSWdub3JlIHRoZSBjbGljayByZXBvcnRlZCB3aGVuIGEgbGFiZWwgZHJhZyBlbmRzXG4gICAgICAgICAgICBjSWdub3JlQ2xpY2sgPSBmYWxzZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZ01hcHNBcGkuZXZlbnQudHJpZ2dlcihtZS5tYXJrZXJfLCBcImNsaWNrXCIsIGUpO1xuICAgICAgICAgICAgY0Fib3J0RXZlbnQoZSk7IC8vIFByZXZlbnQgY2xpY2sgZnJvbSBiZWluZyBwYXNzZWQgb24gdG8gbWFwXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KSxcbiAgICAgIGdNYXBzQXBpLmV2ZW50LmFkZERvbUxpc3RlbmVyKHRoaXMuZXZlbnREaXZfLCBcImRibGNsaWNrXCIsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmIChtZS5tYXJrZXJfLmdldERyYWdnYWJsZSgpIHx8IG1lLm1hcmtlcl8uZ2V0Q2xpY2thYmxlKCkpIHtcbiAgICAgICAgICBnTWFwc0FwaS5ldmVudC50cmlnZ2VyKG1lLm1hcmtlcl8sIFwiZGJsY2xpY2tcIiwgZSk7XG4gICAgICAgICAgY0Fib3J0RXZlbnQoZSk7IC8vIFByZXZlbnQgbWFwIHpvb20gd2hlbiBkb3VibGUtY2xpY2tpbmcgb24gYSBsYWJlbFxuICAgICAgICB9XG4gICAgICB9KSxcbiAgICAgIGdNYXBzQXBpLmV2ZW50LmFkZExpc3RlbmVyKHRoaXMubWFya2VyXywgXCJkcmFnc3RhcnRcIiwgZnVuY3Rpb24gKG1FdmVudCkge1xuICAgICAgICBpZiAoIWNEcmFnZ2luZ0xhYmVsKSB7XG4gICAgICAgICAgY1JhaXNlRW5hYmxlZCA9IHRoaXMuZ2V0KFwicmFpc2VPbkRyYWdcIik7XG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICAgZ01hcHNBcGkuZXZlbnQuYWRkTGlzdGVuZXIodGhpcy5tYXJrZXJfLCBcImRyYWdcIiwgZnVuY3Rpb24gKG1FdmVudCkge1xuICAgICAgICBpZiAoIWNEcmFnZ2luZ0xhYmVsKSB7XG4gICAgICAgICAgaWYgKGNSYWlzZUVuYWJsZWQpIHtcbiAgICAgICAgICAgIG1lLnNldFBvc2l0aW9uKGNSYWlzZU9mZnNldCk7XG4gICAgICAgICAgICAvLyBEdXJpbmcgYSBkcmFnLCB0aGUgbWFya2VyJ3Mgei1pbmRleCBpcyB0ZW1wb3JhcmlseSBzZXQgdG8gMTAwMDAwMCB0b1xuICAgICAgICAgICAgLy8gZW5zdXJlIGl0IGFwcGVhcnMgYWJvdmUgYWxsIG90aGVyIG1hcmtlcnMuIEFsc28gc2V0IHRoZSBsYWJlbCdzIHotaW5kZXhcbiAgICAgICAgICAgIC8vIHRvIDEwMDAwMDAgKHBsdXMgb3IgbWludXMgMSBkZXBlbmRpbmcgb24gd2hldGhlciB0aGUgbGFiZWwgaXMgc3VwcG9zZWRcbiAgICAgICAgICAgIC8vIHRvIGJlIGFib3ZlIG9yIGJlbG93IHRoZSBtYXJrZXIpLlxuICAgICAgICAgICAgbWUubGFiZWxEaXZfLnN0eWxlLnpJbmRleCA9IDEwMDAwMDAgKyAodGhpcy5nZXQoXCJsYWJlbEluQmFja2dyb3VuZFwiKSA/IC0xIDogKzEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgICBnTWFwc0FwaS5ldmVudC5hZGRMaXN0ZW5lcih0aGlzLm1hcmtlcl8sIFwiZHJhZ2VuZFwiLCBmdW5jdGlvbiAobUV2ZW50KSB7XG4gICAgICAgIGlmICghY0RyYWdnaW5nTGFiZWwpIHtcbiAgICAgICAgICBpZiAoY1JhaXNlRW5hYmxlZCkge1xuICAgICAgICAgICAgbWUuc2V0UG9zaXRpb24oMCk7IC8vIEFsc28gcmVzdG9yZXMgei1pbmRleCBvZiBsYWJlbFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgICBnTWFwc0FwaS5ldmVudC5hZGRMaXN0ZW5lcih0aGlzLm1hcmtlcl8sIFwicG9zaXRpb25fY2hhbmdlZFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIG1lLnNldFBvc2l0aW9uKCk7XG4gICAgICB9KSxcbiAgICAgIGdNYXBzQXBpLmV2ZW50LmFkZExpc3RlbmVyKHRoaXMubWFya2VyXywgXCJ6aW5kZXhfY2hhbmdlZFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIG1lLnNldFpJbmRleCgpO1xuICAgICAgfSksXG4gICAgICBnTWFwc0FwaS5ldmVudC5hZGRMaXN0ZW5lcih0aGlzLm1hcmtlcl8sIFwidmlzaWJsZV9jaGFuZ2VkXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbWUuc2V0VmlzaWJsZSgpO1xuICAgICAgfSksXG4gICAgICBnTWFwc0FwaS5ldmVudC5hZGRMaXN0ZW5lcih0aGlzLm1hcmtlcl8sIFwibGFiZWx2aXNpYmxlX2NoYW5nZWRcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICBtZS5zZXRWaXNpYmxlKCk7XG4gICAgICB9KSxcbiAgICAgIGdNYXBzQXBpLmV2ZW50LmFkZExpc3RlbmVyKHRoaXMubWFya2VyXywgXCJ0aXRsZV9jaGFuZ2VkXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbWUuc2V0VGl0bGUoKTtcbiAgICAgIH0pLFxuICAgICAgZ01hcHNBcGkuZXZlbnQuYWRkTGlzdGVuZXIodGhpcy5tYXJrZXJfLCBcImxhYmVsY29udGVudF9jaGFuZ2VkXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbWUuc2V0Q29udGVudCgpO1xuICAgICAgfSksXG4gICAgICBnTWFwc0FwaS5ldmVudC5hZGRMaXN0ZW5lcih0aGlzLm1hcmtlcl8sIFwibGFiZWxhbmNob3JfY2hhbmdlZFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIG1lLnNldEFuY2hvcigpO1xuICAgICAgfSksXG4gICAgICBnTWFwc0FwaS5ldmVudC5hZGRMaXN0ZW5lcih0aGlzLm1hcmtlcl8sIFwibGFiZWxjbGFzc19jaGFuZ2VkXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbWUuc2V0U3R5bGVzKCk7XG4gICAgICB9KSxcbiAgICAgIGdNYXBzQXBpLmV2ZW50LmFkZExpc3RlbmVyKHRoaXMubWFya2VyXywgXCJsYWJlbHN0eWxlX2NoYW5nZWRcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICBtZS5zZXRTdHlsZXMoKTtcbiAgICAgIH0pXG4gICAgXTtcbiAgfTtcblxuICAvKipcbiAgICogUmVtb3ZlcyB0aGUgRElWIGZvciB0aGUgbGFiZWwgZnJvbSB0aGUgRE9NLiBJdCBhbHNvIHJlbW92ZXMgYWxsIGV2ZW50IGhhbmRsZXJzLlxuICAgKiBUaGlzIG1ldGhvZCBpcyBjYWxsZWQgYXV0b21hdGljYWxseSB3aGVuIHRoZSBtYXJrZXIncyA8Y29kZT5zZXRNYXAobnVsbCk8L2NvZGU+XG4gICAqIG1ldGhvZCBpcyBjYWxsZWQuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXJrZXJMYWJlbF8ucHJvdG90eXBlLm9uUmVtb3ZlID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBpO1xuICAgIHRoaXMubGFiZWxEaXZfLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcy5sYWJlbERpdl8pO1xuICAgIHRoaXMuZXZlbnREaXZfLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcy5ldmVudERpdl8pO1xuXG4gICAgLy8gUmVtb3ZlIGV2ZW50IGxpc3RlbmVyczpcbiAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5saXN0ZW5lcnNfLmxlbmd0aDsgaSsrKSB7XG4gICAgICBnTWFwc0FwaS5ldmVudC5yZW1vdmVMaXN0ZW5lcih0aGlzLmxpc3RlbmVyc19baV0pO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogRHJhd3MgdGhlIGxhYmVsIG9uIHRoZSBtYXAuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXJrZXJMYWJlbF8ucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5zZXRDb250ZW50KCk7XG4gICAgdGhpcy5zZXRUaXRsZSgpO1xuICAgIHRoaXMuc2V0U3R5bGVzKCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGNvbnRlbnQgb2YgdGhlIGxhYmVsLlxuICAgKiBUaGUgY29udGVudCBjYW4gYmUgcGxhaW4gdGV4dCBvciBhbiBIVE1MIERPTSBub2RlLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgTWFya2VyTGFiZWxfLnByb3RvdHlwZS5zZXRDb250ZW50ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBjb250ZW50ID0gdGhpcy5tYXJrZXJfLmdldChcImxhYmVsQ29udGVudFwiKTtcbiAgICBpZiAodHlwZW9mIGNvbnRlbnQubm9kZVR5cGUgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIHRoaXMubGFiZWxEaXZfLmlubmVySFRNTCA9IGNvbnRlbnQ7XG4gICAgICB0aGlzLmV2ZW50RGl2Xy5pbm5lckhUTUwgPSB0aGlzLmxhYmVsRGl2Xy5pbm5lckhUTUw7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFJlbW92ZSBjdXJyZW50IGNvbnRlbnRcbiAgICAgIHdoaWxlICh0aGlzLmxhYmVsRGl2Xy5sYXN0Q2hpbGQpIHtcbiAgICAgICAgdGhpcy5sYWJlbERpdl8ucmVtb3ZlQ2hpbGQodGhpcy5sYWJlbERpdl8ubGFzdENoaWxkKTtcbiAgICAgIH1cblxuICAgICAgd2hpbGUgKHRoaXMuZXZlbnREaXZfLmxhc3RDaGlsZCkge1xuICAgICAgICB0aGlzLmV2ZW50RGl2Xy5yZW1vdmVDaGlsZCh0aGlzLmV2ZW50RGl2Xy5sYXN0Q2hpbGQpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmxhYmVsRGl2Xy5hcHBlbmRDaGlsZChjb250ZW50KTtcbiAgICAgIGNvbnRlbnQgPSBjb250ZW50LmNsb25lTm9kZSh0cnVlKTtcbiAgICAgIHRoaXMuZXZlbnREaXZfLmFwcGVuZENoaWxkKGNvbnRlbnQpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogU2V0cyB0aGUgY29udGVudCBvZiB0aGUgdG9vbCB0aXAgZm9yIHRoZSBsYWJlbC4gSXQgaXNcbiAgICogYWx3YXlzIHNldCB0byBiZSB0aGUgc2FtZSBhcyBmb3IgdGhlIG1hcmtlciBpdHNlbGYuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXJrZXJMYWJlbF8ucHJvdG90eXBlLnNldFRpdGxlID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZXZlbnREaXZfLnRpdGxlID0gdGhpcy5tYXJrZXJfLmdldFRpdGxlKCkgfHwgXCJcIjtcbiAgfTtcblxuICAvKipcbiAgICogU2V0cyB0aGUgc3R5bGUgb2YgdGhlIGxhYmVsIGJ5IHNldHRpbmcgdGhlIHN0eWxlIHNoZWV0IGFuZCBhcHBseWluZ1xuICAgKiBvdGhlciBzcGVjaWZpYyBzdHlsZXMgcmVxdWVzdGVkLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgTWFya2VyTGFiZWxfLnByb3RvdHlwZS5zZXRTdHlsZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGksIGxhYmVsU3R5bGU7XG5cbiAgICAvLyBBcHBseSBzdHlsZSB2YWx1ZXMgZnJvbSB0aGUgc3R5bGUgc2hlZXQgZGVmaW5lZCBpbiB0aGUgbGFiZWxDbGFzcyBwYXJhbWV0ZXI6XG4gICAgdGhpcy5sYWJlbERpdl8uY2xhc3NOYW1lID0gdGhpcy5tYXJrZXJfLmdldChcImxhYmVsQ2xhc3NcIik7XG4gICAgdGhpcy5ldmVudERpdl8uY2xhc3NOYW1lID0gdGhpcy5sYWJlbERpdl8uY2xhc3NOYW1lO1xuXG4gICAgLy8gQ2xlYXIgZXhpc3RpbmcgaW5saW5lIHN0eWxlIHZhbHVlczpcbiAgICB0aGlzLmxhYmVsRGl2Xy5zdHlsZS5jc3NUZXh0ID0gXCJcIjtcbiAgICB0aGlzLmV2ZW50RGl2Xy5zdHlsZS5jc3NUZXh0ID0gXCJcIjtcbiAgICAvLyBBcHBseSBzdHlsZSB2YWx1ZXMgZGVmaW5lZCBpbiB0aGUgbGFiZWxTdHlsZSBwYXJhbWV0ZXI6XG4gICAgbGFiZWxTdHlsZSA9IHRoaXMubWFya2VyXy5nZXQoXCJsYWJlbFN0eWxlXCIpO1xuICAgIGZvciAoaSBpbiBsYWJlbFN0eWxlKSB7XG4gICAgICBpZiAobGFiZWxTdHlsZS5oYXNPd25Qcm9wZXJ0eShpKSkge1xuICAgICAgICB0aGlzLmxhYmVsRGl2Xy5zdHlsZVtpXSA9IGxhYmVsU3R5bGVbaV07XG4gICAgICAgIHRoaXMuZXZlbnREaXZfLnN0eWxlW2ldID0gbGFiZWxTdHlsZVtpXTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5zZXRNYW5kYXRvcnlTdHlsZXMoKTtcbiAgfTtcblxuICAvKipcbiAgICogU2V0cyB0aGUgbWFuZGF0b3J5IHN0eWxlcyB0byB0aGUgRElWIHJlcHJlc2VudGluZyB0aGUgbGFiZWwgYXMgd2VsbCBhcyB0byB0aGVcbiAgICogYXNzb2NpYXRlZCBldmVudCBESVYuIFRoaXMgaW5jbHVkZXMgc2V0dGluZyB0aGUgRElWIHBvc2l0aW9uLCB6LWluZGV4LCBhbmQgdmlzaWJpbGl0eS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIE1hcmtlckxhYmVsXy5wcm90b3R5cGUuc2V0TWFuZGF0b3J5U3R5bGVzID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMubGFiZWxEaXZfLnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuICAgIHRoaXMubGFiZWxEaXZfLnN0eWxlLm92ZXJmbG93ID0gXCJoaWRkZW5cIjtcbiAgICAvLyBNYWtlIHN1cmUgdGhlIG9wYWNpdHkgc2V0dGluZyBjYXVzZXMgdGhlIGRlc2lyZWQgZWZmZWN0IG9uIE1TSUU6XG4gICAgaWYgKHR5cGVvZiB0aGlzLmxhYmVsRGl2Xy5zdHlsZS5vcGFjaXR5ICE9PSBcInVuZGVmaW5lZFwiICYmIHRoaXMubGFiZWxEaXZfLnN0eWxlLm9wYWNpdHkgIT09IFwiXCIpIHtcbiAgICAgIHRoaXMubGFiZWxEaXZfLnN0eWxlLk1zRmlsdGVyID0gXCJcXFwicHJvZ2lkOkRYSW1hZ2VUcmFuc2Zvcm0uTWljcm9zb2Z0LkFscGhhKG9wYWNpdHk9XCIgKyAodGhpcy5sYWJlbERpdl8uc3R5bGUub3BhY2l0eSAqIDEwMCkgKyBcIilcXFwiXCI7XG4gICAgICB0aGlzLmxhYmVsRGl2Xy5zdHlsZS5maWx0ZXIgPSBcImFscGhhKG9wYWNpdHk9XCIgKyAodGhpcy5sYWJlbERpdl8uc3R5bGUub3BhY2l0eSAqIDEwMCkgKyBcIilcIjtcbiAgICB9XG5cbiAgICB0aGlzLmV2ZW50RGl2Xy5zdHlsZS5wb3NpdGlvbiA9IHRoaXMubGFiZWxEaXZfLnN0eWxlLnBvc2l0aW9uO1xuICAgIHRoaXMuZXZlbnREaXZfLnN0eWxlLm92ZXJmbG93ID0gdGhpcy5sYWJlbERpdl8uc3R5bGUub3ZlcmZsb3c7XG4gICAgdGhpcy5ldmVudERpdl8uc3R5bGUub3BhY2l0eSA9IDAuMDE7IC8vIERvbid0IHVzZSAwOyBESVYgd29uJ3QgYmUgY2xpY2thYmxlIG9uIE1TSUVcbiAgICB0aGlzLmV2ZW50RGl2Xy5zdHlsZS5Nc0ZpbHRlciA9IFwiXFxcInByb2dpZDpEWEltYWdlVHJhbnNmb3JtLk1pY3Jvc29mdC5BbHBoYShvcGFjaXR5PTEpXFxcIlwiO1xuICAgIHRoaXMuZXZlbnREaXZfLnN0eWxlLmZpbHRlciA9IFwiYWxwaGEob3BhY2l0eT0xKVwiOyAvLyBGb3IgTVNJRVxuXG4gICAgdGhpcy5zZXRBbmNob3IoKTtcbiAgICB0aGlzLnNldFBvc2l0aW9uKCk7IC8vIFRoaXMgYWxzbyB1cGRhdGVzIHotaW5kZXgsIGlmIG5lY2Vzc2FyeS5cbiAgICB0aGlzLnNldFZpc2libGUoKTtcbiAgfTtcblxuICAvKipcbiAgICogU2V0cyB0aGUgYW5jaG9yIHBvaW50IG9mIHRoZSBsYWJlbC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIE1hcmtlckxhYmVsXy5wcm90b3R5cGUuc2V0QW5jaG9yID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBhbmNob3IgPSB0aGlzLm1hcmtlcl8uZ2V0KFwibGFiZWxBbmNob3JcIik7XG4gICAgdGhpcy5sYWJlbERpdl8uc3R5bGUubWFyZ2luTGVmdCA9IC1hbmNob3IueCArIFwicHhcIjtcbiAgICB0aGlzLmxhYmVsRGl2Xy5zdHlsZS5tYXJnaW5Ub3AgPSAtYW5jaG9yLnkgKyBcInB4XCI7XG4gICAgdGhpcy5ldmVudERpdl8uc3R5bGUubWFyZ2luTGVmdCA9IC1hbmNob3IueCArIFwicHhcIjtcbiAgICB0aGlzLmV2ZW50RGl2Xy5zdHlsZS5tYXJnaW5Ub3AgPSAtYW5jaG9yLnkgKyBcInB4XCI7XG4gIH07XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHBvc2l0aW9uIG9mIHRoZSBsYWJlbC4gVGhlIHotaW5kZXggaXMgYWxzbyB1cGRhdGVkLCBpZiBuZWNlc3NhcnkuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXJrZXJMYWJlbF8ucHJvdG90eXBlLnNldFBvc2l0aW9uID0gZnVuY3Rpb24gKHlPZmZzZXQpIHtcbiAgICB2YXIgcG9zaXRpb24gPSB0aGlzLmdldFByb2plY3Rpb24oKS5mcm9tTGF0TG5nVG9EaXZQaXhlbCh0aGlzLm1hcmtlcl8uZ2V0UG9zaXRpb24oKSk7XG4gICAgaWYgKHR5cGVvZiB5T2Zmc2V0ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICB5T2Zmc2V0ID0gMDtcbiAgICB9XG4gICAgdGhpcy5sYWJlbERpdl8uc3R5bGUubGVmdCA9IE1hdGgucm91bmQocG9zaXRpb24ueCkgKyBcInB4XCI7XG4gICAgdGhpcy5sYWJlbERpdl8uc3R5bGUudG9wID0gTWF0aC5yb3VuZChwb3NpdGlvbi55IC0geU9mZnNldCkgKyBcInB4XCI7XG4gICAgdGhpcy5ldmVudERpdl8uc3R5bGUubGVmdCA9IHRoaXMubGFiZWxEaXZfLnN0eWxlLmxlZnQ7XG4gICAgdGhpcy5ldmVudERpdl8uc3R5bGUudG9wID0gdGhpcy5sYWJlbERpdl8uc3R5bGUudG9wO1xuXG4gICAgdGhpcy5zZXRaSW5kZXgoKTtcbiAgfTtcblxuICAvKipcbiAgICogU2V0cyB0aGUgei1pbmRleCBvZiB0aGUgbGFiZWwuIElmIHRoZSBtYXJrZXIncyB6LWluZGV4IHByb3BlcnR5IGhhcyBub3QgYmVlbiBkZWZpbmVkLCB0aGUgei1pbmRleFxuICAgKiBvZiB0aGUgbGFiZWwgaXMgc2V0IHRvIHRoZSB2ZXJ0aWNhbCBjb29yZGluYXRlIG9mIHRoZSBsYWJlbC4gVGhpcyBpcyBpbiBrZWVwaW5nIHdpdGggdGhlIGRlZmF1bHRcbiAgICogc3RhY2tpbmcgb3JkZXIgZm9yIEdvb2dsZSBNYXBzOiBtYXJrZXJzIHRvIHRoZSBzb3V0aCBhcmUgaW4gZnJvbnQgb2YgbWFya2VycyB0byB0aGUgbm9ydGguXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBNYXJrZXJMYWJlbF8ucHJvdG90eXBlLnNldFpJbmRleCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgekFkanVzdCA9ICh0aGlzLm1hcmtlcl8uZ2V0KFwibGFiZWxJbkJhY2tncm91bmRcIikgPyAtMSA6ICsxKTtcbiAgICBpZiAodHlwZW9mIHRoaXMubWFya2VyXy5nZXRaSW5kZXgoKSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgdGhpcy5sYWJlbERpdl8uc3R5bGUuekluZGV4ID0gcGFyc2VJbnQodGhpcy5sYWJlbERpdl8uc3R5bGUudG9wLCAxMCkgKyB6QWRqdXN0O1xuICAgICAgdGhpcy5ldmVudERpdl8uc3R5bGUuekluZGV4ID0gdGhpcy5sYWJlbERpdl8uc3R5bGUuekluZGV4O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmxhYmVsRGl2Xy5zdHlsZS56SW5kZXggPSB0aGlzLm1hcmtlcl8uZ2V0WkluZGV4KCkgKyB6QWRqdXN0O1xuICAgICAgdGhpcy5ldmVudERpdl8uc3R5bGUuekluZGV4ID0gdGhpcy5sYWJlbERpdl8uc3R5bGUuekluZGV4O1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogU2V0cyB0aGUgdmlzaWJpbGl0eSBvZiB0aGUgbGFiZWwuIFRoZSBsYWJlbCBpcyB2aXNpYmxlIG9ubHkgaWYgdGhlIG1hcmtlciBpdHNlbGYgaXNcbiAgICogdmlzaWJsZSAoaS5lLiwgaXRzIHZpc2libGUgcHJvcGVydHkgaXMgdHJ1ZSkgYW5kIHRoZSBsYWJlbFZpc2libGUgcHJvcGVydHkgaXMgdHJ1ZS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIE1hcmtlckxhYmVsXy5wcm90b3R5cGUuc2V0VmlzaWJsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5tYXJrZXJfLmdldChcImxhYmVsVmlzaWJsZVwiKSkge1xuICAgICAgdGhpcy5sYWJlbERpdl8uc3R5bGUuZGlzcGxheSA9IHRoaXMubWFya2VyXy5nZXRWaXNpYmxlKCkgPyBcImJsb2NrXCIgOiBcIm5vbmVcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5sYWJlbERpdl8uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgIH1cbiAgICB0aGlzLmV2ZW50RGl2Xy5zdHlsZS5kaXNwbGF5ID0gdGhpcy5sYWJlbERpdl8uc3R5bGUuZGlzcGxheTtcbiAgfTtcblxuICAvKipcbiAgICogQG5hbWUgTWFya2VyV2l0aExhYmVsT3B0aW9uc1xuICAgKiBAY2xhc3MgVGhpcyBjbGFzcyByZXByZXNlbnRzIHRoZSBvcHRpb25hbCBwYXJhbWV0ZXIgcGFzc2VkIHRvIHRoZSB7QGxpbmsgTWFya2VyV2l0aExhYmVsfSBjb25zdHJ1Y3Rvci5cbiAgICogIFRoZSBwcm9wZXJ0aWVzIGF2YWlsYWJsZSBhcmUgdGhlIHNhbWUgYXMgZm9yIDxjb2RlPmdvb2dsZS5tYXBzLk1hcmtlcjwvY29kZT4gd2l0aCB0aGUgYWRkaXRpb25cbiAgICogIG9mIHRoZSBwcm9wZXJ0aWVzIGxpc3RlZCBiZWxvdy4gVG8gY2hhbmdlIGFueSBvZiB0aGVzZSBhZGRpdGlvbmFsIHByb3BlcnRpZXMgYWZ0ZXIgdGhlIGxhYmVsZWRcbiAgICogIG1hcmtlciBoYXMgYmVlbiBjcmVhdGVkLCBjYWxsIDxjb2RlPmdvb2dsZS5tYXBzLk1hcmtlci5zZXQocHJvcGVydHlOYW1lLCBwcm9wZXJ0eVZhbHVlKTwvY29kZT4uXG4gICAqICA8cD5cbiAgICogIFdoZW4gYW55IG9mIHRoZXNlIHByb3BlcnRpZXMgY2hhbmdlcywgYSBwcm9wZXJ0eSBjaGFuZ2VkIGV2ZW50IGlzIGZpcmVkLiBUaGUgbmFtZXMgb2YgdGhlc2VcbiAgICogIGV2ZW50cyBhcmUgZGVyaXZlZCBmcm9tIHRoZSBuYW1lIG9mIHRoZSBwcm9wZXJ0eSBhbmQgYXJlIG9mIHRoZSBmb3JtIDxjb2RlPnByb3BlcnR5bmFtZV9jaGFuZ2VkPC9jb2RlPi5cbiAgICogIEZvciBleGFtcGxlLCBpZiB0aGUgY29udGVudCBvZiB0aGUgbGFiZWwgY2hhbmdlcywgYSA8Y29kZT5sYWJlbGNvbnRlbnRfY2hhbmdlZDwvY29kZT4gZXZlbnRcbiAgICogIGlzIGZpcmVkLlxuICAgKiAgPHA+XG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nfE5vZGV9IFtsYWJlbENvbnRlbnRdIFRoZSBjb250ZW50IG9mIHRoZSBsYWJlbCAocGxhaW4gdGV4dCBvciBhbiBIVE1MIERPTSBub2RlKS5cbiAgICogQHByb3BlcnR5IHtQb2ludH0gW2xhYmVsQW5jaG9yXSBCeSBkZWZhdWx0LCBhIGxhYmVsIGlzIGRyYXduIHdpdGggaXRzIGFuY2hvciBwb2ludCBhdCAoMCwwKSBzb1xuICAgKiAgdGhhdCBpdHMgdG9wIGxlZnQgY29ybmVyIGlzIHBvc2l0aW9uZWQgYXQgdGhlIGFuY2hvciBwb2ludCBvZiB0aGUgYXNzb2NpYXRlZCBtYXJrZXIuIFVzZSB0aGlzXG4gICAqICBwcm9wZXJ0eSB0byBjaGFuZ2UgdGhlIGFuY2hvciBwb2ludCBvZiB0aGUgbGFiZWwuIEZvciBleGFtcGxlLCB0byBjZW50ZXIgYSA1MHB4LXdpZGUgbGFiZWxcbiAgICogIGJlbmVhdGggYSBtYXJrZXIsIHNwZWNpZnkgYSA8Y29kZT5sYWJlbEFuY2hvcjwvY29kZT4gb2YgPGNvZGU+Z29vZ2xlLm1hcHMuUG9pbnQoMjUsIDApPC9jb2RlPi5cbiAgICogIChOb3RlOiB4LXZhbHVlcyBpbmNyZWFzZSB0byB0aGUgcmlnaHQgYW5kIHktdmFsdWVzIGluY3JlYXNlIHRvIHRoZSB0b3AuKVxuICAgKiBAcHJvcGVydHkge3N0cmluZ30gW2xhYmVsQ2xhc3NdIFRoZSBuYW1lIG9mIHRoZSBDU1MgY2xhc3MgZGVmaW5pbmcgdGhlIHN0eWxlcyBmb3IgdGhlIGxhYmVsLlxuICAgKiAgTm90ZSB0aGF0IHN0eWxlIHZhbHVlcyBmb3IgPGNvZGU+cG9zaXRpb248L2NvZGU+LCA8Y29kZT5vdmVyZmxvdzwvY29kZT4sIDxjb2RlPnRvcDwvY29kZT4sXG4gICAqICA8Y29kZT5sZWZ0PC9jb2RlPiwgPGNvZGU+ekluZGV4PC9jb2RlPiwgPGNvZGU+ZGlzcGxheTwvY29kZT4sIDxjb2RlPm1hcmdpbkxlZnQ8L2NvZGU+LCBhbmRcbiAgICogIDxjb2RlPm1hcmdpblRvcDwvY29kZT4gYXJlIGlnbm9yZWQ7IHRoZXNlIHN0eWxlcyBhcmUgZm9yIGludGVybmFsIHVzZSBvbmx5LlxuICAgKiBAcHJvcGVydHkge09iamVjdH0gW2xhYmVsU3R5bGVdIEFuIG9iamVjdCBsaXRlcmFsIHdob3NlIHByb3BlcnRpZXMgZGVmaW5lIHNwZWNpZmljIENTU1xuICAgKiAgc3R5bGUgdmFsdWVzIHRvIGJlIGFwcGxpZWQgdG8gdGhlIGxhYmVsLiBTdHlsZSB2YWx1ZXMgZGVmaW5lZCBoZXJlIG92ZXJyaWRlIHRob3NlIHRoYXQgbWF5XG4gICAqICBiZSBkZWZpbmVkIGluIHRoZSA8Y29kZT5sYWJlbENsYXNzPC9jb2RlPiBzdHlsZSBzaGVldC4gSWYgdGhpcyBwcm9wZXJ0eSBpcyBjaGFuZ2VkIGFmdGVyIHRoZVxuICAgKiAgbGFiZWwgaGFzIGJlZW4gY3JlYXRlZCwgYWxsIHByZXZpb3VzbHkgc2V0IHN0eWxlcyAoZXhjZXB0IHRob3NlIGRlZmluZWQgaW4gdGhlIHN0eWxlIHNoZWV0KVxuICAgKiAgYXJlIHJlbW92ZWQgZnJvbSB0aGUgbGFiZWwgYmVmb3JlIHRoZSBuZXcgc3R5bGUgdmFsdWVzIGFyZSBhcHBsaWVkLlxuICAgKiAgTm90ZSB0aGF0IHN0eWxlIHZhbHVlcyBmb3IgPGNvZGU+cG9zaXRpb248L2NvZGU+LCA8Y29kZT5vdmVyZmxvdzwvY29kZT4sIDxjb2RlPnRvcDwvY29kZT4sXG4gICAqICA8Y29kZT5sZWZ0PC9jb2RlPiwgPGNvZGU+ekluZGV4PC9jb2RlPiwgPGNvZGU+ZGlzcGxheTwvY29kZT4sIDxjb2RlPm1hcmdpbkxlZnQ8L2NvZGU+LCBhbmRcbiAgICogIDxjb2RlPm1hcmdpblRvcDwvY29kZT4gYXJlIGlnbm9yZWQ7IHRoZXNlIHN0eWxlcyBhcmUgZm9yIGludGVybmFsIHVzZSBvbmx5LlxuICAgKiBAcHJvcGVydHkge2Jvb2xlYW59IFtsYWJlbEluQmFja2dyb3VuZF0gQSBmbGFnIGluZGljYXRpbmcgd2hldGhlciBhIGxhYmVsIHRoYXQgb3ZlcmxhcHMgaXRzXG4gICAqICBhc3NvY2lhdGVkIG1hcmtlciBzaG91bGQgYXBwZWFyIGluIHRoZSBiYWNrZ3JvdW5kIChpLmUuLCBpbiBhIHBsYW5lIGJlbG93IHRoZSBtYXJrZXIpLlxuICAgKiAgVGhlIGRlZmF1bHQgaXMgPGNvZGU+ZmFsc2U8L2NvZGU+LCB3aGljaCBjYXVzZXMgdGhlIGxhYmVsIHRvIGFwcGVhciBpbiB0aGUgZm9yZWdyb3VuZC5cbiAgICogQHByb3BlcnR5IHtib29sZWFufSBbbGFiZWxWaXNpYmxlXSBBIGZsYWcgaW5kaWNhdGluZyB3aGV0aGVyIHRoZSBsYWJlbCBpcyB0byBiZSB2aXNpYmxlLlxuICAgKiAgVGhlIGRlZmF1bHQgaXMgPGNvZGU+dHJ1ZTwvY29kZT4uIE5vdGUgdGhhdCBldmVuIGlmIDxjb2RlPmxhYmVsVmlzaWJsZTwvY29kZT4gaXNcbiAgICogIDxjb2RlPnRydWU8L2NvZGU+LCB0aGUgbGFiZWwgd2lsbCA8aT5ub3Q8L2k+IGJlIHZpc2libGUgdW5sZXNzIHRoZSBhc3NvY2lhdGVkIG1hcmtlciBpcyBhbHNvXG4gICAqICB2aXNpYmxlIChpLmUuLCB1bmxlc3MgdGhlIG1hcmtlcidzIDxjb2RlPnZpc2libGU8L2NvZGU+IHByb3BlcnR5IGlzIDxjb2RlPnRydWU8L2NvZGU+KS5cbiAgICogQHByb3BlcnR5IHtib29sZWFufSBbcmFpc2VPbkRyYWddIEEgZmxhZyBpbmRpY2F0aW5nIHdoZXRoZXIgdGhlIGxhYmVsIGFuZCBtYXJrZXIgYXJlIHRvIGJlXG4gICAqICByYWlzZWQgd2hlbiB0aGUgbWFya2VyIGlzIGRyYWdnZWQuIFRoZSBkZWZhdWx0IGlzIDxjb2RlPnRydWU8L2NvZGU+LiBJZiBhIGRyYWdnYWJsZSBtYXJrZXIgaXNcbiAgICogIGJlaW5nIGNyZWF0ZWQgYW5kIGEgdmVyc2lvbiBvZiBHb29nbGUgTWFwcyBBUEkgZWFybGllciB0aGFuIFYzLjMgaXMgYmVpbmcgdXNlZCwgdGhpcyBwcm9wZXJ0eVxuICAgKiAgbXVzdCBiZSBzZXQgdG8gPGNvZGU+ZmFsc2U8L2NvZGU+LlxuICAgKiBAcHJvcGVydHkge2Jvb2xlYW59IFtvcHRpbWl6ZWRdIEEgZmxhZyBpbmRpY2F0aW5nIHdoZXRoZXIgcmVuZGVyaW5nIGlzIHRvIGJlIG9wdGltaXplZCBmb3IgdGhlXG4gICAqICBtYXJrZXIuIDxiPkltcG9ydGFudDogVGhlIG9wdGltaXplZCByZW5kZXJpbmcgdGVjaG5pcXVlIGlzIG5vdCBzdXBwb3J0ZWQgYnkgTWFya2VyV2l0aExhYmVsLFxuICAgKiAgc28gdGhlIHZhbHVlIG9mIHRoaXMgcGFyYW1ldGVyIGlzIGFsd2F5cyBmb3JjZWQgdG8gPGNvZGU+ZmFsc2U8L2NvZGU+LlxuICAgKiBAcHJvcGVydHkge3N0cmluZ30gW2Nyb3NzSW1hZ2U9XCJodHRwOi8vbWFwcy5nc3RhdGljLmNvbS9pbnRsL2VuX3VzL21hcGZpbGVzL2RyYWdfY3Jvc3NfNjdfMTYucG5nXCJdXG4gICAqICBUaGUgVVJMIG9mIHRoZSBjcm9zcyBpbWFnZSB0byBiZSBkaXNwbGF5ZWQgd2hpbGUgZHJhZ2dpbmcgYSBtYXJrZXIuXG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbaGFuZEN1cnNvcj1cImh0dHA6Ly9tYXBzLmdzdGF0aWMuY29tL2ludGwvZW5fdXMvbWFwZmlsZXMvY2xvc2VkaGFuZF84XzguY3VyXCJdXG4gICAqICBUaGUgVVJMIG9mIHRoZSBjdXJzb3IgdG8gYmUgZGlzcGxheWVkIHdoaWxlIGRyYWdnaW5nIGEgbWFya2VyLlxuICAgKi9cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBNYXJrZXJXaXRoTGFiZWwgd2l0aCB0aGUgb3B0aW9ucyBzcGVjaWZpZWQgaW4ge0BsaW5rIE1hcmtlcldpdGhMYWJlbE9wdGlvbnN9LlxuICAgKiBAY29uc3RydWN0b3JcbiAgICogQHBhcmFtIHtNYXJrZXJXaXRoTGFiZWxPcHRpb25zfSBbb3B0X29wdGlvbnNdIFRoZSBvcHRpb25hbCBwYXJhbWV0ZXJzLlxuICAgKi9cbiAgZnVuY3Rpb24gTWFya2VyV2l0aExhYmVsKG9wdF9vcHRpb25zKSB7XG4gICAgb3B0X29wdGlvbnMgPSBvcHRfb3B0aW9ucyB8fCB7fTtcbiAgICBvcHRfb3B0aW9ucy5sYWJlbENvbnRlbnQgPSBvcHRfb3B0aW9ucy5sYWJlbENvbnRlbnQgfHwgXCJcIjtcbiAgICBvcHRfb3B0aW9ucy5sYWJlbEFuY2hvciA9IG9wdF9vcHRpb25zLmxhYmVsQW5jaG9yIHx8IG5ldyBnTWFwc0FwaS5Qb2ludCgwLCAwKTtcbiAgICBvcHRfb3B0aW9ucy5sYWJlbENsYXNzID0gb3B0X29wdGlvbnMubGFiZWxDbGFzcyB8fCBcIm1hcmtlckxhYmVsc1wiO1xuICAgIG9wdF9vcHRpb25zLmxhYmVsU3R5bGUgPSBvcHRfb3B0aW9ucy5sYWJlbFN0eWxlIHx8IHt9O1xuICAgIG9wdF9vcHRpb25zLmxhYmVsSW5CYWNrZ3JvdW5kID0gb3B0X29wdGlvbnMubGFiZWxJbkJhY2tncm91bmQgfHwgZmFsc2U7XG4gICAgaWYgKHR5cGVvZiBvcHRfb3B0aW9ucy5sYWJlbFZpc2libGUgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIG9wdF9vcHRpb25zLmxhYmVsVmlzaWJsZSA9IHRydWU7XG4gICAgfVxuICAgIGlmICh0eXBlb2Ygb3B0X29wdGlvbnMucmFpc2VPbkRyYWcgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIG9wdF9vcHRpb25zLnJhaXNlT25EcmFnID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBvcHRfb3B0aW9ucy5jbGlja2FibGUgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIG9wdF9vcHRpb25zLmNsaWNrYWJsZSA9IHRydWU7XG4gICAgfVxuICAgIGlmICh0eXBlb2Ygb3B0X29wdGlvbnMuZHJhZ2dhYmxlID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICBvcHRfb3B0aW9ucy5kcmFnZ2FibGUgPSBmYWxzZTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBvcHRfb3B0aW9ucy5vcHRpbWl6ZWQgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIG9wdF9vcHRpb25zLm9wdGltaXplZCA9IGZhbHNlO1xuICAgIH1cbiAgICBvcHRfb3B0aW9ucy5jcm9zc0ltYWdlID0gb3B0X29wdGlvbnMuY3Jvc3NJbWFnZSB8fCBcImh0dHBcIiArIChkb2N1bWVudC5sb2NhdGlvbi5wcm90b2NvbCA9PT0gXCJodHRwczpcIiA/IFwic1wiIDogXCJcIikgKyBcIjovL21hcHMuZ3N0YXRpYy5jb20vaW50bC9lbl91cy9tYXBmaWxlcy9kcmFnX2Nyb3NzXzY3XzE2LnBuZ1wiO1xuICAgIG9wdF9vcHRpb25zLmhhbmRDdXJzb3IgPSBvcHRfb3B0aW9ucy5oYW5kQ3Vyc29yIHx8IFwiaHR0cFwiICsgKGRvY3VtZW50LmxvY2F0aW9uLnByb3RvY29sID09PSBcImh0dHBzOlwiID8gXCJzXCIgOiBcIlwiKSArIFwiOi8vbWFwcy5nc3RhdGljLmNvbS9pbnRsL2VuX3VzL21hcGZpbGVzL2Nsb3NlZGhhbmRfOF84LmN1clwiO1xuICAgIG9wdF9vcHRpb25zLm9wdGltaXplZCA9IGZhbHNlOyAvLyBPcHRpbWl6ZWQgcmVuZGVyaW5nIGlzIG5vdCBzdXBwb3J0ZWRcblxuICAgIHRoaXMubGFiZWwgPSBuZXcgTWFya2VyTGFiZWxfKHRoaXMsIG9wdF9vcHRpb25zLmNyb3NzSW1hZ2UsIG9wdF9vcHRpb25zLmhhbmRDdXJzb3IpOyAvLyBCaW5kIHRoZSBsYWJlbCB0byB0aGUgbWFya2VyXG5cbiAgICAvLyBDYWxsIHRoZSBwYXJlbnQgY29uc3RydWN0b3IuIEl0IGNhbGxzIE1hcmtlci5zZXRWYWx1ZXMgdG8gaW5pdGlhbGl6ZSwgc28gYWxsXG4gICAgLy8gdGhlIG5ldyBwYXJhbWV0ZXJzIGFyZSBjb252ZW5pZW50bHkgc2F2ZWQgYW5kIGNhbiBiZSBhY2Nlc3NlZCB3aXRoIGdldC9zZXQuXG4gICAgLy8gTWFya2VyLnNldCB0cmlnZ2VycyBhIHByb3BlcnR5IGNoYW5nZWQgZXZlbnQgKGNhbGxlZCBcInByb3BlcnR5bmFtZV9jaGFuZ2VkXCIpXG4gICAgLy8gdGhhdCB0aGUgbWFya2VyIGxhYmVsIGxpc3RlbnMgZm9yIGluIG9yZGVyIHRvIHJlYWN0IHRvIHN0YXRlIGNoYW5nZXMuXG4gICAgZ01hcHNBcGkuTWFya2VyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cbiAgaW5oZXJpdHMoTWFya2VyV2l0aExhYmVsLCBnTWFwc0FwaS5NYXJrZXIpO1xuXG4gIC8qKlxuICAgKiBPdmVycmlkZXMgdGhlIHN0YW5kYXJkIE1hcmtlciBzZXRNYXAgZnVuY3Rpb24uXG4gICAqIEBwYXJhbSB7TWFwfSB0aGVNYXAgVGhlIG1hcCB0byB3aGljaCB0aGUgbWFya2VyIGlzIHRvIGJlIGFkZGVkLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgTWFya2VyV2l0aExhYmVsLnByb3RvdHlwZS5zZXRNYXAgPSBmdW5jdGlvbiAodGhlTWFwKSB7XG5cbiAgICAvLyBDYWxsIHRoZSBpbmhlcml0ZWQgZnVuY3Rpb24uLi5cbiAgICBnTWFwc0FwaS5NYXJrZXIucHJvdG90eXBlLnNldE1hcC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgLy8gLi4uIHRoZW4gZGVhbCB3aXRoIHRoZSBsYWJlbDpcbiAgICB0aGlzLmxhYmVsLnNldE1hcCh0aGVNYXApO1xuICB9O1xuXG4gIHJldHVybiBNYXJrZXJXaXRoTGFiZWw7XG59XG4iXX0=
