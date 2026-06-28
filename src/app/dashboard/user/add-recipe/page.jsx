"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import { imageUpload } from "../../../../lib/imgUpload";
import {
  Plus, X, Upload, ChefHat, Clock, AlertCircle,
  Sparkles, Flame, CheckCircle2, Lock, ChevronDown
} from 'lucide-react';

const AddRecipe = () => {
  const { data: session } = authClient.useSession();

  // Form States
  const [recipeName, setRecipeName] = useState('');
  const [category, setCategory] = useState(''); 
  const [cuisineType, setCuisineType] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('Easy');
  const [preparationTime, setPreparationTime] = useState('');
  const [instructions, setInstructions] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');


  const [limitInfo, setLimitInfo] = useState(null);

  
  const categoryOptions = [
    'Foods',
    'Quick & Easy',
    'Healthy',
    'Dessert',
    'Drinks & Juice',
    'Bakery',
    'Sea Food',
    'Traditional'
  ];

  
 useEffect(() => {
  const fetchLimitStatus = async () => {
    if (!session?.user) return;
    try {
      
      const { data: sessionData } = await authClient.getSession();
      const token = sessionData?.session?.token;
      if (!token) return;

      const res = await fetch('https://recipehub-server-side.vercel.app/api/recipes/my-status', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.success) setLimitInfo(json);
    } catch (err) {
      console.error("Could not fetch recipe limit status:", err);
    }
  };
  fetchLimitStatus();
}, [session]);


  const handleAddIngredient = (e) => {
    e.preventDefault();
    if (currentIngredient.trim() && !ingredients.includes(currentIngredient.trim())) {
      setIngredients([...ingredients, currentIngredient.trim()]);
      setCurrentIngredient('');
    }
  };

  const handleRemoveIngredient = (indexToRemove) => {
    setIngredients(ingredients.filter((_, index) => index !== indexToRemove));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    
    if (limitInfo && !limitInfo.isPremium && !limitInfo.canAddMore) {
  const msg = "🔒 You've used all your free recipe slots! Upgrade to Premium to add unlimited recipes.";
  setErrorMsg(msg);
  toast.error(msg, { autoClose: 5000 });
  setIsSubmitting(false);
  return;
}

    
    if (!category || ingredients.length === 0 || !imageFile || !session?.user) {
      const msg = "Please fill all required fields correctly.";
      setErrorMsg(msg);
      toast.error(msg);
      setIsSubmitting(false);
      return;
    }

    try {
      const uploadedImageUrl = await imageUpload(imageFile);
      if (!uploadedImageUrl) throw new Error('Image upload failed.');

      const recipePayload = {
        recipeName,
        recipeImage: uploadedImageUrl,
        category,
        cuisineType,
        difficultyLevel,
        preparationTime: parseInt(preparationTime, 10),
        ingredients,
        instructions,
      };

      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recipePayload),
      });

      const dbData = await response.json();

      if (response.status === 403 && dbData.code === "RECIPE_LIMIT_REACHED") {
      const msg = "🔒 You've used all your free recipe slots! Upgrade to Premium to add unlimited recipes.";
      setErrorMsg(msg);
      toast.error(msg, { autoClose: 5000 });
      setIsSubmitting(false);
      return;}

if (!response.ok || !dbData.success) {
  throw new Error(dbData.message || 'Failed to sync recipe data.');
}

      if (!response.ok || !dbData.success) {
        throw new Error(dbData.message || 'Failed to sync recipe data.');
      }

      
      toast.success('🎉 Masterpiece successfully published!');

      
      setRecipeName('');
      setCategory('');
      setCuisineType('');
      setPreparationTime('');
      setInstructions('');
      setIngredients([]);
      setImageFile(null);
      setImagePreview(null);

      setLimitInfo((prev) =>
        prev ? { ...prev, count: prev.count + 1, canAddMore: prev.isPremium || prev.count + 1 < prev.limit } : prev
      );

    } catch (err) {
      console.error("Recipe Submit Error: ", err);
      setErrorMsg(err.message);
      
      toast.error(err.message || 'Failed to add recipe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-neutral-50 via-orange-50/20 to-stone-50">
      <div className="max-w-4xl mx-auto">

        <div className="flex flex-col items-center text-center mb-10 space-y-3">
          <div className="p-4 bg-orange-500/10 text-orange-600 rounded-full border border-orange-200 shadow-inner">
            <ChefHat size={36} />
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-neutral-800">
            Craft a New <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Masterpiece</span>
          </h1>
        </div>

       
        <AnimatePresence>
          {limitInfo && !limitInfo.canAddMore && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-amber-50 border border-amber-200 shadow-sm rounded-xl p-4 mb-6 flex items-start gap-3"
            >
              <Lock size={20} className="text-amber-600 shrink-0 mt-0.5" />
              <div className="text-sm font-semibold text-amber-800">
               You’ve hit the maximum recipe limit for your current plan. Upgrade to Premium to keep publishing your culinary masterpieces.              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="alert bg-red-50 border border-red-200 shadow-sm rounded-xl p-4 mb-8 flex items-start gap-3"
            >
              <AlertCircle size={20} className="text-red-600 shrink-0 mt-0.5" />
              <div className="text-sm font-semibold text-red-800">{errorMsg}</div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-8 bg-white/80 backdrop-blur-md border border-neutral-200/80 shadow-2xl shadow-neutral-200/50 rounded-3xl p-6 md:p-10">

          <div className="space-y-6">
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-neutral-400">
              <Sparkles size={16} className="text-orange-500" />
              <span>Identity & Showcase</span>
            </div>

            <div className="form-control w-full">
              <label className="label text-neutral-700 font-bold text-sm mb-1.5">Recipe Title <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="e.g., Smoked Honey Glazed Salmon"
                className="w-full px-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-xl font-medium focus:outline-none focus:border-orange-500 text-neutral-800"
                value={recipeName}
                onChange={(e) => setRecipeName(e.target.value)}
                required
              />
            </div>

            <div className="form-control w-full">
              <label className="label text-neutral-700 font-bold text-sm mb-1.5">Cover Image Selection <span className="text-red-500">*</span></label>
              <div className="relative group border-2 border-dashed border-neutral-300 hover:border-orange-500 rounded-2xl p-6 flex flex-col items-center justify-center bg-neutral-50/50 cursor-pointer min-h-[220px]">
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                  onChange={handleImageChange}
                />
                {imagePreview ? (
                  <div className="w-full text-center space-y-3">
                    <img src={imagePreview} alt="Preview" className="max-h-60 rounded-xl object-cover mx-auto border border-neutral-200 shadow-md" />
                  </div>
                ) : (
                  <div className="text-center space-y-3 py-4">
                    <div className="mx-auto w-12 h-12 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center">
                      <Upload size={24} />
                    </div>
                    <p className="text-sm font-bold text-neutral-700">Click or Drag your file here</p>
                    <p className="text-xs text-neutral-400 mt-1">Only high-quality JPG, JPEG, PNG, or WEBP images up to 32MB are accepted.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <hr className="border-neutral-100" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
           
            <div className="form-control w-full">
              <label className="label text-neutral-700 font-bold text-sm mb-1.5">Category <span className="text-red-500">*</span></label>
              <div className="relative">
                <select 
                  className="w-full px-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-xl font-medium text-neutral-800 appearance-none focus:outline-none focus:border-orange-500" 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)} 
                  required
                >
                  <option value="" disabled hidden>Select a Category</option>
                  {categoryOptions.map((cat, idx) => (
                    <option key={idx} value={cat}>{cat}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-neutral-400">
                  <ChevronDown size={18} />
                </div>
              </div>
            </div>

            <div className="form-control w-full">
              <label className="label text-neutral-700 font-bold text-sm mb-1.5">Cuisine Type <span className="text-red-500">*</span></label>
              <input type="text" placeholder="e.g., Italian" className="w-full px-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-800 focus:outline-none focus:border-orange-500" value={cuisineType} onChange={(e) => setCuisineType(e.target.value)} required />
            </div>

            <div className="form-control w-full">
              <label className="label text-neutral-700 font-bold text-sm mb-1.5">Difficulty Level</label>
              <div className="relative">
                <select className="w-full px-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-xl font-semibold text-neutral-800 appearance-none focus:outline-none focus:border-orange-500" value={difficultyLevel} onChange={(e) => setDifficultyLevel(e.target.value)}>
                  <option value="Easy">🟢 Easy</option>
                  <option value="Medium">🟡 Medium</option>
                  <option value="Hard">🔴 Hard</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-neutral-500"><Flame size={16} /></div>
              </div>
            </div>

            <div className="form-control w-full">
              <label className="label text-neutral-700 font-bold text-sm mb-1.5">Preparation Time (Minutes) *</label>
              <div className="relative">
                <input type="number" min="1" placeholder="45" className="w-full pl-11 pr-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-800 focus:outline-none focus:border-orange-500" value={preparationTime} onChange={(e) => setPreparationTime(e.target.value)} required />
                <Clock className="absolute left-4 top-4 text-neutral-400" size={18} />
              </div>
            </div>
          </div>

          <hr className="border-neutral-100" />

          <div className="space-y-4">
            <label className="label text-neutral-700 font-bold text-sm mb-1.5">Add Ingredients <span className="text-red-500">*</span></label>
            <div className="flex gap-2">
              <input type="text" placeholder="e.g., 2 tbsp Olive Oil" className="flex-1 px-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-800 focus:outline-none focus:border-orange-500" value={currentIngredient} onChange={(e) => setCurrentIngredient(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddIngredient(e)} />
              <button type="button" onClick={handleAddIngredient} className="px-5 bg-neutral-900 hover:bg-orange-600 text-white rounded-xl font-bold"><Plus size={20} /></button>
            </div>

            <div className="flex flex-wrap gap-2 p-4 bg-neutral-50 rounded-2xl min-h-[64px] border border-neutral-200/60">
              {ingredients.length === 0 ? (
                <p className="text-xs text-neutral-400 m-auto font-medium">Ingredients list is empty.</p>
              ) : (
                ingredients.map((ing, idx) => (
                  <span key={idx} className="inline-flex items-center gap-2 bg-white border border-neutral-200 text-neutral-800 font-semibold px-3 py-1.5 rounded-xl text-xs">
                    <CheckCircle2 size={12} className="text-orange-500" />
                    {ing}
                    <button type="button" onClick={() => handleRemoveIngredient(idx)} className="text-neutral-400 hover:text-red-500"><X size={12} /></button>
                  </span>
                ))
              )}
            </div>
          </div>

          <hr className="border-neutral-100" />

          <div className="form-control w-full space-y-2">
            <label className="label text-neutral-700 font-bold text-sm">Detailed Execution Steps *</label>
            <textarea className="w-full px-4 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl text-neutral-800 h-44 text-sm focus:outline-none focus:border-orange-500" placeholder="Step 1: Pre-heat oven..." value={instructions} onChange={(e) => setInstructions(e.target.value)} required></textarea>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting || (limitInfo && !limitInfo.canAddMore)}
              className="w-full py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-2xl font-bold shadow-xl disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isSubmitting
                ? <span>Publishing Masterpiece...</span>
                : (limitInfo && !limitInfo.canAddMore)
                  ? <span>Recipe Limit Reached</span>
                  : <span>Publish Recipe to Global Platform</span>}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddRecipe;