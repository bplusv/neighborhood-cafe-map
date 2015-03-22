var MapViewModel = function(mapCanvasId) {
  var self = this;
  self.placeLoadingTemplate = $('[data-template=place-loading]');
  self.placeErrorTemplate = $('[data-template=place-error]');
  self.foursquareViewModel = new FoursquareViewModel();
  self.infoWindow = new google.maps.InfoWindow();
  var mapCanvasDom = document.getElementById(mapCanvasId);
  self.map = new google.maps.Map(mapCanvasDom, {
    zoom: 12,
    center: new google.maps.LatLng(31.755, -106.44)
  });

  
  /*
   * Initialize the place markers on the map.
   */
  self.places = ko.observableArray([]);
  self.initMarkers = function(places) {
    self.places = places;
    ko.utils.arrayForEach(places(), function(place) {
      place.marker = new google.maps.Marker({
          position: new google.maps.LatLng(place.lat(), place.lng()),
          map: self.map,
          title: place.name()
      });
      google.maps.event.addListener(place.marker, 'click', function() {
        self.showPlace(place);
      });
    });
  };


  /*
   * Filter the map markers when the places get filtered.
   */
  self.updateMarkers = function(filteredPlaces) {
    ko.utils.arrayForEach(self.places(), function(place) {
      if(filteredPlaces.indexOf(place) > -1 && !place.marker.map) {
        place.marker.setMap(self.map);
      } else if (filteredPlaces.indexOf(place) == -1 && place.marker.map) {
        place.marker.setMap(null);
      }
    });
  };


  /*
   * Show additional information for the selected place.
   */
  self.showPlace = function(place) {
    self.infoWindow.setContent(self.placeLoadingTemplate.html());
    self.foursquareViewModel.loadPlaceInfo(place.foursquareId())
    .then(function(placeInfo) {
      self.infoWindow.setContent(placeInfo);
    }, function() {
      self.infoWindow.setContent(self.placeErrorTemplate.html());
    });
    self.infoWindow.open(self.map, place.marker);
    place.marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
      place.marker.setAnimation(null);
    }, 700);
  };
};