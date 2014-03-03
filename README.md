mimosa-es6-module-transpiler-amd-shim
===========
## Overview

This module will allow you to utilize the latest verison of the [ES6 module transpiler](http://square.github.io/es6-module-transpiler/) which currently doesn't work properly with AMD due to some breaking changes in `v0.3.0`.

For more information regarding Mimosa, see http://mimosa.io

For more information regarding Mimosa's es6-module-transpiler, see https://github.com/dbashford/mimosa-es6-module-transpiler

## Usage

Add `'es6-module-transpiler-amd-shim'` to your list of modules __AFTER__ the `es6-module-transpiler`.  That's all!  Mimosa will install the module for you when you start up.

## Functionality

The output es6-module-transpiler output presumes that any library brought in includes `default` property where the libraries export is attached. With `v0.3.0` of the es6-module-transpiler, there were some [internal changes](https://github.com/square/es6-module-transpiler/blob/master/TRANSITION.md#internal-changes) that make it impossible to use AMD libraries if they aren't ES6 compiled themselves.  And so few are.  

This shim will patch that so that this:

```javascript
var Ember = __dependency1__["default"];
```

...which will not work, gets turned into this

```
var Ember = __dependency1__["default"] || __dependency1__;
```

which will work.  It also preserves the desired behavior of es6 modules.

Down the road when this `default` syntax is supported widely by libraries, you can just remove this module from your Mimosa project.
