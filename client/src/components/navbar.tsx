"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import SearchBar from "./searchbar";
import { useUser } from "@/components/userContext";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const { user, isLoggedIn, login, logout } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState("/auth/login");
  const [redirectUrlr, setRedirectUrlr] = useState("/auth/register");
  const router = useRouter();
  const pathname = usePathname(); 

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname + window.location.search;
      setRedirectUrl(`/auth/login?redirect=${encodeURIComponent(currentPath)}`);
      setRedirectUrlr(`/auth/register?redirect=${encodeURIComponent(currentPath)}`);
    }
  }, []);

  const handleLogout = () => {
    logout();

    
    if (pathname === "/message") {
      router.push("/");
    } else {
      
      router.refresh();
    }
  };
  const getMessageLink = () => {
    if (!user) return "/message"; 
    const id = user.Id; 
    const name =user.name;
    const role=user.role
    return `/message?id=${id}&name=${encodeURIComponent(name)}&role=${encodeURIComponent(role)}`;
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="flex items-center justify-between py-4">
        {/* Logo and Search */}
        <div className="flex items-center ml-10 w-full space-x-6">
          <Link href="/">
            <span className="text-xl font-bold text-gray-800">JustPaid</span>
          </Link>

          {/* Search Input */}
          <div className="flex-1 flex items-center gap-4">
            <div className="ml-28 w-3/4">
              <SearchBar />
            </div>
          </div>
        </div>

        {/* Right Side - Links/Buttons */}
        <div className="flex items-center space-x-4 mr-11">
          {isLoggedIn && user ? (
            <>
              {/* Message Button */}
              <Button className="mr-4">
                <Link href={getMessageLink()}>Messages</Link>
              </Button>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-1 text-gray-800 font-medium focus:outline-none"
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
                      onClick={handleLogout}
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
                <Button>Login</Button>
              </Link>

              <Button>
                <Link href={redirectUrlr}>Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
