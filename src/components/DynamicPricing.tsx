import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingDown, TrendingUp, Clock, Zap, AlertCircle } from 'lucide-react';

interface PriceData {
  productId: string;
  currentPrice: number;
  originalPrice: number;
  demand: number;
  inventory: number;
  trend: 'up' | 'down' | 'stable';
  priceHistory: number[];
  timeRemaining?: number;
}

interface DynamicPricingProps {
  userCoins: number;
  products: any[];
  onPriceUpdate?: (productId: string, newPrice: number) => void;
}

export const DynamicPricing = ({ userCoins, products, onPriceUpdate }: DynamicPricingProps) => {
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  // Mock dynamic pricing algorithm
  const calculateDynamicPrice = (basePrice: number, demand: number, inventory: number, userCoins: number) => {
    // Base pricing factors
    const demandMultiplier = 1 + (demand - 50) / 100; // High demand increases price
    const inventoryMultiplier = inventory < 20 ? 1.1 : inventory > 80 ? 0.95 : 1; // Low inventory increases price
    const userDiscount = Math.min(userCoins * 0.2, basePrice * 0.3); // User coins provide discount
    
    let dynamicPrice = basePrice * demandMultiplier * inventoryMultiplier;
    dynamicPrice = Math.max(dynamicPrice - userDiscount, basePrice * 0.7); // Minimum 30% of original
    
    return Math.round(dynamicPrice);
  };

  const generatePriceData = () => {
    return products.slice(0, 4).map(product => {
      const demand = Math.floor(Math.random() * 100);
      const inventory = Math.floor(Math.random() * 100);
      const trend = demand > 70 ? 'up' : demand < 30 ? 'down' : 'stable';
      const currentPrice = calculateDynamicPrice(product.price, demand, inventory, userCoins);
      
      return {
        productId: product.id,
        currentPrice,
        originalPrice: product.price,
        demand,
        inventory,
        trend,
        priceHistory: Array.from({ length: 7 }, () => 
          product.price + Math.floor((Math.random() - 0.5) * product.price * 0.2)
        ),
        timeRemaining: Math.floor(Math.random() * 3600) // Random seconds
      } as PriceData;
    });
  };

  useEffect(() => {
    setPriceData(generatePriceData());
    
    // Update prices every 10 seconds to simulate real-time pricing
    const interval = setInterval(() => {
      setIsUpdating(true);
      setTimeout(() => {
        setPriceData(generatePriceData());
        setIsUpdating(false);
      }, 1000);
    }, 10000);

    return () => clearInterval(interval);
  }, [userCoins, products]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-destructive" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-success" />;
      default: return <div className="w-4 h-4 rounded-full bg-muted" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-destructive';
      case 'down': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-accent" />
          Dynamic Pricing Engine
          {isUpdating && (
            <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          )}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Real-time ML-powered price optimization
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          {priceData.map((data) => {
            const product = products.find(p => p.id === data.productId);
            const savingsPercent = Math.round(((data.originalPrice - data.currentPrice) / data.originalPrice) * 100);
            
            return (
              <div key={data.productId} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{product?.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      {getTrendIcon(data.trend)}
                      <span className={`text-xs ${getTrendColor(data.trend)}`}>
                        {data.trend === 'up' ? 'Price Rising' : 
                         data.trend === 'down' ? 'Price Dropping' : 'Stable'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-primary">₹{data.currentPrice}</span>
                      {data.currentPrice < data.originalPrice && (
                        <Badge className="bg-success text-success-foreground text-xs">
                          -{savingsPercent}%
                        </Badge>
                      )}
                    </div>
                    {data.currentPrice !== data.originalPrice && (
                      <span className="text-xs text-muted-foreground line-through">
                        ₹{data.originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-muted-foreground">Demand</span>
                      <span className="font-medium">{data.demand}%</span>
                    </div>
                    <Progress value={data.demand} className="h-1" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-muted-foreground">Stock</span>
                      <span className="font-medium">{data.inventory}%</span>
                    </div>
                    <Progress 
                      value={data.inventory} 
                      className="h-1"
                    />
                  </div>
                </div>

                {data.timeRemaining && data.timeRemaining < 1800 && (
                  <div className="flex items-center gap-2 p-2 bg-accent/10 rounded text-xs">
                    <Clock className="w-3 h-3 text-accent" />
                    <span className="text-accent font-medium">
                      Price changes in {formatTime(data.timeRemaining)}
                    </span>
                  </div>
                )}

                {userCoins > 0 && data.currentPrice < data.originalPrice && (
                  <div className="flex items-center gap-2 p-2 bg-primary/10 rounded text-xs">
                    <AlertCircle className="w-3 h-3 text-primary" />
                    <span className="text-primary">
                      Your {userCoins} coins saved you ₹{data.originalPrice - data.currentPrice}!
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-4 p-3 bg-accent/5 rounded-lg border border-accent/20">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent">Algorithm Insights</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Prices update based on real-time demand, inventory levels, market conditions, 
            and your loyalty rewards. Machine learning optimizes for fair pricing.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};