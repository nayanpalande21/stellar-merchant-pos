"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { connectWallet, sendPayment } from "@/utils/freighter";
import { accountExists } from "@/utils/stellar";


const MERCHANT_WALLET =
  "GBJOJYGFEIVNMQAY5Q4NQ5OF6MB5GI4JIRE6VCZ66JDU4RSJZTT7FL2B";

const NETWORKS = [
  { id: "testnet",   label: "Testnet"   },
  { id: "mainnet",   label: "Mainnet"   },
  { id: "futurenet", label: "Futurenet" },
];

const STARS = [
  { top: "8%",  left: "12%", size: 2,   delay: 0   },
  { top: "15%", left: "75%", size: 1.5, delay: 0.8 },
  { top: "22%", left: "88%", size: 1,   delay: 1.5 },
  { top: "35%", left: "5%",  size: 2.5, delay: 0.3 },
  { top: "50%", left: "92%", size: 1,   delay: 2.1 },
  { top: "65%", left: "18%", size: 1.5, delay: 1.1 },
  { top: "78%", left: "60%", size: 1,   delay: 0.6 },
  { top: "85%", left: "80%", size: 2,   delay: 1.7 },
  { top: "92%", left: "30%", size: 1,   delay: 2.4 },
  { top: "5%",  left: "45%", size: 1.5, delay: 0.9 },
  { top: "42%", left: "50%", size: 1,   delay: 1.3 },
  { top: "60%", left: "38%", size: 2,   delay: 0.5 },
];

export default function Home() {
  const [amount,  setAmount]  = useState("");
  const [network, setNetwork] = useState("testnet");
  const [wallet,  setWallet]  = useState(null);
  const [paying,  setPaying]  = useState(false);
  const [started, setStarted] = useState(false);

  const router = useRouter();

  // ── Generate Payment Page ─────────────────────────────────
  const handleGeneratePayment = () => {
    const val = parseFloat(amount);
    if (!amount || isNaN(val) || val < 1 || val > 1000) {
      alert("Enter a valid amount between 1 and 1000 XLM");
      return;
    }
    if (!wallet) {
      alert("Connect your Freighter wallet first");
      return;
    }
    router.push(`/payment?amount=${amount}&network=${network}&wallet=${wallet}`);
  };

  // ── Direct Pay via Freighter ──────────────────────────────
  const handleDirectPay = async () => {
    if (!wallet) return alert("Connect your Freighter wallet first");

    const val = parseFloat(amount);
    if (!amount || isNaN(val) || val < 1 || val > 1000) {
      return alert("Enter a valid amount between 1 and 1000 XLM");
    }

    setPaying(true);
    try {
      const res = await sendPayment({
        source: wallet,
        destination: MERCHANT_WALLET,
        amount,
        network,
      });
      alert(`✅ Payment sent!\nTX Hash: ${res.hash}`);
    } catch (err) {
      console.error(err);
      alert("❌ " + (err?.message || "Payment failed"));
    } finally {
      setPaying(false);
    }
  };

  if (!started) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: #04040a; min-height: 100vh; }

          @keyframes twinkle {
            0%   { opacity: 0.15; transform: scale(1); }
            100% { opacity: 1;    transform: scale(1.4); }
          }
          @keyframes fadeSlideUp {
            from { opacity: 0; transform: translateY(24px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes pulseGlow {
            0%, 100% { box-shadow: 0 0 20px rgba(99,179,237,0.2), 0 0 60px rgba(99,179,237,0.05); }
            50%       { box-shadow: 0 0 30px rgba(99,179,237,0.4), 0 0 80px rgba(99,179,237,0.15); }
          }
          @keyframes orb-drift {
            0%   { transform: translate(0, 0) scale(1); }
            33%  { transform: translate(30px, -20px) scale(1.05); }
            66%  { transform: translate(-15px, 15px) scale(0.95); }
            100% { transform: translate(0, 0) scale(1); }
          }

          .stars-bg {
            position: fixed; inset: 0; z-index: 0; overflow: hidden; background: #04040a;
          }
          .star {
            position: absolute; background: white; border-radius: 50%;
            animation: twinkle 3s infinite alternate;
          }
          .orb {
            position: absolute; border-radius: 50%; filter: blur(80px);
            animation: orb-drift 12s ease-in-out infinite;
            pointer-events: none;
          }

          .page-center {
            position: relative; z-index: 1; min-height: 100vh;
            display: flex; align-items: center; justify-content: center;
            padding: 24px; font-family: 'Syne', sans-serif;
          }

          .onboard-card {
            background: rgba(10, 12, 22, 0.92);
            border: 1px solid rgba(99,179,237,0.15);
            border-radius: 24px;
            padding: 40px 36px;
            width: 100%; max-width: 400px;
            animation: fadeSlideUp 0.6s ease forwards;
            animation: pulseGlow 4s ease-in-out infinite;
            box-shadow: 0 32px 64px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.06);
            position: relative; overflow: hidden;
          }
          .onboard-card::before {
            content: '';
            position: absolute; top: 0; left: 0; right: 0; height: 1px;
            background: linear-gradient(90deg, transparent, rgba(99,179,237,0.5), transparent);
          }

          .onboard-badge {
            display: inline-flex; align-items: center; gap: 6px;
            background: rgba(99,179,237,0.1); border: 1px solid rgba(99,179,237,0.25);
            border-radius: 20px; padding: 4px 12px; margin-bottom: 24px;
            font-size: 11px; font-family: 'JetBrains Mono', monospace;
            color: #63b3ed; letter-spacing: 0.5px; text-transform: uppercase;
          }
          .onboard-badge-dot {
            width: 6px; height: 6px; border-radius: 50%; background: #63b3ed;
            animation: twinkle 1.5s ease-in-out infinite alternate;
          }

          .onboard-title {
            font-size: 26px; font-weight: 800; color: #fff;
            line-height: 1.15; margin-bottom: 8px;
            background: linear-gradient(135deg, #e2e8f0 0%, #94a3b8 100%);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          }
          .onboard-sub {
            font-size: 13px; color: rgba(148,163,184,0.7); margin-bottom: 32px;
            font-weight: 400; line-height: 1.5;
          }

          .steps-list {
            list-style: none; display: flex; flex-direction: column; gap: 14px;
            margin-bottom: 32px;
          }
          .step-item {
            display: flex; align-items: flex-start; gap: 12px;
          }
          .step-num {
            width: 24px; height: 24px; border-radius: 6px; flex-shrink: 0;
            background: rgba(99,179,237,0.1); border: 1px solid rgba(99,179,237,0.25);
            display: flex; align-items: center; justify-content: center;
            font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #63b3ed;
          }
          .step-text {
            font-size: 13px; color: rgba(203,213,225,0.85); line-height: 1.5; padding-top: 2px;
          }

          .get-started-btn {
            width: 100%; padding: 14px;
            background: linear-gradient(135deg, #2d6ebb 0%, #1a3f75 100%);
            border: 1px solid rgba(99,179,237,0.35);
            border-radius: 12px; color: #fff;
            font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700;
            cursor: pointer; letter-spacing: 0.5px;
            transition: all 0.2s ease;
            box-shadow: 0 8px 24px rgba(45,110,187,0.35);
          }
          .get-started-btn:hover {
            background: linear-gradient(135deg, #3a7fd4 0%, #2054a0 100%);
            box-shadow: 0 12px 32px rgba(45,110,187,0.5);
            transform: translateY(-1px);
          }
        `}</style>

        <div className="stars-bg" aria-hidden="true">
          {STARS.map((s, i) => (
            <div key={i} className="star" style={{
              top: s.top, left: s.left,
              width: s.size, height: s.size,
              animationDelay: `${s.delay}s`,
              animationDuration: `${2 + s.delay}s`,
            }} />
          ))}
          <div className="orb" style={{ width: 400, height: 400, top: '-10%', left: '-10%', background: 'rgba(30,60,150,0.2)' }} />
          <div className="orb" style={{ width: 300, height: 300, bottom: '5%', right: '-5%', background: 'rgba(20,80,160,0.15)', animationDelay: '4s' }} />
        </div>

        <div className="page-center">
          <div className="onboard-card">
            <div className="onboard-badge">
              <span className="onboard-badge-dot" />
              Stellar Network
            </div>
            <h1 className="onboard-title">Accept Crypto<br />Payments Instantly</h1>
            <p className="onboard-sub">A point-of-sale terminal powered by the Stellar blockchain. No intermediaries, near-zero fees.</p>

            <ul className="steps-list">
              {[
                "Install the Freighter wallet extension",
                "Connect your wallet to this terminal",
                "Set amount & choose your network",
                "Generate a payment link or pay directly",
              ].map((text, i) => (
                <li key={i} className="step-item">
                  <span className="step-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="step-text">{text}</span>
                </li>
              ))}
            </ul>

            <button className="get-started-btn" onClick={() => setStarted(true)}>
              Launch Terminal →
            </button>
          </div>
        </div>
      </>
    );
  }

  // ── MAIN TERMINAL ────────────────────────────────────────
  const shortWallet = wallet ? `${wallet.slice(0, 6)}…${wallet.slice(-4)}` : null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #04040a; min-height: 100vh; }

        @keyframes twinkle {
          0%   { opacity: 0.15; transform: scale(1); }
          100% { opacity: 1;    transform: scale(1.4); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes scanline {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(400%); }
        }
        @keyframes orb-drift {
          0%   { transform: translate(0, 0) scale(1); }
          33%  { transform: translate(30px, -20px) scale(1.05); }
          66%  { transform: translate(-15px, 15px) scale(0.95); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes borderPulse {
          0%, 100% { border-color: rgba(99,179,237,0.2); }
          50%       { border-color: rgba(99,179,237,0.45); }
        }

        .stars-bg {
          position: fixed; inset: 0; z-index: 0; overflow: hidden; background: #04040a;
        }
        .star {
          position: absolute; background: white; border-radius: 50%;
          animation: twinkle 3s infinite alternate;
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

        /* ── Card ───────────────────────────────────────────── */
        .card {
          background: rgba(8, 10, 20, 0.94);
          border: 1px solid rgba(99,179,237,0.15);
          border-radius: 28px;
          padding: 0;
          width: 100%; max-width: 420px;
          box-shadow:
            0 40px 80px rgba(0,0,0,0.9),
            0 0 0 1px rgba(255,255,255,0.03),
            inset 0 0 80px rgba(30,60,140,0.06);
          animation: fadeSlideUp 0.5s ease forwards;
          overflow: hidden; position: relative;
        }

        /* scanline effect */
        .card::after {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 60px;
          background: linear-gradient(to bottom, rgba(99,179,237,0.04), transparent);
          animation: scanline 6s linear infinite; pointer-events: none; z-index: 0;
        }

        .card-header {
          padding: 28px 28px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          position: relative; z-index: 1;
          background: linear-gradient(180deg, rgba(20,40,100,0.15) 0%, transparent 100%);
        }

        .header-top {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 4px;
        }

        .logo-row {
          display: flex; align-items: center; gap: 10px;
        }

        .logo-icon {
          width: 36px; height: 36px; border-radius: 10px;
          background: linear-gradient(135deg, rgba(30,80,200,0.6), rgba(60,20,140,0.5));
          border: 1px solid rgba(99,179,237,0.3);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 16px rgba(30,80,200,0.4);
        }

        .terminal-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px; color: rgba(99,179,237,0.6);
          letter-spacing: 2px; text-transform: uppercase; margin-bottom: 1px;
        }

        .card-title {
          font-size: 18px; font-weight: 800;
          background: linear-gradient(90deg, #e2e8f0 0%, #94a3b8 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          line-height: 1;
        }

        .testnet-pill {
          display: flex; align-items: center; gap: 5px;
          background: rgba(251,191,36,0.08); border: 1px solid rgba(251,191,36,0.2);
          border-radius: 20px; padding: 4px 10px;
          font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #f6d860;
        }
        .testnet-dot {
          width: 5px; height: 5px; border-radius: 50%; background: #f6d860;
          animation: twinkle 1.5s infinite alternate;
        }

        .card-body {
          padding: 24px 28px 28px; position: relative; z-index: 1;
          display: flex; flex-direction: column; gap: 20px;
        }

        /* ── Wallet section ─────────────────────────────────── */
        .wallet-connect-btn {
          width: 100%; padding: 11px 16px;
          background: transparent;
          border: 1px solid rgba(99,179,237,0.22);
          border-radius: 10px;
          color: #63b3ed; font-size: 13px; font-weight: 600;
          font-family: 'Syne', sans-serif;
          cursor: pointer; transition: all 0.2s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .wallet-connect-btn:hover {
          background: rgba(99,179,237,0.06);
          border-color: rgba(99,179,237,0.4);
        }
        .wallet-connect-btn.connected {
          border-color: rgba(74,222,128,0.3);
          color: #4ade80;
        }

        .wallet-address-strip {
          display: flex; align-items: center; justify-content: space-between;
          background: rgba(74,222,128,0.05);
          border: 1px solid rgba(74,222,128,0.15);
          border-radius: 8px; padding: 8px 12px; margin-top: -10px;
        }
        .wallet-addr-label {
          font-size: 10px; color: rgba(74,222,128,0.6); text-transform: uppercase;
          letter-spacing: 1px; font-family: 'JetBrains Mono', monospace;
        }
        .wallet-addr-value {
          font-size: 11px; color: #4ade80;
          font-family: 'JetBrains Mono', monospace; letter-spacing: 0.5px;
        }

        /* ── Field group ────────────────────────────────────── */
        .field-group {
          display: flex; flex-direction: column; gap: 8px;
        }
        .field-label {
          font-size: 11px; font-weight: 600; color: rgba(148,163,184,0.7);
          text-transform: uppercase; letter-spacing: 1.5px;
          font-family: 'JetBrains Mono', monospace;
        }

        /* ── Amount input ───────────────────────────────────── */
        .amount-wrap {
          display: flex; align-items: center;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px; overflow: hidden;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .amount-wrap:focus-within {
          border-color: rgba(99,179,237,0.5);
          box-shadow: 0 0 0 3px rgba(99,179,237,0.08), inset 0 0 20px rgba(99,179,237,0.03);
        }
        .amount-input {
          flex: 1; background: transparent; border: none; outline: none;
          color: #f1f5f9; font-size: 22px; font-weight: 700;
          font-family: 'JetBrains Mono', monospace;
          padding: 14px 16px; width: 100%;
        }
        .amount-input::placeholder { color: rgba(255,255,255,0.15); font-size: 18px; }
        /* Remove browser spinners */
        .amount-input::-webkit-outer-spin-button,
        .amount-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        .amount-input[type=number] { -moz-appearance: textfield; }

        .amount-spinners {
          display: flex; flex-direction: column; padding: 0 6px; gap: 1px;
        }
        .spinner-btn {
          background: none; border: none; color: rgba(255,255,255,0.3);
          font-size: 9px; cursor: pointer; line-height: 1; padding: 3px 4px;
          transition: color 0.15s;
        }
        .spinner-btn:hover { color: rgba(99,179,237,0.9); }

        .xlm-badge {
          background: linear-gradient(135deg, rgba(37,99,235,0.7), rgba(79,70,229,0.6));
          color: #93c5fd; font-size: 12px; font-weight: 700;
          font-family: 'JetBrains Mono', monospace; letter-spacing: 1px;
          padding: 9px 16px; margin: 7px; border-radius: 7px;
          border: 1px solid rgba(99,165,237,0.2);
        }

        /* ── Network selector ───────────────────────────────── */
        .network-row {
          display: flex; gap: 8px; width: 100%;
        }
        .net-btn {
          flex: 1; padding: 10px 4px; border-radius: 10px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.07);
          color: rgba(148,163,184,0.6);
          font-size: 12px; font-weight: 600;
          font-family: 'Syne', sans-serif; letter-spacing: 0.3px;
          cursor: pointer; transition: all 0.18s;
        }
        .net-btn:hover {
          border-color: rgba(99,179,237,0.25);
          color: rgba(203,213,225,0.9);
          background: rgba(99,179,237,0.04);
        }
        .net-btn.active {
          background: rgba(37,99,235,0.15);
          border-color: rgba(99,179,237,0.45);
          color: #93c5fd;
          box-shadow: 0 0 12px rgba(99,179,237,0.1), inset 0 1px 0 rgba(99,179,237,0.15);
        }

        /* ── Divider ────────────────────────────────────────── */
        .section-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
          margin: 0;
        }

        /* ── Buttons ────────────────────────────────────────── */
        .btn-primary {
          width: 100%; padding: 14px; border-radius: 12px;
          background: linear-gradient(135deg, #1d4ed8 0%, #4338ca 100%);
          border: 1px solid rgba(99,179,237,0.3);
          color: #fff; font-size: 14px; font-weight: 700;
          font-family: 'Syne', sans-serif; letter-spacing: 0.4px;
          cursor: pointer; transition: all 0.2s;
          box-shadow: 0 8px 24px rgba(29,78,216,0.4);
          position: relative; overflow: hidden;
        }
        .btn-primary::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
          opacity: 0; transition: opacity 0.2s;
        }
        .btn-primary:hover::before { opacity: 1; }
        .btn-primary:hover { box-shadow: 0 12px 32px rgba(29,78,216,0.55); transform: translateY(-1px); }
        .btn-primary:active { transform: scale(0.99); }
        .btn-primary span { position: relative; z-index: 1; }

        .btn-secondary {
          width: 100%; padding: 13px; border-radius: 12px;
          background: rgba(74,222,128,0.05);
          border: 1px solid rgba(74,222,128,0.2);
          color: #4ade80; font-size: 13px; font-weight: 600;
          font-family: 'Syne', sans-serif;
          cursor: pointer; transition: all 0.2s;
        }
        .btn-secondary:hover {
          background: rgba(74,222,128,0.1);
          border-color: rgba(74,222,128,0.35);
          box-shadow: 0 6px 20px rgba(74,222,128,0.1);
        }
        .btn-secondary:disabled { opacity: 0.4; cursor: not-allowed; transform: none !important; }

        /* ── Fee row ────────────────────────────────────────── */
        .fee-strip {
          display: flex; justify-content: space-between; align-items: center;
          background: rgba(255,255,255,0.02); border-radius: 8px; padding: 10px 14px;
        }
        .fee-label {
          font-size: 11px; color: rgba(148,163,184,0.5);
          font-family: 'JetBrains Mono', monospace; letter-spacing: 0.5px; text-transform: uppercase;
        }
        .fee-value {
          font-size: 12px; color: rgba(99,179,237,0.8);
          font-family: 'JetBrains Mono', monospace; font-weight: 500;
        }
      `}</style>

      {/* Starfield */}
      <div className="stars-bg" aria-hidden="true">
        {STARS.map((s, i) => (
          <div key={i} className="star" style={{
            top: s.top, left: s.left,
            width: s.size, height: s.size,
            animationDelay: `${s.delay}s`,
            animationDuration: `${2 + s.delay}s`,
          }} />
        ))}
        <div className="orb" style={{ width: 500, height: 500, top: '-15%', left: '-15%', background: 'rgba(29,78,216,0.18)' }} />
        <div className="orb" style={{ width: 350, height: 350, bottom: '0%', right: '-5%', background: 'rgba(67,56,202,0.14)', animationDelay: '5s' }} />
      </div>

      <div className="page">
        <div className="card">

          {/* Header */}
          <div className="card-header">
            <div className="header-top">
              <div className="logo-row">
                <div className="logo-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#93c5fd">
                    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17 5.8 21.3l2.4-7.4L2 9.4h7.6z"/>
                  </svg>
                </div>
                <div>
                  <div className="terminal-label">POS Terminal</div>
                  <div className="card-title">Stellar Merchant</div>
                </div>
              </div>
              <div className="testnet-pill">
                <span className="testnet-dot" />
                Testnet only
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="card-body">

            {/* Wallet connect */}
            <div className="field-group">
              <button
                className={`wallet-connect-btn${wallet ? " connected" : ""}`}
                onClick={async () => {
                  try {
                    const address = await connectWallet();
                    setWallet(address);
                  } catch (err) {
                    alert("❌ " + err.message);
                  }
                }}
              >
                {wallet ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                    Wallet Connected
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="5" width="20" height="14" rx="2"/>
                      <path d="M16 12h2"/>
                    </svg>
                    Connect Freighter Wallet
                  </>
                )}
              </button>
              {wallet && (
                <div className="wallet-address-strip">
                  <span className="wallet-addr-label">Address</span>
                  <span className="wallet-addr-value">{shortWallet}</span>
                </div>
              )}
            </div>

            <div className="section-divider" />

            {/* Amount */}
            <div className="field-group">
              <label className="field-label">Amount</label>
              <div className="amount-wrap">
                <input
                  className="amount-input"
                  type="number"
                  min="1" max="1000"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <div className="amount-spinners">
                  <button className="spinner-btn"
                    onClick={() => setAmount(v => String(Math.min(1000, (parseFloat(v)||0)+1).toFixed(2)))}>▲</button>
                  <button className="spinner-btn"
                    onClick={() => setAmount(v => String(Math.max(1, (parseFloat(v)||1)-1).toFixed(2)))}>▼</button>
                </div>
                <span className="xlm-badge">XLM</span>
              </div>
            </div>

            {/* Network */}
            <div className="field-group">
              <label className="field-label">Network</label>
              <div className="network-row">
                {NETWORKS.map((n) => (
                  <button
                    key={n.id}
                    className={`net-btn${network === n.id ? " active" : ""}`}
                    onClick={() => setNetwork(n.id)}
                  >
                    {n.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="section-divider" />

            {/* Actions */}
            <button className="btn-primary" onClick={handleGeneratePayment}>
              <span>Generate Payment Page →</span>
            </button>

            <button className="btn-secondary" onClick={handleDirectPay} disabled={paying}>
              {paying ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{animation:"spin 1s linear infinite", display:"inline-block", marginRight:6}}>
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                  </svg>
                  Sending…
                </>
              ) : "Pay via Freighter"}
            </button>

            {/* Fee */}
            <div className="fee-strip">
              <span className="fee-label">Network fee</span>
              <span className="fee-value">~0.00001 XLM</span>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}