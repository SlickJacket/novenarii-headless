'use client';

import { useEffect, useRef, useState, useCallback } from "react";
import ProductSkeleton from "@/components/ui/ProductSkeleton";
import Link from "next/link";
import { getFilteredProducts } from "@/lib/shopify/products"; // We'll update this next

interface ProductsGridProps {
    gender?: string;
    productType?: string;
}

export default function ProductsGrid({ gender, productType }: ProductsGridProps) {
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const cursorRef = useRef<string | undefined>(undefined);
    const observerTarget = useRef(null);

    const loadProducts = useCallback(async (isFirstLoad = false) => {
    if (isLoading || (!hasMore && !isFirstLoad)) return;

    setIsLoading(true);
    
    // DEBUG 1: Check what we are sending to the function
    console.log("🔍 FETCH ATTEMPT:", { gender, productType, cursor: cursorRef.current });

    try {
        const result = await getFilteredProducts(
            productType,
            gender,
            isFirstLoad ? undefined : cursorRef.current
        );

        // DEBUG 2: Check the raw response from Shopify
        console.log("📦 RAW SHOPIFY RESPONSE:", result);

        const edges = result?.edges || [];
        const pageInfo = result?.pageInfo;

        if (edges.length === 0) {
            console.warn("⚠️ No products found for this filter.");
        }

        const newProducts = edges.map((edge: any) => edge.node);
        
        // ... (rest of your state setting logic)

            setProducts(prev => {
                if (isFirstLoad) return newProducts;
                // Filter out duplicates just in case
                const existingIds = new Set(prev.map(p => p.id));
                const uniqueNodes = newProducts.filter((node: any) => !existingIds.has(node.id));
                return [...prev, ...uniqueNodes];
            });

            cursorRef.current = pageInfo?.endCursor;
            setHasMore(pageInfo?.hasNextPage || false);
        } catch (err) {
            console.error("Novenarii Fetch Error:", err);
            setHasMore(false);
        } finally {
            setIsLoading(false);
        }
    }, [gender, productType, isLoading, hasMore]);

    // Reset when filters change
    useEffect(() => {
        setProducts([]);
        cursorRef.current = undefined;
        setHasMore(true);
        loadProducts(true);
    }, [gender, productType]);

    // Intersection Observer for Infinite Scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isLoading) {
                    loadProducts();
                }
            },
            { threshold: 0.1 }
        );

        if (observerTarget.current) observer.observe(observerTarget.current);
        return () => observer.disconnect();
    }, [loadProducts, hasMore, isLoading]);

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12 p-8 max-w-7xl mx-auto">
                {products.map((product) => (
                    <Link key={product.id} href={`/product/${product.handle}`} className="group flex flex-col">
                        <div className="aspect-[3/4] overflow-hidden bg-neutral-100 mb-4">
                            {product.featuredImage && (
                                <img
                                    src={product.featuredImage.url}
                                    alt={product.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            )}
                        </div>
                        <h3 className="text-[10px] uppercase tracking-[0.2em] font-medium text-black">{product.title}</h3>
                        <p className="text-neutral-500 text-[10px] mt-1 italic uppercase">
                            ${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(0)}
                        </p>
                    </Link>
                ))}

                {isLoading && Array.from({ length: 4 }).map((_, i) => (
                    <ProductSkeleton key={i} />
                ))}
            </div>

            <div ref={observerTarget} className="h-20 w-full" />
        </div>
    );
}