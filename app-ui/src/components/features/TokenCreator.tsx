import { useState } from 'react';
import { motion } from 'framer-motion';
import { FormInput } from '@/components/ui/FormInput';
import { Button } from '@/components/ui/button';
import { Coins } from 'lucide-react';

interface TokenCreatorProps {
  blockchain: string;
  walletConnected: boolean;
  connectWallet: () => void;
  setNotification: (notification: { message: string; type: 'success' | 'error' }) => void;
}

export function TokenCreator({ blockchain, walletConnected, connectWallet, setNotification }: TokenCreatorProps): JSX.Element {
  const [formData, setFormData] = useState({
    tokenName: '',
    tokenSymbol: '',
    initialSupply: '',
    decimals: blockchain === 'ton' ? '0' : '9',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'initialSupply' || name === 'decimals' ? value : value,
    }));
  };

  const handleCreateToken = async () => {
    if (!walletConnected) {
      setNotification({ message: 'Please connect your wallet first.', type: 'error' });
      return;
    }
    setLoading(true);
    try {
      // Mock API call (replace with real blockchain logic later)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setNotification({ message: `Token ${formData.tokenName} created successfully!`, type: 'success' });
      setFormData({ tokenName: '', tokenSymbol: '', initialSupply: '', decimals: blockchain === 'ton' ? '0' : '9' });
    } catch (error) {
      setNotification({ message: 'Failed to create token.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (!walletConnected) {
    return (
      <div className="text-center p-6 bg-gray-800/50 rounded-md">
        <p className="text-gray-300 mb-4">Please connect your wallet to create a token.</p>
        <Button onClick={connectWallet}>Connect Wallet</Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gray-800/50 p-6 rounded-md backdrop-blur-md space-y-6"
    >
      <h3 className="text-xl font-bold text-indigo-400">Create {blockchain.charAt(0).toUpperCase() + blockchain.slice(1)} Token</h3>
      <div className="grid gap-4">
        <FormInput
          label="Token Name"
          name="tokenName"
          type="text"
          value={formData.tokenName}
          onChange={handleInputChange}
          placeholder="Enter token name"
          icon={<Coins className="w-4 h-4 text-gray-400" />}
        />
        <FormInput
          label="Token Symbol"
          name="tokenSymbol"
          type="text"
          value={formData.tokenSymbol}
          onChange={handleInputChange}
          placeholder="Enter token symbol"
        />
        <FormInput
          label="Initial Supply"
          name="initialSupply"
          type="number"
          value={formData.initialSupply}
          onChange={handleInputChange}
          placeholder="Enter initial supply"
        />
        {blockchain !== 'ton' && (
          <FormInput
            label="Decimals"
            name="decimals"
            type="number"
            value={formData.decimals}
            onChange={handleInputChange}
            placeholder="Enter decimals"
          />
        )}
        <FormInput
          label="Token Supply"
          name="initialSupply"
          type="text"
          value={formData.initialSupply}
          onChange={handleInputChange}
          placeholder="Enter token supply"
          startContent={<Coins className="w-4 h-4 text-gray-400" />}
        />
        <Button
          onClick={handleCreateToken}
          disabled={loading || !formData.tokenName || !formData.tokenSymbol || !formData.initialSupply}
          className="w-full"
        >
          {loading ? 'Creating...' : 'Create Token'}
        </Button>
      </div>
    </motion.div>
  );
}