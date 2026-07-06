import { LineChart, Line, ResponsiveContainer } from "recharts";
import type { Product } from "../types";
import { lowestPlatform, isBuyTiming, percentToTarget } from "../types";
import { formatKRW } from "../utils/format";

type ProductCardProps = {
  product: Product;
  onClick: () => void;
};

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const best = lowestPlatform(product);
  const buyTiming = isBuyTiming(product);
  const progress = percentToTarget(product);

  return (
    <button
      onClick={onClick}
      className="flex flex-col rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{product.emoji}</span>
          <div>
            <p className="text-xs text-slate-400">{product.category}</p>
            <h3 className="line-clamp-1 font-semibold text-slate-900">{product.name}</h3>
          </div>
        </div>
        {buyTiming && (
          <span className="whitespace-nowrap rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">
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
              stroke={buyTiming ? "#059669" : "#3b82f6"}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 flex items-end justify-between">
        <div>
          <p className="text-xs text-slate-400">
            최저가 · <span className="font-medium text-slate-500">{best.name}</span>
          </p>
          <p className="text-xl font-bold text-slate-900">{formatKRW(best.price)}</p>
        </div>
        <p className="text-xs text-slate-400">목표가 {formatKRW(product.alert.targetPrice)}</p>
      </div>

      <div className="mt-3">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full ${buyTiming ? "bg-emerald-500" : "bg-brand-500"}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-1 text-right text-[11px] text-slate-400">목표가 도달률 {progress}%</p>
      </div>
    </button>
  );
}
