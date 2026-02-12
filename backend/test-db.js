const { db } = require('./firebase');

// Handle potential unhandled rejections
process.on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at:', p, 'reason:', reason);
});

async function testConnection() {
    console.log("Starting Database Test...");

    if (!db) {
        console.error("FATAL: 'db' object is undefined or null.");
        return;
    }

    // Check if it's the mock DB
    if (db.collection && db.collection.toString().includes('mockData')) {
        console.warn("WARNING: Using MOCK Database (In-Memory).");
    } else {
        console.log("Using REAL Firestore Database.");
    }

    console.log("Attempting to write to 'test_connection/ping'...");
    try {
        const testRef = db.collection('test_connection').doc('ping');
        await testRef.set({
            status: 'online',
            timestamp: new Date().toISOString()
        });
        console.log("Write Successful: Created/Updated 'test_connection/ping'");

        console.log("Attempting to read back...");
        const doc = await testRef.get();
        if (doc.exists) {
            console.log("Read Successful:", doc.data());
            console.log("DATABASE IS WORKING Correctly.");
        } else {
            console.error("Read Failed: Document not found after write.");
        }
    } catch (error) {
        console.error("DATABASE ERROR:", error);
        console.error("Error Stack:", error.stack);
    }
}

testConnection().then(() => console.log("Test function completed."));
