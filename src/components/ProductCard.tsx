import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, Sparkles, Eye } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  hasVirtualTryOn: boolean;
  expertAdviceAvailable: boolean;
}

interface ProductCardProps {
  product: Product;
  userCoins: number;
  expertCredits: number;
  onAddToCart: (productId: string) => void;
  onVirtualTryOn: (productId: string) => void;
  onExpertAdvice: (productId: string) => void;
}

export const ProductCard = ({ 
  product, 
  userCoins, 
  expertCredits,
  onAddToCart,
  onVirtualTryOn,
  onExpertAdvice
}: ProductCardProps) => {
  const [showExpertAdvice, setShowExpertAdvice] = useState(false);
  
  // Dynamic pricing based on user coins
  const discountFromCoins = Math.min(userCoins * 0.25, product.price * 0.3);
  const dynamicPrice = Math.max(product.price - discountFromCoins, product.price * 0.7);
  const savings = product.price - dynamicPrice;

  const handleExpertAdvice = () => {
    if (expertCredits > 0 || showExpertAdvice) {
      setShowExpertAdvice(true);
      onExpertAdvice(product.id);
    }
  };

  return (
    <Card className="group hover-scale hover:shadow-card transition-smooth overflow-hidden">
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 space-y-1">
          {product.hasVirtualTryOn && (
            <Badge className="bg-primary text-primary-foreground">
              <Eye className="w-3 h-3 mr-1" />
              Try-On
            </Badge>
          )}
          {savings > 0 && (
            <Badge className="bg-accent text-accent-foreground">
              Save ₹{savings.toFixed(0)}
            </Badge>
          )}
        </div>

        {/* Virtual Try-On Button */}
        {product.hasVirtualTryOn && (
          <Button
            variant="secondary"
            size="sm"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-smooth"
            onClick={() => onVirtualTryOn(product.id)}
          >
            <Eye className="w-4 h-4" />
          </Button>
        )}
      </div>

      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-sm line-clamp-2">{product.name}</h3>
          
          {/* Rating */}
          <div className="flex items-center space-x-1 mt-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating)
                      ? 'text-accent fill-accent'
                      : 'text-muted-foreground'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">({product.reviews})</span>
          </div>
        </div>

        {/* Pricing */}
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-primary">₹{dynamicPrice.toFixed(0)}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ₹{product.originalPrice}
              </span>
            )}
          </div>
          {savings > 0 && (
            <p className="text-xs text-success">
              🎉 Your coins saved you ₹{savings.toFixed(0)}!
            </p>
          )}
        </div>

        {/* Expert Advice */}
        {product.expertAdviceAvailable && (
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={handleExpertAdvice}
              disabled={expertCredits === 0 && !showExpertAdvice}
            >
              <Sparkles className="w-3 h-3 mr-1" />
              Get Expert Advice {expertCredits > 0 ? '(Free)' : '(1 Credit)'}
            </Button>
            
            {showExpertAdvice && (
              <div className="p-2 bg-muted rounded text-xs">
                <p className="font-semibold text-primary">Expert Tip:</p>
                <p>This product has excellent reviews for comfort and durability. Perfect for daily wear with a modern fit that runs true to size.</p>
              </div>
            )}
          </div>
        )}

        {/* Add to Cart */}
        <Button 
          className="w-full transition-smooth"
          onClick={() => onAddToCart(product.id)}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
};