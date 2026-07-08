import { useState } from "react";
import type { AuthUser } from "../utils/auth";
import { signIn, signInWithGoogleMock, signUp } from "../utils/auth";

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
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

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

  async function handleGoogleAuth() {
    if (googleSubmitting) return;
    setError(null);
    setGoogleSubmitting(true);
    try {
      const user = await signInWithGoogleMock();
      onAuthenticated(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "구글 인증에 실패했어요.");
    } finally {
      setGoogleSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-20 flex items-center justify-center bg-ink-900/25 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-white/40 bg-white/20 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_25px_50px_-15px_rgba(0,0,0,0.4)] backdrop-blur-2xl"
        onClick={(e) => e.stopPropagation()}
      >
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

          <div className="my-1 flex items-center gap-2 text-[11px] text-ink-500">
            <span className="h-px flex-1 bg-ink-100" />
            또는
            <span className="h-px flex-1 bg-ink-100" />
          </div>

          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={googleSubmitting}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-ink-100 bg-white px-3.5 py-2.5 text-sm font-medium text-ink-900 transition-colors hover:bg-ink-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <svg viewBox="0 0 18 18" className="h-4 w-4" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z"
              />
              <path
                fill="#34A853"
                d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18Z"
              />
              <path
                fill="#FBBC05"
                d="M3.97 10.72A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.95H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.05l3.01-2.33Z"
              />
              <path
                fill="#EA4335"
                d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z"
              />
            </svg>
            {googleSubmitting ? "연결 중..." : "Google로 계속하기"}
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
