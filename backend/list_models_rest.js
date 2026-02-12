
const https = require('https');
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;
console.log("Using API Key:", apiKey ? "Found" : "Missing");

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        if (res.statusCode === 200) {
            try {
                const json = JSON.parse(data);
                console.log("--- Available Models ---");
                if (json.models) {
                    json.models.forEach(m => {
                        if (m.name.includes('gemini')) {
                            console.log(m.name);
                        }
                    });
                } else {
                    console.log("No models found in response.");
                }
            } catch (e) {
                console.error("Error parsing JSON:", e.message);
            }
        } else {
            console.error(`Request failed with status: ${res.statusCode}`);
            console.error("Response:", data);
        }
    });

}).on("error", (err) => {
    console.error("Error: " + err.message);
});
