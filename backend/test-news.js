const http = require('http');

function testNews() {
    console.log("Testing News Proxy (Native HTTP)...");

    const payload = JSON.stringify({
        model: "gemini-2.5-flash",
        contents: [{ parts: [{ text: "Find 1 recent news about AI." }] }],
        config: {
            tools: [{ googleSearch: {} }] // Top level config
        }
    });

    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/gemini/generate',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': payload.length
        }
    };

    const req = http.request(options, (res) => {
        console.log(`STATUS: ${res.statusCode}`);
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            console.log('BODY:', data);
        });
    });

    req.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
    });

    req.write(payload);
    req.end();
}

testNews();
