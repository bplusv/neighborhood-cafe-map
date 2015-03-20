var FoursquareViewModel = function() {
  var self = this;
  self.foursquareTemplate = $('[data-template=place-foursquare]');
  self.apiUrl = 'https://api.foursquare.com/v2/venues/{{venueId}}?' +
    'client_id=GYEK0PESSPOVGTN1AYR0XFPTHGPVGZDICA1ELEUZQ0M3MUFR&' + 
    'client_secret=JGKE1IPGETB11KPSWTP05HKMY0SF3ZQ4ENPIFD1HYVPY0JVF&v=20130815';


  /*
   * Load additional Foursquare data for the selected place.
   */
  self.loadPlaceInfo = function(foursquareId) {
    var placeUrl = self.apiUrl.replace('{{venueId}}', foursquareId);
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
   * Process the html template to display place data.
   */
  self.processTemplate = function(place) {
    var template = self.foursquareTemplate.html();
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