"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { sendPayment } from "@/utils/freighter";
import { Suspense } from "react";

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center",
        background:"#04040a", color:"rgba(148,163,184,0.7)",
        fontFamily:"'JetBrains Mono', monospace", fontSize:13, letterSpacing:1
      }}>
        LOADING…
      </div>
    }>
      <PaymentPageContent />
    </Suspense>
  );
}

const STARS = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  width:    ((i * 37 + 13) % 25 + 5) / 10,
  height:   ((i * 53 +  7) % 25 + 5) / 10,
  top:      ((i * 71 + 19) % 1000) / 10,
  left:     ((i * 43 + 29) % 1000) / 10,
  duration: 2 + ((i * 31) % 30) / 10,
  delay:    ((i * 67) % 40) / 10,
}));

function PaymentPageContent() {
  const params   = useSearchParams();
  const amount   = params.get("amount");
  const network  = params.get("network") || "testnet";
  const wallet   = params.get("wallet");

  const merchantWallet = "GBJOJYGFEIVNMQAY5Q4NQ5OF6MB5GI4JIRE6VCZ66JDU4RSJZTT7FL2B";

  const [status,  setStatus]  = useState("waiting");
  const [txHash,  setTxHash]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied,  setCopied]  = useState(false);
  const [dots,    setDots]    = useState(".");

  useEffect(() => {
    if (status !== "waiting") return;
    const t = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "." : d + "."));
    }, 600);
    return () => clearInterval(t);
  }, [status]);

  if (!amount || parseFloat(amount) <= 0) {
    return (
      <div style={{
        minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center",
        background:"#04040a", color:"#f87171", fontFamily:"'Syne', sans-serif", fontSize:16
      }}>
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
    if (!wallet) { alert("Connect wallet first"); return; }
    setLoading(true);
    try {
      const res = await sendPayment({ source: wallet, destination: merchantWallet, amount, network });
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

  const shortMerchant = `${merchantWallet.slice(0, 8)}…${merchantWallet.slice(-6)}`;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #04040a; min-height: 100vh; }

        @keyframes twinkle {
          0%   { opacity: 0.1; transform: scale(1); }
          50%  { opacity: 0.75; transform: scale(1.3); }
          100% { opacity: 0.1; transform: scale(1); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes orb-drift {
          0%   { transform: translate(0, 0) scale(1); }
          33%  { transform: translate(28px, -18px) scale(1.05); }
          66%  { transform: translate(-14px, 14px) scale(0.95); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes scanline {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(500%); }
        }
        @keyframes pulse-ring {
          0%   { box-shadow: 0 0 0 0   rgba(74,222,128,0.4); }
          70%  { box-shadow: 0 0 0 14px rgba(74,222,128,0); }
          100% { box-shadow: 0 0 0 0   rgba(74,222,128,0); }
        }
        @keyframes pulse-ring-err {
          0%   { box-shadow: 0 0 0 0   rgba(248,113,113,0.4); }
          70%  { box-shadow: 0 0 0 14px rgba(248,113,113,0); }
          100% { box-shadow: 0 0 0 0   rgba(248,113,113,0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes amount-glow {
          0%, 100% { text-shadow: 0 0 20px rgba(99,179,237,0.3); }
          50%       { text-shadow: 0 0 40px rgba(99,179,237,0.6); }
        }

        .stars-bg {
          position: fixed; inset: 0; z-index: 0; overflow: hidden; background: #04040a;
        }
        .star {
          position: absolute; border-radius: 50%; background: white;
        }
        .orb {
          position: absolute; border-radius: 50%; filter: blur(90px);
          animation: orb-drift 14s ease-in-out infinite; pointer-events: none;
        }

        .page {
          position: relative; z-index: 1; min-height: 100vh;
          display: flex; align-items: center; justify-content: center;
          padding: 24px; font-family: 'Syne', sans-serif;
        }

        /* ── Card ─────────────────────────────────────────── */
        .card {
          background: rgba(8, 10, 20, 0.94);
          border: 1px solid rgba(99,179,237,0.15);
          border-radius: 28px;
          width: 100%; max-width: 400px;
          box-shadow:
            0 40px 80px rgba(0,0,0,0.9),
            0 0 0 1px rgba(255,255,255,0.03),
            inset 0 0 80px rgba(30,60,140,0.05);
          animation: fadeSlideUp 0.5s ease forwards;
          overflow: hidden; position: relative;
        }
        .card::after {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 60px;
          background: linear-gradient(to bottom, rgba(99,179,237,0.03), transparent);
          animation: scanline 8s linear infinite; pointer-events: none; z-index: 0;
        }

        /* ── Header ───────────────────────────────────────── */
        .card-header {
          padding: 26px 28px 18px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          position: relative; z-index: 1;
          background: linear-gradient(180deg, rgba(20,40,100,0.12) 0%, transparent 100%);
          display: flex; align-items: center; justify-content: space-between;
        }
        .header-left { display: flex; align-items: center; gap: 10px; }
        .logo-icon {
          width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
          background: linear-gradient(135deg, rgba(30,80,200,0.6), rgba(60,20,140,0.5));
          border: 1px solid rgba(99,179,237,0.3);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 16px rgba(30,80,200,0.4);
        }
        .terminal-label {
          font-family: 'JetBrains Mono', monospace; font-size: 9px;
          color: rgba(99,179,237,0.6); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 1px;
        }
        .card-title {
          font-size: 17px; font-weight: 800;
          background: linear-gradient(90deg, #e2e8f0, #94a3b8);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; line-height: 1;
        }
        .network-pill {
          display: flex; align-items: center; gap: 5px;
          background: rgba(99,179,237,0.08); border: 1px solid rgba(99,179,237,0.2);
          border-radius: 20px; padding: 4px 10px;
          font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #93c5fd;
          text-transform: capitalize;
        }
        .network-dot {
          width: 5px; height: 5px; border-radius: 50%; background: #63b3ed;
          animation: twinkle 1.5s infinite;
        }

        /* ── Body ─────────────────────────────────────────── */
        .card-body {
          padding: 24px 28px 28px; position: relative; z-index: 1;
          display: flex; flex-direction: column; gap: 18px;
        }

        /* ── Amount display ───────────────────────────────── */
        .amount-display {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(99,179,237,0.12);
          border-radius: 16px; padding: 20px 20px;
          display: flex; flex-direction: column; align-items: center; gap: 6px;
        }
        .amount-label {
          font-family: 'JetBrains Mono', monospace; font-size: 10px;
          color: rgba(148,163,184,0.5); letter-spacing: 2px; text-transform: uppercase;
        }
        .amount-row-display {
          display: flex; align-items: baseline; gap: 10px;
        }
        .amount-number {
          font-size: 42px; font-weight: 800; color: #f1f5f9;
          font-family: 'JetBrains Mono', monospace; line-height: 1;
          animation: amount-glow 3s ease-in-out infinite;
        }
        .amount-currency {
          font-size: 13px; font-weight: 700; color: #93c5fd;
          font-family: 'JetBrains Mono', monospace;
          background: rgba(37,99,235,0.25); border: 1px solid rgba(99,179,237,0.25);
          border-radius: 6px; padding: 4px 10px; letter-spacing: 1px;
        }
        .testnet-warning {
          font-size: 10px; color: rgba(251,191,36,0.7);
          font-family: 'JetBrains Mono', monospace; letter-spacing: 0.5px;
          display: flex; align-items: center; gap: 4px;
        }

        /* ── Send to section ──────────────────────────────── */
        .section-label {
          font-size: 11px; font-weight: 600; color: rgba(148,163,184,0.6);
          text-transform: uppercase; letter-spacing: 1.5px;
          font-family: 'JetBrains Mono', monospace; margin-bottom: -8px;
        }

        .wallet-copy-btn {
          width: 100%; background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px; padding: 12px 14px;
          cursor: pointer; text-align: left; transition: all 0.2s;
          display: flex; align-items: center; justify-content: space-between; gap: 10px;
        }
        .wallet-copy-btn:hover {
          background: rgba(99,179,237,0.05); border-color: rgba(99,179,237,0.25);
        }
        .wallet-address-text {
          font-family: 'JetBrains Mono', monospace; font-size: 11px;
          color: rgba(203,213,225,0.8); word-break: break-all; line-height: 1.5;
          flex: 1;
        }
        .copy-indicator {
          flex-shrink: 0; font-size: 10px; font-family: 'JetBrains Mono', monospace;
          padding: 4px 8px; border-radius: 6px; transition: all 0.2s;
          background: rgba(99,179,237,0.08); border: 1px solid rgba(99,179,237,0.2);
          color: #63b3ed; white-space: nowrap;
        }
        .copy-indicator.copied {
          background: rgba(74,222,128,0.1); border-color: rgba(74,222,128,0.3);
          color: #4ade80;
        }

        /* ── Divider ──────────────────────────────────────── */
        .section-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
        }

        /* ── Pay button ───────────────────────────────────── */
        .btn-pay {
          width: 100%; padding: 14px; border-radius: 12px;
          background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
          border: 1px solid rgba(74,222,128,0.3);
          color: #fff; font-size: 14px; font-weight: 700;
          font-family: 'Syne', sans-serif; letter-spacing: 0.4px;
          cursor: pointer; transition: all 0.2s;
          box-shadow: 0 8px 24px rgba(22,163,74,0.35);
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .btn-pay:hover:not(:disabled) {
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
          box-shadow: 0 12px 32px rgba(22,163,74,0.5); transform: translateY(-1px);
        }
        .btn-pay:disabled { opacity: 0.45; cursor: not-allowed; }

        /* ── Status area ──────────────────────────────────── */
        .status-box {
          border-radius: 12px; padding: 14px 16px;
          display: flex; align-items: center; gap: 12px;
        }
        .status-box.waiting {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
        }
        .status-box.success {
          background: rgba(74,222,128,0.06);
          border: 1px solid rgba(74,222,128,0.2);
          animation: pulse-ring 2s ease-out;
        }
        .status-box.error {
          background: rgba(248,113,113,0.06);
          border: 1px solid rgba(248,113,113,0.2);
          animation: pulse-ring-err 2s ease-out;
        }

        .status-icon {
          width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center; font-size: 14px;
        }
        .status-icon.waiting { background: rgba(148,163,184,0.08); }
        .status-icon.success { background: rgba(74,222,128,0.12); }
        .status-icon.error   { background: rgba(248,113,113,0.12); }

        .status-text-group { display: flex; flex-direction: column; gap: 2px; }
        .status-title {
          font-size: 13px; font-weight: 700;
        }
        .status-title.waiting { color: rgba(148,163,184,0.7); }
        .status-title.success { color: #4ade80; }
        .status-title.error   { color: #f87171; }

        .status-sub {
          font-size: 11px; color: rgba(148,163,184,0.4);
          font-family: 'JetBrains Mono', monospace;
        }

        /* ── TX Hash link ─────────────────────────────────── */
        .tx-link {
          display: flex; align-items: center; justify-content: center; gap: 6px;
          background: rgba(99,179,237,0.05); border: 1px solid rgba(99,179,237,0.15);
          border-radius: 10px; padding: 10px 14px;
          text-decoration: none; transition: all 0.2s;
        }
        .tx-link:hover {
          background: rgba(99,179,237,0.1); border-color: rgba(99,179,237,0.3);
        }
        .tx-link-text {
          font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #63b3ed;
          letter-spacing: 0.5px;
        }

        /* ── Back button ──────────────────────────────────── */
        .btn-back {
          width: 100%; padding: 13px; border-radius: 12px;
          background: linear-gradient(135deg, #1d4ed8 0%, #4338ca 100%);
          border: 1px solid rgba(99,179,237,0.3);
          color: #fff; font-size: 14px; font-weight: 700;
          font-family: 'Syne', sans-serif; letter-spacing: 0.4px;
          cursor: pointer; transition: all 0.2s;
          box-shadow: 0 8px 24px rgba(29,78,216,0.35);
        }
        .btn-back:hover {
          box-shadow: 0 12px 32px rgba(29,78,216,0.5); transform: translateY(-1px);
        }

        .spinner {
          display: inline-block; animation: spin 0.8s linear infinite;
        }
      `}</style>

      {/* Starfield */}
      <div className="stars-bg" aria-hidden="true">
        {STARS.map((s) => (
          <div key={s.id} className="star" style={{
            width: `${s.width}px`, height: `${s.height}px`,
            top: `${s.top}%`, left: `${s.left}%`,
            animation: `twinkle ${s.duration}s ${s.delay}s infinite`,
          }} />
        ))}
        <div className="orb" style={{ width:480, height:480, top:'-15%', left:'-12%', background:'rgba(29,78,216,0.18)' }} />
        <div className="orb" style={{ width:320, height:320, bottom:'0%', right:'-6%', background:'rgba(67,56,202,0.14)', animationDelay:'5s' }} />
      </div>

      <div className="page">
        <div className="card">

          {/* Header */}
          <div className="card-header">
            <div className="header-left">
              <div className="logo-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#93c5fd">
                  <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17 5.8 21.3l2.4-7.4L2 9.4h7.6z"/>
                </svg>
              </div>
              <div>
                <div className="terminal-label">Payment Request</div>
                <div className="card-title">Stellar Merchant</div>
              </div>
            </div>
            <div className="network-pill">
              <span className="network-dot" />
              {network}
            </div>
          </div>

          {/* Body */}
          <div className="card-body">

            {/* Amount */}
            <div className="amount-display">
              <span className="amount-label">Amount Due</span>
              <div className="amount-row-display">
                <span className="amount-number">{amount}</span>
                <span className="amount-currency">XLM</span>
              </div>
              <span className="testnet-warning">⚠ Use Stellar Testnet only — no real funds</span>
            </div>

            <div className="section-divider" />

            {/* Send To */}
            <span className="section-label">Send To</span>
            <button className="wallet-copy-btn" onClick={copyWallet}>
              <span className="wallet-address-text">{merchantWallet}</span>
              <span className={`copy-indicator${copied ? " copied" : ""}`}>
                {copied ? "✓ Copied" : "Copy"}
              </span>
            </button>

            <div className="section-divider" />

            {/* Pay Button */}
            {status === "waiting" && (
              <button className="btn-pay" onClick={handlePay} disabled={loading}>
                {loading ? (
                  <>
                    <svg className="spinner" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                    </svg>
                    Processing…
                  </>
                ) : (
                  <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                      <path d="M15 9H9v6h6V9zM9 9l-3-3M15 9l3-3M9 15l-3 3M15 15l3 3"/>
                    </svg>
                    Pay via Freighter
                  </>
                )}
              </button>
            )}

            {/* Status */}
            <div className={`status-box ${status}`}>
              <div className={`status-icon ${status}`}>
                {status === "waiting" && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(148,163,184,0.6)" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                  </svg>
                )}
                {status === "success" && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                )}
                {status === "error" && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2.5">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                )}
              </div>
              <div className="status-text-group">
                <span className={`status-title ${status}`}>
                  {status === "waiting" && `Awaiting payment${dots}`}
                  {status === "success" && "Payment Successful"}
                  {status === "error"   && "Payment Failed"}
                </span>
                <span className="status-sub">
                  {status === "waiting" && "Confirm transaction in Freighter"}
                  {status === "success" && "Transaction confirmed on-chain"}
                  {status === "error"   && "Check wallet & try again"}
                </span>
              </div>
            </div>

            {/* TX Hash */}
            {txHash && (
              <a
                href={`https://stellar.expert/explorer/${network}/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="tx-link"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#63b3ed" strokeWidth="2">
                  <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
                </svg>
                <span className="tx-link-text">View On-Chain Proof →</span>
              </a>
            )}

            {/* Back */}
            <button className="btn-back" onClick={() => (window.location.href = "/")}>
              ← New Payment
            </button>

          </div>
        </div>
      </div>
    </>
  );
}