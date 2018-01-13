import ReactDOM from 'react-dom'

import 'semantic-ui-css/semantic.min.css'
import './ui.css'

import './user-data'
import app from './app'
import store from './store'

const render = () =>
  ReactDOM.render(app(store.getState()), document.getElementById('app'))

store.subscribe(render)

render()
