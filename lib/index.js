"use strict";
var Compiler, config, logger, registration, _transpile;

logger = require('logmimosa');

Compiler = require("es6-module-transpiler").Compiler;

config = require('./config');

registration = function(mimosaConfig, register) {
  var e;
  e = mimosaConfig.extensions;
  return register(['add', 'update', 'buildFile'], 'compile', _transpile, e.javascript);
};

_transpile = function(mimosaConfig, options, next) {
  var compiler, f, _i, _len, _ref, _ref1, _ref2;
  _ref = options.files;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    f = _ref[_i];
    if ((((_ref1 = mimosaConfig.es6Modules) != null ? _ref1.excludeRegex : void 0) != null) && f.inputFileName.match(mimosaConfig.es6Modules.excludeRegex)) {
      logger.debug("skipping commonjs wrapping for [[ " + f.inputFileName + " ]], file is excluded via regex");
    } else if (((_ref2 = mimosaConfig.es6Modules.exclude) != null ? _ref2.indexOf(f.inputFileName) : void 0) > -1) {
      logger.debug("skipping commonjs wrapping for [[ " + f.inputFileName + " ]], file is excluded via string path");
    } else {
      if (f.outputFileText) {
        compiler = new Compiler(f.outputFileText);
        f.outputFileText = mimosaConfig.es6Modules.type === "amd" ? compiler.toAMD() : compiler.toCJS();
      }
    }
  }
  return next();
};

module.exports = {
  registration: registration,
  defaults: config.defaults,
  placeholder: config.placeholder,
  validate: config.validate
};
