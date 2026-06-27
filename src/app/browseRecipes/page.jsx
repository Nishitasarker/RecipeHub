"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Clock, ChefHat, Utensils, Search, Loader2, ArrowRight,
  ChevronLeft, ChevronRight 
} from 'lucide-react';

const BrowseRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');     // ইনপুট বক্সের আসল ভ্যালু
  const [searchQuery, setSearchQuery] = useState('');      // ডিবাউন্স হয়ে API তে যাবে
  const [selectedCategory, setSelectedCategory] = useState('All');

  // পেজিনেশন স্টেট
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const RECIPES_PER_PAGE = 9;

  const categoryOptions = [
    'All', 'Foods', 'Quick & Easy', 'Healthy', 'Dessert',
    'Drinks & Juice', 'Bakery', 'Sea Food', 'Traditional'
  ];

  // 🎯 সার্চ ইনপুটে টাইপ করার ৫০০ms পর আসল searchQuery আপডেট হবে (ডিবাউন্স)
  // এটা ছাড়া প্রতি অক্ষরে একটা করে API কল হয়ে যাবে
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
      setCurrentPage(1); // নতুন সার্চ হলে page 1 এ ফিরে যাও
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // ক্যাটাগরি পরিবর্তন হলে page 1 এ রিসেট
  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  // 🟢 Server-side pagination অনুযায়ী ডেটা ফেচ — page/category/search পরিবর্তন হলেই নতুন কল হবে
  useEffect(() => {
    setLoading(true);

    const params = new URLSearchParams({
      page: currentPage,
      limit: RECIPES_PER_PAGE,
    });
    if (selectedCategory !== 'All') params.append('category', selectedCategory);
    if (searchQuery.trim() !== '') params.append('search', searchQuery.trim());

    fetch(`http://localhost:5000/api/recipes?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch recipes');
        return res.json();
      })
      .then((data) => {
        setRecipes(data.data || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalCount(data.pagination?.totalCount || 0);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading recipes:", err);
        setLoading(false);
      });
  }, [currentPage, selectedCategory, searchQuery]);

  // পেজ নাম্বার বাটনগুলো জেনারেট করার হেল্পার
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
        <p className="text-neutral-500 font-medium">Loading Culinary Masterpieces...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-neutral-50 via-stone-50 to-orange-50/10">
      <div className="max-w-7xl mx-auto">

        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-neutral-800">
            Explore Global <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Recipes</span>
          </h1>
          <p className="text-neutral-500 font-medium text-base">
            Discover culinary secrets from across the globe. Use the category chips below to find exactly what you're craving!
          </p>
        </div>

        <div className="bg-white border border-neutral-200/80 shadow-xl shadow-neutral-100 rounded-3xl p-5 mb-10 space-y-5">
          <div className="relative max-w-md mx-auto md:mx-0">
            <input 
              type="text"
              placeholder="Search by recipe name or cuisine..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-orange-500 text-neutral-800 text-sm font-medium"
            />
            <Search className="absolute left-4 top-4 text-neutral-400" size={18} />
          </div>

          <hr className="border-neutral-100" />

          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Filter By Category</p>
            <div className="flex flex-wrap gap-2">
              {categoryOptions.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 ${
                    selectedCategory === cat 
                      ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-md shadow-orange-500/20 scale-105'
                      : 'bg-neutral-50 border border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  {cat === 'All' ? '🌐 All Categories' : cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* রেজাল্ট কাউন্ট */}
        <p className="text-sm text-neutral-500 mb-6 font-medium">
          Showing <span className="font-bold text-neutral-700">{recipes.length}</span> of{' '}
          <span className="font-bold text-neutral-700">{totalCount}</span> recipes
          {totalPages > 1 && <> — Page {currentPage} of {totalPages}</>}
        </p>

        <AnimatePresence mode="popLayout">
          {recipes.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-20 bg-white border border-dashed border-neutral-300 rounded-3xl"
            >
              <Utensils className="mx-auto text-neutral-300 mb-4" size={48} />
              <h3 className="text-lg font-bold text-neutral-700">No Recipes Found</h3>
              <p className="text-neutral-400 text-sm mt-1">We couldn't find any recipes in the "{selectedCategory}" category matching your request.</p>
            </motion.div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {recipes.map((recipe) => (
                <motion.div
                  key={recipe._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white border border-neutral-200/70 shadow-lg hover:shadow-2xl rounded-2xl overflow-hidden flex flex-col group transition-all duration-300"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                    <img 
                      src={recipe.recipeImage || "https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=800"} 
                      alt={recipe.recipeName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-orange-600 text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg shadow-sm border border-neutral-100">
                      {recipe.category}
                    </span>
                  </div>

                  <div className="p-6 flex flex-col flex-1 space-y-4">
                    <div className="space-y-1.5">
                      <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">{recipe.cuisineType} Cuisine</p>
                      <h3 className="text-xl font-bold text-neutral-800 line-clamp-1 group-hover:text-orange-600 transition-colors">
                        {recipe.recipeName}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-neutral-50/80 border border-neutral-100 rounded-xl text-xs font-semibold text-neutral-600">
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} className="text-neutral-400" />
                        <span>{recipe.preparationTime} Mins</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <ChefHat size={14} className="text-neutral-400" />
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          recipe.difficultyLevel === 'Easy' ? 'bg-green-50 text-green-600 border border-green-100' :
                          recipe.difficultyLevel === 'Medium' ? 'bg-yellow-50 text-yellow-600 border border-yellow-100' :
                          'bg-red-50 text-red-600 border border-red-100'
                        }`}>
                          {recipe.difficultyLevel || 'Easy'}
                        </span>
                      </div>
                    </div>

                    <div className='flex justify-between'>
                      <div className="text-xs text-neutral-500 font-medium pt-1">
                        Listed by: <span className="font-bold text-neutral-700">
                          {recipe.authorName ? recipe.authorName.split(' ')[0] : 'Anonymous Chef'}</span>
                      </div>
                      <div className="text-xs text-neutral-500 font-medium pt-1">
                        Published on:
                        <span className="text-xs font-bold text-neutral-700">
                          {new Date(recipe.createdAt).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric' })} </span>
                      </div>
                    </div>

                    <div className="pt-2 mt-auto">
                      <Link href={`/browseRecipes/${recipe._id}`} className="w-full py-3 bg-neutral-50 hover:bg-orange-600 hover:text-white text-neutral-800 border border-neutral-200 hover:border-orange-600 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all group/btn shadow-sm">
                        <span>View Details</span>
                        <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 🎯 PAGINATION CONTROLS */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2.5 rounded-xl border border-neutral-200 bg-white text-neutral-600 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white transition-all"
            >
              <ChevronLeft size={18} />
            </button>

            {getPageNumbers()[0] > 1 && (
              <>
                <button onClick={() => goToPage(1)} className="w-10 h-10 rounded-xl text-sm font-bold text-neutral-500 hover:bg-neutral-100">1</button>
                <span className="text-neutral-400">...</span>
              </>
            )}

            {getPageNumbers().map((num) => (
              <button
                key={num}
                onClick={() => goToPage(num)}
                className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                  currentPage === num
                    ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-md'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                {num}
              </button>
            ))}

            {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
              <>
                <span className="text-neutral-400">...</span>
                <button onClick={() => goToPage(totalPages)} className="w-10 h-10 rounded-xl text-sm font-bold text-neutral-500 hover:bg-neutral-100">{totalPages}</button>
              </>
            )}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2.5 rounded-xl border border-neutral-200 bg-white text-neutral-600 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default BrowseRecipes;