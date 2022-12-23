import * as http from 'node:http'
import { defaultHandler, router } from './router.js'
import jsonRes from './middleware/jsonRes.js'
import { bodyParser, buildChank } from './lib/body-parser.js'

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', `https://${req.headers.host}`)
  const routeModule = router[url.pathname].default ?? {}
  const handler = routeModule[req?.method] ?? defaultHandler

  const rawRequest = await buildChank(req)
  const { payload } = await bodyParser(req, rawRequest)

  res.json = jsonRes
  try {
    handler(req, res, url, payload, rawRequest)
  } catch (error) {
    res.statusCode = 500
    console.error('Error 500:', error)
    res.end(error)
  }
})

server.on('clientError', (err, socket) => {
  if (err) {
    console.log(err.stack)
  }
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n')
})

server.listen(process.env.PORT || 8000)

process.on('SIGINT', () => {
  server.close((error) => {
    if (error) {
      throw new Error('Something bad happened!')
    }
  })
})
