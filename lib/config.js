"use strict";
exports.defaults = function() {
  return {
    es6Modules: {
      type: "amd",
      exclude: [/[/\\]vendor[/\\]/, /[/\\]main[\.-]/]
    }
  };
};

exports.placeholder = function() {
  return "\t\n\n  # es6Modules:\n    # type:\"amd\"                                      # output type, either \"amd\" or \"common\"\n    # exclude:[/[/\\]vendor[/\\]/, /[/\\]main[\.-]/]  # List of regexes or strings to match\n                              # files that should be excluded from transpiling.  String paths can\n                              # be absolute or relative to the watch.sourceDir.  Regexes are\n                              # applied to the entire path. By default anything in a vendor\n                              # folder and anything that begins with 'main.' or 'main-' are\n                              # excluded as presumably those should not be wrapped in a define\n                              # as they are likely shimmed to be shimmed.\n";
};

exports.validate = function(config, validators) {
  var errors;
  errors = [];
  if (validators.ifExistsIsObject(errors, "es6Modules config", config.es6Modules)) {
    if (validators.ifExistsIsString(errors, "es6Modules.type", config.es6Modules.type)) {
      if (["amd", "common"].indexOf(config.es6Modules.type) === -1) {
        errors.push("es6Modules.type must be either 'amd' or 'common'.");
      }
    }
    validators.ifExistsFileExcludeWithRegexAndString(errors, "es6Modules.exclude", config.es6Modules, config.watch.sourceDir);
  }
  return errors;
};
