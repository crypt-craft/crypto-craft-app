import { useState } from 'react';
import { motion } from 'framer-motion';
import { FormInput } from '@/components/ui/FormInput';
import { useLiquidityApi } from '@/hooks/useApi';

interface LiquidityManagerProps {
  blockchain: string;
  setNotification: (notification: { message: string; type: 'success' | 'error' } | null) => void;
}

export function LiquidityManager({ blockchain, setNotification }: LiquidityManagerProps) {
  const { addLiquidity, loading } = useLiquidityApi();
  
  // State for form fields
  const [formData, setFormData] = useState({
    tokenA: '',
    tokenB: '',
    amountA: 0,
    amountB: 0
  });

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amountA' || name === 'amountB' ? parseFloat(value) || 0 : value
    }));
  };

  const handleAddLiquidity = async () => {
    try {
      // Validate form data
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

      if (formData.amountA <= 0) {
        setNotification({
          message: 'Amount A must be greater than 0',
          type: 'error'
        });
        return;
      }

      if (formData.amountB <= 0) {
        setNotification({
          message: 'Amount B must be greater than 0',
          type: 'error'
        });
        return;
      }

      // Call the API
      await addLiquidity({
        blockchain,
        tokenA: formData.tokenA,
        tokenB: formData.tokenB,
        amountA: formData.amountA,
        amountB: formData.amountB
      });

      // Show success notification
      setNotification({
        message: `Successfully added liquidity for ${formData.tokenA} and ${formData.tokenB}`,
        type: 'success'
      });

      // Reset form
      setFormData({
        tokenA: '',
        tokenB: '',
        amountA: 0,
        amountB: 0
      });
    } catch (error) {
      // Handle errors
      setNotification({
        message: error instanceof Error ? error.message : 'Failed to add liquidity',
        type: 'error'
      });
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
        Manage {blockchain.charAt(0).toUpperCase() + blockchain.slice(1)} Liquidity
      </h3>
      <div className="grid gap-6">
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
          label="Amount A"
          name="amountA"
          type="number"
          value={formData.amountA.toString()}
          onChange={handleInputChange}
          placeholder="Enter amount"
        />
        <FormInput
          label="Amount B"
          name="amountB"
          type="number"
          value={formData.amountB.toString()}
          onChange={handleInputChange}
          placeholder="Enter amount"
        />
        <motion.button
          className={`w-full py-3 px-6 rounded-md text-white font-medium ${
            loading
              ? 'bg-blue-600/50 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-600/30'
          }`}
          onClick={handleAddLiquidity}
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
        >
          {loading ? 'Processing...' : 'Add Liquidity'}
        </motion.button>
      </div>
    </div>
  );
}