/**
 * @fileoverview map-viewmodel.js
 * This file provides the google maps module, displays markers and infoWindow.
 */
var FoursquareViewModel = require('./foursquare-viewmodel.js');


module.exports = function(mapCanvasId) {
  var self = this;

  /**
   * Place loading template, used while the place data is loading.
   * @type {string}
   */
  self.PLACE_LOADING_TEMPLATE = $('[data-template=place-loading]').html();

  /**
   * Place error template, for display when the foursquare data fails loading.
   * @type {string}
   */
  self.PLACE_ERROR_TEMPLATE = $('[data-template=place-error]').html();

  /**
   * Foursquare module, used to retrieve additional place info.
   * @type {FoursquareViewModel}
   */
  self.foursquareViewModel = new FoursquareViewModel();

  /**
   * Google Maps dialog, displays a window above a place marker.
   * @type {google.maps.InfoWindow}
   */
  self.infoWindow = new google.maps.InfoWindow();

  /** The DOM element to attach the map to. */
  var mapCanvasDom = document.getElementById(mapCanvasId);

  /**
   * The Google Map main module.
   * @type {google.maps.Map}
   */
  self.map = new google.maps.Map(mapCanvasDom, {
    zoom: 12,
    center: new google.maps.LatLng(31.755, -106.44)
  });


  /*
   * Initialize the place markers on the map.
   * @param {Array.<Place>} places The initial loaded places.
   */
  self.places = ko.observableArray([]);
  self.initMarkers = function(places) {
    self.places = places;

    ko.utils.arrayForEach(places(), function(place) {
      place.marker = new google.maps.Marker({
        position: new google.maps.LatLng(place.lat(), place.lng()),
        map: self.map,
        title: place.name()
      });
      google.maps.event.addListener(place.marker, 'click', function() {
        self.showPlace(place);
      });
    });

  };


  /*
   * Filter the map markers when the places get filtered.
   * @param {Array.<Place>} filteredPlaces The places filtered by name.
   */
  self.updateMarkers = function(filteredPlaces) {
    ko.utils.arrayForEach(self.places(), function(place) {

      if (filteredPlaces.indexOf(place) > -1 && !place.marker.map) {
        place.marker.setMap(self.map);
      } else if (filteredPlaces.indexOf(place) == -1 && place.marker.map) {
        place.marker.setMap(null);
      }

    });
  };


  /*
   * Show additional info for the selected place.
   * @param {Place} place The selected place to show.
   */
  self.showPlace = function(place) {
    self.infoWindow.setContent(self.PLACE_LOADING_TEMPLATE);

    self.foursquareViewModel.loadPlaceInfo(place.foursquareId())
    .then(function(placeInfo) {
      self.infoWindow.setContent(placeInfo);
    }, function() {
      self.infoWindow.setContent(self.PLACE_ERROR_TEMPLATE);
    });

    self.infoWindow.open(self.map, place.marker);

    place.marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
      place.marker.setAnimation(null);
    }, 700);
  };
};
