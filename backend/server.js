const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { OpenAI } = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { admin, db, auth } = require('./firebase');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased limit for base64 images

// Logging Middleware (File-based)
app.use((req, res, next) => {
    require('fs').appendFileSync('server.log', `[${new Date().toISOString()}] Incoming Request: ${req.method} ${req.url}\n`);
    next();
});

// Request Logging Middleware (Console-based)
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

const PORT = process.env.PORT || 3000;

// Health Check
app.get('/', (req, res) => {
    res.send('Authenex Backend is Running');
});

// Firebase Auth Middleware
const verifyToken = async (req, res, next) => {
    const idToken = req.headers.authorization?.split('Bearer ')[1];
    if (!idToken) {
        return res.status(403).send('Unauthorized');
    }
    try {
        const decodedToken = await auth.verifyIdToken(idToken);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(403).send('Unauthorized');
    }
};

// --- Firestore Routes ---

// Save/Update User
app.post('/api/user', verifyToken, async (req, res) => {
    try {
        const user = req.body;
        if (!user.id) return res.status(400).json({ error: 'User ID required' });

        await db.collection('users').doc(user.id).set(user, { merge: true });
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get User
app.get('/api/user/:userId', verifyToken, async (req, res) => {
    try {
        const docRef = db.collection('users').doc(req.params.userId);
        const docSnap = await docRef.get();
        if (docSnap.exists) {
            res.json({ id: docSnap.id, ...docSnap.data() });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error getting user:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update Credits
app.post('/api/user/:userId/credits', verifyToken, async (req, res) => {
    try {
        const { credits } = req.body;
        await db.collection('users').doc(req.params.userId).update({ credits });
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error updating credits:', error);
        res.status(500).json({ error: error.message });
    }
});

// Save Analysis
app.post('/api/analysis', verifyToken, async (req, res) => {
    try {
        const { userId, result, fileBase64, mimeType } = req.body;
        // WARNING: Storing large base64 strings in Firestore is not recommended. 
        // Should use Firebase Storage (Bucket), but following existing pattern for now.

        const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const historyItem = {
            id: fileId,
            timestamp: new Date().toISOString(),
            thumbnail: fileBase64,
            result: result,
            userId: userId,
            fileType: mimeType
        };

        await db.collection('analyses').add(historyItem);
        res.status(200).json(historyItem);
    } catch (error) {
        console.error('Error saving analysis:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get User History
app.get('/api/analysis/:userId', verifyToken, async (req, res) => {
    try {
        const snapshot = await db.collection('analyses')
            .where('userId', '==', req.params.userId)
            .get();

        const history = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            history.push({
                id: doc.id,
                timestamp: data.timestamp,
                thumbnail: data.thumbnail,
                result: data.result
            });
        });

        // Sort in memory to avoid "Missing Index" error
        history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        res.json(history);
    } catch (error) {
        console.error('Error getting history:', error);
        res.status(500).json({ error: error.message });
    }
});

// Clear User History
app.delete('/api/analysis/:userId', verifyToken, async (req, res) => {
    try {
        const snapshot = await db.collection('analyses')
            .where('userId', '==', req.params.userId)
            .get();

        const batch = db.batch();
        snapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });
        await batch.commit();

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error clearing history:', error);
        res.status(500).json({ error: error.message });
    }
});

// --- Admin Routes ---

// Get All Users (Admin)
app.get('/api/admin/users', verifyToken, async (req, res) => {
    try {
        // In a real app, verify req.user.role === 'admin' here
        const snapshot = await db.collection('users').get();
        const users = [];
        snapshot.forEach(doc => {
            users.push({ id: doc.id, ...doc.data() });
        });
        res.json(users);
    } catch (error) {
        console.error('Error getting all users:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get All Alerts (Admin)
app.get('/api/admin/alerts', verifyToken, async (req, res) => {
    try {
        const snapshot = await db.collection('alerts').orderBy('timestamp', 'desc').get();
        const alerts = [];
        snapshot.forEach(doc => {
            alerts.push({ id: doc.id, ...doc.data() });
        });
        res.json(alerts);
    } catch (error) {
        console.error('Error getting alerts:', error);
        res.status(500).json({ error: error.message });
    }
});
app.get('/api/secure-data', verifyToken, (req, res) => {
    res.json({ message: 'Secure data accessed', uid: req.user.uid });
});


// Serve Firebase Config to Frontend
app.get('/api/firebase-config', (req, res) => {
    res.json({
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
        measurementId: process.env.FIREBASE_MEASUREMENT_ID
    });
});

// Initialize AI Clients
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// OpenAI Chat Proxy
app.post('/api/chat', async (req, res) => {
    try {
        const { messages, model = "gpt-4o-mini" } = req.body;

        const completion = await openai.chat.completions.create({
            model: model,
            messages: messages,
            temperature: 0.7
        });

        res.json(completion);
    } catch (error) {
        console.error("OpenAI Chat Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// OpenAI TTS Proxy
app.post('/api/speech', async (req, res) => {
    try {
        const { input, voice = "alloy" } = req.body;

        const mp3 = await openai.audio.speech.create({
            model: "tts-1",
            voice: voice,
            input: input,
        });

        const buffer = Buffer.from(await mp3.arrayBuffer());
        res.set('Content-Type', 'audio/mpeg');
        res.send(buffer);
    } catch (error) {
        console.error("OpenAI TTS Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// Gemini Proxy
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper Function for Gemini Generation
async function generateGeminiContent(modelName, contents, config = {}) {
    try {
        console.log(`[Gemini Helper] Generating with ${modelName}`);
        const aiModel = genAI.getGenerativeModel({ model: modelName, ...config });
        const result = await aiModel.generateContent({ contents });
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error(`[Gemini Helper] Error: ${error.message}`);
        throw error;
    }
}

app.post('/api/gemini/generate', async (req, res) => {
    try {
        require('fs').appendFileSync('server.log', `[${new Date().toISOString()}] Gemini Handler Hit. Body Keys: ${Object.keys(req.body)}\n`);
        console.log("Gemini Generating Handler Hit");
        console.log("Body Keys:", Object.keys(req.body));
        const { model, contents, config } = req.body;
        console.log("Model:", model);
        console.log("Contents Length:", contents?.length);
        const text = await generateGeminiContent(model, contents, config);

        // Mocking structure to match previous expected output for frontend compatibility
        res.json({
            text: text,
            candidates: [{ content: { parts: [{ text: text }] } }]
        });
    } catch (error) {
        require('fs').appendFileSync('server.log', `[${new Date().toISOString()}] Gemini Handler Error: ${error.message}\n`);
        console.error("Gemini Proxy Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// Verified News Endpoint (Restored to GET, using Loopback)
const fs = require('fs');
app.get('/api/news', async (req, res) => {
    const log = (msg) => require('fs').appendFileSync('server.log', `[${new Date().toISOString()}] ${msg}\n`);
    try {
        log("News Endpoint Hit (Inline Logic)");
        log(`API Key Present: ${process.env.GEMINI_API_KEY ? "Yes" : "No"}`);

        const prompt = `Find 5 REAL, LATEST (last 3 months) news articles about Deepfake scams, Digital Arrests, or AI Fraud in India/Global.
        You MUST provide a valid, real URL for each story.
        
        Return STRICT JSON Array with objects:
        {
          "title": "Headline",
          "summary": "Short summary",
          "date": "YYYY-MM-DD",
          "location": "City, Country",
          "sourceUrl": "https://...",
          "sourceName": "Publisher Name"
        }`;

        log("Initializing Model...");
        const model = genAI.getGenerativeModel({
            model: "gemini-pro"
        });

        log("Generating Content...");
        const result = await model.generateContent({
            contents: [{ parts: [{ text: prompt }] }]
        });

        log("Content Generated. Getting Response...");
        const response = await result.response;
        const textResponse = response.text();
        log(`Response Length: ${textResponse.length}`);

        const text = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();

        let candidateItems = [];
        try {
            candidateItems = JSON.parse(text);
        } catch (e) {
            log(`JSON Parse Error: ${e.message}`);
            console.error("News Parse Error", e);
            return res.json([]);
        }

        log(`Found ${candidateItems.length} candidates. Validating...`);

        // Parallel Validation
        const validationPromises = candidateItems.map(async (item) => {
            if (!item.sourceUrl) return null;
            try {
                // Using global fetch (Node 18+)
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000);
                const response = await fetch(item.sourceUrl, {
                    method: 'GET', // Changed HEAD to GET as many news sites block HEAD
                    signal: controller.signal,
                    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
                });
                clearTimeout(timeoutId);

                if (response.ok) return item;
                console.warn(`Dead Link [${response.status}]: ${item.sourceUrl}`);
                return null;
            } catch (e) {
                console.warn(`Link failed: ${item.sourceUrl} (${e.name})`);
                return null;
            }
        });

        const results = await Promise.all(validationPromises);
        const verified = results.filter(i => i !== null);

        log(`Returning ${verified.length} verified items.`);
        res.json(verified);

    } catch (error) {
        require('fs').appendFileSync('server.log', `[${new Date().toISOString()}] News Endpoint Error: ${error.message}\nStack: ${error.stack}\n`);
        console.error("News Endpoint Critical Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// Global Error Handler
app.use((err, req, res, next) => {
    require('fs').appendFileSync('server.log', `[${new Date().toISOString()}] Global Error: ${err.message}\nStack: ${err.stack}\n`);
    console.error("Global Error:", err);
    res.status(500).json({ error: "Internal Server Error (Global)" });
});

app.listen(PORT, () => {
    console.log(`Backend Server running on http://localhost:${PORT}`);
});
