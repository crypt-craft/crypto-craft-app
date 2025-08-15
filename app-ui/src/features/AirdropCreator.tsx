import { useState } from 'react';
import { motion } from 'framer-motion';
import { FormInput } from '@/components/ui/FormInput';
import { useAirdropApi } from '@/hooks/useApi';

interface AirdropCreatorProps {
  blockchain: string;
  setNotification: (notification: { message: string; type: 'success' | 'error' } | null) => void;
}

export function AirdropCreator({ blockchain, setNotification }: AirdropCreatorProps) {
  const { createAirdrop, loading } = useAirdropApi();
  
  // State for form fields
  const [formData, setFormData] = useState({
    tokenAddress: '',
    recipients: '',
    amountPerRecipient: 0
  });

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amountPerRecipient' ? parseFloat(value) || 0 : value
    }));
  };

  const handleCreateAirdrop = async () => {
    try {
      // Validate form data
      if (!formData.tokenAddress) {
        setNotification({
          message: 'Please select a token',
          type: 'error'
        });
        return;
      }

      if (!formData.recipients.trim()) {
        setNotification({
          message: 'Please enter at least one recipient address',
          type: 'error'
        });
        return;
      }

      if (formData.amountPerRecipient <= 0) {
        setNotification({
          message: 'Amount per recipient must be greater than 0',
          type: 'error'
        });
        return;
      }

      // Parse recipient addresses (split by newline)
      const recipientList = formData.recipients
        .split('\n')
        .map(address => address.trim())
        .filter(address => address.length > 0);

      if (recipientList.length === 0) {
        setNotification({
          message: 'Please enter valid recipient addresses',
          type: 'error'
        });
        return;
      }

      // Call the API
      await createAirdrop({
        blockchain,
        tokenAddress: formData.tokenAddress,
        recipients: recipientList,
        amountPerRecipient: formData.amountPerRecipient
      });

      // Show success notification
      setNotification({
        message: `Successfully created airdrop for ${recipientList.length} recipients`,
        type: 'success'
      });

      // Reset form
      setFormData({
        tokenAddress: '',
        recipients: '',
        amountPerRecipient: 0
      });
    } catch (error) {
      // Handle errors
      setNotification({
        message: error instanceof Error ? error.message : 'Failed to create airdrop',
        type: 'error'
      });
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
        {blockchain.charAt(0).toUpperCase() + blockchain.slice(1)} Airdrop
      </h3>
      <div className="grid gap-6">
        <div className="relative">
          <label className="text-sm font-medium text-white/80 mb-1 block">Token</label>
          <select
            name="tokenAddress"
            value={formData.tokenAddress}
            onChange={handleInputChange}
            className="w-full bg-black/30 border border-blue-500/30 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="">Select token</option>
            {/* This could be populated from an API call */}
            <option value="token1">Token 1</option>
            <option value="token2">Token 2</option>
          </select>
        </div>
        <div className="relative">
          <label className="text-sm font-medium text-white/80 mb-1 block">Recipients (one address per line)</label>
          <textarea
            name="recipients"
            value={formData.recipients}
            onChange={handleInputChange}
            className="w-full bg-black/30 border border-blue-500/30 text-white px-4 py-3 rounded-md min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            placeholder="Enter recipient addresses"
          />
        </div>
        <FormInput
          label="Amount per recipient"
          name="amountPerRecipient"
          type="number"
          value={formData.amountPerRecipient.toString()}
          onChange={handleInputChange}
          placeholder="Enter amount"
        />
        <motion.button
          className={`w-full py-3 px-6 rounded-md text-white font-medium ${
            loading
              ? 'bg-blue-600/50 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-600/30'
          }`}
          onClick={handleCreateAirdrop}
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
        >
          {loading ? 'Processing...' : 'Create Airdrop'}
        </motion.button>
      </div>
    </div>
  );
}