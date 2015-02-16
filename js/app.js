var ViewModel = function() {
  this.welcome = ko.observable('welcome');
};

ko.applyBindings(new ViewModel);