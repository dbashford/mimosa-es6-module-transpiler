"use strict"

path = require 'path'

exports.defaults = ->
  es6Modules:
    type:"amd"
    exclude: [/[/\\]vendor[/\\]/, /[/\\]main[\.-]/, /-main.js$/, /[/\\]common.js$/],
    globals:{}

exports.placeholder = ->
  """
  \t

    # es6Modules:
      # type:"amd"        # output type, either "amd" or "common" or "globals"
      # globals: {}       # globals contains configurations for modules that you want to
                          # export themselves globally if you are not using a module loading
                          # strategy. This section is only valid when "globals" is the type.
                          # Each entry in the object takes this form:
                          # {
                          #   filePath : {
                          #     global: "GlobalNamespaceName",
                          #     imports: {
                          #       importedVariableName: "globalName"
                          #     }
                          #   }
                          # }
                          # 'filePath' is the path to the file to be exported globally relative
                          # to 'watch.sourceDir'; the path must exist. 'global' is the name of
                          # the global object that the export from the module gets attached to,
                          # if not provided it gets attached to window. 'imports' contains
                          # dependencies for the module, with the key being the variable name
                          # once imported and the value being the global name of the object to
                          # be imported. Any files not listed in globals are treated with the
                          # 'type' config of either amd or common.
      # exclude:[/[/\\\\]vendor[/\\]/, /[/\\\\]main[\.-]/, /-main.js$/, /[/\\\\]common.js$/]
                          # List of regexes or strings to match files that should be excluded from
                          # transpiling. String paths can be absolute or relative to the
                          # watch.sourceDir. Regexes are applied to the entire path. By default
                          # anything in a vendor folder and anything that begins with 'main.' or
                          # 'main-', or that end in '-main' or 'common.js' are excluded as
                          # presumably those should not be wrapped in a  define as they are
                          # likely already "require"d or shimmed.

  """

exports.validate = (config, validators) ->
  errors = []
  if validators.ifExistsIsObject(errors, "es6Modules config", config.es6Modules)
    if validators.ifExistsIsString(errors, "es6Modules.type", config.es6Modules.type)
      if ["amd", "common", "globals"].indexOf(config.es6Modules.type) is -1
        errors.push "es6Modules.type must be either 'amd', 'common' or 'globals'."

    validators.ifExistsFileExcludeWithRegexAndString(errors, "es6Modules.exclude", config.es6Modules, config.watch.sourceDir)

    if validators.ifExistsIsObject(errors, "es6Modules.globals", config.es6Modules.globals)
      if config.es6Modules.type isnt "globals" and Object.keys(config.es6Modules.globals).length > 0
        errors.push "You have globals configured, but not chosen as the es6Modules.type"
      else
        newGlobals = {}
        for globalFilePath, globalConfig of config.es6Modules.globals
          if validators.ifExistsIsString(errors, "es6Modules.globals.global", globalConfig.global)
            globalConfig.into = globalConfig.global
          fullPath = path.join config.watch.sourceDir, globalFilePath
          newGlobals[fullPath] = globalConfig
          if validators.ifExistsIsObject(errors, "es6Modules.globals.imports", globalConfig.imports)
            for varName, globalName of globalConfig.imports
              validators.ifExistsIsString(errors, "es6Modules.globals.imports value", globalName)
        config.es6Modules.globals = newGlobals

  errors
