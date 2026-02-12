require('dotenv').config();
const FingerprintService = require('./utils/fingerprint');
const sharp = require('sharp');

async function test() {
    console.log("Creating test image...");
    const imageBuffer = await sharp({
        create: {
            width: 100,
            height: 100,
            channels: 4,
            background: { r: 255, g: 0, b: 0, alpha: 1 }
        }
    })
        .png()
        .toBuffer();

    console.log("Generating Embedding...");
    try {
        const embedding = await FingerprintService.generateEmbedding(imageBuffer, "image/png");

        if (embedding) {
            console.log("SUCCESS: Embedding generated. Length:", embedding.length);
            console.log("Sample:", embedding.slice(0, 5));
        } else {
            console.error("FAIL: Embedding is null.");
        }
    } catch (error) {
        console.error("CRASH: Test script failed:", error);
    }
}

test();
