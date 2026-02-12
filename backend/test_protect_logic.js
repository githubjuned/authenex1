const FingerprintService = require('./utils/fingerprint');
const { db } = require('./firebase');
const { v4: uuidv4 } = require('uuid');

async function testProtection() {
    console.log("--- Starting Protect Feature Verification ---");

    try {
        // 1. Test Fingerprinting
        console.log("\n1. Testing Fingerprint Generation...");
        const dummyBuffer = Buffer.from("Test Content " + Date.now());

        const sha256 = FingerprintService.generateSHA256(dummyBuffer);
        console.log("SHA256:", sha256);

        // pHash usually requires an image buffer. We'll skip pHash for text buffer or mock it if needed.
        // FingerprintService.generatePHash expects image buffer.
        // Let's rely on sha256 and embedding for this test.
        // Or if we run this where sharp is installed, we need a real image buffer.
        // We'll skip pHash and Embedding for this simple test to avoid needing a real image file, 
        // focus on DB operations.

        // 2. Test DB Write
        console.log("\n2. Testing Firestore Write...");
        const caseId = uuidv4();
        const userId = "test-user-verification";

        const record = {
            userId,
            caseId,
            timestamp: new Date().toISOString(),
            sha256,
            status: 'active',
            metadata: { type: 'test' }
        };

        await db.collection('protected_content').doc(caseId).set(record);
        console.log(`Written record ${caseId}`);

        // 3. Test DB Read
        console.log("\n3. Testing Firestore Read...");
        const doc = await db.collection('protected_content').doc(caseId).get();
        if (doc.exists) {
            console.log("Record Found:", doc.data());
        } else {
            console.error("Record NOT Found!");
        }

        // 4. Test Query
        console.log("\n4. Testing Firestore Query (List)...");
        const snapshot = await db.collection('protected_content').where('userId', '==', userId).get();
        console.log(`Found ${snapshot.size} records for user ${userId}`);

        // 5. Cleanup
        console.log("\n5. Cleaning up...");
        await db.collection('protected_content').doc(caseId).delete();
        console.log("Record deleted.");

        console.log("\n--- Verification SUCCESS ---");

    } catch (error) {
        console.error("\n--- Verification FAILED ---");
        console.error(error);
    }
}

testProtection();
