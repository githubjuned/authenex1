const https = require('https');
require('dotenv').config();

function testNews() {
    const apiKey = process.env.NEWSDATA_API_KEY || "pub_1625e8f3ed3a49969dd8aebc2cea4dd3";
    console.log(`Testing with API Key: ${apiKey}`);

    // Added &category=technology to filter better? Or removed query to test latest?
    // Keeping original query first to reproduce issue.
    const apiUrl = `https://newsdata.io/api/1/news?apikey=${apiKey}&q=deepfake OR "AI scam" OR "digital arrest"&language=en`;

    console.log(`Fetching: ${apiUrl}`);

    https.get(apiUrl, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            try {
                const json = JSON.parse(data);
                if (json.status !== 'success') {
                    console.error("API Error:", json);
                    return;
                }

                console.log(`Total Results: ${json.totalResults}`);
                console.log("--- Top 5 Articles ---");
                json.results.slice(0, 5).forEach((article, index) => {
                    console.log(`\n[${index + 1}] ${article.title}`);
                    // pubDate might be null or format different
                    console.log(`    Date: ${article.pubDate}`);
                    console.log(`    Source: ${article.source_id}`);
                });

            } catch (e) {
                console.error("JSON Parse Error:", e.message);
                console.log("Raw Response:", data.substring(0, 500));
            }
        });

    }).on('error', (err) => {
        console.error("Network Error:", err.message);
    });
}

testNews();
