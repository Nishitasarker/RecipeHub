"use client"
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChefHat } from 'lucide-react';

export default function HeroSection() {
  const [isLoading, setIsLoading] = useState(true);
  const [isCategoryLoading, setIsCategoryLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false); // 🎯 হোভার স্টেট ট্র্যাকিং
  
  // 📸 স্লাইডারের হিরো ইমেজ
  const heroImages = [
    "https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=1000&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=1000&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=1000&auto=format&fit=crop"  
  ];
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const mainTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    const categoryTimer = setTimeout(() => {
      setIsCategoryLoading(false);
    }, 2700); 

    return () => {
      clearTimeout(mainTimer);
      clearTimeout(categoryTimer);
    };
  }, []);

  // 🔄 হিরো ইমেজ স্লাইডার (প্রতি ৩ সেকেন্ডে)
  useEffect(() => {
    if (isLoading) return; 
    const imageSliderTimer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 3000); 
    return () => clearInterval(imageSliderTimer);
  }, [isLoading, heroImages.length]);

  // 🚀 HERO TEXT ANIMATION VARIANTS (Smooth Bezier)
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] } 
    }
  };

  const heroImageContainerVariant = {
    hidden: { opacity: 0, scale: 0.95, x: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      x: 0, 
      transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] } 
    }
  };

  // কারাউসেলের জন্য লাইটওয়েট ফেড ভ্যারিয়েন্ট
  const imageTransitionVariant = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5, ease: "linear" } },
    exit: { opacity: 0, transition: { duration: 0.5, ease: "linear" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.05 }
    }
  };

  const imageHover = {
    hover: { 
      scale: 1.05, 
      rotate: 1, 
      transition: { type: "spring", stiffness: 400, damping: 25 } 
    }
  };

  // 🥗 ৮মটি ক্যাটাগরি
  const categories = [
    { id: 1, name: 'Foods', img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c' }, 
    { id: 2, name: 'Quick & Easy', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38' }, 
    { id: 3, name: 'Healthy', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd' },    
    { id: 4, name: 'Dessert', img: 'https://images.unsplash.com/photo-1551024601-bec78aea704b' },    
    { id: 5, name: 'Drinks & Juice', img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd' },    
    { id: 6, name: 'Bakery', img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff' },    
    { id: 7, name: 'Sea Food', img: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=400&auto=format&fit=crop' },    
    { id: 8, name: 'Traditional', img: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab' },    
  ];

  const duplicatedCategories = [...categories, ...categories, ...categories];

  return (
    <>
      {/* 🌟 1. FULL-SCREEN INITIAL LOADER */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.4, ease: "linear" } }}
            className="fixed inset-0 bg-[#030712] z-50 flex items-center justify-center"
          >
            <div className="relative flex items-center justify-center">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-16 h-16 border-4 border-t-[#c2271d] border-b-[#e65c00] border-l-transparent border-r-transparent rounded-full"
              />
              <motion.div 
                animate={{ scale: [0.9, 1.1, 0.9] }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                className="absolute text-2xl"
              >
                <ChefHat className="w-6 h-6 text-[#e65c00]" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO MAIN BODY */}
      <div className="w-full min-h-screen bg-white font-sans overflow-hidden">
        
        {/* HERO / BANNER SECTION */}
        <section className="max-w-7xl mx-auto px-6 md:px-16 py-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <motion.div 
            initial="hidden"
            animate={isLoading ? "hidden" : "visible"}
            variants={staggerContainer}
            className="space-y-6 md:space-y-8 text-center md:text-left z-10 max-w-xl"
          >
            <motion.h1 
              variants={fadeInUp}
              className="text-2xl sm:text-xl md:text-7xl font-extrabold text-[#c2271d] leading-[1.15] tracking-tight"
            >
              Craft, Taste, & <br /> Share Your Joy
            </motion.h1>
            <motion.p 
              variants={fadeInUp}
              className="text-base sm:text-lg md:text-xl text-gray-600 font-normal leading-relaxed"
            >
              Welcome to RecipeHub, the ultimate community for food lovers. Discover thousands of mouth-watering recipes, create your own culinary masterpieces, and share your cooking passion with the world.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <motion.button 
                whileHover={{ scale: 1.02, transition: { type: "spring", stiffness: 500, damping: 15 } }}
                whileTap={{ scale: 0.98 }}
                className="bg-[#c2271d] text-white font-semibold text-lg sm:text-xl px-10 py-4 rounded-full shadow-lg shadow-red-200 hover:bg-[#a31f18] transition-colors duration-300"
              >
                Explore Recipes
              </motion.button>
            </motion.div>
          </motion.div>

          {/* AUTOMATED IMAGE CAROUSEL */}
          <motion.div 
            initial="hidden"
            animate={isLoading ? "hidden" : "visible"}
            variants={heroImageContainerVariant}
            className="relative flex justify-center md:justify-end"
          >
            <div className="w-[85%] sm:w-[75%] md:w-[110%] aspect-square rounded-full overflow-hidden shadow-2xl translate-x-4 md:translate-x-16 bg-gray-50 relative">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={currentImageIndex} 
                  src={heroImages[currentImageIndex]} 
                  alt="Delicious Food"
                  variants={imageTransitionVariant}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  style={{ willChange: "opacity" }} 
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>
            </div>
          </motion.div>
        </section>

        {/* 2. 📰 ULTRA-SMOOTH INFINITE MARQUEE WITH PAUSE ON HOVER */}
        <section className="bg-[#f9f3e7] w-full pt-20 pb-20 relative overflow-hidden">
          <div className="w-full flex flex-col items-center">
            
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 20 } }}
              viewport={{ once: true }}
              className="absolute top-2"
            >
              <button className="bg-[#e05a00] text-white text-lg sm:text-xl font-semibold px-8 py-3 rounded-full shadow-md cursor-default">
                Categories
              </button>
            </motion.div>

            {/* অনবরত মসৃণ স্ক্রোলিং ট্র্যাকার */}
            <div 
              className="w-full overflow-hidden relative mt-8 flex whitespace-nowrap"
              onMouseEnter={() => setIsHovered(true)}   // 🖱️ মাউস ভেতরে আনলে থামবে
              onMouseLeave={() => setIsHovered(false)}  // 🚪 মাউস সরালে আবার চলবে
            >
              
              <motion.div 
                className="flex gap-12 pr-12"
                // 🎯 হোভার অবস্থায় থাকলে পজিশন আটকে থাকবে, না থাকলে অ্যানিমেশন চলবে
                animate={isHovered ? {} : { x: ["0%", "-33.33%"] }} 
                transition={{
                  ease: "linear",
                  duration: 28, 
                  repeat: Infinity,
                }}
                style={{ 
                  willChange: "transform", 
                  backfaceVisibility: "hidden" 
                }}
              >
                {duplicatedCategories.map((category, index) => (
                  <div 
                    key={`${category.id}-${index}`}
                    className="flex flex-col items-center group cursor-pointer inline-block select-none"
                    style={{ minWidth: '160px' }} 
                  >
                    <motion.div 
                      variants={imageHover}
                      whileHover="hover"
                      className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-white shadow-md group-hover:shadow-xl transition-shadow duration-300 bg-white"
                    >
                      {/* CATEGORY SPINNER */}
                      <AnimatePresence>
                        {isCategoryLoading && (
                          <motion.div 
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3, ease: "linear" }}
                            className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10"
                          >
                            <div className="w-6 h-6 border-2 border-t-[#c2271d] border-b-[#e65c00] border-l-transparent border-r-transparent rounded-full animate-spin" />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <motion.img 
                        initial={{ opacity: 0 }}
                        animate={!isCategoryLoading ? { opacity: 1 } : {}}
                        transition={{ duration: 0.4 }}
                        src={category.img} 
                        alt={category.name} 
                        className="w-full h-full object-cover pointer-events-none"
                      />
                    </motion.div>
                    
                    {/* Category Title */}
                    <h3 className="mt-4 text-base sm:text-lg font-semibold text-gray-800 group-hover:text-[#e05a00] transition-colors duration-300 text-center">
                      {category.name}
                    </h3>
                  </div>
                ))}
              </motion.div>

            </div>

          </div>
        </section>

      </div>
    </>
  );
}