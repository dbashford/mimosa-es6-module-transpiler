"use strict";

var path = require( "path" )
  , Compiler = require("es6-module-transpiler").Compiler
  , config = require( "./config" )
  , logger = null;

var _transpile = function( mimosaConfig, options, next ) {

  if ( options.files && options.files.length ) {
    var es6m = mimosaConfig.es6Modules;

    options.files.forEach( function( f ) {
      if ( es6m && es6m.excludeRegex && f.inputFileName.match( es6m.excludeRegex ) ) {
        logger.debug( "skipping es6Modules transpiling for [[ " + f.inputFileName + " ]], file is excluded via regex" );
      } else {
        if ( es6m && es6m.exclude && es6m.exclude.indexOf( f.inputFileName ) > -1 ) {
          logger.debug( "skipping es6Modules transpiling for [[ " + f.inputFileName + " ]], file is excluded via string path" );
        } else {
          if ( f.outputFileText ) {
            var cOpts = {
              type: es6m.type
            };

            if ( es6m.globals ) {
              var withNoExt = f.inputFileName.replace( path.extname( f.inputFileName ), "" );
              cOpts.globals = es6m.globals[withNoExt] || es6m.globals[f.inputFileName] || {};
            }

            if ( logger.isDebug() ) {
              logger.debug( "ES6 transpile of file [[ " + f.inputFileName +  " ]]" );
              logger.debug( "ES6 transpile opts:", cOpts);
            }

            try {
              var compiler = new Compiler( f.outputFileText, null, cOpts );
              if ( cOpts.type === "amd" ) {
                f.outputFileText = compiler.toAMD();
              } else {
                if ( cOpts.type === "common" ) {
                  compiler.toCJS();
                } else {
                  compiler.toGlobals();
                }
              }
            } catch ( err ) {
              logger.error( "Error running es6 module transpiler on file [[ " + f.inputFileName + " ]] ", err );
            }
          }
        }
      }
    });
  }

  next();
};

var registration = function( mimosaConfig, register ) {
  logger = mimosaConfig.log;
  register( [ "add", "update", "buildFile" ], "afterCompile", _transpile, mimosaConfig.extensions.javascript );
};

module.exports = {
  registration: registration,
  defaults:     config.defaults,
  placeholder:  config.placeholder,
  validate:     config.validate
};
