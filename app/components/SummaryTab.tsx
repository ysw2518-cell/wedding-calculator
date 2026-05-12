"use client";
import { Guest, Expense, Settings } from "../types";

function fmt(n: number) {
  return n.toLocaleString("ko-KR");
}

interface Props {
  guests: Guest[];
  expenses: Expense[];
  settings: Settings;
}

export default function SummaryTab({ guests, expenses, settings }: Props) {
  const groomGuests = guests.filter((g) => g.side === "groom");
  const brideGuests = guests.filter((g) => g.side === "bride");
  const groomGift = groomGuests.reduce((s, g) => s + g.amount, 0);
  const brideGift = brideGuests.reduce((s, g) => s + g.amount, 0);
  const totalGift = groomGift + brideGift;

  const totalCount = guests.length;
  const effective = Math.max(totalCount, settings.minGuests);
  const mealTotal = effective * settings.mealPrice;

  const groomEffective =
    totalCount === 0
      ? Math.floor(effective / 2)
      : Math.round((effective * groomGuests.length) / totalCount);
  const brideEffective = effective - groomEffective;
  const groomMeal = groomEffective * settings.mealPrice;
  const brideMeal = brideEffective * settings.mealPrice;

  const groomVenue =
    settings.venueOwner === "groom"
      ? settings.venueCost
      : settings.venueOwner === "bride"
      ? 0
      : Math.round(settings.venueCost / 2);
  const brideVenue = settings.venueCost - groomVenue;

  const groomExtras = expenses
    .filter((e) => e.side === "groom")
    .reduce((s, e) => s + e.amount, 0);
  const brideExtras = expenses
    .filter((e) => e.side === "bride")
    .reduce((s, e) => s + e.amount, 0);
  const extraTotal = groomExtras + brideExtras;

  const totalExpense = settings.venueCost + mealTotal + extraTotal;
  const groomExpense = groomMeal + groomVenue + groomExtras;
  const brideExpense = brideMeal + brideVenue + brideExtras;

  const netTotal = totalGift - totalExpense;
  const groomNet = groomGift - groomExpense;
  const brideNet = brideGift - brideExpense;

  const surplus = netTotal >= 0;

  return (
    <div className="space-y-5">
      {/* 순수익 헤더 */}
      <div
        className="rounded-2xl p-5 text-white text-center"
        style={{
          background: "linear-gradient(135deg, #2E5E38 0%, #5E9E65 60%, #C5A050 100%)",
        }}
      >
        <p className="text-sm opacity-75 mb-1">{surplus ? "🎉 흑자" : "💸 적자"}</p>
        <p className="text-4xl font-bold tracking-tight">
          {netTotal >= 0 ? "+" : ""}
          {fmt(netTotal)}원
        </p>
        <p className="text-xs opacity-60 mt-1">
          {surplus ? "수입이 지출보다 많아요 🌹" : "지출이 수입보다 많아요"}
        </p>
      </div>

      {/* 축의금 수입 */}
      <div className="bg-white rounded-2xl border border-[#CCE5CC] shadow-sm p-4">
        <SectionLabel emoji="💐" label="축의금 수입" />
        <div className="mt-3 space-y-2">
          <GiftRow label="🤵 신랑측" color="#2E5E38" amt={groomGift} cnt={groomGuests.length} />
          <Divider />
          <GiftRow label="👰 신부측" color="#9A7095" amt={brideGift} cnt={brideGuests.length} />
          <Divider />
          <GiftRow label="💍 합계" color="#2A3C2C" amt={totalGift} cnt={totalCount} bold />
        </div>
      </div>

      {/* 지출 내역 */}
      <div className="bg-white rounded-2xl border border-[#CCE5CC] shadow-sm p-4">
        <SectionLabel emoji="🧾" label="지출 내역" />
        <div className="mt-3 space-y-2 text-sm">
          {settings.venueCost > 0 && (
            <>
              <ExpRow
                label="🏛️ 대관료"
                sub={settings.venueOwner === "groom" ? "신랑측" : settings.venueOwner === "bride" ? "신부측" : "반반"}
                amt={settings.venueCost}
              />
              <Divider />
            </>
          )}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-[#567060]">🍽️ 식대</p>
              {totalCount < settings.minGuests && (
                <p className="text-xs text-orange-500">
                  최소보증 {fmt(settings.minGuests)}명 적용 (실제 {totalCount}명)
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-xs text-[#8FAA90]">
                {fmt(effective)}명 × {fmt(settings.mealPrice)}원
              </p>
              <p className="font-bold text-[#2A3C2C]">{fmt(mealTotal)}원</p>
            </div>
          </div>
          {expenses.filter((e) => e.side === "groom").length > 0 && (
            <>
              <Divider />
              <p className="text-xs font-semibold text-[#2E5E38]">🤵 신랑측 부대비용</p>
              {expenses
                .filter((e) => e.side === "groom")
                .map((e) => (
                  <ExpRow key={e.id} label={`· ${e.label}`} amt={e.amount} />
                ))}
            </>
          )}
          {expenses.filter((e) => e.side === "bride").length > 0 && (
            <>
              <Divider />
              <p className="text-xs font-semibold text-[#9A7095]">👰 신부측 부대비용</p>
              {expenses
                .filter((e) => e.side === "bride")
                .map((e) => (
                  <ExpRow key={e.id} label={`· ${e.label}`} amt={e.amount} />
                ))}
            </>
          )}
          <Divider />
          <div className="flex items-center justify-between font-bold">
            <span className="text-[#9A7095]">지출 합계</span>
            <span className="text-[#9A7095] text-base">{fmt(totalExpense)}원</span>
          </div>
        </div>
      </div>

      {/* 양가 정산 */}
      <div className="bg-white rounded-2xl border border-[#CCE5CC] shadow-sm p-4">
        <SectionLabel emoji="💍" label="양가 정산" />
        <div className="mt-3 space-y-3">
          <SideCard
            label="🤵 신랑측"
            color="#2E5E38"
            gift={groomGift}
            meal={groomMeal}
            venue={groomVenue}
            extra={groomExtras}
            expense={groomExpense}
            net={groomNet}
          />
          <SideCard
            label="👰 신부측"
            color="#9A7095"
            gift={brideGift}
            meal={brideMeal}
            venue={brideVenue}
            extra={brideExtras}
            expense={brideExpense}
            net={brideNet}
          />
        </div>
      </div>

      <p className="text-center text-xs text-[#8FAA90] pb-4">v1.0.0 · made by 말딱 아빠 🍼</p>
    </div>
  );
}

function SectionLabel({ emoji, label }: { emoji: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span>{emoji}</span>
      <span className="text-sm font-bold text-[#2A3C2C] tracking-wide">{label}</span>
      <div className="flex-1 h-px bg-gradient-to-r from-[#A0C8A0]/50 to-transparent" />
    </div>
  );
}

function Divider() {
  return (
    <div className="flex items-center gap-2 py-1">
      <div className="flex-1 h-px bg-[#CCE5CC]/60" />
      <span className="text-[10px] text-[#CCE5CC]">💍</span>
      <div className="flex-1 h-px bg-[#CCE5CC]/60" />
    </div>
  );
}

function GiftRow({
  label, color, amt, cnt, bold,
}: {
  label: string; color: string; amt: number; cnt: number; bold?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-1 h-9 rounded-full" style={{ backgroundColor: color }} />
      <span
        className={`text-sm flex-1 ${bold ? "font-bold" : "font-medium"}`}
        style={{ color }}
      >
        {label}
      </span>
      <span className="text-xs text-[#8FAA90]">{cnt}명</span>
      <span className={`text-base font-bold`} style={{ color }}>
        {fmt(amt)}원
      </span>
    </div>
  );
}

function ExpRow({ label, sub, amt }: { label: string; sub?: string; amt: number }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium text-[#567060]">{label}</p>
        {sub && <p className="text-xs text-[#8FAA90]">{sub}</p>}
      </div>
      <p className="font-bold text-[#2A3C2C]">{fmt(amt)}원</p>
    </div>
  );
}

function SideCard({
  label, color, gift, meal, venue, extra, expense, net,
}: {
  label: string; color: string;
  gift: number; meal: number; venue: number; extra: number;
  expense: number; net: number;
}) {
  const isPlus = net >= 0;
  return (
    <div
      className="rounded-2xl p-4 border"
      style={{
        backgroundColor: `${color}0d`,
        borderColor: `${color}30`,
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="font-bold text-sm" style={{ color }}>
          {label}
        </span>
        <div className="text-right">
          <p className="text-xs text-[#8FAA90]">손익</p>
          <p
            className="text-lg font-bold"
            style={{ color: isPlus ? "#27AE60" : "#E74C3C" }}
          >
            {isPlus ? "+" : ""}
            {fmt(net)}원
          </p>
        </div>
      </div>
      <div className="flex gap-2 mb-3">
        <div className="flex-1 rounded-xl p-2 bg-gray-50">
          <p className="text-[10px] text-[#8FAA90]">💰 축의금</p>
          <p className="text-sm font-bold text-[#2A3C2C]">{fmt(gift)}원</p>
        </div>
        <div className="flex items-center text-[#8FAA90] text-lg">−</div>
        <div
          className="flex-1 rounded-xl p-2"
          style={{ backgroundColor: `${color}1a` }}
        >
          <p className="text-[10px]" style={{ color: `${color}aa` }}>
            💸 부담
          </p>
          <p className="text-sm font-bold" style={{ color }}>
            {fmt(expense)}원
          </p>
        </div>
      </div>
      <div className="space-y-1">
        <DetailRow label="식대" amt={meal} color={color} />
        {venue > 0 && <DetailRow label="대관료" amt={venue} color={color} />}
        {extra > 0 && <DetailRow label="부대비용" amt={extra} color={color} />}
      </div>
    </div>
  );
}

function DetailRow({ label, amt, color }: { label: string; amt: number; color: string }) {
  return (
    <div className="flex items-center justify-between text-xs pl-1">
      <div className="flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full opacity-50" style={{ backgroundColor: color }} />
        <span className="text-[#8FAA90]">{label}</span>
      </div>
      <span className="text-[#567060] font-medium">{fmt(amt)}원</span>
    </div>
  );
}
