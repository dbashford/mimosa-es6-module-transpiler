mimosa-es6-module-transpiler
===========
## Overview

This module will allow you to utilize ES6 module syntax when building your client code.  It will transpile your JavaScript with ES6 syntax to AMD or CommonJS compliant JavaScript.  It can also output code that attaches module to global scope.

For more information regarding Mimosa, see http://mimosa.io

## Usage

Add `'es6-module-transpiler'` to your list of modules.  That's all!  Mimosa will install the module for you when you start up.

## Functionality

This module will take your ES6 module syntax code and compile it down to a syntax usable with common module specs: AMD and CommonJS.

It will also allow you to compile it down to a format that exports code globally. If a module is exported globally, it needs to declare any `imports` it might have.  See the Example Config below.

This module's functionality is applied after Mimosa has compiled the source, which means after CoffeeScript/LiveScript etc have been transpiled to JavaScript. So the source language's Embedded JavaScript features need to be used to preserve the ES6 syntax and to encourage the source language's compiler to ignore the syntax.

For example, the following CoffeeScript (note the backticks in the CoffeeScript code)...

```coffeescript
`import $ from "jquery"`
`import templates from "templates"`

class ExampleView

...

`export default ExampleView`
```

will be compiled to

```javascript
define(
  ["jquery","templates"],
  function($, templates) {
    "use strict";
    var ExampleView;

    ...

    return ExampleView;
  });
```

__Note__: The ES6 transpiler currently does not support source maps. So source maps will not be generated, nor will source maps already present (as from CoffeeScript) be honored or updated.  They will not, however, be removed.

__Note__: The ES6 module syntax is fluid and may change down the road.

## Default Config

```coffeescript
es6Modules:
  type:"amd"
  exclude:[/[/\\]vendor[/\\]/, /[/\\]main[\.-]/]
  globals:{}
```

- `type`: "amd" or "common"
- `exclude`:  List of regexes or strings to match files that should be excluded from transpiling.  String paths can be absolute or relative to the watch.sourceDir.  Regexes are applied to the entire path. By default anything in a vendor folder and anything that begins with `main.` or `main-` are excluded as presumably those should not be wrapped in a define as they are likely shimmed to be shimmed.
- `globals`: `globals` contains configurations for modules that you want to export themselves globally if you are not using a module loading strategy. See the Example Config below for an example config.

## Example Config

```coffeescript
es6Modules:
  type:"globals"
  globals:
    "/javascripts/app/example.coffee":
      global: "ExampleApp"
      imports:
        jquery: "$"
````

- `global`'s keys are file paths to files in the `watch.sourceDir`. Each file that needs to export globally needs to have a path provided here.
- `global`: `global` is the name of the global object that the export from the module gets attached to, if not provided it gets attached to window.
- `imports`: contains dependencies for the module, with the key being the variable name once imported and the value being the global name of the object to be imported. Any files not listed in globals are treated with the `type` config of either amd or common.