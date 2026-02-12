const path = require('path');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { OpenAI } = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { GoogleAIFileManager } = require('@google/generative-ai/server');
const { admin, db, auth } = require('./firebase');
const FingerprintService = require('./utils/fingerprint');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Logging Middleware
app.use((req, res, next) => {
    // Log Request Arrival
    const arrivalLog = `[${new Date().toISOString()}] INCOMING: ${req.method} ${req.originalUrl}\n`;
    require('fs').appendFileSync('server.log', arrivalLog);
    console.log(arrivalLog.trim());

    const start = Date.now();
    const originalSend = res.send;
    res.send = function (body) {
        const duration = Date.now() - start;
        const logMsg = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms - Response: ${typeof body === 'string' ? body.substring(0, 200) : 'Object'}\n`;
        try {
            require('fs').appendFileSync('server.log', logMsg);
        } catch (e) {
            console.error("Logging failed:", e);
        }
        console.log(logMsg.trim());
        originalSend.call(this, body);
    };
    next();
});

// Serve Static Frontend (Unified Deployment)
let frontendPath = path.join(__dirname, '../frontend/dist'); // Local Development
if (process.env.NODE_ENV === 'production') {
    frontendPath = path.join(__dirname, 'public'); // App Engine Deployment
}
app.use(express.static(frontendPath));

// API routes defined below...

const PORT = process.env.PORT || 3001;

// Health Check
app.get('/', (req, res) => {
    res.send('Authenex Backend is Running');
});
console.log("--- SERVER RELOADED WITH MEMORY SORT FIX ---");

// Firebase Auth Middleware
const verifyToken = async (req, res, next) => {
    const idToken = req.headers.authorization?.split('Bearer ')[1];
    if (!idToken) {
        return res.status(403).send('Unauthorized: No token provided');
    }
    try {
        const decodedToken = await auth.verifyIdToken(idToken);
        req.user = decodedToken;
        console.log(`[Auth] Token verified for UID: ${decodedToken.uid}`);
        next();
    } catch (error) {
        console.error('[Auth] Error verifying token:', error);
        res.status(403).send('Unauthorized: Invalid token');
    }
};

// Debug Route
app.get('/api/debug/config', (req, res) => {
    const isMock = db.collection && db.collection.toString().includes('mockData'); // naive check
    // Better check: compare with known mock implementation structure or a flag
    // In firebase.js, real db is Firestore object, mock is plain object with collection() method.
    // Firestore object constructor name is 'Firestore'.
    const dbType = db.constructor.name === 'Firestore' ? 'REAL' : 'MOCK';

    res.json({
        dbType,
        projectId: process.env.FIREBASE_PROJECT_ID || 'unknown',
        serviceAccountLoaded: !!process.env.FIREBASE_SERVICE_ACCOUNT
    });
});

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

// Update Credits (Direct - for Admin/System use only ideally, but keeping for compatibility if needed)
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

// --- Credit Request System ---

// 1. Submit Credit Request
app.post('/api/credits/request', verifyToken, async (req, res) => {
    try {
        const { userId, userEmail, amount, packLabel, price } = req.body;
        if (!userId || !amount) return res.status(400).json({ error: "Missing required fields" });

        const request = {
            userId,
            userEmail,
            amount,
            packLabel,
            price,
            timestamp: new Date().toISOString(),
            status: 'pending'
        };

        const docRef = await db.collection('credit_requests').add(request);
        res.status(200).json({ success: true, id: docRef.id });
    } catch (error) {
        console.error('Error submitting credit request:', error);
        res.status(500).json({ error: error.message });
    }
});

// 2. Get Pending Requests (Admin)
app.get('/api/admin/credit-requests', verifyToken, async (req, res) => {
    try {
        if (req.user.email !== ADMIN_EMAIL) {
            return res.status(403).json({ error: "Access denied" });
        }

        const snapshot = await db.collection('credit_requests')
            .where('status', '==', 'pending')
            .get();

        const requests = [];
        snapshot.forEach(doc => {
            requests.push({ id: doc.id, ...doc.data() });
        });

        // Manual sort if index is missing
        requests.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        res.json(requests);
    } catch (error) {
        console.error('Error fetching credit requests:', error);
        res.status(500).json({ error: error.message });
    }
});

// 3. Approve Request
app.post('/api/admin/credit-requests/:id/approve', verifyToken, async (req, res) => {
    try {
        if (req.user.email !== ADMIN_EMAIL) return res.status(403).json({ error: "Access denied" });

        const requestId = req.params.id;
        const requestRef = db.collection('credit_requests').doc(requestId);

        await db.runTransaction(async (t) => {
            const doc = await t.get(requestRef);
            if (!doc.exists) throw new Error("Request not found");

            const data = doc.data();
            if (data.status !== 'pending') throw new Error("Request already processed");

            const userRef = db.collection('users').doc(data.userId);
            const userDoc = await t.get(userRef);
            if (!userDoc.exists) throw new Error("User not found");

            const userData = userDoc.data();
            const newCredits = (userData.credits || 0) + data.amount;
            const newTotal = (userData.totalCredits || 0) + data.amount;

            t.update(userRef, {
                credits: newCredits,
                totalCredits: newTotal
            });

            t.update(requestRef, {
                status: 'approved',
                processedAt: new Date().toISOString()
            });
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Error approving request:', error);
        res.status(500).json({ error: error.message });
    }
});

// 4. Reject Request
app.post('/api/admin/credit-requests/:id/reject', verifyToken, async (req, res) => {
    try {
        if (req.user.email !== ADMIN_EMAIL) return res.status(403).json({ error: "Access denied" });

        await db.collection('credit_requests').doc(req.params.id).update({
            status: 'rejected',
            processedAt: new Date().toISOString()
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Error rejecting request:', error);
        res.status(500).json({ error: error.message });
    }
});

// Save Analysis
app.post('/api/analysis', verifyToken, async (req, res) => {
    try {
        const { userId, result, fileBase64, mimeType } = req.body;
        // WARNING: Storing large base64 strings in Firestore is not recommended. 
        // Should use Firebase Storage (Bucket), but following existing pattern for now.

        let thumbnailToStore = fileBase64;

        // Firestore has a 1MB limit. If base64 is large (approx > 800KB), don't store it.
        // Frontend should have handled this, but backend safety is needed.
        if (fileBase64 && fileBase64.length > 800 * 1024) {
            console.warn(`[Save Analysis] Blob too large (${fileBase64.length} bytes). Truncating for storage.`);
            thumbnailToStore = null;
        }

        const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const historyItem = {
            id: fileId,
            timestamp: new Date().toISOString(),
            // Store the full image for now, but if it fails, the frontend should probably resize BEFORE sending
            // or we use a separate storage bucket.
            // Let's rely on the frontend sending a reasonable size, but handle the timeout error.
            thumbnail: thumbnailToStore, // Null if too large
            result: result,
            userId: userId,
            fileType: mimeType
        };

        // Add a timeout/race to the database write
        const dbPromise = db.collection('analyses').add(historyItem);
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Firestore Write Timeout')), 15000));

        await Promise.race([dbPromise, timeoutPromise]);

        res.status(200).json(historyItem);
    } catch (error) {
        console.error('Error saving analysis:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get User History
// Get User History - RENAMED TO BYPASS GHOST ROUTE
app.get('/api/history/:userId', verifyToken, async (req, res) => {
    try {
        console.log(`[DEBUG] Fetching history for ${req.params.userId} (NO SORT)`);

        // Simple query - no ordering to avoid index issues
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

        console.log(`[DEBUG] Found ${history.length} items. Sorting in memory.`);

        // Sort in memory
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

// Example secure route (to be used by frontend)
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
// OpenAI Chat Proxy with Gemini Fallback
app.post('/api/chat', async (req, res) => {
    try {
        const { messages, model = "gpt-4o-mini" } = req.body;
        console.log("Attempting OpenAI Chat...");

        const completion = await openai.chat.completions.create({
            model: model,
            messages: messages,
            temperature: 0.7
        });

        res.json(completion);
    } catch (openaiError) {
        console.error("OpenAI Chat Error:", openaiError.message);
        console.log("Falling back to Gemini...");

        try {
            const { messages } = req.body;
            const lastUserMessage = messages[messages.length - 1].content;
            const systemPrompt = messages.find(m => m.role === 'system')?.content || "";

            // Construct Gemini Prompt
            const geminiPrompt = `${systemPrompt}\n\nUser: ${lastUserMessage}`;

            const aiModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
            const result = await aiModel.generateContent(geminiPrompt);
            const response = await result.response;
            const text = response.text();

            // Return in OpenAI format for frontend compatibility
            res.json({
                choices: [{
                    message: {
                        content: text,
                        role: 'assistant'
                    }
                }]
            });
        } catch (geminiError) {
            console.error("Gemini Fallback Error:", geminiError);
            res.status(500).json({ error: "All AI services failed. Please try again later." });
        }
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

// Gemini File Manager
const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);

// Helper to upload file if needed
async function processGeminiInput(contents) {
    const processedContents = [];
    for (const content of contents) {
        const parts = [];
        for (const part of content.parts) {
            if (part.inlineData) {
                // Check if data is large (> 15MB to be safe, limit is 20MB)
                const base64Data = part.inlineData.data;
                const sizeInBytes = (base64Data.length * 3) / 4;
                const sizeInMB = sizeInBytes / (1024 * 1024);

                if (sizeInMB > 15) {
                    console.log(`[Gemini Helper] Large File Detected (${sizeInMB.toFixed(2)} MB). Uploading to Gemini Storage...`);

                    const buffer = Buffer.from(base64Data, 'base64');
                    const tempFilePath = path.join(__dirname, `temp_${uuidv4()}.${part.inlineData.mimeType.split('/')[1]}`);

                    try {
                        require('fs').writeFileSync(tempFilePath, buffer);

                        const uploadResponse = await fileManager.uploadFile(tempFilePath, {
                            mimeType: part.inlineData.mimeType,
                            displayName: "Analysis Upload"
                        });

                        console.log(`[Gemini Helper] File Uploaded: ${uploadResponse.file.uri}`);

                        // Wait for processing if video
                        if (part.inlineData.mimeType.startsWith('video/')) {
                            let fileState = await fileManager.getFile(uploadResponse.file.name);
                            while (fileState.state === 'PROCESSING') {
                                console.log('[Gemini Helper] Processing video...');
                                await new Promise(resolve => setTimeout(resolve, 2000));
                                fileState = await fileManager.getFile(uploadResponse.file.name);
                            }
                            if (fileState.state === 'FAILED') {
                                throw new Error("Video processing failed by Gemini.");
                            }
                        }

                        // Replace inlineData with fileData
                        parts.push({
                            fileData: {
                                mimeType: uploadResponse.file.mimeType,
                                fileUri: uploadResponse.file.uri
                            }
                        });

                        // Clean up temp file
                        require('fs').unlinkSync(tempFilePath);

                    } catch (uploadError) {
                        console.error("[Gemini Helper] Upload Failed:", uploadError);
                        if (require('fs').existsSync(tempFilePath)) require('fs').unlinkSync(tempFilePath);
                        throw uploadError;
                    }

                } else {
                    parts.push(part);
                }
            } else {
                parts.push(part);
            }
        }
        processedContents.push({ role: content.role, parts: parts });
    }
    return processedContents;
}

// Helper Function for Gemini Generation
async function generateGeminiContent(modelName, contents, config = {}) {
    try {
        console.log(`[Gemini Helper] Generating with ${modelName}`);

        // Pre-process contents to handle large files
        const processedContents = await processGeminiInput(contents);

        let aiModel = genAI.getGenerativeModel({ model: modelName, ...config });

        try {
            const result = await aiModel.generateContent({ contents: processedContents });
            const response = await result.response;
            return response.text();
        } catch (genError) {
            console.error(`[Gemini Helper] Primary Model (${modelName}) Failed: ${genError.message}`);

            // CASCADE RETRY: 1. Try 2.5 Pro (High Intelligence)
            if (modelName !== 'gemini-2.5-pro') {
                console.log("[Gemini Helper] Retrying with: gemini-2.5-pro");
                try {
                    aiModel = genAI.getGenerativeModel({ model: 'gemini-2.5-pro', ...config });
                    const result = await aiModel.generateContent({ contents: processedContents });
                    const response = await result.response;
                    return response.text();
                } catch (retryError1) {
                    console.error(`[Gemini Helper] 2.5 Pro Failed: ${retryError1.message}`);
                }
            }

            // CASCADE RETRY: 2. Try 2.0 Flash (Fastest / Most Available)
            console.log("[Gemini Helper] Retrying with: gemini-2.0-flash");
            try {
                aiModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash', ...config });
                const result = await aiModel.generateContent({ contents: processedContents });
                const response = await result.response;
                return response.text();
            } catch (retryError2) {
                console.error(`[Gemini Helper] 2.0 Flash Failed: ${retryError2.message}`);
            }

            // If all models fail, return structured error JSON
            return JSON.stringify({
                aiPercentage: 80,
                humanPercentage: 20,
                confidence: 0,
                verdict: "SUSPICIOUS",
                summary: "Analysis incomplete. The AI models (2.5 Flash, 2.5 Pro, 2.0 Flash) are currently unreachable.",
                findings: [{ label: "Model Availability", severity: "medium", description: "All available Gemini models failed to respond." }]
            });
        }

    } catch (error) {
        console.error(`[Gemini Helper] Critical Error: ${error.message}`);
        // Return fallback even for critical errors so user sees something
        return JSON.stringify({
            aiPercentage: 0,
            humanPercentage: 0,
            confidence: 0,
            verdict: "SUSPICIOUS",
            summary: `System Error: ${error.message}. Please restart server or try smaller file.`,
            findings: []
        });
    }
}

app.post('/api/gemini/generate', async (req, res) => {
    try {
        // Log stripped body to avoid clutter
        console.log(`[${new Date().toISOString()}] Gemini Handler Hit.`);

        const { model, contents, config } = req.body;
        console.log("Model:", model);

        const text = await generateGeminiContent(model, contents, config);

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
// Verified News Endpoint (Using NewsData.io API)
const fs = require('fs');
app.get('/api/news', async (req, res) => {
    const log = (msg) => require('fs').appendFileSync('server.log', `[${new Date().toISOString()}] ${msg}\n`);
    try {
        log("News Endpoint Hit (NewsData.io)");
        log(`DEBUG: Environment NEWSDATA_API_KEY: '${process.env.NEWSDATA_API_KEY}'`);
        const apiKey = process.env.NEWSDATA_API_KEY || "pub_1625e8f3ed3a49969dd8aebc2cea4dd3";
        log(`DEBUG: Resolved apiKey: '${apiKey}'`);

        if (!apiKey) {
            log("Error: NEWSDATA_API_KEY missing");
            return res.status(500).json({ error: "Server configuration error: News API Key missing" });
        }

        // Query: Deepfake OR "AI Scam" OR "Digital Arrest"
        // Language: English
        const apiUrl = `https://newsdata.io/api/1/news?apikey=${apiKey}&q=deepfake OR "AI scam" OR "digital arrest"&language=en`;

        log(`Fetching from NewsData.io...`);

        // Using global fetch (Node 18+)
        const response = await fetch(apiUrl);

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`NewsData API Failed: ${response.status} ${errText}`);
        }

        const data = await response.json();

        if (data.status !== 'success' || !Array.isArray(data.results)) {
            throw new Error("Invalid response format from NewsData.io");
        }

        log(`Received ${data.results.length} articles.`);

        const newsItems = data.results.map(article => ({
            title: article.title,
            summary: article.description || article.content || "No summary available.", // NewsData uses description
            date: article.pubDate ? article.pubDate.split(' ')[0] : new Date().toISOString().split('T')[0],
            location: article.country ? article.country[0].toUpperCase() : "Global",
            sourceUrl: article.link,
            sourceName: article.source_id || "News Source",
            // Use image_url if present, otherwise null (frontend handles fallback)
            imageSearchTerm: article.image_url
        })).slice(0, 10); // Limit to 10 items

        log(`Returning ${newsItems.length} processed items.`);
        res.json(newsItems);

    } catch (error) {
        require('fs').appendFileSync('server.log', `[${new Date().toISOString()}] News Endpoint Error: ${error.message}\nStack: ${error.stack}\n`);
        console.error("News Endpoint Critical Error:", error);
        // Return empty array so frontend uses fallback data instead of crashing
        res.status(500).json({ error: error.message });
    }
});

// --- Authenex Protect Routes ---

// 1. Register Content
app.post('/api/protect/register', verifyToken, async (req, res) => {
    try {
        const { fileBase64, mimeType, metadata, ownershipDeclaration } = req.body;
        if (!fileBase64) return res.status(400).json({ error: "No file provided" });
        if (!ownershipDeclaration || !ownershipDeclaration.agreedToTos || !ownershipDeclaration.confirmedOwnership) {
            return res.status(400).json({ error: "Ownership declaration required" });
        }

        const buffer = Buffer.from(fileBase64.replace(/^data:image\/\w+;base64,/, ""), 'base64');
        const userId = req.user.uid;
        const caseId = uuidv4();
        const timestamp = new Date().toISOString();
        const ipAddress = req.ip || req.connection.remoteAddress;

        // Generate Fingerprints
        const sha256 = FingerprintService.generateSHA256(buffer);
        const pHash = await FingerprintService.generatePHash(buffer);
        const embedding = await FingerprintService.generateEmbedding(buffer, mimeType || "image/jpeg");

        // --- Step 1: Exact Duplicate Check (SHA-256) ---
        const duplicateCheck = await db.collection('protected_content')
            .where('sha256', '==', sha256)
            .get();

        let isDuplicate = false;
        duplicateCheck.forEach(doc => {
            if (doc.data().userId !== userId) {
                isDuplicate = true;
            }
        });

        if (isDuplicate) {
            // Log Attempt
            await db.collection('duplicate_attempt_logs').add({
                userId,
                attempted_sha256: sha256,
                timestamp,
                type: 'exact_match_block'
            });
            return res.status(409).json({ error: "Registration Blocked: This content is already protected by another account." });
        }

        // --- Step 2: Visual Similarity Check (pHash) ---
        // Note: For production, use a vector DB or optimized query. Here we scan recent/all.
        // We reused the logic from 'verify' but simplified for registration check.
        const allContentStart = Date.now();
        const snapshot = await db.collection('protected_content').get();

        let status = 'active';
        let flagReason = null;

        snapshot.forEach(doc => {
            const data = doc.data();
            if (data.userId === userId) return; // Skip own content

            if (data.pHash && pHash) {
                const distance = FingerprintService.calculateHammingDistance(data.pHash, pHash);
                if (distance <= 5) {
                    status = 'pending_review';
                    flagReason = `High visual similarity to Case ${data.caseId} (Distance: ${distance})`;
                }
            }
        });
        console.log(`[Protect] Similarity check took ${Date.now() - allContentStart}ms`);

        const protectedItem = {
            userId,
            caseId,
            timestamp,
            sha256,
            pHash,
            embedding, // Stored as array of numbers
            metadata: metadata || {},
            status: status, // 'active' or 'pending_review'
            ownership_declaration: {
                confirmed: true,
                timestamp: timestamp,
                ip_address: ipAddress,
                ...ownershipDeclaration
            },
            flagReason: flagReason
        };

        await db.collection('protected_content').doc(caseId).set(protectedItem);

        if (status === 'pending_review') {
            res.status(202).json({
                success: true,
                caseId,
                timestamp,
                status: 'pending_review',
                message: "Registration Pending: High similarity detected. Sent for manual ownership verification."
            });
        } else {
            res.status(200).json({
                success: true,
                caseId,
                timestamp,
                status: 'active',
                message: "Content protected successfully. Original file discarded."
            });
        }

    } catch (error) {
        console.error("Protect Register Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// 2. List Protected Content
app.get('/api/protect/list/:userId', verifyToken, async (req, res) => {
    try {
        console.log(`[Protect List] Request for userId: ${req.params.userId}, Authenticated user: ${req.user.uid}`);
        if (req.params.userId !== req.user.uid) {
            console.error(`[Protect List] Unauthorized: Params ${req.params.userId} !== Token ${req.user.uid}`);
            return res.status(403).json({ error: "Unauthorized access to these records" });
        }

        const snapshot = await db.collection('protected_content')
            .where('userId', '==', req.params.userId)
            .get();

        const items = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            items.push({
                caseId: data.caseId,
                timestamp: data.timestamp,
                status: data.status,
                metadata: data.metadata
            });
        });

        // Sort in memory to avoid "FAILED_PRECONDITION" index errors
        // Sort: Newest First (Desc)
        items.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));


        res.json(items);
    } catch (error) {
        console.error("Protect List Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// 3. Verify Suspicious Content
app.post('/api/protect/verify', verifyToken, async (req, res) => {
    try {
        const { fileBase64, mimeType } = req.body;
        if (!fileBase64) return res.status(400).json({ error: "No file provided" });

        const buffer = Buffer.from(fileBase64.replace(/^data:image\/\w+;base64,/, ""), 'base64');

        // Generate Target Fingerprints
        const targetSHA256 = FingerprintService.generateSHA256(buffer);
        const targetPHash = await FingerprintService.generatePHash(buffer);
        const targetEmbedding = await FingerprintService.generateEmbedding(buffer, mimeType || "image/jpeg");

        // Fetch all protected content (In production, optimize this with vector search or sharding)
        // For now, we iterate. Firestore limit might apply.
        const snapshot = await db.collection('protected_content').get(); // TODO: Optimization needed for scale

        let bestMatch = null;
        let highestScore = 0;
        let matchType = 'No Match'; // Exact, Modified, AI-Derived, No Match

        snapshot.forEach(doc => {
            const record = doc.data();
            let score = 0;
            let currentMatchType = 'No Match';

            // 1. Exact Match (SHA-256)
            if (record.sha256 === targetSHA256) {
                score = 100;
                currentMatchType = 'Exact Match';
            }
            // 2. Visual Match (pHash Hamming Distance)
            else if (record.pHash && targetPHash) {
                const distance = FingerprintService.calculateHammingDistance(record.pHash, targetPHash);
                // Thresholds: 0-5 excellent, 5-10 good, >10 poor
                if (distance <= 5) {
                    score = Math.max(score, 95 - (distance * 2)); // 95, 93, 91...
                    currentMatchType = 'Modified Match';
                } else if (distance <= 12) {
                    score = Math.max(score, 85 - (distance));
                    if (currentMatchType === 'No Match') currentMatchType = 'Modified Match (Weak)';
                }
            }

            // 3. Semantic Match (Cosine Similarity)
            if (record.embedding && targetEmbedding && score < 95) { // Check only if not already a strong visual match
                const similarity = FingerprintService.calculateCosineSimilarity(record.embedding, targetEmbedding);
                // Similarity is -1 to 1. We expect > 0.8 for good concept matches.
                if (similarity > 0.85) {
                    const embedScore = similarity * 100;
                    if (embedScore > score) {
                        score = embedScore;
                        currentMatchType = 'AI-Derived/Conceptual Match';
                    }
                }
            }

            if (score > highestScore) {
                highestScore = score;
                matchType = currentMatchType;
                bestMatch = {
                    caseId: record.caseId,
                    userId: record.userId, // In a real app, might privacy-mask this
                    timestamp: record.timestamp,
                    matchType: matchType,
                    score: score.toFixed(2)
                };
            }
        });

        res.json({
            matchFound: highestScore > 75, // Threshold
            bestMatch: highestScore > 75 ? bestMatch : null,
            analysis: {
                sha256: targetSHA256,
                pHash: targetPHash ? "Generated" : "Failed",
                embedding: targetEmbedding ? "Generated" : "Failed"
            }
        });

    } catch (error) {
        console.error("Protect Verify Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// 4. Delete Protected Content
app.delete('/api/protect/:caseId', verifyToken, async (req, res) => {
    try {
        const caseId = req.params.caseId;
        const userId = req.user.uid;

        const docRef = db.collection('protected_content').doc(caseId);
        const doc = await docRef.get();

        if (!doc.exists) return res.status(404).json({ error: "Record not found" });
        if (doc.data().userId !== userId) return res.status(403).json({ error: "Unauthorized" });

        await docRef.delete();
        res.json({ success: true });
    } catch (error) {
        console.error("Protect Delete Error:", error);
        res.status(500).json({ error: error.message });
    }
});
// --- Admin Routes ---

const ADMIN_EMAIL = "nexora@authenex.in";

// Get All Users (Admin)
app.get('/api/admin/users', verifyToken, async (req, res) => {
    try {
        if (req.user.email !== ADMIN_EMAIL) {
            console.warn(`[Admin] Unauthorized access attempt by ${req.user.email}`);
            return res.status(403).json({ error: "Access denied: Admin privileges required." });
        }

        const snapshot = await db.collection('users').get();
        const users = [];
        snapshot.forEach(doc => {
            users.push({ id: doc.id, ...doc.data() });
        });
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get Alerts (Admin)
app.get('/api/admin/alerts', verifyToken, async (req, res) => {
    try {
        if (req.user.email !== ADMIN_EMAIL) {
            return res.status(403).json({ error: "Access denied: Admin privileges required." });
        }

        // Mock alerts for now, or fetch from a real collection if it existed
        // The frontend expects: { id, timestamp, reason, email }
        const alerts = [
            { id: '1', timestamp: new Date().toISOString(), reason: 'Bot-like typing detected', email: 'suspicious_node_42@temp.io' },
            { id: '2', timestamp: new Date().toISOString(), reason: 'Injecting camera stream', email: 'external_actor@vpn.net' }
        ];

        // If we had a real alerts collection:
        // const snapshot = await db.collection('alerts').get();
        // snapshot.forEach(doc => alerts.push({ id: doc.id, ...doc.data() }));

        res.json(alerts);
    } catch (error) {
        console.error('Error fetching alerts:', error);
        res.status(500).json({ error: error.message });
    }
});

// --- Credit Request Routes ---

// 1. User Requests Credits
app.post('/api/credits/request', verifyToken, async (req, res) => {
    try {
        const { amount, packLabel, price } = req.body;
        const userId = req.user.uid;
        const userEmail = req.user.email;

        // Check if pending request exists
        const existing = await db.collection('credit_requests')
            .where('userId', '==', userId)
            .where('status', '==', 'pending')
            .get();

        if (!existing.empty) {
            return res.status(400).json({ error: "You passed a pending request. Please wait for approval." });
        }

        const requestId = uuidv4();
        await db.collection('credit_requests').doc(requestId).set({
            id: requestId,
            userId,
            userEmail,
            amount,
            packLabel: packLabel || 'Custom',
            price: price || '0',
            status: 'pending',
            timestamp: new Date().toISOString()
        });

        res.json({ success: true, message: "Credit request submitted." });
    } catch (error) {
        console.error("Credit Request Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// 2. Admin Lists Requests
app.get('/api/admin/credit-requests', verifyToken, async (req, res) => {
    try {
        if (req.user.email !== ADMIN_EMAIL) return res.status(403).json({ error: "Unauthorized" });

        const snapshot = await db.collection('credit_requests')
            .where('status', '==', 'pending')
            .get();

        const requests = [];
        snapshot.forEach(doc => requests.push(doc.data()));
        res.json(requests);
    } catch (error) {
        console.error("List Credit Requests Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// 3. Admin Approves Request
app.post('/api/admin/credit-requests/:id/approve', verifyToken, async (req, res) => {
    try {
        if (req.user.email !== ADMIN_EMAIL) return res.status(403).json({ error: "Unauthorized" });

        const requestId = req.params.id;
        const requestRef = db.collection('credit_requests').doc(requestId);
        const requestDoc = await requestRef.get();

        if (!requestDoc.exists) return res.status(404).json({ error: "Request not found" });
        const requestData = requestDoc.data();

        if (requestData.status !== 'pending') return res.status(400).json({ error: "Request already processed" });

        // Update User Credits
        const userRef = db.collection('users').doc(requestData.userId);
        const userDoc = await userRef.get();

        let currentCredits = 0;
        let totalCredits = 1000;

        if (userDoc.exists) {
            currentCredits = userDoc.data().credits || 0;
            totalCredits = userDoc.data().totalCredits || 1000;
        }

        const newCredits = currentCredits + requestData.amount;
        const newTotal = totalCredits + requestData.amount; // Optional: Increase max capacity too?

        await userRef.set({
            credits: newCredits,
            totalCredits: newTotal
        }, { merge: true });

        // Mark Request as Approved
        await requestRef.update({
            status: 'approved',
            processedAt: new Date().toISOString()
        });

        res.json({ success: true, newCredits });
    } catch (error) {
        console.error("Approve Credit Error:", error);
        res.status(500).json({ error: "Approval failed" });
    }
});

// 4. Admin Rejects Request
app.post('/api/admin/credit-requests/:id/reject', verifyToken, async (req, res) => {
    try {
        if (req.user.email !== ADMIN_EMAIL) return res.status(403).json({ error: "Unauthorized" });

        const requestId = req.params.id;
        await db.collection('credit_requests').doc(requestId).update({
            status: 'rejected',
            processedAt: new Date().toISOString()
        });

        res.json({ success: true });
    } catch (error) {
        console.error("Reject Credit Error:", error);
        res.status(500).json({ error: "Rejection failed" });
    }
});

app.use((err, req, res, next) => {
    require('fs').appendFileSync('server.log', `[${new Date().toISOString()}] Global Error: ${err.message}\nStack: ${err.stack}\n`);
    console.error("Global Error:", err);
    res.status(500).json({ error: "Internal Server Error (Global)" });
});

// SPA Catch-all Handler (Must be last)
app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Backend Server running on http://localhost:${PORT}`);
});
