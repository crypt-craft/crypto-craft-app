import React, { useState, useEffect } from 'react';
// Reown removed
import { FormInput } from '../../components/ui/FormInput';
import { Button } from '../../components/ui/button';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Upload, X, Image as ImageIcon, Check } from 'lucide-react';
// import { uploadFileToPinata } from "../../components/connect_to_ipfs";
import { uploadFileToMedia } from "../../components/connect_to_ipfs";
import { upload as pinJsonViaBackend } from "../../components/connect_to_ipfs";
import { unpinFromPinata } from "../../components/connect_to_ipfs";
import { useTokenApi } from '../../hooks/useApi';

type TokenFormData = {
  tokenName: string;
  tokenSymbol: string;
  initialSupply: number;
  tokenDescription: string;
  imagePreview: string | null;
};
// Supply presets
const SUPPLY_PRESETS = [
  { label: '1,000', value: 1000 },
  { label: '10,000', value: 10000 },
  { label: '100,000', value: 100000 },
  { label: '1 Million', value: 1000000 },
  { label: '10 Million', value: 10000000 },
  { label: '100 Million', value: 100000000 },
  { label: '1 Billion', value: 1000000000 },
  { label: 'Custom', value: 'custom' },
];

interface SolanaTokenCreatorProps {
  networkType: 'mainnet' | 'devnet';
  setNotification: (notification: { message: string; type: 'success' | 'error' } | null) => void;
  formData: TokenFormData;
  setFormData: React.Dispatch<React.SetStateAction<TokenFormData>>;
}

export function SolanaTokenCreator({
  setNotification,
  networkType,
  formData,
  setFormData,
}: SolanaTokenCreatorProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string>('');
  // Explorer links shown on success alongside copy address CTA
  const { createToken, createUpdateMetadataTx, submitSigned, loading: creating } = useTokenApi();

  // UI state
  const [selectedSupplyPreset, setSelectedSupplyPreset] = useState(SUPPLY_PRESETS[0].value);
  const [customSupply, setCustomSupply] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createdTokenAddress, setCreatedTokenAddress] = useState<string | null>(null);
  // no activeTab tracking to avoid unused warnings

  // For update flow
  const [mintToUpdate, setMintToUpdate] = useState('');
  const [updateName, setUpdateName] = useState('');
  const [updateSymbol, setUpdateSymbol] = useState('');
  const [updateUri, setUpdateUri] = useState('');
  const [updateLogoFile, setUpdateLogoFile] = useState<File | null>(null);
  const [updateImageUrl, setUpdateImageUrl] = useState('');
  const [pinnedCid, setPinnedCid] = useState<string | null>(null);
  const [oldPinnedCid, setOldPinnedCid] = useState<string | null>(null);
  const [loadingExistingMeta, setLoadingExistingMeta] = useState(false);
  const [existingMeta, setExistingMeta] = useState<{ uri: string; name?: string; symbol?: string; updateAuthority?: string } | null>(null);
  const [walletMints, setWalletMints] = useState<string[]>([]);
  const [loadingMints, setLoadingMints] = useState(false);
  // Update button state machine
  const [updateStage, setUpdateStage] = useState<
    'idle' | 'pinning' | 'building' | 'signing' | 'submitting' | 'success' | 'error'
  >('idle');

  // Preflight authority check: who can update or create metadata
  const preflightAuthorityCheck = async (mintStr: string): Promise<{ metadataExists: boolean; mintAuthority: string | null; updateAuthority: string | null; metadataPda: string } > => {
    const mintPk = new PublicKey(mintStr);
    const rpc = (import.meta as any).env?.VITE_SOLANA_RPC as string | undefined;
    const fallback = (window.location.hostname === 'localhost' || window.location.hostname.endsWith('.local')) ? clusterApiUrl('devnet') : clusterApiUrl('mainnet-beta');
    const conn = new Connection(rpc || fallback, 'confirmed');
    const TOKEN_METADATA_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');
    const [metadataPdaPk] = PublicKey.findProgramAddressSync([
      Buffer.from('metadata'),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mintPk.toBuffer()
    ], TOKEN_METADATA_PROGRAM_ID);

    // Read SPL mint authority via parsed account info
    let mintAuthority: string | null = null;
    try {
      const parsed = await conn.getParsedAccountInfo(mintPk);
      const info: any = parsed?.value && (parsed.value as any).data?.parsed?.info;
      const ma = info?.mintAuthority;
      mintAuthority = typeof ma === 'string' ? ma : (ma?.toBase58?.() || null);
    } catch (_e) {
      mintAuthority = null;
    }

    // Check if metadata exists and, if possible, read update authority
    let metadataExists = false;
    let updateAuthority: string | null = null;
    try {
      const info = await conn.getAccountInfo(metadataPdaPk);
      if (info) {
        metadataExists = true;
        try {
          const mpl = await import('@metaplex-foundation/mpl-token-metadata');
          // Try common helper if available in this version
          if ((mpl as any).Metadata?.fromAccountAddress) {
            const meta = await (mpl as any).Metadata.fromAccountAddress(conn, metadataPdaPk);
            const ua = meta?.updateAuthority;
            updateAuthority = typeof ua === 'string' ? ua : (ua?.toBase58?.() || null);
          } else if ((mpl as any).Metadata?.deserialize) {
            const [meta] = (mpl as any).Metadata.deserialize(info.data);
            const ua = meta?.updateAuthority;
            updateAuthority = typeof ua === 'string' ? ua : (ua?.toBase58?.() || null);
          }
        } catch (_ignore) {
          updateAuthority = null;
        }
      }
    } catch (_e) {
      // ignore
    }

    return { metadataExists, mintAuthority, updateAuthority, metadataPda: metadataPdaPk.toBase58() };
  };

  const extractIpfsCidFromUri = (uri: string): string | null => {
    if (!uri || typeof uri !== 'string') return null;
    const ipfsMatch = uri.match(/ipfs:\/\/(?<cid>[^/?#]+)/i);
    if (ipfsMatch && (ipfsMatch.groups as any)?.cid) return (ipfsMatch.groups as any).cid;
    const gatewayMatch = uri.match(/\/ipfs\/(?<cid>[^/?#]+)/i);
    if (gatewayMatch && (gatewayMatch.groups as any)?.cid) return (gatewayMatch.groups as any).cid;
    return null;
  };

  const loadExistingMetadata = async (mintStr: string) => {
    setLoadingExistingMeta(true);
    setExistingMeta(null);
    setOldPinnedCid(null);
    try {
      const mintPk = new PublicKey(mintStr);
      const rpc = (import.meta as any).env?.VITE_SOLANA_RPC as string | undefined;
      const fallback = (window.location.hostname === 'localhost' || window.location.hostname.endsWith('.local')) ? clusterApiUrl('devnet') : clusterApiUrl('mainnet-beta');
      const conn = new Connection(rpc || fallback, 'confirmed');
      const TOKEN_METADATA_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');
      const [metadataPdaPk] = PublicKey.findProgramAddressSync([
        Buffer.from('metadata'),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mintPk.toBuffer()
      ], TOKEN_METADATA_PROGRAM_ID);
      const info = await conn.getAccountInfo(metadataPdaPk);
      if (!info) {
        setExistingMeta(null);
        return;
      }
      let md: any = null;
      try {
        const mpl = await import('@metaplex-foundation/mpl-token-metadata');
        if ((mpl as any).Metadata?.fromAccountAddress) {
          md = await (mpl as any).Metadata.fromAccountAddress(conn, metadataPdaPk);
        } else if ((mpl as any).Metadata?.deserialize) {
          const arr = (mpl as any).Metadata.deserialize(info.data);
          md = Array.isArray(arr) ? arr[0] : null;
        }
      } catch (_e) {}
      const onchainName: string | undefined = md?.data?.name || md?.name;
      const onchainSymbol: string | undefined = md?.data?.symbol || md?.symbol;
      const onchainUri: string | undefined = md?.data?.uri || md?.uri;
      const updateAuthority: string | undefined = typeof md?.updateAuthority === 'string' ? md.updateAuthority : (md?.updateAuthority?.toBase58?.() || undefined);
      if (onchainUri) {
        setExistingMeta({ uri: onchainUri, name: onchainName, symbol: onchainSymbol, updateAuthority });
        const maybeCid = extractIpfsCidFromUri(onchainUri);
        if (maybeCid) setOldPinnedCid(maybeCid);
        if (!updateName && onchainName) setUpdateName(onchainName);
        if (!updateSymbol && onchainSymbol) setUpdateSymbol(onchainSymbol);
        if (!updateUri) setUpdateUri(onchainUri);
        try {
          const res = await fetch(onchainUri, { method: 'GET' });
          if (res.ok) {
            const json = await res.json().catch(() => null);
            if (json && typeof json === 'object') {
              if (!updateName && typeof json.name === 'string') setUpdateName(json.name.slice(0, 32));
              if (!updateSymbol && typeof json.symbol === 'string') setUpdateSymbol(json.symbol.slice(0, 10));
            }
          }
        } catch (_e) {}
      }
    } finally {
      setLoadingExistingMeta(false);
    }
  };

  // Add state for Pinata upload
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoIpfsHash, setLogoIpfsHash] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  // Init Phantom connection state and RPC (network handled globally)
  useEffect(() => {
    const provider = (window as any).solana;
    if (provider?.isPhantom) {
      provider.connect({ onlyIfTrusted: true }).then((res: any) => {
        setAddress(res.publicKey?.toString() || '');
        setIsConnected(!!res.publicKey);
      }).catch(() => {});
      provider.on('connect', (pubkey: any) => {
        setAddress(pubkey?.toString() || '');
        setIsConnected(true);
      });
      provider.on('disconnect', () => {
        setAddress('');
        setIsConnected(false);
      });
    }
  }, []);

  // Load user's token accounts (to help pick a mint to update)
  useEffect(() => {
    const loadMints = async () => {
      if (!isConnected || !address) { setWalletMints([]); return; }
      setLoadingMints(true);
      try {
        const rpc = (import.meta as any).env?.VITE_SOLANA_RPC as string | undefined;
        const fallback = (window.location.hostname === 'localhost' || window.location.hostname.endsWith('.local')) ? clusterApiUrl('devnet') : clusterApiUrl('mainnet-beta');
        const conn = new Connection(rpc || fallback, 'confirmed');
        const owner = new PublicKey(address);
        const resp = await conn.getParsedTokenAccountsByOwner(owner, { programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA') });
        const mints = Array.from(new Set(resp.value.map(v => v.account.data.parsed.info.mint as string)));
        setWalletMints(mints);
      } catch (_e) {
        setWalletMints([]);
      } finally {
        setLoadingMints(false);
      }
    };
    loadMints();
  }, [isConnected, address]);

  useEffect(() => {
    if (!mintToUpdate) {
      setExistingMeta(null);
      setOldPinnedCid(null);
      return;
    }
    loadExistingMetadata(mintToUpdate);
  }, [mintToUpdate]);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'initialSupply' ? parseInt(value) || 0 : value,
    }));
  };

  // Handle supply preset changes
  const handleSupplyPresetChange = (value: number | string) => {
    setSelectedSupplyPreset(value);
    if (value !== 'custom') {
      setFormData((prev) => ({ ...prev, initialSupply: value as number }));
      setCustomSupply(false);
    } else {
      setCustomSupply(true);
    }
  };

  // Update handleImageChange to store the file
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.match('image.*')) {
        setNotification({ message: 'Please select an image file (JPEG, PNG, etc.)', type: 'error' });
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setNotification({ message: 'Image size should be less than 2MB', type: 'error' });
        return;
      }
      setLogoFile(file); // store the file for upload
      setLogoIpfsHash(null); // reset previous hash
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
      setFormData((prev: any) => ({ ...prev, imagePreview: base64String })); // For UI preview
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload occurs automatically during create; keep helper for internal use
  const uploadLogoIfNeeded = async (): Promise<string | null> => {
    if (!logoFile) return logoIpfsHash;
    setUploadingLogo(true);
    try {
      // 1) Upload to MinIO to get stable HTTPS URL
      const media = await uploadFileToMedia(logoFile);
      const httpsUrl = media.imageUrl as string;
      // 2) Pin JSON later will embed this httpsUrl in metadata.image
      // For backward compatibility we can also pin the raw image to Pinata if needed downstream
      setLogoIpfsHash(httpsUrl);
      return httpsUrl;
    } catch (_e) {
      return null;
    } finally {
      setUploadingLogo(false);
    }
  };

  // Remove uploaded image
  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, imagePreview: null }));
    const fileInput = document.getElementById('tokenImage') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  

  // Create token on Solana
  const handleCreateToken = async () => {
    if (!isConnected || !address) {
      setNotification({ message: 'Please connect your wallet first', type: 'error' });
      return;
    }

    // Validate inputs
    if (!formData.tokenName) {
      setNotification({ message: 'Token name is required', type: 'error' });
      return;
    }
    if (!formData.tokenSymbol) {
      setNotification({ message: 'Token symbol is required', type: 'error' });
      return;
    }
    if (formData.initialSupply <= 0) {
      setNotification({ message: 'Initial supply must be greater than 0', type: 'error' });
      return;
    }
    // Image is optional: we can proceed without it

    setIsCreating(true);

    try {
      // Ensure logo is uploaded automatically before building transaction
      const httpsUrl = await uploadLogoIfNeeded();
      const link = httpsUrl || '';

      const result = await createToken({
        name: formData.tokenName,
        symbol: formData.tokenSymbol,
        decimals: 9,
        initialSupply: formData.initialSupply,
        description: formData.tokenDescription,
        imageUrl: link,
      });

      // Store created token address when saved
      if (result?.token?.mintAddress) {
        setCreatedTokenAddress(result.token.mintAddress);
      }

      setNotification({
        message: `Token ${formData.tokenName} (${formData.tokenSymbol}) created successfully!`,
        type: 'success',
      });

      // Reset form
      setFormData({
        tokenName: '',
        tokenSymbol: '',
        initialSupply: 1000,
        tokenDescription: '',
        imagePreview: null,
      });
      setSelectedSupplyPreset(SUPPLY_PRESETS[0].value);
      setCustomSupply(false);
    } catch (error) {
      console.error('Error creating token:', error);
      setNotification({
        message: 'Failed to create token. Please try again.',
        type: 'error',
      });
    } finally {
      setIsCreating(false);
    }
  };

  // Update metadata via backend unsigned tx + Phantom sign + submit
  const handleUpdateMetadata = async () => {
    if (!isConnected || !address) {
      setNotification({ message: 'Please connect your wallet first', type: 'error' });
      return;
    }
    if (!mintToUpdate) {
      setNotification({ message: 'Mint address is required', type: 'error' });
      return;
    }
    try {
      // Preflight: determine authorities and stop early if user cannot proceed
      const { metadataExists, mintAuthority, updateAuthority } = await preflightAuthorityCheck(mintToUpdate);
      const current = address;
      if (!metadataExists) {
        if (!mintAuthority || mintAuthority !== current) {
          setUpdateStage('error');
          setNotification({
            message: `Metadata account not found. Only the mint authority can create it. Mint authority: ${mintAuthority || 'none (revoked)'}`,
            type: 'error'
          });
          return;
        }
      } else {
        if (updateAuthority && updateAuthority !== current) {
          setUpdateStage('error');
          setNotification({
            message: `You are not the update authority for this token. Update authority: ${updateAuthority}`,
            type: 'error'
          });
          return;
        }
      }

      setUpdateStage('pinning');
      // Auto-pin JSON if no URL provided
      let uri = updateUri;
      if (!uri) {
        const helpers = await import('../../components/connect_to_ipfs');
        // If user uploaded a new logo in Create tab earlier, reuse preview (optional). Otherwise rely on existing image in current metadata.
        const meta = {
          name: (updateName || 'UPDATED NAME').slice(0, 32),
          symbol: (updateSymbol || 'SYM').slice(0, 10),
          description: '',
          image: logoIpfsHash || '',
          properties: { category: 'token' }
        };
        console.log('[UpdateFlow] Auto pin metadata JSON', meta);
        const pinned = await helpers.upload(meta);
        const cid = pinned?.IpfsHash;
        if (cid) setPinnedCid(cid);
        uri = `https://gateway.pinata.cloud/ipfs/${cid}`;
        setUpdateUri(uri);
      }

      setUpdateStage('building');
      console.log('[UpdateFlow] start', { mintToUpdate, updateName, updateSymbol, uri });
      // 1) If needed, pin image and JSON now
      if (!updateUri) {
        const helpers = await import('../../components/connect_to_ipfs');
        let imageUrl = updateImageUrl;
        if (!imageUrl && updateLogoFile) {
          const imgRes = await helpers.uploadFileToPinata(updateLogoFile);
          imageUrl = `https://gateway.pinata.cloud/ipfs/${imgRes.IpfsHash}`;
          setUpdateImageUrl(imageUrl);
        }
        const meta = {
          name: (updateName || 'UPDATED NAME').slice(0, 32),
          symbol: (updateSymbol || 'SYM').slice(0, 10),
          description: '',
          image: imageUrl || '',
          properties: { category: 'token' }
        };
        console.log('[UpdateFlow] Pin metadata JSON on Update', meta);
        const pinned = await helpers.upload(meta);
        const cid = pinned?.IpfsHash;
        if (cid) setPinnedCid(cid);
        uri = `https://gateway.pinata.cloud/ipfs/${cid}`;
        setUpdateUri(uri);
      }

      // 2) Ask backend to create unsigned tx (auto Create/Update + URI validation inside)
      const unsigned = await createUpdateMetadataTx({ mintAddress: mintToUpdate, name: updateName, symbol: updateSymbol, uri });
      const txBuf = Buffer.from(unsigned.transaction, 'base64');
      const { Transaction } = await import('@solana/web3.js');
      const unsignedTx = Transaction.from(txBuf);

      // 3) Sign with Phantom
      setUpdateStage('signing');
      const provider = (window as any).solana;
      if (!provider?.isPhantom) throw new Error('Phantom wallet not available');
      const signed = await provider.signTransaction(unsignedTx);
      console.log('[UpdateFlow] signed length', signed.serialize().length);
      const signedBase64 = Buffer.from(signed.serialize()).toString('base64');

      // 4) Submit via backend (uniform handling + explorer URL)
      setUpdateStage('submitting');
      const submitRes = await submitSigned(signedBase64, unsigned.metadata);
      if (!submitRes?.success) throw new Error(submitRes?.error || 'Submit failed');
      console.log('[UpdateFlow] tx signature', submitRes.signature);
      setNotification({ message: 'Metadata updated successfully', type: 'success' });
      setUpdateStage('success');
      setTimeout(() => setUpdateStage('idle'), 3000);
    } catch (e: any) {
      console.error('[UpdateFlow] error', e);
      const msg = e?.message || 'Failed to update metadata';
      let friendly = msg;
      if (msg.includes('Metadata account not found and caller is not mint authority')) {
        friendly = 'Metadata account not found and your wallet is not the mint authority. Use the mint authority wallet or first create Metaplex Metadata for this token.';
      }
      setNotification({ message: friendly, type: 'error' });
      setUpdateStage('error');
      setTimeout(() => setUpdateStage('idle'), 4000);
    }
  };

  return (
      <div className="space-y-6">
        <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Token Management</h3>

        <Tabs defaultValue="create">
          <TabsList className="grid grid-cols-2 bg-gray-800 border border-gray-700 p-1">
            <TabsTrigger value="create" className="data-[state=active]:bg-blue-600">Create</TabsTrigger>
            <TabsTrigger value="update" className="data-[state=active]:bg-purple-600">Update</TabsTrigger>
          </TabsList>

          <TabsContent value="create">

        {/* Token Preview Section - removed, now handled by parent */}

        {/* Token creation success message */}
        {createdTokenAddress && (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 border border-green-700 rounded-lg bg-green-900/20 backdrop-blur-sm mb-6"
            >
              <div className="flex items-center space-x-2 text-green-400">
                <Check className="w-5 h-5" />
                <h4 className="font-medium">Token Created Successfully</h4>
              </div>
              <div className="mt-2">
                <div className="text-xs text-gray-400">Token Address:</div>
                <div className="text-sm font-mono text-white break-all mt-1">
                  {createdTokenAddress}
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-green-900/30 border-green-700/50 hover:bg-green-800/40"
                  onClick={() => {
                    navigator.clipboard.writeText(createdTokenAddress);
                    setNotification({ message: 'Token address copied to clipboard', type: 'success' });
                  }}
                >
                  COPY ADDRESS
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-green-900/30 border-green-700/50 hover:bg-green-800/40"
                  onClick={() => {
                    const q = networkType === 'devnet' ? '?cluster=devnet' : '';
                    const url = `https://solscan.io/token/${createdTokenAddress}${q}`;
                    const w = window.open(url, '_blank', 'noopener');
                    if (w) w.opener = null;
                  }}
                >
                  OPEN IN SOLSCAN
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-green-900/30 border-green-700/50 hover:bg-green-800/40"
                  onClick={() => {
                    const q = networkType === 'devnet' ? '?cluster=devnet' : '';
                    const url = `https://explorer.solana.com/address/${createdTokenAddress}${q}`;
                    const w = window.open(url, '_blank', 'noopener');
                    if (w) w.opener = null;
                  }}
                >
                  OPEN IN EXPLORER
                </Button>
              </div>
            </motion.div>
        )}

        <div className="grid gap-8 md:grid-cols-2">
          {/* Left Side - Off-chain Metadata (URI) */}
          <div className="space-y-6">
            <div className="space-y-1">
              <div className="text-sm font-medium text-gray-300">Off-chain Metadata (URI)</div>
              <p className="text-xs text-gray-400">Logo and description are stored off-chain in JSON and referenced by a metadata URI.</p>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <div
                  className={`w-32 h-32 rounded-full flex items-center justify-center overflow-hidden border-2 ${
                      formData.imagePreview ? 'border-blue-500' : 'border-gray-600 border-dashed'
                  } bg-gray-800`}
              >
                {formData.imagePreview ? (
                    <div className="relative w-full h-full">
                      <img src={formData.imagePreview} alt="Token Logo Preview" className="w-full h-full object-cover" />
                      <button
                          onClick={handleRemoveImage}
                          className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1 shadow-lg"
                          type="button"
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </div>
                ) : (
                    <ImageIcon className="w-12 h-12 text-gray-500" />
                )}
              </div>
              <div className="w-full">
                <div className="relative">
                  <input
                      type="file"
                      id="tokenImage"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="py-3 px-4 rounded-md border border-gray-600 bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                    <Upload className="w-4 h-4 mr-2" />
                    <span>Choose File</span>
                  </div>
                </div>
                {uploadingLogo && (
                  <div className="mt-2 w-full text-xs text-blue-300 text-center">Uploading logo to IPFS...</div>
                )}
                <p className="text-xs text-gray-400 mt-2 text-center">
                  Recommended: 200x200 PNG or JPG. Max size: 2MB.
                </p>
                {logoIpfsHash && (
                    <div className="mt-2 text-xs text-green-400 break-all text-center">
                      Uploaded to IPFS: <a href={`https://gateway.pinata.cloud/ipfs/${logoIpfsHash}`} target="_blank" rel="noopener noreferrer" className="underline">{logoIpfsHash}</a>
                    </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Token Description</label>
              <textarea
                  name="tokenDescription"
                  value={formData.tokenDescription}
                  onChange={handleInputChange}
                  placeholder="Enter token description (optional)"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
              />
            </div>
          </div>

            {/* Right Side - On-chain SPL Parameters */}
            <div className="space-y-6">
            <div className="space-y-1">
              <div className="text-sm font-medium text-gray-300">On-chain SPL Parameters</div>
              <p className="text-xs text-gray-400">Name, symbol and supply are written on-chain. Decimals are fixed to 9 for compatibility.</p>
            </div>
            <FormInput
                label="Token Name"
                name="tokenName"
                type="text"
                value={formData.tokenName}
                onChange={handleInputChange}
                placeholder="Enter token name"
            />

            <FormInput
                label="Token Symbol"
                name="tokenSymbol"
                type="text"
                value={formData.tokenSymbol}
                onChange={handleInputChange}
                placeholder="Enter token symbol (e.g., BTC, ETH)"
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Initial Supply</label>
              <div className="grid grid-cols-4 gap-2">
                {SUPPLY_PRESETS.slice(0, 4).map((preset) => (
                    <button
                        key={preset.value}
                        type="button"
                        onClick={() => handleSupplyPresetChange(preset.value)}
                        className={`px-2 py-2 text-xs md:text-sm rounded-md ${
                            selectedSupplyPreset === preset.value
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                    >
                      {preset.label}
                    </button>
                ))}
              </div>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {SUPPLY_PRESETS.slice(4).map((preset) => (
                    <button
                        key={preset.value}
                        type="button"
                        onClick={() => handleSupplyPresetChange(preset.value)}
                        className={`px-2 py-2 text-xs md:text-sm rounded-md ${
                            selectedSupplyPreset === preset.value
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                    >
                      {preset.label}
                    </button>
                ))}
              </div>
              {customSupply && (
                  <div className="mt-3">
                    <FormInput
                        label="Custom Supply"
                        name="initialSupply"
                        type="number"
                        value={formData.initialSupply}
                        onChange={handleInputChange}
                        placeholder="Enter custom supply amount"
                    />
                  </div>
              )}
            </div>

            {/* Decimals are fixed to 9 for SPL fungible tokens in our flow */}
          </div>
        </div>

            {/* Create Token Button */}
            <div className="flex justify-center mt-8">
              <Button
                  onClick={handleCreateToken}
                  disabled={!isConnected || isCreating || creating}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-md font-medium transition-all"
              >
                {!isConnected ? 'Connect Wallet to Create Token' : (isCreating || creating || uploadingLogo) ? 'Creating Token...' : 'Create Token'}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="update">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-gray-300">Select Mint</div>
                  <p className="text-xs text-gray-400">Choose from your token accounts or paste a mint address.</p>
                </div>
                <select
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-white"
                  onChange={(e) => setMintToUpdate(e.target.value)}
                  value={mintToUpdate}
                  disabled={loadingMints}
                >
                  <option value="">{loadingMints ? 'Loading mints…' : 'Select your token mint'}</option>
                  {walletMints.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Or paste mint address"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-white placeholder-gray-500"
                  value={mintToUpdate}
                  onChange={(e) => setMintToUpdate(e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Logo (optional)</label>
                  <input type="file" accept="image/*" onChange={(e) => {
                    if (!e.target.files || !e.target.files[0]) return;
                    setUpdateLogoFile(e.target.files[0]);
                    setUpdateImageUrl('');
                    setNotification({ message: 'Logo selected. It will be pinned on Update.', type: 'success' });
                  }} className="w-full text-xs text-gray-200" />
                </div>
                <FormInput label="New Name (optional)" name="updateName" type="text" value={updateName} onChange={(e: any) => setUpdateName(e.target.value)} placeholder="Token Name" />
                <FormInput label="New Symbol (optional)" name="updateSymbol" type="text" value={updateSymbol} onChange={(e: any) => setUpdateSymbol(e.target.value)} placeholder="SYM" />
                <FormInput label="Metadata URL (required)" name="updateUri" type="text" value={updateUri} onChange={(e: any) => setUpdateUri(e.target.value)} placeholder="https://gateway.pinata.cloud/ipfs/<CID>" />
                <div className="text-xs text-gray-400">
                  Important: This action only updates off-chain metadata stored on Pinata/IPFS. It does not bypass Solana authority rules for on-chain Metaplex metadata.
                </div>
                {loadingExistingMeta ? (
                  <div className="text-xs text-blue-300">Loading existing metadata…</div>
                ) : existingMeta ? (
                  <div className="text-xs text-gray-300 space-y-1">
                    <div>Detected on-chain metadata URI:</div>
                    <div className="break-all text-gray-200">{existingMeta.uri}</div>
                    {existingMeta.updateAuthority && (
                      <div>Update authority: <span className="text-gray-200">{existingMeta.updateAuthority}</span></div>
                    )}
                    {oldPinnedCid && (
                      <div>Existing Pinata/IPFS CID: <span className="text-gray-200">{oldPinnedCid}</span></div>
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-gray-500">No on-chain metadata detected for this mint.</div>
                )}
                <div className="flex items-center gap-2">
                  <Button
                    onClick={async () => {
                      try {
                        setUpdateStage('pinning');
                        const meta = {
                          name: (updateName || 'UPDATED NAME').slice(0, 32),
                          symbol: (updateSymbol || 'SYM').slice(0, 10),
                          description: '',
                          image: logoIpfsHash ? `https://gateway.pinata.cloud/ipfs/${logoIpfsHash}` : '',
                          properties: { category: 'token' }
                        };
                        const pinned = await pinJsonViaBackend(meta);
                        const cid = pinned?.IpfsHash as string | undefined;
                        if (cid) {
                          setPinnedCid(cid);
                          const url = `https://gateway.pinata.cloud/ipfs/${cid}`;
                          setUpdateUri(url);
                          setNotification({ message: 'Pinned metadata JSON to Pinata', type: 'success' });
                        } else {
                          setNotification({ message: 'Pinata did not return CID', type: 'error' });
                        }
                        setUpdateStage('idle');
                      } catch (err: any) {
                        setNotification({ message: err?.message || 'Failed to pin JSON', type: 'error' });
                        setUpdateStage('error');
                        setTimeout(() => setUpdateStage('idle'), 3000);
                      }
                    }}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md"
                    disabled={['pinning','building','signing','submitting'].includes(updateStage)}
                  >
                    Pin JSON (off-chain)
                  </Button>
                  <Button
                    onClick={async () => {
                      if (!pinnedCid) { setNotification({ message: 'Nothing to unpin', type: 'error' }); return; }
                      try {
                        await unpinFromPinata(pinnedCid);
                        setNotification({ message: `Unpinned ${pinnedCid}`, type: 'success' });
                        setPinnedCid(null);
                      } catch (err: any) {
                        setNotification({ message: err?.message || 'Failed to unpin', type: 'error' });
                      }
                    }}
                    variant="outline"
                    className="px-4 py-2"
                    disabled={!pinnedCid}
                  >
                    Unpin JSON
                  </Button>
                </div>
                <div className="flex justify-center">
                  <Button
                    onClick={handleUpdateMetadata}
                    disabled={!isConnected || updateStage === 'pinning' || updateStage === 'building' || updateStage === 'signing' || updateStage === 'submitting'}
                    className={`px-6 py-2 text-white rounded-md font-medium transition-all ${
                      updateStage === 'success' ? 'bg-green-600 hover:bg-green-700' :
                      updateStage === 'error' ? 'bg-red-600 hover:bg-red-700' :
                      'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                    } ${['pinning','building','signing','submitting'].includes(updateStage) ? 'animate-pulse' : ''}`}
                  >
                    {updateStage === 'idle' && 'Update Metadata'}
                    {updateStage === 'pinning' && '1/4 Pinning JSON...'}
                    {updateStage === 'building' && '2/4 Building Transaction...'}
                    {updateStage === 'signing' && '3/4 Awaiting Signature...'}
                    {updateStage === 'submitting' && '4/4 Submitting...'}
                    {updateStage === 'success' && 'Updated ✅'}
                    {updateStage === 'error' && 'Failed ❌'}
                  </Button>
                </div>
              </div>
            </div>
            {/* Helper removed: Update flow now pins JSON automatically on Update click for better UX */}
          </TabsContent>
        </Tabs>
      </div>
  );
}

export function SolanaTokenPreview({ imagePreview, tokenName, tokenSymbol, initialSupply, tokenDescription }: {
  imagePreview: string | null;
  tokenName: string;
  tokenSymbol: string;
  initialSupply: number;
  tokenDescription: string;
}) {
  const formatNumber = (num: number): string => new Intl.NumberFormat().format(num);
  if (!imagePreview || !tokenName) return null;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: 'spring' }}
      className="p-4 border border-gray-700 rounded-lg bg-gray-800/50 backdrop-blur-sm mb-6 shadow-lg animate-pulse"
      whileHover={{ scale: 1.03, boxShadow: '0 4px 32px 0 rgba(80,200,255,0.15)' }}
    >
      <h4 className="text-sm font-medium text-blue-400 mb-3 animate-pulse">Creating Token...</h4>
      <div className="flex items-center space-x-3">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, type: 'spring' }}
          className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500 shadow-md"
        >
          <img src={imagePreview} alt="Token Logo" className="w-full h-full object-cover" />
        </motion.div>
        <div>
          <div className="text-lg font-bold text-white">{tokenName}</div>
          <div className="text-sm text-gray-400">
            {tokenSymbol || 'SYM'} · {formatNumber(initialSupply)} tokens
          </div>
        </div>
      </div>
      {tokenDescription && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-3 text-sm text-gray-400 line-clamp-2"
        >
          {tokenDescription}
        </motion.p>
      )}
    </motion.div>
  );
}