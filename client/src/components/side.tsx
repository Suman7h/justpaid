"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import React, { useState } from "react";

import { Facebook, Twitter, Linkedin } from "lucide-react";

export function AppSidebar() {
  const [price, setPrice] = useState(33);
  const [locations, setLocations] = useState<string[]>([]);

  const handleAddLocation = (location: string) => {
    if (location && !locations.includes(location)) {
      setLocations((prev) => [...prev, location]);
    }
  };

  const handleRemoveLocation = (location: string) => {
    setLocations((prev) => prev.filter((loc) => loc !== location));
  };

  return (
<Sidebar className="mt-20 w-64 bg-white p-4 flex flex-col h-[calc(100vh-5rem)]">
  <SidebarContent className="flex-1">
    {/* Price Filter */}
    <SidebarGroup>
      <SidebarGroupLabel>
        <h3 className="text-base font-semibold mb-2">Filters</h3>
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <div className="mb-4">
          <h3 className="text-sm mb-2">Price</h3>
          <div className="flex items-center justify-between">
            <Slider
              defaultValue={[price]}
              max={100}
              step={1}
              onValueChange={(value) => setPrice(value[0])}
            />
            <div className="ml-4 text-sm bg-gray-100 px-2 py-1 rounded-md">
              ${price}
            </div>
          </div>
        </div>
      </SidebarGroupContent>
    </SidebarGroup>

    <hr className="my-1" />

    {/* Ratings */}
    <SidebarGroup>
      <SidebarGroupLabel>
        <h3 className="text-sm mb-2">Ratings</h3>
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center space-x-2">
              <Checkbox id={`${star}stars`} />
              <label htmlFor={`${star}stars`} className="text-sm">
                {star} star{star > 1 && "s"}
              </label>
            </div>
          ))}
        </div>
      </SidebarGroupContent>
    </SidebarGroup>

    <hr className="my-1" />

   
    {/* Search */}
    <SidebarGroup>
      <SidebarGroupContent>
        <div className="flex items-center justify-center h-full">
          <Button variant="destructive">Search</Button>
        </div>
      </SidebarGroupContent>
    </SidebarGroup>
  </SidebarContent>

  {/* Footer Section */}
  <SidebarFooter className="pt-4 border-t border-gray-200">
    <div className="flex justify-center gap-4 mb-2">
      <a
        href="https://www.linkedin.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800"
      >
        <Linkedin className="w-5 h-5" />
      </a>
      <a
        href="https://twitter.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 hover:text-blue-600"
      >
        <Twitter className="w-5 h-5" />
      </a>
      <a
        href="https://facebook.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-700 hover:text-blue-900"
      >
        <Facebook className="w-5 h-5" />
      </a>
    </div>
    <div className="text-center text-xs text-gray-500">
      © {new Date().getFullYear()} Justpaid. All rights reserved.
    </div>
  </SidebarFooter>
</Sidebar>

  );
}
