const crypto = require('crypto');
const sharp = require('sharp');
const blockhash = require('blockhash-core');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const FingerprintService = {
    // Layer 1: SHA-256 (Exact Match)
    generateSHA256: (buffer) => {
        return crypto.createHash('sha256').update(buffer).digest('hex');
    },

    // Layer 2: Perceptual Hash (Visual Similarity)
    generatePHash: async (buffer) => {
        try {
            const data = await sharp(buffer)
                .resize(16, 16, { fit: 'fill' })
                .ensureAlpha()
                .raw()
                .toBuffer();

            // Fix: blockhash-core expects an object with width, height, and data
            return blockhash.bmvbhash({ width: 16, height: 16, data }, 16);
        } catch (error) {
            console.error("pHash generation failed:", error);
            return null;
        }
    },

    // Layer 3: Embedding Vector (Semantic/AI Match)
    generateEmbedding: async (buffer, mimeType) => {
        try {
            const model = genAI.getGenerativeModel({ model: "models/gemini-embedding-001" });

            // For images, we might need a vision model to get a description first if embedding-001 doesn't support images directly.
            // However, Gemini 1.5 Flash is multimodal. Let's try to get a dense description first then embed that.
            // Or use a multimodal embedding model if available.
            // Strategy: Use Vision model to describe image in high detail -> Embed description.

            const visionModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });
            const result = await visionModel.generateContent([
                "Describe this image in extreme detail, focusing on composition, subjects, colors, and unique features for forensic identification. Output only the description.",
                {
                    inlineData: {
                        data: buffer.toString("base64"),
                        mimeType: mimeType
                    }
                }
            ]);
            const description = result.response.text();

            // Now embed the description
            const embeddingResult = await model.embedContent(description);
            return embeddingResult.embedding.values;
        } catch (error) {
            console.error("Embedding generation failed:", error);
            return null; // Fallback to null if AI fails, but primary hashes will still work
        }
    },

    // Compare pHashes (Hamming Distance) - Correct Bitwise Implementation
    calculateHammingDistance: (hash1, hash2) => {
        if (hash1.length !== hash2.length) return 1000; // Mismatch length

        let distance = 0;
        for (let i = 0; i < hash1.length; i++) {
            // Parse hex char to integer and XOR
            const val1 = parseInt(hash1[i], 16);
            const val2 = parseInt(hash2[i], 16);
            let xor = val1 ^ val2;

            // Count set bits in the XOR result (4 bits per hex char)
            while (xor > 0) {
                if (xor & 1) distance++;
                xor >>= 1;
            }
        }
        return distance;
    },

    // Compare Embeddings (Cosine Similarity)
    calculateCosineSimilarity: (vec1, vec2) => {
        if (!vec1 || !vec2 || vec1.length !== vec2.length) return 0;
        let dotProduct = 0;
        let normA = 0;
        let normB = 0;
        for (let i = 0; i < vec1.length; i++) {
            dotProduct += vec1[i] * vec2[i];
            normA += vec1[i] * vec1[i];
            normB += vec2[i] * vec2[i];
        }
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }
};

module.exports = FingerprintService;
