import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Clock,
  ArrowRight,
  MessageCircle,
  Camera,
  Eye,
  Star,
  Zap,
  Gift
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { mockProducts, mockUser } from '../data/mockData';
import { ProductCard } from '../components/Common/ProductCard';
import type { Product } from '../types';

export const Home: React.FC = () => {
  const { user, setUser, setProducts, products } = useStore();
  
  useEffect(() => {
    // Initialize mock data
    if (!user) {
      setUser(mockUser);
    }
    if (products.length === 0) {
      setProducts(mockProducts);
    }
  }, [user, setUser, products, setProducts]);
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1026] via-[#23263b] to-[#f6f3ee] dark:from-[#0a1026] dark:via-[#23263b] dark:to-[#181a23]">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#1b223a] via-[#23263b] to-[#e9dbc7] text-[#23263b] dark:text-[#f6f3ee] overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1b223a]/80 via-[#23263b]/60 to-[#e9dbc7]/40 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight font-serif drop-shadow-lg text-gold-700 dark:text-gold-400" style={{letterSpacing: '-2px'}}>
              {getGreeting()}, {user?.name || 'Shopper'}!
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Discover your perfect products with AI-powered recommendations
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/ai-assistant"
                  className="bg-[#c9a96e] text-[#23263b] hover:bg-[#e9dbc7] px-8 py-4 rounded-xl font-semibold flex items-center space-x-2 hover:bg-gray-100 transition-colors"
                >
                  <MessageCircle size={20} />
                  <span>Ask AI Assistant</span>
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/try-on"
                  className="bg-[#23263b]/80 backdrop-blur-md text-[#f6f3ee] px-8 py-4 rounded-xl font-semibold flex items-center space-x-2 hover:bg-white/30 transition-colors"
                >
                  <Camera size={20} />
                  <span>Try-On Studio</span>
                </Link>
              </motion.div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold">{user?.loyaltyPoints || 0}</div>
                <div className="text-sm opacity-80">Points</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{user?.tier || 'Bronze'}</div>
                <div className="text-sm opacity-80">Tier</div>
              </div>
              {/* Removed Eco Tracker Score */}
              <div className="text-center">
                <div className="text-2xl font-bold">5★</div>
                <div className="text-sm opacity-80">Rating</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Quick Actions */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
          >
            <Link
              to="/visual-search"
              className="bg-[#f6f3ee] dark:bg-[#23263b] border border-[#e9dbc7] dark:border-[#23263b] shadow-xl p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[#23263b] to-[#c9a96e] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Eye className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-[#23263b] dark:text-[#f6f3ee]">Visual Search</h3>
                  <p className="text-[#6e6a5e] dark:text-[#bdb9b0] text-sm">Find products by image</p>
                </div>
              </div>
            </Link>
            
            <Link
              to="/social"
              className="bg-[#f6f3ee] dark:bg-[#23263b] border border-[#e9dbc7] dark:border-[#23263b] shadow-xl p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[#e9dbc7] to-[#c9a96e] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Star className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-[#23263b] dark:text-[#f6f3ee]">Social Hub</h3>
                  <p className="text-[#6e6a5e] dark:text-[#bdb9b0] text-sm">Share your style</p>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* Daily Deals */}
      {products.filter((product: Product) => product.discount).length > 0 && (
        <section className="py-12 bg-gradient-to-r from-[#f6f3ee] to-[#e9dbc7] dark:from-[#181a23]/80 dark:to-[#23263b]/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#c9a96e] to-[#23263b] rounded-lg flex items-center justify-center">
                    <Zap className="text-white" size={20} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[#23263b] dark:text-[#f6f3ee]">Daily Deals</h2>
                    <p className="text-[#6e6a5e] dark:text-[#bdb9b0]">Limited time offers</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-orange-600 dark:text-orange-400">
                  <Clock size={16} />
                  <span className="text-sm font-medium">Ends in 23:59:42</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.filter((product: Product) => product.discount).slice(0, 4).map((product: Product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}
      
      {/* Trending Products */}
      {products.filter((product: Product) => product.isTrending).length > 0 && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#23263b] to-[#e9dbc7] rounded-lg flex items-center justify-center">
                    <TrendingUp className="text-white" size={20} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[#23263b] dark:text-[#f6f3ee]">Trending Now</h2>
                    <p className="text-[#6e6a5e] dark:text-[#bdb9b0]">What everyone's buying</p>
                  </div>
                </div>
                <Link
                  to="/products?filter=trending"
                  className="flex items-center space-x-1 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                >
                  <span>View All</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.filter((product: Product) => product.isTrending).map((product: Product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}
      
      {/* New Arrivals */}
      {products.filter((product: Product) => product.isNew).length > 0 && (
        <section className="py-12 bg-[#f6f3ee] dark:bg-[#23263b]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#e9dbc7] to-[#23263b] rounded-lg flex items-center justify-center">
                    <Gift className="text-white" size={20} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[#23263b] dark:text-[#f6f3ee]">New Arrivals</h2>
                    <p className="text-[#6e6a5e] dark:text-[#bdb9b0]">Fresh products just for you</p>
                  </div>
                </div>
                <Link
                  to="/products?filter=new"
                  className="flex items-center space-x-1 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                >
                  <span>View All</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.filter((product: Product) => product.isNew).map((product: Product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}
      
      {/* AI Assistant CTA */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-r from-[#c9a96e] to-[#23263b] rounded-2xl p-8 md:p-12 text-white text-center"
          >
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Not sure what you're looking for?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Let our AI assistant help you find the perfect products based on your preferences, 
                mood, and budget.
              </p>
              <Link
                to="/ai-assistant"
                className="inline-flex items-center space-x-2 bg-[#c9a96e] text-[#23263b] hover:bg-[#e9dbc7] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
              >
                <MessageCircle size={20} />
                <span>Start Conversation</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};