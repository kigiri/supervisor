const apiBaseUrl = 'https://supervisor.oct.ovh/'
const toJSON = async r => {
  let result = await r.text()
  try {
    result = JSON.parse(result)
    if (r.ok) return result
  } catch (err) {
    console.log('error parsing', err)
  }
  console.log(result)
  const error = Error(result.message || r.status)
  error.srcStack = result.stack || result
  error.status = r.status
  error.response = r
  throw error
}

const api = (path, params = {}) => fetch(`${apiBaseUrl}${path}`, {
  credentials: 'include',
  redirect: 'follow',
  ...params,
}).then(toJSON)

api.post = (path, body) => api(path, {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(body),
})

export default api
