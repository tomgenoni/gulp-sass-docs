var gulp        = require('gulp')
    del         = require('del'),
    path        = require('path'),
    md          = require('gulp-remarkable'),
    foreach     = require('gulp-foreach'),
    swig        = require('gulp-swig'),
    browserSync = require('browser-sync'),
    reload      = browserSync.reload,
    toc         = require('gulp-toc'),
    replace     = require('gulp-replace'),
    frontMatter = require('gulp-front-matter'),
    concat      = require('gulp-concat'),
    wrap        = require('gulp-wrap'),
    opts        = {
      setup: function(swig) {
        swig.setDefaults({
          cache: false,
          loader: swig.loaders.fs(__dirname + '/includes/') // Set root path for includes.
        });
      }
};

gulp.task('build', function () {
  return gulp.src('./data/files.json')
    .pipe(foreach(function(stream, file){
      var contents = JSON.parse(file.contents.toString('utf8'));
      return gulp.src(contents)
        // Match and remove all code after [---] marker
        .pipe(replace(/^\/\/\s*\[---\](.|\n)*\n/gim, ""))
        // Remove all comment slashes.
        .pipe(replace(/^\/\/\s?/gim, ""))
        .pipe(frontMatter({
          property: 'data'
        }))
        .pipe(md({
          preset: 'commonmark'
        }))
        .pipe(wrap({
          src: 'includes/entry.html'
        }))
        //combine the files
        .pipe(concat(path.basename(file.path)));
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['build']);