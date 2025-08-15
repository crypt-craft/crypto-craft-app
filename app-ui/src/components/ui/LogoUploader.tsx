import React, { useState } from 'react';
import { uploadFileToPinata } from '../connect_to_ipfs';
import { Button } from './button';

interface LogoUploaderProps {
  onUploadComplete?: (ipfsHash: string) => void;
}

export const LogoUploader: React.FC<LogoUploaderProps> = ({ onUploadComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [ipfsHash, setIpfsHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (!selected.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }
    if (selected.size > 2 * 1024 * 1024) {
      setError('Image size should be less than 2MB.');
      return;
    }
    setFile(selected);
    setError(null);
    setIpfsHash(null);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(selected);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const res = await uploadFileToPinata(file);
      setIpfsHash(res.IpfsHash);
      if (onUploadComplete) onUploadComplete(res.IpfsHash);
    } catch (err: any) {
      setError('Failed to upload to Pinata.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setPreview(null);
    setIpfsHash(null);
    setError(null);
  };

  return (
    <div className="space-y-2">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
      />
      {preview && (
        <div className="flex flex-col items-center">
          <img src={preview} alt="Preview" className="w-32 h-32 object-contain rounded border mb-2" />
          <Button type="button" variant="destructive" size="sm" onClick={handleRemove} disabled={uploading}>
            Remove
          </Button>
        </div>
      )}
      {file && !ipfsHash && (
        <Button type="button" onClick={handleUpload} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload to Pinata'}
        </Button>
      )}
      {ipfsHash && (
        <div className="text-green-600 text-sm break-all">
          Uploaded! IPFS Hash: <a href={`https://gateway.pinata.cloud/ipfs/${ipfsHash}`} target="_blank" rel="noopener noreferrer" className="underline">{ipfsHash}</a>
        </div>
      )}
      {error && <div className="text-red-600 text-sm">{error}</div>}
    </div>
  );
}; 