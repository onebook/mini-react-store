### mini-react-store

* only store, mini store.

### Example

```js
/**
 * store
 */

'use strict'

import Store from 'mini-react-store'

const store = new Store({
  store: {
    title: 'hello',
    items: [{
      name: 'one'
    }, {
      name: 'two'
    }]
  }
})

class Item extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      title: 'origin title',
      count: 0,
      item: {
        name: 'origin name'
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
  }

  render() {
    return (
      <div>
        <p>{this.state.title}</p>
        <p>
          <div>{this.state.count}</div>
          <div>{this.state.item.name}</div>
        </p>
      </div>
    )
  }
}

React.render(<Item />, document.body)
```

### APIs

* Basic Store

```js
import Store from 'mini-react-store'

const store = new Store()
```

  - `set(key, value)`
  - `get(key)`
  - `push(key, value)`
  - `track(key, bindTo, context)`
  - `addListener(key, listener)`
  - `removeListener(key, listener)`

### License
MIT
