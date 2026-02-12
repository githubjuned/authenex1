const http = require('http');

function verifyNewsEndpoint() {
    console.log("Verifying /api/news endpoint...");

    const options = {
        hostname: '127.0.0.1',
        port: 3001,
        path: '/api/news',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        timeout: 10000 // 10s timeout
    };

    const req = http.request(options, (res) => {
        console.log(`STATUS: ${res.statusCode}`);

        if (res.statusCode === 404) {
            console.error("FAILURE: Endpoint not found. Did you restart the server?");
            return;
        }

        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            try {
                const json = JSON.parse(data);
                console.log("RESPONSE TYPE:", Array.isArray(json) ? "Array" : typeof json);
                console.log("ITEM COUNT:", json.length);
                if (json.length > 0) {
                    console.log("FIRST ITEM:", JSON.stringify(json[0], null, 2));
                    if (json[0].sourceUrl) {
                        console.log("SUCCESS: News item has sourceUrl.");
                    } else {
                        console.error("FAILURE: News item missing sourceUrl.");
                    }
                } else {
                    console.log("WARNING: No news returned (could be empty validated list, but endpoint works).");
                }
            } catch (e) {
                console.error("FAILURE: Invalid JSON response:", data.substring(0, 100));
            }
        });
    });

    req.on('error', (e) => {
        console.error(`PROBLEM: ${e.message}`);
    });

    req.end();
}

verifyNewsEndpoint();
