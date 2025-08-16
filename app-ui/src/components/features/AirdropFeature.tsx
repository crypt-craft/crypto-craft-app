import { BlockchainType } from '@/layouts/AppLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  FileUp, 
  AlertCircle, 
  Check, 
  Send, 
  Users, 
  ChevronRight, 
  ChevronLeft, 
  Zap,
  Copy,
  ExternalLink
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { useNetwork } from '@/components/navbar/networkContext';
import { useConnection } from '@solana/wallet-adapter-react';
import { usePhantomWallet } from '@/hooks/usePhantom';
import * as web3 from '@solana/web3.js';
import { motion, AnimatePresence } from 'framer-motion';

interface AirdropFeatureProps {
  blockchain: BlockchainType;
}

export function AirdropFeature({ blockchain }: AirdropFeatureProps) {
  // State management
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [formStep, setFormStep] = useState<'config' | 'recipients' | 'confirmation'>('config');
  const [tokenAddress, setTokenAddress] = useState('');
  const [amountPerRecipient, setAmountPerRecipient] = useState('');
  const [recipients, setRecipients] = useState<string[]>([]);
  const [recipientText, setRecipientText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [txId, setTxId] = useState('');
  const [enableDevnetFaucet, setEnableDevnetFaucet] = useState(false);
  const [devnetSolAmount, setDevnetSolAmount] = useState<string>('1');
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);
  const [newBalanceLamports] = useState<number | null>(null);

  const { network } = useNetwork();
  const { connection } = useConnection();
  const { address, connected } = usePhantomWallet();
  const publicKey = useMemo(() => (address ? new web3.PublicKey(address) : null), [address]);

  // Update recipients array when recipientText changes
  useEffect(() => {
    if (recipientText) {
      const addresses = recipientText.split('\n').filter(line => line.trim() !== '');
      setRecipients(addresses);
    } else {
      setRecipients([]);
    }
  }, [recipientText]);

  // Handle CSV file upload
  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setCsvFile(file);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const text = event.target.result as string;
        const addresses = text.split(/\r?\n/).filter(line => line.trim() !== '');
        setRecipients(addresses);
        setRecipientText(addresses.join('\n'));
      }
    };
    reader.readAsText(file);
  };

  // Simulate airdrop launch
  const handleLaunchAirdrop = () => {
    if (isProcessing) return;
    setIsProcessing(true);
    const timeout = setTimeout(() => {
      setIsProcessing(false);
      toast.error('Airdrop processing timed out');
    }, 15000);
    setTimeout(() => {
      clearTimeout(timeout);
      setIsProcessing(false);
      setIsSuccess(true);
      setTxId('4ZpTVM9ssAg5DrJrRBZbhZmQnCKoFD3RCtt8jEWqjzhtMrfFrx1fLMmZZ6bCQ7RPEM4BKhD');
      toast.success('Airdrop submitted');
    }, 3000);
  };

  // Devnet SOL faucet handler (visible only when network === 'devnet' and checkbox enabled)
  const handleRequestDevnetAirdrop = async () => {
    try {
      if (network !== 'devnet') {
        toast.error('Airdrop available only on Devnet');
        return;
      }
      if (!publicKey) {
        toast.error('Wallet not connected');
        return;
      }
      if (!connection) {
        toast.error('No connection');
        return;
      }
      const lamports = Math.max(0, Math.floor(parseFloat(devnetSolAmount || '0') * web3.LAMPORTS_PER_SOL));
      const signature = await connection.requestAirdrop(publicKey, lamports);
      await connection.confirmTransaction(signature, 'confirmed');
      setTxId(signature);
      setIsSuccess(true);
      toast.success('Devnet airdrop successful');
      setCooldownUntil(Date.now() + 60_000);
    } catch (e: any) {
      const msg = String(e?.message || e || 'Airdrop failed');
      if (msg.toLowerCase().includes('429') || msg.toLowerCase().includes('rate')) {
        toast.error('Airdrop rate limited. Try again later.');
        setCooldownUntil(Date.now() + 5 * 60_000);
      } else {
        toast.error(msg);
      }
    }
  };

  // Copy transaction ID to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Note: You could add a toast notification here for user feedback
  };

  return (
    <div className="p-6 h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-orange-500">
          Airdrop Tokens
        </h2>
        <div className="bg-gradient-to-r from-pink-500 to-orange-500 text-xs px-2 py-1 rounded-full uppercase">
          {blockchain}
        </div>
      </div>
      
      <p className="text-white/60 mb-6">
        {network === 'devnet' ? 'Request test SOL on Devnet to try features.' : 'Mainnet airdrop is not implemented yet.'}
      </p>

      {/* Success State */}
      {isSuccess ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl mx-auto bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-xl rounded-xl border border-green-500/20 p-8 shadow-xl"
        >
          <div className="text-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-4">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Airdrop Successfully Launched!</h3>
            <p className="text-white/60">
              Your airdrop has been submitted to the {blockchain} network
            </p>
          </div>
          
          <div className="bg-white/5 rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-3">
              <span className="text-white/60">Transaction ID:</span>
              <div className="flex items-center">
                <span className="font-mono text-sm truncate max-w-[180px]">{txId.substring(0, 8)}...{txId.substring(txId.length - 8)}</span>
                <button 
                  className="ml-2 text-white/40 hover:text-white/80 transition-colors"
                  onClick={() => copyToClipboard(txId)}
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-3">
              <span className="text-white/60">Recipients:</span>
              <span className="font-medium">{recipients.length} addresses</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-white/60">Total tokens:</span>
              <span className="font-medium">{parseInt(amountPerRecipient || '0') * recipients.length} tokens</span>
            </div>
          </div>
          
          <div className="flex justify-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsSuccess(false);
                setFormStep('config');
                setTokenAddress('');
                setAmountPerRecipient('');
                setRecipients([]);
                setRecipientText('');
                setCsvFile(null);
              }}
            >
              Create New Airdrop
            </Button>
            
            <Button 
              variant="neon"
              className="gap-2"
              onClick={() => window.open(`https://explorer.solana.com/tx/${txId}${network==='devnet' ? '?cluster=devnet' : ''}`, '_blank')}
            >
              <ExternalLink className="w-4 h-4" />
              <span>View in Explorer</span>
            </Button>
          </div>
        </motion.div>
      ) : (
        <div className="max-w-xl mx-auto">
          {/* Progress Steps (hidden for faucet-only view) */}
          <div className="hidden">
            <div className="absolute h-1 bg-white/10 top-4 left-0 right-0 -z-10"></div>
            <div 
              className="absolute h-1 bg-gradient-to-r from-pink-500 to-orange-500 top-4 left-0 -z-10 transition-all duration-500"
              style={{ 
                width: formStep === 'config' ? '0%' : formStep === 'recipients' ? '50%' : '100%' 
              }}
            ></div>
            
            <div className="flex-1 flex flex-col items-center">
              <motion.div 
                className={`w-8 h-8 rounded-full flex items-center justify-center 
                  ${formStep === 'config' 
                    ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white' 
                    : formStep === 'recipients' || formStep === 'confirmation' 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                      : 'bg-white/10 text-white/60'
                  }`}
                animate={{ scale: formStep === 'config' ? [1, 1.1, 1] : 1 }}
                transition={{ duration: 0.3 }}
              >
                {formStep === 'recipients' || formStep === 'confirmation' ? <Check className="w-4 h-4" /> : "1"}
              </motion.div>
              <span className={`mt-2 text-xs ${formStep === 'config' ? 'text-white' : 'text-white/60'}`}>Configure</span>
            </div>
            
            <div className="flex-1 flex flex-col items-center">
              <motion.div 
                className={`w-8 h-8 rounded-full flex items-center justify-center 
                  ${formStep === 'recipients' 
                    ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white' 
                    : formStep === 'confirmation' 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                      : 'bg-white/10 text-white/60'
                  }`}
                animate={{ scale: formStep === 'recipients' ? [1, 1.1, 1] : 1 }}
                transition={{ duration: 0.3 }}
              >
                {formStep === 'confirmation' ? <Check className="w-4 h-4" /> : "2"}
              </motion.div>
              <span className={`mt-2 text-xs ${formStep === 'recipients' ? 'text-white' : 'text-white/60'}`}>Recipients</span>
            </div>
            
            <div className="flex-1 flex flex-col items-center">
              <motion.div 
                className={`w-8 h-8 rounded-full flex items-center justify-center 
                  ${formStep === 'confirmation' 
                    ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white' 
                    : 'bg-white/10 text-white/60'
                  }`}
                animate={{ scale: formStep === 'confirmation' ? [1, 1.1, 1] : 1 }}
                transition={{ duration: 0.3 }}
              >
                3
              </motion.div>
              <span className={`mt-2 text-xs ${formStep === 'confirmation' ? 'text-white' : 'text-white/60'}`}>Confirm</span>
            </div>
          </div>
          
          <AnimatePresence mode="wait">
            {/* Config Step */}
            {formStep === 'config' && (
              <motion.div 
                key="config"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 shadow-xl"
              >
                {/* Simplified: remove token distribution config for now */}
                <div className="text-sm text-white/70">Devnet faucet is available below. Token airdrop flow will be added later.</div>
              </motion.div>
            )}
            
            {/* Recipients Step */}
            {false && formStep === 'recipients' && (
              <motion.div 
                key="recipients"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 shadow-xl"
              >
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="block text-sm font-medium">Recipient Addresses</label>
                    <a 
                      href="#" 
                      className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                      onClick={(e) => e.preventDefault()}
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        className="w-3 h-3"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      Download Template
                    </a>
                  </div>
                  
                  <div className="mb-4">
                    <Textarea 
                      placeholder="Enter addresses, one per line" 
                      variant="glass"
                      className="min-h-[150px]"
                      value={recipientText}
                      onChange={(e) => setRecipientText(e.target.value)}
                    />
                    <div className="flex justify-between mt-1">
                      <p className="text-xs text-white/60 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Enter each wallet address on a new line
                      </p>
                      <p className="text-xs text-white/60">
                        <Users className="w-3 h-3 inline mr-1" />
                        {recipients.length} recipients
                      </p>
                    </div>
                  </div>
                  
                  <div className="relative text-center mb-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/10"></div>
                    </div>
                    <div className="relative">
                      <span className="bg-black/50 px-2 text-sm text-white/60 backdrop-blur-sm">OR</span>
                    </div>
                  </div>
                  
                  <label className="cursor-pointer">
                    <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-pink-500/40 transition-colors group">
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3 group-hover:bg-pink-500/10 transition-colors">
                        <FileUp className="w-8 h-8 text-white/60 group-hover:text-pink-500/80 transition-colors" />
                      </div>
                      <p className="text-sm font-medium">
                        {csvFile?.name ?? 'Upload CSV file with addresses'}
                      </p>
                      <p className="text-xs text-white/60 mt-1">
                        CSV should have one address per line
                      </p>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept=".csv" 
                        onChange={handleCsvUpload}
                      />
                    </div>
                  </label>
                </div>
                
                {recipients.length > 0 && (
                  <div className="bg-indigo-900/20 border border-indigo-500/30 rounded p-3 text-indigo-200 text-sm">
                    <div className="flex">
                      <Check className="w-5 h-5 mr-2 flex-shrink-0" />
                      <div>
                        <p className="font-medium">{recipients.length} recipient addresses detected</p>
                        <p className="text-xs text-indigo-200/70 mt-1">
                          Total tokens to distribute: {parseInt(amountPerRecipient || '0') * recipients.length} tokens
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between pt-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setFormStep('config')}
                    className="gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back</span>
                  </Button>
                  <Button 
                    variant="neon" 
                    onClick={() => setFormStep('confirmation')}
                    disabled={recipients.length === 0}
                    className="gap-2"
                  >
                    <span>Review Airdrop</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}
            
            {/* Confirmation Step */}
            {false && formStep === 'confirmation' && (
              <motion.div 
                key="confirmation"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 shadow-xl"
              >
                <div className="bg-white/10 rounded-lg p-6 mb-4">
                  <h3 className="text-xl font-medium mb-6 text-center">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-orange-500">
                      Airdrop Summary
                    </span>
                  </h3>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center border-b border-white/10 pb-3">
                      <span className="text-white/60">Token:</span>
                      <span className="font-mono bg-white/5 px-3 py-1 rounded-full text-sm">
                        {tokenAddress.substring(0, 6)}...{tokenAddress.substring(tokenAddress.length - 4)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/10 pb-3">
                      <span className="text-white/60">Recipients:</span>
                      <span className="font-medium">{recipients.length} addresses</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/10 pb-3">
                      <span className="text-white/60">Amount per recipient:</span>
                      <span className="font-medium">{amountPerRecipient} tokens</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/10 pb-3">
                      <span className="text-white/60">Total tokens:</span>
                      <span className="font-medium text-lg">{parseInt(amountPerRecipient || '0') * recipients.length} tokens</span>
                    </div>
                    <div className="flex justify-between items-center">
               <span className="text-white/60">Estimated network fee:</span>
                      <div className="flex items-center">
                        <Zap className="w-4 h-4 mr-1 text-yellow-400" />
                        <span>~0.01 {blockchain === 'solana' ? 'SOL' : blockchain === 'ton' ? 'TON' : 'TRX'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 text-yellow-200 text-sm">
                    <div className="flex items-start">
                      <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium mb-1">Please verify all information</p>
                        <p className="text-yellow-200/80">
                          This operation cannot be undone once submitted. Make sure you have enough tokens in your wallet.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between pt-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setFormStep('recipients')}
                    className="gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back</span>
                  </Button>
                  <Button 
                    variant="neon"
                    onClick={handleLaunchAirdrop}
                    disabled={isProcessing}
                    className="gap-2 min-w-[180px]"
                  >
                    {isProcessing ? (
                      <>
                        <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Launch Airdrop</span>
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Network specific rendering */}
          {network === 'devnet' ? (
            <div className="max-w-xl mx-auto mt-6 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium">Enable Devnet test mode</label>
                <input
                  type="checkbox"
                  checked={enableDevnetFaucet}
                  onChange={(e) => setEnableDevnetFaucet(e.target.checked)}
                />
              </div>
              {enableDevnetFaucet && (
                <div className="space-y-3">
                  {!connected && (
                    <div className="text-xs text-yellow-300">Connect Phantom to request airdrop.</div>
                  )}
                  <div>
                    <label className="block text-sm mb-1">Request SOL amount (Devnet)</label>
                    <Input
                      type="number"
                      value={devnetSolAmount}
                      onChange={(e) => setDevnetSolAmount(e.target.value)}
                      placeholder="1"
                    />
                    <p className="text-xs text-white/60 mt-1">Funds are test-only on Devnet. If you don't see funds in Phantom, switch wallet to Devnet.</p>
                    {newBalanceLamports !== null && (
                      <p className="text-xs text-green-400 mt-1">New balance: {(newBalanceLamports / web3.LAMPORTS_PER_SOL).toFixed(3)} SOL</p>
                    )}
                    {cooldownUntil && Date.now() < cooldownUntil && (
                      <p className="text-xs text-white/60 mt-1">Cooldown active. Try again in {Math.max(0, Math.ceil((cooldownUntil - Date.now())/1000))}s.</p>
                    )}
                  </div>
                  <Button 
                    variant="outline"
                    className="gap-2"
                    onClick={handleRequestDevnetAirdrop}
                    disabled={!publicKey || !connected || !devnetSolAmount || isNaN(Number(devnetSolAmount)) || Number(devnetSolAmount) <= 0 || Number(devnetSolAmount) > 2 || (cooldownUntil !== null && Date.now() < cooldownUntil)}
                  >
                    <Zap className="w-4 h-4" />
                    <span>Get Devnet SOL Airdrop</span>
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-xl mx-auto mt-6 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Mainnet Airdrop</p>
                  <p className="text-xs text-white/60">Not implemented</p>
                </div>
                <Button variant="outline" disabled>
                  Coming soon
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
