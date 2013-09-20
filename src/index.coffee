"use strict"

logger = require 'logmimosa'
Compiler = require("es6-module-transpiler").Compiler

config = require './config'

registration = (mimosaConfig, register) ->
  e = mimosaConfig.extensions
  register ['add','update','buildFile'], 'compile', _transpile, e.javascript

_transpile = (mimosaConfig, options, next) ->
  return next() unless options.files?.length

  for f in options.files
    if mimosaConfig.es6Modules?.excludeRegex? and f.inputFileName.match mimosaConfig.es6Modules.excludeRegex
      logger.debug "skipping commonjs wrapping for [[ #{f.inputFileName} ]], file is excluded via regex"
    else if mimosaConfig.es6Modules.exclude?.indexOf(f.inputFileName) > -1
      logger.debug "skipping commonjs wrapping for [[ #{f.inputFileName} ]], file is excluded via string path"
    else
      if f.outputFileText
        cOpts = mimosaConfig.es6Modules.globals?[f.inputFileName] || {}
        cOpts.type = mimosaConfig.es6Modules.type
        compiler = new Compiler f.outputFileText, null, cOpts
        f.outputFileText = if cOpts.type is "amd"
          compiler.toAMD()
        else if cOpts.type is "common"
          compiler.toCJS()
        else
          compiler.toGlobals()

  next()

module.exports =
  registration:    registration
  defaults:        config.defaults
  placeholder:     config.placeholder
  validate:        config.validate