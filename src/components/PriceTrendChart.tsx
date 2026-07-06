import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import type { Product } from "../types";
import { allTimeLow } from "../types";
import { formatKRW, formatShortDate } from "../utils/format";

type PriceTrendChartProps = {
  product: Product;
};

export default function PriceTrendChart({ product }: PriceTrendChartProps) {
  const low = allTimeLow(product);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">가격 추이 (최근 30일)</h3>
        <p className="text-xs text-slate-400">
          역대 최저가 <span className="font-medium text-brand-600">{formatKRW(low)}</span>
        </p>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={product.priceHistory} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis
              dataKey="date"
              tickFormatter={formatShortDate}
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
              minTickGap={24}
            />
            <YAxis
              domain={["dataMin - 10000", "dataMax + 10000"]}
              tickFormatter={(v) => `${Math.round(v / 10000)}만`}
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <Tooltip
              formatter={(value: number) => [formatKRW(value), "가격"]}
              labelFormatter={(label) => formatShortDate(String(label))}
            />
            <ReferenceLine
              y={product.alert.targetPrice}
              stroke="#059669"
              strokeDasharray="4 4"
              label={{
                value: `목표가 ${formatKRW(product.alert.targetPrice)}`,
                position: "insideTopRight",
                fontSize: 11,
                fill: "#059669",
              }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#priceFill)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
