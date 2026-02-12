const http = require('http');

function checkProxy() {
    console.log("Testing proxy http://localhost:5173/api/debug/config ...");
    http.get('http://localhost:5173/api/debug/config', (res) => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            console.log(`Response Status: ${res.statusCode}`);
            console.log(`Response Data: ${data}`);

            if (data.includes('REAL')) {
                console.log("SUCCESS: Proxy is working and hitting REAL DB backend.");
            } else if (data.includes('Warning: Script Execution Risk') || data.includes('<!DOCTYPE html>')) {
                console.error("FAILURE: Proxy returned HTML/Warning. Probably hitting frontend instead of backend.");
            } else {
                console.log("Ambiguous response.");
            }
        });
    }).on('error', (err) => {
        console.error("Request failed:", err.message);
    });
}

checkProxy();
