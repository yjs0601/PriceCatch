import { useEffect, useState } from "react";
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import type { View } from "../App";
import type { Product } from "../types";
import { lowestPlatform } from "../types";
import { formatKRW, formatShortDate } from "../utils/format";
import ProductCard from "./ProductCard";
import ProductThumb from "./ProductThumb";

const HERO_INTERVAL_MS = 2500;
const HERO_SLIDE_COUNT = 3;

type HeroBannerProps = {
  products: Product[];
  onSelectProduct: (id: string) => void;
};

function HeroBanner({ products, onSelectProduct }: HeroBannerProps) {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlide((prev) => (prev + 1) % HERO_SLIDE_COUNT);
    }, HERO_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [slide]);

  const cheapest = products.reduce<Product | undefined>(
    (min, p) => (!min || lowestPlatform(p).price < lowestPlatform(min).price ? p : min),
    undefined
  );
  const popular = products.reduce<Product | undefined>(
    (max, p) => (!max || (p.views ?? 0) > (max.views ?? 0) ? p : max),
    undefined
  );

  return (
    <div>
      <section className="relative h-[420px] overflow-hidden rounded-2xl border border-white/50 bg-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_25px_50px_-20px_rgba(0,0,0,0.25)] backdrop-blur-2xl">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-black/10 blur-3xl" />

        {slide === 1 && cheapest && (
          <button
            key={1}
            onClick={() => onSelectProduct(cheapest.id)}
            className="absolute inset-3 flex animate-[fade-in-up_0.5s_ease-out] cursor-pointer flex-col gap-3 rounded-2xl p-5 py-6 text-left transition-colors hover:bg-white/10 sm:inset-5"
          >
            <div className="flex shrink-0 items-center gap-3">
              <ProductThumb
                product={cheapest}
                className="flex h-12 w-20 shrink-0 items-center justify-center rounded-xl bg-white/50 text-2xl"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-brand-700">🔥 지금 가장 저렴한 상품</p>
                <h3 className="truncate text-lg font-bold text-ink-900">{cheapest.name}</h3>
              </div>
              <p className="shrink-0 text-2xl font-extrabold text-ink-900">
                {formatKRW(lowestPlatform(cheapest).price)}
              </p>
            </div>
            <div className="min-h-0 flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cheapest.priceHistory} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="heroPriceFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0f6e56" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#0f6e56" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff" strokeOpacity={0.5} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatShortDate}
                    tick={{ fontSize: 11, fill: "#5f5e5a" }}
                    axisLine={false}
                    tickLine={false}
                    minTickGap={32}
                  />
                  <YAxis
                    domain={["dataMin - 5000", "dataMax + 5000"]}
                    tickFormatter={(v) => `${(v / 10000).toFixed(1)}만`}
                    tick={{ fontSize: 11, fill: "#5f5e5a" }}
                    axisLine={false}
                    tickLine={false}
                    width={40}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke="#0f6e56"
                    strokeWidth={2.5}
                    fill="url(#heroPriceFill)"
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </button>
        )}

        <div className="relative flex h-full items-center justify-center px-6 text-center sm:px-12">
          {slide === 0 && (
            <div
              key={0}
              className="flex max-w-lg animate-[fade-in-up_0.5s_ease-out] flex-col items-center gap-4"
            >
              <span className="rounded-full border border-white/60 bg-white/30 px-3 py-1 text-[11px] font-semibold tracking-wide text-brand-700 backdrop-blur-md">
                AI 최저가 모니터링
              </span>
              <h2 className="text-3xl font-extrabold leading-snug text-ink-900 sm:text-4xl">
                지금이 살 타이밍인지,
                <br />
                PriceCatch가 바로 알려드려요
              </h2>
              <p className="max-w-md text-sm text-ink-700">
                여러 쇼핑몰의 가격을 한눈에 비교하고, 가장 쌀 때 알림을 받아보세요.
              </p>
            </div>
          )}

          {slide === 2 && popular && (
            <button
              key={2}
              onClick={() => onSelectProduct(popular.id)}
              className="flex w-full max-w-2xl animate-[fade-in-up_0.5s_ease-out] cursor-pointer items-center gap-6 rounded-2xl border border-white/60 bg-white/30 p-6 text-left backdrop-blur-md transition-colors hover:bg-white/40"
            >
              <ProductThumb
                product={popular}
                className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-white/50 text-4xl"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-brand-700">🏆 지금 가장 인기있는 상품</p>
                <h3 className="mt-1 truncate text-lg font-bold text-ink-900">{popular.name}</h3>
                <p className="mt-1 text-2xl font-extrabold text-ink-900">
                  {formatKRW(lowestPlatform(popular).price)}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1 text-right">
                <span className="rounded-full bg-white/50 px-3 py-1 text-xs font-semibold text-ink-900">
                  ⭐ {popular.rating?.toFixed(1) ?? "-"}
                </span>
                <span className="text-xs text-ink-500">
                  누적 조회 {(popular.views ?? 0).toLocaleString("ko-KR")}회
                </span>
              </div>
            </button>
          )}
        </div>
      </section>
      <div className="mt-3 flex justify-center gap-1.5">
        {Array.from({ length: HERO_SLIDE_COUNT }).map((_, i) => (
          <button
            key={i}
            onClick={() => setSlide(i)}
            aria-label={`${i + 1}번 슬라이드로 이동`}
            className={`h-1.5 cursor-pointer rounded-full transition-all ${
              i === slide ? "w-5 bg-brand-600" : "w-1.5 bg-ink-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

type HomeProps = {
  products: Product[];
  categories: string[];
  onSelectProduct: (id: string) => void;
  onNavigate: (view: View) => void;
};

const CATEGORY_ICON: Record<string, string> = {
  "PC/전자기기": "💻",
  가전: "🧹",
  신발: "👟",
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
      <HeroBanner products={products} onSelectProduct={onSelectProduct} />

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
                className={`cursor-pointer rounded-2xl border px-4 py-2 text-xs backdrop-blur-md transition-all ${
                  topFilter === category
                    ? "border-white/60 bg-gradient-to-b from-white/55 via-white/20 to-white/10 text-brand-700 shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.9),inset_0_-1px_2px_rgba(0,0,0,0.05),0_12px_24px_-10px_rgba(0,0,0,0.3)] font-semibold"
                    : "border-white/35 bg-gradient-to-b from-white/30 via-white/10 to-white/0 text-ink-700 shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.7),inset_0_-1px_2px_rgba(0,0,0,0.03),0_10px_20px_-10px_rgba(0,0,0,0.2)] hover:from-white/40"
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
                variant="glass"
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
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,rgba(167,243,208,0.25)_0%,rgba(15,110,86,0.15)_100%)] text-brand-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_10px_20px_-8px_rgba(0,0,0,0.25)] backdrop-blur-2xl">
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
