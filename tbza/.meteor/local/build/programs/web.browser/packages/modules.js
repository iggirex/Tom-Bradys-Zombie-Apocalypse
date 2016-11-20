//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
// Source maps are supported by all recent versions of Chrome, Safari,  //
// and Firefox, and by Internet Explorer 11.                            //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var _ = Package.underscore._;
var meteorInstall = Package['modules-runtime'].meteorInstall;

/* Package-scope variables */
var Buffer, process;

var require = meteorInstall({"node_modules":{"meteor":{"modules":{"client.js":["./install-packages.js","./stubs.js","./buffer.js","./process.js","reify/lib/runtime","./css",function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/modules/client.js                                                                                 //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
require("./install-packages.js");                                                                             // 1
require("./stubs.js");                                                                                        // 2
require("./buffer.js");                                                                                       // 3
require("./process.js");                                                                                      // 4
require("reify/lib/runtime").enable(module.constructor);                                                      // 5
                                                                                                              // 6
exports.addStyles = require("./css").addStyles;                                                               // 7
                                                                                                              // 8
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"buffer.js":["buffer",function(require){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/modules/buffer.js                                                                                 //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
try {                                                                                                         // 1
  Buffer = global.Buffer || require("buffer").Buffer;                                                         // 2
} catch (noBuffer) {}                                                                                         // 3
                                                                                                              // 4
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"css.js":function(require,exports){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/modules/css.js                                                                                    //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
var doc = document;                                                                                           // 1
var head = doc.getElementsByTagName("head").item(0);                                                          // 2
                                                                                                              // 3
exports.addStyles = function (css) {                                                                          // 4
  var style = doc.createElement("style");                                                                     // 5
                                                                                                              // 6
  style.setAttribute("type", "text/css");                                                                     // 7
                                                                                                              // 8
  // https://msdn.microsoft.com/en-us/library/ms535871(v=vs.85).aspx                                          // 9
  var internetExplorerSheetObject =                                                                           // 10
    style.sheet || // Edge/IE11.                                                                              // 11
    style.styleSheet; // Older IEs.                                                                           // 12
                                                                                                              // 13
  if (internetExplorerSheetObject) {                                                                          // 14
    internetExplorerSheetObject.cssText = css;                                                                // 15
  } else {                                                                                                    // 16
    style.appendChild(doc.createTextNode(css));                                                               // 17
  }                                                                                                           // 18
                                                                                                              // 19
  return head.appendChild(style);                                                                             // 20
};                                                                                                            // 21
                                                                                                              // 22
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"install-packages.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/modules/install-packages.js                                                                       //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
function install(name, mainModule) {                                                                          // 1
  var meteorDir = {};                                                                                         // 2
                                                                                                              // 3
  // Given a package name <name>, install a stub module in the                                                // 4
  // /node_modules/meteor directory called <name>.js, so that                                                 // 5
  // require.resolve("meteor/<name>") will always return                                                      // 6
  // /node_modules/meteor/<name>.js instead of something like                                                 // 7
  // /node_modules/meteor/<name>/index.js, in the rare but possible event                                     // 8
  // that the package contains a file called index.js (#6590).                                                // 9
                                                                                                              // 10
  if (mainModule) {                                                                                           // 11
    meteorDir[name + ".js"] = [mainModule, function (require, e, module) {                                    // 12
      module.exports = require(mainModule);                                                                   // 13
    }];                                                                                                       // 14
  } else {                                                                                                    // 15
    // back compat with old Meteor packages                                                                   // 16
    meteorDir[name + ".js"] = function (r, e, module) {                                                       // 17
      module.exports = Package[name];                                                                         // 18
    };                                                                                                        // 19
  }                                                                                                           // 20
                                                                                                              // 21
  meteorInstall({                                                                                             // 22
    node_modules: {                                                                                           // 23
      meteor: meteorDir                                                                                       // 24
    }                                                                                                         // 25
  });                                                                                                         // 26
}                                                                                                             // 27
                                                                                                              // 28
// This file will be modified during computeJsOutputFilesMap to include                                       // 29
// install(<name>) calls for every Meteor package.                                                            // 30
                                                                                                              // 31
install("underscore");                                                                                        // 32
install("meteor");                                                                                            // 33
install("meteor-base");                                                                                       // 34
install("mobile-experience");                                                                                 // 35
install("modules-runtime");                                                                                   // 36
install("modules", "meteor/modules/client.js");                                                               // 37
install("es5-shim", "meteor/es5-shim/client.js");                                                             // 38
install("promise", "meteor/promise/client.js");                                                               // 39
install("ecmascript-runtime", "meteor/ecmascript-runtime/runtime.js");                                        // 40
install("babel-compiler");                                                                                    // 41
install("ecmascript");                                                                                        // 42
install("base64");                                                                                            // 43
install("ejson");                                                                                             // 44
install("id-map");                                                                                            // 45
install("ordered-dict");                                                                                      // 46
install("tracker");                                                                                           // 47
install("babel-runtime", "meteor/babel-runtime/babel-runtime.js");                                            // 48
install("random");                                                                                            // 49
install("mongo-id");                                                                                          // 50
install("diff-sequence");                                                                                     // 51
install("geojson-utils", "meteor/geojson-utils/main.js");                                                     // 52
install("minimongo");                                                                                         // 53
install("check", "meteor/check/match.js");                                                                    // 54
install("retry");                                                                                             // 55
install("ddp-common");                                                                                        // 56
install("reload");                                                                                            // 57
install("ddp-client");                                                                                        // 58
install("ddp");                                                                                               // 59
install("ddp-server");                                                                                        // 60
install("allow-deny");                                                                                        // 61
install("insecure");                                                                                          // 62
install("mongo");                                                                                             // 63
install("blaze-html-templates");                                                                              // 64
install("reactive-var");                                                                                      // 65
install("jquery", "meteor/jquery/main.js");                                                                   // 66
install("standard-minifier-css");                                                                             // 67
install("standard-minifier-js");                                                                              // 68
install("shell-server");                                                                                      // 69
install("autopublish");                                                                                       // 70
install("webapp");                                                                                            // 71
install("livedata");                                                                                          // 72
install("hot-code-push");                                                                                     // 73
install("observe-sequence");                                                                                  // 74
install("deps");                                                                                              // 75
install("htmljs");                                                                                            // 76
install("blaze");                                                                                             // 77
install("spacebars");                                                                                         // 78
install("templating-compiler");                                                                               // 79
install("templating-runtime");                                                                                // 80
install("templating");                                                                                        // 81
install("launch-screen");                                                                                     // 82
install("ui");                                                                                                // 83
install("autoupdate");                                                                                        // 84
                                                                                                              // 85
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"process.js":["process",function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/modules/process.js                                                                                //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
try {                                                                                                         // 1
  // The application can run `npm install process` to provide its own                                         // 2
  // process stub; otherwise this module will provide a partial stub.                                         // 3
  process = global.process || require("process");                                                             // 4
} catch (noProcess) {                                                                                         // 5
  process = {};                                                                                               // 6
}                                                                                                             // 7
                                                                                                              // 8
if (Meteor.isServer) {                                                                                        // 9
  // Make require("process") work on the server in all versions of Node.                                      // 10
  meteorInstall({                                                                                             // 11
    node_modules: {                                                                                           // 12
      "process.js": function (r, e, module) {                                                                 // 13
        module.exports = process;                                                                             // 14
      }                                                                                                       // 15
    }                                                                                                         // 16
  });                                                                                                         // 17
} else {                                                                                                      // 18
  process.platform = "browser";                                                                               // 19
  process.nextTick = process.nextTick || Meteor._setImmediate;                                                // 20
}                                                                                                             // 21
                                                                                                              // 22
if (typeof process.env !== "object") {                                                                        // 23
  process.env = {};                                                                                           // 24
}                                                                                                             // 25
                                                                                                              // 26
_.extend(process.env, meteorEnv);                                                                             // 27
                                                                                                              // 28
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"stubs.js":["meteor-node-stubs",function(require){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/modules/stubs.js                                                                                  //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
try {                                                                                                         // 1
  // When meteor-node-stubs is installed in the application's root                                            // 2
  // node_modules directory, requiring it here installs aliases for stubs                                     // 3
  // for all Node built-in modules, such as fs, util, and http.                                               // 4
  require("meteor-node-stubs");                                                                               // 5
} catch (noStubs) {}                                                                                          // 6
                                                                                                              // 7
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"node_modules":{"reify":{"lib":{"runtime.js":["./entry.js","./utils.js",function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// node_modules/meteor/modules/node_modules/reify/lib/runtime.js                                              //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
var Entry = require("./entry.js").Entry;                                                                      // 1
var utils = require("./utils.js");                                                                            // 2
                                                                                                              // 3
exports.enable = function (Module) {                                                                          // 4
  var Mp = Module.prototype;                                                                                  // 5
                                                                                                              // 6
  if (typeof Mp.import === "function" &&                                                                      // 7
      typeof Mp.export === "function") {                                                                      // 8
    // If the Mp.{import,export} methods have already been                                                    // 9
    // defined, abandon reification immediately.                                                              // 10
    return Module;                                                                                            // 11
  }                                                                                                           // 12
                                                                                                              // 13
  // Platform-specific code should implement this method however                                              // 14
  // appropriate. Module.prototype.resolve(id) should return an absolute                                      // 15
  // version of the given module identifier, like require.resolve.                                            // 16
  Mp.resolve = Mp.resolve || function resolve(id) {                                                           // 17
    throw new Error("Module.prototype.resolve not implemented");                                              // 18
  };                                                                                                          // 19
                                                                                                              // 20
  // Platform-specific code should find a way to call this method whenever                                    // 21
  // the module system is about to return module.exports from require. This                                   // 22
  // might happen more than once per module, in case of dependency cycles,                                    // 23
  // so we want Module.prototype.runModuleSetters to run each time.                                           // 24
  Mp.runModuleSetters = function runModuleSetters(valueToPassThrough) {                                       // 25
    var entry = Entry.get(this.id);                                                                           // 26
    if (entry) {                                                                                              // 27
      entry.runModuleSetters(this);                                                                           // 28
    }                                                                                                         // 29
                                                                                                              // 30
    // Assignments to exported local variables get wrapped with calls to                                      // 31
    // module.runModuleSetters, so module.runModuleSetters returns the                                        // 32
    // valueToPassThrough parameter to allow the value of the original                                        // 33
    // expression to pass through. For example,                                                               // 34
    //                                                                                                        // 35
    //   export var a = 1;                                                                                    // 36
    //   console.log(a += 3);                                                                                 // 37
    //                                                                                                        // 38
    // becomes                                                                                                // 39
    //                                                                                                        // 40
    //   module.export("a", () => a);                                                                         // 41
    //   var a = 1;                                                                                           // 42
    //   console.log(module.runModuleSetters(a += 3));                                                        // 43
    //                                                                                                        // 44
    // This ensures module.runModuleSetters runs immediately after the                                        // 45
    // assignment, and does not interfere with the larger computation.                                        // 46
    return valueToPassThrough;                                                                                // 47
  };                                                                                                          // 48
                                                                                                              // 49
  function setESModule(module) {                                                                              // 50
    var exports = module.exports;                                                                             // 51
    if (exports && typeof exports === "object") {                                                             // 52
      exports.__esModule = true;                                                                              // 53
    }                                                                                                         // 54
  }                                                                                                           // 55
                                                                                                              // 56
  Mp.import = function (id, setters) {                                                                        // 57
    var module = this;                                                                                        // 58
    setESModule(module);                                                                                      // 59
                                                                                                              // 60
    var absoluteId = module.resolve(id);                                                                      // 61
                                                                                                              // 62
    if (setters && typeof setters === "object") {                                                             // 63
      var entry = Entry.getOrCreate(absoluteId);                                                              // 64
      entry.addSetters(module, setters);                                                                      // 65
    }                                                                                                         // 66
                                                                                                              // 67
    var countBefore = entry && entry.runCount;                                                                // 68
    var exports = typeof module.require === "function"                                                        // 69
      ? module.require(absoluteId)                                                                            // 70
      : require(absoluteId);                                                                                  // 71
                                                                                                              // 72
    if (entry && entry.runCount === countBefore) {                                                            // 73
      // If require(absoluteId) didn't run any setters for this entry,                                        // 74
      // perhaps because it's not the first time this module has been                                         // 75
      // required, run the setters now using an object that passes as the                                     // 76
      // real module object.                                                                                  // 77
      entry.runModuleSetters({                                                                                // 78
        id: absoluteId,                                                                                       // 79
        exports: exports,                                                                                     // 80
        getExportByName: Mp.getExportByName                                                                   // 81
      });                                                                                                     // 82
    }                                                                                                         // 83
  };                                                                                                          // 84
                                                                                                              // 85
  // Register getter functions for local variables in the scope of an                                         // 86
  // export statement. The keys of the getters object are exported names,                                     // 87
  // and the values are functions that return local values.                                                   // 88
  Mp.export = function (getters) {                                                                            // 89
    var module = this;                                                                                        // 90
    setESModule(module);                                                                                      // 91
                                                                                                              // 92
    if (utils.isPlainObject(getters)) {                                                                       // 93
      Entry.getOrCreate(module.id).addGetters(getters);                                                       // 94
    }                                                                                                         // 95
                                                                                                              // 96
    if (module.loaded) {                                                                                      // 97
      // If the module has already been evaluated, then we need to trigger                                    // 98
      // another round of entry.runModuleSetters calls, which begins by                                       // 99
      // calling entry.runModuleGetters(module).                                                              // 100
      module.runModuleSetters();                                                                              // 101
    }                                                                                                         // 102
  };                                                                                                          // 103
                                                                                                              // 104
  // This method can be overridden by client code to implement custom export                                  // 105
  // naming logic. The current implementation works well with Babel's                                         // 106
  // __esModule convention.                                                                                   // 107
  Mp.getExportByName = function (name) {                                                                      // 108
    var exports = this.exports;                                                                               // 109
                                                                                                              // 110
    if (name === "*") {                                                                                       // 111
      return exports;                                                                                         // 112
    }                                                                                                         // 113
                                                                                                              // 114
    if (name === "default" &&                                                                                 // 115
        ! (exports &&                                                                                         // 116
           typeof exports === "object" &&                                                                     // 117
           exports.__esModule &&                                                                              // 118
           "default" in exports)) {                                                                           // 119
      return exports;                                                                                         // 120
    }                                                                                                         // 121
                                                                                                              // 122
    return exports && exports[name];                                                                          // 123
  };                                                                                                          // 124
                                                                                                              // 125
  return Module;                                                                                              // 126
};                                                                                                            // 127
                                                                                                              // 128
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"entry.js":["./utils.js",function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// node_modules/meteor/modules/node_modules/reify/lib/entry.js                                                //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
var hasOwn = Object.prototype.hasOwnProperty;                                                                 // 1
var entryMap = Object.create(null);                                                                           // 2
var utils = require("./utils.js");                                                                            // 3
                                                                                                              // 4
function Entry(id) {                                                                                          // 5
  // Same as module.id for this module.                                                                       // 6
  this.id = id;                                                                                               // 7
  // The number of times this.runModuleSetters has been called.                                               // 8
  this.runCount = 0;                                                                                          // 9
  // Setters for assigning to local variables in parent modules.                                              // 10
  this.setters = Object.create(null);                                                                         // 11
  // Getters for local variables exported from this module.                                                   // 12
  this.getters = Object.create(null);                                                                         // 13
}                                                                                                             // 14
                                                                                                              // 15
var Ep = Entry.prototype;                                                                                     // 16
                                                                                                              // 17
Entry.get = function (id) {                                                                                   // 18
  return entryMap[id] || null;                                                                                // 19
};                                                                                                            // 20
                                                                                                              // 21
Entry.getOrCreate = function (id) {                                                                           // 22
  return entryMap[id] = entryMap[id] || new Entry(id);                                                        // 23
};                                                                                                            // 24
                                                                                                              // 25
Ep.addSetters = function (parent, setters) {                                                                  // 26
  var entry = this;                                                                                           // 27
                                                                                                              // 28
  Object.keys(setters).forEach(function (name) {                                                              // 29
    var setter = setters[name];                                                                               // 30
    if (typeof setter === "function" &&                                                                       // 31
        // Ignore any requests for the exports.__esModule property."                                          // 32
        name !== "__esModule") {                                                                              // 33
      setter.parent = parent;                                                                                 // 34
      (entry.setters[name] =                                                                                  // 35
       entry.setters[name] || []                                                                              // 36
      ).push(setter);                                                                                         // 37
    }                                                                                                         // 38
  });                                                                                                         // 39
};                                                                                                            // 40
                                                                                                              // 41
Ep.addGetters = function (getters) {                                                                          // 42
  var entry = this;                                                                                           // 43
  Object.keys(getters).forEach(function (name) {                                                              // 44
    var getter = getters[name];                                                                               // 45
    if (typeof getter === "function" &&                                                                       // 46
        // Ignore any requests for the exports.__esModule property."                                          // 47
        name !== "__esModule") {                                                                              // 48
      // Should this throw if hasOwn.call(this.getters, name)?                                                // 49
      entry.getters[name] = getter;                                                                           // 50
    }                                                                                                         // 51
  });                                                                                                         // 52
};                                                                                                            // 53
                                                                                                              // 54
function runModuleSetters(module) {                                                                           // 55
  var entry = entryMap[module.id];                                                                            // 56
  if (entry) {                                                                                                // 57
    entry.runModuleSetters(module);                                                                           // 58
  }                                                                                                           // 59
}                                                                                                             // 60
                                                                                                              // 61
function runModuleGetters(module) {                                                                           // 62
  var entry = entryMap[module.id];                                                                            // 63
  return entry ? entry.runModuleGetters(module) : 0;                                                          // 64
}                                                                                                             // 65
                                                                                                              // 66
Ep.runModuleGetters = function (module) {                                                                     // 67
  var entry = this;                                                                                           // 68
  var changeCount = 0;                                                                                        // 69
                                                                                                              // 70
  Object.keys(entry.getters).forEach(function (name) {                                                        // 71
    if (entry.runGetter(module, name)) {                                                                      // 72
      ++changeCount;                                                                                          // 73
    }                                                                                                         // 74
  });                                                                                                         // 75
                                                                                                              // 76
  return changeCount;                                                                                         // 77
};                                                                                                            // 78
                                                                                                              // 79
// Returns true iff the getter updated module.exports with a new value.                                       // 80
Ep.runGetter = function (module, name) {                                                                      // 81
  if (! hasOwn.call(this.getters, name)) {                                                                    // 82
    return false;                                                                                             // 83
  }                                                                                                           // 84
                                                                                                              // 85
  var getter = this.getters[name];                                                                            // 86
  try {                                                                                                       // 87
    var value = getter.call(module);                                                                          // 88
  } catch (e) {}                                                                                              // 89
  var exports = module.exports;                                                                               // 90
                                                                                                              // 91
  if (! hasOwn.call(exports, name) ||                                                                         // 92
      exports[name] !== value) {                                                                              // 93
    // We update module.exports[name] with the current value so that                                          // 94
    // CommonJS require calls remain consistent with module.import.                                           // 95
    exports[name] = value;                                                                                    // 96
    return true;                                                                                              // 97
  }                                                                                                           // 98
                                                                                                              // 99
  return false;                                                                                               // 100
};                                                                                                            // 101
                                                                                                              // 102
// Called whenever module.exports might have changed, to trigger any                                          // 103
// setters associated with the newly exported values.                                                         // 104
Ep.runModuleSetters = function (module) {                                                                     // 105
  var entry = this;                                                                                           // 106
  var names = Object.keys(entry.setters);                                                                     // 107
                                                                                                              // 108
  // Make sure module.exports is up to date before we call                                                    // 109
  // module.getExportByName(name).                                                                            // 110
  entry.runModuleGetters(module);                                                                             // 111
                                                                                                              // 112
  // Invoke the given callback once for every (setter, value, name) triple                                    // 113
  // that needs to be called. Note that forEachSetter does not call any                                       // 114
  // setters itself, only the given callback.                                                                 // 115
  function forEachSetter(callback, context) {                                                                 // 116
    names.forEach(function (name) {                                                                           // 117
      entry.setters[name].forEach(function (setter) {                                                         // 118
        var value = module.getExportByName(name);                                                             // 119
        if (name === "*") {                                                                                   // 120
          Object.keys(value).forEach(function (name) {                                                        // 121
            call(setter, value[name], name);                                                                  // 122
          });                                                                                                 // 123
        } else {                                                                                              // 124
          call(setter, value, name);                                                                          // 125
        }                                                                                                     // 126
      });                                                                                                     // 127
    });                                                                                                       // 128
                                                                                                              // 129
    function call(setter, value, name) {                                                                      // 130
      if (name === "__esModule") {                                                                            // 131
        // Ignore setters asking for module.exports.__esModule.                                               // 132
        return;                                                                                               // 133
      }                                                                                                       // 134
                                                                                                              // 135
      setter.last = setter.last || Object.create(null);                                                       // 136
                                                                                                              // 137
      if (! hasOwn.call(setter.last, name) ||                                                                 // 138
          setter.last[name] !== value) {                                                                      // 139
        // Only invoke the callback if we have not called this setter                                         // 140
        // (with a value of this name) before, or the current value is                                        // 141
        // different from the last value we passed to this setter.                                            // 142
        return callback.apply(context, arguments);                                                            // 143
      }                                                                                                       // 144
    }                                                                                                         // 145
  }                                                                                                           // 146
                                                                                                              // 147
  // Every three elements of this list form a (setter, value, name) triple                                    // 148
  // that needs to be invoked.                                                                                // 149
  var settersToCall = [];                                                                                     // 150
                                                                                                              // 151
  // Lazily-initialized objects mapping parent module identifiers to                                          // 152
  // relevant parent module objects and snapshots of their exports.                                           // 153
  var relevantParents;                                                                                        // 154
  var parentSnapshots;                                                                                        // 155
                                                                                                              // 156
  // Take snapshots of setter.parent.exports for any setters that we are                                      // 157
  // planning to call, so that we can later determine if calling the                                          // 158
  // setters modified any of those exports objects.                                                           // 159
  forEachSetter(function (setter, value, name) {                                                              // 160
    var parent = setter.parent;                                                                               // 161
    parentSnapshots = parentSnapshots || Object.create(null);                                                 // 162
    if (! hasOwn.call(parentSnapshots, parent.id)) {                                                          // 163
      relevantParents = relevantParents || Object.create(null);                                               // 164
      relevantParents[parent.id] = parent;                                                                    // 165
      if (utils.isPlainObject(parent.exports)) {                                                              // 166
        // If parent.exports is an object, make a shallow clone of it so                                      // 167
        // that we can see if it changes as a result of calling setters.                                      // 168
        parentSnapshots[parent.id] = utils.assign({}, parent.exports);                                        // 169
      } else {                                                                                                // 170
        // If parent.exports is not an object, the "snapshot" is just the                                     // 171
        // value of parent.exports.                                                                           // 172
        parentSnapshots[parent.id] = parent.exports;                                                          // 173
      }                                                                                                       // 174
    }                                                                                                         // 175
                                                                                                              // 176
    // Push three elements at a time to avoid creating wrapper arrays for                                     // 177
    // each (setter, value, name) triple. Note the i += 3 below.                                              // 178
    settersToCall.push(setter, value, name);                                                                  // 179
  });                                                                                                         // 180
                                                                                                              // 181
  // Now call all the setters that we decided we need to call.                                                // 182
  for (var i = 0; i < settersToCall.length; i += 3) {                                                         // 183
    var setter = settersToCall[i];                                                                            // 184
    var value = settersToCall[i + 1];                                                                         // 185
    var name = settersToCall[i + 2];                                                                          // 186
    setter.call(module, setter.last[name] = value, name);                                                     // 187
  }                                                                                                           // 188
                                                                                                              // 189
  ++entry.runCount;                                                                                           // 190
                                                                                                              // 191
  if (! relevantParents) {                                                                                    // 192
    // If we never called takeSnapshot, then we can avoid checking                                            // 193
    // relevantParents and parentSnapshots below.                                                             // 194
    return;                                                                                                   // 195
  }                                                                                                           // 196
                                                                                                              // 197
  // If any of the setters updated the module.exports of a parent module,                                     // 198
  // or updated local variables that are exported by that parent module,                                      // 199
  // then we must re-run any setters registered by that parent module.                                        // 200
  Object.keys(relevantParents).forEach(function (id) {                                                        // 201
    var parent = relevantParents[id];                                                                         // 202
                                                                                                              // 203
    if (runModuleGetters(parent) > 0) {                                                                       // 204
      return runModuleSetters(parent);                                                                        // 205
    }                                                                                                         // 206
                                                                                                              // 207
    var exports = parent.exports;                                                                             // 208
    var snapshot = parentSnapshots[parent.id];                                                                // 209
    if (utils.shallowObjEqual(exports, snapshot)) {                                                           // 210
      // If parent.exports have not changed since we took the snapshot,                                       // 211
      // then we do not need to run the parent's setters.                                                     // 212
      return;                                                                                                 // 213
    }                                                                                                         // 214
                                                                                                              // 215
    runModuleSetters(parent);                                                                                 // 216
  });                                                                                                         // 217
};                                                                                                            // 218
                                                                                                              // 219
exports.Entry = Entry;                                                                                        // 220
                                                                                                              // 221
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"utils.js":function(require,exports){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// node_modules/meteor/modules/node_modules/reify/lib/utils.js                                                //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
var hasOwn = Object.prototype.hasOwnProperty;                                                                 // 1
var objToStr = Object.prototype.toString;                                                                     // 2
var objStr = objToStr.call({});                                                                               // 3
                                                                                                              // 4
function isPlainObject(value) {                                                                               // 5
  return objToStr.call(value) === objStr;                                                                     // 6
}                                                                                                             // 7
exports.isPlainObject = isPlainObject;                                                                        // 8
                                                                                                              // 9
exports.assign = Object.assign || function (obj) {                                                            // 10
  var argc = arguments.length;                                                                                // 11
  for (var i = 1; i < argc; ++i) {                                                                            // 12
    var arg = arguments[i];                                                                                   // 13
    if (arg && typeof arg === "object") {                                                                     // 14
      var keys = Object.keys(arg);                                                                            // 15
      for (var k = 0; k < keys.length; ++k) {                                                                 // 16
        var key = keys[k];                                                                                    // 17
        obj[key] = arg[key];                                                                                  // 18
      }                                                                                                       // 19
    }                                                                                                         // 20
  }                                                                                                           // 21
  return obj;                                                                                                 // 22
};                                                                                                            // 23
                                                                                                              // 24
exports.shallowObjEqual = function(a, b) {                                                                    // 25
  if (a === b) {                                                                                              // 26
    return true;                                                                                              // 27
  }                                                                                                           // 28
                                                                                                              // 29
  if (! isPlainObject(a) ||                                                                                   // 30
      ! isPlainObject(b)) {                                                                                   // 31
    return false;                                                                                             // 32
  }                                                                                                           // 33
                                                                                                              // 34
  var aKeys = Object.keys(a);                                                                                 // 35
  var bKeys = Object.keys(b);                                                                                 // 36
                                                                                                              // 37
  if (aKeys.length !== bKeys.length) {                                                                        // 38
    return false;                                                                                             // 39
  }                                                                                                           // 40
                                                                                                              // 41
  return aKeys.every(function (key) {                                                                         // 42
    return hasOwn.call(b, key) &&                                                                             // 43
      a[key] === b[key];                                                                                      // 44
  });                                                                                                         // 45
};                                                                                                            // 46
                                                                                                              // 47
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}},"babel-runtime":{"regenerator":{"index.js":["regenerator-runtime",function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// node_modules/babel-runtime/regenerator/index.js                                                            //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
module.exports = require("regenerator-runtime");                                                              // 1
                                                                                                              // 2
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}]}},"regenerator-runtime":{"package.json":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// node_modules/regenerator-runtime/package.json                                                              //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
exports.name = "regenerator-runtime";                                                                         // 1
exports.version = "0.9.6";                                                                                    // 2
exports.main = "runtime-module.js";                                                                           // 3
                                                                                                              // 4
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"runtime-module.js":["./runtime",function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// node_modules/regenerator-runtime/runtime-module.js                                                         //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
// This method of obtaining a reference to the global object needs to be                                      // 1
// kept identical to the way it is obtained in runtime.js                                                     // 2
var g =                                                                                                       // 3
  typeof global === "object" ? global :                                                                       // 4
  typeof window === "object" ? window :                                                                       // 5
  typeof self === "object" ? self : this;                                                                     // 6
                                                                                                              // 7
// Use `getOwnPropertyNames` because not all browsers support calling                                         // 8
// `hasOwnProperty` on the global `self` object in a worker. See #183.                                        // 9
var hadRuntime = g.regeneratorRuntime &&                                                                      // 10
  Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;                                           // 11
                                                                                                              // 12
// Save the old regeneratorRuntime in case it needs to be restored later.                                     // 13
var oldRuntime = hadRuntime && g.regeneratorRuntime;                                                          // 14
                                                                                                              // 15
// Force reevalutation of runtime.js.                                                                         // 16
g.regeneratorRuntime = undefined;                                                                             // 17
                                                                                                              // 18
module.exports = require("./runtime");                                                                        // 19
                                                                                                              // 20
if (hadRuntime) {                                                                                             // 21
  // Restore the original runtime.                                                                            // 22
  g.regeneratorRuntime = oldRuntime;                                                                          // 23
} else {                                                                                                      // 24
  // Remove the global property added by runtime.js.                                                          // 25
  try {                                                                                                       // 26
    delete g.regeneratorRuntime;                                                                              // 27
  } catch(e) {                                                                                                // 28
    g.regeneratorRuntime = undefined;                                                                         // 29
  }                                                                                                           // 30
}                                                                                                             // 31
                                                                                                              // 32
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"runtime.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// node_modules/regenerator-runtime/runtime.js                                                                //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
/**                                                                                                           // 1
 * Copyright (c) 2014, Facebook, Inc.                                                                         // 2
 * All rights reserved.                                                                                       // 3
 *                                                                                                            // 4
 * This source code is licensed under the BSD-style license found in the                                      // 5
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An                                        // 6
 * additional grant of patent rights can be found in the PATENTS file in                                      // 7
 * the same directory.                                                                                        // 8
 */                                                                                                           // 9
                                                                                                              // 10
!(function(global) {                                                                                          // 11
  "use strict";                                                                                               // 12
                                                                                                              // 13
  var hasOwn = Object.prototype.hasOwnProperty;                                                               // 14
  var undefined; // More compressible than void 0.                                                            // 15
  var $Symbol = typeof Symbol === "function" ? Symbol : {};                                                   // 16
  var iteratorSymbol = $Symbol.iterator || "@@iterator";                                                      // 17
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";                                             // 18
                                                                                                              // 19
  var inModule = typeof module === "object";                                                                  // 20
  var runtime = global.regeneratorRuntime;                                                                    // 21
  if (runtime) {                                                                                              // 22
    if (inModule) {                                                                                           // 23
      // If regeneratorRuntime is defined globally and we're in a module,                                     // 24
      // make the exports object identical to regeneratorRuntime.                                             // 25
      module.exports = runtime;                                                                               // 26
    }                                                                                                         // 27
    // Don't bother evaluating the rest of this file if the runtime was                                       // 28
    // already defined globally.                                                                              // 29
    return;                                                                                                   // 30
  }                                                                                                           // 31
                                                                                                              // 32
  // Define the runtime globally (as expected by generated code) as either                                    // 33
  // module.exports (if we're in a module) or a new, empty object.                                            // 34
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};                                       // 35
                                                                                                              // 36
  function wrap(innerFn, outerFn, self, tryLocsList) {                                                        // 37
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;             // 39
    var generator = Object.create(protoGenerator.prototype);                                                  // 40
    var context = new Context(tryLocsList || []);                                                             // 41
                                                                                                              // 42
    // The ._invoke method unifies the implementations of the .next,                                          // 43
    // .throw, and .return methods.                                                                           // 44
    generator._invoke = makeInvokeMethod(innerFn, self, context);                                             // 45
                                                                                                              // 46
    return generator;                                                                                         // 47
  }                                                                                                           // 48
  runtime.wrap = wrap;                                                                                        // 49
                                                                                                              // 50
  // Try/catch helper to minimize deoptimizations. Returns a completion                                       // 51
  // record like context.tryEntries[i].completion. This interface could                                       // 52
  // have been (and was previously) designed to take a closure to be                                          // 53
  // invoked without arguments, but in all the cases we care about we                                         // 54
  // already have an existing method we want to call, so there's no need                                      // 55
  // to create a new function object. We can even get away with assuming                                      // 56
  // the method takes exactly one argument, since that happens to be true                                     // 57
  // in every case, so we don't have to touch the arguments object. The                                       // 58
  // only additional allocation required is the completion record, which                                      // 59
  // has a stable shape and so hopefully should be cheap to allocate.                                         // 60
  function tryCatch(fn, obj, arg) {                                                                           // 61
    try {                                                                                                     // 62
      return { type: "normal", arg: fn.call(obj, arg) };                                                      // 63
    } catch (err) {                                                                                           // 64
      return { type: "throw", arg: err };                                                                     // 65
    }                                                                                                         // 66
  }                                                                                                           // 67
                                                                                                              // 68
  var GenStateSuspendedStart = "suspendedStart";                                                              // 69
  var GenStateSuspendedYield = "suspendedYield";                                                              // 70
  var GenStateExecuting = "executing";                                                                        // 71
  var GenStateCompleted = "completed";                                                                        // 72
                                                                                                              // 73
  // Returning this object from the innerFn has the same effect as                                            // 74
  // breaking out of the dispatch switch statement.                                                           // 75
  var ContinueSentinel = {};                                                                                  // 76
                                                                                                              // 77
  // Dummy constructor functions that we use as the .constructor and                                          // 78
  // .constructor.prototype properties for functions that return Generator                                    // 79
  // objects. For full spec compliance, you may wish to configure your                                        // 80
  // minifier not to mangle the names of these two functions.                                                 // 81
  function Generator() {}                                                                                     // 82
  function GeneratorFunction() {}                                                                             // 83
  function GeneratorFunctionPrototype() {}                                                                    // 84
                                                                                                              // 85
  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype;                                        // 86
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;                                  // 87
  GeneratorFunctionPrototype.constructor = GeneratorFunction;                                                 // 88
  GeneratorFunctionPrototype[toStringTagSymbol] = GeneratorFunction.displayName = "GeneratorFunction";        // 89
                                                                                                              // 90
  // Helper for defining the .next, .throw, and .return methods of the                                        // 91
  // Iterator interface in terms of a single ._invoke method.                                                 // 92
  function defineIteratorMethods(prototype) {                                                                 // 93
    ["next", "throw", "return"].forEach(function(method) {                                                    // 94
      prototype[method] = function(arg) {                                                                     // 95
        return this._invoke(method, arg);                                                                     // 96
      };                                                                                                      // 97
    });                                                                                                       // 98
  }                                                                                                           // 99
                                                                                                              // 100
  runtime.isGeneratorFunction = function(genFun) {                                                            // 101
    var ctor = typeof genFun === "function" && genFun.constructor;                                            // 102
    return ctor                                                                                               // 103
      ? ctor === GeneratorFunction ||                                                                         // 104
        // For the native GeneratorFunction constructor, the best we can                                      // 105
        // do is to check its .name property.                                                                 // 106
        (ctor.displayName || ctor.name) === "GeneratorFunction"                                               // 107
      : false;                                                                                                // 108
  };                                                                                                          // 109
                                                                                                              // 110
  runtime.mark = function(genFun) {                                                                           // 111
    if (Object.setPrototypeOf) {                                                                              // 112
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);                                              // 113
    } else {                                                                                                  // 114
      genFun.__proto__ = GeneratorFunctionPrototype;                                                          // 115
      if (!(toStringTagSymbol in genFun)) {                                                                   // 116
        genFun[toStringTagSymbol] = "GeneratorFunction";                                                      // 117
      }                                                                                                       // 118
    }                                                                                                         // 119
    genFun.prototype = Object.create(Gp);                                                                     // 120
    return genFun;                                                                                            // 121
  };                                                                                                          // 122
                                                                                                              // 123
  // Within the body of any async function, `await x` is transformed to                                       // 124
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test                                        // 125
  // `value instanceof AwaitArgument` to determine if the yielded value is                                    // 126
  // meant to be awaited. Some may consider the name of this method too                                       // 127
  // cutesy, but they are curmudgeons.                                                                        // 128
  runtime.awrap = function(arg) {                                                                             // 129
    return new AwaitArgument(arg);                                                                            // 130
  };                                                                                                          // 131
                                                                                                              // 132
  function AwaitArgument(arg) {                                                                               // 133
    this.arg = arg;                                                                                           // 134
  }                                                                                                           // 135
                                                                                                              // 136
  function AsyncIterator(generator) {                                                                         // 137
    function invoke(method, arg, resolve, reject) {                                                           // 138
      var record = tryCatch(generator[method], generator, arg);                                               // 139
      if (record.type === "throw") {                                                                          // 140
        reject(record.arg);                                                                                   // 141
      } else {                                                                                                // 142
        var result = record.arg;                                                                              // 143
        var value = result.value;                                                                             // 144
        if (value instanceof AwaitArgument) {                                                                 // 145
          return Promise.resolve(value.arg).then(function(value) {                                            // 146
            invoke("next", value, resolve, reject);                                                           // 147
          }, function(err) {                                                                                  // 148
            invoke("throw", err, resolve, reject);                                                            // 149
          });                                                                                                 // 150
        }                                                                                                     // 151
                                                                                                              // 152
        return Promise.resolve(value).then(function(unwrapped) {                                              // 153
          // When a yielded Promise is resolved, its final value becomes                                      // 154
          // the .value of the Promise<{value,done}> result for the                                           // 155
          // current iteration. If the Promise is rejected, however, the                                      // 156
          // result for this iteration will be rejected with the same                                         // 157
          // reason. Note that rejections of yielded Promises are not                                         // 158
          // thrown back into the generator function, as is the case                                          // 159
          // when an awaited Promise is rejected. This difference in                                          // 160
          // behavior between yield and await is important, because it                                        // 161
          // allows the consumer to decide what to do with the yielded                                        // 162
          // rejection (swallow it and continue, manually .throw it back                                      // 163
          // into the generator, abandon iteration, whatever). With                                           // 164
          // await, by contrast, there is no opportunity to examine the                                       // 165
          // rejection reason outside the generator function, so the                                          // 166
          // only option is to throw it from the await expression, and                                        // 167
          // let the generator function handle the exception.                                                 // 168
          result.value = unwrapped;                                                                           // 169
          resolve(result);                                                                                    // 170
        }, reject);                                                                                           // 171
      }                                                                                                       // 172
    }                                                                                                         // 173
                                                                                                              // 174
    if (typeof process === "object" && process.domain) {                                                      // 175
      invoke = process.domain.bind(invoke);                                                                   // 176
    }                                                                                                         // 177
                                                                                                              // 178
    var previousPromise;                                                                                      // 179
                                                                                                              // 180
    function enqueue(method, arg) {                                                                           // 181
      function callInvokeWithMethodAndArg() {                                                                 // 182
        return new Promise(function(resolve, reject) {                                                        // 183
          invoke(method, arg, resolve, reject);                                                               // 184
        });                                                                                                   // 185
      }                                                                                                       // 186
                                                                                                              // 187
      return previousPromise =                                                                                // 188
        // If enqueue has been called before, then we want to wait until                                      // 189
        // all previous Promises have been resolved before calling invoke,                                    // 190
        // so that results are always delivered in the correct order. If                                      // 191
        // enqueue has not been called before, then it is important to                                        // 192
        // call invoke immediately, without waiting on a callback to fire,                                    // 193
        // so that the async generator function has the opportunity to do                                     // 194
        // any necessary setup in a predictable way. This predictability                                      // 195
        // is why the Promise constructor synchronously invokes its                                           // 196
        // executor callback, and why async functions synchronously                                           // 197
        // execute code before the first await. Since we implement simple                                     // 198
        // async functions in terms of async generators, it is especially                                     // 199
        // important to get this right, even though it requires care.                                         // 200
        previousPromise ? previousPromise.then(                                                               // 201
          callInvokeWithMethodAndArg,                                                                         // 202
          // Avoid propagating failures to Promises returned by later                                         // 203
          // invocations of the iterator.                                                                     // 204
          callInvokeWithMethodAndArg                                                                          // 205
        ) : callInvokeWithMethodAndArg();                                                                     // 206
    }                                                                                                         // 207
                                                                                                              // 208
    // Define the unified helper method that is used to implement .next,                                      // 209
    // .throw, and .return (see defineIteratorMethods).                                                       // 210
    this._invoke = enqueue;                                                                                   // 211
  }                                                                                                           // 212
                                                                                                              // 213
  defineIteratorMethods(AsyncIterator.prototype);                                                             // 214
                                                                                                              // 215
  // Note that simple async functions are implemented on top of                                               // 216
  // AsyncIterator objects; they just return a Promise for the value of                                       // 217
  // the final result produced by the iterator.                                                               // 218
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {                                             // 219
    var iter = new AsyncIterator(                                                                             // 220
      wrap(innerFn, outerFn, self, tryLocsList)                                                               // 221
    );                                                                                                        // 222
                                                                                                              // 223
    return runtime.isGeneratorFunction(outerFn)                                                               // 224
      ? iter // If outerFn is a generator, return the full iterator.                                          // 225
      : iter.next().then(function(result) {                                                                   // 226
          return result.done ? result.value : iter.next();                                                    // 227
        });                                                                                                   // 228
  };                                                                                                          // 229
                                                                                                              // 230
  function makeInvokeMethod(innerFn, self, context) {                                                         // 231
    var state = GenStateSuspendedStart;                                                                       // 232
                                                                                                              // 233
    return function invoke(method, arg) {                                                                     // 234
      if (state === GenStateExecuting) {                                                                      // 235
        throw new Error("Generator is already running");                                                      // 236
      }                                                                                                       // 237
                                                                                                              // 238
      if (state === GenStateCompleted) {                                                                      // 239
        if (method === "throw") {                                                                             // 240
          throw arg;                                                                                          // 241
        }                                                                                                     // 242
                                                                                                              // 243
        // Be forgiving, per 25.3.3.3.3 of the spec:                                                          // 244
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume                          // 245
        return doneResult();                                                                                  // 246
      }                                                                                                       // 247
                                                                                                              // 248
      while (true) {                                                                                          // 249
        var delegate = context.delegate;                                                                      // 250
        if (delegate) {                                                                                       // 251
          if (method === "return" ||                                                                          // 252
              (method === "throw" && delegate.iterator[method] === undefined)) {                              // 253
            // A return or throw (when the delegate iterator has no throw                                     // 254
            // method) always terminates the yield* loop.                                                     // 255
            context.delegate = null;                                                                          // 256
                                                                                                              // 257
            // If the delegate iterator has a return method, give it a                                        // 258
            // chance to clean up.                                                                            // 259
            var returnMethod = delegate.iterator["return"];                                                   // 260
            if (returnMethod) {                                                                               // 261
              var record = tryCatch(returnMethod, delegate.iterator, arg);                                    // 262
              if (record.type === "throw") {                                                                  // 263
                // If the return method threw an exception, let that                                          // 264
                // exception prevail over the original return or throw.                                       // 265
                method = "throw";                                                                             // 266
                arg = record.arg;                                                                             // 267
                continue;                                                                                     // 268
              }                                                                                               // 269
            }                                                                                                 // 270
                                                                                                              // 271
            if (method === "return") {                                                                        // 272
              // Continue with the outer return, now that the delegate                                        // 273
              // iterator has been terminated.                                                                // 274
              continue;                                                                                       // 275
            }                                                                                                 // 276
          }                                                                                                   // 277
                                                                                                              // 278
          var record = tryCatch(                                                                              // 279
            delegate.iterator[method],                                                                        // 280
            delegate.iterator,                                                                                // 281
            arg                                                                                               // 282
          );                                                                                                  // 283
                                                                                                              // 284
          if (record.type === "throw") {                                                                      // 285
            context.delegate = null;                                                                          // 286
                                                                                                              // 287
            // Like returning generator.throw(uncaught), but without the                                      // 288
            // overhead of an extra function call.                                                            // 289
            method = "throw";                                                                                 // 290
            arg = record.arg;                                                                                 // 291
            continue;                                                                                         // 292
          }                                                                                                   // 293
                                                                                                              // 294
          // Delegate generator ran and handled its own exceptions so                                         // 295
          // regardless of what the method was, we continue as if it is                                       // 296
          // "next" with an undefined arg.                                                                    // 297
          method = "next";                                                                                    // 298
          arg = undefined;                                                                                    // 299
                                                                                                              // 300
          var info = record.arg;                                                                              // 301
          if (info.done) {                                                                                    // 302
            context[delegate.resultName] = info.value;                                                        // 303
            context.next = delegate.nextLoc;                                                                  // 304
          } else {                                                                                            // 305
            state = GenStateSuspendedYield;                                                                   // 306
            return info;                                                                                      // 307
          }                                                                                                   // 308
                                                                                                              // 309
          context.delegate = null;                                                                            // 310
        }                                                                                                     // 311
                                                                                                              // 312
        if (method === "next") {                                                                              // 313
          // Setting context._sent for legacy support of Babel's                                              // 314
          // function.sent implementation.                                                                    // 315
          context.sent = context._sent = arg;                                                                 // 316
                                                                                                              // 317
        } else if (method === "throw") {                                                                      // 318
          if (state === GenStateSuspendedStart) {                                                             // 319
            state = GenStateCompleted;                                                                        // 320
            throw arg;                                                                                        // 321
          }                                                                                                   // 322
                                                                                                              // 323
          if (context.dispatchException(arg)) {                                                               // 324
            // If the dispatched exception was caught by a catch block,                                       // 325
            // then let that catch block handle the exception normally.                                       // 326
            method = "next";                                                                                  // 327
            arg = undefined;                                                                                  // 328
          }                                                                                                   // 329
                                                                                                              // 330
        } else if (method === "return") {                                                                     // 331
          context.abrupt("return", arg);                                                                      // 332
        }                                                                                                     // 333
                                                                                                              // 334
        state = GenStateExecuting;                                                                            // 335
                                                                                                              // 336
        var record = tryCatch(innerFn, self, context);                                                        // 337
        if (record.type === "normal") {                                                                       // 338
          // If an exception is thrown from innerFn, we leave state ===                                       // 339
          // GenStateExecuting and loop back for another invocation.                                          // 340
          state = context.done                                                                                // 341
            ? GenStateCompleted                                                                               // 342
            : GenStateSuspendedYield;                                                                         // 343
                                                                                                              // 344
          var info = {                                                                                        // 345
            value: record.arg,                                                                                // 346
            done: context.done                                                                                // 347
          };                                                                                                  // 348
                                                                                                              // 349
          if (record.arg === ContinueSentinel) {                                                              // 350
            if (context.delegate && method === "next") {                                                      // 351
              // Deliberately forget the last sent value so that we don't                                     // 352
              // accidentally pass it on to the delegate.                                                     // 353
              arg = undefined;                                                                                // 354
            }                                                                                                 // 355
          } else {                                                                                            // 356
            return info;                                                                                      // 357
          }                                                                                                   // 358
                                                                                                              // 359
        } else if (record.type === "throw") {                                                                 // 360
          state = GenStateCompleted;                                                                          // 361
          // Dispatch the exception by looping back around to the                                             // 362
          // context.dispatchException(arg) call above.                                                       // 363
          method = "throw";                                                                                   // 364
          arg = record.arg;                                                                                   // 365
        }                                                                                                     // 366
      }                                                                                                       // 367
    };                                                                                                        // 368
  }                                                                                                           // 369
                                                                                                              // 370
  // Define Generator.prototype.{next,throw,return} in terms of the                                           // 371
  // unified ._invoke helper method.                                                                          // 372
  defineIteratorMethods(Gp);                                                                                  // 373
                                                                                                              // 374
  Gp[iteratorSymbol] = function() {                                                                           // 375
    return this;                                                                                              // 376
  };                                                                                                          // 377
                                                                                                              // 378
  Gp[toStringTagSymbol] = "Generator";                                                                        // 379
                                                                                                              // 380
  Gp.toString = function() {                                                                                  // 381
    return "[object Generator]";                                                                              // 382
  };                                                                                                          // 383
                                                                                                              // 384
  function pushTryEntry(locs) {                                                                               // 385
    var entry = { tryLoc: locs[0] };                                                                          // 386
                                                                                                              // 387
    if (1 in locs) {                                                                                          // 388
      entry.catchLoc = locs[1];                                                                               // 389
    }                                                                                                         // 390
                                                                                                              // 391
    if (2 in locs) {                                                                                          // 392
      entry.finallyLoc = locs[2];                                                                             // 393
      entry.afterLoc = locs[3];                                                                               // 394
    }                                                                                                         // 395
                                                                                                              // 396
    this.tryEntries.push(entry);                                                                              // 397
  }                                                                                                           // 398
                                                                                                              // 399
  function resetTryEntry(entry) {                                                                             // 400
    var record = entry.completion || {};                                                                      // 401
    record.type = "normal";                                                                                   // 402
    delete record.arg;                                                                                        // 403
    entry.completion = record;                                                                                // 404
  }                                                                                                           // 405
                                                                                                              // 406
  function Context(tryLocsList) {                                                                             // 407
    // The root entry object (effectively a try statement without a catch                                     // 408
    // or a finally block) gives us a place to store values thrown from                                       // 409
    // locations where there is no enclosing try statement.                                                   // 410
    this.tryEntries = [{ tryLoc: "root" }];                                                                   // 411
    tryLocsList.forEach(pushTryEntry, this);                                                                  // 412
    this.reset(true);                                                                                         // 413
  }                                                                                                           // 414
                                                                                                              // 415
  runtime.keys = function(object) {                                                                           // 416
    var keys = [];                                                                                            // 417
    for (var key in object) {                                                                                 // 418
      keys.push(key);                                                                                         // 419
    }                                                                                                         // 420
    keys.reverse();                                                                                           // 421
                                                                                                              // 422
    // Rather than returning an object with a next method, we keep                                            // 423
    // things simple and return the next function itself.                                                     // 424
    return function next() {                                                                                  // 425
      while (keys.length) {                                                                                   // 426
        var key = keys.pop();                                                                                 // 427
        if (key in object) {                                                                                  // 428
          next.value = key;                                                                                   // 429
          next.done = false;                                                                                  // 430
          return next;                                                                                        // 431
        }                                                                                                     // 432
      }                                                                                                       // 433
                                                                                                              // 434
      // To avoid creating an additional object, we just hang the .value                                      // 435
      // and .done properties off the next function object itself. This                                       // 436
      // also ensures that the minifier will not anonymize the function.                                      // 437
      next.done = true;                                                                                       // 438
      return next;                                                                                            // 439
    };                                                                                                        // 440
  };                                                                                                          // 441
                                                                                                              // 442
  function values(iterable) {                                                                                 // 443
    if (iterable) {                                                                                           // 444
      var iteratorMethod = iterable[iteratorSymbol];                                                          // 445
      if (iteratorMethod) {                                                                                   // 446
        return iteratorMethod.call(iterable);                                                                 // 447
      }                                                                                                       // 448
                                                                                                              // 449
      if (typeof iterable.next === "function") {                                                              // 450
        return iterable;                                                                                      // 451
      }                                                                                                       // 452
                                                                                                              // 453
      if (!isNaN(iterable.length)) {                                                                          // 454
        var i = -1, next = function next() {                                                                  // 455
          while (++i < iterable.length) {                                                                     // 456
            if (hasOwn.call(iterable, i)) {                                                                   // 457
              next.value = iterable[i];                                                                       // 458
              next.done = false;                                                                              // 459
              return next;                                                                                    // 460
            }                                                                                                 // 461
          }                                                                                                   // 462
                                                                                                              // 463
          next.value = undefined;                                                                             // 464
          next.done = true;                                                                                   // 465
                                                                                                              // 466
          return next;                                                                                        // 467
        };                                                                                                    // 468
                                                                                                              // 469
        return next.next = next;                                                                              // 470
      }                                                                                                       // 471
    }                                                                                                         // 472
                                                                                                              // 473
    // Return an iterator with no values.                                                                     // 474
    return { next: doneResult };                                                                              // 475
  }                                                                                                           // 476
  runtime.values = values;                                                                                    // 477
                                                                                                              // 478
  function doneResult() {                                                                                     // 479
    return { value: undefined, done: true };                                                                  // 480
  }                                                                                                           // 481
                                                                                                              // 482
  Context.prototype = {                                                                                       // 483
    constructor: Context,                                                                                     // 484
                                                                                                              // 485
    reset: function(skipTempReset) {                                                                          // 486
      this.prev = 0;                                                                                          // 487
      this.next = 0;                                                                                          // 488
      // Resetting context._sent for legacy support of Babel's                                                // 489
      // function.sent implementation.                                                                        // 490
      this.sent = this._sent = undefined;                                                                     // 491
      this.done = false;                                                                                      // 492
      this.delegate = null;                                                                                   // 493
                                                                                                              // 494
      this.tryEntries.forEach(resetTryEntry);                                                                 // 495
                                                                                                              // 496
      if (!skipTempReset) {                                                                                   // 497
        for (var name in this) {                                                                              // 498
          // Not sure about the optimal order of these conditions:                                            // 499
          if (name.charAt(0) === "t" &&                                                                       // 500
              hasOwn.call(this, name) &&                                                                      // 501
              !isNaN(+name.slice(1))) {                                                                       // 502
            this[name] = undefined;                                                                           // 503
          }                                                                                                   // 504
        }                                                                                                     // 505
      }                                                                                                       // 506
    },                                                                                                        // 507
                                                                                                              // 508
    stop: function() {                                                                                        // 509
      this.done = true;                                                                                       // 510
                                                                                                              // 511
      var rootEntry = this.tryEntries[0];                                                                     // 512
      var rootRecord = rootEntry.completion;                                                                  // 513
      if (rootRecord.type === "throw") {                                                                      // 514
        throw rootRecord.arg;                                                                                 // 515
      }                                                                                                       // 516
                                                                                                              // 517
      return this.rval;                                                                                       // 518
    },                                                                                                        // 519
                                                                                                              // 520
    dispatchException: function(exception) {                                                                  // 521
      if (this.done) {                                                                                        // 522
        throw exception;                                                                                      // 523
      }                                                                                                       // 524
                                                                                                              // 525
      var context = this;                                                                                     // 526
      function handle(loc, caught) {                                                                          // 527
        record.type = "throw";                                                                                // 528
        record.arg = exception;                                                                               // 529
        context.next = loc;                                                                                   // 530
        return !!caught;                                                                                      // 531
      }                                                                                                       // 532
                                                                                                              // 533
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {                                                 // 534
        var entry = this.tryEntries[i];                                                                       // 535
        var record = entry.completion;                                                                        // 536
                                                                                                              // 537
        if (entry.tryLoc === "root") {                                                                        // 538
          // Exception thrown outside of any try block that could handle                                      // 539
          // it, so set the completion value of the entire function to                                        // 540
          // throw the exception.                                                                             // 541
          return handle("end");                                                                               // 542
        }                                                                                                     // 543
                                                                                                              // 544
        if (entry.tryLoc <= this.prev) {                                                                      // 545
          var hasCatch = hasOwn.call(entry, "catchLoc");                                                      // 546
          var hasFinally = hasOwn.call(entry, "finallyLoc");                                                  // 547
                                                                                                              // 548
          if (hasCatch && hasFinally) {                                                                       // 549
            if (this.prev < entry.catchLoc) {                                                                 // 550
              return handle(entry.catchLoc, true);                                                            // 551
            } else if (this.prev < entry.finallyLoc) {                                                        // 552
              return handle(entry.finallyLoc);                                                                // 553
            }                                                                                                 // 554
                                                                                                              // 555
          } else if (hasCatch) {                                                                              // 556
            if (this.prev < entry.catchLoc) {                                                                 // 557
              return handle(entry.catchLoc, true);                                                            // 558
            }                                                                                                 // 559
                                                                                                              // 560
          } else if (hasFinally) {                                                                            // 561
            if (this.prev < entry.finallyLoc) {                                                               // 562
              return handle(entry.finallyLoc);                                                                // 563
            }                                                                                                 // 564
                                                                                                              // 565
          } else {                                                                                            // 566
            throw new Error("try statement without catch or finally");                                        // 567
          }                                                                                                   // 568
        }                                                                                                     // 569
      }                                                                                                       // 570
    },                                                                                                        // 571
                                                                                                              // 572
    abrupt: function(type, arg) {                                                                             // 573
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {                                                 // 574
        var entry = this.tryEntries[i];                                                                       // 575
        if (entry.tryLoc <= this.prev &&                                                                      // 576
            hasOwn.call(entry, "finallyLoc") &&                                                               // 577
            this.prev < entry.finallyLoc) {                                                                   // 578
          var finallyEntry = entry;                                                                           // 579
          break;                                                                                              // 580
        }                                                                                                     // 581
      }                                                                                                       // 582
                                                                                                              // 583
      if (finallyEntry &&                                                                                     // 584
          (type === "break" ||                                                                                // 585
           type === "continue") &&                                                                            // 586
          finallyEntry.tryLoc <= arg &&                                                                       // 587
          arg <= finallyEntry.finallyLoc) {                                                                   // 588
        // Ignore the finally entry if control is not jumping to a                                            // 589
        // location outside the try/catch block.                                                              // 590
        finallyEntry = null;                                                                                  // 591
      }                                                                                                       // 592
                                                                                                              // 593
      var record = finallyEntry ? finallyEntry.completion : {};                                               // 594
      record.type = type;                                                                                     // 595
      record.arg = arg;                                                                                       // 596
                                                                                                              // 597
      if (finallyEntry) {                                                                                     // 598
        this.next = finallyEntry.finallyLoc;                                                                  // 599
      } else {                                                                                                // 600
        this.complete(record);                                                                                // 601
      }                                                                                                       // 602
                                                                                                              // 603
      return ContinueSentinel;                                                                                // 604
    },                                                                                                        // 605
                                                                                                              // 606
    complete: function(record, afterLoc) {                                                                    // 607
      if (record.type === "throw") {                                                                          // 608
        throw record.arg;                                                                                     // 609
      }                                                                                                       // 610
                                                                                                              // 611
      if (record.type === "break" ||                                                                          // 612
          record.type === "continue") {                                                                       // 613
        this.next = record.arg;                                                                               // 614
      } else if (record.type === "return") {                                                                  // 615
        this.rval = record.arg;                                                                               // 616
        this.next = "end";                                                                                    // 617
      } else if (record.type === "normal" && afterLoc) {                                                      // 618
        this.next = afterLoc;                                                                                 // 619
      }                                                                                                       // 620
    },                                                                                                        // 621
                                                                                                              // 622
    finish: function(finallyLoc) {                                                                            // 623
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {                                                 // 624
        var entry = this.tryEntries[i];                                                                       // 625
        if (entry.finallyLoc === finallyLoc) {                                                                // 626
          this.complete(entry.completion, entry.afterLoc);                                                    // 627
          resetTryEntry(entry);                                                                               // 628
          return ContinueSentinel;                                                                            // 629
        }                                                                                                     // 630
      }                                                                                                       // 631
    },                                                                                                        // 632
                                                                                                              // 633
    "catch": function(tryLoc) {                                                                               // 634
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {                                                 // 635
        var entry = this.tryEntries[i];                                                                       // 636
        if (entry.tryLoc === tryLoc) {                                                                        // 637
          var record = entry.completion;                                                                      // 638
          if (record.type === "throw") {                                                                      // 639
            var thrown = record.arg;                                                                          // 640
            resetTryEntry(entry);                                                                             // 641
          }                                                                                                   // 642
          return thrown;                                                                                      // 643
        }                                                                                                     // 644
      }                                                                                                       // 645
                                                                                                              // 646
      // The context.catch method must only be called with a location                                         // 647
      // argument that corresponds to a known catch block.                                                    // 648
      throw new Error("illegal catch attempt");                                                               // 649
    },                                                                                                        // 650
                                                                                                              // 651
    delegateYield: function(iterable, resultName, nextLoc) {                                                  // 652
      this.delegate = {                                                                                       // 653
        iterator: values(iterable),                                                                           // 654
        resultName: resultName,                                                                               // 655
        nextLoc: nextLoc                                                                                      // 656
      };                                                                                                      // 657
                                                                                                              // 658
      return ContinueSentinel;                                                                                // 659
    }                                                                                                         // 660
  };                                                                                                          // 661
})(                                                                                                           // 662
  // Among the various tricks for obtaining a reference to the global                                         // 663
  // object, this seems to be the most reliable technique that does not                                       // 664
  // use indirect eval (which violates Content Security Policy).                                              // 665
  typeof global === "object" ? global :                                                                       // 666
  typeof window === "object" ? window :                                                                       // 667
  typeof self === "object" ? self : this                                                                      // 668
);                                                                                                            // 669
                                                                                                              // 670
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}},{"extensions":[".js",".json"]});
var exports = require("./node_modules/meteor/modules/client.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package.modules = exports, {
  meteorInstall: meteorInstall,
  Buffer: Buffer,
  process: process
});

})();
