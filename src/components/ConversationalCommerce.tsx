import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MessageCircle, ShoppingCart, CreditCard, Package, Sparkles, Bot } from 'lucide-react';

interface ConversationalCommerceProps {
  onPurchaseComplete: (productId: string, amount: number) => void;
  walletCoins: number;
}

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  productSuggestion?: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
  action?: 'purchase' | 'add_to_cart' | 'view_product';
}

export const ConversationalCommerce = ({ 
  onPurchaseComplete, 
  walletCoins 
}: ConversationalCommerceProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "Hi! I'm your AI Shopping Assistant. I can help you find products, make purchases, and even predict what you might need. What are you looking for today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isProcessing) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    // Simulate AI processing for conversational commerce
    setTimeout(() => {
      const responses = [
        {
          text: "I found some great wireless earbuds based on your music preferences! They're currently 20% off.",
          productSuggestion: {
            id: 'rec-1',
            name: 'Premium Wireless Earbuds',
            price: 1999,
            image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=150&h=150&fit=crop'
          },
          action: 'purchase' as const
        },
        {
          text: "Based on your previous purchases, you might need a phone case. Would you like me to show you some options?",
          productSuggestion: {
            id: 'rec-2',
            name: 'Protective Phone Case',
            price: 899,
            image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=150&h=150&fit=crop'
          },
          action: 'view_product' as const
        },
        {
          text: "I can help you complete your workout setup! Here's a fitness tracker that pairs well with your recent gym equipment purchase.",
          productSuggestion: {
            id: 'rec-3',
            name: 'Smart Fitness Tracker',
            price: 2499,
            image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=150&h=150&fit=crop'
          },
          action: 'add_to_cart' as const
        }
      ];
      
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        ...responses[Math.floor(Math.random() * responses.length)],
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsProcessing(false);
    }, 1500);

    setInputMessage('');
  };

  const handleQuickAction = (message: ChatMessage) => {
    if (message.productSuggestion && message.action === 'purchase') {
      onPurchaseComplete(message.productSuggestion.id, message.productSuggestion.price);
      
      const confirmMessage: ChatMessage = {
        id: Date.now().toString(),
        text: `Great! I've processed your purchase of ${message.productSuggestion.name} for ₹${message.productSuggestion.price}. Your order will be delivered in 2-3 days.`,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, confirmMessage]);
    }
  };

  return (
    <>
      {/* Floating Commerce Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-20 right-6 z-50 h-14 w-14 rounded-full bg-gradient-accent shadow-glow transition-spring hover-scale ${isOpen ? 'hidden' : 'flex'}`}
      >
        <MessageCircle className="h-6 w-6 text-accent-foreground" />
      </Button>

      {/* Conversational Commerce Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 z-50 w-96 h-[500px] shadow-elegant transition-spring animate-scale-in">
          <CardHeader className="bg-gradient-accent text-accent-foreground rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">AI Shopping Assistant</h3>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="bg-white/20 text-accent-foreground text-xs">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Conversational Commerce
                    </Badge>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-accent-foreground hover:bg-white/20"
              >
                ×
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex flex-col h-[400px] p-0">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-lg ${
                      message.isUser
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <p className="text-sm mb-2">{message.text}</p>
                    
                    {/* Product Suggestion */}
                    {message.productSuggestion && (
                      <div className="mt-3 p-2 bg-background rounded border">
                        <div className="flex items-center gap-2 mb-2">
                          <img 
                            src={message.productSuggestion.image} 
                            alt={message.productSuggestion.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-xs">{message.productSuggestion.name}</p>
                            <p className="text-primary font-semibold text-sm">₹{message.productSuggestion.price}</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          {message.action === 'purchase' && (
                            <Button 
                              size="sm" 
                              className="text-xs"
                              onClick={() => handleQuickAction(message)}
                            >
                              <CreditCard className="w-3 h-3 mr-1" />
                              Buy Now
                            </Button>
                          )}
                          {message.action === 'add_to_cart' && (
                            <Button size="sm" variant="outline" className="text-xs">
                              <ShoppingCart className="w-3 h-3 mr-1" />
                              Add to Cart
                            </Button>
                          )}
                          {message.action === 'view_product' && (
                            <Button size="sm" variant="outline" className="text-xs">
                              <Package className="w-3 h-3 mr-1" />
                              View Details
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <Input
                  placeholder="Ask me anything about products..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1"
                />
                <Button onClick={sendMessage} size="sm" disabled={isProcessing}>
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="mt-2 flex gap-2">
                <Badge variant="outline" className="text-xs cursor-pointer" onClick={() => setInputMessage("Show me trending products")}>
                  Trending
                </Badge>
                <Badge variant="outline" className="text-xs cursor-pointer" onClick={() => setInputMessage("What do I need for my home office?")}>
                  Home Office
                </Badge>
                <Badge variant="outline" className="text-xs cursor-pointer" onClick={() => setInputMessage("Find me deals under ₹1000")}>
                  Deals
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};