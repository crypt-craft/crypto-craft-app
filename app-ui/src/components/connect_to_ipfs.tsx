// Upload JSON metadata via backend proxy
export async function upload(metadata: any) {
    const res = await fetch('/api/ipfs/pin-json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(metadata)
    });
    if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`Failed to upload JSON (${res.status}). ${text}`);
    }
    return await res.json();
}

// Upload a file (e.g., logo image) to Pinata
export async function uploadFileToPinata(file: File) {
    // Read the file as Data URL so backend can reconstruct multipart securely
    const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });

    const res = await fetch('/api/ipfs/pin-file', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fileName: file.name, dataUrl })
    });
    if (!res.ok) {
        // Try to parse JSON for diagnostics
        let body: any = null;
        try { body = await res.json(); } catch {
            const text = await res.text().catch(() => '');
            throw new Error(`Failed to upload file (${res.status}). ${text}`);
        }
        const diag = body?.diagnostics ? ` diag=${JSON.stringify(body.diagnostics)}` : '';
        const details = body?.details ? ` details=${typeof body.details === 'string' ? body.details : JSON.stringify(body.details)}` : '';
        throw new Error(`Failed to upload file (${res.status}). ${body?.error || ''}${details}${diag}`);
    }
    return await res.json();
}

// Unpin an existing CID from Pinata via backend
export async function unpinFromPinata(cid: string) {
    const res = await fetch(`/api/ipfs/unpin/${encodeURIComponent(cid)}`, {
        method: 'DELETE'
    });
    if (!res.ok) {
        let body: any = null;
        try { body = await res.json(); } catch {
            const text = await res.text().catch(() => '');
            throw new Error(`Failed to unpin (${res.status}). ${text}`);
        }
        const details = body?.details ? ` details=${typeof body.details === 'string' ? body.details : JSON.stringify(body.details)}` : '';
        throw new Error(`Failed to unpin (${res.status}). ${body?.error || ''}${details}`);
    }
    return await res.json();
}