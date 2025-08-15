import { ArrowDownIcon, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlockchainType } from '@/layouts/AppLayout';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface LiquidityFeatureProps {
  blockchain: BlockchainType;
}

export function LiquidityFeature({ blockchain }: LiquidityFeatureProps) {
  const [addingLiquidity, setAddingLiquidity] = useState(true);

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="flex items-center gap-2 mb-2">
        <h2 className="text-2xl font-bold text-white">Manage Liquidity</h2>
        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-xs px-2 py-1 rounded-full uppercase">
          {blockchain}
        </div>
      </div>
      
      <p className="text-white/60 mb-6">
        Add or remove liquidity for token pairs on {blockchain} blockchain.
      </p>

      <div className="flex gap-4 mb-6 max-w-md mx-auto">
        <button 
          className={`flex-1 py-2 rounded-lg text-center transition-all ${addingLiquidity ? 'bg-blue-500 text-white' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}
          onClick={() => setAddingLiquidity(true)}
        >
          Add Liquidity
        </button>
        <button 
          className={`flex-1 py-2 rounded-lg text-center transition-all ${!addingLiquidity ? 'bg-blue-500 text-white' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}
          onClick={() => setAddingLiquidity(false)}
        >
          Remove Liquidity
        </button>
      </div>

      <div className="max-w-md mx-auto space-y-4">
        {addingLiquidity ? (
          <>
            <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-white/60">You provide</span>
                <span className="text-sm text-white/60">Balance: 0.00</span>
              </div>
              
              <div className="flex items-center gap-3">
                <Input 
                  type="number" 
                  placeholder="0.0" 
                  variant="glass"
                  className="border-none text-lg"
                />
                
                <button className="bg-white/10 hover:bg-white/20 transition-colors rounded-lg px-3 py-2 flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                  <span>SOL</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="bg-white/10 rounded-full p-2">
                <ArrowDownIcon className="w-5 h-5" />
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-white/60">You provide</span>
                <span className="text-sm text-white/60">Balance: 0.00</span>
              </div>
              
              <div className="flex items-center gap-3">
                <Input 
                  type="number" 
                  placeholder="0.0" 
                  variant="glass"
                  className="border-none text-lg"
                />
                
                <button className="bg-white/10 hover:bg-white/20 transition-colors rounded-lg px-3 py-2 flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"></div>
                  <span>Token</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4">
              <div className="flex justify-between text-sm text-white/60 mb-2">
                <span>Estimated Pool Share</span>
                <span>0%</span>
              </div>
              <div className="flex justify-between text-sm text-white/60">
                <span>Slippage Tolerance</span>
                <div className="flex items-center gap-1">
                  <span>0.5%</span>
                  <button className="text-blue-400 hover:text-blue-300 transition-colors">
                    <Settings className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
            
            <Button variant="neon" size="lg" className="w-full">
              Add Liquidity
            </Button>
          </>
        ) : (
          <>
            <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 text-center mb-4">
              <h3 className="text-xl font-medium mb-4">Your Liquidity</h3>
              
              <div className="bg-white/10 rounded-xl p-6 mb-4">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="flex items-center -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 z-10"></div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"></div>
                  </div>
                  <span className="font-medium">SOL / TOKEN</span>
                </div>
                
                <div className="flex justify-between mb-2 text-sm">
                  <span className="text-white/60">Pool Share:</span>
                  <span>0.02%</span>
                </div>
                
                <div className="flex justify-between mb-2 text-sm">
                  <span className="text-white/60">Pooled SOL:</span>
                  <span>0.5 SOL</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Pooled TOKEN:</span>
                  <span>100 TOKEN</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Input 
                  type="number" 
                  placeholder="Amount to remove (%)" 
                  variant="glass"
                  className="flex-1"
                />
                <Button variant="outline" className="px-3">
                  Max
                </Button>
              </div>
            </div>
            
            <Button variant="destructive" size="lg" className="w-full">
              Remove Liquidity
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
