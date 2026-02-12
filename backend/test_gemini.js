
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testModels() {
    const key = process.env.GEMINI_API_KEY;
    console.log("Using API Key:", key ? "Found (" + key.substring(0, 10) + "...)" : "Missing");

    if (!key) {
        console.error("ERROR: API Key is missing.");
        return;
    }

    const genAI = new GoogleGenerativeAI(key);
    // Testing the most likely to work model first, then the others
    const models = ["gemini-1.5-flash", "gemini-1.0-pro"];

    for (const modelName of models) {
        console.log(`\n--- Testing ${modelName} ---`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello");
            const response = await result.response;
            console.log(`SUCCESS: ${modelName} responded.`);
            console.log("Response:", response.text());
        } catch (error) {
            console.error(`FAILURE: ${modelName}`);
            console.error("Error Message:", error.message);

            if (error.response) {
                console.error("Error Response:", JSON.stringify(error.response, null, 2));
            }
            if (error.statusText) {
                console.error("Status Text:", error.statusText);
            }
        }
    }
}

testModels();
