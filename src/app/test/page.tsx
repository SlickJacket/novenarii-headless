import { createStorefrontApiClient } from '@shopify/storefront-api-client';

const client = createStorefrontApiClient({
  storeDomain: process.env.PUBLIC_STORE_DOMAIN!,
  apiVersion: '2026-01',
  publicAccessToken: process.env.PUBLIC_STOREFRONT_API_TOKEN!,
});

export default async function TestPage() {
  const query = `
    query getProducts {
        products(first: 3) {
            nodes {
            id
            title
            handle
            images(first: 1) {
                nodes {
                url
                altText
                width
                height
                }
            }
        }
    }
}
  `;

  const { data, errors } = await client.request(query);

  if (errors) return <div className="p-10 text-red-500">Error: {errors.message}</div>;

  return (
    <main className="p-10 font-sans">
      <h1 className="text-2xl font-bold mb-4">Shopify API Connection: Success! ✅</h1>
      <ul className="space-y-2">
        {data?.products.nodes.map((product: any) => (
            <li key={product.id} className="p-4 border rounded-lg bg-gray-50 flex items-center gap-4">
                {product.images.nodes[0] && (
                <img 
                    src={product.images.nodes[0].url} 
                    alt={product.images.nodes[0].altText || product.title}
                    className="w-20 h-20 object-cover rounded shadow-sm"
                />
                )}
                <div>
                <h2 className="font-bold">{product.title}</h2>
                <p className="text-sm text-gray-500">{product.handle}</p>
                </div>
            </li>
            ))}
      </ul>
    </main>
  );
}