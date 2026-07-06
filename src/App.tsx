import { useState } from "react";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import ProductDetail from "./components/ProductDetail";
import RegisterProductForm, { type RegisterProductInput } from "./components/RegisterProductForm";
import { mockProducts } from "./data/mockProducts";
import type { AlertSettings, Product } from "./types";
import { generateHistory } from "./utils/generateHistory";

function buildProductFromInput(input: RegisterProductInput): Product {
  const seed = Math.floor(Math.random() * 100000);
  const history = generateHistory(seed, 30, input.targetPrice * 1.08, -600, input.targetPrice * 0.01);
  const basePrice = history[history.length - 1].price;

  return {
    id: crypto.randomUUID(),
    name: input.name,
    category: input.category,
    emoji: "🛍️",
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
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showRegister, setShowRegister] = useState(false);

  const selectedProduct = products.find((p) => p.id === selectedId) ?? null;

  function handleRegister(input: RegisterProductInput) {
    const newProduct = buildProductFromInput(input);
    setProducts((prev) => [newProduct, ...prev]);
    setShowRegister(false);
    setSelectedId(newProduct.id);
  }

  function handleUpdateAlert(alert: AlertSettings) {
    if (!selectedProduct) return;
    setProducts((prev) =>
      prev.map((p) => (p.id === selectedProduct.id ? { ...p, alert } : p))
    );
  }

  function handleRemove() {
    if (!selectedProduct) return;
    setProducts((prev) => prev.filter((p) => p.id !== selectedProduct.id));
    setSelectedId(null);
  }

  return (
    <div className="min-h-screen">
      <Header
        onRegisterClick={() => setShowRegister(true)}
        showBack={!!selectedProduct}
        onBack={() => setSelectedId(null)}
      />

      {selectedProduct ? (
        <ProductDetail
          product={selectedProduct}
          onUpdateAlert={handleUpdateAlert}
          onRemove={handleRemove}
        />
      ) : (
        <Dashboard products={products} onSelectProduct={setSelectedId} />
      )}

      {showRegister && (
        <RegisterProductForm onClose={() => setShowRegister(false)} onSubmit={handleRegister} />
      )}
    </div>
  );
}
