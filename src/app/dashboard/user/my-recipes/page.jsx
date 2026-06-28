"use client"
import React, { useEffect, useState } from 'react';
import { Edit2, Trash2, Clock, Utensils, X } from 'lucide-react';
import { authClient } from '@/lib/auth-client'; 

const MyRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


 const getToken = async () => {
  const { data: session } = await authClient.getSession();
  return session?.session?.token || null;
};


 const fetchMyRecipes = async () => {
    try {
      setLoading(true);
      const { data: session } = await authClient.getSession();
      const token = session?.session?.token;
      const userEmail = session?.user?.email; 

      if (!token || !userEmail) {
        console.error("No token or email found.");
        return;
      }

      
      const res = await fetch(`https://recipehub-server-side.vercel.app/api/my-recipes?email=${userEmail}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Something went wrong");

      setRecipes(result.data || []);
    } catch (error) {
      console.error("Error fetching recipes:", error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchMyRecipes();
  }, []);

 
 const handleDelete = async (id) => {
  if (window.confirm("Are you sure you want to delete this recipe?")) {
    try {
      const { data: session } = await authClient.getSession();
      const token = session?.session?.token;
      const userEmail = session?.user?.email; 

      const res = await fetch(`https://recipehub-server-side.vercel.app/api/recipes/${id}?email=${userEmail}`, {
       
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await res.json();
      if (data.success) {
        alert("Recipe deleted successfully.");
        setRecipes(recipes.filter(recipe => recipe._id !== id));
      } else {
        alert(data.message || "Failed to delete recipe.");
      }
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  }
};
  
 const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data: session } = await authClient.getSession();
      const token = await getToken();
      
      
      const payload = { 
        ...editingRecipe, 
        email: session?.user?.email 
      };

      const res = await fetch(`https://recipehub-server-side.vercel.app/api/recipes/${editingRecipe._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (data.success) {
        alert("Recipe updated successfully!");
        setIsModalOpen(false);
        fetchMyRecipes();
      } else {
        alert(data.message || "Failed to update recipe.");
      }
    } catch (error) {
      console.error("Error updating recipe:", error);
    }
  };
  
  
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">My <span className="text-rose-600">Recipes</span></h2>
          <p className="text-gray-500 mt-1">Manage and organize your custom culinary recipes from this dashboard.</p>
        </div>
        <div className="bg-orange-50 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold border border-orange-200">
          Total Created: {recipes.length}
        </div>
      </div>

      {recipes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-dashed border-gray-200">
          <Utensils className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700">No Recipes Found</h3>
          <p className="text-gray-400 mt-1">You haven't posted any recipes yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div key={recipe._id} className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="relative h-48 w-full bg-gray-100">
                  <img 
                    src={recipe.recipeImage || "https://images.unsplash.com/photo-1495521821757-a1efb6729352"} 
                    alt={recipe.recipeName}
                    className="w-full h-full object-cover"
                  />
                  <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-white shadow-sm ${
                    recipe.status === 'approved' ? 'bg-emerald-500' : recipe.status === 'pending' ? 'bg-amber-500' : 'bg-rose-500'
                  }`}>
                    {recipe.status || 'pending'}
                  </span>
                </div>

                <div className="p-5">
                  <span className="text-xs font-bold text-orange-500 tracking-wide uppercase">
                    {recipe.cuisineType || 'General'} • {recipe.category || 'Uncategorized'}
                  </span>
                  <h3 className="text-xl font-bold text-gray-800 mt-1 line-clamp-1">{recipe.recipeName}</h3>
                  
                  <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-rose-500" />
                      <span>{recipe.preparationTime || 0} Mins</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        recipe.difficultyLevel === 'Easy' ? 'bg-green-50 text-green-600' : recipe.difficultyLevel === 'Medium' ? 'bg-yellow-50 text-yellow-600' : 'bg-red-50 text-red-600'
                      }`}>
                        {recipe.difficultyLevel || 'Easy'}
                  </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 grid grid-cols-2 gap-3 border-t border-gray-50 mt-4">
                <button 
                  onClick={() => { setEditingRecipe({ ...recipe }); setIsModalOpen(true); }}
                  className="flex items-center justify-center gap-2 border border-gray-200 text-gray-700 py-2.5 rounded-xl hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-colors text-sm font-medium"
                >
                  <Edit2 className="w-4 h-4" /> Edit
                </button>
                <button 
                  onClick={() => handleDelete(recipe._id)}
                  className="flex items-center justify-center gap-2 border border-transparent bg-rose-50 text-rose-600 py-2.5 rounded-xl hover:bg-rose-100 transition-colors text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

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
                  onChange={(e) => setEditingRecipe({...editingRecipe, recipeName: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                required
               className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={editingRecipe.category || ''} onChange={(e) => setEditingRecipe({...editingRecipe, category: e.target.value})}>
               <option value="" disabled hidden>Select a Category</option>
               <option value="Foods">Foods</option>
                <option value="Quick & Easy">Quick & Easy</option>
             <option value="Healthy">Healthy</option>
              <option value="Dessert">Dessert</option>
             <option value="Drinks & Juice">Drinks & Juice</option>
             <option value="Bakery">Bakery</option>
              <option value="Sea Food">Sea Food</option>
             <option value="Traditional">Traditional</option></select></div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cuisine Type</label>
                  <input 
                    type="text" required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={editingRecipe.cuisineType || ''}
                    onChange={(e) => setEditingRecipe({...editingRecipe, cuisineType: e.target.value})}
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
                    onChange={(e) => setEditingRecipe({...editingRecipe, preparationTime: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty Level</label>
                  <select 
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={editingRecipe.difficultyLevel || 'Easy'}
                    onChange={(e) => setEditingRecipe({...editingRecipe, difficultyLevel: e.target.value})}
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
                  onChange={(e) => setEditingRecipe({...editingRecipe, instructions: e.target.value})}
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

export default MyRecipes;