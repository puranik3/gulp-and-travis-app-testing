const gulp = require( 'gulp' );
const jshint = require( 'gulp-jshint' );
const jscs = require( 'gulp-jscs' );
const stylish = require( 'gulp-jscs-stylish' );
const wiredep = require( 'wiredep' ).stream;
const nodemon = require( 'nodemon' );

// some files are commented for the demo
const jsFiles = [
    '*.js',
    'api/**/*.js',
    'init/**/*.js',
    // 'public/**/*.js',
    // 'server/**/*.js',
    // 'utils/**/*.js'
];

// configure a task called 'style'
// gulp.src(), gulp.pipe() etc. return streams. If we plan to use the style task as a "sub-task" elsewhere, we can return the stream from the function passed to gulp.task()
gulp.task( 'style', function() {
    return gulp.src( jsFiles )
        .pipe( jshint() )
        .pipe( jshint.reporter( 'jshint-stylish' ), {
            verbose: true
        })
        .pipe( jscs() )
        .pipe( stylish() );
});

gulp.task( 'inject', function() {
    return gulp.src( 'server/views/*.ejs' )
        .pipe( wiredep() )
        .pipe( gulp.dest( 'server/views' ) );
});

// runs taks in the tasks array in parallel
gulp.task( 'serve', [ 'style', 'inject' ], function() {
    let options = {
        script: 'index.js',
        delayTime: 1, // wait for a second
        env: {
            PORT: 4000,
            SESSION_SECRET: 'secret'
        },
        watch: [
            '*.js',
            'api/**/*.js',
            'init/**/*.js',
            'public/**/*.js',
            'server/**/*.js',
            'utils/**/*.js'
        ]
    }

    return nodemon( options )
        .on( 'restart', function( ev ) {
            console.log( 'restarting' );
        })
});