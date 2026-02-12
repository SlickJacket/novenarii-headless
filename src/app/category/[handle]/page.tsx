import ProductsGrid from "@/components/blocks/products/ProductsGrid";
import { getCollectionProducts } from "@/lib/shopify/collections";
import { notFound } from "next/navigation";

export default async function CategoryPage({ params }: { params: Promise<{ handle: string }> }) {
    const { handle } = await params;
    const collection = await getCollectionProducts(handle);

    if (!collection) return notFound();

    return (
        <main className="w-full">
            <header className="px-8 pt-16 pb-8 text-center">
                <h1 className="text-[10px] uppercase tracking-[0.5em] text-gray-400 mb-2">Collection</h1>
                <h2 className="text-4xl font-light italic uppercase tracking-tight">{collection.title}</h2>
                {collection.description && (
                    <p className="mt-4 text-sm text-gray-500 max-w-xl mx-auto">{collection.description}</p>
                )}
            </header>

            {/* Pass the handle to the grid to filter results */}
            <ProductsGrid collectionHandle={handle} />
        </main>
    );
}