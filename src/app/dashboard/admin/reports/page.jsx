"use client"

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { authClient } from "@/lib/auth-client";
import { AlertTriangle, CheckCircle, Trash2 } from 'lucide-react';

const RecipeReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const { data: session } = authClient.useSession();
  const loggedInUser = session?.user;

  // ডাটাবেজ থেকে রিপোর্টের লিস্ট নিয়ে আসা
  const fetchReports = async (email) => {
    try {
      setLoading(true);
      const token = session?.session?.token;

      const res = await fetch(`https://recipehub-server-side.vercel.app/api/admin/reports?email=${email}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setReports(data.data);
      } else {
        toast.error(data.message || "Failed to fetch reports");
      }
    } catch (error) {
      toast.error("Error fetching recipe reports!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loggedInUser?.email) {
      fetchReports(loggedInUser.email);
    } else {
      setLoading(false);
    }
  }, [loggedInUser?.email]);

  // রিপোর্ট ডিসমিস (Dismiss) বা রেসিপি রিমুভ (Remove) করার হ্যান্ডলার
  const handleReportAction = async (reportId, recipeId, actionType) => {
    const confirmMessage = actionType === 'dismiss' 
      ? "Are you sure you want to dismiss and delete this report?" 
      : "Are you sure you want to permanently REMOVE this recipe based on the report?";
    
    const confirmAction = window.confirm(confirmMessage);

    if (confirmAction) {
      try {
        const token = session?.session?.token;
        
        // Option 1 এর জন্য: dismiss হলে আমরা সরাসরি DELETE মেথড বা 'dismiss' অ্যাকশন পাঠাবো যা ব্যাকএন্ডে ডিলিট করবে
        const res = await fetch(`https://recipehub-server-side.vercel.app/api/admin/reports/${reportId}`, {
          method: 'PATCH', // আপনার ব্যাকএন্ডে PATCH লজিক থাকলে এটিই রাখুন, ব্যাকএন্ডে শুধু ডিলিট কোড লিখবেন
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ 
            action: actionType, 
            recipeId: recipeId,
            email: loggedInUser.email 
          })
        });
        const data = await res.json();

        if (data.success) {
          toast.success(data.message);
          fetchReports(loggedInUser.email); // লিস্ট রিফ্রেশ দিলে ডাটাটি আর টেবিলে থাকবে না
        } else {
          toast.error(data.message || "Action failed");
        }
      } catch (error) {
        toast.error("Failed to execute admin action");
      }
    }
  };

  if (!loggedInUser) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-neutral-500 font-medium">Please log in to review reports.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen rounded-2xl shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <AlertTriangle className="text-rose-500 w-7 h-7" /> Recipe Reports
        </h2>
        <p className="text-sm text-gray-500">Review community flags for Spam, Offensive Content, or Copyright Issues, and keep the cooking space safe.</p>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
        <table className="min-w-full table-auto text-left">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Reported Recipe</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Reporter</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Reason</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {reports.map((report) => (
              <tr key={report._id} className="hover:bg-gray-50/70 transition-colors">
                
                {/* রেসিপির তথ্য */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {report.recipeDetails ? (
                    <div className="flex items-center gap-3">
                      <img
                        src={report.recipeDetails.recipeImage || "https://images.unsplash.com/photo-1495521821757-a1efb6729352"}
                        alt={report.recipeDetails.recipeName}
                        className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                      />
                      <div>
                        <div className="font-semibold text-gray-800">{report.recipeDetails.recipeName}</div>
                        <div className="text-xs text-gray-400">By: {report.recipeDetails.authorEmail}</div>
                      </div>
                    </div>
                  ) : (
                    <span className="text-rose-500 text-sm font-medium italic">⚠️ Recipe Already Removed</span>
                  )}
                </td>

                {/* রিপোর্টকারী */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {report.reporterEmail}
                </td>

                {/* রিপোর্টের কারণ */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-md border ${
                    report.reason === 'Spam' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    report.reason === 'Offensive Content' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                    'bg-blue-50 text-blue-700 border-blue-200'
                  }`}>
                    {report.reason}
                  </span>
                </td>

                {/* রিপোর্টের স্ট্যাটাস (যেহেতু ডিলিট করে দিচ্ছি, তাই এখানে শুধু pending বা অলরেডি রিমুভড দেখাবে) */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {report.status === 'pending' ? (
                    <span className="inline-flex px-2.5 py-1 text-xs font-bold text-amber-700 bg-amber-50 rounded-md border border-amber-200 animate-pulse">
                      Pending Review
                    </span>
                  ) : (
                    <span className="inline-flex px-2.5 py-1 text-xs font-bold text-rose-700 bg-rose-50 rounded-md border border-rose-200">
                      Recipe Removed
                    </span>
                  )}
                </td>

                {/* অ্যাকশন বাটন সমূহ */}
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {report.status === 'pending' ? (
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleReportAction(report._id, null, 'dismiss')}
                        className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all"
                        title="Dismiss Report"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Dismiss
                      </button>
                      
                      {report.recipeDetails && (
                        <button
                          onClick={() => handleReportAction(report._id, report.recipeId, 'remove')}
                          className="flex items-center gap-1 bg-rose-500 hover:bg-rose-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all"
                          title="Remove Recipe"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove Recipe
                        </button>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400 font-medium italic">Action Taken</span>
                  )}
                </td>

              </tr>
            ))}

            {reports.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-12 text-gray-400 font-medium">
                  🎉 Clean slate! No pending recipe reports.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecipeReports;