export const GET_PRODUCTS = `
query GetProducts($cursor: String) {
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
        productType
        featuredImage {
          url
        }
        priceRange {
          minVariantPrice {
            amount
          }
        }
      }
    }
  }
}
`;