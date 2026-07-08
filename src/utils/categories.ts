import type { Product } from "../types";

export function getCategories(products: Product[]): string[] {
  return Array.from(new Set(products.map((p) => p.category)));
}

export function getSubCategories(products: Product[], category: string): string[] {
  return Array.from(
    new Set(products.filter((p) => p.category === category).map((p) => p.subCategory))
  );
}
