import { useState } from "react";
import type { View } from "../App";
import type { Product } from "../types";
import { lowestPlatform } from "../types";
import ProductCard from "./ProductCard";

type HomeProps = {
  products: Product[];
  categories: string[];
  onSelectProduct: (id: string) => void;
  onNavigate: (view: View) => void;
};

const CATEGORY_ICON: Record<string, string> = {
  노트북: "💻",
  가전: "🧹",
  전자기기: "🎧",
  뷰티: "💄",
};

const WHY_ITEMS = [
  { label: "Trust", desc: "가격 추이로 판단 근거 제공" },
  { label: "Convenience", desc: "알림 오면 바로 구매까지" },
  { label: "Simplicity", desc: "필터 최소화, 자동 추천" },
];

export default function Home({ products, categories, onSelectProduct, onNavigate }: HomeProps) {
  const [topFilter, setTopFilter] = useState<string>("전체");

  const topProducts = [...products]
    .filter((p) => topFilter === "전체" || p.category === topFilter)
    .sort((a, b) => lowestPlatform(a).price - lowestPlatform(b).price)
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <section className="flex h-[220px] items-center justify-center rounded bg-ink-50 px-6 text-center">
        <p className="max-w-md text-sm text-ink-700">
          지금이 살 타이밍인지, <span className="font-semibold text-brand-600">PriceCatch</span>가 알려드립니다
        </p>
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-center text-base font-bold text-ink-900">인기 카테고리</h2>
        <div className="border-t border-ink-100 pt-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onNavigate({ name: "search", category })}
                className="flex cursor-pointer flex-col items-center gap-2"
              >
                <span className="flex h-[100px] w-full items-center justify-center rounded bg-ink-50 text-3xl">
                  {CATEGORY_ICON[category] ?? "🛍️"}
                </span>
                <span className="text-xs text-ink-700">{category}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-center text-base font-bold text-ink-900">실시간 최저가 TOP</h2>
        <div className="border-t border-ink-100 pt-4">
          <div className="mb-4 flex flex-wrap justify-center gap-2">
            {["전체", ...categories].map((category) => (
              <button
                key={category}
                onClick={() => setTopFilter(category)}
                className={`cursor-pointer rounded-lg border px-4 py-2 text-xs transition-colors ${
                  topFilter === category
                    ? "border-brand-600 bg-brand-50 text-brand-700"
                    : "border-ink-300 text-ink-700 hover:bg-ink-50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {topProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => onSelectProduct(product.id)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 pb-8">
        <h2 className="mb-3 text-center text-base font-bold text-ink-900">왜 PriceCatch인가요</h2>
        <div className="border-t border-ink-100 pt-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {WHY_ITEMS.map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-1 text-center">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                  ✓
                </span>
                <p className="mt-1 text-sm font-semibold text-ink-900">{item.label}</p>
                <p className="text-xs text-ink-700">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-ink-100 py-4 text-xs text-ink-500">
        PriceCatch — 프론트엔드 포트폴리오 프로젝트
      </footer>
    </div>
  );
}
