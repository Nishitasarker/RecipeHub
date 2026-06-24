"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, User } from 'lucide-react';

const PopularRecipes = () => {
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetch('http://localhost:5000/api/popular-recipes')
      .then((res) => res.json())
      .then((data) => {
        setPopular(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching popular recipes:", err);
        setLoading(false);
      });
  }, []);


   if (loading) return (
    <section className="py-20 bg-stone-50 flex justify-center">
      <p className="text-stone-400 font-medium animate-pulse">Loading popular recipes...</p>
    </section>
  );

  
  return (
    // Classic neutral background
    <section className="py-20 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-serif font-bold text-neutral-800 mb-12 text-center">
          Most Liked Recipes
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {popular.map((recipe) => (
            <motion.div 
              whileHover={{ y: -8 }}
              key={recipe._id} 
              className="bg-white p-4 rounded-lg border border-stone-200 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <img 
                src={recipe.recipeImage} 
                alt={recipe.recipeName} 
                className="w-full h-56 object-cover rounded-sm mb-5" 
              />
              <h3 className="text-xl font-semibold text-neutral-900 mb-3 line-clamp-1">
                {recipe.recipeName}
              </h3>
              
              <div className="flex items-center justify-between text-sm text-stone-600 border-t pt-4 border-stone-100">
                <span className="flex items-center uppercase gap-1.5 font-medium">
                  <User size={16} className="text-stone-400" /> 
                  {recipe.authorName ? recipe.authorName.split(' ')[0] : 'Anonymous Chef'}
                </span>
                <span className="flex items-center gap-1.5 text-red-800 font-bold">
                  <ThumbsUp size={16} /> {recipe.likesCount}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularRecipes;