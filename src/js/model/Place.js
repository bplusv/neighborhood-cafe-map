(function(global) {
  global.app = global.app || {};

  /**
   *
   * Place model class representing an interesting neighborhood location.
   * @param {object} data Contains the initial place data.
   * @constructor
   */
  global.app.Place = function(data) {
    this.name = ko.observable(data.name);
    this.lat = ko.observable(data.lat);
    this.lng = ko.observable(data.lng);
    this.foursquareId = ko.observable(data.foursquareId);
    this.marker;
  };

})(window);
