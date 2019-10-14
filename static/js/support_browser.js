String.prototype.padStart || (String.prototype.padStart = function (t, e) {
  return t >>= 0, e = String(void 0 !== e ? e : ' '), this.length > t ? String(this) : ((t -= this.length) > e.length && (e += e.repeat(t / e.length)), e.slice(0, t) + String(this))
}), Array.prototype.includes || Object.defineProperty(Array.prototype, 'includes', {
  value: function (t, e) {
    if (this == null) throw new TypeError('"this" is null or not defined')
    var n = Object(this),
      r = n.length >>> 0
    if (r === 0) return !1
    var i, o, c = 0 | e,
      u = Math.max(c >= 0 ? c : r - Math.abs(c), 0)
    for (; u < r;) {
      if ((i = n[u]) === (o = t) || 'number' === typeof i && 'number' === typeof o && isNaN(i) && isNaN(o)) return !0
      u++
    }
    return !1
  }
})
var reduce = Function.bind.call(Function.call, Array.prototype.reduce),
  isEnumerable = Function.bind.call(Function.call, Object.prototype.propertyIsEnumerable),
  concat = Function.bind.call(Function.call, Array.prototype.concat),
  keys = Reflect.ownKeys
Object.values || (Object.values = function (t) {
  return reduce(keys(t), function (e, n) {
    return concat(e, 'string' === typeof n && isEnumerable(t, n) ? [t[n]] : [])
  }, [])
}), Object.entries || (Object.entries = function (t) {
  return reduce(keys(t), function (e, n) {
    return concat(e, 'string' === typeof n && isEnumerable(t, n) ? [
      [n, t[n]]
    ] : [])
  }, [])
})

window.addEventListener('keydown', function (e) {
  if (e.keyIdentifier == 'U+000A' || e.keyIdentifier == 'Enter' || e.keyCode == 13) {
    if (e.target.nodeName == 'INPUT' && e.target.type == 'text') {
      e.preventDefault()
      return false
    }
  }
}, true)


// url search params
function URLSearchParams (query) {
  var
    index, key, value,
    pairs, i, length,
    dict = Object.create(null)
  this[secret] = dict
  if (!query) return
  if (typeof query === 'string') {
    if (query.charAt(0) === '?') {
      query = query.slice(1)
    }
    for (
      pairs = query.split('&'),
      i = 0,
      length = pairs.length; i < length; i++
    ) {
      value = pairs[i]
      index = value.indexOf('=')
      if (index > -1) {
        appendTo(
          dict,
          decode(value.slice(0, index)),
          decode(value.slice(index + 1))
        )
      } else if (value.length) {
        appendTo(
          dict,
          decode(value),
          ''
        )
      }
    }
  } else {
    if (isArray(query)) {
      for (
        i = 0,
        length = query.length; i < length; i++
      ) {
        value = query[i]
        appendTo(dict, value[0], value[1])
      }
    } else {
      for (key in query) {
        appendTo(dict, key, query[key])
      }
    }
  }
}

var
  isArray = Array.isArray,
  URLSearchParamsProto = URLSearchParams.prototype,
  find = /[!'\(\)~]|%20|%00/g,
  plus = /\+/g,
  replace = {
    '!': '%21',
    "'": '%27',
    '(': '%28',
    ')': '%29',
    '~': '%7E',
    '%20': '+',
    '%00': '\x00'
  },
  replacer = function (match) {
    return replace[match]
  },
  secret = '__URLSearchParams__:' + Math.random()

function appendTo (dict, name, value) {
  if (name in dict) {
    dict[name].push('' + value)
  } else {
    dict[name] = isArray(value) ? value : ['' + value]
  }
}

function decode (str) {
  return decodeURIComponent(str.replace(plus, ' '))
}

function encode (str) {
  return encodeURIComponent(str).replace(find, replacer)
}

URLSearchParamsProto.append = function append (name, value) {
  appendTo(this[secret], name, value)
};

URLSearchParamsProto.delete = function del (name) {
  delete this[secret][name]
};

URLSearchParamsProto.get = function get (name) {
  var dict = this[secret]
  return name in dict ? dict[name][0] : null
};

URLSearchParamsProto.getAll = function getAll (name) {
  var dict = this[secret]
  return name in dict ? dict[name].slice(0) : []
};

URLSearchParamsProto.has = function has (name) {
  return name in this[secret]
};

URLSearchParamsProto.set = function set (name, value) {
  this[secret][name] = ['' + value]
};

URLSearchParamsProto.forEach = function forEach (callback, thisArg) {
  var dict = this[secret]
  Object.getOwnPropertyNames(dict).forEach(function (name) {
    dict[name].forEach(function (value) {
      callback.call(thisArg, value, name, this)
    }, this)
  }, this)
};

/*
URLSearchParamsProto.toBody = function() {
  return new Blob(
    [this.toString()],
    {type: 'application/x-www-form-urlencoded'}
  );
};
*/

URLSearchParamsProto.toJSON = function toJSON () {
  return {}
};

URLSearchParamsProto.toString = function toString () {
  var dict = this[secret],
    query = [],
    i, key, name, value
  for (key in dict) {
    name = encode(key)
    for (
      i = 0,
      value = dict[key]; i < value.length; i++
    ) {
      query.push(name + '=' + encode(value[i]))
    }
  }
  return query.join('&')
};
