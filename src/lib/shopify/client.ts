export async function shopifyFetch({
  query,
  variables,
}: {
  query: string;
  variables?: any;
}) {
  // Construct the full API URL
  const endpoint = `${process.env.SHOPIFY_STOREFRONT_DOMAIN}/api/2024-01/graphql.json`;

  const res = await fetch(
    endpoint, // Use the endpoint here, not just the domain
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token":
          process.env.SHOPIFY_STOREFRONT_API_TOKEN!,
      },
      body: JSON.stringify({ query, variables }),
    },
  );

  if (!res.ok) {
    const text = await res.text();
    console.error("Shopify API Error:", text);
    throw new Error(`Fetch failed with status ${res.status}`);
  }

  return res.json();
}
