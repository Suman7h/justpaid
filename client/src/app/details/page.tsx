"use client";
import Navbar from "@/components/navbar";
import { AppSidebar } from "@/components/side";
import { SidebarProvider } from "@/components/ui/sidebar";
import Details from "@/components/details";
import React from "react";
import { useSearchParams } from "next/navigation";

const Page = () => {
  const searchParams = useSearchParams();
  const name = searchParams.get("name"); 

  return (
    <div>
      <Navbar />
      <SidebarProvider>
        
        <Details name={name || "Unknown"} />
      </SidebarProvider>
    </div>
  );
};

export default Page;
