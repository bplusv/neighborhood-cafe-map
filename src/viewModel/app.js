var ViewModel = function() {
  var self = this;
  
  self.loadFoursquare = function(place) {    
    var url = 'https://api.foursquare.com/v2/venues/{{venue_id}}?client_id=GYEK0PESSPOVGTN1AYR0XFPTHGPVGZDICA1ELEUZQ0M3MUFR&client_secret=JGKE1IPGETB11KPSWTP05HKMY0SF3ZQ4ENPIFD1HYVPY0JVF&v=20130815';

    url = url.replace('{{venue_id}}', place.foursquare_id);
    return $.getJSON(url).then(function(data) {
        var place = {};

        place.name = data.response.venue.name || '';
        place.url = data.response.venue.shortUrl || '';
        place.rating = data.response.venue.rating || 0;
        place.address = data.response.venue.location.formattedAddress[0] || '';
        place.city = data.response.venue.location.formattedAddress[1] || '';
        place.likes = data.response.venue.likes.count || 0;
        place.photo = data.response.venue.bestPhoto.prefix;
        place.photo += '120x120';
        place.photo += data.response.venue.bestPhoto.suffix;
        place.tips = data.response.venue.tips.groups[0].items[0].text || '';

        var content = '<div class="container foursquare-info-window">';
          content += '<h4 class="lead text-center">' + place.name + '</h4>';
          content += '<div class="row">';
            content += '<div class="col-md-5 text-center">';
              content += '<img class="foursquare-place-photo" src="' + place.photo + '" />';
            content += '</div>';
            content += '<div class="col-md-7">';
              content += '<span class="text-info"><span class="glyphicon glyphicon-star"></span>&nbsp;' + place.rating + '</span>&nbsp;';
              content += '&nbsp;<span><span class="glyphicon glyphicon-thumbs-up"></span>&nbsp;' + place.likes + '</span>';
              content += '<p>' + place.address + '</p>';
              content += '<p>' + place.city + '</p>';
              content += '<p class="hidden-xs hidden-sm">' + place.tips + '</p>';
            content += '</div>';
          content += '</div>';
          content += '<p class="text-center"><a href="' + place.url + '" target="_blank"><img class="foursquare-logo" alt="Foursquare link" src="https://ss0.4sqi.net/img/poweredByFoursquare/poweredby-one-color-cdf070cc7ae72b3f482cf2d075a74c8c.png" /></a></p>';
        content += '</div>';

        self.infoWindow.setContent(content);
    });
  };

};