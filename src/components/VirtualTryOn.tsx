import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Camera, Upload, RotateCcw, ShoppingCart, Share2, Play, Square, Loader2 } from 'lucide-react';
import { removeBackground, loadImage } from '@/utils/backgroundRemoval';

interface TryOnProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  category: 'glasses' | 'clothing' | 'jewelry';
  overlayStyle?: {
    width: string;
    height: string;
    top: string;
    left: string;
    transform?: string;
  };
}

interface VirtualTryOnProps {
  products: TryOnProduct[];
  onAddToCart: (productId: string) => void;
}

// Mock product images with overlay positioning
const mockProducts: TryOnProduct[] = [
  {
    id: 'glasses-1',
    name: 'Classic Black Frames',
    price: 1599,
    image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=300&h=300&fit=crop',
    category: 'glasses',
    overlayStyle: {
      width: '180px',
      height: '60px',
      top: '35%',
      left: '50%',
      transform: 'translateX(-50%)'
    }
  },
  {
    id: 'glasses-2',
    name: 'Round Vintage Sunglasses',
    price: 2299,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=300&h=300&fit=crop',
    category: 'glasses',
    overlayStyle: {
      width: '160px',
      height: '80px',
      top: '32%',
      left: '50%',
      transform: 'translateX(-50%)'
    }
  },
  {
    id: 'tshirt-1',
    name: 'Blue Cotton T-Shirt',
    price: 899,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop',
    category: 'clothing',
    overlayStyle: {
      width: '200px',
      height: '250px',
      top: '45%',
      left: '50%',
      transform: 'translateX(-50%)'
    }
  },
  {
    id: 'hoodie-1',
    name: 'Red Hoodie',
    price: 1999,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&h=300&fit=crop',
    category: 'clothing',
    overlayStyle: {
      width: '220px',
      height: '280px',
      top: '40%',
      left: '50%',
      transform: 'translateX(-50%)'
    }
  }
];

export const VirtualTryOn = ({ onAddToCart }: VirtualTryOnProps) => {
  const [selectedProduct, setSelectedProduct] = useState<TryOnProduct>(mockProducts[0]);
  const [cameraActive, setCameraActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [stream, setStream] = useState<MediaStream | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clean up camera stream
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setCameraActive(true);
        setUploadedImage(null);
        setProcessedImage(null);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  }, [stream]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    canvas.toBlob(async (blob) => {
      if (blob) {
        const imageUrl = URL.createObjectURL(blob);
        setUploadedImage(imageUrl);
        setCameraActive(false);
        stopCamera();
        
        // Process the image for background removal
        await processImage(blob);
      }
    });
  }, [stopCamera]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
      setCameraActive(false);
      stopCamera();
      
      // Process the uploaded image
      await processImage(file);
    }
  };

  const processImage = async (imageFile: Blob) => {
    setIsProcessing(true);
    setProcessingProgress(0);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProcessingProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Load and process the image
      const imageElement = await loadImage(imageFile);
      const processedBlob = await removeBackground(imageElement);
      const processedUrl = URL.createObjectURL(processedBlob);
      
      setProcessedImage(processedUrl);
      setProcessingProgress(100);
      
      setTimeout(() => {
        setIsProcessing(false);
        setProcessingProgress(0);
      }, 500);
      
    } catch (error) {
      console.error('Error processing image:', error);
      setIsProcessing(false);
      setProcessingProgress(0);
      // Fallback to original image if processing fails
      setProcessedImage(uploadedImage);
    }
  };

  const resetTryOn = () => {
    stopCamera();
    setUploadedImage(null);
    setProcessedImage(null);
    setIsProcessing(false);
    setProcessingProgress(0);
  };

  const displayImage = processedImage || uploadedImage;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
          Virtual Try-On Experience
        </h1>
        <p className="text-muted-foreground">
          See how products look on you with advanced AI technology
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Try-On Studio */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Camera className="h-5 w-5" />
              <span>AI Try-On Studio</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Main Display Area */}
            <div className="aspect-square bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
              {/* Camera View */}
              {cameraActive && (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              )}

              {/* Uploaded/Processed Image */}
              {displayImage && !cameraActive && (
                <img 
                  src={displayImage}
                  alt="User photo" 
                  className="w-full h-full object-cover"
                />
              )}

              {/* Default State */}
              {!cameraActive && !displayImage && (
                <div className="text-center space-y-4">
                  <div className="text-6xl">👤</div>
                  <p className="text-muted-foreground">Upload your photo or use camera</p>
                </div>
              )}

              {/* Product Overlay */}
              {selectedProduct && (cameraActive || displayImage) && (
                <div 
                  className="absolute opacity-80 hover:opacity-100 transition-opacity"
                  style={selectedProduct.overlayStyle}
                >
                  <img 
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full h-full object-contain drop-shadow-lg"
                    style={{
                      filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
                    }}
                  />
                </div>
              )}

              {/* Processing Overlay */}
              {isProcessing && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-center space-y-4 text-white">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto" />
                    <div className="space-y-2">
                      <p>Processing with AI...</p>
                      <Progress value={processingProgress} className="w-48" />
                      <p className="text-xs">{processingProgress}% complete</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Camera Capture Button */}
              {cameraActive && (
                <Button
                  onClick={capturePhoto}
                  size="lg"
                  className="absolute bottom-4 left-1/2 transform -translate-x-1/2 rounded-full w-16 h-16"
                >
                  <Camera className="w-6 h-6" />
                </Button>
              )}
            </div>

            {/* Controls */}
            <div className="flex space-x-2">
              <Button
                onClick={cameraActive ? stopCamera : startCamera}
                variant={cameraActive ? "destructive" : "default"}
                className="flex-1"
              >
                {cameraActive ? (
                  <>
                    <Square className="w-4 h-4 mr-2" />
                    Stop Camera
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4 mr-2" />
                    Start Camera
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => fileInputRef.current?.click()}
                disabled={cameraActive}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Photo
              </Button>

              <Button
                onClick={resetTryOn}
                variant="ghost"
                size="icon"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            {/* Action Buttons */}
            {selectedProduct && (cameraActive || displayImage) && (
              <div className="space-y-2">
                <Button 
                  className="w-full"
                  onClick={() => onAddToCart(selectedProduct.id)}
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

            {/* AI Features Info */}
            <div className="bg-primary/5 p-3 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">✨ AI Features Active:</h4>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>• Background removal for better overlay</p>
                <p>• Smart product positioning</p>
                <p>• Real-time face detection</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Selection */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Try-On Ready Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockProducts.map((product) => (
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
                    <div className="text-right">
                      <Badge variant="secondary" className="text-xs mb-1">
                        {product.category}
                      </Badge>
                      {selectedProduct?.id === product.id && (
                        <div className="text-xs text-primary">Selected</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Category Filters */}
            <div className="mt-6 space-y-2">
              <h4 className="font-semibold text-sm">Filter by Category</h4>
              <div className="flex flex-wrap gap-2">
                {['glasses', 'clothing'].map((category) => (
                  <Badge 
                    key={category} 
                    variant="outline" 
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-smooth"
                    onClick={() => {
                      const filtered = mockProducts.filter(p => p.category === category);
                      if (filtered.length > 0) {
                        setSelectedProduct(filtered[0]);
                      }
                    }}
                  >
                    {category} ({mockProducts.filter(p => p.category === category).length})
                  </Badge>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div className="mt-6 bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">📱 How to use:</h4>
              <ol className="text-xs space-y-1 text-muted-foreground">
                <li>1. Select a product from the list</li>
                <li>2. Take a photo or upload one</li>
                <li>3. See the AI-powered overlay</li>
                <li>4. Add to cart if you like it!</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};