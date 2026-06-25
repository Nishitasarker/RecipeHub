"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LuChefHat } from "react-icons/lu"; 
import { FaFacebook, FaLinkedin, FaInstagram, FaGithub } from "react-icons/fa6"; 
import { usePathname } from "next/navigation";

export default function Footer() {

  const pathname = usePathname();
  
    if(pathname.includes('dashboard')){
      return null;
    }
  const currentYear = new Date().getFullYear();

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <footer className="w-full bg-[#030712] text-gray-400 border-t pl-12 border-gray-900/50">
      <motion.div 
        className="mx-auto max-w-7xl px-6 py-12 md:py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        
        {/* 📱 Mobile: 2 Columns | 💻 Desktop: 4 Columns */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 text-left">
          
          {/* Column 1: Brand Info & Socials (Desktop e prothome dynamically thakbe, phone e shobar last e jabe) */}
          <motion.div 
            variants={itemVariants} 
            className="flex flex-col items-center md:items-start text-center md:text-left gap-4 col-span-2 md:col-span-1 order-last md:order-first pt-8 md:pt-0 mt-4 md:mt-0 border-t border-gray-900/40 md:border-t-0"
          >
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
             <span className="p-2 bg-orange-500/10 text-orange-600 rounded-full border border-orange-200 shadow-inner">
                         <LuChefHat size={36} />
                       </span>
              <span className="text-lg md:text-2xl text-[#c2271d] font-bold tracking-tight">
                RecipeHub
              </span>
            </Link>

            <p className="text-xs md:text-sm leading-relaxed text-gray-400 max-w-sm">
              Explore thousands of delicious recipes, share your creations, and connect with a passionate community of food lovers and home chefs.
            </p>
            
            {/* Social Icons */}
            <div className="flex items-center justify-center md:justify-start gap-6 mt-1 text-gray-400">
              <motion.a whileHover={{ scale: 1.1, color: "#fff" }} href="#" className="transition-colors" aria-label="Facebook">
                <FaFacebook size={22} />
              </motion.a>
              <motion.a whileHover={{ scale: 1.1, color: "#fff" }} href="#" className="transition-colors" aria-label="LinkedIn">
                <FaLinkedin size={22} />
              </motion.a>
              <motion.a whileHover={{ scale: 1.1, color: "#fff" }} href="#" className="transition-colors" aria-label="Instagram">
                <FaInstagram size={22} />
              </motion.a>
              <motion.a whileHover={{ scale: 1.1, color: "#fff" }} href="#" className="transition-colors" aria-label="GitHub">
                <FaGithub size={22} />
              </motion.a>
            </div>
          </motion.div>

          {/* Column 2: Explore Recipes */}
          <motion.div variants={itemVariants} className="order-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Explore Recipes
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li><Link href="/recipes/breakfast" className="hover:text-white transition-colors block py-0.5">Breakfast & Brunch</Link></li>
              <li><Link href="/recipes/healthy" className="hover:text-white transition-colors block py-0.5">Healthy & Vegan</Link></li>
              <li><Link href="/recipes/desserts" className="hover:text-white transition-colors block py-0.5">Desserts & Baking</Link></li>
              <li><Link href="/recipes/quick-meals" className="hover:text-white transition-colors block py-0.5">30-Minute Meals</Link></li>
            </ul>
          </motion.div>

          {/* Column 3: For Creators */}
          <motion.div variants={itemVariants} className="order-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              For Creators
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li><Link href="/recipe/submit" className="hover:text-white transition-colors block py-0.5">Submit a Recipe</Link></li>
              <li><Link href="/chef/dashboard" className="hover:text-white transition-colors block py-0.5">Chef Dashboard</Link></li>
              <li><Link href="/community/challenges" className="hover:text-white transition-colors block py-0.5">Cooking Challenges</Link></li>
              <li><Link href="/guidelines" className="hover:text-white transition-colors block py-0.5">Content Guidelines</Link></li>
            </ul>
          </motion.div>

          {/* Column 4: Company */}
          <motion.div variants={itemVariants} className="order-3 col-span-2 sm:col-span-1 md:col-span-1 mt-4 sm:mt-0">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Company
            </h3>
            <ul className="grid grid-cols-2 gap-2.5 sm:flex sm:flex-col text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors block py-0.5">About Our Journey</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors block py-0.5">Culinary Blog</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors block py-0.5">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors block py-0.5">Terms of Service</Link></li>
            </ul>
          </motion.div>

        </div>

        {/* Bottom Copyright Section */}
        <motion.div 
          variants={itemVariants}
          className="mt-12 border-t border-gray-500z pt-8 text-center text-xs text-gray-500"
        >
          <p>
            &copy; {currentYear} RecipeHub Inc. All rights reserved. Crafting flavors with love.
          </p>
        </motion.div>

      </motion.div>
    </footer>
  );
}