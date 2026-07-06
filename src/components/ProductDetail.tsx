import type { AlertSettings as AlertSettingsType, Product } from "../types";
import { allTimeLow, isBuyTiming, lowestPlatform } from "../types";
import { formatKRW } from "../utils/format";
import PriceTrendChart from "./PriceTrendChart";
import PlatformComparison from "./PlatformComparison";
import AlertSettings from "./AlertSettings";

type ProductDetailProps = {
  product: Product;
  onUpdateAlert: (alert: AlertSettingsType) => void;
  onRemove: () => void;
};

export default function ProductDetail({ product, onUpdateAlert, onRemove }: ProductDetailProps) {
  const best = lowestPlatform(product);
  const buyTiming = isBuyTiming(product);
  const low = allTimeLow(product);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{product.emoji}</span>
          <div>
            <p className="text-xs text-slate-400">{product.category}</p>
            <h1 className="text-xl font-bold text-slate-900">{product.name}</h1>
          </div>
          {buyTiming && (
            <span className="whitespace-nowrap rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
              지금 사도 좋아요
            </span>
          )}
        </div>
        <button
          onClick={onRemove}
          className="whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium text-rose-500 hover:bg-rose-50"
        >
          위시리스트에서 삭제
        </button>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-400">현재 최저가 ({best.name})</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{formatKRW(best.price)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-400">역대 최저가</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{formatKRW(low)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-400">목표 가격</p>
          <p className="mt-1 text-2xl font-bold text-brand-600">
            {formatKRW(product.alert.targetPrice)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <PriceTrendChart product={product} />
          <PlatformComparison product={product} />
        </div>
        <div>
          <AlertSettings alert={product.alert} onChange={onUpdateAlert} />
        </div>
      </div>
    </div>
  );
}
