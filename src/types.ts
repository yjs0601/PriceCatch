export type Platform = {
  name: string;
  price: number;
  url: string;
};

export type PricePoint = {
  date: string;
  price: number;
};

export type NotifyCondition = "target_price" | "any_drop" | "big_drop_only";

export type AlertSettings = {
  enabled: boolean;
  targetPrice: number;
  condition: NotifyCondition;
};

export type Product = {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  emoji: string;
  image?: string;
  brand?: string;
  rating?: number;
  shippingFee?: number;
  views?: number;
  platforms: Platform[];
  priceHistory: PricePoint[];
  alert: AlertSettings;
};

export function lowestPlatform(product: Product): Platform {
  return [...product.platforms].sort((a, b) => a.price - b.price)[0];
}

export function allTimeLow(product: Product): number {
  return Math.min(...product.priceHistory.map((p) => p.price));
}

export function isBuyTiming(product: Product): boolean {
  const current = lowestPlatform(product).price;
  return current <= product.alert.targetPrice || current <= allTimeLow(product) * 1.01;
}

export function percentToTarget(product: Product): number {
  const current = lowestPlatform(product).price;
  const target = product.alert.targetPrice;
  if (current <= target) return 100;
  const start = product.priceHistory[0]?.price ?? current;
  if (start <= target) return 100;
  const progress = (start - current) / (start - target);
  return Math.max(0, Math.min(100, Math.round(progress * 100)));
}
