
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
    const key = process.env.GEMINI_API_KEY;
    console.log("Using API Key:", key ? "Found" : "Missing");
    if (!key) return;

    try {
        // Did not find a direct list_models in the simple SDK usage often, 
        // but we can try the reliable 'gemini-pro' or 'gemini-1.0-pro' if 1.5 fails.
        // Or we can try to fetch the list via REST if SDK doesn't expose it easily in this version.
        // Let's try to hit the rest API for list models.

        const fetch = require('node-fetch'); // unlikely to be installed, use built-in fetch if node 18+ or standard https

        // Actually, let's just test a few known model names.
        const genAI = new GoogleGenerativeAI(key);

        const candidates = [
            "gemini-1.5-flash",
            "gemini-1.5-flash-latest",
            "gemini-1.5-pro",
            "gemini-1.5-pro-latest",
            "gemini-1.0-pro",
            "gemini-pro"
        ];

        for (const modelName of candidates) {
            console.log(`Checking ${modelName}...`);
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Test");
                console.log(`✅ ${modelName} is WORKING.`);
                return; // Found one!
            } catch (e) {
                console.log(`❌ ${modelName} failed: ${e.message.split('\n')[0]}`);
            }
        }

    } catch (error) {
        console.error("Listing failed:", error.message);
    }
}

listModels();
