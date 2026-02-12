"use server"

import { shopifyFetch } from "./client"
import { GET_PRODUCTS } from "../../graphql/queries";

export async function getProducts(cursor?: string) {
  return shopifyFetch({
    query: GET_PRODUCTS,
    variables: { cursor }
  });
}


