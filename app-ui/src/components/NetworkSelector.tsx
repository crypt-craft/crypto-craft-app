import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

type NetworkType = 'mainnet' | 'devnet';

interface NetworkSelectorProps {
  selectedNetwork: NetworkType;
  setSelectedNetwork: (network: NetworkType) => void;
}

export function NetworkSelector({ 
  selectedNetwork, 
  setSelectedNetwork 
}: NetworkSelectorProps): JSX.Element {
  const handleToggle = (checked: boolean) => {
    setSelectedNetwork(checked ? 'mainnet' : 'devnet');
  };
  
  return (
    <div className="flex items-center space-x-2 bg-gray-800/50 p-2 rounded-md">
      <Switch 
        id="network-mode"
        checked={selectedNetwork === 'mainnet'}
        onCheckedChange={handleToggle}
        className="data-[state=checked]:bg-green-500"
      />
      <Label htmlFor="network-mode" className="text-sm cursor-pointer">
        {selectedNetwork === 'mainnet' ? 'Mainnet' : 'Devnet'}
      </Label>
    </div>
  );
}