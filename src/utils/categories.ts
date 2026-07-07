import type { Product } from "../types";

export function getCategories(products: Product[]): string[] {
  return Array.from(new Set(products.map((p) => p.category)));
}
