import { createStore } from 'redux'

export default ({ initialState = {}, reducers, controlled = [] }) => {
  const values = initialState.inputsValues || (initialState.inputsValues = {})
  controlled.reduce((acc, key) => (values[key] || (values[key] = ''), acc), {})

  const actions = Object.keys(reducers)
    .reduce((src, key) => (src[key] = key, src), Object.create(null))

  const id = _ => _
  const store = createStore((state, action) =>
    (reducers[action.type] || id)(state, action), initialState)

  Object.keys(actions).reduce((src, type) => {
    src[type] = data => store.dispatch({ type, data })
    return src
  }, store.dispatch)

  const update = inputName => ({ target: { value } }) =>
    store.dispatch.INPUT_CHANGE({ inputName, value })

  store.actions = actions
  store.reducers = reducers
  store.controlled = controlled.reduce((acc, key) =>
    (acc[key] = update(key), acc), {})

  return store
}
