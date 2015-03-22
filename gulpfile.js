var gulp = require("gulp"),
  minifyHTML = require("gulp-minify-html"),
  concat = require("gulp-concat"),
  uglify = require("gulp-uglify"),
  cssmin = require("gulp-cssmin"),
  sourcemaps = require("gulp-sourcemaps"),
  mainBowerFiles = require("main-bower-files"),
  inject = require("gulp-inject"),
  del = require('del'),
  watch = require('gulp-watch');

gulp.task('clean', [], function() {
  return del('dist/*');
});

gulp.task("html", function() {
    return gulp.src("src/**/*.html")
      .pipe(inject(
          gulp.src(
            mainBowerFiles(),
            {read: false, cwd: "bower_components"}
          ),
          {name: "bower", addPrefix: "lib"}
      ))
      .pipe(minifyHTML())
      .pipe(gulp.dest("dist"));
});
 
gulp.task("js", function() {
    return gulp.src("src/js/**/*.js")
      .pipe(sourcemaps.init())
      .pipe(concat("app.min.js"))
      .pipe(uglify())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest("dist/js"));
});

gulp.task("json", function() {
    return gulp.src("src/*.json")
      .pipe(gulp.dest("dist"));
});

gulp.task("css", function() {
    return gulp.src("src/css/**/*.css")
      .pipe(sourcemaps.init())
      .pipe(concat("main.min.css"))
      .pipe(cssmin())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest("dist/css"));
});

gulp.task("img", function() {
    return gulp.src("src/img/**/*.*")
      .pipe(gulp.dest("dist/img"));
});

gulp.task("bower", function() {
    return gulp.src(mainBowerFiles(), {base: "bower_components"})
      .pipe(gulp.dest("dist/lib"));
});

gulp.task("watch", function () {
    gulp.watch("src/**/*.*", ["default"]);
  });

gulp.task("default", ["clean", "html", "js", "json", "css", "img", "bower"]);
