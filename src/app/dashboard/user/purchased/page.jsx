"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from "@/lib/auth-client";
import { 
  ExternalLink, Loader2, ShoppingBag, Clock, 
  ChefHat, Calendar, DollarSign, Utensils 
} from 'lucide-react';

const MyPurchasedRecipes = () => {
  const [purchasedRecipes, setPurchasedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const { data: session } = authClient.useSession();
  const loggedInUser = session?.user;

  const fetchMyPurchases = async (email) => {
    try {
      setLoading(true);
      const response = await fetch(`https://recipehub-server-side.vercel.app/api/my-purchased-recipes?email=${email}`);
      const result = await response.json();
      if (result.success) {
        setPurchasedRecipes(result.data);
      }
    } catch (error) {
      console.error("Error fetching purchased recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loggedInUser?.email) {
      fetchMyPurchases(loggedInUser.email);
    } else {
      setLoading(false);
    }
  }, [loggedInUser?.email]);

  if (!loggedInUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-neutral-500 font-medium">Please log in to see your purchased recipes.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
        <p className="text-neutral-500 font-medium">Loading your purchased recipes...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-neutral-50">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-neutral-800">
            My Purchased <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Recipes</span>
          </h1>
          <p className="text-neutral-500 font-medium text-sm">
            All the premium recipes you've unlocked. Revisit them anytime.
          </p>
        </div>

        {purchasedRecipes.length === 0 ? (
          <div className="text-center py-20 bg-white border border-dashed border-neutral-300 rounded-3xl">
            <ShoppingBag className="mx-auto text-neutral-300 mb-4" size={48} />
            <h3 className="text-lg font-bold text-neutral-700">No Purchased Recipes Yet</h3>
            <p className="text-neutral-400 text-sm mt-1">Browse recipes and unlock premium cooking instructions.</p>
            <button
              onClick={() => router.push('/browseRecipes')}
              className="mt-5 px-5 py-2.5 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl text-sm font-bold shadow-md hover:opacity-90 transition-all"
            >
              Browse Recipes
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 ">
            {purchasedRecipes.map((item) => (
              <div
                key={item.purchaseId}
                className="bg-white border border-neutral-200/70 shadow-lg hover:shadow-2xl rounded-2xl overflow-hidden flex flex-col group transition-all duration-300"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                  <img
                    src={item.recipeImage || "https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=800"}
                    alt={item.recipeName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-orange-600 text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg shadow-sm border border-neutral-100">
                    {item.category}
                  </span>
                  <span className="absolute top-4 right-4 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg shadow-sm flex items-center gap-1">
                    <ShoppingBag size={12} /> Purchased
                  </span>
                </div>

                {/* Body */}
                <div className="p-6 flex flex-col flex-1 space-y-4">
                  <div className="space-y-1.5">
                    <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
                      {item.cuisineType} Cuisine
                    </p>
                    <h3 className="text-xl font-bold text-neutral-800 line-clamp-1 group-hover:text-orange-600 transition-colors">
                      {item.recipeName}
                    </h3>
                    <p className="text-xs text-neutral-500 font-medium">
                      By <span className="font-bold text-neutral-700">{item.authorName}</span>
                    </p>
                  </div>

                  {/* Necessary Info */}
                  <div className="grid grid-cols-2 gap-2 p-3 bg-neutral-50/80 border border-neutral-100 rounded-xl text-xs font-semibold text-neutral-600">
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} className="text-neutral-400" />
                      <span>{item.preparationTime ? `${item.preparationTime} Mins` : 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <DollarSign size={14} className="text-neutral-400" />
                      <span>${item.amount?.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 col-span-2">
                      <Calendar size={14} className="text-neutral-400" />
                      <span>
                        Purchased on {new Date(item.purchasedAt).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  {/* View Details Button */}
                  <div className="pt-2 mt-auto">
                    <button
                      onClick={() => router.push(`/browseRecipes/${item.recipeId}`)}
                      className="w-full py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-md"
                    >
                      <ExternalLink size={16} />
                      <span>View Details</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPurchasedRecipes;