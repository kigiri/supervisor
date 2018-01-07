import store from './store'

const apiBaseUrl = 'https://supervisor.oct.ovh/'
const toJSON = r => {
  if (r.ok) return r.json()
  const error = Error(r.status)
  error.status = r.status
  error.response = r
  throw error
}
const apiOpts = { credentials: 'include' }
const api = (path, params) => fetch(`${apiBaseUrl}${path}`, apiOpts)
  .then(toJSON)

api('services')
  .then(services => {
    store.dispatch.LOAD_SERVICES(services)
    return { loadStatus: 'success' }
  }, err => {
    if (err.status === 401) return { loadStatus: 'unauthorized' }
    throw err
  })
  .then(store.dispatch.SET_USER_DATA, store.dispatch.UNEXPECTED_ERROR)
  .then(() => console.log('fetching ended'))
/*
const services = [
  {
    name: 'supervisor',
    version: '1.0.0',
    description: 'supervise services',
    env: {
      PORT: 6777,
      DOMAIN: 'oct.ovh',
      SCALEWAY_API_TOKEN: 'd01dfd4e-9d72-4463-xxxx-b287c610db38',
      GITHUB_CLIENT_ID: 'ae69bx29019x3x469e6a',
      GITHUB_CLIENT_SECRET: 'e9341f3e98d87xxx1d45d0a29af560xx5c2875d2',
    },
    // update, restart, config
  },
]

setTimeout(() => store.dispatch.LOAD_SERVICES(services), 600)
setTimeout(() => store.dispatch.SET_USER_DATA({
  login: 'kigiri',
  fullname: 'Clément Denis',
  avatar: 'https://avatars1.githubusercontent.com/u/231748',
  loadStatus: 'success',
}), 500)
/**/
