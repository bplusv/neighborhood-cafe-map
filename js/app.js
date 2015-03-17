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
    return $.getJSON('js/places.json').then(function(jsonPlaces) {
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
    self.loadFoursquare();
    self.infoWindow.open(self.map, place.marker);
    place.marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
      place.marker.setAnimation(null);
    }, 700);
  };

  self.loadFoursquare = function() {
    var url = 'https://api.foursquare.com/v2/venues/502707c7e4b0fe423d9d34e2?client_id=GYEK0PESSPOVGTN1AYR0XFPTHGPVGZDICA1ELEUZQ0M3MUFR&client_secret=JGKE1IPGETB11KPSWTP05HKMY0SF3ZQ4ENPIFD1HYVPY0JVF&v=20130815';
    return $.getJSON(url).then(function(data) {
        var place = {};

        place.name = data.response.venue.name;
        place.url = data.response.venue.shortUrl;
        place.rating = data.response.venue.rating;
        place.address = data.response.venue.location.formattedAddress[0];
        place.likes = data.response.venue.likes.count;
        place.photo = data.response.venue.bestPhoto.prefix;
        place.photo += '100x150';
        place.photo += data.response.venue.bestPhoto.suffix;

        var content = '<p>' + place.name + '</p>';
        content += '<p>' + place.rating + '</p>';
        content += '<p>' + place.likes + '</p>';
        content += '<p>' + place.address + '</p>';
        content += '<p> <a href="' + place.url + '" target="_blank">Click here</a> </p>';
        content += '<img src="' + place.photo + '" />';

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