"use strict"

config = require './config'

registration = (mimosaConfig, register) ->
  register ['add','update','buildFile'], 'afterCompile', _transpile, e.javascript

_transpile = (mimosaConfig, options, next) ->
  next()

module.exports =
  registration:    registration
  defaults:        config.defaults
  placeholder:     config.placeholder
  validate:        config.validate