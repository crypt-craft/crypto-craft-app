import React from 'react';

interface WalletConnectProps {
  blockchain: string;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({ blockchain }) => {
  const isConnected = false
  const address = ''
  
  if (blockchain !== 'solana') {
    return (
      <div className="coming-soon-overlay">
        <div className="relative">
          <button 
            className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            disabled
          >
            Coming Soon
          </button>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
            <div className="text-center p-6">
              <h3 className="text-xl font-bold text-white mb-2">Coming Soon</h3>
              <p className="text-gray-300">{blockchain.toUpperCase()} integration is under development</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center space-y-2">
      {/* Reown removed. Add Phantom button elsewhere. */}
      {isConnected && address && (
        <div className="mt-2 text-center">
          <div className="text-sm text-gray-400">Connected to Solana</div>
          <div className="text-xs text-gray-500 font-mono">
            {address.slice(0, 6)}...{address.slice(-6)}
          </div>
        </div>
      )}
    </div>
  );
};