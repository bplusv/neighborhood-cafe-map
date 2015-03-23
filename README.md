## Neighborhood Map Project (Juarez - El Paso)

To install the project you need [Node.js](http://nodejs.org):
- First run 'sudo npm install' to setup the required dependencies.
- Next, run 'bower install' to retrieve front-end packages.
- Finally, run 'gulp' to build the site into the dist folder.
- You may now deploy the dist folder contents to a webserver.

Open your favorite Terminal and run these commands.
```sh
$ sudo npm install
$ bower install
$ gulp
```

###Project description:

- This App shows interesting Café places in the México and USA frontier (Juárez - El Paso).
- Reponsive Web Design: works across phone, tablet and desktop.
- Built with the KnockoutJS organizational framework.
- Separation of concerns:
    * Views as templates in HTML.
    * Model as JavaScript POJO Classes.
    * ViewModels as components (app, map & fousquare).
- Build process using GulpJS: genererates minified code to reduce size and HTTP requests.
- Shows additional place info in an asynchonous manner, using the Foursquare API.
- In the case of failed data retrievals, errors are handled and a friendly massage displayed.
- A fullscreeen Google Map, with markers, is presented on a responsive manner.
- Search: filters places and map markers on the fly.
- A places list view is provided on a responsive off-canvas menu.
- Code is formatted following the Google HTML/CSS/JS Style Guides.
- Commented HTML, CSS and JavaScript code using JSDoc annotations.

### Consulted Materials

* [Node.js](http://nodejs.org) - evented I/O for the backend
* [Gulp](http://gulpjs.com/) - the streaming build system
* http://jairtrejo.mx/blog/2014/11/baby-steps-with-gulp
* http://getbootstrap.com/components/
* https://developers.google.com/maps/documentation/javascript/tutorial
* https://developer.foursquare.com

### Project hosted on github pages:
* http://lusv.github.io/projects/p5/
