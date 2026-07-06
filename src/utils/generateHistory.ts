import type { PricePoint } from "../types";

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateHistory(
  seed: number,
  days: number,
  startPrice: number,
  driftPerDay: number,
  volatility: number
): PricePoint[] {
  const rand = mulberry32(seed);
  const points: PricePoint[] = [];
  let price = startPrice;
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    price = Math.max(1000, price + driftPerDay + (rand() - 0.5) * volatility);
    points.push({
      date: date.toISOString().slice(0, 10),
      price: Math.round(price / 100) * 100,
    });
  }
  return points;
}
