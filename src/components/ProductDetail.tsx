import type { AlertSettings as AlertSettingsType, Product } from "../types";
import { allTimeLow, isBuyTiming, lowestPlatform, percentToTarget } from "../types";
import { formatKRW } from "../utils/format";
import PriceTrendChart from "./PriceTrendChart";
import PlatformComparison from "./PlatformComparison";
import AlertSettings from "./AlertSettings";
import ProductThumb from "./ProductThumb";

type ProductDetailProps = {
  product: Product;
  tracked: boolean;
  onUpdateAlert: (alert: AlertSettingsType) => void;
  onToggleTrack: () => void;
};

export default function ProductDetail({
  product,
  tracked,
  onUpdateAlert,
  onToggleTrack,
}: ProductDetailProps) {
  const best = lowestPlatform(product);
  const buyTiming = isBuyTiming(product);
  const low = allTimeLow(product);
  const progress = percentToTarget(product);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <ProductThumb
          product={product}
          className="mt-20 flex h-[320px] min-h-[150px] w-full shrink-0 items-center justify-center self-start rounded-xl bg-ink-50 text-3xl"
        />

        <div className="flex flex-col gap-4 sm:col-span-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs text-ink-500">{product.category}</p>
              <h1 className="text-xl font-bold text-ink-900">{product.name}</h1>
            </div>
            <button
              onClick={onToggleTrack}
              className={`flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg px-3.5 py-2 text-xs font-medium transition-colors ${
                tracked
                  ? "text-rose-500 hover:bg-rose-50"
                  : "bg-brand-50 text-brand-700 hover:bg-brand-100"
              }`}
            >
              {tracked ? "위시리스트에서 삭제" : "위시리스트 등록"}
            </button>
          </div>

          {buyTiming && (
            <div className="flex h-14 items-center gap-2 rounded bg-brand-50 px-4 text-sm font-medium text-brand-700">
              <span>✓</span>
              AI: 지금이 살 타이밍이에요
            </div>
          )}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/50 bg-white/25 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_15px_30px_-15px_rgba(0,0,0,0.25)] backdrop-blur-2xl">
              <p className="text-xs text-ink-500">현재 최저가 ({best.name})</p>
              <p className="mt-1 text-2xl font-bold text-ink-900">{formatKRW(best.price)}</p>
            </div>
            <div className="rounded-2xl border border-white/50 bg-white/25 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_15px_30px_-15px_rgba(0,0,0,0.25)] backdrop-blur-2xl">
              <p className="text-xs text-ink-500">역대 최저가</p>
              <p className="mt-1 text-2xl font-bold text-ink-900">{formatKRW(low)}</p>
            </div>
            <div className="rounded-2xl border border-white/50 bg-white/25 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_15px_30px_-15px_rgba(0,0,0,0.25)] backdrop-blur-2xl">
              <p className="text-xs text-ink-500">목표 가격</p>
              <p className="mt-1 text-2xl font-bold text-brand-600">
                {formatKRW(product.alert.targetPrice)}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/50 bg-white/25 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_15px_30px_-15px_rgba(0,0,0,0.25)] backdrop-blur-2xl">
            <div className="mb-2 flex items-center justify-between text-xs text-ink-700">
              <span>목표가 도달률</span>
              <span className="font-medium text-ink-900">{progress}%</span>
            </div>
            <div className="h-1 w-full rounded-full bg-ink-50">
              <div
                className={`h-full rounded-full transition-[width] duration-300 ${
                  buyTiming ? "bg-brand-600" : "bg-ink-300"
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <PlatformComparison product={product} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PriceTrendChart product={product} />
        </div>
        <div>
          <AlertSettings alert={product.alert} onChange={onUpdateAlert} />
        </div>
      </div>
    </div>
  );
}
