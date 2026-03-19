"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { checkPayments } from "@/utils/stellar";

const STARS = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  width: ((i * 37 + 13) % 25 + 5) / 10,
  height: ((i * 53 + 7) % 25 + 5) / 10,
  top: ((i * 71 + 19) % 1000) / 10,
  left: ((i * 43 + 29) % 1000) / 10,
  duration: 2 + ((i * 31) % 30) / 10,
  delay: ((i * 67) % 40) / 10,
}));

export default function PaymentPage() {
  const params = useSearchParams();
  const amount = params.get("amount");

  if (!amount || parseFloat(amount) <= 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Invalid Amount
      </div>
    );
  }

  const network = params.get("network") || "testnet";

  const merchantWallet =
    "GBJOJYGFEIVNMQAY5Q4NQ5OF6MB5GI4JIRE6VCZ66JDU4RSJZTT7FL2B";

  const [status, setStatus] = useState("waiting");
  const [transactions, setTransactions] = useState([]);
  const [processed, setProcessed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [dots, setDots] = useState(".");

  // Animated dots
  useEffect(() => {
    if (status !== "waiting") return;
    const t = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "." : d + "."));
    }, 600);
    return () => clearInterval(t);
  }, [status]);

  // Payment detection
  useEffect(() => {
    const interval = setInterval(async () => {
      const payments = await checkPayments(merchantWallet);

      const match = payments.find(
        (p) =>
          p.type === "payment" &&
          p.to === merchantWallet &&
          parseFloat(p.amount) === parseFloat(amount)
      );

      const lastHash = localStorage.getItem("lastTxHash");

      if (match && !processed && match.id !== lastHash) {
        setStatus("success");
        setProcessed(true);

        localStorage.setItem("lastTxHash", match.id);

        setTransactions((prev) => [
          ...prev,
          {
            amount: match.amount,
            hash: match.id,
            date: new Date().toLocaleString(),
          },
        ]);

        clearInterval(interval);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [amount, processed]);

  const copyWallet = () => {
    navigator.clipboard.writeText(merchantWallet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

      <div className="relative w-full max-w-sm rounded-3xl p-8 backdrop-blur-xl"
        style={{
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >

        {/* Header */}
        <h1 className="text-center text-xl font-extrabold mb-1 text-white">
          Payment Request
        </h1>

        <p className="text-center text-xs text-gray-400 mb-2">
          {network} · Stellar Network
        </p>

        <p className="text-center text-[10px] text-yellow-400 mb-4">
          ⚠️ Use Stellar Testnet only (no real money)
        </p>

        {/* Amount */}
        <div className="flex items-center justify-center gap-2 rounded-2xl py-3 mb-5 bg-gray-800">
          <span className="text-2xl font-bold text-white">{amount}</span>
          <span className="text-xs bg-blue-500 px-2 py-1 rounded">XLM</span>
        </div>

        {/* Wallet */}
        <label className="text-xs text-blue-400 mb-2 block">Send To</label>

        <button
          onClick={copyWallet}
          className="w-full bg-gray-800 p-3 rounded mb-5 text-xs break-all text-left"
        >
          {merchantWallet}
          <div className="text-right text-xs mt-1">
            {copied ? "✓ Copied!" : "Tap to copy"}
          </div>
        </button>

        {/* Status */}
        <div className="text-center mb-5">
          {status === "waiting" ? (
            <p className="text-gray-400">
              Checking Blockchain{dots}
            </p>
          ) : (
            <p className="text-green-400 font-bold">
              🎉 Payment Successful
            </p>
          )}
        </div>

        {/* Transactions */}
        {transactions.length > 0 && (
          <div className="mb-5">
            <p className="text-xs text-gray-400 mb-2">
              Total Transactions: {transactions.length}
            </p>

            {transactions.map((tx, i) => (
              <div key={i} className="bg-green-900 p-3 rounded mb-2">
                <p>{tx.amount} XLM</p>
                <p className="text-xs">{tx.date}</p>
                <p className="text-xs break-all">{tx.hash}</p>
              </div>
            ))}
          </div>
        )}

        {/* Button */}
        <button
          onClick={() => (window.location.href = "/")}
          className="w-full bg-gradient-to-r from-blue-400 to-purple-400 py-3 rounded"
        >
          ← New Payment
        </button>
      </div>

      <style>{`
        @keyframes twinkle {
          0%,100% { opacity: .1 }
          50% { opacity: .7 }
        }
      `}</style>
    </div>
  );
}