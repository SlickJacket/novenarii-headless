import { shopifyFetch } from './client';
import { GET_MENU_DATA } from '@/graphql/queries';

export async function getNavbarData() {
    try {
        const response = await shopifyFetch({ query: GET_MENU_DATA });
        
        // 1. Get raw data from response
        const rawTypes = response.data?.productTypes?.edges.map((e: any) => e.node) || [];
        const allProducts = response.data?.products?.edges || [];
        const allTags = allProducts.flatMap((e: any) => e.node.tags || []);
        
        // 2. Identify Genders (Lowercased for comparison)
        const genders = ['male', 'female'].filter(g => 
            allTags.some((tag: string) => tag.toLowerCase() === g)
        );

        // 3. Sorting logic
        const objectKeywords = ['bags', 'fragrance', 'home', 'accessories', 'jewelry', 'objects'];

        const clothingTypes = rawTypes.filter(
            (t: string) => !objectKeywords.includes(t.toLowerCase())
        );
        
        const objectTypes = rawTypes.filter(
            (t: string) => objectKeywords.includes(t.toLowerCase())
        );

        // --- DEBUG FALLBACKS ---
        // If Shopify is empty, return defaults so you can see the UI working
        return {
            genders: genders.length > 0 ? genders : ['male', 'female'],
            clothingTypes: clothingTypes.length > 0 ? clothingTypes : ['Jackets', 'Trousers', 'Shirts'],
            objectTypes: objectTypes.length > 0 ? objectTypes : ['Bags', 'Accessories']
        };

    } catch (error) {
        console.error("Navigation Fetch Error:", error);
        return { genders: ['male', 'female'], clothingTypes: [], objectTypes: [] };
    }
}