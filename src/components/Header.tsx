import { useEffect, useRef, useState } from "react";
import type { View } from "../App";
import type { AuthUser } from "../utils/auth";

type HeaderProps = {
  categories: string[];
  onNavigate: (view: View) => void;
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
  user,
  onSignInClick,
  onSignUpClick,
  onSignOut,
  showBack,
  onBack,
}: HeaderProps) {
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    function handleScroll() {
      const currentY = window.scrollY;
      setHidden(currentY > lastScrollY.current && currentY > 80);
      lastScrollY.current = currentY;
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-10 transition-transform duration-300 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
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
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="cursor-pointer rounded-lg p-1.5 text-ink-700 backdrop-blur-2xl transition-all hover:bg-[linear-gradient(135deg,rgba(255,255,255,0.1)_0%,rgba(153,153,153,0.1)_100%)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_10px_20px_-8px_rgba(0,0,0,0.25)] sm:hidden"
            aria-label="메뉴 열기"
            aria-expanded={menuOpen}
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
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <nav className="hidden items-center gap-8 ml-5 sm:flex">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onNavigate({ name: "search", category })}
              className="cursor-pointer whitespace-nowrap text-sm text-ink-700 transition-colors hover:text-ink-900"
            >
              {category}
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
          {user ? (
            <>
              <span className="hidden text-xs text-ink-700 sm:inline">{user.name}님</span>
              <button
                onClick={onSignOut}
                className="cursor-pointer rounded-lg bg-[linear-gradient(135deg,rgba(255,255,255,0.1)_0%,rgba(153,153,153,0.1)_100%)] px-3.5 py-2 text-xs font-semibold text-ink-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_10px_20px_-8px_rgba(0,0,0,0.25)] backdrop-blur-2xl transition-all hover:bg-[linear-gradient(135deg,rgba(255,255,255,0.18)_0%,rgba(153,153,153,0.18)_100%)]"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onSignInClick}
                className="cursor-pointer rounded-lg bg-[linear-gradient(135deg,rgba(255,255,255,0.1)_0%,rgba(153,153,153,0.1)_100%)] px-3.5 py-2 text-xs font-semibold text-ink-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_10px_20px_-8px_rgba(0,0,0,0.25)] backdrop-blur-2xl transition-all hover:bg-[linear-gradient(135deg,rgba(255,255,255,0.18)_0%,rgba(153,153,153,0.18)_100%)]"
              >
                Sign in
              </button>
              <button
                onClick={onSignUpClick}
                className="cursor-pointer whitespace-nowrap rounded-lg bg-[linear-gradient(135deg,rgba(255,255,255,0.1)_0%,rgba(153,153,153,0.1)_100%)] px-3.5 py-2 text-xs font-semibold text-ink-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_10px_20px_-8px_rgba(0,0,0,0.25)] backdrop-blur-2xl transition-all hover:bg-[linear-gradient(135deg,rgba(255,255,255,0.18)_0%,rgba(153,153,153,0.18)_100%)]"
              >
                Sign up
              </button>
            </>
          )}
        </div>
      </div>

      {menuOpen && (
        <nav className="flex flex-col gap-1 border-t border-white/50 bg-white/70 px-4 py-3 backdrop-blur-2xl sm:hidden">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                onNavigate({ name: "search", category });
                setMenuOpen(false);
              }}
              className="cursor-pointer rounded-lg px-2 py-2 text-left text-sm text-ink-700 transition-colors hover:bg-white/60 hover:text-ink-900"
            >
              {category}
            </button>
          ))}
          <button
            onClick={() => {
              onNavigate({ name: "mypage" });
              setMenuOpen(false);
            }}
            className="cursor-pointer rounded-lg px-2 py-2 text-left text-sm text-ink-700 transition-colors hover:bg-white/60 hover:text-ink-900"
          >
            위시리스트
          </button>
        </nav>
      )}
    </header>
  );
}
