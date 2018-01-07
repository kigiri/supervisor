import initStore from './init-store'

const del = (key, obj) => {
  const r = { ...obj }
  delete r[key]
  return r
}

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

const updateService = (state, serviceName, action, ...args) => state.services
  .map(service => service.name === serviceName
    ? action(service, ...[ ...args, state ])
    : service)

const envChange = (service, key, value) =>
  ({ ...service, env: { ...service.env, [key]: value } })
reducers.ENV_CHANGE = (state, { data: { serviceName, value, key } }) => ({
  ...state,
  services: updateService(state, serviceName, envChange, key, value),
})

const addEnv = (service, state) =>
  ({ ...service, env: { ...service.env, [state.inputsValues.addEnv]: '' } })
reducers.ADD_ENV = (state, { data: serviceName }) => ({
  ...state,
  inputsValues: { ...state.inputsValues, addEnv: '' },
  services: updateService(state, serviceName, addEnv),
})

const delEnv = (service, key) =>
  ({ ...service, env: del(key, service.env) })
reducers.DEL_ENV = (state, { data: { serviceName, key } }) => ({
  ...state,
  inputsValues: { ...state.inputsValues, addEnv: '' },
  services: updateService(state, serviceName, delEnv, key),
})

const serviceSelect = (service, selected) => ({ ...service, selected })
reducers.SERVICE_SELECT = (state, { data: { serviceName, selected } }) => ({
  ...state,
  services: updateService(state, serviceName, serviceSelect, selected),
})


export default initStore({
  controlled: [ 'serviceName', 'serviceRepo', 'addEnv' ],
  reducers,
  initialState: {
    user: { loadStatus: 'loading' },
    services: [],
  }
})
