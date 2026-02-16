"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, ChevronDown } from "lucide-react";

interface NavData {
  genders: string[];
  clothingTypes: string[];
  objectTypes: string[];
}

export default function NavbarClient({ data }: { data: NavData }) {
  const pathname = usePathname();
  const [isShopOpen, setIsShopOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <nav
      className="fixed top-0 z-50 w-full border-b border-neutral-200 bg-white shadow-sm"
      onMouseLeave={() => setIsShopOpen(false)}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Brand Logo */}
        <Link
          href="/"
          className="text-xl font-bold tracking-[0.3em] uppercase italic text-black hover:opacity-70 transition-opacity"
        >
          Novenarii
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-10 h-full">
          {/* Main Shop Dropdown */}
          <div
            className="relative h-full flex items-center"
            onMouseEnter={() => setIsShopOpen(true)}
          >
            <button
              className={`flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] font-medium transition-colors ${isShopOpen ? "text-black" : "text-neutral-600 hover:text-black"}`}
            >
              Shop
              <ChevronDown
                size={12}
                strokeWidth={2}
                className={`transition-transform duration-200 ${isShopOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Mega Menu Dropdown */}
            {isShopOpen && (
              <div className="absolute left-[-200px] top-[100%] w-[850px] bg-white border border-neutral-200 shadow-2xl p-0 overflow-hidden flex animate-in fade-in slide-in-from-top-1">
                {/* Left Side: Category Links (3 Columns) */}
                <div className="grid grid-cols-3 gap-10 p-10 flex-grow">
                  {/* Column 1 & 2: Genders */}
                  {data.genders.map((gender) => (
                    <div key={gender} className="flex flex-col gap-4">
                      <Link
                        href={`/shop/${gender}/all`}
                        className="text-[11px] font-bold uppercase tracking-[0.2em] text-black border-b border-neutral-100 pb-2 hover:opacity-60 transition-opacity"
                        onClick={() => setIsShopOpen(false)}
                      >
                        {gender}
                      </Link>
                      <div className="flex flex-col gap-3">
                        {data.clothingTypes.map((type) => (
                          <Link
                            key={type}
                            href={`/shop/${gender}/${type.toLowerCase()}`}
                            className={`text-[10px] uppercase tracking-[0.15em] transition-colors font-medium ${isActive(`/shop/${gender}/${type.toLowerCase()}`) ? "text-black" : "text-neutral-500 hover:text-black"}`}
                            onClick={() => setIsShopOpen(false)}
                          >
                            {type}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Column 3: Objects & Shop All */}
                  <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-4">
                      <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-black border-b border-neutral-100 pb-2">
                        Objects
                      </span>
                      <div className="flex flex-col gap-3">
                        {data.objectTypes.map((type) => (
                          <Link
                            key={type}
                            href={`/shop/unisex/${type.toLowerCase()}`}
                            className="text-[10px] uppercase tracking-[0.15em] text-neutral-500 hover:text-black font-medium transition-colors"
                            onClick={() => setIsShopOpen(false)}
                          >
                            {type}
                          </Link>
                        ))}
                      </div>
                    </div>

                    <Link
                      href="/shop"
                      className="mt-auto group flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-black"
                      onClick={() => setIsShopOpen(false)}
                    >
                      <span className="border-b border-black pb-0.5 group-hover:opacity-60 transition-opacity">
                        Shop All
                      </span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>

                {/* Right Side: Featured Visual Column */}
                <div className="w-[280px] relative group overflow-hidden border-l border-neutral-100 bg-neutral-50">
                  <Link
                    href="/shop/male/all"
                    onClick={() => setIsShopOpen(false)}
                  >
                    <img
                      src="https://cdn.shopify.com/s/files/1/0665/8749/2418/files/Runway_Hoodie_on_model.png?v=1771257979"
                      alt="Featured"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                    <div className="absolute bottom-6 left-6 text-white">
                      <p className="text-[9px] uppercase tracking-[0.3em] font-medium mb-1">
                        New Arrivals
                      </p>
                      <p className="text-sm font-light italic tracking-tight">
                        Fall Winter 2026
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link
            href="/about"
            className="text-[11px] uppercase tracking-[0.2em] font-medium text-neutral-600 hover:text-black transition-colors"
          >
            About
          </Link>
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center gap-4">
          <button className="p-2 text-black hover:opacity-60 transition-opacity relative group">
            <ShoppingBag size={20} strokeWidth={1.8} />
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[8px] font-bold text-white">
              0
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}
