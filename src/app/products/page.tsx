import { getProducts } from "@/lib/shopify/products";

export default async function ProductsPage() {
  const data = await getProducts();

  // Updated path based on your Shopify Response
  const products = data?.data?.products?.edges ?? [];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-xs uppercase tracking-[0.3em] mb-12 text-gray-400">Essential Collection</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16">
        {products.map(({ node }: any) => (
          <div key={node.id} className="group cursor-pointer">
            {/* Image Container */}
            <div className="aspect-[3/4] bg-gray-100 overflow-hidden mb-4">
              {node.featuredImage?.url ? (
                <img 
                  src={node.featuredImage.url} 
                  alt={node.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 italic text-xs">No Image</div>
              )}
            </div>

            {/* Product Details */}
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-sm uppercase tracking-widest font-medium text-novenarii-black">
                  {node.title}
                </h2>
                <p className="text-[10px] uppercase text-gray-400 mt-1 tracking-tighter">
                  {node.productType}
                </p>
              </div>
              <p className="text-sm font-light">
                ${parseFloat(node.priceRange.minVariantPrice.amount).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}