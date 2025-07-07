import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Camera, Upload, RotateCcw, ShoppingCart, Share2 } from 'lucide-react';

interface TryOnProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  category: 'glasses' | 'clothing' | 'jewelry';
}

interface VirtualTryOnProps {
  products: TryOnProduct[];
  onAddToCart: (productId: string) => void;
}

export const VirtualTryOn = ({ products, onAddToCart }: VirtualTryOnProps) => {
  const [selectedProduct, setSelectedProduct] = useState<TryOnProduct | null>(products[0] || null);
  const [cameraActive, setCameraActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setCameraActive(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const activateCamera = () => {
    setCameraActive(true);
    setUploadedImage(null);
  };

  const resetTryOn = () => {
    setCameraActive(false);
    setUploadedImage(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
          Virtual Try-On Experience
        </h1>
        <p className="text-muted-foreground">
          See how products look on you before you buy
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Try-On Camera/Upload Area */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Camera className="h-5 w-5" />
              <span>Try-On Studio</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Camera/Image Display */}
            <div className="aspect-square bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
              {cameraActive ? (
                <div className="text-center space-y-4">
                  <Camera className="h-12 w-12 text-muted-foreground mx-auto" />
                  <p className="text-muted-foreground">Camera view would appear here</p>
                  <Badge variant="secondary">Live Preview</Badge>
                </div>
              ) : uploadedImage ? (
                <img 
                  src={uploadedImage} 
                  alt="User uploaded" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center space-y-4">
                  <div className="text-6xl">👤</div>
                  <p className="text-muted-foreground">Upload your photo or use camera</p>
                </div>
              )}

              {/* Product Overlay */}
              {selectedProduct && (cameraActive || uploadedImage) && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/80 p-2 rounded-lg">
                    <img 
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="w-20 h-20 object-contain"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex space-x-2">
              <Button
                onClick={activateCamera}
                variant={cameraActive ? "default" : "outline"}
                className="flex-1"
              >
                <Camera className="w-4 h-4 mr-2" />
                Use Camera
              </Button>
              
              <label className="flex-1">
                <Button variant="outline" className="w-full" asChild>
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Photo
                  </span>
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              <Button
                onClick={resetTryOn}
                variant="ghost"
                size="icon"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>

            {/* Action Buttons */}
            {selectedProduct && (cameraActive || uploadedImage) && (
              <div className="space-y-2">
                <Button 
                  className="w-full"
                  onClick={() => selectedProduct && onAddToCart(selectedProduct.id)}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart - ₹{selectedProduct.price}
                </Button>
                <Button variant="outline" className="w-full">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Try-On
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Product Selection */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Available Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {products.map((product) => (
                <div
                  key={product.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-smooth hover:shadow-md ${
                    selectedProduct?.id === product.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{product.name}</h4>
                      <p className="text-primary font-bold">₹{product.price}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {product.category}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            {/* Category Filter */}
            <div className="mt-6 space-y-2">
              <h4 className="font-semibold text-sm">Categories</h4>
              <div className="flex flex-wrap gap-2">
                {['glasses', 'clothing', 'jewelry'].map((category) => (
                  <Badge 
                    key={category} 
                    variant="outline" 
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-smooth"
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};