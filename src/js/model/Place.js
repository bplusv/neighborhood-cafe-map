/**
 *
 * Place model class representing an interesting neighborhood location.
 * @param {object} data Contains the initial place data.
 * @constructor
 */
module.exports = function(data) {
  this.name = ko.observable(data.name);
  this.lat = ko.observable(data.lat);
  this.lng = ko.observable(data.lng);
  this.foursquareId = ko.observable(data.foursquareId);
  this.marker;
};