const admin = require('firebase-admin');
const dotenv = require('dotenv');
dotenv.config();

console.log("Testing Firebase Init with Env Var...");

try {
    if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
        throw new Error("FIREBASE_SERVICE_ACCOUNT not set in .env");
    }

    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    console.log("Parsed JSON successfully.");
    console.log("Project ID:", serviceAccount.project_id);

    // Check private key format
    const key = serviceAccount.private_key;
    console.log("Private Key Start:", key.substring(0, 30));
    console.log("Private Key End:", key.substring(key.length - 30));
    console.log("Contains newline chars:", key.includes('\n'));
    console.log("Contains escaped newlines (\\n):", key.includes('\\n'));

    // Try to init
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });

    console.log("Initialization successful (syntax check only).");

    // Try to get an access token to verify signature
    admin.credential.cert(serviceAccount).getAccessToken().then(() => {
        console.log("Access Token fetch SUCCESS! Key is valid.");
    }).catch(err => {
        console.error("Access Token fetch FAILED:", err.message);
    });

} catch (error) {
    console.error("Init Error:", error.message);
}
