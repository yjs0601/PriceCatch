import { useState } from "react";
import type { AuthUser } from "../utils/auth";
import { signIn, signUp } from "../utils/auth";

type AuthModalProps = {
  mode: "signin" | "signup";
  onModeChange: (mode: "signin" | "signup") => void;
  onClose: () => void;
  onAuthenticated: (user: AuthUser) => void;
};

export default function AuthModal({ mode, onModeChange, onClose, onAuthenticated }: AuthModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit =
    email.trim().length > 0 && password.length > 0 && (mode === "signin" || name.trim().length > 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const user =
        mode === "signup"
          ? await signUp(email.trim(), password, name.trim())
          : await signIn(email.trim(), password);
      onAuthenticated(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했어요.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-20 flex items-center justify-center bg-ink-900/40 px-4"
      onClick={onClose}
    >
      <div className="w-full max-w-sm rounded bg-white p-5" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink-900">
            {mode === "signup" ? "회원가입" : "로그인"}
          </h2>
          <button
            onClick={onClose}
            className="cursor-pointer rounded-full p-1.5 text-ink-500 transition-colors hover:bg-ink-50"
            aria-label="닫기"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {mode === "signup" && (
            <div>
              <label className="block text-xs font-medium text-ink-500">이름</label>
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="홍길동"
                className="mt-1 w-full rounded-lg border border-ink-100 px-3 py-2 text-sm transition-colors focus:border-brand-400 focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-ink-500">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1 w-full rounded-lg border border-ink-100 px-3 py-2 text-sm transition-colors focus:border-brand-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-500">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className="mt-1 w-full rounded-lg border border-ink-100 px-3 py-2 text-sm transition-colors focus:border-brand-400 focus:outline-none"
            />
          </div>

          {error && <p className="text-xs text-rose-500">{error}</p>}

          <button
            type="submit"
            disabled={!canSubmit || submitting}
            className="mt-1 cursor-pointer rounded-lg bg-brand-600 px-3.5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-ink-100"
          >
            {mode === "signup" ? "회원가입" : "로그인"}
          </button>

          <p className="text-center text-xs text-ink-500">
            {mode === "signup" ? (
              <>
                이미 계정이 있으신가요?{" "}
                <button
                  type="button"
                  onClick={() => onModeChange("signin")}
                  className="cursor-pointer font-medium text-brand-600 hover:underline"
                >
                  로그인
                </button>
              </>
            ) : (
              <>
                계정이 없으신가요?{" "}
                <button
                  type="button"
                  onClick={() => onModeChange("signup")}
                  className="cursor-pointer font-medium text-brand-600 hover:underline"
                >
                  회원가입
                </button>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
}
