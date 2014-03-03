"use strict";

var replaceReg = /((__dependency[0-9]*__)\["default"\])/g;

var _execute = function( mimosaConfig, options, next ) {
  if ( options.files && options.files.length ) {
    options.files.forEach( function( f ) {
      f.outputFileText = f.outputFileText.replace( replaceReg, "$1 || $2" );
    });
  }
  next();
};

exports.registration = function( mimosaConfig, register ) {
  register( [ "add", "update", "buildFile" ], "afterCompile", _execute, mimosaConfig.extensions.javascript );
};
