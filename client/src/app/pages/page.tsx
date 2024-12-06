"use client";
import React from "react";
import Navbar from "@/components/navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { CardsCarousel } from "@/components/card";
import { useSearchParams } from "next/navigation";


export default function Page1() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const locationQuery = searchParams.get("location") || "";
  console.log(searchQuery,locationQuery)
  return (
    <>
      <Navbar/>
      <SidebarProvider> 
        <CardsCarousel searchQuery={searchQuery} locationQuery={locationQuery} />
      </SidebarProvider>
    </>
  );
}
