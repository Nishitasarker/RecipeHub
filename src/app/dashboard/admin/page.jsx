"use client";

import React, { useState, useEffect } from 'react';
import { Users, BookOpen, Crown, AlertTriangle, Loader2 } from 'lucide-react';
import { authClient } from "@/lib/auth-client";

const AdminOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { data: session } = authClient.useSession();
  const loggedInUser = session?.user;

  useEffect(() => {
    if (!loggedInUser?.email) {
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/api/admin-stats?email=${loggedInUser.email}`);
        const data = await res.json();
        
        if (data.success) {
          setStats(data);
        } else {
          setError(data.message || "Failed to retrieve platform statistics.");
        }
      } catch (err) {
        console.error("Error fetching admin stats:", err);
        setError("Unable to connect to the server. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [loggedInUser?.email]);

  if (!loggedInUser) {
    return (
      <div className="flex items-center justify-center h-64 text-neutral-500">
        <p>Please log in to your administrative account to view platform analytics.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="animate-spin text-orange-500 mb-2" size={40} />
        <p className="text-neutral-400">Loading system metrics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-100 rounded-lg text-red-600 font-medium">
        Error: {error}
      </div>
    );
  }

  const cards = [
    { title: 'Total Users', value: stats?.totalUsers || 0, icon: <Users size={24} />, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Total Recipes', value: stats?.totalRecipes || 0, icon: <BookOpen size={24} />, color: 'text-green-600', bg: 'bg-green-50' },
    { title: 'Premium Members', value: stats?.totalPremiumMembers || 0, icon: <Crown size={24} />, color: 'text-orange-500', bg: 'bg-orange-50' },
    { title: 'Total Reports', value: stats?.totalReports || 0, icon: <AlertTriangle size={24} />, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  return (
    <div className="py-6 px-4 md:px-8">
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-neutral-900">Admin Dashboard</h2>
        <p className="text-neutral-500 mt-2">
          Overview of platform health, user engagement, and content moderation status.
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <div 
            key={idx} 
            className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200 transition-all hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">{card.title}</p>
                <h3 className={`text-3xl font-black mt-2 ${card.color}`}>{card.value}</h3>
              </div>
              <div className={`p-3 rounded-xl ${card.bg} ${card.color}`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOverview;