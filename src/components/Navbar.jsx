"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from '@heroui/react';
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast, ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";

import { LayoutDashboard, CircleUserRound, LayoutGrid, LogOut, Menu, X, Home, Car } from "lucide-react";

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

  return (
    <>
           <div 
        className={`w-full px-4 md:px-20 h-16 md:h-20 flex justify-between items-center border-b border-gray-100 sticky top-0 z-50 transition-colors duration-300 ${
          isScrolled ? "bg-gray-50/95 backdrop-blur-md shadow-sm" : "bg-white"
        }`}
      >
        
        {/* left side*/}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center justify-center gap-1.5 md:gap-2">
            {/* <Image src="/sedan.png" alt="DriveFleet Logo" height={35} width={35} className="md:hidden" priority />
            <Image src="/sedan.png" alt="DriveFleet Logo" height={50} width={50} className="hidden md:block" priority /> */}
            <span className="text-lg md:text-xl font-extrabold uppercase tracking-wider bg-gradient-to-r from-zinc-950 via-sky-500 to-cyan-600 !bg-clip-text !text-transparent">
              DriveFleet
            </span>
          </Link>
        </div>

        {/* middle*/}
        <div className="hidden lg:flex items-center">
          <ul className="flex items-center gap-8 font-medium text-lg">
            <li>
              <Link href="/" className={pathname === "/" ? "text-sky-500 font-bold" : "text-black hover:text-sky-500"}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/BrowseEvents" className={pathname === "/BrowseEvents" ? "text-sky-500 font-bold" : "text-black hover:text-sky-500"}>
                Browse Events
              </Link>
            </li>
            <li>
              <Link 
                href="/DashBoard" 
                onClick={(e) => handleProtectedNavigation(e, "/DashBoard")}
                className={pathname === "/AddCarForm" ? "text-sky-500 font-bold" : "text-black hover:text-sky-500"}
              >
                Dash Board
              </Link>
            </li>
            {/* <li>
              <Link 
                href="/MyBookings" 
                onClick={(e) => handleProtectedNavigation(e, "/MyBookings")}
                className={pathname === "/MyBookings" ? "text-sky-500 font-bold" : "text-black hover:text-sky-500"}
              >
                My Bookings
              </Link>
            </li> */}
          </ul>
        </div>

        {/*right side */}
        <div className="flex items-center gap-3" ref={dropdownRef}>
          {!session ? (
            <>
             
              <div className="hidden lg:flex items-center gap-3">
                <Button onPress={() => router.push("/auth/LogIn")} className={`font-semibold rounded-xl text-lg border-2 transition-all duration-200 ${pathname === "/LogIn" ? "bg-blue-500 text-white border-blue-200 px-4 py-1" : "bg-white text-blue-500 border-blue-200 px-4 py-1 hover:bg-blue-50/50"}`}>Login</Button>
                <Button onPress={() => router.push("/auth/RegisterPage")} className={`font-semibold text-lg rounded-xl border-2 transition-all duration-200 ${pathname === "/RegisterPage" ? "bg-blue-500 text-white border-blue-200 px-4 py-1" : "bg-slate-50/50 text-blue-500 border-blue-200 px-4 py-1 hover:bg-blue-50/50"}`}>Register</Button>
              </div>

             
              <button onClick={() => setIsDrawerOpen(true)} className="p-1.5 text-slate-800 lg:hidden focus:outline-none">
                <Menu size={24} />
              </button>
            </>
          ) : (
            <div className="flex text-base items-center gap-2 md:gap-3">
              <h2 className="hidden text-lg font-bold md:block  text-gray-700 ">{user?.name ? user.name.split(' ')[0].toUpperCase() : ''}</h2>
              
              <div className="relative">
              
                <button 
                  onClick={() => setIsOpen(!isOpen)} 
                  className="avatar block cursor-pointer focus:outline-none focus:scale-105 transition-transform"
                >
                  <div className="w-9 h-9 md:w-10 md:h-10 rounded-full ring ring-sky-500 ring-offset-base-100 ring-offset-2 overflow-hidden">
                    <Image src={user?.image || "/user.png"} alt="User" width={40} height={40} className="rounded-full object-cover" />
                  </div>
                </button>
                
                                {isOpen && (
                  <div className="absolute right-0 mt-3 w-72 bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100 p-5 flex flex-col z-[100] animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="pb-4 mb-3 border-b border-gray-100">
                      <p className="font-bold text-gray-900 text-xl tracking-tight leading-tight">{user?.name}</p>
                      <p className="text-sm text-gray-400 mt-1 truncate">{user?.email}</p>
                    </div>
                    
                    <div className="flex flex-col gap-1.5">
                      <Link href="/Dashboard" className={`flex items-center gap-3 px-4 py-3 text-[17px] font-semibold rounded-2xl transition-all duration-200 ${pathname === "/Dashboard" ? "bg-blue-50 text-blue-600" : "text-slate-700 hover:bg-gray-50"}`}>
                        <LayoutDashboard size={22} className={pathname === "/AddCarForm" ? "text-blue-600" : "text-blue-500"} />
                        My Dashboard
                      </Link>
                      <Link href="/MyBookings" className={`flex items-center gap-3 px-4 py-3 text-[17px] font-semibold rounded-2xl transition-all duration-200 ${pathname === "/MyBookings" ? "bg-blue-50 text-blue-600" : "text-slate-700 hover:bg-gray-50"}`}>
                        <CircleUserRound size={22} className={pathname === "/MyBookings" ? "text-blue-600" : "text-blue-500"} />
                        Profile Settings
                      </Link>
                      {/* <Link href="/MyAddedCars" className={`flex items-center gap-3 px-4 py-3 text-[17px] font-semibold rounded-2xl transition-all duration-200 ${pathname === "/MyAddedCars" ? "bg-blue-50 text-blue-600" : "text-slate-700 hover:bg-gray-50"}`}>
                        <LayoutGrid size={22} className={pathname === "/MyAddedCars" ? "text-blue-600" : "text-blue-500"} />
                        My Added Cars
                      </Link> */}
                      <button onClick={handleLogOut} className="w-full flex items-center gap-3 px-4 py-3 text-[17px] font-semibold rounded-2xl text-red-500 hover:bg-red-50/70 transition-all duration-200 mt-1">
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

            {isDrawerOpen && (
        <div className="fixed inset-0 z-[200] lg:hidden flex">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-xs transition-opacity" onClick={() => setIsDrawerOpen(false)}></div>

          <div className="relative w-full max-w-sm ml-auto bg-white h-full shadow-2xl flex flex-col p-6 animate-in slide-in-from-right duration-150">
            
            <div className="flex justify-between items-center pb-6 border-b border-gray-100">
              <div className="flex items-center gap-2">
                {/* <Image src="/sedan.png" alt="DriveFleet Logo" height={50} width={50} priority /> */}
                <span className="text-2xl font-extrabold uppercase tracking-wider bg-gradient-to-r from-zinc-950 via-sky-500 to-cyan-600 !bg-clip-text !text-transparent">
                  DriveFleet
                </span>
              </div>
              <button onClick={() => setIsDrawerOpen(false)} className="p-1 text-slate-500 hover:bg-gray-100 rounded-lg focus:outline-none">
                <X size={26} />
              </button>
            </div>

          
            <div className="flex-1 flex flex-col mt-8 justify-between">
              <div className="flex flex-col gap-3.5">
                <Link href="/" className={`flex items-center gap-4 px-5 py-4 text-lg font-bold rounded-2xl border-l-4 transition-all duration-150 ${pathname === "/" ? "bg-blue-50 text-slate-900 border-cyan-400" : "text-slate-600 border-transparent hover:bg-gray-50/70"}`}>
                  <Home size={22} className={pathname === "/" ? "text-slate-900" : "text-slate-500"} />
                  Home
                </Link>
                
                <Link href="/BrowseEvent" className={`flex items-center gap-4 px-5 py-4 text-lg font-bold rounded-2xl border-l-4 transition-all duration-150 ${pathname === "/BrowseEvent" ? "bg-blue-50 text-slate-900 border-cyan-400" : "text-slate-600 border-transparent hover:bg-gray-50/70"}`}>
                  <Car size={22} className={pathname === "/BrowseEvent" ? "text-slate-900" : "text-slate-500"} />
                  Browse Event
                </Link>

                <Link href="/AddCarForm" onClick={(e) => handleProtectedNavigation(e, "/AddCarForm")} className={`flex items-center gap-4 px-5 py-4 text-lg font-bold rounded-2xl border-l-4 transition-all duration-150 ${pathname === "/AddCarForm" ? "bg-blue-50 text-slate-900 border-cyan-400" : "text-slate-600 border-transparent hover:bg-gray-50/70"}`}>
                  <LayoutDashboard size={22} className={pathname === "/AddCarForm" ? "text-slate-900" : "text-slate-500"} />
                  My Dashboard
                </Link>

                <Link href="/ProfileSettings" onClick={(e) => handleProtectedNavigation(e, "/ProfileSettings")} className={`flex items-center gap-4 px-5 py-4 text-lg font-bold rounded-2xl border-l-4 transition-all duration-150  ${pathname === "/MyBookings" ? "bg-blue-50 text-slate-900 border-cyan-400" : "text-slate-600 border-transparent hover:bg-gray-50/70"}`}>
                        <CircleUserRound size={22} className={pathname === "/ProfileSettings" ? "text-slate-900" : "text-slate-500"}  />
                        Profile Settings
                      </Link>

                {/* <Link href="/MyBookings" onClick={(e) => handleProtectedNavigation(e, "/MyBookings")} className={`flex items-center gap-4 px-5 py-4 text-lg font-bold rounded-2xl border-l-4 transition-all duration-150 ${pathname === "/MyBookings" ? "bg-blue-50 text-slate-900 border-cyan-400" : "text-slate-600 border-transparent hover:bg-gray-50/70"}`}>
                  <Calendar size={22} className={pathname === "/MyBookings" ? "text-slate-900" : "text-slate-500"} />
                  My Bookings
                </Link> */}

                {/* <Link href="/MyAddedCars" onClick={(e) => handleProtectedNavigation(e, "/MyAddedCars")} className={`flex items-center gap-4 px-5 py-4 text-lg font-bold rounded-2xl border-l-4 transition-all duration-150 ${pathname === "/MyAddedCars" ? "bg-blue-50 text-slate-900 border-cyan-400" : "text-slate-600 border-transparent hover:bg-gray-50/70"}`}>
                  <LayoutGrid size={22} className={pathname === "/MyAddedCars" ? "text-slate-900" : "text-slate-500"} />
                  My Added Cars
                </Link> */}
              </div>

                       <div className="pb-6">
                {session ? (
                  <button 
                    onClick={handleLogOut} 
                    className="w-full flex items-center justify-center gap-3 py-3.5 text-center font-bold text-red-500 bg-red-50 hover:bg-red-100 rounded-2xl transition-colors text-[17px]"
                  >
                    <LogOut size={22} className="text-red-500" />
                    Logout
                  </button>
                ) : (
                  <div className="flex flex-col gap-3">
                    <button onClick={() => router.push("/auth/LogIn")} className="w-full py-3.5 text-center font-bold text-blue-600 border-2 border-blue-500 rounded-2xl hover:bg-blue-50/50 transition-colors text-[17px]">
                      Login
                    </button>
                    <button onClick={() => router.push("/auth/RegisterPage")} className="w-full py-3.5 text-center font-bold text-white bg-blue-600 rounded-2xl hover:bg-blue-700 shadow-md transition-colors text-[17px]">
                      Register
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

            <ToastContainer 
        position="top-right" 
        autoClose={2500} 
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default Navbar;