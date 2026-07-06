export function formatKRW(value: number): string {
  return `${value.toLocaleString("ko-KR")}원`;
}

export function formatShortDate(iso: string): string {
  const [, month, day] = iso.split("-");
  return `${Number(month)}/${Number(day)}`;
}
