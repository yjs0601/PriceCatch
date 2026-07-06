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
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">알림 설정</h3>
        <label className="inline-flex cursor-pointer items-center gap-2 text-sm">
          <span className="text-slate-500">{alert.enabled ? "켜짐" : "꺼짐"}</span>
          <span className="relative inline-block h-5 w-9">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={alert.enabled}
              onChange={(e) => onChange({ ...alert, enabled: e.target.checked })}
            />
            <span className="absolute inset-0 rounded-full bg-slate-200 transition peer-checked:bg-brand-600" />
            <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-4" />
          </span>
        </label>
      </div>

      <div className={alert.enabled ? "" : "pointer-events-none opacity-40"}>
        <label className="block text-xs font-medium text-slate-500">목표 가격</label>
        <div className="mt-1 flex items-center gap-2">
          <input
            type="number"
            value={alert.targetPrice}
            onChange={(e) => onChange({ ...alert, targetPrice: Number(e.target.value) })}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none"
          />
          <span className="text-sm text-slate-400">원</span>
        </div>

        <label className="mt-4 block text-xs font-medium text-slate-500">알림 조건</label>
        <div className="mt-1.5 flex flex-col gap-2">
          {CONDITIONS.map((c) => (
            <label
              key={c.value}
              className={`flex cursor-pointer items-start gap-2 rounded-lg border px-3 py-2 text-sm transition ${
                alert.condition === c.value
                  ? "border-brand-300 bg-brand-50"
                  : "border-slate-100 bg-slate-50"
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
                <span className="block font-medium text-slate-700">{c.label}</span>
                <span className="block text-xs text-slate-400">{c.description}</span>
              </span>
            </label>
          ))}
        </div>
      </div>
      <p className="mt-3 text-[11px] text-slate-400">변경사항은 자동으로 저장됩니다.</p>
    </div>
  );
}
