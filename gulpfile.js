let gulp       = require('gulp');

// ----------------------------------------------------

const DEV   = './dev/';
const BUILD = './build/';

// ----------------------------------------------------

gulp.task('build', ['build:copy']);

// ----------------------------------------------------

gulp.task('build:copy', ['build:copy-manifest', 'build:copy-img', 'build:copy-js', 'build:copy-locales']);

gulp.task('build:copy-manifest', () =>
    gulp.src(DEV + 'manifest.json')
        .pipe(gulp.dest(BUILD))
);

gulp.task('build:copy-locales', () =>
    gulp.src(DEV + '_locales/**/*')
        .pipe(gulp.dest(BUILD + '_locales'))
);

gulp.task('build:copy-img', () =>
    gulp.src(DEV + 'img/*')
        .pipe(gulp.dest(BUILD + 'img'))
);

gulp.task('build:copy-js', () =>
    gulp.src(DEV + 'js/bundle/*')
        .pipe(gulp.dest(BUILD + 'js/bundle'))
);

// ----------------------------------------------------