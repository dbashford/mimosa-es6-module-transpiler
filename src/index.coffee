"use strict"

logger = require 'logmimosa'
Compiler = require("es6-module-transpiler").Compiler

config = require './config'

registration = (mimosaConfig, register) ->
  e = mimosaConfig.extensions
  register ['add','update','buildFile'], 'compile', _transpile, e.javascript

_transpile = (mimosaConfig, options, next) ->

  for f in options.files

    if mimosaConfig.es6Modules?.excludeRegex? and f.inputFileName.match mimosaConfig.es6Modules.excludeRegex
      logger.debug "skipping commonjs wrapping for [[ #{f.inputFileName} ]], file is excluded via regex"
    else if mimosaConfig.es6Modules.exclude?.indexOf(f.inputFileName) > -1
      logger.debug "skipping commonjs wrapping for [[ #{f.inputFileName} ]], file is excluded via string path"
    else
      if f.outputFileText
        compiler = new Compiler f.outputFileText
        f.outputFileText = if mimosaConfig.es6Modules.type is "amd"
          compiler.toAMD()
        else
          compiler.toCJS()

  next()

module.exports =
  registration:    registration
  defaults:        config.defaults
  placeholder:     config.placeholder
  validate:        config.validate