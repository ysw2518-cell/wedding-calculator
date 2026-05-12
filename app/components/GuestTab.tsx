"use client";
import { useState } from "react";
import { Guest, Side, Relation } from "../types";

const RELATIONS: Relation[] = ["친구", "친척", "직장", "기타"];
const AMOUNTS = [30000, 50000, 70000, 100000, 150000, 200000];

function fmt(n: number) {
  return n.toLocaleString("ko-KR");
}

interface Props {
  guests: Guest[];
  onChange: (guests: Guest[]) => void;
}

export default function GuestTab({ guests, onChange }: Props) {
  const [form, setForm] = useState<Omit<Guest, "id">>({
    name: "", amount: 50000, relation: "친구", side: "groom",
  });
  const [customAmt, setCustomAmt] = useState("");
  const [filter, setFilter] = useState<Side | "all">("all");

  const add = () => {
    if (!form.name.trim()) return;
    const amt = customAmt ? parseInt(customAmt.replace(/,/g, ""), 10) : form.amount;
    if (!amt || isNaN(amt)) return;
    onChange([...guests, { ...form, amount: amt, id: crypto.randomUUID() }]);
    setForm({ name: "", amount: 50000, relation: "친구", side: form.side });
    setCustomAmt("");
  };

  const remove = (id: string) => onChange(guests.filter((g) => g.id !== id));

  const filtered = filter === "all" ? guests : guests.filter((g) => g.side === filter);

  const groomTotal = guests.filter((g) => g.side === "groom").reduce((s, g) => s + g.amount, 0);
  const brideTotal = guests.filter((g) => g.side === "bride").reduce((s, g) => s + g.amount, 0);

  return (
    <div className="lg:grid lg:grid-cols-2 lg:gap-6 space-y-4 lg:space-y-0">
      {/* 왼쪽: 입력 폼 */}
      <div className="space-y-4">
        {/* 요약 바 */}
        <div className="grid grid-cols-2 gap-3">
          <StatBox label="🤵 신랑측" color="#2E5E38" cnt={guests.filter((g) => g.side === "groom").length} total={groomTotal} />
          <StatBox label="👰 신부측" color="#9A7095" cnt={guests.filter((g) => g.side === "bride").length} total={brideTotal} />
        </div>

        <div className="bg-white rounded-2xl border border-[#CCE5CC] shadow-sm p-4 space-y-3">
          <p className="text-sm font-bold text-[#2A3C2C]">+ 하객 추가</p>

          <div className="grid grid-cols-2 gap-2">
            {(["groom", "bride"] as Side[]).map((s) => (
              <button
                key={s}
                onClick={() => setForm((f) => ({ ...f, side: s }))}
                className={`py-2 rounded-xl text-sm font-medium transition-all ${
                  form.side === s
                    ? s === "groom" ? "bg-[#2E5E38] text-white" : "bg-[#9A7095] text-white"
                    : "bg-[#F3F0E4] text-[#8FAA90]"
                }`}
              >
                {s === "groom" ? "🤵 신랑측" : "👰 신부측"}
              </button>
            ))}
          </div>

          <input
            className="w-full rounded-xl px-3 py-2.5 bg-[#F3F0E4] text-sm text-[#2A3C2C] outline-none focus:ring-2 focus:ring-[#5E9E65]/40"
            placeholder="이름"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            onKeyDown={(e) => e.key === "Enter" && add()}
          />

          <div className="flex gap-2 flex-wrap">
            {RELATIONS.map((r) => (
              <button
                key={r}
                onClick={() => setForm((f) => ({ ...f, relation: r }))}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  form.relation === r ? "bg-[#5E9E65] text-white" : "bg-[#F3F0E4] text-[#8FAA90]"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {AMOUNTS.map((a) => (
              <button
                key={a}
                onClick={() => { setForm((f) => ({ ...f, amount: a })); setCustomAmt(""); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  form.amount === a && !customAmt ? "bg-[#C5A050] text-white" : "bg-[#F3F0E4] text-[#8FAA90]"
                }`}
              >
                {fmt(a)}
              </button>
            ))}
          </div>
          <input
            className="w-full rounded-xl px-3 py-2.5 bg-[#F3F0E4] text-sm text-[#2A3C2C] outline-none focus:ring-2 focus:ring-[#C5A050]/40"
            placeholder="직접 입력 (예: 80000)"
            value={customAmt}
            onChange={(e) => setCustomAmt(e.target.value)}
            inputMode="numeric"
          />

          <button
            onClick={add}
            className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all active:scale-95"
            style={{ background: "linear-gradient(135deg, #2E5E38, #5E9E65)" }}
          >
            추가
          </button>
        </div>
      </div>

      {/* 오른쪽: 목록 */}
      <div className="space-y-3">
        {guests.length > 0 && (
          <div className="flex gap-2">
            {(["all", "groom", "bride"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  filter === f
                    ? "bg-[#2E5E38] text-white"
                    : "bg-white text-[#8FAA90] border border-[#CCE5CC]"
                }`}
              >
                {f === "all"
                  ? `전체 ${guests.length}명`
                  : f === "groom"
                  ? `🤵 ${guests.filter((g) => g.side === "groom").length}명`
                  : `👰 ${guests.filter((g) => g.side === "bride").length}명`}
              </button>
            ))}
          </div>
        )}

        {filtered.length > 0 ? (
          <div className="space-y-2 lg:max-h-[calc(100vh-280px)] lg:overflow-y-auto">
            {filtered.map((g) => (
              <div key={g.id} className="bg-white rounded-xl border border-[#CCE5CC] p-3 flex items-center gap-3">
                <div className="w-1.5 h-10 rounded-full flex-shrink-0" style={{ backgroundColor: g.side === "groom" ? "#2E5E38" : "#9A7095" }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-bold text-sm text-[#2A3C2C] truncate">{g.name}</p>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#F3F0E4] text-[#8FAA90]">{g.relation}</span>
                  </div>
                  <p className="text-xs text-[#8FAA90]">{g.side === "groom" ? "신랑측" : "신부측"}</p>
                </div>
                <p className="font-bold text-sm text-[#2A3C2C]">{fmt(g.amount)}원</p>
                <button onClick={() => remove(g.id)} className="text-[#CCE5CC] hover:text-red-400 text-lg leading-none ml-1">×</button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-[#A0C8A0]">
            <p className="text-3xl mb-2">💐</p>
            <p className="text-sm">하객을 추가해주세요</p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatBox({ label, color, cnt, total }: { label: string; color: string; cnt: number; total: number }) {
  return (
    <div className="bg-white rounded-2xl border shadow-sm p-3 text-center" style={{ borderColor: `${color}30` }}>
      <p className="text-xs font-medium mb-1" style={{ color }}>{label}</p>
      <p className="text-lg font-bold text-[#2A3C2C]">{cnt}명</p>
      <p className="text-xs text-[#8FAA90]">{fmt(total)}원</p>
    </div>
  );
}
