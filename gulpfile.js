var gulp        = require('gulp')
    del         = require('del'),
    path        = require('path'),
    md          = require('gulp-remarkable'),
    notify      = require('gulp-notify'),
    compass     = require('gulp-compass'),
    foreach     = require('gulp-foreach'),
    rename      = require('gulp-rename'),
    browserSync = require('browser-sync'),
    reload      = browserSync.reload,
    toc         = require('gulp-toc'),
    replace     = require('gulp-replace'),
    changed     = require('gulp-changed'),
    swig        = require('gulp-swig'),
    frontMatter = require('gulp-front-matter'),
    concat      = require('gulp-concat'),
    wrap        = require('gulp-wrap'),
    opts        = {
      setup: function(swig) {
        swig.setDefaults({
          cache: false,
          loader: swig.loaders.fs(__dirname + '/includes/')
        });
      }
};


function swallowError(error) {
  this.emit('end');
}

function reportError(error) {
  notify.onError().apply(this, arguments);
  this.emit('end');
}

gulp.task('build', function () {
  return gulp.src('./data/files.json')
    .pipe(foreach(function(stream, file) {
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
          preset: 'full',
          remarkableOptions: {
            html: true
          }
        }))
        .pipe(wrap({
          src: 'includes/entry.html'
        }))
        // Combine the files.
        .pipe(concat(path.basename(file.path)));
    }))
    .pipe(rename("index.html"))
    .pipe(wrap({ src: './templates/default.html'}))
    .pipe(swig(opts))
    .pipe(toc({
      // Overrides the default method of building IDs in the content.
      TOC: '<div id="toc"><%= toc %></div>',
      header: '<h<%= level %> id="<%= anchor %>"><%= header %></h<%= level %>>',
      tocMax: 2,
      anchorMax: 2
    }))
    .pipe(gulp.dest('build'))
    .pipe(reload({stream:true}));
});

gulp.task('assets', function() {
  gulp.src('assets/**/')
    .pipe(changed('./build/assets/'))
    .pipe(gulp.dest('./build/assets/'))
    .pipe(reload({stream:true}));
});

gulp.task('browser-sync', function() {
  browserSync({
    reloadDelay: 300,
    notify: {
        styles: [ "position:fixed;top:5px;right:5px;width:10px;height:10px;background:#c82144;border-radius:50%;overflow:hidden;color:#c82144;z-index:99999" ]
    },
    server: {
      baseDir: [__dirname] + '/build/',
    }
  });
});

gulp.task('compass', function() {
  gulp.src('scss/**/*.scss')
    .pipe(compass({
      css: './build/assets/css/',
      sass: 'scss'
    }))
    .on('error', reportError)
    .pipe(reload({stream:true}));
});

gulp.task('clean', function (cb) {
  del('./build/', cb);
});

gulp.task('watch', function() {
    gulp.watch('scss/**/*.scss', ['compass']);
    gulp.watch('content/**/*.scss', ['build']);
    gulp.watch('templates/**/*.html', ['build']);
    gulp.watch('includes/**/*.html', ['build']);
    gulp.watch('assets/**/*.{js,css,png,jpg,svg}', ['assets']);
});

gulp.task('default', ['build', 'compass', 'assets', 'browser-sync', 'watch']);
