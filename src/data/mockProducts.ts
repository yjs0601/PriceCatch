import type { Product } from "../types";
import { generateHistory } from "../utils/generateHistory";

export const mockProducts: Product[] = [
  {
    id: "p1",
    name: "울트라슬림 14형 라이젠 노트북",
    category: "노트북",
    emoji: "💻",
    platforms: [
      { name: "쿠팡", price: 899000, url: "#" },
      { name: "네이버쇼핑", price: 872000, url: "#" },
      { name: "11번가", price: 905000, url: "#" },
    ],
    priceHistory: generateHistory(1, 30, 980000, -3200, 12000),
    alert: {
      enabled: true,
      targetPrice: 880000,
      condition: "target_price",
    },
  },
  {
    id: "p2",
    name: "물걸레 로봇청소기 Pro",
    category: "가전",
    emoji: "🤖",
    platforms: [
      { name: "쿠팡", price: 549000, url: "#" },
      { name: "네이버쇼핑", price: 561000, url: "#" },
      { name: "11번가", price: 555000, url: "#" },
    ],
    priceHistory: generateHistory(2, 30, 620000, -2600, 9000),
    alert: {
      enabled: true,
      targetPrice: 550000,
      condition: "target_price",
    },
  },
  {
    id: "p3",
    name: "노이즈캔슬링 무선 이어폰",
    category: "전자기기",
    emoji: "🎧",
    platforms: [
      { name: "쿠팡", price: 219000, url: "#" },
      { name: "네이버쇼핑", price: 215000, url: "#" },
      { name: "11번가", price: 229000, url: "#" },
    ],
    priceHistory: generateHistory(3, 30, 219000, 0, 6000),
    alert: {
      enabled: true,
      targetPrice: 189000,
      condition: "big_drop_only",
    },
  },
  {
    id: "p4",
    name: "수분 립스틱 3종 세트",
    category: "뷰티",
    emoji: "💄",
    platforms: [
      { name: "쿠팡", price: 32000, url: "#" },
      { name: "네이버쇼핑", price: 29800, url: "#" },
      { name: "올리브영", price: 31000, url: "#" },
    ],
    priceHistory: generateHistory(4, 30, 35000, -180, 1500),
    alert: {
      enabled: false,
      targetPrice: 28000,
      condition: "any_drop",
    },
  },
];
