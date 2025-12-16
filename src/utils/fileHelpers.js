
// Convert file to Base 64
export const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

export const validateFile = (file, type) => {
    const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
    const MAX_PDF_SIZE = 5 * 1024 * 1024; // 5MB

    if (type === 'image') {
        if (file.size > MAX_IMAGE_SIZE) return { valid: false, error: 'Image too large (Max 2MB)' };
        if (file.type !== 'image/webp') return { valid: false, error: 'Invalid format (WebP ONLY)' };
    }
    if (type === 'pdf') {
        if (file.size > MAX_PDF_SIZE) return { valid: false, error: 'PDF too large (Max 5MB)' };
        if (file.type !== 'application/pdf') return { valid: false, error: 'Invalid format (PDF only)' };
    }
    return { valid: true };
};
