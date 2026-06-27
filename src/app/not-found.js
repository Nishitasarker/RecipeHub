import Link from 'next/link';
import { ArrowLeft, ChefHat } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-black px-6 text-center">
      
      {/* ইলাস্ট্রেশন এরিয়া */}
      <div className="relative ">
        <ChefHat size={120} className="text-orange-500 animate-bounce" />
        <div className="absolute -top-4 -right-4 bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
          404
        </div>
      </div>

      {/* এরর মেসেজ */}
      <h1 className="text-4xl md:text-6xl font-black text-neutral-800 dark:text-neutral-100 mb-4">
        Oops!
      </h1>
      <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8 max-w-md">
       Our chefs haven't cooked up this page yet. It seems you've wandered into an empty kitchen!      </p>

      {/* ব্যাক হোম বাটন */}
      <Link 
        href="/"
        className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-600 to-rose-600 text-white rounded-full font-bold shadow-lg hover:shadow-orange-500/30 transition-all hover:scale-105"
      >
        <ArrowLeft size={20} />
        Back to Home
      </Link>
    </div>
  );
}