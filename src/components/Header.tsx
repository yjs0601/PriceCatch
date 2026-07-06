type HeaderProps = {
  onRegisterClick: () => void;
  showBack?: boolean;
  onBack?: () => void;
};

export default function Header({ onRegisterClick, showBack, onBack }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={onBack}
              className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100"
              aria-label="뒤로가기"
            >
              ←
            </button>
          )}
          <div className="flex items-center gap-1.5">
            <span className="text-xl">🎯</span>
            <span className="text-lg font-bold tracking-tight">PriceCatch</span>
          </div>
        </div>
        <button
          onClick={onRegisterClick}
          className="rounded-lg bg-brand-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          + 상품 등록
        </button>
      </div>
    </header>
  );
}
