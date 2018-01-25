import ReactDOM from 'react-dom'

import 'semantic-ui-css/semantic.min.css'
import './ui.css'

import './user-data'
import app from './app'
import store from './store'


let timeout
const render = () => {
  clearTimeout(timeout)
  ReactDOM.render(app(store.getState()), document.getElementById('app'))
  timeout = setTimeout(render, 5000)
}

store.subscribe(render)

render()
