import { useState } from "react";
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

const PERIODS = ["1개월", "3개월", "6개월", "1년"];

export default function PriceTrendChart({ product }: PriceTrendChartProps) {
  const low = allTimeLow(product);
  const [period, setPeriod] = useState("3개월");

  return (
    <div className="rounded border border-ink-100 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold text-ink-900">가격 추이 (최근 30일)</h3>
        <p className="text-xs text-ink-500">
          역대 최저가 <span className="font-medium text-brand-600">{formatKRW(low)}</span>
        </p>
      </div>
      <div className="mb-3 flex gap-2">
        {PERIODS.map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-[11px] transition-colors ${
              period === p
                ? "border-brand-600 bg-brand-50 text-brand-700"
                : "border-ink-300 text-ink-700 hover:bg-ink-50"
            }`}
          >
            {p}
          </button>
        ))}
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={product.priceHistory} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0f6e56" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#0f6e56" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e3e1d8" />
            <XAxis
              dataKey="date"
              tickFormatter={formatShortDate}
              tick={{ fontSize: 11, fill: "#888780" }}
              axisLine={false}
              tickLine={false}
              minTickGap={24}
            />
            <YAxis
              domain={["dataMin - 10000", "dataMax + 10000"]}
              tickFormatter={(v) => `${Math.round(v / 10000)}만`}
              tick={{ fontSize: 11, fill: "#888780" }}
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
              stroke="#0f6e56"
              strokeDasharray="4 4"
              label={{
                value: `목표가 ${formatKRW(product.alert.targetPrice)}`,
                position: "insideTopRight",
                fontSize: 11,
                fill: "#0f6e56",
              }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#0f6e56"
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
