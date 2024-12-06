"use client";
import { Spotlight } from "@/components/ui/spotlight";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import SearchBar from "../components/searchbar";
import { useUser } from "@/components/userContext";

export default function Home() {
  const { user, isLoggedIn, login, logout } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState("/auth/login");
  const [redirectUrlr, setRedirectUrlr] = useState("/auth/register");

  
  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname + window.location.search;
      setRedirectUrl(`/auth/login?redirect=${encodeURIComponent(currentPath)}`);
      setRedirectUrlr(`/auth/register?redirect=${encodeURIComponent(currentPath)}`);
    }
  }, []);
  const getMessageLink = () => {
    if (!user) return "/message"; 
    const id = user.Id; 
    const name =user.name;
    const role=user.role
    return `/message?id=${id}&name=${encodeURIComponent(name)}&role=${encodeURIComponent(role)}`;
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      {/* Navbar */}
      <div className="flex items-center justify-between py-4">
        {/* Logo */}
        <div className="flex items-center ml-10 w-full space-x-6">
          <Link href="/">
            <span className="text-xl font-bold text-white">JustPaid</span>
          </Link>
        </div>

        {/* User Actions */}
        <div className={`flex items-center ${isLoggedIn ? 'space-x-2' : 'space-x-4'} mr-11`}>
          {isLoggedIn && user ? (
            <>
              {/* Messages Button */}
              <Button variant="ghost" className=" text-white">
                <Link href={getMessageLink()}>Messages</Link>
              </Button>

              {/* User Dropdown */}
              <div className="relative ">
              <button
              onClick={toggleDropdown}
              className="flex  items-center space-x-2 text-white font-medium focus:outline-none"
            >
              <img
                src={user.avatar}
                alt="User Avatar"
                className="w-8 h-8 rounded-full"
              />
              <span className="whitespace-nowrap">{user.name}</span>
            </button>


                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 bg-white shadow-md rounded-md p-2 w-40 z-50">
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={logout}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md w-full text-left"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Login and Sign Up Buttons */}
              <Link href={redirectUrl}>
                <Button variant="ghost" className="text-white">Login</Button>
              </Link>
              <Link href={redirectUrlr}>
                <Button variant="ghost" className="text-white">Sign up</Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Spotlight and Content */}
      <div className="flex-grow flex md:items-center md:justify-center relative">
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          fill="white"
        />
        <div className="p-4 max-w-7xl mx-auto relative z-10 w-full pt-20 md:pt-0">
          <h1 className="text-4xl md:text-5xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
            Find Your Next Finance Partner
          </h1>
          <div className="flex-1 flex justify-center items-center mt-8">
            <SearchBar />
          </div>
        </div>
      </div>
    </div>
  );
}
