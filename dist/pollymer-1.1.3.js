!function(e){function r(e,r,o){return 4===arguments.length?t.apply(this,arguments):void n(e,{declarative:!0,deps:r,declare:o})}function t(e,r,t,o){n(e,{declarative:!1,deps:r,executingRequire:t,execute:o})}function n(e,r){r.name=e,e in v||(v[e]=r),r.normalizedDeps=r.deps}function o(e,r){if(r[e.groupIndex]=r[e.groupIndex]||[],-1==g.call(r[e.groupIndex],e)){r[e.groupIndex].push(e);for(var t=0,n=e.normalizedDeps.length;n>t;t++){var a=e.normalizedDeps[t],u=v[a];if(u&&!u.evaluated){var d=e.groupIndex+(u.declarative!=e.declarative);if(void 0===u.groupIndex||u.groupIndex<d){if(void 0!==u.groupIndex&&(r[u.groupIndex].splice(g.call(r[u.groupIndex],u),1),0==r[u.groupIndex].length))throw new TypeError("Mixed dependency cycle detected");u.groupIndex=d}o(u,r)}}}}function a(e){var r=v[e];r.groupIndex=0;var t=[];o(r,t);for(var n=!!r.declarative==t.length%2,a=t.length-1;a>=0;a--){for(var u=t[a],i=0;i<u.length;i++){var s=u[i];n?d(s):l(s)}n=!n}}function u(e){return y[e]||(y[e]={name:e,dependencies:[],exports:{},importers:[]})}function d(r){if(!r.module){var t=r.module=u(r.name),n=r.module.exports,o=r.declare.call(e,function(e,r){if(t.locked=!0,"object"==typeof e)for(var o in e)n[o]=e[o];else n[e]=r;for(var a=0,u=t.importers.length;u>a;a++){var d=t.importers[a];if(!d.locked)for(var i=0;i<d.dependencies.length;++i)d.dependencies[i]===t&&d.setters[i](n)}return t.locked=!1,r},{id:r.name});t.setters=o.setters,t.execute=o.execute;for(var a=0,i=r.normalizedDeps.length;i>a;a++){var l,s=r.normalizedDeps[a],c=v[s],f=y[s];f?l=f.exports:c&&!c.declarative?l=c.esModule:c?(d(c),f=c.module,l=f.exports):l=p(s),f&&f.importers?(f.importers.push(t),t.dependencies.push(f)):t.dependencies.push(null),t.setters[a]&&t.setters[a](l)}}}function i(e){var r,t=v[e];if(t)t.declarative?f(e,[]):t.evaluated||l(t),r=t.module.exports;else if(r=p(e),!r)throw new Error("Unable to load dependency "+e+".");return(!t||t.declarative)&&r&&r.__useDefault?r["default"]:r}function l(r){if(!r.module){var t={},n=r.module={exports:t,id:r.name};if(!r.executingRequire)for(var o=0,a=r.normalizedDeps.length;a>o;o++){var u=r.normalizedDeps[o],d=v[u];d&&l(d)}r.evaluated=!0;var c=r.execute.call(e,function(e){for(var t=0,n=r.deps.length;n>t;t++)if(r.deps[t]==e)return i(r.normalizedDeps[t]);throw new TypeError("Module "+e+" not declared as a dependency.")},t,n);void 0!==typeof c&&(n.exports=c),t=n.exports,t&&t.__esModule?r.esModule=t:r.esModule=s(t)}}function s(r){var t={};if(("object"==typeof r||"function"==typeof r)&&r!==e)if(m)for(var n in r)"default"!==n&&c(t,r,n);else{var o=r&&r.hasOwnProperty;for(var n in r)"default"===n||o&&!r.hasOwnProperty(n)||(t[n]=r[n])}return t["default"]=r,x(t,"__useDefault",{value:!0}),t}function c(e,r,t){try{var n;(n=Object.getOwnPropertyDescriptor(r,t))&&x(e,t,n)}catch(o){return e[t]=r[t],!1}}function f(r,t){var n=v[r];if(n&&!n.evaluated&&n.declarative){t.push(r);for(var o=0,a=n.normalizedDeps.length;a>o;o++){var u=n.normalizedDeps[o];-1==g.call(t,u)&&(v[u]?f(u,t):p(u))}n.evaluated||(n.evaluated=!0,n.module.execute.call(e))}}function p(e){if(I[e])return I[e];if("@node/"==e.substr(0,6))return I[e]=s(D(e.substr(6)));var r=v[e];if(!r)throw"Module "+e+" not present.";return a(e),f(e,[]),v[e]=void 0,r.declarative&&x(r.module.exports,"__esModule",{value:!0}),I[e]=r.declarative?r.module.exports:r.esModule}var v={},g=Array.prototype.indexOf||function(e){for(var r=0,t=this.length;t>r;r++)if(this[r]===e)return r;return-1},m=!0;try{Object.getOwnPropertyDescriptor({a:0},"a")}catch(h){m=!1}var x;!function(){try{Object.defineProperty({},"a",{})&&(x=Object.defineProperty)}catch(e){x=function(e,r,t){try{e[r]=t.value||t.get.call(e)}catch(n){}}}}();var y={},D="undefined"!=typeof System&&System._nodeRequire||"undefined"!=typeof require&&require.resolve&&"undefined"!=typeof process&&require,I={"@empty":{}};return function(e,n,o,a){return function(u){u(function(u){for(var d={_nodeRequire:D,register:r,registerDynamic:t,get:p,set:function(e,r){I[e]=r},newModule:function(e){return e}},i=0;i<n.length;i++)(function(e,r){r&&r.__esModule?I[e]=r:I[e]=s(r)})(n[i],arguments[i]);a(d);var l=p(e[0]);if(e.length>1)for(var i=1;i<e.length;i++)p(e[i]);return o?l["default"]:l})}}}("undefined"!=typeof self?self:global)

(["1"], [], false, function($__System) {
var require = this.require, exports = this.exports, module = this.module;
$__System.registerDynamic('2', ['3'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  var $ = $__require('3');
  module.exports = function defineProperty(it, key, desc) {
    return $.setDesc(it, key, desc);
  };
  return module.exports;
});
$__System.registerDynamic("4", ["2"], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  module.exports = { "default": $__require("2"), __esModule: true };
  return module.exports;
});
$__System.registerDynamic("5", ["4"], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var _Object$defineProperty = $__require("4")["default"];
  exports["default"] = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        _Object$defineProperty(target, descriptor.key, descriptor);
      }
    }
    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();
  exports.__esModule = true;
  return module.exports;
});
$__System.registerDynamic("6", [], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  exports["default"] = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  exports.__esModule = true;
  return module.exports;
});
$__System.registerDynamic("7", [], true, function ($__require, exports, module) {
  /* */
  "format cjs";

  var define,
      global = this || self,
      GLOBAL = global;
  return module.exports;
});
$__System.registerDynamic('8', ['9', 'a'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  var toInteger = $__require('9'),
      defined = $__require('a');
  module.exports = function (TO_STRING) {
    return function (that, pos) {
      var s = String(defined(that)),
          i = toInteger(pos),
          l = s.length,
          a,
          b;
      if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
      a = s.charCodeAt(i);
      return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff ? TO_STRING ? s.charAt(i) : a : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
    };
  };
  return module.exports;
});
$__System.registerDynamic('b', ['8', 'c'], true, function ($__require, exports, module) {
  /* */
  'use strict';

  var define,
      global = this || self,
      GLOBAL = global;
  var $at = $__require('8')(true);
  $__require('c')(String, 'String', function (iterated) {
    this._t = String(iterated);
    this._i = 0;
  }, function () {
    var O = this._t,
        index = this._i,
        point;
    if (index >= O.length) return {
      value: undefined,
      done: true
    };
    point = $at(O, index);
    this._i += point.length;
    return {
      value: point,
      done: false
    };
  });
  return module.exports;
});
$__System.registerDynamic("d", [], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  module.exports = function () {/* empty */};
  return module.exports;
});
$__System.registerDynamic('e', ['f'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  var cof = $__require('f');
  module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
    return cof(it) == 'String' ? it.split('') : Object(it);
  };
  return module.exports;
});
$__System.registerDynamic('10', ['e', 'a'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  var IObject = $__require('e'),
      defined = $__require('a');
  module.exports = function (it) {
    return IObject(defined(it));
  };
  return module.exports;
});
$__System.registerDynamic('11', ['d', '12', '13', '10', 'c'], true, function ($__require, exports, module) {
  /* */
  'use strict';

  var define,
      global = this || self,
      GLOBAL = global;
  var addToUnscopables = $__require('d'),
      step = $__require('12'),
      Iterators = $__require('13'),
      toIObject = $__require('10');
  module.exports = $__require('c')(Array, 'Array', function (iterated, kind) {
    this._t = toIObject(iterated);
    this._i = 0;
    this._k = kind;
  }, function () {
    var O = this._t,
        kind = this._k,
        index = this._i++;
    if (!O || index >= O.length) {
      this._t = undefined;
      return step(1);
    }
    if (kind == 'keys') return step(0, index);
    if (kind == 'values') return step(0, O[index]);
    return step(0, [index, O[index]]);
  }, 'values');
  Iterators.Arguments = Iterators.Array;
  addToUnscopables('keys');
  addToUnscopables('values');
  addToUnscopables('entries');
  return module.exports;
});
$__System.registerDynamic('14', ['11', '13'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  $__require('11');
  var Iterators = $__require('13');
  Iterators.NodeList = Iterators.HTMLCollection = Iterators.Array;
  return module.exports;
});
$__System.registerDynamic("a", [], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  // 7.2.1 RequireObjectCoercible(argument)
  module.exports = function (it) {
    if (it == undefined) throw TypeError("Can't call method on  " + it);
    return it;
  };
  return module.exports;
});
$__System.registerDynamic("15", [], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  module.exports = true;
  return module.exports;
});
$__System.registerDynamic('16', ['3', '17', '18', '19', '1a'], true, function ($__require, exports, module) {
  /* */
  'use strict';

  var define,
      global = this || self,
      GLOBAL = global;
  var $ = $__require('3'),
      descriptor = $__require('17'),
      setToStringTag = $__require('18'),
      IteratorPrototype = {};
  $__require('19')(IteratorPrototype, $__require('1a')('iterator'), function () {
    return this;
  });
  module.exports = function (Constructor, NAME, next) {
    Constructor.prototype = $.create(IteratorPrototype, { next: descriptor(1, next) });
    setToStringTag(Constructor, NAME + ' Iterator');
  };
  return module.exports;
});
$__System.registerDynamic('c', ['15', '1b', '1c', '19', '1d', '13', '16', '18', '3', '1a'], true, function ($__require, exports, module) {
  /* */
  'use strict';

  var define,
      global = this || self,
      GLOBAL = global;
  var LIBRARY = $__require('15'),
      $export = $__require('1b'),
      redefine = $__require('1c'),
      hide = $__require('19'),
      has = $__require('1d'),
      Iterators = $__require('13'),
      $iterCreate = $__require('16'),
      setToStringTag = $__require('18'),
      getProto = $__require('3').getProto,
      ITERATOR = $__require('1a')('iterator'),
      BUGGY = !([].keys && 'next' in [].keys()),
      FF_ITERATOR = '@@iterator',
      KEYS = 'keys',
      VALUES = 'values';
  var returnThis = function () {
    return this;
  };
  module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
    $iterCreate(Constructor, NAME, next);
    var getMethod = function (kind) {
      if (!BUGGY && kind in proto) return proto[kind];
      switch (kind) {
        case KEYS:
          return function keys() {
            return new Constructor(this, kind);
          };
        case VALUES:
          return function values() {
            return new Constructor(this, kind);
          };
      }
      return function entries() {
        return new Constructor(this, kind);
      };
    };
    var TAG = NAME + ' Iterator',
        DEF_VALUES = DEFAULT == VALUES,
        VALUES_BUG = false,
        proto = Base.prototype,
        $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT],
        $default = $native || getMethod(DEFAULT),
        methods,
        key;
    if ($native) {
      var IteratorPrototype = getProto($default.call(new Base()));
      setToStringTag(IteratorPrototype, TAG, true);
      if (!LIBRARY && has(proto, FF_ITERATOR)) hide(IteratorPrototype, ITERATOR, returnThis);
      if (DEF_VALUES && $native.name !== VALUES) {
        VALUES_BUG = true;
        $default = function values() {
          return $native.call(this);
        };
      }
    }
    if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
      hide(proto, ITERATOR, $default);
    }
    Iterators[NAME] = $default;
    Iterators[TAG] = returnThis;
    if (DEFAULT) {
      methods = {
        values: DEF_VALUES ? $default : getMethod(VALUES),
        keys: IS_SET ? $default : getMethod(KEYS),
        entries: !DEF_VALUES ? $default : getMethod('entries')
      };
      if (FORCED) for (key in methods) {
        if (!(key in proto)) redefine(proto, key, methods[key]);
      } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
    }
    return methods;
  };
  return module.exports;
});
$__System.registerDynamic("12", [], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  module.exports = function (done, value) {
    return { value: value, done: !!done };
  };
  return module.exports;
});
$__System.registerDynamic('1e', ['1f', '3', '20', '1a'], true, function ($__require, exports, module) {
  /* */
  'use strict';

  var define,
      global = this || self,
      GLOBAL = global;
  var core = $__require('1f'),
      $ = $__require('3'),
      DESCRIPTORS = $__require('20'),
      SPECIES = $__require('1a')('species');
  module.exports = function (KEY) {
    var C = core[KEY];
    if (DESCRIPTORS && C && !C[SPECIES]) $.setDesc(C, SPECIES, {
      configurable: true,
      get: function () {
        return this;
      }
    });
  };
  return module.exports;
});
$__System.registerDynamic('21', ['3', '19', '22', '23', '24', 'a', '25', 'c', '12', '26', '1d', '27', '1e', '20'], true, function ($__require, exports, module) {
  /* */
  'use strict';

  var define,
      global = this || self,
      GLOBAL = global;
  var $ = $__require('3'),
      hide = $__require('19'),
      redefineAll = $__require('22'),
      ctx = $__require('23'),
      strictNew = $__require('24'),
      defined = $__require('a'),
      forOf = $__require('25'),
      $iterDefine = $__require('c'),
      step = $__require('12'),
      ID = $__require('26')('id'),
      $has = $__require('1d'),
      isObject = $__require('27'),
      setSpecies = $__require('1e'),
      DESCRIPTORS = $__require('20'),
      isExtensible = Object.isExtensible || isObject,
      SIZE = DESCRIPTORS ? '_s' : 'size',
      id = 0;
  var fastKey = function (it, create) {
    if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
    if (!$has(it, ID)) {
      if (!isExtensible(it)) return 'F';
      if (!create) return 'E';
      hide(it, ID, ++id);
    }
    return 'O' + it[ID];
  };
  var getEntry = function (that, key) {
    var index = fastKey(key),
        entry;
    if (index !== 'F') return that._i[index];
    for (entry = that._f; entry; entry = entry.n) {
      if (entry.k == key) return entry;
    }
  };
  module.exports = {
    getConstructor: function (wrapper, NAME, IS_MAP, ADDER) {
      var C = wrapper(function (that, iterable) {
        strictNew(that, C, NAME);
        that._i = $.create(null);
        that._f = undefined;
        that._l = undefined;
        that[SIZE] = 0;
        if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
      });
      redefineAll(C.prototype, {
        clear: function clear() {
          for (var that = this, data = that._i, entry = that._f; entry; entry = entry.n) {
            entry.r = true;
            if (entry.p) entry.p = entry.p.n = undefined;
            delete data[entry.i];
          }
          that._f = that._l = undefined;
          that[SIZE] = 0;
        },
        'delete': function (key) {
          var that = this,
              entry = getEntry(that, key);
          if (entry) {
            var next = entry.n,
                prev = entry.p;
            delete that._i[entry.i];
            entry.r = true;
            if (prev) prev.n = next;
            if (next) next.p = prev;
            if (that._f == entry) that._f = next;
            if (that._l == entry) that._l = prev;
            that[SIZE]--;
          }
          return !!entry;
        },
        forEach: function forEach(callbackfn) {
          var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3),
              entry;
          while (entry = entry ? entry.n : this._f) {
            f(entry.v, entry.k, this);
            while (entry && entry.r) entry = entry.p;
          }
        },
        has: function has(key) {
          return !!getEntry(this, key);
        }
      });
      if (DESCRIPTORS) $.setDesc(C.prototype, 'size', { get: function () {
          return defined(this[SIZE]);
        } });
      return C;
    },
    def: function (that, key, value) {
      var entry = getEntry(that, key),
          prev,
          index;
      if (entry) {
        entry.v = value;
      } else {
        that._l = entry = {
          i: index = fastKey(key, true),
          k: key,
          v: value,
          p: prev = that._l,
          n: undefined,
          r: false
        };
        if (!that._f) that._f = entry;
        if (prev) prev.n = entry;
        that[SIZE]++;
        if (index !== 'F') that._i[index] = entry;
      }
      return that;
    },
    getEntry: getEntry,
    setStrong: function (C, NAME, IS_MAP) {
      $iterDefine(C, NAME, function (iterated, kind) {
        this._t = iterated;
        this._k = kind;
        this._l = undefined;
      }, function () {
        var that = this,
            kind = that._k,
            entry = that._l;
        while (entry && entry.r) entry = entry.p;
        if (!that._t || !(that._l = entry = entry ? entry.n : that._t._f)) {
          that._t = undefined;
          return step(1);
        }
        if (kind == 'keys') return step(0, entry.k);
        if (kind == 'values') return step(0, entry.v);
        return step(0, [entry.k, entry.v]);
      }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);
      setSpecies(NAME);
    }
  };
  return module.exports;
});
$__System.registerDynamic("17", [], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  module.exports = function (bitmap, value) {
    return {
      enumerable: !(bitmap & 1),
      configurable: !(bitmap & 2),
      writable: !(bitmap & 4),
      value: value
    };
  };
  return module.exports;
});
$__System.registerDynamic('19', ['3', '17', '20'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  var $ = $__require('3'),
      createDesc = $__require('17');
  module.exports = $__require('20') ? function (object, key, value) {
    return $.setDesc(object, key, createDesc(1, value));
  } : function (object, key, value) {
    object[key] = value;
    return object;
  };
  return module.exports;
});
$__System.registerDynamic('1c', ['19'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  module.exports = $__require('19');
  return module.exports;
});
$__System.registerDynamic('22', ['1c'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  var redefine = $__require('1c');
  module.exports = function (target, src) {
    for (var key in src) redefine(target, key, src[key]);
    return target;
  };
  return module.exports;
});
$__System.registerDynamic("24", [], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  module.exports = function (it, Constructor, name) {
    if (!(it instanceof Constructor)) throw TypeError(name + ": use the 'new' operator!");
    return it;
  };
  return module.exports;
});
$__System.registerDynamic("3", [], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  var $Object = Object;
  module.exports = {
    create: $Object.create,
    getProto: $Object.getPrototypeOf,
    isEnum: {}.propertyIsEnumerable,
    getDesc: $Object.getOwnPropertyDescriptor,
    setDesc: $Object.defineProperty,
    setDescs: $Object.defineProperties,
    getKeys: $Object.keys,
    getNames: $Object.getOwnPropertyNames,
    getSymbols: $Object.getOwnPropertySymbols,
    each: [].forEach
  };
  return module.exports;
});
$__System.registerDynamic("1d", [], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  var hasOwnProperty = {}.hasOwnProperty;
  module.exports = function (it, key) {
    return hasOwnProperty.call(it, key);
  };
  return module.exports;
});
$__System.registerDynamic('18', ['3', '1d', '1a'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  var def = $__require('3').setDesc,
      has = $__require('1d'),
      TAG = $__require('1a')('toStringTag');
  module.exports = function (it, tag, stat) {
    if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, {
      configurable: true,
      value: tag
    });
  };
  return module.exports;
});
$__System.registerDynamic("28", [], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  module.exports = function (exec) {
    try {
      return !!exec();
    } catch (e) {
      return true;
    }
  };
  return module.exports;
});
$__System.registerDynamic('20', ['28'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  module.exports = !$__require('28')(function () {
    return Object.defineProperty({}, 'a', { get: function () {
        return 7;
      } }).a != 7;
  });
  return module.exports;
});
$__System.registerDynamic('29', ['3', '2a', '1b', '28', '19', '22', '25', '24', '27', '18', '20'], true, function ($__require, exports, module) {
  /* */
  'use strict';

  var define,
      global = this || self,
      GLOBAL = global;
  var $ = $__require('3'),
      global = $__require('2a'),
      $export = $__require('1b'),
      fails = $__require('28'),
      hide = $__require('19'),
      redefineAll = $__require('22'),
      forOf = $__require('25'),
      strictNew = $__require('24'),
      isObject = $__require('27'),
      setToStringTag = $__require('18'),
      DESCRIPTORS = $__require('20');
  module.exports = function (NAME, wrapper, methods, common, IS_MAP, IS_WEAK) {
    var Base = global[NAME],
        C = Base,
        ADDER = IS_MAP ? 'set' : 'add',
        proto = C && C.prototype,
        O = {};
    if (!DESCRIPTORS || typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function () {
      new C().entries().next();
    }))) {
      C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
      redefineAll(C.prototype, methods);
    } else {
      C = wrapper(function (target, iterable) {
        strictNew(target, C, NAME);
        target._c = new Base();
        if (iterable != undefined) forOf(iterable, IS_MAP, target[ADDER], target);
      });
      $.each.call('add,clear,delete,forEach,get,has,set,keys,values,entries'.split(','), function (KEY) {
        var IS_ADDER = KEY == 'add' || KEY == 'set';
        if (KEY in proto && !(IS_WEAK && KEY == 'clear')) hide(C.prototype, KEY, function (a, b) {
          if (!IS_ADDER && IS_WEAK && !isObject(a)) return KEY == 'get' ? undefined : false;
          var result = this._c[KEY](a === 0 ? 0 : a, b);
          return IS_ADDER ? this : result;
        });
      });
      if ('size' in proto) $.setDesc(C.prototype, 'size', { get: function () {
          return this._c.size;
        } });
    }
    setToStringTag(C, NAME);
    O[NAME] = C;
    $export($export.G + $export.W + $export.F, O);
    if (!IS_WEAK) common.setStrong(C, NAME, IS_MAP);
    return C;
  };
  return module.exports;
});
$__System.registerDynamic('2b', ['21', '29'], true, function ($__require, exports, module) {
  /* */
  'use strict';

  var define,
      global = this || self,
      GLOBAL = global;
  var strong = $__require('21');
  $__require('29')('Map', function (get) {
    return function Map() {
      return get(this, arguments.length > 0 ? arguments[0] : undefined);
    };
  }, {
    get: function get(key) {
      var entry = strong.getEntry(this, key);
      return entry && entry.v;
    },
    set: function set(key, value) {
      return strong.def(this, key === 0 ? 0 : key, value);
    }
  }, strong, true);
  return module.exports;
});
$__System.registerDynamic('1b', ['2a', '1f', '23'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  var global = $__require('2a'),
      core = $__require('1f'),
      ctx = $__require('23'),
      PROTOTYPE = 'prototype';
  var $export = function (type, name, source) {
    var IS_FORCED = type & $export.F,
        IS_GLOBAL = type & $export.G,
        IS_STATIC = type & $export.S,
        IS_PROTO = type & $export.P,
        IS_BIND = type & $export.B,
        IS_WRAP = type & $export.W,
        exports = IS_GLOBAL ? core : core[name] || (core[name] = {}),
        target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE],
        key,
        own,
        out;
    if (IS_GLOBAL) source = name;
    for (key in source) {
      own = !IS_FORCED && target && key in target;
      if (own && key in exports) continue;
      out = own ? target[key] : source[key];
      exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key] : IS_BIND && own ? ctx(out, global) : IS_WRAP && target[key] == out ? function (C) {
        var F = function (param) {
          return this instanceof C ? new C(param) : C(param);
        };
        F[PROTOTYPE] = C[PROTOTYPE];
        return F;
      }(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
      if (IS_PROTO) (exports[PROTOTYPE] || (exports[PROTOTYPE] = {}))[key] = out;
    }
  };
  $export.F = 1;
  $export.G = 2;
  $export.S = 4;
  $export.P = 8;
  $export.B = 16;
  $export.W = 32;
  module.exports = $export;
  return module.exports;
});
$__System.registerDynamic('2c', [], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  module.exports = function (it) {
    if (typeof it != 'function') throw TypeError(it + ' is not a function!');
    return it;
  };
  return module.exports;
});
$__System.registerDynamic('23', ['2c'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  var aFunction = $__require('2c');
  module.exports = function (fn, that, length) {
    aFunction(fn);
    if (that === undefined) return fn;
    switch (length) {
      case 1:
        return function (a) {
          return fn.call(that, a);
        };
      case 2:
        return function (a, b) {
          return fn.call(that, a, b);
        };
      case 3:
        return function (a, b, c) {
          return fn.call(that, a, b, c);
        };
    }
    return function () {
      return fn.apply(that, arguments);
    };
  };
  return module.exports;
});
$__System.registerDynamic('2d', ['2e'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  var anObject = $__require('2e');
  module.exports = function (iterator, fn, value, entries) {
    try {
      return entries ? fn(anObject(value)[0], value[1]) : fn(value);
    } catch (e) {
      var ret = iterator['return'];
      if (ret !== undefined) anObject(ret.call(iterator));
      throw e;
    }
  };
  return module.exports;
});
$__System.registerDynamic('2f', ['13', '1a'], true, function ($__require, exports, module) {
    var define,
        global = this || self,
        GLOBAL = global;
    /* */
    var Iterators = $__require('13'),
        ITERATOR = $__require('1a')('iterator'),
        ArrayProto = Array.prototype;
    module.exports = function (it) {
        return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
    };
    return module.exports;
});
$__System.registerDynamic('27', [], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  module.exports = function (it) {
    return typeof it === 'object' ? it !== null : typeof it === 'function';
  };
  return module.exports;
});
$__System.registerDynamic('2e', ['27'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  var isObject = $__require('27');
  module.exports = function (it) {
    if (!isObject(it)) throw TypeError(it + ' is not an object!');
    return it;
  };
  return module.exports;
});
$__System.registerDynamic("9", [], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  // 7.1.4 ToInteger
  var ceil = Math.ceil,
      floor = Math.floor;
  module.exports = function (it) {
    return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
  };
  return module.exports;
});
$__System.registerDynamic('30', ['9'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  var toInteger = $__require('9'),
      min = Math.min;
  module.exports = function (it) {
    return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0;
  };
  return module.exports;
});
$__System.registerDynamic("13", [], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  module.exports = {};
  return module.exports;
});
$__System.registerDynamic('31', ['32', '1a', '13', '1f'], true, function ($__require, exports, module) {
    var define,
        global = this || self,
        GLOBAL = global;
    /* */
    var classof = $__require('32'),
        ITERATOR = $__require('1a')('iterator'),
        Iterators = $__require('13');
    module.exports = $__require('1f').getIteratorMethod = function (it) {
        if (it != undefined) return it[ITERATOR] || it['@@iterator'] || Iterators[classof(it)];
    };
    return module.exports;
});
$__System.registerDynamic('25', ['23', '2d', '2f', '2e', '30', '31'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  var ctx = $__require('23'),
      call = $__require('2d'),
      isArrayIter = $__require('2f'),
      anObject = $__require('2e'),
      toLength = $__require('30'),
      getIterFn = $__require('31');
  module.exports = function (iterable, entries, fn, that) {
    var iterFn = getIterFn(iterable),
        f = ctx(fn, that, entries ? 2 : 1),
        index = 0,
        length,
        step,
        iterator;
    if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
    if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
      entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
      call(iterator, f, step.value, entries);
    }
  };
  return module.exports;
});
$__System.registerDynamic("f", [], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  var toString = {}.toString;

  module.exports = function (it) {
    return toString.call(it).slice(8, -1);
  };
  return module.exports;
});
$__System.registerDynamic('33', ['2a'], true, function ($__require, exports, module) {
    var define,
        global = this || self,
        GLOBAL = global;
    /* */
    var global = $__require('2a'),
        SHARED = '__core-js_shared__',
        store = global[SHARED] || (global[SHARED] = {});
    module.exports = function (key) {
        return store[key] || (store[key] = {});
    };
    return module.exports;
});
$__System.registerDynamic('26', [], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  var id = 0,
      px = Math.random();
  module.exports = function (key) {
    return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
  };
  return module.exports;
});
$__System.registerDynamic('2a', [], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
  var global = module.exports = typeof window != 'undefined' && window.Math == Math ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
  if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

  return module.exports;
});
$__System.registerDynamic('1a', ['33', '26', '2a'], true, function ($__require, exports, module) {
    var define,
        global = this || self,
        GLOBAL = global;
    /* */
    var store = $__require('33')('wks'),
        uid = $__require('26'),
        Symbol = $__require('2a').Symbol;
    module.exports = function (name) {
        return store[name] || (store[name] = Symbol && Symbol[name] || (Symbol || uid)('Symbol.' + name));
    };
    return module.exports;
});
$__System.registerDynamic('32', ['f', '1a'], true, function ($__require, exports, module) {
    var define,
        global = this || self,
        GLOBAL = global;
    /* */
    var cof = $__require('f'),
        TAG = $__require('1a')('toStringTag'),
        ARG = cof(function () {
        return arguments;
    }()) == 'Arguments';
    module.exports = function (it) {
        var O, T, B;
        return it === undefined ? 'Undefined' : it === null ? 'Null' : typeof (T = (O = Object(it))[TAG]) == 'string' ? T : ARG ? cof(O) : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
    };
    return module.exports;
});
$__System.registerDynamic('34', ['25', '32'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  var forOf = $__require('25'),
      classof = $__require('32');
  module.exports = function (NAME) {
    return function toJSON() {
      if (classof(this) != NAME) throw TypeError(NAME + "#toJSON isn't generic");
      var arr = [];
      forOf(this, false, arr.push, arr);
      return arr;
    };
  };
  return module.exports;
});
$__System.registerDynamic('35', ['1b', '34'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  var $export = $__require('1b');
  $export($export.P, 'Map', { toJSON: $__require('34')('Map') });
  return module.exports;
});
$__System.registerDynamic('1f', [], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  var core = module.exports = { version: '1.2.6' };
  if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

  return module.exports;
});
$__System.registerDynamic('36', ['7', 'b', '14', '2b', '35', '1f'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  $__require('7');
  $__require('b');
  $__require('14');
  $__require('2b');
  $__require('35');
  module.exports = $__require('1f').Map;
  return module.exports;
});
$__System.registerDynamic("37", ["36"], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  module.exports = { "default": $__require("36"), __esModule: true };
  return module.exports;
});
$__System.register("38", ["5", "6", "37"], function (_export) {
    var _createClass, _classCallCheck, _Map, Events;

    return {
        setters: [function (_) {
            _createClass = _["default"];
        }, function (_2) {
            _classCallCheck = _2["default"];
        }, function (_3) {
            _Map = _3["default"];
        }],
        execute: function () {
            "use strict";

            Events = (function () {
                function Events() {
                    _classCallCheck(this, Events);

                    this._events = new _Map();
                }

                _createClass(Events, [{
                    key: "on",
                    value: function on(type, handler) {
                        var _this = this;

                        var currentHandlers = this._events.get(type) || [];
                        var handlers = currentHandlers.concat([handler]);
                        this._events.set(type, handlers);
                        return function () {
                            return _this.off(type, handler);
                        };
                    }
                }, {
                    key: "off",
                    value: function off(type, handler) {
                        if (typeof handler !== "undefined") {
                            if (this._events.has(type)) {
                                var currentHandlers = this._events.get(type);
                                this._events.set(type, currentHandlers.filter(function (item) {
                                    return item !== handler;
                                }));
                            }
                        } else {
                            this._events["delete"](type);
                        }
                    }
                }, {
                    key: "trigger",
                    value: function trigger(type, obj) {
                        for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
                            args[_key - 2] = arguments[_key];
                        }

                        if (this._events.has(type)) {
                            this._events.get(type).forEach(function (handler) {
                                return handler.call.apply(handler, [obj].concat(args));
                            });
                        }
                    }
                }]);

                return Events;
            })();

            _export("default", Events);
        }
    };
});
$__System.register('39', ['5', '6', '38', '3a', '3b'], function (_export) {
    var _createClass, _classCallCheck, Events, TransportTypes, ErrorTypes, global, emptyMethod, checkForErrorCode, parseResponseHeaders, jsonpGuid, addJsonpScriptToDom, removeJsonpScriptFromDom, corsAvailable, sameOrigin, chooseTransport, Request;

    return {
        setters: [function (_) {
            _createClass = _['default'];
        }, function (_2) {
            _classCallCheck = _2['default'];
        }, function (_3) {
            Events = _3['default'];
        }, function (_a) {
            TransportTypes = _a['default'];
        }, function (_b) {
            ErrorTypes = _b['default'];
        }],
        execute: function () {
            //import { consoleInfo, consoleError } from './ConsoleUtils';

            // Global object (window in browsers)

            'use strict';

            global = typeof window !== 'undefined' ? window : undefined;

            // Create one instance of an empty method to be used where necessary

            emptyMethod = function emptyMethod() {};

            // Utility to determine whether an HTTP code should be treated as an error

            checkForErrorCode = function checkForErrorCode(codesStr, code) {
                var parts = codesStr.split(',');
                for (var i = 0; i < parts.length; i++) {
                    var part = parts[i];
                    var index = part.indexOf('-');
                    if (index >= 0) {
                        // part is a range
                        var min = parseInt(part.substring(0, index), 10);
                        var max = parseInt(part.substring(index + 1), 10);
                        if (code >= min && code <= max) {
                            return true;
                        }
                    } else {
                        // part is a single value
                        var val = parseInt(part, 10);
                        if (code == val) {
                            return true;
                        }
                    }
                }
                return false;
            };

            // Response Header Parsing

            parseResponseHeaders = function parseResponseHeaders(headerStr) {
                var headers = {};
                if (!headerStr) {
                    return headers;
                }
                var headerPairs = headerStr.split('\r\n');
                for (var i = 0; i < headerPairs.length; i++) {
                    var headerPair = headerPairs[i];
                    // IE sometimes puts a newline at the start of header names
                    if (headerPair[0] == '\n') {
                        headerPair = headerPair.substring(1);
                    }
                    var index = headerPair.indexOf(': ');
                    if (index > 0) {
                        var key = headerPair.substring(0, index);
                        headers[key] = headerPair.substring(index + 2);
                    }
                }
                return headers;
            };

            // JSONP-related utility functions

            jsonpGuid = "D3DDFE2A-6E6D-47A7-8F3B-0A4A8E71A796";

            addJsonpScriptToDom = function addJsonpScriptToDom(src, scriptId) {
                var script = global.document.createElement("script");
                script.type = "text/javascript";
                script.id = scriptId;
                script.src = src;

                var head = global.document.getElementsByTagName("head")[0];
                head.appendChild(script);
            };

            removeJsonpScriptFromDom = function removeJsonpScriptFromDom(scriptId) {
                var script = global.document.getElementById(scriptId);
                script.parentNode.removeChild(script);
            };

            // CORS detection

            corsAvailable = "withCredentials" in new global.XMLHttpRequest();

            // Transport Selection

            sameOrigin = function sameOrigin(url) {
                var loc = global.location;
                var a = global.document.createElement('a');
                a.href = url;
                return !a.hostname || a.hostname == loc.hostname && a.port == loc.port && a.protocol == loc.protocol;
            };

            chooseTransport = function chooseTransport(transportType, url) {
                var transport;
                if (transportType == TransportTypes.Auto) {
                    if (corsAvailable || sameOrigin(url)) {
                        transport = TransportTypes.Xhr;
                    } else {
                        transport = TransportTypes.Jsonp;
                    }
                } else {
                    switch (transportType) {
                        case TransportTypes.Xhr:
                            transport = TransportTypes.Xhr;
                            break;
                        case TransportTypes.Jsonp:
                            transport = TransportTypes.Jsonp;
                            break;
                        default:
                            transport = null;
                    }
                }
                return transport;
            };

            // Pollymer.Request has callback members:
            // on('finished', int code, object result, object headers)
            // on('error', int reason)

            Request = (function () {
                function Request() {
                    _classCallCheck(this, Request);

                    this._events = new Events();
                    this._tries = 0;
                    this._delayNext = false;
                    this._retryTime = 0;
                    this._timer = null;
                    this._jsonp = null;

                    this._xhr = null;
                    this._method = null;
                    this._url = null;
                    this._headers = null;
                    this._body = null;
                    this._transport = null;

                    this.transport = TransportTypes.Auto;
                    this.rawResponse = false;
                    this.maxTries = 1;
                    this.maxDelay = 1000;
                    this.recurring = false;
                    this.withCredentials = false;
                    this.timeout = 60000;
                    this.errorCodes = '500-599';

                    this.lastRequest = null;

                    if (arguments.length > 0) {
                        var config = arguments[0];
                        if ("transport" in config) {
                            this.transport = config.transport;
                        }
                        if ("rawResponse" in config) {
                            this.rawResponse = config.rawResponse;
                        }
                        if ("maxTries" in config) {
                            this.maxTries = config.maxTries;
                        }
                        if ("maxDelay" in config) {
                            this.maxDelay = config.maxDelay;
                        }
                        if ("recurring" in config) {
                            this.recurring = config.recurring;
                        }
                        if ("withCredentials" in config) {
                            this.withCredentials = config.withCredentials;
                        }
                        if ("timeout" in config) {
                            this.timeout = config.timeout;
                        }
                        if ("errorCodes" in config) {
                            this.errorCodes = config.errorCodes;
                        }
                    }
                }

                _createClass(Request, [{
                    key: 'start',
                    value: function start(method, url, headers, body) {
                        if (this._timer != null) {
                            //consoleError("pollymer: start() called on a Request object that is currently running.");
                            return;
                        }

                        this._method = method;
                        this._url = url;
                        this._headers = headers;
                        this._body = body;
                        this._start();
                    }
                }, {
                    key: '_start',
                    value: function _start() {
                        this._tries = 0;

                        var delayTime;
                        if (this._delayNext) {
                            this._delayNext = false;
                            delayTime = Math.floor(Math.random() * this.maxDelay);
                            //consoleInfo("pollymer: polling again in " + delayTime + "ms");
                        } else {
                                delayTime = 0; // always queue the call, to prevent browser "busy"
                            }

                        this._initiate(delayTime);
                    }
                }, {
                    key: 'retry',
                    value: function retry() {
                        if (this._tries == 0) {
                            //consoleError("pollymer: retry() called on a Request object that has never been started.");
                            return;
                        }
                        if (this._timer != null) {
                            //consoleError("pollymer: retry() called on a Request object that is currently running.");
                            return;
                        }
                        this._retry();
                    }
                }, {
                    key: '_retry',
                    value: function _retry() {
                        if (this._tries === 1) {
                            this._retryTime = 1;
                        } else if (this._tries < 8) {
                            this._retryTime = this._retryTime * 2;
                        }

                        var delayTime = this._retryTime * 1000;
                        delayTime += Math.floor(Math.random() * this.maxDelay);
                        //consoleInfo("pollymer: trying again in " + delayTime + "ms");

                        this._initiate(delayTime);
                    }
                }, {
                    key: '_initiate',
                    value: function _initiate(delayMsecs) {
                        var self = this;
                        self.lastRequest = null;
                        self._timer = setTimeout(function () {
                            self._startConnect();
                        }, delayMsecs);
                    }
                }, {
                    key: '_startConnect',
                    value: function _startConnect() {
                        var self = this;
                        this._timer = setTimeout(function () {
                            self._timeout();
                        }, this.timeout);

                        this._tries++;

                        var method = this._method;
                        var url = typeof this._url == "function" ? this._url() : this._url;
                        var headers = this._headers;
                        var body = this._body;

                        // Create a copy of the transport because we don't want
                        // to give public access to it (changing it between now and
                        // cleanup would be a no-no)
                        this._transport = chooseTransport(this.transport, url);

                        self.lastRequest = {
                            method: method,
                            uri: url,
                            headers: headers,
                            body: body,
                            transport: this._transport
                        };

                        switch (this._transport) {
                            case TransportTypes.Xhr:
                                //consoleInfo("pollymer: Using XHR transport.");
                                this._xhr = this._startXhr(method, url, headers, body);
                                break;
                            case TransportTypes.Jsonp:
                                //consoleInfo("pollymer: Using JSONP transport.");
                                this._jsonp = this._startJsonp(method, url, headers, body);
                                break;
                            default:
                                //consoleError("pollymer: Invalid transport.");
                                break;
                        }
                    }
                }, {
                    key: '_cleanupConnect',
                    value: function _cleanupConnect(abort) {
                        clearTimeout(this._timer);
                        this._timer = null;

                        switch (this._transport) {
                            case TransportTypes.Xhr:
                                //consoleInfo("pollymer: XHR cleanup");
                                this._cleanupXhr(this._xhr, abort);
                                this._xhr = null;
                                break;
                            case TransportTypes.Jsonp:
                                //consoleInfo("pollymer: json-p " + this._jsonp.id + " cleanup");
                                this._cleanupJsonp(this._jsonp, abort);
                                this._jsonp = null;
                                break;
                        }
                    }
                }, {
                    key: 'abort',
                    value: function abort() {
                        this._cleanupConnect(true);
                    }
                }, {
                    key: 'on',
                    value: function on(type, handler) {
                        return this._events.on(type, handler);
                    }
                }, {
                    key: 'off',
                    value: function off(type, handler) {
                        this._events.off(type, handler);
                    }
                }, {
                    key: '_startXhr',
                    value: function _startXhr(method, url, headers, body) {
                        var xhr = new global.XMLHttpRequest();

                        // If header has Authorization, and cors is available, then set the
                        // withCredentials flag.
                        if (this.withCredentials && corsAvailable) {
                            xhr.withCredentials = true;
                        }

                        var self = this;
                        xhr.onreadystatechange = function () {
                            self._xhrCallback();
                        };
                        xhr.open(method, url, true);

                        for (var key in headers) {
                            if (headers.hasOwnProperty(key)) {
                                xhr.setRequestHeader(key, headers[key]);
                            }
                        }

                        xhr.send(body);

                        //consoleInfo("pollymer: XHR start " + url);

                        return xhr;
                    }
                }, {
                    key: '_cleanupXhr',
                    value: function _cleanupXhr(xhr, abort) {
                        if (xhr != null) {
                            xhr.onreadystatechange = emptyMethod;
                            if (abort) {
                                xhr.abort();
                            }
                        }
                    }
                }, {
                    key: '_xhrCallback',
                    value: function _xhrCallback() {
                        var xhr = this._xhr;
                        if (xhr != null && xhr.readyState === 4) {
                            //consoleInfo("pollymer: XHR finished");

                            var code = xhr.status;
                            var reason = xhr.statusText;
                            var headers = parseResponseHeaders(xhr.getAllResponseHeaders());
                            var body = xhr.responseText;

                            this._handleResponse(code, reason, headers, body);
                        }
                    }
                }, {
                    key: '_getJsonpCallbacks',
                    value: function _getJsonpCallbacks() {
                        // Jsonp mode means we are safe to use window
                        // (Jsonp only makes sense in the context of a DOM anyway)
                        if (!(jsonpGuid in global)) {
                            global[jsonpGuid] = {
                                id: 0,
                                requests: {},
                                getJsonpCallback: function getJsonpCallback(id) {
                                    var cb;
                                    var requests = this.requests;
                                    if (id in this.requests) {
                                        cb = function (result) {
                                            requests[id]._jsonpCallback(result);
                                        };
                                    } else {
                                        //consoleInfo("no callback with id " + id);
                                        cb = emptyMethod;
                                    }
                                    return cb;
                                },
                                addJsonpCallback: function addJsonpCallback(id, obj) {
                                    this.requests[id] = obj;
                                },
                                removeJsonpCallback: function removeJsonpCallback(id) {
                                    delete this.requests[id];
                                },
                                newCallbackInfo: function newCallbackInfo() {
                                    var callbackInfo = {
                                        id: "cb-" + this.id,
                                        scriptId: "pd-jsonp-script-" + this.id
                                    };
                                    this.id++;
                                    return callbackInfo;
                                }
                            };
                        }

                        return global[jsonpGuid];
                    }
                }, {
                    key: '_startJsonp',
                    value: function _startJsonp(method, url, headers, body) {
                        var jsonpCallbacks = this._getJsonpCallbacks();
                        var jsonp = jsonpCallbacks.newCallbackInfo();

                        var paramList = ["callback=" + encodeURIComponent('window["' + jsonpGuid + '"].getJsonpCallback("' + jsonp.id + '")')];

                        if (method != "GET") {
                            paramList.push("_method=" + encodeURIComponent(method));
                        }
                        if (headers) {
                            paramList.push("_headers=" + encodeURIComponent(JSON.stringify(headers)));
                        }
                        if (body) {
                            paramList.push("_body=" + encodeURIComponent(body));
                        }
                        var params = paramList.join("&");

                        var src = url.indexOf("?") != -1 ? url + "&" + params : url + "?" + params;

                        jsonpCallbacks.addJsonpCallback(jsonp.id, this);
                        addJsonpScriptToDom(src, jsonp.scriptId);

                        //consoleInfo("pollymer: json-p start " + jsonp.id + " " + src);

                        return jsonp;
                    }
                }, {
                    key: '_cleanupJsonp',
                    value: function _cleanupJsonp(jsonp, abort) {
                        var jsonpCallbacks = this._getJsonpCallbacks();

                        if (jsonp != null) {
                            jsonpCallbacks.removeJsonpCallback(jsonp.id);
                            removeJsonpScriptFromDom(jsonp.scriptId);
                        }
                    }
                }, {
                    key: '_jsonpCallback',
                    value: function _jsonpCallback(result) {
                        //consoleInfo("pollymer: json-p " + this._jsonp.id + " finished");

                        var code = "code" in result ? result.code : 0;
                        var reason = "reason" in result ? result.reason : null;
                        var headers = "headers" in result ? result.headers : {};
                        var body = "body" in result ? result.body : null;

                        this._handleResponse(code, reason, headers, body);
                    }
                }, {
                    key: '_handleResponse',
                    value: function _handleResponse(code, reason, headers, body) {
                        this._cleanupConnect();

                        if ((code == 0 || checkForErrorCode(this.errorCodes, code)) && (this.maxTries == -1 || this._tries < this.maxTries)) {
                            this._retry();
                        } else {
                            if (code > 0) {
                                var result;
                                if (this.rawResponse) {
                                    result = body;
                                } else {
                                    try {
                                        result = JSON.parse(body);
                                    } catch (e) {
                                        result = body;
                                    }
                                }
                                this._finished(code, result, headers);
                                if (this.recurring && code >= 200 && code < 300) {
                                    this._start();
                                }
                            } else {
                                this._error(ErrorTypes.TransportError);
                            }
                        }
                    }
                }, {
                    key: '_timeout',
                    value: function _timeout() {
                        this._cleanupConnect(true);

                        if (this.maxTries == -1 || this._tries < this.maxTries) {
                            this._retry();
                        } else {
                            this._error(ErrorTypes.TimeoutError);
                        }
                    }
                }, {
                    key: '_finished',
                    value: function _finished(code, result, headers) {
                        this._delayNext = true;
                        this._events.trigger('finished', this, code, result, headers);
                    }
                }, {
                    key: '_error',
                    value: function _error(reason) {
                        this._delayNext = true;
                        this._events.trigger('error', this, reason);
                    }
                }]);

                return Request;
            })();

            _export('default', Request);
        }
    };
});
$__System.register("3b", [], function (_export) {
    "use strict";

    return {
        setters: [],
        execute: function () {
            _export("default", {
                "TransportError": 0,
                "TimeoutError": 1
            });
        }
    };
});
$__System.register("3a", [], function (_export) {
    "use strict";

    return {
        setters: [],
        execute: function () {
            _export("default", {
                "Auto": 0,
                "Xhr": 1,
                "Jsonp": 2
            });
        }
    };
});
$__System.register('3c', ['39', '3b', '3a'], function (_export) {
  'use strict';

  var Request, ErrorTypes, TransportTypes;
  return {
    setters: [function (_) {
      Request = _['default'];
    }, function (_b) {
      ErrorTypes = _b['default'];
    }, function (_a) {
      TransportTypes = _a['default'];
    }],
    execute: function () {
      _export('default', { Request: Request, ErrorTypes: ErrorTypes, TransportTypes: TransportTypes });
    }
  };
});
$__System.register('1', ['3c'], function (_export) {
  'use strict';

  var Pollymer;
  return {
    setters: [function (_c) {
      Pollymer = _c['default'];
    }],
    execute: function () {

      window.Pollymer = Pollymer;
    }
  };
});
})
(function(factory) {
  factory();
});
//# sourceMappingURL=pollymer-1.1.3.js.map