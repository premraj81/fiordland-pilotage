const fs = require('fs');
const b64 = fs.readFileSync('C:/Users/premr/.gemini/antigravity/brain/d73251b8-1277-4d17-8205-c0d8dfb32546/uploaded_image_1767429938183.jpg').toString('base64');
fs.writeFileSync('src/lib/logo.ts', `export const LOGO_BASE64 = 'data:image/jpeg;base64,${b64}';`);
console.log('Logo file created');
