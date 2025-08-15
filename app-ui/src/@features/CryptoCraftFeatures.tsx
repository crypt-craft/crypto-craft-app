import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SolanaWalletConnector } from './wallet/SolanaWalletConnector';
import { TrustWalletConnector } from './wallet/TrustWalletConnector';
import { SolanaTokenCreator, SolanaTokenPreview } from './token/SolanaTokenCreator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Coins, Droplets, Network, Share2 } from 'lucide-react';
import { AirdropFeature } from '@/components/features/AirdropFeature';

interface CryptoCraftFeaturesProps {
  blockchain: 'solana' | 'ton' | 'tron';
  networkType: 'mainnet' | 'devnet';
  setNotification: (notification: { message: string; type: 'success' | 'error' } | null) => void;
}

export function CryptoCraftFeatures({
  blockchain,
  networkType,
  setNotification
}: CryptoCraftFeaturesProps) {
  const [activeTab, setActiveTab] = useState('token');
  const enablePhantom = import.meta.env.DEV || import.meta.env.VITE_ENABLE_PHANTOM === 'true'
  const enableTrust = import.meta.env.DEV || import.meta.env.VITE_ENABLE_TRUST === 'true'

  // Token creation form state (lifted up)
  const [formData, setFormData] = useState({
    tokenName: '',
    tokenSymbol: '',
    initialSupply: 1000,
    tokenDescription: '',
    imagePreview: null as string | null,
  });

  if (blockchain !== 'solana') {
    return (
      <Alert variant="destructive" className="bg-gray-800 border-gray-700">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Coming Soon</AlertTitle>
        <AlertDescription>
          {blockchain.toUpperCase()} blockchain support is under development and will be available soon.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      {/* Wallet Connection Section with Preview */}
      <div className="p-6 border border-gray-700 rounded-lg bg-gray-800/50 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 min-w-0">
            {enablePhantom ? (
              <SolanaWalletConnector
                networkType={networkType}
                setNotification={setNotification}
              />
            ) : (
              <div className="text-sm text-gray-400">Phantom connection is disabled in production.</div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            {/* EVM Trust Wallet basic connector (local dev aid) */}
            {enableTrust ? (
              <TrustWalletConnector setNotification={setNotification} />
            ) : (
              <div className="text-sm text-gray-400">Trust Wallet connection is disabled in production.</div>
            )}
          </div>
        </div>
      </div>

      {/* Token Preview Section */}
      <div className="p-6 border border-gray-700 rounded-lg bg-gray-800/50 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <SolanaTokenPreview
              imagePreview={formData.imagePreview}
              tokenName={formData.tokenName}
              tokenSymbol={formData.tokenSymbol}
              initialSupply={formData.initialSupply}
              tokenDescription={formData.tokenDescription}
            />
          </div>
        </div>
      </div>

      {/* Feature Tabs Section */}
      <Tabs defaultValue="token" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 bg-gray-800 border border-gray-700 p-1">
          <TabsTrigger value="token" className="data-[state=active]:bg-blue-600">
            <div className="flex items-center space-x-2">
              <Coins className="w-4 h-4" />
              <span>Token Creator</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="liquidity" className="data-[state=active]:bg-purple-600">
            <div className="flex items-center space-x-2">
              <Droplets className="w-4 h-4" />
              <span>Liquidity</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="airdrop" className="data-[state=active]:bg-green-600">
            <div className="flex items-center space-x-2">
              <Share2 className="w-4 h-4" />
              <span>Airdrop</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="pool" className="data-[state=active]:bg-amber-600">
            <div className="flex items-center space-x-2">
              <Network className="w-4 h-4" />
              <span>Pool</span>
            </div>
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="py-6"
          >
            <TabsContent value="token" className="mt-0">
              <SolanaTokenCreator
                networkType={networkType}
                setNotification={setNotification}
                formData={formData}
                setFormData={setFormData}
              />
            </TabsContent>

            <TabsContent value="liquidity" className="mt-0">
              <ComingSoonFeature 
                title="Liquidity Management" 
                description="Create and manage liquidity pools for your tokens on Solana." 
              />
            </TabsContent>

            <TabsContent value="airdrop" className="mt-0">
              <AirdropFeature blockchain="solana" />
            </TabsContent>

            <TabsContent value="pool" className="mt-0">
              <ComingSoonFeature 
                title="Staking Pool" 
                description="Create staking pools for your token with customizable rewards." 
              />
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </div>
  );
}

// Placeholder component for features that are coming soon
function ComingSoonFeature({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 border border-gray-700 rounded-lg bg-gray-800/30 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-xl font-bold text-gray-300 mb-2">{title}</h3>
      <p className="text-gray-400 max-w-md">{description}</p>
      <div className="mt-6 bg-blue-900/30 text-blue-400 px-4 py-2 rounded-md border border-blue-800/50">
        Coming Soon
      </div>
    </div>
  );
} 