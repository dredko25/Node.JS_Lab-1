import * as http from 'node:http'
import { router } from './router.js'
import jsonRes from "./middleware/jsonRes.js";
import { bodyParser } from "./lib/body-parser.js";

const server = http.createServer(async (req, res) => {
    const url = new URL(req.url || '/', `https://${req.headers.host}`)
    const routeModule = router[url.pathname].default ?? {}
    const handler = routeModule[req?.method];
    const { payload, rawRequest } = await bodyParser(req);

    try {
        handler(req, Object.assign(res, jsonRes), url, payload, rawRequest);
    } catch (error) {
        res.statusCode = 500;
        res.end(error);
    }
})

server.on('clientError', (err, socket) => {
    if (err) {
        console.log(err.stack);
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
