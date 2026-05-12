"use client";
import { useState } from "react";
import { Expense, Side } from "../types";

function fmt(n: number) {
  return n.toLocaleString("ko-KR");
}

interface Props {
  expenses: Expense[];
  onChange: (expenses: Expense[]) => void;
}

export default function ExpenseTab({ expenses, onChange }: Props) {
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [side, setSide] = useState<Side>("groom");

  const add = () => {
    const amt = parseInt(amount.replace(/,/g, ""), 10);
    if (!label.trim() || !amt || isNaN(amt)) return;
    onChange([
      ...expenses,
      { id: crypto.randomUUID(), label: label.trim(), amount: amt, side },
    ]);
    setLabel("");
    setAmount("");
  };

  const remove = (id: string) => onChange(expenses.filter((e) => e.id !== id));

  const groomTotal = expenses
    .filter((e) => e.side === "groom")
    .reduce((s, e) => s + e.amount, 0);
  const brideTotal = expenses
    .filter((e) => e.side === "bride")
    .reduce((s, e) => s + e.amount, 0);

  return (
    <div className="space-y-4">
      <p className="text-xs text-[#8FAA90]">
        대관료·식대는 설정 탭에서, 여기는 스드메·한복·웨딩카 등 기타 비용을 입력하세요.
      </p>

      {/* 요약 */}
      {expenses.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          <StatBox label="🤵 신랑측" color="#2E5E38" total={groomTotal} />
          <StatBox label="👰 신부측" color="#9A7095" total={brideTotal} />
        </div>
      )}

      {/* 입력 폼 */}
      <div className="bg-white rounded-2xl border border-[#CCE5CC] shadow-sm p-4 space-y-3">
        <p className="text-sm font-bold text-[#2A3C2C]">+ 비용 추가</p>

        <div className="grid grid-cols-2 gap-2">
          {(["groom", "bride"] as Side[]).map((s) => (
            <button
              key={s}
              onClick={() => setSide(s)}
              className={`py-2 rounded-xl text-sm font-medium transition-all ${
                side === s
                  ? s === "groom"
                    ? "bg-[#2E5E38] text-white"
                    : "bg-[#9A7095] text-white"
                  : "bg-[#F3F0E4] text-[#8FAA90]"
              }`}
            >
              {s === "groom" ? "🤵 신랑측" : "👰 신부측"}
            </button>
          ))}
        </div>

        <input
          className="w-full rounded-xl px-3 py-2.5 bg-[#F3F0E4] text-sm text-[#2A3C2C] outline-none focus:ring-2 focus:ring-[#5E9E65]/40"
          placeholder="항목명 (예: 스드메, 한복)"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
        <input
          className="w-full rounded-xl px-3 py-2.5 bg-[#F3F0E4] text-sm text-[#2A3C2C] outline-none focus:ring-2 focus:ring-[#C5A050]/40"
          placeholder="금액 (예: 1500000)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          inputMode="numeric"
          onKeyDown={(e) => e.key === "Enter" && add()}
        />

        <button
          onClick={add}
          className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all active:scale-95"
          style={{ background: "linear-gradient(135deg, #2E5E38, #5E9E65)" }}
        >
          추가
        </button>
      </div>

      {/* 목록 */}
      {expenses.length > 0 ? (
        <div className="space-y-2">
          {expenses.map((e) => (
            <div
              key={e.id}
              className="bg-white rounded-xl border border-[#CCE5CC] p-3 flex items-center gap-3"
            >
              <div
                className="w-1.5 h-10 rounded-full flex-shrink-0"
                style={{ backgroundColor: e.side === "groom" ? "#2E5E38" : "#9A7095" }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-[#2A3C2C] truncate">{e.label}</p>
                <p className="text-xs text-[#8FAA90]">
                  {e.side === "groom" ? "🤵 신랑측" : "👰 신부측"}
                </p>
              </div>
              <p className="font-bold text-sm text-[#2A3C2C]">{fmt(e.amount)}원</p>
              <button
                onClick={() => remove(e.id)}
                className="text-[#CCE5CC] hover:text-red-400 text-lg leading-none ml-1"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-[#A0C8A0]">
          <p className="text-3xl mb-2">🧾</p>
          <p className="text-sm">부대비용을 추가해주세요</p>
        </div>
      )}
    </div>
  );
}

function StatBox({ label, color, total }: { label: string; color: string; total: number }) {
  return (
    <div
      className="bg-white rounded-2xl border shadow-sm p-3 text-center"
      style={{ borderColor: `${color}30` }}
    >
      <p className="text-xs font-medium mb-1" style={{ color }}>
        {label}
      </p>
      <p className="text-base font-bold text-[#2A3C2C]">{fmt(total)}원</p>
    </div>
  );
}
