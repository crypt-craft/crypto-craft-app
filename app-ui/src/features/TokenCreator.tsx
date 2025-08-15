import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FormInput } from '@/components/ui/FormInput';
import { useTokenApi } from '@/hooks/useApi';
import { Upload, X, Image as ImageIcon, Check } from 'lucide-react';

interface TokenCreatorProps {
  blockchain: string;
  networkType: 'mainnet' | 'devnet';
  walletConnected: boolean;
  connectWallet: () => void;
  setNotification: (notification: { message: string; type: 'success' | 'error' } | null) => void;
}

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

export function TokenCreator({
  blockchain,
  networkType,
  walletConnected,
  connectWallet,
  setNotification,
}: TokenCreatorProps) {
  const [formData, setFormData] = useState({
    tokenName: '',
    tokenSymbol: '',
    initialSupply: 1000,
    tokenDescription: '',
  });

  const [tokenImage, setTokenImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedSupplyPreset, setSelectedSupplyPreset] = useState(SUPPLY_PRESETS[0].value);
  const [customSupply, setCustomSupply] = useState(false);

  const { createToken, loading, error } = useTokenApi();

  useEffect(() => {
    if (selectedSupplyPreset !== 'custom') {
      setFormData((prev) => ({ ...prev, initialSupply: selectedSupplyPreset as number }));
      setCustomSupply(false);
    } else {
      setCustomSupply(true);
    }
  }, [selectedSupplyPreset]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'initialSupply' ? parseInt(value) || 0 : value,
    }));
  };

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
      setTokenImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setTokenImage(null);
    setImagePreview(null);
    const fileInput = document.getElementById('tokenImage') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const formatNumber = (num: number): string => new Intl.NumberFormat().format(num);

  const handleSupplyPresetChange = (value: number | string) => setSelectedSupplyPreset(value);

  const handleCreateToken = async () => {
    if (!walletConnected) return connectWallet();

    try {
      // New flow: let hook handle GraphQL, upload to Pinata happens inside SolanaTokenCreator or future shared flow
      const imageUrl = tokenImage ? await (async () => {
        const { uploadFileToPinata } = await import('@/components/connect_to_ipfs');
        const res = await uploadFileToPinata(tokenImage);
        return `https://gateway.pinata.cloud/ipfs/${res.IpfsHash}`;
      })() : '';

      await createToken({
        name: formData.tokenName,
        symbol: formData.tokenSymbol,
        decimals: blockchain === 'solana' ? 9 : 0,
        initialSupply: formData.initialSupply,
        description: formData.tokenDescription,
        imageUrl,
      } as any);
      setNotification({ message: `Token ${formData.tokenName} created successfully!`, type: 'success' });

      setFormData({ tokenName: '', tokenSymbol: '', initialSupply: 1000, tokenDescription: '' });
      setTokenImage(null);
      setImagePreview(null);
      setSelectedSupplyPreset(SUPPLY_PRESETS[0].value);
      setCustomSupply(false);
      const fileInput = document.getElementById('tokenImage') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch {
      setNotification({ message: error || 'Failed to create token', type: 'error' });
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
        Create {blockchain.charAt(0).toUpperCase() + blockchain.slice(1)} Token
      </h3>

      {/* Token Preview Section - Moved to the top for symmetry */}
      {imagePreview && formData.tokenName && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 border border-gray-700 rounded-lg bg-gray-800/50 backdrop-blur-sm mb-6"
        >
          <h4 className="text-sm font-medium text-gray-400 mb-3">Token Preview</h4>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500">
              <img src={imagePreview} alt="Token Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="text-lg font-bold text-white">{formData.tokenName}</div>
              <div className="text-sm text-gray-400">
                {formData.tokenSymbol || 'SYM'} · {formatNumber(formData.initialSupply)} tokens
              </div>
            </div>
          </div>
          {formData.tokenDescription && (
            <p className="mt-3 text-sm text-gray-400 line-clamp-2">{formData.tokenDescription}</p>
          )}
        </motion.div>
      )}

      <div className="grid gap-8 md:grid-cols-2">
        {/* Left Side - Image Upload and Description */}
        <div className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div
              className={`w-32 h-32 rounded-full flex items-center justify-center overflow-hidden border-2 ${
                imagePreview ? 'border-blue-500' : 'border-gray-600 border-dashed'
              } bg-gray-800`}
            >
              {imagePreview ? (
                <div className="relative w-full h-full">
                  <img src={imagePreview} alt="Token Logo Preview" className="w-full h-full object-cover" />
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
                  <Upload className="w-4 h-4" />
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center">
                Recommended: 200x200 PNG or JPG. Max size: 2MB.
              </p>
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

        {/* Right Side - Token Details */}
        <div className="space-y-6">
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
                  className={`px-2 py-2 text-xs md:text-sm rounded-md flex items-center justify-center ${
                    selectedSupplyPreset === preset.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {preset.value === 'custom' && customSupply && <Check className="w-3 h-3 mr-1" />}
                  {preset.label}
                </button>
              ))}
            </div>
            {customSupply && (
              <div className="mt-3">
                <FormInput
                  name="initialSupply"
                  type="number"
                  value={formData.initialSupply}
                  onChange={handleInputChange}
                  placeholder="Enter custom supply amount" label={''}                />
                <p className="text-xs text-gray-400 mt-1">
                  Current supply: {formatNumber(formData.initialSupply)} tokens
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <motion.button
        className={`w-full py-3 px-6 rounded-md text-white font-medium mt-6 ${
          loading
            ? 'bg-blue-600/50 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg'
        }`}
        onClick={handleCreateToken}
        disabled={loading || !formData.tokenName || !formData.tokenSymbol || formData.initialSupply <= 0 || !tokenImage}
        whileHover={{ scale: loading ? 1 : 1.02 }}
        whileTap={{ scale: loading ? 1 : 0.98 }}
      >
        {loading ? 'Creating...' : 'Create Token'}
      </motion.button>

      <div className="mt-6 p-4 bg-gray-800/30 border border-gray-700 rounded-md">
        <h4 className="text-sm font-medium text-blue-400 mb-2">
          About {blockchain.charAt(0).toUpperCase() + blockchain.slice(1)} Tokens
        </h4>
        <ul className="space-y-2 text-xs text-gray-400">
          {blockchain === 'solana' && (
            <>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Your token will be created as an SPL token on the Solana {networkType} network.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Standard decimals (9) will be applied for compatibility with most Solana wallets and dApps.</span>
              </li>
            </>
          )}
          {blockchain === 'ton' && (
            <>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Your token will be created as a Jetton on the TON {networkType} network.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>TON Jettons use 0 decimals by default for simplicity.</span>
              </li>
            </>
          )}
          {blockchain === 'tron' && (
            <>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Your token will be created as a TRC-20 token on the TRON {networkType} network.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Standard decimals (6) will be applied for compatibility with most TRON wallets and dApps.</span>
              </li>
            </>
          )}
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>After creation, your token will be available in your connected wallet.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}