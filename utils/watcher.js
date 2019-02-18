// 确定每一个需要 watch 的变量
const setWatcher = function(page) {
  let data = page.data || page.globalData
  let watch = page.watch

  Object.keys(watch).forEach(key => {
    // 拆分后的 key 数组
    let keysArr = key.split('.')
    let nowData = data
    let lastKey = keysArr[keysArr.length - 1]

    for (let i = 0; i < keysArr.length - 1; i++) {
      nowData = nowData[keysArr[i]]
    }

    // 兼容deep监听
    let watchFun = watch[key].handler || watch[key]
    let deep = watch[key].deep  // 没有则为 undefined

    this.observe(nowData, lastKey, watchFun, deep, page)
  })
}

// 对每个需要监听的变量进行监听
const observe = function(obj, key, watchFun, deep, page) {
  let val = obj[key]

  // 深度监听( val 不能为空 )
  if (deep && val != null && typeof val === 'object') {
    Object.keys(val).forEach( childKey => {
      observe(val, childKey, watchFun, deep, page)
    })
  }

  // 
  let _this = this
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: true,
    set(value) {
      if (isEqualDeep(value, val)) return
      watchFun.call(page, value, val)
      val = value
      // if (deep) { // 若是深度监听,重新监听该对象，以便监听其属性。
      //   observe(obj, key, watchFun, deep, page)
      // }
    },
    get() {
      return val
    }
  })
}


const _keys = function (obj) {
  if (Array.isArray(obj))
    return []
  else if (Object.keys)
    return Object.keys(obj)
}
const _has = function (obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key)
}
const isEqualDeep = function (a, b, aStack, bStack) {
  let _aStack = aStack ? aStack : [];
  let _bStack = bStack ? bStack : [];
  // 排除 0 和 -0
  if (a === b) {
    return a !== 0 || 1 / a === 1 / b
  }
  // 排除 null 和 undefined
  if (a == null || b == null) {
    return a === b
  }
  // 排除原始类型剩余情况
  let className = Object.prototype.toString.call(a)
  if (className !== Object.prototype.toString.call(b)) {
    return false
  }
  switch (className) {
    case '[object RegExp]':
    case '[object String]':
      return '' + a === '' + b
    case '[object Number]':
      if (+a !== +a)  // 排除 NaN
        return +b !== +b
      return +a === 0 ? 1 / +a === 1 / b : +a === +b
    case '[object Date]':
    case '[object Boolean]':
      return +a === +b;
  }
  // 以上比对完基本数据类型
  var areArrays = className === '[object Array]'
  // 不是数组
  if (!areArrays) {
    if (typeof a != 'object' || typeof b != 'object') return false

    let aCtor = a.constructor, bCtor = b.constructor
    if ( aCtor !== bCtor && !(typeof aCtor === 'function' && aCtor instanceof aCtor &&
      typeof bCtor === 'function' && bCtor instanceof bCtor)
      && ('constructor' in a && 'constructor' in b) ) {
      return false
    }
  }
  var length = _aStack.length
  while (length--) 
    if (_aStack[length] === a)
      return _bStack[length] === b

  _aStack.push(a)
  _bStack.push(b)
  let size, result

  if (areArrays) {
    size = a.length
    result = size === b.length
    if (result) 
      while (size--) 
        if (!(result = isEqualDeep(a[size], b[size], _aStack, _bStack)))
          break
  } else {
    let keys = _keys(a), key
    size = keys.length
    result = _keys(b).length === size
    if (result) {
      while (size--) {
        key = keys[size]
        if (!(result = _has(b, key) && isEqualDeep(a[key], b[key], _aStack, _bStack)))
          break
      }
    }
  }
  _aStack.pop()
  _bStack.pop()
  return result
}

export default {
  setWatcher, observe
}
