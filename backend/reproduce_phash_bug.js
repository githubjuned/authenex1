const FingerprintService = require('./utils/fingerprint');
const sharp = require('sharp');

async function test() {
    console.log("Creating test image...");
    // Create a 100x100 white image
    const imageBuffer = await sharp({
        create: {
            width: 100,
            height: 100,
            channels: 4,
            background: { r: 255, g: 255, b: 255, alpha: 1 }
        }
    })
        .png()
        .toBuffer();

    console.log("Generating pHash...");
    const pHash = await FingerprintService.generatePHash(imageBuffer);
    console.log("pHash Result:", pHash);

    // Check if it's all zeros (flexible check for various zero lengths just in case)
    if (/^0+$/.test(pHash)) {
        console.log("FAIL: pHash is all zeros (Bug Reproduced)");
    } else {
        console.log("SUCCESS: pHash is non-zero");
    }
}

test().catch(console.error);
