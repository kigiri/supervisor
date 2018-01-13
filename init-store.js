import { createStore, applyMiddleware, compose } from 'redux'


export const handleAsync = (reducers, { type, init, success, failure }) => {
  reducers[type] = init
  reducers[`${type}/@@SUCCESS`] = success
  reducers[`${type}/@@FAILURE`] = failure
}
export const initStore = ({
  reducers,
  controlled = [],
  middlewares = [],
  initialState = {},
}) => {
  initialState.async || (initialState.async = {})
  const values = initialState.inputsValues || (initialState.inputsValues = {})
  controlled.reduce((acc, key) => (values[key] || (values[key] = ''), acc), {})

  const actions = Object.keys(reducers)
    .reduce((src, key) => {
      src[key] = key
      initialState.async[key] = {}
      return src
    }, Object.create(null))

  const id = _ => _
  const composeExtended = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
  const store = createStore((state, action) => {
    const reducer = reducers[action.type]
    if (!reducer && action.type.includes('/@@')) {
      const [ type, status ] = action.type.split('/@@')
      console.log(action.type, { type, status, data: action.data })
      return {
        ...state,
        async: {
          ...state.async,
          [type]: status === 'DISMISS' ? {} : {
            start: state.async[type].start,
            data: state.async[type].data,
            end: Date.now(),
            [status === 'FAILURE' ? 'error' : 'success']: action.data
          },
        },
      }
    }
    const asyncValue = state.async[action.type]
    if (asyncValue && asyncValue.start && !asyncValue.end) {
      console.error('Action type', action.type, 'requested while pending')
      return state
    }
    const result = (reducer || id)(state, action)
    if (!result || typeof result.then !== 'function') return result
    result
      .then(data => store.dispatch({ type: `${action.type}/@@SUCCESS`, data }),
        data => store.dispatch({ type: `${action.type}/@@FAILURE`, data }))
    state.async[action.type] = { start: Date.now(), data: action.data }
    return state
  }, initialState,
    composeExtended(applyMiddleware(...middlewares)))

  Object.keys(actions).reduce((src, type) => {
    src[type] = data => store.dispatch({ type, data })
    const dismissType = `${type}/@@DISMISS`
    src[`DISMISS_${type}`] = data => store.dispatch({ type: dismissType, data })
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
