"use client";

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { 
  Heart, ThumbsUp, AlertTriangle, ShoppingCart, 
  Clock, Utensils, ArrowLeft, Loader2, Lock, CheckCircle2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { authClient } from "@/lib/auth-client"; 
import { toast } from "react-toastify"; 

function RecipeDetailsContent() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data: session } = authClient.useSession();
  const loggedInUser = session?.user;

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isReported, setIsReported] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('Spam');
  const [submittingReport, setSubmittingReport] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false); 
  const [hasPurchased, setHasPurchased] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);

  const paymentSuccess = searchParams.get('payment_success');
  const sessionId = searchParams.get('session_id');

  // ১. রেসিপি ডিটেইলস লোড
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`https://recipehub-server-side.vercel.app/api/recipes/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setRecipe(data);
        setLikes(data.likesCount || 0);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching recipe:", err);
        setLoading(false);
      });
  }, [id]);

  // ২. ইউজারের আগের like/favorite স্টেট চেক
  useEffect(() => {
    if (!loggedInUser?.email || !id) return;
    
    fetch(`https://recipehub-server-side.vercel.app/api/user-actions/${loggedInUser.email}/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setIsFavorite(data.isFavorite);
          setIsLiked(data.isLiked); // ⬅️ এই লাইনটা নতুন add করুন
           setIsReported(data.isReported);
        }
      })
      .catch(err => console.error("Error checking user actions:", err));
  }, [loggedInUser?.email, id]);

  // ৩. Purchase status চেক
  useEffect(() => {
    if (loggedInUser?.email && id) {
      setCheckingAccess(true);
      fetch(`https://recipehub-server-side.vercel.app/api/check-purchase?email=${loggedInUser.email}&recipeId=${id}`)
        .then((res) => res.json())
        .then((data) => {
          setHasPurchased(data.isPurchased);
          setCheckingAccess(false);
        })
        .catch(() => setCheckingAccess(false));
    } else {
      setCheckingAccess(false);
    }
  }, [loggedInUser?.email, id]);

  // ৪. Payment verification
  useEffect(() => {
    if (paymentSuccess === 'true' && sessionId && id) {
      setCheckingAccess(true);
      toast.info("Verifying your payment... Please wait.");
      fetch(`/api/purchase-recipe`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId })
      })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast.success("Payment Verified! Recipe Unlocked.");
          setHasPurchased(true);
          router.replace(`/browseRecipes/${id}`);
        } else {
          toast.error(data.error || "Payment verification failed.");
          setCheckingAccess(false);
        }
      })
      .catch(() => {
        toast.error("Error verifying payment.");
        setCheckingAccess(false);
      });
    }
  }, [paymentSuccess, sessionId, id, router]);

  // ✅ Like handler - email দিয়ে store
 const handleLike = async () => {
  if (!loggedInUser) {
    toast.error("Please log in first!");
    return;
  }

  const wasLiked = isLiked;
  const endpoint = wasLiked ? 'unlike' : 'like';

  setLikes((prev) => (wasLiked ? prev - 1 : prev + 1));
  setIsLiked(!wasLiked);

  try {
    const res = await fetch(`https://recipehub-server-side.vercel.app/api/recipes/${endpoint}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userEmail: loggedInUser.email })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
  } catch (error) {
    console.error("Error toggling like:", error);
    setLikes((prev) => (wasLiked ? prev + 1 : prev - 1));
    setIsLiked(wasLiked);
  }
};

  // ✅ Favorite handler - token দিয়ে auth, email দিয়ে store
  // handleFavorite ফাংশনটি এভাবে পরিবর্তন করুন:
const handleFavorite = async () => {
  if (!loggedInUser) {
    toast.error("Please log in first!");
    return;
  }

  const newFavoriteState = !isFavorite;
  setIsFavorite(newFavoriteState);

  try {
    const res = await fetch(`https://recipehub-server-side.vercel.app/api/favorites`, {
      method: isFavorite ? 'DELETE' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipeId: id,
        userEmail: loggedInUser.email,
        recipeName: recipe?.recipeName,
        recipeImage: recipe?.recipeImage
      })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || "Failed");
    toast.success(newFavoriteState ? "Added to favorites!" : "Removed from favorites!");
  } catch (error) {
    setIsFavorite(!newFavoriteState);
    toast.error("Operation failed. Try again.");
  }
};


  // ✅ Report handler

  const openReportModal = () => {
  if (!loggedInUser) {
    toast.error("Please log in first to report this recipe!");
    return;
  }
  if (isReported) {
    toast.info("You have already reported this recipe.");
    return;
  }
  setIsReportModalOpen(true);
};


 const handleReportSubmit = async (e) => {
  e.preventDefault();
  if (!loggedInUser) {
    toast.error("Please log in first!");
    return;
  }

  setSubmittingReport(true);
  try {
    const response = await fetch(`https://recipehub-server-side.vercel.app/api/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipeId: id,
        userEmail: loggedInUser.email,
        reason: reportReason
      })
    });

    const data = await response.json();

    if (response.ok) {
      toast.success("Recipe reported successfully.");
      setIsReportModalOpen(false);
      setIsReported(true); 
    } else {
      toast.error(data.message || "Something went wrong!");
    }
  } catch (error) {
    console.error("Error submitting report:", error);
    toast.error("Failed to submit report.");
  } finally {
    setSubmittingReport(false);
  }
};


  const handlePurchase = async () => {
    if (!loggedInUser?.email) {
      toast.error("Please log in first to purchase this recipe.");
      return;
    }
    try {
      setLoadingPayment(true);
      const response = await fetch(`/api/purchase-recipe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipeId: id,
          recipeName: recipe.recipeName,
          price: 4.99,
          email: loggedInUser.email,
          purchaseType: "single_recipe"
        })
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url; 
      } else {
        toast.error(data.error || "Failed to create checkout session.");
      }
    } catch (error) {
      toast.error("Something went wrong with the connection.");
    } finally {
      setLoadingPayment(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50">
      <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
      <p className="text-neutral-500 font-medium">Loading recipe details...</p>
    </div>
  );

  if (!recipe) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 p-4 text-center">
      <Utensils className="w-16 h-16 text-neutral-300 mb-4" />
      <h2 className="text-2xl font-bold text-neutral-700">Recipe Not Found</h2>
      <Link href="/browseRecipes" className="mt-4 text-orange-600 font-bold flex items-center gap-2">
        <ArrowLeft size={16} /> Back to Browse
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto bg-white rounded-3xl border border-neutral-200/80 shadow-xl overflow-hidden"
      >
        {/* Banner */}
        <div className="relative h-[350px] md:h-[450px] w-full bg-neutral-100 overflow-hidden">
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.7 }}
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
          <div className="absolute bottom-8 left-8 right-8 text-white space-y-2">
            <span className="bg-orange-600 text-white text-[11px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-sm">
              {recipe.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight mt-2">{recipe.recipeName}</h1>
            <p className="text-neutral-300 text-sm font-medium">Cuisine: {recipe.cuisineType} | By {recipe.authorName || "Expert Chef"}</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="bg-neutral-50 border-b border-neutral-200 px-6 py-4 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-3">
            <motion.button 
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all ${
                isLiked ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <ThumbsUp size={18} className={isLiked ? "fill-blue-600" : ""} />
              <span>{likes} {likes === 1 ? 'Like' : 'Likes'}</span>
            </motion.button>

            <motion.button 
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={handleFavorite}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all ${
                isFavorite ? 'bg-red-50 border-red-200 text-red-600' : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <Heart size={18} className={isFavorite ? "fill-red-600" : ""} />
              <span>{isFavorite ? 'Saved' : 'Favorite'}</span>
            </motion.button>

           <motion.button whileHover={!isReported ? { scale: 1.05 } : {}} whileTap={!isReported ? { scale: 0.95 } : {}}onClick={openReportModal}disabled={isReported}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all ${
           isReported 
          ? 'bg-neutral-100 border-neutral-200 text-neutral-400 cursor-not-allowed' 
         : 'bg-white border-neutral-200 text-neutral-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200'}`}>
          <AlertTriangle size={18} /> <span>{isReported ? 'Reported' : 'Report'}</span>
</motion.button>
          </div>

          {checkingAccess ? (
            <div className="text-sm font-bold text-neutral-500 flex items-center gap-1.5">
              <Loader2 size={16} className="animate-spin" /> Checking Access...
            </div>
          ) : hasPurchased ? (
            <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-600" /> Successfully Purchased
            </div>
          ) : (
            <motion.button 
              whileHover={!loadingPayment ? { scale: 1.03 } : {}}
              whileTap={!loadingPayment ? { scale: 0.97 } : {}}
              onClick={handlePurchase}
              disabled={loadingPayment}
              className={`flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl text-sm font-black tracking-wide shadow-md transition-all ${
                loadingPayment ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-90'
              }`}
            >
              {loadingPayment ? <Loader2 size={18} className="animate-spin" /> : <ShoppingCart size={18} />}
              <span>{loadingPayment ? "Processing..." : "Purchase Full Recipe ($4.99)"}</span>
            </motion.button>
          )}
        </div>

        {/* Content */}
        <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-6">
            <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-black text-neutral-800 uppercase tracking-wider">Quick Info</h3>
              <div className="flex items-center gap-3 text-neutral-600">
                <Clock className="text-orange-500" size={20} />
                <div>
                  <p className="text-[10px] uppercase font-bold text-neutral-400">Prep Time</p>
                  <p className="text-sm font-bold text-neutral-800">{recipe.preparationTime} Mins</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-neutral-800 border-b border-neutral-200 pb-2">Ingredients</h3>
              <ul className="space-y-2">
                {(Array.isArray(recipe.ingredients) 
                  ? recipe.ingredients 
                  : recipe.ingredients?.split(',') || []
                ).map((item, idx) => (
                  <li key={idx} className="text-sm text-neutral-600 font-medium bg-neutral-50 p-2.5 rounded-lg border border-neutral-100 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    {item?.trim()}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="md:col-span-2 space-y-4">
            <h3 className="text-lg font-bold text-neutral-800 border-b border-neutral-200 pb-2">Cooking Instructions</h3>
            {checkingAccess ? (
              <div className="flex items-center gap-2 py-4 text-neutral-400 text-sm">
                <Loader2 size={16} className="animate-spin" /> Verifying access...
              </div>
            ) : hasPurchased ? (
              <p className="text-neutral-600 leading-relaxed font-medium whitespace-pre-line">{recipe.instructions}</p>
            ) : (
              <div className="relative rounded-2xl overflow-hidden border border-dashed border-neutral-300 p-4 bg-neutral-50/50">
                <p className="text-neutral-400 select-none blur-md leading-relaxed font-medium whitespace-pre-line max-h-[150px]">
                  First mix the premium ingredients...
                </p>
                <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex flex-col items-center justify-center text-center p-6">
                  <div className="p-3 bg-white text-neutral-700 rounded-full shadow-md mb-2">
                    <Lock size={22} className="text-orange-500" />
                  </div>
                  <h4 className="text-neutral-800 font-bold text-sm">Instructions Locked</h4>
                  <p className="text-neutral-500 text-xs mt-1 max-w-xs">Purchase this recipe to view cooking steps.</p>
                  <button onClick={handlePurchase} className="mt-3 px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-bold shadow hover:bg-neutral-800 transition-all flex items-center gap-1">
                    <ShoppingCart size={12} /> Unlock Now ($4.99)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Report Modal */}
      <AnimatePresence>
        {isReportModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full border border-neutral-200 shadow-2xl p-6 space-y-4"
            >
              <h3 className="text-xl font-bold text-neutral-800">Report this Recipe</h3>
              <form onSubmit={handleReportSubmit} className="space-y-4">
                <select 
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-semibold text-neutral-700 focus:outline-none"
                >
                  <option value="Spam">Spam</option>
                  <option value="Offensive Content">Offensive Content</option>
                  <option value="Copyright Issue">Copyright Issue</option>
                </select>
                <div className="flex gap-3 justify-end">
                  <button type="button" onClick={() => setIsReportModalOpen(false)} className="px-4 py-2 bg-neutral-100 text-neutral-600 font-bold rounded-xl text-sm">Cancel</button>
                  <button type="submit" disabled={submittingReport} className="px-4 py-2 bg-red-600 text-white font-bold rounded-xl text-sm flex items-center gap-2">
                    {submittingReport && <Loader2 size={14} className="animate-spin" />} Submit
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function RecipeDetailsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
        <p className="text-neutral-500 font-medium">Initializing...</p>
      </div>
    }>
      <RecipeDetailsContent />
    </Suspense>
  );
}