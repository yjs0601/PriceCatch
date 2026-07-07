import { useState } from "react";
import Header from "./components/Header";
import Home from "./components/Home";
import SearchResults from "./components/SearchResults";
import CompareTable from "./components/CompareTable";
import MyPage from "./components/MyPage";
import ProductDetail from "./components/ProductDetail";
import RegisterProductForm, { type RegisterProductInput } from "./components/RegisterProductForm";
import AuthModal from "./components/AuthModal";
import { mockProducts } from "./data/mockProducts";
import { getCategories } from "./utils/categories";
import type { AlertSettings, Product } from "./types";
import { generateHistory } from "./utils/generateHistory";
import { getSession, signOut, type AuthUser } from "./utils/auth";

export type View =
  | { name: "home" }
  | { name: "search"; category?: string }
  | { name: "detail"; productId: string }
  | { name: "compare" }
  | { name: "mypage" };

function buildProductFromInput(input: RegisterProductInput): Product {
  const seed = Math.floor(Math.random() * 100000);
  const history = generateHistory(seed, 30, input.targetPrice * 1.08, -600, input.targetPrice * 0.01);
  const basePrice = history[history.length - 1].price;

  return {
    id: crypto.randomUUID(),
    name: input.name,
    category: input.category,
    emoji: "🛍️",
    rating: 4.0,
    shippingFee: 0,
    platforms: [
      { name: "쿠팡", price: basePrice, url: input.url || "#" },
      { name: "네이버쇼핑", price: Math.round((basePrice * 0.98) / 100) * 100, url: input.url || "#" },
      { name: "11번가", price: Math.round((basePrice * 1.02) / 100) * 100, url: input.url || "#" },
    ],
    priceHistory: history,
    alert: {
      enabled: true,
      targetPrice: input.targetPrice,
      condition: "target_price",
    },
  };
}

export default function App() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [trackedIds, setTrackedIds] = useState<Set<string>>(
    new Set(mockProducts.slice(0, 4).map((p) => p.id))
  );
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [view, setView] = useState<View>({ name: "home" });
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(() => getSession());
  const [authMode, setAuthMode] = useState<"signin" | "signup" | null>(null);

  const categories = getCategories(products);
  const selectedProduct =
    view.name === "detail" ? products.find((p) => p.id === view.productId) ?? null : null;

  function toggleTracked(id: string) {
    setTrackedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleCompare(id: string) {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }

  function handleRegister(input: RegisterProductInput) {
    const newProduct = buildProductFromInput(input);
    setProducts((prev) => [newProduct, ...prev]);
    setTrackedIds((prev) => new Set(prev).add(newProduct.id));
    setShowRegister(false);
    setView({ name: "detail", productId: newProduct.id });
  }

  function handleUpdateAlert(alert: AlertSettings) {
    if (!selectedProduct) return;
    setProducts((prev) =>
      prev.map((p) => (p.id === selectedProduct.id ? { ...p, alert } : p))
    );
  }

  function handleSignOut() {
    signOut();
    setUser(null);
  }

  return (
    <div className="min-h-screen">
      <Header
        categories={categories}
        onNavigate={setView}
        onRegisterClick={() => setShowRegister(true)}
        user={user}
        onSignInClick={() => setAuthMode("signin")}
        onSignUpClick={() => setAuthMode("signup")}
        onSignOut={handleSignOut}
        showBack={view.name !== "home"}
        onBack={() => setView({ name: "home" })}
      />

      {view.name === "home" && (
        <Home
          products={products}
          categories={categories}
          onSelectProduct={(id) => setView({ name: "detail", productId: id })}
          onNavigate={setView}
        />
      )}

      {view.name === "search" && (
        <SearchResults
          products={products}
          categories={categories}
          initialCategory={view.category}
          trackedIds={trackedIds}
          onToggleTracked={toggleTracked}
          compareIds={compareIds}
          onToggleCompare={toggleCompare}
          onSelectProduct={(id) => setView({ name: "detail", productId: id })}
          onGoToCompare={() => setView({ name: "compare" })}
        />
      )}

      {view.name === "compare" && (
        <CompareTable
          products={products}
          compareIds={compareIds}
          onClearCompare={() => setCompareIds([])}
          onNavigateSearch={() => setView({ name: "search" })}
        />
      )}

      {view.name === "mypage" && (
        <MyPage
          products={products}
          trackedIds={trackedIds}
          onSelectProduct={(id) => setView({ name: "detail", productId: id })}
          onToggleTracked={toggleTracked}
          user={user}
          onSignOut={handleSignOut}
        />
      )}

      {view.name === "detail" && selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          tracked={trackedIds.has(selectedProduct.id)}
          onUpdateAlert={handleUpdateAlert}
          onToggleTrack={() => toggleTracked(selectedProduct.id)}
        />
      )}

      {showRegister && (
        <RegisterProductForm onClose={() => setShowRegister(false)} onSubmit={handleRegister} />
      )}

      {authMode && (
        <AuthModal
          mode={authMode}
          onModeChange={setAuthMode}
          onClose={() => setAuthMode(null)}
          onAuthenticated={(authedUser) => {
            setUser(authedUser);
            setAuthMode(null);
          }}
        />
      )}
    </div>
  );
}
