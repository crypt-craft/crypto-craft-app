import { useState } from 'react';
import { motion } from 'framer-motion';
import { FormInput } from '@/components/ui/FormInput';
import { usePoolApi } from '@/hooks/useApi';

interface PoolCreatorProps {
  blockchain: string;
  setNotification: (notification: { message: string; type: 'success' | 'error' } | null) => void;
}

export function PoolCreator({ blockchain, setNotification }: PoolCreatorProps) {
  const { createPool, loading } = usePoolApi();
  
  // State for form fields
  const [formData, setFormData] = useState({
    poolType: 'Standard',
    tokenA: '',
    tokenB: '',
    fee: 30, // Default fee of 30 basis points (0.3%)
  });

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'fee' ? parseInt(value) || 0 : value
    }));
  };

  const handleCreatePool = async () => {
    try {
      // Validate form data
      if (!formData.poolType) {
        setNotification({
          message: 'Please select a pool type',
          type: 'error'
        });
        return;
      }

      if (!formData.tokenA) {
        setNotification({
          message: 'Please select Token A',
          type: 'error'
        });
        return;
      }

      if (!formData.tokenB) {
        setNotification({
          message: 'Please select Token B',
          type: 'error'
        });
        return;
      }

      if (formData.tokenA === formData.tokenB) {
        setNotification({
          message: 'Token A and Token B must be different',
          type: 'error'
        });
        return;
      }

      if (formData.fee <= 0) {
        setNotification({
          message: 'Fee must be greater than 0',
          type: 'error'
        });
        return;
      }

      // Call the API
      await createPool({
        blockchain,
        poolType: formData.poolType,
        tokenA: formData.tokenA,
        tokenB: formData.tokenB,
        fee: formData.fee
      });

      // Show success notification
      setNotification({
        message: `Successfully created ${formData.poolType} pool for ${formData.tokenA} and ${formData.tokenB}`,
        type: 'success'
      });

      // Reset form to default values
      setFormData({
        poolType: 'Standard',
        tokenA: '',
        tokenB: '',
        fee: 30,
      });
    } catch (error) {
      // Handle errors
      setNotification({
        message: error instanceof Error ? error.message : 'Failed to create pool',
        type: 'error'
      });
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
        {blockchain.charAt(0).toUpperCase() + blockchain.slice(1)} Pool
      </h3>
      <div className="grid gap-6">
        <div className="relative">
          <label className="text-sm font-medium text-white/80 mb-1 block">Pool Type</label>
          <select
            name="poolType"
            value={formData.poolType}
            onChange={handleInputChange}
            className="w-full bg-black/30 border border-blue-500/30 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="Standard">Standard</option>
            <option value="Stable">Stable</option>
          </select>
        </div>
        <div className="relative">
          <label className="text-sm font-medium text-white/80 mb-1 block">Token A</label>
          <select
            name="tokenA"
            value={formData.tokenA}
            onChange={handleInputChange}
            className="w-full bg-black/30 border border-blue-500/30 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="">Select token</option>
            {/* This could be populated from an API call */}
            <option value="tokenA1">Token A1</option>
            <option value="tokenA2">Token A2</option>
          </select>
        </div>
        <div className="relative">
          <label className="text-sm font-medium text-white/80 mb-1 block">Token B</label>
          <select
            name="tokenB"
            value={formData.tokenB}
            onChange={handleInputChange}
            className="w-full bg-black/30 border border-blue-500/30 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="">Select token</option>
            {/* This could be populated from an API call */}
            <option value="tokenB1">Token B1</option>
            <option value="tokenB2">Token B2</option>
          </select>
        </div>
        <FormInput
          label="Fee (bps)"
          name="fee"
          type="number"
          value={formData.fee.toString()}
          onChange={handleInputChange}
          placeholder="Enter fee in basis points"
        />
        <motion.button
          className={`w-full py-3 px-6 rounded-md text-white font-medium ${
            loading
              ? 'bg-blue-600/50 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-600/30'
          }`}
          onClick={handleCreatePool}
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
        >
          {loading ? 'Creating...' : 'Create Pool'}
        </motion.button>
      </div>
    </div>
  );
}