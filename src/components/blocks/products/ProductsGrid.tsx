'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { getProducts } from '@/lib/shopify/products';
import { getCollectionProducts } from '@/lib/shopify/collections';
import Link from 'next/link';
import ProductSkeleton from '@/components/ui/ProductSkeleton';

interface Product {
    id: string;
    title: string;
    handle: string;
    priceRange: { minVariantPrice: { amount: string } };
    featuredImage?: { url: string; altText: string };
}

interface ProductsGridProps {
    collectionHandle?: string; // Optional: if passed, we filter by collection
}

export default function ProductsGrid({ collectionHandle }: ProductsGridProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    
    const cursorRef = useRef<string | undefined>(undefined);
    const observerTarget = useRef<HTMLDivElement>(null);

    const loadProducts = useCallback(async () => {
        if (isLoading || !hasMore) return;

        setIsLoading(true);
        try {
            let result;

            // Senior Switch: Determine which fetcher to use
            if (collectionHandle) {
                const collectionData = await getCollectionProducts(collectionHandle, cursorRef.current);
                // Standardize the shape so the rest of the function works
                result = { 
                    data: { 
                        products: collectionData?.products 
                    } 
                };
            } else {
                result = await getProducts(cursorRef.current);
            }

            const productsData = result?.data?.products;
            const edges = productsData?.edges || [];
            const pageInfo = productsData?.pageInfo;

            if (edges.length === 0) {
                setHasMore(false);
                return;
            }

            setProducts((prev) => {
                const existingIds = new Set(prev.map(p => p.id));
                const uniqueNodes = edges
                    .map((edge: any) => edge.node)
                    .filter((node: any) => !existingIds.has(node.id));
                
                return [...prev, ...uniqueNodes];
            });

            cursorRef.current = pageInfo?.endCursor || undefined;
            setHasMore(pageInfo?.hasNextPage ?? false);

        } catch (err) {
            console.error("Novenarii Fetch Error:", err);
            setHasMore(false);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, hasMore, collectionHandle]);

        // 1. Reset and Initial Load Logic
    useEffect(() => {
        // When the collection changes, we clear everything
        setProducts([]);
        cursorRef.current = undefined;
        setHasMore(true);
        
        // We don't call loadProducts here because the 
        // Intersection Observer will trigger it immediately 
        // as soon as the 'observerTarget' div enters the viewport.
    }, [collectionHandle]); 

    // 2. Intersection Observer Logic (The "Engine")
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                // Check all conditions to prevent accidental double-calls
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
    }, [loadProducts, hasMore, isLoading]); // Fixed size: 3 items

    return (
    <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 p-8">
            {/* Show actual products */}
            {products.map((product) => (
                <Link key={product.id} href={`/product/${product.handle}`} className="group flex flex-col cursor-pointer">
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
                </Link>
            ))}

            {/* Senior Move: Show skeletons during initial load or while fetching more */}
            {isLoading && Array.from({ length: 4 }).map((_, i) => (
                <ProductSkeleton key={i} />
            ))}
        </div>

        {/* Intersection Anchor */}
        <div ref={observerTarget} className="h-10" />
    </div>
);
}