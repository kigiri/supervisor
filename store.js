import { handleAsync, initStore } from './init-store'
import api from './api'

const del = (key, obj) => {
  const r = { ...obj }
  delete r[key]
  return r
}

const send = ({ ws }, route, message) => (ws && ws.readyState === 1)
  ? ws.send(`${route}:${message}`)
  : console.error('unable to send message ', `${route}:${message}`)

const reducers = Object.create(null)
reducers.SET_USER_DATA = (state, { data: user }) =>
  ({ ...state, user })

reducers.LOAD_SERVICES = (state, { data: services }) =>
  ({ ...state, services })

reducers.UNEXPECTED_ERROR = (state, { data: error }) =>
  ({ ...state, error })

reducers.INPUT_CHANGE = (state, { data: { inputName, value } }) => ({
  ...state,
  inputsValues: {
    ...state.inputsValues,
    [inputName]: value,
  }
})

/////////////////////////////////////// API
'add.update.restart.start.stop'.split('.').forEach(key =>
  reducers[`${key.toUpperCase()}_SERVICE`] = (state, { data }) =>
    data.name === 'supervisor'
      ? api.post(key, data).catch(err => {
        console.log(err.status)
        if (err.status === 502) return 'OK'
        throw error
      })
      : api.post(key, data))

const updateService = (state, serviceName, action, ...args) => ({
  ...state.services,
  [serviceName]: action(state.services[serviceName], ...[ ...args, state ]),
})

const setServiceProperty = (service, key, value) =>
  ({ ...service, [key]: value })

const envChange = (service, key, value) =>
  ({ ...service, env: { ...service.env, [key]: value } })

const delEnv = (service, key) =>
  ({ ...service, env: del(key, service.env) })

const addEnv = (service, state) => ({
  ...service,
  env: { ...service.env, [state.inputsValues.addEnv.toUpperCase()]: '' },
})

reducers.UPDATE_STATUS = (state, { data: { name, key, time } }) => ({
  ...state,
  services: updateService(state, name, setServiceProperty, key, time),
})

reducers.ENV_CHANGE = (state, { data: { serviceName, value, key } }) => ({
  ...state,
  services: updateService(state, serviceName, envChange, key, value),
})

reducers.ADD_ENV = (state, { data: serviceName }) => ({
  ...state,
  inputsValues: { ...state.inputsValues, addEnv: '' },
  services: updateService(state, serviceName, addEnv),
})

reducers.DEL_ENV = (state, { data: { serviceName, key } }) => ({
  ...state,
  inputsValues: { ...state.inputsValues, addEnv: '' },
  services: updateService(state, serviceName, delEnv, key),
})

reducers.HIDE_ENV = state => ({
  ...state,
  hideEnv: !state.hideEnv,
})

reducers.SERVICE_SELECT = (state, { data: { serviceName, selected } }) => {
  const prev = state.selectedService !== serviceName
    && state.services[state.selectedService]

  const service = { ...state.services[serviceName], selected }
  const newState = {
    ...state,
    selectedService: serviceName,
    services: {
      ...state.services,
      [serviceName]: service,
    },
  }
  if (prev) {
    const newPrev = newState.services[prev.name]
    newPrev.selected = undefined
    newPrev.logs = []
  }
  if (selected === 'log') {
    send(state, 'sub', serviceName)
    setTimeout(autoScroll, 100)
  } else {
    send(state, 'unsub', serviceName)
    service.logs = []
  }
  return newState
}

const debounce = (fn, time = 100, clear = {}) => (...args) => {
  clearTimeout(clear.timeout)
  clear.timeout = setTimeout(() => fn(...args)
    .then(clear.s, clear.f)
    .then(clear.clear || (clear.clear = () => clear.q = undefined)), time)
  return clear.q || (clear.q = new Promise((s,f) => (clear.s = s, clear.f = f)))
}
const debouncedPost = debounce(api.post, 500)
const syncApi = subStore => next => async action => {
  const nextAction = next(action)
  switch (action.type) {
  case 'DEL_ENV':
  case 'ADD_ENV': {
    const name = action.data.serviceName || action.data
    await api.post('env', {
      name,
      env: btoa(JSON.stringify(subStore.getState().services[name].env)),
    })
    return nextAction
  }
  case 'ENV_CHANGE': {
    const name = action.data.serviceName || action.data
    await debouncedPost('env', {
      name,
      env: btoa(JSON.stringify(subStore.getState().services[name].env)),
    })
    return nextAction
  }
  default: return nextAction
  }
}
//////////////////////////////////// WEBSOCKET

reducers.WS = (state, { data: ws }) => ({ ...state, ws })

const comp = (a, b) => a === b ? 0 : (a > b ? 1 : -1)
const byId = (a, b) => comp(a.id, b.id) || a.index - b.index
const isNotNotif = n => !n.isNotif
const aggregateSame = (total, curr, i) => {
  const prev = total[total.length - 1]
  if (!prev) return [ curr ]
  if (prev && prev.message === curr.message
    && prev.boot === curr.boot
    && prev.source === prev.source
    && prev.isError === prev.isError) {
    (prev.repeated || (prev.repeated = [])).push(curr.date)
  } else {
    total.push(curr)
  }
  return total
}
const autoScroll = () => {
  const tr = document.querySelector('#service-log tr')
  if (!tr) return setTimeout(autoScroll, 20)

  const logger = document.getElementById('service-log')
  logger.scrollTop = logger.scrollHeight - logger.clientHeight
}
const addLogs = (logs, state) => {
  const service = state.services[state.selectedService]
  const el = document.getElementById('service-log')
  if (el) {
    const safe = el
      && (el.scrollHeight - (el.clientHeight + el.scrollTop)) < 20
      && setTimeout(autoScroll, 20)
  } else {
    setTimeout(autoScroll, 30)
  }
  return {
    ...state,
    services: {
      ...state.services,
      [service.name]: {
        ...service,
        sub: true,
        logs: (service.logs || [])
          .slice(-300)
          .filter(isNotNotif)
          .concat(logs)
          .sort(byId)
          .reduce(aggregateSame, []),
      }
    }
  }
}

reducers.SUB = state => {
  const date = new Date
  const message = (state.ws && state.ws.readyState === 1)
    ? `connecting to journalctl...`
    : `waiting for websocket to be connected, currently ${state.ws.readyState}`
  return addLogs([{
    date,
    message,
    index: -1,
    id: `${date.getTime()}${String(performance.now()).slice(0, 3)}`,
    isNotif: true,
    source: 'store.js',
  }], state)
}

reducers.ADD_LOGS = (state, { data: logs }) => addLogs(logs, state)

reducers.ERROR = (state, { data: error }) => ({ ...state, error })

reducers.DISMISS_ERROR = state => ({ ...state, error: undefined })

export default initStore({
  controlled: [ 'serviceName', 'serviceRepo', 'addEnv' ],
  reducers,
  initialState: {
    ws: {},
    hideEnv: true,
    user: { loadStatus: 'loading' },
    services: {},
  },
  middlewares: [ syncApi ],
})
