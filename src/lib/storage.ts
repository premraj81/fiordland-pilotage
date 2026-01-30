// Replaced Supabase storage with custom API for Render deployment

export async function uploadPdfReport(blob: Blob, fileName: string): Promise<string | null> {
    try {
        const formData = new FormData();
        formData.append('file', blob, fileName);

        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            console.error("Upload failed:", await response.text());
            return null;
        }

        const data = await response.json();
        // The server returns a relative URL like /uploads/filename.pdf
        // We can prepend the current origin if needed, but relative is fine for <img> tags
        return data.url;
    } catch (e) {
        console.error("Exception during upload:", e);
        return null;
    }
}
