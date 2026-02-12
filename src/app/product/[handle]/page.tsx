import { getProductByHandle } from "@/lib/shopify/products";
import { notFound } from "next/navigation";

// 1. Update the type to reflect that params is a Promise
interface PageProps {
  params: Promise<{ handle: string }>;
}

export default async function ProductPage({ params }: PageProps) {
    // 2. Unpack the promise before using it
    const { handle } = await params;
    
    // 3. Now you can use the handle safely
    const product = await getProductByHandle(handle);

    if (!product) {
        notFound();
    }

    return (
        <main className="max-w-7xl mx-auto px-6 py-12 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                
                {/* 1. Left Column: Image Gallery */}
                <div className="space-y-4">
                    {product.images.nodes.map((image: any, index: number) => (
                        <div key={index} className="aspect-[3/4] bg-gray-50 overflow-hidden">
                            <img 
                                src={image.url} 
                                alt={image.altText || product.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </div>

                {/* 2. Right Column: Product Details */}
                <div className="lg:sticky lg:top-24 h-fit space-y-8">
                    <div>
                        <h1 className="text-3xl font-light tracking-tight uppercase italic mb-2">
                            {product.title}
                        </h1>
                        <p className="text-xl">
                            ${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(0)}
                        </p>
                    </div>

                    {/* Variant Selector (Scaffold) */}
                    <div className="space-y-4">
                        <label className="text-[10px] uppercase tracking-widest text-gray-500">Select Size</label>
                        <div className="flex gap-2">
                            {product.variants.nodes.map((variant: any) => (
                                <button 
                                    key={variant.id}
                                    disabled={!variant.availableForSale}
                                    className="px-6 py-2 border border-black text-xs uppercase hover:bg-black hover:text-white transition-colors disabled:opacity-30"
                                >
                                    {variant.title}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button className="w-full bg-black text-white py-4 text-xs uppercase tracking-[0.2em] hover:bg-zinc-800 transition-colors">
                        Add to Bag
                    </button>

                    {/* Safety-First Description Rendering */}
                    <div className="pt-8 border-t border-gray-100">
                        <h3 className="text-[10px] uppercase tracking-widest text-gray-500 mb-4">Details</h3>
                        <div 
                            className="prose prose-sm text-gray-600 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} 
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}