"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Users, Crown } from 'lucide-react';

const features = [
  { icon: UserPlus, title: "Create account", desc: "Build your empire. We can't wait to see the magic you are going to create here!" },
  { icon: Users, title: "Find friends", desc: "Build network with other quality chefs here, start creating wonders!" },
  { icon: Crown, title: "Become Pro", desc: "Start upload and manage your content and get most views by other creators." }
];

export default function FeaturesSection() {
  // অ্যানিমেশন কন্ট্রোলার
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section className="bg-white text-white py-16 px-6 md:px-12 overflow-hidden">
     <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#8b1c14] via-[#b45309] to-[#d97706]  mb-4">
            Start Your Culinary Journey
          </h2>
          <p className="text-gray-600 text-lg">
            Follow these simple steps to become a part of our amazing community.
          </p>
        </div>
     
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12"
      >
        
        {/* শেফ ইমেজ */}
        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full md:w-1/3 flex justify-center"
        >
          <img src="/chef-image.png" alt="Chef" className="h-72 object-cover rounded-2xl shadow-2xl" />
        </motion.div>

        {/* ফিচার কার্ডস */}
        <div className="w-full md:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="flex flex-col items-center text-center p-6 bg-[#1f2937] rounded-2xl border border-gray-700 hover:border-orange-500 transition-colors"
            >
              <div className=" bg-white text-[#8b1c14] p-4 rounded-full shadow-md mb-4">
                <feature.icon size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}