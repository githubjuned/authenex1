require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testModel(modelName) {
    console.log(`Testing ${modelName}...`);
    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hello");
        console.log(`[PASS] ${modelName} works.`);
        return true;
    } catch (e) {
        console.log(`[FAIL] ${modelName}: ${e.message.split('[')[0]}`); // Log brief error
        return false;
    }
}

async function testEmbedding(modelName) {
    console.log(`Testing Embedding ${modelName}...`);
    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.embedContent("Hello world");
        console.log(`[PASS] ${modelName} embedding works.`);
        return true;
    } catch (e) {
        console.log(`[FAIL] ${modelName}: ${e.message.split('[')[0]}`);
        return false;
    }
}

async function run() {
    await testModel("gemini-1.5-flash");
    await testModel("gemini-1.5-pro");
    await testModel("gemini-2.0-flash-001");

    await testEmbedding("text-embedding-004");
    await testEmbedding("models/gemini-embedding-001");
}

run();
