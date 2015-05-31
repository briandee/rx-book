(function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var a = typeof require == "function" && require;
        if (!u && a)return a(o, !0);
        if (i)return i(o, !0);
        var f = new Error("Cannot find module '" + o + "'");
        throw f.code = "MODULE_NOT_FOUND", f
      }
      var l = n[o] = {exports: {}};
      t[o][0].call(l.exports, function (e) {
        var n = t[o][1][e];
        return s(n ? n : e)
      }, l, l.exports, e, t, n, r)
    }
    return n[o].exports
  }

  var i = typeof require == "function" && require;
  for (var o = 0; o < r.length; o++)s(r[o]);
  return s
})({
  1: [function (require, module, exports) {
    "use strict";
    var _interopRequire = function (obj) {
      return obj && obj.__esModule ? obj["default"] : obj
    };
    var Cycle = _interopRequire(require("cyclejs"));
    var DiagramComponent = _interopRequire(require("rxmarbles/components/diagram/diagram"));
    var SandboxComponent = _interopRequire(require("rxmarbles/components/sandbox/sandbox"));
    var MarbleComponent = _interopRequire(require("rxmarbles/components/marble"));
    var DiagramCompletionComponent = _interopRequire(require("rxmarbles/components/diagram-completion"));
    var h = Cycle.h;
    var SandboxPrototype = Object.create(HTMLElement.prototype);
    SandboxPrototype.createdCallback = function createdCallback() {
      var key = this.attributes.key.value;
      Cycle.registerCustomElement("x-marble", MarbleComponent);
      Cycle.registerCustomElement("x-diagram-completion", DiagramCompletionComponent);
      Cycle.registerCustomElement("x-diagram", DiagramComponent);
      Cycle.registerCustomElement("x-sandbox", SandboxComponent);
      var User = Cycle.createDOMUser(this);
      var View = Cycle.createView(function () {
        return {vtree$: Cycle.Rx.Observable.just(h("x-sandbox", {route: key}))}
      });
      User.inject(View)
    };
    var XRxMarbles = document.registerElement("rx-marbles", {prototype: SandboxPrototype})
  }, {
    cyclejs: 51,
    "rxmarbles/components/diagram-completion": 61,
    "rxmarbles/components/diagram/diagram": 65,
    "rxmarbles/components/marble": 66,
    "rxmarbles/components/sandbox/sandbox": 69
  }],
  2: [function (require, module, exports) {
  }, {}],
  3: [function (require, module, exports) {
    function EventEmitter() {
      this._events = this._events || {};
      this._maxListeners = this._maxListeners || undefined
    }

    module.exports = EventEmitter;
    EventEmitter.EventEmitter = EventEmitter;
    EventEmitter.prototype._events = undefined;
    EventEmitter.prototype._maxListeners = undefined;
    EventEmitter.defaultMaxListeners = 10;
    EventEmitter.prototype.setMaxListeners = function (n) {
      if (!isNumber(n) || n < 0 || isNaN(n))throw TypeError("n must be a positive number");
      this._maxListeners = n;
      return this
    };
    EventEmitter.prototype.emit = function (type) {
      var er, handler, len, args, i, listeners;
      if (!this._events)this._events = {};
      if (type === "error") {
        if (!this._events.error || isObject(this._events.error) && !this._events.error.length) {
          er = arguments[1];
          if (er instanceof Error) {
            throw er
          }
          throw TypeError('Uncaught, unspecified "error" event.')
        }
      }
      handler = this._events[type];
      if (isUndefined(handler))return false;
      if (isFunction(handler)) {
        switch (arguments.length) {
          case 1:
            handler.call(this);
            break;
          case 2:
            handler.call(this, arguments[1]);
            break;
          case 3:
            handler.call(this, arguments[1], arguments[2]);
            break;
          default:
            len = arguments.length;
            args = new Array(len - 1);
            for (i = 1; i < len; i++)args[i - 1] = arguments[i];
            handler.apply(this, args)
        }
      } else if (isObject(handler)) {
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)args[i - 1] = arguments[i];
        listeners = handler.slice();
        len = listeners.length;
        for (i = 0; i < len; i++)listeners[i].apply(this, args)
      }
      return true
    };
    EventEmitter.prototype.addListener = function (type, listener) {
      var m;
      if (!isFunction(listener))throw TypeError("listener must be a function");
      if (!this._events)this._events = {};
      if (this._events.newListener)this.emit("newListener", type, isFunction(listener.listener) ? listener.listener : listener);
      if (!this._events[type])this._events[type] = listener; else if (isObject(this._events[type]))this._events[type].push(listener); else this._events[type] = [this._events[type], listener];
      if (isObject(this._events[type]) && !this._events[type].warned) {
        var m;
        if (!isUndefined(this._maxListeners)) {
          m = this._maxListeners
        } else {
          m = EventEmitter.defaultMaxListeners
        }
        if (m && m > 0 && this._events[type].length > m) {
          this._events[type].warned = true;
          console.error("(node) warning: possible EventEmitter memory " + "leak detected. %d listeners added. " + "Use emitter.setMaxListeners() to increase limit.", this._events[type].length);
          if (typeof console.trace === "function") {
            console.trace()
          }
        }
      }
      return this
    };
    EventEmitter.prototype.on = EventEmitter.prototype.addListener;
    EventEmitter.prototype.once = function (type, listener) {
      if (!isFunction(listener))throw TypeError("listener must be a function");
      var fired = false;

      function g() {
        this.removeListener(type, g);
        if (!fired) {
          fired = true;
          listener.apply(this, arguments)
        }
      }

      g.listener = listener;
      this.on(type, g);
      return this
    };
    EventEmitter.prototype.removeListener = function (type, listener) {
      var list, position, length, i;
      if (!isFunction(listener))throw TypeError("listener must be a function");
      if (!this._events || !this._events[type])return this;
      list = this._events[type];
      length = list.length;
      position = -1;
      if (list === listener || isFunction(list.listener) && list.listener === listener) {
        delete this._events[type];
        if (this._events.removeListener)this.emit("removeListener", type, listener)
      } else if (isObject(list)) {
        for (i = length; i-- > 0;) {
          if (list[i] === listener || list[i].listener && list[i].listener === listener) {
            position = i;
            break
          }
        }
        if (position < 0)return this;
        if (list.length === 1) {
          list.length = 0;
          delete this._events[type]
        } else {
          list.splice(position, 1)
        }
        if (this._events.removeListener)this.emit("removeListener", type, listener)
      }
      return this
    };
    EventEmitter.prototype.removeAllListeners = function (type) {
      var key, listeners;
      if (!this._events)return this;
      if (!this._events.removeListener) {
        if (arguments.length === 0)this._events = {}; else if (this._events[type])delete this._events[type];
        return this
      }
      if (arguments.length === 0) {
        for (key in this._events) {
          if (key === "removeListener")continue;
          this.removeAllListeners(key)
        }
        this.removeAllListeners("removeListener");
        this._events = {};
        return this
      }
      listeners = this._events[type];
      if (isFunction(listeners)) {
        this.removeListener(type, listeners)
      } else {
        while (listeners.length)this.removeListener(type, listeners[listeners.length - 1])
      }
      delete this._events[type];
      return this
    };
    EventEmitter.prototype.listeners = function (type) {
      var ret;
      if (!this._events || !this._events[type])ret = []; else if (isFunction(this._events[type]))ret = [this._events[type]]; else ret = this._events[type].slice();
      return ret
    };
    EventEmitter.listenerCount = function (emitter, type) {
      var ret;
      if (!emitter._events || !emitter._events[type])ret = 0; else if (isFunction(emitter._events[type]))ret = 1; else ret = emitter._events[type].length;
      return ret
    };
    function isFunction(arg) {
      return typeof arg === "function"
    }

    function isNumber(arg) {
      return typeof arg === "number"
    }

    function isObject(arg) {
      return typeof arg === "object" && arg !== null
    }

    function isUndefined(arg) {
      return arg === void 0
    }
  }, {}],
  4: [function (require, module, exports) {
    var process = module.exports = {};
    var queue = [];
    var draining = false;

    function drainQueue() {
      if (draining) {
        return
      }
      draining = true;
      var currentQueue;
      var len = queue.length;
      while (len) {
        currentQueue = queue;
        queue = [];
        var i = -1;
        while (++i < len) {
          currentQueue[i]()
        }
        len = queue.length
      }
      draining = false
    }

    process.nextTick = function (fun) {
      queue.push(fun);
      if (!draining) {
        setTimeout(drainQueue, 0)
      }
    };
    process.title = "browser";
    process.browser = true;
    process.env = {};
    process.argv = [];
    process.version = "";
    function noop() {
    }

    process.on = noop;
    process.addListener = noop;
    process.once = noop;
    process.off = noop;
    process.removeListener = noop;
    process.removeAllListeners = noop;
    process.emit = noop;
    process.binding = function (name) {
      throw new Error("process.binding is not supported")
    };
    process.cwd = function () {
      return "/"
    };
    process.chdir = function (dir) {
      throw new Error("process.chdir is not supported")
    };
    process.umask = function () {
      return 0
    }
  }, {}],
  5: [function (require, module, exports) {
    (function (process, global) {
      (function (undefined) {
        var objectTypes = {
          "boolean": false,
          "function": true,
          object: true,
          number: false,
          string: false,
          undefined: false
        };
        var root = objectTypes[typeof window] && window || this, freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports, freeModule = objectTypes[typeof module] && module && !module.nodeType && module, moduleExports = freeModule && freeModule.exports === freeExports && freeExports, freeGlobal = objectTypes[typeof global] && global;
        if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal)) {
          root = freeGlobal
        }
        var Rx = {internals: {}, config: {Promise: root.Promise}, helpers: {}};
        var noop = Rx.helpers.noop = function () {
        }, notDefined = Rx.helpers.notDefined = function (x) {
          return typeof x === "undefined"
        }, isScheduler = Rx.helpers.isScheduler = function (x) {
          return x instanceof Rx.Scheduler
        }, identity = Rx.helpers.identity = function (x) {
          return x
        }, pluck = Rx.helpers.pluck = function (property) {
          return function (x) {
            return x[property]
          }
        }, just = Rx.helpers.just = function (value) {
          return function () {
            return value
          }
        }, defaultNow = Rx.helpers.defaultNow = Date.now, defaultComparer = Rx.helpers.defaultComparer = function (x, y) {
          return isEqual(x, y)
        }, defaultSubComparer = Rx.helpers.defaultSubComparer = function (x, y) {
          return x > y ? 1 : x < y ? -1 : 0
        }, defaultKeySerializer = Rx.helpers.defaultKeySerializer = function (x) {
          return x.toString()
        }, defaultError = Rx.helpers.defaultError = function (err) {
          throw err
        }, isPromise = Rx.helpers.isPromise = function (p) {
          return !!p && typeof p.then === "function"
        }, asArray = Rx.helpers.asArray = function () {
          return Array.prototype.slice.call(arguments)
        }, not = Rx.helpers.not = function (a) {
          return !a
        }, isFunction = Rx.helpers.isFunction = function () {
          var isFn = function (value) {
            return typeof value == "function" || false
          };
          if (isFn(/x/)) {
            isFn = function (value) {
              return typeof value == "function" && toString.call(value) == "[object Function]"
            }
          }
          return isFn
        }();
        var sequenceContainsNoElements = "Sequence contains no elements.";
        var argumentOutOfRange = "Argument out of range";
        var objectDisposed = "Object has been disposed";

        function checkDisposed() {
          if (this.isDisposed) {
            throw new Error(objectDisposed)
          }
        }

        Rx.config.longStackSupport = false;
        var hasStacks = false;
        try {
          throw new Error
        } catch (e) {
          hasStacks = !!e.stack
        }
        var rStartingLine = captureLine(), rFileName;
        var STACK_JUMP_SEPARATOR = "From previous event:";

        function makeStackTraceLong(error, observable) {
          if (hasStacks && observable.stack && typeof error === "object" && error !== null && error.stack && error.stack.indexOf(STACK_JUMP_SEPARATOR) === -1) {
            var stacks = [];
            for (var o = observable; !!o; o = o.source) {
              if (o.stack) {
                stacks.unshift(o.stack)
              }
            }
            stacks.unshift(error.stack);
            var concatedStacks = stacks.join("\n" + STACK_JUMP_SEPARATOR + "\n");
            error.stack = filterStackString(concatedStacks)
          }
        }

        function filterStackString(stackString) {
          var lines = stackString.split("\n"), desiredLines = [];
          for (var i = 0, len = lines.length; i < len; i++) {
            var line = lines[i];
            if (!isInternalFrame(line) && !isNodeFrame(line) && line) {
              desiredLines.push(line)
            }
          }
          return desiredLines.join("\n")
        }

        function isInternalFrame(stackLine) {
          var fileNameAndLineNumber = getFileNameAndLineNumber(stackLine);
          if (!fileNameAndLineNumber) {
            return false
          }
          var fileName = fileNameAndLineNumber[0], lineNumber = fileNameAndLineNumber[1];
          return fileName === rFileName && lineNumber >= rStartingLine && lineNumber <= rEndingLine
        }

        function isNodeFrame(stackLine) {
          return stackLine.indexOf("(module.js:") !== -1 || stackLine.indexOf("(node.js:") !== -1
        }

        function captureLine() {
          if (!hasStacks) {
            return
          }
          try {
            throw new Error
          } catch (e) {
            var lines = e.stack.split("\n");
            var firstLine = lines[0].indexOf("@") > 0 ? lines[1] : lines[2];
            var fileNameAndLineNumber = getFileNameAndLineNumber(firstLine);
            if (!fileNameAndLineNumber) {
              return
            }
            rFileName = fileNameAndLineNumber[0];
            return fileNameAndLineNumber[1]
          }
        }

        function getFileNameAndLineNumber(stackLine) {
          var attempt1 = /at .+ \((.+):(\d+):(?:\d+)\)$/.exec(stackLine);
          if (attempt1) {
            return [attempt1[1], Number(attempt1[2])]
          }
          var attempt2 = /at ([^ ]+):(\d+):(?:\d+)$/.exec(stackLine);
          if (attempt2) {
            return [attempt2[1], Number(attempt2[2])]
          }
          var attempt3 = /.*@(.+):(\d+)$/.exec(stackLine);
          if (attempt3) {
            return [attempt3[1], Number(attempt3[2])]
          }
        }

        var $iterator$ = typeof Symbol === "function" && Symbol.iterator || "_es6shim_iterator_";
        if (root.Set && typeof(new root.Set)["@@iterator"] === "function") {
          $iterator$ = "@@iterator"
        }
        var doneEnumerator = Rx.doneEnumerator = {done: true, value: undefined};
        var isIterable = Rx.helpers.isIterable = function (o) {
          return o[$iterator$] !== undefined
        };
        var isArrayLike = Rx.helpers.isArrayLike = function (o) {
          return o && o.length !== undefined
        };
        Rx.helpers.iterator = $iterator$;
        var bindCallback = Rx.internals.bindCallback = function (func, thisArg, argCount) {
          if (typeof thisArg === "undefined") {
            return func
          }
          switch (argCount) {
            case 0:
              return function () {
                return func.call(thisArg)
              };
            case 1:
              return function (arg) {
                return func.call(thisArg, arg)
              };
            case 2:
              return function (value, index) {
                return func.call(thisArg, value, index)
              };
            case 3:
              return function (value, index, collection) {
                return func.call(thisArg, value, index, collection)
              }
          }
          return function () {
            return func.apply(thisArg, arguments)
          }
        };
        var dontEnums = ["toString", "toLocaleString", "valueOf", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "constructor"], dontEnumsLength = dontEnums.length;
        var argsClass = "[object Arguments]", arrayClass = "[object Array]", boolClass = "[object Boolean]", dateClass = "[object Date]", errorClass = "[object Error]", funcClass = "[object Function]", numberClass = "[object Number]", objectClass = "[object Object]", regexpClass = "[object RegExp]", stringClass = "[object String]";
        var toString = Object.prototype.toString, hasOwnProperty = Object.prototype.hasOwnProperty, supportsArgsClass = toString.call(arguments) == argsClass, supportNodeClass, errorProto = Error.prototype, objectProto = Object.prototype, stringProto = String.prototype, propertyIsEnumerable = objectProto.propertyIsEnumerable;
        try {
          supportNodeClass = !(toString.call(document) == objectClass && !({toString: 0} + ""))
        } catch (e) {
          supportNodeClass = true
        }
        var nonEnumProps = {};
        nonEnumProps[arrayClass] = nonEnumProps[dateClass] = nonEnumProps[numberClass] = {
          constructor: true,
          toLocaleString: true,
          toString: true,
          valueOf: true
        };
        nonEnumProps[boolClass] = nonEnumProps[stringClass] = {constructor: true, toString: true, valueOf: true};
        nonEnumProps[errorClass] = nonEnumProps[funcClass] = nonEnumProps[regexpClass] = {
          constructor: true,
          toString: true
        };
        nonEnumProps[objectClass] = {constructor: true};
        var support = {};
        (function () {
          var ctor = function () {
            this.x = 1
          }, props = [];
          ctor.prototype = {valueOf: 1, y: 1};
          for (var key in new ctor) {
            props.push(key)
          }
          for (key in arguments) {
          }
          support.enumErrorProps = propertyIsEnumerable.call(errorProto, "message") || propertyIsEnumerable.call(errorProto, "name");
          support.enumPrototypes = propertyIsEnumerable.call(ctor, "prototype");
          support.nonEnumArgs = key != 0;
          support.nonEnumShadows = !/valueOf/.test(props)
        })(1);
        var isObject = Rx.internals.isObject = function (value) {
          var type = typeof value;
          return value && (type == "function" || type == "object") || false
        };

        function keysIn(object) {
          var result = [];
          if (!isObject(object)) {
            return result
          }
          if (support.nonEnumArgs && object.length && isArguments(object)) {
            object = slice.call(object)
          }
          var skipProto = support.enumPrototypes && typeof object == "function", skipErrorProps = support.enumErrorProps && (object === errorProto || object instanceof Error);
          for (var key in object) {
            if (!(skipProto && key == "prototype") && !(skipErrorProps && (key == "message" || key == "name"))) {
              result.push(key)
            }
          }
          if (support.nonEnumShadows && object !== objectProto) {
            var ctor = object.constructor, index = -1, length = dontEnumsLength;
            if (object === (ctor && ctor.prototype)) {
              var className = object === stringProto ? stringClass : object === errorProto ? errorClass : toString.call(object), nonEnum = nonEnumProps[className]
            }
            while (++index < length) {
              key = dontEnums[index];
              if (!(nonEnum && nonEnum[key]) && hasOwnProperty.call(object, key)) {
                result.push(key)
              }
            }
          }
          return result
        }

        function internalFor(object, callback, keysFunc) {
          var index = -1, props = keysFunc(object), length = props.length;
          while (++index < length) {
            var key = props[index];
            if (callback(object[key], key, object) === false) {
              break
            }
          }
          return object
        }

        function internalForIn(object, callback) {
          return internalFor(object, callback, keysIn)
        }

        function isNode(value) {
          return typeof value.toString != "function" && typeof(value + "") == "string"
        }

        var isArguments = function (value) {
          return value && typeof value == "object" ? toString.call(value) == argsClass : false
        };
        if (!supportsArgsClass) {
          isArguments = function (value) {
            return value && typeof value == "object" ? hasOwnProperty.call(value, "callee") : false
          }
        }
        var isEqual = Rx.internals.isEqual = function (x, y) {
          return deepEquals(x, y, [], [])
        };

        function deepEquals(a, b, stackA, stackB) {
          if (a === b) {
            return a !== 0 || 1 / a == 1 / b
          }
          var type = typeof a, otherType = typeof b;
          if (a === a && (a == null || b == null || type != "function" && type != "object" && otherType != "function" && otherType != "object")) {
            return false
          }
          var className = toString.call(a), otherClass = toString.call(b);
          if (className == argsClass) {
            className = objectClass
          }
          if (otherClass == argsClass) {
            otherClass = objectClass
          }
          if (className != otherClass) {
            return false
          }
          switch (className) {
            case boolClass:
            case dateClass:
              return +a == +b;
            case numberClass:
              return a != +a ? b != +b : a == 0 ? 1 / a == 1 / b : a == +b;
            case regexpClass:
            case stringClass:
              return a == String(b)
          }
          var isArr = className == arrayClass;
          if (!isArr) {
            if (className != objectClass || !support.nodeClass && (isNode(a) || isNode(b))) {
              return false
            }
            var ctorA = !support.argsObject && isArguments(a) ? Object : a.constructor, ctorB = !support.argsObject && isArguments(b) ? Object : b.constructor;
            if (ctorA != ctorB && !(hasOwnProperty.call(a, "constructor") && hasOwnProperty.call(b, "constructor")) && !(isFunction(ctorA) && ctorA instanceof ctorA && isFunction(ctorB) && ctorB instanceof ctorB) && ("constructor"in a && "constructor"in b)) {
              return false
            }
          }
          var initedStack = !stackA;
          stackA || (stackA = []);
          stackB || (stackB = []);
          var length = stackA.length;
          while (length--) {
            if (stackA[length] == a) {
              return stackB[length] == b
            }
          }
          var size = 0;
          var result = true;
          stackA.push(a);
          stackB.push(b);
          if (isArr) {
            length = a.length;
            size = b.length;
            result = size == length;
            if (result) {
              while (size--) {
                var index = length, value = b[size];
                if (!(result = deepEquals(a[size], value, stackA, stackB))) {
                  break
                }
              }
            }
          } else {
            internalForIn(b, function (value, key, b) {
              if (hasOwnProperty.call(b, key)) {
                size++;
                return result = hasOwnProperty.call(a, key) && deepEquals(a[key], value, stackA, stackB)
              }
            });
            if (result) {
              internalForIn(a, function (value, key, a) {
                if (hasOwnProperty.call(a, key)) {
                  return result = --size > -1
                }
              })
            }
          }
          stackA.pop();
          stackB.pop();
          return result
        }

        var slice = Array.prototype.slice;

        function argsOrArray(args, idx) {
          return args.length === 1 && Array.isArray(args[idx]) ? args[idx] : slice.call(args)
        }

        var hasProp = {}.hasOwnProperty;
        var inherits = this.inherits = Rx.internals.inherits = function (child, parent) {
          function __() {
            this.constructor = child
          }

          __.prototype = parent.prototype;
          child.prototype = new __
        };
        var addProperties = Rx.internals.addProperties = function (obj) {
          var sources = slice.call(arguments, 1);
          for (var i = 0, len = sources.length; i < len; i++) {
            var source = sources[i];
            for (var prop in source) {
              obj[prop] = source[prop]
            }
          }
        };
        var addRef = Rx.internals.addRef = function (xs, r) {
          return new AnonymousObservable(function (observer) {
            return new CompositeDisposable(r.getDisposable(), xs.subscribe(observer))
          })
        };

        function arrayInitialize(count, factory) {
          var a = new Array(count);
          for (var i = 0; i < count; i++) {
            a[i] = factory()
          }
          return a
        }

        function IndexedItem(id, value) {
          this.id = id;
          this.value = value
        }

        IndexedItem.prototype.compareTo = function (other) {
          var c = this.value.compareTo(other.value);
          c === 0 && (c = this.id - other.id);
          return c
        };
        var PriorityQueue = Rx.internals.PriorityQueue = function (capacity) {
          this.items = new Array(capacity);
          this.length = 0
        };
        var priorityProto = PriorityQueue.prototype;
        priorityProto.isHigherPriority = function (left, right) {
          return this.items[left].compareTo(this.items[right]) < 0
        };
        priorityProto.percolate = function (index) {
          if (index >= this.length || index < 0) {
            return
          }
          var parent = index - 1 >> 1;
          if (parent < 0 || parent === index) {
            return
          }
          if (this.isHigherPriority(index, parent)) {
            var temp = this.items[index];
            this.items[index] = this.items[parent];
            this.items[parent] = temp;
            this.percolate(parent)
          }
        };
        priorityProto.heapify = function (index) {
          +index || (index = 0);
          if (index >= this.length || index < 0) {
            return
          }
          var left = 2 * index + 1, right = 2 * index + 2, first = index;
          if (left < this.length && this.isHigherPriority(left, first)) {
            first = left
          }
          if (right < this.length && this.isHigherPriority(right, first)) {
            first = right
          }
          if (first !== index) {
            var temp = this.items[index];
            this.items[index] = this.items[first];
            this.items[first] = temp;
            this.heapify(first)
          }
        };
        priorityProto.peek = function () {
          return this.items[0].value
        };
        priorityProto.removeAt = function (index) {
          this.items[index] = this.items[--this.length];
          delete this.items[this.length];
          this.heapify()
        };
        priorityProto.dequeue = function () {
          var result = this.peek();
          this.removeAt(0);
          return result
        };
        priorityProto.enqueue = function (item) {
          var index = this.length++;
          this.items[index] = new IndexedItem(PriorityQueue.count++, item);
          this.percolate(index)
        };
        priorityProto.remove = function (item) {
          for (var i = 0; i < this.length; i++) {
            if (this.items[i].value === item) {
              this.removeAt(i);
              return true
            }
          }
          return false
        };
        PriorityQueue.count = 0;
        var CompositeDisposable = Rx.CompositeDisposable = function () {
          this.disposables = argsOrArray(arguments, 0);
          this.isDisposed = false;
          this.length = this.disposables.length
        };
        var CompositeDisposablePrototype = CompositeDisposable.prototype;
        CompositeDisposablePrototype.add = function (item) {
          if (this.isDisposed) {
            item.dispose()
          } else {
            this.disposables.push(item);
            this.length++
          }
        };
        CompositeDisposablePrototype.remove = function (item) {
          var shouldDispose = false;
          if (!this.isDisposed) {
            var idx = this.disposables.indexOf(item);
            if (idx !== -1) {
              shouldDispose = true;
              this.disposables.splice(idx, 1);
              this.length--;
              item.dispose()
            }
          }
          return shouldDispose
        };
        CompositeDisposablePrototype.dispose = function () {
          if (!this.isDisposed) {
            this.isDisposed = true;
            var currentDisposables = this.disposables.slice(0);
            this.disposables = [];
            this.length = 0;
            for (var i = 0, len = currentDisposables.length; i < len; i++) {
              currentDisposables[i].dispose()
            }
          }
        };
        CompositeDisposablePrototype.toArray = function () {
          return this.disposables.slice(0)
        };
        var Disposable = Rx.Disposable = function (action) {
          this.isDisposed = false;
          this.action = action || noop
        };
        Disposable.prototype.dispose = function () {
          if (!this.isDisposed) {
            this.action();
            this.isDisposed = true
          }
        };
        var disposableCreate = Disposable.create = function (action) {
          return new Disposable(action)
        };
        var disposableEmpty = Disposable.empty = {dispose: noop};
        var SingleAssignmentDisposable = Rx.SingleAssignmentDisposable = function () {
          function BooleanDisposable() {
            this.isDisposed = false;
            this.current = null
          }

          var booleanDisposablePrototype = BooleanDisposable.prototype;
          booleanDisposablePrototype.getDisposable = function () {
            return this.current
          };
          booleanDisposablePrototype.setDisposable = function (value) {
            var shouldDispose = this.isDisposed, old;
            if (!shouldDispose) {
              old = this.current;
              this.current = value
            }
            old && old.dispose();
            shouldDispose && value && value.dispose()
          };
          booleanDisposablePrototype.dispose = function () {
            var old;
            if (!this.isDisposed) {
              this.isDisposed = true;
              old = this.current;
              this.current = null
            }
            old && old.dispose()
          };
          return BooleanDisposable
        }();
        var SerialDisposable = Rx.SerialDisposable = SingleAssignmentDisposable;
        var RefCountDisposable = Rx.RefCountDisposable = function () {
          function InnerDisposable(disposable) {
            this.disposable = disposable;
            this.disposable.count++;
            this.isInnerDisposed = false
          }

          InnerDisposable.prototype.dispose = function () {
            if (!this.disposable.isDisposed) {
              if (!this.isInnerDisposed) {
                this.isInnerDisposed = true;
                this.disposable.count--;
                if (this.disposable.count === 0 && this.disposable.isPrimaryDisposed) {
                  this.disposable.isDisposed = true;
                  this.disposable.underlyingDisposable.dispose()
                }
              }
            }
          };
          function RefCountDisposable(disposable) {
            this.underlyingDisposable = disposable;
            this.isDisposed = false;
            this.isPrimaryDisposed = false;
            this.count = 0
          }

          RefCountDisposable.prototype.dispose = function () {
            if (!this.isDisposed) {
              if (!this.isPrimaryDisposed) {
                this.isPrimaryDisposed = true;
                if (this.count === 0) {
                  this.isDisposed = true;
                  this.underlyingDisposable.dispose()
                }
              }
            }
          };
          RefCountDisposable.prototype.getDisposable = function () {
            return this.isDisposed ? disposableEmpty : new InnerDisposable(this)
          };
          return RefCountDisposable
        }();

        function ScheduledDisposable(scheduler, disposable) {
          this.scheduler = scheduler;
          this.disposable = disposable;
          this.isDisposed = false
        }

        ScheduledDisposable.prototype.dispose = function () {
          var parent = this;
          this.scheduler.schedule(function () {
            if (!parent.isDisposed) {
              parent.isDisposed = true;
              parent.disposable.dispose()
            }
          })
        };
        var ScheduledItem = Rx.internals.ScheduledItem = function (scheduler, state, action, dueTime, comparer) {
          this.scheduler = scheduler;
          this.state = state;
          this.action = action;
          this.dueTime = dueTime;
          this.comparer = comparer || defaultSubComparer;
          this.disposable = new SingleAssignmentDisposable
        };
        ScheduledItem.prototype.invoke = function () {
          this.disposable.setDisposable(this.invokeCore())
        };
        ScheduledItem.prototype.compareTo = function (other) {
          return this.comparer(this.dueTime, other.dueTime)
        };
        ScheduledItem.prototype.isCancelled = function () {
          return this.disposable.isDisposed
        };
        ScheduledItem.prototype.invokeCore = function () {
          return this.action(this.scheduler, this.state)
        };
        var Scheduler = Rx.Scheduler = function () {
          function Scheduler(now, schedule, scheduleRelative, scheduleAbsolute) {
            this.now = now;
            this._schedule = schedule;
            this._scheduleRelative = scheduleRelative;
            this._scheduleAbsolute = scheduleAbsolute
          }

          function invokeAction(scheduler, action) {
            action();
            return disposableEmpty
          }

          var schedulerProto = Scheduler.prototype;
          schedulerProto.schedule = function (action) {
            return this._schedule(action, invokeAction)
          };
          schedulerProto.scheduleWithState = function (state, action) {
            return this._schedule(state, action)
          };
          schedulerProto.scheduleWithRelative = function (dueTime, action) {
            return this._scheduleRelative(action, dueTime, invokeAction)
          };
          schedulerProto.scheduleWithRelativeAndState = function (state, dueTime, action) {
            return this._scheduleRelative(state, dueTime, action)
          };
          schedulerProto.scheduleWithAbsolute = function (dueTime, action) {
            return this._scheduleAbsolute(action, dueTime, invokeAction)
          };
          schedulerProto.scheduleWithAbsoluteAndState = function (state, dueTime, action) {
            return this._scheduleAbsolute(state, dueTime, action)
          };
          Scheduler.now = defaultNow;
          Scheduler.normalize = function (timeSpan) {
            timeSpan < 0 && (timeSpan = 0);
            return timeSpan
          };
          return Scheduler
        }();
        var normalizeTime = Scheduler.normalize;
        (function (schedulerProto) {
          function invokeRecImmediate(scheduler, pair) {
            var state = pair.first, action = pair.second, group = new CompositeDisposable, recursiveAction = function (state1) {
              action(state1, function (state2) {
                var isAdded = false, isDone = false, d = scheduler.scheduleWithState(state2, function (scheduler1, state3) {
                  if (isAdded) {
                    group.remove(d)
                  } else {
                    isDone = true
                  }
                  recursiveAction(state3);
                  return disposableEmpty
                });
                if (!isDone) {
                  group.add(d);
                  isAdded = true
                }
              })
            };
            recursiveAction(state);
            return group
          }

          function invokeRecDate(scheduler, pair, method) {
            var state = pair.first, action = pair.second, group = new CompositeDisposable, recursiveAction = function (state1) {
              action(state1, function (state2, dueTime1) {
                var isAdded = false, isDone = false, d = scheduler[method].call(scheduler, state2, dueTime1, function (scheduler1, state3) {
                  if (isAdded) {
                    group.remove(d)
                  } else {
                    isDone = true
                  }
                  recursiveAction(state3);
                  return disposableEmpty
                });
                if (!isDone) {
                  group.add(d);
                  isAdded = true
                }
              })
            };
            recursiveAction(state);
            return group
          }

          function scheduleInnerRecursive(action, self) {
            action(function (dt) {
              self(action, dt)
            })
          }

          schedulerProto.scheduleRecursive = function (action) {
            return this.scheduleRecursiveWithState(action, function (_action, self) {
              _action(function () {
                self(_action)
              })
            })
          };
          schedulerProto.scheduleRecursiveWithState = function (state, action) {
            return this.scheduleWithState({first: state, second: action}, invokeRecImmediate)
          };
          schedulerProto.scheduleRecursiveWithRelative = function (dueTime, action) {
            return this.scheduleRecursiveWithRelativeAndState(action, dueTime, scheduleInnerRecursive)
          };
          schedulerProto.scheduleRecursiveWithRelativeAndState = function (state, dueTime, action) {
            return this._scheduleRelative({first: state, second: action}, dueTime, function (s, p) {
              return invokeRecDate(s, p, "scheduleWithRelativeAndState")
            })
          };
          schedulerProto.scheduleRecursiveWithAbsolute = function (dueTime, action) {
            return this.scheduleRecursiveWithAbsoluteAndState(action, dueTime, scheduleInnerRecursive)
          };
          schedulerProto.scheduleRecursiveWithAbsoluteAndState = function (state, dueTime, action) {
            return this._scheduleAbsolute({first: state, second: action}, dueTime, function (s, p) {
              return invokeRecDate(s, p, "scheduleWithAbsoluteAndState")
            })
          }
        })(Scheduler.prototype);
        (function (schedulerProto) {
          Scheduler.prototype.schedulePeriodic = function (period, action) {
            return this.schedulePeriodicWithState(null, period, action)
          };
          Scheduler.prototype.schedulePeriodicWithState = function (state, period, action) {
            if (typeof root.setInterval === "undefined") {
              throw new Error("Periodic scheduling not supported.")
            }
            var s = state;
            var id = root.setInterval(function () {
              s = action(s)
            }, period);
            return disposableCreate(function () {
              root.clearInterval(id)
            })
          }
        })(Scheduler.prototype);
        (function (schedulerProto) {
          schedulerProto.catchError = schedulerProto["catch"] = function (handler) {
            return new CatchScheduler(this, handler)
          }
        })(Scheduler.prototype);
        var SchedulePeriodicRecursive = Rx.internals.SchedulePeriodicRecursive = function () {
          function tick(command, recurse) {
            recurse(0, this._period);
            try {
              this._state = this._action(this._state)
            } catch (e) {
              this._cancel.dispose();
              throw e
            }
          }

          function SchedulePeriodicRecursive(scheduler, state, period, action) {
            this._scheduler = scheduler;
            this._state = state;
            this._period = period;
            this._action = action
          }

          SchedulePeriodicRecursive.prototype.start = function () {
            var d = new SingleAssignmentDisposable;
            this._cancel = d;
            d.setDisposable(this._scheduler.scheduleRecursiveWithRelativeAndState(0, this._period, tick.bind(this)));
            return d
          };
          return SchedulePeriodicRecursive
        }();
        var immediateScheduler = Scheduler.immediate = function () {
          function scheduleNow(state, action) {
            return action(this, state)
          }

          function scheduleRelative(state, dueTime, action) {
            var dt = this.now() + normalizeTime(dueTime);
            while (dt - this.now() > 0) {
            }
            return action(this, state)
          }

          function scheduleAbsolute(state, dueTime, action) {
            return this.scheduleWithRelativeAndState(state, dueTime - this.now(), action)
          }

          return new Scheduler(defaultNow, scheduleNow, scheduleRelative, scheduleAbsolute)
        }();
        var currentThreadScheduler = Scheduler.currentThread = function () {
          var queue;

          function runTrampoline(q) {
            var item;
            while (q.length > 0) {
              item = q.dequeue();
              if (!item.isCancelled()) {
                while (item.dueTime - Scheduler.now() > 0) {
                }
                if (!item.isCancelled()) {
                  item.invoke()
                }
              }
            }
          }

          function scheduleNow(state, action) {
            return this.scheduleWithRelativeAndState(state, 0, action)
          }

          function scheduleRelative(state, dueTime, action) {
            var dt = this.now() + Scheduler.normalize(dueTime), si = new ScheduledItem(this, state, action, dt);
            if (!queue) {
              queue = new PriorityQueue(4);
              queue.enqueue(si);
              try {
                runTrampoline(queue)
              } catch (e) {
                throw e
              } finally {
                queue = null
              }
            } else {
              queue.enqueue(si)
            }
            return si.disposable
          }

          function scheduleAbsolute(state, dueTime, action) {
            return this.scheduleWithRelativeAndState(state, dueTime - this.now(), action)
          }

          var currentScheduler = new Scheduler(defaultNow, scheduleNow, scheduleRelative, scheduleAbsolute);
          currentScheduler.scheduleRequired = function () {
            return !queue
          };
          currentScheduler.ensureTrampoline = function (action) {
            if (!queue) {
              this.schedule(action)
            } else {
              action()
            }
          };
          return currentScheduler
        }();
        var scheduleMethod, clearMethod = noop;
        var localTimer = function () {
          var localSetTimeout, localClearTimeout = noop;
          if ("WScript"in this) {
            localSetTimeout = function (fn, time) {
              WScript.Sleep(time);
              fn()
            }
          } else if (!!root.setTimeout) {
            localSetTimeout = root.setTimeout;
            localClearTimeout = root.clearTimeout
          } else {
            throw new Error("No concurrency detected!")
          }
          return {setTimeout: localSetTimeout, clearTimeout: localClearTimeout}
        }();
        var localSetTimeout = localTimer.setTimeout, localClearTimeout = localTimer.clearTimeout;
        (function () {
          var reNative = RegExp("^" + String(toString).replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/toString| for [^\]]+/g, ".*?") + "$");
          var setImmediate = typeof(setImmediate = freeGlobal && moduleExports && freeGlobal.setImmediate) == "function" && !reNative.test(setImmediate) && setImmediate, clearImmediate = typeof(clearImmediate = freeGlobal && moduleExports && freeGlobal.clearImmediate) == "function" && !reNative.test(clearImmediate) && clearImmediate;

          function postMessageSupported() {
            if (!root.postMessage || root.importScripts) {
              return false
            }
            var isAsync = false, oldHandler = root.onmessage;
            root.onmessage = function () {
              isAsync = true
            };
            root.postMessage("", "*");
            root.onmessage = oldHandler;
            return isAsync
          }

          if (typeof setImmediate === "function") {
            scheduleMethod = setImmediate;
            clearMethod = clearImmediate
          } else if (typeof process !== "undefined" && {}.toString.call(process) === "[object process]") {
            scheduleMethod = process.nextTick
          } else if (postMessageSupported()) {
            var MSG_PREFIX = "ms.rx.schedule" + Math.random(), tasks = {}, taskId = 0;
            var onGlobalPostMessage = function (event) {
              if (typeof event.data === "string" && event.data.substring(0, MSG_PREFIX.length) === MSG_PREFIX) {
                var handleId = event.data.substring(MSG_PREFIX.length), action = tasks[handleId];
                action();
                delete tasks[handleId]
              }
            };
            if (root.addEventListener) {
              root.addEventListener("message", onGlobalPostMessage, false)
            } else {
              root.attachEvent("onmessage", onGlobalPostMessage, false)
            }
            scheduleMethod = function (action) {
              var currentId = taskId++;
              tasks[currentId] = action;
              root.postMessage(MSG_PREFIX + currentId, "*")
            }
          } else if (!!root.MessageChannel) {
            var channel = new root.MessageChannel, channelTasks = {}, channelTaskId = 0;
            channel.port1.onmessage = function (event) {
              var id = event.data, action = channelTasks[id];
              action();
              delete channelTasks[id]
            };
            scheduleMethod = function (action) {
              var id = channelTaskId++;
              channelTasks[id] = action;
              channel.port2.postMessage(id)
            }
          } else if ("document"in root && "onreadystatechange"in root.document.createElement("script")) {
            scheduleMethod = function (action) {
              var scriptElement = root.document.createElement("script");
              scriptElement.onreadystatechange = function () {
                action();
                scriptElement.onreadystatechange = null;
                scriptElement.parentNode.removeChild(scriptElement);
                scriptElement = null
              };
              root.document.documentElement.appendChild(scriptElement)
            }
          } else {
            scheduleMethod = function (action) {
              return localSetTimeout(action, 0)
            };
            clearMethod = localClearTimeout
          }
        })();
        var timeoutScheduler = Scheduler.timeout = function () {
          function scheduleNow(state, action) {
            var scheduler = this, disposable = new SingleAssignmentDisposable;
            var id = scheduleMethod(function () {
              if (!disposable.isDisposed) {
                disposable.setDisposable(action(scheduler, state))
              }
            });
            return new CompositeDisposable(disposable, disposableCreate(function () {
              clearMethod(id)
            }))
          }

          function scheduleRelative(state, dueTime, action) {
            var scheduler = this, dt = Scheduler.normalize(dueTime);
            if (dt === 0) {
              return scheduler.scheduleWithState(state, action)
            }
            var disposable = new SingleAssignmentDisposable;
            var id = localSetTimeout(function () {
              if (!disposable.isDisposed) {
                disposable.setDisposable(action(scheduler, state))
              }
            }, dt);
            return new CompositeDisposable(disposable, disposableCreate(function () {
              localClearTimeout(id)
            }))
          }

          function scheduleAbsolute(state, dueTime, action) {
            return this.scheduleWithRelativeAndState(state, dueTime - this.now(), action)
          }

          return new Scheduler(defaultNow, scheduleNow, scheduleRelative, scheduleAbsolute)
        }();
        var CatchScheduler = function (__super__) {
          function scheduleNow(state, action) {
            return this._scheduler.scheduleWithState(state, this._wrap(action))
          }

          function scheduleRelative(state, dueTime, action) {
            return this._scheduler.scheduleWithRelativeAndState(state, dueTime, this._wrap(action))
          }

          function scheduleAbsolute(state, dueTime, action) {
            return this._scheduler.scheduleWithAbsoluteAndState(state, dueTime, this._wrap(action))
          }

          inherits(CatchScheduler, __super__);
          function CatchScheduler(scheduler, handler) {
            this._scheduler = scheduler;
            this._handler = handler;
            this._recursiveOriginal = null;
            this._recursiveWrapper = null;
            __super__.call(this, this._scheduler.now.bind(this._scheduler), scheduleNow, scheduleRelative, scheduleAbsolute)
          }

          CatchScheduler.prototype._clone = function (scheduler) {
            return new CatchScheduler(scheduler, this._handler)
          };
          CatchScheduler.prototype._wrap = function (action) {
            var parent = this;
            return function (self, state) {
              try {
                return action(parent._getRecursiveWrapper(self), state)
              } catch (e) {
                if (!parent._handler(e)) {
                  throw e
                }
                return disposableEmpty
              }
            }
          };
          CatchScheduler.prototype._getRecursiveWrapper = function (scheduler) {
            if (this._recursiveOriginal !== scheduler) {
              this._recursiveOriginal = scheduler;
              var wrapper = this._clone(scheduler);
              wrapper._recursiveOriginal = scheduler;
              wrapper._recursiveWrapper = wrapper;
              this._recursiveWrapper = wrapper
            }
            return this._recursiveWrapper
          };
          CatchScheduler.prototype.schedulePeriodicWithState = function (state, period, action) {
            var self = this, failed = false, d = new SingleAssignmentDisposable;
            d.setDisposable(this._scheduler.schedulePeriodicWithState(state, period, function (state1) {
              if (failed) {
                return null
              }
              try {
                return action(state1)
              } catch (e) {
                failed = true;
                if (!self._handler(e)) {
                  throw e
                }
                d.dispose();
                return null
              }
            }));
            return d
          };
          return CatchScheduler
        }(Scheduler);
        var Notification = Rx.Notification = function () {
          function Notification(kind, hasValue) {
            this.hasValue = hasValue == null ? false : hasValue;
            this.kind = kind
          }

          Notification.prototype.accept = function (observerOrOnNext, onError, onCompleted) {
            return observerOrOnNext && typeof observerOrOnNext === "object" ? this._acceptObservable(observerOrOnNext) : this._accept(observerOrOnNext, onError, onCompleted)
          };
          Notification.prototype.toObservable = function (scheduler) {
            var notification = this;
            isScheduler(scheduler) || (scheduler = immediateScheduler);
            return new AnonymousObservable(function (observer) {
              return scheduler.schedule(function () {
                notification._acceptObservable(observer);
                notification.kind === "N" && observer.onCompleted()
              })
            })
          };
          return Notification
        }();
        var notificationCreateOnNext = Notification.createOnNext = function () {
          function _accept(onNext) {
            return onNext(this.value)
          }

          function _acceptObservable(observer) {
            return observer.onNext(this.value)
          }

          function toString() {
            return "OnNext(" + this.value + ")"
          }

          return function (value) {
            var notification = new Notification("N", true);
            notification.value = value;
            notification._accept = _accept;
            notification._acceptObservable = _acceptObservable;
            notification.toString = toString;
            return notification
          }
        }();
        var notificationCreateOnError = Notification.createOnError = function () {
          function _accept(onNext, onError) {
            return onError(this.exception)
          }

          function _acceptObservable(observer) {
            return observer.onError(this.exception)
          }

          function toString() {
            return "OnError(" + this.exception + ")"
          }

          return function (e) {
            var notification = new Notification("E");
            notification.exception = e;
            notification._accept = _accept;
            notification._acceptObservable = _acceptObservable;
            notification.toString = toString;
            return notification
          }
        }();
        var notificationCreateOnCompleted = Notification.createOnCompleted = function () {
          function _accept(onNext, onError, onCompleted) {
            return onCompleted()
          }

          function _acceptObservable(observer) {
            return observer.onCompleted()
          }

          function toString() {
            return "OnCompleted()"
          }

          return function () {
            var notification = new Notification("C");
            notification._accept = _accept;
            notification._acceptObservable = _acceptObservable;
            notification.toString = toString;
            return notification
          }
        }();
        var Enumerator = Rx.internals.Enumerator = function (next) {
          this._next = next
        };
        Enumerator.prototype.next = function () {
          return this._next()
        };
        Enumerator.prototype[$iterator$] = function () {
          return this
        };
        var Enumerable = Rx.internals.Enumerable = function (iterator) {
          this._iterator = iterator
        };
        Enumerable.prototype[$iterator$] = function () {
          return this._iterator()
        };
        Enumerable.prototype.concat = function () {
          var sources = this;
          return new AnonymousObservable(function (observer) {
            var e;
            try {
              e = sources[$iterator$]()
            } catch (err) {
              observer.onError(err);
              return
            }
            var isDisposed, subscription = new SerialDisposable;
            var cancelable = immediateScheduler.scheduleRecursive(function (self) {
              var currentItem;
              if (isDisposed) {
                return
              }
              try {
                currentItem = e.next()
              } catch (ex) {
                observer.onError(ex);
                return
              }
              if (currentItem.done) {
                observer.onCompleted();
                return
              }
              var currentValue = currentItem.value;
              isPromise(currentValue) && (currentValue = observableFromPromise(currentValue));
              var d = new SingleAssignmentDisposable;
              subscription.setDisposable(d);
              d.setDisposable(currentValue.subscribe(observer.onNext.bind(observer), observer.onError.bind(observer), function () {
                self()
              }))
            });
            return new CompositeDisposable(subscription, cancelable, disposableCreate(function () {
              isDisposed = true
            }))
          })
        };
        Enumerable.prototype.catchError = function () {
          var sources = this;
          return new AnonymousObservable(function (observer) {
            var e;
            try {
              e = sources[$iterator$]()
            } catch (err) {
              observer.onError(err);
              return
            }
            var isDisposed, lastException, subscription = new SerialDisposable;
            var cancelable = immediateScheduler.scheduleRecursive(function (self) {
              if (isDisposed) {
                return
              }
              var currentItem;
              try {
                currentItem = e.next()
              } catch (ex) {
                observer.onError(ex);
                return
              }
              if (currentItem.done) {
                if (lastException) {
                  observer.onError(lastException)
                } else {
                  observer.onCompleted()
                }
                return
              }
              var currentValue = currentItem.value;
              isPromise(currentValue) && (currentValue = observableFromPromise(currentValue));
              var d = new SingleAssignmentDisposable;
              subscription.setDisposable(d);
              d.setDisposable(currentValue.subscribe(observer.onNext.bind(observer), function (exn) {
                lastException = exn;
                self()
              }, observer.onCompleted.bind(observer)))
            });
            return new CompositeDisposable(subscription, cancelable, disposableCreate(function () {
              isDisposed = true
            }))
          })
        };
        Enumerable.prototype.catchErrorWhen = function (notificationHandler) {
          var sources = this;
          return new AnonymousObservable(function (observer) {
            var e;
            var exceptions = new Subject;
            var handled = notificationHandler(exceptions);
            var notifier = new Subject;
            var notificationDisposable = handled.subscribe(notifier);
            try {
              e = sources[$iterator$]()
            } catch (err) {
              observer.onError(err);
              return
            }
            var isDisposed, lastException, subscription = new SerialDisposable;
            var cancelable = immediateScheduler.scheduleRecursive(function (self) {
              if (isDisposed) {
                return
              }
              var currentItem;
              try {
                currentItem = e.next()
              } catch (ex) {
                observer.onError(ex);
                return
              }
              if (currentItem.done) {
                if (lastException) {
                  observer.onError(lastException)
                } else {
                  observer.onCompleted()
                }
                return
              }
              var currentValue = currentItem.value;
              isPromise(currentValue) && (currentValue = observableFromPromise(currentValue));
              var outer = new SingleAssignmentDisposable;
              var inner = new SingleAssignmentDisposable;
              subscription.setDisposable(new CompositeDisposable(inner, outer));
              outer.setDisposable(currentValue.subscribe(observer.onNext.bind(observer), function (exn) {
                inner.setDisposable(notifier.subscribe(function () {
                  self()
                }, function (ex) {
                  observer.onError(ex)
                }, function () {
                  observer.onCompleted()
                }));
                exceptions.onNext(exn)
              }, observer.onCompleted.bind(observer)))
            });
            return new CompositeDisposable(notificationDisposable, subscription, cancelable, disposableCreate(function () {
              isDisposed = true
            }))
          })
        };
        var enumerableRepeat = Enumerable.repeat = function (value, repeatCount) {
          if (repeatCount == null) {
            repeatCount = -1
          }
          return new Enumerable(function () {
            var left = repeatCount;
            return new Enumerator(function () {
              if (left === 0) {
                return doneEnumerator
              }
              if (left > 0) {
                left--
              }
              return {done: false, value: value}
            })
          })
        };
        var enumerableOf = Enumerable.of = function (source, selector, thisArg) {
          selector || (selector = identity);
          return new Enumerable(function () {
            var index = -1;
            return new Enumerator(function () {
              return ++index < source.length ? {
                done: false,
                value: selector.call(thisArg, source[index], index, source)
              } : doneEnumerator
            })
          })
        };
        var Observer = Rx.Observer = function () {
        };
        Observer.prototype.toNotifier = function () {
          var observer = this;
          return function (n) {
            return n.accept(observer)
          }
        };
        Observer.prototype.asObserver = function () {
          return new AnonymousObserver(this.onNext.bind(this), this.onError.bind(this), this.onCompleted.bind(this))
        };
        Observer.prototype.checked = function () {
          return new CheckedObserver(this)
        };
        var observerCreate = Observer.create = function (onNext, onError, onCompleted) {
          onNext || (onNext = noop);
          onError || (onError = defaultError);
          onCompleted || (onCompleted = noop);
          return new AnonymousObserver(onNext, onError, onCompleted)
        };
        Observer.fromNotifier = function (handler, thisArg) {
          return new AnonymousObserver(function (x) {
            return handler.call(thisArg, notificationCreateOnNext(x))
          }, function (e) {
            return handler.call(thisArg, notificationCreateOnError(e))
          }, function () {
            return handler.call(thisArg, notificationCreateOnCompleted())
          })
        };
        Observer.prototype.notifyOn = function (scheduler) {
          return new ObserveOnObserver(scheduler, this)
        };
        var AbstractObserver = Rx.internals.AbstractObserver = function (__super__) {
          inherits(AbstractObserver, __super__);
          function AbstractObserver() {
            this.isStopped = false;
            __super__.call(this)
          }

          AbstractObserver.prototype.onNext = function (value) {
            if (!this.isStopped) {
              this.next(value)
            }
          };
          AbstractObserver.prototype.onError = function (error) {
            if (!this.isStopped) {
              this.isStopped = true;
              this.error(error)
            }
          };
          AbstractObserver.prototype.onCompleted = function () {
            if (!this.isStopped) {
              this.isStopped = true;
              this.completed()
            }
          };
          AbstractObserver.prototype.dispose = function () {
            this.isStopped = true
          };
          AbstractObserver.prototype.fail = function (e) {
            if (!this.isStopped) {
              this.isStopped = true;
              this.error(e);
              return true
            }
            return false
          };
          return AbstractObserver
        }(Observer);
        var AnonymousObserver = Rx.AnonymousObserver = function (__super__) {
          inherits(AnonymousObserver, __super__);
          function AnonymousObserver(onNext, onError, onCompleted) {
            __super__.call(this);
            this._onNext = onNext;
            this._onError = onError;
            this._onCompleted = onCompleted
          }

          AnonymousObserver.prototype.next = function (value) {
            this._onNext(value)
          };
          AnonymousObserver.prototype.error = function (error) {
            this._onError(error)
          };
          AnonymousObserver.prototype.completed = function () {
            this._onCompleted()
          };
          return AnonymousObserver
        }(AbstractObserver);
        var CheckedObserver = function (_super) {
          inherits(CheckedObserver, _super);
          function CheckedObserver(observer) {
            _super.call(this);
            this._observer = observer;
            this._state = 0
          }

          var CheckedObserverPrototype = CheckedObserver.prototype;
          CheckedObserverPrototype.onNext = function (value) {
            this.checkAccess();
            try {
              this._observer.onNext(value)
            } catch (e) {
              throw e
            } finally {
              this._state = 0
            }
          };
          CheckedObserverPrototype.onError = function (err) {
            this.checkAccess();
            try {
              this._observer.onError(err)
            } catch (e) {
              throw e
            } finally {
              this._state = 2
            }
          };
          CheckedObserverPrototype.onCompleted = function () {
            this.checkAccess();
            try {
              this._observer.onCompleted()
            } catch (e) {
              throw e
            } finally {
              this._state = 2
            }
          };
          CheckedObserverPrototype.checkAccess = function () {
            if (this._state === 1) {
              throw new Error("Re-entrancy detected")
            }
            if (this._state === 2) {
              throw new Error("Observer completed")
            }
            if (this._state === 0) {
              this._state = 1
            }
          };
          return CheckedObserver
        }(Observer);
        var ScheduledObserver = Rx.internals.ScheduledObserver = function (__super__) {
          inherits(ScheduledObserver, __super__);
          function ScheduledObserver(scheduler, observer) {
            __super__.call(this);
            this.scheduler = scheduler;
            this.observer = observer;
            this.isAcquired = false;
            this.hasFaulted = false;
            this.queue = [];
            this.disposable = new SerialDisposable
          }

          ScheduledObserver.prototype.next = function (value) {
            var self = this;
            this.queue.push(function () {
              self.observer.onNext(value)
            })
          };
          ScheduledObserver.prototype.error = function (e) {
            var self = this;
            this.queue.push(function () {
              self.observer.onError(e)
            })
          };
          ScheduledObserver.prototype.completed = function () {
            var self = this;
            this.queue.push(function () {
              self.observer.onCompleted()
            })
          };
          ScheduledObserver.prototype.ensureActive = function () {
            var isOwner = false, parent = this;
            if (!this.hasFaulted && this.queue.length > 0) {
              isOwner = !this.isAcquired;
              this.isAcquired = true
            }
            if (isOwner) {
              this.disposable.setDisposable(this.scheduler.scheduleRecursive(function (self) {
                var work;
                if (parent.queue.length > 0) {
                  work = parent.queue.shift()
                } else {
                  parent.isAcquired = false;
                  return
                }
                try {
                  work()
                } catch (ex) {
                  parent.queue = [];
                  parent.hasFaulted = true;
                  throw ex
                }
                self()
              }))
            }
          };
          ScheduledObserver.prototype.dispose = function () {
            __super__.prototype.dispose.call(this);
            this.disposable.dispose()
          };
          return ScheduledObserver
        }(AbstractObserver);
        var ObserveOnObserver = function (__super__) {
          inherits(ObserveOnObserver, __super__);
          function ObserveOnObserver(scheduler, observer, cancel) {
            __super__.call(this, scheduler, observer);
            this._cancel = cancel
          }

          ObserveOnObserver.prototype.next = function (value) {
            __super__.prototype.next.call(this, value);
            this.ensureActive()
          };
          ObserveOnObserver.prototype.error = function (e) {
            __super__.prototype.error.call(this, e);
            this.ensureActive()
          };
          ObserveOnObserver.prototype.completed = function () {
            __super__.prototype.completed.call(this);
            this.ensureActive()
          };
          ObserveOnObserver.prototype.dispose = function () {
            __super__.prototype.dispose.call(this);
            this._cancel && this._cancel.dispose();
            this._cancel = null
          };
          return ObserveOnObserver
        }(ScheduledObserver);
        var observableProto;
        var Observable = Rx.Observable = function () {
          function Observable(subscribe) {
            if (Rx.config.longStackSupport && hasStacks) {
              try {
                throw new Error
              } catch (e) {
                this.stack = e.stack.substring(e.stack.indexOf("\n") + 1)
              }
              var self = this;
              this._subscribe = function (observer) {
                var oldOnError = observer.onError.bind(observer);
                observer.onError = function (err) {
                  makeStackTraceLong(err, self);
                  oldOnError(err)
                };
                return subscribe.call(self, observer)
              }
            } else {
              this._subscribe = subscribe
            }
          }

          observableProto = Observable.prototype;
          observableProto.subscribe = observableProto.forEach = function (observerOrOnNext, onError, onCompleted) {
            return this._subscribe(typeof observerOrOnNext === "object" ? observerOrOnNext : observerCreate(observerOrOnNext, onError, onCompleted))
          };
          observableProto.subscribeOnNext = function (onNext, thisArg) {
            return this._subscribe(observerCreate(arguments.length === 2 ? function (x) {
              onNext.call(thisArg, x)
            } : onNext))
          };
          observableProto.subscribeOnError = function (onError, thisArg) {
            return this._subscribe(observerCreate(null, arguments.length === 2 ? function (e) {
              onError.call(thisArg, e)
            } : onError))
          };
          observableProto.subscribeOnCompleted = function (onCompleted, thisArg) {
            return this._subscribe(observerCreate(null, null, arguments.length === 2 ? function () {
              onCompleted.call(thisArg)
            } : onCompleted))
          };
          return Observable
        }();
        observableProto.observeOn = function (scheduler) {
          var source = this;
          return new AnonymousObservable(function (observer) {
            return source.subscribe(new ObserveOnObserver(scheduler, observer))
          }, source)
        };
        observableProto.subscribeOn = function (scheduler) {
          var source = this;
          return new AnonymousObservable(function (observer) {
            var m = new SingleAssignmentDisposable, d = new SerialDisposable;
            d.setDisposable(m);
            m.setDisposable(scheduler.schedule(function () {
              d.setDisposable(new ScheduledDisposable(scheduler, source.subscribe(observer)))
            }));
            return d
          }, source)
        };
        var observableFromPromise = Observable.fromPromise = function (promise) {
          return observableDefer(function () {
            var subject = new Rx.AsyncSubject;
            promise.then(function (value) {
              subject.onNext(value);
              subject.onCompleted()
            }, subject.onError.bind(subject));
            return subject
          })
        };
        observableProto.toPromise = function (promiseCtor) {
          promiseCtor || (promiseCtor = Rx.config.Promise);
          if (!promiseCtor) {
            throw new TypeError("Promise type not provided nor in Rx.config.Promise")
          }
          var source = this;
          return new promiseCtor(function (resolve, reject) {
            var value, hasValue = false;
            source.subscribe(function (v) {
              value = v;
              hasValue = true
            }, reject, function () {
              hasValue && resolve(value)
            })
          })
        };
        observableProto.toArray = function () {
          var source = this;
          return new AnonymousObservable(function (observer) {
            var arr = [];
            return source.subscribe(function (x) {
              arr.push(x)
            }, function (e) {
              observer.onError(e)
            }, function () {
              observer.onNext(arr);
              observer.onCompleted()
            })
          }, source)
        };
        Observable.create = Observable.createWithDisposable = function (subscribe, parent) {
          return new AnonymousObservable(subscribe, parent)
        };
        var observableDefer = Observable.defer = function (observableFactory) {
          return new AnonymousObservable(function (observer) {
            var result;
            try {
              result = observableFactory()
            } catch (e) {
              return observableThrow(e).subscribe(observer)
            }
            isPromise(result) && (result = observableFromPromise(result));
            return result.subscribe(observer)
          })
        };
        var observableEmpty = Observable.empty = function (scheduler) {
          isScheduler(scheduler) || (scheduler = immediateScheduler);
          return new AnonymousObservable(function (observer) {
            return scheduler.schedule(function () {
              observer.onCompleted()
            })
          })
        };
        var maxSafeInteger = Math.pow(2, 53) - 1;

        function StringIterable(str) {
          this._s = s
        }

        StringIterable.prototype[$iterator$] = function () {
          return new StringIterator(this._s)
        };
        function StringIterator(str) {
          this._s = s;
          this._l = s.length;
          this._i = 0
        }

        StringIterator.prototype[$iterator$] = function () {
          return this
        };
        StringIterator.prototype.next = function () {
          if (this._i < this._l) {
            var val = this._s.charAt(this._i++);
            return {done: false, value: val}
          } else {
            return doneEnumerator
          }
        };
        function ArrayIterable(a) {
          this._a = a
        }

        ArrayIterable.prototype[$iterator$] = function () {
          return new ArrayIterator(this._a)
        };
        function ArrayIterator(a) {
          this._a = a;
          this._l = toLength(a);
          this._i = 0
        }

        ArrayIterator.prototype[$iterator$] = function () {
          return this
        };
        ArrayIterator.prototype.next = function () {
          if (this._i < this._l) {
            var val = this._a[this._i++];
            return {done: false, value: val}
          } else {
            return doneEnumerator
          }
        };
        function numberIsFinite(value) {
          return typeof value === "number" && root.isFinite(value)
        }

        function isNan(n) {
          return n !== n
        }

        function getIterable(o) {
          var i = o[$iterator$], it;
          if (!i && typeof o === "string") {
            it = new StringIterable(o);
            return it[$iterator$]()
          }
          if (!i && o.length !== undefined) {
            it = new ArrayIterable(o);
            return it[$iterator$]()
          }
          if (!i) {
            throw new TypeError("Object is not iterable")
          }
          return o[$iterator$]()
        }

        function sign(value) {
          var number = +value;
          if (number === 0) {
            return number
          }
          if (isNaN(number)) {
            return number
          }
          return number < 0 ? -1 : 1
        }

        function toLength(o) {
          var len = +o.length;
          if (isNaN(len)) {
            return 0
          }
          if (len === 0 || !numberIsFinite(len)) {
            return len
          }
          len = sign(len) * Math.floor(Math.abs(len));
          if (len <= 0) {
            return 0
          }
          if (len > maxSafeInteger) {
            return maxSafeInteger
          }
          return len
        }

        var observableFrom = Observable.from = function (iterable, mapFn, thisArg, scheduler) {
          if (iterable == null) {
            throw new Error("iterable cannot be null.")
          }
          if (mapFn && !isFunction(mapFn)) {
            throw new Error("mapFn when provided must be a function")
          }
          if (mapFn) {
            var mapper = bindCallback(mapFn, thisArg, 2)
          }
          isScheduler(scheduler) || (scheduler = currentThreadScheduler);
          var list = Object(iterable), it = getIterable(list);
          return new AnonymousObservable(function (observer) {
            var i = 0;
            return scheduler.scheduleRecursive(function (self) {
              var next;
              try {
                next = it.next()
              } catch (e) {
                observer.onError(e);
                return
              }
              if (next.done) {
                observer.onCompleted();
                return
              }
              var result = next.value;
              if (mapper) {
                try {
                  result = mapper(result, i)
                } catch (e) {
                  observer.onError(e);
                  return
                }
              }
              observer.onNext(result);
              i++;
              self()
            })
          })
        };
        var observableFromArray = Observable.fromArray = function (array, scheduler) {
          isScheduler(scheduler) || (scheduler = currentThreadScheduler);
          return new AnonymousObservable(function (observer) {
            var count = 0, len = array.length;
            return scheduler.scheduleRecursive(function (self) {
              if (count < len) {
                observer.onNext(array[count++]);
                self()
              } else {
                observer.onCompleted()
              }
            })
          })
        };
        Observable.generate = function (initialState, condition, iterate, resultSelector, scheduler) {
          isScheduler(scheduler) || (scheduler = currentThreadScheduler);
          return new AnonymousObservable(function (observer) {
            var first = true, state = initialState;
            return scheduler.scheduleRecursive(function (self) {
              var hasResult, result;
              try {
                if (first) {
                  first = false
                } else {
                  state = iterate(state)
                }
                hasResult = condition(state);
                if (hasResult) {
                  result = resultSelector(state)
                }
              } catch (exception) {
                observer.onError(exception);
                return
              }
              if (hasResult) {
                observer.onNext(result);
                self()
              } else {
                observer.onCompleted()
              }
            })
          })
        };
        function observableOf(scheduler, array) {
          isScheduler(scheduler) || (scheduler = currentThreadScheduler);
          return new AnonymousObservable(function (observer) {
            var count = 0, len = array.length;
            return scheduler.scheduleRecursive(function (self) {
              if (count < len) {
                observer.onNext(array[count++]);
                self()
              } else {
                observer.onCompleted()
              }
            })
          })
        }

        Observable.of = function () {
          return observableOf(null, arguments)
        };
        Observable.ofWithScheduler = function (scheduler) {
          return observableOf(scheduler, slice.call(arguments, 1))
        };
        var observableNever = Observable.never = function () {
          return new AnonymousObservable(function () {
            return disposableEmpty
          })
        };
        Observable.pairs = function (obj, scheduler) {
          scheduler || (scheduler = Rx.Scheduler.currentThread);
          return new AnonymousObservable(function (observer) {
            var idx = 0, keys = Object.keys(obj), len = keys.length;
            return scheduler.scheduleRecursive(function (self) {
              if (idx < len) {
                var key = keys[idx++];
                observer.onNext([key, obj[key]]);
                self()
              } else {
                observer.onCompleted()
              }
            })
          })
        };
        Observable.range = function (start, count, scheduler) {
          isScheduler(scheduler) || (scheduler = currentThreadScheduler);
          return new AnonymousObservable(function (observer) {
            return scheduler.scheduleRecursiveWithState(0, function (i, self) {
              if (i < count) {
                observer.onNext(start + i);
                self(i + 1)
              } else {
                observer.onCompleted()
              }
            })
          })
        };
        Observable.repeat = function (value, repeatCount, scheduler) {
          isScheduler(scheduler) || (scheduler = currentThreadScheduler);
          return observableReturn(value, scheduler).repeat(repeatCount == null ? -1 : repeatCount)
        };
        var observableReturn = Observable["return"] = Observable.just = function (value, scheduler) {
          isScheduler(scheduler) || (scheduler = immediateScheduler);
          return new AnonymousObservable(function (observer) {
            return scheduler.schedule(function () {
              observer.onNext(value);
              observer.onCompleted()
            })
          })
        };
        Observable.returnValue = function () {
          return observableReturn.apply(null, arguments)
        };
        var observableThrow = Observable["throw"] = Observable.throwError = function (error, scheduler) {
          isScheduler(scheduler) || (scheduler = immediateScheduler);
          return new AnonymousObservable(function (observer) {
            return scheduler.schedule(function () {
              observer.onError(error)
            })
          })
        };
        Observable.throwException = function () {
          return Observable.throwError.apply(null, arguments)
        };
        Observable.using = function (resourceFactory, observableFactory) {
          return new AnonymousObservable(function (observer) {
            var disposable = disposableEmpty, resource, source;
            try {
              resource = resourceFactory();
              resource && (disposable = resource);
              source = observableFactory(resource)
            } catch (exception) {
              return new CompositeDisposable(observableThrow(exception).subscribe(observer), disposable)
            }
            return new CompositeDisposable(source.subscribe(observer), disposable)
          })
        };
        observableProto.amb = function (rightSource) {
          var leftSource = this;
          return new AnonymousObservable(function (observer) {
            var choice, leftChoice = "L", rightChoice = "R", leftSubscription = new SingleAssignmentDisposable, rightSubscription = new SingleAssignmentDisposable;
            isPromise(rightSource) && (rightSource = observableFromPromise(rightSource));
            function choiceL() {
              if (!choice) {
                choice = leftChoice;
                rightSubscription.dispose()
              }
            }

            function choiceR() {
              if (!choice) {
                choice = rightChoice;
                leftSubscription.dispose()
              }
            }

            leftSubscription.setDisposable(leftSource.subscribe(function (left) {
              choiceL();
              if (choice === leftChoice) {
                observer.onNext(left)
              }
            }, function (err) {
              choiceL();
              if (choice === leftChoice) {
                observer.onError(err)
              }
            }, function () {
              choiceL();
              if (choice === leftChoice) {
                observer.onCompleted()
              }
            }));
            rightSubscription.setDisposable(rightSource.subscribe(function (right) {
              choiceR();
              if (choice === rightChoice) {
                observer.onNext(right)
              }
            }, function (err) {
              choiceR();
              if (choice === rightChoice) {
                observer.onError(err)
              }
            }, function () {
              choiceR();
              if (choice === rightChoice) {
                observer.onCompleted()
              }
            }));
            return new CompositeDisposable(leftSubscription, rightSubscription)
          })
        };
        Observable.amb = function () {
          var acc = observableNever(), items = argsOrArray(arguments, 0);

          function func(previous, current) {
            return previous.amb(current)
          }

          for (var i = 0, len = items.length; i < len; i++) {
            acc = func(acc, items[i])
          }
          return acc
        };
        function observableCatchHandler(source, handler) {
          return new AnonymousObservable(function (observer) {
            var d1 = new SingleAssignmentDisposable, subscription = new SerialDisposable;
            subscription.setDisposable(d1);
            d1.setDisposable(source.subscribe(observer.onNext.bind(observer), function (exception) {
              var d, result;
              try {
                result = handler(exception)
              } catch (ex) {
                observer.onError(ex);
                return
              }
              isPromise(result) && (result = observableFromPromise(result));
              d = new SingleAssignmentDisposable;
              subscription.setDisposable(d);
              d.setDisposable(result.subscribe(observer))
            }, observer.onCompleted.bind(observer)));
            return subscription
          }, source)
        }

        observableProto["catch"] = observableProto.catchError = function (handlerOrSecond) {
          return typeof handlerOrSecond === "function" ? observableCatchHandler(this, handlerOrSecond) : observableCatch([this, handlerOrSecond])
        };
        observableProto.catchException = function (handlerOrSecond) {
          return this.catchError(handlerOrSecond)
        };
        var observableCatch = Observable.catchError = Observable["catch"] = function () {
          return enumerableOf(argsOrArray(arguments, 0)).catchError()
        };
        Observable.catchException = function () {
          return observableCatch.apply(null, arguments)
        };
        observableProto.combineLatest = function () {
          var args = slice.call(arguments);
          if (Array.isArray(args[0])) {
            args[0].unshift(this)
          } else {
            args.unshift(this)
          }
          return combineLatest.apply(this, args)
        };
        var combineLatest = Observable.combineLatest = function () {
          var args = slice.call(arguments), resultSelector = args.pop();
          if (Array.isArray(args[0])) {
            args = args[0]
          }
          return new AnonymousObservable(function (observer) {
            var falseFactory = function () {
              return false
            }, n = args.length, hasValue = arrayInitialize(n, falseFactory), hasValueAll = false, isDone = arrayInitialize(n, falseFactory), values = new Array(n);

            function next(i) {
              var res;
              hasValue[i] = true;
              if (hasValueAll || (hasValueAll = hasValue.every(identity))) {
                try {
                  res = resultSelector.apply(null, values)
                } catch (ex) {
                  observer.onError(ex);
                  return
                }
                observer.onNext(res)
              } else if (isDone.filter(function (x, j) {
                  return j !== i
                }).every(identity)) {
                observer.onCompleted()
              }
            }

            function done(i) {
              isDone[i] = true;
              if (isDone.every(identity)) {
                observer.onCompleted()
              }
            }

            var subscriptions = new Array(n);
            for (var idx = 0; idx < n; idx++) {
              (function (i) {
                var source = args[i], sad = new SingleAssignmentDisposable;
                isPromise(source) && (source = observableFromPromise(source));
                sad.setDisposable(source.subscribe(function (x) {
                  values[i] = x;
                  next(i)
                }, function (e) {
                  observer.onError(e)
                }, function () {
                  done(i)
                }));
                subscriptions[i] = sad
              })(idx)
            }
            return new CompositeDisposable(subscriptions)
          }, this)
        };
        observableProto.concat = function () {
          var items = slice.call(arguments, 0);
          items.unshift(this);
          return observableConcat.apply(this, items)
        };
        var observableConcat = Observable.concat = function () {
          return enumerableOf(argsOrArray(arguments, 0)).concat()
        };
        observableProto.concatAll = function () {
          return this.merge(1)
        };
        observableProto.concatObservable = function () {
          return this.merge(1)
        };
        observableProto.merge = function (maxConcurrentOrOther) {
          if (typeof maxConcurrentOrOther !== "number") {
            return observableMerge(this, maxConcurrentOrOther)
          }
          var sources = this;
          return new AnonymousObservable(function (o) {
            var activeCount = 0, group = new CompositeDisposable, isStopped = false, q = [];

            function subscribe(xs) {
              var subscription = new SingleAssignmentDisposable;
              group.add(subscription);
              isPromise(xs) && (xs = observableFromPromise(xs));
              subscription.setDisposable(xs.subscribe(function (x) {
                o.onNext(x)
              }, function (e) {
                o.onError(e)
              }, function () {
                group.remove(subscription);
                if (q.length > 0) {
                  subscribe(q.shift())
                } else {
                  activeCount--;
                  isStopped && activeCount === 0 && o.onCompleted()
                }
              }))
            }

            group.add(sources.subscribe(function (innerSource) {
              if (activeCount < maxConcurrentOrOther) {
                activeCount++;
                subscribe(innerSource)
              } else {
                q.push(innerSource)
              }
            }, function (e) {
              o.onError(e)
            }, function () {
              isStopped = true;
              activeCount === 0 && o.onCompleted()
            }));
            return group
          }, sources)
        };
        var observableMerge = Observable.merge = function () {
          var scheduler, sources;
          if (!arguments[0]) {
            scheduler = immediateScheduler;
            sources = slice.call(arguments, 1)
          } else if (isScheduler(arguments[0])) {
            scheduler = arguments[0];
            sources = slice.call(arguments, 1)
          } else {
            scheduler = immediateScheduler;
            sources = slice.call(arguments, 0)
          }
          if (Array.isArray(sources[0])) {
            sources = sources[0]
          }
          return observableOf(scheduler, sources).mergeAll()
        };
        observableProto.mergeAll = function () {
          var sources = this;
          return new AnonymousObservable(function (o) {
            var group = new CompositeDisposable, isStopped = false, m = new SingleAssignmentDisposable;
            group.add(m);
            m.setDisposable(sources.subscribe(function (innerSource) {
              var innerSubscription = new SingleAssignmentDisposable;
              group.add(innerSubscription);
              isPromise(innerSource) && (innerSource = observableFromPromise(innerSource));
              innerSubscription.setDisposable(innerSource.subscribe(function (x) {
                o.onNext(x)
              }, function (e) {
                o.onError(e)
              }, function () {
                group.remove(innerSubscription);
                isStopped && group.length === 1 && o.onCompleted()
              }))
            }, function (e) {
              o.onError(e)
            }, function () {
              isStopped = true;
              group.length === 1 && o.onCompleted()
            }));
            return group
          }, sources)
        };
        observableProto.mergeObservable = function () {
          return this.mergeAll.apply(this, arguments)
        };
        observableProto.onErrorResumeNext = function (second) {
          if (!second) {
            throw new Error("Second observable is required")
          }
          return onErrorResumeNext([this, second])
        };
        var onErrorResumeNext = Observable.onErrorResumeNext = function () {
          var sources = argsOrArray(arguments, 0);
          return new AnonymousObservable(function (observer) {
            var pos = 0, subscription = new SerialDisposable, cancelable = immediateScheduler.scheduleRecursive(function (self) {
              var current, d;
              if (pos < sources.length) {
                current = sources[pos++];
                isPromise(current) && (current = observableFromPromise(current));
                d = new SingleAssignmentDisposable;
                subscription.setDisposable(d);
                d.setDisposable(current.subscribe(observer.onNext.bind(observer), self, self))
              } else {
                observer.onCompleted()
              }
            });
            return new CompositeDisposable(subscription, cancelable)
          })
        };
        observableProto.skipUntil = function (other) {
          var source = this;
          return new AnonymousObservable(function (o) {
            var isOpen = false;
            var disposables = new CompositeDisposable(source.subscribe(function (left) {
              isOpen && o.onNext(left)
            }, function (e) {
              o.onError(e)
            }, function () {
              isOpen && o.onCompleted()
            }));
            isPromise(other) && (other = observableFromPromise(other));
            var rightSubscription = new SingleAssignmentDisposable;
            disposables.add(rightSubscription);
            rightSubscription.setDisposable(other.subscribe(function () {
              isOpen = true;
              rightSubscription.dispose()
            }, function (e) {
              o.onError(e)
            }, function () {
              rightSubscription.dispose()
            }));
            return disposables
          }, source)
        };
        observableProto["switch"] = observableProto.switchLatest = function () {
          var sources = this;
          return new AnonymousObservable(function (observer) {
            var hasLatest = false, innerSubscription = new SerialDisposable, isStopped = false, latest = 0, subscription = sources.subscribe(function (innerSource) {
              var d = new SingleAssignmentDisposable, id = ++latest;
              hasLatest = true;
              innerSubscription.setDisposable(d);
              isPromise(innerSource) && (innerSource = observableFromPromise(innerSource));
              d.setDisposable(innerSource.subscribe(function (x) {
                latest === id && observer.onNext(x)
              }, function (e) {
                latest === id && observer.onError(e)
              }, function () {
                if (latest === id) {
                  hasLatest = false;
                  isStopped && observer.onCompleted()
                }
              }))
            }, observer.onError.bind(observer), function () {
              isStopped = true;
              !hasLatest && observer.onCompleted()
            });
            return new CompositeDisposable(subscription, innerSubscription)
          }, sources)
        };
        observableProto.takeUntil = function (other) {
          var source = this;
          return new AnonymousObservable(function (o) {
            isPromise(other) && (other = observableFromPromise(other));
            return new CompositeDisposable(source.subscribe(o), other.subscribe(function () {
              o.onCompleted()
            }, function (e) {
              o.onError(e)
            }, noop))
          }, source)
        };
        observableProto.withLatestFrom = function () {
          var source = this;
          var args = slice.call(arguments);
          var resultSelector = args.pop();
          if (typeof source === "undefined") {
            throw new Error("Source observable not found for withLatestFrom().")
          }
          if (typeof resultSelector !== "function") {
            throw new Error("withLatestFrom() expects a resultSelector function.")
          }
          if (Array.isArray(args[0])) {
            args = args[0]
          }
          return new AnonymousObservable(function (observer) {
            var falseFactory = function () {
              return false
            }, n = args.length, hasValue = arrayInitialize(n, falseFactory), hasValueAll = false, values = new Array(n);
            var subscriptions = new Array(n + 1);
            for (var idx = 0; idx < n; idx++) {
              (function (i) {
                var other = args[i], sad = new SingleAssignmentDisposable;
                isPromise(other) && (other = observableFromPromise(other));
                sad.setDisposable(other.subscribe(function (x) {
                  values[i] = x;
                  hasValue[i] = true;
                  hasValueAll = hasValue.every(identity)
                }, observer.onError.bind(observer), function () {
                }));
                subscriptions[i] = sad
              })(idx)
            }
            var sad = new SingleAssignmentDisposable;
            sad.setDisposable(source.subscribe(function (x) {
              var res;
              var allValues = [x].concat(values);
              if (!hasValueAll)return;
              try {
                res = resultSelector.apply(null, allValues)
              } catch (ex) {
                observer.onError(ex);
                return
              }
              observer.onNext(res)
            }, observer.onError.bind(observer), function () {
              observer.onCompleted()
            }));
            subscriptions[n] = sad;
            return new CompositeDisposable(subscriptions)
          }, this)
        };
        function zipArray(second, resultSelector) {
          var first = this;
          return new AnonymousObservable(function (observer) {
            var index = 0, len = second.length;
            return first.subscribe(function (left) {
              if (index < len) {
                var right = second[index++], result;
                try {
                  result = resultSelector(left, right)
                } catch (e) {
                  observer.onError(e);
                  return
                }
                observer.onNext(result)
              } else {
                observer.onCompleted()
              }
            }, function (e) {
              observer.onError(e)
            }, function () {
              observer.onCompleted()
            })
          }, first)
        }

        observableProto.zip = function () {
          if (Array.isArray(arguments[0])) {
            return zipArray.apply(this, arguments)
          }
          var parent = this, sources = slice.call(arguments), resultSelector = sources.pop();
          sources.unshift(parent);
          return new AnonymousObservable(function (observer) {
            var n = sources.length, queues = arrayInitialize(n, function () {
              return []
            }), isDone = arrayInitialize(n, function () {
              return false
            });

            function next(i) {
              var res, queuedValues;
              if (queues.every(function (x) {
                  return x.length > 0
                })) {
                try {
                  queuedValues = queues.map(function (x) {
                    return x.shift()
                  });
                  res = resultSelector.apply(parent, queuedValues)
                } catch (ex) {
                  observer.onError(ex);
                  return
                }
                observer.onNext(res)
              } else if (isDone.filter(function (x, j) {
                  return j !== i
                }).every(identity)) {
                observer.onCompleted()
              }
            }

            function done(i) {
              isDone[i] = true;
              if (isDone.every(function (x) {
                  return x
                })) {
                observer.onCompleted()
              }
            }

            var subscriptions = new Array(n);
            for (var idx = 0; idx < n; idx++) {
              (function (i) {
                var source = sources[i], sad = new SingleAssignmentDisposable;
                isPromise(source) && (source = observableFromPromise(source));
                sad.setDisposable(source.subscribe(function (x) {
                  queues[i].push(x);
                  next(i)
                }, function (e) {
                  observer.onError(e)
                }, function () {
                  done(i)
                }));
                subscriptions[i] = sad
              })(idx)
            }
            return new CompositeDisposable(subscriptions)
          }, parent)
        };
        Observable.zip = function () {
          var args = slice.call(arguments, 0), first = args.shift();
          return first.zip.apply(first, args)
        };
        Observable.zipArray = function () {
          var sources = argsOrArray(arguments, 0);
          return new AnonymousObservable(function (observer) {
            var n = sources.length, queues = arrayInitialize(n, function () {
              return []
            }), isDone = arrayInitialize(n, function () {
              return false
            });

            function next(i) {
              if (queues.every(function (x) {
                  return x.length > 0
                })) {
                var res = queues.map(function (x) {
                  return x.shift()
                });
                observer.onNext(res)
              } else if (isDone.filter(function (x, j) {
                  return j !== i
                }).every(identity)) {
                observer.onCompleted();
                return
              }
            }

            function done(i) {
              isDone[i] = true;
              if (isDone.every(identity)) {
                observer.onCompleted();
                return
              }
            }

            var subscriptions = new Array(n);
            for (var idx = 0; idx < n; idx++) {
              (function (i) {
                subscriptions[i] = new SingleAssignmentDisposable;
                subscriptions[i].setDisposable(sources[i].subscribe(function (x) {
                  queues[i].push(x);
                  next(i)
                }, function (e) {
                  observer.onError(e)
                }, function () {
                  done(i)
                }))
              })(idx)
            }
            return new CompositeDisposable(subscriptions)
          })
        };
        observableProto.asObservable = function () {
          var source = this;
          return new AnonymousObservable(function (o) {
            return source.subscribe(o)
          }, this)
        };
        observableProto.bufferWithCount = function (count, skip) {
          if (typeof skip !== "number") {
            skip = count
          }
          return this.windowWithCount(count, skip).selectMany(function (x) {
            return x.toArray()
          }).where(function (x) {
            return x.length > 0
          })
        };
        observableProto.dematerialize = function () {
          var source = this;
          return new AnonymousObservable(function (o) {
            return source.subscribe(function (x) {
              return x.accept(o)
            }, function (e) {
              o.onError(e)
            }, function () {
              o.onCompleted()
            })
          }, this)
        };
        observableProto.distinctUntilChanged = function (keySelector, comparer) {
          var source = this;
          keySelector || (keySelector = identity);
          comparer || (comparer = defaultComparer);
          return new AnonymousObservable(function (o) {
            var hasCurrentKey = false, currentKey;
            return source.subscribe(function (value) {
              var comparerEquals = false, key;
              try {
                key = keySelector(value)
              } catch (e) {
                o.onError(e);
                return
              }
              if (hasCurrentKey) {
                try {
                  comparerEquals = comparer(currentKey, key)
                } catch (e) {
                  o.onError(e);
                  return
                }
              }
              if (!hasCurrentKey || !comparerEquals) {
                hasCurrentKey = true;
                currentKey = key;
                o.onNext(value)
              }
            }, function (e) {
              o.onError(e)
            }, function () {
              o.onCompleted()
            })
          }, this)
        };
        observableProto["do"] = observableProto.tap = function (observerOrOnNext, onError, onCompleted) {
          var source = this, onNextFunc;
          if (typeof observerOrOnNext === "function") {
            onNextFunc = observerOrOnNext
          } else {
            onNextFunc = function (x) {
              observerOrOnNext.onNext(x)
            };
            onError = function (e) {
              observerOrOnNext.onError(e)
            };
            onCompleted = function () {
              observerOrOnNext.onCompleted()
            }
          }
          return new AnonymousObservable(function (observer) {
            return source.subscribe(function (x) {
              try {
                onNextFunc(x)
              } catch (e) {
                observer.onError(e)
              }
              observer.onNext(x)
            }, function (err) {
              if (onError) {
                try {
                  onError(err)
                } catch (e) {
                  observer.onError(e)
                }
              }
              observer.onError(err)
            }, function () {
              if (onCompleted) {
                try {
                  onCompleted()
                } catch (e) {
                  observer.onError(e)
                }
              }
              observer.onCompleted()
            })
          }, this)
        };
        observableProto.doAction = function () {
          return this.tap.apply(this, arguments)
        };
        observableProto.doOnNext = observableProto.tapOnNext = function (onNext, thisArg) {
          return this.tap(typeof thisArg !== "undefined" ? function (x) {
            onNext.call(thisArg, x)
          } : onNext)
        };
        observableProto.doOnError = observableProto.tapOnError = function (onError, thisArg) {
          return this.tap(noop, typeof thisArg !== "undefined" ? function (e) {
            onError.call(thisArg, e)
          } : onError)
        };
        observableProto.doOnCompleted = observableProto.tapOnCompleted = function (onCompleted, thisArg) {
          return this.tap(noop, null, typeof thisArg !== "undefined" ? function () {
            onCompleted.call(thisArg)
          } : onCompleted)
        };
        observableProto["finally"] = observableProto.ensure = function (action) {
          var source = this;
          return new AnonymousObservable(function (observer) {
            var subscription;
            try {
              subscription = source.subscribe(observer)
            } catch (e) {
              action();
              throw e
            }
            return disposableCreate(function () {
              try {
                subscription.dispose()
              } catch (e) {
                throw e
              } finally {
                action()
              }
            })
          }, this)
        };
        observableProto.finallyAction = function (action) {
          return this.ensure(action)
        };
        observableProto.ignoreElements = function () {
          var source = this;
          return new AnonymousObservable(function (o) {
            return source.subscribe(noop, function (e) {
              o.onError(e)
            }, function () {
              o.onCompleted()
            })
          }, source)
        };
        observableProto.materialize = function () {
          var source = this;
          return new AnonymousObservable(function (observer) {
            return source.subscribe(function (value) {
              observer.onNext(notificationCreateOnNext(value))
            }, function (e) {
              observer.onNext(notificationCreateOnError(e));
              observer.onCompleted()
            }, function () {
              observer.onNext(notificationCreateOnCompleted());
              observer.onCompleted()
            })
          }, source)
        };
        observableProto.repeat = function (repeatCount) {
          return enumerableRepeat(this, repeatCount).concat()
        };
        observableProto.retry = function (retryCount) {
          return enumerableRepeat(this, retryCount).catchError()
        };
        observableProto.retryWhen = function (notifier) {
          return enumerableRepeat(this).catchErrorWhen(notifier)
        };
        observableProto.scan = function () {
          var hasSeed = false, seed, accumulator, source = this;
          if (arguments.length === 2) {
            hasSeed = true;
            seed = arguments[0];
            accumulator = arguments[1]
          } else {
            accumulator = arguments[0]
          }
          return new AnonymousObservable(function (o) {
            var hasAccumulation, accumulation, hasValue;
            return source.subscribe(function (x) {
              !hasValue && (hasValue = true);
              try {
                if (hasAccumulation) {
                  accumulation = accumulator(accumulation, x)
                } else {
                  accumulation = hasSeed ? accumulator(seed, x) : x;
                  hasAccumulation = true
                }
              } catch (e) {
                o.onError(e);
                return
              }
              o.onNext(accumulation)
            }, function (e) {
              o.onError(e)
            }, function () {
              !hasValue && hasSeed && o.onNext(seed);
              o.onCompleted()
            })
          }, source)
        };
        observableProto.skipLast = function (count) {
          var source = this;
          return new AnonymousObservable(function (o) {
            var q = [];
            return source.subscribe(function (x) {
              q.push(x);
              q.length > count && o.onNext(q.shift())
            }, function (e) {
              o.onError(e)
            }, function () {
              o.onCompleted()
            })
          }, source)
        };
        observableProto.startWith = function () {
          var values, scheduler, start = 0;
          if (!!arguments.length && isScheduler(arguments[0])) {
            scheduler = arguments[0];
            start = 1
          } else {
            scheduler = immediateScheduler
          }
          values = slice.call(arguments, start);
          return enumerableOf([observableFromArray(values, scheduler), this]).concat()
        };
        observableProto.takeLast = function (count) {
          var source = this;
          return new AnonymousObservable(function (o) {
            var q = [];
            return source.subscribe(function (x) {
              q.push(x);
              q.length > count && q.shift()
            }, function (e) {
              o.onError(e)
            }, function () {
              while (q.length > 0) {
                o.onNext(q.shift())
              }
              o.onCompleted()
            })
          }, source)
        };
        observableProto.takeLastBuffer = function (count) {
          var source = this;
          return new AnonymousObservable(function (o) {
            var q = [];
            return source.subscribe(function (x) {
              q.push(x);
              q.length > count && q.shift()
            }, function (e) {
              o.onError(e)
            }, function () {
              o.onNext(q);
              o.onCompleted()
            })
          }, source)
        };
        observableProto.windowWithCount = function (count, skip) {
          var source = this;
          +count || (count = 0);
          Math.abs(count) === Infinity && (count = 0);
          if (count <= 0) {
            throw new Error(argumentOutOfRange)
          }
          skip == null && (skip = count);
          +skip || (skip = 0);
          Math.abs(skip) === Infinity && (skip = 0);
          if (skip <= 0) {
            throw new Error(argumentOutOfRange)
          }
          return new AnonymousObservable(function (observer) {
            var m = new SingleAssignmentDisposable, refCountDisposable = new RefCountDisposable(m), n = 0, q = [];

            function createWindow() {
              var s = new Subject;
              q.push(s);
              observer.onNext(addRef(s, refCountDisposable))
            }

            createWindow();
            m.setDisposable(source.subscribe(function (x) {
              for (var i = 0, len = q.length; i < len; i++) {
                q[i].onNext(x)
              }
              var c = n - count + 1;
              c >= 0 && c % skip === 0 && q.shift().onCompleted();
              ++n % skip === 0 && createWindow()
            }, function (e) {
              while (q.length > 0) {
                q.shift().onError(e)
              }
              observer.onError(e)
            }, function () {
              while (q.length > 0) {
                q.shift().onCompleted()
              }
              observer.onCompleted()
            }));
            return refCountDisposable
          }, source)
        };
        function concatMap(source, selector, thisArg) {
          var selectorFunc = bindCallback(selector, thisArg, 3);
          return source.map(function (x, i) {
            var result = selectorFunc(x, i, source);
            isPromise(result) && (result = observableFromPromise(result));
            (isArrayLike(result) || isIterable(result)) && (result = observableFrom(result));
            return result
          }).concatAll()
        }

        observableProto.selectConcat = observableProto.concatMap = function (selector, resultSelector, thisArg) {
          if (isFunction(selector) && isFunction(resultSelector)) {
            return this.concatMap(function (x, i) {
              var selectorResult = selector(x, i);
              isPromise(selectorResult) && (selectorResult = observableFromPromise(selectorResult));
              (isArrayLike(selectorResult) || isIterable(selectorResult)) && (selectorResult = observableFrom(selectorResult));
              return selectorResult.map(function (y, i2) {
                return resultSelector(x, y, i, i2)
              })
            })
          }
          return isFunction(selector) ? concatMap(this, selector, thisArg) : concatMap(this, function () {
            return selector
          })
        };
        observableProto.concatMapObserver = observableProto.selectConcatObserver = function (onNext, onError, onCompleted, thisArg) {
          var source = this, onNextFunc = bindCallback(onNext, thisArg, 2), onErrorFunc = bindCallback(onError, thisArg, 1), onCompletedFunc = bindCallback(onCompleted, thisArg, 0);
          return new AnonymousObservable(function (observer) {
            var index = 0;
            return source.subscribe(function (x) {
              var result;
              try {
                result = onNextFunc(x, index++)
              } catch (e) {
                observer.onError(e);
                return
              }
              isPromise(result) && (result = observableFromPromise(result));
              observer.onNext(result)
            }, function (err) {
              var result;
              try {
                result = onErrorFunc(err)
              } catch (e) {
                observer.onError(e);
                return
              }
              isPromise(result) && (result = observableFromPromise(result));
              observer.onNext(result);
              observer.onCompleted()
            }, function () {
              var result;
              try {
                result = onCompletedFunc()
              } catch (e) {
                observer.onError(e);
                return
              }
              isPromise(result) && (result = observableFromPromise(result));
              observer.onNext(result);
              observer.onCompleted()
            })
          }, this).concatAll()
        };
        observableProto.defaultIfEmpty = function (defaultValue) {
          var source = this;
          defaultValue === undefined && (defaultValue = null);
          return new AnonymousObservable(function (observer) {
            var found = false;
            return source.subscribe(function (x) {
              found = true;
              observer.onNext(x)
            }, function (e) {
              observer.onError(e)
            }, function () {
              !found && observer.onNext(defaultValue);
              observer.onCompleted()
            })
          }, source)
        };
        function arrayIndexOfComparer(array, item, comparer) {
          for (var i = 0, len = array.length; i < len; i++) {
            if (comparer(array[i], item)) {
              return i
            }
          }
          return -1
        }

        function HashSet(comparer) {
          this.comparer = comparer;
          this.set = []
        }

        HashSet.prototype.push = function (value) {
          var retValue = arrayIndexOfComparer(this.set, value, this.comparer) === -1;
          retValue && this.set.push(value);
          return retValue
        };
        observableProto.distinct = function (keySelector, comparer) {
          var source = this;
          comparer || (comparer = defaultComparer);
          return new AnonymousObservable(function (o) {
            var hashSet = new HashSet(comparer);
            return source.subscribe(function (x) {
              var key = x;
              if (keySelector) {
                try {
                  key = keySelector(x)
                } catch (e) {
                  o.onError(e);
                  return
                }
              }
              hashSet.push(key) && o.onNext(x)
            }, function (e) {
              o.onError(e)
            }, function () {
              o.onCompleted()
            })
          }, this)
        };
        observableProto.groupBy = function (keySelector, elementSelector, comparer) {
          return this.groupByUntil(keySelector, elementSelector, observableNever, comparer)
        };
        observableProto.groupByUntil = function (keySelector, elementSelector, durationSelector, comparer) {
          var source = this;
          elementSelector || (elementSelector = identity);
          comparer || (comparer = defaultComparer);
          return new AnonymousObservable(function (observer) {
            function handleError(e) {
              return function (item) {
                item.onError(e)
              }
            }

            var map = new Dictionary(0, comparer), groupDisposable = new CompositeDisposable, refCountDisposable = new RefCountDisposable(groupDisposable);
            groupDisposable.add(source.subscribe(function (x) {
              var key;
              try {
                key = keySelector(x)
              } catch (e) {
                map.getValues().forEach(handleError(e));
                observer.onError(e);
                return
              }
              var fireNewMapEntry = false, writer = map.tryGetValue(key);
              if (!writer) {
                writer = new Subject;
                map.set(key, writer);
                fireNewMapEntry = true
              }
              if (fireNewMapEntry) {
                var group = new GroupedObservable(key, writer, refCountDisposable), durationGroup = new GroupedObservable(key, writer);
                try {
                  duration = durationSelector(durationGroup)
                } catch (e) {
                  map.getValues().forEach(handleError(e));
                  observer.onError(e);
                  return
                }
                observer.onNext(group);
                var md = new SingleAssignmentDisposable;
                groupDisposable.add(md);
                var expire = function () {
                  map.remove(key) && writer.onCompleted();
                  groupDisposable.remove(md)
                };
                md.setDisposable(duration.take(1).subscribe(noop, function (exn) {
                  map.getValues().forEach(handleError(exn));
                  observer.onError(exn)
                }, expire))
              }
              var element;
              try {
                element = elementSelector(x)
              } catch (e) {
                map.getValues().forEach(handleError(e));
                observer.onError(e);
                return
              }
              writer.onNext(element)
            }, function (ex) {
              map.getValues().forEach(handleError(ex));
              observer.onError(ex)
            }, function () {
              map.getValues().forEach(function (item) {
                item.onCompleted()
              });
              observer.onCompleted()
            }));
            return refCountDisposable
          }, source)
        };
        observableProto.select = observableProto.map = function (selector, thisArg) {
          var selectorFn = isFunction(selector) ? bindCallback(selector, thisArg, 3) : function () {
            return selector
          }, source = this;
          return new AnonymousObservable(function (o) {
            var count = 0;
            return source.subscribe(function (value) {
              try {
                var result = selectorFn(value, count++, source)
              } catch (e) {
                o.onError(e);
                return
              }
              o.onNext(result)
            }, function (e) {
              o.onError(e)
            }, function () {
              o.onCompleted()
            })
          }, source)
        };
        observableProto.pluck = function (prop) {
          return this.map(function (x) {
            return x[prop]
          })
        };
        function flatMap(source, selector, thisArg) {
          var selectorFunc = bindCallback(selector, thisArg, 3);
          return source.map(function (x, i) {
            var result = selectorFunc(x, i, source);
            isPromise(result) && (result = observableFromPromise(result));
            (isArrayLike(result) || isIterable(result)) && (result = observableFrom(result));
            return result
          }).mergeAll()
        }

        observableProto.selectMany = observableProto.flatMap = function (selector, resultSelector, thisArg) {
          if (isFunction(selector) && isFunction(resultSelector)) {
            return this.flatMap(function (x, i) {
              var selectorResult = selector(x, i);
              isPromise(selectorResult) && (selectorResult = observableFromPromise(selectorResult));
              (isArrayLike(selectorResult) || isIterable(selectorResult)) && (selectorResult = observableFrom(selectorResult));
              return selectorResult.map(function (y, i2) {
                return resultSelector(x, y, i, i2)
              })
            }, thisArg)
          }
          return isFunction(selector) ? flatMap(this, selector, thisArg) : flatMap(this, function () {
            return selector
          })
        };
        observableProto.flatMapObserver = observableProto.selectManyObserver = function (onNext, onError, onCompleted, thisArg) {
          var source = this;
          return new AnonymousObservable(function (observer) {
            var index = 0;
            return source.subscribe(function (x) {
              var result;
              try {
                result = onNext.call(thisArg, x, index++)
              } catch (e) {
                observer.onError(e);
                return
              }
              isPromise(result) && (result = observableFromPromise(result));
              observer.onNext(result)
            }, function (err) {
              var result;
              try {
                result = onError.call(thisArg, err)
              } catch (e) {
                observer.onError(e);
                return
              }
              isPromise(result) && (result = observableFromPromise(result));
              observer.onNext(result);
              observer.onCompleted()
            }, function () {
              var result;
              try {
                result = onCompleted.call(thisArg)
              } catch (e) {
                observer.onError(e);
                return
              }
              isPromise(result) && (result = observableFromPromise(result));
              observer.onNext(result);
              observer.onCompleted()
            })
          }, source).mergeAll()
        };
        observableProto.selectSwitch = observableProto.flatMapLatest = observableProto.switchMap = function (selector, thisArg) {
          return this.select(selector, thisArg).switchLatest()
        };
        observableProto.skip = function (count) {
          if (count < 0) {
            throw new Error(argumentOutOfRange)
          }
          var source = this;
          return new AnonymousObservable(function (o) {
            var remaining = count;
            return source.subscribe(function (x) {
              if (remaining <= 0) {
                o.onNext(x)
              } else {
                remaining--
              }
            }, function (e) {
              o.onError(e)
            }, function () {
              o.onCompleted()
            })
          }, source)
        };
        observableProto.skipWhile = function (predicate, thisArg) {
          var source = this, callback = bindCallback(predicate, thisArg, 3);
          return new AnonymousObservable(function (o) {
            var i = 0, running = false;
            return source.subscribe(function (x) {
              if (!running) {
                try {
                  running = !callback(x, i++, source)
                } catch (e) {
                  o.onError(e);
                  return
                }
              }
              running && o.onNext(x)
            }, function (e) {
              o.onError(e)
            }, function () {
              o.onCompleted()
            })
          }, source)
        };
        observableProto.take = function (count, scheduler) {
          if (count < 0) {
            throw new RangeError(argumentOutOfRange)
          }
          if (count === 0) {
            return observableEmpty(scheduler)
          }
          var source = this;
          return new AnonymousObservable(function (o) {
            var remaining = count;
            return source.subscribe(function (x) {
              if (remaining-- > 0) {
                o.onNext(x);
                remaining === 0 && o.onCompleted()
              }
            }, function (e) {
              o.onError(e)
            }, function () {
              o.onCompleted()
            })
          }, source)
        };
        observableProto.takeWhile = function (predicate, thisArg) {
          var source = this, callback = bindCallback(predicate, thisArg, 3);
          return new AnonymousObservable(function (o) {
            var i = 0, running = true;
            return source.subscribe(function (x) {
              if (running) {
                try {
                  running = callback(x, i++, source)
                } catch (e) {
                  o.onError(e);
                  return
                }
                if (running) {
                  o.onNext(x)
                } else {
                  o.onCompleted()
                }
              }
            }, function (e) {
              o.onError(e)
            }, function () {
              o.onCompleted()
            })
          }, source)
        };
        observableProto.where = observableProto.filter = function (predicate, thisArg) {
          var source = this;
          predicate = bindCallback(predicate, thisArg, 3);
          return new AnonymousObservable(function (o) {
            var count = 0;
            return source.subscribe(function (value) {
              try {
                var shouldRun = predicate(value, count++, source)
              } catch (e) {
                o.onError(e);
                return
              }
              shouldRun && o.onNext(value)
            }, function (e) {
              o.onError(e)
            }, function () {
              o.onCompleted()
            })
          }, source)
        };
        function extremaBy(source, keySelector, comparer) {
          return new AnonymousObservable(function (o) {
            var hasValue = false, lastKey = null, list = [];
            return source.subscribe(function (x) {
              var comparison, key;
              try {
                key = keySelector(x)
              } catch (ex) {
                o.onError(ex);
                return
              }
              comparison = 0;
              if (!hasValue) {
                hasValue = true;
                lastKey = key
              } else {
                try {
                  comparison = comparer(key, lastKey)
                } catch (ex1) {
                  o.onError(ex1);
                  return
                }
              }
              if (comparison > 0) {
                lastKey = key;
                list = []
              }
              if (comparison >= 0) {
                list.push(x)
              }
            }, function (e) {
              o.onError(e)
            }, function () {
              o.onNext(list);
              o.onCompleted()
            })
          }, source)
        }

        function firstOnly(x) {
          if (x.length === 0) {
            throw new Error(sequenceContainsNoElements)
          }
          return x[0]
        }

        observableProto.aggregate = function () {
          var hasSeed = false, accumulator, seed, source = this;
          if (arguments.length === 2) {
            hasSeed = true;
            seed = arguments[0];
            accumulator = arguments[1]
          } else {
            accumulator = arguments[0]
          }
          return new AnonymousObservable(function (o) {
            var hasAccumulation, accumulation, hasValue;
            return source.subscribe(function (x) {
              !hasValue && (hasValue = true);
              try {
                if (hasAccumulation) {
                  accumulation = accumulator(accumulation, x)
                } else {
                  accumulation = hasSeed ? accumulator(seed, x) : x;
                  hasAccumulation = true
                }
              } catch (e) {
                o.onError(e);
                return
              }
            }, function (e) {
              o.onError(e)
            }, function () {
              hasValue && o.onNext(accumulation);
              !hasValue && hasSeed && o.onNext(seed);
              !hasValue && !hasSeed && o.onError(new Error(sequenceContainsNoElements));
              o.onCompleted()
            })
          }, source)
        };
        observableProto.reduce = function (accumulator) {
          var hasSeed = false, seed, source = this;
          if (arguments.length === 2) {
            hasSeed = true;
            seed = arguments[1]
          }
          return new AnonymousObservable(function (o) {
            var hasAccumulation, accumulation, hasValue;
            return source.subscribe(function (x) {
              !hasValue && (hasValue = true);
              try {
                if (hasAccumulation) {
                  accumulation = accumulator(accumulation, x)
                } else {
                  accumulation = hasSeed ? accumulator(seed, x) : x;
                  hasAccumulation = true
                }
              } catch (e) {
                o.onError(e);
                return
              }
            }, function (e) {
              o.onError(e)
            }, function () {
              hasValue && o.onNext(accumulation);
              !hasValue && hasSeed && o.onNext(seed);
              !hasValue && !hasSeed && o.onError(new Error(sequenceContainsNoElements));
              o.onCompleted()
            })
          }, source)
        };
        observableProto.some = function (predicate, thisArg) {
          var source = this;
          return predicate ? source.filter(predicate, thisArg).some() : new AnonymousObservable(function (observer) {
            return source.subscribe(function () {
              observer.onNext(true);
              observer.onCompleted()
            }, function (e) {
              observer.onError(e)
            }, function () {
              observer.onNext(false);
              observer.onCompleted()
            })
          }, source)
        };
        observableProto.any = function () {
          return this.some.apply(this, arguments)
        };
        observableProto.isEmpty = function () {
          return this.any().map(not)
        };
        observableProto.every = function (predicate, thisArg) {
          return this.filter(function (v) {
            return !predicate(v)
          }, thisArg).some().map(not)
        };
        observableProto.all = function () {
          return this.every.apply(this, arguments)
        };
        observableProto.contains = function (searchElement, fromIndex) {
          var source = this;

          function comparer(a, b) {
            return a === 0 && b === 0 || (a === b || isNaN(a) && isNaN(b))
          }

          return new AnonymousObservable(function (o) {
            var i = 0, n = +fromIndex || 0;
            Math.abs(n) === Infinity && (n = 0);
            if (n < 0) {
              o.onNext(false);
              o.onCompleted();
              return disposableEmpty
            }
            return source.subscribe(function (x) {
              if (i++ >= n && comparer(x, searchElement)) {
                o.onNext(true);
                o.onCompleted()
              }
            }, function (e) {
              o.onError(e)
            }, function () {
              o.onNext(false);
              o.onCompleted()
            })
          }, this)
        };
        observableProto.count = function (predicate, thisArg) {
          return predicate ? this.filter(predicate, thisArg).count() : this.reduce(function (count) {
            return count + 1
          }, 0)
        };
        observableProto.indexOf = function (searchElement, fromIndex) {
          var source = this;
          return new AnonymousObservable(function (o) {
            var i = 0, n = +fromIndex || 0;
            Math.abs(n) === Infinity && (n = 0);
            if (n < 0) {
              o.onNext(-1);
              o.onCompleted();
              return disposableEmpty
            }
            return source.subscribe(function (x) {
              if (i >= n && x === searchElement) {
                o.onNext(i);
                o.onCompleted()
              }
              i++
            }, function (e) {
              o.onError(e)
            }, function () {
              o.onNext(-1);
              o.onCompleted()
            })
          }, source)
        };
        observableProto.sum = function (keySelector, thisArg) {
          return keySelector && isFunction(keySelector) ? this.map(keySelector, thisArg).sum() : this.reduce(function (prev, curr) {
            return prev + curr
          }, 0)
        };
        observableProto.minBy = function (keySelector, comparer) {
          comparer || (comparer = defaultSubComparer);
          return extremaBy(this, keySelector, function (x, y) {
            return comparer(x, y) * -1
          })
        };
        observableProto.min = function (comparer) {
          return this.minBy(identity, comparer).map(function (x) {
            return firstOnly(x)
          })
        };
        observableProto.maxBy = function (keySelector, comparer) {
          comparer || (comparer = defaultSubComparer);
          return extremaBy(this, keySelector, comparer)
        };
        observableProto.max = function (comparer) {
          return this.maxBy(identity, comparer).map(function (x) {
            return firstOnly(x)
          })
        };
        observableProto.average = function (keySelector, thisArg) {
          return keySelector && isFunction(keySelector) ? this.map(keySelector, thisArg).average() : this.reduce(function (prev, cur) {
            return {sum: prev.sum + cur, count: prev.count + 1}
          }, {sum: 0, count: 0}).map(function (s) {
            if (s.count === 0) {
              throw new Error(sequenceContainsNoElements)
            }
            return s.sum / s.count
          })
        };
        observableProto.sequenceEqual = function (second, comparer) {
          var first = this;
          comparer || (comparer = defaultComparer);
          return new AnonymousObservable(function (o) {
            var donel = false, doner = false, ql = [], qr = [];
            var subscription1 = first.subscribe(function (x) {
              var equal, v;
              if (qr.length > 0) {
                v = qr.shift();
                try {
                  equal = comparer(v, x)
                } catch (e) {
                  o.onError(e);
                  return
                }
                if (!equal) {
                  o.onNext(false);
                  o.onCompleted()
                }
              } else if (doner) {
                o.onNext(false);
                o.onCompleted()
              } else {
                ql.push(x)
              }
            }, function (e) {
              o.onError(e)
            }, function () {
              donel = true;
              if (ql.length === 0) {
                if (qr.length > 0) {
                  o.onNext(false);
                  o.onCompleted()
                } else if (doner) {
                  o.onNext(true);
                  o.onCompleted()
                }
              }
            });
            (isArrayLike(second) || isIterable(second)) && (second = observableFrom(second));
            isPromise(second) && (second = observableFromPromise(second));
            var subscription2 = second.subscribe(function (x) {
              var equal;
              if (ql.length > 0) {
                var v = ql.shift();
                try {
                  equal = comparer(v, x)
                } catch (exception) {
                  o.onError(exception);
                  return
                }
                if (!equal) {
                  o.onNext(false);
                  o.onCompleted()
                }
              } else if (donel) {
                o.onNext(false);
                o.onCompleted()
              } else {
                qr.push(x)
              }
            }, function (e) {
              o.onError(e)
            }, function () {
              doner = true;
              if (qr.length === 0) {
                if (ql.length > 0) {
                  o.onNext(false);
                  o.onCompleted()
                } else if (donel) {
                  o.onNext(true);
                  o.onCompleted()
                }
              }
            });
            return new CompositeDisposable(subscription1, subscription2)
          }, first)
        };
        function elementAtOrDefault(source, index, hasDefault, defaultValue) {
          if (index < 0) {
            throw new Error(argumentOutOfRange)
          }
          return new AnonymousObservable(function (o) {
            var i = index;
            return source.subscribe(function (x) {
              if (i-- === 0) {
                o.onNext(x);
                o.onCompleted()
              }
            }, function (e) {
              o.onError(e)
            }, function () {
              if (!hasDefault) {
                o.onError(new Error(argumentOutOfRange))
              } else {
                o.onNext(defaultValue);
                o.onCompleted()
              }
            })
          }, source)
        }

        observableProto.elementAt = function (index) {
          return elementAtOrDefault(this, index, false)
        };
        observableProto.elementAtOrDefault = function (index, defaultValue) {
          return elementAtOrDefault(this, index, true, defaultValue)
        };
        function singleOrDefaultAsync(source, hasDefault, defaultValue) {
          return new AnonymousObservable(function (o) {
            var value = defaultValue, seenValue = false;
            return source.subscribe(function (x) {
              if (seenValue) {
                o.onError(new Error("Sequence contains more than one element"))
              } else {
                value = x;
                seenValue = true
              }
            }, function (e) {
              o.onError(e)
            }, function () {
              if (!seenValue && !hasDefault) {
                o.onError(new Error(sequenceContainsNoElements))
              } else {
                o.onNext(value);
                o.onCompleted()
              }
            })
          }, source)
        }

        observableProto.single = function (predicate, thisArg) {
          return predicate && isFunction(predicate) ? this.where(predicate, thisArg).single() : singleOrDefaultAsync(this, false)
        };
        observableProto.singleOrDefault = function (predicate, defaultValue, thisArg) {
          return predicate && isFunction(predicate) ? this.filter(predicate, thisArg).singleOrDefault(null, defaultValue) : singleOrDefaultAsync(this, true, defaultValue)
        };
        function firstOrDefaultAsync(source, hasDefault, defaultValue) {
          return new AnonymousObservable(function (o) {
            return source.subscribe(function (x) {
              o.onNext(x);
              o.onCompleted()
            }, function (e) {
              o.onError(e)
            }, function () {
              if (!hasDefault) {
                o.onError(new Error(sequenceContainsNoElements))
              } else {
                o.onNext(defaultValue);
                o.onCompleted()
              }
            })
          }, source)
        }

        observableProto.first = function (predicate, thisArg) {
          return predicate ? this.where(predicate, thisArg).first() : firstOrDefaultAsync(this, false)
        };
        observableProto.firstOrDefault = function (predicate, defaultValue, thisArg) {
          return predicate ? this.where(predicate).firstOrDefault(null, defaultValue) : firstOrDefaultAsync(this, true, defaultValue)
        };
        function lastOrDefaultAsync(source, hasDefault, defaultValue) {
          return new AnonymousObservable(function (o) {
            var value = defaultValue, seenValue = false;
            return source.subscribe(function (x) {
              value = x;
              seenValue = true
            }, function (e) {
              o.onError(e)
            }, function () {
              if (!seenValue && !hasDefault) {
                o.onError(new Error(sequenceContainsNoElements))
              } else {
                o.onNext(value);
                o.onCompleted()
              }
            })
          }, source)
        }

        observableProto.last = function (predicate, thisArg) {
          return predicate ? this.where(predicate, thisArg).last() : lastOrDefaultAsync(this, false)
        };
        observableProto.lastOrDefault = function (predicate, defaultValue, thisArg) {
          return predicate ? this.where(predicate, thisArg).lastOrDefault(null, defaultValue) : lastOrDefaultAsync(this, true, defaultValue)
        };
        function findValue(source, predicate, thisArg, yieldIndex) {
          var callback = bindCallback(predicate, thisArg, 3);
          return new AnonymousObservable(function (o) {
            var i = 0;
            return source.subscribe(function (x) {
              var shouldRun;
              try {
                shouldRun = callback(x, i, source)
              } catch (e) {
                o.onError(e);
                return
              }
              if (shouldRun) {
                o.onNext(yieldIndex ? i : x);
                o.onCompleted()
              } else {
                i++
              }
            }, function (e) {
              o.onError(e)
            }, function () {
              o.onNext(yieldIndex ? -1 : undefined);
              o.onCompleted()
            })
          }, source)
        }

        observableProto.find = function (predicate, thisArg) {
          return findValue(this, predicate, thisArg, false)
        };
        observableProto.findIndex = function (predicate, thisArg) {
          return findValue(this, predicate, thisArg, true)
        };
        observableProto.toSet = function () {
          if (typeof root.Set === "undefined") {
            throw new TypeError
          }
          var source = this;
          return new AnonymousObservable(function (o) {
            var s = new root.Set;
            return source.subscribe(function (x) {
              s.add(x)
            }, function (e) {
              o.onError(e)
            }, function () {
              o.onNext(s);
              o.onCompleted()
            })
          }, source)
        };
        observableProto.toMap = function (keySelector, elementSelector) {
          if (typeof root.Map === "undefined") {
            throw new TypeError
          }
          var source = this;
          return new AnonymousObservable(function (o) {
            var m = new root.Map;
            return source.subscribe(function (x) {
              var key;
              try {
                key = keySelector(x)
              } catch (e) {
                o.onError(e);
                return
              }
              var element = x;
              if (elementSelector) {
                try {
                  element = elementSelector(x)
                } catch (e) {
                  o.onError(e);
                  return
                }
              }
              m.set(key, element)
            }, function (e) {
              o.onError(e)
            }, function () {
              o.onNext(m);
              o.onCompleted()
            })
          }, source)
        };
        var fnString = "function", throwString = "throw", isObject = Rx.internals.isObject;

        function toThunk(obj, ctx) {
          if (Array.isArray(obj)) {
            return objectToThunk.call(ctx, obj)
          }
          if (isGeneratorFunction(obj)) {
            return observableSpawn(obj.call(ctx))
          }
          if (isGenerator(obj)) {
            return observableSpawn(obj)
          }
          if (isObservable(obj)) {
            return observableToThunk(obj)
          }
          if (isPromise(obj)) {
            return promiseToThunk(obj)
          }
          if (typeof obj === fnString) {
            return obj
          }
          if (isObject(obj) || Array.isArray(obj)) {
            return objectToThunk.call(ctx, obj)
          }
          return obj
        }

        function objectToThunk(obj) {
          var ctx = this;
          return function (done) {
            var keys = Object.keys(obj), pending = keys.length, results = new obj.constructor, finished;
            if (!pending) {
              timeoutScheduler.schedule(function () {
                done(null, results)
              });
              return
            }
            for (var i = 0, len = keys.length; i < len; i++) {
              run(obj[keys[i]], keys[i])
            }
            function run(fn, key) {
              if (finished) {
                return
              }
              try {
                fn = toThunk(fn, ctx);
                if (typeof fn !== fnString) {
                  results[key] = fn;
                  return --pending || done(null, results)
                }
                fn.call(ctx, function (err, res) {
                  if (finished) {
                    return
                  }
                  if (err) {
                    finished = true;
                    return done(err)
                  }
                  results[key] = res;
                  --pending || done(null, results)
                })
              } catch (e) {
                finished = true;
                done(e)
              }
            }
          }
        }

        function observableToThunk(observable) {
          return function (fn) {
            var value, hasValue = false;
            observable.subscribe(function (v) {
              value = v;
              hasValue = true
            }, fn, function () {
              hasValue && fn(null, value)
            })
          }
        }

        function promiseToThunk(promise) {
          return function (fn) {
            promise.then(function (res) {
              fn(null, res)
            }, fn)
          }
        }

        function isObservable(obj) {
          return obj && typeof obj.subscribe === fnString
        }

        function isGeneratorFunction(obj) {
          return obj && obj.constructor && obj.constructor.name === "GeneratorFunction"
        }

        function isGenerator(obj) {
          return obj && typeof obj.next === fnString && typeof obj[throwString] === fnString
        }

        var observableSpawn = Rx.spawn = function (fn) {
          var isGenFun = isGeneratorFunction(fn);
          return function (done) {
            var ctx = this, gen = fn;
            if (isGenFun) {
              var args = slice.call(arguments), len = args.length, hasCallback = len && typeof args[len - 1] === fnString;
              done = hasCallback ? args.pop() : handleError;
              gen = fn.apply(this, args)
            } else {
              done = done || handleError
            }
            next();
            function exit(err, res) {
              timeoutScheduler.schedule(done.bind(ctx, err, res))
            }

            function next(err, res) {
              var ret;
              if (arguments.length > 2) {
                res = slice.call(arguments, 1)
              }
              if (err) {
                try {
                  ret = gen[throwString](err)
                } catch (e) {
                  return exit(e)
                }
              }
              if (!err) {
                try {
                  ret = gen.next(res)
                } catch (e) {
                  return exit(e)
                }
              }
              if (ret.done) {
                return exit(null, ret.value)
              }
              ret.value = toThunk(ret.value, ctx);
              if (typeof ret.value === fnString) {
                var called = false;
                try {
                  ret.value.call(ctx, function () {
                    if (called) {
                      return
                    }
                    called = true;
                    next.apply(ctx, arguments)
                  })
                } catch (e) {
                  timeoutScheduler.schedule(function () {
                    if (called) {
                      return
                    }
                    called = true;
                    next.call(ctx, e)
                  })
                }
                return
              }
              next(new TypeError("Rx.spawn only supports a function, Promise, Observable, Object or Array."))
            }
          }
        };

        function handleError(err) {
          if (!err) {
            return
          }
          timeoutScheduler.schedule(function () {
            throw err
          })
        }

        Observable.start = function (func, context, scheduler) {
          return observableToAsync(func, context, scheduler)()
        };
        var observableToAsync = Observable.toAsync = function (func, context, scheduler) {
          isScheduler(scheduler) || (scheduler = timeoutScheduler);
          return function () {
            var args = arguments, subject = new AsyncSubject;
            scheduler.schedule(function () {
              var result;
              try {
                result = func.apply(context, args)
              } catch (e) {
                subject.onError(e);
                return
              }
              subject.onNext(result);
              subject.onCompleted()
            });
            return subject.asObservable()
          }
        };
        Observable.fromCallback = function (func, context, selector) {
          return function () {
            var args = slice.call(arguments, 0);
            return new AnonymousObservable(function (observer) {
              function handler() {
                var results = arguments;
                if (selector) {
                  try {
                    results = selector(results)
                  } catch (err) {
                    observer.onError(err);
                    return
                  }
                  observer.onNext(results)
                } else {
                  if (results.length <= 1) {
                    observer.onNext.apply(observer, results)
                  } else {
                    observer.onNext(results)
                  }
                }
                observer.onCompleted()
              }

              args.push(handler);
              func.apply(context, args)
            }).publishLast().refCount()
          }
        };
        Observable.fromNodeCallback = function (func, context, selector) {
          return function () {
            var args = slice.call(arguments, 0);
            return new AnonymousObservable(function (observer) {
              function handler(err) {
                if (err) {
                  observer.onError(err);
                  return
                }
                var results = slice.call(arguments, 1);
                if (selector) {
                  try {
                    results = selector(results)
                  } catch (e) {
                    observer.onError(e);
                    return
                  }
                  observer.onNext(results)
                } else {
                  if (results.length <= 1) {
                    observer.onNext.apply(observer, results)
                  } else {
                    observer.onNext(results)
                  }
                }
                observer.onCompleted()
              }

              args.push(handler);
              func.apply(context, args)
            }).publishLast().refCount()
          }
        };
        function createListener(element, name, handler) {
          if (element.addEventListener) {
            element.addEventListener(name, handler, false);
            return disposableCreate(function () {
              element.removeEventListener(name, handler, false)
            })
          }
          throw new Error("No listener found")
        }

        function createEventListener(el, eventName, handler) {
          var disposables = new CompositeDisposable;
          if (Object.prototype.toString.call(el) === "[object NodeList]") {
            for (var i = 0, len = el.length; i < len; i++) {
              disposables.add(createEventListener(el.item(i), eventName, handler))
            }
          } else if (el) {
            disposables.add(createListener(el, eventName, handler))
          }
          return disposables
        }

        Rx.config.useNativeEvents = false;
        Observable.fromEvent = function (element, eventName, selector) {
          if (element.addListener) {
            return fromEventPattern(function (h) {
              element.addListener(eventName, h)
            }, function (h) {
              element.removeListener(eventName, h)
            }, selector)
          }
          if (!Rx.config.useNativeEvents) {
            if (typeof element.on === "function" && typeof element.off === "function") {
              return fromEventPattern(function (h) {
                element.on(eventName, h)
              }, function (h) {
                element.off(eventName, h)
              }, selector)
            }
            if (!!root.Ember && typeof root.Ember.addListener === "function") {
              return fromEventPattern(function (h) {
                Ember.addListener(element, eventName, h)
              }, function (h) {
                Ember.removeListener(element, eventName, h)
              }, selector)
            }
          }
          return new AnonymousObservable(function (observer) {
            return createEventListener(element, eventName, function handler(e) {
              var results = e;
              if (selector) {
                try {
                  results = selector(arguments)
                } catch (err) {
                  observer.onError(err);
                  return
                }
              }
              observer.onNext(results)
            })
          }).publish().refCount()
        };
        var fromEventPattern = Observable.fromEventPattern = function (addHandler, removeHandler, selector) {
          return new AnonymousObservable(function (observer) {
            function innerHandler(e) {
              var result = e;
              if (selector) {
                try {
                  result = selector(arguments)
                } catch (err) {
                  observer.onError(err);
                  return
                }
              }
              observer.onNext(result)
            }

            var returnValue = addHandler(innerHandler);
            return disposableCreate(function () {
              if (removeHandler) {
                removeHandler(innerHandler, returnValue)
              }
            })
          }).publish().refCount()
        };
        Observable.startAsync = function (functionAsync) {
          var promise;
          try {
            promise = functionAsync()
          } catch (e) {
            return observableThrow(e)
          }
          return observableFromPromise(promise)
        };
        var PausableObservable = function (__super__) {
          inherits(PausableObservable, __super__);
          function subscribe(observer) {
            var conn = this.source.publish(), subscription = conn.subscribe(observer), connection = disposableEmpty;
            var pausable = this.pauser.distinctUntilChanged().subscribe(function (b) {
              if (b) {
                connection = conn.connect()
              } else {
                connection.dispose();
                connection = disposableEmpty
              }
            });
            return new CompositeDisposable(subscription, connection, pausable)
          }

          function PausableObservable(source, pauser) {
            this.source = source;
            this.controller = new Subject;
            if (pauser && pauser.subscribe) {
              this.pauser = this.controller.merge(pauser)
            } else {
              this.pauser = this.controller
            }
            __super__.call(this, subscribe, source)
          }

          PausableObservable.prototype.pause = function () {
            this.controller.onNext(false)
          };
          PausableObservable.prototype.resume = function () {
            this.controller.onNext(true)
          };
          return PausableObservable
        }(Observable);
        observableProto.pausable = function (pauser) {
          return new PausableObservable(this, pauser)
        };
        function combineLatestSource(source, subject, resultSelector) {
          return new AnonymousObservable(function (o) {
            var hasValue = [false, false], hasValueAll = false, isDone = false, values = new Array(2), err;

            function next(x, i) {
              values[i] = x;
              var res;
              hasValue[i] = true;
              if (hasValueAll || (hasValueAll = hasValue.every(identity))) {
                if (err) {
                  o.onError(err);
                  return
                }
                try {
                  res = resultSelector.apply(null, values)
                } catch (ex) {
                  o.onError(ex);
                  return
                }
                o.onNext(res)
              }
              if (isDone && values[1]) {
                o.onCompleted()
              }
            }

            return new CompositeDisposable(source.subscribe(function (x) {
              next(x, 0)
            }, function (e) {
              if (values[1]) {
                o.onError(e)
              } else {
                err = e
              }
            }, function () {
              isDone = true;
              values[1] && o.onCompleted()
            }), subject.subscribe(function (x) {
              next(x, 1)
            }, function (e) {
              o.onError(e)
            }, function () {
              isDone = true;
              next(true, 1)
            }))
          }, source)
        }

        var PausableBufferedObservable = function (__super__) {
          inherits(PausableBufferedObservable, __super__);
          function subscribe(o) {
            var q = [], previousShouldFire;
            var subscription = combineLatestSource(this.source, this.pauser.distinctUntilChanged().startWith(false), function (data, shouldFire) {
              return {data: data, shouldFire: shouldFire}
            }).subscribe(function (results) {
              if (previousShouldFire !== undefined && results.shouldFire != previousShouldFire) {
                previousShouldFire = results.shouldFire;
                if (results.shouldFire) {
                  while (q.length > 0) {
                    o.onNext(q.shift())
                  }
                }
              } else {
                previousShouldFire = results.shouldFire;
                if (results.shouldFire) {
                  o.onNext(results.data)
                } else {
                  q.push(results.data)
                }
              }
            }, function (err) {
              while (q.length > 0) {
                o.onNext(q.shift())
              }
              o.onError(err)
            }, function () {
              while (q.length > 0) {
                o.onNext(q.shift())
              }
              o.onCompleted()
            });
            return subscription
          }

          function PausableBufferedObservable(source, pauser) {
            this.source = source;
            this.controller = new Subject;
            if (pauser && pauser.subscribe) {
              this.pauser = this.controller.merge(pauser)
            } else {
              this.pauser = this.controller
            }
            __super__.call(this, subscribe, source)
          }

          PausableBufferedObservable.prototype.pause = function () {
            this.controller.onNext(false)
          };
          PausableBufferedObservable.prototype.resume = function () {
            this.controller.onNext(true)
          };
          return PausableBufferedObservable
        }(Observable);
        observableProto.pausableBuffered = function (subject) {
          return new PausableBufferedObservable(this, subject)
        };
        var ControlledObservable = function (__super__) {
          inherits(ControlledObservable, __super__);
          function subscribe(observer) {
            return this.source.subscribe(observer)
          }

          function ControlledObservable(source, enableQueue) {
            __super__.call(this, subscribe, source);
            this.subject = new ControlledSubject(enableQueue);
            this.source = source.multicast(this.subject).refCount()
          }

          ControlledObservable.prototype.request = function (numberOfItems) {
            if (numberOfItems == null) {
              numberOfItems = -1
            }
            return this.subject.request(numberOfItems)
          };
          return ControlledObservable
        }(Observable);
        var ControlledSubject = function (__super__) {
          function subscribe(observer) {
            return this.subject.subscribe(observer)
          }

          inherits(ControlledSubject, __super__);
          function ControlledSubject(enableQueue) {
            enableQueue == null && (enableQueue = true);
            __super__.call(this, subscribe);
            this.subject = new Subject;
            this.enableQueue = enableQueue;
            this.queue = enableQueue ? [] : null;
            this.requestedCount = 0;
            this.requestedDisposable = disposableEmpty;
            this.error = null;
            this.hasFailed = false;
            this.hasCompleted = false;
            this.controlledDisposable = disposableEmpty
          }

          addProperties(ControlledSubject.prototype, Observer, {
            onCompleted: function () {
              this.hasCompleted = true;
              (!this.enableQueue || this.queue.length === 0) && this.subject.onCompleted()
            }, onError: function (error) {
              this.hasFailed = true;
              this.error = error;
              (!this.enableQueue || this.queue.length === 0) && this.subject.onError(error)
            }, onNext: function (value) {
              var hasRequested = false;
              if (this.requestedCount === 0) {
                this.enableQueue && this.queue.push(value)
              } else {
                this.requestedCount !== -1 && this.requestedCount-- === 0 && this.disposeCurrentRequest();
                hasRequested = true
              }
              hasRequested && this.subject.onNext(value)
            }, _processRequest: function (numberOfItems) {
              if (this.enableQueue) {
                while (this.queue.length >= numberOfItems && numberOfItems > 0) {
                  this.subject.onNext(this.queue.shift());
                  numberOfItems--
                }
                return this.queue.length !== 0 ? {
                  numberOfItems: numberOfItems,
                  returnValue: true
                } : {numberOfItems: numberOfItems, returnValue: false}
              }
              if (this.hasFailed) {
                this.subject.onError(this.error);
                this.controlledDisposable.dispose();
                this.controlledDisposable = disposableEmpty
              } else if (this.hasCompleted) {
                this.subject.onCompleted();
                this.controlledDisposable.dispose();
                this.controlledDisposable = disposableEmpty
              }
              return {numberOfItems: numberOfItems, returnValue: false}
            }, request: function (number) {
              this.disposeCurrentRequest();
              var self = this, r = this._processRequest(number);
              var number = r.numberOfItems;
              if (!r.returnValue) {
                this.requestedCount = number;
                this.requestedDisposable = disposableCreate(function () {
                  self.requestedCount = 0
                });
                return this.requestedDisposable
              } else {
                return disposableEmpty
              }
            }, disposeCurrentRequest: function () {
              this.requestedDisposable.dispose();
              this.requestedDisposable = disposableEmpty
            }
          });
          return ControlledSubject
        }(Observable);
        observableProto.controlled = function (enableQueue) {
          if (enableQueue == null) {
            enableQueue = true
          }
          return new ControlledObservable(this, enableQueue)
        };
        var StopAndWaitObservable = function (__super__) {
          function subscribe(observer) {
            this.subscription = this.source.subscribe(new StopAndWaitObserver(observer, this, this.subscription));
            var self = this;
            timeoutScheduler.schedule(function () {
              self.source.request(1)
            });
            return this.subscription
          }

          inherits(StopAndWaitObservable, __super__);
          function StopAndWaitObservable(source) {
            __super__.call(this, subscribe, source);
            this.source = source
          }

          var StopAndWaitObserver = function (__sub__) {
            inherits(StopAndWaitObserver, __sub__);
            function StopAndWaitObserver(observer, observable, cancel) {
              __sub__.call(this);
              this.observer = observer;
              this.observable = observable;
              this.cancel = cancel
            }

            var stopAndWaitObserverProto = StopAndWaitObserver.prototype;
            stopAndWaitObserverProto.completed = function () {
              this.observer.onCompleted();
              this.dispose()
            };
            stopAndWaitObserverProto.error = function (error) {
              this.observer.onError(error);
              this.dispose()
            };
            stopAndWaitObserverProto.next = function (value) {
              this.observer.onNext(value);
              var self = this;
              timeoutScheduler.schedule(function () {
                self.observable.source.request(1)
              })
            };
            stopAndWaitObserverProto.dispose = function () {
              this.observer = null;
              if (this.cancel) {
                this.cancel.dispose();
                this.cancel = null
              }
              __sub__.prototype.dispose.call(this)
            };
            return StopAndWaitObserver
          }(AbstractObserver);
          return StopAndWaitObservable
        }(Observable);
        ControlledObservable.prototype.stopAndWait = function () {
          return new StopAndWaitObservable(this)
        };
        var WindowedObservable = function (__super__) {
          function subscribe(observer) {
            this.subscription = this.source.subscribe(new WindowedObserver(observer, this, this.subscription));
            var self = this;
            timeoutScheduler.schedule(function () {
              self.source.request(self.windowSize)
            });
            return this.subscription
          }

          inherits(WindowedObservable, __super__);
          function WindowedObservable(source, windowSize) {
            __super__.call(this, subscribe, source);
            this.source = source;
            this.windowSize = windowSize
          }

          var WindowedObserver = function (__sub__) {
            inherits(WindowedObserver, __sub__);
            function WindowedObserver(observer, observable, cancel) {
              this.observer = observer;
              this.observable = observable;
              this.cancel = cancel;
              this.received = 0
            }

            var windowedObserverPrototype = WindowedObserver.prototype;
            windowedObserverPrototype.completed = function () {
              this.observer.onCompleted();
              this.dispose()
            };
            windowedObserverPrototype.error = function (error) {
              this.observer.onError(error);
              this.dispose()
            };
            windowedObserverPrototype.next = function (value) {
              this.observer.onNext(value);
              this.received = ++this.received % this.observable.windowSize;
              if (this.received === 0) {
                var self = this;
                timeoutScheduler.schedule(function () {
                  self.observable.source.request(self.observable.windowSize)
                })
              }
            };
            windowedObserverPrototype.dispose = function () {
              this.observer = null;
              if (this.cancel) {
                this.cancel.dispose();
                this.cancel = null
              }
              __sub__.prototype.dispose.call(this)
            };
            return WindowedObserver
          }(AbstractObserver);
          return WindowedObservable
        }(Observable);
        ControlledObservable.prototype.windowed = function (windowSize) {
          return new WindowedObservable(this, windowSize)
        };
        observableProto.multicast = function (subjectOrSubjectSelector, selector) {
          var source = this;
          return typeof subjectOrSubjectSelector === "function" ? new AnonymousObservable(function (observer) {
            var connectable = source.multicast(subjectOrSubjectSelector());
            return new CompositeDisposable(selector(connectable).subscribe(observer), connectable.connect())
          }, source) : new ConnectableObservable(source, subjectOrSubjectSelector)
        };
        observableProto.publish = function (selector) {
          return selector && isFunction(selector) ? this.multicast(function () {
            return new Subject
          }, selector) : this.multicast(new Subject)
        };
        observableProto.share = function () {
          return this.publish().refCount()
        };
        observableProto.publishLast = function (selector) {
          return selector && isFunction(selector) ? this.multicast(function () {
            return new AsyncSubject
          }, selector) : this.multicast(new AsyncSubject)
        };
        observableProto.publishValue = function (initialValueOrSelector, initialValue) {
          return arguments.length === 2 ? this.multicast(function () {
            return new BehaviorSubject(initialValue)
          }, initialValueOrSelector) : this.multicast(new BehaviorSubject(initialValueOrSelector))
        };
        observableProto.shareValue = function (initialValue) {
          return this.publishValue(initialValue).refCount()
        };
        observableProto.replay = function (selector, bufferSize, window, scheduler) {
          return selector && isFunction(selector) ? this.multicast(function () {
            return new ReplaySubject(bufferSize, window, scheduler)
          }, selector) : this.multicast(new ReplaySubject(bufferSize, window, scheduler))
        };
        observableProto.shareReplay = function (bufferSize, window, scheduler) {
          return this.replay(null, bufferSize, window, scheduler).refCount()
        };
        var InnerSubscription = function (subject, observer) {
          this.subject = subject;
          this.observer = observer
        };
        InnerSubscription.prototype.dispose = function () {
          if (!this.subject.isDisposed && this.observer !== null) {
            var idx = this.subject.observers.indexOf(this.observer);
            this.subject.observers.splice(idx, 1);
            this.observer = null
          }
        };
        var BehaviorSubject = Rx.BehaviorSubject = function (__super__) {
          function subscribe(observer) {
            checkDisposed.call(this);
            if (!this.isStopped) {
              this.observers.push(observer);
              observer.onNext(this.value);
              return new InnerSubscription(this, observer)
            }
            if (this.hasError) {
              observer.onError(this.error)
            } else {
              observer.onCompleted()
            }
            return disposableEmpty
          }

          inherits(BehaviorSubject, __super__);
          function BehaviorSubject(value) {
            __super__.call(this, subscribe);
            this.value = value, this.observers = [], this.isDisposed = false, this.isStopped = false, this.hasError = false
          }

          addProperties(BehaviorSubject.prototype, Observer, {
            hasObservers: function () {
              return this.observers.length > 0
            }, onCompleted: function () {
              checkDisposed.call(this);
              if (this.isStopped) {
                return
              }
              this.isStopped = true;
              for (var i = 0, os = this.observers.slice(0), len = os.length; i < len; i++) {
                os[i].onCompleted()
              }
              this.observers.length = 0
            }, onError: function (error) {
              checkDisposed.call(this);
              if (this.isStopped) {
                return
              }
              this.isStopped = true;
              this.hasError = true;
              this.error = error;
              for (var i = 0, os = this.observers.slice(0), len = os.length; i < len; i++) {
                os[i].onError(error)
              }
              this.observers.length = 0
            }, onNext: function (value) {
              checkDisposed.call(this);
              if (this.isStopped) {
                return
              }
              this.value = value;
              for (var i = 0, os = this.observers.slice(0), len = os.length; i < len; i++) {
                os[i].onNext(value)
              }
            }, dispose: function () {
              this.isDisposed = true;
              this.observers = null;
              this.value = null;
              this.exception = null
            }
          });
          return BehaviorSubject
        }(Observable);
        var ReplaySubject = Rx.ReplaySubject = function (__super__) {
          function createRemovableDisposable(subject, observer) {
            return disposableCreate(function () {
              observer.dispose();
              !subject.isDisposed && subject.observers.splice(subject.observers.indexOf(observer), 1)
            })
          }

          function subscribe(observer) {
            var so = new ScheduledObserver(this.scheduler, observer), subscription = createRemovableDisposable(this, so);
            checkDisposed.call(this);
            this._trim(this.scheduler.now());
            this.observers.push(so);
            for (var i = 0, len = this.q.length; i < len; i++) {
              so.onNext(this.q[i].value)
            }
            if (this.hasError) {
              so.onError(this.error)
            } else if (this.isStopped) {
              so.onCompleted()
            }
            so.ensureActive();
            return subscription
          }

          inherits(ReplaySubject, __super__);
          function ReplaySubject(bufferSize, windowSize, scheduler) {
            this.bufferSize = bufferSize == null ? Number.MAX_VALUE : bufferSize;
            this.windowSize = windowSize == null ? Number.MAX_VALUE : windowSize;
            this.scheduler = scheduler || currentThreadScheduler;
            this.q = [];
            this.observers = [];
            this.isStopped = false;
            this.isDisposed = false;
            this.hasError = false;
            this.error = null;
            __super__.call(this, subscribe)
          }

          addProperties(ReplaySubject.prototype, Observer.prototype, {
            hasObservers: function () {
              return this.observers.length > 0
            }, _trim: function (now) {
              while (this.q.length > this.bufferSize) {
                this.q.shift()
              }
              while (this.q.length > 0 && now - this.q[0].interval > this.windowSize) {
                this.q.shift()
              }
            }, onNext: function (value) {
              checkDisposed.call(this);
              if (this.isStopped) {
                return
              }
              var now = this.scheduler.now();
              this.q.push({interval: now, value: value});
              this._trim(now);
              var o = this.observers.slice(0);
              for (var i = 0, len = o.length; i < len; i++) {
                var observer = o[i];
                observer.onNext(value);
                observer.ensureActive()
              }
            }, onError: function (error) {
              checkDisposed.call(this);
              if (this.isStopped) {
                return
              }
              this.isStopped = true;
              this.error = error;
              this.hasError = true;
              var now = this.scheduler.now();
              this._trim(now);
              var o = this.observers.slice(0);
              for (var i = 0, len = o.length; i < len; i++) {
                var observer = o[i];
                observer.onError(error);
                observer.ensureActive()
              }
              this.observers = []
            }, onCompleted: function () {
              checkDisposed.call(this);
              if (this.isStopped) {
                return
              }
              this.isStopped = true;
              var now = this.scheduler.now();
              this._trim(now);
              var o = this.observers.slice(0);
              for (var i = 0, len = o.length; i < len; i++) {
                var observer = o[i];
                observer.onCompleted();
                observer.ensureActive()
              }
              this.observers = []
            }, dispose: function () {
              this.isDisposed = true;
              this.observers = null
            }
          });
          return ReplaySubject
        }(Observable);
        var ConnectableObservable = Rx.ConnectableObservable = function (__super__) {
          inherits(ConnectableObservable, __super__);
          function ConnectableObservable(source, subject) {
            var hasSubscription = false, subscription, sourceObservable = source.asObservable();
            this.connect = function () {
              if (!hasSubscription) {
                hasSubscription = true;
                subscription = new CompositeDisposable(sourceObservable.subscribe(subject), disposableCreate(function () {
                  hasSubscription = false
                }))
              }
              return subscription
            };
            __super__.call(this, function (o) {
              return subject.subscribe(o)
            })
          }

          ConnectableObservable.prototype.refCount = function () {
            var connectableSubscription, count = 0, source = this;
            return new AnonymousObservable(function (observer) {
              var shouldConnect = ++count === 1, subscription = source.subscribe(observer);
              shouldConnect && (connectableSubscription = source.connect());
              return function () {
                subscription.dispose();
                --count === 0 && connectableSubscription.dispose()
              }
            })
          };
          return ConnectableObservable
        }(Observable);
        var Dictionary = function () {
          var primes = [1, 3, 7, 13, 31, 61, 127, 251, 509, 1021, 2039, 4093, 8191, 16381, 32749, 65521, 131071, 262139, 524287, 1048573, 2097143, 4194301, 8388593, 16777213, 33554393, 67108859, 134217689, 268435399, 536870909, 1073741789, 2147483647], noSuchkey = "no such key", duplicatekey = "duplicate key";

          function isPrime(candidate) {
            if ((candidate & 1) === 0) {
              return candidate === 2
            }
            var num1 = Math.sqrt(candidate), num2 = 3;
            while (num2 <= num1) {
              if (candidate % num2 === 0) {
                return false
              }
              num2 += 2
            }
            return true
          }

          function getPrime(min) {
            var index, num, candidate;
            for (index = 0; index < primes.length; ++index) {
              num = primes[index];
              if (num >= min) {
                return num
              }
            }
            candidate = min | 1;
            while (candidate < primes[primes.length - 1]) {
              if (isPrime(candidate)) {
                return candidate
              }
              candidate += 2
            }
            return min
          }

          function stringHashFn(str) {
            var hash = 757602046;
            if (!str.length) {
              return hash
            }
            for (var i = 0, len = str.length; i < len; i++) {
              var character = str.charCodeAt(i);
              hash = (hash << 5) - hash + character;
              hash = hash & hash
            }
            return hash
          }

          function numberHashFn(key) {
            var c2 = 668265261;
            key = key ^ 61 ^ key >>> 16;
            key = key + (key << 3);
            key = key ^ key >>> 4;
            key = key * c2;
            key = key ^ key >>> 15;
            return key
          }

          var getHashCode = function () {
            var uniqueIdCounter = 0;
            return function (obj) {
              if (obj == null) {
                throw new Error(noSuchkey)
              }
              if (typeof obj === "string") {
                return stringHashFn(obj)
              }
              if (typeof obj === "number") {
                return numberHashFn(obj)
              }
              if (typeof obj === "boolean") {
                return obj === true ? 1 : 0
              }
              if (obj instanceof Date) {
                return numberHashFn(obj.valueOf())
              }
              if (obj instanceof RegExp) {
                return stringHashFn(obj.toString())
              }
              if (typeof obj.valueOf === "function") {
                var valueOf = obj.valueOf();
                if (typeof valueOf === "number") {
                  return numberHashFn(valueOf)
                }
                if (typeof obj === "string") {
                  return stringHashFn(valueOf)
                }
              }
              if (obj.hashCode) {
                return obj.hashCode()
              }
              var id = 17 * uniqueIdCounter++;
              obj.hashCode = function () {
                return id
              };
              return id
            }
          }();

          function newEntry() {
            return {key: null, value: null, next: 0, hashCode: 0}
          }

          function Dictionary(capacity, comparer) {
            if (capacity < 0) {
              throw new Error("out of range")
            }
            if (capacity > 0) {
              this._initialize(capacity)
            }
            this.comparer = comparer || defaultComparer;
            this.freeCount = 0;
            this.size = 0;
            this.freeList = -1
          }

          var dictionaryProto = Dictionary.prototype;
          dictionaryProto._initialize = function (capacity) {
            var prime = getPrime(capacity), i;
            this.buckets = new Array(prime);
            this.entries = new Array(prime);
            for (i = 0; i < prime; i++) {
              this.buckets[i] = -1;
              this.entries[i] = newEntry()
            }
            this.freeList = -1
          };
          dictionaryProto.add = function (key, value) {
            this._insert(key, value, true)
          };
          dictionaryProto._insert = function (key, value, add) {
            if (!this.buckets) {
              this._initialize(0)
            }
            var index3, num = getHashCode(key) & 2147483647, index1 = num % this.buckets.length;
            for (var index2 = this.buckets[index1]; index2 >= 0; index2 = this.entries[index2].next) {
              if (this.entries[index2].hashCode === num && this.comparer(this.entries[index2].key, key)) {
                if (add) {
                  throw new Error(duplicatekey)
                }
                this.entries[index2].value = value;
                return
              }
            }
            if (this.freeCount > 0) {
              index3 = this.freeList;
              this.freeList = this.entries[index3].next;
              --this.freeCount
            } else {
              if (this.size === this.entries.length) {
                this._resize();
                index1 = num % this.buckets.length
              }
              index3 = this.size;
              ++this.size
            }
            this.entries[index3].hashCode = num;
            this.entries[index3].next = this.buckets[index1];
            this.entries[index3].key = key;
            this.entries[index3].value = value;
            this.buckets[index1] = index3
          };
          dictionaryProto._resize = function () {
            var prime = getPrime(this.size * 2), numArray = new Array(prime);
            for (index = 0; index < numArray.length; ++index) {
              numArray[index] = -1
            }
            var entryArray = new Array(prime);
            for (index = 0; index < this.size; ++index) {
              entryArray[index] = this.entries[index]
            }
            for (var index = this.size; index < prime; ++index) {
              entryArray[index] = newEntry()
            }
            for (var index1 = 0; index1 < this.size; ++index1) {
              var index2 = entryArray[index1].hashCode % prime;
              entryArray[index1].next = numArray[index2];
              numArray[index2] = index1
            }
            this.buckets = numArray;
            this.entries = entryArray
          };
          dictionaryProto.remove = function (key) {
            if (this.buckets) {
              var num = getHashCode(key) & 2147483647, index1 = num % this.buckets.length, index2 = -1;
              for (var index3 = this.buckets[index1]; index3 >= 0; index3 = this.entries[index3].next) {
                if (this.entries[index3].hashCode === num && this.comparer(this.entries[index3].key, key)) {
                  if (index2 < 0) {
                    this.buckets[index1] = this.entries[index3].next
                  } else {
                    this.entries[index2].next = this.entries[index3].next
                  }
                  this.entries[index3].hashCode = -1;
                  this.entries[index3].next = this.freeList;
                  this.entries[index3].key = null;
                  this.entries[index3].value = null;
                  this.freeList = index3;
                  ++this.freeCount;
                  return true
                } else {
                  index2 = index3
                }
              }
            }
            return false
          };
          dictionaryProto.clear = function () {
            var index, len;
            if (this.size <= 0) {
              return
            }
            for (index = 0, len = this.buckets.length; index < len; ++index) {
              this.buckets[index] = -1
            }
            for (index = 0; index < this.size; ++index) {
              this.entries[index] = newEntry()
            }
            this.freeList = -1;
            this.size = 0
          };
          dictionaryProto._findEntry = function (key) {
            if (this.buckets) {
              var num = getHashCode(key) & 2147483647;
              for (var index = this.buckets[num % this.buckets.length]; index >= 0; index = this.entries[index].next) {
                if (this.entries[index].hashCode === num && this.comparer(this.entries[index].key, key)) {
                  return index
                }
              }
            }
            return -1
          };
          dictionaryProto.count = function () {
            return this.size - this.freeCount
          };
          dictionaryProto.tryGetValue = function (key) {
            var entry = this._findEntry(key);
            return entry >= 0 ? this.entries[entry].value : undefined
          };
          dictionaryProto.getValues = function () {
            var index = 0, results = [];
            if (this.entries) {
              for (var index1 = 0; index1 < this.size; index1++) {
                if (this.entries[index1].hashCode >= 0) {
                  results[index++] = this.entries[index1].value
                }
              }
            }
            return results
          };
          dictionaryProto.get = function (key) {
            var entry = this._findEntry(key);
            if (entry >= 0) {
              return this.entries[entry].value
            }
            throw new Error(noSuchkey)
          };
          dictionaryProto.set = function (key, value) {
            this._insert(key, value, false)
          };
          dictionaryProto.containskey = function (key) {
            return this._findEntry(key) >= 0
          };
          return Dictionary
        }();
        observableProto.join = function (right, leftDurationSelector, rightDurationSelector, resultSelector) {
          var left = this;
          return new AnonymousObservable(function (observer) {
            var group = new CompositeDisposable;
            var leftDone = false, rightDone = false;
            var leftId = 0, rightId = 0;
            var leftMap = new Dictionary, rightMap = new Dictionary;
            group.add(left.subscribe(function (value) {
              var id = leftId++;
              var md = new SingleAssignmentDisposable;
              leftMap.add(id, value);
              group.add(md);
              var expire = function () {
                leftMap.remove(id) && leftMap.count() === 0 && leftDone && observer.onCompleted();
                group.remove(md)
              };
              var duration;
              try {
                duration = leftDurationSelector(value)
              } catch (e) {
                observer.onError(e);
                return
              }
              md.setDisposable(duration.take(1).subscribe(noop, observer.onError.bind(observer), expire));
              rightMap.getValues().forEach(function (v) {
                var result;
                try {
                  result = resultSelector(value, v)
                } catch (exn) {
                  observer.onError(exn);
                  return
                }
                observer.onNext(result)
              })
            }, observer.onError.bind(observer), function () {
              leftDone = true;
              (rightDone || leftMap.count() === 0) && observer.onCompleted()
            }));
            group.add(right.subscribe(function (value) {
              var id = rightId++;
              var md = new SingleAssignmentDisposable;
              rightMap.add(id, value);
              group.add(md);
              var expire = function () {
                rightMap.remove(id) && rightMap.count() === 0 && rightDone && observer.onCompleted();
                group.remove(md)
              };
              var duration;
              try {
                duration = rightDurationSelector(value)
              } catch (e) {
                observer.onError(e);
                return
              }
              md.setDisposable(duration.take(1).subscribe(noop, observer.onError.bind(observer), expire));
              leftMap.getValues().forEach(function (v) {
                var result;
                try {
                  result = resultSelector(v, value)
                } catch (exn) {
                  observer.onError(exn);
                  return
                }
                observer.onNext(result)
              })
            }, observer.onError.bind(observer), function () {
              rightDone = true;
              (leftDone || rightMap.count() === 0) && observer.onCompleted()
            }));
            return group
          }, left)
        };
        observableProto.groupJoin = function (right, leftDurationSelector, rightDurationSelector, resultSelector) {
          var left = this;
          return new AnonymousObservable(function (observer) {
            var group = new CompositeDisposable;
            var r = new RefCountDisposable(group);
            var leftMap = new Dictionary, rightMap = new Dictionary;
            var leftId = 0, rightId = 0;

            function handleError(e) {
              return function (v) {
                v.onError(e)
              }
            }

            group.add(left.subscribe(function (value) {
              var s = new Subject;
              var id = leftId++;
              leftMap.add(id, s);
              var result;
              try {
                result = resultSelector(value, addRef(s, r))
              } catch (e) {
                leftMap.getValues().forEach(handleError(e));
                observer.onError(e);
                return
              }
              observer.onNext(result);
              rightMap.getValues().forEach(function (v) {
                s.onNext(v)
              });
              var md = new SingleAssignmentDisposable;
              group.add(md);
              var expire = function () {
                leftMap.remove(id) && s.onCompleted();
                group.remove(md)
              };
              var duration;
              try {
                duration = leftDurationSelector(value)
              } catch (e) {
                leftMap.getValues().forEach(handleError(e));
                observer.onError(e);
                return
              }
              md.setDisposable(duration.take(1).subscribe(noop, function (e) {
                leftMap.getValues().forEach(handleError(e));
                observer.onError(e)
              }, expire))
            }, function (e) {
              leftMap.getValues().forEach(handleError(e));
              observer.onError(e)
            }, observer.onCompleted.bind(observer)));
            group.add(right.subscribe(function (value) {
              var id = rightId++;
              rightMap.add(id, value);
              var md = new SingleAssignmentDisposable;
              group.add(md);
              var expire = function () {
                rightMap.remove(id);
                group.remove(md)
              };
              var duration;
              try {
                duration = rightDurationSelector(value)
              } catch (e) {
                leftMap.getValues().forEach(handleError(e));
                observer.onError(e);
                return
              }
              md.setDisposable(duration.take(1).subscribe(noop, function (e) {
                leftMap.getValues().forEach(handleError(e));
                observer.onError(e)
              }, expire));
              leftMap.getValues().forEach(function (v) {
                v.onNext(value)
              })
            }, function (e) {
              leftMap.getValues().forEach(handleError(e));
              observer.onError(e)
            }));
            return r
          }, left)
        };
        observableProto.buffer = function (bufferOpeningsOrClosingSelector, bufferClosingSelector) {
          return this.window.apply(this, arguments).selectMany(function (x) {
            return x.toArray()
          })
        };
        observableProto.window = function (windowOpeningsOrClosingSelector, windowClosingSelector) {
          if (arguments.length === 1 && typeof arguments[0] !== "function") {
            return observableWindowWithBoundaries.call(this, windowOpeningsOrClosingSelector)
          }
          return typeof windowOpeningsOrClosingSelector === "function" ? observableWindowWithClosingSelector.call(this, windowOpeningsOrClosingSelector) : observableWindowWithOpenings.call(this, windowOpeningsOrClosingSelector, windowClosingSelector)
        };
        function observableWindowWithOpenings(windowOpenings, windowClosingSelector) {
          return windowOpenings.groupJoin(this, windowClosingSelector, observableEmpty, function (_, win) {
            return win
          })
        }

        function observableWindowWithBoundaries(windowBoundaries) {
          var source = this;
          return new AnonymousObservable(function (observer) {
            var win = new Subject, d = new CompositeDisposable, r = new RefCountDisposable(d);
            observer.onNext(addRef(win, r));
            d.add(source.subscribe(function (x) {
              win.onNext(x)
            }, function (err) {
              win.onError(err);
              observer.onError(err)
            }, function () {
              win.onCompleted();
              observer.onCompleted()
            }));
            isPromise(windowBoundaries) && (windowBoundaries = observableFromPromise(windowBoundaries));
            d.add(windowBoundaries.subscribe(function (w) {
              win.onCompleted();
              win = new Subject;
              observer.onNext(addRef(win, r))
            }, function (err) {
              win.onError(err);
              observer.onError(err)
            }, function () {
              win.onCompleted();
              observer.onCompleted()
            }));
            return r
          }, source)
        }

        function observableWindowWithClosingSelector(windowClosingSelector) {
          var source = this;
          return new AnonymousObservable(function (observer) {
            var m = new SerialDisposable, d = new CompositeDisposable(m), r = new RefCountDisposable(d), win = new Subject;
            observer.onNext(addRef(win, r));
            d.add(source.subscribe(function (x) {
              win.onNext(x)
            }, function (err) {
              win.onError(err);
              observer.onError(err)
            }, function () {
              win.onCompleted();
              observer.onCompleted()
            }));
            function createWindowClose() {
              var windowClose;
              try {
                windowClose = windowClosingSelector()
              } catch (e) {
                observer.onError(e);
                return
              }
              isPromise(windowClose) && (windowClose = observableFromPromise(windowClose));
              var m1 = new SingleAssignmentDisposable;
              m.setDisposable(m1);
              m1.setDisposable(windowClose.take(1).subscribe(noop, function (err) {
                win.onError(err);
                observer.onError(err)
              }, function () {
                win.onCompleted();
                win = new Subject;
                observer.onNext(addRef(win, r));
                createWindowClose()
              }))
            }

            createWindowClose();
            return r
          }, source)
        }

        observableProto.pairwise = function () {
          var source = this;
          return new AnonymousObservable(function (observer) {
            var previous, hasPrevious = false;
            return source.subscribe(function (x) {
              if (hasPrevious) {
                observer.onNext([previous, x])
              } else {
                hasPrevious = true
              }
              previous = x
            }, observer.onError.bind(observer), observer.onCompleted.bind(observer))
          }, source)
        };
        observableProto.partition = function (predicate, thisArg) {
          return [this.filter(predicate, thisArg), this.filter(function (x, i, o) {
            return !predicate.call(thisArg, x, i, o)
          })]
        };
        function enumerableWhile(condition, source) {
          return new Enumerable(function () {
            return new Enumerator(function () {
              return condition() ? {done: false, value: source} : {done: true, value: undefined}
            })
          })
        }

        observableProto.letBind = observableProto["let"] = function (func) {
          return func(this)
        };
        Observable["if"] = Observable.ifThen = function (condition, thenSource, elseSourceOrScheduler) {
          return observableDefer(function () {
            elseSourceOrScheduler || (elseSourceOrScheduler = observableEmpty());
            isPromise(thenSource) && (thenSource = observableFromPromise(thenSource));
            isPromise(elseSourceOrScheduler) && (elseSourceOrScheduler = observableFromPromise(elseSourceOrScheduler));
            typeof elseSourceOrScheduler.now === "function" && (elseSourceOrScheduler = observableEmpty(elseSourceOrScheduler));
            return condition() ? thenSource : elseSourceOrScheduler
          })
        };
        Observable["for"] = Observable.forIn = function (sources, resultSelector, thisArg) {
          return enumerableOf(sources, resultSelector, thisArg).concat()
        };
        var observableWhileDo = Observable["while"] = Observable.whileDo = function (condition, source) {
          isPromise(source) && (source = observableFromPromise(source));
          return enumerableWhile(condition, source).concat()
        };
        observableProto.doWhile = function (condition) {
          return observableConcat([this, observableWhileDo(condition, this)])
        };
        Observable["case"] = Observable.switchCase = function (selector, sources, defaultSourceOrScheduler) {
          return observableDefer(function () {
            isPromise(defaultSourceOrScheduler) && (defaultSourceOrScheduler = observableFromPromise(defaultSourceOrScheduler));
            defaultSourceOrScheduler || (defaultSourceOrScheduler = observableEmpty());
            typeof defaultSourceOrScheduler.now === "function" && (defaultSourceOrScheduler = observableEmpty(defaultSourceOrScheduler));
            var result = sources[selector()];
            isPromise(result) && (result = observableFromPromise(result));
            return result || defaultSourceOrScheduler
          })
        };
        observableProto.expand = function (selector, scheduler) {
          isScheduler(scheduler) || (scheduler = immediateScheduler);
          var source = this;
          return new AnonymousObservable(function (observer) {
            var q = [], m = new SerialDisposable, d = new CompositeDisposable(m), activeCount = 0, isAcquired = false;
            var ensureActive = function () {
              var isOwner = false;
              if (q.length > 0) {
                isOwner = !isAcquired;
                isAcquired = true
              }
              if (isOwner) {
                m.setDisposable(scheduler.scheduleRecursive(function (self) {
                  var work;
                  if (q.length > 0) {
                    work = q.shift()
                  } else {
                    isAcquired = false;
                    return
                  }
                  var m1 = new SingleAssignmentDisposable;
                  d.add(m1);
                  m1.setDisposable(work.subscribe(function (x) {
                    observer.onNext(x);
                    var result = null;
                    try {
                      result = selector(x)
                    } catch (e) {
                      observer.onError(e)
                    }
                    q.push(result);
                    activeCount++;
                    ensureActive()
                  }, observer.onError.bind(observer), function () {
                    d.remove(m1);
                    activeCount--;
                    if (activeCount === 0) {
                      observer.onCompleted()
                    }
                  }));
                  self()
                }))
              }
            };
            q.push(source);
            activeCount++;
            ensureActive();
            return d
          }, this)
        };
        Observable.forkJoin = function () {
          var allSources = argsOrArray(arguments, 0);
          return new AnonymousObservable(function (subscriber) {
            var count = allSources.length;
            if (count === 0) {
              subscriber.onCompleted();
              return disposableEmpty
            }
            var group = new CompositeDisposable, finished = false, hasResults = new Array(count), hasCompleted = new Array(count), results = new Array(count);
            for (var idx = 0; idx < count; idx++) {
              (function (i) {
                var source = allSources[i];
                isPromise(source) && (source = observableFromPromise(source));
                group.add(source.subscribe(function (value) {
                  if (!finished) {
                    hasResults[i] = true;
                    results[i] = value
                  }
                }, function (e) {
                  finished = true;
                  subscriber.onError(e);
                  group.dispose()
                }, function () {
                  if (!finished) {
                    if (!hasResults[i]) {
                      subscriber.onCompleted();
                      return
                    }
                    hasCompleted[i] = true;
                    for (var ix = 0; ix < count; ix++) {
                      if (!hasCompleted[ix]) {
                        return
                      }
                    }
                    finished = true;
                    subscriber.onNext(results);
                    subscriber.onCompleted()
                  }
                }))
              })(idx)
            }
            return group
          })
        };
        observableProto.forkJoin = function (second, resultSelector) {
          var first = this;
          return new AnonymousObservable(function (observer) {
            var leftStopped = false, rightStopped = false, hasLeft = false, hasRight = false, lastLeft, lastRight, leftSubscription = new SingleAssignmentDisposable, rightSubscription = new SingleAssignmentDisposable;
            isPromise(second) && (second = observableFromPromise(second));
            leftSubscription.setDisposable(first.subscribe(function (left) {
              hasLeft = true;
              lastLeft = left
            }, function (err) {
              rightSubscription.dispose();
              observer.onError(err)
            }, function () {
              leftStopped = true;
              if (rightStopped) {
                if (!hasLeft) {
                  observer.onCompleted()
                } else if (!hasRight) {
                  observer.onCompleted()
                } else {
                  var result;
                  try {
                    result = resultSelector(lastLeft, lastRight)
                  } catch (e) {
                    observer.onError(e);
                    return
                  }
                  observer.onNext(result);
                  observer.onCompleted()
                }
              }
            }));
            rightSubscription.setDisposable(second.subscribe(function (right) {
              hasRight = true;
              lastRight = right
            }, function (err) {
              leftSubscription.dispose();
              observer.onError(err)
            }, function () {
              rightStopped = true;
              if (leftStopped) {
                if (!hasLeft) {
                  observer.onCompleted()
                } else if (!hasRight) {
                  observer.onCompleted()
                } else {
                  var result;
                  try {
                    result = resultSelector(lastLeft, lastRight)
                  } catch (e) {
                    observer.onError(e);
                    return
                  }
                  observer.onNext(result);
                  observer.onCompleted()
                }
              }
            }));
            return new CompositeDisposable(leftSubscription, rightSubscription)
          }, first)
        };
        observableProto.manySelect = function (selector, scheduler) {
          isScheduler(scheduler) || (scheduler = immediateScheduler);
          var source = this;
          return observableDefer(function () {
            var chain;
            return source.map(function (x) {
              var curr = new ChainObservable(x);
              chain && chain.onNext(x);
              chain = curr;
              return curr
            }).tap(noop, function (e) {
              chain && chain.onError(e)
            }, function () {
              chain && chain.onCompleted()
            }).observeOn(scheduler).map(selector)
          }, source)
        };
        var ChainObservable = function (__super__) {
          function subscribe(observer) {
            var self = this, g = new CompositeDisposable;
            g.add(currentThreadScheduler.schedule(function () {
              observer.onNext(self.head);
              g.add(self.tail.mergeAll().subscribe(observer))
            }));
            return g
          }

          inherits(ChainObservable, __super__);
          function ChainObservable(head) {
            __super__.call(this, subscribe);
            this.head = head;
            this.tail = new AsyncSubject
          }

          addProperties(ChainObservable.prototype, Observer, {
            onCompleted: function () {
              this.onNext(Observable.empty())
            }, onError: function (e) {
              this.onNext(Observable.throwException(e))
            }, onNext: function (v) {
              this.tail.onNext(v);
              this.tail.onCompleted()
            }
          });
          return ChainObservable
        }(Observable);
        var Map = root.Map || function () {
            function Map() {
              this._keys = [];
              this._values = []
            }

            Map.prototype.get = function (key) {
              var i = this._keys.indexOf(key);
              return i !== -1 ? this._values[i] : undefined
            };
            Map.prototype.set = function (key, value) {
              var i = this._keys.indexOf(key);
              i !== -1 && (this._values[i] = value);
              this._values[this._keys.push(key) - 1] = value
            };
            Map.prototype.forEach = function (callback, thisArg) {
              for (var i = 0, len = this._keys.length; i < len; i++) {
                callback.call(thisArg, this._values[i], this._keys[i])
              }
            };
            return Map
          }();

        function Pattern(patterns) {
          this.patterns = patterns
        }

        Pattern.prototype.and = function (other) {
          return new Pattern(this.patterns.concat(other))
        };
        Pattern.prototype.thenDo = function (selector) {
          return new Plan(this, selector)
        };
        function Plan(expression, selector) {
          this.expression = expression;
          this.selector = selector
        }

        Plan.prototype.activate = function (externalSubscriptions, observer, deactivate) {
          var self = this;
          var joinObservers = [];
          for (var i = 0, len = this.expression.patterns.length; i < len; i++) {
            joinObservers.push(planCreateObserver(externalSubscriptions, this.expression.patterns[i], observer.onError.bind(observer)))
          }
          var activePlan = new ActivePlan(joinObservers, function () {
            var result;
            try {
              result = self.selector.apply(self, arguments)
            } catch (e) {
              observer.onError(e);
              return
            }
            observer.onNext(result)
          }, function () {
            for (var j = 0, jlen = joinObservers.length; j < jlen; j++) {
              joinObservers[j].removeActivePlan(activePlan)
            }
            deactivate(activePlan)
          });
          for (i = 0, len = joinObservers.length; i < len; i++) {
            joinObservers[i].addActivePlan(activePlan)
          }
          return activePlan
        };
        function planCreateObserver(externalSubscriptions, observable, onError) {
          var entry = externalSubscriptions.get(observable);
          if (!entry) {
            var observer = new JoinObserver(observable, onError);
            externalSubscriptions.set(observable, observer);
            return observer
          }
          return entry
        }

        function ActivePlan(joinObserverArray, onNext, onCompleted) {
          this.joinObserverArray = joinObserverArray;
          this.onNext = onNext;
          this.onCompleted = onCompleted;
          this.joinObservers = new Map;
          for (var i = 0, len = this.joinObserverArray.length; i < len; i++) {
            var joinObserver = this.joinObserverArray[i];
            this.joinObservers.set(joinObserver, joinObserver)
          }
        }

        ActivePlan.prototype.dequeue = function () {
          this.joinObservers.forEach(function (v) {
            v.queue.shift()
          })
        };
        ActivePlan.prototype.match = function () {
          var i, len, hasValues = true;
          for (i = 0, len = this.joinObserverArray.length; i < len; i++) {
            if (this.joinObserverArray[i].queue.length === 0) {
              hasValues = false;
              break
            }
          }
          if (hasValues) {
            var firstValues = [], isCompleted = false;
            for (i = 0, len = this.joinObserverArray.length; i < len; i++) {
              firstValues.push(this.joinObserverArray[i].queue[0]);
              this.joinObserverArray[i].queue[0].kind === "C" && (isCompleted = true)
            }
            if (isCompleted) {
              this.onCompleted()
            } else {
              this.dequeue();
              var values = [];
              for (i = 0, len = firstValues.length; i < firstValues.length; i++) {
                values.push(firstValues[i].value)
              }
              this.onNext.apply(this, values)
            }
          }
        };
        var JoinObserver = function (__super__) {
          inherits(JoinObserver, __super__);
          function JoinObserver(source, onError) {
            __super__.call(this);
            this.source = source;
            this.onError = onError;
            this.queue = [];
            this.activePlans = [];
            this.subscription = new SingleAssignmentDisposable;
            this.isDisposed = false
          }

          var JoinObserverPrototype = JoinObserver.prototype;
          JoinObserverPrototype.next = function (notification) {
            if (!this.isDisposed) {
              if (notification.kind === "E") {
                this.onError(notification.exception);
                return
              }
              this.queue.push(notification);
              var activePlans = this.activePlans.slice(0);
              for (var i = 0, len = activePlans.length; i < len; i++) {
                activePlans[i].match()
              }
            }
          };
          JoinObserverPrototype.error = noop;
          JoinObserverPrototype.completed = noop;
          JoinObserverPrototype.addActivePlan = function (activePlan) {
            this.activePlans.push(activePlan)
          };
          JoinObserverPrototype.subscribe = function () {
            this.subscription.setDisposable(this.source.materialize().subscribe(this))
          };
          JoinObserverPrototype.removeActivePlan = function (activePlan) {
            this.activePlans.splice(this.activePlans.indexOf(activePlan), 1);
            this.activePlans.length === 0 && this.dispose()
          };
          JoinObserverPrototype.dispose = function () {
            __super__.prototype.dispose.call(this);
            if (!this.isDisposed) {
              this.isDisposed = true;
              this.subscription.dispose()
            }
          };
          return JoinObserver
        }(AbstractObserver);
        observableProto.and = function (right) {
          return new Pattern([this, right])
        };
        observableProto.thenDo = function (selector) {
          return new Pattern([this]).thenDo(selector)
        };
        Observable.when = function () {
          var plans = argsOrArray(arguments, 0);
          return new AnonymousObservable(function (observer) {
            var activePlans = [], externalSubscriptions = new Map;
            var outObserver = observerCreate(observer.onNext.bind(observer), function (err) {
              externalSubscriptions.forEach(function (v) {
                v.onError(err)
              });
              observer.onError(err)
            }, observer.onCompleted.bind(observer));
            try {
              for (var i = 0, len = plans.length; i < len; i++) {
                activePlans.push(plans[i].activate(externalSubscriptions, outObserver, function (activePlan) {
                  var idx = activePlans.indexOf(activePlan);
                  activePlans.splice(idx, 1);
                  activePlans.length === 0 && observer.onCompleted()
                }))
              }
            } catch (e) {
              observableThrow(e).subscribe(observer)
            }
            var group = new CompositeDisposable;
            externalSubscriptions.forEach(function (joinObserver) {
              joinObserver.subscribe();
              group.add(joinObserver)
            });
            return group
          })
        };
        function observableTimerDate(dueTime, scheduler) {
          return new AnonymousObservable(function (observer) {
            return scheduler.scheduleWithAbsolute(dueTime, function () {
              observer.onNext(0);
              observer.onCompleted()
            })
          })
        }

        function observableTimerDateAndPeriod(dueTime, period, scheduler) {
          return new AnonymousObservable(function (observer) {
            var count = 0, d = dueTime, p = normalizeTime(period);
            return scheduler.scheduleRecursiveWithAbsolute(d, function (self) {
              if (p > 0) {
                var now = scheduler.now();
                d = d + p;
                d <= now && (d = now + p)
              }
              observer.onNext(count++);
              self(d)
            })
          })
        }

        function observableTimerTimeSpan(dueTime, scheduler) {
          return new AnonymousObservable(function (observer) {
            return scheduler.scheduleWithRelative(normalizeTime(dueTime), function () {
              observer.onNext(0);
              observer.onCompleted()
            })
          })
        }

        function observableTimerTimeSpanAndPeriod(dueTime, period, scheduler) {
          return dueTime === period ? new AnonymousObservable(function (observer) {
            return scheduler.schedulePeriodicWithState(0, period, function (count) {
              observer.onNext(count);
              return count + 1
            })
          }) : observableDefer(function () {
            return observableTimerDateAndPeriod(scheduler.now() + dueTime, period, scheduler)
          })
        }

        var observableinterval = Observable.interval = function (period, scheduler) {
          return observableTimerTimeSpanAndPeriod(period, period, isScheduler(scheduler) ? scheduler : timeoutScheduler)
        };
        var observableTimer = Observable.timer = function (dueTime, periodOrScheduler, scheduler) {
          var period;
          isScheduler(scheduler) || (scheduler = timeoutScheduler);
          if (periodOrScheduler !== undefined && typeof periodOrScheduler === "number") {
            period = periodOrScheduler
          } else if (isScheduler(periodOrScheduler)) {
            scheduler = periodOrScheduler
          }
          if (dueTime instanceof Date && period === undefined) {
            return observableTimerDate(dueTime.getTime(), scheduler)
          }
          if (dueTime instanceof Date && period !== undefined) {
            period = periodOrScheduler;
            return observableTimerDateAndPeriod(dueTime.getTime(), period, scheduler)
          }
          return period === undefined ? observableTimerTimeSpan(dueTime, scheduler) : observableTimerTimeSpanAndPeriod(dueTime, period, scheduler)
        };

        function observableDelayTimeSpan(source, dueTime, scheduler) {
          return new AnonymousObservable(function (observer) {
            var active = false, cancelable = new SerialDisposable, exception = null, q = [], running = false, subscription;
            subscription = source.materialize().timestamp(scheduler).subscribe(function (notification) {
              var d, shouldRun;
              if (notification.value.kind === "E") {
                q = [];
                q.push(notification);
                exception = notification.value.exception;
                shouldRun = !running
              } else {
                q.push({value: notification.value, timestamp: notification.timestamp + dueTime});
                shouldRun = !active;
                active = true
              }
              if (shouldRun) {
                if (exception !== null) {
                  observer.onError(exception)
                } else {
                  d = new SingleAssignmentDisposable;
                  cancelable.setDisposable(d);
                  d.setDisposable(scheduler.scheduleRecursiveWithRelative(dueTime, function (self) {
                    var e, recurseDueTime, result, shouldRecurse;
                    if (exception !== null) {
                      return
                    }
                    running = true;
                    do {
                      result = null;
                      if (q.length > 0 && q[0].timestamp - scheduler.now() <= 0) {
                        result = q.shift().value
                      }
                      if (result !== null) {
                        result.accept(observer)
                      }
                    } while (result !== null);
                    shouldRecurse = false;
                    recurseDueTime = 0;
                    if (q.length > 0) {
                      shouldRecurse = true;
                      recurseDueTime = Math.max(0, q[0].timestamp - scheduler.now())
                    } else {
                      active = false
                    }
                    e = exception;
                    running = false;
                    if (e !== null) {
                      observer.onError(e)
                    } else if (shouldRecurse) {
                      self(recurseDueTime)
                    }
                  }))
                }
              }
            });
            return new CompositeDisposable(subscription, cancelable)
          }, source)
        }

        function observableDelayDate(source, dueTime, scheduler) {
          return observableDefer(function () {
            return observableDelayTimeSpan(source, dueTime - scheduler.now(), scheduler)
          })
        }

        observableProto.delay = function (dueTime, scheduler) {
          isScheduler(scheduler) || (scheduler = timeoutScheduler);
          return dueTime instanceof Date ? observableDelayDate(this, dueTime.getTime(), scheduler) : observableDelayTimeSpan(this, dueTime, scheduler)
        };
        observableProto.debounce = observableProto.throttleWithTimeout = function (dueTime, scheduler) {
          isScheduler(scheduler) || (scheduler = timeoutScheduler);
          var source = this;
          return new AnonymousObservable(function (observer) {
            var cancelable = new SerialDisposable, hasvalue = false, value, id = 0;
            var subscription = source.subscribe(function (x) {
              hasvalue = true;
              value = x;
              id++;
              var currentId = id, d = new SingleAssignmentDisposable;
              cancelable.setDisposable(d);
              d.setDisposable(scheduler.scheduleWithRelative(dueTime, function () {
                hasvalue && id === currentId && observer.onNext(value);
                hasvalue = false
              }))
            }, function (e) {
              cancelable.dispose();
              observer.onError(e);
              hasvalue = false;
              id++
            }, function () {
              cancelable.dispose();
              hasvalue && observer.onNext(value);
              observer.onCompleted();
              hasvalue = false;
              id++
            });
            return new CompositeDisposable(subscription, cancelable)
          }, this)
        };
        observableProto.throttle = function (dueTime, scheduler) {
          return this.debounce(dueTime, scheduler)
        };
        observableProto.windowWithTime = function (timeSpan, timeShiftOrScheduler, scheduler) {
          var source = this, timeShift;
          timeShiftOrScheduler == null && (timeShift = timeSpan);
          isScheduler(scheduler) || (scheduler = timeoutScheduler);
          if (typeof timeShiftOrScheduler === "number") {
            timeShift = timeShiftOrScheduler
          } else if (isScheduler(timeShiftOrScheduler)) {
            timeShift = timeSpan;
            scheduler = timeShiftOrScheduler
          }
          return new AnonymousObservable(function (observer) {
            var groupDisposable, nextShift = timeShift, nextSpan = timeSpan, q = [], refCountDisposable, timerD = new SerialDisposable, totalTime = 0;
            groupDisposable = new CompositeDisposable(timerD), refCountDisposable = new RefCountDisposable(groupDisposable);
            function createTimer() {
              var m = new SingleAssignmentDisposable, isSpan = false, isShift = false;
              timerD.setDisposable(m);
              if (nextSpan === nextShift) {
                isSpan = true;
                isShift = true
              } else if (nextSpan < nextShift) {
                isSpan = true
              } else {
                isShift = true
              }
              var newTotalTime = isSpan ? nextSpan : nextShift, ts = newTotalTime - totalTime;
              totalTime = newTotalTime;
              if (isSpan) {
                nextSpan += timeShift
              }
              if (isShift) {
                nextShift += timeShift
              }
              m.setDisposable(scheduler.scheduleWithRelative(ts, function () {
                if (isShift) {
                  var s = new Subject;
                  q.push(s);
                  observer.onNext(addRef(s, refCountDisposable))
                }
                isSpan && q.shift().onCompleted();
                createTimer()
              }))
            }

            q.push(new Subject);
            observer.onNext(addRef(q[0], refCountDisposable));
            createTimer();
            groupDisposable.add(source.subscribe(function (x) {
              for (var i = 0, len = q.length; i < len; i++) {
                q[i].onNext(x)
              }
            }, function (e) {
              for (var i = 0, len = q.length; i < len; i++) {
                q[i].onError(e)
              }
              observer.onError(e)
            }, function () {
              for (var i = 0, len = q.length; i < len; i++) {
                q[i].onCompleted()
              }
              observer.onCompleted()
            }));
            return refCountDisposable
          }, source)
        };
        observableProto.windowWithTimeOrCount = function (timeSpan, count, scheduler) {
          var source = this;
          isScheduler(scheduler) || (scheduler = timeoutScheduler);
          return new AnonymousObservable(function (observer) {
            var timerD = new SerialDisposable, groupDisposable = new CompositeDisposable(timerD), refCountDisposable = new RefCountDisposable(groupDisposable), n = 0, windowId = 0, s = new Subject;

            function createTimer(id) {
              var m = new SingleAssignmentDisposable;
              timerD.setDisposable(m);
              m.setDisposable(scheduler.scheduleWithRelative(timeSpan, function () {
                if (id !== windowId) {
                  return
                }
                n = 0;
                var newId = ++windowId;
                s.onCompleted();
                s = new Subject;
                observer.onNext(addRef(s, refCountDisposable));
                createTimer(newId)
              }))
            }

            observer.onNext(addRef(s, refCountDisposable));
            createTimer(0);
            groupDisposable.add(source.subscribe(function (x) {
              var newId = 0, newWindow = false;
              s.onNext(x);
              if (++n === count) {
                newWindow = true;
                n = 0;
                newId = ++windowId;
                s.onCompleted();
                s = new Subject;
                observer.onNext(addRef(s, refCountDisposable))
              }
              newWindow && createTimer(newId)
            }, function (e) {
              s.onError(e);
              observer.onError(e)
            }, function () {
              s.onCompleted();
              observer.onCompleted()
            }));
            return refCountDisposable
          }, source)
        };
        observableProto.bufferWithTime = function (timeSpan, timeShiftOrScheduler, scheduler) {
          return this.windowWithTime.apply(this, arguments).selectMany(function (x) {
            return x.toArray()
          })
        };
        observableProto.bufferWithTimeOrCount = function (timeSpan, count, scheduler) {
          return this.windowWithTimeOrCount(timeSpan, count, scheduler).selectMany(function (x) {
            return x.toArray()
          })
        };
        observableProto.timeInterval = function (scheduler) {
          var source = this;
          isScheduler(scheduler) || (scheduler = timeoutScheduler);
          return observableDefer(function () {
            var last = scheduler.now();
            return source.map(function (x) {
              var now = scheduler.now(), span = now - last;
              last = now;
              return {value: x, interval: span}
            })
          })
        };
        observableProto.timestamp = function (scheduler) {
          isScheduler(scheduler) || (scheduler = timeoutScheduler);
          return this.map(function (x) {
            return {value: x, timestamp: scheduler.now()}
          })
        };
        function sampleObservable(source, sampler) {
          return new AnonymousObservable(function (observer) {
            var atEnd, value, hasValue;

            function sampleSubscribe() {
              if (hasValue) {
                hasValue = false;
                observer.onNext(value)
              }
              atEnd && observer.onCompleted()
            }

            return new CompositeDisposable(source.subscribe(function (newValue) {
              hasValue = true;
              value = newValue
            }, observer.onError.bind(observer), function () {
              atEnd = true
            }), sampler.subscribe(sampleSubscribe, observer.onError.bind(observer), sampleSubscribe))
          }, source)
        }

        observableProto.sample = observableProto.throttleLatest = function (intervalOrSampler, scheduler) {
          isScheduler(scheduler) || (scheduler = timeoutScheduler);
          return typeof intervalOrSampler === "number" ? sampleObservable(this, observableinterval(intervalOrSampler, scheduler)) : sampleObservable(this, intervalOrSampler)
        };
        observableProto.timeout = function (dueTime, other, scheduler) {
          (other == null || typeof other === "string") && (other = observableThrow(new Error(other || "Timeout")));
          isScheduler(scheduler) || (scheduler = timeoutScheduler);
          var source = this, schedulerMethod = dueTime instanceof Date ? "scheduleWithAbsolute" : "scheduleWithRelative";
          return new AnonymousObservable(function (observer) {
            var id = 0, original = new SingleAssignmentDisposable, subscription = new SerialDisposable, switched = false, timer = new SerialDisposable;
            subscription.setDisposable(original);
            function createTimer() {
              var myId = id;
              timer.setDisposable(scheduler[schedulerMethod](dueTime, function () {
                if (id === myId) {
                  isPromise(other) && (other = observableFromPromise(other));
                  subscription.setDisposable(other.subscribe(observer))
                }
              }))
            }

            createTimer();
            original.setDisposable(source.subscribe(function (x) {
              if (!switched) {
                id++;
                observer.onNext(x);
                createTimer()
              }
            }, function (e) {
              if (!switched) {
                id++;
                observer.onError(e)
              }
            }, function () {
              if (!switched) {
                id++;
                observer.onCompleted()
              }
            }));
            return new CompositeDisposable(subscription, timer)
          }, source)
        };
        Observable.generateWithAbsoluteTime = function (initialState, condition, iterate, resultSelector, timeSelector, scheduler) {
          isScheduler(scheduler) || (scheduler = timeoutScheduler);
          return new AnonymousObservable(function (observer) {
            var first = true, hasResult = false, result, state = initialState, time;
            return scheduler.scheduleRecursiveWithAbsolute(scheduler.now(), function (self) {
              hasResult && observer.onNext(result);
              try {
                if (first) {
                  first = false
                } else {
                  state = iterate(state)
                }
                hasResult = condition(state);
                if (hasResult) {
                  result = resultSelector(state);
                  time = timeSelector(state)
                }
              } catch (e) {
                observer.onError(e);
                return
              }
              if (hasResult) {
                self(time)
              } else {
                observer.onCompleted()
              }
            })
          })
        };
        Observable.generateWithRelativeTime = function (initialState, condition, iterate, resultSelector, timeSelector, scheduler) {
          isScheduler(scheduler) || (scheduler = timeoutScheduler);
          return new AnonymousObservable(function (observer) {
            var first = true, hasResult = false, result, state = initialState, time;
            return scheduler.scheduleRecursiveWithRelative(0, function (self) {
              hasResult && observer.onNext(result);
              try {
                if (first) {
                  first = false
                } else {
                  state = iterate(state)
                }
                hasResult = condition(state);
                if (hasResult) {
                  result = resultSelector(state);
                  time = timeSelector(state)
                }
              } catch (e) {
                observer.onError(e);
                return
              }
              if (hasResult) {
                self(time)
              } else {
                observer.onCompleted()
              }
            })
          })
        };
        observableProto.delaySubscription = function (dueTime, scheduler) {
          return this.delayWithSelector(observableTimer(dueTime, isScheduler(scheduler) ? scheduler : timeoutScheduler), observableEmpty)
        };
        observableProto.delayWithSelector = function (subscriptionDelay, delayDurationSelector) {
          var source = this, subDelay, selector;
          if (typeof subscriptionDelay === "function") {
            selector = subscriptionDelay
          } else {
            subDelay = subscriptionDelay;
            selector = delayDurationSelector
          }
          return new AnonymousObservable(function (observer) {
            var delays = new CompositeDisposable, atEnd = false, done = function () {
              if (atEnd && delays.length === 0) {
                observer.onCompleted()
              }
            }, subscription = new SerialDisposable, start = function () {
              subscription.setDisposable(source.subscribe(function (x) {
                var delay;
                try {
                  delay = selector(x)
                } catch (error) {
                  observer.onError(error);
                  return
                }
                var d = new SingleAssignmentDisposable;
                delays.add(d);
                d.setDisposable(delay.subscribe(function () {
                  observer.onNext(x);
                  delays.remove(d);
                  done()
                }, observer.onError.bind(observer), function () {
                  observer.onNext(x);
                  delays.remove(d);
                  done()
                }))
              }, observer.onError.bind(observer), function () {
                atEnd = true;
                subscription.dispose();
                done()
              }))
            };
            if (!subDelay) {
              start()
            } else {
              subscription.setDisposable(subDelay.subscribe(start, observer.onError.bind(observer), start))
            }
            return new CompositeDisposable(subscription, delays)
          }, this)
        };
        observableProto.timeoutWithSelector = function (firstTimeout, timeoutdurationSelector, other) {
          if (arguments.length === 1) {
            timeoutdurationSelector = firstTimeout;
            firstTimeout = observableNever()
          }
          other || (other = observableThrow(new Error("Timeout")));
          var source = this;
          return new AnonymousObservable(function (observer) {
            var subscription = new SerialDisposable, timer = new SerialDisposable, original = new SingleAssignmentDisposable;
            subscription.setDisposable(original);
            var id = 0, switched = false;

            function setTimer(timeout) {
              var myId = id;

              function timerWins() {
                return id === myId
              }

              var d = new SingleAssignmentDisposable;
              timer.setDisposable(d);
              d.setDisposable(timeout.subscribe(function () {
                timerWins() && subscription.setDisposable(other.subscribe(observer));
                d.dispose()
              }, function (e) {
                timerWins() && observer.onError(e)
              }, function () {
                timerWins() && subscription.setDisposable(other.subscribe(observer))
              }))
            }

            setTimer(firstTimeout);
            function observerWins() {
              var res = !switched;
              if (res) {
                id++
              }
              return res
            }

            original.setDisposable(source.subscribe(function (x) {
              if (observerWins()) {
                observer.onNext(x);
                var timeout;
                try {
                  timeout = timeoutdurationSelector(x)
                } catch (e) {
                  observer.onError(e);
                  return
                }
                setTimer(isPromise(timeout) ? observableFromPromise(timeout) : timeout)
              }
            }, function (e) {
              observerWins() && observer.onError(e)
            }, function () {
              observerWins() && observer.onCompleted()
            }));
            return new CompositeDisposable(subscription, timer)
          }, source)
        };
        observableProto.debounceWithSelector = function (durationSelector) {
          var source = this;
          return new AnonymousObservable(function (observer) {
            var value, hasValue = false, cancelable = new SerialDisposable, id = 0;
            var subscription = source.subscribe(function (x) {
              var throttle;
              try {
                throttle = durationSelector(x)
              } catch (e) {
                observer.onError(e);
                return
              }
              isPromise(throttle) && (throttle = observableFromPromise(throttle));
              hasValue = true;
              value = x;
              id++;
              var currentid = id, d = new SingleAssignmentDisposable;
              cancelable.setDisposable(d);
              d.setDisposable(throttle.subscribe(function () {
                hasValue && id === currentid && observer.onNext(value);
                hasValue = false;
                d.dispose()
              }, observer.onError.bind(observer), function () {
                hasValue && id === currentid && observer.onNext(value);
                hasValue = false;
                d.dispose()
              }))
            }, function (e) {
              cancelable.dispose();
              observer.onError(e);
              hasValue = false;
              id++
            }, function () {
              cancelable.dispose();
              hasValue && observer.onNext(value);
              observer.onCompleted();
              hasValue = false;
              id++
            });
            return new CompositeDisposable(subscription, cancelable)
          }, source)
        };
        observableProto.throttleWithSelector = function () {
          return this.debounceWithSelector.apply(this, arguments)
        };
        observableProto.skipLastWithTime = function (duration, scheduler) {
          isScheduler(scheduler) || (scheduler = timeoutScheduler);
          var source = this;
          return new AnonymousObservable(function (o) {
            var q = [];
            return source.subscribe(function (x) {
              var now = scheduler.now();
              q.push({interval: now, value: x});
              while (q.length > 0 && now - q[0].interval >= duration) {
                o.onNext(q.shift().value)
              }
            }, function (e) {
              o.onError(e)
            }, function () {
              var now = scheduler.now();
              while (q.length > 0 && now - q[0].interval >= duration) {
                o.onNext(q.shift().value)
              }
              o.onCompleted()
            })
          }, source)
        };
        observableProto.takeLastWithTime = function (duration, scheduler) {
          var source = this;
          isScheduler(scheduler) || (scheduler = timeoutScheduler);
          return new AnonymousObservable(function (o) {
            var q = [];
            return source.subscribe(function (x) {
              var now = scheduler.now();
              q.push({interval: now, value: x});
              while (q.length > 0 && now - q[0].interval >= duration) {
                q.shift()
              }
            }, function (e) {
              o.onError(e)
            }, function () {
              var now = scheduler.now();
              while (q.length > 0) {
                var next = q.shift();
                if (now - next.interval <= duration) {
                  o.onNext(next.value)
                }
              }
              o.onCompleted()
            })
          }, source)
        };
        observableProto.takeLastBufferWithTime = function (duration, scheduler) {
          var source = this;
          isScheduler(scheduler) || (scheduler = timeoutScheduler);
          return new AnonymousObservable(function (o) {
            var q = [];
            return source.subscribe(function (x) {
              var now = scheduler.now();
              q.push({interval: now, value: x});
              while (q.length > 0 && now - q[0].interval >= duration) {
                q.shift()
              }
            }, function (e) {
              o.onError(e)
            }, function () {
              var now = scheduler.now(), res = [];
              while (q.length > 0) {
                var next = q.shift();
                now - next.interval <= duration && res.push(next.value)
              }
              o.onNext(res);
              o.onCompleted()
            })
          }, source)
        };
        observableProto.takeWithTime = function (duration, scheduler) {
          var source = this;
          isScheduler(scheduler) || (scheduler = timeoutScheduler);
          return new AnonymousObservable(function (o) {
            return new CompositeDisposable(scheduler.scheduleWithRelative(duration, function () {
              o.onCompleted()
            }), source.subscribe(o))
          }, source)
        };
        observableProto.skipWithTime = function (duration, scheduler) {
          var source = this;
          isScheduler(scheduler) || (scheduler = timeoutScheduler);
          return new AnonymousObservable(function (observer) {
            var open = false;
            return new CompositeDisposable(scheduler.scheduleWithRelative(duration, function () {
              open = true
            }), source.subscribe(function (x) {
              open && observer.onNext(x)
            }, observer.onError.bind(observer), observer.onCompleted.bind(observer)))
          }, source)
        };
        observableProto.skipUntilWithTime = function (startTime, scheduler) {
          isScheduler(scheduler) || (scheduler = timeoutScheduler);
          var source = this, schedulerMethod = startTime instanceof Date ? "scheduleWithAbsolute" : "scheduleWithRelative";
          return new AnonymousObservable(function (o) {
            var open = false;
            return new CompositeDisposable(scheduler[schedulerMethod](startTime, function () {
              open = true
            }), source.subscribe(function (x) {
              open && o.onNext(x)
            }, function (e) {
              o.onError(e)
            }, function () {
              o.onCompleted()
            }))
          }, source)
        };
        observableProto.takeUntilWithTime = function (endTime, scheduler) {
          isScheduler(scheduler) || (scheduler = timeoutScheduler);
          var source = this, schedulerMethod = endTime instanceof Date ? "scheduleWithAbsolute" : "scheduleWithRelative";
          return new AnonymousObservable(function (o) {
            return new CompositeDisposable(scheduler[schedulerMethod](endTime, function () {
              o.onCompleted()
            }), source.subscribe(o))
          }, source)
        };
        observableProto.throttleFirst = function (windowDuration, scheduler) {
          isScheduler(scheduler) || (scheduler = timeoutScheduler);
          var duration = +windowDuration || 0;
          if (duration <= 0) {
            throw new RangeError("windowDuration cannot be less or equal zero.")
          }
          var source = this;
          return new AnonymousObservable(function (o) {
            var lastOnNext = 0;
            return source.subscribe(function (x) {
              var now = scheduler.now();
              if (lastOnNext === 0 || now - lastOnNext >= duration) {
                lastOnNext = now;
                o.onNext(x)
              }
            }, function (e) {
              o.onError(e)
            }, function () {
              o.onCompleted()
            })
          }, source)
        };
        observableProto.transduce = function (transducer) {
          var source = this;

          function transformForObserver(observer) {
            return {
              init: function () {
                return observer
              }, step: function (obs, input) {
                return obs.onNext(input)
              }, result: function (obs) {
                return obs.onCompleted()
              }
            }
          }

          return new AnonymousObservable(function (observer) {
            var xform = transducer(transformForObserver(observer));
            return source.subscribe(function (v) {
              try {
                xform.step(observer, v)
              } catch (e) {
                observer.onError(e)
              }
            }, observer.onError.bind(observer), function () {
              xform.result(observer)
            })
          }, source)
        };
        observableProto.exclusive = function () {
          var sources = this;
          return new AnonymousObservable(function (observer) {
            var hasCurrent = false, isStopped = false, m = new SingleAssignmentDisposable, g = new CompositeDisposable;
            g.add(m);
            m.setDisposable(sources.subscribe(function (innerSource) {
              if (!hasCurrent) {
                hasCurrent = true;
                isPromise(innerSource) && (innerSource = observableFromPromise(innerSource));
                var innerSubscription = new SingleAssignmentDisposable;
                g.add(innerSubscription);
                innerSubscription.setDisposable(innerSource.subscribe(observer.onNext.bind(observer), observer.onError.bind(observer), function () {
                  g.remove(innerSubscription);
                  hasCurrent = false;
                  if (isStopped && g.length === 1) {
                    observer.onCompleted()
                  }
                }))
              }
            }, observer.onError.bind(observer), function () {
              isStopped = true;
              if (!hasCurrent && g.length === 1) {
                observer.onCompleted()
              }
            }));
            return g
          }, this)
        };
        observableProto.exclusiveMap = function (selector, thisArg) {
          var sources = this, selectorFunc = bindCallback(selector, thisArg, 3);
          return new AnonymousObservable(function (observer) {
            var index = 0, hasCurrent = false, isStopped = true, m = new SingleAssignmentDisposable, g = new CompositeDisposable;
            g.add(m);
            m.setDisposable(sources.subscribe(function (innerSource) {
              if (!hasCurrent) {
                hasCurrent = true;
                innerSubscription = new SingleAssignmentDisposable;
                g.add(innerSubscription);
                isPromise(innerSource) && (innerSource = observableFromPromise(innerSource));
                innerSubscription.setDisposable(innerSource.subscribe(function (x) {
                  var result;
                  try {
                    result = selectorFunc(x, index++, innerSource)
                  } catch (e) {
                    observer.onError(e);
                    return
                  }
                  observer.onNext(result)
                }, function (e) {
                  observer.onError(e)
                }, function () {
                  g.remove(innerSubscription);
                  hasCurrent = false;
                  if (isStopped && g.length === 1) {
                    observer.onCompleted()
                  }
                }))
              }
            }, function (e) {
              observer.onError(e)
            }, function () {
              isStopped = true;
              if (g.length === 1 && !hasCurrent) {
                observer.onCompleted()
              }
            }));
            return g
          }, this)
        };
        Rx.VirtualTimeScheduler = function (__super__) {
          function notImplemented() {
            throw new Error("Not implemented")
          }

          function localNow() {
            return this.toDateTimeOffset(this.clock)
          }

          function scheduleNow(state, action) {
            return this.scheduleAbsoluteWithState(state, this.clock, action)
          }

          function scheduleRelative(state, dueTime, action) {
            return this.scheduleRelativeWithState(state, this.toRelative(dueTime), action)
          }

          function scheduleAbsolute(state, dueTime, action) {
            return this.scheduleRelativeWithState(state, this.toRelative(dueTime - this.now()), action)
          }

          function invokeAction(scheduler, action) {
            action();
            return disposableEmpty
          }

          inherits(VirtualTimeScheduler, __super__);
          function VirtualTimeScheduler(initialClock, comparer) {
            this.clock = initialClock;
            this.comparer = comparer;
            this.isEnabled = false;
            this.queue = new PriorityQueue(1024);
            __super__.call(this, localNow, scheduleNow, scheduleRelative, scheduleAbsolute)
          }

          var VirtualTimeSchedulerPrototype = VirtualTimeScheduler.prototype;
          VirtualTimeSchedulerPrototype.add = notImplemented;
          VirtualTimeSchedulerPrototype.toDateTimeOffset = notImplemented;
          VirtualTimeSchedulerPrototype.toRelative = notImplemented;
          VirtualTimeSchedulerPrototype.schedulePeriodicWithState = function (state, period, action) {
            var s = new SchedulePeriodicRecursive(this, state, period, action);
            return s.start()
          };
          VirtualTimeSchedulerPrototype.scheduleRelativeWithState = function (state, dueTime, action) {
            var runAt = this.add(this.clock, dueTime);
            return this.scheduleAbsoluteWithState(state, runAt, action)
          };
          VirtualTimeSchedulerPrototype.scheduleRelative = function (dueTime, action) {
            return this.scheduleRelativeWithState(action, dueTime, invokeAction)
          };
          VirtualTimeSchedulerPrototype.start = function () {
            if (!this.isEnabled) {
              this.isEnabled = true;
              do {
                var next = this.getNext();
                if (next !== null) {
                  this.comparer(next.dueTime, this.clock) > 0 && (this.clock = next.dueTime);
                  next.invoke()
                } else {
                  this.isEnabled = false
                }
              } while (this.isEnabled)
            }
          };
          VirtualTimeSchedulerPrototype.stop = function () {
            this.isEnabled = false
          };
          VirtualTimeSchedulerPrototype.advanceTo = function (time) {
            var dueToClock = this.comparer(this.clock, time);
            if (this.comparer(this.clock, time) > 0) {
              throw new Error(argumentOutOfRange)
            }
            if (dueToClock === 0) {
              return
            }
            if (!this.isEnabled) {
              this.isEnabled = true;
              do {
                var next = this.getNext();
                if (next !== null && this.comparer(next.dueTime, time) <= 0) {
                  this.comparer(next.dueTime, this.clock) > 0 && (this.clock = next.dueTime);
                  next.invoke()
                } else {
                  this.isEnabled = false
                }
              } while (this.isEnabled);
              this.clock = time
            }
          };
          VirtualTimeSchedulerPrototype.advanceBy = function (time) {
            var dt = this.add(this.clock, time), dueToClock = this.comparer(this.clock, dt);
            if (dueToClock > 0) {
              throw new Error(argumentOutOfRange)
            }
            if (dueToClock === 0) {
              return
            }
            this.advanceTo(dt)
          };
          VirtualTimeSchedulerPrototype.sleep = function (time) {
            var dt = this.add(this.clock, time);
            if (this.comparer(this.clock, dt) >= 0) {
              throw new Error(argumentOutOfRange)
            }
            this.clock = dt
          };
          VirtualTimeSchedulerPrototype.getNext = function () {
            while (this.queue.length > 0) {
              var next = this.queue.peek();
              if (next.isCancelled()) {
                this.queue.dequeue()
              } else {
                return next
              }
            }
            return null
          };
          VirtualTimeSchedulerPrototype.scheduleAbsolute = function (dueTime, action) {
            return this.scheduleAbsoluteWithState(action, dueTime, invokeAction)
          };
          VirtualTimeSchedulerPrototype.scheduleAbsoluteWithState = function (state, dueTime, action) {
            var self = this;

            function run(scheduler, state1) {
              self.queue.remove(si);
              return action(scheduler, state1)
            }

            var si = new ScheduledItem(this, state, run, dueTime, this.comparer);
            this.queue.enqueue(si);
            return si.disposable
          };
          return VirtualTimeScheduler
        }(Scheduler);
        Rx.HistoricalScheduler = function (__super__) {
          inherits(HistoricalScheduler, __super__);
          function HistoricalScheduler(initialClock, comparer) {
            var clock = initialClock == null ? 0 : initialClock;
            var cmp = comparer || defaultSubComparer;
            __super__.call(this, clock, cmp)
          }

          var HistoricalSchedulerProto = HistoricalScheduler.prototype;
          HistoricalSchedulerProto.add = function (absolute, relative) {
            return absolute + relative
          };
          HistoricalSchedulerProto.toDateTimeOffset = function (absolute) {
            return new Date(absolute).getTime()
          };
          HistoricalSchedulerProto.toRelative = function (timeSpan) {
            return timeSpan
          };
          return HistoricalScheduler
        }(Rx.VirtualTimeScheduler);
        var AnonymousObservable = Rx.AnonymousObservable = function (__super__) {
          inherits(AnonymousObservable, __super__);
          function fixSubscriber(subscriber) {
            if (subscriber && typeof subscriber.dispose === "function") {
              return subscriber
            }
            return typeof subscriber === "function" ? disposableCreate(subscriber) : disposableEmpty
          }

          function AnonymousObservable(subscribe, parent) {
            this.source = parent;
            if (!(this instanceof AnonymousObservable)) {
              return new AnonymousObservable(subscribe)
            }
            function s(observer) {
              var setDisposable = function () {
                try {
                  autoDetachObserver.setDisposable(fixSubscriber(subscribe(autoDetachObserver)))
                } catch (e) {
                  if (!autoDetachObserver.fail(e)) {
                    throw e
                  }
                }
              };
              var autoDetachObserver = new AutoDetachObserver(observer);
              if (currentThreadScheduler.scheduleRequired()) {
                currentThreadScheduler.schedule(setDisposable)
              } else {
                setDisposable()
              }
              return autoDetachObserver
            }

            __super__.call(this, s)
          }

          return AnonymousObservable
        }(Observable);
        var AutoDetachObserver = function (__super__) {
          inherits(AutoDetachObserver, __super__);
          function AutoDetachObserver(observer) {
            __super__.call(this);
            this.observer = observer;
            this.m = new SingleAssignmentDisposable
          }

          var AutoDetachObserverPrototype = AutoDetachObserver.prototype;
          AutoDetachObserverPrototype.next = function (value) {
            var noError = false;
            try {
              this.observer.onNext(value);
              noError = true
            } catch (e) {
              throw e
            } finally {
              !noError && this.dispose()
            }
          };
          AutoDetachObserverPrototype.error = function (err) {
            try {
              this.observer.onError(err)
            } catch (e) {
              throw e
            } finally {
              this.dispose()
            }
          };
          AutoDetachObserverPrototype.completed = function () {
            try {
              this.observer.onCompleted()
            } catch (e) {
              throw e
            } finally {
              this.dispose()
            }
          };
          AutoDetachObserverPrototype.setDisposable = function (value) {
            this.m.setDisposable(value)
          };
          AutoDetachObserverPrototype.getDisposable = function () {
            return this.m.getDisposable()
          };
          AutoDetachObserverPrototype.dispose = function () {
            __super__.prototype.dispose.call(this);
            this.m.dispose()
          };
          return AutoDetachObserver
        }(AbstractObserver);
        var GroupedObservable = function (__super__) {
          inherits(GroupedObservable, __super__);
          function subscribe(observer) {
            return this.underlyingObservable.subscribe(observer)
          }

          function GroupedObservable(key, underlyingObservable, mergedDisposable) {
            __super__.call(this, subscribe);
            this.key = key;
            this.underlyingObservable = !mergedDisposable ? underlyingObservable : new AnonymousObservable(function (observer) {
              return new CompositeDisposable(mergedDisposable.getDisposable(), underlyingObservable.subscribe(observer))
            })
          }

          return GroupedObservable
        }(Observable);
        var Subject = Rx.Subject = function (__super__) {
          function subscribe(observer) {
            checkDisposed.call(this);
            if (!this.isStopped) {
              this.observers.push(observer);
              return new InnerSubscription(this, observer)
            }
            if (this.hasError) {
              observer.onError(this.error);
              return disposableEmpty
            }
            observer.onCompleted();
            return disposableEmpty
          }

          inherits(Subject, __super__);
          function Subject() {
            __super__.call(this, subscribe);
            this.isDisposed = false, this.isStopped = false, this.observers = [];
            this.hasError = false
          }

          addProperties(Subject.prototype, Observer.prototype, {
            hasObservers: function () {
              return this.observers.length > 0
            }, onCompleted: function () {
              checkDisposed.call(this);
              if (!this.isStopped) {
                var os = this.observers.slice(0);
                this.isStopped = true;
                for (var i = 0, len = os.length; i < len; i++) {
                  os[i].onCompleted()
                }
                this.observers.length = 0
              }
            }, onError: function (error) {
              checkDisposed.call(this);
              if (!this.isStopped) {
                var os = this.observers.slice(0);
                this.isStopped = true;
                this.error = error;
                this.hasError = true;
                for (var i = 0, len = os.length; i < len; i++) {
                  os[i].onError(error)
                }
                this.observers.length = 0
              }
            }, onNext: function (value) {
              checkDisposed.call(this);
              if (!this.isStopped) {
                var os = this.observers.slice(0);
                for (var i = 0, len = os.length; i < len; i++) {
                  os[i].onNext(value)
                }
              }
            }, dispose: function () {
              this.isDisposed = true;
              this.observers = null
            }
          });
          Subject.create = function (observer, observable) {
            return new AnonymousSubject(observer, observable)
          };
          return Subject
        }(Observable);
        var AsyncSubject = Rx.AsyncSubject = function (__super__) {
          function subscribe(observer) {
            checkDisposed.call(this);
            if (!this.isStopped) {
              this.observers.push(observer);
              return new InnerSubscription(this, observer)
            }
            if (this.hasError) {
              observer.onError(this.error)
            } else if (this.hasValue) {
              observer.onNext(this.value);
              observer.onCompleted()
            } else {
              observer.onCompleted()
            }
            return disposableEmpty
          }

          inherits(AsyncSubject, __super__);
          function AsyncSubject() {
            __super__.call(this, subscribe);
            this.isDisposed = false;
            this.isStopped = false;
            this.hasValue = false;
            this.observers = [];
            this.hasError = false
          }

          addProperties(AsyncSubject.prototype, Observer, {
            hasObservers: function () {
              checkDisposed.call(this);
              return this.observers.length > 0
            }, onCompleted: function () {
              var i, len;
              checkDisposed.call(this);
              if (!this.isStopped) {
                this.isStopped = true;
                var os = this.observers.slice(0), len = os.length;
                if (this.hasValue) {
                  for (i = 0; i < len; i++) {
                    var o = os[i];
                    o.onNext(this.value);
                    o.onCompleted()
                  }
                } else {
                  for (i = 0; i < len; i++) {
                    os[i].onCompleted()
                  }
                }
                this.observers.length = 0
              }
            }, onError: function (error) {
              checkDisposed.call(this);
              if (!this.isStopped) {
                var os = this.observers.slice(0);
                this.isStopped = true;
                this.hasError = true;
                this.error = error;
                for (var i = 0, len = os.length; i < len; i++) {
                  os[i].onError(error)
                }
                this.observers.length = 0
              }
            }, onNext: function (value) {
              checkDisposed.call(this);
              if (this.isStopped) {
                return
              }
              this.value = value;
              this.hasValue = true
            }, dispose: function () {
              this.isDisposed = true;
              this.observers = null;
              this.exception = null;
              this.value = null
            }
          });
          return AsyncSubject
        }(Observable);
        var AnonymousSubject = Rx.AnonymousSubject = function (__super__) {
          inherits(AnonymousSubject, __super__);
          function subscribe(observer) {
            this.observable.subscribe(observer)
          }

          function AnonymousSubject(observer, observable) {
            this.observer = observer;
            this.observable = observable;
            __super__.call(this, subscribe)
          }

          addProperties(AnonymousSubject.prototype, Observer.prototype, {
            onCompleted: function () {
              this.observer.onCompleted()
            }, onError: function (error) {
              this.observer.onError(error)
            }, onNext: function (value) {
              this.observer.onNext(value)
            }
          });
          return AnonymousSubject
        }(Observable);
        Rx.Pauser = function (__super__) {
          inherits(Pauser, __super__);
          function Pauser() {
            __super__.call(this)
          }

          Pauser.prototype.pause = function () {
            this.onNext(false)
          };
          Pauser.prototype.resume = function () {
            this.onNext(true)
          };
          return Pauser
        }(Subject);
        if (typeof define == "function" && typeof define.amd == "object" && define.amd) {
          root.Rx = Rx;
          define(function () {
            return Rx
          })
        } else if (freeExports && freeModule) {
          if (moduleExports) {
            (freeModule.exports = Rx).Rx = Rx
          } else {
            freeExports.Rx = Rx
          }
        } else {
          root.Rx = Rx
        }
        var rEndingLine = captureLine()
      }).call(this)
    }).call(this, require("_process"), typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
  }, {_process: 4}],
  6: [function (require, module, exports) {
    (function (process, global) {
      (function (undefined) {
        var objectTypes = {
          "boolean": false,
          "function": true,
          object: true,
          number: false,
          string: false,
          undefined: false
        };
        var root = objectTypes[typeof window] && window || this, freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports, freeModule = objectTypes[typeof module] && module && !module.nodeType && module, moduleExports = freeModule && freeModule.exports === freeExports && freeExports, freeGlobal = objectTypes[typeof global] && global;
        if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal)) {
          root = freeGlobal
        }
        var Rx = {internals: {}, config: {Promise: root.Promise}, helpers: {}};
        var noop = Rx.helpers.noop = function () {
        }, notDefined = Rx.helpers.notDefined = function (x) {
          return typeof x === "undefined"
        }, isScheduler = Rx.helpers.isScheduler = function (x) {
          return x instanceof Rx.Scheduler
        }, identity = Rx.helpers.identity = function (x) {
          return x
        }, pluck = Rx.helpers.pluck = function (property) {
          return function (x) {
            return x[property]
          }
        }, just = Rx.helpers.just = function (value) {
          return function () {
            return value
          }
        }, defaultNow = Rx.helpers.defaultNow = Date.now, defaultComparer = Rx.helpers.defaultComparer = function (x, y) {
          return isEqual(x, y)
        }, defaultSubComparer = Rx.helpers.defaultSubComparer = function (x, y) {
          return x > y ? 1 : x < y ? -1 : 0
        }, defaultKeySerializer = Rx.helpers.defaultKeySerializer = function (x) {
          return x.toString()
        }, defaultError = Rx.helpers.defaultError = function (err) {
          throw err
        }, isPromise = Rx.helpers.isPromise = function (p) {
          return !!p && typeof p.then === "function"
        }, asArray = Rx.helpers.asArray = function () {
          return Array.prototype.slice.call(arguments)
        }, not = Rx.helpers.not = function (a) {
          return !a
        }, isFunction = Rx.helpers.isFunction = function () {
          var isFn = function (value) {
            return typeof value == "function" || false
          };
          if (isFn(/x/)) {
            isFn = function (value) {
              return typeof value == "function" && toString.call(value) == "[object Function]"
            }
          }
          return isFn
        }();
        var sequenceContainsNoElements = "Sequence contains no elements.";
        var argumentOutOfRange = "Argument out of range";
        var objectDisposed = "Object has been disposed";

        function checkDisposed() {
          if (this.isDisposed) {
            throw new Error(objectDisposed)
          }
        }

        Rx.config.longStackSupport = false;
        var hasStacks = false;
        try {
          throw new Error
        } catch (e) {
          hasStacks = !!e.stack
        }
        var rStartingLine = captureLine(), rFileName;
        var STACK_JUMP_SEPARATOR = "From previous event:";

        function makeStackTraceLong(error, observable) {
          if (hasStacks && observable.stack && typeof error === "object" && error !== null && error.stack && error.stack.indexOf(STACK_JUMP_SEPARATOR) === -1) {
            var stacks = [];
            for (var o = observable; !!o; o = o.source) {
              if (o.stack) {
                stacks.unshift(o.stack)
              }
            }
            stacks.unshift(error.stack);
            var concatedStacks = stacks.join("\n" + STACK_JUMP_SEPARATOR + "\n");
            error.stack = filterStackString(concatedStacks)
          }
        }

        function filterStackString(stackString) {
          var lines = stackString.split("\n"), desiredLines = [];
          for (var i = 0, len = lines.length; i < len; i++) {
            var line = lines[i];
            if (!isInternalFrame(line) && !isNodeFrame(line) && line) {
              desiredLines.push(line)
            }
          }
          return desiredLines.join("\n")
        }

        function isInternalFrame(stackLine) {
          var fileNameAndLineNumber = getFileNameAndLineNumber(stackLine);
          if (!fileNameAndLineNumber) {
            return false
          }
          var fileName = fileNameAndLineNumber[0], lineNumber = fileNameAndLineNumber[1];
          return fileName === rFileName && lineNumber >= rStartingLine && lineNumber <= rEndingLine
        }

        function isNodeFrame(stackLine) {
          return stackLine.indexOf("(module.js:") !== -1 || stackLine.indexOf("(node.js:") !== -1
        }

        function captureLine() {
          if (!hasStacks) {
            return
          }
          try {
            throw new Error
          } catch (e) {
            var lines = e.stack.split("\n");
            var firstLine = lines[0].indexOf("@") > 0 ? lines[1] : lines[2];
            var fileNameAndLineNumber = getFileNameAndLineNumber(firstLine);
            if (!fileNameAndLineNumber) {
              return
            }
            rFileName = fileNameAndLineNumber[0];
            return fileNameAndLineNumber[1]
          }
        }

        function getFileNameAndLineNumber(stackLine) {
          var attempt1 = /at .+ \((.+):(\d+):(?:\d+)\)$/.exec(stackLine);
          if (attempt1) {
            return [attempt1[1], Number(attempt1[2])]
          }
          var attempt2 = /at ([^ ]+):(\d+):(?:\d+)$/.exec(stackLine);
          if (attempt2) {
            return [attempt2[1], Number(attempt2[2])]
          }
          var attempt3 = /.*@(.+):(\d+)$/.exec(stackLine);
          if (attempt3) {
            return [attempt3[1], Number(attempt3[2])]
          }
        }

        var $iterator$ = typeof Symbol === "function" && Symbol.iterator || "_es6shim_iterator_";
        if (root.Set && typeof(new root.Set)["@@iterator"] === "function") {
          $iterator$ = "@@iterator"
        }
        var doneEnumerator = Rx.doneEnumerator = {done: true, value: undefined};
        var isIterable = Rx.helpers.isIterable = function (o) {
          return o[$iterator$] !== undefined
        };
        var isArrayLike = Rx.helpers.isArrayLike = function (o) {
          return o && o.length !== undefined
        };
        Rx.helpers.iterator = $iterator$;
        var bindCallback = Rx.internals.bindCallback = function (func, thisArg, argCount) {
          if (typeof thisArg === "undefined") {
            return func
          }
          switch (argCount) {
            case 0:
              return function () {
                return func.call(thisArg)
              };
            case 1:
              return function (arg) {
                return func.call(thisArg, arg)
              };
            case 2:
              return function (value, index) {
                return func.call(thisArg, value, index)
              };
            case 3:
              return function (value, index, collection) {
                return func.call(thisArg, value, index, collection)
              }
          }
          return function () {
            return func.apply(thisArg, arguments)
          }
        };
        var dontEnums = ["toString", "toLocaleString", "valueOf", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "constructor"], dontEnumsLength = dontEnums.length;
        var argsClass = "[object Arguments]", arrayClass = "[object Array]", boolClass = "[object Boolean]", dateClass = "[object Date]", errorClass = "[object Error]", funcClass = "[object Function]", numberClass = "[object Number]", objectClass = "[object Object]", regexpClass = "[object RegExp]", stringClass = "[object String]";
        var toString = Object.prototype.toString, hasOwnProperty = Object.prototype.hasOwnProperty, supportsArgsClass = toString.call(arguments) == argsClass, supportNodeClass, errorProto = Error.prototype, objectProto = Object.prototype, stringProto = String.prototype, propertyIsEnumerable = objectProto.propertyIsEnumerable;
        try {
          supportNodeClass = !(toString.call(document) == objectClass && !({toString: 0} + ""))
        } catch (e) {
          supportNodeClass = true
        }
        var nonEnumProps = {};
        nonEnumProps[arrayClass] = nonEnumProps[dateClass] = nonEnumProps[numberClass] = {
          constructor: true,
          toLocaleString: true,
          toString: true,
          valueOf: true
        };
        nonEnumProps[boolClass] = nonEnumProps[stringClass] = {constructor: true, toString: true, valueOf: true};
        nonEnumProps[errorClass] = nonEnumProps[funcClass] = nonEnumProps[regexpClass] = {
          constructor: true,
          toString: true
        };
        nonEnumProps[objectClass] = {constructor: true};
        var support = {};
        (function () {
          var ctor = function () {
            this.x = 1
          }, props = [];
          ctor.prototype = {valueOf: 1, y: 1};
          for (var key in new ctor) {
            props.push(key)
          }
          for (key in arguments) {
          }
          support.enumErrorProps = propertyIsEnumerable.call(errorProto, "message") || propertyIsEnumerable.call(errorProto, "name");
          support.enumPrototypes = propertyIsEnumerable.call(ctor, "prototype");
          support.nonEnumArgs = key != 0;
          support.nonEnumShadows = !/valueOf/.test(props)
        })(1);
        var isObject = Rx.internals.isObject = function (value) {
          var type = typeof value;
          return value && (type == "function" || type == "object") || false
        };

        function keysIn(object) {
          var result = [];
          if (!isObject(object)) {
            return result
          }
          if (support.nonEnumArgs && object.length && isArguments(object)) {
            object = slice.call(object)
          }
          var skipProto = support.enumPrototypes && typeof object == "function", skipErrorProps = support.enumErrorProps && (object === errorProto || object instanceof Error);
          for (var key in object) {
            if (!(skipProto && key == "prototype") && !(skipErrorProps && (key == "message" || key == "name"))) {
              result.push(key)
            }
          }
          if (support.nonEnumShadows && object !== objectProto) {
            var ctor = object.constructor, index = -1, length = dontEnumsLength;
            if (object === (ctor && ctor.prototype)) {
              var className = object === stringProto ? stringClass : object === errorProto ? errorClass : toString.call(object), nonEnum = nonEnumProps[className]
            }
            while (++index < length) {
              key = dontEnums[index];
              if (!(nonEnum && nonEnum[key]) && hasOwnProperty.call(object, key)) {
                result.push(key)
              }
            }
          }
          return result
        }

        function internalFor(object, callback, keysFunc) {
          var index = -1, props = keysFunc(object), length = props.length;
          while (++index < length) {
            var key = props[index];
            if (callback(object[key], key, object) === false) {
              break
            }
          }
          return object
        }

        function internalForIn(object, callback) {
          return internalFor(object, callback, keysIn)
        }

        function isNode(value) {
          return typeof value.toString != "function" && typeof(value + "") == "string"
        }

        var isArguments = function (value) {
          return value && typeof value == "object" ? toString.call(value) == argsClass : false
        };
        if (!supportsArgsClass) {
          isArguments = function (value) {
            return value && typeof value == "object" ? hasOwnProperty.call(value, "callee") : false
          }
        }
        var isEqual = Rx.internals.isEqual = function (x, y) {
          return deepEquals(x, y, [], [])
        };

        function deepEquals(a, b, stackA, stackB) {
          if (a === b) {
            return a !== 0 || 1 / a == 1 / b
          }
          var type = typeof a, otherType = typeof b;
          if (a === a && (a == null || b == null || type != "function" && type != "object" && otherType != "function" && otherType != "object")) {
            return false
          }
          var className = toString.call(a), otherClass = toString.call(b);
          if (className == argsClass) {
            className = objectClass
          }
          if (otherClass == argsClass) {
            otherClass = objectClass
          }
          if (className != otherClass) {
            return false
          }
          switch (className) {
            case boolClass:
            case dateClass:
              return +a == +b;
            case numberClass:
              return a != +a ? b != +b : a == 0 ? 1 / a == 1 / b : a == +b;
            case regexpClass:
            case stringClass:
              return a == String(b)
          }
          var isArr = className == arrayClass;
          if (!isArr) {
            if (className != objectClass || !support.nodeClass && (isNode(a) || isNode(b))) {
              return false
            }
            var ctorA = !support.argsObject && isArguments(a) ? Object : a.constructor, ctorB = !support.argsObject && isArguments(b) ? Object : b.constructor;
            if (ctorA != ctorB && !(hasOwnProperty.call(a, "constructor") && hasOwnProperty.call(b, "constructor")) && !(isFunction(ctorA) && ctorA instanceof ctorA && isFunction(ctorB) && ctorB instanceof ctorB) && ("constructor"in a && "constructor"in b)) {
              return false
            }
          }
          var initedStack = !stackA;
          stackA || (stackA = []);
          stackB || (stackB = []);
          var length = stackA.length;
          while (length--) {
            if (stackA[length] == a) {
              return stackB[length] == b
            }
          }
          var size = 0;
          var result = true;
          stackA.push(a);
          stackB.push(b);
          if (isArr) {
            length = a.length;
            size = b.length;
            result = size == length;
            if (result) {
              while (size--) {
                var index = length, value = b[size];
                if (!(result = deepEquals(a[size], value, stackA, stackB))) {
                  break
                }
              }
            }
          } else {
            internalForIn(b, function (value, key, b) {
              if (hasOwnProperty.call(b, key)) {
                size++;
                return result = hasOwnProperty.call(a, key) && deepEquals(a[key], value, stackA, stackB)
              }
            });
            if (result) {
              internalForIn(a, function (value, key, a) {
                if (hasOwnProperty.call(a, key)) {
                  return result = --size > -1
                }
              })
            }
          }
          stackA.pop();
          stackB.pop();
          return result
        }

        var slice = Array.prototype.slice;

        function argsOrArray(args, idx) {
          return args.length === 1 && Array.isArray(args[idx]) ? args[idx] : slice.call(args)
        }

        var hasProp = {}.hasOwnProperty;
        var inherits = this.inherits = Rx.internals.inherits = function (child, parent) {
          function __() {
            this.constructor = child
          }

          __.prototype = parent.prototype;
          child.prototype = new __
        };
        var addProperties = Rx.internals.addProperties = function (obj) {
          var sources = slice.call(arguments, 1);
          for (var i = 0, len = sources.length; i < len; i++) {
            var source = sources[i];
            for (var prop in source) {
              obj[prop] = source[prop]
            }
          }
        };
        var addRef = Rx.internals.addRef = function (xs, r) {
          return new AnonymousObservable(function (observer) {
            return new CompositeDisposable(r.getDisposable(), xs.subscribe(observer))
          })
        };

        function arrayInitialize(count, factory) {
          var a = new Array(count);
          for (var i = 0; i < count; i++) {
            a[i] = factory()
          }
          return a
        }

        function IndexedItem(id, value) {
          this.id = id;
          this.value = value
        }

        IndexedItem.prototype.compareTo = function (other) {
          var c = this.value.compareTo(other.value);
          c === 0 && (c = this.id - other.id);
          return c
        };
        var PriorityQueue = Rx.internals.PriorityQueue = function (capacity) {
          this.items = new Array(capacity);
          this.length = 0
        };
        var priorityProto = PriorityQueue.prototype;
        priorityProto.isHigherPriority = function (left, right) {
          return this.items[left].compareTo(this.items[right]) < 0
        };
        priorityProto.percolate = function (index) {
          if (index >= this.length || index < 0) {
            return
          }
          var parent = index - 1 >> 1;
          if (parent < 0 || parent === index) {
            return
          }
          if (this.isHigherPriority(index, parent)) {
            var temp = this.items[index];
            this.items[index] = this.items[parent];
            this.items[parent] = temp;
            this.percolate(parent)
          }
        };
        priorityProto.heapify = function (index) {
          +index || (index = 0);
          if (index >= this.length || index < 0) {
            return
          }
          var left = 2 * index + 1, right = 2 * index + 2, first = index;
          if (left < this.length && this.isHigherPriority(left, first)) {
            first = left
          }
          if (right < this.length && this.isHigherPriority(right, first)) {
            first = right
          }
          if (first !== index) {
            var temp = this.items[index];
            this.items[index] = this.items[first];
            this.items[first] = temp;
            this.heapify(first)
          }
        };
        priorityProto.peek = function () {
          return this.items[0].value
        };
        priorityProto.removeAt = function (index) {
          this.items[index] = this.items[--this.length];
          delete this.items[this.length];
          this.heapify()
        };
        priorityProto.dequeue = function () {
          var result = this.peek();
          this.removeAt(0);
          return result
        };
        priorityProto.enqueue = function (item) {
          var index = this.length++;
          this.items[index] = new IndexedItem(PriorityQueue.count++, item);
          this.percolate(index)
        };
        priorityProto.remove = function (item) {
          for (var i = 0; i < this.length; i++) {
            if (this.items[i].value === item) {
              this.removeAt(i);
              return true
            }
          }
          return false
        };
        PriorityQueue.count = 0;
        var CompositeDisposable = Rx.CompositeDisposable = function () {
          this.disposables = argsOrArray(arguments, 0);
          this.isDisposed = false;
          this.length = this.disposables.length
        };
        var CompositeDisposablePrototype = CompositeDisposable.prototype;
        CompositeDisposablePrototype.add = function (item) {
          if (this.isDisposed) {
            item.dispose()
          } else {
            this.disposables.push(item);
            this.length++
          }
        };
        CompositeDisposablePrototype.remove = function (item) {
          var shouldDispose = false;
          if (!this.isDisposed) {
            var idx = this.disposables.indexOf(item);
            if (idx !== -1) {
              shouldDispose = true;
              this.disposables.splice(idx, 1);
              this.length--;
              item.dispose()
            }
          }
          return shouldDispose
        };
        CompositeDisposablePrototype.dispose = function () {
          if (!this.isDisposed) {
            this.isDisposed = true;
            var currentDisposables = this.disposables.slice(0);
            this.disposables = [];
            this.length = 0;
            for (var i = 0, len = currentDisposables.length; i < len; i++) {
              currentDisposables[i].dispose()
            }
          }
        };
        CompositeDisposablePrototype.toArray = function () {
          return this.disposables.slice(0)
        };
        var Disposable = Rx.Disposable = function (action) {
          this.isDisposed = false;
          this.action = action || noop
        };
        Disposable.prototype.dispose = function () {
          if (!this.isDisposed) {
            this.action();
            this.isDisposed = true
          }
        };
        var disposableCreate = Disposable.create = function (action) {
          return new Disposable(action)
        };
        var disposableEmpty = Disposable.empty = {dispose: noop};
        var SingleAssignmentDisposable = Rx.SingleAssignmentDisposable = function () {
          function BooleanDisposable() {
            this.isDisposed = false;
            this.current = null
          }

          var booleanDisposablePrototype = BooleanDisposable.prototype;
          booleanDisposablePrototype.getDisposable = function () {
            return this.current
          };
          booleanDisposablePrototype.setDisposable = function (value) {
            var shouldDispose = this.isDisposed, old;
            if (!shouldDispose) {
              old = this.current;
              this.current = value
            }
            old && old.dispose();
            shouldDispose && value && value.dispose()
          };
          booleanDisposablePrototype.dispose = function () {
            var old;
            if (!this.isDisposed) {
              this.isDisposed = true;
              old = this.current;
              this.current = null
            }
            old && old.dispose()
          };
          return BooleanDisposable
        }();
        var SerialDisposable = Rx.SerialDisposable = SingleAssignmentDisposable;
        var RefCountDisposable = Rx.RefCountDisposable = function () {
          function InnerDisposable(disposable) {
            this.disposable = disposable;
            this.disposable.count++;
            this.isInnerDisposed = false
          }

          InnerDisposable.prototype.dispose = function () {
            if (!this.disposable.isDisposed) {
              if (!this.isInnerDisposed) {
                this.isInnerDisposed = true;
                this.disposable.count--;
                if (this.disposable.count === 0 && this.disposable.isPrimaryDisposed) {
                  this.disposable.isDisposed = true;
                  this.disposable.underlyingDisposable.dispose()
                }
              }
            }
          };
          function RefCountDisposable(disposable) {
            this.underlyingDisposable = disposable;
            this.isDisposed = false;
            this.isPrimaryDisposed = false;
            this.count = 0
          }

          RefCountDisposable.prototype.dispose = function () {
            if (!this.isDisposed) {
              if (!this.isPrimaryDisposed) {
                this.isPrimaryDisposed = true;
                if (this.count === 0) {
                  this.isDisposed = true;
                  this.underlyingDisposable.dispose()
                }
              }
            }
          };
          RefCountDisposable.prototype.getDisposable = function () {
            return this.isDisposed ? disposableEmpty : new InnerDisposable(this)
          };
          return RefCountDisposable
        }();

        function ScheduledDisposable(scheduler, disposable) {
          this.scheduler = scheduler;
          this.disposable = disposable;
          this.isDisposed = false
        }

        ScheduledDisposable.prototype.dispose = function () {
          var parent = this;
          this.scheduler.schedule(function () {
            if (!parent.isDisposed) {
              parent.isDisposed = true;
              parent.disposable.dispose()
            }
          })
        };
        var ScheduledItem = Rx.internals.ScheduledItem = function (scheduler, state, action, dueTime, comparer) {
          this.scheduler = scheduler;
          this.state = state;
          this.action = action;
          this.dueTime = dueTime;
          this.comparer = comparer || defaultSubComparer;
          this.disposable = new SingleAssignmentDisposable
        };
        ScheduledItem.prototype.invoke = function () {
          this.disposable.setDisposable(this.invokeCore())
        };
        ScheduledItem.prototype.compareTo = function (other) {
          return this.comparer(this.dueTime, other.dueTime)
        };
        ScheduledItem.prototype.isCancelled = function () {
          return this.disposable.isDisposed
        };
        ScheduledItem.prototype.invokeCore = function () {
          return this.action(this.scheduler, this.state)
        };
        var Scheduler = Rx.Scheduler = function () {
          function Scheduler(now, schedule, scheduleRelative, scheduleAbsolute) {
            this.now = now;
            this._schedule = schedule;
            this._scheduleRelative = scheduleRelative;
            this._scheduleAbsolute = scheduleAbsolute
          }

          function invokeAction(scheduler, action) {
            action();
            return disposableEmpty
          }

          var schedulerProto = Scheduler.prototype;
          schedulerProto.schedule = function (action) {
            return this._schedule(action, invokeAction)
          };
          schedulerProto.scheduleWithState = function (state, action) {
            return this._schedule(state, action)
          };
          schedulerProto.scheduleWithRelative = function (dueTime, action) {
            return this._scheduleRelative(action, dueTime, invokeAction)
          };
          schedulerProto.scheduleWithRelativeAndState = function (state, dueTime, action) {
            return this._scheduleRelative(state, dueTime, action)
          };
          schedulerProto.scheduleWithAbsolute = function (dueTime, action) {
            return this._scheduleAbsolute(action, dueTime, invokeAction)
          };
          schedulerProto.scheduleWithAbsoluteAndState = function (state, dueTime, action) {
            return this._scheduleAbsolute(state, dueTime, action)
          };
          Scheduler.now = defaultNow;
          Scheduler.normalize = function (timeSpan) {
            timeSpan < 0 && (timeSpan = 0);
            return timeSpan
          };
          return Scheduler
        }();
        var normalizeTime = Scheduler.normalize;
        (function (schedulerProto) {
          function invokeRecImmediate(scheduler, pair) {
            var state = pair.first, action = pair.second, group = new CompositeDisposable, recursiveAction = function (state1) {
              action(state1, function (state2) {
                var isAdded = false, isDone = false, d = scheduler.scheduleWithState(state2, function (scheduler1, state3) {
                  if (isAdded) {
                    group.remove(d)
                  } else {
                    isDone = true
                  }
                  recursiveAction(state3);
                  return disposableEmpty
                });
                if (!isDone) {
                  group.add(d);
                  isAdded = true
                }
              })
            };
            recursiveAction(state);
            return group
          }

          function invokeRecDate(scheduler, pair, method) {
            var state = pair.first, action = pair.second, group = new CompositeDisposable, recursiveAction = function (state1) {
              action(state1, function (state2, dueTime1) {
                var isAdded = false, isDone = false, d = scheduler[method].call(scheduler, state2, dueTime1, function (scheduler1, state3) {
                  if (isAdded) {
                    group.remove(d)
                  } else {
                    isDone = true
                  }
                  recursiveAction(state3);
                  return disposableEmpty
                });
                if (!isDone) {
                  group.add(d);
                  isAdded = true
                }
              })
            };
            recursiveAction(state);
            return group
          }

          function scheduleInnerRecursive(action, self) {
            action(function (dt) {
              self(action, dt)
            })
          }

          schedulerProto.scheduleRecursive = function (action) {
            return this.scheduleRecursiveWithState(action, function (_action, self) {
              _action(function () {
                self(_action)
              })
            })
          };
          schedulerProto.scheduleRecursiveWithState = function (state, action) {
            return this.scheduleWithState({first: state, second: action}, invokeRecImmediate)
          };
          schedulerProto.scheduleRecursiveWithRelative = function (dueTime, action) {
            return this.scheduleRecursiveWithRelativeAndState(action, dueTime, scheduleInnerRecursive)
          };
          schedulerProto.scheduleRecursiveWithRelativeAndState = function (state, dueTime, action) {
            return this._scheduleRelative({first: state, second: action}, dueTime, function (s, p) {
              return invokeRecDate(s, p, "scheduleWithRelativeAndState")
            })
          };
          schedulerProto.scheduleRecursiveWithAbsolute = function (dueTime, action) {
            return this.scheduleRecursiveWithAbsoluteAndState(action, dueTime, scheduleInnerRecursive)
          };
          schedulerProto.scheduleRecursiveWithAbsoluteAndState = function (state, dueTime, action) {
            return this._scheduleAbsolute({first: state, second: action}, dueTime, function (s, p) {
              return invokeRecDate(s, p, "scheduleWithAbsoluteAndState")
            })
          }
        })(Scheduler.prototype);
        (function (schedulerProto) {
          Scheduler.prototype.schedulePeriodic = function (period, action) {
            return this.schedulePeriodicWithState(null, period, action)
          };
          Scheduler.prototype.schedulePeriodicWithState = function (state, period, action) {
            if (typeof root.setInterval === "undefined") {
              throw new Error("Periodic scheduling not supported.")
            }
            var s = state;
            var id = root.setInterval(function () {
              s = action(s)
            }, period);
            return disposableCreate(function () {
              root.clearInterval(id)
            })
          }
        })(Scheduler.prototype);
        (function (schedulerProto) {
          schedulerProto.catchError = schedulerProto["catch"] = function (handler) {
            return new CatchScheduler(this, handler)
          }
        })(Scheduler.prototype);
        var SchedulePeriodicRecursive = Rx.internals.SchedulePeriodicRecursive = function () {
          function tick(command, recurse) {
            recurse(0, this._period);
            try {
              this._state = this._action(this._state)
            } catch (e) {
              this._cancel.dispose();
              throw e
            }
          }

          function SchedulePeriodicRecursive(scheduler, state, period, action) {
            this._scheduler = scheduler;
            this._state = state;
            this._period = period;
            this._action = action
          }

          SchedulePeriodicRecursive.prototype.start = function () {
            var d = new SingleAssignmentDisposable;
            this._cancel = d;
            d.setDisposable(this._scheduler.scheduleRecursiveWithRelativeAndState(0, this._period, tick.bind(this)));
            return d
          };
          return SchedulePeriodicRecursive
        }();
        var immediateScheduler = Scheduler.immediate = function () {
          function scheduleNow(state, action) {
            return action(this, state)
          }

          function scheduleRelative(state, dueTime, action) {
            var dt = this.now() + normalizeTime(dueTime);
            while (dt - this.now() > 0) {
            }
            return action(this, state)
          }

          function scheduleAbsolute(state, dueTime, action) {
            return this.scheduleWithRelativeAndState(state, dueTime - this.now(), action)
          }

          return new Scheduler(defaultNow, scheduleNow, scheduleRelative, scheduleAbsolute)
        }();
        var currentThreadScheduler = Scheduler.currentThread = function () {
          var queue;

          function runTrampoline(q) {
            var item;
            while (q.length > 0) {
              item = q.dequeue();
              if (!item.isCancelled()) {
                while (item.dueTime - Scheduler.now() > 0) {
                }
                if (!item.isCancelled()) {
                  item.invoke()
                }
              }
            }
          }

          function scheduleNow(state, action) {
            return this.scheduleWithRelativeAndState(state, 0, action)
          }

          function scheduleRelative(state, dueTime, action) {
            var dt = this.now() + Scheduler.normalize(dueTime), si = new ScheduledItem(this, state, action, dt);
            if (!queue) {
              queue = new PriorityQueue(4);
              queue.enqueue(si);
              try {
                runTrampoline(queue)
              } catch (e) {
                throw e
              } finally {
                queue = null
              }
            } else {
              queue.enqueue(si)
            }
            return si.disposable
          }

          function scheduleAbsolute(state, dueTime, action) {
            return this.scheduleWithRelativeAndState(state, dueTime - this.now(), action)
          }

          var currentScheduler = new Scheduler(defaultNow, scheduleNow, scheduleRelative, scheduleAbsolute);
          currentScheduler.scheduleRequired = function () {
            return !queue
          };
          currentScheduler.ensureTrampoline = function (action) {
            if (!queue) {
              this.schedule(action)
            } else {
              action()
            }
          };
          return currentScheduler
        }();
        var scheduleMethod, clearMethod = noop;
        var localTimer = function () {
          var localSetTimeout, localClearTimeout = noop;
          if ("WScript"in this) {
            localSetTimeout = function (fn, time) {
              WScript.Sleep(time);
              fn()
            }
          } else if (!!root.setTimeout) {
            localSetTimeout = root.setTimeout;
            localClearTimeout = root.clearTimeout
          } else {
            throw new Error("No concurrency detected!")
          }
          return {setTimeout: localSetTimeout, clearTimeout: localClearTimeout}
        }();
        var localSetTimeout = localTimer.setTimeout, localClearTimeout = localTimer.clearTimeout;
        (function () {
          var reNative = RegExp("^" + String(toString).replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/toString| for [^\]]+/g, ".*?") + "$");
          var setImmediate = typeof(setImmediate = freeGlobal && moduleExports && freeGlobal.setImmediate) == "function" && !reNative.test(setImmediate) && setImmediate, clearImmediate = typeof(clearImmediate = freeGlobal && moduleExports && freeGlobal.clearImmediate) == "function" && !reNative.test(clearImmediate) && clearImmediate;

          function postMessageSupported() {
            if (!root.postMessage || root.importScripts) {
              return false
            }
            var isAsync = false, oldHandler = root.onmessage;
            root.onmessage = function () {
              isAsync = true
            };
            root.postMessage("", "*");
            root.onmessage = oldHandler;
            return isAsync
          }

          if (typeof setImmediate === "function") {
            scheduleMethod = setImmediate;
            clearMethod = clearImmediate
          } else if (typeof process !== "undefined" && {}.toString.call(process) === "[object process]") {
            scheduleMethod = process.nextTick
          } else if (postMessageSupported()) {
            var MSG_PREFIX = "ms.rx.schedule" + Math.random(), tasks = {}, taskId = 0;
            var onGlobalPostMessage = function (event) {
              if (typeof event.data === "string" && event.data.substring(0, MSG_PREFIX.length) === MSG_PREFIX) {
                var handleId = event.data.substring(MSG_PREFIX.length), action = tasks[handleId];
                action();
                delete tasks[handleId]
              }
            };
            if (root.addEventListener) {
              root.addEventListener("message", onGlobalPostMessage, false)
            } else {
              root.attachEvent("onmessage", onGlobalPostMessage, false)
            }
            scheduleMethod = function (action) {
              var currentId = taskId++;
              tasks[currentId] = action;
              root.postMessage(MSG_PREFIX + currentId, "*")
            }
          } else if (!!root.MessageChannel) {
            var channel = new root.MessageChannel, channelTasks = {}, channelTaskId = 0;
            channel.port1.onmessage = function (event) {
              var id = event.data, action = channelTasks[id];
              action();
              delete channelTasks[id]
            };
            scheduleMethod = function (action) {
              var id = channelTaskId++;
              channelTasks[id] = action;
              channel.port2.postMessage(id)
            }
          } else if ("document"in root && "onreadystatechange"in root.document.createElement("script")) {
            scheduleMethod = function (action) {
              var scriptElement = root.document.createElement("script");
              scriptElement.onreadystatechange = function () {
                action();
                scriptElement.onreadystatechange = null;
                scriptElement.parentNode.removeChild(scriptElement);
                scriptElement = null
              };
              root.document.documentElement.appendChild(scriptElement)
            }
          } else {
            scheduleMethod = function (action) {
              return localSetTimeout(action, 0)
            };
            clearMethod = localClearTimeout
          }
        })();
        var timeoutScheduler = Scheduler.timeout = function () {
          function scheduleNow(state, action) {
            var scheduler = this, disposable = new SingleAssignmentDisposable;
            var id = scheduleMethod(function () {
              if (!disposable.isDisposed) {
                disposable.setDisposable(action(scheduler, state))
              }
            });
            return new CompositeDisposable(disposable, disposableCreate(function () {
              clearMethod(id)
            }))
          }

          function scheduleRelative(state, dueTime, action) {
            var scheduler = this, dt = Scheduler.normalize(dueTime);
            if (dt === 0) {
              return scheduler.scheduleWithState(state, action)
            }
            var disposable = new SingleAssignmentDisposable;
            var id = localSetTimeout(function () {
              if (!disposable.isDisposed) {
                disposable.setDisposable(action(scheduler, state))
              }
            }, dt);
            return new CompositeDisposable(disposable, disposableCreate(function () {
              localClearTimeout(id)
            }))
          }

          function scheduleAbsolute(state, dueTime, action) {
            return this.scheduleWithRelativeAndState(state, dueTime - this.now(), action)
          }

          return new Scheduler(defaultNow, scheduleNow, scheduleRelative, scheduleAbsolute)
        }();
        var CatchScheduler = function (__super__) {
          function scheduleNow(state, action) {
            return this._scheduler.scheduleWithState(state, this._wrap(action))
          }

          function scheduleRelative(state, dueTime, action) {
            return this._scheduler.scheduleWithRelativeAndState(state, dueTime, this._wrap(action))
          }

          function scheduleAbsolute(state, dueTime, action) {
            return this._scheduler.scheduleWithAbsoluteAndState(state, dueTime, this._wrap(action))
          }

          inherits(CatchScheduler, __super__);
          function CatchScheduler(scheduler, handler) {
            this._scheduler = scheduler;
            this._handler = handler;
            this._recursiveOriginal = null;
            this._recursiveWrapper = null;
            __super__.call(this, this._scheduler.now.bind(this._scheduler), scheduleNow, scheduleRelative, scheduleAbsolute)
          }

          CatchScheduler.prototype._clone = function (scheduler) {
            return new CatchScheduler(scheduler, this._handler)
          };
          CatchScheduler.prototype._wrap = function (action) {
            var parent = this;
            return function (self, state) {
              try {
                return action(parent._getRecursiveWrapper(self), state)
              } catch (e) {
                if (!parent._handler(e)) {
                  throw e
                }
                return disposableEmpty
              }
            }
          };
          CatchScheduler.prototype._getRecursiveWrapper = function (scheduler) {
            if (this._recursiveOriginal !== scheduler) {
              this._recursiveOriginal = scheduler;
              var wrapper = this._clone(scheduler);
              wrapper._recursiveOriginal = scheduler;
              wrapper._recursiveWrapper = wrapper;
              this._recursiveWrapper = wrapper
            }
            return this._recursiveWrapper
          };
          CatchScheduler.prototype.schedulePeriodicWithState = function (state, period, action) {
            var self = this, failed = false, d = new SingleAssignmentDisposable;
            d.setDisposable(this._scheduler.schedulePeriodicWithState(state, period, function (state1) {
              if (failed) {
                return null
              }
              try {
                return action(state1)
              } catch (e) {
                failed = true;
                if (!self._handler(e)) {
                  throw e
                }
                d.dispose();
                return null
              }
            }));
            return d
          };
          return CatchScheduler
        }(Scheduler);
        var Notification = Rx.Notification = function () {
          function Notification(kind, hasValue) {
            this.hasValue = hasValue == null ? false : hasValue;
            this.kind = kind
          }

          Notification.prototype.accept = function (observerOrOnNext, onError, onCompleted) {
            return observerOrOnNext && typeof observerOrOnNext === "object" ? this._acceptObservable(observerOrOnNext) : this._accept(observerOrOnNext, onError, onCompleted)
          };
          Notification.prototype.toObservable = function (scheduler) {
            var notification = this;
            isScheduler(scheduler) || (scheduler = immediateScheduler);
            return new AnonymousObservable(function (observer) {
              return scheduler.schedule(function () {
                notification._acceptObservable(observer);
                notification.kind === "N" && observer.onCompleted()
              })
            })
          };
          return Notification
        }();
        var notificationCreateOnNext = Notification.createOnNext = function () {
          function _accept(onNext) {
            return onNext(this.value)
          }

          function _acceptObservable(observer) {
            return observer.onNext(this.value)
          }

          function toString() {
            return "OnNext(" + this.value + ")"
          }

          return function (value) {
            var notification = new Notification("N", true);
            notification.value = value;
            notification._accept = _accept;
            notification._acceptObservable = _acceptObservable;
            notification.toString = toString;
            return notification
          }
        }();
        var notificationCreateOnError = Notification.createOnError = function () {
          function _accept(onNext, onError) {
            return onError(this.exception)
          }

          function _acceptObservable(observer) {
            return observer.onError(this.exception)
          }

          function toString() {
            return "OnError(" + this.exception + ")"
          }

          return function (e) {
            var notification = new Notification("E");
            notification.exception = e;
            notification._accept = _accept;
            notification._acceptObservable = _acceptObservable;
            notification.toString = toString;
            return notification
          }
        }();
        var notificationCreateOnCompleted = Notification.createOnCompleted = function () {
          function _accept(onNext, onError, onCompleted) {
            return onCompleted()
          }

          function _acceptObservable(observer) {
            return observer.onCompleted()
          }

          function toString() {
            return "OnCompleted()"
          }

          return function () {
            var notification = new Notification("C");
            notification._accept = _accept;
            notification._acceptObservable = _acceptObservable;
            notification.toString = toString;
            return notification
          }
        }();
        var Enumerator = Rx.internals.Enumerator = function (next) {
          this._next = next
        };
        Enumerator.prototype.next = function () {
          return this._next()
        };
        Enumerator.prototype[$iterator$] = function () {
          return this
        };
        var Enumerable = Rx.internals.Enumerable = function (iterator) {
          this._iterator = iterator
        };
        Enumerable.prototype[$iterator$] = function () {
          return this._iterator()
        };
        Enumerable.prototype.concat = function () {
          var sources = this;
          return new AnonymousObservable(function (observer) {
            var e;
            try {
              e = sources[$iterator$]()
            } catch (err) {
              observer.onError(err);
              return
            }
            var isDisposed, subscription = new SerialDisposable;
            var cancelable = immediateScheduler.scheduleRecursive(function (self) {
              var currentItem;
              if (isDisposed) {
                return
              }
              try {
                currentItem = e.next()
              } catch (ex) {
                observer.onError(ex);
                return
              }
              if (currentItem.done) {
                observer.onCompleted();
                return
              }
              var currentValue = currentItem.value;
              isPromise(currentValue) && (currentValue = observableFromPromise(currentValue));
              var d = new SingleAssignmentDisposable;
              subscription.setDisposable(d);
              d.setDisposable(currentValue.subscribe(observer.onNext.bind(observer), observer.onError.bind(observer), function () {
                self()
              }))
            });
            return new CompositeDisposable(subscription, cancelable, disposableCreate(function () {
              isDisposed = true
            }))
          })
        };
        Enumerable.prototype.catchError = function () {
          var sources = this;
          return new AnonymousObservable(function (observer) {
            var e;
            try {
              e = sources[$iterator$]()
            } catch (err) {
              observer.onError(err);
              return
            }
            var isDisposed, lastException, subscription = new SerialDisposable;
            var cancelable = immediateScheduler.scheduleRecursive(function (self) {
              if (isDisposed) {
                return
              }
              var currentItem;
              try {
                currentItem = e.next()
              } catch (ex) {
                observer.onError(ex);
                return
              }
              if (currentItem.done) {
                if (lastException) {
                  observer.onError(lastException)
                } else {
                  observer.onCompleted()
                }
                return
              }
              var currentValue = currentItem.value;
              isPromise(currentValue) && (currentValue = observableFromPromise(currentValue));
              var d = new SingleAssignmentDisposable;
              subscription.setDisposable(d);
              d.setDisposable(currentValue.subscribe(observer.onNext.bind(observer), function (exn) {
                lastException = exn;
                self()
              }, observer.onCompleted.bind(observer)))
            });
            return new CompositeDisposable(subscription, cancelable, disposableCreate(function () {
              isDisposed = true
            }))
          })
        };
        Enumerable.prototype.catchErrorWhen = function (notificationHandler) {
          var sources = this;
          return new AnonymousObservable(function (observer) {
            var e;
            var exceptions = new Subject;
            var handled = notificationHandler(exceptions);
            var notifier = new Subject;
            var notificationDisposable = handled.subscribe(notifier);
            try {
              e = sources[$iterator$]()
            } catch (err) {
              observer.onError(err);
              return
            }
            var isDisposed, lastException, subscription = new SerialDisposable;
            var cancelable = immediateScheduler.scheduleRecursive(function (self) {
              if (isDisposed) {
                return
              }
              var currentItem;
              try {
                currentItem = e.next()
              } catch (ex) {
                observer.onError(ex);
                return
              }
              if (currentItem.done) {
                if (lastException) {
                  observer.onError(lastException)
                } else {
                  observer.onCompleted()
                }
                return
              }
              var currentValue = currentItem.value;
              isPromise(currentValue) && (currentValue = observableFromPromise(currentValue));
              var outer = new SingleAssignmentDisposable;
              var inner = new SingleAssignmentDisposable;
              subscription.setDisposable(new CompositeDisposable(inner, outer));
              outer.setDisposable(currentValue.subscribe(observer.onNext.bind(observer), function (exn) {
                inner.setDisposable(notifier.subscribe(function () {
                  self()
                }, function (ex) {
                  observer.onError(ex)
                }, function () {
                  observer.onCompleted()
                }));
                exceptions.onNext(exn)
              }, observer.onCompleted.bind(observer)))
            });
            return new CompositeDisposable(notificationDisposable, subscription, cancelable, disposableCreate(function () {
              isDisposed = true
            }))
          })
        };
        var enumerableRepeat = Enumerable.repeat = function (value, repeatCount) {
          if (repeatCount == null) {
            repeatCount = -1
          }
          return new Enumerable(function () {
            var left = repeatCount;
            return new Enumerator(function () {
              if (left === 0) {
                return doneEnumerator
              }
              if (left > 0) {
                left--
              }
              return {done: false, value: value}
            })
          })
        };
        var enumerableOf = Enumerable.of = function (source, selector, thisArg) {
          selector || (selector = identity);
          return new Enumerable(function () {
            var index = -1;
            return new Enumerator(function () {
              return ++index < source.length ? {
                done: false,
                value: selector.call(thisArg, source[index], index, source)
              } : doneEnumerator
            })
          })
        };
        var Observer = Rx.Observer = function () {
        };
        Observer.prototype.toNotifier = function () {
          var observer = this;
          return function (n) {
            return n.accept(observer)
          }
        };
        Observer.prototype.asObserver = function () {
          return new AnonymousObserver(this.onNext.bind(this), this.onError.bind(this), this.onCompleted.bind(this))
        };
        Observer.prototype.checked = function () {
          return new CheckedObserver(this)
        };
        var observerCreate = Observer.create = function (onNext, onError, onCompleted) {
          onNext || (onNext = noop);
          onError || (onError = defaultError);
          onCompleted || (onCompleted = noop);
          return new AnonymousObserver(onNext, onError, onCompleted)
        };
        Observer.fromNotifier = function (handler, thisArg) {
          return new AnonymousObserver(function (x) {
            return handler.call(thisArg, notificationCreateOnNext(x))
          }, function (e) {
            return handler.call(thisArg, notificationCreateOnError(e))
          }, function () {
            return handler.call(thisArg, notificationCreateOnCompleted())
          })
        };
        Observer.prototype.notifyOn = function (scheduler) {
          return new ObserveOnObserver(scheduler, this)
        };
        var AbstractObserver = Rx.internals.AbstractObserver = function (__super__) {
          inherits(AbstractObserver, __super__);
          function AbstractObserver() {
            this.isStopped = false;
            __super__.call(this)
          }

          AbstractObserver.prototype.onNext = function (value) {
            if (!this.isStopped) {
              this.next(value)
            }
          };
          AbstractObserver.prototype.onError = function (error) {
            if (!this.isStopped) {
              this.isStopped = true;
              this.error(error)
            }
          };
          AbstractObserver.prototype.onCompleted = function () {
            if (!this.isStopped) {
              this.isStopped = true;
              this.completed()
            }
          };
          AbstractObserver.prototype.dispose = function () {
            this.isStopped = true
          };
          AbstractObserver.prototype.fail = function (e) {
            if (!this.isStopped) {
              this.isStopped = true;
              this.error(e);
              return true
            }
            return false
          };
          return AbstractObserver
        }(Observer);
        var AnonymousObserver = Rx.AnonymousObserver = function (__super__) {
          inherits(AnonymousObserver, __super__);
          function AnonymousObserver(onNext, onError, onCompleted) {
            __super__.call(this);
            this._onNext = onNext;
            this._onError = onError;
            this._onCompleted = onCompleted
          }

          AnonymousObserver.prototype.next = function (value) {
            this._onNext(value)
          };
          AnonymousObserver.prototype.error = function (error) {
            this._onError(error)
          };
          AnonymousObserver.prototype.completed = function () {
            this._onCompleted()
          };
          return AnonymousObserver
        }(AbstractObserver);
        var CheckedObserver = function (_super) {
          inherits(CheckedObserver, _super);
          function CheckedObserver(observer) {
            _super.call(this);
            this._observer = observer;
            this._state = 0
          }

          var CheckedObserverPrototype = CheckedObserver.prototype;
          CheckedObserverPrototype.onNext = function (value) {
            this.checkAccess();
            try {
              this._observer.onNext(value)
            } catch (e) {
              throw e
            } finally {
              this._state = 0
            }
          };
          CheckedObserverPrototype.onError = function (err) {
            this.checkAccess();
            try {
              this._observer.onError(err)
            } catch (e) {
              throw e
            } finally {
              this._state = 2
            }
          };
          CheckedObserverPrototype.onCompleted = function () {
            this.checkAccess();
            try {
              this._observer.onCompleted()
            } catch (e) {
              throw e
            } finally {
              this._state = 2
            }
          };
          CheckedObserverPrototype.checkAccess = function () {
            if (this._state === 1) {
              throw new Error("Re-entrancy detected")
            }
            if (this._state === 2) {
              throw new Error("Observer completed")
            }
            if (this._state === 0) {
              this._state = 1
            }
          };
          return CheckedObserver
        }(Observer);
        var ScheduledObserver = Rx.internals.ScheduledObserver = function (__super__) {
          inherits(ScheduledObserver, __super__);
          function ScheduledObserver(scheduler, observer) {
            __super__.call(this);
            this.scheduler = scheduler;
            this.observer = observer;
            this.isAcquired = false;
            this.hasFaulted = false;
            this.queue = [];
            this.disposable = new SerialDisposable
          }

          ScheduledObserver.prototype.next = function (value) {
            var self = this;
            this.queue.push(function () {
              self.observer.onNext(value)
            })
          };
          ScheduledObserver.prototype.error = function (e) {
            var self = this;
            this.queue.push(function () {
              self.observer.onError(e)
            })
          };
          ScheduledObserver.prototype.completed = function () {
            var self = this;
            this.queue.push(function () {
              self.observer.onCompleted()
            })
          };
          ScheduledObserver.prototype.ensureActive = function () {
            var isOwner = false, parent = this;
            if (!this.hasFaulted && this.queue.length > 0) {
              isOwner = !this.isAcquired;
              this.isAcquired = true
            }
            if (isOwner) {
              this.disposable.setDisposable(this.scheduler.scheduleRecursive(function (self) {
                var work;
                if (parent.queue.length > 0) {
                  work = parent.queue.shift()
                } else {
                  parent.isAcquired = false;
                  return
                }
                try {
                  work()
                } catch (ex) {
                  parent.queue = [];
                  parent.hasFaulted = true;
                  throw ex
                }
                self()
              }))
            }
          };
          ScheduledObserver.prototype.dispose = function () {
            __super__.prototype.dispose.call(this);
            this.disposable.dispose()
          };
          return ScheduledObserver
        }(AbstractObserver);
        var ObserveOnObserver = function (__super__) {
          inherits(ObserveOnObserver, __super__);
          function ObserveOnObserver(scheduler, observer, cancel) {
            __super__.call(this, scheduler, observer);
            this._cancel = cancel
          }

          ObserveOnObserver.prototype.next = function (value) {
            __super__.prototype.next.call(this, value);
            this.ensureActive()
          };
          ObserveOnObserver.prototype.error = function (e) {
            __super__.prototype.error.call(this, e);
            this.ensureActive()
          };
          ObserveOnObserver.prototype.completed = function () {
            __super__.prototype.completed.call(this);
            this.ensureActive()
          };
          ObserveOnObserver.prototype.dispose = function () {
            __super__.prototype.dispose.call(this);
            this._cancel && this._cancel.dispose();
            this._cancel = null
          };
          return ObserveOnObserver
        }(ScheduledObserver);
        var observableProto;
        var Observable = Rx.Observable = function () {
          function Observable(subscribe) {
            if (Rx.config.longStackSupport && hasStacks) {
              try {
                throw new Error
              } catch (e) {
                this.stack = e.stack.substring(e.stack.indexOf("\n") + 1)
              }
              var self = this;
              this._subscribe = function (observer) {
                var oldOnError = observer.onError.bind(observer);
                observer.onError = function (err) {
                  makeStackTraceLong(err, self);
                  oldOnError(err)
                };
                return subscribe.call(self, observer)
              }
            } else {
              this._subscribe = subscribe
            }
          }

          observableProto = Observable.prototype;
          observableProto.subscribe = observableProto.forEach = function (observerOrOnNext, onError, onCompleted) {
            return this._subscribe(typeof observerOrOnNext === "object" ? observerOrOnNext : observerCreate(observerOrOnNext, onError, onCompleted))
          };
          observableProto.subscribeOnNext = function (onNext, thisArg) {
            return this._subscribe(observerCreate(arguments.length === 2 ? function (x) {
              onNext.call(thisArg, x)
            } : onNext))
          };
          observableProto.subscribeOnError = function (onError, thisArg) {
            return this._subscribe(observerCreate(null, arguments.length === 2 ? function (e) {
              onError.call(thisArg, e)
            } : onError))
          };
          observableProto.subscribeOnCompleted = function (onCompleted, thisArg) {
            return this._subscribe(observerCreate(null, null, arguments.length === 2 ? function () {
              onCompleted.call(thisArg)
            } : onCompleted))
          };
          return Observable
        }();
        observableProto.observeOn = function (scheduler) {
          var source = this;
          return new AnonymousObservable(function (observer) {
            return source.subscribe(new ObserveOnObserver(scheduler, observer))
          }, source)
        };
        observableProto.subscribeOn = function (scheduler) {
          var source = this;
          return new AnonymousObservable(function (observer) {
            var m = new SingleAssignmentDisposable, d = new SerialDisposable;
            d.setDisposable(m);
            m.setDisposable(scheduler.schedule(function () {
              d.setDisposable(new ScheduledDisposable(scheduler, source.subscribe(observer)))
            }));
            return d
          }, source)
        };
        var observableFromPromise = Observable.fromPromise = function (promise) {
          return observableDefer(function () {
            var subject = new Rx.AsyncSubject;
            promise.then(function (value) {
              subject.onNext(value);
              subject.onCompleted()
            }, subject.onError.bind(subject));
            return subject
          })
        };
        observableProto.toPromise = function (promiseCtor) {
          promiseCtor || (promiseCtor = Rx.config.Promise);
          if (!promiseCtor) {
            throw new TypeError("Promise type not provided nor in Rx.config.Promise")
          }
          var source = this;
          return new promiseCtor(function (resolve, reject) {
            var value, hasValue = false;
            source.subscribe(function (v) {
              value = v;
              hasValue = true
            }, reject, function () {
              hasValue && resolve(value)
            })
          })
        };
        observableProto.toArray = function () {
          var source = this;
          return new AnonymousObservable(function (observer) {
            var arr = [];
            return source.subscribe(function (x) {
              arr.push(x)
            }, function (e) {
              observer.onError(e)
            }, function () {
              observer.onNext(arr);
              observer.onCompleted()
            })
          }, source)
        };
        Observable.create = Observable.createWithDisposable = function (subscribe, parent) {
          return new AnonymousObservable(subscribe, parent)
        };
        var observableDefer = Observable.defer = function (observableFactory) {
          return new AnonymousObservable(function (observer) {
            var result;
            try {
              result = observableFactory()
            } catch (e) {
              return observableThrow(e).subscribe(observer)
            }
            isPromise(result) && (result = observableFromPromise(result));
            return result.subscribe(observer)
          })
        };
        var observableEmpty = Observable.empty = function (scheduler) {
          isScheduler(scheduler) || (scheduler = immediateScheduler);
          return new AnonymousObservable(function (observer) {
            return scheduler.schedule(function () {
              observer.onCompleted()
            })
          })
        };
        var maxSafeInteger = Math.pow(2, 53) - 1;

        function StringIterable(str) {
          this._s = s
        }

        StringIterable.prototype[$iterator$] = function () {
          return new StringIterator(this._s)
        };
        function StringIterator(str) {
          this._s = s;
          this._l = s.length;
          this._i = 0
        }

        StringIterator.prototype[$iterator$] = function () {
          return this
        };
        StringIterator.prototype.next = function () {
          if (this._i < this._l) {
            var val = this._s.charAt(this._i++);
            return {done: false, value: val}
          } else {
            return doneEnumerator
          }
        };
        function ArrayIterable(a) {
          this._a = a
        }

        ArrayIterable.prototype[$iterator$] = function () {
          return new ArrayIterator(this._a)
        };
        function ArrayIterator(a) {
          this._a = a;
          this._l = toLength(a);
          this._i = 0
        }

        ArrayIterator.prototype[$iterator$] = function () {
          return this
        };
        ArrayIterator.prototype.next = function () {
          if (this._i < this._l) {
            var val = this._a[this._i++];
            return {done: false, value: val}
          } else {
            return doneEnumerator
          }
        };
        function numberIsFinite(value) {
          return typeof value === "number" && root.isFinite(value)
        }

        function isNan(n) {
          return n !== n
        }

        function getIterable(o) {
          var i = o[$iterator$], it;
          if (!i && typeof o === "string") {
            it = new StringIterable(o);
            return it[$iterator$]()
          }
          if (!i && o.length !== undefined) {
            it = new ArrayIterable(o);
            return it[$iterator$]()
          }
          if (!i) {
            throw new TypeError("Object is not iterable")
          }
          return o[$iterator$]()
        }

        function sign(value) {
          var number = +value;
          if (number === 0) {
            return number
          }
          if (isNaN(number)) {
            return number
          }
          return number < 0 ? -1 : 1
        }

        function toLength(o) {
          var len = +o.length;
          if (isNaN(len)) {
            return 0
          }
          if (len === 0 || !numberIsFinite(len)) {
            return len
          }
          len = sign(len) * Math.floor(Math.abs(len));
          if (len <= 0) {
            return 0
          }
          if (len > maxSafeInteger) {
            return maxSafeInteger
          }
          return len
        }

        var observableFrom = Observable.from = function (iterable, mapFn, thisArg, scheduler) {
          if (iterable == null) {
            throw new Error("iterable cannot be null.")
          }
          if (mapFn && !isFunction(mapFn)) {
            throw new Error("mapFn when provided must be a function")
          }
          if (mapFn) {
            var mapper = bindCallback(mapFn, thisArg, 2)
          }
          isScheduler(scheduler) || (scheduler = currentThreadScheduler);
          var list = Object(iterable), it = getIterable(list);
          return new AnonymousObservable(function (observer) {
            var i = 0;
            return scheduler.scheduleRecursive(function (self) {
              var next;
              try {
                next = it.next()
              } catch (e) {
                observer.onError(e);
                return
              }
              if (next.done) {
                observer.onCompleted();
                return
              }
              var result = next.value;
              if (mapper) {
                try {
                  result = mapper(result, i)
                } catch (e) {
                  observer.onError(e);
                  return
                }
              }
              observer.onNext(result);
              i++;
              self()
            })
          })
        };
        var observableFromArray = Observable.fromArray = function (array, scheduler) {
          isScheduler(scheduler) || (scheduler = currentThreadScheduler);
          return new AnonymousObservable(function (observer) {
            var count = 0, len = array.length;
            return scheduler.scheduleRecursive(function (self) {
              if (count < len) {
                observer.onNext(array[count++]);
                self()
              } else {
                observer.onCompleted()
              }
            })
          })
        };
        Observable.generate = function (initialState, condition, iterate, resultSelector, scheduler) {
          isScheduler(scheduler) || (scheduler = currentThreadScheduler);
          return new AnonymousObservable(function (observer) {
            var first = true, state = initialState;
            return scheduler.scheduleRecursive(function (self) {
              var hasResult, result;
              try {
                if (first) {
                  first = false
                } else {
                  state = iterate(state)
                }
                hasResult = condition(state);
                if (hasResult) {
                  result = resultSelector(state)
                }
              } catch (exception) {
                observer.onError(exception);
                return
              }
              if (hasResult) {
                observer.onNext(result);
                self()
              } else {
                observer.onCompleted()
              }
            })
          })
        };
        var observableNever = Observable.never = function () {
          return new AnonymousObservable(function () {
            return disposableEmpty
          })
        };

        function observableOf(scheduler, array) {
          isScheduler(scheduler) || (scheduler = currentThreadScheduler);
          return new AnonymousObservable(function (observer) {
            var count = 0, len = array.length;
            return scheduler.scheduleRecursive(function (self) {
              if (count < len) {
                observer.onNext(array[count++]);
                self()
              } else {
                observer.onCompleted()
              }
            })
          })
        }

        Observable.of = function () {
          return observableOf(null, arguments)
        };
        Observable.ofWithScheduler = function (scheduler) {
          return observableOf(scheduler, slice.call(arguments, 1))
        };
        Observable.pairs = function (obj, scheduler) {
          scheduler || (scheduler = Rx.Scheduler.currentThread);
          return new AnonymousObservable(function (observer) {
            var idx = 0, keys = Object.keys(obj), len = keys.length;
            return scheduler.scheduleRecursive(function (self) {
              if (idx < len) {
                var key = keys[idx++];
                observer.onNext([key, obj[key]]);
                self()
              } else {
                observer.onCompleted()
              }
            })
          })
        };
        Observable.range = function (start, count, scheduler) {
          isScheduler(scheduler) || (scheduler = currentThreadScheduler);
          return new AnonymousObservable(function (observer) {
            return scheduler.scheduleRecursiveWithState(0, function (i, self) {
              if (i < count) {
                observer.onNext(start + i);
                self(i + 1)
              } else {
                observer.onCompleted()
              }
            })
          })
        };
        Observable.repeat = function (value, repeatCount, scheduler) {
          isScheduler(scheduler) || (scheduler = currentThreadScheduler);
          return observableReturn(value, scheduler).repeat(repeatCount == null ? -1 : repeatCount)
        };
        var observableReturn = Observable["return"] = Observable.just = function (value, scheduler) {
          isScheduler(scheduler) || (scheduler = immediateScheduler);
          return new AnonymousObservable(function (observer) {
            return scheduler.schedule(function () {
              observer.onNext(value);
              observer.onCompleted()
            })
          })
        };
        Observable.returnValue = function () {
          return observableReturn.apply(null, arguments)
        };
        var observableThrow = Observable["throw"] = Observable.throwError = function (error, scheduler) {
          isScheduler(scheduler) || (scheduler = immediateScheduler);
          return new AnonymousObservable(function (observer) {
            return scheduler.schedule(function () {
              observer.onError(error)
            })
          })
        };
        Observable.throwException = function () {
          return Observable.throwError.apply(null, arguments)
        };
        Observable.using = function (resourceFactory, observableFactory) {
          return new AnonymousObservable(function (observer) {
            var disposable = disposableEmpty, resource, source;
            try {
              resource = resourceFactory();
              resource && (disposable = resource);
              source = observableFactory(resource)
            } catch (exception) {
              return new CompositeDisposable(observableThrow(exception).subscribe(observer), disposable)
            }
            return new CompositeDisposable(source.subscribe(observer), disposable)
          })
        };
        observableProto.amb = function (rightSource) {
          var leftSource = this;
          return new AnonymousObservable(function (observer) {
            var choice, leftChoice = "L", rightChoice = "R", leftSubscription = new SingleAssignmentDisposable, rightSubscription = new SingleAssignmentDisposable;
            isPromise(rightSource) && (rightSource = observableFromPromise(rightSource));
            function choiceL() {
              if (!choice) {
                choice = leftChoice;
                rightSubscription.dispose()
              }
            }

            function choiceR() {
              if (!choice) {
                choice = rightChoice;
                leftSubscription.dispose()
              }
            }

            leftSubscription.setDisposable(leftSource.subscribe(function (left) {
              choiceL();
              if (choice === leftChoice) {
                observer.onNext(left)
              }
            }, function (err) {
              choiceL();
              if (choice === leftChoice) {
                observer.onError(err)
              }
            }, function () {
              choiceL();
              if (choice === leftChoice) {
                observer.onCompleted()
              }
            }));
            rightSubscription.setDisposable(rightSource.subscribe(function (right) {
              choiceR();
              if (choice === rightChoice) {
                observer.onNext(right)
              }
            }, function (err) {
              choiceR();
              if (choice === rightChoice) {
                observer.onError(err)
              }
            }, function () {
              choiceR();
              if (choice === rightChoice) {
                observer.onCompleted()
              }
            }));
            return new CompositeDisposable(leftSubscription, rightSubscription)
          })
        };
        Observable.amb = function () {
          var acc = observableNever(), items = argsOrArray(arguments, 0);

          function func(previous, current) {
            return previous.amb(current)
          }

          for (var i = 0, len = items.length; i < len; i++) {
            acc = func(acc, items[i])
          }
          return acc
        };
        function observableCatchHandler(source, handler) {
          return new AnonymousObservable(function (observer) {
            var d1 = new SingleAssignmentDisposable, subscription = new SerialDisposable;
            subscription.setDisposable(d1);
            d1.setDisposable(source.subscribe(observer.onNext.bind(observer), function (exception) {
              var d, result;
              try {
                result = handler(exception)
              } catch (ex) {
                observer.onError(ex);
                return
              }
              isPromise(result) && (result = observableFromPromise(result));
              d = new SingleAssignmentDisposable;
              subscription.setDisposable(d);
              d.setDisposable(result.subscribe(observer))
            }, observer.onCompleted.bind(observer)));
            return subscription
          }, source)
        }

        observableProto["catch"] = observableProto.catchError = function (handlerOrSecond) {
          return typeof handlerOrSecond === "function" ? observableCatchHandler(this, handlerOrSecond) : observableCatch([this, handlerOrSecond])
        };
        observableProto.catchException = function (handlerOrSecond) {
          return this.catchError(handlerOrSecond)
        };
        var observableCatch = Observable.catchError = Observable["catch"] = function () {
          return enumerableOf(argsOrArray(arguments, 0)).catchError()
        };
        Observable.catchException = function () {
          return observableCatch.apply(null, arguments)
        };
        observableProto.combineLatest = function () {
          var args = slice.call(arguments);
          if (Array.isArray(args[0])) {
            args[0].unshift(this)
          } else {
            args.unshift(this)
          }
          return combineLatest.apply(this, args)
        };
        var combineLatest = Observable.combineLatest = function () {
          var args = slice.call(arguments), resultSelector = args.pop();
          if (Array.isArray(args[0])) {
            args = args[0]
          }
          return new AnonymousObservable(function (observer) {
            var falseFactory = function () {
              return false
            }, n = args.length, hasValue = arrayInitialize(n, falseFactory), hasValueAll = false, isDone = arrayInitialize(n, falseFactory), values = new Array(n);

            function next(i) {
              var res;
              hasValue[i] = true;
              if (hasValueAll || (hasValueAll = hasValue.every(identity))) {
                try {
                  res = resultSelector.apply(null, values)
                } catch (ex) {
                  observer.onError(ex);
                  return
                }
                observer.onNext(res)
              } else if (isDone.filter(function (x, j) {
                  return j !== i
                }).every(identity)) {
                observer.onCompleted()
              }
            }

            function done(i) {
              isDone[i] = true;
              if (isDone.every(identity)) {
                observer.onCompleted()
              }
            }

            var subscriptions = new Array(n);
            for (var idx = 0; idx < n; idx++) {
              (function (i) {
                var source = args[i], sad = new SingleAssignmentDisposable;
                isPromise(source) && (source = observableFromPromise(source));
                sad.setDisposable(source.subscribe(function (x) {
                  values[i] = x;
                  next(i)
                }, function (e) {
                  observer.onError(e)
                }, function () {
                  done(i)
                }));
                subscriptions[i] = sad
              })(idx)
            }
            return new CompositeDisposable(subscriptions)
          }, this)
        };
        observableProto.concat = function () {
          var items = slice.call(arguments, 0);
          items.unshift(this);
          return observableConcat.apply(this, items)
        };
        var observableConcat = Observable.concat = function () {
          return enumerableOf(argsOrArray(arguments, 0)).concat()
        };
        observableProto.concatAll = function () {
          return this.merge(1)
        };
        observableProto.concatObservable = function () {
          return this.merge(1)
        };
        observableProto.merge = function (maxConcurrentOrOther) {
          if (typeof maxConcurrentOrOther !== "number") {
            return observableMerge(this, maxConcurrentOrOther)
          }
          var sources = this;
          return new AnonymousObservable(function (o) {
            var activeCount = 0, group = new CompositeDisposable, isStopped = false, q = [];

            function subscribe(xs) {
              var subscription = new SingleAssignmentDisposable;
              group.add(subscription);
              isPromise(xs) && (xs = observableFromPromise(xs));
              subscription.setDisposable(xs.subscribe(function (x) {
                o.onNext(x)
              }, function (e) {
                o.onError(e)
              }, function () {
                group.remove(subscription);
                if (q.length > 0) {
                  subscribe(q.shift())
                } else {
                  activeCount--;
                  isStopped && activeCount === 0 && o.onCompleted()
                }
              }))
            }

            group.add(sources.subscribe(function (innerSource) {
              if (activeCount < maxConcurrentOrOther) {
                activeCount++;
                subscribe(innerSource)
              } else {
                q.push(innerSource)
              }
            }, function (e) {
              o.onError(e)
            }, function () {
              isStopped = true;
              activeCount === 0 && o.onCompleted()
            }));
            return group
          }, sources)
        };
        var observableMerge = Observable.merge = function () {
          var scheduler, sources;
          if (!arguments[0]) {
            scheduler = immediateScheduler;
            sources = slice.call(arguments, 1)
          } else if (isScheduler(arguments[0])) {
            scheduler = arguments[0];
            sources = slice.call(arguments, 1)
          } else {
            scheduler = immediateScheduler;
            sources = slice.call(arguments, 0)
          }
          if (Array.isArray(sources[0])) {
            sources = sources[0]
          }
          return observableOf(scheduler, sources).mergeAll()
        };
        observableProto.mergeAll = function () {
          var sources = this;
          return new AnonymousObservable(function (o) {
            var group = new CompositeDisposable, isStopped = false, m = new SingleAssignmentDisposable;
            group.add(m);
            m.setDisposable(sources.subscribe(function (innerSource) {
              var innerSubscription = new SingleAssignmentDisposable;
              group.add(innerSubscription);
              isPromise(innerSource) && (innerSource = observableFromPromise(innerSource));
              innerSubscription.setDisposable(innerSource.subscribe(function (x) {
                o.onNext(x)
              }, function (e) {
                o.onError(e)
              }, function () {
                group.remove(innerSubscription);
                isStopped && group.length === 1 && o.onCompleted()
              }))
            }, function (e) {
              o.onError(e)
            }, function () {
              isStopped = true;
              group.length === 1 && o.onCompleted()
            }));
            return group
          }, sources)
        };
        observableProto.mergeObservable = function () {
          return this.mergeAll.apply(this, arguments)
        };
        observableProto.onErrorResumeNext = function (second) {
          if (!second) {
            throw new Error("Second observable is required")
          }
          return onErrorResumeNext([this, second])
        };
        var onErrorResumeNext = Observable.onErrorResumeNext = function () {
          var sources = argsOrArray(arguments, 0);
          return new AnonymousObservable(function (observer) {
            var pos = 0, subscription = new SerialDisposable, cancelable = immediateScheduler.scheduleRecursive(function (self) {
              var current, d;
              if (pos < sources.length) {
                current = sources[pos++];
                isPromise(current) && (current = observableFromPromise(current));
                d = new SingleAssignmentDisposable;
                subscription.setDisposable(d);
                d.setDisposable(current.subscribe(observer.onNext.bind(observer), self, self))
              } else {
                observer.onCompleted()
              }
            });
            return new CompositeDisposable(subscription, cancelable)
          })
        };
        observableProto.skipUntil = function (other) {
          var source = this;
          return new AnonymousObservable(function (o) {
            var isOpen = false;
            var disposables = new CompositeDisposable(source.subscribe(function (left) {
              isOpen && o.onNext(left)
            }, function (e) {
              o.onError(e)
            }, function () {
              isOpen && o.onCompleted()
            }));
            isPromise(other) && (other = observableFromPromise(other));
            var rightSubscription = new SingleAssignmentDisposable;
            disposables.add(rightSubscription);
            rightSubscription.setDisposable(other.subscribe(function () {
              isOpen = true;
              rightSubscription.dispose()
            }, function (e) {
              o.onError(e)
            }, function () {
              rightSubscription.dispose()
            }));
            return disposables
          }, source)
        };
        observableProto["switch"] = observableProto.switchLatest = function () {
          var sources = this;
          return new AnonymousObservable(function (observer) {
            var hasLatest = false, innerSubscription = new SerialDisposable, isStopped = false, latest = 0, subscription = sources.subscribe(function (innerSource) {
              var d = new SingleAssignmentDisposable, id = ++latest;
              hasLatest = true;
              innerSubscription.setDisposable(d);
              isPromise(innerSource) && (innerSource = observableFromPromise(innerSource));
              d.setDisposable(innerSource.subscribe(function (x) {
                latest === id && observer.onNext(x)
              }, function (e) {
                latest === id && observer.onError(e)
              }, function () {
                if (latest === id) {
                  hasLatest = false;
                  isStopped && observer.onCompleted()
                }
              }))
            }, observer.onError.bind(observer), function () {
              isStopped = true;
              !hasLatest && observer.onCompleted()
            });
            return new CompositeDisposable(subscription, innerSubscription)
          }, sources)
        };
        observableProto.takeUntil = function (other) {
          var source = this;
          return new AnonymousObservable(function (o) {
            isPromise(other) && (other = observableFromPromise(other));
            return new CompositeDisposable(source.subscribe(o), other.subscribe(function () {
              o.onCompleted()
            }, function (e) {
              o.onError(e)
            }, noop))
          }, source)
        };
        observableProto.withLatestFrom = function () {
          var source = this;
          var args = slice.call(arguments);
          var resultSelector = args.pop();
          if (typeof source === "undefined") {
            throw new Error("Source observable not found for withLatestFrom().")
          }
          if (typeof resultSelector !== "function") {
            throw new Error("withLatestFrom() expects a resultSelector function.")
          }
          if (Array.isArray(args[0])) {
            args = args[0]
          }
          return new AnonymousObservable(function (observer) {
            var falseFactory = function () {
              return false
            }, n = args.length, hasValue = arrayInitialize(n, falseFactory), hasValueAll = false, values = new Array(n);
            var subscriptions = new Array(n + 1);
            for (var idx = 0; idx < n; idx++) {
              (function (i) {
                var other = args[i], sad = new SingleAssignmentDisposable;
                isPromise(other) && (other = observableFromPromise(other));
                sad.setDisposable(other.subscribe(function (x) {
                  values[i] = x;
                  hasValue[i] = true;
                  hasValueAll = hasValue.every(identity)
                }, observer.onError.bind(observer), function () {
                }));
                subscriptions[i] = sad
              })(idx)
            }
            var sad = new SingleAssignmentDisposable;
            sad.setDisposable(source.subscribe(function (x) {
              var res;
              var allValues = [x].concat(values);
              if (!hasValueAll)return;
              try {
                res = resultSelector.apply(null, allValues)
              } catch (ex) {
                observer.onError(ex);
                return
              }
              observer.onNext(res)
            }, observer.onError.bind(observer), function () {
              observer.onCompleted()
            }));
            subscriptions[n] = sad;
            return new CompositeDisposable(subscriptions)
          }, this)
        };
        function zipArray(second, resultSelector) {
          var first = this;
          return new AnonymousObservable(function (observer) {
            var index = 0, len = second.length;
            return first.subscribe(function (left) {
              if (index < len) {
                var right = second[index++], result;
                try {
                  result = resultSelector(left, right)
                } catch (e) {
                  observer.onError(e);
                  return
                }
                observer.onNext(result)
              } else {
                observer.onCompleted()
              }
            }, function (e) {
              observer.onError(e)
            }, function () {
              observer.onCompleted()
            })
          }, first)
        }

        observableProto.zip = function () {
          if (Array.isArray(arguments[0])) {
            return zipArray.apply(this, arguments)
          }
          var parent = this, sources = slice.call(arguments), resultSelector = sources.pop();
          sources.unshift(parent);
          return new AnonymousObservable(function (observer) {
            var n = sources.length, queues = arrayInitialize(n, function () {
              return []
            }), isDone = arrayInitialize(n, function () {
              return false
            });

            function next(i) {
              var res, queuedValues;
              if (queues.every(function (x) {
                  return x.length > 0
                })) {
                try {
                  queuedValues = queues.map(function (x) {
                    return x.shift()
                  });
                  res = resultSelector.apply(parent, queuedValues)
                } catch (ex) {
                  observer.onError(ex);
                  return
                }
                observer.onNext(res)
              } else if (isDone.filter(function (x, j) {
                  return j !== i
                }).every(identity)) {
                observer.onCompleted()
              }
            }

            function done(i) {
              isDone[i] = true;
              if (isDone.every(function (x) {
                  return x
                })) {
                observer.onCompleted()
              }
            }

            var subscriptions = new Array(n);
            for (var idx = 0; idx < n; idx++) {
              (function (i) {
                var source = sources[i], sad = new SingleAssignmentDisposable;
                isPromise(source) && (source = observableFromPromise(source));
                sad.setDisposable(source.subscribe(function (x) {
                  queues[i].push(x);
                  next(i)
                }, function (e) {
                  observer.onError(e)
                }, function () {
                  done(i)
                }));
                subscriptions[i] = sad
              })(idx)
            }
            return new CompositeDisposable(subscriptions)
          }, parent)
        };
        Observable.zip = function () {
          var args = slice.call(arguments, 0), first = args.shift();
          return first.zip.apply(first, args)
        };
        Observable.zipArray = function () {
          var sources = argsOrArray(arguments, 0);
          return new AnonymousObservable(function (observer) {
            var n = sources.length, queues = arrayInitialize(n, function () {
              return []
            }), isDone = arrayInitialize(n, function () {
              return false
            });

            function next(i) {
              if (queues.every(function (x) {
                  return x.length > 0
                })) {
                var res = queues.map(function (x) {
                  return x.shift()
                });
                observer.onNext(res)
              } else if (isDone.filter(function (x, j) {
                  return j !== i
                }).every(identity)) {
                observer.onCompleted();
                return
              }
            }

            function done(i) {
              isDone[i] = true;
              if (isDone.every(identity)) {
                observer.onCompleted();
                return
              }
            }

            var subscriptions = new Array(n);
            for (var idx = 0; idx < n; idx++) {
              (function (i) {
                subscriptions[i] = new SingleAssignmentDisposable;
                subscriptions[i].setDisposable(sources[i].subscribe(function (x) {
                  queues[i].push(x);
                  next(i)
                }, function (e) {
                  observer.onError(e)
                }, function () {
                  done(i)
                }))
              })(idx)
            }
            return new CompositeDisposable(subscriptions)
          })
        };
        observableProto.asObservable = function () {
          var source = this;
          return new AnonymousObservable(function (o) {
            return source.subscribe(o)
          }, this)
        };
        observableProto.bufferWithCount = function (count, skip) {
          if (typeof skip !== "number") {
            skip = count
          }
          return this.windowWithCount(count, skip).selectMany(function (x) {
            return x.toArray()
          }).where(function (x) {
            return x.length > 0
          })
        };
        observableProto.dematerialize = function () {
          var source = this;
          return new AnonymousObservable(function (o) {
            return source.subscribe(function (x) {
              return x.accept(o)
            }, function (e) {
              o.onError(e)
            }, function () {
              o.onCompleted()
            })
          }, this)
        };
        observableProto.distinctUntilChanged = function (keySelector, comparer) {
          var source = this;
          keySelector || (keySelector = identity);
          comparer || (comparer = defaultComparer);
          return new AnonymousObservable(function (o) {
            var hasCurrentKey = false, currentKey;
            return source.subscribe(function (value) {
              var comparerEquals = false, key;
              try {
                key = keySelector(value)
              } catch (e) {
                o.onError(e);
                return
              }
              if (hasCurrentKey) {
                try {
                  comparerEquals = comparer(currentKey, key)
                } catch (e) {
                  o.onError(e);
                  return
                }
              }
              if (!hasCurrentKey || !comparerEquals) {
                hasCurrentKey = true;
                currentKey = key;
                o.onNext(value)
              }
            }, function (e) {
              o.onError(e)
            }, function () {
              o.onCompleted()
            })
          }, this)
        };
        observableProto["do"] = observableProto.tap = function (observerOrOnNext, onError, onCompleted) {
          var source = this, onNextFunc;
          if (typeof observerOrOnNext === "function") {
            onNextFunc = observerOrOnNext
          } else {
            onNextFunc = function (x) {
              observerOrOnNext.onNext(x)
            };
            onError = function (e) {
              observerOrOnNext.onError(e)
            };
            onCompleted = function () {
              observerOrOnNext.onCompleted()
            }
          }
          return new AnonymousObservable(function (observer) {
            return source.subscribe(function (x) {
              try {
                onNextFunc(x)
              } catch (e) {
                observer.onError(e)
              }
              observer.onNext(x)
            }, function (err) {
              if (onError) {
                try {
                  onError(err)
                } catch (e) {
                  observer.onError(e)
                }
              }
              observer.onError(err)
            }, function () {
              if (onCompleted) {
                try {
                  onCompleted()
                } catch (e) {
                  observer.onError(e)
                }
              }
              observer.onCompleted()
            })
          }, this)
        };
        observableProto.doAction = function () {
          return this.tap.apply(this, arguments)
        };
        observableProto.doOnNext = observableProto.tapOnNext = function (onNext, thisArg) {
          return this.tap(typeof thisArg !== "undefined" ? function (x) {
            onNext.call(thisArg, x)
          } : onNext)
        };
        observableProto.doOnError = observableProto.tapOnError = function (onError, thisArg) {
          return this.tap(noop, typeof thisArg !== "undefined" ? function (e) {
            onError.call(thisArg, e)
          } : onError)
        };
        observableProto.doOnCompleted = observableProto.tapOnCompleted = function (onCompleted, thisArg) {
          return this.tap(noop, null, typeof thisArg !== "undefined" ? function () {
            onCompleted.call(thisArg)
          } : onCompleted)
        };
        observableProto["finally"] = observableProto.ensure = function (action) {
          var source = this;
          return new AnonymousObservable(function (observer) {
            var subscription;
            try {
              subscription = source.subscribe(observer)
            } catch (e) {
              action();
              throw e
            }
            return disposableCreate(function () {
              try {
                subscription.dispose()
              } catch (e) {
                throw e
              } finally {
                action()
              }
            })
          }, this)
        };
        observableProto.finallyAction = function (action) {
          return this.ensure(action)
        };
        observableProto.ignoreElements = function () {
          var source = this;
          return new AnonymousObservable(function (o) {
            return source.subscribe(noop, function (e) {
              o.onError(e)
            }, function () {
              o.onCompleted()
            })
          }, source)
        };
        observableProto.materialize = function () {
          var source = this;
          return new AnonymousObservable(function (observer) {
            return source.subscribe(function (value) {
              observer.onNext(notificationCreateOnNext(value))
            }, function (e) {
              observer.onNext(notificationCreateOnError(e));
              observer.onCompleted()
            }, function () {
              observer.onNext(notificationCreateOnCompleted());
              observer.onCompleted()
            })
          }, source)
        };
        observableProto.repeat = function (repeatCount) {
          return enumerableRepeat(this, repeatCount).concat()
        };
        observableProto.retry = function (retryCount) {
          return enumerableRepeat(this, retryCount).catchError()
        };
        observableProto.retryWhen = function (notifier) {
          return enumerableRepeat(this).catchErrorWhen(notifier)
        };
        observableProto.scan = function () {
          var hasSeed = false, seed, accumulator, source = this;
          if (arguments.length === 2) {
            hasSeed = true;
            seed = arguments[0];
            accumulator = arguments[1]
          } else {
            accumulator = arguments[0]
          }
          return new AnonymousObservable(function (o) {
            var hasAccumulation, accumulation, hasValue;
            return source.subscribe(function (x) {
              !hasValue && (hasValue = true);
              try {
                if (hasAccumulation) {
                  accumulation = accumulator(accumulation, x)
                } else {
                  accumulation = hasSeed ? accumulator(seed, x) : x;
                  hasAccumulation = true
                }
              } catch (e) {
                o.onError(e);
                return
              }
              o.onNext(accumulation)
            }, function (e) {
              o.onError(e)
            }, function () {
              !hasValue && hasSeed && o.onNext(seed);
              o.onCompleted()
            })
          }, source)
        };
        observableProto.skipLast = function (count) {
          var source = this;
          return new AnonymousObservable(function (o) {
            var q = [];
            return source.subscribe(function (x) {
              q.push(x);
              q.length > count && o.onNext(q.shift())
            }, function (e) {
              o.onError(e)
            }, function () {
              o.onCompleted()
            })
          }, source)
        };
        observableProto.startWith = function () {
          var values, scheduler, start = 0;
          if (!!arguments.length && isScheduler(arguments[0])) {
            scheduler = arguments[0];
            start = 1
          } else {
            scheduler = immediateScheduler
          }
          values = slice.call(arguments, start);
          return enumerableOf([observableFromArray(values, scheduler), this]).concat()
        };
        observableProto.takeLast = function (count) {
          var source = this;
          return new AnonymousObservable(function (o) {
            var q = [];
            return source.subscribe(function (x) {
              q.push(x);
              q.length > count && q.shift()
            }, function (e) {
              o.onError(e)
            }, function () {
              while (q.length > 0) {
                o.onNext(q.shift())
              }
              o.onCompleted()
            })
          }, source)
        };
        observableProto.takeLastBuffer = function (count) {
          var source = this;
          return new AnonymousObservable(function (o) {
            var q = [];
            return source.subscribe(function (x) {
              q.push(x);
              q.length > count && q.shift()
            }, function (e) {
              o.onError(e)
            }, function () {
              o.onNext(q);
              o.onCompleted()
            })
          }, source)
        };
        observableProto.windowWithCount = function (count, skip) {
          var source = this;
          +count || (count = 0);
          Math.abs(count) === Infinity && (count = 0);
          if (count <= 0) {
            throw new Error(argumentOutOfRange)
          }
          skip == null && (skip = count);
          +skip || (skip = 0);
          Math.abs(skip) === Infinity && (skip = 0);
          if (skip <= 0) {
            throw new Error(argumentOutOfRange)
          }
          return new AnonymousObservable(function (observer) {
            var m = new SingleAssignmentDisposable, refCountDisposable = new RefCountDisposable(m), n = 0, q = [];

            function createWindow() {
              var s = new Subject;
              q.push(s);
              observer.onNext(addRef(s, refCountDisposable))
            }

            createWindow();
            m.setDisposable(source.subscribe(function (x) {
              for (var i = 0, len = q.length; i < len; i++) {
                q[i].onNext(x)
              }
              var c = n - count + 1;
              c >= 0 && c % skip === 0 && q.shift().onCompleted();
              ++n % skip === 0 && createWindow()
            }, function (e) {
              while (q.length > 0) {
                q.shift().onError(e)
              }
              observer.onError(e)
            }, function () {
              while (q.length > 0) {
                q.shift().onCompleted()
              }
              observer.onCompleted()
            }));
            return refCountDisposable
          }, source)
        };
        function concatMap(source, selector, thisArg) {
          var selectorFunc = bindCallback(selector, thisArg, 3);
          return source.map(function (x, i) {
            var result = selectorFunc(x, i, source);
            isPromise(result) && (result = observableFromPromise(result));
            (isArrayLike(result) || isIterable(result)) && (result = observableFrom(result));
            return result
          }).concatAll()
        }

        observableProto.selectConcat = observableProto.concatMap = function (selector, resultSelector, thisArg) {
          if (isFunction(selector) && isFunction(resultSelector)) {
            return this.concatMap(function (x, i) {
              var selectorResult = selector(x, i);
              isPromise(selectorResult) && (selectorResult = observableFromPromise(selectorResult));
              (isArrayLike(selectorResult) || isIterable(selectorResult)) && (selectorResult = observableFrom(selectorResult));
              return selectorResult.map(function (y, i2) {
                return resultSelector(x, y, i, i2)
              })
            })
          }
          return isFunction(selector) ? concatMap(this, selector, thisArg) : concatMap(this, function () {
            return selector
          })
        };
        observableProto.concatMapObserver = observableProto.selectConcatObserver = function (onNext, onError, onCompleted, thisArg) {
          var source = this, onNextFunc = bindCallback(onNext, thisArg, 2), onErrorFunc = bindCallback(onError, thisArg, 1), onCompletedFunc = bindCallback(onCompleted, thisArg, 0);
          return new AnonymousObservable(function (observer) {
            var index = 0;
            return source.subscribe(function (x) {
              var result;
              try {
                result = onNextFunc(x, index++)
              } catch (e) {
                observer.onError(e);
                return
              }
              isPromise(result) && (result = observableFromPromise(result));
              observer.onNext(result)
            }, function (err) {
              var result;
              try {
                result = onErrorFunc(err)
              } catch (e) {
                observer.onError(e);
                return
              }
              isPromise(result) && (result = observableFromPromise(result));
              observer.onNext(result);
              observer.onCompleted()
            }, function () {
              var result;
              try {
                result = onCompletedFunc()
              } catch (e) {
                observer.onError(e);
                return
              }
              isPromise(result) && (result = observableFromPromise(result));
              observer.onNext(result);
              observer.onCompleted()
            })
          }, this).concatAll()
        };
        observableProto.defaultIfEmpty = function (defaultValue) {
          var source = this;
          defaultValue === undefined && (defaultValue = null);
          return new AnonymousObservable(function (observer) {
            var found = false;
            return source.subscribe(function (x) {
              found = true;
              observer.onNext(x)
            }, function (e) {
              observer.onError(e)
            }, function () {
              !found && observer.onNext(defaultValue);
              observer.onCompleted()
            })
          }, source)
        };
        function arrayIndexOfComparer(array, item, comparer) {
          for (var i = 0, len = array.length; i < len; i++) {
            if (comparer(array[i], item)) {
              return i
            }
          }
          return -1
        }

        function HashSet(comparer) {
          this.comparer = comparer;
          this.set = []
        }

        HashSet.prototype.push = function (value) {
          var retValue = arrayIndexOfComparer(this.set, value, this.comparer) === -1;
          retValue && this.set.push(value);
          return retValue
        };
        observableProto.distinct = function (keySelector, comparer) {
          var source = this;
          comparer || (comparer = defaultComparer);
          return new AnonymousObservable(function (o) {
            var hashSet = new HashSet(comparer);
            return source.subscribe(function (x) {
              var key = x;
              if (keySelector) {
                try {
                  key = keySelector(x)
                } catch (e) {
                  o.onError(e);
                  return
                }
              }
              hashSet.push(key) && o.onNext(x)
            }, function (e) {
              o.onError(e)
            }, function () {
              o.onCompleted()
            })
          }, this)
        };
        observableProto.select = observableProto.map = function (selector, thisArg) {
          var selectorFn = isFunction(selector) ? bindCallback(selector, thisArg, 3) : function () {
            return selector
          }, source = this;
          return new AnonymousObservable(function (o) {
            var count = 0;
            return source.subscribe(function (value) {
              try {
                var result = selectorFn(value, count++, source)
              } catch (e) {
                o.onError(e);
                return
              }
              o.onNext(result)
            }, function (e) {
              o.onError(e)
            }, function () {
              o.onCompleted()
            })
          }, source)
        };
        observableProto.pluck = function (prop) {
          return this.map(function (x) {
            return x[prop]
          })
        };
        observableProto.flatMapObserver = observableProto.selectManyObserver = function (onNext, onError, onCompleted, thisArg) {
          var source = this;
          return new AnonymousObservable(function (observer) {
            var index = 0;
            return source.subscribe(function (x) {
              var result;
              try {
                result = onNext.call(thisArg, x, index++)
              } catch (e) {
                observer.onError(e);
                return
              }
              isPromise(result) && (result = observableFromPromise(result));
              observer.onNext(result)
            }, function (err) {
              var result;
              try {
                result = onError.call(thisArg, err)
              } catch (e) {
                observer.onError(e);
                return
              }
              isPromise(result) && (result = observableFromPromise(result));
              observer.onNext(result);
              observer.onCompleted()
            }, function () {
              var result;
              try {
                result = onCompleted.call(thisArg)
              } catch (e) {
                observer.onError(e);
                return
              }
              isPromise(result) && (result = observableFromPromise(result));
              observer.onNext(result);
              observer.onCompleted()
            })
          }, source).mergeAll()
        };
        function flatMap(source, selector, thisArg) {
          var selectorFunc = bindCallback(selector, thisArg, 3);
          return source.map(function (x, i) {
            var result = selectorFunc(x, i, source);
            isPromise(result) && (result = observableFromPromise(result));
            (isArrayLike(result) || isIterable(result)) && (result = observableFrom(result));
            return result
          }).mergeAll()
        }

        observableProto.selectMany = observableProto.flatMap = function (selector, resultSelector, thisArg) {
          if (isFunction(selector) && isFunction(resultSelector)) {
            return this.flatMap(function (x, i) {
              var selectorResult = selector(x, i);
              isPromise(selectorResult) && (selectorResult = observableFromPromise(selectorResult));
              (isArrayLike(selectorResult) || isIterable(selectorResult)) && (selectorResult = observableFrom(selectorResult));
              return selectorResult.map(function (y, i2) {
                return resultSelector(x, y, i, i2)
              })
            }, thisArg)
          }
          return isFunction(selector) ? flatMap(this, selector, thisArg) : flatMap(this, function () {
            return selector
          })
        };
        observableProto.selectSwitch = observableProto.flatMapLatest = observableProto.switchMap = function (selector, thisArg) {
          return this.select(selector, thisArg).switchLatest()
        };
        observableProto.skip = function (count) {
          if (count < 0) {
            throw new Error(argumentOutOfRange)
          }
          var source = this;
          return new AnonymousObservable(function (o) {
            var remaining = count;
            return source.subscribe(function (x) {
              if (remaining <= 0) {
                o.onNext(x)
              } else {
                remaining--
              }
            }, function (e) {
              o.onError(e)
            }, function () {
              o.onCompleted()
            })
          }, source)
        };
        observableProto.skipWhile = function (predicate, thisArg) {
          var source = this, callback = bindCallback(predicate, thisArg, 3);
          return new AnonymousObservable(function (o) {
            var i = 0, running = false;
            return source.subscribe(function (x) {
              if (!running) {
                try {
                  running = !callback(x, i++, source)
                } catch (e) {
                  o.onError(e);
                  return
                }
              }
              running && o.onNext(x)
            }, function (e) {
              o.onError(e)
            }, function () {
              o.onCompleted()
            })
          }, source)
        };
        observableProto.take = function (count, scheduler) {
          if (count < 0) {
            throw new RangeError(argumentOutOfRange)
          }
          if (count === 0) {
            return observableEmpty(scheduler)
          }
          var source = this;
          return new AnonymousObservable(function (o) {
            var remaining = count;
            return source.subscribe(function (x) {
              if (remaining-- > 0) {
                o.onNext(x);
                remaining === 0 && o.onCompleted()
              }
            }, function (e) {
              o.onError(e)
            }, function () {
              o.onCompleted()
            })
          }, source)
        };
        observableProto.takeWhile = function (predicate, thisArg) {
          var source = this, callback = bindCallback(predicate, thisArg, 3);
          return new AnonymousObservable(function (o) {
            var i = 0, running = true;
            return source.subscribe(function (x) {
              if (running) {
                try {
                  running = callback(x, i++, source)
                } catch (e) {
                  o.onError(e);
                  return
                }
                if (running) {
                  o.onNext(x)
                } else {
                  o.onCompleted()
                }
              }
            }, function (e) {
              o.onError(e)
            }, function () {
              o.onCompleted()
            })
          }, source)
        };
        observableProto.where = observableProto.filter = function (predicate, thisArg) {
          var source = this;
          predicate = bindCallback(predicate, thisArg, 3);
          return new AnonymousObservable(function (o) {
            var count = 0;
            return source.subscribe(function (value) {
              try {
                var shouldRun = predicate(value, count++, source)
              } catch (e) {
                o.onError(e);
                return
              }
              shouldRun && o.onNext(value)
            }, function (e) {
              o.onError(e)
            }, function () {
              o.onCompleted()
            })
          }, source)
        };
        observableProto.transduce = function (transducer) {
          var source = this;

          function transformForObserver(observer) {
            return {
              init: function () {
                return observer
              }, step: function (obs, input) {
                return obs.onNext(input)
              }, result: function (obs) {
                return obs.onCompleted()
              }
            }
          }

          return new AnonymousObservable(function (observer) {
            var xform = transducer(transformForObserver(observer));
            return source.subscribe(function (v) {
              try {
                xform.step(observer, v)
              } catch (e) {
                observer.onError(e)
              }
            }, observer.onError.bind(observer), function () {
              xform.result(observer)
            })
          }, source)
        };
        var AnonymousObservable = Rx.AnonymousObservable = function (__super__) {
          inherits(AnonymousObservable, __super__);
          function fixSubscriber(subscriber) {
            if (subscriber && typeof subscriber.dispose === "function") {
              return subscriber
            }
            return typeof subscriber === "function" ? disposableCreate(subscriber) : disposableEmpty
          }

          function AnonymousObservable(subscribe, parent) {
            this.source = parent;
            if (!(this instanceof AnonymousObservable)) {
              return new AnonymousObservable(subscribe)
            }
            function s(observer) {
              var setDisposable = function () {
                try {
                  autoDetachObserver.setDisposable(fixSubscriber(subscribe(autoDetachObserver)))
                } catch (e) {
                  if (!autoDetachObserver.fail(e)) {
                    throw e
                  }
                }
              };
              var autoDetachObserver = new AutoDetachObserver(observer);
              if (currentThreadScheduler.scheduleRequired()) {
                currentThreadScheduler.schedule(setDisposable)
              } else {
                setDisposable()
              }
              return autoDetachObserver
            }

            __super__.call(this, s)
          }

          return AnonymousObservable
        }(Observable);
        var AutoDetachObserver = function (__super__) {
          inherits(AutoDetachObserver, __super__);
          function AutoDetachObserver(observer) {
            __super__.call(this);
            this.observer = observer;
            this.m = new SingleAssignmentDisposable
          }

          var AutoDetachObserverPrototype = AutoDetachObserver.prototype;
          AutoDetachObserverPrototype.next = function (value) {
            var noError = false;
            try {
              this.observer.onNext(value);
              noError = true
            } catch (e) {
              throw e
            } finally {
              !noError && this.dispose()
            }
          };
          AutoDetachObserverPrototype.error = function (err) {
            try {
              this.observer.onError(err)
            } catch (e) {
              throw e
            } finally {
              this.dispose()
            }
          };
          AutoDetachObserverPrototype.completed = function () {
            try {
              this.observer.onCompleted()
            } catch (e) {
              throw e
            } finally {
              this.dispose()
            }
          };
          AutoDetachObserverPrototype.setDisposable = function (value) {
            this.m.setDisposable(value)
          };
          AutoDetachObserverPrototype.getDisposable = function () {
            return this.m.getDisposable()
          };
          AutoDetachObserverPrototype.dispose = function () {
            __super__.prototype.dispose.call(this);
            this.m.dispose()
          };
          return AutoDetachObserver
        }(AbstractObserver);
        var InnerSubscription = function (subject, observer) {
          this.subject = subject;
          this.observer = observer
        };
        InnerSubscription.prototype.dispose = function () {
          if (!this.subject.isDisposed && this.observer !== null) {
            var idx = this.subject.observers.indexOf(this.observer);
            this.subject.observers.splice(idx, 1);
            this.observer = null
          }
        };
        var Subject = Rx.Subject = function (__super__) {
          function subscribe(observer) {
            checkDisposed.call(this);
            if (!this.isStopped) {
              this.observers.push(observer);
              return new InnerSubscription(this, observer)
            }
            if (this.hasError) {
              observer.onError(this.error);
              return disposableEmpty
            }
            observer.onCompleted();
            return disposableEmpty
          }

          inherits(Subject, __super__);
          function Subject() {
            __super__.call(this, subscribe);
            this.isDisposed = false, this.isStopped = false, this.observers = [];
            this.hasError = false
          }

          addProperties(Subject.prototype, Observer.prototype, {
            hasObservers: function () {
              return this.observers.length > 0
            }, onCompleted: function () {
              checkDisposed.call(this);
              if (!this.isStopped) {
                var os = this.observers.slice(0);
                this.isStopped = true;
                for (var i = 0, len = os.length; i < len; i++) {
                  os[i].onCompleted()
                }
                this.observers.length = 0
              }
            }, onError: function (error) {
              checkDisposed.call(this);
              if (!this.isStopped) {
                var os = this.observers.slice(0);
                this.isStopped = true;
                this.error = error;
                this.hasError = true;
                for (var i = 0, len = os.length; i < len; i++) {
                  os[i].onError(error)
                }
                this.observers.length = 0
              }
            }, onNext: function (value) {
              checkDisposed.call(this);
              if (!this.isStopped) {
                var os = this.observers.slice(0);
                for (var i = 0, len = os.length; i < len; i++) {
                  os[i].onNext(value)
                }
              }
            }, dispose: function () {
              this.isDisposed = true;
              this.observers = null
            }
          });
          Subject.create = function (observer, observable) {
            return new AnonymousSubject(observer, observable)
          };
          return Subject
        }(Observable);
        var AsyncSubject = Rx.AsyncSubject = function (__super__) {
          function subscribe(observer) {
            checkDisposed.call(this);
            if (!this.isStopped) {
              this.observers.push(observer);
              return new InnerSubscription(this, observer)
            }
            if (this.hasError) {
              observer.onError(this.error)
            } else if (this.hasValue) {
              observer.onNext(this.value);
              observer.onCompleted()
            } else {
              observer.onCompleted()
            }
            return disposableEmpty
          }

          inherits(AsyncSubject, __super__);
          function AsyncSubject() {
            __super__.call(this, subscribe);
            this.isDisposed = false;
            this.isStopped = false;
            this.hasValue = false;
            this.observers = [];
            this.hasError = false
          }

          addProperties(AsyncSubject.prototype, Observer, {
            hasObservers: function () {
              checkDisposed.call(this);
              return this.observers.length > 0
            }, onCompleted: function () {
              var i, len;
              checkDisposed.call(this);
              if (!this.isStopped) {
                this.isStopped = true;
                var os = this.observers.slice(0), len = os.length;
                if (this.hasValue) {
                  for (i = 0; i < len; i++) {
                    var o = os[i];
                    o.onNext(this.value);
                    o.onCompleted()
                  }
                } else {
                  for (i = 0; i < len; i++) {
                    os[i].onCompleted()
                  }
                }
                this.observers.length = 0
              }
            }, onError: function (error) {
              checkDisposed.call(this);
              if (!this.isStopped) {
                var os = this.observers.slice(0);
                this.isStopped = true;
                this.hasError = true;
                this.error = error;
                for (var i = 0, len = os.length; i < len; i++) {
                  os[i].onError(error)
                }
                this.observers.length = 0
              }
            }, onNext: function (value) {
              checkDisposed.call(this);
              if (this.isStopped) {
                return
              }
              this.value = value;
              this.hasValue = true
            }, dispose: function () {
              this.isDisposed = true;
              this.observers = null;
              this.exception = null;
              this.value = null
            }
          });
          return AsyncSubject
        }(Observable);
        var AnonymousSubject = Rx.AnonymousSubject = function (__super__) {
          inherits(AnonymousSubject, __super__);
          function subscribe(observer) {
            this.observable.subscribe(observer)
          }

          function AnonymousSubject(observer, observable) {
            this.observer = observer;
            this.observable = observable;
            __super__.call(this, subscribe)
          }

          addProperties(AnonymousSubject.prototype, Observer.prototype, {
            onCompleted: function () {
              this.observer.onCompleted()
            }, onError: function (error) {
              this.observer.onError(error)
            }, onNext: function (value) {
              this.observer.onNext(value)
            }
          });
          return AnonymousSubject
        }(Observable);
        if (typeof define == "function" && typeof define.amd == "object" && define.amd) {
          root.Rx = Rx;
          define(function () {
            return Rx
          })
        } else if (freeExports && freeModule) {
          if (moduleExports) {
            (freeModule.exports = Rx).Rx = Rx
          } else {
            freeExports.Rx = Rx
          }
        } else {
          root.Rx = Rx
        }
        var rEndingLine = captureLine()
      }).call(this)
    }).call(this, require("_process"), typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
  }, {_process: 4}],
  7: [function (require, module, exports) {
    (function (global) {
      (function (factory) {
        var objectTypes = {
          "boolean": false,
          "function": true,
          object: true,
          number: false,
          string: false,
          undefined: false
        };
        var root = objectTypes[typeof window] && window || this, freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports, freeModule = objectTypes[typeof module] && module && !module.nodeType && module, moduleExports = freeModule && freeModule.exports === freeExports && freeExports, freeGlobal = objectTypes[typeof global] && global;
        if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal)) {
          root = freeGlobal
        }
        if (typeof define === "function" && define.amd) {
          define(["rx"], function (Rx, exports) {
            return factory(root, exports, Rx)
          })
        } else if (typeof module === "object" && module && module.exports === freeExports) {
          module.exports = factory(root, module.exports, require("./rx"))
        } else {
          root.Rx = factory(root, {}, root.Rx)
        }
      }).call(this, function (root, exp, Rx, undefined) {
        var Observable = Rx.Observable, observableProto = Observable.prototype, AnonymousObservable = Rx.AnonymousObservable, observableNever = Observable.never, isEqual = Rx.internals.isEqual, defaultSubComparer = Rx.helpers.defaultSubComparer;
        observableProto.jortSort = function () {
          return this.jortSortUntil(observableNever())
        };
        observableProto.jortSortUntil = function (other) {
          var source = this;
          return new AnonymousObservable(function (observer) {
            var arr = [];
            return source.takeUntil(other).subscribe(arr.push.bind(arr), observer.onError.bind(observer), function () {
              var sorted = arr.slice(0).sort(defaultSubComparer);
              observer.onNext(isEqual(arr, sorted));
              observer.onCompleted()
            })
          }, source)
        };
        return Rx
      })
    }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
  }, {"./rx": 6}],
  8: [function (require, module, exports) {
    (function (global) {
      (function (factory) {
        var objectTypes = {
          "boolean": false,
          "function": true,
          object: true,
          number: false,
          string: false,
          undefined: false
        };
        var root = objectTypes[typeof window] && window || this, freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports, freeModule = objectTypes[typeof module] && module && !module.nodeType && module, moduleExports = freeModule && freeModule.exports === freeExports && freeExports, freeGlobal = objectTypes[typeof global] && global;
        if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal)) {
          root = freeGlobal
        }
        if (typeof define === "function" && define.amd) {
          define(["rx.virtualtime", "exports"], function (Rx, exports) {
            root.Rx = factory(root, exports, Rx);
            return root.Rx
          })
        } else if (typeof module === "object" && module && module.exports === freeExports) {
          module.exports = factory(root, module.exports, require("./rx.all"))
        } else {
          root.Rx = factory(root, {}, root.Rx)
        }
      }).call(this, function (root, exp, Rx, undefined) {
        var Observer = Rx.Observer, Observable = Rx.Observable, Notification = Rx.Notification, VirtualTimeScheduler = Rx.VirtualTimeScheduler, Disposable = Rx.Disposable, disposableEmpty = Disposable.empty, disposableCreate = Disposable.create, CompositeDisposable = Rx.CompositeDisposable, SingleAssignmentDisposable = Rx.SingleAssignmentDisposable, slice = Array.prototype.slice, inherits = Rx.internals.inherits, defaultComparer = Rx.internals.isEqual;

        function argsOrArray(args, idx) {
          return args.length === 1 && Array.isArray(args[idx]) ? args[idx] : slice.call(args)
        }

        function OnNextPredicate(predicate) {
          this.predicate = predicate
        }

        OnNextPredicate.prototype.equals = function (other) {
          if (other === this) {
            return true
          }
          if (other == null) {
            return false
          }
          if (other.kind !== "N") {
            return false
          }
          return this.predicate(other.value)
        };
        function OnErrorPredicate(predicate) {
          this.predicate = predicate
        }

        OnErrorPredicate.prototype.equals = function (other) {
          if (other === this) {
            return true
          }
          if (other == null) {
            return false
          }
          if (other.kind !== "E") {
            return false
          }
          return this.predicate(other.exception)
        };
        var ReactiveTest = Rx.ReactiveTest = {
          created: 100,
          subscribed: 200,
          disposed: 1e3,
          onNext: function (ticks, value) {
            return typeof value === "function" ? new Recorded(ticks, new OnNextPredicate(value)) : new Recorded(ticks, Notification.createOnNext(value))
          },
          onError: function (ticks, error) {
            return typeof error === "function" ? new Recorded(ticks, new OnErrorPredicate(error)) : new Recorded(ticks, Notification.createOnError(error))
          },
          onCompleted: function (ticks) {
            return new Recorded(ticks, Notification.createOnCompleted())
          },
          subscribe: function (start, end) {
            return new Subscription(start, end)
          }
        };
        var Recorded = Rx.Recorded = function (time, value, comparer) {
          this.time = time;
          this.value = value;
          this.comparer = comparer || defaultComparer
        };
        Recorded.prototype.equals = function (other) {
          return this.time === other.time && this.comparer(this.value, other.value)
        };
        Recorded.prototype.toString = function () {
          return this.value.toString() + "@" + this.time
        };
        var Subscription = Rx.Subscription = function (start, end) {
          this.subscribe = start;
          this.unsubscribe = end || Number.MAX_VALUE
        };
        Subscription.prototype.equals = function (other) {
          return this.subscribe === other.subscribe && this.unsubscribe === other.unsubscribe
        };
        Subscription.prototype.toString = function () {
          return "(" + this.subscribe + ", " + (this.unsubscribe === Number.MAX_VALUE ? "Infinite" : this.unsubscribe) + ")"
        };
        var MockDisposable = Rx.MockDisposable = function (scheduler) {
          this.scheduler = scheduler;
          this.disposes = [];
          this.disposes.push(this.scheduler.clock)
        };
        MockDisposable.prototype.dispose = function () {
          this.disposes.push(this.scheduler.clock)
        };
        var MockObserver = function (__super__) {
          inherits(MockObserver, __super__);
          function MockObserver(scheduler) {
            __super__.call(this);
            this.scheduler = scheduler;
            this.messages = []
          }

          var MockObserverPrototype = MockObserver.prototype;
          MockObserverPrototype.onNext = function (value) {
            this.messages.push(new Recorded(this.scheduler.clock, Notification.createOnNext(value)))
          };
          MockObserverPrototype.onError = function (exception) {
            this.messages.push(new Recorded(this.scheduler.clock, Notification.createOnError(exception)))
          };
          MockObserverPrototype.onCompleted = function () {
            this.messages.push(new Recorded(this.scheduler.clock, Notification.createOnCompleted()))
          };
          return MockObserver
        }(Observer);

        function MockPromise(scheduler, messages) {
          var self = this;
          this.scheduler = scheduler;
          this.messages = messages;
          this.subscriptions = [];
          this.observers = [];
          for (var i = 0, len = this.messages.length; i < len; i++) {
            var message = this.messages[i], notification = message.value;
            (function (innerNotification) {
              scheduler.scheduleAbsoluteWithState(null, message.time, function () {
                var obs = self.observers.slice(0);
                for (var j = 0, jLen = obs.length; j < jLen; j++) {
                  innerNotification.accept(obs[j])
                }
                return disposableEmpty
              })
            })(notification)
          }
        }

        MockPromise.prototype.then = function (onResolved, onRejected) {
          var self = this;
          this.subscriptions.push(new Subscription(this.scheduler.clock));
          var index = this.subscriptions.length - 1;
          var newPromise;
          var observer = Rx.Observer.create(function (x) {
            var retValue = onResolved(x);
            if (retValue && typeof retValue.then === "function") {
              newPromise = retValue
            } else {
              var ticks = self.scheduler.clock;
              newPromise = new MockPromise(self.scheduler, [Rx.ReactiveTest.onNext(ticks, undefined), Rx.ReactiveTest.onCompleted(ticks)])
            }
            var idx = self.observers.indexOf(observer);
            self.observers.splice(idx, 1);
            self.subscriptions[index] = new Subscription(self.subscriptions[index].subscribe, self.scheduler.clock)
          }, function (err) {
            onRejected(err);
            var idx = self.observers.indexOf(observer);
            self.observers.splice(idx, 1);
            self.subscriptions[index] = new Subscription(self.subscriptions[index].subscribe, self.scheduler.clock)
          });
          this.observers.push(observer);
          return newPromise || new MockPromise(this.scheduler, this.messages)
        };
        var HotObservable = function (__super__) {
          function subscribe(observer) {
            var observable = this;
            this.observers.push(observer);
            this.subscriptions.push(new Subscription(this.scheduler.clock));
            var index = this.subscriptions.length - 1;
            return disposableCreate(function () {
              var idx = observable.observers.indexOf(observer);
              observable.observers.splice(idx, 1);
              observable.subscriptions[index] = new Subscription(observable.subscriptions[index].subscribe, observable.scheduler.clock)
            })
          }

          inherits(HotObservable, __super__);
          function HotObservable(scheduler, messages) {
            __super__.call(this, subscribe);
            var message, notification, observable = this;
            this.scheduler = scheduler;
            this.messages = messages;
            this.subscriptions = [];
            this.observers = [];
            for (var i = 0, len = this.messages.length; i < len; i++) {
              message = this.messages[i];
              notification = message.value;
              (function (innerNotification) {
                scheduler.scheduleAbsoluteWithState(null, message.time, function () {
                  var obs = observable.observers.slice(0);
                  for (var j = 0, jLen = obs.length; j < jLen; j++) {
                    innerNotification.accept(obs[j])
                  }
                  return disposableEmpty
                })
              })(notification)
            }
          }

          return HotObservable
        }(Observable);
        var ColdObservable = function (__super__) {
          function subscribe(observer) {
            var message, notification, observable = this;
            this.subscriptions.push(new Subscription(this.scheduler.clock));
            var index = this.subscriptions.length - 1;
            var d = new CompositeDisposable;
            for (var i = 0, len = this.messages.length; i < len; i++) {
              message = this.messages[i];
              notification = message.value;
              (function (innerNotification) {
                d.add(observable.scheduler.scheduleRelativeWithState(null, message.time, function () {
                  innerNotification.accept(observer);
                  return disposableEmpty
                }))
              })(notification)
            }
            return disposableCreate(function () {
              observable.subscriptions[index] = new Subscription(observable.subscriptions[index].subscribe, observable.scheduler.clock);
              d.dispose()
            })
          }

          inherits(ColdObservable, __super__);
          function ColdObservable(scheduler, messages) {
            __super__.call(this, subscribe);
            this.scheduler = scheduler;
            this.messages = messages;
            this.subscriptions = []
          }

          return ColdObservable
        }(Observable);
        Rx.TestScheduler = function (__super__) {
          inherits(TestScheduler, __super__);
          function baseComparer(x, y) {
            return x > y ? 1 : x < y ? -1 : 0
          }

          function TestScheduler() {
            __super__.call(this, 0, baseComparer)
          }

          TestScheduler.prototype.scheduleAbsoluteWithState = function (state, dueTime, action) {
            dueTime <= this.clock && (dueTime = this.clock + 1);
            return __super__.prototype.scheduleAbsoluteWithState.call(this, state, dueTime, action)
          };
          TestScheduler.prototype.add = function (absolute, relative) {
            return absolute + relative
          };
          TestScheduler.prototype.toDateTimeOffset = function (absolute) {
            return new Date(absolute).getTime()
          };
          TestScheduler.prototype.toRelative = function (timeSpan) {
            return timeSpan
          };
          TestScheduler.prototype.startWithTiming = function (create, created, subscribed, disposed) {
            var observer = this.createObserver(), source, subscription;
            this.scheduleAbsoluteWithState(null, created, function () {
              source = create();
              return disposableEmpty
            });
            this.scheduleAbsoluteWithState(null, subscribed, function () {
              subscription = source.subscribe(observer);
              return disposableEmpty
            });
            this.scheduleAbsoluteWithState(null, disposed, function () {
              subscription.dispose();
              return disposableEmpty
            });
            this.start();
            return observer
          };
          TestScheduler.prototype.startWithDispose = function (create, disposed) {
            return this.startWithTiming(create, ReactiveTest.created, ReactiveTest.subscribed, disposed)
          };
          TestScheduler.prototype.startWithCreate = function (create) {
            return this.startWithTiming(create, ReactiveTest.created, ReactiveTest.subscribed, ReactiveTest.disposed)
          };
          TestScheduler.prototype.createHotObservable = function () {
            var messages = argsOrArray(arguments, 0);
            return new HotObservable(this, messages)
          };
          TestScheduler.prototype.createColdObservable = function () {
            var messages = argsOrArray(arguments, 0);
            return new ColdObservable(this, messages)
          };
          TestScheduler.prototype.createResolvedPromise = function (ticks, value) {
            return new MockPromise(this, [Rx.ReactiveTest.onNext(ticks, value), Rx.ReactiveTest.onCompleted(ticks)])
          };
          TestScheduler.prototype.createRejectedPromise = function (ticks, reason) {
            return new MockPromise(this, [Rx.ReactiveTest.onError(ticks, reason)])
          };
          TestScheduler.prototype.createObserver = function () {
            return new MockObserver(this)
          };
          return TestScheduler
        }(VirtualTimeScheduler);
        return Rx
      })
    }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
  }, {"./rx.all": 5}],
  9: [function (require, module, exports) {
    var Rx = require("./dist/rx.all");
    require("./dist/rx.sorting");
    require("./dist/rx.testing");
    var EventEmitter = require("events").EventEmitter, Observable = Rx.Observable;
    Rx.Node = {
      fromCallback: function (func, context, selector) {
        return Observable.fromCallback(func, context, selector)
      }, fromNodeCallback: function (func, context, selector) {
        return Observable.fromNodeCallback(func, context, selector)
      }, fromEvent: function (eventEmitter, eventName, selector) {
        return Observable.fromEvent(eventEmitter, eventName, selector)
      }, toEventEmitter: function (observable, eventName, selector) {
        var e = new EventEmitter;
        e.publish = function () {
          e.subscription = observable.subscribe(function (x) {
            var result = x;
            if (selector) {
              try {
                result = selector(x)
              } catch (e) {
                e.emit("error", e);
                return
              }
            }
            e.emit(eventName, result)
          }, function (err) {
            e.emit("error", err)
          }, function () {
            e.emit("end")
          })
        };
        return e
      }, fromStream: function (stream, finishEventName) {
        stream.pause();
        finishEventName || (finishEventName = "end");
        return Observable.create(function (observer) {
          function dataHandler(data) {
            observer.onNext(data)
          }

          function errorHandler(err) {
            observer.onError(err)
          }

          function endHandler() {
            observer.onCompleted()
          }

          stream.addListener("data", dataHandler);
          stream.addListener("error", errorHandler);
          stream.addListener(finishEventName, endHandler);
          stream.resume();
          return function () {
            stream.removeListener("data", dataHandler);
            stream.removeListener("error", errorHandler);
            stream.removeListener(finishEventName, endHandler)
          }
        }).publish().refCount()
      }, fromReadableStream: function (stream) {
        return this.fromStream(stream, "end")
      }, fromWritableStream: function (stream) {
        return this.fromStream(stream, "finish")
      }, fromTransformStream: function (stream) {
        return this.fromStream(stream, "finish")
      }, writeToStream: function (observable, stream, encoding) {
        var source = observable.pausableBuffered();

        function onDrain() {
          source.resume()
        }

        stream.addListener("drain", onDrain);
        return source.subscribe(function (x) {
          !stream.write(String(x), encoding) && source.pause()
        }, function (err) {
          stream.emit("error", err)
        }, function () {
          !stream._isStdio && stream.end();
          stream.removeListener("drain", onDrain)
        });
        source.resume()
      }
    };
    Rx.Observable.prototype.pipe = function (dest) {
      var source = this.pausableBuffered();

      function onDrain() {
        source.resume()
      }

      dest.addListener("drain", onDrain);
      source.subscribe(function (x) {
        !dest.write(String(x)) && source.pause()
      }, function (err) {
        dest.emit("error", err)
      }, function () {
        !dest._isStdio && dest.end();
        dest.removeListener("drain", onDrain)
      });
      source.resume();
      return dest
    };
    module.exports = Rx
  }, {"./dist/rx.all": 5, "./dist/rx.sorting": 7, "./dist/rx.testing": 8, events: 3}],
  10: [function (require, module, exports) {
    var createElement = require("./vdom/create-element.js");
    module.exports = createElement
  }, {"./vdom/create-element.js": 23}],
  11: [function (require, module, exports) {
    var diff = require("./vtree/diff.js");
    module.exports = diff
  }, {"./vtree/diff.js": 46}],
  12: [function (require, module, exports) {
    var h = require("./virtual-hyperscript/index.js");
    module.exports = h
  }, {"./virtual-hyperscript/index.js": 31}],
  13: [function (require, module, exports) {
    var diff = require("./diff.js");
    var patch = require("./patch.js");
    var h = require("./h.js");
    var create = require("./create-element.js");
    module.exports = {diff: diff, patch: patch, h: h, create: create}
  }, {"./create-element.js": 10, "./diff.js": 11, "./h.js": 12, "./patch.js": 21}],
  14: [function (require, module, exports) {
    module.exports = function split(undef) {
      var nativeSplit = String.prototype.split, compliantExecNpcg = /()??/.exec("")[1] === undef, self;
      self = function (str, separator, limit) {
        if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
          return nativeSplit.call(str, separator, limit)
        }
        var output = [], flags = (separator.ignoreCase ? "i" : "") + (separator.multiline ? "m" : "") + (separator.extended ? "x" : "") + (separator.sticky ? "y" : ""), lastLastIndex = 0, separator = new RegExp(separator.source, flags + "g"), separator2, match, lastIndex, lastLength;
        str += "";
        if (!compliantExecNpcg) {
          separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags)
        }
        limit = limit === undef ? -1 >>> 0 : limit >>> 0;
        while (match = separator.exec(str)) {
          lastIndex = match.index + match[0].length;
          if (lastIndex > lastLastIndex) {
            output.push(str.slice(lastLastIndex, match.index));
            if (!compliantExecNpcg && match.length > 1) {
              match[0].replace(separator2, function () {
                for (var i = 1; i < arguments.length - 2; i++) {
                  if (arguments[i] === undef) {
                    match[i] = undef
                  }
                }
              })
            }
            if (match.length > 1 && match.index < str.length) {
              Array.prototype.push.apply(output, match.slice(1))
            }
            lastLength = match[0].length;
            lastLastIndex = lastIndex;
            if (output.length >= limit) {
              break
            }
          }
          if (separator.lastIndex === match.index) {
            separator.lastIndex++
          }
        }
        if (lastLastIndex === str.length) {
          if (lastLength || !separator.test("")) {
            output.push("")
          }
        } else {
          output.push(str.slice(lastLastIndex))
        }
        return output.length > limit ? output.slice(0, limit) : output
      };
      return self
    }()
  }, {}],
  15: [function (require, module, exports) {
    "use strict";
    var OneVersionConstraint = require("individual/one-version");
    var MY_VERSION = "7";
    OneVersionConstraint("ev-store", MY_VERSION);
    var hashKey = "__EV_STORE_KEY@" + MY_VERSION;
    module.exports = EvStore;
    function EvStore(elem) {
      var hash = elem[hashKey];
      if (!hash) {
        hash = elem[hashKey] = {}
      }
      return hash
    }
  }, {"individual/one-version": 17}],
  16: [function (require, module, exports) {
    (function (global) {
      "use strict";
      var root = typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {};
      module.exports = Individual;
      function Individual(key, value) {
        if (key in root) {
          return root[key]
        }
        root[key] = value;
        return value
      }
    }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
  }, {}],
  17: [function (require, module, exports) {
    "use strict";
    var Individual = require("./index.js");
    module.exports = OneVersion;
    function OneVersion(moduleName, version, defaultValue) {
      var key = "__INDIVIDUAL_ONE_VERSION_" + moduleName;
      var enforceKey = key + "_ENFORCE_SINGLETON";
      var versionValue = Individual(enforceKey, version);
      if (versionValue !== version) {
        throw new Error("Can only have one copy of " + moduleName + ".\n" + "You already have version " + versionValue + " installed.\n" + "This means you cannot install version " + version)
      }
      return Individual(key, defaultValue)
    }
  }, {"./index.js": 16}],
  18: [function (require, module, exports) {
    (function (global) {
      var topLevel = typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : {};
      var minDoc = require("min-document");
      if (typeof document !== "undefined") {
        module.exports = document
      } else {
        var doccy = topLevel["__GLOBAL_DOCUMENT_CACHE@4"];
        if (!doccy) {
          doccy = topLevel["__GLOBAL_DOCUMENT_CACHE@4"] = minDoc
        }
        module.exports = doccy
      }
    }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
  }, {"min-document": 2}],
  19: [function (require, module, exports) {
    "use strict";
    module.exports = function isObject(x) {
      return typeof x === "object" && x !== null
    }
  }, {}],
  20: [function (require, module, exports) {
    var nativeIsArray = Array.isArray;
    var toString = Object.prototype.toString;
    module.exports = nativeIsArray || isArray;
    function isArray(obj) {
      return toString.call(obj) === "[object Array]"
    }
  }, {}],
  21: [function (require, module, exports) {
    var patch = require("./vdom/patch.js");
    module.exports = patch
  }, {"./vdom/patch.js": 26}],
  22: [function (require, module, exports) {
    var isObject = require("is-object");
    var isHook = require("../vnode/is-vhook.js");
    module.exports = applyProperties;
    function applyProperties(node, props, previous) {
      for (var propName in props) {
        var propValue = props[propName];
        if (propValue === undefined) {
          removeProperty(node, propName, propValue, previous)
        } else if (isHook(propValue)) {
          removeProperty(node, propName, propValue, previous);
          if (propValue.hook) {
            propValue.hook(node, propName, previous ? previous[propName] : undefined)
          }
        } else {
          if (isObject(propValue)) {
            patchObject(node, props, previous, propName, propValue)
          } else {
            node[propName] = propValue
          }
        }
      }
    }

    function removeProperty(node, propName, propValue, previous) {
      if (previous) {
        var previousValue = previous[propName];
        if (!isHook(previousValue)) {
          if (propName === "attributes") {
            for (var attrName in previousValue) {
              node.removeAttribute(attrName)
            }
          } else if (propName === "style") {
            for (var i in previousValue) {
              node.style[i] = ""
            }
          } else if (typeof previousValue === "string") {
            node[propName] = ""
          } else {
            node[propName] = null
          }
        } else if (previousValue.unhook) {
          previousValue.unhook(node, propName, propValue)
        }
      }
    }

    function patchObject(node, props, previous, propName, propValue) {
      var previousValue = previous ? previous[propName] : undefined;
      if (propName === "attributes") {
        for (var attrName in propValue) {
          var attrValue = propValue[attrName];
          if (attrValue === undefined) {
            node.removeAttribute(attrName)
          } else {
            node.setAttribute(attrName, attrValue)
          }
        }
        return
      }
      if (previousValue && isObject(previousValue) && getPrototype(previousValue) !== getPrototype(propValue)) {
        node[propName] = propValue;
        return
      }
      if (!isObject(node[propName])) {
        node[propName] = {}
      }
      var replacer = propName === "style" ? "" : undefined;
      for (var k in propValue) {
        var value = propValue[k];
        node[propName][k] = value === undefined ? replacer : value
      }
    }

    function getPrototype(value) {
      if (Object.getPrototypeOf) {
        return Object.getPrototypeOf(value)
      } else if (value.__proto__) {
        return value.__proto__
      } else if (value.constructor) {
        return value.constructor.prototype
      }
    }
  }, {"../vnode/is-vhook.js": 37, "is-object": 19}],
  23: [function (require, module, exports) {
    var document = require("global/document");
    var applyProperties = require("./apply-properties");
    var isVNode = require("../vnode/is-vnode.js");
    var isVText = require("../vnode/is-vtext.js");
    var isWidget = require("../vnode/is-widget.js");
    var handleThunk = require("../vnode/handle-thunk.js");
    module.exports = createElement;
    function createElement(vnode, opts) {
      var doc = opts ? opts.document || document : document;
      var warn = opts ? opts.warn : null;
      vnode = handleThunk(vnode).a;
      if (isWidget(vnode)) {
        return vnode.init()
      } else if (isVText(vnode)) {
        return doc.createTextNode(vnode.text)
      } else if (!isVNode(vnode)) {
        if (warn) {
          warn("Item is not a valid virtual dom node", vnode)
        }
        return null
      }
      var node = vnode.namespace === null ? doc.createElement(vnode.tagName) : doc.createElementNS(vnode.namespace, vnode.tagName);
      var props = vnode.properties;
      applyProperties(node, props);
      var children = vnode.children;
      for (var i = 0; i < children.length; i++) {
        var childNode = createElement(children[i], opts);
        if (childNode) {
          node.appendChild(childNode)
        }
      }
      return node
    }
  }, {
    "../vnode/handle-thunk.js": 35,
    "../vnode/is-vnode.js": 38,
    "../vnode/is-vtext.js": 39,
    "../vnode/is-widget.js": 40,
    "./apply-properties": 22,
    "global/document": 18
  }],
  24: [function (require, module, exports) {
    var noChild = {};
    module.exports = domIndex;
    function domIndex(rootNode, tree, indices, nodes) {
      if (!indices || indices.length === 0) {
        return {}
      } else {
        indices.sort(ascending);
        return recurse(rootNode, tree, indices, nodes, 0)
      }
    }

    function recurse(rootNode, tree, indices, nodes, rootIndex) {
      nodes = nodes || {};
      if (rootNode) {
        if (indexInRange(indices, rootIndex, rootIndex)) {
          nodes[rootIndex] = rootNode
        }
        var vChildren = tree.children;
        if (vChildren) {
          var childNodes = rootNode.childNodes;
          for (var i = 0; i < tree.children.length; i++) {
            rootIndex += 1;
            var vChild = vChildren[i] || noChild;
            var nextIndex = rootIndex + (vChild.count || 0);
            if (indexInRange(indices, rootIndex, nextIndex)) {
              recurse(childNodes[i], vChild, indices, nodes, rootIndex)
            }
            rootIndex = nextIndex
          }
        }
      }
      return nodes
    }

    function indexInRange(indices, left, right) {
      if (indices.length === 0) {
        return false
      }
      var minIndex = 0;
      var maxIndex = indices.length - 1;
      var currentIndex;
      var currentItem;
      while (minIndex <= maxIndex) {
        currentIndex = (maxIndex + minIndex) / 2 >> 0;
        currentItem = indices[currentIndex];
        if (minIndex === maxIndex) {
          return currentItem >= left && currentItem <= right
        } else if (currentItem < left) {
          minIndex = currentIndex + 1
        } else if (currentItem > right) {
          maxIndex = currentIndex - 1
        } else {
          return true
        }
      }
      return false
    }

    function ascending(a, b) {
      return a > b ? 1 : -1
    }
  }, {}],
  25: [function (require, module, exports) {
    var applyProperties = require("./apply-properties");
    var isWidget = require("../vnode/is-widget.js");
    var VPatch = require("../vnode/vpatch.js");
    var render = require("./create-element");
    var updateWidget = require("./update-widget");
    module.exports = applyPatch;
    function applyPatch(vpatch, domNode, renderOptions) {
      var type = vpatch.type;
      var vNode = vpatch.vNode;
      var patch = vpatch.patch;
      switch (type) {
        case VPatch.REMOVE:
          return removeNode(domNode, vNode);
        case VPatch.INSERT:
          return insertNode(domNode, patch, renderOptions);
        case VPatch.VTEXT:
          return stringPatch(domNode, vNode, patch, renderOptions);
        case VPatch.WIDGET:
          return widgetPatch(domNode, vNode, patch, renderOptions);
        case VPatch.VNODE:
          return vNodePatch(domNode, vNode, patch, renderOptions);
        case VPatch.ORDER:
          reorderChildren(domNode, patch);
          return domNode;
        case VPatch.PROPS:
          applyProperties(domNode, patch, vNode.properties);
          return domNode;
        case VPatch.THUNK:
          return replaceRoot(domNode, renderOptions.patch(domNode, patch, renderOptions));
        default:
          return domNode
      }
    }

    function removeNode(domNode, vNode) {
      var parentNode = domNode.parentNode;
      if (parentNode) {
        parentNode.removeChild(domNode)
      }
      destroyWidget(domNode, vNode);
      return null
    }

    function insertNode(parentNode, vNode, renderOptions) {
      var newNode = render(vNode, renderOptions);
      if (parentNode) {
        parentNode.appendChild(newNode)
      }
      return parentNode
    }

    function stringPatch(domNode, leftVNode, vText, renderOptions) {
      var newNode;
      if (domNode.nodeType === 3) {
        domNode.replaceData(0, domNode.length, vText.text);
        newNode = domNode
      } else {
        var parentNode = domNode.parentNode;
        newNode = render(vText, renderOptions);
        if (parentNode) {
          parentNode.replaceChild(newNode, domNode)
        }
      }
      return newNode
    }

    function widgetPatch(domNode, leftVNode, widget, renderOptions) {
      var updating = updateWidget(leftVNode, widget);
      var newNode;
      if (updating) {
        newNode = widget.update(leftVNode, domNode) || domNode
      } else {
        newNode = render(widget, renderOptions)
      }
      var parentNode = domNode.parentNode;
      if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode)
      }
      if (!updating) {
        destroyWidget(domNode, leftVNode)
      }
      return newNode
    }

    function vNodePatch(domNode, leftVNode, vNode, renderOptions) {
      var parentNode = domNode.parentNode;
      var newNode = render(vNode, renderOptions);
      if (parentNode) {
        parentNode.replaceChild(newNode, domNode)
      }
      return newNode
    }

    function destroyWidget(domNode, w) {
      if (typeof w.destroy === "function" && isWidget(w)) {
        w.destroy(domNode)
      }
    }

    function reorderChildren(domNode, bIndex) {
      var children = [];
      var childNodes = domNode.childNodes;
      var len = childNodes.length;
      var i;
      var reverseIndex = bIndex.reverse;
      for (i = 0; i < len; i++) {
        children.push(domNode.childNodes[i])
      }
      var insertOffset = 0;
      var move;
      var node;
      var insertNode;
      var chainLength;
      var insertedLength;
      var nextSibling;
      for (i = 0; i < len;) {
        move = bIndex[i];
        chainLength = 1;
        if (move !== undefined && move !== i) {
          while (bIndex[i + chainLength] === move + chainLength) {
            chainLength++
          }
          if (reverseIndex[i] > i + chainLength) {
            insertOffset++
          }
          node = children[move];
          insertNode = childNodes[i + insertOffset] || null;
          insertedLength = 0;
          while (node !== insertNode && insertedLength++ < chainLength) {
            domNode.insertBefore(node, insertNode);
            node = children[move + insertedLength]
          }
          if (move + chainLength < i) {
            insertOffset--
          }
        }
        if (i in bIndex.removes) {
          insertOffset++
        }
        i += chainLength
      }
    }

    function replaceRoot(oldRoot, newRoot) {
      if (oldRoot && newRoot && oldRoot !== newRoot && oldRoot.parentNode) {
        console.log(oldRoot);
        oldRoot.parentNode.replaceChild(newRoot, oldRoot)
      }
      return newRoot
    }
  }, {
    "../vnode/is-widget.js": 40,
    "../vnode/vpatch.js": 43,
    "./apply-properties": 22,
    "./create-element": 23,
    "./update-widget": 27
  }],
  26: [function (require, module, exports) {
    var document = require("global/document");
    var isArray = require("x-is-array");
    var domIndex = require("./dom-index");
    var patchOp = require("./patch-op");
    module.exports = patch;
    function patch(rootNode, patches) {
      return patchRecursive(rootNode, patches)
    }

    function patchRecursive(rootNode, patches, renderOptions) {
      var indices = patchIndices(patches);
      if (indices.length === 0) {
        return rootNode
      }
      var index = domIndex(rootNode, patches.a, indices);
      var ownerDocument = rootNode.ownerDocument;
      if (!renderOptions) {
        renderOptions = {patch: patchRecursive};
        if (ownerDocument !== document) {
          renderOptions.document = ownerDocument
        }
      }
      for (var i = 0; i < indices.length; i++) {
        var nodeIndex = indices[i];
        rootNode = applyPatch(rootNode, index[nodeIndex], patches[nodeIndex], renderOptions)
      }
      return rootNode
    }

    function applyPatch(rootNode, domNode, patchList, renderOptions) {
      if (!domNode) {
        return rootNode
      }
      var newNode;
      if (isArray(patchList)) {
        for (var i = 0; i < patchList.length; i++) {
          newNode = patchOp(patchList[i], domNode, renderOptions);
          if (domNode === rootNode) {
            rootNode = newNode
          }
        }
      } else {
        newNode = patchOp(patchList, domNode, renderOptions);
        if (domNode === rootNode) {
          rootNode = newNode
        }
      }
      return rootNode
    }

    function patchIndices(patches) {
      var indices = [];
      for (var key in patches) {
        if (key !== "a") {
          indices.push(Number(key))
        }
      }
      return indices
    }
  }, {"./dom-index": 24, "./patch-op": 25, "global/document": 18, "x-is-array": 20}],
  27: [function (require, module, exports) {
    var isWidget = require("../vnode/is-widget.js");
    module.exports = updateWidget;
    function updateWidget(a, b) {
      if (isWidget(a) && isWidget(b)) {
        if ("name"in a && "name"in b) {
          return a.id === b.id
        } else {
          return a.init === b.init
        }
      }
      return false
    }
  }, {"../vnode/is-widget.js": 40}],
  28: [function (require, module, exports) {
    "use strict";
    module.exports = AttributeHook;
    function AttributeHook(namespace, value) {
      if (!(this instanceof AttributeHook)) {
        return new AttributeHook(namespace, value)
      }
      this.namespace = namespace;
      this.value = value
    }

    AttributeHook.prototype.hook = function (node, prop, prev) {
      if (prev && prev.type === "AttributeHook" && prev.value === this.value && prev.namespace === this.namespace) {
        return
      }
      node.setAttributeNS(this.namespace, prop, this.value)
    };
    AttributeHook.prototype.unhook = function (node, prop, next) {
      if (next && next.type === "AttributeHook" && next.namespace === this.namespace) {
        return
      }
      var colonPosition = prop.indexOf(":");
      var localName = colonPosition > -1 ? prop.substr(colonPosition + 1) : prop;
      node.removeAttributeNS(this.namespace, localName)
    };
    AttributeHook.prototype.type = "AttributeHook"
  }, {}],
  29: [function (require, module, exports) {
    "use strict";
    var EvStore = require("ev-store");
    module.exports = EvHook;
    function EvHook(value) {
      if (!(this instanceof EvHook)) {
        return new EvHook(value)
      }
      this.value = value
    }

    EvHook.prototype.hook = function (node, propertyName) {
      var es = EvStore(node);
      var propName = propertyName.substr(3);
      es[propName] = this.value
    };
    EvHook.prototype.unhook = function (node, propertyName) {
      var es = EvStore(node);
      var propName = propertyName.substr(3);
      es[propName] = undefined
    }
  }, {"ev-store": 15}],
  30: [function (require, module, exports) {
    "use strict";
    module.exports = SoftSetHook;
    function SoftSetHook(value) {
      if (!(this instanceof SoftSetHook)) {
        return new SoftSetHook(value)
      }
      this.value = value
    }

    SoftSetHook.prototype.hook = function (node, propertyName) {
      if (node[propertyName] !== this.value) {
        node[propertyName] = this.value
      }
    }
  }, {}],
  31: [function (require, module, exports) {
    "use strict";
    var isArray = require("x-is-array");
    var VNode = require("../vnode/vnode.js");
    var VText = require("../vnode/vtext.js");
    var isVNode = require("../vnode/is-vnode");
    var isVText = require("../vnode/is-vtext");
    var isWidget = require("../vnode/is-widget");
    var isHook = require("../vnode/is-vhook");
    var isVThunk = require("../vnode/is-thunk");
    var parseTag = require("./parse-tag.js");
    var softSetHook = require("./hooks/soft-set-hook.js");
    var evHook = require("./hooks/ev-hook.js");
    module.exports = h;
    function h(tagName, properties, children) {
      var childNodes = [];
      var tag, props, key, namespace;
      if (!children && isChildren(properties)) {
        children = properties;
        props = {}
      }
      props = props || properties || {};
      tag = parseTag(tagName, props);
      if (props.hasOwnProperty("key")) {
        key = props.key;
        props.key = undefined
      }
      if (props.hasOwnProperty("namespace")) {
        namespace = props.namespace;
        props.namespace = undefined
      }
      if (tag === "INPUT" && !namespace && props.hasOwnProperty("value") && props.value !== undefined && !isHook(props.value)) {
        props.value = softSetHook(props.value)
      }
      transformProperties(props);
      if (children !== undefined && children !== null) {
        addChild(children, childNodes, tag, props)
      }
      return new VNode(tag, props, childNodes, key, namespace)
    }

    function addChild(c, childNodes, tag, props) {
      if (typeof c === "string") {
        childNodes.push(new VText(c))
      } else if (isChild(c)) {
        childNodes.push(c)
      } else if (isArray(c)) {
        for (var i = 0; i < c.length; i++) {
          addChild(c[i], childNodes, tag, props)
        }
      } else if (c === null || c === undefined) {
        return
      } else {
        throw UnexpectedVirtualElement({foreignObject: c, parentVnode: {tagName: tag, properties: props}})
      }
    }

    function transformProperties(props) {
      for (var propName in props) {
        if (props.hasOwnProperty(propName)) {
          var value = props[propName];
          if (isHook(value)) {
            continue
          }
          if (propName.substr(0, 3) === "ev-") {
            props[propName] = evHook(value)
          }
        }
      }
    }

    function isChild(x) {
      return isVNode(x) || isVText(x) || isWidget(x) || isVThunk(x)
    }

    function isChildren(x) {
      return typeof x === "string" || isArray(x) || isChild(x)
    }

    function UnexpectedVirtualElement(data) {
      var err = new Error;
      err.type = "virtual-hyperscript.unexpected.virtual-element";
      err.message = "Unexpected virtual child passed to h().\n" + "Expected a VNode / Vthunk / VWidget / string but:\n" + "got:\n" + errorString(data.foreignObject) + ".\n" + "The parent vnode is:\n" + errorString(data.parentVnode);
      "\n" + "Suggested fix: change your `h(..., [ ... ])` callsite.";
      err.foreignObject = data.foreignObject;
      err.parentVnode = data.parentVnode;
      return err
    }

    function errorString(obj) {
      try {
        return JSON.stringify(obj, null, "    ")
      } catch (e) {
        return String(obj)
      }
    }
  }, {
    "../vnode/is-thunk": 36,
    "../vnode/is-vhook": 37,
    "../vnode/is-vnode": 38,
    "../vnode/is-vtext": 39,
    "../vnode/is-widget": 40,
    "../vnode/vnode.js": 42,
    "../vnode/vtext.js": 44,
    "./hooks/ev-hook.js": 29,
    "./hooks/soft-set-hook.js": 30,
    "./parse-tag.js": 32,
    "x-is-array": 20
  }],
  32: [function (require, module, exports) {
    "use strict";
    var split = require("browser-split");
    var classIdSplit = /([\.#]?[a-zA-Z0-9_:-]+)/;
    var notClassId = /^\.|#/;
    module.exports = parseTag;
    function parseTag(tag, props) {
      if (!tag) {
        return "DIV"
      }
      var noId = !props.hasOwnProperty("id");
      var tagParts = split(tag, classIdSplit);
      var tagName = null;
      if (notClassId.test(tagParts[1])) {
        tagName = "DIV"
      }
      var classes, part, type, i;
      for (i = 0; i < tagParts.length; i++) {
        part = tagParts[i];
        if (!part) {
          continue
        }
        type = part.charAt(0);
        if (!tagName) {
          tagName = part
        } else if (type === ".") {
          classes = classes || [];
          classes.push(part.substring(1, part.length))
        } else if (type === "#" && noId) {
          props.id = part.substring(1, part.length)
        }
      }
      if (classes) {
        if (props.className) {
          classes.push(props.className)
        }
        props.className = classes.join(" ")
      }
      return props.namespace ? tagName : tagName.toUpperCase()
    }
  }, {"browser-split": 14}],
  33: [function (require, module, exports) {
    "use strict";
    var DEFAULT_NAMESPACE = null;
    var EV_NAMESPACE = "http://www.w3.org/2001/xml-events";
    var XLINK_NAMESPACE = "http://www.w3.org/1999/xlink";
    var XML_NAMESPACE = "http://www.w3.org/XML/1998/namespace";
    var SVG_PROPERTIES = {
      about: DEFAULT_NAMESPACE,
      "accent-height": DEFAULT_NAMESPACE,
      accumulate: DEFAULT_NAMESPACE,
      additive: DEFAULT_NAMESPACE,
      "alignment-baseline": DEFAULT_NAMESPACE,
      alphabetic: DEFAULT_NAMESPACE,
      amplitude: DEFAULT_NAMESPACE,
      "arabic-form": DEFAULT_NAMESPACE,
      ascent: DEFAULT_NAMESPACE,
      attributeName: DEFAULT_NAMESPACE,
      attributeType: DEFAULT_NAMESPACE,
      azimuth: DEFAULT_NAMESPACE,
      bandwidth: DEFAULT_NAMESPACE,
      baseFrequency: DEFAULT_NAMESPACE,
      baseProfile: DEFAULT_NAMESPACE,
      "baseline-shift": DEFAULT_NAMESPACE,
      bbox: DEFAULT_NAMESPACE,
      begin: DEFAULT_NAMESPACE,
      bias: DEFAULT_NAMESPACE,
      by: DEFAULT_NAMESPACE,
      calcMode: DEFAULT_NAMESPACE,
      "cap-height": DEFAULT_NAMESPACE,
      "class": DEFAULT_NAMESPACE,
      clip: DEFAULT_NAMESPACE,
      "clip-path": DEFAULT_NAMESPACE,
      "clip-rule": DEFAULT_NAMESPACE,
      clipPathUnits: DEFAULT_NAMESPACE,
      color: DEFAULT_NAMESPACE,
      "color-interpolation": DEFAULT_NAMESPACE,
      "color-interpolation-filters": DEFAULT_NAMESPACE,
      "color-profile": DEFAULT_NAMESPACE,
      "color-rendering": DEFAULT_NAMESPACE,
      content: DEFAULT_NAMESPACE,
      contentScriptType: DEFAULT_NAMESPACE,
      contentStyleType: DEFAULT_NAMESPACE,
      cursor: DEFAULT_NAMESPACE,
      cx: DEFAULT_NAMESPACE,
      cy: DEFAULT_NAMESPACE,
      d: DEFAULT_NAMESPACE,
      datatype: DEFAULT_NAMESPACE,
      defaultAction: DEFAULT_NAMESPACE,
      descent: DEFAULT_NAMESPACE,
      diffuseConstant: DEFAULT_NAMESPACE,
      direction: DEFAULT_NAMESPACE,
      display: DEFAULT_NAMESPACE,
      divisor: DEFAULT_NAMESPACE,
      "dominant-baseline": DEFAULT_NAMESPACE,
      dur: DEFAULT_NAMESPACE,
      dx: DEFAULT_NAMESPACE,
      dy: DEFAULT_NAMESPACE,
      edgeMode: DEFAULT_NAMESPACE,
      editable: DEFAULT_NAMESPACE,
      elevation: DEFAULT_NAMESPACE,
      "enable-background": DEFAULT_NAMESPACE,
      end: DEFAULT_NAMESPACE,
      "ev:event": EV_NAMESPACE,
      event: DEFAULT_NAMESPACE,
      exponent: DEFAULT_NAMESPACE,
      externalResourcesRequired: DEFAULT_NAMESPACE,
      fill: DEFAULT_NAMESPACE,
      "fill-opacity": DEFAULT_NAMESPACE,
      "fill-rule": DEFAULT_NAMESPACE,
      filter: DEFAULT_NAMESPACE,
      filterRes: DEFAULT_NAMESPACE,
      filterUnits: DEFAULT_NAMESPACE,
      "flood-color": DEFAULT_NAMESPACE,
      "flood-opacity": DEFAULT_NAMESPACE,
      focusHighlight: DEFAULT_NAMESPACE,
      focusable: DEFAULT_NAMESPACE,
      "font-family": DEFAULT_NAMESPACE,
      "font-size": DEFAULT_NAMESPACE,
      "font-size-adjust": DEFAULT_NAMESPACE,
      "font-stretch": DEFAULT_NAMESPACE,
      "font-style": DEFAULT_NAMESPACE,
      "font-variant": DEFAULT_NAMESPACE,
      "font-weight": DEFAULT_NAMESPACE,
      format: DEFAULT_NAMESPACE,
      from: DEFAULT_NAMESPACE,
      fx: DEFAULT_NAMESPACE,
      fy: DEFAULT_NAMESPACE,
      g1: DEFAULT_NAMESPACE,
      g2: DEFAULT_NAMESPACE,
      "glyph-name": DEFAULT_NAMESPACE,
      "glyph-orientation-horizontal": DEFAULT_NAMESPACE,
      "glyph-orientation-vertical": DEFAULT_NAMESPACE,
      glyphRef: DEFAULT_NAMESPACE,
      gradientTransform: DEFAULT_NAMESPACE,
      gradientUnits: DEFAULT_NAMESPACE,
      handler: DEFAULT_NAMESPACE,
      hanging: DEFAULT_NAMESPACE,
      height: DEFAULT_NAMESPACE,
      "horiz-adv-x": DEFAULT_NAMESPACE,
      "horiz-origin-x": DEFAULT_NAMESPACE,
      "horiz-origin-y": DEFAULT_NAMESPACE,
      id: DEFAULT_NAMESPACE,
      ideographic: DEFAULT_NAMESPACE,
      "image-rendering": DEFAULT_NAMESPACE,
      "in": DEFAULT_NAMESPACE,
      in2: DEFAULT_NAMESPACE,
      initialVisibility: DEFAULT_NAMESPACE,
      intercept: DEFAULT_NAMESPACE,
      k: DEFAULT_NAMESPACE,
      k1: DEFAULT_NAMESPACE,
      k2: DEFAULT_NAMESPACE,
      k3: DEFAULT_NAMESPACE,
      k4: DEFAULT_NAMESPACE,
      kernelMatrix: DEFAULT_NAMESPACE,
      kernelUnitLength: DEFAULT_NAMESPACE,
      kerning: DEFAULT_NAMESPACE,
      keyPoints: DEFAULT_NAMESPACE,
      keySplines: DEFAULT_NAMESPACE,
      keyTimes: DEFAULT_NAMESPACE,
      lang: DEFAULT_NAMESPACE,
      lengthAdjust: DEFAULT_NAMESPACE,
      "letter-spacing": DEFAULT_NAMESPACE,
      "lighting-color": DEFAULT_NAMESPACE,
      limitingConeAngle: DEFAULT_NAMESPACE,
      local: DEFAULT_NAMESPACE,
      "marker-end": DEFAULT_NAMESPACE,
      "marker-mid": DEFAULT_NAMESPACE,
      "marker-start": DEFAULT_NAMESPACE,
      markerHeight: DEFAULT_NAMESPACE,
      markerUnits: DEFAULT_NAMESPACE,
      markerWidth: DEFAULT_NAMESPACE,
      mask: DEFAULT_NAMESPACE,
      maskContentUnits: DEFAULT_NAMESPACE,
      maskUnits: DEFAULT_NAMESPACE,
      mathematical: DEFAULT_NAMESPACE,
      max: DEFAULT_NAMESPACE,
      media: DEFAULT_NAMESPACE,
      mediaCharacterEncoding: DEFAULT_NAMESPACE,
      mediaContentEncodings: DEFAULT_NAMESPACE,
      mediaSize: DEFAULT_NAMESPACE,
      mediaTime: DEFAULT_NAMESPACE,
      method: DEFAULT_NAMESPACE,
      min: DEFAULT_NAMESPACE,
      mode: DEFAULT_NAMESPACE,
      name: DEFAULT_NAMESPACE,
      "nav-down": DEFAULT_NAMESPACE,
      "nav-down-left": DEFAULT_NAMESPACE,
      "nav-down-right": DEFAULT_NAMESPACE,
      "nav-left": DEFAULT_NAMESPACE,
      "nav-next": DEFAULT_NAMESPACE,
      "nav-prev": DEFAULT_NAMESPACE,
      "nav-right": DEFAULT_NAMESPACE,
      "nav-up": DEFAULT_NAMESPACE,
      "nav-up-left": DEFAULT_NAMESPACE,
      "nav-up-right": DEFAULT_NAMESPACE,
      numOctaves: DEFAULT_NAMESPACE,
      observer: DEFAULT_NAMESPACE,
      offset: DEFAULT_NAMESPACE,
      opacity: DEFAULT_NAMESPACE,
      operator: DEFAULT_NAMESPACE,
      order: DEFAULT_NAMESPACE,
      orient: DEFAULT_NAMESPACE,
      orientation: DEFAULT_NAMESPACE,
      origin: DEFAULT_NAMESPACE,
      overflow: DEFAULT_NAMESPACE,
      overlay: DEFAULT_NAMESPACE,
      "overline-position": DEFAULT_NAMESPACE,
      "overline-thickness": DEFAULT_NAMESPACE,
      "panose-1": DEFAULT_NAMESPACE,
      path: DEFAULT_NAMESPACE,
      pathLength: DEFAULT_NAMESPACE,
      patternContentUnits: DEFAULT_NAMESPACE,
      patternTransform: DEFAULT_NAMESPACE,
      patternUnits: DEFAULT_NAMESPACE,
      phase: DEFAULT_NAMESPACE,
      playbackOrder: DEFAULT_NAMESPACE,
      "pointer-events": DEFAULT_NAMESPACE,
      points: DEFAULT_NAMESPACE,
      pointsAtX: DEFAULT_NAMESPACE,
      pointsAtY: DEFAULT_NAMESPACE,
      pointsAtZ: DEFAULT_NAMESPACE,
      preserveAlpha: DEFAULT_NAMESPACE,
      preserveAspectRatio: DEFAULT_NAMESPACE,
      primitiveUnits: DEFAULT_NAMESPACE,
      propagate: DEFAULT_NAMESPACE,
      property: DEFAULT_NAMESPACE,
      r: DEFAULT_NAMESPACE,
      radius: DEFAULT_NAMESPACE,
      refX: DEFAULT_NAMESPACE,
      refY: DEFAULT_NAMESPACE,
      rel: DEFAULT_NAMESPACE,
      "rendering-intent": DEFAULT_NAMESPACE,
      repeatCount: DEFAULT_NAMESPACE,
      repeatDur: DEFAULT_NAMESPACE,
      requiredExtensions: DEFAULT_NAMESPACE,
      requiredFeatures: DEFAULT_NAMESPACE,
      requiredFonts: DEFAULT_NAMESPACE,
      requiredFormats: DEFAULT_NAMESPACE,
      resource: DEFAULT_NAMESPACE,
      restart: DEFAULT_NAMESPACE,
      result: DEFAULT_NAMESPACE,
      rev: DEFAULT_NAMESPACE,
      role: DEFAULT_NAMESPACE,
      rotate: DEFAULT_NAMESPACE,
      rx: DEFAULT_NAMESPACE,
      ry: DEFAULT_NAMESPACE,
      scale: DEFAULT_NAMESPACE,
      seed: DEFAULT_NAMESPACE,
      "shape-rendering": DEFAULT_NAMESPACE,
      slope: DEFAULT_NAMESPACE,
      snapshotTime: DEFAULT_NAMESPACE,
      spacing: DEFAULT_NAMESPACE,
      specularConstant: DEFAULT_NAMESPACE,
      specularExponent: DEFAULT_NAMESPACE,
      spreadMethod: DEFAULT_NAMESPACE,
      startOffset: DEFAULT_NAMESPACE,
      stdDeviation: DEFAULT_NAMESPACE,
      stemh: DEFAULT_NAMESPACE,
      stemv: DEFAULT_NAMESPACE,
      stitchTiles: DEFAULT_NAMESPACE,
      "stop-color": DEFAULT_NAMESPACE,
      "stop-opacity": DEFAULT_NAMESPACE,
      "strikethrough-position": DEFAULT_NAMESPACE,
      "strikethrough-thickness": DEFAULT_NAMESPACE,
      string: DEFAULT_NAMESPACE,
      stroke: DEFAULT_NAMESPACE,
      "stroke-dasharray": DEFAULT_NAMESPACE,
      "stroke-dashoffset": DEFAULT_NAMESPACE,
      "stroke-linecap": DEFAULT_NAMESPACE,
      "stroke-linejoin": DEFAULT_NAMESPACE,
      "stroke-miterlimit": DEFAULT_NAMESPACE,
      "stroke-opacity": DEFAULT_NAMESPACE,
      "stroke-width": DEFAULT_NAMESPACE,
      surfaceScale: DEFAULT_NAMESPACE,
      syncBehavior: DEFAULT_NAMESPACE,
      syncBehaviorDefault: DEFAULT_NAMESPACE,
      syncMaster: DEFAULT_NAMESPACE,
      syncTolerance: DEFAULT_NAMESPACE,
      syncToleranceDefault: DEFAULT_NAMESPACE,
      systemLanguage: DEFAULT_NAMESPACE,
      tableValues: DEFAULT_NAMESPACE,
      target: DEFAULT_NAMESPACE,
      targetX: DEFAULT_NAMESPACE,
      targetY: DEFAULT_NAMESPACE,
      "text-anchor": DEFAULT_NAMESPACE,
      "text-decoration": DEFAULT_NAMESPACE,
      "text-rendering": DEFAULT_NAMESPACE,
      textLength: DEFAULT_NAMESPACE,
      timelineBegin: DEFAULT_NAMESPACE,
      title: DEFAULT_NAMESPACE,
      to: DEFAULT_NAMESPACE,
      transform: DEFAULT_NAMESPACE,
      transformBehavior: DEFAULT_NAMESPACE,
      type: DEFAULT_NAMESPACE,
      "typeof": DEFAULT_NAMESPACE,
      u1: DEFAULT_NAMESPACE,
      u2: DEFAULT_NAMESPACE,
      "underline-position": DEFAULT_NAMESPACE,
      "underline-thickness": DEFAULT_NAMESPACE,
      unicode: DEFAULT_NAMESPACE,
      "unicode-bidi": DEFAULT_NAMESPACE,
      "unicode-range": DEFAULT_NAMESPACE,
      "units-per-em": DEFAULT_NAMESPACE,
      "v-alphabetic": DEFAULT_NAMESPACE,
      "v-hanging": DEFAULT_NAMESPACE,
      "v-ideographic": DEFAULT_NAMESPACE,
      "v-mathematical": DEFAULT_NAMESPACE,
      values: DEFAULT_NAMESPACE,
      version: DEFAULT_NAMESPACE,
      "vert-adv-y": DEFAULT_NAMESPACE,
      "vert-origin-x": DEFAULT_NAMESPACE,
      "vert-origin-y": DEFAULT_NAMESPACE,
      viewBox: DEFAULT_NAMESPACE,
      viewTarget: DEFAULT_NAMESPACE,
      visibility: DEFAULT_NAMESPACE,
      width: DEFAULT_NAMESPACE,
      widths: DEFAULT_NAMESPACE,
      "word-spacing": DEFAULT_NAMESPACE,
      "writing-mode": DEFAULT_NAMESPACE,
      x: DEFAULT_NAMESPACE,
      "x-height": DEFAULT_NAMESPACE,
      x1: DEFAULT_NAMESPACE,
      x2: DEFAULT_NAMESPACE,
      xChannelSelector: DEFAULT_NAMESPACE,
      "xlink:actuate": XLINK_NAMESPACE,
      "xlink:arcrole": XLINK_NAMESPACE,
      "xlink:href": XLINK_NAMESPACE,
      "xlink:role": XLINK_NAMESPACE,
      "xlink:show": XLINK_NAMESPACE,
      "xlink:title": XLINK_NAMESPACE,
      "xlink:type": XLINK_NAMESPACE,
      "xml:base": XML_NAMESPACE,
      "xml:id": XML_NAMESPACE,
      "xml:lang": XML_NAMESPACE,
      "xml:space": XML_NAMESPACE,
      y: DEFAULT_NAMESPACE,
      y1: DEFAULT_NAMESPACE,
      y2: DEFAULT_NAMESPACE,
      yChannelSelector: DEFAULT_NAMESPACE,
      z: DEFAULT_NAMESPACE,
      zoomAndPan: DEFAULT_NAMESPACE
    };
    module.exports = SVGAttributeNamespace;
    function SVGAttributeNamespace(value) {
      if (SVG_PROPERTIES.hasOwnProperty(value)) {
        return SVG_PROPERTIES[value]
      }
    }
  }, {}],
  34: [function (require, module, exports) {
    "use strict";
    var isArray = require("x-is-array");
    var h = require("./index.js");
    var SVGAttributeNamespace = require("./svg-attribute-namespace");
    var attributeHook = require("./hooks/attribute-hook");
    var SVG_NAMESPACE = "http://www.w3.org/2000/svg";
    module.exports = svg;
    function svg(tagName, properties, children) {
      if (!children && isChildren(properties)) {
        children = properties;
        properties = {}
      }
      properties = properties || {};
      properties.namespace = SVG_NAMESPACE;
      var attributes = properties.attributes || (properties.attributes = {});
      for (var key in properties) {
        if (!properties.hasOwnProperty(key)) {
          continue
        }
        var namespace = SVGAttributeNamespace(key);
        if (namespace === undefined) {
          continue
        }
        var value = properties[key];
        if (typeof value !== "string" && typeof value !== "number" && typeof value !== "boolean") {
          continue
        }
        if (namespace !== null) {
          properties[key] = attributeHook(namespace, value);
          continue
        }
        attributes[key] = value;
        properties[key] = undefined
      }
      return h(tagName, properties, children)
    }

    function isChildren(x) {
      return typeof x === "string" || isArray(x)
    }
  }, {"./hooks/attribute-hook": 28, "./index.js": 31, "./svg-attribute-namespace": 33, "x-is-array": 20}],
  35: [function (require, module, exports) {
    var isVNode = require("./is-vnode");
    var isVText = require("./is-vtext");
    var isWidget = require("./is-widget");
    var isThunk = require("./is-thunk");
    module.exports = handleThunk;
    function handleThunk(a, b) {
      var renderedA = a;
      var renderedB = b;
      if (isThunk(b)) {
        renderedB = renderThunk(b, a)
      }
      if (isThunk(a)) {
        renderedA = renderThunk(a, null)
      }
      return {a: renderedA, b: renderedB}
    }

    function renderThunk(thunk, previous) {
      var renderedThunk = thunk.vnode;
      if (!renderedThunk) {
        renderedThunk = thunk.vnode = thunk.render(previous)
      }
      if (!(isVNode(renderedThunk) || isVText(renderedThunk) || isWidget(renderedThunk))) {
        throw new Error("thunk did not return a valid node")
      }
      return renderedThunk
    }
  }, {"./is-thunk": 36, "./is-vnode": 38, "./is-vtext": 39, "./is-widget": 40}],
  36: [function (require, module, exports) {
    module.exports = isThunk;
    function isThunk(t) {
      return t && t.type === "Thunk"
    }
  }, {}],
  37: [function (require, module, exports) {
    module.exports = isHook;
    function isHook(hook) {
      return hook && (typeof hook.hook === "function" && !hook.hasOwnProperty("hook") || typeof hook.unhook === "function" && !hook.hasOwnProperty("unhook"))
    }
  }, {}],
  38: [function (require, module, exports) {
    var version = require("./version");
    module.exports = isVirtualNode;
    function isVirtualNode(x) {
      return x && x.type === "VirtualNode" && x.version === version
    }
  }, {"./version": 41}],
  39: [function (require, module, exports) {
    var version = require("./version");
    module.exports = isVirtualText;
    function isVirtualText(x) {
      return x && x.type === "VirtualText" && x.version === version
    }
  }, {"./version": 41}],
  40: [function (require, module, exports) {
    module.exports = isWidget;
    function isWidget(w) {
      return w && w.type === "Widget"
    }
  }, {}],
  41: [function (require, module, exports) {
    module.exports = "1"
  }, {}],
  42: [function (require, module, exports) {
    var version = require("./version");
    var isVNode = require("./is-vnode");
    var isWidget = require("./is-widget");
    var isThunk = require("./is-thunk");
    var isVHook = require("./is-vhook");
    module.exports = VirtualNode;
    var noProperties = {};
    var noChildren = [];

    function VirtualNode(tagName, properties, children, key, namespace) {
      this.tagName = tagName;
      this.properties = properties || noProperties;
      this.children = children || noChildren;
      this.key = key != null ? String(key) : undefined;
      this.namespace = typeof namespace === "string" ? namespace : null;
      var count = children && children.length || 0;
      var descendants = 0;
      var hasWidgets = false;
      var hasThunks = false;
      var descendantHooks = false;
      var hooks;
      for (var propName in properties) {
        if (properties.hasOwnProperty(propName)) {
          var property = properties[propName];
          if (isVHook(property) && property.unhook) {
            if (!hooks) {
              hooks = {}
            }
            hooks[propName] = property
          }
        }
      }
      for (var i = 0; i < count; i++) {
        var child = children[i];
        if (isVNode(child)) {
          descendants += child.count || 0;
          if (!hasWidgets && child.hasWidgets) {
            hasWidgets = true
          }
          if (!hasThunks && child.hasThunks) {
            hasThunks = true
          }
          if (!descendantHooks && (child.hooks || child.descendantHooks)) {
            descendantHooks = true
          }
        } else if (!hasWidgets && isWidget(child)) {
          if (typeof child.destroy === "function") {
            hasWidgets = true
          }
        } else if (!hasThunks && isThunk(child)) {
          hasThunks = true
        }
      }
      this.count = count + descendants;
      this.hasWidgets = hasWidgets;
      this.hasThunks = hasThunks;
      this.hooks = hooks;
      this.descendantHooks = descendantHooks
    }

    VirtualNode.prototype.version = version;
    VirtualNode.prototype.type = "VirtualNode"
  }, {"./is-thunk": 36, "./is-vhook": 37, "./is-vnode": 38, "./is-widget": 40, "./version": 41}],
  43: [function (require, module, exports) {
    var version = require("./version");
    VirtualPatch.NONE = 0;
    VirtualPatch.VTEXT = 1;
    VirtualPatch.VNODE = 2;
    VirtualPatch.WIDGET = 3;
    VirtualPatch.PROPS = 4;
    VirtualPatch.ORDER = 5;
    VirtualPatch.INSERT = 6;
    VirtualPatch.REMOVE = 7;
    VirtualPatch.THUNK = 8;
    module.exports = VirtualPatch;
    function VirtualPatch(type, vNode, patch) {
      this.type = Number(type);
      this.vNode = vNode;
      this.patch = patch
    }

    VirtualPatch.prototype.version = version;
    VirtualPatch.prototype.type = "VirtualPatch"
  }, {"./version": 41}],
  44: [function (require, module, exports) {
    var version = require("./version");
    module.exports = VirtualText;
    function VirtualText(text) {
      this.text = String(text)
    }

    VirtualText.prototype.version = version;
    VirtualText.prototype.type = "VirtualText"
  }, {"./version": 41}],
  45: [function (require, module, exports) {
    var isObject = require("is-object");
    var isHook = require("../vnode/is-vhook");
    module.exports = diffProps;
    function diffProps(a, b) {
      var diff;
      for (var aKey in a) {
        if (!(aKey in b)) {
          diff = diff || {};
          diff[aKey] = undefined
        }
        var aValue = a[aKey];
        var bValue = b[aKey];
        if (aValue === bValue) {
          continue
        } else if (isObject(aValue) && isObject(bValue)) {
          if (getPrototype(bValue) !== getPrototype(aValue)) {
            diff = diff || {};
            diff[aKey] = bValue
          } else if (isHook(bValue)) {
            diff = diff || {};
            diff[aKey] = bValue
          } else {
            var objectDiff = diffProps(aValue, bValue);
            if (objectDiff) {
              diff = diff || {};
              diff[aKey] = objectDiff
            }
          }
        } else {
          diff = diff || {};
          diff[aKey] = bValue
        }
      }
      for (var bKey in b) {
        if (!(bKey in a)) {
          diff = diff || {};
          diff[bKey] = b[bKey]
        }
      }
      return diff
    }

    function getPrototype(value) {
      if (Object.getPrototypeOf) {
        return Object.getPrototypeOf(value)
      } else if (value.__proto__) {
        return value.__proto__
      } else if (value.constructor) {
        return value.constructor.prototype
      }
    }
  }, {"../vnode/is-vhook": 37, "is-object": 19}],
  46: [function (require, module, exports) {
    var isArray = require("x-is-array");
    var VPatch = require("../vnode/vpatch");
    var isVNode = require("../vnode/is-vnode");
    var isVText = require("../vnode/is-vtext");
    var isWidget = require("../vnode/is-widget");
    var isThunk = require("../vnode/is-thunk");
    var handleThunk = require("../vnode/handle-thunk");
    var diffProps = require("./diff-props");
    module.exports = diff;
    function diff(a, b) {
      var patch = {a: a};
      walk(a, b, patch, 0);
      return patch
    }

    function walk(a, b, patch, index) {
      if (a === b) {
        return
      }
      var apply = patch[index];
      var applyClear = false;
      if (isThunk(a) || isThunk(b)) {
        thunks(a, b, patch, index)
      } else if (b == null) {
        if (!isWidget(a)) {
          clearState(a, patch, index);
          apply = patch[index]
        }
        apply = appendPatch(apply, new VPatch(VPatch.REMOVE, a, b))
      } else if (isVNode(b)) {
        if (isVNode(a)) {
          if (a.tagName === b.tagName && a.namespace === b.namespace && a.key === b.key) {
            var propsPatch = diffProps(a.properties, b.properties);
            if (propsPatch) {
              apply = appendPatch(apply, new VPatch(VPatch.PROPS, a, propsPatch))
            }
            apply = diffChildren(a, b, patch, apply, index)
          } else {
            apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b));
            applyClear = true
          }
        } else {
          apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b));
          applyClear = true
        }
      } else if (isVText(b)) {
        if (!isVText(a)) {
          apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b));
          applyClear = true
        } else if (a.text !== b.text) {
          apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
        }
      } else if (isWidget(b)) {
        if (!isWidget(a)) {
          applyClear = true
        }
        apply = appendPatch(apply, new VPatch(VPatch.WIDGET, a, b))
      }
      if (apply) {
        patch[index] = apply
      }
      if (applyClear) {
        clearState(a, patch, index)
      }
    }

    function diffChildren(a, b, patch, apply, index) {
      var aChildren = a.children;
      var bChildren = reorder(aChildren, b.children);
      var aLen = aChildren.length;
      var bLen = bChildren.length;
      var len = aLen > bLen ? aLen : bLen;
      for (var i = 0; i < len; i++) {
        var leftNode = aChildren[i];
        var rightNode = bChildren[i];
        index += 1;
        if (!leftNode) {
          if (rightNode) {
            apply = appendPatch(apply, new VPatch(VPatch.INSERT, null, rightNode))
          }
        } else {
          walk(leftNode, rightNode, patch, index)
        }
        if (isVNode(leftNode) && leftNode.count) {
          index += leftNode.count
        }
      }
      if (bChildren.moves) {
        apply = appendPatch(apply, new VPatch(VPatch.ORDER, a, bChildren.moves))
      }
      return apply
    }

    function clearState(vNode, patch, index) {
      unhook(vNode, patch, index);
      destroyWidgets(vNode, patch, index)
    }

    function destroyWidgets(vNode, patch, index) {
      if (isWidget(vNode)) {
        if (typeof vNode.destroy === "function") {
          patch[index] = appendPatch(patch[index], new VPatch(VPatch.REMOVE, vNode, null))
        }
      } else if (isVNode(vNode) && (vNode.hasWidgets || vNode.hasThunks)) {
        var children = vNode.children;
        var len = children.length;
        for (var i = 0; i < len; i++) {
          var child = children[i];
          index += 1;
          destroyWidgets(child, patch, index);
          if (isVNode(child) && child.count) {
            index += child.count
          }
        }
      } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index)
      }
    }

    function thunks(a, b, patch, index) {
      var nodes = handleThunk(a, b);
      var thunkPatch = diff(nodes.a, nodes.b);
      if (hasPatches(thunkPatch)) {
        patch[index] = new VPatch(VPatch.THUNK, null, thunkPatch)
      }
    }

    function hasPatches(patch) {
      for (var index in patch) {
        if (index !== "a") {
          return true
        }
      }
      return false
    }

    function unhook(vNode, patch, index) {
      if (isVNode(vNode)) {
        if (vNode.hooks) {
          patch[index] = appendPatch(patch[index], new VPatch(VPatch.PROPS, vNode, undefinedKeys(vNode.hooks)))
        }
        if (vNode.descendantHooks || vNode.hasThunks) {
          var children = vNode.children;
          var len = children.length;
          for (var i = 0; i < len; i++) {
            var child = children[i];
            index += 1;
            unhook(child, patch, index);
            if (isVNode(child) && child.count) {
              index += child.count
            }
          }
        }
      } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index)
      }
    }

    function undefinedKeys(obj) {
      var result = {};
      for (var key in obj) {
        result[key] = undefined
      }
      return result
    }

    function reorder(aChildren, bChildren) {
      var bKeys = keyIndex(bChildren);
      if (!bKeys) {
        return bChildren
      }
      var aKeys = keyIndex(aChildren);
      if (!aKeys) {
        return bChildren
      }
      var bMatch = {}, aMatch = {};
      for (var aKey in bKeys) {
        bMatch[bKeys[aKey]] = aKeys[aKey]
      }
      for (var bKey in aKeys) {
        aMatch[aKeys[bKey]] = bKeys[bKey]
      }
      var aLen = aChildren.length;
      var bLen = bChildren.length;
      var len = aLen > bLen ? aLen : bLen;
      var shuffle = [];
      var freeIndex = 0;
      var i = 0;
      var moveIndex = 0;
      var moves = {};
      var removes = moves.removes = {};
      var reverse = moves.reverse = {};
      var hasMoves = false;
      while (freeIndex < len) {
        var move = aMatch[i];
        if (move !== undefined) {
          shuffle[i] = bChildren[move];
          if (move !== moveIndex) {
            moves[move] = moveIndex;
            reverse[moveIndex] = move;
            hasMoves = true
          }
          moveIndex++
        } else if (i in aMatch) {
          shuffle[i] = undefined;
          removes[i] = moveIndex++;
          hasMoves = true
        } else {
          while (bMatch[freeIndex] !== undefined) {
            freeIndex++
          }
          if (freeIndex < len) {
            var freeChild = bChildren[freeIndex];
            if (freeChild) {
              shuffle[i] = freeChild;
              if (freeIndex !== moveIndex) {
                hasMoves = true;
                moves[freeIndex] = moveIndex;
                reverse[moveIndex] = freeIndex
              }
              moveIndex++
            }
            freeIndex++
          }
        }
        i++
      }
      if (hasMoves) {
        shuffle.moves = moves
      }
      return shuffle
    }

    function keyIndex(children) {
      var i, keys;
      for (i = 0; i < children.length; i++) {
        var child = children[i];
        if (child.key !== undefined) {
          keys = keys || {};
          keys[child.key] = i
        }
      }
      return keys
    }

    function appendPatch(apply, patch) {
      if (apply) {
        if (isArray(apply)) {
          apply.push(patch)
        } else {
          apply = [apply, patch]
        }
        return apply
      } else {
        return patch
      }
    }
  }, {
    "../vnode/handle-thunk": 35,
    "../vnode/is-thunk": 36,
    "../vnode/is-vnode": 38,
    "../vnode/is-vtext": 39,
    "../vnode/is-widget": 40,
    "../vnode/vpatch": 43,
    "./diff-props": 45,
    "x-is-array": 20
  }],
  47: [function (require, module, exports) {
    "use strict";
    var DataFlowNode = require("./data-flow-node");
    var errors = require("./errors");

    function createIntent(definitionFn) {
      var intent = new DataFlowNode(definitionFn);
      intent = errors.customInterfaceErrorMessageInInject(intent, "Intent expects View to have the required property ");
      intent.clone = function cloneIntent() {
        return createIntent(definitionFn)
      };
      return intent
    }

    module.exports = createIntent
  }, {"./data-flow-node": 52, "./errors": 56}],
  48: [function (require, module, exports) {
    "use strict";
    var DataFlowNode = require("./data-flow-node");
    var errors = require("./errors");

    function createModel(definitionFn) {
      var model = new DataFlowNode(definitionFn);
      model = errors.customInterfaceErrorMessageInInject(model, "Model expects Intent to have the required property ");
      model.clone = function cloneModel() {
        return createModel(definitionFn)
      };
      return model
    }

    module.exports = createModel
  }, {"./data-flow-node": 52, "./errors": 56}],
  49: [function (require, module, exports) {
    "use strict";
    var Rx = require("rx");
    var DataFlowNode = require("./data-flow-node");
    var errors = require("./errors");

    function checkVTree$(view) {
      if (view.get("vtree$") === null || typeof view.get("vtree$").subscribe !== "function") {
        throw new Error("View must define `vtree$` Observable emitting virtual DOM elements")
      }
    }

    function throwErrorIfNotVTree(vtree) {
      if (vtree.type !== "VirtualNode" || vtree.tagName === "undefined") {
        throw new Error("View `vtree$` must emit only VirtualNode instances. " + "Hint: create them with Cycle.h()")
      }
    }

    function getCorrectedVtree$(view) {
      var newVtree$ = view.get("vtree$").map(function (vtree) {
        if (vtree.type === "Widget") {
          return vtree
        }
        throwErrorIfNotVTree(vtree);
        return vtree
      }).replay(null, 1);
      newVtree$.connect();
      return newVtree$
    }

    function overrideGet(view) {
      var oldGet = view.get;
      var newVtree$ = getCorrectedVtree$(view);
      view.get = function get(streamName) {
        if (streamName === "vtree$") {
          return newVtree$
        } else if (view[streamName]) {
          return view[streamName]
        } else {
          var result = oldGet.call(this, streamName);
          if (!result) {
            view[streamName] = new Rx.Subject;
            return view[streamName]
          } else {
            return result
          }
        }
      }
    }

    function createView(definitionFn) {
      var view = new DataFlowNode(definitionFn);
      view = errors.customInterfaceErrorMessageInInject(view, "View expects Model to have the required property ");
      checkVTree$(view);
      overrideGet(view);
      view.clone = function cloneView() {
        return createView(definitionFn)
      };
      return view
    }

    module.exports = createView
  }, {"./data-flow-node": 52, "./errors": 56, rx: 9}],
  50: [function (require, module, exports) {
    "use strict";
    var InputProxy = require("./input-proxy");
    var Utils = require("./utils");

    function makeDispatchFunction(element, eventName) {
      return function dispatchCustomEvent(evData) {
        var event;
        try {
          event = new Event(eventName)
        } catch (err) {
          event = document.createEvent("Event");
          event.initEvent(eventName, true, true)
        }
        event.data = evData;
        element.dispatchEvent(event)
      }
    }

    function subscribeDispatchers(element, eventStreams) {
      if (!eventStreams || eventStreams === null || typeof eventStreams !== "object") {
        return
      }
      for (var streamName in eventStreams) {
        if (eventStreams.hasOwnProperty(streamName) && Utils.endsWithDolarSign(streamName) && typeof eventStreams[streamName].subscribe === "function") {
          var eventName = streamName.slice(0, -1);
          eventStreams[streamName].subscribe(makeDispatchFunction(element, eventName))
        }
      }
    }

    function createContainerElement(tagName, vtreeProperties) {
      var elem = document.createElement("div");
      elem.className = vtreeProperties.className || "";
      elem.id = vtreeProperties.id || "";
      elem.className += " cycleCustomElement-" + tagName.toUpperCase();
      elem.cycleCustomElementProperties = new InputProxy;
      return elem
    }

    function makeConstructor() {
      return function customElementConstructor(vtree) {
        this.type = "Widget";
        this.properties = vtree.properties
      }
    }

    function makeInit(tagName, definitionFn) {
      var DOMUser = require("./dom-user");
      return function initCustomElement() {
        var element = createContainerElement(tagName, this.properties);
        var user = new DOMUser(element);
        var eventStreams = definitionFn(user, element.cycleCustomElementProperties);
        subscribeDispatchers(element, eventStreams);
        this.update(null, element);
        return element
      }
    }

    function makeUpdate() {
      return function updateCustomElement(prev, elem) {
        if (!elem || !elem.cycleCustomElementProperties || !(elem.cycleCustomElementProperties instanceof InputProxy) || !elem.cycleCustomElementProperties.proxiedProps) {
          return
        }
        var proxiedProps = elem.cycleCustomElementProperties.proxiedProps;
        for (var prop in proxiedProps) {
          var propStreamName = prop;
          var propName = prop.slice(0, -1);
          if (proxiedProps.hasOwnProperty(propStreamName) && this.properties.hasOwnProperty(propName)) {
            proxiedProps[propStreamName].onNext(this.properties[propName])
          }
        }
      }
    }

    module.exports = {makeConstructor: makeConstructor, makeInit: makeInit, makeUpdate: makeUpdate}
  }, {"./dom-user": 55, "./input-proxy": 57, "./utils": 59}],
  51: [function (require, module, exports) {
    "use strict";
    var VirtualDOM = require("virtual-dom");
    var Rx = require("rx");
    var DataFlowNode = require("./data-flow-node");
    var DataFlowSource = require("./data-flow-source");
    var DataFlowSink = require("./data-flow-sink");
    var DOMUser = require("./dom-user");
    var PropertyHook = require("./property-hook");
    var Cycle = {
      createDataFlowNode: function createDataFlowNode(definitionFn) {
        return new DataFlowNode(definitionFn)
      },
      createDataFlowSource: function createDataFlowSource(outputObject) {
        return new DataFlowSource(outputObject)
      },
      createDataFlowSink: function createDataFlowSink(definitionFn) {
        return new DataFlowSink(definitionFn)
      },
      createModel: require("./create-model"),
      createView: require("./create-view"),
      createIntent: require("./create-intent"),
      createDOMUser: function createDOMUser(container) {
        return new DOMUser(container)
      },
      registerCustomElement: function registerCustomElement(tagName, definitionFn) {
        DOMUser.registerCustomElement(tagName, definitionFn)
      },
      vdomPropHook: function (fn) {
        return new PropertyHook(fn)
      },
      Rx: Rx,
      h: VirtualDOM.h
    };
    module.exports = Cycle
  }, {
    "./create-intent": 47,
    "./create-model": 48,
    "./create-view": 49,
    "./data-flow-node": 52,
    "./data-flow-sink": 53,
    "./data-flow-source": 54,
    "./dom-user": 55,
    "./property-hook": 58,
    rx: 9,
    "virtual-dom": 13
  }],
  52: [function (require, module, exports) {
    "use strict";
    var Rx = require("rx");
    var errors = require("./errors");
    var InputProxy = require("./input-proxy");
    var Utils = require("./utils");
    var CycleInterfaceError = errors.CycleInterfaceError;

    function replicate(source, subject) {
      if (typeof source === "undefined") {
        throw new Error("Cannot replicate() if source is undefined.")
      }
      return source.subscribe(function replicationOnNext(x) {
        subject.onNext(x)
      }, function replicationOnError(err) {
        subject.onError(err);
        console.error(err)
      })
    }

    function checkOutputObject(output) {
      if (typeof output !== "object") {
        throw new Error("A DataFlowNode should always return an object.")
      }
    }

    function createStreamNamesArray(output) {
      var array = [];
      for (var streamName in output) {
        if (output.hasOwnProperty(streamName) && Utils.endsWithDolarSign(streamName)) {
          array.push(streamName)
        }
      }
      return array
    }

    var replicateAll;

    function DataFlowNode(definitionFn) {
      if (arguments.length !== 1 || typeof definitionFn !== "function") {
        throw new Error("DataFlowNode expects the definitionFn as the only argument.")
      }
      var proxies = [];
      for (var i = 0; i < definitionFn.length; i++) {
        proxies[i] = new InputProxy
      }
      var wasInjected = false;
      var output = definitionFn.apply(this, proxies);
      checkOutputObject(output);
      this.outputStreams = createStreamNamesArray(output);
      this.get = function get(streamName) {
        return output[streamName] || null
      };
      this.clone = function clone() {
        return new DataFlowNode(definitionFn)
      };
      this.inject = function inject() {
        if (wasInjected) {
          console.warn("DataFlowNode has already been injected an input.")
        }
        if (definitionFn.length !== arguments.length) {
          console.warn("The call to inject() should provide the inputs that this " + "DataFlowNode expects according to its definition function.")
        }
        for (var i = 0; i < definitionFn.length; i++) {
          replicateAll(arguments[i], proxies[i])
        }
        wasInjected = true;
        if (arguments.length === 1) {
          return arguments[0]
        } else if (arguments.length > 1) {
          return Array.prototype.slice.call(arguments)
        } else {
          return null
        }
      };
      return this
    }

    function replicateAllEvent$(input, selector, proxyObj) {
      for (var eventName in proxyObj) {
        if (proxyObj.hasOwnProperty(eventName) && eventName !== "_hasEvent$") {
          var event$ = input.event$(selector, eventName);
          if (event$ !== null) {
            replicate(event$, proxyObj[eventName])
          }
        }
      }
    }

    replicateAll = function replicateAll(input, proxy) {
      if (!input || !proxy) {
        return
      }
      for (var key in proxy.proxiedProps) {
        if (proxy.proxiedProps.hasOwnProperty(key)) {
          var proxiedProperty = proxy.proxiedProps[key];
          if (typeof input.event$ === "function" && proxiedProperty._hasEvent$) {
            replicateAllEvent$(input, key, proxiedProperty)
          } else if (!input.hasOwnProperty(key) && input instanceof InputProxy) {
            input.proxiedProps[key] = new Rx.Subject;
            replicate(input.proxiedProps[key], proxiedProperty)
          } else if (typeof input.get === "function" && input.get(key) !== null) {
            replicate(input.get(key), proxiedProperty)
          } else if (typeof input === "object" && input.hasOwnProperty(key)) {
            if (!input[key]) {
              input[key] = new Rx.Subject
            }
            replicate(input[key], proxiedProperty)
          } else {
            throw new CycleInterfaceError("Input should have the required property " + key, String(key))
          }
        }
      }
    };
    module.exports = DataFlowNode
  }, {"./errors": 56, "./input-proxy": 57, "./utils": 59, rx: 9}],
  53: [function (require, module, exports) {
    "use strict";
    function makeLightweightInputProxies(args) {
      return Array.prototype.slice.call(args).map(function (arg) {
        return {
          get: function get(streamName) {
            if (typeof arg.get === "function") {
              return arg.get(streamName)
            } else {
              return arg[streamName] || null
            }
          }
        }
      })
    }

    function DataFlowSink(definitionFn) {
      if (arguments.length !== 1) {
        throw new Error("DataFlowSink expects only one argument: the definition function.")
      }
      if (typeof definitionFn !== "function") {
        throw new Error("DataFlowSink expects the argument to be the definition function.")
      }
      definitionFn.displayName += "(DataFlowSink defFn)";
      this.inject = function injectIntoDataFlowSink() {
        var proxies = makeLightweightInputProxies(arguments);
        return definitionFn.apply({}, proxies)
      };
      return this
    }

    module.exports = DataFlowSink
  }, {}],
  54: [function (require, module, exports) {
    "use strict";
    function DataFlowSource(outputObject) {
      if (arguments.length !== 1) {
        throw new Error("DataFlowSource expects only one argument: the output object.")
      }
      if (typeof outputObject !== "object") {
        throw new Error("DataFlowSource expects the constructor argument to be the " + "output object.")
      }
      for (var key in outputObject) {
        if (outputObject.hasOwnProperty(key)) {
          this[key] = outputObject[key]
        }
      }
      this.inject = function injectDataFlowSource() {
        throw new Error("A DataFlowSource cannot be injected. Use a DataFlowNode instead.")
      };
      return this
    }

    module.exports = DataFlowSource
  }, {}],
  55: [function (require, module, exports) {
    "use strict";
    var VDOM = {h: require("virtual-dom").h, diff: require("virtual-dom/diff"), patch: require("virtual-dom/patch")};
    var Rx = require("rx");
    var DataFlowNode = require("./data-flow-node");
    var CustomElements = require("./custom-elements");

    function isElement(o) {
      return typeof HTMLElement === "object" ? o instanceof HTMLElement || o instanceof DocumentFragment : o && typeof o === "object" && o !== null && (o.nodeType === 1 || o.nodeType === 11) && typeof o.nodeName === "string"
    }

    function DOMUser(container) {
      this._domContainer = typeof container === "string" ? document.querySelector(container) : container;
      if (typeof container === "string" && this._domContainer === null) {
        throw new Error("Cannot render into unknown element '" + container + "'")
      } else if (!isElement(this._domContainer)) {
        throw new Error("Given container is not a DOM element neither a selector string.")
      }
      this._originalClasses = (this._domContainer.className || "").trim().split(/\s+/);
      this._rootNode$ = new Rx.ReplaySubject(1);
      var self = this;
      DataFlowNode.call(this, function injectIntoDOMUser(view) {
        return self._renderEvery(view.get("vtree$"))
      })
    }

    DOMUser.prototype = Object.create(DataFlowNode.prototype);
    DOMUser.prototype._renderEvery = function renderEvery(vtree$) {
      var self = this;
      var rootNode;
      if (self._domContainer.cycleCustomElementProperties) {
        rootNode = self._domContainer
      } else {
        rootNode = document.createElement("div");
        self._domContainer.innerHTML = "";
        self._domContainer.appendChild(rootNode)
      }
      self._rootNode$.onNext(rootNode);
      return vtree$.startWith(VDOM.h()).map(function renderingPreprocessing(vtree) {
        return self._replaceCustomElements(vtree)
      }).pairwise().subscribe(function renderDiffAndPatch(pair) {
        try {
          var oldVTree = pair[0];
          var newVTree = pair[1];
          if (typeof newVTree === "undefined") {
            return
          }
          rootNode = VDOM.patch(rootNode, VDOM.diff(oldVTree, newVTree));
          self._fixClassName();
          self._rootNode$.onNext(rootNode)
        } catch (err) {
          console.error(err)
        }
      })
    };
    DOMUser.prototype._fixClassName = function fixClassName() {
      var previousClasses = this._domContainer.className.trim().split(/\s+/);
      var missingClasses = this._originalClasses.filter(function (clss) {
        return previousClasses.indexOf(clss) < 0
      });
      this._domContainer.className = previousClasses.concat(missingClasses).join(" ")
    };
    DOMUser.prototype._replaceCustomElements = function replaceCustomElements(vtree) {
      if (!vtree || !DOMUser._customElements || vtree.type === "VirtualText") {
        return vtree
      }
      var tagName = (vtree.tagName || "").toUpperCase();
      if (tagName && DOMUser._customElements.hasOwnProperty(tagName)) {
        return new DOMUser._customElements[tagName](vtree)
      }
      if (Array.isArray(vtree.children)) {
        for (var i = vtree.children.length - 1; i >= 0; i--) {
          vtree.children[i] = this._replaceCustomElements(vtree.children[i])
        }
      }
      return vtree
    };
    DOMUser.prototype.event$ = function event$(selector, eventName) {
      if (typeof selector !== "string") {
        throw new Error("DOMUser.event$ expects first argument to be a string as a " + "CSS selector")
      }
      if (typeof eventName !== "string") {
        throw new Error("DOMUser.event$ expects second argument to be a string " + "representing the event type to listen for.")
      }
      return this._rootNode$.filter(function filterEventStream(rootNode) {
        return !!rootNode
      }).flatMapLatest(function flatMapEventStream(rootNode) {
        var klass = selector.replace(".", "");
        if (rootNode.className.search(new RegExp("\\b" + klass + "\\b")) >= 0) {
          return Rx.Observable.fromEvent(rootNode, eventName)
        }
        var targetElements = rootNode.querySelectorAll(selector);
        if (targetElements && targetElements.length > 0) {
          return Rx.Observable.fromEvent(targetElements, eventName)
        } else {
          return Rx.Observable.empty()
        }
      })
    };
    DOMUser.registerCustomElement = function registerCustomElement(tagName, definitionFn) {
      if (typeof tagName !== "string" || typeof definitionFn !== "function") {
        throw new Error("registerCustomElement requires parameters `tagName` and " + "`definitionFn`.")
      }
      tagName = tagName.toUpperCase();
      //if (DOMUser._customElements && DOMUser._customElements.hasOwnProperty(tagName)) {
      //  throw new Error("Cannot register custom element `" + tagName + "` " + "for the DOMUser because that tagName is already registered.")
      //}
      var WidgetClass = CustomElements.makeConstructor();
      WidgetClass.prototype.init = CustomElements.makeInit(tagName, definitionFn);
      WidgetClass.prototype.update = CustomElements.makeUpdate();
      DOMUser._customElements = DOMUser._customElements || {};
      DOMUser._customElements[tagName] = WidgetClass
    };
    module.exports = DOMUser
  }, {
    "./custom-elements": 50,
    "./data-flow-node": 52,
    rx: 9,
    "virtual-dom": 13,
    "virtual-dom/diff": 11,
    "virtual-dom/patch": 21
  }],
  56: [function (require, module, exports) {
    "use strict";
    function CycleInterfaceError(message, missingMember) {
      this.name = "CycleInterfaceError";
      this.message = message || "";
      this.missingMember = missingMember || ""
    }

    CycleInterfaceError.prototype = Error.prototype;
    function customInterfaceErrorMessageInInject(dataFlowNode, message) {
      var originalInject = dataFlowNode.inject;
      dataFlowNode.inject = function inject() {
        try {
          return originalInject.apply({}, arguments)
        } catch (err) {
          if (err.name === "CycleInterfaceError") {
            throw new CycleInterfaceError(message + err.missingMember, err.missingMember)
          } else {
            throw err
          }
        }
      };
      return dataFlowNode
    }

    module.exports = {
      CycleInterfaceError: CycleInterfaceError,
      customInterfaceErrorMessageInInject: customInterfaceErrorMessageInInject
    }
  }, {}],
  57: [function (require, module, exports) {
    "use strict";
    var Rx = require("rx");

    function InputProxy() {
      this.proxiedProps = {};
      this.get = function getFromProxy(streamKey) {
        if (typeof this.proxiedProps[streamKey] === "undefined") {
          this.proxiedProps[streamKey] = new Rx.Subject
        }
        return this.proxiedProps[streamKey]
      };
      this.event$ = function event$FromProxy(selector, eventName) {
        if (typeof this.proxiedProps[selector] === "undefined") {
          this.proxiedProps[selector] = {_hasEvent$: true}
        }
        if (typeof this.proxiedProps[selector][eventName] === "undefined") {
          this.proxiedProps[selector][eventName] = new Rx.Subject
        }
        return this.proxiedProps[selector][eventName]
      }
    }

    module.exports = InputProxy
  }, {rx: 9}],
  58: [function (require, module, exports) {
    "use strict";
    function PropertyHook(fn) {
      this.fn = fn
    }

    PropertyHook.prototype.hook = function () {
      this.fn.apply(this, arguments)
    };
    module.exports = PropertyHook
  }, {}],
  59: [function (require, module, exports) {
    "use strict";
    function endsWithDolarSign(str) {
      if (typeof str !== "string") {
        return false
      }
      return str.indexOf("$", str.length - 1) !== -1
    }

    module.exports = {endsWithDolarSign: endsWithDolarSign}
  }, {}],
  60: [function (require, module, exports) {
    (function (global, factory) {
      typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : global.Immutable = factory()
    })(this, function () {
      "use strict";
      var SLICE$0 = Array.prototype.slice;

      function createClass(ctor, superClass) {
        if (superClass) {
          ctor.prototype = Object.create(superClass.prototype)
        }
        ctor.prototype.constructor = ctor
      }

      var DELETE = "delete";
      var SHIFT = 5;
      var SIZE = 1 << SHIFT;
      var MASK = SIZE - 1;
      var NOT_SET = {};
      var CHANGE_LENGTH = {value: false};
      var DID_ALTER = {value: false};

      function MakeRef(ref) {
        ref.value = false;
        return ref
      }

      function SetRef(ref) {
        ref && (ref.value = true)
      }

      function OwnerID() {
      }

      function arrCopy(arr, offset) {
        offset = offset || 0;
        var len = Math.max(0, arr.length - offset);
        var newArr = new Array(len);
        for (var ii = 0; ii < len; ii++) {
          newArr[ii] = arr[ii + offset]
        }
        return newArr
      }

      function ensureSize(iter) {
        if (iter.size === undefined) {
          iter.size = iter.__iterate(returnTrue)
        }
        return iter.size
      }

      function wrapIndex(iter, index) {
        return index >= 0 ? +index : ensureSize(iter) + +index
      }

      function returnTrue() {
        return true
      }

      function wholeSlice(begin, end, size) {
        return (begin === 0 || size !== undefined && begin <= -size) && (end === undefined || size !== undefined && end >= size)
      }

      function resolveBegin(begin, size) {
        return resolveIndex(begin, size, 0)
      }

      function resolveEnd(end, size) {
        return resolveIndex(end, size, size)
      }

      function resolveIndex(index, size, defaultIndex) {
        return index === undefined ? defaultIndex : index < 0 ? Math.max(0, size + index) : size === undefined ? index : Math.min(size, index)
      }

      function Iterable(value) {
        return isIterable(value) ? value : Seq(value)
      }

      createClass(KeyedIterable, Iterable);
      function KeyedIterable(value) {
        return isKeyed(value) ? value : KeyedSeq(value)
      }

      createClass(IndexedIterable, Iterable);
      function IndexedIterable(value) {
        return isIndexed(value) ? value : IndexedSeq(value)
      }

      createClass(SetIterable, Iterable);
      function SetIterable(value) {
        return isIterable(value) && !isAssociative(value) ? value : SetSeq(value)
      }

      function isIterable(maybeIterable) {
        return !!(maybeIterable && maybeIterable[IS_ITERABLE_SENTINEL])
      }

      function isKeyed(maybeKeyed) {
        return !!(maybeKeyed && maybeKeyed[IS_KEYED_SENTINEL])
      }

      function isIndexed(maybeIndexed) {
        return !!(maybeIndexed && maybeIndexed[IS_INDEXED_SENTINEL])
      }

      function isAssociative(maybeAssociative) {
        return isKeyed(maybeAssociative) || isIndexed(maybeAssociative)
      }

      function isOrdered(maybeOrdered) {
        return !!(maybeOrdered && maybeOrdered[IS_ORDERED_SENTINEL])
      }

      Iterable.isIterable = isIterable;
      Iterable.isKeyed = isKeyed;
      Iterable.isIndexed = isIndexed;
      Iterable.isAssociative = isAssociative;
      Iterable.isOrdered = isOrdered;
      Iterable.Keyed = KeyedIterable;
      Iterable.Indexed = IndexedIterable;
      Iterable.Set = SetIterable;
      var IS_ITERABLE_SENTINEL = "@@__IMMUTABLE_ITERABLE__@@";
      var IS_KEYED_SENTINEL = "@@__IMMUTABLE_KEYED__@@";
      var IS_INDEXED_SENTINEL = "@@__IMMUTABLE_INDEXED__@@";
      var IS_ORDERED_SENTINEL = "@@__IMMUTABLE_ORDERED__@@";
      var ITERATE_KEYS = 0;
      var ITERATE_VALUES = 1;
      var ITERATE_ENTRIES = 2;
      var REAL_ITERATOR_SYMBOL = typeof Symbol === "function" && Symbol.iterator;
      var FAUX_ITERATOR_SYMBOL = "@@iterator";
      var ITERATOR_SYMBOL = REAL_ITERATOR_SYMBOL || FAUX_ITERATOR_SYMBOL;

      function Iterator(next) {
        this.next = next
      }

      Iterator.prototype.toString = function () {
        return "[Iterator]"
      };
      Iterator.KEYS = ITERATE_KEYS;
      Iterator.VALUES = ITERATE_VALUES;
      Iterator.ENTRIES = ITERATE_ENTRIES;
      Iterator.prototype.inspect = Iterator.prototype.toSource = function () {
        return this.toString()
      };
      Iterator.prototype[ITERATOR_SYMBOL] = function () {
        return this
      };
      function iteratorValue(type, k, v, iteratorResult) {
        var value = type === 0 ? k : type === 1 ? v : [k, v];
        iteratorResult ? iteratorResult.value = value : iteratorResult = {value: value, done: false};
        return iteratorResult
      }

      function iteratorDone() {
        return {value: undefined, done: true}
      }

      function hasIterator(maybeIterable) {
        return !!getIteratorFn(maybeIterable)
      }

      function isIterator(maybeIterator) {
        return maybeIterator && typeof maybeIterator.next === "function"
      }

      function getIterator(iterable) {
        var iteratorFn = getIteratorFn(iterable);
        return iteratorFn && iteratorFn.call(iterable)
      }

      function getIteratorFn(iterable) {
        var iteratorFn = iterable && (REAL_ITERATOR_SYMBOL && iterable[REAL_ITERATOR_SYMBOL] || iterable[FAUX_ITERATOR_SYMBOL]);
        if (typeof iteratorFn === "function") {
          return iteratorFn
        }
      }

      function isArrayLike(value) {
        return value && typeof value.length === "number"
      }

      createClass(Seq, Iterable);
      function Seq(value) {
        return value === null || value === undefined ? emptySequence() : isIterable(value) ? value.toSeq() : seqFromValue(value)
      }

      Seq.of = function () {
        return Seq(arguments)
      };
      Seq.prototype.toSeq = function () {
        return this
      };
      Seq.prototype.toString = function () {
        return this.__toString("Seq {", "}")
      };
      Seq.prototype.cacheResult = function () {
        if (!this._cache && this.__iterateUncached) {
          this._cache = this.entrySeq().toArray();
          this.size = this._cache.length
        }
        return this
      };
      Seq.prototype.__iterate = function (fn, reverse) {
        return seqIterate(this, fn, reverse, true)
      };
      Seq.prototype.__iterator = function (type, reverse) {
        return seqIterator(this, type, reverse, true)
      };
      createClass(KeyedSeq, Seq);
      function KeyedSeq(value) {
        return value === null || value === undefined ? emptySequence().toKeyedSeq() : isIterable(value) ? isKeyed(value) ? value.toSeq() : value.fromEntrySeq() : keyedSeqFromValue(value)
      }

      KeyedSeq.of = function () {
        return KeyedSeq(arguments)
      };
      KeyedSeq.prototype.toKeyedSeq = function () {
        return this
      };
      KeyedSeq.prototype.toSeq = function () {
        return this
      };
      createClass(IndexedSeq, Seq);
      function IndexedSeq(value) {
        return value === null || value === undefined ? emptySequence() : !isIterable(value) ? indexedSeqFromValue(value) : isKeyed(value) ? value.entrySeq() : value.toIndexedSeq()
      }

      IndexedSeq.of = function () {
        return IndexedSeq(arguments)
      };
      IndexedSeq.prototype.toIndexedSeq = function () {
        return this
      };
      IndexedSeq.prototype.toString = function () {
        return this.__toString("Seq [", "]")
      };
      IndexedSeq.prototype.__iterate = function (fn, reverse) {
        return seqIterate(this, fn, reverse, false)
      };
      IndexedSeq.prototype.__iterator = function (type, reverse) {
        return seqIterator(this, type, reverse, false)
      };
      createClass(SetSeq, Seq);
      function SetSeq(value) {
        return (value === null || value === undefined ? emptySequence() : !isIterable(value) ? indexedSeqFromValue(value) : isKeyed(value) ? value.entrySeq() : value).toSetSeq()
      }

      SetSeq.of = function () {
        return SetSeq(arguments)
      };
      SetSeq.prototype.toSetSeq = function () {
        return this
      };
      Seq.isSeq = isSeq;
      Seq.Keyed = KeyedSeq;
      Seq.Set = SetSeq;
      Seq.Indexed = IndexedSeq;
      var IS_SEQ_SENTINEL = "@@__IMMUTABLE_SEQ__@@";
      Seq.prototype[IS_SEQ_SENTINEL] = true;
      createClass(ArraySeq, IndexedSeq);
      function ArraySeq(array) {
        this._array = array;
        this.size = array.length
      }

      ArraySeq.prototype.get = function (index, notSetValue) {
        return this.has(index) ? this._array[wrapIndex(this, index)] : notSetValue
      };
      ArraySeq.prototype.__iterate = function (fn, reverse) {
        var array = this._array;
        var maxIndex = array.length - 1;
        for (var ii = 0; ii <= maxIndex; ii++) {
          if (fn(array[reverse ? maxIndex - ii : ii], ii, this) === false) {
            return ii + 1
          }
        }
        return ii
      };
      ArraySeq.prototype.__iterator = function (type, reverse) {
        var array = this._array;
        var maxIndex = array.length - 1;
        var ii = 0;
        return new Iterator(function () {
          return ii > maxIndex ? iteratorDone() : iteratorValue(type, ii, array[reverse ? maxIndex - ii++ : ii++])
        })
      };
      createClass(ObjectSeq, KeyedSeq);
      function ObjectSeq(object) {
        var keys = Object.keys(object);
        this._object = object;
        this._keys = keys;
        this.size = keys.length
      }

      ObjectSeq.prototype.get = function (key, notSetValue) {
        if (notSetValue !== undefined && !this.has(key)) {
          return notSetValue
        }
        return this._object[key]
      };
      ObjectSeq.prototype.has = function (key) {
        return this._object.hasOwnProperty(key)
      };
      ObjectSeq.prototype.__iterate = function (fn, reverse) {
        var object = this._object;
        var keys = this._keys;
        var maxIndex = keys.length - 1;
        for (var ii = 0; ii <= maxIndex; ii++) {
          var key = keys[reverse ? maxIndex - ii : ii];
          if (fn(object[key], key, this) === false) {
            return ii + 1
          }
        }
        return ii
      };
      ObjectSeq.prototype.__iterator = function (type, reverse) {
        var object = this._object;
        var keys = this._keys;
        var maxIndex = keys.length - 1;
        var ii = 0;
        return new Iterator(function () {
          var key = keys[reverse ? maxIndex - ii : ii];
          return ii++ > maxIndex ? iteratorDone() : iteratorValue(type, key, object[key])
        })
      };
      ObjectSeq.prototype[IS_ORDERED_SENTINEL] = true;
      createClass(IterableSeq, IndexedSeq);
      function IterableSeq(iterable) {
        this._iterable = iterable;
        this.size = iterable.length || iterable.size
      }

      IterableSeq.prototype.__iterateUncached = function (fn, reverse) {
        if (reverse) {
          return this.cacheResult().__iterate(fn, reverse)
        }
        var iterable = this._iterable;
        var iterator = getIterator(iterable);
        var iterations = 0;
        if (isIterator(iterator)) {
          var step;
          while (!(step = iterator.next()).done) {
            if (fn(step.value, iterations++, this) === false) {
              break
            }
          }
        }
        return iterations
      };
      IterableSeq.prototype.__iteratorUncached = function (type, reverse) {
        if (reverse) {
          return this.cacheResult().__iterator(type, reverse)
        }
        var iterable = this._iterable;
        var iterator = getIterator(iterable);
        if (!isIterator(iterator)) {
          return new Iterator(iteratorDone)
        }
        var iterations = 0;
        return new Iterator(function () {
          var step = iterator.next();
          return step.done ? step : iteratorValue(type, iterations++, step.value)
        })
      };
      createClass(IteratorSeq, IndexedSeq);
      function IteratorSeq(iterator) {
        this._iterator = iterator;
        this._iteratorCache = []
      }

      IteratorSeq.prototype.__iterateUncached = function (fn, reverse) {
        if (reverse) {
          return this.cacheResult().__iterate(fn, reverse)
        }
        var iterator = this._iterator;
        var cache = this._iteratorCache;
        var iterations = 0;
        while (iterations < cache.length) {
          if (fn(cache[iterations], iterations++, this) === false) {
            return iterations
          }
        }
        var step;
        while (!(step = iterator.next()).done) {
          var val = step.value;
          cache[iterations] = val;
          if (fn(val, iterations++, this) === false) {
            break
          }
        }
        return iterations
      };
      IteratorSeq.prototype.__iteratorUncached = function (type, reverse) {
        if (reverse) {
          return this.cacheResult().__iterator(type, reverse)
        }
        var iterator = this._iterator;
        var cache = this._iteratorCache;
        var iterations = 0;
        return new Iterator(function () {
          if (iterations >= cache.length) {
            var step = iterator.next();
            if (step.done) {
              return step
            }
            cache[iterations] = step.value
          }
          return iteratorValue(type, iterations, cache[iterations++])
        })
      };
      function isSeq(maybeSeq) {
        return !!(maybeSeq && maybeSeq[IS_SEQ_SENTINEL])
      }

      var EMPTY_SEQ;

      function emptySequence() {
        return EMPTY_SEQ || (EMPTY_SEQ = new ArraySeq([]))
      }

      function keyedSeqFromValue(value) {
        var seq = Array.isArray(value) ? new ArraySeq(value).fromEntrySeq() : isIterator(value) ? new IteratorSeq(value).fromEntrySeq() : hasIterator(value) ? new IterableSeq(value).fromEntrySeq() : typeof value === "object" ? new ObjectSeq(value) : undefined;
        if (!seq) {
          throw new TypeError("Expected Array or iterable object of [k, v] entries, " + "or keyed object: " + value)
        }
        return seq
      }

      function indexedSeqFromValue(value) {
        var seq = maybeIndexedSeqFromValue(value);
        if (!seq) {
          throw new TypeError("Expected Array or iterable object of values: " + value)
        }
        return seq
      }

      function seqFromValue(value) {
        var seq = maybeIndexedSeqFromValue(value) || typeof value === "object" && new ObjectSeq(value);
        if (!seq) {
          throw new TypeError("Expected Array or iterable object of values, or keyed object: " + value)
        }
        return seq
      }

      function maybeIndexedSeqFromValue(value) {
        return isArrayLike(value) ? new ArraySeq(value) : isIterator(value) ? new IteratorSeq(value) : hasIterator(value) ? new IterableSeq(value) : undefined
      }

      function seqIterate(seq, fn, reverse, useKeys) {
        var cache = seq._cache;
        if (cache) {
          var maxIndex = cache.length - 1;
          for (var ii = 0; ii <= maxIndex; ii++) {
            var entry = cache[reverse ? maxIndex - ii : ii];
            if (fn(entry[1], useKeys ? entry[0] : ii, seq) === false) {
              return ii + 1
            }
          }
          return ii
        }
        return seq.__iterateUncached(fn, reverse)
      }

      function seqIterator(seq, type, reverse, useKeys) {
        var cache = seq._cache;
        if (cache) {
          var maxIndex = cache.length - 1;
          var ii = 0;
          return new Iterator(function () {
            var entry = cache[reverse ? maxIndex - ii : ii];
            return ii++ > maxIndex ? iteratorDone() : iteratorValue(type, useKeys ? entry[0] : ii - 1, entry[1])
          })
        }
        return seq.__iteratorUncached(type, reverse)
      }

      createClass(Collection, Iterable);
      function Collection() {
        throw TypeError("Abstract")
      }

      createClass(KeyedCollection, Collection);
      function KeyedCollection() {
      }

      createClass(IndexedCollection, Collection);
      function IndexedCollection() {
      }

      createClass(SetCollection, Collection);
      function SetCollection() {
      }

      Collection.Keyed = KeyedCollection;
      Collection.Indexed = IndexedCollection;
      Collection.Set = SetCollection;
      function is(valueA, valueB) {
        if (valueA === valueB || valueA !== valueA && valueB !== valueB) {
          return true
        }
        if (!valueA || !valueB) {
          return false
        }
        if (typeof valueA.valueOf === "function" && typeof valueB.valueOf === "function") {
          valueA = valueA.valueOf();
          valueB = valueB.valueOf()
        }
        return typeof valueA.equals === "function" && typeof valueB.equals === "function" ? valueA.equals(valueB) : valueA === valueB || valueA !== valueA && valueB !== valueB
      }

      function fromJS(json, converter) {
        return converter ? fromJSWith(converter, json, "", {"": json}) : fromJSDefault(json)
      }

      function fromJSWith(converter, json, key, parentJSON) {
        if (Array.isArray(json)) {
          return converter.call(parentJSON, key, IndexedSeq(json).map(function (v, k) {
            return fromJSWith(converter, v, k, json)
          }))
        }
        if (isPlainObj(json)) {
          return converter.call(parentJSON, key, KeyedSeq(json).map(function (v, k) {
            return fromJSWith(converter, v, k, json)
          }))
        }
        return json
      }

      function fromJSDefault(json) {
        if (Array.isArray(json)) {
          return IndexedSeq(json).map(fromJSDefault).toList()
        }
        if (isPlainObj(json)) {
          return KeyedSeq(json).map(fromJSDefault).toMap()
        }
        return json
      }

      function isPlainObj(value) {
        return value && value.constructor === Object
      }

      var Math__imul = typeof Math.imul === "function" && Math.imul(4294967295, 2) === -2 ? Math.imul : function Math__imul(a, b) {
        a = a | 0;
        b = b | 0;
        var c = a & 65535;
        var d = b & 65535;
        return c * d + ((a >>> 16) * d + c * (b >>> 16) << 16 >>> 0) | 0
      };

      function smi(i32) {
        return i32 >>> 1 & 1073741824 | i32 & 3221225471
      }

      function hash(o) {
        if (o === false || o === null || o === undefined) {
          return 0
        }
        if (typeof o.valueOf === "function") {
          o = o.valueOf();
          if (o === false || o === null || o === undefined) {
            return 0
          }
        }
        if (o === true) {
          return 1
        }
        var type = typeof o;
        if (type === "number") {
          var h = o | 0;
          if (h !== o) {
            h ^= o * 4294967295
          }
          while (o > 4294967295) {
            o /= 4294967295;
            h ^= o
          }
          return smi(h)
        }
        if (type === "string") {
          return o.length > STRING_HASH_CACHE_MIN_STRLEN ? cachedHashString(o) : hashString(o)
        }
        if (typeof o.hashCode === "function") {
          return o.hashCode()
        }
        return hashJSObj(o)
      }

      function cachedHashString(string) {
        var hash = stringHashCache[string];
        if (hash === undefined) {
          hash = hashString(string);
          if (STRING_HASH_CACHE_SIZE === STRING_HASH_CACHE_MAX_SIZE) {
            STRING_HASH_CACHE_SIZE = 0;
            stringHashCache = {}
          }
          STRING_HASH_CACHE_SIZE++;
          stringHashCache[string] = hash
        }
        return hash
      }

      function hashString(string) {
        var hash = 0;
        for (var ii = 0; ii < string.length; ii++) {
          hash = 31 * hash + string.charCodeAt(ii) | 0
        }
        return smi(hash)
      }

      function hashJSObj(obj) {
        var hash = weakMap && weakMap.get(obj);
        if (hash)return hash;
        hash = obj[UID_HASH_KEY];
        if (hash)return hash;
        if (!canDefineProperty) {
          hash = obj.propertyIsEnumerable && obj.propertyIsEnumerable[UID_HASH_KEY];
          if (hash)return hash;
          hash = getIENodeHash(obj);
          if (hash)return hash
        }
        if (Object.isExtensible && !Object.isExtensible(obj)) {
          throw new Error("Non-extensible objects are not allowed as keys.")
        }
        hash = ++objHashUID;
        if (objHashUID & 1073741824) {
          objHashUID = 0
        }
        if (weakMap) {
          weakMap.set(obj, hash)
        } else if (canDefineProperty) {
          Object.defineProperty(obj, UID_HASH_KEY, {
            enumerable: false,
            configurable: false,
            writable: false,
            value: hash
          })
        } else if (obj.propertyIsEnumerable && obj.propertyIsEnumerable === obj.constructor.prototype.propertyIsEnumerable) {
          obj.propertyIsEnumerable = function () {
            return this.constructor.prototype.propertyIsEnumerable.apply(this, arguments)
          };
          obj.propertyIsEnumerable[UID_HASH_KEY] = hash
        } else if (obj.nodeType) {
          obj[UID_HASH_KEY] = hash
        } else {
          throw new Error("Unable to set a non-enumerable property on object.")
        }
        return hash
      }

      var canDefineProperty = function () {
        try {
          Object.defineProperty({}, "x", {});
          return true
        } catch (e) {
          return false
        }
      }();

      function getIENodeHash(node) {
        if (node && node.nodeType > 0) {
          switch (node.nodeType) {
            case 1:
              return node.uniqueID;
            case 9:
              return node.documentElement && node.documentElement.uniqueID
          }
        }
      }

      var weakMap = typeof WeakMap === "function" && new WeakMap;
      var objHashUID = 0;
      var UID_HASH_KEY = "__immutablehash__";
      if (typeof Symbol === "function") {
        UID_HASH_KEY = Symbol(UID_HASH_KEY)
      }
      var STRING_HASH_CACHE_MIN_STRLEN = 16;
      var STRING_HASH_CACHE_MAX_SIZE = 255;
      var STRING_HASH_CACHE_SIZE = 0;
      var stringHashCache = {};

      function invariant(condition, error) {
        if (!condition)throw new Error(error)
      }

      function assertNotInfinite(size) {
        invariant(size !== Infinity, "Cannot perform this action with an infinite size.")
      }

      createClass(ToKeyedSequence, KeyedSeq);
      function ToKeyedSequence(indexed, useKeys) {
        this._iter = indexed;
        this._useKeys = useKeys;
        this.size = indexed.size
      }

      ToKeyedSequence.prototype.get = function (key, notSetValue) {
        return this._iter.get(key, notSetValue)
      };
      ToKeyedSequence.prototype.has = function (key) {
        return this._iter.has(key)
      };
      ToKeyedSequence.prototype.valueSeq = function () {
        return this._iter.valueSeq()
      };
      ToKeyedSequence.prototype.reverse = function () {
        var this$0 = this;
        var reversedSequence = reverseFactory(this, true);
        if (!this._useKeys) {
          reversedSequence.valueSeq = function () {
            return this$0._iter.toSeq().reverse()
          }
        }
        return reversedSequence
      };
      ToKeyedSequence.prototype.map = function (mapper, context) {
        var this$0 = this;
        var mappedSequence = mapFactory(this, mapper, context);
        if (!this._useKeys) {
          mappedSequence.valueSeq = function () {
            return this$0._iter.toSeq().map(mapper, context)
          }
        }
        return mappedSequence
      };
      ToKeyedSequence.prototype.__iterate = function (fn, reverse) {
        var this$0 = this;
        var ii;
        return this._iter.__iterate(this._useKeys ? function (v, k) {
          return fn(v, k, this$0)
        } : (ii = reverse ? resolveSize(this) : 0, function (v) {
          return fn(v, reverse ? --ii : ii++, this$0)
        }), reverse)
      };
      ToKeyedSequence.prototype.__iterator = function (type, reverse) {
        if (this._useKeys) {
          return this._iter.__iterator(type, reverse)
        }
        var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);
        var ii = reverse ? resolveSize(this) : 0;
        return new Iterator(function () {
          var step = iterator.next();
          return step.done ? step : iteratorValue(type, reverse ? --ii : ii++, step.value, step)
        })
      };
      ToKeyedSequence.prototype[IS_ORDERED_SENTINEL] = true;
      createClass(ToIndexedSequence, IndexedSeq);
      function ToIndexedSequence(iter) {
        this._iter = iter;
        this.size = iter.size
      }

      ToIndexedSequence.prototype.contains = function (value) {
        return this._iter.contains(value)
      };
      ToIndexedSequence.prototype.__iterate = function (fn, reverse) {
        var this$0 = this;
        var iterations = 0;
        return this._iter.__iterate(function (v) {
          return fn(v, iterations++, this$0)
        }, reverse)
      };
      ToIndexedSequence.prototype.__iterator = function (type, reverse) {
        var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);
        var iterations = 0;
        return new Iterator(function () {
          var step = iterator.next();
          return step.done ? step : iteratorValue(type, iterations++, step.value, step)
        })
      };
      createClass(ToSetSequence, SetSeq);
      function ToSetSequence(iter) {
        this._iter = iter;
        this.size = iter.size
      }

      ToSetSequence.prototype.has = function (key) {
        return this._iter.contains(key)
      };
      ToSetSequence.prototype.__iterate = function (fn, reverse) {
        var this$0 = this;
        return this._iter.__iterate(function (v) {
          return fn(v, v, this$0)
        }, reverse)
      };
      ToSetSequence.prototype.__iterator = function (type, reverse) {
        var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);
        return new Iterator(function () {
          var step = iterator.next();
          return step.done ? step : iteratorValue(type, step.value, step.value, step)
        })
      };
      createClass(FromEntriesSequence, KeyedSeq);
      function FromEntriesSequence(entries) {
        this._iter = entries;
        this.size = entries.size
      }

      FromEntriesSequence.prototype.entrySeq = function () {
        return this._iter.toSeq()
      };
      FromEntriesSequence.prototype.__iterate = function (fn, reverse) {
        var this$0 = this;
        return this._iter.__iterate(function (entry) {
          if (entry) {
            validateEntry(entry);
            return fn(entry[1], entry[0], this$0)
          }
        }, reverse)
      };
      FromEntriesSequence.prototype.__iterator = function (type, reverse) {
        var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);
        return new Iterator(function () {
          while (true) {
            var step = iterator.next();
            if (step.done) {
              return step
            }
            var entry = step.value;
            if (entry) {
              validateEntry(entry);
              return type === ITERATE_ENTRIES ? step : iteratorValue(type, entry[0], entry[1], step)
            }
          }
        })
      };
      ToIndexedSequence.prototype.cacheResult = ToKeyedSequence.prototype.cacheResult = ToSetSequence.prototype.cacheResult = FromEntriesSequence.prototype.cacheResult = cacheResultThrough;
      function flipFactory(iterable) {
        var flipSequence = makeSequence(iterable);
        flipSequence._iter = iterable;
        flipSequence.size = iterable.size;
        flipSequence.flip = function () {
          return iterable
        };
        flipSequence.reverse = function () {
          var reversedSequence = iterable.reverse.apply(this);
          reversedSequence.flip = function () {
            return iterable.reverse()
          };
          return reversedSequence
        };
        flipSequence.has = function (key) {
          return iterable.contains(key)
        };
        flipSequence.contains = function (key) {
          return iterable.has(key)
        };
        flipSequence.cacheResult = cacheResultThrough;
        flipSequence.__iterateUncached = function (fn, reverse) {
          var this$0 = this;
          return iterable.__iterate(function (v, k) {
            return fn(k, v, this$0) !== false
          }, reverse)
        };
        flipSequence.__iteratorUncached = function (type, reverse) {
          if (type === ITERATE_ENTRIES) {
            var iterator = iterable.__iterator(type, reverse);
            return new Iterator(function () {
              var step = iterator.next();
              if (!step.done) {
                var k = step.value[0];
                step.value[0] = step.value[1];
                step.value[1] = k
              }
              return step
            })
          }
          return iterable.__iterator(type === ITERATE_VALUES ? ITERATE_KEYS : ITERATE_VALUES, reverse)
        };
        return flipSequence
      }

      function mapFactory(iterable, mapper, context) {
        var mappedSequence = makeSequence(iterable);
        mappedSequence.size = iterable.size;
        mappedSequence.has = function (key) {
          return iterable.has(key)
        };
        mappedSequence.get = function (key, notSetValue) {
          var v = iterable.get(key, NOT_SET);
          return v === NOT_SET ? notSetValue : mapper.call(context, v, key, iterable)
        };
        mappedSequence.__iterateUncached = function (fn, reverse) {
          var this$0 = this;
          return iterable.__iterate(function (v, k, c) {
            return fn(mapper.call(context, v, k, c), k, this$0) !== false
          }, reverse)
        };
        mappedSequence.__iteratorUncached = function (type, reverse) {
          var iterator = iterable.__iterator(ITERATE_ENTRIES, reverse);
          return new Iterator(function () {
            var step = iterator.next();
            if (step.done) {
              return step
            }
            var entry = step.value;
            var key = entry[0];
            return iteratorValue(type, key, mapper.call(context, entry[1], key, iterable), step)
          })
        };
        return mappedSequence
      }

      function reverseFactory(iterable, useKeys) {
        var reversedSequence = makeSequence(iterable);
        reversedSequence._iter = iterable;
        reversedSequence.size = iterable.size;
        reversedSequence.reverse = function () {
          return iterable
        };
        if (iterable.flip) {
          reversedSequence.flip = function () {
            var flipSequence = flipFactory(iterable);
            flipSequence.reverse = function () {
              return iterable.flip()
            };
            return flipSequence
          }
        }
        reversedSequence.get = function (key, notSetValue) {
          return iterable.get(useKeys ? key : -1 - key, notSetValue)
        };
        reversedSequence.has = function (key) {
          return iterable.has(useKeys ? key : -1 - key)
        };
        reversedSequence.contains = function (value) {
          return iterable.contains(value)
        };
        reversedSequence.cacheResult = cacheResultThrough;
        reversedSequence.__iterate = function (fn, reverse) {
          var this$0 = this;
          return iterable.__iterate(function (v, k) {
            return fn(v, k, this$0)
          }, !reverse)
        };
        reversedSequence.__iterator = function (type, reverse) {
          return iterable.__iterator(type, !reverse)
        };
        return reversedSequence
      }

      function filterFactory(iterable, predicate, context, useKeys) {
        var filterSequence = makeSequence(iterable);
        if (useKeys) {
          filterSequence.has = function (key) {
            var v = iterable.get(key, NOT_SET);
            return v !== NOT_SET && !!predicate.call(context, v, key, iterable)
          };
          filterSequence.get = function (key, notSetValue) {
            var v = iterable.get(key, NOT_SET);
            return v !== NOT_SET && predicate.call(context, v, key, iterable) ? v : notSetValue
          }
        }
        filterSequence.__iterateUncached = function (fn, reverse) {
          var this$0 = this;
          var iterations = 0;
          iterable.__iterate(function (v, k, c) {
            if (predicate.call(context, v, k, c)) {
              iterations++;
              return fn(v, useKeys ? k : iterations - 1, this$0)
            }
          }, reverse);
          return iterations
        };
        filterSequence.__iteratorUncached = function (type, reverse) {
          var iterator = iterable.__iterator(ITERATE_ENTRIES, reverse);
          var iterations = 0;
          return new Iterator(function () {
            while (true) {
              var step = iterator.next();
              if (step.done) {
                return step
              }
              var entry = step.value;
              var key = entry[0];
              var value = entry[1];
              if (predicate.call(context, value, key, iterable)) {
                return iteratorValue(type, useKeys ? key : iterations++, value, step)
              }
            }
          })
        };
        return filterSequence
      }

      function countByFactory(iterable, grouper, context) {
        var groups = Map().asMutable();
        iterable.__iterate(function (v, k) {
          groups.update(grouper.call(context, v, k, iterable), 0, function (a) {
            return a + 1
          })
        });
        return groups.asImmutable()
      }

      function groupByFactory(iterable, grouper, context) {
        var isKeyedIter = isKeyed(iterable);
        var groups = (isOrdered(iterable) ? OrderedMap() : Map()).asMutable();
        iterable.__iterate(function (v, k) {
          groups.update(grouper.call(context, v, k, iterable), function (a) {
            return a = a || [], a.push(isKeyedIter ? [k, v] : v), a
          })
        });
        var coerce = iterableClass(iterable);
        return groups.map(function (arr) {
          return reify(iterable, coerce(arr))
        })
      }

      function sliceFactory(iterable, begin, end, useKeys) {
        var originalSize = iterable.size;
        if (wholeSlice(begin, end, originalSize)) {
          return iterable
        }
        var resolvedBegin = resolveBegin(begin, originalSize);
        var resolvedEnd = resolveEnd(end, originalSize);
        if (resolvedBegin !== resolvedBegin || resolvedEnd !== resolvedEnd) {
          return sliceFactory(iterable.toSeq().cacheResult(), begin, end, useKeys)
        }
        var sliceSize = resolvedEnd - resolvedBegin;
        if (sliceSize < 0) {
          sliceSize = 0
        }
        var sliceSeq = makeSequence(iterable);
        sliceSeq.size = sliceSize === 0 ? sliceSize : iterable.size && sliceSize || undefined;
        if (!useKeys && isSeq(iterable) && sliceSize >= 0) {
          sliceSeq.get = function (index, notSetValue) {
            index = wrapIndex(this, index);
            return index >= 0 && index < sliceSize ? iterable.get(index + resolvedBegin, notSetValue) : notSetValue
          }
        }
        sliceSeq.__iterateUncached = function (fn, reverse) {
          var this$0 = this;
          if (sliceSize === 0) {
            return 0
          }
          if (reverse) {
            return this.cacheResult().__iterate(fn, reverse)
          }
          var skipped = 0;
          var isSkipping = true;
          var iterations = 0;
          iterable.__iterate(function (v, k) {
            if (!(isSkipping && (isSkipping = skipped++ < resolvedBegin))) {
              iterations++;
              return fn(v, useKeys ? k : iterations - 1, this$0) !== false && iterations !== sliceSize
            }
          });
          return iterations
        };
        sliceSeq.__iteratorUncached = function (type, reverse) {
          if (sliceSize && reverse) {
            return this.cacheResult().__iterator(type, reverse)
          }
          var iterator = sliceSize && iterable.__iterator(type, reverse);
          var skipped = 0;
          var iterations = 0;
          return new Iterator(function () {
            while (skipped++ !== resolvedBegin) {
              iterator.next()
            }
            if (++iterations > sliceSize) {
              return iteratorDone()
            }
            var step = iterator.next();
            if (useKeys || type === ITERATE_VALUES) {
              return step
            } else if (type === ITERATE_KEYS) {
              return iteratorValue(type, iterations - 1, undefined, step)
            } else {
              return iteratorValue(type, iterations - 1, step.value[1], step)
            }
          })
        };
        return sliceSeq
      }

      function takeWhileFactory(iterable, predicate, context) {
        var takeSequence = makeSequence(iterable);
        takeSequence.__iterateUncached = function (fn, reverse) {
          var this$0 = this;
          if (reverse) {
            return this.cacheResult().__iterate(fn, reverse)
          }
          var iterations = 0;
          iterable.__iterate(function (v, k, c) {
            return predicate.call(context, v, k, c) && ++iterations && fn(v, k, this$0)
          });
          return iterations
        };
        takeSequence.__iteratorUncached = function (type, reverse) {
          var this$0 = this;
          if (reverse) {
            return this.cacheResult().__iterator(type, reverse)
          }
          var iterator = iterable.__iterator(ITERATE_ENTRIES, reverse);
          var iterating = true;
          return new Iterator(function () {
            if (!iterating) {
              return iteratorDone()
            }
            var step = iterator.next();
            if (step.done) {
              return step
            }
            var entry = step.value;
            var k = entry[0];
            var v = entry[1];
            if (!predicate.call(context, v, k, this$0)) {
              iterating = false;
              return iteratorDone()
            }
            return type === ITERATE_ENTRIES ? step : iteratorValue(type, k, v, step)
          })
        };
        return takeSequence
      }

      function skipWhileFactory(iterable, predicate, context, useKeys) {
        var skipSequence = makeSequence(iterable);
        skipSequence.__iterateUncached = function (fn, reverse) {
          var this$0 = this;
          if (reverse) {
            return this.cacheResult().__iterate(fn, reverse)
          }
          var isSkipping = true;
          var iterations = 0;
          iterable.__iterate(function (v, k, c) {
            if (!(isSkipping && (isSkipping = predicate.call(context, v, k, c)))) {
              iterations++;
              return fn(v, useKeys ? k : iterations - 1, this$0)
            }
          });
          return iterations
        };
        skipSequence.__iteratorUncached = function (type, reverse) {
          var this$0 = this;
          if (reverse) {
            return this.cacheResult().__iterator(type, reverse)
          }
          var iterator = iterable.__iterator(ITERATE_ENTRIES, reverse);
          var skipping = true;
          var iterations = 0;
          return new Iterator(function () {
            var step, k, v;
            do {
              step = iterator.next();
              if (step.done) {
                if (useKeys || type === ITERATE_VALUES) {
                  return step
                } else if (type === ITERATE_KEYS) {
                  return iteratorValue(type, iterations++, undefined, step)
                } else {
                  return iteratorValue(type, iterations++, step.value[1], step)
                }
              }
              var entry = step.value;
              k = entry[0];
              v = entry[1];
              skipping && (skipping = predicate.call(context, v, k, this$0))
            } while (skipping);
            return type === ITERATE_ENTRIES ? step : iteratorValue(type, k, v, step)
          })
        };
        return skipSequence
      }

      function concatFactory(iterable, values) {
        var isKeyedIterable = isKeyed(iterable);
        var iters = [iterable].concat(values).map(function (v) {
          if (!isIterable(v)) {
            v = isKeyedIterable ? keyedSeqFromValue(v) : indexedSeqFromValue(Array.isArray(v) ? v : [v])
          } else if (isKeyedIterable) {
            v = KeyedIterable(v)
          }
          return v
        }).filter(function (v) {
          return v.size !== 0
        });
        if (iters.length === 0) {
          return iterable
        }
        if (iters.length === 1) {
          var singleton = iters[0];
          if (singleton === iterable || isKeyedIterable && isKeyed(singleton) || isIndexed(iterable) && isIndexed(singleton)) {
            return singleton
          }
        }
        var concatSeq = new ArraySeq(iters);
        if (isKeyedIterable) {
          concatSeq = concatSeq.toKeyedSeq()
        } else if (!isIndexed(iterable)) {
          concatSeq = concatSeq.toSetSeq()
        }
        concatSeq = concatSeq.flatten(true);
        concatSeq.size = iters.reduce(function (sum, seq) {
          if (sum !== undefined) {
            var size = seq.size;
            if (size !== undefined) {
              return sum + size
            }
          }
        }, 0);
        return concatSeq
      }

      function flattenFactory(iterable, depth, useKeys) {
        var flatSequence = makeSequence(iterable);
        flatSequence.__iterateUncached = function (fn, reverse) {
          var iterations = 0;
          var stopped = false;

          function flatDeep(iter, currentDepth) {
            var this$0 = this;
            iter.__iterate(function (v, k) {
              if ((!depth || currentDepth < depth) && isIterable(v)) {
                flatDeep(v, currentDepth + 1)
              } else if (fn(v, useKeys ? k : iterations++, this$0) === false) {
                stopped = true
              }
              return !stopped
            }, reverse)
          }

          flatDeep(iterable, 0);
          return iterations
        };
        flatSequence.__iteratorUncached = function (type, reverse) {
          var iterator = iterable.__iterator(type, reverse);
          var stack = [];
          var iterations = 0;
          return new Iterator(function () {
            while (iterator) {
              var step = iterator.next();
              if (step.done !== false) {
                iterator = stack.pop();
                continue
              }
              var v = step.value;
              if (type === ITERATE_ENTRIES) {
                v = v[1]
              }
              if ((!depth || stack.length < depth) && isIterable(v)) {
                stack.push(iterator);
                iterator = v.__iterator(type, reverse)
              } else {
                return useKeys ? step : iteratorValue(type, iterations++, v, step)
              }
            }
            return iteratorDone()
          })
        };
        return flatSequence
      }

      function flatMapFactory(iterable, mapper, context) {
        var coerce = iterableClass(iterable);
        return iterable.toSeq().map(function (v, k) {
          return coerce(mapper.call(context, v, k, iterable))
        }).flatten(true)
      }

      function interposeFactory(iterable, separator) {
        var interposedSequence = makeSequence(iterable);
        interposedSequence.size = iterable.size && iterable.size * 2 - 1;
        interposedSequence.__iterateUncached = function (fn, reverse) {
          var this$0 = this;
          var iterations = 0;
          iterable.__iterate(function (v, k) {
            return (!iterations || fn(separator, iterations++, this$0) !== false) && fn(v, iterations++, this$0) !== false
          }, reverse);
          return iterations
        };
        interposedSequence.__iteratorUncached = function (type, reverse) {
          var iterator = iterable.__iterator(ITERATE_VALUES, reverse);
          var iterations = 0;
          var step;
          return new Iterator(function () {
            if (!step || iterations % 2) {
              step = iterator.next();
              if (step.done) {
                return step
              }
            }
            return iterations % 2 ? iteratorValue(type, iterations++, separator) : iteratorValue(type, iterations++, step.value, step)
          })
        };
        return interposedSequence
      }

      function sortFactory(iterable, comparator, mapper) {
        if (!comparator) {
          comparator = defaultComparator
        }
        var isKeyedIterable = isKeyed(iterable);
        var index = 0;
        var entries = iterable.toSeq().map(function (v, k) {
          return [k, v, index++, mapper ? mapper(v, k, iterable) : v]
        }).toArray();
        entries.sort(function (a, b) {
          return comparator(a[3], b[3]) || a[2] - b[2]
        }).forEach(isKeyedIterable ? function (v, i) {
          entries[i].length = 2
        } : function (v, i) {
          entries[i] = v[1]
        });
        return isKeyedIterable ? KeyedSeq(entries) : isIndexed(iterable) ? IndexedSeq(entries) : SetSeq(entries)
      }

      function maxFactory(iterable, comparator, mapper) {
        if (!comparator) {
          comparator = defaultComparator
        }
        if (mapper) {
          var entry = iterable.toSeq().map(function (v, k) {
            return [v, mapper(v, k, iterable)]
          }).reduce(function (a, b) {
            return maxCompare(comparator, a[1], b[1]) ? b : a
          });
          return entry && entry[0]
        } else {
          return iterable.reduce(function (a, b) {
            return maxCompare(comparator, a, b) ? b : a
          })
        }
      }

      function maxCompare(comparator, a, b) {
        var comp = comparator(b, a);
        return comp === 0 && b !== a && (b === undefined || b === null || b !== b) || comp > 0
      }

      function zipWithFactory(keyIter, zipper, iters) {
        var zipSequence = makeSequence(keyIter);
        zipSequence.size = new ArraySeq(iters).map(function (i) {
          return i.size
        }).min();
        zipSequence.__iterate = function (fn, reverse) {
          var iterator = this.__iterator(ITERATE_VALUES, reverse);
          var step;
          var iterations = 0;
          while (!(step = iterator.next()).done) {
            if (fn(step.value, iterations++, this) === false) {
              break
            }
          }
          return iterations
        };
        zipSequence.__iteratorUncached = function (type, reverse) {
          var iterators = iters.map(function (i) {
            return i = Iterable(i), getIterator(reverse ? i.reverse() : i)
          });
          var iterations = 0;
          var isDone = false;
          return new Iterator(function () {
            var steps;
            if (!isDone) {
              steps = iterators.map(function (i) {
                return i.next()
              });
              isDone = steps.some(function (s) {
                return s.done
              })
            }
            if (isDone) {
              return iteratorDone()
            }
            return iteratorValue(type, iterations++, zipper.apply(null, steps.map(function (s) {
              return s.value
            })))
          })
        };
        return zipSequence
      }

      function reify(iter, seq) {
        return isSeq(iter) ? seq : iter.constructor(seq)
      }

      function validateEntry(entry) {
        if (entry !== Object(entry)) {
          throw new TypeError("Expected [K, V] tuple: " + entry)
        }
      }

      function resolveSize(iter) {
        assertNotInfinite(iter.size);
        return ensureSize(iter)
      }

      function iterableClass(iterable) {
        return isKeyed(iterable) ? KeyedIterable : isIndexed(iterable) ? IndexedIterable : SetIterable
      }

      function makeSequence(iterable) {
        return Object.create((isKeyed(iterable) ? KeyedSeq : isIndexed(iterable) ? IndexedSeq : SetSeq).prototype)
      }

      function cacheResultThrough() {
        if (this._iter.cacheResult) {
          this._iter.cacheResult();
          this.size = this._iter.size;
          return this
        } else {
          return Seq.prototype.cacheResult.call(this)
        }
      }

      function defaultComparator(a, b) {
        return a > b ? 1 : a < b ? -1 : 0
      }

      function forceIterator(keyPath) {
        var iter = getIterator(keyPath);
        if (!iter) {
          if (!isArrayLike(keyPath)) {
            throw new TypeError("Expected iterable or array-like: " + keyPath)
          }
          iter = getIterator(Iterable(keyPath))
        }
        return iter
      }

      createClass(Map, KeyedCollection);
      function Map(value) {
        return value === null || value === undefined ? emptyMap() : isMap(value) ? value : emptyMap().withMutations(function (map) {
          var iter = KeyedIterable(value);
          assertNotInfinite(iter.size);
          iter.forEach(function (v, k) {
            return map.set(k, v)
          })
        })
      }

      Map.prototype.toString = function () {
        return this.__toString("Map {", "}")
      };
      Map.prototype.get = function (k, notSetValue) {
        return this._root ? this._root.get(0, undefined, k, notSetValue) : notSetValue
      };
      Map.prototype.set = function (k, v) {
        return updateMap(this, k, v)
      };
      Map.prototype.setIn = function (keyPath, v) {
        return this.updateIn(keyPath, NOT_SET, function () {
          return v
        })
      };
      Map.prototype.remove = function (k) {
        return updateMap(this, k, NOT_SET)
      };
      Map.prototype.deleteIn = function (keyPath) {
        return this.updateIn(keyPath, function () {
          return NOT_SET
        })
      };
      Map.prototype.update = function (k, notSetValue, updater) {
        return arguments.length === 1 ? k(this) : this.updateIn([k], notSetValue, updater)
      };
      Map.prototype.updateIn = function (keyPath, notSetValue, updater) {
        if (!updater) {
          updater = notSetValue;
          notSetValue = undefined
        }
        var updatedValue = updateInDeepMap(this, forceIterator(keyPath), notSetValue, updater);
        return updatedValue === NOT_SET ? undefined : updatedValue
      };
      Map.prototype.clear = function () {
        if (this.size === 0) {
          return this
        }
        if (this.__ownerID) {
          this.size = 0;
          this._root = null;
          this.__hash = undefined;
          this.__altered = true;
          return this
        }
        return emptyMap()
      };
      Map.prototype.merge = function () {
        return mergeIntoMapWith(this, undefined, arguments)
      };
      Map.prototype.mergeWith = function (merger) {
        var iters = SLICE$0.call(arguments, 1);
        return mergeIntoMapWith(this, merger, iters)
      };
      Map.prototype.mergeIn = function (keyPath) {
        var iters = SLICE$0.call(arguments, 1);
        return this.updateIn(keyPath, emptyMap(), function (m) {
          return m.merge.apply(m, iters)
        })
      };
      Map.prototype.mergeDeep = function () {
        return mergeIntoMapWith(this, deepMerger(undefined), arguments)
      };
      Map.prototype.mergeDeepWith = function (merger) {
        var iters = SLICE$0.call(arguments, 1);
        return mergeIntoMapWith(this, deepMerger(merger), iters)
      };
      Map.prototype.mergeDeepIn = function (keyPath) {
        var iters = SLICE$0.call(arguments, 1);
        return this.updateIn(keyPath, emptyMap(), function (m) {
          return m.mergeDeep.apply(m, iters)
        })
      };
      Map.prototype.sort = function (comparator) {
        return OrderedMap(sortFactory(this, comparator))
      };
      Map.prototype.sortBy = function (mapper, comparator) {
        return OrderedMap(sortFactory(this, comparator, mapper))
      };
      Map.prototype.withMutations = function (fn) {
        var mutable = this.asMutable();
        fn(mutable);
        return mutable.wasAltered() ? mutable.__ensureOwner(this.__ownerID) : this
      };
      Map.prototype.asMutable = function () {
        return this.__ownerID ? this : this.__ensureOwner(new OwnerID)
      };
      Map.prototype.asImmutable = function () {
        return this.__ensureOwner()
      };
      Map.prototype.wasAltered = function () {
        return this.__altered
      };
      Map.prototype.__iterator = function (type, reverse) {
        return new MapIterator(this, type, reverse)
      };
      Map.prototype.__iterate = function (fn, reverse) {
        var this$0 = this;
        var iterations = 0;
        this._root && this._root.iterate(function (entry) {
          iterations++;
          return fn(entry[1], entry[0], this$0)
        }, reverse);
        return iterations
      };
      Map.prototype.__ensureOwner = function (ownerID) {
        if (ownerID === this.__ownerID) {
          return this
        }
        if (!ownerID) {
          this.__ownerID = ownerID;
          this.__altered = false;
          return this
        }
        return makeMap(this.size, this._root, ownerID, this.__hash)
      };
      function isMap(maybeMap) {
        return !!(maybeMap && maybeMap[IS_MAP_SENTINEL])
      }

      Map.isMap = isMap;
      var IS_MAP_SENTINEL = "@@__IMMUTABLE_MAP__@@";
      var MapPrototype = Map.prototype;
      MapPrototype[IS_MAP_SENTINEL] = true;
      MapPrototype[DELETE] = MapPrototype.remove;
      MapPrototype.removeIn = MapPrototype.deleteIn;
      function ArrayMapNode(ownerID, entries) {
        this.ownerID = ownerID;
        this.entries = entries
      }

      ArrayMapNode.prototype.get = function (shift, keyHash, key, notSetValue) {
        var entries = this.entries;
        for (var ii = 0, len = entries.length; ii < len; ii++) {
          if (is(key, entries[ii][0])) {
            return entries[ii][1]
          }
        }
        return notSetValue
      };
      ArrayMapNode.prototype.update = function (ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
        var removed = value === NOT_SET;
        var entries = this.entries;
        var idx = 0;
        for (var len = entries.length; idx < len; idx++) {
          if (is(key, entries[idx][0])) {
            break
          }
        }
        var exists = idx < len;
        if (exists ? entries[idx][1] === value : removed) {
          return this
        }
        SetRef(didAlter);
        (removed || !exists) && SetRef(didChangeSize);
        if (removed && entries.length === 1) {
          return
        }
        if (!exists && !removed && entries.length >= MAX_ARRAY_MAP_SIZE) {
          return createNodes(ownerID, entries, key, value)
        }
        var isEditable = ownerID && ownerID === this.ownerID;
        var newEntries = isEditable ? entries : arrCopy(entries);
        if (exists) {
          if (removed) {
            idx === len - 1 ? newEntries.pop() : newEntries[idx] = newEntries.pop()
          } else {
            newEntries[idx] = [key, value]
          }
        } else {
          newEntries.push([key, value])
        }
        if (isEditable) {
          this.entries = newEntries;
          return this
        }
        return new ArrayMapNode(ownerID, newEntries)
      };
      function BitmapIndexedNode(ownerID, bitmap, nodes) {
        this.ownerID = ownerID;
        this.bitmap = bitmap;
        this.nodes = nodes
      }

      BitmapIndexedNode.prototype.get = function (shift, keyHash, key, notSetValue) {
        if (keyHash === undefined) {
          keyHash = hash(key)
        }
        var bit = 1 << ((shift === 0 ? keyHash : keyHash >>> shift) & MASK);
        var bitmap = this.bitmap;
        return (bitmap & bit) === 0 ? notSetValue : this.nodes[popCount(bitmap & bit - 1)].get(shift + SHIFT, keyHash, key, notSetValue)
      };
      BitmapIndexedNode.prototype.update = function (ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
        if (keyHash === undefined) {
          keyHash = hash(key)
        }
        var keyHashFrag = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
        var bit = 1 << keyHashFrag;
        var bitmap = this.bitmap;
        var exists = (bitmap & bit) !== 0;
        if (!exists && value === NOT_SET) {
          return this
        }
        var idx = popCount(bitmap & bit - 1);
        var nodes = this.nodes;
        var node = exists ? nodes[idx] : undefined;
        var newNode = updateNode(node, ownerID, shift + SHIFT, keyHash, key, value, didChangeSize, didAlter);
        if (newNode === node) {
          return this
        }
        if (!exists && newNode && nodes.length >= MAX_BITMAP_INDEXED_SIZE) {
          return expandNodes(ownerID, nodes, bitmap, keyHashFrag, newNode)
        }
        if (exists && !newNode && nodes.length === 2 && isLeafNode(nodes[idx ^ 1])) {
          return nodes[idx ^ 1]
        }
        if (exists && newNode && nodes.length === 1 && isLeafNode(newNode)) {
          return newNode
        }
        var isEditable = ownerID && ownerID === this.ownerID;
        var newBitmap = exists ? newNode ? bitmap : bitmap ^ bit : bitmap | bit;
        var newNodes = exists ? newNode ? setIn(nodes, idx, newNode, isEditable) : spliceOut(nodes, idx, isEditable) : spliceIn(nodes, idx, newNode, isEditable);
        if (isEditable) {
          this.bitmap = newBitmap;
          this.nodes = newNodes;
          return this
        }
        return new BitmapIndexedNode(ownerID, newBitmap, newNodes)
      };
      function HashArrayMapNode(ownerID, count, nodes) {
        this.ownerID = ownerID;
        this.count = count;
        this.nodes = nodes
      }

      HashArrayMapNode.prototype.get = function (shift, keyHash, key, notSetValue) {
        if (keyHash === undefined) {
          keyHash = hash(key)
        }
        var idx = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
        var node = this.nodes[idx];
        return node ? node.get(shift + SHIFT, keyHash, key, notSetValue) : notSetValue
      };
      HashArrayMapNode.prototype.update = function (ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
        if (keyHash === undefined) {
          keyHash = hash(key)
        }
        var idx = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
        var removed = value === NOT_SET;
        var nodes = this.nodes;
        var node = nodes[idx];
        if (removed && !node) {
          return this
        }
        var newNode = updateNode(node, ownerID, shift + SHIFT, keyHash, key, value, didChangeSize, didAlter);
        if (newNode === node) {
          return this
        }
        var newCount = this.count;
        if (!node) {
          newCount++
        } else if (!newNode) {
          newCount--;
          if (newCount < MIN_HASH_ARRAY_MAP_SIZE) {
            return packNodes(ownerID, nodes, newCount, idx)
          }
        }
        var isEditable = ownerID && ownerID === this.ownerID;
        var newNodes = setIn(nodes, idx, newNode, isEditable);
        if (isEditable) {
          this.count = newCount;
          this.nodes = newNodes;
          return this
        }
        return new HashArrayMapNode(ownerID, newCount, newNodes)
      };
      function HashCollisionNode(ownerID, keyHash, entries) {
        this.ownerID = ownerID;
        this.keyHash = keyHash;
        this.entries = entries
      }

      HashCollisionNode.prototype.get = function (shift, keyHash, key, notSetValue) {
        var entries = this.entries;
        for (var ii = 0, len = entries.length; ii < len; ii++) {
          if (is(key, entries[ii][0])) {
            return entries[ii][1]
          }
        }
        return notSetValue
      };
      HashCollisionNode.prototype.update = function (ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
        if (keyHash === undefined) {
          keyHash = hash(key)
        }
        var removed = value === NOT_SET;
        if (keyHash !== this.keyHash) {
          if (removed) {
            return this
          }
          SetRef(didAlter);
          SetRef(didChangeSize);
          return mergeIntoNode(this, ownerID, shift, keyHash, [key, value])
        }
        var entries = this.entries;
        var idx = 0;
        for (var len = entries.length; idx < len; idx++) {
          if (is(key, entries[idx][0])) {
            break
          }
        }
        var exists = idx < len;
        if (exists ? entries[idx][1] === value : removed) {
          return this
        }
        SetRef(didAlter);
        (removed || !exists) && SetRef(didChangeSize);
        if (removed && len === 2) {
          return new ValueNode(ownerID, this.keyHash, entries[idx ^ 1])
        }
        var isEditable = ownerID && ownerID === this.ownerID;
        var newEntries = isEditable ? entries : arrCopy(entries);
        if (exists) {
          if (removed) {
            idx === len - 1 ? newEntries.pop() : newEntries[idx] = newEntries.pop()
          } else {
            newEntries[idx] = [key, value]
          }
        } else {
          newEntries.push([key, value])
        }
        if (isEditable) {
          this.entries = newEntries;
          return this
        }
        return new HashCollisionNode(ownerID, this.keyHash, newEntries)
      };
      function ValueNode(ownerID, keyHash, entry) {
        this.ownerID = ownerID;
        this.keyHash = keyHash;
        this.entry = entry
      }

      ValueNode.prototype.get = function (shift, keyHash, key, notSetValue) {
        return is(key, this.entry[0]) ? this.entry[1] : notSetValue
      };
      ValueNode.prototype.update = function (ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
        var removed = value === NOT_SET;
        var keyMatch = is(key, this.entry[0]);
        if (keyMatch ? value === this.entry[1] : removed) {
          return this
        }
        SetRef(didAlter);
        if (removed) {
          SetRef(didChangeSize);
          return
        }
        if (keyMatch) {
          if (ownerID && ownerID === this.ownerID) {
            this.entry[1] = value;
            return this
          }
          return new ValueNode(ownerID, this.keyHash, [key, value])
        }
        SetRef(didChangeSize);
        return mergeIntoNode(this, ownerID, shift, hash(key), [key, value])
      };
      ArrayMapNode.prototype.iterate = HashCollisionNode.prototype.iterate = function (fn, reverse) {
        var entries = this.entries;
        for (var ii = 0, maxIndex = entries.length - 1; ii <= maxIndex; ii++) {
          if (fn(entries[reverse ? maxIndex - ii : ii]) === false) {
            return false
          }
        }
      };
      BitmapIndexedNode.prototype.iterate = HashArrayMapNode.prototype.iterate = function (fn, reverse) {
        var nodes = this.nodes;
        for (var ii = 0, maxIndex = nodes.length - 1; ii <= maxIndex; ii++) {
          var node = nodes[reverse ? maxIndex - ii : ii];
          if (node && node.iterate(fn, reverse) === false) {
            return false
          }
        }
      };
      ValueNode.prototype.iterate = function (fn, reverse) {
        return fn(this.entry)
      };
      createClass(MapIterator, Iterator);
      function MapIterator(map, type, reverse) {
        this._type = type;
        this._reverse = reverse;
        this._stack = map._root && mapIteratorFrame(map._root)
      }

      MapIterator.prototype.next = function () {
        var type = this._type;
        var stack = this._stack;
        while (stack) {
          var node = stack.node;
          var index = stack.index++;
          var maxIndex;
          if (node.entry) {
            if (index === 0) {
              return mapIteratorValue(type, node.entry)
            }
          } else if (node.entries) {
            maxIndex = node.entries.length - 1;
            if (index <= maxIndex) {
              return mapIteratorValue(type, node.entries[this._reverse ? maxIndex - index : index])
            }
          } else {
            maxIndex = node.nodes.length - 1;
            if (index <= maxIndex) {
              var subNode = node.nodes[this._reverse ? maxIndex - index : index];
              if (subNode) {
                if (subNode.entry) {
                  return mapIteratorValue(type, subNode.entry)
                }
                stack = this._stack = mapIteratorFrame(subNode, stack)
              }
              continue
            }
          }
          stack = this._stack = this._stack.__prev
        }
        return iteratorDone()
      };
      function mapIteratorValue(type, entry) {
        return iteratorValue(type, entry[0], entry[1])
      }

      function mapIteratorFrame(node, prev) {
        return {node: node, index: 0, __prev: prev}
      }

      function makeMap(size, root, ownerID, hash) {
        var map = Object.create(MapPrototype);
        map.size = size;
        map._root = root;
        map.__ownerID = ownerID;
        map.__hash = hash;
        map.__altered = false;
        return map
      }

      var EMPTY_MAP;

      function emptyMap() {
        return EMPTY_MAP || (EMPTY_MAP = makeMap(0))
      }

      function updateMap(map, k, v) {
        var newRoot;
        var newSize;
        if (!map._root) {
          if (v === NOT_SET) {
            return map
          }
          newSize = 1;
          newRoot = new ArrayMapNode(map.__ownerID, [[k, v]])
        } else {
          var didChangeSize = MakeRef(CHANGE_LENGTH);
          var didAlter = MakeRef(DID_ALTER);
          newRoot = updateNode(map._root, map.__ownerID, 0, undefined, k, v, didChangeSize, didAlter);
          if (!didAlter.value) {
            return map
          }
          newSize = map.size + (didChangeSize.value ? v === NOT_SET ? -1 : 1 : 0)
        }
        if (map.__ownerID) {
          map.size = newSize;
          map._root = newRoot;
          map.__hash = undefined;
          map.__altered = true;
          return map
        }
        return newRoot ? makeMap(newSize, newRoot) : emptyMap()
      }

      function updateNode(node, ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
        if (!node) {
          if (value === NOT_SET) {
            return node
          }
          SetRef(didAlter);
          SetRef(didChangeSize);
          return new ValueNode(ownerID, keyHash, [key, value])
        }
        return node.update(ownerID, shift, keyHash, key, value, didChangeSize, didAlter)
      }

      function isLeafNode(node) {
        return node.constructor === ValueNode || node.constructor === HashCollisionNode
      }

      function mergeIntoNode(node, ownerID, shift, keyHash, entry) {
        if (node.keyHash === keyHash) {
          return new HashCollisionNode(ownerID, keyHash, [node.entry, entry])
        }
        var idx1 = (shift === 0 ? node.keyHash : node.keyHash >>> shift) & MASK;
        var idx2 = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
        var newNode;
        var nodes = idx1 === idx2 ? [mergeIntoNode(node, ownerID, shift + SHIFT, keyHash, entry)] : (newNode = new ValueNode(ownerID, keyHash, entry), idx1 < idx2 ? [node, newNode] : [newNode, node]);
        return new BitmapIndexedNode(ownerID, 1 << idx1 | 1 << idx2, nodes)
      }

      function createNodes(ownerID, entries, key, value) {
        if (!ownerID) {
          ownerID = new OwnerID
        }
        var node = new ValueNode(ownerID, hash(key), [key, value]);
        for (var ii = 0; ii < entries.length; ii++) {
          var entry = entries[ii];
          node = node.update(ownerID, 0, undefined, entry[0], entry[1])
        }
        return node
      }

      function packNodes(ownerID, nodes, count, excluding) {
        var bitmap = 0;
        var packedII = 0;
        var packedNodes = new Array(count);
        for (var ii = 0, bit = 1, len = nodes.length; ii < len; ii++, bit <<= 1) {
          var node = nodes[ii];
          if (node !== undefined && ii !== excluding) {
            bitmap |= bit;
            packedNodes[packedII++] = node
          }
        }
        return new BitmapIndexedNode(ownerID, bitmap, packedNodes)
      }

      function expandNodes(ownerID, nodes, bitmap, including, node) {
        var count = 0;
        var expandedNodes = new Array(SIZE);
        for (var ii = 0; bitmap !== 0; ii++, bitmap >>>= 1) {
          expandedNodes[ii] = bitmap & 1 ? nodes[count++] : undefined
        }
        expandedNodes[including] = node;
        return new HashArrayMapNode(ownerID, count + 1, expandedNodes)
      }

      function mergeIntoMapWith(map, merger, iterables) {
        var iters = [];
        for (var ii = 0; ii < iterables.length; ii++) {
          var value = iterables[ii];
          var iter = KeyedIterable(value);
          if (!isIterable(value)) {
            iter = iter.map(function (v) {
              return fromJS(v)
            })
          }
          iters.push(iter)
        }
        return mergeIntoCollectionWith(map, merger, iters)
      }

      function deepMerger(merger) {
        return function (existing, value) {
          return existing && existing.mergeDeepWith && isIterable(value) ? existing.mergeDeepWith(merger, value) : merger ? merger(existing, value) : value
        }
      }

      function mergeIntoCollectionWith(collection, merger, iters) {
        iters = iters.filter(function (x) {
          return x.size !== 0
        });
        if (iters.length === 0) {
          return collection
        }
        if (collection.size === 0 && iters.length === 1) {
          return collection.constructor(iters[0])
        }
        return collection.withMutations(function (collection) {
          var mergeIntoMap = merger ? function (value, key) {
            collection.update(key, NOT_SET, function (existing) {
              return existing === NOT_SET ? value : merger(existing, value)
            })
          } : function (value, key) {
            collection.set(key, value)
          };
          for (var ii = 0; ii < iters.length; ii++) {
            iters[ii].forEach(mergeIntoMap)
          }
        })
      }

      function updateInDeepMap(existing, keyPathIter, notSetValue, updater) {
        var isNotSet = existing === NOT_SET;
        var step = keyPathIter.next();
        if (step.done) {
          var existingValue = isNotSet ? notSetValue : existing;
          var newValue = updater(existingValue);
          return newValue === existingValue ? existing : newValue
        }
        invariant(isNotSet || existing && existing.set, "invalid keyPath");
        var key = step.value;
        var nextExisting = isNotSet ? NOT_SET : existing.get(key, NOT_SET);
        var nextUpdated = updateInDeepMap(nextExisting, keyPathIter, notSetValue, updater);
        return nextUpdated === nextExisting ? existing : nextUpdated === NOT_SET ? existing.remove(key) : (isNotSet ? emptyMap() : existing).set(key, nextUpdated)
      }

      function popCount(x) {
        x = x - (x >> 1 & 1431655765);
        x = (x & 858993459) + (x >> 2 & 858993459);
        x = x + (x >> 4) & 252645135;
        x = x + (x >> 8);
        x = x + (x >> 16);
        return x & 127
      }

      function setIn(array, idx, val, canEdit) {
        var newArray = canEdit ? array : arrCopy(array);
        newArray[idx] = val;
        return newArray
      }

      function spliceIn(array, idx, val, canEdit) {
        var newLen = array.length + 1;
        if (canEdit && idx + 1 === newLen) {
          array[idx] = val;
          return array
        }
        var newArray = new Array(newLen);
        var after = 0;
        for (var ii = 0; ii < newLen; ii++) {
          if (ii === idx) {
            newArray[ii] = val;
            after = -1
          } else {
            newArray[ii] = array[ii + after]
          }
        }
        return newArray
      }

      function spliceOut(array, idx, canEdit) {
        var newLen = array.length - 1;
        if (canEdit && idx === newLen) {
          array.pop();
          return array
        }
        var newArray = new Array(newLen);
        var after = 0;
        for (var ii = 0; ii < newLen; ii++) {
          if (ii === idx) {
            after = 1
          }
          newArray[ii] = array[ii + after]
        }
        return newArray
      }

      var MAX_ARRAY_MAP_SIZE = SIZE / 4;
      var MAX_BITMAP_INDEXED_SIZE = SIZE / 2;
      var MIN_HASH_ARRAY_MAP_SIZE = SIZE / 4;
      createClass(List, IndexedCollection);
      function List(value) {
        var empty = emptyList();
        if (value === null || value === undefined) {
          return empty
        }
        if (isList(value)) {
          return value
        }
        var iter = IndexedIterable(value);
        var size = iter.size;
        if (size === 0) {
          return empty
        }
        assertNotInfinite(size);
        if (size > 0 && size < SIZE) {
          return makeList(0, size, SHIFT, null, new VNode(iter.toArray()))
        }
        return empty.withMutations(function (list) {
          list.setSize(size);
          iter.forEach(function (v, i) {
            return list.set(i, v)
          })
        })
      }

      List.of = function () {
        return this(arguments)
      };
      List.prototype.toString = function () {
        return this.__toString("List [", "]")
      };
      List.prototype.get = function (index, notSetValue) {
        index = wrapIndex(this, index);
        if (index < 0 || index >= this.size) {
          return notSetValue
        }
        index += this._origin;
        var node = listNodeFor(this, index);
        return node && node.array[index & MASK]
      };
      List.prototype.set = function (index, value) {
        return updateList(this, index, value)
      };
      List.prototype.remove = function (index) {
        return !this.has(index) ? this : index === 0 ? this.shift() : index === this.size - 1 ? this.pop() : this.splice(index, 1)
      };
      List.prototype.clear = function () {
        if (this.size === 0) {
          return this
        }
        if (this.__ownerID) {
          this.size = this._origin = this._capacity = 0;
          this._level = SHIFT;
          this._root = this._tail = null;
          this.__hash = undefined;
          this.__altered = true;
          return this
        }
        return emptyList()
      };
      List.prototype.push = function () {
        var values = arguments;
        var oldSize = this.size;
        return this.withMutations(function (list) {
          setListBounds(list, 0, oldSize + values.length);
          for (var ii = 0; ii < values.length; ii++) {
            list.set(oldSize + ii, values[ii])
          }
        })
      };
      List.prototype.pop = function () {
        return setListBounds(this, 0, -1)
      };
      List.prototype.unshift = function () {
        var values = arguments;
        return this.withMutations(function (list) {
          setListBounds(list, -values.length);
          for (var ii = 0; ii < values.length; ii++) {
            list.set(ii, values[ii])
          }
        })
      };
      List.prototype.shift = function () {
        return setListBounds(this, 1)
      };
      List.prototype.merge = function () {
        return mergeIntoListWith(this, undefined, arguments)
      };
      List.prototype.mergeWith = function (merger) {
        var iters = SLICE$0.call(arguments, 1);
        return mergeIntoListWith(this, merger, iters)
      };
      List.prototype.mergeDeep = function () {
        return mergeIntoListWith(this, deepMerger(undefined), arguments)
      };
      List.prototype.mergeDeepWith = function (merger) {
        var iters = SLICE$0.call(arguments, 1);
        return mergeIntoListWith(this, deepMerger(merger), iters)
      };
      List.prototype.setSize = function (size) {
        return setListBounds(this, 0, size)
      };
      List.prototype.slice = function (begin, end) {
        var size = this.size;
        if (wholeSlice(begin, end, size)) {
          return this
        }
        return setListBounds(this, resolveBegin(begin, size), resolveEnd(end, size))
      };
      List.prototype.__iterator = function (type, reverse) {
        var index = 0;
        var values = iterateList(this, reverse);
        return new Iterator(function () {
          var value = values();
          return value === DONE ? iteratorDone() : iteratorValue(type, index++, value)
        })
      };
      List.prototype.__iterate = function (fn, reverse) {
        var index = 0;
        var values = iterateList(this, reverse);
        var value;
        while ((value = values()) !== DONE) {
          if (fn(value, index++, this) === false) {
            break
          }
        }
        return index
      };
      List.prototype.__ensureOwner = function (ownerID) {
        if (ownerID === this.__ownerID) {
          return this
        }
        if (!ownerID) {
          this.__ownerID = ownerID;
          return this
        }
        return makeList(this._origin, this._capacity, this._level, this._root, this._tail, ownerID, this.__hash)
      };
      function isList(maybeList) {
        return !!(maybeList && maybeList[IS_LIST_SENTINEL])
      }

      List.isList = isList;
      var IS_LIST_SENTINEL = "@@__IMMUTABLE_LIST__@@";
      var ListPrototype = List.prototype;
      ListPrototype[IS_LIST_SENTINEL] = true;
      ListPrototype[DELETE] = ListPrototype.remove;
      ListPrototype.setIn = MapPrototype.setIn;
      ListPrototype.deleteIn = ListPrototype.removeIn = MapPrototype.removeIn;
      ListPrototype.update = MapPrototype.update;
      ListPrototype.updateIn = MapPrototype.updateIn;
      ListPrototype.mergeIn = MapPrototype.mergeIn;
      ListPrototype.mergeDeepIn = MapPrototype.mergeDeepIn;
      ListPrototype.withMutations = MapPrototype.withMutations;
      ListPrototype.asMutable = MapPrototype.asMutable;
      ListPrototype.asImmutable = MapPrototype.asImmutable;
      ListPrototype.wasAltered = MapPrototype.wasAltered;
      function VNode(array, ownerID) {
        this.array = array;
        this.ownerID = ownerID
      }

      VNode.prototype.removeBefore = function (ownerID, level, index) {
        if (index === level ? 1 << level : 0 || this.array.length === 0) {
          return this
        }
        var originIndex = index >>> level & MASK;
        if (originIndex >= this.array.length) {
          return new VNode([], ownerID)
        }
        var removingFirst = originIndex === 0;
        var newChild;
        if (level > 0) {
          var oldChild = this.array[originIndex];
          newChild = oldChild && oldChild.removeBefore(ownerID, level - SHIFT, index);
          if (newChild === oldChild && removingFirst) {
            return this
          }
        }
        if (removingFirst && !newChild) {
          return this
        }
        var editable = editableVNode(this, ownerID);
        if (!removingFirst) {
          for (var ii = 0; ii < originIndex; ii++) {
            editable.array[ii] = undefined
          }
        }
        if (newChild) {
          editable.array[originIndex] = newChild
        }
        return editable
      };
      VNode.prototype.removeAfter = function (ownerID, level, index) {
        if (index === level ? 1 << level : 0 || this.array.length === 0) {
          return this
        }
        var sizeIndex = index - 1 >>> level & MASK;
        if (sizeIndex >= this.array.length) {
          return this
        }
        var removingLast = sizeIndex === this.array.length - 1;
        var newChild;
        if (level > 0) {
          var oldChild = this.array[sizeIndex];
          newChild = oldChild && oldChild.removeAfter(ownerID, level - SHIFT, index);
          if (newChild === oldChild && removingLast) {
            return this
          }
        }
        if (removingLast && !newChild) {
          return this
        }
        var editable = editableVNode(this, ownerID);
        if (!removingLast) {
          editable.array.pop()
        }
        if (newChild) {
          editable.array[sizeIndex] = newChild
        }
        return editable
      };
      var DONE = {};

      function iterateList(list, reverse) {
        var left = list._origin;
        var right = list._capacity;
        var tailPos = getTailOffset(right);
        var tail = list._tail;
        return iterateNodeOrLeaf(list._root, list._level, 0);
        function iterateNodeOrLeaf(node, level, offset) {
          return level === 0 ? iterateLeaf(node, offset) : iterateNode(node, level, offset)
        }

        function iterateLeaf(node, offset) {
          var array = offset === tailPos ? tail && tail.array : node && node.array;
          var from = offset > left ? 0 : left - offset;
          var to = right - offset;
          if (to > SIZE) {
            to = SIZE
          }
          return function () {
            if (from === to) {
              return DONE
            }
            var idx = reverse ? --to : from++;
            return array && array[idx]
          }
        }

        function iterateNode(node, level, offset) {
          var values;
          var array = node && node.array;
          var from = offset > left ? 0 : left - offset >> level;
          var to = (right - offset >> level) + 1;
          if (to > SIZE) {
            to = SIZE
          }
          return function () {
            do {
              if (values) {
                var value = values();
                if (value !== DONE) {
                  return value
                }
                values = null
              }
              if (from === to) {
                return DONE
              }
              var idx = reverse ? --to : from++;
              values = iterateNodeOrLeaf(array && array[idx], level - SHIFT, offset + (idx << level))
            } while (true)
          }
        }
      }

      function makeList(origin, capacity, level, root, tail, ownerID, hash) {
        var list = Object.create(ListPrototype);
        list.size = capacity - origin;
        list._origin = origin;
        list._capacity = capacity;
        list._level = level;
        list._root = root;
        list._tail = tail;
        list.__ownerID = ownerID;
        list.__hash = hash;
        list.__altered = false;
        return list
      }

      var EMPTY_LIST;

      function emptyList() {
        return EMPTY_LIST || (EMPTY_LIST = makeList(0, 0, SHIFT))
      }

      function updateList(list, index, value) {
        index = wrapIndex(list, index);
        if (index >= list.size || index < 0) {
          return list.withMutations(function (list) {
            index < 0 ? setListBounds(list, index).set(0, value) : setListBounds(list, 0, index + 1).set(index, value)
          })
        }
        index += list._origin;
        var newTail = list._tail;
        var newRoot = list._root;
        var didAlter = MakeRef(DID_ALTER);
        if (index >= getTailOffset(list._capacity)) {
          newTail = updateVNode(newTail, list.__ownerID, 0, index, value, didAlter)
        } else {
          newRoot = updateVNode(newRoot, list.__ownerID, list._level, index, value, didAlter)
        }
        if (!didAlter.value) {
          return list
        }
        if (list.__ownerID) {
          list._root = newRoot;
          list._tail = newTail;
          list.__hash = undefined;
          list.__altered = true;
          return list
        }
        return makeList(list._origin, list._capacity, list._level, newRoot, newTail)
      }

      function updateVNode(node, ownerID, level, index, value, didAlter) {
        var idx = index >>> level & MASK;
        var nodeHas = node && idx < node.array.length;
        if (!nodeHas && value === undefined) {
          return node
        }
        var newNode;
        if (level > 0) {
          var lowerNode = node && node.array[idx];
          var newLowerNode = updateVNode(lowerNode, ownerID, level - SHIFT, index, value, didAlter);
          if (newLowerNode === lowerNode) {
            return node
          }
          newNode = editableVNode(node, ownerID);
          newNode.array[idx] = newLowerNode;
          return newNode
        }
        if (nodeHas && node.array[idx] === value) {
          return node
        }
        SetRef(didAlter);
        newNode = editableVNode(node, ownerID);
        if (value === undefined && idx === newNode.array.length - 1) {
          newNode.array.pop()
        } else {
          newNode.array[idx] = value
        }
        return newNode
      }

      function editableVNode(node, ownerID) {
        if (ownerID && node && ownerID === node.ownerID) {
          return node
        }
        return new VNode(node ? node.array.slice() : [], ownerID)
      }

      function listNodeFor(list, rawIndex) {
        if (rawIndex >= getTailOffset(list._capacity)) {
          return list._tail
        }
        if (rawIndex < 1 << list._level + SHIFT) {
          var node = list._root;
          var level = list._level;
          while (node && level > 0) {
            node = node.array[rawIndex >>> level & MASK];
            level -= SHIFT
          }
          return node
        }
      }

      function setListBounds(list, begin, end) {
        var owner = list.__ownerID || new OwnerID;
        var oldOrigin = list._origin;
        var oldCapacity = list._capacity;
        var newOrigin = oldOrigin + begin;
        var newCapacity = end === undefined ? oldCapacity : end < 0 ? oldCapacity + end : oldOrigin + end;
        if (newOrigin === oldOrigin && newCapacity === oldCapacity) {
          return list
        }
        if (newOrigin >= newCapacity) {
          return list.clear()
        }
        var newLevel = list._level;
        var newRoot = list._root;
        var offsetShift = 0;
        while (newOrigin + offsetShift < 0) {
          newRoot = new VNode(newRoot && newRoot.array.length ? [undefined, newRoot] : [], owner);
          newLevel += SHIFT;
          offsetShift += 1 << newLevel
        }
        if (offsetShift) {
          newOrigin += offsetShift;
          oldOrigin += offsetShift;
          newCapacity += offsetShift;
          oldCapacity += offsetShift
        }
        var oldTailOffset = getTailOffset(oldCapacity);
        var newTailOffset = getTailOffset(newCapacity);
        while (newTailOffset >= 1 << newLevel + SHIFT) {
          newRoot = new VNode(newRoot && newRoot.array.length ? [newRoot] : [], owner);
          newLevel += SHIFT
        }
        var oldTail = list._tail;
        var newTail = newTailOffset < oldTailOffset ? listNodeFor(list, newCapacity - 1) : newTailOffset > oldTailOffset ? new VNode([], owner) : oldTail;
        if (oldTail && newTailOffset > oldTailOffset && newOrigin < oldCapacity && oldTail.array.length) {
          newRoot = editableVNode(newRoot, owner);
          var node = newRoot;
          for (var level = newLevel; level > SHIFT; level -= SHIFT) {
            var idx = oldTailOffset >>> level & MASK;
            node = node.array[idx] = editableVNode(node.array[idx], owner)
          }
          node.array[oldTailOffset >>> SHIFT & MASK] = oldTail
        }
        if (newCapacity < oldCapacity) {
          newTail = newTail && newTail.removeAfter(owner, 0, newCapacity)
        }
        if (newOrigin >= newTailOffset) {
          newOrigin -= newTailOffset;
          newCapacity -= newTailOffset;
          newLevel = SHIFT;
          newRoot = null;
          newTail = newTail && newTail.removeBefore(owner, 0, newOrigin)
        } else if (newOrigin > oldOrigin || newTailOffset < oldTailOffset) {
          offsetShift = 0;
          while (newRoot) {
            var beginIndex = newOrigin >>> newLevel & MASK;
            if (beginIndex !== newTailOffset >>> newLevel & MASK) {
              break
            }
            if (beginIndex) {
              offsetShift += (1 << newLevel) * beginIndex
            }
            newLevel -= SHIFT;
            newRoot = newRoot.array[beginIndex]
          }
          if (newRoot && newOrigin > oldOrigin) {
            newRoot = newRoot.removeBefore(owner, newLevel, newOrigin - offsetShift)
          }
          if (newRoot && newTailOffset < oldTailOffset) {
            newRoot = newRoot.removeAfter(owner, newLevel, newTailOffset - offsetShift)
          }
          if (offsetShift) {
            newOrigin -= offsetShift;
            newCapacity -= offsetShift
          }
        }
        if (list.__ownerID) {
          list.size = newCapacity - newOrigin;
          list._origin = newOrigin;
          list._capacity = newCapacity;
          list._level = newLevel;
          list._root = newRoot;
          list._tail = newTail;
          list.__hash = undefined;
          list.__altered = true;
          return list
        }
        return makeList(newOrigin, newCapacity, newLevel, newRoot, newTail)
      }

      function mergeIntoListWith(list, merger, iterables) {
        var iters = [];
        var maxSize = 0;
        for (var ii = 0; ii < iterables.length; ii++) {
          var value = iterables[ii];
          var iter = IndexedIterable(value);
          if (iter.size > maxSize) {
            maxSize = iter.size
          }
          if (!isIterable(value)) {
            iter = iter.map(function (v) {
              return fromJS(v)
            })
          }
          iters.push(iter)
        }
        if (maxSize > list.size) {
          list = list.setSize(maxSize)
        }
        return mergeIntoCollectionWith(list, merger, iters)
      }

      function getTailOffset(size) {
        return size < SIZE ? 0 : size - 1 >>> SHIFT << SHIFT
      }

      createClass(OrderedMap, Map);
      function OrderedMap(value) {
        return value === null || value === undefined ? emptyOrderedMap() : isOrderedMap(value) ? value : emptyOrderedMap().withMutations(function (map) {
          var iter = KeyedIterable(value);
          assertNotInfinite(iter.size);
          iter.forEach(function (v, k) {
            return map.set(k, v)
          })
        })
      }

      OrderedMap.of = function () {
        return this(arguments)
      };
      OrderedMap.prototype.toString = function () {
        return this.__toString("OrderedMap {", "}")
      };
      OrderedMap.prototype.get = function (k, notSetValue) {
        var index = this._map.get(k);
        return index !== undefined ? this._list.get(index)[1] : notSetValue
      };
      OrderedMap.prototype.clear = function () {
        if (this.size === 0) {
          return this
        }
        if (this.__ownerID) {
          this.size = 0;
          this._map.clear();
          this._list.clear();
          return this
        }
        return emptyOrderedMap()
      };
      OrderedMap.prototype.set = function (k, v) {
        return updateOrderedMap(this, k, v)
      };
      OrderedMap.prototype.remove = function (k) {
        return updateOrderedMap(this, k, NOT_SET)
      };
      OrderedMap.prototype.wasAltered = function () {
        return this._map.wasAltered() || this._list.wasAltered()
      };
      OrderedMap.prototype.__iterate = function (fn, reverse) {
        var this$0 = this;
        return this._list.__iterate(function (entry) {
          return entry && fn(entry[1], entry[0], this$0)
        }, reverse)
      };
      OrderedMap.prototype.__iterator = function (type, reverse) {
        return this._list.fromEntrySeq().__iterator(type, reverse)
      };
      OrderedMap.prototype.__ensureOwner = function (ownerID) {
        if (ownerID === this.__ownerID) {
          return this
        }
        var newMap = this._map.__ensureOwner(ownerID);
        var newList = this._list.__ensureOwner(ownerID);
        if (!ownerID) {
          this.__ownerID = ownerID;
          this._map = newMap;
          this._list = newList;
          return this
        }
        return makeOrderedMap(newMap, newList, ownerID, this.__hash)
      };
      function isOrderedMap(maybeOrderedMap) {
        return isMap(maybeOrderedMap) && isOrdered(maybeOrderedMap)
      }

      OrderedMap.isOrderedMap = isOrderedMap;
      OrderedMap.prototype[IS_ORDERED_SENTINEL] = true;
      OrderedMap.prototype[DELETE] = OrderedMap.prototype.remove;
      function makeOrderedMap(map, list, ownerID, hash) {
        var omap = Object.create(OrderedMap.prototype);
        omap.size = map ? map.size : 0;
        omap._map = map;
        omap._list = list;
        omap.__ownerID = ownerID;
        omap.__hash = hash;
        return omap
      }

      var EMPTY_ORDERED_MAP;

      function emptyOrderedMap() {
        return EMPTY_ORDERED_MAP || (EMPTY_ORDERED_MAP = makeOrderedMap(emptyMap(), emptyList()))
      }

      function updateOrderedMap(omap, k, v) {
        var map = omap._map;
        var list = omap._list;
        var i = map.get(k);
        var has = i !== undefined;
        var newMap;
        var newList;
        if (v === NOT_SET) {
          if (!has) {
            return omap
          }
          if (list.size >= SIZE && list.size >= map.size * 2) {
            newList = list.filter(function (entry, idx) {
              return entry !== undefined && i !== idx
            });
            newMap = newList.toKeyedSeq().map(function (entry) {
              return entry[0]
            }).flip().toMap();
            if (omap.__ownerID) {
              newMap.__ownerID = newList.__ownerID = omap.__ownerID
            }
          } else {
            newMap = map.remove(k);
            newList = i === list.size - 1 ? list.pop() : list.set(i, undefined)
          }
        } else {
          if (has) {
            if (v === list.get(i)[1]) {
              return omap
            }
            newMap = map;
            newList = list.set(i, [k, v])
          } else {
            newMap = map.set(k, list.size);
            newList = list.set(list.size, [k, v])
          }
        }
        if (omap.__ownerID) {
          omap.size = newMap.size;
          omap._map = newMap;
          omap._list = newList;
          omap.__hash = undefined;
          return omap
        }
        return makeOrderedMap(newMap, newList)
      }

      createClass(Stack, IndexedCollection);
      function Stack(value) {
        return value === null || value === undefined ? emptyStack() : isStack(value) ? value : emptyStack().unshiftAll(value)
      }

      Stack.of = function () {
        return this(arguments)
      };
      Stack.prototype.toString = function () {
        return this.__toString("Stack [", "]")
      };
      Stack.prototype.get = function (index, notSetValue) {
        var head = this._head;
        while (head && index--) {
          head = head.next
        }
        return head ? head.value : notSetValue
      };
      Stack.prototype.peek = function () {
        return this._head && this._head.value
      };
      Stack.prototype.push = function () {
        if (arguments.length === 0) {
          return this
        }
        var newSize = this.size + arguments.length;
        var head = this._head;
        for (var ii = arguments.length - 1; ii >= 0; ii--) {
          head = {value: arguments[ii], next: head}
        }
        if (this.__ownerID) {
          this.size = newSize;
          this._head = head;
          this.__hash = undefined;
          this.__altered = true;
          return this
        }
        return makeStack(newSize, head)
      };
      Stack.prototype.pushAll = function (iter) {
        iter = IndexedIterable(iter);
        if (iter.size === 0) {
          return this
        }
        assertNotInfinite(iter.size);
        var newSize = this.size;
        var head = this._head;
        iter.reverse().forEach(function (value) {
          newSize++;
          head = {value: value, next: head}
        });
        if (this.__ownerID) {
          this.size = newSize;
          this._head = head;
          this.__hash = undefined;
          this.__altered = true;
          return this
        }
        return makeStack(newSize, head)
      };
      Stack.prototype.pop = function () {
        return this.slice(1)
      };
      Stack.prototype.unshift = function () {
        return this.push.apply(this, arguments)
      };
      Stack.prototype.unshiftAll = function (iter) {
        return this.pushAll(iter)
      };
      Stack.prototype.shift = function () {
        return this.pop.apply(this, arguments)
      };
      Stack.prototype.clear = function () {
        if (this.size === 0) {
          return this
        }
        if (this.__ownerID) {
          this.size = 0;
          this._head = undefined;
          this.__hash = undefined;
          this.__altered = true;
          return this
        }
        return emptyStack()
      };
      Stack.prototype.slice = function (begin, end) {
        if (wholeSlice(begin, end, this.size)) {
          return this
        }
        var resolvedBegin = resolveBegin(begin, this.size);
        var resolvedEnd = resolveEnd(end, this.size);
        if (resolvedEnd !== this.size) {
          return IndexedCollection.prototype.slice.call(this, begin, end)
        }
        var newSize = this.size - resolvedBegin;
        var head = this._head;
        while (resolvedBegin--) {
          head = head.next
        }
        if (this.__ownerID) {
          this.size = newSize;
          this._head = head;
          this.__hash = undefined;
          this.__altered = true;
          return this
        }
        return makeStack(newSize, head)
      };
      Stack.prototype.__ensureOwner = function (ownerID) {
        if (ownerID === this.__ownerID) {
          return this
        }
        if (!ownerID) {
          this.__ownerID = ownerID;
          this.__altered = false;
          return this
        }
        return makeStack(this.size, this._head, ownerID, this.__hash)
      };
      Stack.prototype.__iterate = function (fn, reverse) {
        if (reverse) {
          return this.toSeq().cacheResult.__iterate(fn, reverse)
        }
        var iterations = 0;
        var node = this._head;
        while (node) {
          if (fn(node.value, iterations++, this) === false) {
            break
          }
          node = node.next
        }
        return iterations
      };
      Stack.prototype.__iterator = function (type, reverse) {
        if (reverse) {
          return this.toSeq().cacheResult().__iterator(type, reverse)
        }
        var iterations = 0;
        var node = this._head;
        return new Iterator(function () {
          if (node) {
            var value = node.value;
            node = node.next;
            return iteratorValue(type, iterations++, value)
          }
          return iteratorDone()
        })
      };
      function isStack(maybeStack) {
        return !!(maybeStack && maybeStack[IS_STACK_SENTINEL])
      }

      Stack.isStack = isStack;
      var IS_STACK_SENTINEL = "@@__IMMUTABLE_STACK__@@";
      var StackPrototype = Stack.prototype;
      StackPrototype[IS_STACK_SENTINEL] = true;
      StackPrototype.withMutations = MapPrototype.withMutations;
      StackPrototype.asMutable = MapPrototype.asMutable;
      StackPrototype.asImmutable = MapPrototype.asImmutable;
      StackPrototype.wasAltered = MapPrototype.wasAltered;
      function makeStack(size, head, ownerID, hash) {
        var map = Object.create(StackPrototype);
        map.size = size;
        map._head = head;
        map.__ownerID = ownerID;
        map.__hash = hash;
        map.__altered = false;
        return map
      }

      var EMPTY_STACK;

      function emptyStack() {
        return EMPTY_STACK || (EMPTY_STACK = makeStack(0))
      }

      createClass(Set, SetCollection);
      function Set(value) {
        return value === null || value === undefined ? emptySet() : isSet(value) ? value : emptySet().withMutations(function (set) {
          var iter = SetIterable(value);
          assertNotInfinite(iter.size);
          iter.forEach(function (v) {
            return set.add(v)
          })
        })
      }

      Set.of = function () {
        return this(arguments)
      };
      Set.fromKeys = function (value) {
        return this(KeyedIterable(value).keySeq())
      };
      Set.prototype.toString = function () {
        return this.__toString("Set {", "}")
      };
      Set.prototype.has = function (value) {
        return this._map.has(value)
      };
      Set.prototype.add = function (value) {
        return updateSet(this, this._map.set(value, true))
      };
      Set.prototype.remove = function (value) {
        return updateSet(this, this._map.remove(value))
      };
      Set.prototype.clear = function () {
        return updateSet(this, this._map.clear())
      };
      Set.prototype.union = function () {
        var iters = SLICE$0.call(arguments, 0);
        iters = iters.filter(function (x) {
          return x.size !== 0
        });
        if (iters.length === 0) {
          return this
        }
        if (this.size === 0 && iters.length === 1) {
          return this.constructor(iters[0])
        }
        return this.withMutations(function (set) {
          for (var ii = 0; ii < iters.length; ii++) {
            SetIterable(iters[ii]).forEach(function (value) {
              return set.add(value)
            })
          }
        })
      };
      Set.prototype.intersect = function () {
        var iters = SLICE$0.call(arguments, 0);
        if (iters.length === 0) {
          return this
        }
        iters = iters.map(function (iter) {
          return SetIterable(iter)
        });
        var originalSet = this;
        return this.withMutations(function (set) {
          originalSet.forEach(function (value) {
            if (!iters.every(function (iter) {
                return iter.contains(value)
              })) {
              set.remove(value)
            }
          })
        })
      };
      Set.prototype.subtract = function () {
        var iters = SLICE$0.call(arguments, 0);
        if (iters.length === 0) {
          return this
        }
        iters = iters.map(function (iter) {
          return SetIterable(iter)
        });
        var originalSet = this;
        return this.withMutations(function (set) {
          originalSet.forEach(function (value) {
            if (iters.some(function (iter) {
                return iter.contains(value)
              })) {
              set.remove(value)
            }
          })
        })
      };
      Set.prototype.merge = function () {
        return this.union.apply(this, arguments)
      };
      Set.prototype.mergeWith = function (merger) {
        var iters = SLICE$0.call(arguments, 1);
        return this.union.apply(this, iters)
      };
      Set.prototype.sort = function (comparator) {
        return OrderedSet(sortFactory(this, comparator))
      };
      Set.prototype.sortBy = function (mapper, comparator) {
        return OrderedSet(sortFactory(this, comparator, mapper))
      };
      Set.prototype.wasAltered = function () {
        return this._map.wasAltered()
      };
      Set.prototype.__iterate = function (fn, reverse) {
        var this$0 = this;
        return this._map.__iterate(function (_, k) {
          return fn(k, k, this$0)
        }, reverse)
      };
      Set.prototype.__iterator = function (type, reverse) {
        return this._map.map(function (_, k) {
          return k
        }).__iterator(type, reverse)
      };
      Set.prototype.__ensureOwner = function (ownerID) {
        if (ownerID === this.__ownerID) {
          return this
        }
        var newMap = this._map.__ensureOwner(ownerID);
        if (!ownerID) {
          this.__ownerID = ownerID;
          this._map = newMap;
          return this
        }
        return this.__make(newMap, ownerID)
      };
      function isSet(maybeSet) {
        return !!(maybeSet && maybeSet[IS_SET_SENTINEL])
      }

      Set.isSet = isSet;
      var IS_SET_SENTINEL = "@@__IMMUTABLE_SET__@@";
      var SetPrototype = Set.prototype;
      SetPrototype[IS_SET_SENTINEL] = true;
      SetPrototype[DELETE] = SetPrototype.remove;
      SetPrototype.mergeDeep = SetPrototype.merge;
      SetPrototype.mergeDeepWith = SetPrototype.mergeWith;
      SetPrototype.withMutations = MapPrototype.withMutations;
      SetPrototype.asMutable = MapPrototype.asMutable;
      SetPrototype.asImmutable = MapPrototype.asImmutable;
      SetPrototype.__empty = emptySet;
      SetPrototype.__make = makeSet;
      function updateSet(set, newMap) {
        if (set.__ownerID) {
          set.size = newMap.size;
          set._map = newMap;
          return set
        }
        return newMap === set._map ? set : newMap.size === 0 ? set.__empty() : set.__make(newMap)
      }

      function makeSet(map, ownerID) {
        var set = Object.create(SetPrototype);
        set.size = map ? map.size : 0;
        set._map = map;
        set.__ownerID = ownerID;
        return set
      }

      var EMPTY_SET;

      function emptySet() {
        return EMPTY_SET || (EMPTY_SET = makeSet(emptyMap()))
      }

      createClass(OrderedSet, Set);
      function OrderedSet(value) {
        return value === null || value === undefined ? emptyOrderedSet() : isOrderedSet(value) ? value : emptyOrderedSet().withMutations(function (set) {
          var iter = SetIterable(value);
          assertNotInfinite(iter.size);
          iter.forEach(function (v) {
            return set.add(v)
          })
        })
      }

      OrderedSet.of = function () {
        return this(arguments)
      };
      OrderedSet.fromKeys = function (value) {
        return this(KeyedIterable(value).keySeq())
      };
      OrderedSet.prototype.toString = function () {
        return this.__toString("OrderedSet {", "}")
      };
      function isOrderedSet(maybeOrderedSet) {
        return isSet(maybeOrderedSet) && isOrdered(maybeOrderedSet)
      }

      OrderedSet.isOrderedSet = isOrderedSet;
      var OrderedSetPrototype = OrderedSet.prototype;
      OrderedSetPrototype[IS_ORDERED_SENTINEL] = true;
      OrderedSetPrototype.__empty = emptyOrderedSet;
      OrderedSetPrototype.__make = makeOrderedSet;
      function makeOrderedSet(map, ownerID) {
        var set = Object.create(OrderedSetPrototype);
        set.size = map ? map.size : 0;
        set._map = map;
        set.__ownerID = ownerID;
        return set
      }

      var EMPTY_ORDERED_SET;

      function emptyOrderedSet() {
        return EMPTY_ORDERED_SET || (EMPTY_ORDERED_SET = makeOrderedSet(emptyOrderedMap()))
      }

      createClass(Record, KeyedCollection);
      function Record(defaultValues, name) {
        var RecordType = function Record(values) {
          if (!(this instanceof RecordType)) {
            return new RecordType(values)
          }
          this._map = Map(values)
        };
        var keys = Object.keys(defaultValues);
        var RecordTypePrototype = RecordType.prototype = Object.create(RecordPrototype);
        RecordTypePrototype.constructor = RecordType;
        name && (RecordTypePrototype._name = name);
        RecordTypePrototype._defaultValues = defaultValues;
        RecordTypePrototype._keys = keys;
        RecordTypePrototype.size = keys.length;
        try {
          keys.forEach(function (key) {
            Object.defineProperty(RecordType.prototype, key, {
              get: function () {
                return this.get(key)
              }, set: function (value) {
                invariant(this.__ownerID, "Cannot set on an immutable record.");
                this.set(key, value)
              }
            })
          })
        } catch (error) {
        }
        return RecordType
      }

      Record.prototype.toString = function () {
        return this.__toString(recordName(this) + " {", "}")
      };
      Record.prototype.has = function (k) {
        return this._defaultValues.hasOwnProperty(k)
      };
      Record.prototype.get = function (k, notSetValue) {
        if (!this.has(k)) {
          return notSetValue
        }
        var defaultVal = this._defaultValues[k];
        return this._map ? this._map.get(k, defaultVal) : defaultVal
      };
      Record.prototype.clear = function () {
        if (this.__ownerID) {
          this._map && this._map.clear();
          return this
        }
        var SuperRecord = Object.getPrototypeOf(this).constructor;
        return SuperRecord._empty || (SuperRecord._empty = makeRecord(this, emptyMap()))
      };
      Record.prototype.set = function (k, v) {
        if (!this.has(k)) {
          throw new Error('Cannot set unknown key "' + k + '" on ' + recordName(this))
        }
        var newMap = this._map && this._map.set(k, v);
        if (this.__ownerID || newMap === this._map) {
          return this
        }
        return makeRecord(this, newMap)
      };
      Record.prototype.remove = function (k) {
        if (!this.has(k)) {
          return this
        }
        var newMap = this._map && this._map.remove(k);
        if (this.__ownerID || newMap === this._map) {
          return this
        }
        return makeRecord(this, newMap)
      };
      Record.prototype.wasAltered = function () {
        return this._map.wasAltered()
      };
      Record.prototype.__iterator = function (type, reverse) {
        var this$0 = this;
        return KeyedIterable(this._defaultValues).map(function (_, k) {
          return this$0.get(k)
        }).__iterator(type, reverse)
      };
      Record.prototype.__iterate = function (fn, reverse) {
        var this$0 = this;
        return KeyedIterable(this._defaultValues).map(function (_, k) {
          return this$0.get(k)
        }).__iterate(fn, reverse)
      };
      Record.prototype.__ensureOwner = function (ownerID) {
        if (ownerID === this.__ownerID) {
          return this
        }
        var newMap = this._map && this._map.__ensureOwner(ownerID);
        if (!ownerID) {
          this.__ownerID = ownerID;
          this._map = newMap;
          return this
        }
        return makeRecord(this, newMap, ownerID)
      };
      var RecordPrototype = Record.prototype;
      RecordPrototype[DELETE] = RecordPrototype.remove;
      RecordPrototype.deleteIn = RecordPrototype.removeIn = MapPrototype.removeIn;
      RecordPrototype.merge = MapPrototype.merge;
      RecordPrototype.mergeWith = MapPrototype.mergeWith;
      RecordPrototype.mergeIn = MapPrototype.mergeIn;
      RecordPrototype.mergeDeep = MapPrototype.mergeDeep;
      RecordPrototype.mergeDeepWith = MapPrototype.mergeDeepWith;
      RecordPrototype.mergeDeepIn = MapPrototype.mergeDeepIn;
      RecordPrototype.setIn = MapPrototype.setIn;
      RecordPrototype.update = MapPrototype.update;
      RecordPrototype.updateIn = MapPrototype.updateIn;
      RecordPrototype.withMutations = MapPrototype.withMutations;
      RecordPrototype.asMutable = MapPrototype.asMutable;
      RecordPrototype.asImmutable = MapPrototype.asImmutable;
      function makeRecord(likeRecord, map, ownerID) {
        var record = Object.create(Object.getPrototypeOf(likeRecord));
        record._map = map;
        record.__ownerID = ownerID;
        return record
      }

      function recordName(record) {
        return record._name || record.constructor.name
      }

      function deepEqual(a, b) {
        if (a === b) {
          return true
        }
        if (!isIterable(b) || a.size !== undefined && b.size !== undefined && a.size !== b.size || a.__hash !== undefined && b.__hash !== undefined && a.__hash !== b.__hash || isKeyed(a) !== isKeyed(b) || isIndexed(a) !== isIndexed(b) || isOrdered(a) !== isOrdered(b)) {
          return false
        }
        if (a.size === 0 && b.size === 0) {
          return true
        }
        var notAssociative = !isAssociative(a);
        if (isOrdered(a)) {
          var entries = a.entries();
          return b.every(function (v, k) {
              var entry = entries.next().value;
              return entry && is(entry[1], v) && (notAssociative || is(entry[0], k))
            }) && entries.next().done
        }
        var flipped = false;
        if (a.size === undefined) {
          if (b.size === undefined) {
            a.cacheResult()
          } else {
            flipped = true;
            var _ = a;
            a = b;
            b = _
          }
        }
        var allEqual = true;
        var bSize = b.__iterate(function (v, k) {
          if (notAssociative ? !a.has(v) : flipped ? !is(v, a.get(k, NOT_SET)) : !is(a.get(k, NOT_SET), v)) {
            allEqual = false;
            return false
          }
        });
        return allEqual && a.size === bSize
      }

      createClass(Range, IndexedSeq);
      function Range(start, end, step) {
        if (!(this instanceof Range)) {
          return new Range(start, end, step)
        }
        invariant(step !== 0, "Cannot step a Range by 0");
        start = start || 0;
        if (end === undefined) {
          end = Infinity
        }
        step = step === undefined ? 1 : Math.abs(step);
        if (end < start) {
          step = -step
        }
        this._start = start;
        this._end = end;
        this._step = step;
        this.size = Math.max(0, Math.ceil((end - start) / step - 1) + 1);
        if (this.size === 0) {
          if (EMPTY_RANGE) {
            return EMPTY_RANGE
          }
          EMPTY_RANGE = this
        }
      }

      Range.prototype.toString = function () {
        if (this.size === 0) {
          return "Range []"
        }
        return "Range [ " + this._start + "..." + this._end + (this._step > 1 ? " by " + this._step : "") + " ]"
      };
      Range.prototype.get = function (index, notSetValue) {
        return this.has(index) ? this._start + wrapIndex(this, index) * this._step : notSetValue
      };
      Range.prototype.contains = function (searchValue) {
        var possibleIndex = (searchValue - this._start) / this._step;
        return possibleIndex >= 0 && possibleIndex < this.size && possibleIndex === Math.floor(possibleIndex)
      };
      Range.prototype.slice = function (begin, end) {
        if (wholeSlice(begin, end, this.size)) {
          return this
        }
        begin = resolveBegin(begin, this.size);
        end = resolveEnd(end, this.size);
        if (end <= begin) {
          return new Range(0, 0)
        }
        return new Range(this.get(begin, this._end), this.get(end, this._end), this._step)
      };
      Range.prototype.indexOf = function (searchValue) {
        var offsetValue = searchValue - this._start;
        if (offsetValue % this._step === 0) {
          var index = offsetValue / this._step;
          if (index >= 0 && index < this.size) {
            return index
          }
        }
        return -1
      };
      Range.prototype.lastIndexOf = function (searchValue) {
        return this.indexOf(searchValue)
      };
      Range.prototype.__iterate = function (fn, reverse) {
        var maxIndex = this.size - 1;
        var step = this._step;
        var value = reverse ? this._start + maxIndex * step : this._start;
        for (var ii = 0; ii <= maxIndex; ii++) {
          if (fn(value, ii, this) === false) {
            return ii + 1
          }
          value += reverse ? -step : step
        }
        return ii
      };
      Range.prototype.__iterator = function (type, reverse) {
        var maxIndex = this.size - 1;
        var step = this._step;
        var value = reverse ? this._start + maxIndex * step : this._start;
        var ii = 0;
        return new Iterator(function () {
          var v = value;
          value += reverse ? -step : step;
          return ii > maxIndex ? iteratorDone() : iteratorValue(type, ii++, v)
        })
      };
      Range.prototype.equals = function (other) {
        return other instanceof Range ? this._start === other._start && this._end === other._end && this._step === other._step : deepEqual(this, other)
      };
      var EMPTY_RANGE;
      createClass(Repeat, IndexedSeq);
      function Repeat(value, times) {
        if (!(this instanceof Repeat)) {
          return new Repeat(value, times)
        }
        this._value = value;
        this.size = times === undefined ? Infinity : Math.max(0, times);
        if (this.size === 0) {
          if (EMPTY_REPEAT) {
            return EMPTY_REPEAT
          }
          EMPTY_REPEAT = this
        }
      }

      Repeat.prototype.toString = function () {
        if (this.size === 0) {
          return "Repeat []"
        }
        return "Repeat [ " + this._value + " " + this.size + " times ]"
      };
      Repeat.prototype.get = function (index, notSetValue) {
        return this.has(index) ? this._value : notSetValue
      };
      Repeat.prototype.contains = function (searchValue) {
        return is(this._value, searchValue)
      };
      Repeat.prototype.slice = function (begin, end) {
        var size = this.size;
        return wholeSlice(begin, end, size) ? this : new Repeat(this._value, resolveEnd(end, size) - resolveBegin(begin, size))
      };
      Repeat.prototype.reverse = function () {
        return this
      };
      Repeat.prototype.indexOf = function (searchValue) {
        if (is(this._value, searchValue)) {
          return 0
        }
        return -1
      };
      Repeat.prototype.lastIndexOf = function (searchValue) {
        if (is(this._value, searchValue)) {
          return this.size
        }
        return -1
      };
      Repeat.prototype.__iterate = function (fn, reverse) {
        for (var ii = 0; ii < this.size; ii++) {
          if (fn(this._value, ii, this) === false) {
            return ii + 1
          }
        }
        return ii
      };
      Repeat.prototype.__iterator = function (type, reverse) {
        var this$0 = this;
        var ii = 0;
        return new Iterator(function () {
          return ii < this$0.size ? iteratorValue(type, ii++, this$0._value) : iteratorDone()
        })
      };
      Repeat.prototype.equals = function (other) {
        return other instanceof Repeat ? is(this._value, other._value) : deepEqual(other)
      };
      var EMPTY_REPEAT;

      function mixin(ctor, methods) {
        var keyCopier = function (key) {
          ctor.prototype[key] = methods[key]
        };
        Object.keys(methods).forEach(keyCopier);
        Object.getOwnPropertySymbols && Object.getOwnPropertySymbols(methods).forEach(keyCopier);
        return ctor
      }

      Iterable.Iterator = Iterator;
      mixin(Iterable, {
        toArray: function () {
          assertNotInfinite(this.size);
          var array = new Array(this.size || 0);
          this.valueSeq().__iterate(function (v, i) {
            array[i] = v
          });
          return array
        }, toIndexedSeq: function () {
          return new ToIndexedSequence(this)
        }, toJS: function () {
          return this.toSeq().map(function (value) {
            return value && typeof value.toJS === "function" ? value.toJS() : value
          }).__toJS()
        }, toJSON: function () {
          return this.toSeq().map(function (value) {
            return value && typeof value.toJSON === "function" ? value.toJSON() : value
          }).__toJS()
        }, toKeyedSeq: function () {
          return new ToKeyedSequence(this, true)
        }, toMap: function () {
          return Map(this.toKeyedSeq())
        }, toObject: function () {
          assertNotInfinite(this.size);
          var object = {};
          this.__iterate(function (v, k) {
            object[k] = v
          });
          return object
        }, toOrderedMap: function () {
          return OrderedMap(this.toKeyedSeq())
        }, toOrderedSet: function () {
          return OrderedSet(isKeyed(this) ? this.valueSeq() : this)
        }, toSet: function () {
          return Set(isKeyed(this) ? this.valueSeq() : this)
        }, toSetSeq: function () {
          return new ToSetSequence(this)
        }, toSeq: function () {
          return isIndexed(this) ? this.toIndexedSeq() : isKeyed(this) ? this.toKeyedSeq() : this.toSetSeq()
        }, toStack: function () {
          return Stack(isKeyed(this) ? this.valueSeq() : this)
        }, toList: function () {
          return List(isKeyed(this) ? this.valueSeq() : this)
        }, toString: function () {
          return "[Iterable]"
        }, __toString: function (head, tail) {
          if (this.size === 0) {
            return head + tail
          }
          return head + " " + this.toSeq().map(this.__toStringMapper).join(", ") + " " + tail
        }, concat: function () {
          var values = SLICE$0.call(arguments, 0);
          return reify(this, concatFactory(this, values))
        }, contains: function (searchValue) {
          return this.some(function (value) {
            return is(value, searchValue)
          })
        }, entries: function () {
          return this.__iterator(ITERATE_ENTRIES)
        }, every: function (predicate, context) {
          assertNotInfinite(this.size);
          var returnValue = true;
          this.__iterate(function (v, k, c) {
            if (!predicate.call(context, v, k, c)) {
              returnValue = false;
              return false
            }
          });
          return returnValue
        }, filter: function (predicate, context) {
          return reify(this, filterFactory(this, predicate, context, true))
        }, find: function (predicate, context, notSetValue) {
          var entry = this.findEntry(predicate, context);
          return entry ? entry[1] : notSetValue
        }, findEntry: function (predicate, context) {
          var found;
          this.__iterate(function (v, k, c) {
            if (predicate.call(context, v, k, c)) {
              found = [k, v];
              return false
            }
          });
          return found
        }, findLastEntry: function (predicate, context) {
          return this.toSeq().reverse().findEntry(predicate, context)
        }, forEach: function (sideEffect, context) {
          assertNotInfinite(this.size);
          return this.__iterate(context ? sideEffect.bind(context) : sideEffect)
        }, join: function (separator) {
          assertNotInfinite(this.size);
          separator = separator !== undefined ? "" + separator : ",";
          var joined = "";
          var isFirst = true;
          this.__iterate(function (v) {
            isFirst ? isFirst = false : joined += separator;
            joined += v !== null && v !== undefined ? v : ""
          });
          return joined
        }, keys: function () {
          return this.__iterator(ITERATE_KEYS)
        }, map: function (mapper, context) {
          return reify(this, mapFactory(this, mapper, context))
        }, reduce: function (reducer, initialReduction, context) {
          assertNotInfinite(this.size);
          var reduction;
          var useFirst;
          if (arguments.length < 2) {
            useFirst = true
          } else {
            reduction = initialReduction
          }
          this.__iterate(function (v, k, c) {
            if (useFirst) {
              useFirst = false;
              reduction = v
            } else {
              reduction = reducer.call(context, reduction, v, k, c)
            }
          });
          return reduction
        }, reduceRight: function (reducer, initialReduction, context) {
          var reversed = this.toKeyedSeq().reverse();
          return reversed.reduce.apply(reversed, arguments)
        }, reverse: function () {
          return reify(this, reverseFactory(this, true))
        }, slice: function (begin, end) {
          return reify(this, sliceFactory(this, begin, end, true))
        }, some: function (predicate, context) {
          return !this.every(not(predicate), context)
        }, sort: function (comparator) {
          return reify(this, sortFactory(this, comparator))
        }, values: function () {
          return this.__iterator(ITERATE_VALUES)
        }, butLast: function () {
          return this.slice(0, -1)
        }, isEmpty: function () {
          return this.size !== undefined ? this.size === 0 : !this.some(function () {
            return true
          })
        }, count: function (predicate, context) {
          return ensureSize(predicate ? this.toSeq().filter(predicate, context) : this)
        }, countBy: function (grouper, context) {
          return countByFactory(this, grouper, context)
        }, equals: function (other) {
          return deepEqual(this, other)
        }, entrySeq: function () {
          var iterable = this;
          if (iterable._cache) {
            return new ArraySeq(iterable._cache)
          }
          var entriesSequence = iterable.toSeq().map(entryMapper).toIndexedSeq();
          entriesSequence.fromEntrySeq = function () {
            return iterable.toSeq()
          };
          return entriesSequence
        }, filterNot: function (predicate, context) {
          return this.filter(not(predicate), context)
        }, findLast: function (predicate, context, notSetValue) {
          return this.toKeyedSeq().reverse().find(predicate, context, notSetValue)
        }, first: function () {
          return this.find(returnTrue)
        }, flatMap: function (mapper, context) {
          return reify(this, flatMapFactory(this, mapper, context))
        }, flatten: function (depth) {
          return reify(this, flattenFactory(this, depth, true))
        }, fromEntrySeq: function () {
          return new FromEntriesSequence(this)
        }, get: function (searchKey, notSetValue) {
          return this.find(function (_, key) {
            return is(key, searchKey)
          }, undefined, notSetValue)
        }, getIn: function (searchKeyPath, notSetValue) {
          var nested = this;
          var iter = forceIterator(searchKeyPath);
          var step;
          while (!(step = iter.next()).done) {
            var key = step.value;
            nested = nested && nested.get ? nested.get(key, NOT_SET) : NOT_SET;
            if (nested === NOT_SET) {
              return notSetValue
            }
          }
          return nested
        }, groupBy: function (grouper, context) {
          return groupByFactory(this, grouper, context)
        }, has: function (searchKey) {
          return this.get(searchKey, NOT_SET) !== NOT_SET
        }, hasIn: function (searchKeyPath) {
          return this.getIn(searchKeyPath, NOT_SET) !== NOT_SET
        }, isSubset: function (iter) {
          iter = typeof iter.contains === "function" ? iter : Iterable(iter);
          return this.every(function (value) {
            return iter.contains(value)
          })
        }, isSuperset: function (iter) {
          return iter.isSubset(this)
        }, keySeq: function () {
          return this.toSeq().map(keyMapper).toIndexedSeq()
        }, last: function () {
          return this.toSeq().reverse().first()
        }, max: function (comparator) {
          return maxFactory(this, comparator)
        }, maxBy: function (mapper, comparator) {
          return maxFactory(this, comparator, mapper)
        }, min: function (comparator) {
          return maxFactory(this, comparator ? neg(comparator) : defaultNegComparator)
        }, minBy: function (mapper, comparator) {
          return maxFactory(this, comparator ? neg(comparator) : defaultNegComparator, mapper)
        }, rest: function () {
          return this.slice(1)
        }, skip: function (amount) {
          return this.slice(Math.max(0, amount))
        }, skipLast: function (amount) {
          return reify(this, this.toSeq().reverse().skip(amount).reverse())
        }, skipWhile: function (predicate, context) {
          return reify(this, skipWhileFactory(this, predicate, context, true))
        }, skipUntil: function (predicate, context) {
          return this.skipWhile(not(predicate), context)
        }, sortBy: function (mapper, comparator) {
          return reify(this, sortFactory(this, comparator, mapper))
        }, take: function (amount) {
          return this.slice(0, Math.max(0, amount))
        }, takeLast: function (amount) {
          return reify(this, this.toSeq().reverse().take(amount).reverse())
        }, takeWhile: function (predicate, context) {
          return reify(this, takeWhileFactory(this, predicate, context))
        }, takeUntil: function (predicate, context) {
          return this.takeWhile(not(predicate), context)
        }, valueSeq: function () {
          return this.toIndexedSeq()
        }, hashCode: function () {
          return this.__hash || (this.__hash = hashIterable(this))
        }
      });
      var IterablePrototype = Iterable.prototype;
      IterablePrototype[IS_ITERABLE_SENTINEL] = true;
      IterablePrototype[ITERATOR_SYMBOL] = IterablePrototype.values;
      IterablePrototype.__toJS = IterablePrototype.toArray;
      IterablePrototype.__toStringMapper = quoteString;
      IterablePrototype.inspect = IterablePrototype.toSource = function () {
        return this.toString()
      };
      IterablePrototype.chain = IterablePrototype.flatMap;
      (function () {
        try {
          Object.defineProperty(IterablePrototype, "length", {
            get: function () {
              if (!Iterable.noLengthWarning) {
                var stack;
                try {
                  throw new Error
                } catch (error) {
                  stack = error.stack
                }
                if (stack.indexOf("_wrapObject") === -1) {
                  console && console.warn && console.warn("iterable.length has been deprecated, " + "use iterable.size or iterable.count(). " + "This warning will become a silent error in a future version. " + stack);
                  return this.size
                }
              }
            }
          })
        } catch (e) {
        }
      })();
      mixin(KeyedIterable, {
        flip: function () {
          return reify(this, flipFactory(this))
        }, findKey: function (predicate, context) {
          var entry = this.findEntry(predicate, context);
          return entry && entry[0]
        }, findLastKey: function (predicate, context) {
          return this.toSeq().reverse().findKey(predicate, context)
        }, keyOf: function (searchValue) {
          return this.findKey(function (value) {
            return is(value, searchValue)
          })
        }, lastKeyOf: function (searchValue) {
          return this.findLastKey(function (value) {
            return is(value, searchValue)
          })
        }, mapEntries: function (mapper, context) {
          var this$0 = this;
          var iterations = 0;
          return reify(this, this.toSeq().map(function (v, k) {
            return mapper.call(context, [k, v], iterations++, this$0)
          }).fromEntrySeq())
        }, mapKeys: function (mapper, context) {
          var this$0 = this;
          return reify(this, this.toSeq().flip().map(function (k, v) {
            return mapper.call(context, k, v, this$0)
          }).flip())
        }
      });
      var KeyedIterablePrototype = KeyedIterable.prototype;
      KeyedIterablePrototype[IS_KEYED_SENTINEL] = true;
      KeyedIterablePrototype[ITERATOR_SYMBOL] = IterablePrototype.entries;
      KeyedIterablePrototype.__toJS = IterablePrototype.toObject;
      KeyedIterablePrototype.__toStringMapper = function (v, k) {
        return k + ": " + quoteString(v)
      };
      mixin(IndexedIterable, {
        toKeyedSeq: function () {
          return new ToKeyedSequence(this, false)
        }, filter: function (predicate, context) {
          return reify(this, filterFactory(this, predicate, context, false))
        }, findIndex: function (predicate, context) {
          var entry = this.findEntry(predicate, context);
          return entry ? entry[0] : -1
        }, indexOf: function (searchValue) {
          var key = this.toKeyedSeq().keyOf(searchValue);
          return key === undefined ? -1 : key
        }, lastIndexOf: function (searchValue) {
          return this.toSeq().reverse().indexOf(searchValue)
        }, reverse: function () {
          return reify(this, reverseFactory(this, false))
        }, slice: function (begin, end) {
          return reify(this, sliceFactory(this, begin, end, false))
        }, splice: function (index, removeNum) {
          var numArgs = arguments.length;
          removeNum = Math.max(removeNum | 0, 0);
          if (numArgs === 0 || numArgs === 2 && !removeNum) {
            return this
          }
          index = resolveBegin(index, this.size);
          var spliced = this.slice(0, index);
          return reify(this, numArgs === 1 ? spliced : spliced.concat(arrCopy(arguments, 2), this.slice(index + removeNum)))
        }, findLastIndex: function (predicate, context) {
          var key = this.toKeyedSeq().findLastKey(predicate, context);
          return key === undefined ? -1 : key
        }, first: function () {
          return this.get(0)
        }, flatten: function (depth) {
          return reify(this, flattenFactory(this, depth, false))
        }, get: function (index, notSetValue) {
          index = wrapIndex(this, index);
          return index < 0 || (this.size === Infinity || this.size !== undefined && index > this.size) ? notSetValue : this.find(function (_, key) {
            return key === index
          }, undefined, notSetValue)
        }, has: function (index) {
          index = wrapIndex(this, index);
          return index >= 0 && (this.size !== undefined ? this.size === Infinity || index < this.size : this.indexOf(index) !== -1)
        }, interpose: function (separator) {
          return reify(this, interposeFactory(this, separator))
        }, interleave: function () {
          var iterables = [this].concat(arrCopy(arguments));
          var zipped = zipWithFactory(this.toSeq(), IndexedSeq.of, iterables);
          var interleaved = zipped.flatten(true);
          if (zipped.size) {
            interleaved.size = zipped.size * iterables.length
          }
          return reify(this, interleaved)
        }, last: function () {
          return this.get(-1)
        }, skipWhile: function (predicate, context) {
          return reify(this, skipWhileFactory(this, predicate, context, false))
        }, zip: function () {
          var iterables = [this].concat(arrCopy(arguments));
          return reify(this, zipWithFactory(this, defaultZipper, iterables))
        }, zipWith: function (zipper) {
          var iterables = arrCopy(arguments);
          iterables[0] = this;
          return reify(this, zipWithFactory(this, zipper, iterables))
        }
      });
      IndexedIterable.prototype[IS_INDEXED_SENTINEL] = true;
      IndexedIterable.prototype[IS_ORDERED_SENTINEL] = true;
      mixin(SetIterable, {
        get: function (value, notSetValue) {
          return this.has(value) ? value : notSetValue
        }, contains: function (value) {
          return this.has(value)
        }, keySeq: function () {
          return this.valueSeq()
        }
      });
      SetIterable.prototype.has = IterablePrototype.contains;
      mixin(KeyedSeq, KeyedIterable.prototype);
      mixin(IndexedSeq, IndexedIterable.prototype);
      mixin(SetSeq, SetIterable.prototype);
      mixin(KeyedCollection, KeyedIterable.prototype);
      mixin(IndexedCollection, IndexedIterable.prototype);
      mixin(SetCollection, SetIterable.prototype);
      function keyMapper(v, k) {
        return k
      }

      function entryMapper(v, k) {
        return [k, v]
      }

      function not(predicate) {
        return function () {
          return !predicate.apply(this, arguments)
        }
      }

      function neg(predicate) {
        return function () {
          return -predicate.apply(this, arguments)
        }
      }

      function quoteString(value) {
        return typeof value === "string" ? JSON.stringify(value) : value
      }

      function defaultZipper() {
        return arrCopy(arguments)
      }

      function defaultNegComparator(a, b) {
        return a < b ? 1 : a > b ? -1 : 0
      }

      function hashIterable(iterable) {
        if (iterable.size === Infinity) {
          return 0
        }
        var ordered = isOrdered(iterable);
        var keyed = isKeyed(iterable);
        var h = ordered ? 1 : 0;
        var size = iterable.__iterate(keyed ? ordered ? function (v, k) {
          h = 31 * h + hashMerge(hash(v), hash(k)) | 0
        } : function (v, k) {
          h = h + hashMerge(hash(v), hash(k)) | 0
        } : ordered ? function (v) {
          h = 31 * h + hash(v) | 0
        } : function (v) {
          h = h + hash(v) | 0
        });
        return murmurHashOfSize(size, h)
      }

      function murmurHashOfSize(size, h) {
        h = Math__imul(h, 3432918353);
        h = Math__imul(h << 15 | h >>> -15, 461845907);
        h = Math__imul(h << 13 | h >>> -13, 5);
        h = (h + 3864292196 | 0) ^ size;
        h = Math__imul(h ^ h >>> 16, 2246822507);
        h = Math__imul(h ^ h >>> 13, 3266489909);
        h = smi(h ^ h >>> 16);
        return h
      }

      function hashMerge(a, b) {
        return a ^ b + 2654435769 + (a << 6) + (a >> 2) | 0
      }

      var Immutable = {
        Iterable: Iterable,
        Seq: Seq,
        Collection: Collection,
        Map: Map,
        OrderedMap: OrderedMap,
        List: List,
        Stack: Stack,
        Set: Set,
        OrderedSet: OrderedSet,
        Record: Record,
        Range: Range,
        Repeat: Repeat,
        is: is,
        fromJS: fromJS
      };
      return Immutable
    })
  }, {}],
  61: [function (require, module, exports) {
    "use strict";
    var _interopRequire = function (obj) {
      return obj && obj.__esModule ? obj["default"] : obj
    };
    var Cycle = _interopRequire(require("cyclejs"));
    var _rxmarblesStylesUtils = require("rxmarbles/styles/utils");
    var mergeStyles = _rxmarblesStylesUtils.mergeStyles;
    var textUnselectable = _rxmarblesStylesUtils.textUnselectable;
    var elevation1Style = _rxmarblesStylesUtils.elevation1Style;
    var Rx = Cycle.Rx;
    var h = Cycle.h;
    var DiagramCompletionComponentModel = Cycle.createModel(function (Properties, Intent) {
      return {
        time$: Properties.get("time$"),
        isDraggable$: Properties.get("isDraggable$").startWith(false),
        isTall$: Properties.get("isTall$").startWith(false),
        style$: Properties.get("style$").startWith({thickness: "2px", height: "10px", color: "black"}),
        isHighlighted$: Rx.Observable.merge(Intent.get("startHighlight$").map(function () {
          return true
        }), Intent.get("stopHighlight$").map(function () {
          return false
        })).startWith(false)
      }
    });
    var DiagramCompletionComponentView = Cycle.createView(function (Model) {
      var draggableContainerStyle = {cursor: "ew-resize"};

      function createContainerStyle(inputStyle) {
        return {
          display: "inline-block",
          position: "relative",
          width: "calc(8 * " + inputStyle.thickness + ")",
          height: inputStyle.height,
          margin: "0 calc(-4 * " + inputStyle.thickness + ")"
        }
      }

      function createInnerStyle(inputStyle) {
        return {
          width: inputStyle.thickness,
          height: "50%",
          marginLeft: "calc(3.5 * " + inputStyle.thickness + ")",
          marginTop: "calc(" + inputStyle.height + " / 4.0)",
          backgroundColor: inputStyle.color
        }
      }

      var innerTallStyle = {height: "100%", marginTop: 0};

      function vrender(time, isDraggable, isTall, inputStyle, isHighlighted) {
        var containerStyle = createContainerStyle(inputStyle);
        var innerStyle = createInnerStyle(inputStyle);
        return h("div.completionRoot", {style: mergeStyles({left: "" + time + "%"}, containerStyle, isDraggable ? draggableContainerStyle : {})}, [h("div.completionInner", {style: mergeStyles(innerStyle, isDraggable && isHighlighted ? elevation1Style : null, isTall ? innerTallStyle : null)})])
      }

      return {vtree$: Rx.Observable.combineLatest(Model.get("time$"), Model.get("isDraggable$"), Model.get("isTall$"), Model.get("style$"), Model.get("isHighlighted$"), vrender)}
    });
    var DiagramCompletionComponentIntent = Cycle.createIntent(function (User) {
      return {
        startHighlight$: User.event$(".completionRoot", "mouseenter").map(function () {
          return 1
        }), stopHighlight$: User.event$(".completionRoot", "mouseleave").map(function () {
          return 1
        })
      }
    });

    function DiagramCompletionComponent(User, Properties) {
      var Model = DiagramCompletionComponentModel.clone();
      var View = DiagramCompletionComponentView.clone();
      var Intent = DiagramCompletionComponentIntent.clone();
      User.inject(View).inject(Model).inject(Properties, Intent)[1].inject(User)
    }

    module.exports = DiagramCompletionComponent
  }, {cyclejs: 51, "rxmarbles/styles/utils": 81}],
  62: [function (require, module, exports) {
    "use strict";
    var _interopRequire = function (obj) {
      return obj && obj.__esModule ? obj["default"] : obj
    };
    var _slicedToArray = function (arr, i) {
      if (Array.isArray(arr)) {
        return arr
      } else if (Symbol.iterator in Object(arr)) {
        var _arr = [];
        for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) {
          _arr.push(_step.value);
          if (i && _arr.length === i)break
        }
        return _arr
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance")
      }
    };
    var Cycle = _interopRequire(require("cyclejs"));
    var Immutable = _interopRequire(require("immutable"));
    var Rx = Cycle.Rx;
    module.exports = Cycle.createIntent(function (User) {
      var mouseMove$ = Rx.Observable.fromEvent(document, "mousemove");
      var mouseUp$ = Rx.Observable.fromEvent(document, "mouseup");

      function getPxToPercentageRatio(element) {
        var pxToPercentage = undefined;
        try {
          if (element && element.parentElement && element.parentElement.clientWidth) {
            pxToPercentage = 100 / element.parentElement.clientWidth
          } else {
            throw new Error("Invalid marble parent or parent width.")
          }
        } catch (err) {
          console.warn(err);
          pxToPercentage = .15
        }
        return pxToPercentage
      }

      function makeDeltaTime$(mouseDown$, resultFn) {
        return mouseDown$.map(function (downevent) {
          var target = downevent.currentTarget;
          var pxToPercentage = getPxToPercentageRatio(target);
          return mouseMove$.takeUntil(mouseUp$).pairwise().map(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 2);
            var ev1 = _ref2[0];
            var ev2 = _ref2[1];
            var dx = ev2.pageX - ev1.pageX;
            var deltaTime = dx * pxToPercentage;
            if (!!resultFn) {
              return resultFn(deltaTime, target)
            } else {
              return deltaTime
            }
          }).filter(function (x) {
            return x !== 0
          })
        }).concatAll()
      }

      return {
        changeMarbleTime$: makeDeltaTime$(User.event$(".diagramMarble", "mousedown"), function (deltaTime, target) {
          return Immutable.Map({deltaTime: deltaTime, id: target.attributes["data-marble-id"].value})
        }), changeEndTime$: makeDeltaTime$(User.event$(".diagramCompletion", "mousedown"))
      }
    })
  }, {cyclejs: 51, immutable: 60}],
  63: [function (require, module, exports) {
    "use strict";
    var _interopRequire = function (obj) {
      return obj && obj.__esModule ? obj["default"] : obj
    };
    var Cycle = _interopRequire(require("cyclejs"));
    var Rx = Cycle.Rx;
    module.exports = Cycle.createModel(function (Properties, Intent) {
      function findLargestMarbleTime(diagramData) {
        return diagramData.get("notifications").max(function (notifA, notifB) {
          if (notifA.get("time") < notifB.get("time")) {
            return -1
          }
          if (notifA.get("time") > notifB.get("time")) {
            return 1
          }
          return 0
        }).get("time")
      }

      function applyChangeMarbleTime(diagramData, marbleDelta) {
        return diagramData.set("notifications", diagramData.get("notifications").map(function (notif) {
          if (String(notif.get("id")) === String(marbleDelta.get("id"))) {
            var newTime = notif.get("time") + marbleDelta.get("deltaTime");
            return notif.set("time", newTime)
          } else {
            return notif
          }
        }))
      }

      function applyChangeEndTime(diagramData, endDelta) {
        return diagramData.set("end", diagramData.get("end") + endDelta)
      }

      function applyMarbleDataConstraints(marbleData) {
        var newTime = marbleData.get("time");
        newTime = Math.round(newTime);
        newTime = Math.min(newTime, 100);
        newTime = Math.max(0, newTime);
        return marbleData.set("time", newTime)
      }

      function applyEndTimeConstraint(diagramData) {
        var largestMarbleTime = findLargestMarbleTime(diagramData);
        var newEndTime = diagramData.get("end");
        newEndTime = Math.max(newEndTime, largestMarbleTime);
        newEndTime = Math.round(newEndTime);
        newEndTime = Math.min(newEndTime, 100);
        newEndTime = Math.max(0, newEndTime);
        return diagramData.set("end", newEndTime)
      }

      function applyDiagramDataConstraints(diagramData) {
        var newDiagramData = diagramData.set("notifications", diagramData.get("notifications").map(applyMarbleDataConstraints));
        newDiagramData = applyEndTimeConstraint(newDiagramData);
        return newDiagramData
      }

      function newDiagramDataScanner(prev, curr) {
        var currentIsDiagramData = !!curr && !!curr.get && !!curr.get("notifications");
        if (!currentIsDiagramData) {
          var previousIsDiagramData = !!prev && !!prev.get("notifications");
          if (!previousIsDiagramData) {
            console.warn("Inconsistency in DiagramComponent.makeNewDiagramData$()")
          }
          var diagramData = prev;
          var changeInstructions = curr;
          var newDiagramData = undefined;
          if (typeof changeInstructions === "number") {
            newDiagramData = applyChangeEndTime(diagramData, changeInstructions)
          } else {
            newDiagramData = applyChangeMarbleTime(diagramData, changeInstructions)
          }
          return newDiagramData.set("isInitialData", false)
        } else {
          return curr.set("isInitialData", true)
        }
      }

      function makeNewDiagramData$(data$, changeMarbleTime$, changeEndTime$, interactive$) {
        return data$.merge(changeMarbleTime$).merge(changeEndTime$).scan(newDiagramDataScanner).filter(function (diagramData) {
          return !diagramData.get("isInitialData")
        }).map(applyDiagramDataConstraints).pausable(interactive$)
      }

      return {
        data$: Properties.get("data$").distinctUntilChanged(),
        newData$: makeNewDiagramData$(Properties.get("data$").distinctUntilChanged(), Intent.get("changeMarbleTime$"), Intent.get("changeEndTime$"), Properties.get("interactive$")),
        isInteractive$: Properties.get("interactive$").startWith(false)
      }
    })
  }, {cyclejs: 51}],
  64: [function (require, module, exports) {
    "use strict";
    var _interopRequire = function (obj) {
      return obj && obj.__esModule ? obj["default"] : obj
    };
    var Cycle = _interopRequire(require("cyclejs"));
    var Colors = _interopRequire(require("rxmarbles/styles/colors"));
    var Dimens = _interopRequire(require("rxmarbles/styles/dimens"));
    var Fonts = _interopRequire(require("rxmarbles/styles/fonts"));
    var _rxmarblesStylesUtils = require("rxmarbles/styles/utils");
    var mergeStyles = _rxmarblesStylesUtils.mergeStyles;
    var textUnselectable = _rxmarblesStylesUtils.textUnselectable;
    var Rx = Cycle.Rx;
    var h = Cycle.h;
    module.exports = Cycle.createView(function (Model) {
      var MARBLE_WIDTH = 5;
      var diagramSidePadding = Dimens.spaceMedium;
      var diagramVerticalMargin = Dimens.spaceLarge;
      var diagramArrowThickness = "2px";
      var diagramArrowSidePadding = Dimens.spaceLarge;
      var diagramArrowHeadSize = "8px";
      var diagramArrowColor = Colors.black;
      var diagramMarbleSize = Dimens.spaceLarge;
      var diagramCompletionHeight = "44px";

      function vrenderMarble(marbleData) {
        var isDraggable = arguments[1] === undefined ? false : arguments[1];
        return h("x-marble.diagramMarble", {
          data: marbleData,
          isDraggable: isDraggable,
          style: {size: diagramMarbleSize}
        })
      }

      function vrenderCompletion(diagramData) {
        var isDraggable = arguments[1] === undefined ? false : arguments[1];
        var endTime = diagramData.get("end");
        var isTall = diagramData.get("notifications").some(function (marbleData) {
          return Math.abs(marbleData.get("time") - diagramData.get("end")) <= MARBLE_WIDTH * .5
        });
        return h("x-diagram-completion.diagramCompletion", {
          time: endTime,
          isDraggable: isDraggable,
          isTall: isTall,
          style: {thickness: diagramArrowThickness, color: diagramArrowColor, height: diagramCompletionHeight}
        })
      }

      var diagramStyle = mergeStyles({
        position: "relative",
        display: "block",
        width: "100%",
        height: "calc(" + diagramMarbleSize + " + 2 * " + diagramVerticalMargin + ")",
        overflow: "visible",
        cursor: "default"
      }, textUnselectable);

      function vrenderDiagramArrow() {
        return h("div.diagramArrow", {
          style: {
            backgroundColor: diagramArrowColor,
            height: diagramArrowThickness,
            position: "absolute",
            top: "calc(" + diagramVerticalMargin + " + (" + diagramMarbleSize + " / 2))",
            left: diagramSidePadding,
            right: diagramSidePadding
          }
        })
      }

      function vrenderDiagramArrowHead() {
        return h("div.diagramArrowHead", {
          style: {
            width: 0,
            height: 0,
            borderTop: "" + diagramArrowHeadSize + " solid transparent",
            borderBottom: "" + diagramArrowHeadSize + " solid transparent",
            borderLeft: "calc(2 * " + diagramArrowHeadSize + ") solid " + diagramArrowColor,
            display: "inline-block",
            right: "calc(" + diagramSidePadding + " - 1px)",
            position: "absolute",
            top: "calc(" + diagramVerticalMargin + " + (" + diagramMarbleSize + " / 2) \n        - " + diagramArrowHeadSize + " + (" + diagramArrowThickness + " / 2))"
          }
        })
      }

      var diagramBodyStyle = {
        position: "absolute",
        left: "calc(" + diagramArrowSidePadding + " + " + diagramSidePadding + " \n        + (" + diagramMarbleSize + " / 2))",
        right: "calc(" + diagramArrowSidePadding + " + " + diagramSidePadding + " \n        + (" + diagramMarbleSize + " / 2))",
        top: "calc(" + diagramVerticalMargin + " + (" + diagramMarbleSize + " / 2))",
        height: diagramCompletionHeight,
        marginTop: "calc(0px - (" + diagramCompletionHeight + " / 2))"
      };

      function vrenderDiagram(data, isInteractive) {
        var marblesVTree = data.get("notifications").map(function (notification) {
          return vrenderMarble(notification, isInteractive)
        }).toArray();
        var completionVTree = vrenderCompletion(data, isInteractive);
        return h("div", {style: diagramStyle}, [vrenderDiagramArrow(), vrenderDiagramArrowHead(), h("div", {style: diagramBodyStyle}, [completionVTree].concat(marblesVTree))])
      }

      return {vtree$: Rx.Observable.combineLatest(Model.get("data$").merge(Model.get("newData$")), Model.get("isInteractive$"), vrenderDiagram)}
    })
  }, {
    cyclejs: 51,
    "rxmarbles/styles/colors": 78,
    "rxmarbles/styles/dimens": 79,
    "rxmarbles/styles/fonts": 80,
    "rxmarbles/styles/utils": 81
  }],
  65: [function (require, module, exports) {
    "use strict";
    var _interopRequire = function (obj) {
      return obj && obj.__esModule ? obj["default"] : obj
    };
    var Cycle = _interopRequire(require("cyclejs"));
    var DiagramComponentModel = _interopRequire(require("rxmarbles/components/diagram/diagram-model"));
    var DiagramComponentView = _interopRequire(require("rxmarbles/components/diagram/diagram-view"));
    var DiagramComponentIntent = _interopRequire(require("rxmarbles/components/diagram/diagram-intent"));

    function DiagramComponent(User, Properties) {
      var Model = DiagramComponentModel.clone();
      var View = DiagramComponentView.clone();
      var Intent = DiagramComponentIntent.clone();
      User.inject(View).inject(Model).inject(Properties, Intent)[1].inject(User);
      return {newdata$: Model.get("newData$")}
    }

    module.exports = DiagramComponent
  }, {
    cyclejs: 51,
    "rxmarbles/components/diagram/diagram-intent": 62,
    "rxmarbles/components/diagram/diagram-model": 63,
    "rxmarbles/components/diagram/diagram-view": 64
  }],
  66: [function (require, module, exports) {
    "use strict";
    var _interopRequire = function (obj) {
      return obj && obj.__esModule ? obj["default"] : obj
    };
    var Cycle = _interopRequire(require("cyclejs"));
    var svg = _interopRequire(require("cyclejs/node_modules/virtual-dom/virtual-hyperscript/svg"));
    var Colors = _interopRequire(require("rxmarbles/styles/colors"));
    var _rxmarblesStylesUtils = require("rxmarbles/styles/utils");
    var mergeStyles = _rxmarblesStylesUtils.mergeStyles;
    var svgElevation1Style = _rxmarblesStylesUtils.svgElevation1Style;
    var textUnselectable = _rxmarblesStylesUtils.textUnselectable;
    var Rx = Cycle.Rx;
    var h = Cycle.h;
    var MarbleModel = Cycle.createModel(function (Properties, Intent) {
      return {
        data$: Properties.get("data$"),
        isDraggable$: Properties.get("isDraggable$").startWith(false),
        style$: Properties.get("style$").startWith({}),
        isHighlighted$: Rx.Observable.merge(Intent.get("startHighlight$").map(function () {
          return true
        }), Intent.get("stopHighlight$").map(function () {
          return false
        })).startWith(false)
      }
    });
    var MarbleView = Cycle.createView(function (Model) {
      var POSSIBLE_COLORS = [Colors.blue, Colors.green, Colors.yellow, Colors.red];
      var draggableContainerStyle = {cursor: "ew-resize"};

      function createContainerStyle(inputStyle) {
        return {
          width: inputStyle.size,
          height: inputStyle.size,
          position: "relative",
          display: "inline-block",
          margin: "calc(0px - (" + inputStyle.size + " / 2))",
          bottom: "calc((100% - " + inputStyle.size + ") / 2)",
          cursor: "default"
        }
      }

      function vrenderSvg(data, isDraggable, inputStyle, isHighlighted) {
        var color = POSSIBLE_COLORS[data.get("id") % POSSIBLE_COLORS.length];
        return svg("svg.marbleShape", {
          style: mergeStyles({
            overflow: "visible",
            width: inputStyle.size,
            height: inputStyle.size
          }, isDraggable && isHighlighted ? svgElevation1Style : {}), attributes: {viewBox: "0 0 1 1"}
        }, [svg("circle", {
          style: {stroke: Colors.black, fill: color},
          attributes: {cx: .5, cy: .5, r: .47, "stroke-width": "0.06px"}
        })])
      }

      function vrenderInnerContent(data, inputStyle) {
        return h("p.marbleContent", {
          style: mergeStyles({
            position: "absolute",
            width: "100%",
            height: "100%",
            top: "0",
            margin: "0",
            textAlign: "center",
            lineHeight: inputStyle.size
          }, textUnselectable)
        }, "" + data.get("content"))
      }

      function vrender(data, isDraggable, inputStyle, isHighlighted) {
        return h("div.marbleRoot", {
          style: mergeStyles({
            left: "" + data.get("time") + "%",
            zIndex: data.get("time")
          }, createContainerStyle(inputStyle), isDraggable ? draggableContainerStyle : null),
          attributes: {"data-marble-id": data.get("id")}
        }, [vrenderSvg(data, isDraggable, inputStyle, isHighlighted), vrenderInnerContent(data, inputStyle)])
      }

      return {vtree$: Rx.Observable.combineLatest(Model.get("data$"), Model.get("isDraggable$"), Model.get("style$"), Model.get("isHighlighted$"), vrender)}
    });
    var MarbleIntent = Cycle.createIntent(function (User) {
      return {
        startHighlight$: User.event$(".marbleRoot", "mouseenter").map(function () {
          return 1
        }), stopHighlight$: User.event$(".marbleRoot", "mouseleave").map(function () {
          return 1
        })
      }
    });

    function MarbleComponent(User, Properties) {
      var Model = MarbleModel.clone();
      var View = MarbleView.clone();
      var Intent = MarbleIntent.clone();
      User.inject(View).inject(Model).inject(Properties, Intent)[1].inject(User)
    }

    module.exports = MarbleComponent
  }, {
    cyclejs: 51,
    "cyclejs/node_modules/virtual-dom/virtual-hyperscript/svg": 34,
    "rxmarbles/styles/colors": 78,
    "rxmarbles/styles/utils": 81
  }],
  67: [function (require, module, exports) {
    "use strict";
    var _interopRequire = function (obj) {
      return obj && obj.__esModule ? obj["default"] : obj
    };
    var Rx = require("cyclejs").Rx;
    var Utils = _interopRequire(require("rxmarbles/components/sandbox/utils"));
    var Immutable = _interopRequire(require("immutable"));

    function getNotifications(diagram) {
      var last = diagram[diagram.length - 1];
      if (typeof last === "number") {
        return Immutable.List(diagram.slice(0, -1))
      } else {
        return Immutable.List(diagram)
      }
    }

    function prepareNotification(input, diagramId) {
      if (input && input.get && typeof input.get("time") !== "undefined") {
        return input
      }
      return Immutable.Map({}).set("time", input.t).set("content", input.d).set("diagramId", diagramId).set("id", Utils.calculateNotificationHash({
        time: input.t,
        content: input.d
      }))
    }

    function prepareInputDiagram(diagram) {
      var indexInDiagramArray = arguments[1] === undefined ? 0 : arguments[1];
      var last = diagram[diagram.length - 1];
      return Immutable.Map({}).set("notifications", getNotifications(diagram).map(function (notification) {
        return prepareNotification(notification, indexInDiagramArray)
      })).set("end", typeof last === "number" ? last : 100).set("id", indexInDiagramArray)
    }

    function augmentWithExampleKey(diagramData, exampleKey) {
      return diagramData.set("example", exampleKey).set("notifications", diagramData.get("notifications").map(function (notif) {
        return notif.set("example", exampleKey)
      }))
    }

    function replaceDiagramDataIn(diagrams, newDiagramData) {
      return diagrams.map(function (diagramData) {
        if (diagramData.get("id") === newDiagramData.get("id")) {
          return newDiagramData
        } else {
          return diagramData
        }
      })
    }

    function makeNewInputDiagramsData$(changeInputDiagram$, inputs$) {
      return Rx.Observable.merge(changeInputDiagram$, inputs$).scan(function (prev, curr) {
        var currentIsDiagramData = !!curr && curr.get && !!curr.get("notifications");
        if (!currentIsDiagramData) {
          return curr.set("isInitialData", true)
        }
        if (!prev || !prev.get || !Array.isArray(prev.get("diagrams"))) {
          console.warn("Inconsistency in SandboxComponent.makeNewInputDiagramsData$()")
        }
        var inputs = prev;
        var newDiagramData = curr;
        return inputs.set("diagrams", replaceDiagramDataIn(inputs.get("diagrams"), newDiagramData)).set("isInitialData", false)
      }).filter(function (x) {
        return !x.get("isInitialData")
      })
    }

    module.exports = {
      prepareInputDiagram: prepareInputDiagram,
      augmentWithExampleKey: augmentWithExampleKey,
      makeNewInputDiagramsData$: makeNewInputDiagramsData$
    }
  }, {cyclejs: 51, immutable: 60, "rxmarbles/components/sandbox/utils": 70}],
  68: [function (require, module, exports) {
    "use strict";
    var _interopRequire = function (obj) {
      return obj && obj.__esModule ? obj["default"] : obj
    };
    var Rx = require("cyclejs").Rx;
    var Utils = _interopRequire(require("rxmarbles/components/sandbox/utils"));
    var Immutable = _interopRequire(require("immutable"));
    var MAX_VT_TIME = 100;

    function makeScheduler() {
      var scheduler = new Rx.VirtualTimeScheduler(0, function (x, y) {
        if (x > y) {
          return 1
        }
        if (x < y) {
          return -1
        }
        return 0
      });
      scheduler.add = function (absolute, relative) {
        return absolute + relative
      };
      scheduler.toDateTimeOffset = function (absolute) {
        return Math.floor(absolute)
      };
      scheduler.toRelative = function (timeSpan) {
        return timeSpan
      };
      return scheduler
    }

    function justIncomplete(item, scheduler) {
      return new Rx.AnonymousObservable(function (observer) {
        return scheduler.schedule(function () {
          observer.onNext(item)
        })
      })
    }

    function toVTStream(diagramData, scheduler) {
      var singleMarbleStreams = diagramData.get("notifications").map(function (item) {
        return justIncomplete(item, scheduler).delay(item.get("time"), scheduler)
      }).toArray();
      var correctedEndTime = diagramData.get("end") + .01;
      return Rx.Observable.merge(singleMarbleStreams).takeUntilWithTime(correctedEndTime, scheduler).publish().refCount()
    }

    function getDiagramPromise(stream, scheduler) {
      var diagram = {};
      var subject = new Rx.BehaviorSubject([]);
      stream.observeOn(scheduler).timestamp(scheduler).map(function (x) {
        if (typeof x.value !== "object") {
          x.value = Immutable.Map({content: x.value, id: Utils.calculateNotificationContentHash(x.value)})
        }
        return x.value.set("time", x.timestamp / MAX_VT_TIME * 100)
      }).reduce(function (acc, x) {
        acc.push(x);
        return acc
      }, []).subscribe(function onNext(x) {
        diagram.notifications = x;
        subject.onNext(diagram)
      }, function onError(e) {
        console.warn("Error in the diagram promise stream: " + e)
      }, function onComplete() {
        diagram.end = scheduler.now()
      });
      return subject.asObservable()
    }

    function toImmutableDiagramData(diagramData) {
      return Immutable.Map({}).set("notifications", Immutable.List(diagramData.notifications).map(Immutable.Map)).set("end", diagramData.end)
    }

    function getOutputDiagram$(example$, inputDiagrams$) {
      return inputDiagrams$.withLatestFrom(example$, function (diagrams, example) {
        var vtscheduler = makeScheduler();
        var inputVTStreams = diagrams.get("diagrams").map(function (diagram) {
          return toVTStream(diagram, vtscheduler)
        });
        var outputVTStream = example.get("apply")(inputVTStreams, vtscheduler);
        var correctedMaxTime = MAX_VT_TIME + .02;
        outputVTStream = outputVTStream.takeUntilWithTime(correctedMaxTime, vtscheduler);
        var outputDiagram = getDiagramPromise(outputVTStream, vtscheduler, MAX_VT_TIME);
        vtscheduler.start();
        return outputDiagram.map(toImmutableDiagramData)
      }).mergeAll()
    }

    module.exports = {getOutputDiagram$: getOutputDiagram$}
  }, {cyclejs: 51, immutable: 60, "rxmarbles/components/sandbox/utils": 70}],
  69: [function (require, module, exports) {
    "use strict";
    var _interopRequire = function (obj) {
      return obj && obj.__esModule ? obj["default"] : obj
    };
    var Cycle = _interopRequire(require("cyclejs"));
    var Examples = _interopRequire(require("rxmarbles/data/examples"));
    var _rxmarblesComponentsSandboxSandboxInput = require("rxmarbles/components/sandbox/sandbox-input");
    var prepareInputDiagram = _rxmarblesComponentsSandboxSandboxInput.prepareInputDiagram;
    var augmentWithExampleKey = _rxmarblesComponentsSandboxSandboxInput.augmentWithExampleKey;
    var makeNewInputDiagramsData$ = _rxmarblesComponentsSandboxSandboxInput.makeNewInputDiagramsData$;
    var getOutputDiagram$ = require("rxmarbles/components/sandbox/sandbox-output").getOutputDiagram$;
    var Immutable = _interopRequire(require("immutable"));
    var Colors = _interopRequire(require("rxmarbles/styles/colors"));
    var Dimens = _interopRequire(require("rxmarbles/styles/dimens"));
    var Fonts = _interopRequire(require("rxmarbles/styles/fonts"));
    var _rxmarblesStylesUtils = require("rxmarbles/styles/utils");
    var mergeStyles = _rxmarblesStylesUtils.mergeStyles;
    var elevation1Style = _rxmarblesStylesUtils.elevation1Style;
    var elevation2Style = _rxmarblesStylesUtils.elevation2Style;
    var elevation2Before = _rxmarblesStylesUtils.elevation2Before;
    var elevation2After = _rxmarblesStylesUtils.elevation2After;
    var Rx = Cycle.Rx;
    var h = Cycle.h;
    var SandboxComponentModel = Cycle.createModel(function (Properties, Intent) {
      var isTruthy = function (x) {
        return !!x
      };
      var example$ = Properties.get("route$").filter(isTruthy).map(function (key) {
        return Immutable.Map(Examples[key]).set("key", key)
      });
      var inputDiagrams$ = example$.map(function (example) {
        return Immutable.Map({
          diagrams: example.get("inputs").map(prepareInputDiagram).map(function (diag) {
            return augmentWithExampleKey(diag, example.get("key"))
          })
        })
      });
      var newInputDiagrams$ = makeNewInputDiagramsData$(Intent.get("changeInputDiagram$"), inputDiagrams$);
      var allInputDiagrams$ = inputDiagrams$.merge(newInputDiagrams$);
      return {
        inputDiagrams$: inputDiagrams$,
        operatorLabel$: example$.map(function (example) {
          return example.get("label")
        }),
        outputDiagram$: getOutputDiagram$(example$, allInputDiagrams$),
        width$: Properties.get("width$").startWith("100%")
      }
    });
    var SandboxComponentView = Cycle.createView(function (Model) {
      function vrenderOperatorLabel(label) {
        var fontSize = label.length >= 45 ? 1.3 : label.length >= 30 ? 1.5 : 2;
        var style = {fontFamily: Fonts.fontCode, fontWeight: "400", fontSize: "" + fontSize + "rem"};
        return h("span.operatorLabel", {style: style}, label)
      }

      function vrenderOperator(label) {
        var style = mergeStyles({
          border: "1px solid rgba(0,0,0,0.06)",
          padding: Dimens.spaceMedium,
          textAlign: "center"
        }, elevation2Style);
        return h("div.operatorBox", {style: style}, [elevation2Before, vrenderOperatorLabel(label), elevation2After])
      }

      function getSandboxStyle(width) {
        return mergeStyles({background: Colors.white, width: width, borderRadius: "2px"}, elevation1Style)
      }

      return {
        vtree$: Rx.Observable.combineLatest(Model.get("inputDiagrams$"), Model.get("operatorLabel$"), Model.get("outputDiagram$"), Model.get("width$"), function (inputDiagrams, operatorLabel, outputDiagram, width) {
          return h("div.sandboxRoot", {style: getSandboxStyle(width)}, [inputDiagrams.get("diagrams").map(function (diagram) {
            return h("x-diagram.sandboxInputDiagram", {data: diagram, interactive: true})
          }), vrenderOperator(operatorLabel), h("x-diagram.sandboxOutputDiagram", {
            data: outputDiagram,
            interactive: false
          })])
        })
      }
    });
    var SandboxComponentIntent = Cycle.createIntent(function (User) {
      return {
        changeInputDiagram$: User.event$(".sandboxInputDiagram", "newdata").map(function (ev) {
          return ev.data
        })
      }
    });

    function SandboxComponent(User, Properties) {
      var Model = SandboxComponentModel.clone();
      var View = SandboxComponentView.clone();
      var Intent = SandboxComponentIntent.clone();
      User.inject(View).inject(Model).inject(Properties, Intent)[1].inject(User)
    }

    module.exports = SandboxComponent
  }, {
    cyclejs: 51,
    immutable: 60,
    "rxmarbles/components/sandbox/sandbox-input": 67,
    "rxmarbles/components/sandbox/sandbox-output": 68,
    "rxmarbles/data/examples": 74,
    "rxmarbles/styles/colors": 78,
    "rxmarbles/styles/dimens": 79,
    "rxmarbles/styles/fonts": 80,
    "rxmarbles/styles/utils": 81
  }],
  70: [function (require, module, exports) {
    "use strict";
    function calculateNotificationContentHash(content) {
      var SOME_PRIME_NUMBER = 877;
      if (typeof content === "string") {
        return content.split("").map(function (x) {
          return x.charCodeAt(0)
        }).reduce(function (x, y) {
          return x + y
        })
      } else if (typeof content === "number") {
        return content * SOME_PRIME_NUMBER
      } else if (typeof content === "boolean") {
        return content ? SOME_PRIME_NUMBER : SOME_PRIME_NUMBER * 3
      }
    }

    function calculateNotificationHash(marbleData) {
      var SMALL_PRIME = 7;
      var LARGE_PRIME = 1046527;
      var MAX = 1e5;
      var contentHash = calculateNotificationContentHash(marbleData.content);
      return (marbleData.time + contentHash + SMALL_PRIME) * LARGE_PRIME % MAX
    }

    module.exports = {
      calculateNotificationHash: calculateNotificationHash,
      calculateNotificationContentHash: calculateNotificationContentHash
    }
  }, {}],
  71: [function (require, module, exports) {
    "use strict";
    var Rx = require("cyclejs").Rx;
    module.exports = {
      every: {
        label: "every(x => x < 10)",
        inputs: [[{t: 5, d: 1}, {t: 15, d: 2}, {t: 25, d: 3}, {t: 35, d: 4}, {t: 65, d: 5}, 80]],
        apply: function (inputs) {
          return inputs[0].every(function (x) {
            return x.get("content") < 10
          })
        }
      },
      some: {
        label: "some(x => x > 10)",
        inputs: [[{t: 5, d: 2}, {t: 15, d: 30}, {t: 25, d: 22}, {t: 35, d: 5}, {t: 45, d: 60}, {t: 55, d: 1}]],
        apply: function (inputs) {
          return inputs[0].some(function (x) {
            return x.get("content") > 10
          })
        }
      },
      contains: {
        label: "contains(22)",
        inputs: [[{t: 5, d: 2}, {t: 15, d: 30}, {t: 25, d: 22}, {t: 35, d: 5}, {t: 45, d: 60}, {t: 55, d: 1}]],
        apply: function (inputs) {
          return inputs[0].map(function (x) {
            return x.get("content")
          }).contains(22)
        }
      },
      sequenceEqual: {
        label: "sequenceEqual",
        inputs: [[{t: 5, d: 1}, {t: 15, d: 2}, {t: 25, d: 3}, {t: 35, d: 4}, {t: 65, d: 5}, 85], [{t: 2, d: 1}, {
          t: 20,
          d: 2
        }, {t: 40, d: 3}, {t: 70, d: 4}, {t: 77, d: 5}, 85]],
        apply: function (inputs) {
          return inputs[0].sequenceEqual(inputs[1], function (x, y) {
            return x.get("content") === y.get("content")
          })
        }
      }
    }
  }, {cyclejs: 51}],
  72: [function (require, module, exports) {
    "use strict";
    var Rx = require("cyclejs").Rx;
    module.exports = {
      combineLatest: {
        label: 'combineLatest((x, y) => "" + x + y)',
        inputs: [[{t: 0, d: 1}, {t: 20, d: 2}, {t: 65, d: 3}, {t: 75, d: 4}, {t: 92, d: 5}], [{t: 10, d: "A"}, {
          t: 25,
          d: "B"
        }, {t: 50, d: "C"}, {t: 57, d: "D"}]],
        apply: function (inputs) {
          return Rx.Observable.combineLatest(inputs[0], inputs[1], function (x, y) {
            return "" + x.get("content") + y.get("content")
          })
        }
      },
      concat: {
        label: "concat",
        inputs: [[{t: 0, d: 1}, {t: 15, d: 1}, {t: 50, d: 1}, 57], [{t: 0, d: 2}, {t: 8, d: 2}, 12]],
        apply: function (inputs) {
          return Rx.Observable.concat(inputs)
        }
      },
      merge: {
        label: "merge",
        inputs: [[{t: 0, d: 20}, {t: 15, d: 40}, {t: 30, d: 60}, {t: 45, d: 80}, {t: 60, d: 100}], [{
          t: 37,
          d: 1
        }, {t: 68, d: 1}]],
        apply: function (inputs) {
          return Rx.Observable.merge(inputs)
        }
      },
      sample: {
        label: "sample",
        inputs: [[{t: 0, d: 1}, {t: 20, d: 2}, {t: 40, d: 3}, {t: 60, d: 4}, {t: 80, d: 5}], [{t: 10, d: "A"}, {
          t: 25,
          d: "B"
        }, {t: 33, d: "C"}, {t: 70, d: "D"}, 90]],
        apply: function (inputs) {
          return inputs[0].sample(inputs[1])
        }
      },
      startWith: {
        label: "startWith(1)", inputs: [[{t: 30, d: 2}, {t: 40, d: 3}]], apply: function (inputs, scheduler) {
          return inputs[0].startWith(scheduler, 1)
        }
      },
      withLatestFrom: {
        label: 'withLatestFrom((x, y) => "" + x + y)',
        inputs: [[{t: 0, d: 1}, {t: 20, d: 2}, {t: 65, d: 3}, {t: 75, d: 4}, {t: 92, d: 5}], [{t: 10, d: "A"}, {
          t: 25,
          d: "B"
        }, {t: 50, d: "C"}, {t: 57, d: "D"}]],
        apply: function (inputs) {
          return inputs[0].withLatestFrom(inputs[1], function (x, y) {
            return "" + x.get("content") + y.get("content")
          })
        }
      },
      zip: {
        label: "zip",
        inputs: [[{t: 0, d: 1}, {t: 20, d: 2}, {t: 65, d: 3}, {t: 75, d: 4}, {t: 92, d: 5}], [{t: 10, d: "A"}, {
          t: 25,
          d: "B"
        }, {t: 50, d: "C"}, {t: 57, d: "D"}]],
        apply: function (inputs) {
          return Rx.Observable.zip(inputs[0], inputs[1], function (x, y) {
            return "" + x.get("content") + y.get("content")
          })
        }
      }
    }
  }, {cyclejs: 51}],
  73: [function (require, module, exports) {
    "use strict";
    var Rx = require("cyclejs").Rx;
    module.exports = {
      amb: {
        label: "amb",
        inputs: [[{t: 10, d: 20}, {t: 20, d: 40}, {t: 30, d: 60}], [{t: 5, d: 1}, {t: 15, d: 2}, {t: 25, d: 3}], [{
          t: 20,
          d: 0
        }, {t: 32, d: 0}, {t: 44, d: 0}]],
        apply: function (inputs) {
          return Rx.Observable.amb(inputs)
        }
      }
    }
  }, {cyclejs: 51}],
  74: [function (require, module, exports) {
    "use strict";
    var transformExamples = require("rxmarbles/data/transform-examples");
    var combineExamples = require("rxmarbles/data/combine-examples");
    var filterExamples = require("rxmarbles/data/filter-examples");
    var mathExamples = require("rxmarbles/data/math-examples");
    var booleanExamples = require("rxmarbles/data/boolean-examples");
    var conditionalExamples = require("rxmarbles/data/conditional-examples");

    function merge() {
      var args = 1 <= arguments.length ? Array.prototype.slice.call(arguments) : [];
      var result = {};
      for (var i = 0; i < args.length; i++) {
        var object = args[i];
        for (var name in object) {
          if (!object.hasOwnProperty(name))continue;
          result[name] = object[name]
        }
      }
      return result
    }

    function applyCategory(examples, categoryName) {
      for (var key in examples) {
        if (!examples.hasOwnProperty(key))continue;
        examples[key].category = categoryName
      }
      return examples
    }

    module.exports = merge(applyCategory(transformExamples, "Transforming Operators"), applyCategory(combineExamples, "Combining Operators"), applyCategory(filterExamples, "Filtering Operators"), applyCategory(mathExamples, "Mathematical Operators"), applyCategory(booleanExamples, "Boolean Operators"), applyCategory(conditionalExamples, "Conditional Operators"))
  }, {
    "rxmarbles/data/boolean-examples": 71,
    "rxmarbles/data/combine-examples": 72,
    "rxmarbles/data/conditional-examples": 73,
    "rxmarbles/data/filter-examples": 75,
    "rxmarbles/data/math-examples": 76,
    "rxmarbles/data/transform-examples": 77
  }],
  75: [function (require, module, exports) {
    "use strict";
    var Rx = require("cyclejs").Rx;
    module.exports = {
      distinct: {
        label: "distinct",
        inputs: [[{t: 5, d: 1}, {t: 20, d: 2}, {t: 35, d: 2}, {t: 60, d: 1}, {t: 70, d: 3}]],
        apply: function (inputs) {
          return inputs[0].distinct(function (x) {
            return x.get("content")
          })
        }
      },
      distinctUntilChanged: {
        label: "distinctUntilChanged",
        inputs: [[{t: 5, d: 1}, {t: 20, d: 2}, {t: 35, d: 2}, {t: 60, d: 1}, {t: 70, d: 3}]],
        apply: function (inputs) {
          return inputs[0].distinctUntilChanged(function (x) {
            return x.get("content")
          })
        }
      },
      elementAt: {
        label: "elementAt(2)",
        inputs: [[{t: 30, d: 1}, {t: 40, d: 2}, {t: 65, d: 3}, {t: 75, d: 4}]],
        apply: function (inputs, scheduler) {
          return inputs[0].elementAt(2)
        }
      },
      filter: {
        label: "filter(x => x > 10)",
        inputs: [[{t: 5, d: 2}, {t: 15, d: 30}, {t: 25, d: 22}, {t: 35, d: 5}, {t: 45, d: 60}, {t: 55, d: 1}]],
        apply: function (inputs) {
          return inputs[0].filter(function (x) {
            return x.get("content") > 10
          })
        }
      },
      find: {
        label: "find(x => x > 10)",
        inputs: [[{t: 5, d: 2}, {t: 15, d: 30}, {t: 25, d: 22}, {t: 35, d: 5}, {t: 45, d: 60}, {t: 55, d: 1}]],
        apply: function (inputs, scheduler) {
          return inputs[0].find(function (x) {
            return x.get("content") > 10
          })
        }
      },
      first: {
        label: "first",
        inputs: [[{t: 30, d: 1}, {t: 40, d: 2}, {t: 65, d: 3}, {t: 75, d: 4}, 85]],
        apply: function (inputs) {
          return inputs[0].first()
        }
      },
      last: {
        label: "last",
        inputs: [[{t: 30, d: 1}, {t: 40, d: 2}, {t: 65, d: 3}, {t: 75, d: 4}, 85]],
        apply: function (inputs) {
          return inputs[0].last()
        }
      },
      pausable: {
        label: "pausable",
        inputs: [[{t: 0, d: 1}, {t: 10, d: 2}, {t: 20, d: 3}, {t: 30, d: 4}, {t: 40, d: 5}, {t: 50, d: 6}, {
          t: 60,
          d: 7
        }, {t: 70, d: 8}, {t: 80, d: 9}], [{t: 15, d: true}, {t: 35, d: false}, {t: 55, d: true}]],
        apply: function (inputs) {
          inputs[0].subscribe(function () {
            return 0
          });
          var subject = new Rx.Subject;
          inputs[1].subscribe(function (x) {
            return subject.onNext(x.get("content"))
          });
          return inputs[0].pausable(subject)
        }
      },
      pausableBuffered: {
        label: "pausableBuffered",
        inputs: [[{t: 0, d: 1}, {t: 10, d: 2}, {t: 20, d: 3}, {t: 30, d: 4}, {t: 40, d: 5}, {t: 50, d: 6}, {
          t: 60,
          d: 7
        }, {t: 70, d: 8}, {t: 80, d: 9}], [{t: 15, d: true}, {t: 35, d: false}, {t: 55, d: true}]],
        apply: function (inputs) {
          inputs[0].subscribe(function () {
            return 0
          });
          var subject = new Rx.Subject;
          inputs[1].subscribe(function (x) {
            return subject.onNext(x.get("content"))
          });
          return inputs[0].pausableBuffered(subject)
        }
      },
      skip: {
        label: "skip(2)",
        inputs: [[{t: 30, d: 1}, {t: 40, d: 2}, {t: 65, d: 3}, {t: 75, d: 4}]],
        apply: function (inputs) {
          return inputs[0].skip(2)
        }
      },
      skipLast: {
        label: "skipLast(2)",
        inputs: [[{t: 30, d: 1}, {t: 40, d: 2}, {t: 65, d: 3}, {t: 75, d: 4}]],
        apply: function (inputs) {
          return inputs[0].skipLast(2)
        }
      },
      skipUntil: {
        label: "skipUntil",
        inputs: [[{t: 0, d: 1}, {t: 10, d: 2}, {t: 20, d: 3}, {t: 30, d: 4}, {t: 40, d: 5}, {t: 50, d: 6}, {
          t: 60,
          d: 7
        }, {t: 70, d: 8}, {t: 80, d: 9}], [{t: 45, d: 0}, {t: 73, d: 0}]],
        apply: function (inputs) {
          return inputs[0].skipUntil(inputs[1])
        }
      },
      take: {
        label: "take(2)",
        inputs: [[{t: 30, d: 1}, {t: 40, d: 2}, {t: 65, d: 3}, {t: 75, d: 4}, 85]],
        apply: function (inputs, scheduler) {
          return inputs[0].take(2, scheduler)
        }
      },
      takeLast: {
        label: "takeLast(1)",
        inputs: [[{t: 30, d: 1}, {t: 40, d: 2}, {t: 65, d: 3}, {t: 75, d: 4}, 85]],
        apply: function (inputs) {
          return inputs[0].takeLast(1)
        }
      },
      takeUntil: {
        label: "takeUntil",
        inputs: [[{t: 0, d: 1}, {t: 10, d: 2}, {t: 20, d: 3}, {t: 30, d: 4}, {t: 40, d: 5}, {t: 50, d: 6}, {
          t: 60,
          d: 7
        }, {t: 70, d: 8}, {t: 80, d: 9}], [{t: 45, d: 0}, {t: 73, d: 0}]],
        apply: function (inputs) {
          return inputs[0].takeUntil(inputs[1])
        }
      }
    }
  }, {cyclejs: 51}],
  76: [function (require, module, exports) {
    "use strict";
    var Rx = require("cyclejs").Rx;
    module.exports = {
      average: {
        label: "average",
        inputs: [[{t: 5, d: 1}, {t: 15, d: 2}, {t: 30, d: 2}, {t: 50, d: 2}, {t: 65, d: 5}, 80]],
        apply: function (inputs) {
          return inputs[0].average(function (x) {
            return x.get("content")
          })
        }
      },
      count: {
        label: "count(x => x > 10)",
        inputs: [[{t: 5, d: 2}, {t: 15, d: 30}, {t: 25, d: 22}, {t: 35, d: 5}, {t: 45, d: 60}, {t: 55, d: 1}, 80]],
        apply: function (inputs) {
          return inputs[0].count(function (x) {
            return x.get("content") > 10
          })
        }
      },
      max: {
        label: "max",
        inputs: [[{t: 5, d: 2}, {t: 15, d: 30}, {t: 25, d: 22}, {t: 35, d: 5}, {t: 45, d: 60}, {t: 55, d: 1}, 80]],
        apply: function (inputs) {
          return inputs[0].max(function (x, y) {
            if (x.get("content") > y.get("content")) {
              return 1
            }
            if (x.get("content") < y.get("content")) {
              return -1
            }
            return 0
          })
        }
      },
      min: {
        label: "min",
        inputs: [[{t: 5, d: 2}, {t: 15, d: 30}, {t: 25, d: 22}, {t: 35, d: 5}, {t: 45, d: 60}, {t: 55, d: 1}, 80]],
        apply: function (inputs) {
          return inputs[0].min(function (x, y) {
            if (x.get("content") > y.get("content")) {
              return 1
            }
            if (x.get("content") < y.get("content")) {
              return -1
            }
            return 0
          })
        }
      },
      reduce: {
        label: "reduce((x, y) => x + y)",
        inputs: [[{t: 5, d: 1}, {t: 15, d: 2}, {t: 25, d: 3}, {t: 35, d: 4}, {t: 65, d: 5}, 80]],
        apply: function (inputs) {
          return inputs[0].reduce(function (x, y) {
            return y.set("content", x.get("content") + y.get("content")).set("id", x.get("id") + y.get("id"))
          })
        }
      },
      sum: {
        label: "sum",
        inputs: [[{t: 5, d: 1}, {t: 15, d: 2}, {t: 25, d: 3}, {t: 35, d: 4}, {t: 65, d: 5}, 80]],
        apply: function (inputs) {
          return inputs[0].sum(function (x) {
            return x.get("content")
          })
        }
      }
    }
  }, {cyclejs: 51}],
  77: [function (require, module, exports) {
    "use strict";
    var Rx = require("cyclejs").Rx;
    module.exports = {
      delay: {
        label: "delay",
        inputs: [[{t: 0, d: 1}, {t: 10, d: 2}, {t: 20, d: 1}]],
        apply: function (inputs, scheduler) {
          return inputs[0].delay(20, scheduler)
        }
      },
      delayWithSelector: {
        label: "delayWithSelector(x => Rx.Observable.timer(20 * x))",
        inputs: [[{t: 0, d: 1}, {t: 10, d: 2}, {t: 20, d: 1}]],
        apply: function (inputs, scheduler) {
          return inputs[0].delayWithSelector(function (x) {
            return Rx.Observable.timer(Number(x.get("content")) * 20, 1e3, scheduler)
          })
        }
      },
      findIndex: {
        label: "findIndex(x => x > 10)",
        inputs: [[{t: 5, d: 2}, {t: 15, d: 30}, {t: 25, d: 22}, {t: 35, d: 5}, {t: 45, d: 60}, {t: 55, d: 1}]],
        apply: function (inputs, scheduler) {
          return inputs[0].findIndex(function (x) {
            return x.get("content") > 10
          })
        }
      },
      map: {
        label: "map(x => 10 * x)",
        inputs: [[{t: 10, d: 1}, {t: 20, d: 2}, {t: 50, d: 3}]],
        apply: function (inputs) {
          return inputs[0].map(function (x) {
            return x.set("content", x.get("content") * 10)
          })
        }
      },
      scan: {
        label: "scan((x, y) => x + y)",
        inputs: [[{t: 5, d: 1}, {t: 15, d: 2}, {t: 25, d: 3}, {t: 35, d: 4}, {t: 65, d: 5}]],
        apply: function (inputs) {
          return inputs[0].scan(function (x, y) {
            return y.set("content", x.get("content") + y.get("content")).set("id", x.get("id") + y.get("id"))
          })
        }
      },
      debounce: {
        label: "debounce",
        inputs: [[{t: 0, d: 1}, {t: 26, d: 2}, {t: 34, d: 3}, {t: 40, d: 4}, {t: 45, d: 5}, {t: 79, d: 6}]],
        apply: function (inputs, scheduler) {
          return inputs[0].debounce(10, scheduler)
        }
      },
      debounceWithSelector: {
        label: "debounceWithSelector(x => Rx.Observable.timer(10 * x))",
        inputs: [[{t: 0, d: 1}, {t: 26, d: 2}, {t: 34, d: 1}, {t: 40, d: 1}, {t: 45, d: 2}, {t: 79, d: 1}]],
        apply: function (inputs, scheduler) {
          return inputs[0].debounceWithSelector(function (x) {
            return Rx.Observable.timer(Number(x.get("content")) * 10, 1e3, scheduler)
          })
        }
      }
    }
  }, {cyclejs: 51}],
  78: [function (require, module, exports) {
    "use strict";
    module.exports = {
      white: "#FFFFFF",
      almostWhite: "#ECECEC",
      greyLight: "#D4D4D4",
      grey: "#A7A7A7",
      greyDark: "#7C7C7C",
      black: "#323232",
      blue: "#3EA1CB",
      yellow: "#FFCB46",
      red: "#FF6946",
      green: "#82D736"
    }
  }, {}],
  79: [function (require, module, exports) {
    "use strict";
    module.exports = {
      spaceTiny: "5px",
      spaceSmall: "10px",
      spaceMedium: "22px",
      spaceLarge: "32px",
      animationDurationQuick: "100ms",
      animationDurationNormal: "200ms",
      animationDurationSlow: "400ms"
    }
  }, {}],
  80: [function (require, module, exports) {
    "use strict";
    module.exports = {
      fontBase: "'Source Sans Pro', sans-serif",
      fontSpecial: "'Signika', Helvetica, serif",
      fontCode: "'Source Code Pro', monospace"
    }
  }, {}],
  81: [function (require, module, exports) {
    "use strict";
    var _interopRequire = function (obj) {
      return obj && obj.__esModule ? obj["default"] : obj
    };
    var Immutable = _interopRequire(require("immutable"));
    var Cycle = _interopRequire(require("cyclejs"));
    var h = Cycle.h;
    var isTruthy = function (style) {
      return !!style
    };

    function mergeStyles() {
      for (var _len = arguments.length, styleObjects = Array(_len), _key = 0; _key < _len; _key++) {
        styleObjects[_key] = arguments[_key]
      }
      return styleObjects.filter(isTruthy).reduce(function (styleA, styleB) {
        var mapA = Immutable.Map(styleA);
        var mapB = Immutable.Map(styleB);
        return mapA.merge(mapB).toObject()
      }, {})
    }

    var elevation1Style = {
      "-webkit-box-shadow": "0px 1px 2px 1px rgba(0,0,0,0.17)",
      "-moz-box-shadow": "0px 1px 2px 1px rgba(0,0,0,0.17)",
      "box-shadow": "0px 1px 2px 1px rgba(0,0,0,0.17)"
    };
    var elevation2Style = {position: "relative"};

    function getElevationPseudoElementStyle(dy, blur, opacity) {
      return {
        display: "block",
        position: "absolute",
        left: "0",
        top: "0",
        right: "0",
        bottom: "0",
        "-webkit-box-shadow": "0 " + dy + " " + blur + " 0 rgba(0,0,0," + opacity + ")",
        "-moz-box-shadow": "0 " + dy + " " + blur + " 0 rgba(0,0,0," + opacity + ")",
        "box-shadow": "0 " + dy + " " + blur + " 0 rgba(0,0,0," + opacity + ")"
      }
    }

    var elevation2Before = h("div", {style: getElevationPseudoElementStyle("2px", "10px", "0.17")}, "");
    var elevation2After = h("div", {style: getElevationPseudoElementStyle("2px", "5px", "0.26")}, "");
    var elevation3Before = h("div", {style: getElevationPseudoElementStyle("6px", "20px", "0.19")}, "");
    var elevation3After = h("div", {style: getElevationPseudoElementStyle("6px", "17px", "0.2")}, "");
    var svgElevation1Style = {
      "-webkit-filter": "drop-shadow(0px 3px 2px rgba(0,0,0,0.26))",
      filter: "drop-shadow(0px 3px 2px rgba(0,0,0,0.26))"
    };
    var textUnselectable = {
      "-webkit-user-select": "none",
      "-khtml-user-select": "none",
      "-moz-user-select": "-moz-none",
      "-o-user-select": "none",
      "user-select": "none"
    };
    module.exports = {
      mergeStyles: mergeStyles,
      elevation1Style: elevation1Style,
      elevation2Style: elevation2Style,
      elevation2Before: elevation2Before,
      elevation2After: elevation2After,
      elevation3Before: elevation3Before,
      elevation3After: elevation3After,
      svgElevation1Style: svgElevation1Style,
      textUnselectable: textUnselectable
    }
  }, {cyclejs: 51, immutable: 60}]
}, {}, [1]);
