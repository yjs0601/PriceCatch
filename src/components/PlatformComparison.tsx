import type { Product } from "../types";
import { formatKRW } from "../utils/format";

type PlatformComparisonProps = {
  product: Product;
};

export default function PlatformComparison({ product }: PlatformComparisonProps) {
  const sorted = [...product.platforms].sort((a, b) => a.price - b.price);
  const lowest = sorted[0].price;

  return (
    <div className="rounded border border-ink-100 bg-white p-4">
      <h3 className="mb-3 font-semibold text-ink-900">쇼핑몰별 가격 비교</h3>
      <ul className="flex flex-col gap-2">
        {sorted.map((platform, index) => (
          <li
            key={platform.name}
            className={`flex items-center justify-between rounded-lg border px-3 py-2.5 transition-colors ${
              index === 0 ? "border-brand-200 bg-brand-50" : "border-ink-100 bg-ink-50"
            }`}
          >
            <div className="flex items-center gap-2">
              {index === 0 && (
                <span className="rounded-full bg-brand-600 px-2 py-0.5 text-[11px] font-medium text-white">
                  최저가
                </span>
              )}
              <span className="text-sm font-medium text-ink-700">{platform.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-ink-900">
                {formatKRW(platform.price)}
              </span>
              {platform.price > lowest && (
                <span className="text-xs text-rose-500">
                  +{formatKRW(platform.price - lowest)}
                </span>
              )}
              <a
                href={platform.url}
                className="cursor-pointer rounded-lg bg-white px-2.5 py-1 text-xs font-medium text-brand-600 ring-1 ring-inset ring-brand-200 transition-colors hover:bg-brand-50"
              >
                구매하러 가기
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
