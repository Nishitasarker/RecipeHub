"use client";
import React, { useState, useEffect } from 'react';
import { Trash2, ExternalLink, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const { data: session } = authClient.useSession();
  const loggedInUser = session?.user;

  const fetchMyFavorites = async (email) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/my-favorites?email=${email}`);
      const result = await response.json();
      if (result.success) {
        setFavorites(result.data);
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loggedInUser?.email) {
      fetchMyFavorites(loggedInUser.email);
    } else {
      setLoading(false);
    }
  }, [loggedInUser?.email]);

  const handleRemove = async (recipeId) => {
    if (!loggedInUser?.email) return;
    try {
      const response = await fetch('http://localhost:5000/api/favorites', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipeId, userEmail: loggedInUser.email })
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Removed from favorites!");
        setFavorites((prev) => prev.filter((fav) => fav.recipeId !== recipeId));
      } else {
        toast.error(data.message || "Failed to remove");
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
      toast.error("Something went wrong.");
    }
  };

  if (!loggedInUser) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center">
        <p className="text-gray-500 font-medium">Please log in to see your favorites.</p>
      </div>
    );
  }

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-[#FF6D00]" size={48} /></div>;

  return (
    <div className="p-6 bg-[#FDFBF7] min-h-screen">
      <h2 className="text-3xl font-bold text-[#D93025] mb-8">My Favorites</h2>

      {favorites.length === 0 ? (
        <p className="text-gray-500">No favorite recipes found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((recipe) => (
            <div key={recipe._id} className="bg-white rounded-lg shadow-sm border border-orange-100 overflow-hidden hover:shadow-md transition-shadow">
              <img src={recipe.recipeImage} alt={recipe.recipeName} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{recipe.recipeName}</h3>
                <div className="flex gap-2">
                  <button onClick={() => router.push(`/browseRecipes/${recipe.recipeId}`)}
                className="flex-1 bg-[#FF6D00] text-white py-2 rounded-md hover:bg-orange-600 transition flex items-center justify-center gap-2">
                 <ExternalLink size={18} /> Details</button>
                  <button
                    onClick={() => handleRemove(recipe.recipeId)}
                    className="px-4 py-2 bg-red-100 text-[#D93025] rounded-md hover:bg-red-200 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;