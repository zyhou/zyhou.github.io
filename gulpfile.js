
var child = require('child_process');
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var jekyll = (process.platform === "win32" ? "jekyll.bat" : "jekyll");

var source = '_css';
var destination = 'css';

gulp.task('css', function () {
    return gulp.src(source  + '/**/*.css')
        .pipe(plugins.csscomb())
        .pipe(plugins.cssbeautify({ indent: '  ' }))
        .pipe(plugins.autoprefixer())
        .pipe(plugins.csso())
        .pipe(plugins.concat('style.css'))
        .pipe(plugins.rename({suffix: '.min'}))
        .pipe(gulp.dest(destination));
});

gulp.task('jekyll', function(done) {
  return child.spawn(jekyll, ['serve', '--config', '_config-dev.yml'])
              .on('close', done);
});

gulp.watch(source, ['css']);

gulp.task('default', ['css', 'jekyll']);
