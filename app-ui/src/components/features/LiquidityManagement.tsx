import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FeatureIcons } from '@/components/ui/feature-icons';

export default function LiquidityManagement() {
  return (
    <Card variant="neon" className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <FeatureIcons.Pool className="h-6 w-6" />
          <CardTitle>Manage Liquidity</CardTitle>
        </div>
        <CardDescription>
          Add or remove liquidity from token pairs.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">First Token</label>
            <Input placeholder="Token Address" variant="neon" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Second Token</label>
            <Input placeholder="Token Address" variant="neon" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount 1</label>
            <Input type="number" placeholder="0.0" variant="neon" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount 2</label>
            <Input type="number" placeholder="0.0" variant="neon" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" className="w-full sm:w-auto">
          Remove Liquidity
        </Button>
        <Button variant="neon" className="w-full sm:w-auto">
          Add Liquidity
        </Button>
      </CardFooter>
    </Card>
  );
}
