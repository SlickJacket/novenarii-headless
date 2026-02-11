export async function shopifyFetch({
  query,
  variables
}: {
  query: string;
  variables?: any;
}) {
  const res = await fetch(
    process.env.SHOPIFY_STOREFRONT_DOMAIN!,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token":
          process.env.SHOPIFY_STOREFRONT_API_TOKEN!
      },
      body: JSON.stringify({ query, variables })
    }
  );

  return res.json();
}
