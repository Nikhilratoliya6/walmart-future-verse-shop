import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Star, Gift, Users, Target } from 'lucide-react';

interface GamificationHubProps {
  walletCoins: number;
  expertCredits: number;
  onCoinsEarned: (coins: number) => void;
  onCreditsEarned: (credits: number) => void;
}

export const GamificationHub = ({ 
  walletCoins, 
  expertCredits, 
  onCoinsEarned, 
  onCreditsEarned 
}: GamificationHubProps) => {
  const [spinUsed, setSpinUsed] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [scratchUsed, setScratchUsed] = useState(false);

  const handleSpinWheel = () => {
    if (spinUsed) return;
    
    setSpinUsed(true);
    const coins = Math.floor(Math.random() * 50) + 10;
    onCoinsEarned(coins);
  };

  const handleQuiz = () => {
    if (quizCompleted) return;
    
    setQuizCompleted(true);
    const credits = Math.floor(Math.random() * 3) + 1;
    onCreditsEarned(credits);
  };

  const handleScratchCard = () => {
    if (scratchUsed) return;
    
    setScratchUsed(true);
    const coins = Math.floor(Math.random() * 100) + 25;
    onCoinsEarned(coins);
  };

  return (
    <div className="space-y-6">
      {/* Wallet Overview */}
      <Card className="bg-gradient-accent shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-accent-foreground">
            <Star className="h-5 w-5" />
            <span>Your Walmart Wallet</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent-foreground">{walletCoins}</div>
              <div className="text-sm text-accent-foreground/80">Walmart Coins</div>
              <div className="text-xs text-accent-foreground/60">= ₹{(walletCoins * 0.25).toFixed(0)} savings</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent-foreground">{expertCredits}</div>
              <div className="text-sm text-accent-foreground/80">Expert Credits</div>
              <div className="text-xs text-accent-foreground/60">For product advice</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Challenges */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-primary" />
            <span>Daily Challenges</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Spin the Wheel */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <h4 className="font-semibold">🎡 Spin the Wheel</h4>
              <p className="text-sm text-muted-foreground">Win 10-60 Walmart Coins</p>
            </div>
            <Button 
              onClick={handleSpinWheel}
              disabled={spinUsed}
              variant={spinUsed ? "outline" : "default"}
              className="transition-smooth"
            >
              {spinUsed ? "Completed ✓" : "Spin Now"}
            </Button>
          </div>

          {/* Daily Quiz */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <h4 className="font-semibold">🎯 Daily Quiz</h4>
              <p className="text-sm text-muted-foreground">Earn 1-3 Expert Credits</p>
            </div>
            <Button 
              onClick={handleQuiz}
              disabled={quizCompleted}
              variant={quizCompleted ? "outline" : "default"}
              className="transition-smooth"
            >
              {quizCompleted ? "Completed ✓" : "Take Quiz"}
            </Button>
          </div>

          {/* Scratch Card */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <h4 className="font-semibold">🧩 Scratch Card</h4>
              <p className="text-sm text-muted-foreground">Mystery reward 25-125 coins</p>
            </div>
            <Button 
              onClick={handleScratchCard}
              disabled={scratchUsed}
              variant={scratchUsed ? "outline" : "default"}
              className="transition-smooth"
            >
              {scratchUsed ? "Completed ✓" : "Scratch"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Referral Program */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-primary" />
            <span>Referral Missions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Invite friends to earn</span>
              <Badge variant="secondary">200 coins per friend</Badge>
            </div>
            <Progress value={33} className="h-2" />
            <p className="text-xs text-muted-foreground">1/3 friends invited this month</p>
            <Button variant="outline" className="w-full">
              <Gift className="h-4 w-4 mr-2" />
              Share Invite Link
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};