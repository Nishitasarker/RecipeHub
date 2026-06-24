"use client";
import React from 'react';
import { motion } from 'framer-motion';

const chefs = [
  {
    name: "Chef Marcus Sterling",
    role: "Pastry Specialist",
    image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=400",
    bio: "Bringing 15+ years of French pastry experience straight to your home kitchen."
  },
  {
    name: "Elena Rostova",
    role: "Mediterranean Expert",
    image: "https://images.unsplash.com/photo-1581299894007-aaa50297cf16?auto=format&fit=crop&q=80&w=400",
    bio: "Passionate about wholesome, olive-oil-infused traditional coastal dishes."
  },
  {
    name: "Kenji Tanaka",
    role: "Asian Fusion Master",
    image: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&q=80&w=400",
    bio: "Mastering the balance of sweet, sour, salty, and umami street flavors."
  }
];

export default function ChefSpotlight() {
  return (
    <section className="py-16 bg-gray-50/70 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white"
          >
            Meet Our <span className="text-orange-500">Culinary Masters</span>
          </motion.h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2 max-w-md mx-auto">
            Learn from industry-leading chefs who share their secret recipes on RecipeHub.
          </p>
        </div>

        {/* Chef Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {chefs.map((chef, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{ y: -10 }}
              className="bg-white dark:bg-gray-700 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-600 transition-shadow hover:shadow-xl"
            >
              <div className="h-64 overflow-hidden relative group">
                <img 
                  src={chef.image} 
                  alt={chef.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-white text-sm font-medium tracking-wide uppercase">{chef.role}</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1">{chef.name}</h3>
                <p className="text-orange-500 font-medium text-sm mb-3">{chef.role}</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">{chef.bio}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}