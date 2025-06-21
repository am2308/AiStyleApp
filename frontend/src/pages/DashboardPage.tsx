import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Shirt, ShoppingBag, TrendingUp, User, Play, Pause, ArrowRight, Star, Zap, Award, Calendar, BarChart3, Heart, Camera, Palette, Target, Crown, Gift, Volume2, VolumeX, Maximize, RotateCcw, ChevronRight, ChevronLeft, X, Wand2, Layers, ShoppingCart, TrendingUp as Trending } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useWardrobe } from '../contexts/WardrobeContext';
import FashionBackground from '../components/FashionBackground';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { items } = useWardrobe();
  const navigate = useNavigate();
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [showWelcomeAnimation, setShowWelcomeAnimation] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [demoProgress, setDemoProgress] = useState(0);
  const [currentDemoStep, setCurrentDemoStep] = useState(0);

  // Enhanced fashion content with comprehensive feature showcase
  const fashionContent = [
    {
      type: 'comprehensive-demo',
      title: 'Complete StyleAI Experience',
      description: 'Watch how AI transforms your fashion journey from wardrobe to runway',
      thumbnail: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800',
      demoType: 'full-experience',
      duration: 30000 // 30 seconds
    },
    {
      type: 'feature-demo',
      title: 'AI Style Recommendations',
      description: 'See how our AI analyzes your wardrobe to create perfect outfit combinations',
      thumbnail: 'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=800',
      demoType: 'ai-recommendations',
      duration: 15000
    },
    {
      type: 'feature-demo',
      title: '3D Virtual Try-On Technology',
      description: 'Experience photorealistic 3D modeling with your personal avatar',
      thumbnail: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800',
      demoType: '3d-modeling',
      duration: 20000
    },
    {
      type: 'feature-demo',
      title: 'Smart Marketplace Integration',
      description: 'Discover trending fashion that perfectly matches your style',
      thumbnail: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800',
      demoType: 'marketplace',
      duration: 12000
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcomeAnimation(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPlaying && !showVideoModal) {
        setCurrentContentIndex((prev) => (prev + 1) % fashionContent.length);
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [isPlaying, showVideoModal]);

  // Auto-play demo progression
  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    
    if (isPlaying && showVideoModal) {
      const currentDemo = fashionContent[currentContentIndex];
      const stepDuration = currentDemo.duration / 100; // 100 steps for smooth progress
      
      progressInterval = setInterval(() => {
        setDemoProgress(prev => {
          if (prev >= 100) {
            // Auto advance to next demo
            const nextIndex = (currentContentIndex + 1) % fashionContent.length;
            setCurrentContentIndex(nextIndex);
            setCurrentDemoStep(0);
            return 0;
          }
          return prev + 1;
        });
        
        setCurrentDemoStep(prev => (prev + 1) % 10); // Change demo step every 10%
      }, stepDuration);
    }

    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [isPlaying, showVideoModal, currentContentIndex]);

  const handlePlayDemo = (index?: number) => {
    const contentIndex = index !== undefined ? index : currentContentIndex;
    setCurrentContentIndex(contentIndex);
    setShowVideoModal(true);
    setIsPlaying(true);
    setDemoProgress(0);
    setCurrentDemoStep(0);
  };

  const handleWatchDemo = () => {
    setCurrentContentIndex(0); // Start with comprehensive demo
    setShowVideoModal(true);
    setIsPlaying(true);
    setDemoProgress(0);
    setCurrentDemoStep(0);
  };

  const renderComprehensiveDemo = () => {
    const steps = [
      {
        title: "Welcome to StyleAI",
        content: (
          <div className="text-center space-y-6">
            <motion.div
              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-8 w-32 h-32 mx-auto flex items-center justify-center"
            >
              <Shirt className="w-16 h-16 text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold text-white">Your AI Style Assistant</h2>
            <p className="text-xl text-white/90">Revolutionizing fashion with artificial intelligence</p>
          </div>
        )
      },
      {
        title: "Upload Your Wardrobe",
        content: (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white text-center">Smart Wardrobe Digitization</h3>
            <div className="grid grid-cols-3 gap-4">
              {['Shirt', 'Jeans', 'Dress'].map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.5, repeat: Infinity, repeatDelay: 3 }}
                  className="bg-white/20 rounded-lg p-4 text-center"
                >
                  <div className="w-16 h-16 bg-white/30 rounded-lg mx-auto mb-2 flex items-center justify-center">
                    <Shirt className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-white font-medium">{item}</p>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ delay: index * 0.5 + 1, duration: 0.5 }}
                    className="text-green-400 text-sm mt-1"
                  >
                    ✓ Analyzed
                  </motion.div>
                </motion.div>
              ))}
            </div>
            <motion.div
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-center text-white"
            >
              <Zap className="w-6 h-6 mx-auto mb-2" />
              <p>AI automatically categorizes and analyzes colors</p>
            </motion.div>
          </div>
        )
      },
      {
        title: "AI Style Analysis",
        content: (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white text-center">Intelligent Style Matching</h3>
            <div className="bg-white/20 rounded-lg p-6">
              <div className="flex items-center justify-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Shirt className="w-8 h-8 text-white" />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-3xl text-white"
                >
                  +
                </motion.div>
                <div className="w-16 h-16 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
                  className="text-3xl text-white"
                >
                  =
                </motion.div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1], backgroundColor: ['#10b981', '#06d6a0', '#10b981'] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center"
                >
                  <Star className="w-8 h-8 text-white" />
                </motion.div>
              </div>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-green-400 mb-2">98% Style Match</div>
                <p className="text-white">Perfect for {user?.preferredStyle || 'Casual'} occasions</p>
              </motion.div>
            </div>
          </div>
        )
      },
      {
        title: "3D Virtual Try-On",
        content: (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white text-center">Photorealistic 3D Modeling</h3>
            <div className="flex justify-center">
              <motion.div
                animate={{ 
                  rotateY: 360,
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  rotateY: { duration: 4, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity }
                }}
                className="relative"
              >
                <div className="w-40 h-60 bg-gradient-to-b from-purple-400 to-pink-400 rounded-lg flex flex-col items-center justify-center">
                  <div className="w-12 h-12 bg-white/30 rounded-full mb-4"></div>
                  <div className="w-20 h-24 bg-blue-500 rounded-lg mb-2"></div>
                  <div className="w-16 h-20 bg-gray-700 rounded-lg mb-2"></div>
                  <div className="flex space-x-2">
                    <div className="w-6 h-8 bg-black rounded"></div>
                    <div className="w-6 h-8 bg-black rounded"></div>
                  </div>
                </div>
                <motion.div
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-4 -right-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs"
                >
                  Live Preview
                </motion.div>
              </motion.div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white/20 rounded-lg p-3">
                <Palette className="w-6 h-6 mx-auto mb-2 text-white" />
                <p className="text-white text-sm">Skin Tone: {user?.skinTone || 'Medium'}</p>
              </div>
              <div className="bg-white/20 rounded-lg p-3">
                <User className="w-6 h-6 mx-auto mb-2 text-white" />
                <p className="text-white text-sm">Body: {user?.bodyType || 'Rectangle'}</p>
              </div>
              <div className="bg-white/20 rounded-lg p-3">
                <Star className="w-6 h-6 mx-auto mb-2 text-white" />
                <p className="text-white text-sm">Style: {user?.preferredStyle || 'Casual'}</p>
              </div>
            </div>
          </div>
        )
      },
      {
        title: "Smart Shopping",
        content: (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white text-center">AI-Powered Marketplace</h3>
            <div className="space-y-3">
              {[
                { name: 'Perfect Blue Blazer', price: '$89', match: '98%', trend: '+15%' },
                { name: 'Designer Silk Scarf', price: '$45', match: '95%', trend: '+8%' },
                { name: 'Premium Leather Boots', price: '$150', match: '92%', trend: '+22%' }
              ].map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.5, repeat: Infinity, repeatDelay: 4 }}
                  className="bg-white/20 rounded-lg p-4 flex justify-between items-center"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg"></div>
                    <div>
                      <p className="text-white font-medium">{item.name}</p>
                      <p className="text-white/70 text-sm">{item.price}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-bold">{item.match}</div>
                    <div className="text-orange-400 text-sm flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {item.trend}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-center bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-lg"
            >
              <ShoppingBag className="w-6 h-6 mx-auto mb-2" />
              <p className="font-bold">1000+ Premium Brands Connected</p>
            </motion.div>
          </div>
        )
      },
      {
        title: "Style Analytics",
        content: (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white text-center">Advanced Style Insights</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/20 rounded-lg p-4 text-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-3xl font-bold text-green-400 mb-2"
                >
                  95%
                </motion.div>
                <p className="text-white">Style Score</p>
                <BarChart3 className="w-6 h-6 mx-auto mt-2 text-white" />
              </div>
              <div className="bg-white/20 rounded-lg p-4 text-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  className="text-3xl font-bold text-blue-400 mb-2"
                >
                  87%
                </motion.div>
                <p className="text-white">Versatility</p>
                <Target className="w-6 h-6 mx-auto mt-2 text-white" />
              </div>
            </div>
            <div className="bg-white/20 rounded-lg p-4">
              <h4 className="text-white font-bold mb-3">Color Harmony Analysis</h4>
              <div className="flex space-x-2 mb-3">
                {['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'].map((color, index) => (
                  <motion.div
                    key={color}
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ delay: index * 0.3, duration: 1, repeat: Infinity, repeatDelay: 2 }}
                    className="w-8 h-8 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <p className="text-white text-sm">Perfect color coordination detected</p>
            </div>
          </div>
        )
      },
      {
        title: "Social Sharing",
        content: (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white text-center">Share Your Style</h3>
            <div className="bg-white/20 rounded-lg p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-white font-bold">{user?.name || 'Fashion Enthusiast'}</p>
                  <p className="text-white/70">Today's {user?.preferredStyle || 'Casual'} Look</p>
                </div>
              </div>
              <div className="flex justify-between items-center mb-4">
                <div className="flex space-x-4">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="flex items-center text-white"
                  >
                    <Heart className="w-5 h-5 mr-1 text-red-400" />
                    <span>247</span>
                  </motion.div>
                  <div className="flex items-center text-white">
                    <Star className="w-5 h-5 mr-1 text-yellow-400" />
                    <span>89</span>
                  </div>
                </div>
                <motion.button
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-lg"
                >
                  Share Outfit
                </motion.button>
              </div>
              <p className="text-white/90 text-sm">
                "Loving my new AI-styled look! StyleAI knows my taste perfectly 💫 #StyleAI #OOTD"
              </p>
            </div>
          </div>
        )
      },
      {
        title: "Your Style Journey",
        content: (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white text-center">Welcome to the Future of Fashion</h3>
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-4 text-center"
              >
                <Sparkles className="w-8 h-8 mx-auto mb-2 text-white" />
                <p className="text-white font-bold">AI Recommendations</p>
                <p className="text-white/80 text-sm">Unlimited outfit ideas</p>
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg p-4 text-center"
              >
                <Camera className="w-8 h-8 mx-auto mb-2 text-white" />
                <p className="text-white font-bold">3D Virtual Try-On</p>
                <p className="text-white/80 text-sm">Photorealistic modeling</p>
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg p-4 text-center"
              >
                <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-white" />
                <p className="text-white font-bold">Smart Shopping</p>
                <p className="text-white/80 text-sm">1000+ brand integration</p>
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-4 text-center"
              >
                <BarChart3 className="w-8 h-8 mx-auto mb-2 text-white" />
                <p className="text-white font-bold">Style Analytics</p>
                <p className="text-white/80 text-sm">Advanced insights</p>
              </motion.div>
            </div>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg"
            >
              <Crown className="w-8 h-8 mx-auto mb-2" />
              <p className="text-xl font-bold">Ready to Transform Your Style?</p>
              <p className="text-white/90">Join thousands of fashion enthusiasts</p>
            </motion.div>
          </div>
        )
      }
    ];

    const currentStep = steps[currentDemoStep % steps.length];
    
    return (
      <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 p-8 rounded-lg text-white min-h-96">
        <motion.div
          key={currentDemoStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {currentStep.content}
        </motion.div>
      </div>
    );
  };

  const renderInteractiveDemo = (demoType: string) => {
    switch (demoType) {
      case 'full-experience':
        return renderComprehensiveDemo();
        
      case 'ai-recommendations':
        return (
          <div className="bg-gradient-to-br from-purple-900 to-blue-900 p-8 rounded-lg text-white">
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">AI Style Analysis in Action</h3>
                <div className="bg-white/20 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-center space-x-4 mb-4">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-16 h-16 bg-white/30 rounded-lg flex items-center justify-center"
                    >
                      <Shirt className="w-8 h-8" />
                    </motion.div>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="text-4xl"
                    >
                      <Sparkles className="w-8 h-8" />
                    </motion.div>
                    <motion.div
                      animate={{ scale: [1, 1.3, 1], backgroundColor: ['#10b981', '#06d6a0', '#10b981'] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-16 h-16 bg-green-400 rounded-lg flex items-center justify-center"
                    >
                      <Star className="w-8 h-8 text-white" />
                    </motion.div>
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-2xl font-bold text-green-400"
                  >
                    95% Perfect Style Match Found!
                  </motion.div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-6">
                  {['Color Analysis', 'Body Type Match', 'Occasion Perfect'].map((feature, index) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.5, repeat: Infinity, repeatDelay: 3 }}
                      className="bg-white/20 rounded-lg p-3 text-center"
                    >
                      <div className="w-8 h-8 bg-green-400 rounded-full mx-auto mb-2 flex items-center justify-center">
                        <span className="text-white font-bold">✓</span>
                      </div>
                      <p className="text-sm">{feature}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case '3d-modeling':
        return (
          <div className="bg-gradient-to-br from-blue-900 to-purple-900 p-8 rounded-lg text-white">
            <div className="text-center space-y-6">
              <h3 className="text-2xl font-bold">3D Virtual Avatar Technology</h3>
              <div className="relative flex justify-center">
                <motion.div
                  animate={{ 
                    rotateY: 360,
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    rotateY: { duration: 4, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity }
                  }}
                  className="w-32 h-48 bg-gradient-to-b from-pink-400 to-purple-400 rounded-lg flex flex-col items-center justify-center relative"
                >
                  {/* Avatar representation */}
                  <div className="w-8 h-8 bg-white/30 rounded-full mb-2"></div>
                  <div className="w-16 h-20 bg-blue-500 rounded-lg mb-1"></div>
                  <div className="w-14 h-16 bg-gray-700 rounded-lg mb-1"></div>
                  <div className="flex space-x-1">
                    <div className="w-4 h-6 bg-black rounded"></div>
                    <div className="w-4 h-6 bg-black rounded"></div>
                  </div>
                  
                  {/* Floating indicators */}
                  <motion.div
                    animate={{ y: [-5, 5, -5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-6 -left-6 bg-green-500 text-white px-2 py-1 rounded text-xs"
                  >
                    Real-time
                  </motion.div>
                  <motion.div
                    animate={{ y: [5, -5, 5] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    className="absolute -bottom-6 -right-6 bg-blue-500 text-white px-2 py-1 rounded text-xs"
                  >
                    HD Quality
                  </motion.div>
                </motion.div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/20 rounded-lg p-3">
                  <Palette className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-sm">Skin: {user?.skinTone || 'Medium'}</p>
                </div>
                <div className="bg-white/20 rounded-lg p-3">
                  <User className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-sm">Body: {user?.bodyType || 'Rectangle'}</p>
                </div>
                <div className="bg-white/20 rounded-lg p-3">
                  <Star className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-sm">Style: {user?.preferredStyle || 'Casual'}</p>
                </div>
              </div>
              
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg"
              >
                Photorealistic 3D Rendering Technology
              </motion.div>
            </div>
          </div>
        );

      case 'marketplace':
        return (
          <div className="bg-gradient-to-br from-orange-900 to-red-900 p-8 rounded-lg text-white">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-center">Smart Fashion Discovery</h3>
              <div className="space-y-4">
                {[
                  { name: 'Trending Silk Blouse', price: '$89', match: '98%', brand: 'Zara', trend: '+15%' },
                  { name: 'Designer Denim Jacket', price: '$125', match: '95%', brand: 'H&M', trend: '+8%' },
                  { name: 'Premium Ankle Boots', price: '$180', match: '92%', brand: 'Nike', trend: '+22%' }
                ].map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.5, repeat: Infinity, repeatDelay: 4 }}
                    className="bg-white/20 rounded-lg p-4 flex justify-between items-center"
                  >
                    <div className="flex items-center space-x-3">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                        className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg"
                      ></motion.div>
                      <div>
                        <p className="text-white font-medium">{item.name}</p>
                        <p className="text-white/70 text-sm">{item.brand} • {item.price}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-bold text-lg">{item.match}</div>
                      <div className="text-orange-400 text-sm flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {item.trend}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-center bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-4 rounded-lg"
              >
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <ShoppingBag className="w-6 h-6" />
                  <Trending className="w-6 h-6" />
                </div>
                <p className="font-bold text-lg">1000+ Premium Brands</p>
                <p className="text-sm opacity-90">Real-time trend analysis</p>
              </motion.div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const features = [
    {
      icon: Sparkles,
      title: 'AI Style Recommendations',
      description: 'Get personalized outfit suggestions based on your wardrobe, body type, and style preferences',
      color: 'from-purple-500 to-pink-500',
      action: () => navigate('/recommendations'),
      stats: '95% accuracy'
    },
    {
      icon: Camera,
      title: '3D Virtual Model',
      description: 'See how outfits look on a realistic 3D avatar that matches your body type and skin tone',
      color: 'from-blue-500 to-cyan-500',
      action: () => navigate('/recommendations'),
      stats: 'Photorealistic'
    },
    {
      icon: Shirt,
      title: 'Digital Wardrobe',
      description: 'Upload and organize your clothing items with smart categorization and color analysis',
      color: 'from-green-500 to-emerald-500',
      action: () => navigate('/wardrobe'),
      stats: `${items.length} items`
    },
    {
      icon: ShoppingBag,
      title: 'Smart Shopping',
      description: 'Discover new items that perfectly complement your existing wardrobe',
      color: 'from-orange-500 to-red-500',
      action: () => navigate('/marketplace'),
      stats: '1000+ brands'
    }
  ];

  const quickActions = [
    {
      icon: Shirt,
      title: 'Add First Item',
      description: 'Start building your digital wardrobe',
      action: () => navigate('/wardrobe'),
      color: 'bg-purple-600'
    },
    {
      icon: User,
      title: 'Complete Profile',
      description: 'Set your style preferences',
      action: () => navigate('/profile'),
      color: 'bg-blue-600'
    },
    {
      icon: Sparkles,
      title: 'Get Recommendations',
      description: 'See AI-powered outfit ideas',
      action: () => navigate('/recommendations'),
      color: 'bg-green-600'
    },
    {
      icon: ShoppingBag,
      title: 'Explore Marketplace',
      description: 'Discover new fashion items',
      action: () => navigate('/marketplace'),
      color: 'bg-pink-600'
    }
  ];

  const achievements = [
    { icon: Star, title: 'Style Explorer', progress: 100, description: 'Signed up for StyleAI' },
    { icon: Shirt, title: 'Wardrobe Builder', progress: Math.min((items.length / 10) * 100, 100), description: `Add ${Math.max(10 - items.length, 0)} more items` },
    { icon: Sparkles, title: 'AI Enthusiast', progress: 25, description: 'Get your first recommendation' },
    { icon: Crown, title: 'Style Master', progress: 10, description: 'Complete 50 outfit combinations' }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fashion Background */}
      <FashionBackground />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Welcome Animation */}
        {showWelcomeAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-center"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="bg-white rounded-full p-8 mb-6 mx-auto w-32 h-32 flex items-center justify-center"
              >
                <Shirt className="w-16 h-16 text-purple-600" />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-4xl font-bold text-white mb-4"
              >
                Welcome to StyleAI, {user?.name}!
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="text-xl text-white/90"
              >
                Your personal AI style assistant is ready
              </motion.p>
            </motion.div>
          </motion.div>
        )}

        {/* Enhanced Interactive Demo Modal */}
        {showVideoModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-gray-900/95 backdrop-blur-sm transition-opacity"
                onClick={() => {
                  setShowVideoModal(false);
                  setIsPlaying(false);
                  setDemoProgress(0);
                }}
              />

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Enhanced Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-full p-2">
                      <Play className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {fashionContent[currentContentIndex].title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {fashionContent[currentContentIndex].description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    >
                      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={() => {
                        setShowVideoModal(false);
                        setIsPlaying(false);
                        setDemoProgress(0);
                      }}
                      className="p-2 text-gray-500 hover:text-gray-700 rounded-lg transition-all"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 h-1">
                  <motion.div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-1"
                    style={{ width: `${demoProgress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>

                {/* Interactive Demo Content */}
                <div className="p-6">
                  <div className="h-96 lg:h-[500px] rounded-lg overflow-hidden">
                    {renderInteractiveDemo(fashionContent[currentContentIndex].demoType)}
                  </div>
                </div>

                {/* Enhanced Modal Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      {fashionContent.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setCurrentContentIndex(index);
                            setDemoProgress(0);
                            setCurrentDemoStep(0);
                          }}
                          className={`w-3 h-3 rounded-full transition-all ${
                            index === currentContentIndex ? 'bg-purple-600 w-8' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-600">
                        {currentContentIndex + 1} of {fashionContent.length}
                      </span>
                      <button
                        onClick={() => {
                          const prevIndex = (currentContentIndex - 1 + fashionContent.length) % fashionContent.length;
                          setCurrentContentIndex(prevIndex);
                          setDemoProgress(0);
                          setCurrentDemoStep(0);
                        }}
                        className="flex items-center space-x-1 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Previous</span>
                      </button>
                      <button
                        onClick={() => {
                          const nextIndex = (currentContentIndex + 1) % fashionContent.length;
                          setCurrentContentIndex(nextIndex);
                          setDemoProgress(0);
                          setCurrentDemoStep(0);
                        }}
                        className="flex items-center space-x-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        <span>Next Demo</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {/* Main Dashboard */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              {/* Left Content */}
              <div className="space-y-6">
                <div>
                  <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl font-bold text-gray-900 mb-4"
                  >
                    Welcome to the Future of
                    <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Personal Styling
                    </span>
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-xl text-gray-600 leading-relaxed"
                  >
                    StyleAI combines cutting-edge artificial intelligence with fashion expertise to revolutionize how you discover, organize, and style your wardrobe.
                  </motion.p>
                </div>

                {/* Key Benefits */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-100 rounded-full p-2">
                      <Zap className="w-5 h-5 text-purple-600" />
                    </div>
                    <span className="text-gray-700 font-medium">AI-Powered</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 rounded-full p-2">
                      <Camera className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-gray-700 font-medium">3D Visualization</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 rounded-full p-2">
                      <Target className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="text-gray-700 font-medium">Personalized</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="bg-pink-100 rounded-full p-2">
                      <Heart className="w-5 h-5 text-pink-600" />
                    </div>
                    <span className="text-gray-700 font-medium">Style-Focused</span>
                  </div>
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <button
                    onClick={() => navigate('/wardrobe')}
                    className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg transform hover:scale-105"
                  >
                    <Shirt className="w-5 h-5" />
                    <span>Start Building Wardrobe</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleWatchDemo}
                    className="flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                  >
                    <Play className="w-5 h-5" />
                    <span>Watch Demo</span>
                  </button>
                </motion.div>
              </div>

              {/* Right Content - Enhanced Interactive Demo Preview */}
              <div className="relative">
                <motion.div
                  key={currentContentIndex}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="relative h-80 rounded-2xl overflow-hidden shadow-2xl cursor-pointer group"
                  onClick={() => handlePlayDemo(currentContentIndex)}
                >
                  <img
                    src={fashionContent[currentContentIndex].thumbnail}
                    alt={fashionContent[currentContentIndex].title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-lg font-semibold mb-1">
                      {fashionContent[currentContentIndex].title}
                    </h3>
                    <p className="text-sm opacity-90">
                      {fashionContent[currentContentIndex].description}
                    </p>
                  </div>
                  
                  {/* Enhanced Play Button with Animation */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      animate={{ 
                        scale: [1, 1.05, 1],
                        boxShadow: ['0 0 0 0 rgba(147, 51, 234, 0.7)', '0 0 0 20px rgba(147, 51, 234, 0)', '0 0 0 0 rgba(147, 51, 234, 0)']
                      }}
                      transition={{ 
                        scale: { duration: 2, repeat: Infinity },
                        boxShadow: { duration: 2, repeat: Infinity }
                      }}
                      className="bg-white/20 backdrop-blur-sm rounded-full p-6 hover:bg-white/30 transition-all border-2 border-white/30"
                    >
                      <Play className="w-8 h-8 text-white ml-1" />
                    </motion.button>
                  </div>

                  {/* Interactive Badge */}
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-medium"
                  >
                    🎬 Interactive Demo
                  </motion.div>

                  {/* Auto-play indicator */}
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute top-4 left-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1"
                  >
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>Auto-Play</span>
                  </motion.div>
                </motion.div>

                {/* Enhanced Content Indicators */}
                <div className="flex justify-center space-x-2 mt-4">
                  {fashionContent.map((content, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentContentIndex(index)}
                      className={`transition-all ${
                        index === currentContentIndex 
                          ? 'w-8 h-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full' 
                          : 'w-3 h-3 bg-gray-300 rounded-full hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>

                {/* Quick Demo Access */}
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {fashionContent.slice(0, 4).map((content, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handlePlayDemo(index)}
                      className="text-xs p-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-purple-100 hover:to-pink-100 rounded-lg transition-all text-gray-700 hover:text-purple-700 font-medium"
                    >
                      {content.title.split(' ')[0]} Demo
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          {items.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-full p-2">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Quick Start Guide</h3>
                  <p className="text-gray-600">Get the most out of StyleAI in just a few steps</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={action.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={action.action}
                    className="p-6 bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all text-left group"
                  >
                    <div className={`${action.color} rounded-full p-3 w-fit mb-4 group-hover:scale-110 transition-transform`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">{action.title}</h4>
                    <p className="text-sm text-gray-600 mb-4">{action.description}</p>
                    <div className="flex items-center text-purple-600 text-sm font-medium">
                      <span>Get Started</span>
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6 cursor-pointer group"
                onClick={feature.action}
              >
                <div className="flex items-start space-x-4">
                  <div className={`bg-gradient-to-r ${feature.color} rounded-xl p-3 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {feature.stats}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{feature.description}</p>
                    <div className="flex items-center text-purple-600 text-sm font-medium group-hover:text-purple-700">
                      <span>Explore Feature</span>
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Achievements & Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full p-2">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Your Style Journey</h3>
                <p className="text-gray-600">Track your progress and unlock achievements</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-200"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`rounded-full p-2 ${achievement.progress === 100 ? 'bg-green-100' : 'bg-gray-100'}`}>
                      <achievement.icon className={`w-5 h-5 ${achievement.progress === 100 ? 'text-green-600' : 'text-gray-600'}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">{achievement.title}</h4>
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-600">{achievement.progress}%</span>
                      {achievement.progress === 100 && (
                        <span className="text-xs text-green-600 font-medium">Complete!</span>
                      )}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${achievement.progress}%` }}
                        transition={{ delay: 1 + index * 0.1, duration: 1 }}
                        className={`h-2 rounded-full ${achievement.progress === 100 ? 'bg-green-500' : 'bg-purple-500'}`}
                      />
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-500">{achievement.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
          >
            {[
              { icon: Shirt, label: 'Wardrobe Items', value: items.length, color: 'from-purple-500 to-pink-500' },
              { icon: Sparkles, label: 'AI Recommendations', value: '0', color: 'from-blue-500 to-cyan-500' },
              { icon: TrendingUp, label: 'Style Score', value: '85%', color: 'from-green-500 to-emerald-500' },
              { icon: Calendar, label: 'Days Active', value: '1', color: 'from-orange-500 to-red-500' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + index * 0.1 }}
                className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6 text-center"
              >
                <div className={`bg-gradient-to-r ${stat.color} rounded-full p-3 w-fit mx-auto mb-4`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
