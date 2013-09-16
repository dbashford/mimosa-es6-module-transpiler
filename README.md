mimosa-es6-module-transpiler
===========
## Overview

This module will allow you to utilize ES6 module syntax when building your client code.  It will transpile your JavaScript with ES6 syntax to AMD or CommonJS compliant JavaScript.

For more information regarding Mimosa, see http://mimosa.io

## Usage

Add `'es6-module-transpiler'` to your list of modules.  That's all!  Mimosa will install the module for you when you start up.

## Functionality

This module will take your ES6 module syntax code and compile it down to a syntax usable with common module loaders AMD and CommonJS.

For example, the following CoffeeScript...

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

Note: The ES6 transpiler currently does not support source maps. So source maps will not be generated, nor will source maps already present (as from CoffeeScript) be honored or updated.  They will not, however, be removed.

Note: The ES6 module syntax is fluid and may change down the road.

## Default Config

```
es6Modules:
  type:"amd"
  exclude:[/[/\\]vendor[/\\]/, /[/\\]main[\.-]/]
```

- `type`: "amd" or "commonjs"
- `exclude`:  List of regexes or strings to match files that should be excluded from transpiling.  String paths can be absolute or relative to the watch.sourceDir.  Regexes are applied to the entire path. By default anything in a vendor folder and anything that begins with 'main.' or 'main-' are excluded as presumably those should not be wrapped in a define as they are likely shimmed to be shimmed.