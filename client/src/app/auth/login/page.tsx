"use client";
import LoginForm from "@/components/auth/login-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const LoginPage = () => {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/pages"; 

  return (
    <div className="h-screen flex items-center justify-center">
      <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
        <div className="flex items-center justify-between py-4">
          {/* Logo and Search */}
          <div className="flex items-center ml-10 w-full space-x-6">
            <Link href="/">
              <span className="text-xl font-bold text-gray-800">JustPaid</span>
            </Link>
          </div>
          <div className="flex items-center space-x-6 mr-10">
            <Button asChild>
              <Link href={`/auth/login?redirect=${redirect}`}>Login</Link>
            </Button>
            <Button asChild>
              <Link href={`/auth/register?redirect=${redirect}`}>Sign up</Link>
            </Button>
          </div>
        </div>
      </nav>
      {/* Pass redirect to the login form */}
      <LoginForm redirect={redirect} />
    </div>
  );
};

export default LoginPage;
