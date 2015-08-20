'use strict'

const isArray = Array.isArray

class Store {
  constructor(opst) {
    opst = opst || {}
    const store = opst.store || {}

    this._store = store
    this._listeners = {}
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
   * @param {String} change
   * @param {Function} listener
   */
  register(change, listener) {
    this._listeners[change] = this._listeners[change] || []
    this._listeners[change].push(listener)
  }

  unregister(change, listener) {
    // TODO
  }

  _handle(change, value) {
    let listeners = this._listeners[change]

    if (!isArray(listeners)) {
      return
    }

    Promise.all[listeners.map((listener) => {
      return listener(value)
    })]
  }
}

export default Store
