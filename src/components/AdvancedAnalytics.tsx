import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users, 
  ShoppingCart, 
  Eye,
  Heart,
  Target,
  Zap,
  Brain,
  Clock
} from 'lucide-react';

interface AnalyticsData {
  customerBehavior: {
    sessionDuration: number;
    bounceRate: number;
    conversionRate: number;
    cartAbandonmentRate: number;
  };
  productPerformance: {
    topViewed: Array<{ name: string; views: number; trend: 'up' | 'down' }>;
    topSelling: Array<{ name: string; sales: number; revenue: number }>;
    lowStock: Array<{ name: string; stock: number; demandScore: number }>;
  };
  realTimeMetrics: {
    activeUsers: number;
    currentSales: number;
    conversionRate: number;
    avgOrderValue: number;
  };
  aiInsights: Array<{
    type: 'opportunity' | 'warning' | 'trend';
    title: string;
    description: string;
    confidence: number;
  }>;
}

export const AdvancedAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Simulate real-time analytics data loading
    const loadAnalytics = () => {
      setTimeout(() => {
        setAnalytics({
          customerBehavior: {
            sessionDuration: 4.2,
            bounceRate: 23.5,
            conversionRate: 12.8,
            cartAbandonmentRate: 31.2
          },
          productPerformance: {
            topViewed: [
              { name: 'Wireless Earbuds', views: 2847, trend: 'up' },
              { name: 'Smart Watch', views: 2234, trend: 'up' },
              { name: 'Phone Case', views: 1892, trend: 'down' },
              { name: 'Laptop Stand', views: 1654, trend: 'up' }
            ],
            topSelling: [
              { name: 'T-Shirt Cotton', sales: 234, revenue: 187650 },
              { name: 'Wireless Mouse', sales: 189, revenue: 94500 },
              { name: 'Coffee Mug', sales: 156, revenue: 31200 }
            ],
            lowStock: [
              { name: 'Gaming Headset', stock: 12, demandScore: 94 },
              { name: 'Wireless Charger', stock: 8, demandScore: 87 },
              { name: 'Bluetooth Speaker', stock: 15, demandScore: 78 }
            ]
          },
          realTimeMetrics: {
            activeUsers: 1247,
            currentSales: 89,
            conversionRate: 12.8,
            avgOrderValue: 2450
          },
          aiInsights: [
            {
              type: 'opportunity',
              title: 'Cross-selling Opportunity',
              description: 'Customers buying wireless earbuds show 78% likelihood of purchasing phone cases within 7 days',
              confidence: 0.89
            },
            {
              type: 'warning',
              title: 'Inventory Alert',
              description: 'Gaming headsets may stock out in 2-3 days based on current demand patterns',
              confidence: 0.94
            },
            {
              type: 'trend',
              title: 'Emerging Trend',
              description: 'Smart home devices seeing 45% increase in searches this week',
              confidence: 0.82
            }
          ]
        });
        setIsLoading(false);
      }, 1500);
    };

    loadAnalytics();
    const interval = setInterval(loadAnalytics, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Advanced Analytics Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-12">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Processing real-time data...</p>
        </CardContent>
      </Card>
    );
  }

  if (!analytics) return null;

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Advanced Analytics Dashboard
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Real-time insights powered by machine learning
        </p>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="behavior">Behavior</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Real-time Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Active Users</span>
                </div>
                <p className="text-2xl font-bold text-primary">{analytics.realTimeMetrics.activeUsers}</p>
                <p className="text-xs text-muted-foreground">+12% from yesterday</p>
              </div>

              <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                <div className="flex items-center gap-2 mb-2">
                  <ShoppingCart className="w-4 h-4 text-accent-foreground" />
                  <span className="text-sm font-medium">Live Sales</span>
                </div>
                <p className="text-2xl font-bold text-accent-foreground">{analytics.realTimeMetrics.currentSales}</p>
                <p className="text-xs text-muted-foreground">Last hour</p>
              </div>

              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Conversion</span>
                </div>
                <p className="text-2xl font-bold text-primary">{analytics.realTimeMetrics.conversionRate}%</p>
                <p className="text-xs text-muted-foreground">+2.3% improvement</p>
              </div>

              <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-accent-foreground" />
                  <span className="text-sm font-medium">Avg Order</span>
                </div>
                <p className="text-2xl font-bold text-accent-foreground">₹{analytics.realTimeMetrics.avgOrderValue}</p>
                <p className="text-xs text-muted-foreground">+8% from last week</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="behavior" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <h4 className="font-semibold">Customer Behavior Metrics</h4>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Session Duration</span>
                      <span className="font-semibold">{analytics.customerBehavior.sessionDuration} min</span>
                    </div>
                    <Progress value={analytics.customerBehavior.sessionDuration * 20} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Conversion Rate</span>
                      <span className="font-semibold">{analytics.customerBehavior.conversionRate}%</span>
                    </div>
                    <Progress value={analytics.customerBehavior.conversionRate} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Bounce Rate</span>
                      <span className="font-semibold">{analytics.customerBehavior.bounceRate}%</span>
                    </div>
                    <Progress value={analytics.customerBehavior.bounceRate} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Cart Abandonment</span>
                      <span className="font-semibold">{analytics.customerBehavior.cartAbandonmentRate}%</span>
                    </div>
                    <Progress value={analytics.customerBehavior.cartAbandonmentRate} className="h-2" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Top Viewed Products</h4>
                <div className="space-y-2">
                  {analytics.productPerformance.topViewed.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <span className="text-sm">{product.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{product.views}</span>
                        {product.trend === 'up' ? (
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Top Selling Products</h4>
                <div className="space-y-2">
                  {analytics.productPerformance.topSelling.map((product, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-primary/5 rounded border border-primary/20">
                      <div>
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.sales} units sold</p>
                      </div>
                      <p className="font-semibold text-primary">₹{product.revenue.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Inventory Alerts</h4>
                <div className="space-y-2">
                  {analytics.productPerformance.lowStock.map((product, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-destructive/5 rounded border border-destructive/20">
                      <div>
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-muted-foreground">Only {product.stock} left</p>
                      </div>
                      <Badge variant="destructive" className="text-xs">
                        {product.demandScore}% demand
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <div className="space-y-4">
              <h4 className="font-semibold">AI-Powered Business Insights</h4>
              {analytics.aiInsights.map((insight, index) => (
                <div key={index} className="p-4 rounded-lg border" style={{
                  backgroundColor: insight.type === 'opportunity' ? 'hsl(var(--primary) / 0.05)' :
                                  insight.type === 'warning' ? 'hsl(var(--destructive) / 0.05)' :
                                  'hsl(var(--accent) / 0.05)',
                  borderColor: insight.type === 'opportunity' ? 'hsl(var(--primary) / 0.2)' :
                              insight.type === 'warning' ? 'hsl(var(--destructive) / 0.2)' :
                              'hsl(var(--accent) / 0.2)'
                }}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {insight.type === 'opportunity' && <TrendingUp className="w-4 h-4 text-primary" />}
                      {insight.type === 'warning' && <Zap className="w-4 h-4 text-destructive" />}
                      {insight.type === 'trend' && <Brain className="w-4 h-4 text-accent-foreground" />}
                      <h5 className="font-semibold text-sm">{insight.title}</h5>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {Math.round(insight.confidence * 100)}% confidence
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            Last updated: {new Date().toLocaleTimeString()}
          </div>
          <Button variant="outline" size="sm">
            Export Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};