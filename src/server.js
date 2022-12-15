import * as http from "node:http";
import { router  } from "./router.js";

const server = http.createServer(async (req, res) => {
    const url = new URL(req.url || "/", `https://${req.headers.host}`);
    const routeModule = router[url.pathname].default ?? {};
    const handler = routeModule[req?.method];
});

server.on("clientError", (err, socket) => {
    socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
});

server.listen(process.env.PORT || 8000);

process.on("SIGINT", () => {
    server.close((error) => {
        if (error) {
            console.error(error);
            process.exit(1);
        }
    });
});
