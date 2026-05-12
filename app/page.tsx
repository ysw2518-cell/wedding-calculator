"use client";
import { useState, useEffect } from "react";
import { Guest, Expense, Settings, DEFAULT_SETTINGS } from "./types";
import SummaryTab from "./components/SummaryTab";
import GuestTab from "./components/GuestTab";
import ExpenseTab from "./components/ExpenseTab";
import SettingsTab from "./components/SettingsTab";
import AdFit from "./components/AdFit";

type Tab = "summary" | "guests" | "expenses" | "settings";

const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: "summary",  label: "정산",  emoji: "⚖️" },
  { id: "guests",   label: "하객",  emoji: "👥" },
  { id: "expenses", label: "비용",  emoji: "🧾" },
  { id: "settings", label: "설정",  emoji: "⚙️" },
];

export default function Page() {
  const [tab, setTab] = useState<Tab>("summary");
  const [guests, setGuests] = useState<Guest[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const g = localStorage.getItem("wedding_guests");
      const e = localStorage.getItem("wedding_expenses");
      const s = localStorage.getItem("wedding_settings");
      if (g) setGuests(JSON.parse(g));
      if (e) setExpenses(JSON.parse(e));
      if (s) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(s) });
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem("wedding_guests", JSON.stringify(guests));
  }, [guests, loaded]);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem("wedding_expenses", JSON.stringify(expenses));
  }, [expenses, loaded]);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem("wedding_settings", JSON.stringify(settings));
  }, [settings, loaded]);

  const reset = () => {
    setGuests([]);
    setExpenses([]);
    setSettings(DEFAULT_SETTINGS);
  };

  if (!loaded) return null;

  return (
    <div className="min-h-screen" style={{ background: "#F8F6EE" }}>
      {/* 헤더 */}
      <div
        className="sticky top-0 z-10"
        style={{
          background: "linear-gradient(135deg, #2E5E38 0%, #5E9E65 60%, #C5A050 100%)",
        }}
      >
        <div className="max-w-lg mx-auto px-4 pt-4 pb-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-lg">
              💍
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-none">축의계산기</h1>
              <p className="text-white/60 text-xs">결혼식 정산 도우미</p>
            </div>
          </div>

          {/* 탭 */}
          <div className="flex">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex-1 py-2.5 text-xs font-medium transition-all ${
                  tab === t.id
                    ? "border-b-2 border-white text-white"
                    : "text-white/50 border-b-2 border-transparent"
                }`}
              >
                <span className="block">{t.emoji}</span>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 콘텐츠 */}
      <div className="max-w-lg mx-auto px-4 py-4">
        {tab === "summary" && (
          <SummaryTab guests={guests} expenses={expenses} settings={settings} />
        )}
        {tab === "guests" && (
          <GuestTab guests={guests} onChange={setGuests} />
        )}
        {tab === "expenses" && (
          <ExpenseTab expenses={expenses} onChange={setExpenses} />
        )}
        {tab === "settings" && (
          <SettingsTab settings={settings} onChange={setSettings} onReset={reset} />
        )}
        <div className="py-4">
          <AdFit />
        </div>
      </div>
    </div>
  );
}
