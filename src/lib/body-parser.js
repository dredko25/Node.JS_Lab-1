import JSON_METHODS from "../utils/json-methods.js";

const PROCESSED_CONTENT_TYPES = {
    'text/html': (text) => text,
    'text/plain': (text) => text,
    'application/json': (json) => JSON_METHODS.parse(json, {}),
    'application/x-www-form-urlencoded': (data) => {
        return Object.fromEntries(new URLSearchParams(data))
    }
}

async function bodyParser(req) {
    if(!req.headers['content-type']) {
        return {}
    }

    let rawRequest = '';
    for await (const chunk of req) {
        rawRequest += chunk;
    }

    const contentType = req.headers['content-type'].split(';')[0];
    const payload = PROCESSED_CONTENT_TYPES[contentType]?.(rawRequest) ?? {};

    return { payload, rawRequest };
}


export { bodyParser }