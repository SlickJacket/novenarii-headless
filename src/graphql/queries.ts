// Query to fetch all unique Types and Gender tags for the Navbar
export const GET_MENU_DATA = `
  query GetMenuData {
    productTypes(first: 50) {
      edges {
        node
      }
    }
    # We fetch a sample of tags to find our gender markers
    products(first: 250) {
      edges {
        node {
          tags
        }
      }
    }
  }
`;

// Universal Filtered Query
export const GET_FILTERED_PRODUCTS = `
  query GetFilteredProducts($query: String, $cursor: String) {
    products(first: 12, after: $cursor, query: $query) {
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
            altText
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