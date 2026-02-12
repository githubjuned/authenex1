const { db } = require('./firebase');

async function testIndex() {
    console.log(`Testing Firestore Index for Protect List...`);
    // Verify Project ID
    const sa = process.env.FIREBASE_SERVICE_ACCOUNT ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT) : require('./serviceAccountKey.json');
    console.log(`Using Project ID: ${sa.project_id}`);
    try {
        const userId = "test-index-user";
        // This query matches the one in server_new.js: 
        // .where('userId', '==', req.params.userId).orderBy('timestamp', 'desc')
        const snapshot = await db.collection('protected_content')
            .where('userId', '==', userId)
            .orderBy('timestamp', 'desc')
            .get();

        console.log("Query SUCCESS! Index exists.");
    } catch (error) {
        console.error("Query FAILED!");
        console.error(error.message);
        // The error message usually contains a URL to create the index
    }
}

testIndex();
