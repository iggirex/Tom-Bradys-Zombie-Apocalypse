(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var check = Package.check.check;
var Match = Package.check.Match;
var Random = Package.random.Random;
var EJSON = Package.ejson.EJSON;
var _ = Package.underscore._;
var Retry = Package.retry.Retry;
var MongoID = Package['mongo-id'].MongoID;
var DiffSequence = Package['diff-sequence'].DiffSequence;
var ECMAScript = Package.ecmascript.ECMAScript;
var DDPCommon = Package['ddp-common'].DDPCommon;
var DDP = Package['ddp-client'].DDP;
var WebApp = Package.webapp.WebApp;
var main = Package.webapp.main;
var WebAppInternals = Package.webapp.WebAppInternals;
var RoutePolicy = Package.routepolicy.RoutePolicy;
var Hook = Package['callback-hook'].Hook;
var LocalCollection = Package.minimongo.LocalCollection;
var Minimongo = Package.minimongo.Minimongo;
var meteorInstall = Package.modules.meteorInstall;
var Buffer = Package.modules.Buffer;
var process = Package.modules.process;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var StreamServer, DDPServer, Server;

var require = meteorInstall({"node_modules":{"meteor":{"ddp-server":{"stream_server.js":function(require){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/ddp-server/stream_server.js                                                                              //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
var url = Npm.require('url');                                                                                        // 1
                                                                                                                     //
// By default, we use the permessage-deflate extension with default                                                  // 3
// configuration. If $SERVER_WEBSOCKET_COMPRESSION is set, then it must be valid                                     // 4
// JSON. If it represents a falsey value, then we do not use permessage-deflate                                      // 5
// at all; otherwise, the JSON value is used as an argument to deflate's                                             // 6
// configure method; see                                                                                             // 7
// https://github.com/faye/permessage-deflate-node/blob/master/README.md                                             // 8
//                                                                                                                   // 9
// (We do this in an _.once instead of at startup, because we don't want to                                          // 10
// crash the tool during isopacket load if your JSON doesn't parse. This is only                                     // 11
// a problem because the tool has to load the DDP server code just in order to                                       // 12
// be a DDP client; see https://github.com/meteor/meteor/issues/3452 .)                                              // 13
var websocketExtensions = _.once(function () {                                                                       // 14
  var extensions = [];                                                                                               // 15
                                                                                                                     //
  var websocketCompressionConfig = process.env.SERVER_WEBSOCKET_COMPRESSION ? JSON.parse(process.env.SERVER_WEBSOCKET_COMPRESSION) : {};
  if (websocketCompressionConfig) {                                                                                  // 19
    extensions.push(Npm.require('permessage-deflate').configure(websocketCompressionConfig));                        // 20
  }                                                                                                                  // 23
                                                                                                                     //
  return extensions;                                                                                                 // 25
});                                                                                                                  // 26
                                                                                                                     //
var pathPrefix = __meteor_runtime_config__.ROOT_URL_PATH_PREFIX || "";                                               // 28
                                                                                                                     //
StreamServer = function StreamServer() {                                                                             // 30
  var self = this;                                                                                                   // 31
  self.registration_callbacks = [];                                                                                  // 32
  self.open_sockets = [];                                                                                            // 33
                                                                                                                     //
  // Because we are installing directly onto WebApp.httpServer instead of using                                      // 35
  // WebApp.app, we have to process the path prefix ourselves.                                                       // 36
  self.prefix = pathPrefix + '/sockjs';                                                                              // 37
  RoutePolicy.declare(self.prefix + '/', 'network');                                                                 // 38
                                                                                                                     //
  // set up sockjs                                                                                                   // 40
  var sockjs = Npm.require('sockjs');                                                                                // 41
  var serverOptions = {                                                                                              // 42
    prefix: self.prefix,                                                                                             // 43
    log: function () {                                                                                               // 44
      function log() {}                                                                                              // 44
                                                                                                                     //
      return log;                                                                                                    // 44
    }(),                                                                                                             // 44
    // this is the default, but we code it explicitly because we depend                                              // 45
    // on it in stream_client:HEARTBEAT_TIMEOUT                                                                      // 46
    heartbeat_delay: 45000,                                                                                          // 47
    // The default disconnect_delay is 5 seconds, but if the server ends up CPU                                      // 48
    // bound for that much time, SockJS might not notice that the user has                                           // 49
    // reconnected because the timer (of disconnect_delay ms) can fire before                                        // 50
    // SockJS processes the new connection. Eventually we'll fix this by not                                         // 51
    // combining CPU-heavy processing with SockJS termination (eg a proxy which                                      // 52
    // converts to Unix sockets) but for now, raise the delay.                                                       // 53
    disconnect_delay: 60 * 1000,                                                                                     // 54
    // Set the USE_JSESSIONID environment variable to enable setting the                                             // 55
    // JSESSIONID cookie. This is useful for setting up proxies with                                                 // 56
    // session affinity.                                                                                             // 57
    jsessionid: !!process.env.USE_JSESSIONID                                                                         // 58
  };                                                                                                                 // 42
                                                                                                                     //
  // If you know your server environment (eg, proxies) will prevent websockets                                       // 61
  // from ever working, set $DISABLE_WEBSOCKETS and SockJS clients (ie,                                              // 62
  // browsers) will not waste time attempting to use them.                                                           // 63
  // (Your server will still have a /websocket endpoint.)                                                            // 64
  if (process.env.DISABLE_WEBSOCKETS) {                                                                              // 65
    serverOptions.websocket = false;                                                                                 // 66
  } else {                                                                                                           // 67
    serverOptions.faye_server_options = {                                                                            // 68
      extensions: websocketExtensions()                                                                              // 69
    };                                                                                                               // 68
  }                                                                                                                  // 71
                                                                                                                     //
  self.server = sockjs.createServer(serverOptions);                                                                  // 73
                                                                                                                     //
  // Install the sockjs handlers, but we want to keep around our own particular                                      // 75
  // request handler that adjusts idle timeouts while we have an outstanding                                         // 76
  // request.  This compensates for the fact that sockjs removes all listeners                                       // 77
  // for "request" to add its own.                                                                                   // 78
  WebApp.httpServer.removeListener('request', WebApp._timeoutAdjustmentRequestCallback);                             // 79
  self.server.installHandlers(WebApp.httpServer);                                                                    // 81
  WebApp.httpServer.addListener('request', WebApp._timeoutAdjustmentRequestCallback);                                // 82
                                                                                                                     //
  // Support the /websocket endpoint                                                                                 // 85
  self._redirectWebsocketEndpoint();                                                                                 // 86
                                                                                                                     //
  self.server.on('connection', function (socket) {                                                                   // 88
    socket.send = function (data) {                                                                                  // 89
      socket.write(data);                                                                                            // 90
    };                                                                                                               // 91
    socket.on('close', function () {                                                                                 // 92
      self.open_sockets = _.without(self.open_sockets, socket);                                                      // 93
    });                                                                                                              // 94
    self.open_sockets.push(socket);                                                                                  // 95
                                                                                                                     //
    // XXX COMPAT WITH 0.6.6. Send the old style welcome message, which                                              // 97
    // will force old clients to reload. Remove this once we're not                                                  // 98
    // concerned about people upgrading from a pre-0.7.0 release. Also,                                              // 99
    // remove the clause in the client that ignores the welcome message                                              // 100
    // (livedata_connection.js)                                                                                      // 101
    socket.send(JSON.stringify({ server_id: "0" }));                                                                 // 102
                                                                                                                     //
    // call all our callbacks when we get a new socket. they will do the                                             // 104
    // work of setting up handlers and such for specific messages.                                                   // 105
    _.each(self.registration_callbacks, function (callback) {                                                        // 106
      callback(socket);                                                                                              // 107
    });                                                                                                              // 108
  });                                                                                                                // 109
};                                                                                                                   // 111
                                                                                                                     //
_.extend(StreamServer.prototype, {                                                                                   // 113
  // call my callback when a new socket connects.                                                                    // 114
  // also call it for all current connections.                                                                       // 115
  register: function () {                                                                                            // 116
    function register(callback) {                                                                                    // 116
      var self = this;                                                                                               // 117
      self.registration_callbacks.push(callback);                                                                    // 118
      _.each(self.all_sockets(), function (socket) {                                                                 // 119
        callback(socket);                                                                                            // 120
      });                                                                                                            // 121
    }                                                                                                                // 122
                                                                                                                     //
    return register;                                                                                                 // 116
  }(),                                                                                                               // 116
                                                                                                                     //
  // get a list of all sockets                                                                                       // 124
  all_sockets: function () {                                                                                         // 125
    function all_sockets() {                                                                                         // 125
      var self = this;                                                                                               // 126
      return _.values(self.open_sockets);                                                                            // 127
    }                                                                                                                // 128
                                                                                                                     //
    return all_sockets;                                                                                              // 125
  }(),                                                                                                               // 125
                                                                                                                     //
  // Redirect /websocket to /sockjs/websocket in order to not expose                                                 // 130
  // sockjs to clients that want to use raw websockets                                                               // 131
  _redirectWebsocketEndpoint: function () {                                                                          // 132
    function _redirectWebsocketEndpoint() {                                                                          // 132
      var self = this;                                                                                               // 133
      // Unfortunately we can't use a connect middleware here since                                                  // 134
      // sockjs installs itself prior to all existing listeners                                                      // 135
      // (meaning prior to any connect middlewares) so we need to take                                               // 136
      // an approach similar to overshadowListeners in                                                               // 137
      // https://github.com/sockjs/sockjs-node/blob/cf820c55af6a9953e16558555a31decea554f70e/src/utils.coffee        // 138
      _.each(['request', 'upgrade'], function (event) {                                                              // 139
        var httpServer = WebApp.httpServer;                                                                          // 140
        var oldHttpServerListeners = httpServer.listeners(event).slice(0);                                           // 141
        httpServer.removeAllListeners(event);                                                                        // 142
                                                                                                                     //
        // request and upgrade have different arguments passed but                                                   // 144
        // we only care about the first one which is always request                                                  // 145
        var newListener = function () {                                                                              // 146
          function newListener(request /*, moreArguments */) {                                                       // 146
            // Store arguments for use within the closure below                                                      // 147
            var args = arguments;                                                                                    // 148
                                                                                                                     //
            // Rewrite /websocket and /websocket/ urls to /sockjs/websocket while                                    // 150
            // preserving query string.                                                                              // 151
            var parsedUrl = url.parse(request.url);                                                                  // 152
            if (parsedUrl.pathname === pathPrefix + '/websocket' || parsedUrl.pathname === pathPrefix + '/websocket/') {
              parsedUrl.pathname = self.prefix + '/websocket';                                                       // 155
              request.url = url.format(parsedUrl);                                                                   // 156
            }                                                                                                        // 157
            _.each(oldHttpServerListeners, function (oldListener) {                                                  // 158
              oldListener.apply(httpServer, args);                                                                   // 159
            });                                                                                                      // 160
          }                                                                                                          // 161
                                                                                                                     //
          return newListener;                                                                                        // 146
        }();                                                                                                         // 146
        httpServer.addListener(event, newListener);                                                                  // 162
      });                                                                                                            // 163
    }                                                                                                                // 164
                                                                                                                     //
    return _redirectWebsocketEndpoint;                                                                               // 132
  }()                                                                                                                // 132
});                                                                                                                  // 113
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"livedata_server.js":["babel-runtime/helpers/typeof",function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/ddp-server/livedata_server.js                                                                            //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
var _typeof;module.import("babel-runtime/helpers/typeof",{"default":function(v){_typeof=v}});                        //
DDPServer = {};                                                                                                      // 1
                                                                                                                     //
var Fiber = Npm.require('fibers');                                                                                   // 3
                                                                                                                     //
// This file contains classes:                                                                                       // 5
// * Session - The server's connection to a single DDP client                                                        // 6
// * Subscription - A single subscription for a single client                                                        // 7
// * Server - An entire server that may talk to > 1 client. A DDP endpoint.                                          // 8
//                                                                                                                   // 9
// Session and Subscription are file scope. For now, until we freeze                                                 // 10
// the interface, Server is package scope (in the future it should be                                                // 11
// exported.)                                                                                                        // 12
                                                                                                                     //
// Represents a single document in a SessionCollectionView                                                           // 14
var SessionDocumentView = function SessionDocumentView() {                                                           // 15
  var self = this;                                                                                                   // 16
  self.existsIn = {}; // set of subscriptionHandle                                                                   // 17
  self.dataByKey = {}; // key-> [ {subscriptionHandle, value} by precedence]                                         // 18
};                                                                                                                   // 19
                                                                                                                     //
DDPServer._SessionDocumentView = SessionDocumentView;                                                                // 21
                                                                                                                     //
_.extend(SessionDocumentView.prototype, {                                                                            // 24
                                                                                                                     //
  getFields: function () {                                                                                           // 26
    function getFields() {                                                                                           // 26
      var self = this;                                                                                               // 27
      var ret = {};                                                                                                  // 28
      _.each(self.dataByKey, function (precedenceList, key) {                                                        // 29
        ret[key] = precedenceList[0].value;                                                                          // 30
      });                                                                                                            // 31
      return ret;                                                                                                    // 32
    }                                                                                                                // 33
                                                                                                                     //
    return getFields;                                                                                                // 26
  }(),                                                                                                               // 26
                                                                                                                     //
  clearField: function () {                                                                                          // 35
    function clearField(subscriptionHandle, key, changeCollector) {                                                  // 35
      var self = this;                                                                                               // 36
      // Publish API ignores _id if present in fields                                                                // 37
      if (key === "_id") return;                                                                                     // 38
      var precedenceList = self.dataByKey[key];                                                                      // 40
                                                                                                                     //
      // It's okay to clear fields that didn't exist. No need to throw                                               // 42
      // an error.                                                                                                   // 43
      if (!precedenceList) return;                                                                                   // 44
                                                                                                                     //
      var removedValue = undefined;                                                                                  // 47
      for (var i = 0; i < precedenceList.length; i++) {                                                              // 48
        var precedence = precedenceList[i];                                                                          // 49
        if (precedence.subscriptionHandle === subscriptionHandle) {                                                  // 50
          // The view's value can only change if this subscription is the one that                                   // 51
          // used to have precedence.                                                                                // 52
          if (i === 0) removedValue = precedence.value;                                                              // 53
          precedenceList.splice(i, 1);                                                                               // 55
          break;                                                                                                     // 56
        }                                                                                                            // 57
      }                                                                                                              // 58
      if (_.isEmpty(precedenceList)) {                                                                               // 59
        delete self.dataByKey[key];                                                                                  // 60
        changeCollector[key] = undefined;                                                                            // 61
      } else if (removedValue !== undefined && !EJSON.equals(removedValue, precedenceList[0].value)) {               // 62
        changeCollector[key] = precedenceList[0].value;                                                              // 64
      }                                                                                                              // 65
    }                                                                                                                // 66
                                                                                                                     //
    return clearField;                                                                                               // 35
  }(),                                                                                                               // 35
                                                                                                                     //
  changeField: function () {                                                                                         // 68
    function changeField(subscriptionHandle, key, value, changeCollector, isAdd) {                                   // 68
      var self = this;                                                                                               // 70
      // Publish API ignores _id if present in fields                                                                // 71
      if (key === "_id") return;                                                                                     // 72
                                                                                                                     //
      // Don't share state with the data passed in by the user.                                                      // 75
      value = EJSON.clone(value);                                                                                    // 76
                                                                                                                     //
      if (!_.has(self.dataByKey, key)) {                                                                             // 78
        self.dataByKey[key] = [{ subscriptionHandle: subscriptionHandle,                                             // 79
          value: value }];                                                                                           // 80
        changeCollector[key] = value;                                                                                // 81
        return;                                                                                                      // 82
      }                                                                                                              // 83
      var precedenceList = self.dataByKey[key];                                                                      // 84
      var elt;                                                                                                       // 85
      if (!isAdd) {                                                                                                  // 86
        elt = _.find(precedenceList, function (precedence) {                                                         // 87
          return precedence.subscriptionHandle === subscriptionHandle;                                               // 88
        });                                                                                                          // 89
      }                                                                                                              // 90
                                                                                                                     //
      if (elt) {                                                                                                     // 92
        if (elt === precedenceList[0] && !EJSON.equals(value, elt.value)) {                                          // 93
          // this subscription is changing the value of this field.                                                  // 94
          changeCollector[key] = value;                                                                              // 95
        }                                                                                                            // 96
        elt.value = value;                                                                                           // 97
      } else {                                                                                                       // 98
        // this subscription is newly caring about this field                                                        // 99
        precedenceList.push({ subscriptionHandle: subscriptionHandle, value: value });                               // 100
      }                                                                                                              // 101
    }                                                                                                                // 103
                                                                                                                     //
    return changeField;                                                                                              // 68
  }()                                                                                                                // 68
});                                                                                                                  // 24
                                                                                                                     //
/**                                                                                                                  // 106
 * Represents a client's view of a single collection                                                                 //
 * @param {String} collectionName Name of the collection it represents                                               //
 * @param {Object.<String, Function>} sessionCallbacks The callbacks for added, changed, removed                     //
 * @class SessionCollectionView                                                                                      //
 */                                                                                                                  //
var SessionCollectionView = function SessionCollectionView(collectionName, sessionCallbacks) {                       // 112
  var self = this;                                                                                                   // 113
  self.collectionName = collectionName;                                                                              // 114
  self.documents = {};                                                                                               // 115
  self.callbacks = sessionCallbacks;                                                                                 // 116
};                                                                                                                   // 117
                                                                                                                     //
DDPServer._SessionCollectionView = SessionCollectionView;                                                            // 119
                                                                                                                     //
_.extend(SessionCollectionView.prototype, {                                                                          // 122
                                                                                                                     //
  isEmpty: function () {                                                                                             // 124
    function isEmpty() {                                                                                             // 124
      var self = this;                                                                                               // 125
      return _.isEmpty(self.documents);                                                                              // 126
    }                                                                                                                // 127
                                                                                                                     //
    return isEmpty;                                                                                                  // 124
  }(),                                                                                                               // 124
                                                                                                                     //
  diff: function () {                                                                                                // 129
    function diff(previous) {                                                                                        // 129
      var self = this;                                                                                               // 130
      DiffSequence.diffObjects(previous.documents, self.documents, {                                                 // 131
        both: _.bind(self.diffDocument, self),                                                                       // 132
                                                                                                                     //
        rightOnly: function () {                                                                                     // 134
          function rightOnly(id, nowDV) {                                                                            // 134
            self.callbacks.added(self.collectionName, id, nowDV.getFields());                                        // 135
          }                                                                                                          // 136
                                                                                                                     //
          return rightOnly;                                                                                          // 134
        }(),                                                                                                         // 134
                                                                                                                     //
        leftOnly: function () {                                                                                      // 138
          function leftOnly(id, prevDV) {                                                                            // 138
            self.callbacks.removed(self.collectionName, id);                                                         // 139
          }                                                                                                          // 140
                                                                                                                     //
          return leftOnly;                                                                                           // 138
        }()                                                                                                          // 138
      });                                                                                                            // 131
    }                                                                                                                // 142
                                                                                                                     //
    return diff;                                                                                                     // 129
  }(),                                                                                                               // 129
                                                                                                                     //
  diffDocument: function () {                                                                                        // 144
    function diffDocument(id, prevDV, nowDV) {                                                                       // 144
      var self = this;                                                                                               // 145
      var fields = {};                                                                                               // 146
      DiffSequence.diffObjects(prevDV.getFields(), nowDV.getFields(), {                                              // 147
        both: function () {                                                                                          // 148
          function both(key, prev, now) {                                                                            // 148
            if (!EJSON.equals(prev, now)) fields[key] = now;                                                         // 149
          }                                                                                                          // 151
                                                                                                                     //
          return both;                                                                                               // 148
        }(),                                                                                                         // 148
        rightOnly: function () {                                                                                     // 152
          function rightOnly(key, now) {                                                                             // 152
            fields[key] = now;                                                                                       // 153
          }                                                                                                          // 154
                                                                                                                     //
          return rightOnly;                                                                                          // 152
        }(),                                                                                                         // 152
        leftOnly: function () {                                                                                      // 155
          function leftOnly(key, prev) {                                                                             // 155
            fields[key] = undefined;                                                                                 // 156
          }                                                                                                          // 157
                                                                                                                     //
          return leftOnly;                                                                                           // 155
        }()                                                                                                          // 155
      });                                                                                                            // 147
      self.callbacks.changed(self.collectionName, id, fields);                                                       // 159
    }                                                                                                                // 160
                                                                                                                     //
    return diffDocument;                                                                                             // 144
  }(),                                                                                                               // 144
                                                                                                                     //
  added: function () {                                                                                               // 162
    function added(subscriptionHandle, id, fields) {                                                                 // 162
      var self = this;                                                                                               // 163
      var docView = self.documents[id];                                                                              // 164
      var added = false;                                                                                             // 165
      if (!docView) {                                                                                                // 166
        added = true;                                                                                                // 167
        docView = new SessionDocumentView();                                                                         // 168
        self.documents[id] = docView;                                                                                // 169
      }                                                                                                              // 170
      docView.existsIn[subscriptionHandle] = true;                                                                   // 171
      var changeCollector = {};                                                                                      // 172
      _.each(fields, function (value, key) {                                                                         // 173
        docView.changeField(subscriptionHandle, key, value, changeCollector, true);                                  // 174
      });                                                                                                            // 176
      if (added) self.callbacks.added(self.collectionName, id, changeCollector);else self.callbacks.changed(self.collectionName, id, changeCollector);
    }                                                                                                                // 181
                                                                                                                     //
    return added;                                                                                                    // 162
  }(),                                                                                                               // 162
                                                                                                                     //
  changed: function () {                                                                                             // 183
    function changed(subscriptionHandle, id, _changed) {                                                             // 183
      var self = this;                                                                                               // 184
      var changedResult = {};                                                                                        // 185
      var docView = self.documents[id];                                                                              // 186
      if (!docView) throw new Error("Could not find element with id " + id + " to change");                          // 187
      _.each(_changed, function (value, key) {                                                                       // 189
        if (value === undefined) docView.clearField(subscriptionHandle, key, changedResult);else docView.changeField(subscriptionHandle, key, value, changedResult);
      });                                                                                                            // 194
      self.callbacks.changed(self.collectionName, id, changedResult);                                                // 195
    }                                                                                                                // 196
                                                                                                                     //
    return changed;                                                                                                  // 183
  }(),                                                                                                               // 183
                                                                                                                     //
  removed: function () {                                                                                             // 198
    function removed(subscriptionHandle, id) {                                                                       // 198
      var self = this;                                                                                               // 199
      var docView = self.documents[id];                                                                              // 200
      if (!docView) {                                                                                                // 201
        var err = new Error("Removed nonexistent document " + id);                                                   // 202
        throw err;                                                                                                   // 203
      }                                                                                                              // 204
      delete docView.existsIn[subscriptionHandle];                                                                   // 205
      if (_.isEmpty(docView.existsIn)) {                                                                             // 206
        // it is gone from everyone                                                                                  // 207
        self.callbacks.removed(self.collectionName, id);                                                             // 208
        delete self.documents[id];                                                                                   // 209
      } else {                                                                                                       // 210
        var changed = {};                                                                                            // 211
        // remove this subscription from every precedence list                                                       // 212
        // and record the changes                                                                                    // 213
        _.each(docView.dataByKey, function (precedenceList, key) {                                                   // 214
          docView.clearField(subscriptionHandle, key, changed);                                                      // 215
        });                                                                                                          // 216
                                                                                                                     //
        self.callbacks.changed(self.collectionName, id, changed);                                                    // 218
      }                                                                                                              // 219
    }                                                                                                                // 220
                                                                                                                     //
    return removed;                                                                                                  // 198
  }()                                                                                                                // 198
});                                                                                                                  // 122
                                                                                                                     //
/******************************************************************************/                                     // 223
/* Session                                                                    */                                     // 224
/******************************************************************************/                                     // 225
                                                                                                                     //
var Session = function Session(server, version, socket, options) {                                                   // 227
  var self = this;                                                                                                   // 228
  self.id = Random.id();                                                                                             // 229
                                                                                                                     //
  self.server = server;                                                                                              // 231
  self.version = version;                                                                                            // 232
                                                                                                                     //
  self.initialized = false;                                                                                          // 234
  self.socket = socket;                                                                                              // 235
                                                                                                                     //
  // set to null when the session is destroyed. multiple places below                                                // 237
  // use this to determine if the session is alive or not.                                                           // 238
  self.inQueue = new Meteor._DoubleEndedQueue();                                                                     // 239
                                                                                                                     //
  self.blocked = false;                                                                                              // 241
  self.workerRunning = false;                                                                                        // 242
                                                                                                                     //
  // Sub objects for active subscriptions                                                                            // 244
  self._namedSubs = {};                                                                                              // 245
  self._universalSubs = [];                                                                                          // 246
                                                                                                                     //
  self.userId = null;                                                                                                // 248
                                                                                                                     //
  self.collectionViews = {};                                                                                         // 250
                                                                                                                     //
  // Set this to false to not send messages when collectionViews are                                                 // 252
  // modified. This is done when rerunning subs in _setUserId and those messages                                     // 253
  // are calculated via a diff instead.                                                                              // 254
  self._isSending = true;                                                                                            // 255
                                                                                                                     //
  // If this is true, don't start a newly-created universal publisher on this                                        // 257
  // session. The session will take care of starting it when appropriate.                                            // 258
  self._dontStartNewUniversalSubs = false;                                                                           // 259
                                                                                                                     //
  // when we are rerunning subscriptions, any ready messages                                                         // 261
  // we want to buffer up for when we are done rerunning subscriptions                                               // 262
  self._pendingReady = [];                                                                                           // 263
                                                                                                                     //
  // List of callbacks to call when this connection is closed.                                                       // 265
  self._closeCallbacks = [];                                                                                         // 266
                                                                                                                     //
  // XXX HACK: If a sockjs connection, save off the URL. This is                                                     // 269
  // temporary and will go away in the near future.                                                                  // 270
  self._socketUrl = socket.url;                                                                                      // 271
                                                                                                                     //
  // Allow tests to disable responding to pings.                                                                     // 273
  self._respondToPings = options.respondToPings;                                                                     // 274
                                                                                                                     //
  // This object is the public interface to the session. In the public                                               // 276
  // API, it is called the `connection` object.  Internally we call it                                               // 277
  // a `connectionHandle` to avoid ambiguity.                                                                        // 278
  self.connectionHandle = {                                                                                          // 279
    id: self.id,                                                                                                     // 280
    close: function () {                                                                                             // 281
      function close() {                                                                                             // 281
        self.close();                                                                                                // 282
      }                                                                                                              // 283
                                                                                                                     //
      return close;                                                                                                  // 281
    }(),                                                                                                             // 281
    onClose: function () {                                                                                           // 284
      function onClose(fn) {                                                                                         // 284
        var cb = Meteor.bindEnvironment(fn, "connection onClose callback");                                          // 285
        if (self.inQueue) {                                                                                          // 286
          self._closeCallbacks.push(cb);                                                                             // 287
        } else {                                                                                                     // 288
          // if we're already closed, call the callback.                                                             // 289
          Meteor.defer(cb);                                                                                          // 290
        }                                                                                                            // 291
      }                                                                                                              // 292
                                                                                                                     //
      return onClose;                                                                                                // 284
    }(),                                                                                                             // 284
    clientAddress: self._clientAddress(),                                                                            // 293
    httpHeaders: self.socket.headers                                                                                 // 294
  };                                                                                                                 // 279
                                                                                                                     //
  self.send({ msg: 'connected', session: self.id });                                                                 // 297
                                                                                                                     //
  // On initial connect, spin up all the universal publishers.                                                       // 299
  Fiber(function () {                                                                                                // 300
    self.startUniversalSubs();                                                                                       // 301
  }).run();                                                                                                          // 302
                                                                                                                     //
  if (version !== 'pre1' && options.heartbeatInterval !== 0) {                                                       // 304
    self.heartbeat = new DDPCommon.Heartbeat({                                                                       // 305
      heartbeatInterval: options.heartbeatInterval,                                                                  // 306
      heartbeatTimeout: options.heartbeatTimeout,                                                                    // 307
      onTimeout: function () {                                                                                       // 308
        function onTimeout() {                                                                                       // 308
          self.close();                                                                                              // 309
        }                                                                                                            // 310
                                                                                                                     //
        return onTimeout;                                                                                            // 308
      }(),                                                                                                           // 308
      sendPing: function () {                                                                                        // 311
        function sendPing() {                                                                                        // 311
          self.send({ msg: 'ping' });                                                                                // 312
        }                                                                                                            // 313
                                                                                                                     //
        return sendPing;                                                                                             // 311
      }()                                                                                                            // 311
    });                                                                                                              // 305
    self.heartbeat.start();                                                                                          // 315
  }                                                                                                                  // 316
                                                                                                                     //
  Package.facts && Package.facts.Facts.incrementServerFact("livedata", "sessions", 1);                               // 318
};                                                                                                                   // 320
                                                                                                                     //
_.extend(Session.prototype, {                                                                                        // 322
                                                                                                                     //
  sendReady: function () {                                                                                           // 324
    function sendReady(subscriptionIds) {                                                                            // 324
      var self = this;                                                                                               // 325
      if (self._isSending) self.send({ msg: "ready", subs: subscriptionIds });else {                                 // 326
        _.each(subscriptionIds, function (subscriptionId) {                                                          // 329
          self._pendingReady.push(subscriptionId);                                                                   // 330
        });                                                                                                          // 331
      }                                                                                                              // 332
    }                                                                                                                // 333
                                                                                                                     //
    return sendReady;                                                                                                // 324
  }(),                                                                                                               // 324
                                                                                                                     //
  sendAdded: function () {                                                                                           // 335
    function sendAdded(collectionName, id, fields) {                                                                 // 335
      var self = this;                                                                                               // 336
      if (self._isSending) self.send({ msg: "added", collection: collectionName, id: id, fields: fields });          // 337
    }                                                                                                                // 339
                                                                                                                     //
    return sendAdded;                                                                                                // 335
  }(),                                                                                                               // 335
                                                                                                                     //
  sendChanged: function () {                                                                                         // 341
    function sendChanged(collectionName, id, fields) {                                                               // 341
      var self = this;                                                                                               // 342
      if (_.isEmpty(fields)) return;                                                                                 // 343
                                                                                                                     //
      if (self._isSending) {                                                                                         // 346
        self.send({                                                                                                  // 347
          msg: "changed",                                                                                            // 348
          collection: collectionName,                                                                                // 349
          id: id,                                                                                                    // 350
          fields: fields                                                                                             // 351
        });                                                                                                          // 347
      }                                                                                                              // 353
    }                                                                                                                // 354
                                                                                                                     //
    return sendChanged;                                                                                              // 341
  }(),                                                                                                               // 341
                                                                                                                     //
  sendRemoved: function () {                                                                                         // 356
    function sendRemoved(collectionName, id) {                                                                       // 356
      var self = this;                                                                                               // 357
      if (self._isSending) self.send({ msg: "removed", collection: collectionName, id: id });                        // 358
    }                                                                                                                // 360
                                                                                                                     //
    return sendRemoved;                                                                                              // 356
  }(),                                                                                                               // 356
                                                                                                                     //
  getSendCallbacks: function () {                                                                                    // 362
    function getSendCallbacks() {                                                                                    // 362
      var self = this;                                                                                               // 363
      return {                                                                                                       // 364
        added: _.bind(self.sendAdded, self),                                                                         // 365
        changed: _.bind(self.sendChanged, self),                                                                     // 366
        removed: _.bind(self.sendRemoved, self)                                                                      // 367
      };                                                                                                             // 364
    }                                                                                                                // 369
                                                                                                                     //
    return getSendCallbacks;                                                                                         // 362
  }(),                                                                                                               // 362
                                                                                                                     //
  getCollectionView: function () {                                                                                   // 371
    function getCollectionView(collectionName) {                                                                     // 371
      var self = this;                                                                                               // 372
      if (_.has(self.collectionViews, collectionName)) {                                                             // 373
        return self.collectionViews[collectionName];                                                                 // 374
      }                                                                                                              // 375
      var ret = new SessionCollectionView(collectionName, self.getSendCallbacks());                                  // 376
      self.collectionViews[collectionName] = ret;                                                                    // 378
      return ret;                                                                                                    // 379
    }                                                                                                                // 380
                                                                                                                     //
    return getCollectionView;                                                                                        // 371
  }(),                                                                                                               // 371
                                                                                                                     //
  added: function () {                                                                                               // 382
    function added(subscriptionHandle, collectionName, id, fields) {                                                 // 382
      var self = this;                                                                                               // 383
      var view = self.getCollectionView(collectionName);                                                             // 384
      view.added(subscriptionHandle, id, fields);                                                                    // 385
    }                                                                                                                // 386
                                                                                                                     //
    return added;                                                                                                    // 382
  }(),                                                                                                               // 382
                                                                                                                     //
  removed: function () {                                                                                             // 388
    function removed(subscriptionHandle, collectionName, id) {                                                       // 388
      var self = this;                                                                                               // 389
      var view = self.getCollectionView(collectionName);                                                             // 390
      view.removed(subscriptionHandle, id);                                                                          // 391
      if (view.isEmpty()) {                                                                                          // 392
        delete self.collectionViews[collectionName];                                                                 // 393
      }                                                                                                              // 394
    }                                                                                                                // 395
                                                                                                                     //
    return removed;                                                                                                  // 388
  }(),                                                                                                               // 388
                                                                                                                     //
  changed: function () {                                                                                             // 397
    function changed(subscriptionHandle, collectionName, id, fields) {                                               // 397
      var self = this;                                                                                               // 398
      var view = self.getCollectionView(collectionName);                                                             // 399
      view.changed(subscriptionHandle, id, fields);                                                                  // 400
    }                                                                                                                // 401
                                                                                                                     //
    return changed;                                                                                                  // 397
  }(),                                                                                                               // 397
                                                                                                                     //
  startUniversalSubs: function () {                                                                                  // 403
    function startUniversalSubs() {                                                                                  // 403
      var self = this;                                                                                               // 404
      // Make a shallow copy of the set of universal handlers and start them. If                                     // 405
      // additional universal publishers start while we're running them (due to                                      // 406
      // yielding), they will run separately as part of Server.publish.                                              // 407
      var handlers = _.clone(self.server.universal_publish_handlers);                                                // 408
      _.each(handlers, function (handler) {                                                                          // 409
        self._startSubscription(handler);                                                                            // 410
      });                                                                                                            // 411
    }                                                                                                                // 412
                                                                                                                     //
    return startUniversalSubs;                                                                                       // 403
  }(),                                                                                                               // 403
                                                                                                                     //
  // Destroy this session and unregister it at the server.                                                           // 414
  close: function () {                                                                                               // 415
    function close() {                                                                                               // 415
      var self = this;                                                                                               // 416
                                                                                                                     //
      // Destroy this session, even if it's not registered at the                                                    // 418
      // server. Stop all processing and tear everything down. If a socket                                           // 419
      // was attached, close it.                                                                                     // 420
                                                                                                                     //
      // Already destroyed.                                                                                          // 422
      if (!self.inQueue) return;                                                                                     // 423
                                                                                                                     //
      // Drop the merge box data immediately.                                                                        // 426
      self.inQueue = null;                                                                                           // 427
      self.collectionViews = {};                                                                                     // 428
                                                                                                                     //
      if (self.heartbeat) {                                                                                          // 430
        self.heartbeat.stop();                                                                                       // 431
        self.heartbeat = null;                                                                                       // 432
      }                                                                                                              // 433
                                                                                                                     //
      if (self.socket) {                                                                                             // 435
        self.socket.close();                                                                                         // 436
        self.socket._meteorSession = null;                                                                           // 437
      }                                                                                                              // 438
                                                                                                                     //
      Package.facts && Package.facts.Facts.incrementServerFact("livedata", "sessions", -1);                          // 440
                                                                                                                     //
      Meteor.defer(function () {                                                                                     // 443
        // stop callbacks can yield, so we defer this on close.                                                      // 444
        // sub._isDeactivated() detects that we set inQueue to null and                                              // 445
        // treats it as semi-deactivated (it will ignore incoming callbacks, etc).                                   // 446
        self._deactivateAllSubscriptions();                                                                          // 447
                                                                                                                     //
        // Defer calling the close callbacks, so that the caller closing                                             // 449
        // the session isn't waiting for all the callbacks to complete.                                              // 450
        _.each(self._closeCallbacks, function (callback) {                                                           // 451
          callback();                                                                                                // 452
        });                                                                                                          // 453
      });                                                                                                            // 454
                                                                                                                     //
      // Unregister the session.                                                                                     // 456
      self.server._removeSession(self);                                                                              // 457
    }                                                                                                                // 458
                                                                                                                     //
    return close;                                                                                                    // 415
  }(),                                                                                                               // 415
                                                                                                                     //
  // Send a message (doing nothing if no socket is connected right now.)                                             // 460
  // It should be a JSON object (it will be stringified.)                                                            // 461
  send: function () {                                                                                                // 462
    function send(msg) {                                                                                             // 462
      var self = this;                                                                                               // 463
      if (self.socket) {                                                                                             // 464
        if (Meteor._printSentDDP) Meteor._debug("Sent DDP", DDPCommon.stringifyDDP(msg));                            // 465
        self.socket.send(DDPCommon.stringifyDDP(msg));                                                               // 467
      }                                                                                                              // 468
    }                                                                                                                // 469
                                                                                                                     //
    return send;                                                                                                     // 462
  }(),                                                                                                               // 462
                                                                                                                     //
  // Send a connection error.                                                                                        // 471
  sendError: function () {                                                                                           // 472
    function sendError(reason, offendingMessage) {                                                                   // 472
      var self = this;                                                                                               // 473
      var msg = { msg: 'error', reason: reason };                                                                    // 474
      if (offendingMessage) msg.offendingMessage = offendingMessage;                                                 // 475
      self.send(msg);                                                                                                // 477
    }                                                                                                                // 478
                                                                                                                     //
    return sendError;                                                                                                // 472
  }(),                                                                                                               // 472
                                                                                                                     //
  // Process 'msg' as an incoming message. (But as a guard against                                                   // 480
  // race conditions during reconnection, ignore the message if                                                      // 481
  // 'socket' is not the currently connected socket.)                                                                // 482
  //                                                                                                                 // 483
  // We run the messages from the client one at a time, in the order                                                 // 484
  // given by the client. The message handler is passed an idempotent                                                // 485
  // function 'unblock' which it may call to allow other messages to                                                 // 486
  // begin running in parallel in another fiber (for example, a method                                               // 487
  // that wants to yield.) Otherwise, it is automatically unblocked                                                  // 488
  // when it returns.                                                                                                // 489
  //                                                                                                                 // 490
  // Actually, we don't have to 'totally order' the messages in this                                                 // 491
  // way, but it's the easiest thing that's correct. (unsub needs to                                                 // 492
  // be ordered against sub, methods need to be ordered against each                                                 // 493
  // other.)                                                                                                         // 494
  processMessage: function () {                                                                                      // 495
    function processMessage(msg_in) {                                                                                // 495
      var self = this;                                                                                               // 496
      if (!self.inQueue) // we have been destroyed.                                                                  // 497
        return;                                                                                                      // 498
                                                                                                                     //
      // Respond to ping and pong messages immediately without queuing.                                              // 500
      // If the negotiated DDP version is "pre1" which didn't support                                                // 501
      // pings, preserve the "pre1" behavior of responding with a "bad                                               // 502
      // request" for the unknown messages.                                                                          // 503
      //                                                                                                             // 504
      // Fibers are needed because heartbeat uses Meteor.setTimeout, which                                           // 505
      // needs a Fiber. We could actually use regular setTimeout and avoid                                           // 506
      // these new fibers, but it is easier to just make everything use                                              // 507
      // Meteor.setTimeout and not think too hard.                                                                   // 508
      //                                                                                                             // 509
      // Any message counts as receiving a pong, as it demonstrates that                                             // 510
      // the client is still alive.                                                                                  // 511
      if (self.heartbeat) {                                                                                          // 512
        Fiber(function () {                                                                                          // 513
          self.heartbeat.messageReceived();                                                                          // 514
        }).run();                                                                                                    // 515
      }                                                                                                              // 516
                                                                                                                     //
      if (self.version !== 'pre1' && msg_in.msg === 'ping') {                                                        // 518
        if (self._respondToPings) self.send({ msg: "pong", id: msg_in.id });                                         // 519
        return;                                                                                                      // 521
      }                                                                                                              // 522
      if (self.version !== 'pre1' && msg_in.msg === 'pong') {                                                        // 523
        // Since everything is a pong, nothing to do                                                                 // 524
        return;                                                                                                      // 525
      }                                                                                                              // 526
                                                                                                                     //
      self.inQueue.push(msg_in);                                                                                     // 528
      if (self.workerRunning) return;                                                                                // 529
      self.workerRunning = true;                                                                                     // 531
                                                                                                                     //
      var processNext = function () {                                                                                // 533
        function processNext() {                                                                                     // 533
          var msg = self.inQueue && self.inQueue.shift();                                                            // 534
          if (!msg) {                                                                                                // 535
            self.workerRunning = false;                                                                              // 536
            return;                                                                                                  // 537
          }                                                                                                          // 538
                                                                                                                     //
          Fiber(function () {                                                                                        // 540
            var blocked = true;                                                                                      // 541
                                                                                                                     //
            var unblock = function () {                                                                              // 543
              function unblock() {                                                                                   // 543
                if (!blocked) return; // idempotent                                                                  // 544
                blocked = false;                                                                                     // 546
                processNext();                                                                                       // 547
              }                                                                                                      // 548
                                                                                                                     //
              return unblock;                                                                                        // 543
            }();                                                                                                     // 543
                                                                                                                     //
            if (_.has(self.protocol_handlers, msg.msg)) self.protocol_handlers[msg.msg].call(self, msg, unblock);else self.sendError('Bad request', msg);
            unblock(); // in case the handler didn't already do it                                                   // 554
          }).run();                                                                                                  // 555
        }                                                                                                            // 556
                                                                                                                     //
        return processNext;                                                                                          // 533
      }();                                                                                                           // 533
                                                                                                                     //
      processNext();                                                                                                 // 558
    }                                                                                                                // 559
                                                                                                                     //
    return processMessage;                                                                                           // 495
  }(),                                                                                                               // 495
                                                                                                                     //
  protocol_handlers: {                                                                                               // 561
    sub: function () {                                                                                               // 562
      function sub(msg) {                                                                                            // 562
        var self = this;                                                                                             // 563
                                                                                                                     //
        // reject malformed messages                                                                                 // 565
        if (typeof msg.id !== "string" || typeof msg.name !== "string" || 'params' in msg && !(msg.params instanceof Array)) {
          self.sendError("Malformed subscription", msg);                                                             // 569
          return;                                                                                                    // 570
        }                                                                                                            // 571
                                                                                                                     //
        if (!self.server.publish_handlers[msg.name]) {                                                               // 573
          self.send({                                                                                                // 574
            msg: 'nosub', id: msg.id,                                                                                // 575
            error: new Meteor.Error(404, "Subscription '" + msg.name + "' not found") });                            // 576
          return;                                                                                                    // 577
        }                                                                                                            // 578
                                                                                                                     //
        if (_.has(self._namedSubs, msg.id))                                                                          // 580
          // subs are idempotent, or rather, they are ignored if a sub                                               // 581
          // with that id already exists. this is important during                                                   // 582
          // reconnect.                                                                                              // 583
          return;                                                                                                    // 584
                                                                                                                     //
        // XXX It'd be much better if we had generic hooks where any package can                                     // 586
        // hook into subscription handling, but in the mean while we special case                                    // 587
        // ddp-rate-limiter package. This is also done for weak requirements to                                      // 588
        // add the ddp-rate-limiter package in case we don't have Accounts. A                                        // 589
        // user trying to use the ddp-rate-limiter must explicitly require it.                                       // 590
        if (Package['ddp-rate-limiter']) {                                                                           // 591
          var DDPRateLimiter = Package['ddp-rate-limiter'].DDPRateLimiter;                                           // 592
          var rateLimiterInput = {                                                                                   // 593
            userId: self.userId,                                                                                     // 594
            clientAddress: self.connectionHandle.clientAddress,                                                      // 595
            type: "subscription",                                                                                    // 596
            name: msg.name,                                                                                          // 597
            connectionId: self.id                                                                                    // 598
          };                                                                                                         // 593
                                                                                                                     //
          DDPRateLimiter._increment(rateLimiterInput);                                                               // 601
          var rateLimitResult = DDPRateLimiter._check(rateLimiterInput);                                             // 602
          if (!rateLimitResult.allowed) {                                                                            // 603
            self.send({                                                                                              // 604
              msg: 'nosub', id: msg.id,                                                                              // 605
              error: new Meteor.Error('too-many-requests', DDPRateLimiter.getErrorMessage(rateLimitResult), { timeToReset: rateLimitResult.timeToReset })
            });                                                                                                      // 604
            return;                                                                                                  // 611
          }                                                                                                          // 612
        }                                                                                                            // 613
                                                                                                                     //
        var handler = self.server.publish_handlers[msg.name];                                                        // 615
                                                                                                                     //
        self._startSubscription(handler, msg.id, msg.params, msg.name);                                              // 617
      }                                                                                                              // 619
                                                                                                                     //
      return sub;                                                                                                    // 562
    }(),                                                                                                             // 562
                                                                                                                     //
    unsub: function () {                                                                                             // 621
      function unsub(msg) {                                                                                          // 621
        var self = this;                                                                                             // 622
                                                                                                                     //
        self._stopSubscription(msg.id);                                                                              // 624
      }                                                                                                              // 625
                                                                                                                     //
      return unsub;                                                                                                  // 621
    }(),                                                                                                             // 621
                                                                                                                     //
    method: function () {                                                                                            // 627
      function method(msg, unblock) {                                                                                // 627
        var self = this;                                                                                             // 628
                                                                                                                     //
        // reject malformed messages                                                                                 // 630
        // For now, we silently ignore unknown attributes,                                                           // 631
        // for forwards compatibility.                                                                               // 632
        if (typeof msg.id !== "string" || typeof msg.method !== "string" || 'params' in msg && !(msg.params instanceof Array) || 'randomSeed' in msg && typeof msg.randomSeed !== "string") {
          self.sendError("Malformed method invocation", msg);                                                        // 637
          return;                                                                                                    // 638
        }                                                                                                            // 639
                                                                                                                     //
        var randomSeed = msg.randomSeed || null;                                                                     // 641
                                                                                                                     //
        // set up to mark the method as satisfied once all observers                                                 // 643
        // (and subscriptions) have reacted to any writes that were                                                  // 644
        // done.                                                                                                     // 645
        var fence = new DDPServer._WriteFence();                                                                     // 646
        fence.onAllCommitted(function () {                                                                           // 647
          // Retire the fence so that future writes are allowed.                                                     // 648
          // This means that callbacks like timers are free to use                                                   // 649
          // the fence, and if they fire before it's armed (for                                                      // 650
          // example, because the method waits for them) their                                                       // 651
          // writes will be included in the fence.                                                                   // 652
          fence.retire();                                                                                            // 653
          self.send({                                                                                                // 654
            msg: 'updated', methods: [msg.id] });                                                                    // 655
        });                                                                                                          // 656
                                                                                                                     //
        // find the handler                                                                                          // 658
        var handler = self.server.method_handlers[msg.method];                                                       // 659
        if (!handler) {                                                                                              // 660
          self.send({                                                                                                // 661
            msg: 'result', id: msg.id,                                                                               // 662
            error: new Meteor.Error(404, "Method '" + msg.method + "' not found") });                                // 663
          fence.arm();                                                                                               // 664
          return;                                                                                                    // 665
        }                                                                                                            // 666
                                                                                                                     //
        var setUserId = function () {                                                                                // 668
          function setUserId(userId) {                                                                               // 668
            self._setUserId(userId);                                                                                 // 669
          }                                                                                                          // 670
                                                                                                                     //
          return setUserId;                                                                                          // 668
        }();                                                                                                         // 668
                                                                                                                     //
        var invocation = new DDPCommon.MethodInvocation({                                                            // 672
          isSimulation: false,                                                                                       // 673
          userId: self.userId,                                                                                       // 674
          setUserId: setUserId,                                                                                      // 675
          unblock: unblock,                                                                                          // 676
          connection: self.connectionHandle,                                                                         // 677
          randomSeed: randomSeed                                                                                     // 678
        });                                                                                                          // 672
                                                                                                                     //
        var promise = new Promise(function (resolve, reject) {                                                       // 681
          // XXX It'd be better if we could hook into method handlers better but                                     // 682
          // for now, we need to check if the ddp-rate-limiter exists since we                                       // 683
          // have a weak requirement for the ddp-rate-limiter package to be added                                    // 684
          // to our application.                                                                                     // 685
          if (Package['ddp-rate-limiter']) {                                                                         // 686
            var DDPRateLimiter = Package['ddp-rate-limiter'].DDPRateLimiter;                                         // 687
            var rateLimiterInput = {                                                                                 // 688
              userId: self.userId,                                                                                   // 689
              clientAddress: self.connectionHandle.clientAddress,                                                    // 690
              type: "method",                                                                                        // 691
              name: msg.method,                                                                                      // 692
              connectionId: self.id                                                                                  // 693
            };                                                                                                       // 688
            DDPRateLimiter._increment(rateLimiterInput);                                                             // 695
            var rateLimitResult = DDPRateLimiter._check(rateLimiterInput);                                           // 696
            if (!rateLimitResult.allowed) {                                                                          // 697
              reject(new Meteor.Error("too-many-requests", DDPRateLimiter.getErrorMessage(rateLimitResult), { timeToReset: rateLimitResult.timeToReset }));
              return;                                                                                                // 703
            }                                                                                                        // 704
          }                                                                                                          // 705
                                                                                                                     //
          resolve(DDPServer._CurrentWriteFence.withValue(fence, function () {                                        // 707
            return DDP._CurrentInvocation.withValue(invocation, function () {                                        // 709
              return maybeAuditArgumentChecks(handler, invocation, msg.params, "call to '" + msg.method + "'");      // 711
            });                                                                                                      // 711
          }));                                                                                                       // 709
        });                                                                                                          // 717
                                                                                                                     //
        function finish() {                                                                                          // 719
          fence.arm();                                                                                               // 720
          unblock();                                                                                                 // 721
        }                                                                                                            // 722
                                                                                                                     //
        var payload = {                                                                                              // 724
          msg: "result",                                                                                             // 725
          id: msg.id                                                                                                 // 726
        };                                                                                                           // 724
                                                                                                                     //
        promise.then(function (result) {                                                                             // 729
          finish();                                                                                                  // 730
          if (result !== undefined) {                                                                                // 731
            payload.result = result;                                                                                 // 732
          }                                                                                                          // 733
          self.send(payload);                                                                                        // 734
        }, function (exception) {                                                                                    // 735
          finish();                                                                                                  // 736
          payload.error = wrapInternalException(exception, "while invoking method '" + msg.method + "'");            // 737
          self.send(payload);                                                                                        // 741
        });                                                                                                          // 742
      }                                                                                                              // 743
                                                                                                                     //
      return method;                                                                                                 // 627
    }()                                                                                                              // 627
  },                                                                                                                 // 561
                                                                                                                     //
  _eachSub: function () {                                                                                            // 746
    function _eachSub(f) {                                                                                           // 746
      var self = this;                                                                                               // 747
      _.each(self._namedSubs, f);                                                                                    // 748
      _.each(self._universalSubs, f);                                                                                // 749
    }                                                                                                                // 750
                                                                                                                     //
    return _eachSub;                                                                                                 // 746
  }(),                                                                                                               // 746
                                                                                                                     //
  _diffCollectionViews: function () {                                                                                // 752
    function _diffCollectionViews(beforeCVs) {                                                                       // 752
      var self = this;                                                                                               // 753
      DiffSequence.diffObjects(beforeCVs, self.collectionViews, {                                                    // 754
        both: function () {                                                                                          // 755
          function both(collectionName, leftValue, rightValue) {                                                     // 755
            rightValue.diff(leftValue);                                                                              // 756
          }                                                                                                          // 757
                                                                                                                     //
          return both;                                                                                               // 755
        }(),                                                                                                         // 755
        rightOnly: function () {                                                                                     // 758
          function rightOnly(collectionName, rightValue) {                                                           // 758
            _.each(rightValue.documents, function (docView, id) {                                                    // 759
              self.sendAdded(collectionName, id, docView.getFields());                                               // 760
            });                                                                                                      // 761
          }                                                                                                          // 762
                                                                                                                     //
          return rightOnly;                                                                                          // 758
        }(),                                                                                                         // 758
        leftOnly: function () {                                                                                      // 763
          function leftOnly(collectionName, leftValue) {                                                             // 763
            _.each(leftValue.documents, function (doc, id) {                                                         // 764
              self.sendRemoved(collectionName, id);                                                                  // 765
            });                                                                                                      // 766
          }                                                                                                          // 767
                                                                                                                     //
          return leftOnly;                                                                                           // 763
        }()                                                                                                          // 763
      });                                                                                                            // 754
    }                                                                                                                // 769
                                                                                                                     //
    return _diffCollectionViews;                                                                                     // 752
  }(),                                                                                                               // 752
                                                                                                                     //
  // Sets the current user id in all appropriate contexts and reruns                                                 // 771
  // all subscriptions                                                                                               // 772
  _setUserId: function () {                                                                                          // 773
    function _setUserId(userId) {                                                                                    // 773
      var self = this;                                                                                               // 774
                                                                                                                     //
      if (userId !== null && typeof userId !== "string") throw new Error("setUserId must be called on string or null, not " + (typeof userId === "undefined" ? "undefined" : _typeof(userId)));
                                                                                                                     //
      // Prevent newly-created universal subscriptions from being added to our                                       // 780
      // session; they will be found below when we call startUniversalSubs.                                          // 781
      //                                                                                                             // 782
      // (We don't have to worry about named subscriptions, because we only add                                      // 783
      // them when we process a 'sub' message. We are currently processing a                                         // 784
      // 'method' message, and the method did not unblock, because it is illegal                                     // 785
      // to call setUserId after unblock. Thus we cannot be concurrently adding a                                    // 786
      // new named subscription.)                                                                                    // 787
      self._dontStartNewUniversalSubs = true;                                                                        // 788
                                                                                                                     //
      // Prevent current subs from updating our collectionViews and call their                                       // 790
      // stop callbacks. This may yield.                                                                             // 791
      self._eachSub(function (sub) {                                                                                 // 792
        sub._deactivate();                                                                                           // 793
      });                                                                                                            // 794
                                                                                                                     //
      // All subs should now be deactivated. Stop sending messages to the client,                                    // 796
      // save the state of the published collections, reset to an empty view, and                                    // 797
      // update the userId.                                                                                          // 798
      self._isSending = false;                                                                                       // 799
      var beforeCVs = self.collectionViews;                                                                          // 800
      self.collectionViews = {};                                                                                     // 801
      self.userId = userId;                                                                                          // 802
                                                                                                                     //
      // Save the old named subs, and reset to having no subscriptions.                                              // 804
      var oldNamedSubs = self._namedSubs;                                                                            // 805
      self._namedSubs = {};                                                                                          // 806
      self._universalSubs = [];                                                                                      // 807
                                                                                                                     //
      _.each(oldNamedSubs, function (sub, subscriptionId) {                                                          // 809
        self._namedSubs[subscriptionId] = sub._recreate();                                                           // 810
        // nb: if the handler throws or calls this.error(), it will in fact                                          // 811
        // immediately send its 'nosub'. This is OK, though.                                                         // 812
        self._namedSubs[subscriptionId]._runHandler();                                                               // 813
      });                                                                                                            // 814
                                                                                                                     //
      // Allow newly-created universal subs to be started on our connection in                                       // 816
      // parallel with the ones we're spinning up here, and spin up universal                                        // 817
      // subs.                                                                                                       // 818
      self._dontStartNewUniversalSubs = false;                                                                       // 819
      self.startUniversalSubs();                                                                                     // 820
                                                                                                                     //
      // Start sending messages again, beginning with the diff from the previous                                     // 822
      // state of the world to the current state. No yields are allowed during                                       // 823
      // this diff, so that other changes cannot interleave.                                                         // 824
      Meteor._noYieldsAllowed(function () {                                                                          // 825
        self._isSending = true;                                                                                      // 826
        self._diffCollectionViews(beforeCVs);                                                                        // 827
        if (!_.isEmpty(self._pendingReady)) {                                                                        // 828
          self.sendReady(self._pendingReady);                                                                        // 829
          self._pendingReady = [];                                                                                   // 830
        }                                                                                                            // 831
      });                                                                                                            // 832
    }                                                                                                                // 833
                                                                                                                     //
    return _setUserId;                                                                                               // 773
  }(),                                                                                                               // 773
                                                                                                                     //
  _startSubscription: function () {                                                                                  // 835
    function _startSubscription(handler, subId, params, name) {                                                      // 835
      var self = this;                                                                                               // 836
                                                                                                                     //
      var sub = new Subscription(self, handler, subId, params, name);                                                // 838
      if (subId) self._namedSubs[subId] = sub;else self._universalSubs.push(sub);                                    // 840
                                                                                                                     //
      sub._runHandler();                                                                                             // 845
    }                                                                                                                // 846
                                                                                                                     //
    return _startSubscription;                                                                                       // 835
  }(),                                                                                                               // 835
                                                                                                                     //
  // tear down specified subscription                                                                                // 848
  _stopSubscription: function () {                                                                                   // 849
    function _stopSubscription(subId, error) {                                                                       // 849
      var self = this;                                                                                               // 850
                                                                                                                     //
      var subName = null;                                                                                            // 852
                                                                                                                     //
      if (subId && self._namedSubs[subId]) {                                                                         // 854
        subName = self._namedSubs[subId]._name;                                                                      // 855
        self._namedSubs[subId]._removeAllDocuments();                                                                // 856
        self._namedSubs[subId]._deactivate();                                                                        // 857
        delete self._namedSubs[subId];                                                                               // 858
      }                                                                                                              // 859
                                                                                                                     //
      var response = { msg: 'nosub', id: subId };                                                                    // 861
                                                                                                                     //
      if (error) {                                                                                                   // 863
        response.error = wrapInternalException(error, subName ? "from sub " + subName + " id " + subId : "from sub id " + subId);
      }                                                                                                              // 868
                                                                                                                     //
      self.send(response);                                                                                           // 870
    }                                                                                                                // 871
                                                                                                                     //
    return _stopSubscription;                                                                                        // 849
  }(),                                                                                                               // 849
                                                                                                                     //
  // tear down all subscriptions. Note that this does NOT send removed or nosub                                      // 873
  // messages, since we assume the client is gone.                                                                   // 874
  _deactivateAllSubscriptions: function () {                                                                         // 875
    function _deactivateAllSubscriptions() {                                                                         // 875
      var self = this;                                                                                               // 876
                                                                                                                     //
      _.each(self._namedSubs, function (sub, id) {                                                                   // 878
        sub._deactivate();                                                                                           // 879
      });                                                                                                            // 880
      self._namedSubs = {};                                                                                          // 881
                                                                                                                     //
      _.each(self._universalSubs, function (sub) {                                                                   // 883
        sub._deactivate();                                                                                           // 884
      });                                                                                                            // 885
      self._universalSubs = [];                                                                                      // 886
    }                                                                                                                // 887
                                                                                                                     //
    return _deactivateAllSubscriptions;                                                                              // 875
  }(),                                                                                                               // 875
                                                                                                                     //
  // Determine the remote client's IP address, based on the                                                          // 889
  // HTTP_FORWARDED_COUNT environment variable representing how many                                                 // 890
  // proxies the server is behind.                                                                                   // 891
  _clientAddress: function () {                                                                                      // 892
    function _clientAddress() {                                                                                      // 892
      var self = this;                                                                                               // 893
                                                                                                                     //
      // For the reported client address for a connection to be correct,                                             // 895
      // the developer must set the HTTP_FORWARDED_COUNT environment                                                 // 896
      // variable to an integer representing the number of hops they                                                 // 897
      // expect in the `x-forwarded-for` header. E.g., set to "1" if the                                             // 898
      // server is behind one proxy.                                                                                 // 899
      //                                                                                                             // 900
      // This could be computed once at startup instead of every time.                                               // 901
      var httpForwardedCount = parseInt(process.env['HTTP_FORWARDED_COUNT']) || 0;                                   // 902
                                                                                                                     //
      if (httpForwardedCount === 0) return self.socket.remoteAddress;                                                // 904
                                                                                                                     //
      var forwardedFor = self.socket.headers["x-forwarded-for"];                                                     // 907
      if (!_.isString(forwardedFor)) return null;                                                                    // 908
      forwardedFor = forwardedFor.trim().split(/\s*,\s*/);                                                           // 910
                                                                                                                     //
      // Typically the first value in the `x-forwarded-for` header is                                                // 912
      // the original IP address of the client connecting to the first                                               // 913
      // proxy.  However, the end user can easily spoof the header, in                                               // 914
      // which case the first value(s) will be the fake IP address from                                              // 915
      // the user pretending to be a proxy reporting the original IP                                                 // 916
      // address value.  By counting HTTP_FORWARDED_COUNT back from the                                              // 917
      // end of the list, we ensure that we get the IP address being                                                 // 918
      // reported by *our* first proxy.                                                                              // 919
                                                                                                                     //
      if (httpForwardedCount < 0 || httpForwardedCount > forwardedFor.length) return null;                           // 921
                                                                                                                     //
      return forwardedFor[forwardedFor.length - httpForwardedCount];                                                 // 924
    }                                                                                                                // 925
                                                                                                                     //
    return _clientAddress;                                                                                           // 892
  }()                                                                                                                // 892
});                                                                                                                  // 322
                                                                                                                     //
/******************************************************************************/                                     // 928
/* Subscription                                                               */                                     // 929
/******************************************************************************/                                     // 930
                                                                                                                     //
// ctor for a sub handle: the input to each publish function                                                         // 932
                                                                                                                     //
// Instance name is this because it's usually referred to as this inside a                                           // 934
// publish                                                                                                           // 935
/**                                                                                                                  // 936
 * @summary The server's side of a subscription                                                                      //
 * @class Subscription                                                                                               //
 * @instanceName this                                                                                                //
 */                                                                                                                  //
var Subscription = function Subscription(session, handler, subscriptionId, params, name) {                           // 941
  var self = this;                                                                                                   // 943
  self._session = session; // type is Session                                                                        // 944
                                                                                                                     //
  /**                                                                                                                // 946
   * @summary Access inside the publish function. The incoming [connection](#meteor_onconnection) for this subscription.
   * @locus Server                                                                                                   //
   * @name  connection                                                                                               //
   * @memberOf Subscription                                                                                          //
   * @instance                                                                                                       //
   */                                                                                                                //
  self.connection = session.connectionHandle; // public API object                                                   // 953
                                                                                                                     //
  self._handler = handler;                                                                                           // 955
                                                                                                                     //
  // my subscription ID (generated by client, undefined for universal subs).                                         // 957
  self._subscriptionId = subscriptionId;                                                                             // 958
  // undefined for universal subs                                                                                    // 959
  self._name = name;                                                                                                 // 960
                                                                                                                     //
  self._params = params || [];                                                                                       // 962
                                                                                                                     //
  // Only named subscriptions have IDs, but we need some sort of string                                              // 964
  // internally to keep track of all subscriptions inside                                                            // 965
  // SessionDocumentViews. We use this subscriptionHandle for that.                                                  // 966
  if (self._subscriptionId) {                                                                                        // 967
    self._subscriptionHandle = 'N' + self._subscriptionId;                                                           // 968
  } else {                                                                                                           // 969
    self._subscriptionHandle = 'U' + Random.id();                                                                    // 970
  }                                                                                                                  // 971
                                                                                                                     //
  // has _deactivate been called?                                                                                    // 973
  self._deactivated = false;                                                                                         // 974
                                                                                                                     //
  // stop callbacks to g/c this sub.  called w/ zero arguments.                                                      // 976
  self._stopCallbacks = [];                                                                                          // 977
                                                                                                                     //
  // the set of (collection, documentid) that this subscription has                                                  // 979
  // an opinion about                                                                                                // 980
  self._documents = {};                                                                                              // 981
                                                                                                                     //
  // remember if we are ready.                                                                                       // 983
  self._ready = false;                                                                                               // 984
                                                                                                                     //
  // Part of the public API: the user of this sub.                                                                   // 986
                                                                                                                     //
  /**                                                                                                                // 988
   * @summary Access inside the publish function. The id of the logged-in user, or `null` if no user is logged in.   //
   * @locus Server                                                                                                   //
   * @memberOf Subscription                                                                                          //
   * @name  userId                                                                                                   //
   * @instance                                                                                                       //
   */                                                                                                                //
  self.userId = session.userId;                                                                                      // 995
                                                                                                                     //
  // For now, the id filter is going to default to                                                                   // 997
  // the to/from DDP methods on MongoID, to                                                                          // 998
  // specifically deal with mongo/minimongo ObjectIds.                                                               // 999
                                                                                                                     //
  // Later, you will be able to make this be "raw"                                                                   // 1001
  // if you want to publish a collection that you know                                                               // 1002
  // just has strings for keys and no funny business, to                                                             // 1003
  // a ddp consumer that isn't minimongo                                                                             // 1004
                                                                                                                     //
  self._idFilter = {                                                                                                 // 1006
    idStringify: MongoID.idStringify,                                                                                // 1007
    idParse: MongoID.idParse                                                                                         // 1008
  };                                                                                                                 // 1006
                                                                                                                     //
  Package.facts && Package.facts.Facts.incrementServerFact("livedata", "subscriptions", 1);                          // 1011
};                                                                                                                   // 1013
                                                                                                                     //
_.extend(Subscription.prototype, {                                                                                   // 1015
  _runHandler: function () {                                                                                         // 1016
    function _runHandler() {                                                                                         // 1016
      // XXX should we unblock() here? Either before running the publish                                             // 1017
      // function, or before running _publishCursor.                                                                 // 1018
      //                                                                                                             // 1019
      // Right now, each publish function blocks all future publishes and                                            // 1020
      // methods waiting on data from Mongo (or whatever else the function                                           // 1021
      // blocks on). This probably slows page load in common cases.                                                  // 1022
                                                                                                                     //
      var self = this;                                                                                               // 1024
      try {                                                                                                          // 1025
        var res = maybeAuditArgumentChecks(self._handler, self, EJSON.clone(self._params),                           // 1026
        // It's OK that this would look weird for universal subscriptions,                                           // 1028
        // because they have no arguments so there can never be an                                                   // 1029
        // audit-argument-checks failure.                                                                            // 1030
        "publisher '" + self._name + "'");                                                                           // 1031
      } catch (e) {                                                                                                  // 1032
        self.error(e);                                                                                               // 1033
        return;                                                                                                      // 1034
      }                                                                                                              // 1035
                                                                                                                     //
      // Did the handler call this.error or this.stop?                                                               // 1037
      if (self._isDeactivated()) return;                                                                             // 1038
                                                                                                                     //
      self._publishHandlerResult(res);                                                                               // 1041
    }                                                                                                                // 1042
                                                                                                                     //
    return _runHandler;                                                                                              // 1016
  }(),                                                                                                               // 1016
                                                                                                                     //
  _publishHandlerResult: function () {                                                                               // 1044
    function _publishHandlerResult(res) {                                                                            // 1044
      // SPECIAL CASE: Instead of writing their own callbacks that invoke                                            // 1045
      // this.added/changed/ready/etc, the user can just return a collection                                         // 1046
      // cursor or array of cursors from the publish function; we call their                                         // 1047
      // _publishCursor method which starts observing the cursor and publishes the                                   // 1048
      // results. Note that _publishCursor does NOT call ready().                                                    // 1049
      //                                                                                                             // 1050
      // XXX This uses an undocumented interface which only the Mongo cursor                                         // 1051
      // interface publishes. Should we make this interface public and encourage                                     // 1052
      // users to implement it themselves? Arguably, it's unnecessary; users can                                     // 1053
      // already write their own functions like                                                                      // 1054
      //   var publishMyReactiveThingy = function (name, handler) {                                                  // 1055
      //     Meteor.publish(name, function () {                                                                      // 1056
      //       var reactiveThingy = handler();                                                                       // 1057
      //       reactiveThingy.publishMe();                                                                           // 1058
      //     });                                                                                                     // 1059
      //   };                                                                                                        // 1060
                                                                                                                     //
      var self = this;                                                                                               // 1062
      var isCursor = function () {                                                                                   // 1063
        function isCursor(c) {                                                                                       // 1063
          return c && c._publishCursor;                                                                              // 1064
        }                                                                                                            // 1065
                                                                                                                     //
        return isCursor;                                                                                             // 1063
      }();                                                                                                           // 1063
      if (isCursor(res)) {                                                                                           // 1066
        try {                                                                                                        // 1067
          res._publishCursor(self);                                                                                  // 1068
        } catch (e) {                                                                                                // 1069
          self.error(e);                                                                                             // 1070
          return;                                                                                                    // 1071
        }                                                                                                            // 1072
        // _publishCursor only returns after the initial added callbacks have run.                                   // 1073
        // mark subscription as ready.                                                                               // 1074
        self.ready();                                                                                                // 1075
      } else if (_.isArray(res)) {                                                                                   // 1076
        // check all the elements are cursors                                                                        // 1077
        if (!_.all(res, isCursor)) {                                                                                 // 1078
          self.error(new Error("Publish function returned an array of non-Cursors"));                                // 1079
          return;                                                                                                    // 1080
        }                                                                                                            // 1081
        // find duplicate collection names                                                                           // 1082
        // XXX we should support overlapping cursors, but that would require the                                     // 1083
        // merge box to allow overlap within a subscription                                                          // 1084
        var collectionNames = {};                                                                                    // 1085
        for (var i = 0; i < res.length; ++i) {                                                                       // 1086
          var collectionName = res[i]._getCollectionName();                                                          // 1087
          if (_.has(collectionNames, collectionName)) {                                                              // 1088
            self.error(new Error("Publish function returned multiple cursors for collection " + collectionName));    // 1089
            return;                                                                                                  // 1092
          }                                                                                                          // 1093
          collectionNames[collectionName] = true;                                                                    // 1094
        };                                                                                                           // 1095
                                                                                                                     //
        try {                                                                                                        // 1097
          _.each(res, function (cur) {                                                                               // 1098
            cur._publishCursor(self);                                                                                // 1099
          });                                                                                                        // 1100
        } catch (e) {                                                                                                // 1101
          self.error(e);                                                                                             // 1102
          return;                                                                                                    // 1103
        }                                                                                                            // 1104
        self.ready();                                                                                                // 1105
      } else if (res) {                                                                                              // 1106
        // truthy values other than cursors or arrays are probably a                                                 // 1107
        // user mistake (possible returning a Mongo document via, say,                                               // 1108
        // `coll.findOne()`).                                                                                        // 1109
        self.error(new Error("Publish function can only return a Cursor or " + "an array of Cursors"));              // 1110
      }                                                                                                              // 1112
    }                                                                                                                // 1113
                                                                                                                     //
    return _publishHandlerResult;                                                                                    // 1044
  }(),                                                                                                               // 1044
                                                                                                                     //
  // This calls all stop callbacks and prevents the handler from updating any                                        // 1115
  // SessionCollectionViews further. It's used when the user unsubscribes or                                         // 1116
  // disconnects, as well as during setUserId re-runs. It does *NOT* send                                            // 1117
  // removed messages for the published objects; if that is necessary, call                                          // 1118
  // _removeAllDocuments first.                                                                                      // 1119
  _deactivate: function () {                                                                                         // 1120
    function _deactivate() {                                                                                         // 1120
      var self = this;                                                                                               // 1121
      if (self._deactivated) return;                                                                                 // 1122
      self._deactivated = true;                                                                                      // 1124
      self._callStopCallbacks();                                                                                     // 1125
      Package.facts && Package.facts.Facts.incrementServerFact("livedata", "subscriptions", -1);                     // 1126
    }                                                                                                                // 1128
                                                                                                                     //
    return _deactivate;                                                                                              // 1120
  }(),                                                                                                               // 1120
                                                                                                                     //
  _callStopCallbacks: function () {                                                                                  // 1130
    function _callStopCallbacks() {                                                                                  // 1130
      var self = this;                                                                                               // 1131
      // tell listeners, so they can clean up                                                                        // 1132
      var callbacks = self._stopCallbacks;                                                                           // 1133
      self._stopCallbacks = [];                                                                                      // 1134
      _.each(callbacks, function (callback) {                                                                        // 1135
        callback();                                                                                                  // 1136
      });                                                                                                            // 1137
    }                                                                                                                // 1138
                                                                                                                     //
    return _callStopCallbacks;                                                                                       // 1130
  }(),                                                                                                               // 1130
                                                                                                                     //
  // Send remove messages for every document.                                                                        // 1140
  _removeAllDocuments: function () {                                                                                 // 1141
    function _removeAllDocuments() {                                                                                 // 1141
      var self = this;                                                                                               // 1142
      Meteor._noYieldsAllowed(function () {                                                                          // 1143
        _.each(self._documents, function (collectionDocs, collectionName) {                                          // 1144
          // Iterate over _.keys instead of the dictionary itself, since we'll be                                    // 1145
          // mutating it.                                                                                            // 1146
          _.each(_.keys(collectionDocs), function (strId) {                                                          // 1147
            self.removed(collectionName, self._idFilter.idParse(strId));                                             // 1148
          });                                                                                                        // 1149
        });                                                                                                          // 1150
      });                                                                                                            // 1151
    }                                                                                                                // 1152
                                                                                                                     //
    return _removeAllDocuments;                                                                                      // 1141
  }(),                                                                                                               // 1141
                                                                                                                     //
  // Returns a new Subscription for the same session with the same                                                   // 1154
  // initial creation parameters. This isn't a clone: it doesn't have                                                // 1155
  // the same _documents cache, stopped state or callbacks; may have a                                               // 1156
  // different _subscriptionHandle, and gets its userId from the                                                     // 1157
  // session, not from this object.                                                                                  // 1158
  _recreate: function () {                                                                                           // 1159
    function _recreate() {                                                                                           // 1159
      var self = this;                                                                                               // 1160
      return new Subscription(self._session, self._handler, self._subscriptionId, self._params, self._name);         // 1161
    }                                                                                                                // 1164
                                                                                                                     //
    return _recreate;                                                                                                // 1159
  }(),                                                                                                               // 1159
                                                                                                                     //
  /**                                                                                                                // 1166
   * @summary Call inside the publish function.  Stops this client's subscription, triggering a call on the client to the `onStop` callback passed to [`Meteor.subscribe`](#meteor_subscribe), if any. If `error` is not a [`Meteor.Error`](#meteor_error), it will be [sanitized](#meteor_error).
   * @locus Server                                                                                                   //
   * @param {Error} error The error to pass to the client.                                                           //
   * @instance                                                                                                       //
   * @memberOf Subscription                                                                                          //
   */                                                                                                                //
  error: function () {                                                                                               // 1173
    function error(_error) {                                                                                         // 1173
      var self = this;                                                                                               // 1174
      if (self._isDeactivated()) return;                                                                             // 1175
      self._session._stopSubscription(self._subscriptionId, _error);                                                 // 1177
    }                                                                                                                // 1178
                                                                                                                     //
    return error;                                                                                                    // 1173
  }(),                                                                                                               // 1173
                                                                                                                     //
  // Note that while our DDP client will notice that you've called stop() on the                                     // 1180
  // server (and clean up its _subscriptions table) we don't actually provide a                                      // 1181
  // mechanism for an app to notice this (the subscribe onError callback only                                        // 1182
  // triggers if there is an error).                                                                                 // 1183
                                                                                                                     //
  /**                                                                                                                // 1185
   * @summary Call inside the publish function.  Stops this client's subscription and invokes the client's `onStop` callback with no error.
   * @locus Server                                                                                                   //
   * @instance                                                                                                       //
   * @memberOf Subscription                                                                                          //
   */                                                                                                                //
  stop: function () {                                                                                                // 1191
    function stop() {                                                                                                // 1191
      var self = this;                                                                                               // 1192
      if (self._isDeactivated()) return;                                                                             // 1193
      self._session._stopSubscription(self._subscriptionId);                                                         // 1195
    }                                                                                                                // 1196
                                                                                                                     //
    return stop;                                                                                                     // 1191
  }(),                                                                                                               // 1191
                                                                                                                     //
  /**                                                                                                                // 1198
   * @summary Call inside the publish function.  Registers a callback function to run when the subscription is stopped.
   * @locus Server                                                                                                   //
   * @memberOf Subscription                                                                                          //
   * @instance                                                                                                       //
   * @param {Function} func The callback function                                                                    //
   */                                                                                                                //
  onStop: function () {                                                                                              // 1205
    function onStop(callback) {                                                                                      // 1205
      var self = this;                                                                                               // 1206
      if (self._isDeactivated()) callback();else self._stopCallbacks.push(callback);                                 // 1207
    }                                                                                                                // 1211
                                                                                                                     //
    return onStop;                                                                                                   // 1205
  }(),                                                                                                               // 1205
                                                                                                                     //
  // This returns true if the sub has been deactivated, *OR* if the session was                                      // 1213
  // destroyed but the deferred call to _deactivateAllSubscriptions hasn't                                           // 1214
  // happened yet.                                                                                                   // 1215
  _isDeactivated: function () {                                                                                      // 1216
    function _isDeactivated() {                                                                                      // 1216
      var self = this;                                                                                               // 1217
      return self._deactivated || self._session.inQueue === null;                                                    // 1218
    }                                                                                                                // 1219
                                                                                                                     //
    return _isDeactivated;                                                                                           // 1216
  }(),                                                                                                               // 1216
                                                                                                                     //
  /**                                                                                                                // 1221
   * @summary Call inside the publish function.  Informs the subscriber that a document has been added to the record set.
   * @locus Server                                                                                                   //
   * @memberOf Subscription                                                                                          //
   * @instance                                                                                                       //
   * @param {String} collection The name of the collection that contains the new document.                           //
   * @param {String} id The new document's ID.                                                                       //
   * @param {Object} fields The fields in the new document.  If `_id` is present it is ignored.                      //
   */                                                                                                                //
  added: function () {                                                                                               // 1230
    function added(collectionName, id, fields) {                                                                     // 1230
      var self = this;                                                                                               // 1231
      if (self._isDeactivated()) return;                                                                             // 1232
      id = self._idFilter.idStringify(id);                                                                           // 1234
      Meteor._ensure(self._documents, collectionName)[id] = true;                                                    // 1235
      self._session.added(self._subscriptionHandle, collectionName, id, fields);                                     // 1236
    }                                                                                                                // 1237
                                                                                                                     //
    return added;                                                                                                    // 1230
  }(),                                                                                                               // 1230
                                                                                                                     //
  /**                                                                                                                // 1239
   * @summary Call inside the publish function.  Informs the subscriber that a document in the record set has been modified.
   * @locus Server                                                                                                   //
   * @memberOf Subscription                                                                                          //
   * @instance                                                                                                       //
   * @param {String} collection The name of the collection that contains the changed document.                       //
   * @param {String} id The changed document's ID.                                                                   //
   * @param {Object} fields The fields in the document that have changed, together with their new values.  If a field is not present in `fields` it was left unchanged; if it is present in `fields` and has a value of `undefined` it was removed from the document.  If `_id` is present it is ignored.
   */                                                                                                                //
  changed: function () {                                                                                             // 1248
    function changed(collectionName, id, fields) {                                                                   // 1248
      var self = this;                                                                                               // 1249
      if (self._isDeactivated()) return;                                                                             // 1250
      id = self._idFilter.idStringify(id);                                                                           // 1252
      self._session.changed(self._subscriptionHandle, collectionName, id, fields);                                   // 1253
    }                                                                                                                // 1254
                                                                                                                     //
    return changed;                                                                                                  // 1248
  }(),                                                                                                               // 1248
                                                                                                                     //
  /**                                                                                                                // 1256
   * @summary Call inside the publish function.  Informs the subscriber that a document has been removed from the record set.
   * @locus Server                                                                                                   //
   * @memberOf Subscription                                                                                          //
   * @instance                                                                                                       //
   * @param {String} collection The name of the collection that the document has been removed from.                  //
   * @param {String} id The ID of the document that has been removed.                                                //
   */                                                                                                                //
  removed: function () {                                                                                             // 1264
    function removed(collectionName, id) {                                                                           // 1264
      var self = this;                                                                                               // 1265
      if (self._isDeactivated()) return;                                                                             // 1266
      id = self._idFilter.idStringify(id);                                                                           // 1268
      // We don't bother to delete sets of things in a collection if the                                             // 1269
      // collection is empty.  It could break _removeAllDocuments.                                                   // 1270
      delete self._documents[collectionName][id];                                                                    // 1271
      self._session.removed(self._subscriptionHandle, collectionName, id);                                           // 1272
    }                                                                                                                // 1273
                                                                                                                     //
    return removed;                                                                                                  // 1264
  }(),                                                                                                               // 1264
                                                                                                                     //
  /**                                                                                                                // 1275
   * @summary Call inside the publish function.  Informs the subscriber that an initial, complete snapshot of the record set has been sent.  This will trigger a call on the client to the `onReady` callback passed to  [`Meteor.subscribe`](#meteor_subscribe), if any.
   * @locus Server                                                                                                   //
   * @memberOf Subscription                                                                                          //
   * @instance                                                                                                       //
   */                                                                                                                //
  ready: function () {                                                                                               // 1281
    function ready() {                                                                                               // 1281
      var self = this;                                                                                               // 1282
      if (self._isDeactivated()) return;                                                                             // 1283
      if (!self._subscriptionId) return; // unnecessary but ignored for universal sub                                // 1285
      if (!self._ready) {                                                                                            // 1287
        self._session.sendReady([self._subscriptionId]);                                                             // 1288
        self._ready = true;                                                                                          // 1289
      }                                                                                                              // 1290
    }                                                                                                                // 1291
                                                                                                                     //
    return ready;                                                                                                    // 1281
  }()                                                                                                                // 1281
});                                                                                                                  // 1015
                                                                                                                     //
/******************************************************************************/                                     // 1294
/* Server                                                                     */                                     // 1295
/******************************************************************************/                                     // 1296
                                                                                                                     //
Server = function Server(options) {                                                                                  // 1298
  var self = this;                                                                                                   // 1299
                                                                                                                     //
  // The default heartbeat interval is 30 seconds on the server and 35                                               // 1301
  // seconds on the client.  Since the client doesn't need to send a                                                 // 1302
  // ping as long as it is receiving pings, this means that pings                                                    // 1303
  // normally go from the server to the client.                                                                      // 1304
  //                                                                                                                 // 1305
  // Note: Troposphere depends on the ability to mutate                                                              // 1306
  // Meteor.server.options.heartbeatTimeout! This is a hack, but it's life.                                          // 1307
  self.options = _.defaults(options || {}, {                                                                         // 1308
    heartbeatInterval: 15000,                                                                                        // 1309
    heartbeatTimeout: 15000,                                                                                         // 1310
    // For testing, allow responding to pings to be disabled.                                                        // 1311
    respondToPings: true                                                                                             // 1312
  });                                                                                                                // 1308
                                                                                                                     //
  // Map of callbacks to call when a new connection comes in to the                                                  // 1315
  // server and completes DDP version negotiation. Use an object instead                                             // 1316
  // of an array so we can safely remove one from the list while                                                     // 1317
  // iterating over it.                                                                                              // 1318
  self.onConnectionHook = new Hook({                                                                                 // 1319
    debugPrintExceptions: "onConnection callback"                                                                    // 1320
  });                                                                                                                // 1319
                                                                                                                     //
  self.publish_handlers = {};                                                                                        // 1323
  self.universal_publish_handlers = [];                                                                              // 1324
                                                                                                                     //
  self.method_handlers = {};                                                                                         // 1326
                                                                                                                     //
  self.sessions = {}; // map from id to session                                                                      // 1328
                                                                                                                     //
  self.stream_server = new StreamServer();                                                                           // 1330
                                                                                                                     //
  self.stream_server.register(function (socket) {                                                                    // 1332
    // socket implements the SockJSConnection interface                                                              // 1333
    socket._meteorSession = null;                                                                                    // 1334
                                                                                                                     //
    var sendError = function sendError(reason, offendingMessage) {                                                   // 1336
      var msg = { msg: 'error', reason: reason };                                                                    // 1337
      if (offendingMessage) msg.offendingMessage = offendingMessage;                                                 // 1338
      socket.send(DDPCommon.stringifyDDP(msg));                                                                      // 1340
    };                                                                                                               // 1341
                                                                                                                     //
    socket.on('data', function (raw_msg) {                                                                           // 1343
      if (Meteor._printReceivedDDP) {                                                                                // 1344
        Meteor._debug("Received DDP", raw_msg);                                                                      // 1345
      }                                                                                                              // 1346
      try {                                                                                                          // 1347
        try {                                                                                                        // 1348
          var msg = DDPCommon.parseDDP(raw_msg);                                                                     // 1349
        } catch (err) {                                                                                              // 1350
          sendError('Parse error');                                                                                  // 1351
          return;                                                                                                    // 1352
        }                                                                                                            // 1353
        if (msg === null || !msg.msg) {                                                                              // 1354
          sendError('Bad request', msg);                                                                             // 1355
          return;                                                                                                    // 1356
        }                                                                                                            // 1357
                                                                                                                     //
        if (msg.msg === 'connect') {                                                                                 // 1359
          if (socket._meteorSession) {                                                                               // 1360
            sendError("Already connected", msg);                                                                     // 1361
            return;                                                                                                  // 1362
          }                                                                                                          // 1363
          Fiber(function () {                                                                                        // 1364
            self._handleConnect(socket, msg);                                                                        // 1365
          }).run();                                                                                                  // 1366
          return;                                                                                                    // 1367
        }                                                                                                            // 1368
                                                                                                                     //
        if (!socket._meteorSession) {                                                                                // 1370
          sendError('Must connect first', msg);                                                                      // 1371
          return;                                                                                                    // 1372
        }                                                                                                            // 1373
        socket._meteorSession.processMessage(msg);                                                                   // 1374
      } catch (e) {                                                                                                  // 1375
        // XXX print stack nicely                                                                                    // 1376
        Meteor._debug("Internal exception while processing message", msg, e.message, e.stack);                       // 1377
      }                                                                                                              // 1379
    });                                                                                                              // 1380
                                                                                                                     //
    socket.on('close', function () {                                                                                 // 1382
      if (socket._meteorSession) {                                                                                   // 1383
        Fiber(function () {                                                                                          // 1384
          socket._meteorSession.close();                                                                             // 1385
        }).run();                                                                                                    // 1386
      }                                                                                                              // 1387
    });                                                                                                              // 1388
  });                                                                                                                // 1389
};                                                                                                                   // 1390
                                                                                                                     //
_.extend(Server.prototype, {                                                                                         // 1392
                                                                                                                     //
  /**                                                                                                                // 1394
   * @summary Register a callback to be called when a new DDP connection is made to the server.                      //
   * @locus Server                                                                                                   //
   * @param {function} callback The function to call when a new DDP connection is established.                       //
   * @memberOf Meteor                                                                                                //
   * @importFromPackage meteor                                                                                       //
   */                                                                                                                //
  onConnection: function () {                                                                                        // 1401
    function onConnection(fn) {                                                                                      // 1401
      var self = this;                                                                                               // 1402
      return self.onConnectionHook.register(fn);                                                                     // 1403
    }                                                                                                                // 1404
                                                                                                                     //
    return onConnection;                                                                                             // 1401
  }(),                                                                                                               // 1401
                                                                                                                     //
  _handleConnect: function () {                                                                                      // 1406
    function _handleConnect(socket, msg) {                                                                           // 1406
      var self = this;                                                                                               // 1407
                                                                                                                     //
      // The connect message must specify a version and an array of supported                                        // 1409
      // versions, and it must claim to support what it is proposing.                                                // 1410
      if (!(typeof msg.version === 'string' && _.isArray(msg.support) && _.all(msg.support, _.isString) && _.contains(msg.support, msg.version))) {
        socket.send(DDPCommon.stringifyDDP({ msg: 'failed',                                                          // 1415
          version: DDPCommon.SUPPORTED_DDP_VERSIONS[0] }));                                                          // 1416
        socket.close();                                                                                              // 1417
        return;                                                                                                      // 1418
      }                                                                                                              // 1419
                                                                                                                     //
      // In the future, handle session resumption: something like:                                                   // 1421
      //  socket._meteorSession = self.sessions[msg.session]                                                         // 1422
      var version = calculateVersion(msg.support, DDPCommon.SUPPORTED_DDP_VERSIONS);                                 // 1423
                                                                                                                     //
      if (msg.version !== version) {                                                                                 // 1425
        // The best version to use (according to the client's stated preferences)                                    // 1426
        // is not the one the client is trying to use. Inform them about the best                                    // 1427
        // version to use.                                                                                           // 1428
        socket.send(DDPCommon.stringifyDDP({ msg: 'failed', version: version }));                                    // 1429
        socket.close();                                                                                              // 1430
        return;                                                                                                      // 1431
      }                                                                                                              // 1432
                                                                                                                     //
      // Yay, version matches! Create a new session.                                                                 // 1434
      // Note: Troposphere depends on the ability to mutate                                                          // 1435
      // Meteor.server.options.heartbeatTimeout! This is a hack, but it's life.                                      // 1436
      socket._meteorSession = new Session(self, version, socket, self.options);                                      // 1437
      self.sessions[socket._meteorSession.id] = socket._meteorSession;                                               // 1438
      self.onConnectionHook.each(function (callback) {                                                               // 1439
        if (socket._meteorSession) callback(socket._meteorSession.connectionHandle);                                 // 1440
        return true;                                                                                                 // 1442
      });                                                                                                            // 1443
    }                                                                                                                // 1444
                                                                                                                     //
    return _handleConnect;                                                                                           // 1406
  }(),                                                                                                               // 1406
  /**                                                                                                                // 1445
   * Register a publish handler function.                                                                            //
   *                                                                                                                 //
   * @param name {String} identifier for query                                                                       //
   * @param handler {Function} publish handler                                                                       //
   * @param options {Object}                                                                                         //
   *                                                                                                                 //
   * Server will call handler function on each new subscription,                                                     //
   * either when receiving DDP sub message for a named subscription, or on                                           //
   * DDP connect for a universal subscription.                                                                       //
   *                                                                                                                 //
   * If name is null, this will be a subscription that is                                                            //
   * automatically established and permanently on for all connected                                                  //
   * client, instead of a subscription that can be turned on and off                                                 //
   * with subscribe().                                                                                               //
   *                                                                                                                 //
   * options to contain:                                                                                             //
   *  - (mostly internal) is_auto: true if generated automatically                                                   //
   *    from an autopublish hook. this is for cosmetic purposes only                                                 //
   *    (it lets us determine whether to print a warning suggesting                                                  //
   *    that you turn off autopublish.)                                                                              //
   */                                                                                                                //
                                                                                                                     //
  /**                                                                                                                // 1468
   * @summary Publish a record set.                                                                                  //
   * @memberOf Meteor                                                                                                //
   * @importFromPackage meteor                                                                                       //
   * @locus Server                                                                                                   //
   * @param {String|Object} name If String, name of the record set.  If Object, publications Dictionary of publish functions by name.  If `null`, the set has no name, and the record set is automatically sent to all connected clients.
   * @param {Function} func Function called on the server each time a client subscribes.  Inside the function, `this` is the publish handler object, described below.  If the client passed arguments to `subscribe`, the function is called with the same arguments.
   */                                                                                                                //
  publish: function () {                                                                                             // 1476
    function publish(name, handler, options) {                                                                       // 1476
      var self = this;                                                                                               // 1477
                                                                                                                     //
      if (!_.isObject(name)) {                                                                                       // 1479
        options = options || {};                                                                                     // 1480
                                                                                                                     //
        if (name && name in self.publish_handlers) {                                                                 // 1482
          Meteor._debug("Ignoring duplicate publish named '" + name + "'");                                          // 1483
          return;                                                                                                    // 1484
        }                                                                                                            // 1485
                                                                                                                     //
        if (Package.autopublish && !options.is_auto) {                                                               // 1487
          // They have autopublish on, yet they're trying to manually                                                // 1488
          // picking stuff to publish. They probably should turn off                                                 // 1489
          // autopublish. (This check isn't perfect -- if you create a                                               // 1490
          // publish before you turn on autopublish, it won't catch                                                  // 1491
          // it. But this will definitely handle the simple case where                                               // 1492
          // you've added the autopublish package to your app, and are                                               // 1493
          // calling publish from your app code.)                                                                    // 1494
          if (!self.warned_about_autopublish) {                                                                      // 1495
            self.warned_about_autopublish = true;                                                                    // 1496
            Meteor._debug("** You've set up some data subscriptions with Meteor.publish(), but\n" + "** you still have autopublish turned on. Because autopublish is still\n" + "** on, your Meteor.publish() calls won't have much effect. All data\n" + "** will still be sent to all clients.\n" + "**\n" + "** Turn off autopublish by removing the autopublish package:\n" + "**\n" + "**   $ meteor remove autopublish\n" + "**\n" + "** .. and make sure you have Meteor.publish() and Meteor.subscribe() calls\n" + "** for each collection that you want clients to see.\n");
          }                                                                                                          // 1509
        }                                                                                                            // 1510
                                                                                                                     //
        if (name) self.publish_handlers[name] = handler;else {                                                       // 1512
          self.universal_publish_handlers.push(handler);                                                             // 1515
          // Spin up the new publisher on any existing session too. Run each                                         // 1516
          // session's subscription in a new Fiber, so that there's no change for                                    // 1517
          // self.sessions to change while we're running this loop.                                                  // 1518
          _.each(self.sessions, function (session) {                                                                 // 1519
            if (!session._dontStartNewUniversalSubs) {                                                               // 1520
              Fiber(function () {                                                                                    // 1521
                session._startSubscription(handler);                                                                 // 1522
              }).run();                                                                                              // 1523
            }                                                                                                        // 1524
          });                                                                                                        // 1525
        }                                                                                                            // 1526
      } else {                                                                                                       // 1527
        _.each(name, function (value, key) {                                                                         // 1529
          self.publish(key, value, {});                                                                              // 1530
        });                                                                                                          // 1531
      }                                                                                                              // 1532
    }                                                                                                                // 1533
                                                                                                                     //
    return publish;                                                                                                  // 1476
  }(),                                                                                                               // 1476
                                                                                                                     //
  _removeSession: function () {                                                                                      // 1535
    function _removeSession(session) {                                                                               // 1535
      var self = this;                                                                                               // 1536
      if (self.sessions[session.id]) {                                                                               // 1537
        delete self.sessions[session.id];                                                                            // 1538
      }                                                                                                              // 1539
    }                                                                                                                // 1540
                                                                                                                     //
    return _removeSession;                                                                                           // 1535
  }(),                                                                                                               // 1535
                                                                                                                     //
  /**                                                                                                                // 1542
   * @summary Defines functions that can be invoked over the network by clients.                                     //
   * @locus Anywhere                                                                                                 //
   * @param {Object} methods Dictionary whose keys are method names and values are functions.                        //
   * @memberOf Meteor                                                                                                //
   * @importFromPackage meteor                                                                                       //
   */                                                                                                                //
  methods: function () {                                                                                             // 1549
    function methods(_methods) {                                                                                     // 1549
      var self = this;                                                                                               // 1550
      _.each(_methods, function (func, name) {                                                                       // 1551
        if (typeof func !== 'function') throw new Error("Method '" + name + "' must be a function");                 // 1552
        if (self.method_handlers[name]) throw new Error("A method named '" + name + "' is already defined");         // 1554
        self.method_handlers[name] = func;                                                                           // 1556
      });                                                                                                            // 1557
    }                                                                                                                // 1558
                                                                                                                     //
    return methods;                                                                                                  // 1549
  }(),                                                                                                               // 1549
                                                                                                                     //
  call: function () {                                                                                                // 1560
    function call(name /*, arguments */) {                                                                           // 1560
      // if it's a function, the last argument is the result callback,                                               // 1561
      // not a parameter to the remote method.                                                                       // 1562
      var args = Array.prototype.slice.call(arguments, 1);                                                           // 1563
      if (args.length && typeof args[args.length - 1] === "function") var callback = args.pop();                     // 1564
      return this.apply(name, args, callback);                                                                       // 1566
    }                                                                                                                // 1567
                                                                                                                     //
    return call;                                                                                                     // 1560
  }(),                                                                                                               // 1560
                                                                                                                     //
  // @param options {Optional Object}                                                                                // 1569
  // @param callback {Optional Function}                                                                             // 1570
  apply: function () {                                                                                               // 1571
    function apply(name, args, options, callback) {                                                                  // 1571
      var self = this;                                                                                               // 1572
                                                                                                                     //
      // We were passed 3 arguments. They may be either (name, args, options)                                        // 1574
      // or (name, args, callback)                                                                                   // 1575
      if (!callback && typeof options === 'function') {                                                              // 1576
        callback = options;                                                                                          // 1577
        options = {};                                                                                                // 1578
      }                                                                                                              // 1579
      options = options || {};                                                                                       // 1580
                                                                                                                     //
      if (callback)                                                                                                  // 1582
        // It's not really necessary to do this, since we immediately                                                // 1583
        // run the callback in this fiber before returning, but we do it                                             // 1584
        // anyway for regularity.                                                                                    // 1585
        // XXX improve error message (and how we report it)                                                          // 1586
        callback = Meteor.bindEnvironment(callback, "delivering result of invoking '" + name + "'");                 // 1587
                                                                                                                     //
      // Run the handler                                                                                             // 1592
      var handler = self.method_handlers[name];                                                                      // 1593
      var exception;                                                                                                 // 1594
      if (!handler) {                                                                                                // 1595
        exception = new Meteor.Error(404, "Method '" + name + "' not found");                                        // 1596
      } else {                                                                                                       // 1597
        // If this is a method call from within another method, get the                                              // 1598
        // user state from the outer method, otherwise don't allow                                                   // 1599
        // setUserId to be called                                                                                    // 1600
        var userId = null;                                                                                           // 1601
        var setUserId = function () {                                                                                // 1602
          function setUserId() {                                                                                     // 1602
            throw new Error("Can't call setUserId on a server initiated method call");                               // 1603
          }                                                                                                          // 1604
                                                                                                                     //
          return setUserId;                                                                                          // 1602
        }();                                                                                                         // 1602
        var connection = null;                                                                                       // 1605
        var currentInvocation = DDP._CurrentInvocation.get();                                                        // 1606
        if (currentInvocation) {                                                                                     // 1607
          userId = currentInvocation.userId;                                                                         // 1608
          setUserId = function () {                                                                                  // 1609
            function setUserId(userId) {                                                                             // 1609
              currentInvocation.setUserId(userId);                                                                   // 1610
            }                                                                                                        // 1611
                                                                                                                     //
            return setUserId;                                                                                        // 1609
          }();                                                                                                       // 1609
          connection = currentInvocation.connection;                                                                 // 1612
        }                                                                                                            // 1613
                                                                                                                     //
        var invocation = new DDPCommon.MethodInvocation({                                                            // 1615
          isSimulation: false,                                                                                       // 1616
          userId: userId,                                                                                            // 1617
          setUserId: setUserId,                                                                                      // 1618
          connection: connection,                                                                                    // 1619
          randomSeed: DDPCommon.makeRpcSeed(currentInvocation, name)                                                 // 1620
        });                                                                                                          // 1615
        try {                                                                                                        // 1622
          var result = DDP._CurrentInvocation.withValue(invocation, function () {                                    // 1623
            return maybeAuditArgumentChecks(handler, invocation, EJSON.clone(args), "internal call to '" + name + "'");
          });                                                                                                        // 1627
          result = EJSON.clone(result);                                                                              // 1628
        } catch (e) {                                                                                                // 1629
          exception = e;                                                                                             // 1630
        }                                                                                                            // 1631
      }                                                                                                              // 1632
                                                                                                                     //
      // Return the result in whichever way the caller asked for it. Note that we                                    // 1634
      // do NOT block on the write fence in an analogous way to how the client                                       // 1635
      // blocks on the relevant data being visible, so you are NOT guaranteed that                                   // 1636
      // cursor observe callbacks have fired when your callback is invoked. (We                                      // 1637
      // can change this if there's a real use case.)                                                                // 1638
      if (callback) {                                                                                                // 1639
        callback(exception, result);                                                                                 // 1640
        return undefined;                                                                                            // 1641
      }                                                                                                              // 1642
      if (exception) throw exception;                                                                                // 1643
      return result;                                                                                                 // 1645
    }                                                                                                                // 1646
                                                                                                                     //
    return apply;                                                                                                    // 1571
  }(),                                                                                                               // 1571
                                                                                                                     //
  _urlForSession: function () {                                                                                      // 1648
    function _urlForSession(sessionId) {                                                                             // 1648
      var self = this;                                                                                               // 1649
      var session = self.sessions[sessionId];                                                                        // 1650
      if (session) return session._socketUrl;else return null;                                                       // 1651
    }                                                                                                                // 1655
                                                                                                                     //
    return _urlForSession;                                                                                           // 1648
  }()                                                                                                                // 1648
});                                                                                                                  // 1392
                                                                                                                     //
var calculateVersion = function calculateVersion(clientSupportedVersions, serverSupportedVersions) {                 // 1658
  var correctVersion = _.find(clientSupportedVersions, function (version) {                                          // 1660
    return _.contains(serverSupportedVersions, version);                                                             // 1661
  });                                                                                                                // 1662
  if (!correctVersion) {                                                                                             // 1663
    correctVersion = serverSupportedVersions[0];                                                                     // 1664
  }                                                                                                                  // 1665
  return correctVersion;                                                                                             // 1666
};                                                                                                                   // 1667
                                                                                                                     //
DDPServer._calculateVersion = calculateVersion;                                                                      // 1669
                                                                                                                     //
// "blind" exceptions other than those that were deliberately thrown to signal                                       // 1672
// errors to the client                                                                                              // 1673
var wrapInternalException = function wrapInternalException(exception, context) {                                     // 1674
  if (!exception || exception instanceof Meteor.Error) return exception;                                             // 1675
                                                                                                                     //
  // tests can set the 'expected' flag on an exception so it won't go to the                                         // 1678
  // server log                                                                                                      // 1679
  if (!exception.expected) {                                                                                         // 1680
    Meteor._debug("Exception " + context, exception.stack);                                                          // 1681
    if (exception.sanitizedError) {                                                                                  // 1682
      Meteor._debug("Sanitized and reported to the client as:", exception.sanitizedError.message);                   // 1683
      Meteor._debug();                                                                                               // 1684
    }                                                                                                                // 1685
  }                                                                                                                  // 1686
                                                                                                                     //
  // Did the error contain more details that could have been useful if caught in                                     // 1688
  // server code (or if thrown from non-client-originated code), but also                                            // 1689
  // provided a "sanitized" version with more context than 500 Internal server                                       // 1690
  // error? Use that.                                                                                                // 1691
  if (exception.sanitizedError) {                                                                                    // 1692
    if (exception.sanitizedError instanceof Meteor.Error) return exception.sanitizedError;                           // 1693
    Meteor._debug("Exception " + context + " provides a sanitizedError that " + "is not a Meteor.Error; ignoring");  // 1695
  }                                                                                                                  // 1697
                                                                                                                     //
  return new Meteor.Error(500, "Internal server error");                                                             // 1699
};                                                                                                                   // 1700
                                                                                                                     //
// Audit argument checks, if the audit-argument-checks package exists (it is a                                       // 1703
// weak dependency of this package).                                                                                 // 1704
var maybeAuditArgumentChecks = function maybeAuditArgumentChecks(f, context, args, description) {                    // 1705
  args = args || [];                                                                                                 // 1706
  if (Package['audit-argument-checks']) {                                                                            // 1707
    return Match._failIfArgumentsAreNotAllChecked(f, context, args, description);                                    // 1708
  }                                                                                                                  // 1710
  return f.apply(context, args);                                                                                     // 1711
};                                                                                                                   // 1712
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"writefence.js":function(require){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/ddp-server/writefence.js                                                                                 //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
var path = Npm.require('path');                                                                                      // 1
var Future = Npm.require(path.join('fibers', 'future'));                                                             // 2
                                                                                                                     //
// A write fence collects a group of writes, and provides a callback                                                 // 4
// when all of the writes are fully committed and propagated (all                                                    // 5
// observers have been notified of the write and acknowledged it.)                                                   // 6
//                                                                                                                   // 7
DDPServer._WriteFence = function () {                                                                                // 8
  var self = this;                                                                                                   // 9
                                                                                                                     //
  self.armed = false;                                                                                                // 11
  self.fired = false;                                                                                                // 12
  self.retired = false;                                                                                              // 13
  self.outstanding_writes = 0;                                                                                       // 14
  self.before_fire_callbacks = [];                                                                                   // 15
  self.completion_callbacks = [];                                                                                    // 16
};                                                                                                                   // 17
                                                                                                                     //
// The current write fence. When there is a current write fence, code                                                // 19
// that writes to databases should register their writes with it using                                               // 20
// beginWrite().                                                                                                     // 21
//                                                                                                                   // 22
DDPServer._CurrentWriteFence = new Meteor.EnvironmentVariable();                                                     // 23
                                                                                                                     //
_.extend(DDPServer._WriteFence.prototype, {                                                                          // 25
  // Start tracking a write, and return an object to represent it. The                                               // 26
  // object has a single method, committed(). This method should be                                                  // 27
  // called when the write is fully committed and propagated. You can                                                // 28
  // continue to add writes to the WriteFence up until it is triggered                                               // 29
  // (calls its callbacks because all writes have committed.)                                                        // 30
  beginWrite: function () {                                                                                          // 31
    function beginWrite() {                                                                                          // 31
      var self = this;                                                                                               // 32
                                                                                                                     //
      if (self.retired) return { committed: function () {                                                            // 34
          function committed() {}                                                                                    // 35
                                                                                                                     //
          return committed;                                                                                          // 35
        }() };                                                                                                       // 35
                                                                                                                     //
      if (self.fired) throw new Error("fence has already activated -- too late to add writes");                      // 37
                                                                                                                     //
      self.outstanding_writes++;                                                                                     // 40
      var _committed = false;                                                                                        // 41
      return {                                                                                                       // 42
        committed: function () {                                                                                     // 43
          function committed() {                                                                                     // 43
            if (_committed) throw new Error("committed called twice on the same write");                             // 44
            _committed = true;                                                                                       // 46
            self.outstanding_writes--;                                                                               // 47
            self._maybeFire();                                                                                       // 48
          }                                                                                                          // 49
                                                                                                                     //
          return committed;                                                                                          // 43
        }()                                                                                                          // 43
      };                                                                                                             // 42
    }                                                                                                                // 51
                                                                                                                     //
    return beginWrite;                                                                                               // 31
  }(),                                                                                                               // 31
                                                                                                                     //
  // Arm the fence. Once the fence is armed, and there are no more                                                   // 53
  // uncommitted writes, it will activate.                                                                           // 54
  arm: function () {                                                                                                 // 55
    function arm() {                                                                                                 // 55
      var self = this;                                                                                               // 56
      if (self === DDPServer._CurrentWriteFence.get()) throw Error("Can't arm the current fence");                   // 57
      self.armed = true;                                                                                             // 59
      self._maybeFire();                                                                                             // 60
    }                                                                                                                // 61
                                                                                                                     //
    return arm;                                                                                                      // 55
  }(),                                                                                                               // 55
                                                                                                                     //
  // Register a function to be called once before firing the fence.                                                  // 63
  // Callback function can add new writes to the fence, in which case                                                // 64
  // it won't fire until those writes are done as well.                                                              // 65
  onBeforeFire: function () {                                                                                        // 66
    function onBeforeFire(func) {                                                                                    // 66
      var self = this;                                                                                               // 67
      if (self.fired) throw new Error("fence has already activated -- too late to " + "add a callback");             // 68
      self.before_fire_callbacks.push(func);                                                                         // 71
    }                                                                                                                // 72
                                                                                                                     //
    return onBeforeFire;                                                                                             // 66
  }(),                                                                                                               // 66
                                                                                                                     //
  // Register a function to be called when the fence fires.                                                          // 74
  onAllCommitted: function () {                                                                                      // 75
    function onAllCommitted(func) {                                                                                  // 75
      var self = this;                                                                                               // 76
      if (self.fired) throw new Error("fence has already activated -- too late to " + "add a callback");             // 77
      self.completion_callbacks.push(func);                                                                          // 80
    }                                                                                                                // 81
                                                                                                                     //
    return onAllCommitted;                                                                                           // 75
  }(),                                                                                                               // 75
                                                                                                                     //
  // Convenience function. Arms the fence, then blocks until it fires.                                               // 83
  armAndWait: function () {                                                                                          // 84
    function armAndWait() {                                                                                          // 84
      var self = this;                                                                                               // 85
      var future = new Future();                                                                                     // 86
      self.onAllCommitted(function () {                                                                              // 87
        future['return']();                                                                                          // 88
      });                                                                                                            // 89
      self.arm();                                                                                                    // 90
      future.wait();                                                                                                 // 91
    }                                                                                                                // 92
                                                                                                                     //
    return armAndWait;                                                                                               // 84
  }(),                                                                                                               // 84
                                                                                                                     //
  _maybeFire: function () {                                                                                          // 94
    function _maybeFire() {                                                                                          // 94
      var self = this;                                                                                               // 95
      if (self.fired) throw new Error("write fence already activated?");                                             // 96
      if (self.armed && !self.outstanding_writes) {                                                                  // 98
        var invokeCallback = function () {                                                                           // 98
          function invokeCallback(func) {                                                                            // 99
            try {                                                                                                    // 100
              func(self);                                                                                            // 101
            } catch (err) {                                                                                          // 102
              Meteor._debug("exception in write fence callback:", err);                                              // 103
            }                                                                                                        // 104
          }                                                                                                          // 105
                                                                                                                     //
          return invokeCallback;                                                                                     // 98
        }();                                                                                                         // 98
                                                                                                                     //
        self.outstanding_writes++;                                                                                   // 107
        while (self.before_fire_callbacks.length > 0) {                                                              // 108
          var callbacks = self.before_fire_callbacks;                                                                // 109
          self.before_fire_callbacks = [];                                                                           // 110
          _.each(callbacks, invokeCallback);                                                                         // 111
        }                                                                                                            // 112
        self.outstanding_writes--;                                                                                   // 113
                                                                                                                     //
        if (!self.outstanding_writes) {                                                                              // 115
          self.fired = true;                                                                                         // 116
          var callbacks = self.completion_callbacks;                                                                 // 117
          self.completion_callbacks = [];                                                                            // 118
          _.each(callbacks, invokeCallback);                                                                         // 119
        }                                                                                                            // 120
      }                                                                                                              // 121
    }                                                                                                                // 122
                                                                                                                     //
    return _maybeFire;                                                                                               // 94
  }(),                                                                                                               // 94
                                                                                                                     //
  // Deactivate this fence so that adding more writes has no effect.                                                 // 124
  // The fence must have already fired.                                                                              // 125
  retire: function () {                                                                                              // 126
    function retire() {                                                                                              // 126
      var self = this;                                                                                               // 127
      if (!self.fired) throw new Error("Can't retire a fence that hasn't fired.");                                   // 128
      self.retired = true;                                                                                           // 130
    }                                                                                                                // 131
                                                                                                                     //
    return retire;                                                                                                   // 126
  }()                                                                                                                // 126
});                                                                                                                  // 25
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"crossbar.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/ddp-server/crossbar.js                                                                                   //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
// A "crossbar" is a class that provides structured notification registration.                                       // 1
// See _match for the definition of how a notification matches a trigger.                                            // 2
// All notifications and triggers must have a string key named 'collection'.                                         // 3
                                                                                                                     //
DDPServer._Crossbar = function (options) {                                                                           // 5
  var self = this;                                                                                                   // 6
  options = options || {};                                                                                           // 7
                                                                                                                     //
  self.nextId = 1;                                                                                                   // 9
  // map from collection name (string) -> listener id -> object. each object has                                     // 10
  // keys 'trigger', 'callback'.  As a hack, the empty string means "no                                              // 11
  // collection".                                                                                                    // 12
  self.listenersByCollection = {};                                                                                   // 13
  self.factPackage = options.factPackage || "livedata";                                                              // 14
  self.factName = options.factName || null;                                                                          // 15
};                                                                                                                   // 16
                                                                                                                     //
_.extend(DDPServer._Crossbar.prototype, {                                                                            // 18
  // msg is a trigger or a notification                                                                              // 19
  _collectionForMessage: function () {                                                                               // 20
    function _collectionForMessage(msg) {                                                                            // 20
      var self = this;                                                                                               // 21
      if (!_.has(msg, 'collection')) {                                                                               // 22
        return '';                                                                                                   // 23
      } else if (typeof msg.collection === 'string') {                                                               // 24
        if (msg.collection === '') throw Error("Message has empty collection!");                                     // 25
        return msg.collection;                                                                                       // 27
      } else {                                                                                                       // 28
        throw Error("Message has non-string collection!");                                                           // 29
      }                                                                                                              // 30
    }                                                                                                                // 31
                                                                                                                     //
    return _collectionForMessage;                                                                                    // 20
  }(),                                                                                                               // 20
                                                                                                                     //
  // Listen for notification that match 'trigger'. A notification                                                    // 33
  // matches if it has the key-value pairs in trigger as a                                                           // 34
  // subset. When a notification matches, call 'callback', passing                                                   // 35
  // the actual notification.                                                                                        // 36
  //                                                                                                                 // 37
  // Returns a listen handle, which is an object with a method                                                       // 38
  // stop(). Call stop() to stop listening.                                                                          // 39
  //                                                                                                                 // 40
  // XXX It should be legal to call fire() from inside a listen()                                                    // 41
  // callback?                                                                                                       // 42
  listen: function () {                                                                                              // 43
    function listen(trigger, callback) {                                                                             // 43
      var self = this;                                                                                               // 44
      var id = self.nextId++;                                                                                        // 45
                                                                                                                     //
      var collection = self._collectionForMessage(trigger);                                                          // 47
      var record = { trigger: EJSON.clone(trigger), callback: callback };                                            // 48
      if (!_.has(self.listenersByCollection, collection)) {                                                          // 49
        self.listenersByCollection[collection] = {};                                                                 // 50
      }                                                                                                              // 51
      self.listenersByCollection[collection][id] = record;                                                           // 52
                                                                                                                     //
      if (self.factName && Package.facts) {                                                                          // 54
        Package.facts.Facts.incrementServerFact(self.factPackage, self.factName, 1);                                 // 55
      }                                                                                                              // 57
                                                                                                                     //
      return {                                                                                                       // 59
        stop: function () {                                                                                          // 60
          function stop() {                                                                                          // 60
            if (self.factName && Package.facts) {                                                                    // 61
              Package.facts.Facts.incrementServerFact(self.factPackage, self.factName, -1);                          // 62
            }                                                                                                        // 64
            delete self.listenersByCollection[collection][id];                                                       // 65
            if (_.isEmpty(self.listenersByCollection[collection])) {                                                 // 66
              delete self.listenersByCollection[collection];                                                         // 67
            }                                                                                                        // 68
          }                                                                                                          // 69
                                                                                                                     //
          return stop;                                                                                               // 60
        }()                                                                                                          // 60
      };                                                                                                             // 59
    }                                                                                                                // 71
                                                                                                                     //
    return listen;                                                                                                   // 43
  }(),                                                                                                               // 43
                                                                                                                     //
  // Fire the provided 'notification' (an object whose attribute                                                     // 73
  // values are all JSON-compatibile) -- inform all matching listeners                                               // 74
  // (registered with listen()).                                                                                     // 75
  //                                                                                                                 // 76
  // If fire() is called inside a write fence, then each of the                                                      // 77
  // listener callbacks will be called inside the write fence as well.                                               // 78
  //                                                                                                                 // 79
  // The listeners may be invoked in parallel, rather than serially.                                                 // 80
  fire: function () {                                                                                                // 81
    function fire(notification) {                                                                                    // 81
      var self = this;                                                                                               // 82
                                                                                                                     //
      var collection = self._collectionForMessage(notification);                                                     // 84
                                                                                                                     //
      if (!_.has(self.listenersByCollection, collection)) {                                                          // 86
        return;                                                                                                      // 87
      }                                                                                                              // 88
                                                                                                                     //
      var listenersForCollection = self.listenersByCollection[collection];                                           // 90
      var callbackIds = [];                                                                                          // 91
      _.each(listenersForCollection, function (l, id) {                                                              // 92
        if (self._matches(notification, l.trigger)) {                                                                // 93
          callbackIds.push(id);                                                                                      // 94
        }                                                                                                            // 95
      });                                                                                                            // 96
                                                                                                                     //
      // Listener callbacks can yield, so we need to first find all the ones that                                    // 98
      // match in a single iteration over self.listenersByCollection (which can't                                    // 99
      // be mutated during this iteration), and then invoke the matching                                             // 100
      // callbacks, checking before each call to ensure they haven't stopped.                                        // 101
      // Note that we don't have to check that                                                                       // 102
      // self.listenersByCollection[collection] still === listenersForCollection,                                    // 103
      // because the only way that stops being true is if listenersForCollection                                     // 104
      // first gets reduced down to the empty object (and then never gets                                            // 105
      // increased again).                                                                                           // 106
      _.each(callbackIds, function (id) {                                                                            // 107
        if (_.has(listenersForCollection, id)) {                                                                     // 108
          listenersForCollection[id].callback(notification);                                                         // 109
        }                                                                                                            // 110
      });                                                                                                            // 111
    }                                                                                                                // 112
                                                                                                                     //
    return fire;                                                                                                     // 81
  }(),                                                                                                               // 81
                                                                                                                     //
  // A notification matches a trigger if all keys that exist in both are equal.                                      // 114
  //                                                                                                                 // 115
  // Examples:                                                                                                       // 116
  //  N:{collection: "C"} matches T:{collection: "C"}                                                                // 117
  //    (a non-targeted write to a collection matches a                                                              // 118
  //     non-targeted query)                                                                                         // 119
  //  N:{collection: "C", id: "X"} matches T:{collection: "C"}                                                       // 120
  //    (a targeted write to a collection matches a non-targeted query)                                              // 121
  //  N:{collection: "C"} matches T:{collection: "C", id: "X"}                                                       // 122
  //    (a non-targeted write to a collection matches a                                                              // 123
  //     targeted query)                                                                                             // 124
  //  N:{collection: "C", id: "X"} matches T:{collection: "C", id: "X"}                                              // 125
  //    (a targeted write to a collection matches a targeted query targeted                                          // 126
  //     at the same document)                                                                                       // 127
  //  N:{collection: "C", id: "X"} does not match T:{collection: "C", id: "Y"}                                       // 128
  //    (a targeted write to a collection does not match a targeted query                                            // 129
  //     targeted at a different document)                                                                           // 130
  _matches: function () {                                                                                            // 131
    function _matches(notification, trigger) {                                                                       // 131
      // Most notifications that use the crossbar have a string `collection` and                                     // 132
      // maybe an `id` that is a string or ObjectID. We're already dividing up                                       // 133
      // triggers by collection, but let's fast-track "nope, different ID" (and                                      // 134
      // avoid the overly generic EJSON.equals). This makes a noticeable                                             // 135
      // performance difference; see https://github.com/meteor/meteor/pull/3697                                      // 136
      if (typeof notification.id === 'string' && typeof trigger.id === 'string' && notification.id !== trigger.id) {
        return false;                                                                                                // 140
      }                                                                                                              // 141
      if (notification.id instanceof MongoID.ObjectID && trigger.id instanceof MongoID.ObjectID && !notification.id.equals(trigger.id)) {
        return false;                                                                                                // 145
      }                                                                                                              // 146
                                                                                                                     //
      return _.all(trigger, function (triggerValue, key) {                                                           // 148
        return !_.has(notification, key) || EJSON.equals(triggerValue, notification[key]);                           // 149
      });                                                                                                            // 151
    }                                                                                                                // 152
                                                                                                                     //
    return _matches;                                                                                                 // 131
  }()                                                                                                                // 131
});                                                                                                                  // 18
                                                                                                                     //
// The "invalidation crossbar" is a specific instance used by the DDP server to                                      // 155
// implement write fence notifications. Listener callbacks on this crossbar                                          // 156
// should call beginWrite on the current write fence before they return, if they                                     // 157
// want to delay the write fence from firing (ie, the DDP method-data-updated                                        // 158
// message from being sent).                                                                                         // 159
DDPServer._InvalidationCrossbar = new DDPServer._Crossbar({                                                          // 160
  factName: "invalidation-crossbar-listeners"                                                                        // 161
});                                                                                                                  // 160
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"server_convenience.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/ddp-server/server_convenience.js                                                                         //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
if (process.env.DDP_DEFAULT_CONNECTION_URL) {                                                                        // 1
  __meteor_runtime_config__.DDP_DEFAULT_CONNECTION_URL = process.env.DDP_DEFAULT_CONNECTION_URL;                     // 2
}                                                                                                                    // 4
                                                                                                                     //
Meteor.server = new Server();                                                                                        // 6
                                                                                                                     //
Meteor.refresh = function (notification) {                                                                           // 8
  DDPServer._InvalidationCrossbar.fire(notification);                                                                // 9
};                                                                                                                   // 10
                                                                                                                     //
// Proxy the public methods of Meteor.server so they can                                                             // 12
// be called directly on Meteor.                                                                                     // 13
_.each(['publish', 'methods', 'call', 'apply', 'onConnection'], function (name) {                                    // 14
  Meteor[name] = _.bind(Meteor.server[name], Meteor.server);                                                         // 16
});                                                                                                                  // 17
                                                                                                                     //
// Meteor.server used to be called Meteor.default_server. Provide                                                    // 19
// backcompat as a courtesy even though it was never documented.                                                     // 20
// XXX COMPAT WITH 0.6.4                                                                                             // 21
Meteor.default_server = Meteor.server;                                                                               // 22
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{"extensions":[".js",".json"]});
require("./node_modules/meteor/ddp-server/stream_server.js");
require("./node_modules/meteor/ddp-server/livedata_server.js");
require("./node_modules/meteor/ddp-server/writefence.js");
require("./node_modules/meteor/ddp-server/crossbar.js");
require("./node_modules/meteor/ddp-server/server_convenience.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['ddp-server'] = {}, {
  DDPServer: DDPServer
});

})();

//# sourceMappingURL=ddp-server.js.map
