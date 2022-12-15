class JSON_METHODS {
    parse(data, fallback={}) {
        try {
            return JSON.parse(data)
        }
        catch {
            console.error('JSON parse errors', data);
            return fallback;
        }
    }
    stringify(data, fallback={}) {
        try {
            return JSON.stringify(data)
        }
        catch {
            console.error('JSON stringify errors', data);
            return fallback;
        }
    }
}


export default JSON_METHODS