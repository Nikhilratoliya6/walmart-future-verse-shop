import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  MapPin, 
  ArrowRight, 
  CheckCircle, 
  Target, 
  Sparkles,
  Gift,
  TrendingUp,
  Heart,
  Star,
  ShoppingBag
} from 'lucide-react';

interface JourneyStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
  reward?: {
    type: 'coins' | 'discount' | 'item';
    value: number | string;
  };
  products?: Array<{
    id: string;
    name: string;
    price: number;
    image: string;
    reason: string;
  }>;
}

interface InteractiveShoppingJourneyProps {
  userProfile: {
    interests: string[];
    purchaseHistory: string[];
    currentGoal?: string;
  };
  onStepComplete: (stepId: string, reward?: any) => void;
  onProductSelect: (productId: string) => void;
}

export const InteractiveShoppingJourney = ({ 
  userProfile, 
  onStepComplete,
  onProductSelect 
}: InteractiveShoppingJourneyProps) => {
  const [currentJourney, setCurrentJourney] = useState<JourneyStep[]>([]);
  const [journeyProgress, setJourneyProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Generate personalized shopping journey based on user profile
    const generateJourney = () => {
      const journeys = {
        fitness: [
          {
            id: 'discover',
            title: 'Discover Your Fitness Style',
            description: 'Explore workout gear that matches your fitness goals',
            status: 'completed' as const,
            reward: { type: 'coins' as const, value: 50 },
            products: [
              {
                id: 'yoga-mat',
                name: 'Premium Yoga Mat',
                price: 1499,
                image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=150&h=150&fit=crop',
                reason: 'Perfect for your yoga sessions'
              }
            ]
          },
          {
            id: 'essentials',
            title: 'Build Your Workout Essentials',
            description: 'Complete your home gym with must-have equipment',
            status: 'current' as const,
            products: [
              {
                id: 'dumbbells',
                name: 'Adjustable Dumbbells',
                price: 3999,
                image: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=150&h=150&fit=crop',
                reason: 'Based on your strength training interest'
              },
              {
                id: 'resistance-bands',
                name: 'Resistance Bands Set',
                price: 899,
                image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=150&h=150&fit=crop',
                reason: 'Versatile for full-body workouts'
              }
            ]
          },
          {
            id: 'optimize',
            title: 'Optimize Your Performance',
            description: 'Track progress and boost recovery',
            status: 'upcoming' as const,
            reward: { type: 'discount' as const, value: '20%' }
          },
          {
            id: 'lifestyle',
            title: 'Complete Your Fitness Lifestyle',
            description: 'Nutrition and recovery essentials',
            status: 'upcoming' as const,
            reward: { type: 'item' as const, value: 'Protein Shaker' }
          }
        ],
        tech: [
          {
            id: 'workspace',
            title: 'Create Your Tech Workspace',
            description: 'Build the perfect setup for productivity',
            status: 'completed' as const,
            reward: { type: 'coins' as const, value: 75 }
          },
          {
            id: 'enhance',
            title: 'Enhance Your Setup',
            description: 'Add accessories for better experience',
            status: 'current' as const,
            products: [
              {
                id: 'mechanical-keyboard',
                name: 'Mechanical Gaming Keyboard',
                price: 4999,
                image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=150&h=150&fit=crop',
                reason: 'Upgrade from your basic keyboard'
              }
            ]
          },
          {
            id: 'mobile',
            title: 'Mobile Tech Integration',
            description: 'Connect your mobile ecosystem',
            status: 'upcoming' as const
          }
        ]
      };

      // Select journey based on user interests
      const selectedJourney = userProfile.interests.includes('fitness') ? journeys.fitness : journeys.tech;
      setCurrentJourney(selectedJourney);
      
      // Calculate progress
      const completedSteps = selectedJourney.filter(step => step.status === 'completed').length;
      setJourneyProgress((completedSteps / selectedJourney.length) * 100);
      
      setIsLoading(false);
    };

    generateJourney();
  }, [userProfile]);

  const handleStepAction = (step: JourneyStep) => {
    if (step.status === 'current') {
      // Mark step as completed
      const updatedJourney = currentJourney.map(s => 
        s.id === step.id ? { ...s, status: 'completed' as const } : s
      );
      
      // Move to next step
      const currentIndex = currentJourney.findIndex(s => s.id === step.id);
      if (currentIndex < currentJourney.length - 1) {
        updatedJourney[currentIndex + 1].status = 'current';
      }
      
      setCurrentJourney(updatedJourney);
      
      // Update progress
      const completedSteps = updatedJourney.filter(s => s.status === 'completed').length;
      setJourneyProgress((completedSteps / updatedJourney.length) * 100);
      
      onStepComplete(step.id, step.reward);
    }
  };

  if (isLoading) {
    return (
      <Card className="shadow-card">
        <CardContent className="text-center py-8">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Creating your personalized journey...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          Your Interactive Shopping Journey
        </CardTitle>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Personalized path to complete your {userProfile.interests[0] || 'lifestyle'} setup
          </p>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Progress</span>
              <span>{Math.round(journeyProgress)}% Complete</span>
            </div>
            <Progress value={journeyProgress} className="h-2" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {currentJourney.map((step, index) => (
          <div key={step.id} className="relative">
            {/* Connection Line */}
            {index < currentJourney.length - 1 && (
              <div className="absolute left-6 top-12 w-0.5 h-16 bg-border" />
            )}
            
            <div className={`flex gap-4 p-4 rounded-lg border transition-all ${
              step.status === 'current' 
                ? 'bg-primary/5 border-primary/20 shadow-sm' 
                : step.status === 'completed'
                ? 'bg-muted/30 border-muted'
                : 'bg-background border-border'
            }`}>
              {/* Step Icon */}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                step.status === 'completed' 
                  ? 'bg-primary text-primary-foreground'
                  : step.status === 'current'
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}>
                {step.status === 'completed' ? (
                  <CheckCircle className="w-6 h-6" />
                ) : step.status === 'current' ? (
                  <Target className="w-6 h-6" />
                ) : (
                  <span className="text-sm font-semibold">{index + 1}</span>
                )}
              </div>

              <div className="flex-1 space-y-3">
                <div>
                  <h4 className="font-semibold flex items-center gap-2">
                    {step.title}
                    {step.status === 'current' && (
                      <Badge className="bg-accent text-accent-foreground">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    )}
                  </h4>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>

                {/* Reward */}
                {step.reward && (
                  <div className="flex items-center gap-2">
                    <Gift className="w-4 h-4 text-accent-foreground" />
                    <span className="text-sm font-medium">
                      Reward: {step.reward.type === 'coins' ? `${step.reward.value} coins` :
                               step.reward.type === 'discount' ? `${step.reward.value} off` :
                               step.reward.value}
                    </span>
                  </div>
                )}

                {/* Products */}
                {step.products && step.products.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">Recommended for this step:</h5>
                    <div className="grid gap-3">
                      {step.products.map((product) => (
                        <div key={product.id} className="flex items-center gap-3 p-3 bg-background rounded border">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{product.name}</p>
                            <p className="text-xs text-muted-foreground">{product.reason}</p>
                            <p className="text-primary font-semibold text-sm">₹{product.price}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => onProductSelect(product.id)}
                            >
                              <Heart className="w-3 h-3 mr-1" />
                              Save
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => onProductSelect(product.id)}
                            >
                              <ShoppingBag className="w-3 h-3 mr-1" />
                              Add
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Button */}
                {step.status === 'current' && (
                  <Button 
                    onClick={() => handleStepAction(step)}
                    className="w-full"
                  >
                    Complete Step
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Journey Completion */}
        {journeyProgress === 100 && (
          <div className="text-center p-6 bg-gradient-primary rounded-lg text-white">
            <Star className="w-8 h-8 mx-auto mb-2" />
            <h3 className="font-semibold mb-2">Journey Complete! 🎉</h3>
            <p className="text-sm opacity-90">
              You've successfully completed your shopping journey. 
              Ready to start a new adventure?
            </p>
            <Button variant="secondary" className="mt-4">
              Start New Journey
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};