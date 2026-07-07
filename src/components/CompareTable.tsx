import type { Product } from "../types";
import { lowestPlatform } from "../types";
import { formatKRW } from "../utils/format";

type CompareTableProps = {
  products: Product[];
  compareIds: string[];
  onClearCompare: () => void;
  onNavigateSearch: () => void;
};

export default function CompareTable({
  products,
  compareIds,
  onClearCompare,
  onNavigateSearch,
}: CompareTableProps) {
  const selected = compareIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => !!p);

  if (selected.length < 2) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 text-center">
        <p className="text-sm text-ink-700">비교하려면 검색결과에서 상품을 2개 이상 선택해주세요.</p>
        <button
          onClick={onNavigateSearch}
          className="mt-4 cursor-pointer rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
        >
          검색결과로 이동
        </button>
      </div>
    );
  }

  const rows: { label: string; render: (p: Product) => React.ReactNode }[] = [
    { label: "이미지", render: (p) => <span className="text-3xl">{p.emoji}</span> },
    { label: "가격", render: (p) => formatKRW(lowestPlatform(p).price) },
    {
      label: "배송비",
      render: (p) => (p.shippingFee && p.shippingFee > 0 ? formatKRW(p.shippingFee) : "무료"),
    },
    { label: "판매처", render: (p) => lowestPlatform(p).name },
    { label: "별점", render: (p) => (p.rating != null ? p.rating.toFixed(1) : "-") },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-base font-bold text-ink-900">상품 비교</h1>
        <button
          onClick={onClearCompare}
          className="cursor-pointer text-xs text-ink-500 hover:text-ink-700"
        >
          선택 초기화
        </button>
      </div>

      <div className="overflow-x-auto rounded border border-ink-100">
        <table className="w-full min-w-[480px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="w-[120px] border-b border-r border-ink-100 bg-ink-50 p-3 text-left text-xs text-ink-700"></th>
              {selected.map((p) => (
                <th
                  key={p.id}
                  className="border-b border-ink-100 p-3 text-left text-xs font-medium text-ink-900"
                >
                  {p.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <td className="border-b border-r border-ink-100 bg-ink-50 p-3 text-xs text-ink-700">
                  {row.label}
                </td>
                {selected.map((p) => (
                  <td key={p.id} className="border-b border-ink-100 p-3 text-ink-900">
                    {row.render(p)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
