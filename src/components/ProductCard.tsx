import { LineChart, Line, ResponsiveContainer } from "recharts";
import type { Product } from "../types";
import { lowestPlatform, isBuyTiming, percentToTarget } from "../types";
import { formatKRW } from "../utils/format";
import ProductThumb from "./ProductThumb";

type ProductCardProps = {
  product: Product;
  onClick: () => void;
  variant?: "default" | "glass";
};

export default function ProductCard({ product, onClick, variant = "default" }: ProductCardProps) {
  const best = lowestPlatform(product);
  const buyTiming = isBuyTiming(product);
  const progress = percentToTarget(product);

  return (
    <button
      onClick={onClick}
      className={`flex w-full cursor-pointer flex-col rounded p-4 text-left transition-all ${
        variant === "glass"
          ? "border border-white/50 bg-white/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_15px_30px_-15px_rgba(0,0,0,0.25)] backdrop-blur-2xl hover:bg-white/35"
          : "border border-ink-100 bg-white transition-colors hover:border-ink-300"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <ProductThumb
            product={product}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-ink-50 text-xl"
          />
          <div className="min-w-0">
            <p className="text-xs text-ink-500">{product.category}</p>
            <h3 className="line-clamp-1 font-semibold text-ink-900">{product.name}</h3>
          </div>
        </div>
        {buyTiming && (
          <span className="flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-brand-50 px-2 py-1 text-xs font-medium text-brand-700">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
            지금 사도 좋아요
          </span>
        )}
      </div>

      <div className="mt-3 h-10 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={product.priceHistory}>
            <Line
              type="monotone"
              dataKey="price"
              stroke="#0f6e56"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 flex items-end justify-between">
        <div>
          <p className="text-xs text-ink-500">
            최저가 · <span className="font-medium text-ink-700">{best.name}</span>
          </p>
          <p className="text-xl font-bold text-ink-900">{formatKRW(best.price)}</p>
        </div>
        <p className="text-xs text-ink-500">목표가 {formatKRW(product.alert.targetPrice)}</p>
      </div>

      <div className="mt-3">
        <div className="h-1 w-full overflow-hidden rounded-full bg-ink-50">
          <div
            className="h-full rounded-full bg-brand-600 transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-1 text-right text-[11px] text-ink-500">목표가 도달률 {progress}%</p>
      </div>
    </button>
  );
}
