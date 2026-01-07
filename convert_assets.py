import base64

logo_path = r'C:/Users/premr/.gemini/antigravity/brain/731f8ad9-75de-439f-9ab7-1ac673fa7281/uploaded_image_1_1767821355391.jpg'
sig_path = r'C:/Users/premr/.gemini/antigravity/brain/731f8ad9-75de-439f-9ab7-1ac673fa7281/uploaded_image_0_1767821355391.jpg'

with open(logo_path, 'rb') as f:
    logo_b64 = base64.b64encode(f.read()).decode('utf-8')

with open(sig_path, 'rb') as f:
    sig_b64 = base64.b64encode(f.read()).decode('utf-8')

content = f"""
export const LOGO_BASE64 = 'data:image/jpeg;base64,{logo_b64}';
export const SIG_CLEAVER_BASE64 = 'data:image/jpeg;base64,{sig_b64}';
"""

with open('src/lib/pdf_assets.ts', 'w') as f:
    f.write(content)

print("Assets written to src/lib/pdf_assets.ts")
