'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, ChevronDown } from 'lucide-react';

interface NavData {
    genders: string[];
    clothingTypes: string[];
    objectTypes: string[];
}

export default function NavbarClient({ data }: { data: NavData }) {
    const pathname = usePathname();
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    const isActive = (path: string) => pathname === path;

    return (
        <nav 
            className="fixed top-0 z-50 w-full border-b border-neutral-200 bg-white shadow-sm"
            onMouseLeave={() => setActiveDropdown(null)}
        >
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                
                {/* Brand Logo - High Contrast */}
                <Link href="/" className="text-xl font-bold tracking-[0.3em] uppercase italic text-black hover:opacity-70 transition-opacity">
                    Novenarii
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-10">
                    {data.genders.map((gender) => (
                        <div 
                            key={gender} 
                            className="relative py-4"
                            onMouseEnter={() => setActiveDropdown(gender)}
                        >
                            <button className={`flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] font-medium transition-colors ${activeDropdown === gender ? 'text-black' : 'text-neutral-600 hover:text-black'}`}>
                                {gender} 
                                <ChevronDown 
                                    size={12} 
                                    strokeWidth={2} 
                                    className={`transition-transform duration-200 ${activeDropdown === gender ? 'rotate-180' : ''}`} 
                                />
                            </button>

                            {/* Dropdown - Solid White with Border */}
                            {activeDropdown === gender && (
                                <div className="absolute left-0 top-full w-56 bg-white border border-neutral-200 shadow-xl p-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-1">
                                    <Link 
                                        href={`/shop/${gender}/all`} 
                                        className="text-[10px] font-bold uppercase tracking-[0.15em] text-black border-b border-neutral-100 pb-3 hover:opacity-60 transition-opacity"
                                        onClick={() => setActiveDropdown(null)}
                                    >
                                        View All
                                    </Link>
                                    {data.clothingTypes.map((type) => (
                                        <Link
                                            key={type}
                                            href={`/shop/${gender}/${type.toLowerCase()}`}
                                            className={`text-[10px] uppercase tracking-[0.15em] transition-colors font-medium ${isActive(`/shop/${gender}/${type.toLowerCase()}`) ? 'text-black' : 'text-neutral-500 hover:text-black'}`}
                                            onClick={() => setActiveDropdown(null)}
                                        >
                                            {type}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Objects Menu */}
                    <div 
                        className="relative py-4"
                        onMouseEnter={() => setActiveDropdown('objects')}
                    >
                        <button className={`flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] font-medium transition-colors ${activeDropdown === 'objects' ? 'text-black' : 'text-neutral-600 hover:text-black'}`}>
                            Objects
                            <ChevronDown size={12} strokeWidth={2} />
                        </button>

                        {activeDropdown === 'objects' && (
                            <div className="absolute left-0 top-full w-56 bg-white border border-neutral-200 shadow-xl p-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-1">
                                {data.objectTypes.map((type) => (
                                    <Link
                                        key={type}
                                        href={`/shop/unisex/${type.toLowerCase()}`}
                                        className="text-[10px] uppercase tracking-[0.15em] text-neutral-500 hover:text-black font-medium transition-colors"
                                        onClick={() => setActiveDropdown(null)}
                                    >
                                        {type}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    <Link href="/about" className="text-[11px] uppercase tracking-[0.2em] font-medium text-neutral-600 hover:text-black transition-colors">
                        About
                    </Link>
                </div>

                {/* Right Side Icons - Bolded */}
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