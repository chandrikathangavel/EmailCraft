export const getCroppedImg = (imageSrc, pixelCrop) => {
    const createImage = (url) =>
        new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener('load', () => resolve(image));
            image.addEventListener('error', (error) => reject(error));
            image.setAttribute('crossOrigin', 'anonymous'); // needed to avoid cross-origin issues on CodeSandbox
            image.src = url;
        });

    return new Promise(async (resolve, reject) => {
        const image = await createImage(imageSrc);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            return reject(new Error('No 2d context'));
        }

        // set canvas width to match the bounding box
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        // draw the cropped image
        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height
        );

        // As Base64 string
        // return resolve(canvas.toDataURL('image/jpeg'));

        // As Blob (better for larger images, but we need Base64 for localStorage in this mock)
        // For this specific app constraint (localStorage), we will return DataURL.
        // However, usually Blob is better for uploads.
        // Let's stick to DataURL for consistency with authService.
        resolve(canvas.toDataURL('image/jpeg'));
    });
};
