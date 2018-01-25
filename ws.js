import store from './store'

const wsStates = [ 'connecting', 'open', 'closing', 'closed' ]
const reasons = {
  1001: 'An endpoint is "going away", such as a server going down or a browser having navigated away from a page.',
  1002: 'An endpoint is terminating the connection due to a protocol error',
  1003: 'An endpoint is terminating the connection because it has received a type of data it cannot accept (e.g., an endpoint that understands only text data MAY send this if it receives a binary message).',
 // 1004: 'Reserved. The specific meaning might be defined in the future.',
  1005: 'No status code was actually present.',
  1006: 'The connection was closed abnormally, e.g., without sending or receiving a Close control frame',
  1007: 'An endpoint is terminating the connection because it has received data within a message that was not consistent with the type of the message (e.g., non-UTF-8 [http://tools.ietf.org/html/rfc3629] data within a text message).',
  1008: 'An endpoint is terminating the connection because it has received a message that "violates its policy". This reason is given either if there is no other sutible reason, or if there is a need to hide specific details about the policy.',
  1009: 'An endpoint is terminating the connection because it has received a message that is too big for it to process.',
  1010: 'An endpoint (client) is terminating the connection because it has expected the server to negotiate one or more extension, but the server didn\'t return them in the response message of the WebSocket handshake.',
  1011: 'A server is terminating the connection because it encountered an unexpected condition that prevented it from fulfilling the request.',
  1015: 'The connection was closed due to a failure to perform a TLS handshake (e.g., the server certificate can\'t be verified).',
}

let _debounce
let _logsCache = []
let _index = 0
const parseLog = l => {
  try {
    const {
      __REALTIME_TIMESTAMP: id,
      _SYSTEMD_UNIT,
      SYSLOG_IDENTIFIER: source,
      MESSAGE: message,
    } = JSON.parse(l)
    const service = (_SYSTEMD_UNIT || '').slice(0, -8)
    const date = new Date(Number(id.slice(0, -3)))
    return { index: _index++, id, source, message, date }
  } catch (err) {
    console.log('unable to parse log', l)
  }
}

const dispatchStatus = rawData => {
  try { store.dispatch.UPDATE_STATUS(JSON.parse(rawData)) }
  catch (err) { console.log('unable to parse status', rawData) }
}

const dispatchLogs = () => {
  const logs = _logsCache
  _logsCache = []
  store.dispatch.ADD_LOGS(logs)
}

const onmessage = ({ data }) => {
  if (typeof data === 'string') return dispatchStatus(data)

  const logs = String.fromCharCode.apply(null, new Uint8Array(data))
    .split('\n')
    .filter(Boolean)

  _logsCache = _logsCache.concat(logs.map(parseLog))
  clearTimeout(_debounce)
  _debounce = setTimeout(dispatchLogs, 250)
}

const connectWs = (tries = 1) => {
  const factor = tries ** 4
  const nextTryIn = Math.floor(Math.random() * factor + factor + 100)
  console.log(`Connecting to WebSocket... next try in ${nextTryIn}ms`)
  const ws = new WebSocket('wss://supervisor.oct.ovh')
  ws.binaryType = 'arraybuffer'
  ws.onmessage = onmessage
  ws.onclose = ({ code }) => {
    if (code !== 1000) {
      store.dispatch.ERROR(Error(reasons[code] || 'Unknown reason'))
      setTimeout(connectWs, nextTryIn, tries + 1)
    }
  }
  ws.onopen = () => {
    tries = 0
    store.dispatch.WS(ws)
  }
}

export default connectWs
