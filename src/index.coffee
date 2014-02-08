"use strict"

path = require 'path'

Compiler = require("es6-module-transpiler").Compiler

config = require './config'

logger = null

registration = (mimosaConfig, register) ->
  logger = mimosaConfig.log
  register ['add','update','buildFile'], 'afterCompile', _transpile, mimosaConfig.extensions.javascript

_transpile = (mimosaConfig, options, next) ->
  return next() unless options.files?.length

  for f in options.files
    if mimosaConfig.es6Modules?.excludeRegex? and f.inputFileName.match mimosaConfig.es6Modules.excludeRegex
      logger.debug "skipping es6Modules transpiling for [[ #{f.inputFileName} ]], file is excluded via regex"
    else if mimosaConfig.es6Modules.exclude?.indexOf(f.inputFileName) > -1
      logger.debug "skipping es6Modules transpiling for [[ #{f.inputFileName} ]], file is excluded via string path"
    else
      if f.outputFileText
        withNoExt = f.inputFileName.replace path.extname(f.inputFileName), ''
        cOpts = mimosaConfig.es6Modules.globals?[withNoExt] || mimosaConfig.es6Modules.globals?[f.inputFileName] || {}
        cOpts.type = mimosaConfig.es6Modules.type
        logger.debug "ES6 transpile of file [[ #{f.inputFileName} ]]"
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