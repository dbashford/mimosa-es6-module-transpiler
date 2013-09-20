"use strict";
var Compiler, config, logger, registration, _transpile;

logger = require('logmimosa');

Compiler = require("es6-module-transpiler").Compiler;

config = require('./config');

registration = function(mimosaConfig, register) {
  return register(['add', 'update', 'buildFile'], 'compile', _transpile, mimosaConfig.extensions.javascript);
};

_transpile = function(mimosaConfig, options, next) {
  var cOpts, compiler, f, _i, _len, _ref, _ref1, _ref2, _ref3, _ref4;
  if (!((_ref = options.files) != null ? _ref.length : void 0)) {
    return next();
  }
  _ref1 = options.files;
  for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
    f = _ref1[_i];
    if ((((_ref2 = mimosaConfig.es6Modules) != null ? _ref2.excludeRegex : void 0) != null) && f.inputFileName.match(mimosaConfig.es6Modules.excludeRegex)) {
      logger.debug("skipping es6Modules transpiling for [[ " + f.inputFileName + " ]], file is excluded via regex");
    } else if (((_ref3 = mimosaConfig.es6Modules.exclude) != null ? _ref3.indexOf(f.inputFileName) : void 0) > -1) {
      logger.debug("skipping es6Modules transpiling for [[ " + f.inputFileName + " ]], file is excluded via string path");
    } else {
      if (f.outputFileText) {
        cOpts = ((_ref4 = mimosaConfig.es6Modules.globals) != null ? _ref4[f.inputFileName] : void 0) || {};
        cOpts.type = mimosaConfig.es6Modules.type;
        compiler = new Compiler(f.outputFileText, null, cOpts);
        f.outputFileText = cOpts.type === "amd" ? compiler.toAMD() : cOpts.type === "common" ? compiler.toCJS() : compiler.toGlobals();
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
