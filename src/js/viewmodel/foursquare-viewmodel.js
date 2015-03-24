/**
 * @fileoverview foursquare-viewmodel.js
 * This file provides the foursquare module, retrieves additional place info.
 */

module.exports = function() {
  var self = this;

  /**
   * Place Foursquare template, used to display the additional place info.
   * @type {string}
   */
  self.PLACE_TEMPLATE = $('[data-template=place-foursquare]').html();

  /**
   * Foursquare api url, used to retrieve the json data for the place.
   * @type {string}
   */
  self.API_URL = 'https://api.foursquare.com/v2/venues/{{venueId}}?' +
    'client_id=GYEK0PESSPOVGTN1AYR0XFPTHGPVGZDICA1ELEUZQ0M3MUFR&' +
    'client_secret=JGKE1IPGETB11KPSWTP05HKMY0SF3ZQ4ENPIFD1HYVPY0JVF&v=20130815';


  /*
   * Load the Foursquare data for the selected place.
   * @param {string} foursquareId The foursquare unique venue identifier.
   * @return {string} Processed template with the place info.
   */
  self.loadPlaceInfo = function(foursquareId) {
    var placeUrl = self.API_URL.replace('{{venueId}}', foursquareId);

    return $.getJSON(placeUrl).then(function(json) {
      var place = {};

      place.name = json.response.venue.name || '';
      place.url = json.response.venue.shortUrl || '';
      place.rating = json.response.venue.rating || 0;
      place.address = json.response.venue.location.formattedAddress[0] || '';
      place.city = json.response.venue.location.formattedAddress[1] || '';
      place.likes = json.response.venue.likes.count || 0;
      place.photo = json.response.venue.bestPhoto.prefix;
      place.photo += '120x120';
      place.photo += json.response.venue.bestPhoto.suffix;
      place.tips = json.response.venue.tips.groups[0].items[0].text || '';

      return self.processTemplate(place);
    });

  };


  /*
   * Process the HTML template used to display the place data.
   * @param {Place} place The selected place to show.
   * @return {string} processed template with the place info.
   */
  self.processTemplate = function(place) {
    var template = self.PLACE_TEMPLATE;

    template = template.replace('{{place.name}}', place.name);
    template = template.replace('{{place.url}}', place.url);
    template = template.replace('{{place.rating}}', place.rating);
    template = template.replace('{{place.address}}', place.address);
    template = template.replace('{{place.city}}', place.city);
    template = template.replace('{{place.likes}}', place.likes);
    template = template.replace('{{place.photo}}', place.photo);
    template = template.replace('{{place.tips}}', place.tips);

    return template;
  };
};
