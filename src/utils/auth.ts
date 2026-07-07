export type AuthUser = {
  email: string;
  name: string;
};

const USERS_KEY = "pricecatch_mock_users";
const SESSION_KEY = "pricecatch_mock_session";

type StoredUser = { name: string; password: string };

function readUsers(): Record<string, StoredUser> {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function writeUsers(users: Record<string, StoredUser>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Mock auth backed by localStorage — no real backend yet. Swap these three
// functions for real API calls once the backend is connected; the AuthUser
// shape and call signatures are designed to stay the same across that swap.
export async function signUp(email: string, password: string, name: string): Promise<AuthUser> {
  const users = readUsers();
  if (users[email]) throw new Error("이미 가입된 이메일이에요.");
  users[email] = { name, password };
  writeUsers(users);
  const user: AuthUser = { email, name };
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return user;
}

export async function signIn(email: string, password: string): Promise<AuthUser> {
  const record = readUsers()[email];
  if (!record || record.password !== password) {
    throw new Error("이메일 또는 비밀번호가 올바르지 않아요.");
  }
  const user: AuthUser = { email, name: record.name };
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return user;
}

export function signOut() {
  localStorage.removeItem(SESSION_KEY);
}

export function getSession(): AuthUser | null {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) ?? "null");
  } catch {
    return null;
  }
}
