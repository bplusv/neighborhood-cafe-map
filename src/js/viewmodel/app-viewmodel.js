/**
 * @fileoverview app-viewmodel.js
 * This file provides the main app engine for the neighborhood map.
 */
var Place = require('../model/Place.js');
var MapViewModel = require('./map-viewmodel.js');


module.exports = function() {
  var self = this;

  /**
   * Map error template, for display when google maps fails loading.
   * @type {string}
   */
  self.MAP_ERROR_TEMPLATE = $('[data-template=maps-error]').html();

  /**
   * Array of all the available places.
   * @type {Array.<Place>}
   */
  self.places = ko.observableArray([]);

  /**
   * Search term to filter places by name.
   * @type {string}
   */
  self.search = ko.observable('');

  /** Check if google maps loaded correctly before proceeding. */
  if (typeof global.google === 'undefined') {
    $('#map-canvas').html(self.MAP_ERROR_TEMPLATE);
    return;
  }
  self.mapViewModel = new MapViewModel('map-canvas');


  /**
   * Get the json data & map it to Place model objects.
   * @return {promise} A promise that fulfills with the initial places.
   */
  self.init = function() {
    return $.getJSON('places.json').then(function(json) {
        var mappedPlaces = $.map(json, function(data) {
          return new Place(data);
        });
        self.places(mappedPlaces);
        self.mapViewModel.initMarkers(self.places);
    });
  };


  /**
   * Returns a filtered list of places by search.
   * @return {Array<Place>} The filtered array of places by name.
   */
  self.filteredPlaces = ko.computed(function() {
    var search = self.search().toLowerCase();

    return ko.utils.arrayFilter(self.places(), function(place) {

        var placeName = place.name().toLowerCase();
        return placeName.indexOf(search) > -1;

    }).sort(function(l, r) {

      lName = l.name().toLowerCase();
      rName = r.name().toLowerCase();
      return lName == rName ? 0 : (lName < rName ? -1 : 1);

    });
  });


  /**
   * Observes changes on filtered list and update map markers.
   * @param {Array<Place>} filteredPlaces The places filtered by name.
   */
  self.filteredPlaces.subscribe(function(filteredPlaces) {
    self.mapViewModel.updateMarkers(filteredPlaces);
  });


  /**
   * Handle event of clicking on a place of the list.
   * @param {Place} place The selected place from the list.
   */
  self.selectPlaceFromList = function(place) {
    $('.navmenu.canvas-slid').offcanvas('hide');
    self.mapViewModel.showPlace(place);
  };

};
