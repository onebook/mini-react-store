'use strict'

import objAssign from 'object-assign'
const isArray = Array.isArray

class Base {
  constructor(opst) {
    opst = opst || {}
    const store = opst.store || {}

    this._store = store
    this._listeners = {}
    this._onerror = opst.onerror || onerror
  }

  /**
   * @param {String} key
   * @param {Object} value
   * @param {Boolean} silent
   */
  assign(key, value, silent) {
    let data = this._store[key] || {}
    data = objAssign(data, value)

    this._store[key] = data
    this._handle(key, data, silent)
  }

  set(key, value, silent) {
    this._store[key] = value
    this._handle(key, value, silent)
  }

  get(key) {
    return this._store[key]
  }

  pop(key, silent) {
    if (isArray(this.get(key))) {
      let v = this.get(key).pop()
      this._handle(key, this.get(key), silent)
      return v
    }
  }

  shift(key, silent) {
    if (isArray(this.get(key))) {
      let v = this.get(key).shift()
      this._handle(key, this.get(key), silent)
      return v
    }
  }

  push(key, value, silent) {
    if (isArray(this.get(key))) {
      this.get(key).push(value)
    } else {
      this._store[key] = [value]
    }

    this._handle(key, this.get(key), silent)
  }

  /**
   * @param {String} key
   * @param {String} bindTo
   * @param {Object} context (React Component Instance)
   */
  track(key, bindTo, context) {
    if (typeof bindTo === 'object') {
      context = bindTo
      bindTo = key
    }

    this.addListener(key, (value) => {
      context.setState({
        [bindTo]: value
      })
    })
  }

  /**
   * @param {String} key
   * @param {Function} listener
   */
  addListener(key, listener) {
    this._listeners[key] = this._listeners[key] || []
    this._listeners[key].push(listener)
  }

  removeListener(key, listener) {
    let listeners = this._listeners[key]

    if (listeners && listeners.length) {
      for (let i = 0; i < listeners.length; i++) {
        if (listener === listeners[i]) {
          listeners.splice(i, 1)
        }
      }
    }
  }

  removeAllListeners(key) {
    delete this._listeners[key]
  }

  _handle(key, value, silent) {
    if (silent) {
      return
    }

    let listeners = this._listeners[key]

    if (!isArray(listeners)) {
      return
    }

    Promise.all(listeners.map((listener) => {
      return listener(value)
    }))
    .then(noop)
    .catch(this._onerror)
  }
}

function noop() {}

function onerror(err) {
  console.error(err)
}

export default Base
