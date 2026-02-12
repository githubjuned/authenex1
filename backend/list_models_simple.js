const https = require('https');
const fs = require('fs');
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("No API Key found");
    process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.models) {
                const names = json.models.map(m => m.name).join('\n');
                fs.writeFileSync('models_simple.txt', names, 'utf8');
                console.log("Written to models_simple.txt");
            } else {
                console.error("API Error or no models:", JSON.stringify(json, null, 2));
            }
        } catch (e) {
            console.error("Parse Error:", e);
        }
    });

}).on("error", (err) => {
    console.log("Error: " + err.message);
});
