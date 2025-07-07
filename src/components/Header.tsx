import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Mic, Search, ShoppingCart, Star } from 'lucide-react';

interface HeaderProps {
  walletCoins: number;
  cartItems: number;
  onVoiceSearch: () => void;
}

export const Header = ({ walletCoins, cartItems, onVoiceSearch }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-gradient-primary backdrop-blur supports-[backdrop-filter]:bg-gradient-primary/90">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-white">
              Walmart
              <span className="text-accent ml-1">Future</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search products, brands, or ask AI..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-12 bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:bg-white focus:text-foreground"
              />
              <Button
                size="sm"
                variant="ghost"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-white hover:bg-white/20"
                onClick={onVoiceSearch}
              >
                <Mic className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Wallet */}
            <div className="flex items-center space-x-2 bg-white/10 px-3 py-2 rounded-full">
              <Star className="h-4 w-4 text-accent" />
              <span className="text-white font-semibold">{walletCoins}</span>
              <span className="text-white/80 text-sm">Coins</span>
            </div>

            {/* Cart */}
            <Button variant="ghost" className="relative text-white hover:bg-white/20">
              <ShoppingCart className="h-5 w-5" />
              {cartItems > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-accent text-accent-foreground">
                  {cartItems}
                </Badge>
              )}
            </Button>

            {/* Profile */}
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/20">
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};