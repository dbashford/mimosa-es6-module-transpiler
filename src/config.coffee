"use strict"

exports.defaults = ->
  es6Modules:
    type:"amd"

exports.placeholder = ->
  """
  \t

    # es6Modules:
      # type:"amd"      # output type, either "amd" or "common"
  """

exports.validate = (config, validators) ->
  errors = []
  if validators.ifExistsIsObject(errors, "es6Modules config", config.es6Modules)
    if validators.ifExistsIsString(errors, "es6Modules.type", config.es6Modules.type)
      if ["amd", "common"].indexOf(config.es6Modules.type) is -1
        errors.push "es6Modules.type must be either 'amd' or 'common'."

  errors
