"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Heart, ThumbsUp, AlertTriangle, ShoppingCart, 
  Clock, ChefHat, Utensils, ArrowLeft, Loader2, CheckCircle2 
} from 'lucide-react';
import Link from 'next/link';

export default function RecipeDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  // স্টেটস
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('Spam');
  const [submittingReport, setSubmittingReport] = useState(false);

  // ১. ডাইনামিক আইডি অনুযায়ী রেসিপি ডাটা লোড করা
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`http://localhost:5000/api/recipes`)
      .then((res) => res.json())
      .then((data) => {
        // সিঙ্গেল রেসিপি ফিল্টার করে বের করা
        const foundRecipe = data.find((r) => r._id === id);
        if (foundRecipe) {
          setRecipe(foundRecipe);
          setLikes(foundRecipe.likesCount || 0);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching recipe details:", err);
        setLoading(false);
      });
  }, [id]);

  // ২. লাইক বাটন হ্যান্ডলার (Like Count বাড়ানো)
  const handleLike = async () => {
    if (isLiked) return; // একবারের বেশি লাইক আটকানো
    
    try {
      // রিয়ালিস্টিক লুকের জন্য ক্লায়েন্ট সাইডে তাৎক্ষণিক ১ বাড়িয়ে দেওয়া
      setLikes((prev) => prev + 1);
      setIsLiked(true);

      // ব্যাকএন্ডে আপডেট করার রিকোয়েস্ট (প্রয়োজনে আপনার টোকেন হেডার পাস করবেন)
      await fetch(`http://localhost:5000/api/recipes/like/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error("Error liking recipe:", error);
    }
  };

  // ৩. ফেভারিট বাটন হ্যান্ডলার (favorites কালেকশনে ডাটা সেভ)
  const handleFavorite = async () => {
    try {
      setIsFavorite(!isFavorite);
      
      // আর্কিটেকচার অনুযায়ী বডি অবজেক্ট তৈরি
      const favoriteData = {
        recipeId: id,
        addedAt: new Date()
        // ব্যাকএন্ডে verifyToken থাকলে userEmail এবং userId অটোমেটিক টোকেন থেকে বসে যাবে।
      };

      await fetch(`http://localhost:5000/api/favorites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(favoriteData)
      });
    } catch (error) {
      console.error("Error adding to favorites:", error);
    }
  };

  // ৪. রিপোর্ট সাবমিট হ্যান্ডলার (reports কালেকশনে ডাটা সেভ)
  const handleReportSubmit = async (e) => {
    e.preventDefault();
    setSubmittingReport(true);

    try {
      const reportData = {
        recipeId: id,
        reason: reportReason, // Spam, Offensive Content, Copyright Issue
        status: "pending",
        createdAt: new Date()
      };

      await fetch(`http://localhost:5000/api/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData)
      });

      alert("Recipe reported successfully to admin.");
      setIsReportModalOpen(false);
    } catch (error) {
      console.error("Error submitting report:", error);
    } finally {
      setSubmittingReport(false);
    }
  };

  // ৫. পারচেজ বাটন হ্যান্ডলার (Stripe Checkout Integration)
  const handlePurchase = async () => {
    try {
      // স্ট্রাইপ পেমেন্ট সেশনের জন্য ব্যাকএন্ডে রিকোয়েস্ট পাঠানো
      const response = await fetch(`http://localhost:5000/api/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipeId: id,
          recipeName: recipe.recipeName,
          price: 4.99 // উদাহরণস্বরূপ প্রতিটি প্রিমিয়াম রেসিপির মূল্য ৪.৯৯ ডলার
        })
      });

      const session = await response.json();
      if (session.url) {
        // স্ট্রাইপ পেমেন্ট পেজে রিডাইরেক্ট করা
        window.location.href = session.url;
      }
    } catch (error) {
      console.error("Stripe Checkout Error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
        <p className="text-neutral-500 font-medium">Fetching complete recipe details...</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 p-4 text-center">
        <Utensils className="w-16 h-16 text-neutral-300 mb-4" />
        <h2 className="text-2xl font-bold text-neutral-700">Recipe Not Found</h2>
        <Link href="/browse-recipes" className="mt-4 text-orange-600 font-bold flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Browse
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl border border-neutral-200/80 shadow-xl overflow-hidden">
        
        {/* ব্যাক বাটন ও ইমেজ হেডার */}
        <div className="relative h-[350px] md:h-[450px] w-full bg-neutral-100">
          <img 
            src={recipe.recipeImage || "https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=1200"} 
            alt={recipe.recipeName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          <button 
            onClick={() => router.back()} 
            className="absolute top-6 left-6 bg-white/90 backdrop-blur-md p-3 rounded-full shadow-md text-neutral-700 hover:bg-orange-600 hover:text-white transition-all"
          >
            <ArrowLeft size={20} />
          </button>

          {/* রেসিপি মেটা টাইটেল ওভারলে */}
          <div className="absolute bottom-8 left-8 right-8 text-white space-y-2">
            <span className="bg-orange-600 text-white text-[11px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-sm">
              {recipe.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight mt-2">{recipe.recipeName}</h1>
            <p className="text-neutral-300 text-sm font-medium">Cuisine: {recipe.cuisineType} | By {recipe.authorName || "Expert Chef"}</p>
          </div>
        </div>

        {/* ইন্টারঅ্যাকশন বাটন বার (Likes, Favorite, Report, Stripe Purchase) */}
        <div className="bg-neutral-50 border-b border-neutral-200 px-6 py-4 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-3">
            {/* লাইক বাটন */}
            <button 
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all ${
                isLiked 
                  ? 'bg-blue-50 border-blue-200 text-blue-600' 
                  : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <ThumbsUp size={18} className={isLiked ? "fill-blue-600" : ""} />
              <span>{likes} {likes === 1 ? 'Like' : 'Likes'}</span>
            </button>

            {/* ফেভারিট বাটন */}
            <button 
              onClick={handleFavorite}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all ${
                isFavorite 
                  ? 'bg-red-50 border-red-200 text-red-600' 
                  : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <Heart size={18} className={isFavorite ? "fill-red-600" : ""} />
              <span>{isFavorite ? 'Saved to Favorites' : 'Add to Favorite'}</span>
            </button>

            {/* রিপোর্ট বাটন */}
            <button 
              onClick={() => setIsReportModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm font-bold text-neutral-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"
            >
              <AlertTriangle size={18} />
              <span>Report Recipe</span>
            </button>
          </div>

          {/* স্ট্রাইপ পারচেজ বাটন */}
          <button 
            onClick={handlePurchase}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl text-sm font-black tracking-wide shadow-md shadow-orange-500/20 hover:opacity-90 transition-all"
          >
            <ShoppingCart size={18} />
            <span>Purchase Full Recipe ($4.99)</span>
          </button>
        </div>

        {/* রেসিপি কন্টেন্ট মেইন সেকশন */}
        <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* বামের ছোট কলাম: স্পেসিফিকেশন */}
          <div className="space-y-6">
            <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-black text-neutral-800 uppercase tracking-wider">Quick Info</h3>
              
              <div className="flex items-center gap-3 text-neutral-600">
                <Clock className="text-orange-500" size={20} />
                <div>
                  <p className="text-[10px] uppercase font-bold text-neutral-400">Preparation Time</p>
                  <p className="text-sm font-bold text-neutral-800">{recipe.preparationTime} Minutes</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-neutral-600">
                <ChefHat className="text-orange-500" size={20} />
                <div>
                  <p className="text-[10px] uppercase font-bold text-neutral-400">Difficulty Level</p>
                  <p className="text-sm font-bold text-neutral-800">{recipe.difficultyLevel || 'Medium'}</p>
                </div>
              </div>
            </div>

            {/* উপাদানের তালিকা (Ingredients) */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-neutral-800 border-b border-neutral-200 pb-2">Ingredients</h3>
              <ul className="space-y-2">
                {recipe.ingredients?.split(',').map((ingredient, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-sm text-neutral-600 font-medium bg-neutral-50 p-2.5 rounded-lg border border-neutral-100">
                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                    {ingredient.trim()}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ডানের বড় কলাম: রান্নার নির্দেশনাবলী (Instructions) */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-lg font-bold text-neutral-800 border-b border-neutral-200 pb-2">Cooking Instructions</h3>
            <div className="prose text-neutral-600 leading-relaxed max-w-none font-medium whitespace-pre-line">
              {recipe.instructions || "No custom instructions provided for this recipe."}
            </div>
          </div>

        </div>
      </div>

      {/* 🚨 রিকোয়ারমেন্ট অনুযায়ী REPORT MODAL */}
      {isReportModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-neutral-200 shadow-2xl p-6 space-y-4">
            <div>
              <h3 className="text-xl font-bold text-neutral-800">Report this Recipe</h3>
              <p className="text-neutral-500 text-xs mt-1">Help us moderate RecipeHub platform content.</p>
            </div>

            <form onSubmit={handleReportSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">Reason for reporting</label>
                <select 
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-orange-500 text-sm font-semibold text-neutral-700"
                >
                  <option value="Spam">Spam</option>
                  <option value="Offensive Content">Offensive Content</option>
                  <option value="Copyright Issue">Copyright Issue</option>
                </select>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsReportModalOpen(false)}
                  className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 font-bold rounded-xl text-sm transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={submittingReport}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm shadow-md shadow-red-500/10 transition-all flex items-center gap-1.5"
                >
                  {submittingReport && <Loader2 size={14} className="animate-spin" />}
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}