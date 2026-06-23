'use client'
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Heart, 
  ThumbsUp, 
  Crown, 
  Award, 
  Sparkles, 
  ArrowUpRight 
} from 'lucide-react';

const DashboardOverview = () => {
  // Mocking auth states & data fetch — Replace these with your actual AuthContext / TanStack Query hooks
  const [user, setUser] = useState({
    name: "Nishita Sarker Jui",
    email: "nishita@example.com",
    isPremium: true, // Toggles premium badge and privileges
  });

  const [stats, setStats] = useState({
    totalRecipes: 0,
    totalFavorites: 0,
    totalLikesReceived: 0,
    loading: true,
  });

  useEffect(() => {
    // Simulate API fetch from your secure server endpoints
    const fetchDashboardData = async () => {
      try {
        // const res = await axiosSecure.get(`/user-stats/${user.email}`);
        // setStats({ ...res.data, loading: false });
        
        // Mocking backend response for visualization:
        setTimeout(() => {
          setStats({
            totalRecipes: 2, // Maximum standard cap limit
            totalFavorites: 12,
            totalLikesReceived: 148,
            loading: false,
          });
        }, 800);
      } catch (error) {
        console.error("Error fetching overview metrics:", error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchDashboardData();
  }, [user.email]);

  if (stats.loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <span className="loading loading-ring loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      
      {/* Welcome Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-base-200 p-6 rounded-2xl border border-base-300 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Welcome back, {user.name}!
            </h1>
            {user.isPremium && (
              <span className="badge badge-warning gap-1 font-semibold py-3 px-3 shadow-sm animate-pulse">
                <Crown size={14} className="fill-current" /> Premium
              </span>
            )}
          </div>
          <p className="text-sm text-base-content/70 mt-1">
            Track your culinary portfolio execution updates and growth metrics here.
          </p>
        </div>
        
        {/* Quick Recipe Progression Status Action */}
        <div className="flex items-center gap-2 bg-base-100 p-3 rounded-xl border border-base-300 w-fit">
          <div className="text-xs font-medium">
            Slots Occupied: <span className="font-bold text-primary">{stats.totalRecipes}</span> 
            {!user.isPremium && " / 2 Max"}
          </div>
          {!user.isPremium ? (
            <button className="btn btn-xs btn-warning gap-1 normal-case">
              Upgrade <Sparkles size={12} />
            </button>
          ) : (
            <span className="text-xs text-success flex items-center gap-1 ml-2 font-semibold">
              <Award size={14} /> Unlimited Access
            </span>
          )}
        </div>
      </div>

      {/* Grid Cards Metrics Layout Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Recipes Matrix Card */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-base-100 border border-base-300 p-6 rounded-2xl shadow-sm flex items-center justify-between"
        >
          <div className="space-y-2">
            <p className="text-sm font-medium text-base-content/60 tracking-wide uppercase">Total Recipes Created</p>
            <h3 className="text-4xl font-extrabold text-base-content">{stats.totalRecipes}</h3>
            <p className="text-xs text-base-content/40">Published on platform</p>
          </div>
          <div className="p-4 bg-primary/10 text-primary rounded-xl">
            <BookOpen size={28} />
          </div>
        </motion.div>

        {/* Total Saved Favorites Card */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-base-100 border border-base-300 p-6 rounded-2xl shadow-sm flex items-center justify-between"
        >
          <div className="space-y-2">
            <p className="text-sm font-medium text-base-content/60 tracking-wide uppercase">Total Favorites Saved</p>
            <h3 className="text-4xl font-extrabold text-base-content">{stats.totalFavorites}</h3>
            <p className="text-xs text-base-content/40">Saved recipes in your vault</p>
          </div>
          <div className="p-4 bg-secondary/10 text-secondary rounded-xl">
            <Heart size={28} className="fill-current" />
          </div>
        </motion.div>

        {/* Total Likes Received Aggregation Card */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-base-100 border border-base-300 p-6 rounded-2xl shadow-sm flex items-center justify-between"
        >
          <div className="space-y-2">
            <p className="text-sm font-medium text-base-content/60 tracking-wide uppercase">Community Likes Received</p>
            <h3 className="text-4xl font-extrabold text-base-content">{stats.totalLikesReceived}</h3>
            <p className="text-xs text-success font-medium flex items-center gap-1">
              Active recognition metrics
            </p>
          </div>
          <div className="p-4 bg-accent/10 text-accent rounded-xl">
            <ThumbsUp size={28} className="fill-current" />
          </div>
        </motion.div>

      </div>

      {/* Contextual Premium Promotion Information Panel */}
      {!user.isPremium && (
        <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-yellow-500/10 border border-warning/30 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
            <div className="p-3 bg-warning text-warning-content rounded-full shadow-md">
              <Crown size={24} />
            </div>
            <div>
              <h4 className="font-bold text-lg text-base-content">Unlock Unlimited Recipe Publishing Power</h4>
              <p className="text-sm text-base-content/70">
                Standard accounts are restricted to exactly 2 recipe submissions. Upgrade to access premium features today.
              </p>
            </div>
          </div>
          <button className="btn btn-warning shadow-md group whitespace-nowrap">
            Go Premium <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      )}

    </div>
  );
};

export default DashboardOverview;