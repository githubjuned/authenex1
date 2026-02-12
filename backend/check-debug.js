const http = require('http');

function checkConfig() {
    http.get('http://localhost:3001/api/debug/config', (res) => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            try {
                const json = JSON.parse(data);
                console.log("Debug Config:", json);
                if (json.dbType === 'MOCK') {
                    console.error("CRITICAL: Backend is using MOCK database!");
                    process.exit(1);
                } else {
                    console.log("Backend is using REAL database.");
                }
            } catch (e) {
                console.error("Failed to parse response:", e);
                process.exit(1);
            }
        });
    }).on('error', (err) => {
        console.error("Request failed:", err.message);
        process.exit(1);
    });
}

checkConfig();
