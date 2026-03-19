"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STARS = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  width: ((i * 37 + 13) % 25 + 5) / 10,
  height: ((i * 53 + 7) % 25 + 5) / 10,
  top: ((i * 71 + 19) % 1000) / 10,
  left: ((i * 43 + 29) % 1000) / 10,
  duration: 2 + ((i * 31) % 30) / 10,
  delay: ((i * 67) % 40) / 10,
}));

export default function Home() {
  const [amount, setAmount] = useState("");
  const [network, setNetwork] = useState("testnet");
  const router = useRouter();

  const networks = [
    { id: "testnet", label: "Testnet" },
    { id: "mainnet",label: "Mainnet" },
    { id: "futurenet", label: "Futurenet" },
  ];

  const handlePayment = () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert("Enter valid amount");
      return;
    }
    router.push(`/payment?amount=${amount}&network=${network}`);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "#0a0a14", fontFamily: "'Space Grotesk', sans-serif" }}
    >
      {/* Stars */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {STARS.map((s) => (
          <div
            key={s.id}
            className="absolute rounded-full bg-white"
            style={{
              width: `${s.width}px`,
              height: `${s.height}px`,
              top: `${s.top}%`,
              left: `${s.left}%`,
              opacity: 0.2,
              animation: `twinkle ${s.duration}s ${s.delay}s infinite`,
            }}
          />
        ))}
      </div>

      <div
        className="relative w-full max-w-sm rounded-3xl p-8 backdrop-blur-xl"
        style={{
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        {/* Glow */}
        <div
          className="absolute -top-16 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(99,211,255,0.25) 0%, transparent 70%)",
          }}
        />

        {/* Logo */}
        <div
          className="mx-auto mb-5 w-12 h-12 rounded-full flex items-center justify-center"
          style={{
            border: "1px solid rgba(99,211,255,0.4)",
            background: "rgba(99,211,255,0.08)",
          }}
        >
          <svg width="22" height="22" viewBox="0 0 28 28">
            <path
              d="M14 2L16.5 10H25L18.5 15L21 23L14 18L7 23L9.5 15L3 10H11.5L14 2Z"
              fill="rgba(99,211,255,0.9)"
            />
          </svg>
        </div>

        <h1
          className="text-center text-xl font-extrabold mb-1"
          style={{ fontFamily: "'Syne', sans-serif", color: "#f0f4ff" }}
        >
          Stellar Merchant
        </h1>

        <p className="text-center text-xs text-gray-400 mb-2">
          Point of Sale Terminal
        </p>

        <p className="text-center text-[10px] text-yellow-400 mb-6">
          Use Stellar Testnet only (no real money)
        </p>

        {/* Amount */}
        <label className="text-xs text-blue-400 mb-2 block">Amount</label>

        <div className="relative mb-5">
          <input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-2xl px-4 py-3 pr-16 text-lg outline-none"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#f0f4ff",
            }}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs bg-blue-500 px-2 py-1 rounded">
            XLM
          </span>
        </div>

        {/* Network */}
        <label className="text-xs text-blue-400 mb-2 block">Network</label>

        <div className="grid grid-cols-3 gap-2 mb-5">
          {networks.map((n) => (
            <button
              key={n.id}
              onClick={() => setNetwork(n.id)}
              className="rounded-xl py-2"
              style={{
                background:
                  network === n.id
                    ? "rgba(99,211,255,0.07)"
                    : "rgba(255,255,255,0.04)",
                border: `1px solid ${
                  network === n.id
                    ? "rgba(99,211,255,0.45)"
                    : "rgba(255,255,255,0.08)"
                }`,
              }}
            >
              <span className="block">{n.icon}</span>
              <span className="text-xs">{n.label}</span>
            </button>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={handlePayment}
          className="w-full py-3.5 rounded-2xl font-bold transition hover:scale-105"
          style={{
            background:
              "linear-gradient(135deg, #63d3ff 0%, #a78bfa 100%)",
            color: "#08091a",
          }}
        >
           Generate Payment
        </button>

        {/* Footer */}
        <div className="flex justify-between mt-4 pt-3 text-xs border-t border-gray-700">
          <span className="text-gray-400">Network fee</span>
          <span className="text-blue-400">~0.00001 XLM</span>
        </div>
      </div>

      <style>{`
        @keyframes twinkle { 0%,100%{opacity:.1} 50%{opacity:.7} }
      `}</style>
    </div>
  );
}