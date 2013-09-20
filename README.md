mimosa-es6-module-transpiler
===========
## Overview

This module will allow you to utilize ES6 module syntax when building your client code.  It will transpile your JavaScript with ES6 syntax to AMD or CommonJS compliant JavaScript.  It can also output code that attaches modules to global scope.

For more information regarding Mimosa, see http://mimosa.io

## Usage

Add `'es6-module-transpiler'` to your list of modules.  That's all!  Mimosa will install the module for you when you start up.

## Functionality

This module will take your ES6 module syntax code and compile it down to a syntax usable with common module specs: AMD and CommonJS.

It will also allow you to compile it down to a format that exports code globally. If a module is exported globally, you may want to declare any `imports` it might have.  See the Example Config below.

Using a JavaScript transpiler like CoffeeScript? This module's functionality is applied after Mimosa has compiled source source code, which means after CoffeeScript/LiveScript etc have been transpiled to JavaScript. So the source language's Embedded JavaScript features need to be used to preserve the ES6 syntax and to keep transpilation from failing.

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

__Note__: This does not support the full set of ES6 module syntax, but it does the support the major pieces. This module wraps [square's transpiler](https://github.com/square/es6-module-transpiler), so as it adds features and more feature support this module will benefit.


## Default Config

```coffeescript
es6Modules:
  type:"amd"
  exclude:[/[/\\]vendor[/\\]/, /[/\\]main[\.-]/]
  globals:{}
```

- `type`: "amd", "common", or "globals"
- `exclude`:  List of regexes or strings to match files that should be excluded from transpiling.  String paths can be absolute or relative to the watch.sourceDir.  Regexes are applied to the entire path. By default anything in a vendor folder and anything that begins with `main.` or `main-` are excluded as presumably those should not be wrapped in a define as they are likely shimmed to be shimmed.
- `globals`: `globals` contains configurations for modules that you want to export themselves globally if you are not using a module loading strategy. See the Example Config below for example usage of the `globals` config.

## Example Config

```coffeescript
es6Modules:
  type:"globals"
  globals:
    "/javascripts/app/example":
      global: "ExampleApp"
      imports:
        jquery: "$"
````

- `global`'s keys are file paths to files in the `watch.sourceDir`. Each file that needs to export globally needs to have a path provided here. The path can include or not include the extension.
- `global`: `global` is the name of the global object that the export from the module gets attached to, if not provided it gets attached to window.
- `imports`: contains dependencies for the module, with the key being the variable name once imported and the value being the global name of the object to be imported. Any files not listed in globals are treated with the `type` config of either amd or common.