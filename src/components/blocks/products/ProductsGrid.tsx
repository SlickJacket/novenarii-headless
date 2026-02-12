'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { getProducts } from '@/lib/shopify/products';

interface Product {
    id: string;
    title: string;
    handle: string;
    priceRange: { minVariantPrice: { amount: string } };
    featuredImage?: { url: string; altText: string };
}

export default function ProductsGrid() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    
    // We use Refs for values that need to persist without triggering re-renders
    const cursorRef = useRef<string | undefined>(undefined);
    const observerTarget = useRef<HTMLDivElement>(null);

    const loadProducts = useCallback(async () => {
        if (isLoading || !hasMore) return;

        setIsLoading(true);
        try {
            const result = await getProducts(cursorRef.current);
            const edges = result?.data?.products?.edges || [];
            const pageInfo = result?.data?.products?.pageInfo || {};

            if (edges.length === 0) {
                setHasMore(false);
                return;
            }

            setProducts((prev) => [...prev, ...edges.map((edge: any) => edge.node)]);
            cursorRef.current = pageInfo.endCursor;
            setHasMore(pageInfo.hasNextPage);
        } catch (err) {
            console.error("Novenarii Fetch Error:", err);
            setHasMore(false); // Stop the loop on error
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, hasMore]); // Dependencies for the callback

    // 1. Initial Load
    useEffect(() => {
        loadProducts();
    }, []);

    // 2. Intersection Observer Logic
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                // Only trigger if intersecting AND not already loading
                if (entries[0].isIntersecting && hasMore && !isLoading) {
                    loadProducts();
                }
            },
            { threshold: 0.1 }
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [loadProducts, hasMore, isLoading]);

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 p-8">
                {products.map((product) => (
                    <div key={product.id} className="group flex flex-col cursor-pointer">
                        <div className="aspect-[3/4] overflow-hidden bg-gray-50 mb-4">
                            {product.featuredImage && (
                                <img
                                    src={product.featuredImage.url}
                                    alt={product.featuredImage.altText || product.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            )}
                        </div>
                        <h3 className="text-[11px] uppercase tracking-[0.2em] font-medium">{product.title}</h3>
                        <p className="text-gray-500 text-xs mt-1 pb-2">
                            ${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(0)}
                        </p>
                    </div>
                ))}
            </div>

            {/* Intersection Anchor */}
            <div ref={observerTarget} className="h-24 flex items-center justify-center">
                {isLoading && (
                    <span className="text-[10px] uppercase tracking-[0.4em] text-gray-400 animate-pulse">
                        Loading...
                    </span>
                )}
            </div>
        </div>
    );
}