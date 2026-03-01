const Jimp = require('jimp');
const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '../client/public/images/Logo.jpeg');
const pngPath = path.join(__dirname, '../client/public/images/Logo.png');
const svgPath = path.join(__dirname, '../client/public/images/Logo.svg');

async function processImage() {
    try {
        const image = await Jimp.read(inputPath);

        // Tolerance for white background removal
        const tR = 230;
        const tG = 230;
        const tB = 230;

        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
            const r = this.bitmap.data[idx + 0];
            const g = this.bitmap.data[idx + 1];
            const b = this.bitmap.data[idx + 2];

            // Background is often slightly off-white due to jpeg artifacts
            if (r > tR && g > tG && b > tB) {
                // Alpha = 0 (transparent)
                this.bitmap.data[idx + 3] = 0;
            }
        });

        await image.writeAsync(pngPath);
        console.log('Saved transparent PNG to', pngPath);

        const buffer = await image.getBufferAsync(Jimp.MIME_PNG);
        const base64 = buffer.toString('base64');

        const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${image.bitmap.width}" height="${image.bitmap.height}" viewBox="0 0 ${image.bitmap.width} ${image.bitmap.height}">
    <image href="data:image/png;base64,${base64}" width="100%" height="100%" />
</svg>`;

        fs.writeFileSync(svgPath, svgContent);
        console.log('Saved SVG to', svgPath);

    } catch (err) {
        console.error('Error processing image:', err);
    }
}

processImage();
