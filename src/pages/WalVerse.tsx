import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box, Sphere, Plane, useTexture, Html } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, User, Gamepad2, ShoppingCart, Eye, Star, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';

// Avatar selection options
const avatarOptions = [
  { id: '1', name: 'Alex', image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face', color: '#4F46E5' },
  { id: '2', name: 'Sarah', image: 'https://images.unsplash.com/photo-1494790108755-2616b612b5a?w=100&h=100&fit=crop&crop=face', color: '#EC4899' },
  { id: '3', name: 'Mike', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face', color: '#10B981' },
  { id: '4', name: 'Emma', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', color: '#F59E0B' },
];

// Store sections
const storeSections = [
  { id: 'electronics', name: 'Electronics', position: [10, 0, -5], color: '#3B82F6' },
  { id: 'clothing', name: 'Clothing', position: [-10, 0, -5], color: '#EC4899' },
  { id: 'grocery', name: 'Grocery', position: [0, 0, -15], color: '#10B981' },
  { id: 'home', name: 'Home & Garden', position: [0, 0, 5], color: '#F59E0B' },
];

// Products for each section
const sectionProducts = {
  electronics: [
    { id: '1', name: 'Smart TV 65"', price: 899, position: [8, 2, -3] },
    { id: '2', name: 'Laptop Pro', price: 1299, position: [12, 2, -3] },
    { id: '3', name: 'Wireless Headphones', price: 199, position: [10, 2, -7] },
  ],
  clothing: [
    { id: '4', name: 'Designer Jacket', price: 79, position: [-8, 2, -3] },
    { id: '5', name: 'Running Shoes', price: 129, position: [-12, 2, -3] },
    { id: '6', name: 'Summer Dress', price: 59, position: [-10, 2, -7] },
  ],
  grocery: [
    { id: '7', name: 'Organic Fruits', price: 15, position: [-2, 2, -13] },
    { id: '8', name: 'Fresh Vegetables', price: 12, position: [2, 2, -13] },
    { id: '9', name: 'Dairy Products', price: 8, position: [0, 2, -17] },
  ],
  home: [
    { id: '10', name: 'Garden Tools', price: 45, position: [-2, 2, 3] },
    { id: '11', name: 'Home Decor', price: 35, position: [2, 2, 3] },
    { id: '12', name: 'Kitchen Set', price: 89, position: [0, 2, 7] },
  ],
};

// Interactive Avatar Component
function Avatar3D({ position, selectedAvatar }: { position: [number, number, number], selectedAvatar: any }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <group position={position}>
      <Sphere ref={meshRef} args={[0.5, 32, 32]} position={[0, 1, 0]}>
        <meshStandardMaterial color={selectedAvatar?.color || '#4F46E5'} />
      </Sphere>
      <Box args={[0.8, 1.5, 0.4]} position={[0, 0, 0]}>
        <meshStandardMaterial color={selectedAvatar?.color || '#4F46E5'} />
      </Box>
      <Html position={[0, 2, 0]} center>
        <div className="text-white bg-black/50 px-2 py-1 rounded text-sm">
          {selectedAvatar?.name || 'Avatar'}
        </div>
      </Html>
    </group>
  );
}

// Product Display Component
function ProductDisplay({ product, section }: { product: any, section: string }) {
  const [hovered, setHovered] = useState(false);
  
  return (
    <group position={product.position}>
      <Box 
        args={[1.5, 1.5, 1.5]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial 
          color={hovered ? '#FFD700' : sectionProducts[section as keyof typeof sectionProducts] ? 
            storeSections.find(s => s.id === section)?.color : '#666666'} 
        />
      </Box>
      <Html position={[0, 1.5, 0]} center>
        <div className="bg-white/90 p-2 rounded-lg shadow-lg text-center min-w-[120px]">
          <p className="font-semibold text-sm">{product.name}</p>
          <p className="text-green-600 font-bold">${product.price}</p>
          <div className="flex gap-1 mt-1">
            <Button size="sm" className="text-xs px-2 py-1 h-6">
              <Eye className="w-3 h-3 mr-1" />
              Try
            </Button>
            <Button size="sm" variant="outline" className="text-xs px-2 py-1 h-6">
              <ShoppingCart className="w-3 h-3 mr-1" />
              Buy
            </Button>
          </div>
        </div>
      </Html>
    </group>
  );
}

// Store Section Component
function StoreSection({ section }: { section: any }) {
  return (
    <group>
      {/* Section Floor */}
      <Plane args={[8, 8]} position={section.position} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color={section.color} opacity={0.3} transparent />
      </Plane>
      
      {/* Section Sign */}
      <Text
        position={[section.position[0], 4, section.position[2]]}
        fontSize={1}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {section.name}
      </Text>
      
      {/* Products in this section */}
      {sectionProducts[section.id as keyof typeof sectionProducts]?.map((product) => (
        <ProductDisplay key={product.id} product={product} section={section.id} />
      ))}
    </group>
  );
}

// Walmart Posters Component
function WalmartPosters() {
  return (
    <>
      {/* Wall Posters */}
      <Plane args={[6, 4]} position={[0, 3, -20]}>
        <meshStandardMaterial color="#FCD34D" />
      </Plane>
      <Html position={[0, 3, -19.9]} center>
        <div className="text-center p-4 text-blue-600">
          <h2 className="text-2xl font-bold">WALMART</h2>
          <p className="text-lg">Save Money. Live Better.</p>
        </div>
      </Html>
      
      <Plane args={[4, 3]} position={[15, 3, 0]}>
        <meshStandardMaterial color="#DC2626" />
      </Plane>
      <Html position={[15, 3, 0.1]} center>
        <div className="text-center p-2 text-white">
          <h3 className="text-xl font-bold">WalVerse</h3>
          <p>Virtual Shopping Experience</p>
        </div>
      </Html>
    </>
  );
}

// Gamification Zone Component
function GamificationZone() {
  const [spinning, setSpinning] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current && spinning) {
      meshRef.current.rotation.y += 0.1;
    }
  });

  return (
    <group position={[0, 0, 15]}>
      {/* Game Platform */}
      <Plane args={[10, 10]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#8B5CF6" opacity={0.5} transparent />
      </Plane>
      
      {/* Spinning Prize Wheel */}
      <Sphere 
        ref={meshRef}
        args={[2, 32, 32]} 
        position={[0, 2, 0]}
        onClick={() => setSpinning(!spinning)}
      >
        <meshStandardMaterial color="#F59E0B" />
      </Sphere>
      
      <Html position={[0, 5, 0]} center>
        <div className="bg-purple-600 text-white p-4 rounded-lg text-center">
          <Gamepad2 className="w-8 h-8 mx-auto mb-2" />
          <h3 className="font-bold">Game Zone</h3>
          <p className="text-sm">Spin to win coins!</p>
          <Button 
            size="sm" 
            className="mt-2"
            onClick={() => setSpinning(!spinning)}
          >
            {spinning ? 'Stop' : 'Spin'}
          </Button>
        </div>
      </Html>
      
      {/* Interactive Games */}
      <Box args={[2, 2, 2]} position={[-4, 1, 0]}>
        <meshStandardMaterial color="#10B981" />
      </Box>
      <Html position={[-4, 2.5, 0]} center>
        <div className="bg-green-500 text-white p-2 rounded text-center">
          <Star className="w-4 h-4 mx-auto" />
          <p className="text-xs">Quiz Game</p>
        </div>
      </Html>
      
      <Box args={[2, 2, 2]} position={[4, 1, 0]}>
        <meshStandardMaterial color="#EC4899" />
      </Box>
      <Html position={[4, 2.5, 0]} center>
        <div className="bg-pink-500 text-white p-2 rounded text-center">
          <Gift className="w-4 h-4 mx-auto" />
          <p className="text-xs">Daily Rewards</p>
        </div>
      </Html>
    </group>
  );
}

// Main Scene Component
function Scene({ selectedAvatar }: { selectedAvatar: any }) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[0, 10, 0]} intensity={0.5} />
      
      {/* Mall Floor */}
      <Plane args={[50, 50]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#E5E7EB" />
      </Plane>
      
      {/* Store Sections */}
      {storeSections.map((section) => (
        <StoreSection key={section.id} section={section} />
      ))}
      
      {/* User Avatar */}
      <Avatar3D position={[0, 0, 0]} selectedAvatar={selectedAvatar} />
      
      {/* Walmart Branding */}
      <WalmartPosters />
      
      {/* Gamification Zone */}
      <GamificationZone />
      
      {/* Mall Walls */}
      <Plane args={[50, 10]} position={[0, 5, -25]}>
        <meshStandardMaterial color="#9CA3AF" />
      </Plane>
      <Plane args={[50, 10]} position={[0, 5, 25]}>
        <meshStandardMaterial color="#9CA3AF" />
      </Plane>
      <Plane args={[50, 10]} position={[-25, 5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <meshStandardMaterial color="#9CA3AF" />
      </Plane>
      <Plane args={[50, 10]} position={[25, 5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <meshStandardMaterial color="#9CA3AF" />
      </Plane>
    </>
  );
}

// Main WalVerse Component
const WalVerse = () => {
  const navigate = useNavigate();
  const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0]);
  const [showAvatarSelection, setShowAvatarSelection] = useState(true);
  const [coins, setCoins] = useState(0);
  const [cartItems, setCartItems] = useState(0);

  if (showAvatarSelection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-primary mb-2">Welcome to WalVerse</h1>
              <p className="text-muted-foreground">Choose your avatar to start shopping</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              {avatarOptions.map((avatar) => (
                <div
                  key={avatar.id}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedAvatar.id === avatar.id
                      ? 'border-primary bg-primary/10'
                      : 'border-muted hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedAvatar(avatar)}
                >
                  <div className="text-center">
                    <Avatar className="w-16 h-16 mx-auto mb-2">
                      <AvatarImage src={avatar.image} alt={avatar.name} />
                      <AvatarFallback style={{ backgroundColor: avatar.color }}>
                        {avatar.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <p className="font-semibold">{avatar.name}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-4">
              <Button 
                className="w-full" 
                onClick={() => setShowAvatarSelection(false)}
              >
                <User className="w-4 h-4 mr-2" />
                Enter WalVerse
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Store
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black relative">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-black/80 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Exit WalVerse
            </Button>
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={selectedAvatar.image} alt={selectedAvatar.name} />
                <AvatarFallback style={{ backgroundColor: selectedAvatar.color }}>
                  {selectedAvatar.name[0]}
                </AvatarFallback>
              </Avatar>
              <span className="text-white font-semibold">{selectedAvatar.name}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="bg-yellow-500 text-black">
              <Star className="w-3 h-3 mr-1" />
              {coins} Coins
            </Badge>
            <Badge variant="secondary">
              <ShoppingCart className="w-3 h-3 mr-1" />
              {cartItems} Items
            </Badge>
            <Button
              size="sm"
              onClick={() => setShowAvatarSelection(true)}
            >
              Change Avatar
            </Button>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute top-20 left-4 z-10">
        <Card className="bg-black/80 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <h3 className="text-white font-semibold mb-2">Controls</h3>
            <div className="text-white/80 text-sm space-y-1">
              <p>• Click and drag to look around</p>
              <p>• Scroll to zoom in/out</p>
              <p>• Click on products to interact</p>
              <p>• Visit game zone for rewards</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3D Scene */}
      <Canvas camera={{ position: [0, 8, 12], fov: 60 }}>
        <Scene selectedAvatar={selectedAvatar} />
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxDistance={30}
          minDistance={5}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>

      {/* Store Map */}
      <div className="absolute bottom-4 right-4 z-10">
        <Card className="bg-black/80 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <h3 className="text-white font-semibold mb-2">Store Map</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {storeSections.map((section) => (
                <div key={section.id} className="flex items-center gap-2 text-white/80">
                  <div 
                    className="w-3 h-3 rounded" 
                    style={{ backgroundColor: section.color }}
                  />
                  {section.name}
                </div>
              ))}
            </div>
            <div className="mt-2 pt-2 border-t border-white/20">
              <div className="flex items-center gap-2 text-white/80 text-xs">
                <div className="w-3 h-3 rounded bg-purple-500" />
                Game Zone
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WalVerse;