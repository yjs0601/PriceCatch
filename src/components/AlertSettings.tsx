import type { AlertSettings as AlertSettingsType, NotifyCondition } from "../types";

type AlertSettingsProps = {
  alert: AlertSettingsType;
  onChange: (alert: AlertSettingsType) => void;
};

const CONDITIONS: { value: NotifyCondition; label: string; description: string }[] = [
  {
    value: "target_price",
    label: "목표가 도달 시",
    description: "설정한 목표가 이하로 떨어졌을 때만 알림",
  },
  {
    value: "big_drop_only",
    label: "큰 폭 하락 시",
    description: "역대 최저가에 근접하는 등 의미 있는 하락일 때만 알림",
  },
  {
    value: "any_drop",
    label: "모든 가격 변동",
    description: "사소한 변동까지 모두 알림 (알림이 잦을 수 있어요)",
  },
];

export default function AlertSettings({ alert, onChange }: AlertSettingsProps) {
  return (
    <div className="rounded-2xl border border-white/50 bg-white/25 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_15px_30px_-15px_rgba(0,0,0,0.25)] backdrop-blur-2xl">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold text-ink-900">알림 설정</h3>
        <label className="inline-flex cursor-pointer items-center gap-2 text-sm">
          <span className="text-ink-500">{alert.enabled ? "켜짐" : "꺼짐"}</span>
          <span className="relative inline-block h-5 w-9">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={alert.enabled}
              onChange={(e) => onChange({ ...alert, enabled: e.target.checked })}
            />
            <span className="absolute inset-0 rounded-full bg-ink-100 transition peer-checked:bg-brand-600" />
            <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-4" />
          </span>
        </label>
      </div>

      <div className={alert.enabled ? "" : "pointer-events-none opacity-40"}>
        <label className="block text-xs font-medium text-ink-500">목표 가격</label>
        <div className="mt-1 flex items-center gap-2">
          <input
            type="number"
            value={alert.targetPrice}
            onChange={(e) => onChange({ ...alert, targetPrice: Number(e.target.value) })}
            className="w-full rounded-lg border border-ink-100 px-3 py-2 text-sm transition-colors focus:border-brand-400 focus:outline-none"
          />
          <span className="text-sm text-ink-500">원</span>
        </div>

        <label className="mt-4 block text-xs font-medium text-ink-500">알림 조건</label>
        <div className="mt-1.5 flex flex-col gap-2">
          {CONDITIONS.map((c) => (
            <label
              key={c.value}
              className={`flex cursor-pointer items-start gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                alert.condition === c.value
                  ? "border-brand-300 bg-brand-50"
                  : "border-ink-100 bg-ink-50 hover:border-ink-300"
              }`}
            >
              <input
                type="radio"
                name="notify-condition"
                className="mt-0.5"
                checked={alert.condition === c.value}
                onChange={() => onChange({ ...alert, condition: c.value })}
              />
              <span>
                <span className="block font-medium text-ink-700">{c.label}</span>
                <span className="block text-xs text-ink-500">{c.description}</span>
              </span>
            </label>
          ))}
        </div>
      </div>
      <p className="mt-3 text-[11px] text-ink-500">변경사항은 자동으로 저장됩니다.</p>
    </div>
  );
}
