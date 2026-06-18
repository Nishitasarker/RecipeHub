"use client"
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChefHat } from 'lucide-react';

export default function HeroSection() {
  const [isLoading, setIsLoading] = useState(true);
  const [isCategoryLoading, setIsCategoryLoading] = useState(true);

  useEffect(() => {
    // 1. Initial full-screen loader runs for 1.2s
    const mainTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    // 2. Category grid loader component sync transitions
    const categoryTimer = setTimeout(() => {
      setIsCategoryLoading(false);
    }, 2700); // 1200ms + 1500ms

    return () => {
      clearTimeout(mainTimer);
      clearTimeout(categoryTimer);
    };
  }, []);

  // 🚀 HIGHLY INSTANCED EASE & SPRING VARIANTS
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.7, ease: [0.215, 0.610, 0.355, 1.000] } 
    }
  };

  const heroImageVariant = {
    hidden: { opacity: 0, scale: 0.92, x: 40 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      x: 0, 
      transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 }
    }
  };

  const categoryGridContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const categoryItemVariant = {
    hidden: { opacity: 0, y: 25 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.5, ease: "easeOut" } 
    }
  };

  const imageHover = {
    hover: { 
      scale: 1.06, 
      rotate: 2, 
      transition: { type: "spring", stiffness: 300, damping: 15 } 
    }
  };

  const categories = [
    { id: 1, name: 'Foods', img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c' }, 
    { id: 2, name: 'Quick & Easy', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38' }, 
    { id: 3, name: 'Healthy', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd' },    
    { id: 4, name: 'Dessert', img: 'https://images.unsplash.com/photo-1551024601-bec78aea704b' },    
  ];

  return (
    <>
      {/* 🌟 1. FULL-SCREEN INITIAL LOADER */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.45, ease: "easeInOut" } }}
            className="fixed inset-0 bg-[#030712] z-50 flex items-center justify-center"
          >
            <div className="relative flex items-center justify-center">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-16 h-16 border-4 border-t-[#c2271d] border-r-transparent border-b-[#e65c00] border-l-transparent rounded-full"
              />
              <motion.div 
                animate={{ scale: [0.85, 1.15, 0.85] }}
                transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
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
                whileHover={{ scale: 1.03, transition: { type: "spring", stiffness: 400, damping: 10 } }}
                whileTap={{ scale: 0.97 }}
                className="bg-[#c2271d] text-white font-semibold text-lg sm:text-xl px-10 py-4 rounded-full shadow-lg shadow-red-200 hover:bg-[#a31f18] transition-colors duration-300"
              >
                Explore Recipes
              </motion.button>
            </motion.div>
          </motion.div>

          <motion.div 
            initial="hidden"
            animate={isLoading ? "hidden" : "visible"}
            variants={heroImageVariant}
            className="relative flex justify-center md:justify-end"
          >
            <div className="w-[85%] sm:w-[75%] md:w-[110%] aspect-square rounded-full overflow-hidden shadow-2xl translate-x-4 md:translate-x-16">
              <img 
                src="https://images.unsplash.com/photo-1551183053-bf91a1d81141" 
                alt="Delicious Risotto Plate"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </section>

        {/* 2. CATEGORIES SECTION */}
        <section className="bg-[#f9f3e7] w-full pt-16 pb-20 px-6 md:px-12 relative">
          <div className="max-w-7xl mx-auto flex flex-col items-center">
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }}
              viewport={{ once: true }}
              className="absolute -top-7"
            >
              <button className="bg-[#e05a00] text-white text-lg sm:text-xl font-semibold px-12 py-4 rounded-full shadow-md cursor-default">
                Categories
              </button>
            </motion.div>

            {/* Categories Grid list with enhanced Viewport Staggering */}
            <motion.div 
              variants={categoryGridContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 w-full mt-8"
            >
              {categories.map((category) => (
                <motion.div 
                  key={category.id}
                  variants={categoryItemVariant}
                  className="flex flex-col items-center group cursor-pointer"
                >
                  <motion.div 
                    variants={imageHover}
                    whileHover="hover"
                    className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-white shadow-md group-hover:shadow-xl transition-shadow duration-300 bg-white"
                  >
                    
                    {/* ⏳ TIMED CATEGORY SPINNER WITH FADE OUT */}
                    <AnimatePresence>
                      {isCategoryLoading && (
                        <motion.div 
                          initial={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                          className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10"
                        >
                          <div className="w-6 h-6 border-2 border-t-[#c2271d] border-b-[#e65c00] border-l-transparent border-r-transparent rounded-full animate-spin" />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* REAL IMAGE ELEMENT WITH FADE-IN ENTRANCE MECHANISM */}
                    <motion.img 
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={!isCategoryLoading ? { opacity: 1, scale: 1 } : {}}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      src={category.img} 
                      alt={category.name} 
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  
                  {/* Category Title */}
                  <h3 className="mt-4 text-base sm:text-lg md:text-xl font-medium text-gray-800 group-hover:text-[#e05a00] transition-colors duration-300">
                    {category.name}
                  </h3>
                </motion.div>
              ))}
            </motion.div>

          </div>
        </section>

      </div>
    </>
  );
}