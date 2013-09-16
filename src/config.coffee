"use strict"

exports.defaults = ->
  es6Modules:
    type:"amd"
    exclude:[/[/\\]vendor[/\\]/, /[/\\]main[\.-]/]

exports.placeholder = ->
  """
  \t

    # es6Modules:
      # type:"amd"                                      # output type, either "amd" or "common"
      # exclude:[/[/\\]vendor[/\\]/, /[/\\]main[\.-]/]  # List of regexes or strings to match
                                # files that should be excluded from transpiling.  String paths can
                                # be absolute or relative to the watch.sourceDir.  Regexes are
                                # applied to the entire path. By default anything in a vendor
                                # folder and anything that begins with 'main.' or 'main-' are
                                # excluded as presumably those should not be wrapped in a define
                                # as they are likely shimmed to be shimmed.

  """

exports.validate = (config, validators) ->
  errors = []
  if validators.ifExistsIsObject(errors, "es6Modules config", config.es6Modules)
    if validators.ifExistsIsString(errors, "es6Modules.type", config.es6Modules.type)
      if ["amd", "common"].indexOf(config.es6Modules.type) is -1
        errors.push "es6Modules.type must be either 'amd' or 'common'."

    validators.ifExistsFileExcludeWithRegexAndString(errors, "es6Modules.exclude", config.es6Modules, config.watch.sourceDir)


  errors
