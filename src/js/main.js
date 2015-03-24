/**
 * @fileoverview main.js
 * Startup the main application.
 */
var AppViewModel = require('./viewmodel/app-viewmodel.js');


var app = new AppViewModel();
app.init().then(function() {
  ko.applyBindings(app);
});
