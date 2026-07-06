import type { Product } from "../types";
import { isBuyTiming } from "../types";
import ProductCard from "./ProductCard";

type DashboardProps = {
  products: Product[];
  onSelectProduct: (id: string) => void;
};

export default function Dashboard({ products, onSelectProduct }: DashboardProps) {
  const buyTimingCount = products.filter(isBuyTiming).length;

  if (products.length === 0) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 text-center">
        <p className="text-4xl">🛒</p>
        <h2 className="mt-4 text-lg font-semibold text-slate-700">
          아직 등록한 관심 상품이 없어요
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          로그인 없이 바로 상품을 등록하고 최저가를 추적해보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">내 위시리스트</h1>
          <p className="text-sm text-slate-400">
            등록 상품 {products.length}개 · 지금 사도 좋은 상품 {buyTimingCount}개
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={() => onSelectProduct(product.id)}
          />
        ))}
      </div>
    </div>
  );
}
