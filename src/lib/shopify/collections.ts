"use server"

import { shopifyFetch } from "./client";

export async function getCollections() {
  const query = `
    query getCollections {
      collections(first: 10) {
        edges {
          node {
            title
            handle
            description
          }
        }
      }
    }
  `;

  const response = await shopifyFetch({ query });
  return response.data?.collections?.edges.map((edge: any) => edge.node) || [];
}

export async function getCollectionProducts(handle: string, cursor: string | null = null) {
  const query = `
    query getCollectionProducts($handle: String!, $cursor: String) {
      collection(handle: $handle) {
        title
        description
        products(first: 12, after: $cursor) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              id
              title
              handle
              priceRange {
                minVariantPrice {
                  amount
                }
              }
              featuredImage {
                url
                altText
              }
            }
          }
        }
      }
    }
  `;

  const response = await shopifyFetch({
    query,
    variables: { handle, cursor }
  });

  return response.data?.collection;
}