import { useState } from "react";
import type { Product } from "../types";
import { lowestPlatform } from "../types";
import ProductCard from "./ProductCard";

type SearchResultsProps = {
  products: Product[];
  categories: string[];
  initialCategory?: string;
  trackedIds: Set<string>;
  onToggleTracked: (id: string) => void;
  compareIds: string[];
  onToggleCompare: (id: string) => void;
  onSelectProduct: (id: string) => void;
  onGoToCompare: () => void;
};

const PRICE_RANGES = [
  { label: "50만원 이하", test: (price: number) => price <= 500000 },
  { label: "50~100만원", test: (price: number) => price > 500000 && price <= 1000000 },
  { label: "100만원 이상", test: (price: number) => price > 1000000 },
];

const BRAND_OPTIONS = ["삼성", "LG", "애플"];

export default function SearchResults({
  products,
  categories,
  initialCategory,
  trackedIds,
  onToggleTracked,
  compareIds,
  onToggleCompare,
  onSelectProduct,
  onGoToCompare,
}: SearchResultsProps) {
  const [category, setCategory] = useState<string>(initialCategory ?? "전체");
  const [priceFilters, setPriceFilters] = useState<Set<string>>(new Set());

  function togglePriceFilter(label: string) {
    setPriceFilters((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  }

  const filtered = products
    .filter((p) => category === "전체" || p.category === category)
    .filter((p) => {
      if (priceFilters.size === 0) return true;
      const price = lowestPlatform(p).price;
      return [...priceFilters].some((label) => {
        const range = PRICE_RANGES.find((r) => r.label === label);
        return range ? range.test(price) : true;
      });
    })
    .sort((a, b) => lowestPlatform(a).price - lowestPlatform(b).price);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="mb-4 flex flex-wrap gap-2">
        {["전체", ...categories].map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`cursor-pointer rounded-lg border px-3.5 py-1.5 text-xs transition-colors ${
              category === c
                ? "border-brand-600 bg-brand-50 text-brand-700"
                : "border-ink-300 text-ink-700 hover:bg-ink-50"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="flex gap-6">
        <aside className="hidden w-[180px] shrink-0 flex-col gap-4 sm:flex">
          <div className="rounded border border-ink-100 p-4">
            <p className="mb-2 text-xs font-medium text-ink-900">가격대</p>
            <div className="flex flex-col gap-1.5">
              {PRICE_RANGES.map((range) => (
                <label
                  key={range.label}
                  className="flex cursor-pointer items-center gap-1.5 text-xs text-ink-700"
                >
                  <input
                    type="checkbox"
                    checked={priceFilters.has(range.label)}
                    onChange={() => togglePriceFilter(range.label)}
                  />
                  {range.label}
                </label>
              ))}
            </div>
          </div>
          <div className="rounded border border-ink-100 p-4">
            <p className="mb-2 text-xs font-medium text-ink-900">브랜드</p>
            <div className="flex flex-col gap-1.5">
              {BRAND_OPTIONS.map((brand) => (
                <label
                  key={brand}
                  className="flex cursor-pointer items-center gap-1.5 text-xs text-ink-700"
                >
                  <input type="checkbox" disabled />
                  {brand}
                </label>
              ))}
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-3 flex items-center justify-between text-xs text-ink-700">
            <span>총 {filtered.length}개 상품</span>
            <span>최저가순 ▾</span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((product) => (
              <div key={product.id} className="relative flex flex-col gap-2">
                <label
                  className="absolute left-3 top-3 z-10 flex h-5 w-5 cursor-pointer items-center justify-center rounded border border-ink-300 bg-white shadow-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    className="h-3.5 w-3.5 accent-brand-600"
                    checked={compareIds.includes(product.id)}
                    onChange={() => onToggleCompare(product.id)}
                  />
                </label>
                <ProductCard product={product} onClick={() => onSelectProduct(product.id)} />
                <button
                  onClick={() => onToggleTracked(product.id)}
                  className="w-full cursor-pointer rounded-lg py-1.5 text-xs font-medium text-brand-600 ring-1 ring-inset ring-brand-200 transition-colors hover:bg-brand-50"
                >
                  {trackedIds.has(product.id) ? "위시리스트 ✓" : "위시리스트 담기"}
                </button>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="py-16 text-center text-sm text-ink-500">조건에 맞는 상품이 없어요.</p>
          )}
        </div>
      </div>

      {compareIds.length >= 2 && (
        <button
          onClick={onGoToCompare}
          className="fixed bottom-8 left-1/2 z-20 -translate-x-1/2 cursor-pointer rounded-full bg-brand-50 px-5 py-3 text-sm font-medium text-brand-700 shadow-lg ring-1 ring-inset ring-brand-200"
        >
          선택한 상품 비교하기 ({compareIds.length})
        </button>
      )}
    </div>
  );
}
