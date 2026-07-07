import type { View } from "../App";
import type { AuthUser } from "../utils/auth";

const NAV_LABEL: Record<string, string> = {
  노트북: "컴퓨터 · 노트북",
};

type HeaderProps = {
  categories: string[];
  onNavigate: (view: View) => void;
  onRegisterClick: () => void;
  user: AuthUser | null;
  onSignInClick: () => void;
  onSignUpClick: () => void;
  onSignOut: () => void;
  showBack?: boolean;
  onBack?: () => void;
};

export default function Header({
  categories,
  onNavigate,
  onRegisterClick,
  user,
  onSignInClick,
  onSignUpClick,
  onSignOut,
  showBack,
  onBack,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-white/40 bg-white/60 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3.5">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={onBack}
              className="cursor-pointer rounded-lg p-1.5 text-ink-500 transition-colors hover:bg-ink-50"
              aria-label="뒤로가기"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}
          <button
            onClick={() => onNavigate({ name: "home" })}
            className="flex cursor-pointer items-center gap-2"
          >
            <span className="text-lg font-extrabold tracking-tight text-ink-900">PriceCatch</span>
            <img src="/mascot.svg" alt="" className="h-5 w-auto" />
          </button>
        </div>

        <nav className="hidden items-center gap-5 sm:flex">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onNavigate({ name: "search", category })}
              className="cursor-pointer whitespace-nowrap text-sm text-ink-700 transition-colors hover:text-ink-900"
            >
              {NAV_LABEL[category] ?? category}
            </button>
          ))}
          <button
            onClick={() => onNavigate({ name: "mypage" })}
            className="cursor-pointer text-sm text-ink-700 transition-colors hover:text-ink-900"
          >
            위시리스트
          </button>
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={onRegisterClick}
            className="cursor-pointer whitespace-nowrap rounded-lg border border-white/70 bg-white/30 px-3.5 py-2 text-xs font-medium text-ink-900 backdrop-blur-sm transition-colors hover:bg-white/50"
          >
            + 상품 등록
          </button>

          {user ? (
            <>
              <span className="hidden text-xs text-ink-700 sm:inline">{user.name}님</span>
              <button
                onClick={onSignOut}
                className="cursor-pointer rounded-lg border border-white/70 bg-white/30 px-3.5 py-2 text-xs font-medium text-ink-900 backdrop-blur-sm transition-colors hover:bg-white/50"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onSignInClick}
                className="cursor-pointer rounded-lg border border-white/70 bg-white/30 px-3.5 py-2 text-xs font-medium text-ink-900 backdrop-blur-sm transition-colors hover:bg-white/50"
              >
                Sign in
              </button>
              <button
                onClick={onSignUpClick}
                className="cursor-pointer whitespace-nowrap rounded-lg border border-white/70 bg-white/30 px-3.5 py-2 text-xs font-medium text-ink-900 backdrop-blur-sm transition-colors hover:bg-white/50"
              >
                Sign up
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
