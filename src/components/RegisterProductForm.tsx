import { useState } from "react";

export type RegisterProductInput = {
  name: string;
  category: string;
  url: string;
  targetPrice: number;
};

type RegisterProductFormProps = {
  onClose: () => void;
  onSubmit: (input: RegisterProductInput) => void;
};

const CATEGORY_SUGGESTIONS = ["전자기기", "노트북", "가전", "뷰티", "생활용품"];

export default function RegisterProductForm({ onClose, onSubmit }: RegisterProductFormProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [url, setUrl] = useState("");
  const [targetPrice, setTargetPrice] = useState("");

  const canSubmit = name.trim().length > 0 && Number(targetPrice) > 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit({
      name: name.trim(),
      category: category.trim() || "기타",
      url: url.trim(),
      targetPrice: Number(targetPrice),
    });
  }

  return (
    <div
      className="fixed inset-0 z-20 flex items-center justify-center bg-slate-900/40 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">관심 상품 등록</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-100"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>
        <p className="mb-4 text-xs text-slate-400">
          로그인 없이 바로 등록할 수 있어요. 등록 후 여러 쇼핑몰의 가격을 자동으로 비교해드려요.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-500">상품명 *</label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 무선 노이즈캔슬링 이어폰"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500">상품 URL (선택)</label>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="쿠팡, 네이버쇼핑 등 상품 링크"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500">카테고리</label>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="전자기기"
              list="category-suggestions"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none"
            />
            <datalist id="category-suggestions">
              {CATEGORY_SUGGESTIONS.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500">목표 가격 *</label>
            <div className="mt-1 flex items-center gap-2">
              <input
                type="number"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                placeholder="500000"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none"
              />
              <span className="text-sm text-slate-400">원</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              이 가격 이하로 떨어지면 알려드려요.
            </p>
          </div>

          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="rounded-lg bg-brand-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-200"
            >
              등록하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
