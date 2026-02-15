import { getProducts } from "@/lib/shopify/products";
import ProductsGrid from "@/components/blocks/products/ProductsGrid";

export default async function ProductsPage() {
  const data = await getProducts();

  // Updated path based on your Shopify Response
  const products = data?.data?.products?.edges ?? [];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-xs uppercase tracking-[0.3em] mb-12 text-gray-400">Essential Collection</h1>
      
      <ProductsGrid />
    </div>
  );
}