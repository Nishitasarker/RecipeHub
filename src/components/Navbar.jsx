"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from '@heroui/react';
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast, ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";
import { ChefHat, LayoutDashboard, CircleUserRound, LogOut, Menu, X, Home } from 'lucide-react';

const Navbar = () => {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const pathname = usePathname();
  const router = useRouter();
  
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const dropdownRef = useRef(null);

  useEffect(() => {
    setMounted(true);

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setIsDrawerOpen(false);
  }, [pathname]);

  const handleLogOut = async () => {
    try {
      await authClient.signOut();
      localStorage.removeItem("user");
      
      setIsOpen(false);
      setIsDrawerOpen(false);
      toast.success("Successfully logged out! See you again.");
      router.refresh();
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };

  const handleProtectedNavigation = (e, targetPath) => {
    if (!session) {
      e.preventDefault(); 
      toast.warn("Please login first to access this page!");
      router.push("/auth/LogIn");
    }
  };

  if (!mounted) {
    return <div className="w-full bg-base-100 h-16 md:h-20 border-b border-gray-100 sticky top-0 z-50"></div>;
  }

  if (pathname.toLowerCase().includes('dashboard')) {
    return null;
  }

  // 💡 ম্যজিক লজিক: ডাটাবেজের 'user' রোলকে 'organizer' ফোল্ডার পাথে ম্যাপ করা হলো
  const userRole = user?.role?.toLowerCase();
  const dashboardPath = userRole === "admin" ? "/dashboard/admin" : "/dashboard/user";

  return (
    <>
      <div 
        className={`w-full px-4 md:px-20 h-16 md:h-20 flex justify-between items-center border-b border-gray-100 sticky top-0 z-50 transition-colors duration-300 ${
          isScrolled ? "bg-gray-50/95 backdrop-blur-md shadow-sm" : "bg-white"
        }`}
      >
        {/* Left Side */}
        <div className="flex items-center ">
          <Link href="/" className="flex items-center justify-center">
            <span className="p-2 bg-orange-500/10 text-orange-600 rounded-full border border-orange-200 shadow-inner">
                        <ChefHat size={36} />
                      </span>
            <span className="text-xl md:text-3xl text-[#c2271d] font-bold">
              RecipeHub
            </span>
          </Link>
        </div>

        {/* Middle Menu */}
        <div className="hidden lg:flex items-center">
          <ul className="flex items-center gap-8 font-medium text-lg">
            <li>
              <Link href="/" className={pathname === "/" ? "text-gray-800 font-bold text-lg" : "text-gray-600 text-lg hover:text-gray-900 transition-colors"}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/browseRecipes" className={pathname === "/browseRecipes" ? "text-gray-800 font-bold text-lg" : "text-gray-600 text-lg hover:text-gray-900 transition-colors"}>
                Browse Recipes
              </Link>
            </li>
            <li>
              <Link 
                href={dashboardPath} 
                onClick={(e) => handleProtectedNavigation(e, dashboardPath)}
                className={pathname.toLowerCase().includes("/dashboard") ? "text-[#c2271d] font-bold text-lg" : "text-gray-600 text-lg hover:text-gray-900 transition-colors"}
              >
                Dashboard
              </Link>
            </li>
          </ul>
        </div>

        {/* Right Side / Profile & Auth */}
        <div className="flex items-center gap-3" ref={dropdownRef}>
          {!session ? (
            <>
              <div className="hidden lg:flex items-center gap-3">
                <Button onPress={() => router.push("/auth/LogIn")} className={`font-semibold rounded-full text-lg border-2 transition-all duration-200 px-6 py-2 ${ pathname === "/auth/LogIn" ? "bg-[#c2271d] text-white border-[#c2271d]" : "bg-white text-[#c2271d] border-[#c2271d] hover:bg-red-50" }`}>
                  Login
                </Button>
                <Button onPress={() => router.push("/auth/RegisterPage")} className="font-semibold text-lg rounded-full border-2 transition-all duration-200 px-6 py-2 bg-[#c2271d] text-white border-[#c2271d] hover:bg-[#a31f18] hover:border-[#a31f18]">
                  Register
                </Button>
              </div>
              <button onClick={() => setIsDrawerOpen(true)} className="p-1.5 text-slate-800 lg:hidden focus:outline-none">
                <Menu size={24} />
              </button>
            </>
          ) : (
            <div className="flex text-base items-center gap-2 md:gap-3">
              <h2 className="hidden text-lg font-bold md:block text-yellow-800 ">{user?.name ? user.name.split(' ')[0].toUpperCase() : ''}</h2>
              <div className="relative">
                <button onClick={() => setIsOpen(!isOpen)} className="avatar block cursor-pointer focus:outline-none focus:scale-105 transition-transform">
                  <div className="w-9 h-9 md:w-10 md:h-10 rounded-full ring ring-sky-500 ring-offset-base-100 ring-offset-2 overflow-hidden flex-shrink-0">
                <Image src={user?.image || "/user.png"}  alt="User"  width={40}  height={40} className="w-full h-full rounded-full object-cover" />
                </div>
                </button>
                
                {isOpen && (
                  <div className="absolute right-0 mt-3 w-72 bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100 p-5 flex flex-col z-[100] animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="pb-4 mb-3 border-b border-gray-100">
                      <p className="font-bold text-gray-900 text-xl tracking-tight leading-tight">{user?.name}</p>
                      <p className="text-sm text-gray-400 mt-1 truncate">{user?.email}</p>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Link href={dashboardPath} className="flex items-center gap-3 px-4 py-3 text-[17px] font-semibold rounded-2xl transition-all duration-200 text-slate-700 hover:bg-red-50">
                        <LayoutDashboard size={22} className="text-orange-500" />
                        My Dashboard
                      </Link>
                      {/* <Link href="/dashboard/user/profile" className="flex items-center gap-3 px-4 py-3 text-[17px] font-semibold rounded-2xl transition-all duration-200 text-slate-700 hover:bg-red-50">
                        <CircleUserRound size={22} className="text-orange-500" />
                        Profile Settings
                      </Link> */}
                      <button onClick={handleLogOut} className="w-full flex items-center gap-3 px-4 py-3 text-[17px] font-bold rounded-2xl text-red-500 hover:bg-red-50/70 transition-all duration-200 mt-1">
                        <LogOut size={22} className="text-red-500" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <button onClick={() => setIsDrawerOpen(true)} className="p-1.5 text-slate-800 lg:hidden focus:outline-none">
                <Menu size={24} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[200] lg:hidden flex">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-xs transition-opacity" onClick={() => setIsDrawerOpen(false)}></div>
          <div className="relative w-full max-w-sm ml-auto bg-white h-full shadow-2xl flex flex-col p-6 animate-in slide-in-from-right duration-150">
            <div className="flex justify-between items-center pb-6 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ChefHat size={48} className="text-[#e65c00]" />                
                <span className="text-3xl text-[#c2271d] font-bold ">RecipeHub</span>
              </div>
              <button onClick={() => setIsDrawerOpen(false)} className="p-1 text-slate-500 hover:bg-gray-100 rounded-lg focus:outline-none">
                <X size={26} />
              </button>
            </div>

            <div className="flex-1 flex flex-col mt-8 justify-between">
              <div className="flex flex-col gap-3.5">
                <Link href="/" className={`flex items-center gap-4 px-5 py-4 text-lg font-bold rounded-2xl border-l-4 transition-all duration-150 ${pathname === "/" ? "bg-red-100 text-slate-900 border-orange-400" : "text-slate-600 border-transparent hover:bg-red-50/70"}`}>
                  <Home size={22} />
                  Home
                </Link>
                <Link href="/browseRecipes" className={`flex items-center gap-4 px-5 py-4 text-lg font-bold rounded-2xl border-l-4 transition-all duration-150 ${pathname === "/browseRecipes" ? "bg-red-100 text-slate-900 border-orange-400" : "text-slate-600 border-transparent hover:bg-red-50/70"}`}>
                  <ChefHat size={22} />
                  Browse Recipes
                </Link>
                <Link 
                  href={dashboardPath} 
                  onClick={(e) => handleProtectedNavigation(e, dashboardPath)} 
                  className={`flex items-center gap-4 px-5 py-4 text-lg font-bold rounded-2xl border-l-4 transition-all duration-150 ${pathname.toLowerCase().includes("/dashboard") ? "bg-red-100 text-slate-900 border-orange-400" : "text-slate-600 border-transparent hover:bg-red-50/70"}`}
                >
                  <LayoutDashboard size={22} />
                  My Dashboard
                </Link>
                {/* <Link href="/ProfileSettings" onClick={(e) => handleProtectedNavigation(e, "/ProfileSettings")} className="flex items-center gap-4 px-5 py-4 text-lg font-bold rounded-2xl border-l-4 transition-all duration-150 text-slate-600 border-transparent hover:bg-red-50/70">
                  <CircleUserRound size={22} />
                  Profile Settings
                </Link> */}
              </div>

              <div className="pb-6">
                {session ? (
                  <button onClick={handleLogOut} className="w-full flex items-center justify-center gap-3 py-3.5 text-center font-bold text-red-50 bg-red-500 hover:bg-red-600 rounded-2xl transition-colors text-[17px]">
                    <LogOut size={22} />
                    Logout
                  </button>
                ) : (
                  <div className="flex flex-col gap-3">
                    <button onClick={() => router.push("/auth/LogIn")} className="w-full py-3.5 text-center font-bold text-[#c2271d] border-2 border-[#c2271d] rounded-2xl hover:bg-red-50/50 transition-colors text-[17px]">
                      Login
                    </button>
                    <button onClick={() => router.push("/auth/RegisterPage")} className="w-full py-3.5 text-center font-bold text-white bg-[#c2271d] rounded-2xl hover:bg-[#a31f18] shadow-md transition-colors text-[17px]">
                      Register
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={2500} theme="light" />
    </>
  );
};

export default Navbar;