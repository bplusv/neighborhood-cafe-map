var AppViewModel = function() {
  var self = this;
  self.places = ko.observableArray([]);
  self.search = ko.observable('');
  self.mapViewModel = new MapViewModel('map-canvas');


  /**
   * Get the json data & map it to Place model objects.
   */
  self.init = function() {
    return $.getJSON('places.json').then(function(json) {
        var mappedPlaces = $.map(json, function(data) {
          return new Place(data); });
        self.places(mappedPlaces);
        self.mapViewModel.initMarkers(self.places);
    });
  };

  /**
   * Returns a filtered list, by search name.
   */
  self.filteredPlaces = ko.computed(function() {
    var search = self.search();
    return ko.utils.arrayFilter(self.places(), function(place) {
        var placeName = place.name().toLowerCase();
        return placeName.indexOf(search) > -1;
    }).sort(function(l, r) { 
      lName = l.name().toLowerCase();
      rName = r.name().toLowerCase();
      return lName == rName ? 0 : (lName < rName ? -1 : 1) 
    });
  });

  self.filteredPlaces.subscribe(function(filteredPlaces) {
    self.mapViewModel.updateMarkers(filteredPlaces);
  });

  self.selectPlaceFromList = function(place) {
    $('.navmenu.canvas-slid').offcanvas('hide');
    self.mapViewModel.showPlace(place);
  };
  
};


/**
 * Init App.
 */
$(function() {
  var app = new AppViewModel();
  app.init().then(function() { 
    ko.applyBindings(app);
  });
});