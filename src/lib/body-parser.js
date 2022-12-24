import JSON_METHODS from '../utils/json-methods.js'

const PROCESSED_CONTENT_TYPES = {
  'text/html': (text) => text,
  'text/plain': (text) => text,
  'application/json': (json) => JSON_METHODS.parse(json, {}),
  'application/x-www-form-urlencoded': (data) => {
    return Object.fromEntries(new URLSearchParams(data))
  },
}

const buildChank = async (req) => {
  return new Promise((resolve, reject) => {
    let rawRequest = []
    req
      .on('data', (chunk) => {
        rawRequest.push(Buffer.from(chunk))
      })
      .on('end', () => {
        rawRequest = Buffer.concat(rawRequest).toString()
        resolve(rawRequest)
      })
      .on('error', (err) => {
        console.log('Error: ', err.message)
        reject(err)
      })
  })
}

const bodyParser = async (req, rawRequest) => {
  if (!req.headers['content-type']) {
    return {}
  }

  const contentType = req.headers['content-type'].split(';')[0]
  const payload = PROCESSED_CONTENT_TYPES[contentType]?.(rawRequest) ?? {}

  return { payload }
}

export { bodyParser, buildChank }
