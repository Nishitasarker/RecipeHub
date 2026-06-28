"use client";
import React, { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client"; 
import { toast } from "react-toastify";

const ProfilePage = () => {
  
  const { data: session, isPending, refetch } = authClient.useSession();
  const loggedInUser = session?.user;

  
  const isUserPremium = loggedInUser?.isPremium === true;

  
  const [profileDisplay, setProfileDisplay] = useState({
    name: "",
    image: "",
  });

  
  const [formData, setFormData] = useState({
    name: "",
    image: "",
  });

  const [loadingPayment, setLoadingPayment] = useState(false); 

  
  useEffect(() => {
    if (loggedInUser) {
      setProfileDisplay({
        name: loggedInUser.name || "",
        image: loggedInUser.image || "",
      });
      setFormData({ name: "", image: "" }); 
    }
  }, [loggedInUser]);

  
  useEffect(() => {
    if (loggedInUser) {
      refetch();
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  
  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    const updatedName = formData.name.trim();
    const updatedImage = formData.image.trim();

    if (!updatedName && !updatedImage) {
      toast.error("Please enter a new Name or Image URL to update!");
      return;
    }

    try {
      const { data, error } = await authClient.updateUser({
        name: updatedName || profileDisplay.name,   
        image: updatedImage || profileDisplay.image, 
      });

      if (error) {
        toast.error(error.message || "Failed to update profile.");
      } else {
        setProfileDisplay({
          name: updatedName || profileDisplay.name,
          image: updatedImage || profileDisplay.image,
        });
        setFormData({ name: "", image: "" });
        
        await refetch(); 
        toast.success("Changes saved successfully to MongoDB! 🎉");
      }
      
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred while updating profile.");
    }
  };

  
  const handlePremiumPayment = async () => {
    if (!loggedInUser?.email) {
      toast.error("Please log in first to upgrade your profile.");
      return;
    }

    try {
      setLoadingPayment(true);
      toast.info("Preparing checkout session... Please wait.");
      
      const response = await fetch("/api/subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
       
        body: JSON.stringify({ email: loggedInUser.email }), 
      });

      const data = await response.json();

      if (data.url) {
        toast.success("Redirecting to Stripe...");
        window.location.href = data.url; 
      } else {
        toast.error(data.error || "Failed to create checkout session.");
      }
    } catch (error) {
      console.error("Stripe Checkout Error:", error);
      toast.error("Something went wrong with the connection.");
    } finally {
      setLoadingPayment(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-2 md:px-4 min-h-screen bg-base-50 text-base-content mt-6">
      <h2 className="text-3xl font-extrabold mb-8 text-slate-800 tracking-tight">My Profile</h2>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Profile Update Card */}
        <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-2xl border border-slate-200/80 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-3">
            Update Profile Information
          </h3>
          
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            
            <div className="flex items-center gap-4 p-2 bg-slate-50/60 rounded-xl border border-slate-100">
              <div className="relative w-12 h-12 flex-shrink-0">
                <img 
                  src={profileDisplay.image || "/user.png"} 
                  alt="Profile View" 
                  className="w-full h-full object-cover rounded-full border-2 border-[#c2271d] shadow-sm"
                  onError={(e) => { e.target.src = "/user.png"; }}
                />
              </div>
              <div className="overflow-hidden">
                <h4 className="font-bold text-lg text-slate-800 truncate flex items-center gap-2">
                  {profileDisplay.name || "User Name"} 
                  
                  {isUserPremium && (
                    <span className="bg-amber-500 text-white font-extrabold text-[10px] tracking-wide uppercase px-2 py-0.5 rounded-full shadow-md animate-pulse">
                      💎 PREMIUM
                    </span>
                  )}
                </h4>
                <p className="text-sm text-slate-500 truncate">{loggedInUser?.email}</p> 
              </div>
            </div>

            {/* Full Name Input */}
            <div className="form-control w-full">
              <label className="label pt-0">
                <span className="label-text font-bold text-slate-700">New Full Name</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-white border border-slate-300 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-[#c2271d] transition-all shadow-inner"
                placeholder={profileDisplay.name || "Enter new name"}
              />
            </div>

            {/* Profile Image URL Input */}
            <div className="form-control w-full">
              <label className="label pt-0">
                <span className="label-text font-bold text-slate-700">New Profile Image URL</span>
              </label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-white border border-slate-300 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-[#c2271d] transition-all shadow-inner"
                placeholder="Paste new image URL here"
              />
            </div>

            {/* Email Field (Disabled) */}
            <div className="form-control w-full">
              <label className="label pt-0">
                <span className="label-text font-bold text-slate-400">Email Address (Cannot be changed)</span>
              </label>
              <input
                type="email"
                value={loggedInUser?.email || ""}
                className="w-full px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-400 font-medium cursor-not-allowed select-none"
                disabled
              />
            </div>

            <button 
              type="submit" 
              className="w-full py-3.5 bg-[#c2271d] hover:bg-[#a31f18] text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
            >
              Save Changes
            </button>
          </form>
        </div>

        {/* Right Side: Conditional Card Rendering */}
        <div className="lg:col-span-5 w-full">
          {isUserPremium ? (
            <div className="bg-gradient-to-br from-amber-600 via-amber-500 to-yellow-600 text-white p-6 md:p-8 rounded-2xl shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[460px]">
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/20 rounded-full blur-3xl pointer-events-none"></div>
              <div>
                <div className="inline-block bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6 border border-white/10">
                  👑 Premium Account Status
                </div>
                <h3 className="text-3xl font-black text-white mb-2 tracking-tight">RecipeHub VIP Member</h3>
                <p className="text-amber-50 text-sm leading-relaxed mb-6">
                  Thank you for your premium activation! You are now a core member of our culinary community.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-4 space-y-3 mb-6">
                <div className="flex items-center text-sm font-semibold">
                  <span className="mr-2">✨</span> Unlimited Recipe Submissions Unlocked
                </div>
                <div className="flex items-center text-sm font-semibold">
                  <span className="mr-2">🌟</span> Exclusive Profile Badge Active
                </div>
                <div className="flex items-center text-sm font-semibold">
                  <span className="mr-2">🚀</span> Priority Feed Placement Active
                </div>
              </div>

              <div className="w-full text-center py-4 bg-white text-amber-600 font-extrabold rounded-xl shadow-md tracking-wide">
                ✔ PREMIUM ACTIVE FOR LIFETIME
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-6 md:p-8 rounded-2xl shadow-xl border border-slate-800 relative overflow-hidden flex flex-col justify-between min-h-[460px]">
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#c2271d]/20 rounded-full blur-3xl pointer-events-none"></div>
              <div>
                <div className="inline-block bg-white/10 backdrop-blur-md text-slate-200 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6 border border-white/5">
                  💎 Membership Plan
                </div>
                <h3 className="text-3xl font-extrabold text-white mb-2 tracking-tight">RecipeHub Premium</h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  Upgrade to unlock the strict limits and post as many premium recipes as you want with total flexibility.
                </p>
              </div>

              <div>
                <div className="flex items-baseline mb-8">
                  <span className="text-5xl font-black text-white tracking-tight">$19.99</span>
                  <span className="text-slate-400 text-sm ml-2 font-semibold">/ lifetime access</span>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center text-sm font-medium text-slate-200">
                    <span className="text-emerald-400 mr-3 font-bold">✔</span>
                    <span><strong className="text-white">Unlimited</strong> Recipe Uploads</span>
                  </div>
                  <div className="flex items-center text-sm font-medium text-slate-200">
                    <span className="text-emerald-400 mr-3 font-bold">✔</span>
                    <span>Exclusive Premium Profile Badge</span>
                  </div>
                  <div className="flex items-center text-sm font-medium text-slate-200">
                    <span className="text-emerald-400 mr-3 font-bold">✔</span>
                    <span>Priority Feed Placement</span>
                  </div>
                </div>
              </div>

              <button 
                type="button"
                onClick={handlePremiumPayment} 
                disabled={loadingPayment}
                className={`w-full py-4 bg-[#c2271d] hover:bg-[#a31f18] text-white font-extrabold rounded-xl transition-all duration-200 shadow-lg ${loadingPayment ? 'opacity-60 cursor-not-allowed' : 'hover:scale-[1.01]'}`}
              >
                {loadingPayment ? "Processing Checkout..." : "Upgrade Now with Stripe"}
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;