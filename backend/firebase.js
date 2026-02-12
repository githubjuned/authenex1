const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

let db;
let auth;

try {
    // Initialize Firebase Admin
    let serviceAccount = null;

    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        // Fix for private key newline characters if they are escaped
        if (serviceAccount.private_key) {
            serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
        }
    } else {
        try {
            serviceAccount = require('./serviceAccountKey.json');
        } catch (e) {
            // No file found, proceed to mock
        }
    }

    if (serviceAccount) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log('Firebase Admin initialized with service account.');
        db = admin.firestore();
        auth = admin.auth();
    } else {
        throw new Error('No service account');
    }
} catch (error) {
    console.warn('WARNING: Firebase Service Account not found or invalid. Using MOCK database.');

    // Mock Auth
    auth = {
        verifyIdToken: async (token) => ({ uid: 'mock-user-id', email: 'mock@example.com' }),
        getUser: async (uid) => ({ uid, email: 'mock@example.com' })
    };

    // Mock DB (In-memory)
    const mockData = {};
    db = {
        collection: (name) => ({
            doc: (id) => ({
                set: async (data, opts) => {
                    if (!mockData[name]) mockData[name] = {};
                    if (opts?.merge && mockData[name][id]) {
                        mockData[name][id] = { ...mockData[name][id], ...data };
                    } else {
                        mockData[name][id] = data;
                    }
                },
                get: async () => ({
                    exists: !!(mockData[name] && mockData[name][id]),
                    id,
                    data: () => mockData[name]?.[id] || {}
                }),
                update: async (data) => {
                    if (mockData[name] && mockData[name][id]) {
                        mockData[name][id] = { ...mockData[name][id], ...data };
                    }
                }
            }),
            add: async (data) => {
                if (!mockData[name]) mockData[name] = {};
                const id = Date.now().toString();
                mockData[name][id] = data;
                return { id };
            },
            where: () => ({
                orderBy: () => ({
                    get: async () => {
                        return {
                            forEach: (cb) => {
                                const collection = mockData[name] || {};
                                Object.entries(collection).forEach(([id, data]) => cb({ id, data: () => data }));
                            },
                            docs: Object.entries(mockData[name] || {}).map(([id, data]) => ({
                                ref: { delete: async () => { delete mockData[name][id]; } },
                                data: () => data,
                                id
                            }))
                        };
                    }
                }),
                get: async () => {
                    return { // Simplified mock for where()
                        docs: Object.entries(mockData[name] || {}).map(([id, data]) => ({
                            ref: { delete: async () => { delete mockData[name][id]; } },
                            data: () => data,
                            id
                        }))
                    };
                }
            })
        }),
        batch: () => ({
            delete: (ref) => ref.delete(),
            commit: async () => { }
        })
    };
}

module.exports = { admin, db, auth };
