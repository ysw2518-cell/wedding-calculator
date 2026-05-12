"use client";
import { Settings, VenueOwner } from "../types";

function fmt(n: number) {
  return n.toLocaleString("ko-KR");
}

interface Props {
  settings: Settings;
  onChange: (s: Settings) => void;
  onReset: () => void;
}

const MEAL_PRICES = [50000, 60000, 65000, 70000, 80000, 100000];
const MIN_GUESTS = [100, 150, 200, 250, 300];

export default function SettingsTab({ settings, onChange, onReset }: Props) {
  const set = (patch: Partial<Settings>) => onChange({ ...settings, ...patch });

  return (
    <div className="space-y-4">
      {/* 식대 */}
      <div className="bg-white rounded-2xl border border-[#CCE5CC] shadow-sm p-4 space-y-3">
        <SectionLabel label="🍽️ 1인당 식대" />
        <div className="flex flex-wrap gap-2">
          {MEAL_PRICES.map((p) => (
            <button
              key={p}
              onClick={() => set({ mealPrice: p })}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                settings.mealPrice === p
                  ? "bg-[#2E5E38] text-white"
                  : "bg-[#F3F0E4] text-[#8FAA90]"
              }`}
            >
              {fmt(p)}원
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            className="flex-1 rounded-xl px-3 py-2.5 bg-[#F3F0E4] text-sm text-[#2A3C2C] outline-none focus:ring-2 focus:ring-[#5E9E65]/40"
            placeholder="직접 입력"
            value={MEAL_PRICES.includes(settings.mealPrice) ? "" : String(settings.mealPrice)}
            onChange={(e) => {
              const v = parseInt(e.target.value, 10);
              if (!isNaN(v)) set({ mealPrice: v });
            }}
            inputMode="numeric"
          />
          <span className="text-sm text-[#8FAA90]">원</span>
        </div>
        <p className="text-xs text-[#A0C8A0]">현재: {fmt(settings.mealPrice)}원/인</p>
      </div>

      {/* 최소 보증 인원 */}
      <div className="bg-white rounded-2xl border border-[#CCE5CC] shadow-sm p-4 space-y-3">
        <SectionLabel label="👥 최소 보증 인원" />
        <p className="text-xs text-[#8FAA90]">
          실제 하객 수보다 많으면 최소 보증 인원으로 식대 계산
        </p>
        <div className="flex flex-wrap gap-2">
          {MIN_GUESTS.map((n) => (
            <button
              key={n}
              onClick={() => set({ minGuests: n })}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                settings.minGuests === n
                  ? "bg-[#2E5E38] text-white"
                  : "bg-[#F3F0E4] text-[#8FAA90]"
              }`}
            >
              {n}명
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            className="flex-1 rounded-xl px-3 py-2.5 bg-[#F3F0E4] text-sm text-[#2A3C2C] outline-none focus:ring-2 focus:ring-[#5E9E65]/40"
            placeholder="직접 입력"
            value={MIN_GUESTS.includes(settings.minGuests) ? "" : String(settings.minGuests)}
            onChange={(e) => {
              const v = parseInt(e.target.value, 10);
              if (!isNaN(v)) set({ minGuests: v });
            }}
            inputMode="numeric"
          />
          <span className="text-sm text-[#8FAA90]">명</span>
        </div>
      </div>

      {/* 대관료 */}
      <div className="bg-white rounded-2xl border border-[#CCE5CC] shadow-sm p-4 space-y-3">
        <SectionLabel label="🏛️ 대관료" />
        <div className="flex items-center gap-2">
          <input
            className="flex-1 rounded-xl px-3 py-2.5 bg-[#F3F0E4] text-sm text-[#2A3C2C] outline-none focus:ring-2 focus:ring-[#5E9E65]/40"
            placeholder="0 (없으면 비워두세요)"
            value={settings.venueCost === 0 ? "" : String(settings.venueCost)}
            onChange={(e) => {
              const v = parseInt(e.target.value, 10);
              set({ venueCost: isNaN(v) ? 0 : v });
            }}
            inputMode="numeric"
          />
          <span className="text-sm text-[#8FAA90]">원</span>
        </div>
        {settings.venueCost > 0 && (
          <>
            <p className="text-xs text-[#8FAA90]">부담 방식</p>
            <div className="grid grid-cols-3 gap-2">
              {(["half", "groom", "bride"] as VenueOwner[]).map((v) => (
                <button
                  key={v}
                  onClick={() => set({ venueOwner: v })}
                  className={`py-2 rounded-xl text-xs font-medium transition-all ${
                    settings.venueOwner === v
                      ? "bg-[#2E5E38] text-white"
                      : "bg-[#F3F0E4] text-[#8FAA90]"
                  }`}
                >
                  {v === "half" ? "반반" : v === "groom" ? "신랑측" : "신부측"}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* 초기화 */}
      <button
        onClick={() => {
          if (confirm("모든 데이터(하객·비용·설정)를 초기화할까요?")) onReset();
        }}
        className="w-full py-3 rounded-xl text-sm font-medium text-red-400 border border-red-200 bg-white transition-all active:scale-95"
      >
        🗑️ 전체 데이터 초기화
      </button>
    </div>
  );
}

function SectionLabel({ label }: { label: string }) {
  return <p className="text-sm font-bold text-[#2A3C2C]">{label}</p>;
}
