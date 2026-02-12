const http = require('http');

function testNewsReal() {
    console.log("Testing News Proxy with REAL Prompt...");

    const prompt = `Find and summarize 5 very recent (last 3-6 months) news cases of deepfake fraud, AI scams, or digital arrests in India. Current Date: ${new Date().toLocaleDateString()}. Focus on LATEST incidents. Be concise.`;

    const payload = JSON.stringify({
        model: "gemini-1.5-flash",
        contents: [{ parts: [{ text: prompt }] }],
        config: {
            tools: [{ googleSearch: {} }]
        }
    });

    const options = {
        hostname: 'localhost',
        port: 3001,
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
            console.log('--- RESPONSE START ---');
            console.log(data);
            console.log('--- RESPONSE END ---');

            try {
                const json = JSON.parse(data);
                if (json.candidates && json.candidates[0].content) {
                    console.log("SUCCESS: Content generated.");
                    console.log("Snippet:", json.text.substring(0, 100));
                } else {
                    console.error("FAILURE: No content generated.");
                }
            } catch (e) {
                console.error("Invalid JSON response");
            }
        });
    });

    req.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
    });

    req.write(payload);
    req.end();
}

testNewsReal();
