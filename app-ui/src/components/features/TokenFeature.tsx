import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { BlockchainType } from '@/layouts/AppLayout';
import { Upload, Info } from 'lucide-react';

interface TokenFeatureProps {
  blockchain: BlockchainType;
}

export function TokenFeature({ blockchain }: TokenFeatureProps) {
  const [tokenImage, setTokenImage] = useState<string | null>(null);

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="flex items-center gap-2 mb-2">
        <h2 className="text-2xl font-bold text-white">Create Token</h2>
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-xs px-2 py-1 rounded-full uppercase">
          {blockchain}
        </div>
      </div>
      
      <p className="text-white/60 mb-6">
        Create your own token on the {blockchain} blockchain with customizable parameters.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Token Name</label>
            <Input placeholder="e.g. My Awesome Token" variant="neon" />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Symbol</label>
            <Input placeholder="e.g. AWSM" variant="neon" />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Total Supply</label>
            <Input type="number" placeholder="1000000" variant="neon" />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Decimals</label>
            <Input 
              type="number" 
              placeholder={blockchain === 'solana' ? "9" : "6"} 
              variant="neon" 
            />
            <p className="text-xs text-white/60 mt-1">
              <Info className="inline w-3 h-3 mr-1" />
              {blockchain === 'solana' ? 'Solana tokens usually use 9 decimals' : 'Standard is 6 decimals for most tokens'}
            </p>
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Token Description</label>
            <Textarea 
              placeholder="Describe your token's purpose and features" 
              variant="neon"
              className="min-h-[120px]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Token Logo</label>
            <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-white/40 transition-colors cursor-pointer">
              {tokenImage ? (
                <div className="relative">
                  <img 
                    src={tokenImage} 
                    alt="Token logo" 
                    className="w-24 h-24 mx-auto rounded-full object-cover"
                  />
                  <button 
                    className="absolute top-0 right-0 bg-red-500/80 rounded-full p-1"
                    onClick={() => setTokenImage(null)}
                  >
                    <span className="sr-only">Remove</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="w-10 h-10 mx-auto text-white/60 mb-2" />
                  <p className="text-sm text-white/60">
                    Drag and drop your logo or <span className="text-blue-400">browse files</span>
                  </p>
                  <p className="text-xs text-white/40 mt-1">
                    Supports JPG, PNG, SVG. Max 2MB.
                  </p>
                </>
              )}
              <input 
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (evt) => {
                      setTokenImage(evt.target?.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex justify-end">
        <Button variant="neon" size="lg" className="min-w-[200px]">
          Create Token
        </Button>
      </div>
    </div>
  );
}
