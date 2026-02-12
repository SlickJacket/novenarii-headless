import { useEffect, useState, useRef, useCallback } from 'react';
import { getProducts } from '@/lib/shopify/products';

// filepath: /Users/bobbybuffaloboy/Documents/Development/Headless-Ecomm-Project/novenarii-storefront/src/components/blocks/ProductsGrid.tsx
'use client';


interface Product {
    id: string;
    title: string;
    handle: string;
    priceRange: {
        minVariantPrice: {
            amount: string;
        };
    };
    featuredImage?: {
        url: string;
        altText: string;
    };
}

export default function ProductsGrid() {
    const [products, setProducts] = useState<Product[]>([]);
    const [cursor, setCursor] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const observerTarget = useRef<HTMLDivElement>(null);

    const loadProducts = useCallback(async () => {
        if (isLoading || !hasMore) return;

        setIsLoading(true);
        try {
            const data = await getProducts(cursor);
            const edges = data.body.data.products.edges || [];
            const pageInfo = data.body.data.products.pageInfo || {};

            setProducts((prev) => [...prev, ...edges.map((edge: any) => edge.node)]);
            setCursor(pageInfo.endCursor);
            setHasMore(pageInfo.hasNextPage);
        } catch (error) {
            console.error('Failed to load products:', error);
        } finally {
            setIsLoading(false);
        }
    }, [cursor, isLoading, hasMore]);

    useEffect(() => {
        loadProducts();
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isLoading) {
                    loadProducts();
                }
            },
            { threshold: 0.1 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => observer.disconnect();
    }, [loadProducts, hasMore, isLoading]);

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
                {products.map((product) => (
                    <div key={product.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                        {product.featuredImage && (
                            <img
                                src={product.featuredImage.url}
                                alt={product.featuredImage.altText || product.title}
                                className="w-full h-64 object-cover"
                            />
                        )}
                        <div className="p-4">
                            <h3 className="font-semibold text-lg truncate">{product.title}</h3>
                            <p className="text-gray-600 font-bold">
                                ${product.priceRange.minVariantPrice.amount}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {hasMore && (
                <div ref={observerTarget} className="flex justify-center py-8">
                    {isLoading && <div className="text-gray-500">Loading...</div>}
                </div>
            )}
        </div>
    );
}