"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Globe } from 'lucide-react';
import { HousePlus } from 'lucide-react';


export default function DashboardHeader({ userName, userRole, userImage }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const pathname = usePathname();

  // বাইরে ক্লিক করলে ড্রপডাউন বন্ধ করার লজিক
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex h-16 items-center border-b border-default-200 px-15 justify-between bg-background">
      <h1 className="text-xl text-gray-800 font-bold capitalize">{userRole} Panel</h1>

      <div className="flex items-center gap-4 relative" ref={dropdownRef}>
        {/* ইউজার নেম */}
        <span className="text-lg font-bold uppercase text-orange-900">
          {userName ? userName.split(' ')[0] : 'Anonymous Chef'}
        </span>

        {/* অ্যাভাটার বাটন */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 focus:outline-none"
        >
          <Image 
            src={userImage || "/user.png"} 
            alt="User" 
            width={40} 
            height={40} 
            className="object-cover" 
          />
        </button>

        {/* ড্রপডাউন মেনু */}
        {isOpen && (
          <div className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-lg border border-gray-100 p-2 z-50">
            <Link 
              href="/" 
              className={`flex gap-1 px-4 py-2 rounded-lg text-base font-medium ${pathname === "/" ? "bg-gray-400 text-gray-900" : "text-gray-700 hover:bg-red-50"}`}
            >
                 <HousePlus className="text-orange-700 "/>
              Home
            </Link>
            <Link 
              href="/browseRecipes" 
              className={` flex gap-1 px-4 py-2 rounded-lg text-base font-medium ${pathname === "/browseRecipes" ? "bg-gray-400 text-gray-900" : "text-gray-700 hover:bg-red-50"}`}
            >
                <Globe  className="text-orange-700 "/>
              Browse Recipes
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}