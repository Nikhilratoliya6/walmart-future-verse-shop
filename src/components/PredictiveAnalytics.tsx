import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, TrendingUp, Package, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface DemandForecast {
  product: string;
  currentDemand: number;
  predictedDemand: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  confidence: number;
}

interface InventoryInsight {
  category: string;
  currentStock: number;
  reorderPoint: number;
  predictedStockout: number; // days
  status: 'healthy' | 'warning' | 'critical';
}

export const PredictiveAnalytics = () => {
  const [demandForecasts, setDemandForecasts] = useState<DemandForecast[]>([]);
  const [inventoryInsights, setInventoryInsights] = useState<InventoryInsight[]>([]);
  const [weeklyTrends, setWeeklyTrends] = useState<any[]>([]);
  const [categoryDistribution, setCategoryDistribution] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      // Mock demand forecasts
      setDemandForecasts([
        {
          product: 'Cotton T-Shirts',
          currentDemand: 78,
          predictedDemand: 92,
          trend: 'increasing',
          confidence: 0.87
        },
        {
          product: 'Wireless Headphones',
          currentDemand: 65,
          predictedDemand: 58,
          trend: 'decreasing',
          confidence: 0.91
        },
        {
          product: 'Sunglasses',
          currentDemand: 45,
          predictedDemand: 71,
          trend: 'increasing',
          confidence: 0.83
        },
        {
          product: 'Fitness Watches',
          currentDemand: 82,
          predictedDemand: 79,
          trend: 'stable',
          confidence: 0.89
        }
      ]);

      // Mock inventory insights
      setInventoryInsights([
        {
          category: 'Electronics',
          currentStock: 85,
          reorderPoint: 30,
          predictedStockout: 12,
          status: 'healthy'
        },
        {
          category: 'Clothing',
          currentStock: 25,
          reorderPoint: 30,
          predictedStockout: 3,
          status: 'warning'
        },
        {
          category: 'Accessories',
          currentStock: 15,
          reorderPoint: 30,
          predictedStockout: 1,
          status: 'critical'
        },
        {
          category: 'Fitness',
          currentStock: 60,
          reorderPoint: 30,
          predictedStockout: 8,
          status: 'healthy'
        }
      ]);

      // Mock weekly trends
      setWeeklyTrends([
        { day: 'Mon', demand: 65, sales: 42 },
        { day: 'Tue', demand: 72, sales: 48 },
        { day: 'Wed', demand: 68, sales: 45 },
        { day: 'Thu', demand: 78, sales: 52 },
        { day: 'Fri', demand: 85, sales: 58 },
        { day: 'Sat', demand: 92, sales: 65 },
        { day: 'Sun', demand: 88, sales: 61 }
      ]);

      // Mock category distribution
      setCategoryDistribution([
        { name: 'Electronics', value: 35, color: 'hsl(var(--primary))' },
        { name: 'Clothing', value: 28, color: 'hsl(var(--accent))' },
        { name: 'Accessories', value: 20, color: 'hsl(var(--secondary))' },
        { name: 'Fitness', value: 17, color: 'hsl(var(--muted))' }
      ]);

      setIsLoading(false);
    }, 1500);
  }, []);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="w-4 h-4 text-success" />;
      case 'decreasing': return <TrendingUp className="w-4 h-4 text-destructive rotate-180" />;
      default: return <div className="w-4 h-4 rounded-full bg-muted" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-success text-success-foreground';
      case 'warning': return 'bg-warning text-warning-foreground';
      case 'critical': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-3 h-3" />;
      case 'warning': return <Clock className="w-3 h-3" />;
      case 'critical': return <AlertTriangle className="w-3 h-3" />;
      default: return <Package className="w-3 h-3" />;
    }
  };

  if (isLoading) {
    return (
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-secondary" />
            Predictive Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">
              Processing demand patterns and inventory data...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-secondary" />
            Predictive Analytics Dashboard
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            ML-powered demand forecasting and inventory optimization
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Demand Forecasts */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Demand Forecasting</h3>
            <div className="grid gap-3">
              {demandForecasts.map((forecast, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getTrendIcon(forecast.trend)}
                    <div>
                      <h4 className="font-medium text-sm">{forecast.product}</h4>
                      <p className="text-xs text-muted-foreground">
                        {forecast.currentDemand}% → {forecast.predictedDemand}% demand
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <Badge className="bg-secondary/10 text-secondary text-xs">
                      {Math.round(forecast.confidence * 100)}% confidence
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {forecast.trend === 'increasing' ? '+' : forecast.trend === 'decreasing' ? '' : '±'}
                      {Math.abs(forecast.predictedDemand - forecast.currentDemand)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Trends Chart */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Weekly Demand vs Sales</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyTrends}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Line 
                    type="monotone" 
                    dataKey="demand" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    name="Demand"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="hsl(var(--accent))" 
                    strokeWidth={2}
                    name="Sales"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Inventory Insights */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Inventory Management</h3>
            <div className="grid gap-3">
              {inventoryInsights.map((insight, index) => (
                <div key={index} className="p-3 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">{insight.category}</h4>
                    <Badge className={`text-xs ${getStatusColor(insight.status)}`}>
                      {getStatusIcon(insight.status)}
                      <span className="ml-1 capitalize">{insight.status}</span>
                    </Badge>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Stock Level</span>
                      <span>{insight.currentStock}%</span>
                    </div>
                    <Progress value={insight.currentStock} className="h-1" />
                  </div>
                  
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Reorder Point: {insight.reorderPoint}%</span>
                    <span>Stockout in {insight.predictedStockout} days</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Distribution */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Category Performance</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      dataKey="value"
                    >
                      {categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Legend</h3>
              <div className="space-y-2">
                {categoryDistribution.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm">{item.name}</span>
                    <span className="text-sm text-muted-foreground">({item.value}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-secondary/5 rounded-lg border border-secondary/20">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-secondary" />
              <span className="text-sm font-medium text-secondary">Analytics Engine</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Powered by time-series analysis, seasonal decomposition, and ensemble ML models 
              for accurate demand prediction and automated inventory optimization.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};