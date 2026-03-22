"use client";


import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { sendPayment } from "@/utils/freighter";
import { Suspense } from "react";

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="text-white">Loading...</div>}>
      <PaymentPageContent />
    </Suspense>
  );
}
const STARS = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  width: ((i * 37 + 13) % 25 + 5) / 10,
  height: ((i * 53 + 7) % 25 + 5) / 10,
  top: ((i * 71 + 19) % 1000) / 10,
  left: ((i * 43 + 29) % 1000) / 10,
  duration: 2 + ((i * 31) % 30) / 10,
  delay: ((i * 67) % 40) / 10,
}));

function PaymentPageContent() {
  const params = useSearchParams();

  const amount = params.get("amount");
  const network = params.get("network") || "testnet";
  const wallet = params.get("wallet");

  const merchantWallet =
    "GBJOJYGFEIVNMQAY5Q4NQ5OF6MB5GI4JIRE6VCZ66JDU4RSJZTT7FL2B";

  const [status, setStatus] = useState("waiting");
  const [txHash, setTxHash] = useState(null);
  const [loading, setLoading] = useState(false);
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

  if (!amount || parseFloat(amount) <= 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Invalid Amount
      </div>
    );
  }

  const copyWallet = () => {
    navigator.clipboard.writeText(merchantWallet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePay = async () => {
    if (!wallet) {
      alert("Connect wallet first");
      return;
    }

    setLoading(true);

    try {
      const res = await sendPayment({
        source: wallet,
        destination: merchantWallet,
        amount,
        network,
      });

      setTxHash(res.hash);
      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
      alert("Payment failed");
    } finally {
      setLoading(false);
    }
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
        {/* Header */}
        <h1 className="text-center text-xl font-extrabold mb-1 text-white">
          Payment Request
        </h1>

        <p className="text-center text-xs text-gray-400 mb-2">
          {network} · Stellar Network
        </p>

        <p className="text-center text-[10px] text-yellow-400 mb-4">
          ⚠️ Use Stellar Testnet only
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
          className="w-full bg-gray-800 p-3 rounded mb-2 text-xs break-all text-left"
        >
          {merchantWallet}
          <div className="text-right text-xs mt-1">
            {copied ? "✓ Copied!" : "Tap to copy"}
          </div>
        </button>

        {/* PAY BUTTON */}
        {status === "waiting" && (
          <button
            onClick={handlePay}
            disabled={loading}
            className="w-full bg-green-500 py-3 rounded mb-3"
          >
            {loading ? "Processing..." : "Pay via Freighter"}
          </button>
        )}

        {/* STATUS */}
        <div className="text-center mb-3">
          {status === "waiting" && (
            <p className="text-gray-400">⏳ Waiting{dots}</p>
          )}

          {status === "success" && (
            <p className="text-green-400 font-bold">
              🎉 Payment Successful
            </p>
          )}

          {status === "error" && (
            <p className="text-red-400">
              ❌ Payment Failed
            </p>
          )}
        </div>

        {/* TX HASH */}
        {txHash && (
          <a
            href={`https://stellar.expert/explorer/${network}/tx/${txHash}`}
            target="_blank"
            className="text-blue-400 underline text-xs block text-center mt-2"
          >
            🔗 View On-Chain Proof
          </a>
        )}

        {/* Back */}
        <button
          onClick={() => (window.location.href = "/")}
          className="w-full mt-4 bg-gradient-to-r from-blue-400 to-purple-400 py-3 rounded"
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