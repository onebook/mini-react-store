'use strict'

const isArray = Array.isArray

class Base {
  constructor(opst) {
    opst = opst || {}
    const store = opst.store || {}

    this._store = store
    this._listeners = {}
    this._onerror = opst.onerror || onerror
  }

  set(key, value) {
    this._store[key] = value
    this._handle(key, value)
  }

  get(key) {
    return this._store[key]
  }

  push(key, value) {
    if (isArray(this._store[key])) {
      this._store[key].push(value)
    } else {
      this._store[key] = [value]
    }

    this._handle(key, this._store[key])
  }

  /**
   * @param {String} key
   * @param {String} bindTo
   * @param {Object} context (React Component Instance)
   */
  track(key, bindTo, context) {
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
    // TODO
  }

  _handle(key, value) {
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
