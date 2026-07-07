import { useState } from "react";
import type { Product } from "../types";
import { isBuyTiming, lowestPlatform, percentToTarget } from "../types";
import { formatKRW } from "../utils/format";
import type { AuthUser } from "../utils/auth";

type MyPageProps = {
  products: Product[];
  trackedIds: Set<string>;
  onSelectProduct: (id: string) => void;
  onToggleTracked: (id: string) => void;
  user: AuthUser | null;
  onSignOut: () => void;
};

type Tab = "wishlist" | "alerts" | "account" | "logout";

const TABS: { id: Tab; label: string }[] = [
  { id: "wishlist", label: "위시리스트" },
  { id: "alerts", label: "알림 설정" },
  { id: "account", label: "계정 정보" },
  { id: "logout", label: "로그아웃" },
];

function totalSavings(products: Product[]): number {
  return products.reduce((sum, product) => {
    const start = product.priceHistory[0]?.price ?? 0;
    const current = lowestPlatform(product).price;
    return sum + Math.max(0, start - current);
  }, 0);
}

export default function MyPage({
  products,
  trackedIds,
  onSelectProduct,
  onToggleTracked,
  user,
  onSignOut,
}: MyPageProps) {
  const [tab, setTab] = useState<Tab>("wishlist");
  const tracked = products.filter((p) => trackedIds.has(p.id));
  const buyTimingCount = tracked.filter(isBuyTiming).length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="flex gap-7">
        <aside className="hidden w-[180px] shrink-0 flex-col sm:flex">
          <div className="mb-5 flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-50 text-lg">
              🙂
            </span>
            <span className="text-sm font-medium text-ink-900">{user?.name ?? "게스트"}</span>
          </div>
          <nav className="flex flex-col">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`cursor-pointer border-b border-ink-100 py-3 text-left text-sm transition-colors last:border-b-0 ${
                  tab === t.id ? "font-medium text-brand-600" : "text-ink-700 hover:text-ink-900"
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded border border-ink-100 p-4 text-center">
              <p className="text-xl font-bold text-ink-900">{tracked.length}</p>
              <p className="mt-1 text-[11px] text-ink-500">추적 중인 상품</p>
            </div>
            <div className="rounded border border-ink-100 p-4 text-center">
              <p className="text-xl font-bold text-ink-900">{buyTimingCount}</p>
              <p className="mt-1 text-[11px] text-ink-500">목표가 도달</p>
            </div>
            <div className="rounded border border-ink-100 p-4 text-center">
              <p className="text-xl font-bold text-brand-600">{formatKRW(totalSavings(tracked))}</p>
              <p className="mt-1 text-[11px] text-ink-500">이번 달 절약</p>
            </div>
          </div>

          {tab === "wishlist" &&
            (tracked.length === 0 ? (
              <p className="py-16 text-center text-sm text-ink-500">
                아직 등록한 관심 상품이 없어요.
              </p>
            ) : (
              <div className="overflow-x-auto rounded border border-ink-100">
                <table className="w-full min-w-[560px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-ink-100 bg-ink-50">
                      <th className="p-3 text-left text-xs font-medium text-ink-700">상품</th>
                      <th className="p-3 text-left text-xs font-medium text-ink-700">현재가</th>
                      <th className="p-3 text-left text-xs font-medium text-ink-700">목표가</th>
                      <th className="p-3 text-left text-xs font-medium text-ink-700">상태</th>
                      <th className="p-3 text-left text-xs font-medium text-ink-700">관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tracked.map((product) => {
                      const current = lowestPlatform(product).price;
                      const buyTiming = isBuyTiming(product);
                      return (
                        <tr key={product.id} className="border-b border-ink-100 last:border-b-0">
                          <td className="p-3">
                            <div className="flex items-center gap-2.5">
                              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-ink-50 text-lg">
                                {product.emoji}
                              </span>
                              <span className="text-ink-900">{product.name}</span>
                            </div>
                          </td>
                          <td className="p-3 text-ink-900">{formatKRW(current)}</td>
                          <td className="p-3 text-ink-900">{formatKRW(product.alert.targetPrice)}</td>
                          <td className="p-3">
                            <span
                              className={
                                buyTiming ? "font-medium text-brand-600" : "text-ink-500"
                              }
                            >
                              {buyTiming ? "도달" : `${percentToTarget(product)}%`}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => onSelectProduct(product.id)}
                                className="cursor-pointer text-xs text-ink-700 hover:text-ink-900"
                              >
                                보기
                              </button>
                              <button
                                onClick={() => onToggleTracked(product.id)}
                                className="cursor-pointer text-xs text-rose-500 hover:text-rose-600"
                              >
                                삭제
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ))}

          {tab === "alerts" &&
            (tracked.length === 0 ? (
              <p className="py-16 text-center text-sm text-ink-500">
                알림을 설정할 상품이 없어요.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {tracked.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between rounded border border-ink-100 px-4 py-3"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-ink-50 text-base">
                        {product.emoji}
                      </span>
                      <span className="text-sm text-ink-900">{product.name}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                          product.alert.enabled
                            ? "bg-brand-50 text-brand-700"
                            : "bg-ink-50 text-ink-500"
                        }`}
                      >
                        {product.alert.enabled ? "알림 켜짐" : "알림 꺼짐"}
                      </span>
                    </div>
                    <button
                      onClick={() => onSelectProduct(product.id)}
                      className="cursor-pointer text-xs text-brand-600 hover:text-brand-700"
                    >
                      상세보기 →
                    </button>
                  </div>
                ))}
              </div>
            ))}

          {tab === "account" &&
            (user ? (
              <div className="rounded border border-ink-100 p-5">
                <p className="text-xs text-ink-500">이름</p>
                <p className="mt-1 text-sm text-ink-900">{user.name}</p>
                <p className="mt-4 text-xs text-ink-500">이메일</p>
                <p className="mt-1 text-sm text-ink-900">{user.email}</p>
              </div>
            ) : (
              <p className="py-16 text-center text-sm text-ink-500">
                로그인하면 계정 정보를 확인할 수 있어요.
              </p>
            ))}

          {tab === "logout" &&
            (user ? (
              <div className="py-16 text-center">
                <p className="mb-3 text-sm text-ink-500">{user.name}님으로 로그인되어 있어요.</p>
                <button
                  onClick={onSignOut}
                  className="cursor-pointer rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <p className="py-16 text-center text-sm text-ink-500">
                로그인 상태가 아니에요.
              </p>
            ))}
        </div>
      </div>
    </div>
  );
}
