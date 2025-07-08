import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';
import { AIAssistant } from '@/components/AIAssistant';
import { GamificationHub } from '@/components/GamificationHub';
import { ProductCard } from '@/components/ProductCard';
import { VirtualTryOn } from '@/components/VirtualTryOn';
import { VoiceSearch } from '@/components/VoiceSearch';
import { PersonalizedRecommendations } from '@/components/PersonalizedRecommendations';
import { DynamicPricing } from '@/components/DynamicPricing';
import { PredictiveAnalytics } from '@/components/PredictiveAnalytics';
import { ConversationalCommerce } from '@/components/ConversationalCommerce';
import { AdvancedAnalytics } from '@/components/AdvancedAnalytics';
import { InteractiveShoppingJourney } from '@/components/InteractiveShoppingJourney';
import { ArrowDown, Sparkles, Eye, Mic, Star, Brain, Zap, BarChart3 } from 'lucide-react';
import heroImage from '@/assets/hero-walmart-future.jpg';

const Index = () => {
  const [walletCoins, setWalletCoins] = useState(150);
  const [expertCredits, setExpertCredits] = useState(3);
  const [cartItems, setCartItems] = useState(0);
  const [showVoiceSearch, setShowVoiceSearch] = useState(false);
  const [showTryOn, setShowTryOn] = useState(false);
  const [showGamification, setShowGamification] = useState(false);

  // Mock products data
  const products = [
    {
      id: '1',
      name: 'Cotton Casual T-Shirt',
      price: 899,
      originalPrice: 1299,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop',
      rating: 4.3,
      reviews: 128,
      hasVirtualTryOn: true,
      expertAdviceAvailable: true,
    },
    {
      id: '2',
      name: 'Wireless Bluetooth Headphones',
      price: 2499,
      originalPrice: 3999,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
      rating: 4.5,
      reviews: 89,
      hasVirtualTryOn: false,
      expertAdviceAvailable: true,
    },
    {
      id: '3',
      name: 'Stylish Sunglasses',
      price: 1599,
      originalPrice: 2299,
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=300&fit=crop',
      rating: 4.2,
      reviews: 67,
      hasVirtualTryOn: true,
      expertAdviceAvailable: true,
    },
    {
      id: '4',
      name: 'Smart Fitness Watch',
      price: 4999,
      originalPrice: 7999,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
      rating: 4.6,
      reviews: 234,
      hasVirtualTryOn: false,
      expertAdviceAvailable: true,
    }
  ];

  const tryOnProducts = products.filter(p => p.hasVirtualTryOn).map(p => ({
    id: p.id,
    name: p.name,
    price: p.price,
    image: p.image,
    category: p.name.includes('T-Shirt') ? 'clothing' as const : 
              p.name.includes('Sunglasses') ? 'glasses' as const : 'jewelry' as const
  }));

  const handleCoinsEarned = (coins: number) => {
    setWalletCoins(prev => prev + coins);
  };

  const handleCreditsEarned = (credits: number) => {
    setExpertCredits(prev => prev + credits);
  };

  const handleAddToCart = (productId: string) => {
    setCartItems(prev => prev + 1);
  };

  const handleVirtualTryOn = (productId: string) => {
    setShowTryOn(true);
  };

  const handleExpertAdvice = (productId: string) => {
    if (expertCredits > 0) {
      setExpertCredits(prev => prev - 1);
    }
  };

  const handleVoiceSearchResult = (query: string) => {
    console.log('Voice search query:', query);
    // Here you would typically filter products or navigate to search results
  };

  const handlePurchaseComplete = (productId: string, amount: number) => {
    setCartItems(prev => prev + 1);
    setWalletCoins(prev => prev - amount);
  };

  const handleJourneyStepComplete = (stepId: string, reward?: any) => {
    if (reward?.type === 'coins') {
      setWalletCoins(prev => prev + reward.value);
    }
  };

  if (showTryOn) {
    return (
      <div className="min-h-screen bg-background">
        <Header 
          walletCoins={walletCoins}
          cartItems={cartItems}
          onVoiceSearch={() => setShowVoiceSearch(true)}
        />
        <div className="py-8">
          <Button 
            onClick={() => setShowTryOn(false)}
            variant="outline"
            className="mb-4 ml-6"
          >
            ← Back to Store
          </Button>
          <VirtualTryOn 
            products={tryOnProducts}
            onAddToCart={handleAddToCart}
          />
        </div>
      </div>
    );
  }

  if (showGamification) {
    return (
      <div className="min-h-screen bg-background">
        <Header 
          walletCoins={walletCoins}
          cartItems={cartItems}
          onVoiceSearch={() => setShowVoiceSearch(true)}
        />
        <div className="container mx-auto px-4 py-8">
          <Button 
            onClick={() => setShowGamification(false)}
            variant="outline"
            className="mb-6"
          >
            ← Back to Store
          </Button>
          <GamificationHub
            walletCoins={walletCoins}
            expertCredits={expertCredits}
            onCoinsEarned={handleCoinsEarned}
            onCreditsEarned={handleCreditsEarned}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        walletCoins={walletCoins}
        cartItems={cartItems}
        onVoiceSearch={() => setShowVoiceSearch(true)}
      />

      {/* Hero Section - AR/VR World */}
      <section className="relative h-[100vh] flex items-center justify-center overflow-hidden cyber-grid">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-vr" />
        
        {/* Particle System */}
        <div className="particle-system">
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>
        
        <div className="relative z-10 text-center space-y-8 px-4">
          <Badge className="bg-gradient-ar text-white mb-6 px-6 py-3 text-lg neon-border hologram">
            <Sparkles className="w-5 h-5 mr-3" />
            Welcome to the Future Metaverse
          </Badge>
          
          <h1 className="text-6xl md:text-8xl font-bold text-white leading-tight vr-float">
            <span className="block bg-gradient-to-r from-cyan-400 via-purple-500 to-yellow-400 bg-clip-text text-transparent">
              Walmart
            </span>
            <span className="block text-white ar-glow">Future Verse</span>
            <span className="block bg-gradient-to-r from-pink-400 via-blue-500 to-green-400 bg-clip-text text-transparent">
              Shopping Experience
            </span>
          </h1>
          
          <p className="text-2xl text-white/90 max-w-3xl mx-auto hologram">
            Step into the metaverse where AI assistants, virtual reality, and augmented reality 
            transform shopping into an immersive digital adventure.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
            <Button 
              size="lg" 
              className="bg-gradient-ar text-white hover:scale-110 transition-ar text-xl px-10 py-6 ar-glow neon-border"
              onClick={() => setShowTryOn(true)}
            >
              <Eye className="w-6 h-6 mr-3" />
              Enter VR Shopping
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black text-xl px-10 py-6 hologram hover-scale"
              onClick={() => setShowVoiceSearch(true)}
            >
              <Mic className="w-6 h-6 mr-3" />
              Voice Command
            </Button>
          </div>

          {/* Floating AR elements */}
          <div className="pt-12 space-y-6">
            <div className="flex justify-center space-x-8">
              <div className="w-16 h-16 bg-gradient-ar rounded-full flex items-center justify-center vr-float ar-glow">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div className="w-16 h-16 bg-gradient-ar rounded-full flex items-center justify-center vr-float ar-glow" style={{ animationDelay: '1s' }}>
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div className="w-16 h-16 bg-gradient-ar rounded-full flex items-center justify-center vr-float ar-glow" style={{ animationDelay: '2s' }}>
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
            </div>
            <ArrowDown className="w-8 h-8 text-cyan-400 mx-auto animate-bounce ar-glow" />
          </div>
        </div>
      </section>

      {/* Features Overview - AR/VR Style */}
      <section className="py-24 bg-black/50 backdrop-blur-sm matrix-rain">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-400 bg-clip-text text-transparent">
              Metaverse Shopping Dimensions
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto hologram">
              Experience shopping in multiple reality layers where technology and imagination 
              converge to create the ultimate retail metaverse.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <Card className="bg-gradient-glass border-cyan-400/30 shadow-glow hover-scale transition-ar cursor-pointer hologram" onClick={() => setShowTryOn(true)}>
              <CardContent className="p-8 text-center space-y-6">
                <div className="w-20 h-20 bg-gradient-ar rounded-full flex items-center justify-center mx-auto vr-float ar-glow">
                  <Eye className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">AR Try-On Portal</h3>
                <p className="text-white/70 text-lg">
                  Step through the augmented reality gateway to see products on your virtual self
                </p>
                <Badge className="bg-cyan-400/20 text-cyan-400 text-lg px-4 py-2 neon-border">Quantum-Powered</Badge>
              </CardContent>
            </Card>

            <Card className="bg-gradient-glass border-purple-400/30 shadow-glow hover-scale transition-ar cursor-pointer hologram" onClick={() => setShowGamification(true)}>
              <CardContent className="p-8 text-center space-y-6">
                <div className="w-20 h-20 bg-gradient-vr rounded-full flex items-center justify-center mx-auto vr-float ar-glow" style={{ animationDelay: '1s' }}>
                  <Star className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Crypto Rewards</h3>
                <p className="text-white/70 text-lg">
                  Mine digital coins through VR challenges and unlock exclusive metaverse deals
                </p>
                <Badge className="bg-purple-400/20 text-purple-400 text-lg px-4 py-2 neon-border">Blockchain-Enabled</Badge>
              </CardContent>
            </Card>

            <Card className="bg-gradient-glass border-pink-400/30 shadow-glow hover-scale transition-ar cursor-pointer hologram" onClick={() => setShowVoiceSearch(true)}>
              <CardContent className="p-8 text-center space-y-6">
                <div className="w-20 h-20 bg-gradient-ar rounded-full flex items-center justify-center mx-auto vr-float ar-glow" style={{ animationDelay: '2s' }}>
                  <Mic className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Neural Voice</h3>
                <p className="text-white/70 text-lg">
                  Command the metaverse with your thoughts translated into voice commands
                </p>
                <Badge className="bg-pink-400/20 text-pink-400 text-lg px-4 py-2 neon-border">Mind-Linked</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Technologies Section - Neural Network Style */}
      <section className="py-24 bg-gradient-to-b from-black/50 to-purple-900/30 cyber-grid">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              Neural Core Technologies
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto hologram">
              Quantum algorithms and neural networks power the metaverse shopping intelligence
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            <Card className="bg-gradient-glass border-green-400/30 shadow-glow hover-scale transition-ar hologram">
              <CardContent className="p-8 text-center space-y-6">
                <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto vr-float ar-glow">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Quantum AI Brain</h3>
                <p className="text-white/70 text-lg">
                  Neuromorphic computing predicts your desires before you know them
                </p>
                <Badge className="bg-green-400/20 text-green-400 text-lg px-4 py-2 neon-border">Quantum-Enhanced</Badge>
              </CardContent>
            </Card>

            <Card className="bg-gradient-glass border-yellow-400/30 shadow-glow hover-scale transition-ar hologram">
              <CardContent className="p-8 text-center space-y-6">
                <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto vr-float ar-glow" style={{ animationDelay: '1s' }}>
                  <Zap className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Reality Pricing</h3>
                <p className="text-white/70 text-lg">
                  Prices shift across dimensions based on multiverse market forces
                </p>
                <Badge className="bg-yellow-400/20 text-yellow-400 text-lg px-4 py-2 neon-border">Dimension-Synced</Badge>
              </CardContent>
            </Card>

            <Card className="bg-gradient-glass border-blue-400/30 shadow-glow hover-scale transition-ar hologram">
              <CardContent className="p-8 text-center space-y-6">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto vr-float ar-glow" style={{ animationDelay: '2s' }}>
                  <BarChart3 className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Time Analytics</h3>
                <p className="text-white/70 text-lg">
                  Predict future trends by analyzing data from parallel timelines
                </p>
                <Badge className="bg-blue-400/20 text-blue-400 text-lg px-4 py-2 neon-border">Temporal-Powered</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Technology Features */}
      <section className="py-16">
        <div className="container mx-auto px-4 space-y-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <PersonalizedRecommendations 
              userPreferences={{
                categories: ['Electronics', 'Clothing'],
                priceRange: [500, 5000],
                style: 'casual'
              }}
              onProductSelect={(productId) => console.log('Selected:', productId)}
            />
            
            <DynamicPricing 
              userCoins={walletCoins}
              products={products}
              onPriceUpdate={(productId, newPrice) => console.log('Price updated:', productId, newPrice)}
            />
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <AdvancedAnalytics />
            
            <InteractiveShoppingJourney
              userProfile={{
                interests: ['fitness', 'technology'],
                purchaseHistory: ['headphones', 'shoes'],
                currentGoal: 'Complete home gym setup'
              }}
              onStepComplete={handleJourneyStepComplete}
              onProductSelect={(productId) => console.log('Selected:', productId)}
            />
          </div>
          
          <PredictiveAnalytics />
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Recommended for You</h2>
              <p className="text-muted-foreground">AI-curated products based on your preferences</p>
            </div>
            <Button 
              variant="outline"
              onClick={() => setShowGamification(true)}
            >
              <Star className="w-4 h-4 mr-2" />
              Earn More Coins
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                userCoins={walletCoins}
                expertCredits={expertCredits}
                onAddToCart={handleAddToCart}
                onVirtualTryOn={handleVirtualTryOn}
                onExpertAdvice={handleExpertAdvice}
              />
            ))}
          </div>
        </div>
      </section>

      {/* AI Assistant */}
      <AIAssistant expertCredits={expertCredits} />
      
      {/* Conversational Commerce */}
      <ConversationalCommerce 
        onPurchaseComplete={handlePurchaseComplete}
        walletCoins={walletCoins}
      />

      {/* Voice Search Modal */}
      <VoiceSearch
        isActive={showVoiceSearch}
        onClose={() => setShowVoiceSearch(false)}
        onSearchResult={handleVoiceSearchResult}
      />
    </div>
  );
};

export default Index;