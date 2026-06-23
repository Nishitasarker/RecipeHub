"use client";
import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client"; // সেশন রিফ্রেশ করার জন্য

const SuccessContent = () => {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("session_id");
  
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("Processing your premium upgrade...");

  // Better Auth সেশন রি-ফেচ মেথড আনা
  const { refetch } = authClient.useSession();

  useEffect(() => {
    const handleDatabaseUpdate = async () => {
      if (!transactionId) {
        setLoading(false);
        setStatusMessage("No session ID found.");
        return;
      }

      try {
        // 🎯 ফ্রন্টএন্ড লোড হওয়ার সাথে সাথে আমাদের একটি এপিআই-তে হিট করছি ডাটাবেজ আপডেটের জন্য
        const response = await fetch("/api/subscription/confirm", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ session_id: transactionId }),
        });

        const data = await response.json();

        if (response.ok) {
          // 🎯 ডাটাবেজ আপডেট সফল হলে Better Auth ক্লায়েন্ট সেশন রিফ্রেশ করবে
          await refetch();
          setStatusMessage("Welcome to RecipeHub Premium 🎉");
        } else {
          setStatusMessage(data.error || "Failed to update profile to premium.");
        }
      } catch (error) {
        console.error("Error updating subscription:", error);
        setStatusMessage("Something went wrong while unlocking Premium.");
      } finally {
        setLoading(false);
      }
    };

    handleDatabaseUpdate();
  }, [transactionId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-slate-100 text-center">
        
        {loading ? (
          // ডাটাবেজ আপডেট হওয়া পর্যন্ত লোডার দেখাবে
          <div className="py-12">
            <span className="loading loading-spinner loading-lg text-[#c2271d] mb-4"></span>
            <p className="text-slate-600 font-medium">{statusMessage}</p>
          </div>
        ) : (
          <>
            {/* Success Animated Icon */}
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner animate-pulse">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>

            <h2 className="text-3xl font-black text-slate-800 mb-2 tracking-tight">Payment Successful!</h2>
            <p className="text-emerald-600 font-bold text-sm mb-6 uppercase tracking-wider">
              {statusMessage}
            </p>
            
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Your payment has been securely processed. Your profile has been upgraded to Premium, unlocking unlimited recipe uploads!
            </p>

            {/* Transaction ID Display Box */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-8 text-left">
              <span className="text-xs font-bold text-slate-400 block uppercase mb-1">Transaction ID</span>
              <code className="text-xs font-mono font-bold text-slate-700 break-all">{transactionId || "ST_SUCCESS_99X"}</code>
            </div>

            {/* Action Button to Profile */}
            <Link 
              href="/dashboard/user/profile"
              className="block w-full py-3.5 bg-[#c2271d] hover:bg-[#a31f18] text-white font-bold rounded-xl shadow-md hover:shadow-lg text-center transition-all duration-200"
            >
              Go Back to Profile
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

const PaymentSuccessPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex justify-center items-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
};

export default PaymentSuccessPage;