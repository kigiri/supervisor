const apiBaseUrl = 'https://supervisor.oct.ovh/'
const toJSON = r => {
  if (r.ok) return r.json()
  const error = Error(r.status)
  error.status = r.status
  error.response = r
  throw error
}

const api = (path, params = {}) => fetch(`${apiBaseUrl}${path}`, {
  credentials: 'include',
  redirect: 'follow',
  ...params,
}).then(toJSON)

const headers = {
  'Accept': 'application/json, text/plain, */*',
  'Content-Type': 'application/json',
}

api.post = (path, body) => api(path, {
  method: 'POST',
  body: JSON.stringify(body),
  headers,
})

export default api
