const fetch = require('node-fetch');

const API_URL = 'http://localhost:3001/api';
// Use a fixed test user ID to simulate "logging back in"
const TEST_USER_ID = 'test-persistence-user-v1';

async function runTest() {
    console.log("--- Starting Persistence Test ---");

    // 1. Create/Update User
    console.log(`\n1. Creating/Updating User: ${TEST_USER_ID}`);
    const userPayload = {
        id: TEST_USER_ID,
        name: 'Persistence Tester',
        email: 'test@example.com',
        role: 'user',
        plan: 'Pro',
        credits: 999, // Specific number to mock a change
        totalCredits: 1000,
        riskScore: 0,
        createdAt: new Date().toISOString()
    };

    // Mock token - backend verifies it but for local testing verifyToken might be blocking
    // We might need to bypass auth for this test or mock it in server_new.js temporarily 
    // BUT looking at server_new.js, verifyToken checks req.headers.authorization.
    // If we don't provide a valid firebase token, it will fail.
    // However, for the sake of this test, let's see if we can hit it.
    // Ideally we should use the admin SDK to generate a custom token, but let's try to hit the "local" environment.

    // Wait, the backend uses `auth.verifyIdToken(idToken)`. Without a real client token, we can't easily pass this middleware.
    // FOR DEBUGGING: I will temporarily modify `server_new.js` to bypass token verification for this specific test user OR 
    // I can use the `test-db.js` approach (direct DB access) to verify persistence first, effectively separating API layer from DB layer.

    // Let's stick to Direct DB access first to rule out DB issues.

    const { db } = require('./firebase');

    console.log("Directly accessing DB...");

    // 1. Save User
    console.log("Saving user to Firestore...");
    await db.collection('users').doc(TEST_USER_ID).set(userPayload, { merge: true });
    console.log("User saved.");

    // 2. Save Analysis
    console.log("Saving mock analysis...");
    const analysisPayload = {
        id: `test-scan-${Date.now()}`,
        timestamp: new Date().toISOString(),
        thumbnail: "base64-mock-string",
        result: { verdict: "REAL", confidence: 0.99 },
        userId: TEST_USER_ID
    };
    await db.collection('analyses').add(analysisPayload);
    console.log("Analysis saved.");

    // 3. Read Back
    console.log("\nReading back data...");

    const userDoc = await db.collection('users').doc(TEST_USER_ID).get();
    if (userDoc.exists) {
        console.log("User Data Retrieved:", userDoc.data());
        console.log("User Persistence: PASS");
    } else {
        console.error("User Persistence: FAIL - Document not found");
    }

    const historySnapshot = await db.collection('analyses').where('userId', '==', TEST_USER_ID).get();
    if (!historySnapshot.empty) {
        console.log(`History Retrieved: ${historySnapshot.size} records`);
        console.log("History Persistence: PASS");
    } else {
        console.error("History Persistence: FAIL - No records found");
    }

    process.exit(0);
}

runTest().catch(console.error);
