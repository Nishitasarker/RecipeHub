'use client'
import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Heart, 
  ThumbsUp, 
  Crown, 
  Award, 
  Sparkles, 
  ArrowUpRight,
  Loader2 
} from 'lucide-react';
import { authClient } from "@/lib/auth-client"; 

const DashboardOverview = () => {
  // ১. সেশন থেকে লগইন করা ইউজারের ডাটা রিড করা
  const { data: session, isPending: authLoading } = authClient.useSession();
  const loggedInUser = session?.user;

  // ২. ডাইনামিক স্ট্যাটস স্টেট
  const [metrics, setMetrics] = useState({
    totalRecipes: 0,
    totalFavorites: 0,
    totalLikesReceived: 0,
    isPremium: false,
  });
  const [metricsLoading, setMetricsLoading] = useState(true);

  // ৩. ব্যাকএন্ড থেকে রিয়েল-টাইম ডেটা ফেচিং ফাংশন (useCallback দিয়ে অপ্টিমাইজড)
  const loadDashboardStats = useCallback(async () => {
    if (!loggedInUser?.email) return;
    try {
      setMetricsLoading(true);
      // cache: 'no-store' ব্রাউজারকে বাধ্য করবে সবসময় একদম লেটেস্ট ডাটা ডাটাবেজ থেকে আনতে
      const res = await fetch(`http://localhost:5000/api/user-stats/${loggedInUser.email}`, {
        cache: 'no-store'
      });
      const data = await res.json();
      
      if (data.success) {
        setMetrics({
          totalRecipes: data.totalRecipes || 0,
          totalFavorites: data.totalFavorites || 0,
          totalLikesReceived: data.totalLikesReceived || 0,
          isPremium: data.isPremium || false,
        });
      }
    } catch (error) {
      console.error("Failed to load custom stats section:", error);
    } finally {
      setMetricsLoading(false);
    }
  }, [loggedInUser?.email]);

  // ৪. রিয়েল-টাইম ডেটা ফেচিং এবং উইন্ডো ফোকাস ইফেক্ট
  useEffect(() => {
    if (!loggedInUser?.email) return;

    loadDashboardStats();

    // ইউজার অন্য কোনো ট্যাবে ফেভারিট করে এই ট্যাবে ফিরে আসলে অটো-রিফেচ হবে
    window.addEventListener('focus', loadDashboardStats);
    return () => {
      window.removeEventListener('focus', loadDashboardStats);
    };
  }, [loggedInUser?.email, loadDashboardStats]);

  // ৫. গ্লোবাল লোডিং স্ক্রিন হ্যান্ডলার
  if (authLoading || metricsLoading) {
    return (
      <div className="flex h-[75vh] flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-2" />
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Syncing Metrics...</p>
      </div>
    );
  }

  const displayName = loggedInUser?.name || "Chef";

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 bg-slate-50 min-h-screen text-slate-800">
      
      {/* Welcome Header Card */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c2271d] via-[#f59e0b] to-[#fbbf24]">{displayName}</span>!
            </h1>
            
            {metrics.isPremium ? (
              <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-xs font-black px-3 py-1 rounded-full border border-amber-200 shadow-sm animate-pulse">
                <Crown size={12} className="fill-current text-amber-600" /> PREMIUM
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full border border-slate-200">
                STANDARD
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Track your culinary portfolio execution updates and growth metrics here.
          </p>
        </div>
        
        {/* Quick Recipe Slot Indicator */}
        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 w-fit">
          <div className="text-xs font-medium text-slate-600">
            Slots Occupied: <span className="font-bold text-emerald-600">{metrics.totalRecipes}</span> 
            {!metrics.isPremium && " / 2 Max"}
          </div>
          {!metrics.isPremium ? (
            <button className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold px-3 py-1 rounded-lg transition-colors flex items-center gap-1 shadow-sm">
              Upgrade <Sparkles size={12} />
            </button>
          ) : (
            <span className="text-xs text-emerald-600 flex items-center gap-1 font-semibold">
              <Award size={14} /> Unlimited Access
            </span>
          )}
        </div>
      </div>

      {/* Grid Layout: Dynamic Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Total Recipes Created */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center justify-between transition-all"
        >
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 tracking-wider uppercase">Total Recipes Created</p>
            <h3 className="text-4xl font-extrabold text-slate-900">{metrics.totalRecipes}</h3>
            <p className="text-xs text-slate-400">Published by you</p>
          </div>
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
            <BookOpen size={26} />
          </div>
        </motion.div>

        {/* Card 2: Total Favorites Saved */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center justify-between transition-all"
        >
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 tracking-wider uppercase">Total Favorites Saved</p>
            <h3 className="text-4xl font-extrabold text-slate-900">{metrics.totalFavorites}</h3>
            <p className="text-xs text-slate-400">Recipes saved in your vault</p>
          </div>
          <div className="p-4 bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
            <Heart size={26} className="fill-current" />
          </div>
        </motion.div>

        {/* Card 3: Total Likes Received */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center justify-between transition-all"
        >
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 tracking-wider uppercase">Total Likes Received</p>
            <h3 className="text-4xl font-extrabold text-slate-900">{metrics.totalLikesReceived}</h3>
            <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
              Active community recognition
            </p>
          </div>
          <div className="p-4 bg-sky-50 text-sky-600 rounded-xl border border-sky-100">
            <ThumbsUp size={26} className="fill-current" />
          </div>
        </motion.div>

      </div>

      {/* Premium Upgrade Promotion Panel */}
      {!metrics.isPremium && (
        <div className="bg-gradient-to-r from-amber-500/5 via-orange-500/5 to-yellow-500/5 border border-amber-200/60 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
            <div className="p-3 bg-amber-500 text-white rounded-full shadow-md">
              <Crown size={24} />
            </div>
            <div>
              <h4 className="font-bold text-lg text-slate-900">Unlock Unlimited Recipe Publishing Power</h4>
              <p className="text-sm text-slate-500">
                Standard accounts are restricted to exactly 2 recipe submissions. Upgrade to access premium features today.
              </p>
            </div>
          </div>
          <button className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2 group whitespace-nowrap">
            Go Premium <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      )}

    </div>
  );
};

export default DashboardOverview;