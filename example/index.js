'use strict'

import React from 'react'
import Store from '../'

/**
 * store
 */

const store = new Store({
  store: {
    title: 'hello',
    items: [{
      name: 'one',
      desc: '> one'
    }, {
      name: 'two',
      desc: '> two'
    }, {
      name: 'three',
      desc: '> three'
    }]
  }
})

setInterval(() => {
  store.set('title', 'new title - ' + now())
}, 5000)

setInterval(() => {
  store.push('items', {
    name: 'new - ' + now()
  })
}, 1000)

setInterval(() => {
  store.assign('info', {
    desc: 'hello - ' + now()
  })
}, 3000)

/**
 * component
 */

class Item1 extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      title: 'origin title - item1',
      count: 0,
      item: {
        name: 'origin name - item1'
      }
    }

    store.addListener('title', (title) => {
      this.setState({
        title: title
      })
    })

    store.addListener('items', (items) => {
      this.setState({
        count: items.length,
        item: items[items.length - 1]
      })
    })

    store.track('title', 'trackedTitle', this)
  }

  render() {
    return (
      <div>
        <p>{this.state.title}</p>
        <p>{this.state.trackedTitle}</p>
        <p>
          <div>{this.state.count}</div>
          <div>{this.state.item.name}</div>
        </p>
      </div>
    )
  }
}

class Item2 extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      title: 'origin title - item2',
      count: 0,
      item: {
        name: 'origin name - item2',
        desc: 'origin desc - item2'
      }
    }

    store.addListener('title', (title) => {
      this.setState({
        title: title
      })
    })

    store.addListener('items', (items) => {
      this.setState({
        count: items.length,
        item: items[items.length - 1]
      })
    })

    store.addListener('info', (info) => {
      this.setState({
        desc: info.desc
      })
    })

    store.addListener('info', log)

    setTimeout(() => {
      console.info('removeListener: info')
      store.removeListener('info', log)
    }, 10000)

    setTimeout(() => {
      console.log('removeAllListeners: info')
      store.removeAllListeners('info')
    }, 15000)
  }

  render() {
    return (
      <div>
        <p>{this.state.title}</p>
        <p>
          <div>{this.state.count}</div>
          <div>{this.state.item.name}</div>
          <div>{this.state.desc}</div>
        </p>
      </div>
    )
  }
}

/**
 * init
 */

window.init = function() {
  React.render(<Item1 />, document.querySelector('#item1'))
  React.render(<Item2 />, document.querySelector('#item2'))
}

/**
 * utils
 */

function now() {
  return Date.now() % 1000000
}

function log() {
  console.log('just for test - %d', now())
}
