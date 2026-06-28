"use client"
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { X } from 'lucide-react';
import { authClient } from "@/lib/auth-client";

const ManageRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: session } = authClient.useSession();
  const loggedInUser = session?.user;

  
  const fetchRecipes = async (email) => {
    try {
      setLoading(true);
      const res = await fetch(`https://recipehub-server-side.vercel.app/api/admin/recipes?email=${email}`);
      const data = await res.json();
      if (data.success) {
        setRecipes(data.data);
      } else {
        toast.error(data.message || "Failed to fetch recipes");
      }
    } catch (error) {
      toast.error("Error fetching recipes!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loggedInUser?.email) {
      fetchRecipes(loggedInUser.email);
    } else {
      setLoading(false);
    }
  }, [loggedInUser?.email]);

  
  const handleToggleFeature = async (recipeId, currentFeaturedStatus) => {
    try {
      const res = await fetch(`https://recipehub-server-side.vercel.app/api/admin/recipes/feature/${recipeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: !currentFeaturedStatus, email: loggedInUser.email })
      });
      const data = await res.json();

      if (data.success) {
        toast.success(data.message);
        fetchRecipes(loggedInUser.email);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to update featured status");
    }
  };

  
  const handleDeleteRecipe = async (recipeId) => {
    const confirmDelete = window.confirm("Are you sure you want to permanently delete this recipe?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`https://recipehub-server-side.vercel.app/api/admin/recipes/${recipeId}?email=${loggedInUser.email}`, {
        method: 'DELETE'
      });
      const data = await res.json();

      if (data.success) {
        toast.success("Recipe deleted successfully!");
        fetchRecipes(loggedInUser.email);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to delete recipe");
    }
  };


  const handleEditClick = (recipe) => {
    setEditingRecipe({ ...recipe });
    setIsModalOpen(true);
  };

 
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`https://recipehub-server-side.vercel.app/api/admin/recipes/${editingRecipe._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editingRecipe, email: loggedInUser.email })
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Recipe updated successfully!");
        setIsModalOpen(false);
        fetchRecipes(loggedInUser.email);
      } else {
        toast.error(data.message || "Failed to update recipe.");
      }
    } catch (error) {
      toast.error("Failed to update recipe");
    }
  };

  if (!loggedInUser) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-neutral-500 font-medium">Please log in to manage recipes.</p>
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
        <h2 className="text-2xl font-bold text-gray-800">Manage Recipes</h2>
        <p className="text-sm text-gray-500">Monitor all community-shared recipes, feature top content, or moderate platform items.</p>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
        <table className="min-w-full table-auto text-left">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Recipe Image & Name</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Author</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Category / Cuisine</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Likes Count</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider text-center">Featured Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {recipes.map((recipe) => (
              <tr key={recipe._id} className="hover:bg-gray-50/70 transition-colors">

                <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3">
                  <img
                    src={recipe.recipeImage || "https://i.ibb.co/kV7t2BF/avatar.jpg"}
                    alt={recipe.recipeName}
                    className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                  />
                  <span className="font-semibold text-gray-800">{recipe.recipeName}</span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  <div>{recipe.authorName}</div>
                  <div className="text-xs text-gray-400">{recipe.authorEmail}</div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium mr-1">{recipe.category}</span>
                  <span className="bg-orange-50 text-orange-700 px-2 py-1 rounded text-xs font-medium">{recipe.cuisineType}</span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">
                  ❤️ {recipe.likesCount || 0}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    onClick={() => handleToggleFeature(recipe._id, recipe.isFeatured)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                      recipe.isFeatured
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {recipe.isFeatured ? '⭐ Featured' : 'Make Featured'}
                  </button>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <button
                    onClick={() => handleEditClick(recipe)}
                    className="text-blue-600 hover:text-blue-900 font-bold mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteRecipe(recipe._id)}
                    className="text-rose-600 hover:text-rose-900 font-bold"
                  >
                    Delete
                  </button>
                </td>

              </tr>
            ))}

            {recipes.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-12 text-gray-400 font-medium">
                  No recipes found in the database.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

     
      {isModalOpen && editingRecipe && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full bg-gray-50"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">Update <span className="text-orange-500">Recipe Details</span></h3>

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recipe Name</label>
                <input
                  type="text" required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={editingRecipe.recipeName || ''}
                  onChange={(e) => setEditingRecipe({ ...editingRecipe, recipeName: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    type="text" required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={editingRecipe.category || ''}
                    onChange={(e) => setEditingRecipe({ ...editingRecipe, category: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cuisine Type</label>
                  <input
                    type="text" required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={editingRecipe.cuisineType || ''}
                    onChange={(e) => setEditingRecipe({ ...editingRecipe, cuisineType: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prep Time (mins)</label>
                  <input
                    type="number" required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={editingRecipe.preparationTime || ''}
                    onChange={(e) => setEditingRecipe({ ...editingRecipe, preparationTime: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty Level</label>
                  <select
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={editingRecipe.difficultyLevel || 'Easy'}
                    onChange={(e) => setEditingRecipe({ ...editingRecipe, difficultyLevel: e.target.value })}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
                <textarea
                  rows="4" required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={editingRecipe.instructions || ''}
                  onChange={(e) => setEditingRecipe({ ...editingRecipe, instructions: e.target.value })}
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button" onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-orange-500 text-white font-medium hover:opacity-90 transition-opacity shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageRecipes;