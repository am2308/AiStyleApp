import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { Shirt, User, ShoppingBag, Sparkles, LogOut, Menu, X, Home, Users, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { isSubscribed } = useSubscription();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  // Show different navbar based on authentication status and current page
  const isLandingPage = location.pathname === '/';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  // Landing page navbar (transparent overlay)
  if (isLandingPage) {
    return (
      <nav className="absolute top-0 left-0 right-0 z-30 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-full p-2">
                <Shirt className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                StyleAI
              </span>
            </Link>
            
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="text-white/90 hover:text-white transition-colors font-medium"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={logout}
                    className="text-white/90 hover:text-white transition-colors font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-white/90 hover:text-white transition-colors font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    );
  }

  // Don't show navbar on auth pages
  if (isAuthPage) {
    return null;
  }

  // Authenticated user navbar
  if (isAuthenticated) {
    const navigationItems = [
      {
        name: 'Dashboard',
        path: '/dashboard',
        icon: Home,
        description: 'Overview and quick actions'
      },
      {
        name: 'Wardrobe',
        path: '/wardrobe',
        icon: Shirt,
        description: 'Manage your clothing items'
      },
      {
        name: 'Recommendations',
        path: '/recommendations',
        icon: Sparkles,
        description: 'AI-powered outfit suggestions'
      },
      {
        name: 'Marketplace',
        path: '/marketplace',
        icon: ShoppingBag,
        description: 'Discover new fashion items'
      },
      {
        name: 'Community',
        path: '/community',
        icon: Users,
        description: 'Share and discover styles'
      },
      {
        name: 'Profile',
        path: '/profile',
        icon: User,
        description: 'Manage your style preferences'
      }
    ];

    return (
      <nav className="relative z-20 bg-white/95 backdrop-blur-md shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-full p-2">
                <Shirt className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                StyleAI
              </span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all group ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 shadow-sm'
                      : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                  }`}
                >
                  <item.icon size={18} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
              
              {/* Subscription Button */}
              <Link
                to="/subscription"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  isActive('/subscription')
                    ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 shadow-sm'
                    : isSubscribed 
                      ? 'bg-gradient-to-r from-yellow-100 to-amber-100 text-amber-700'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                }`}
              >
                <Crown size={18} />
                <span className="font-medium">{isSubscribed ? 'Premium' : 'Upgrade'}</span>
              </Link>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {/* Welcome Message */}
              <div className="hidden lg:block text-right">
                <p className="text-sm text-gray-600">Welcome back,</p>
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              </div>

              {/* Logout Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline font-medium">Logout</span>
              </motion.button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-md"
              >
                <div className="py-4 space-y-2">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                        isActive(item.path)
                          ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700'
                          : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                      }`}
                    >
                      <item.icon size={20} />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.description}</p>
                      </div>
                    </Link>
                  ))}
                  
                  {/* Mobile Subscription Button */}
                  <Link
                    to="/subscription"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                      isActive('/subscription')
                        ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700'
                        : isSubscribed 
                          ? 'bg-gradient-to-r from-yellow-100 to-amber-100 text-amber-700'
                          : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    }`}
                  >
                    <Crown size={20} />
                    <div>
                      <p className="font-medium">{isSubscribed ? 'Premium Active' : 'Upgrade to Premium'}</p>
                      <p className="text-xs text-gray-500">
                        {isSubscribed ? 'Manage subscription' : 'Unlock all features'}
                      </p>
                    </div>
                  </Link>
                  
                  {/* Mobile User Info */}
                  <div className="px-4 py-3 border-t border-gray-200 mt-4">
                    <p className="text-sm text-gray-600">Signed in as</p>
                    <p className="font-medium text-gray-900">{user?.name}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
    );
  }

  // Unauthenticated user navbar (for other pages)
  return (
    <nav className="relative z-20 bg-white/95 backdrop-blur-md shadow-lg border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-full p-2">
              <Shirt className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              StyleAI
            </span>
          </Link>
          <div className="flex space-x-4">
            <Link
              to="/login"
              className="text-gray-600 hover:text-purple-600 transition-colors font-medium"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
