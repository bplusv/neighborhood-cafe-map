var ViewModel = function() {
  var self = this;

  self.map = new google.maps.Map(document.getElementById('map-canvas'), {
    zoom: 4,
    center: new google.maps.LatLng(-25.363882, 131.044922)
  });

  self.infoWindow = new google.maps.InfoWindow({
      content: '<p>this is a test</p>'
  });

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
            self.infoWindow.open(self.map, place.marker);
            place.marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() {
              place.marker.setAnimation(null);
            }, 700);
          });
        });

        self.places(jsonPlaces);
    });
  };

  self.showPlace = function(place) {
    $('.navmenu.canvas-slid').offcanvas('hide');

    self.infoWindow.open(self.map, place.marker);
    place.marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
      place.marker.setAnimation(null);
    }, 700);
  };
};


$(function() {
  var vm = new ViewModel();

  vm.init().then(function(){ 
    ko.applyBindings(vm);
  });
});