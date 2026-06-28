"use client"
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, ChefHat, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

const FeatureSection = () => {
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('https://recipehub-server-side.vercel.app/api/recipes?isFeatured=true')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch recipes');
        return res.json();
      })
      .then((data) => {
        setFeaturedRecipes(data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading featured recipes:", err);
        setLoading(false);
      });
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-800">
            Featured <span className="text-orange-500">Recipes</span>
          </h2>
          <p className="text-gray-500 mt-2">Handpicked delicious recipes by our top community members</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
          </div>
        ) : featuredRecipes.length === 0 ? (
          <p className="text-center text-gray-400 py-10">No featured recipes yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredRecipes.map((recipe, index) => (
              <motion.div
                key={recipe._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all"
              >
                <img src={recipe.recipeImage} alt={recipe.recipeName} className="w-full h-56 object-cover" />
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1 rounded-full uppercase">
                      {recipe.category}
                    </span>
                    <span className="text-gray-400 text-sm flex items-center gap-1">
                      <ChefHat size={16} /> {recipe.cuisineType}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 mb-4">{recipe.recipeName}</h3>

                  <div className="flex items-center justify-between border-t pt-4">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Clock size={18} className="text-rose-500" />
                      <span className="text-sm font-medium">{recipe.preparationTime} Mins</span>
                    </div>
                    <Link href={`/browseRecipes/${recipe._id}`} className="text-sm font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1">
                      View Details <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeatureSection;