/**
 * Place model class to store each place key data.
 */
function Place(data) {
  this.name = ko.observable(data.name);
  this.lat = ko.observable(data.lat);
  this.lng = ko.observable(data.lng);
  this.foursquareId = ko.observable(data.foursquareId);
  this.marker;
}