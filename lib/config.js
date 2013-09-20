"use strict";
var path;

path = require('path');

exports.defaults = function() {
  return {
    es6Modules: {
      type: "amd",
      exclude: [/[/\\]vendor[/\\]/, /[/\\]main[\.-]/],
      globals: {}
    }
  };
};

exports.placeholder = function() {
  return "\t\n\n  # es6Modules:\n    # type:\"amd\"              # output type, either \"amd\" or \"common\"\n    # globals: {}             # globals contains configurations for modules that you want to\n                              # export themselves globally if you are not using a module loading\n                              # strategy. Each entry in the object takes this form:\n                              # {\n                              #   filePath : {\n                              #     global: \"GlobalNamespaceName\",\n                              #     imports: {\n                              #       importedVariableName: \"globalName\"\n                              #     }\n                              #   }\n                              # }\n                              # 'filePath' is the path to the file to be exported globally relative\n                              # to 'watch.sourceDir'; the path must exist. 'global' is the name of\n                              # the global object that the export from the module gets attached to,\n                              # if not provided it gets attached to window. 'imports' contains\n                              # dependencies for the module, with the key being the variable name\n                              # once imported and the value being the global name of the object to\n                              # be imported. Any files not listed in globals are treated with the\n                              # 'type' config of either amd or common.\n    # exclude:[/[/\\]vendor[/\\]/, /[/\\]main[\.-]/]  # List of regexes or strings to match\n                              # files that should be excluded from transpiling.  String paths can\n                              # be absolute or relative to the watch.sourceDir.  Regexes are\n                              # applied to the entire path. By default anything in a vendor\n                              # folder and anything that begins with 'main.' or 'main-' are\n                              # excluded as presumably those should not be wrapped in a define\n                              # as they are likely shimmed to be shimmed.\n";
};

exports.validate = function(config, validators) {
  var errors, fullPath, globalConfig, globalFilePath, globalName, newGlobals, varName, _ref, _ref1;
  errors = [];
  if (validators.ifExistsIsObject(errors, "es6Modules config", config.es6Modules)) {
    if (validators.ifExistsIsString(errors, "es6Modules.type", config.es6Modules.type)) {
      if (["amd", "common"].indexOf(config.es6Modules.type) === -1) {
        errors.push("es6Modules.type must be either 'amd' or 'common'.");
      }
    }
    validators.ifExistsFileExcludeWithRegexAndString(errors, "es6Modules.exclude", config.es6Modules, config.watch.sourceDir);
    if (validators.ifExistsIsObject(errors, "es6Modules.globals", config.es6Modules.globals)) {
      newGlobals = {};
      _ref = config.es6Modules.globals;
      for (globalFilePath in _ref) {
        globalConfig = _ref[globalFilePath];
        globalConfig.type = "globals";
        if (validators.ifExistsIsString(errors, "es6Modules.globals.global", globalConfig.global)) {
          globalConfig.into = globalConfig.global;
        }
        fullPath = path.join(config.watch.sourceDir, globalFilePath);
        newGlobals[fullPath] = globalConfig;
        if (validators.ifExistsIsObject(errors, "es6Modules.globals.imports", globalConfig.imports)) {
          _ref1 = globalConfig.imports;
          for (varName in _ref1) {
            globalName = _ref1[varName];
            validators.ifExistsIsString(errors, "es6Modules.globals.imports value", globalName);
          }
        }
      }
      config.es6Modules.globals = newGlobals;
    }
  }
  return errors;
};
