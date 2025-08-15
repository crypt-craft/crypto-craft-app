import { FeatureIcons } from '@/components/ui/feature-icons';

type Feature = 'token' | 'liquidity' | 'airdrop' | 'pool';

interface FeatureSelectorProps {
  selectedFeature: Feature;
  setSelectedFeature: (feature: Feature) => void;
}

export function FeatureSelector({ selectedFeature, setSelectedFeature }: FeatureSelectorProps): JSX.Element {
  const featureTabs = [
    { id: 'token', label: 'Token', icon: <FeatureIcons.Token className="w-4 h-4" /> },
    { id: 'liquidity', label: 'Liquidity', icon: <FeatureIcons.Liquidity className="w-4 h-4" /> },
    { id: 'airdrop', label: 'Airdrop', icon: <FeatureIcons.Airdrop className="w-4 h-4" /> },
    { id: 'pool', label: 'Pool', icon: <FeatureIcons.Pool className="w-4 h-4" /> },
  ];

  return (
    <div className="flex gap-2 bg-gray-800/50 p-1 rounded-md backdrop-blur-md">
      {featureTabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setSelectedFeature(tab.id as Feature)}
          className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center gap-2 text-sm ${
            selectedFeature === tab.id
              ? 'bg-indigo-600 text-white'
              : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}