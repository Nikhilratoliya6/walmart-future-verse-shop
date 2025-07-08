import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, TrendingUp, Target, Sparkles, Star } from 'lucide-react';

interface RecommendationItem {
  id: string;
  name: string;
  price: number;
  image: string;
  confidence: number;
  reason: string;
  category: string;
}

interface PersonalizedRecommendationsProps {
  userPreferences?: {
    categories: string[];
    priceRange: [number, number];
    style: string;
  };
  onProductSelect: (productId: string) => void;
}

export const PersonalizedRecommendations = ({ 
  userPreferences,
  onProductSelect 
}: PersonalizedRecommendationsProps) => {
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  // Mock AI recommendation engine
  const generateRecommendations = () => {
    const mockRecommendations: RecommendationItem[] = [
      {
        id: 'rec-1',
        name: 'Smart Wireless Earbuds',
        price: 1999,
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&h=200&fit=crop',
        confidence: 0.94,
        reason: 'Based on your tech purchases and music listening habits',
        category: 'Electronics'
      },
      {
        id: 'rec-2',
        name: 'Ergonomic Office Chair',
        price: 8999,
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop',
        confidence: 0.89,
        reason: 'Matches your work-from-home setup preferences',
        category: 'Furniture'
      },
      {
        id: 'rec-3',
        name: 'Organic Green Tea',
        price: 299,
        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=200&h=200&fit=crop',
        confidence: 0.87,
        reason: 'Similar to your health-conscious food choices',
        category: 'Food & Beverages'
      },
      {
        id: 'rec-4',
        name: 'Fitness Tracker Band',
        price: 2499,
        image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=200&h=200&fit=crop',
        confidence: 0.82,
        reason: 'Complements your active lifestyle pattern',
        category: 'Fitness'
      }
    ];
    
    return mockRecommendations.sort((a, b) => b.confidence - a.confidence);
  };

  useEffect(() => {
    setIsAnalyzing(true);
    
    // Simulate AI processing time
    const timer = setTimeout(() => {
      setRecommendations(generateRecommendations());
      setIsAnalyzing(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [userPreferences]);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'bg-success text-success-foreground';
    if (confidence >= 0.8) return 'bg-accent text-accent-foreground';
    return 'bg-muted text-muted-foreground';
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          AI-Powered Personalized Recommendations
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Machine learning curated just for you
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {isAnalyzing ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">
              Analyzing your preferences and purchase history...
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {recommendations.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-smooth">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-md"
                />
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium text-sm">{item.name}</h4>
                    <Badge className={`text-xs ${getConfidenceColor(item.confidence)}`}>
                      {Math.round(item.confidence * 100)}% match
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-muted-foreground">{item.reason}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-primary">₹{item.price}</span>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onProductSelect(item.id)}
                      className="text-xs"
                    >
                      View Product
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">AI Insights</span>
              </div>
              <p className="text-xs text-muted-foreground">
                These recommendations are generated using collaborative filtering, 
                purchase history analysis, and behavioral pattern recognition.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};