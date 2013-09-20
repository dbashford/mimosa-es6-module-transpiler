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
  var compiler, f, _i, _len, _ref, _ref1, _ref2, _ref3, _ref4;
  if (!((_ref = options.files) != null ? _ref.length : void 0)) {
    return next();
  }
  _ref1 = options.files;
  for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
    f = _ref1[_i];
    if ((((_ref2 = mimosaConfig.es6Modules) != null ? _ref2.excludeRegex : void 0) != null) && f.inputFileName.match(mimosaConfig.es6Modules.excludeRegex)) {
      logger.debug("skipping commonjs wrapping for [[ " + f.inputFileName + " ]], file is excluded via regex");
    } else if (((_ref3 = mimosaConfig.es6Modules.exclude) != null ? _ref3.indexOf(f.inputFileName) : void 0) > -1) {
      logger.debug("skipping commonjs wrapping for [[ " + f.inputFileName + " ]], file is excluded via string path");
    } else {
      if (f.outputFileText) {
        f.outputFileText = ((_ref4 = mimosaConfig.es6Modules) != null ? _ref4.globals[f.inputFileName] : void 0) ? (compiler = new Compiler(f.outputFileText, null, mimosaConfig.es6Modules.globals[f.inputFileName]), compiler.toGlobals()) : (compiler = new Compiler(f.outputFileText, null, {
          type: mimosaConfig.es6Modules.type
        }), mimosaConfig.es6Modules.type === "amd" ? compiler.toAMD() : compiler.toCJS());
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
