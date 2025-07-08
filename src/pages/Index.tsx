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

      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/90" />
        
        <div className="relative z-10 text-center space-y-6 px-4">
          <Badge className="bg-accent text-accent-foreground mb-4">
            <Sparkles className="w-4 h-4 mr-2" />
            The Future of Shopping is Here
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
            Shop Smarter with
            <span className="block text-accent">AI & AR Technology</span>
          </h1>
          
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Experience revolutionary shopping with AI assistants, virtual try-ons, 
            voice commands, and gamified rewards that save you money.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
            <Button 
              size="lg" 
              className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8"
              onClick={() => setShowTryOn(true)}
            >
              <Eye className="w-5 h-5 mr-2" />
              Try Virtual Shopping
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-primary text-lg px-8"
              onClick={() => setShowVoiceSearch(true)}
            >
              <Mic className="w-5 h-5 mr-2" />
              Voice Search
            </Button>
          </div>

          <div className="pt-8">
            <ArrowDown className="w-6 h-6 text-white/70 mx-auto animate-bounce" />
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Revolutionary Shopping Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Walmart's next-generation store combines cutting-edge technology 
              with everyday convenience to transform your shopping experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="shadow-card hover-scale transition-smooth cursor-pointer" onClick={() => setShowTryOn(true)}>
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold">Virtual Try-On</h3>
                <p className="text-muted-foreground">
                  See how clothes, glasses, and accessories look on you before buying
                </p>
                <Badge className="bg-primary/10 text-primary">AI-Powered</Badge>
              </CardContent>
            </Card>

            <Card className="shadow-card hover-scale transition-smooth cursor-pointer" onClick={() => setShowGamification(true)}>
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-gradient-accent rounded-full flex items-center justify-center mx-auto">
                  <Star className="w-6 h-6 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-semibold">Earn & Save</h3>
                <p className="text-muted-foreground">
                  Play games, complete challenges, and earn coins for instant discounts
                </p>
                <Badge className="bg-accent/10 text-accent-foreground">Gamified</Badge>
              </CardContent>
            </Card>

            <Card className="shadow-card hover-scale transition-smooth cursor-pointer" onClick={() => setShowVoiceSearch(true)}>
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                  <Mic className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold">Voice Shopping</h3>
                <p className="text-muted-foreground">
                  Search, ask questions, and shop hands-free with voice commands
                </p>
                <Badge className="bg-primary/10 text-primary">Voice-First</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Technologies Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Core Technologies</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Powered by advanced machine learning algorithms and predictive analytics
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="shadow-card hover-scale transition-smooth">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold">AI Recommendations</h3>
                <p className="text-muted-foreground">
                  Personalized product suggestions using machine learning
                </p>
                <Badge className="bg-primary/10 text-primary">ML-Powered</Badge>
              </CardContent>
            </Card>

            <Card className="shadow-card hover-scale transition-smooth">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-gradient-accent rounded-full flex items-center justify-center mx-auto">
                  <Zap className="w-6 h-6 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-semibold">Dynamic Pricing</h3>
                <p className="text-muted-foreground">
                  Real-time price optimization based on demand and inventory
                </p>
                <Badge className="bg-accent/10 text-accent-foreground">Real-Time</Badge>
              </CardContent>
            </Card>

            <Card className="shadow-card hover-scale transition-smooth">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold">Predictive Analytics</h3>
                <p className="text-muted-foreground">
                  Forecasting demand and optimizing inventory management
                </p>
                <Badge className="bg-primary/10 text-primary">Analytics</Badge>
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