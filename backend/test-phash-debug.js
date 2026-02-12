const sharp = require('sharp');
const blockhash = require('blockhash-core');

const FingerprintService = {
    generatePHash: async (buffer) => {
        try {
            const data = await sharp(buffer)
                .resize(16, 16, { fit: 'fill' })
                .ensureAlpha() // Ensure RGBA (4 channels)
                .raw()
                .toBuffer();

            return blockhash.bmvbhash({
                width: 16,
                height: 16,
                data: data
            }, 16);
        } catch (error) {
            console.error("pHash generation failed:", error);
            return null;
        }
    },
    calculateHammingDistance: (hash1, hash2) => {
        if (hash1.length !== hash2.length) return 1000;
        let distance = 0;
        for (let i = 0; i < hash1.length; i++) {
            const val1 = parseInt(hash1[i], 16);
            const val2 = parseInt(hash2[i], 16);
            let xor = val1 ^ val2;
            while (xor > 0) {
                if (xor & 1) distance++;
                xor >>= 1;
            }
        }
        return distance;
    }
};

async function test() {
    console.log("Generating random noise images (Try 3 - RGBA)...");

    // Generate random noise buffer 1
    const buffer1 = await sharp({
        create: {
            width: 100,
            height: 100,
            channels: 4, // Create as RGBA
            background: { r: 128, g: 128, b: 128, alpha: 1 }
        }
    })
        .composite([{
            input: Buffer.from(Array(100 * 100 * 4).fill(0).map(() => Math.random() * 255)),
            raw: { width: 100, height: 100, channels: 4 }
        }])
        .png().toBuffer();

    const buffer2 = await sharp({
        create: {
            width: 100,
            height: 100,
            channels: 4,
            background: { r: 128, g: 128, b: 128, alpha: 1 }
        }
    })
        .composite([{
            input: Buffer.from(Array(100 * 100 * 4).fill(0).map(() => Math.random() * 255)),
            raw: { width: 100, height: 100, channels: 4 }
        }])
        .png().toBuffer();

    const hash1 = await FingerprintService.generatePHash(buffer1);
    const hash2 = await FingerprintService.generatePHash(buffer2);

    console.log(`Hash 1: ${hash1}`);
    console.log(`Hash 2: ${hash2}`);

    console.log(`Dist: ${FingerprintService.calculateHammingDistance(hash1, hash2)}`);
}

test();
