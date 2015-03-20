var ViewModel = function() {
  var self = this;

  self.map = new google.maps.Map(document.getElementById('map-canvas'), {
    zoom: 13,
    center: new google.maps.LatLng(31.738019, -106.46183)
  });

  window.infoWindow = self.infoWindow = new google.maps.InfoWindow();

  self.places = ko.observableArray([]);
  self.search = ko.observable('');

  self.filteredPlaces = ko.computed(function() {
    return self.places().filter(function(place){
      var search = self.search().toLowerCase();
      var placeName = place.name.toLowerCase();

      return placeName.indexOf(search) > -1;
    }).sort(function (l, r) {
      return l.name.toLowerCase() > r.name.toLowerCase() ? 1 : -1;
    });
  }, this);


  /*
   * Filter the map markers when the places get filtered
   */
  self.filteredPlaces.subscribe(function(filteredPlaces) {
    self.places().forEach(function(place) {
      if(filteredPlaces.indexOf(place) > -1 && !place.marker.map) {
        place.marker.setMap(self.map);
      } else if (filteredPlaces.indexOf(place) == -1 && place.marker.map) {
        place.marker.setMap(null);
      }
    });
  });

  self.init = function() {
    return $.getJSON('data/places.json').then(function(jsonPlaces) {
        jsonPlaces.forEach(function(place) {
          place.marker = new google.maps.Marker({
              position: new google.maps.LatLng(place.lat, place.lng),
              map: self.map,
              title: place.name
          });

          google.maps.event.addListener(place.marker, 'click', function() {
            self.showPlace(place);
          });
        });

        self.places(jsonPlaces);
    });
  };

  self.showPlace = function(place) {    
    self.infoWindow.setContent('<div style="height: 150px; width: 150px;"><img style="margin: 43px 0 0 55px;" src="img/spinner.gif" /></div>');
    self.loadFoursquare(place);
    self.infoWindow.open(self.map, place.marker);
    place.marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
      place.marker.setAnimation(null);
    }, 700);
  };

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

  self.selectPlaceFromList = function(place) {
    $('.navmenu.canvas-slid').offcanvas('hide');
    self.showPlace(place);
  };
};


$(function() {
  var vm = new ViewModel();

  vm.init().then(function(){ 
    ko.applyBindings(vm);
  });
});