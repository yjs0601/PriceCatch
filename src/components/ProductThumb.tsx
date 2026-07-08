import type { Product } from "../types";

type ProductThumbProps = {
  product: Product;
  className: string;
};

export default function ProductThumb({ product, className }: ProductThumbProps) {
  if (product.image) {
    return <img src={product.image} alt={product.name} className={`${className} object-cover`} />;
  }
  return <span className={className}>{product.emoji}</span>;
}
