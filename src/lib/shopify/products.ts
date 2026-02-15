"use server"

import { shopifyFetch } from "./client"
import { GET_FILTERED_PRODUCTS } from "../../graphql/queries";

// 1. Define a strict return type so your components don't have to guess
interface ShopifyResponse {
  data?: {
    products: {
      edges: any[];
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string;
      };
    };
  };
  errors?: any[];
}

export async function getProducts(cursor: string | null = null): Promise<ShopifyResponse> {
  try {
    const response = await shopifyFetch({
      query: GET_FILTERED_PRODUCTS,
      variables: { cursor }
    }) as ShopifyResponse;

    // 2. Audit for GraphQL errors (Shopify returns 200 OK even if the query fails)
    if (response.errors) {
      console.error("Shopify GraphQL Errors:", response.errors);
      return { data: { products: { edges: [], pageInfo: { hasNextPage: false, endCursor: "" } } } };
    }

    return response;
  } catch (error) {
    // 3. Fallback to prevent the "Infinite Loop" in the UI
    console.error("Novenarii Fetch Critical Failure:", error);
    return { data: { products: { edges: [], pageInfo: { hasNextPage: false, endCursor: "" } } } };
  }
}

export async function getProductByHandle(handle: string) {
  const query = `
    query getProductByHandle($handle: String!) {
      product(handle: $handle) {
        id
        title
        descriptionHtml
        images(first: 5) {
          nodes {
            url
            altText
            width
            height
          }
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        variants(first: 10) {
          nodes {
            id
            title
            availableForSale
          }
        }
      }
    }
  `;

  const response = await shopifyFetch({
    query,
    variables: { handle },
  });

  return response.data?.product;
}

export async function getFilteredProducts(
    type?: string,
    gender?: string,
    cursor?: string
) {
    let queryParts = [];

    // 1. Gender Filter (via Tags)
    if (gender && gender.toLowerCase() !== 'unisex') {
        queryParts.push(`tag:${gender.toLowerCase()}`);
    }

    // 2. Category Filter (via Product Type)
    // We only add this if it's not "all"
    if (type && type.toLowerCase() !== 'all') {
        queryParts.push(`product_type:'${type}'`);
    }

    const queryString = queryParts.join(' AND ');

    const response = await shopifyFetch({
        query: GET_FILTERED_PRODUCTS,
        variables: {
            query: queryString || "", // If empty, returns all active products
            cursor: cursor || null
        }
    });

    return response.data?.products;
}