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
  const[started ,setStarted] = useState(false);

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
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#000",
        color: "#fff",
        fontFamily: "Inter"
      }}>
        <div style={{
          background: "rgba(18,22,36,0.92)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "24px",
          padding: "32px",
          width: "100%",
          maxWidth: "400px"
        }}>
          <h1 style={{ fontSize: "20px", marginBottom: "10px" }}>
            🚀 How to Use
          </h1>

          <p style={{ fontSize: "13px", opacity: 0.6, marginBottom: "20px" }}>
            Accept crypto payments in seconds
          </p>

          <div>① Enter payment amount</div>
          <div>② Connect Freighter wallet</div>
          <div>③ Generate payment</div>
          <div>④ Approve transaction</div>
          <div>⑤ View on-chain proof</div>

          <button
            onClick={() => setStarted(true)}
            style={{
              marginTop: "20px",
              width: "100%",
              padding: "12px",
              borderRadius: "12px",
              border: "none",
              background: "linear-gradient(90deg,#60a5fa,#a78bfa)",
              color: "#fff",
              cursor: "pointer"
            }}
          >
            Get Started →
          </button>
        </div>
      </div>
    );
  }
  return (
    
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', sans-serif; background: #000; min-height: 100vh; }

        @keyframes twinkle {
          0%   { opacity: 0.2; }
          100% { opacity: 0.9; }
        }

        .stars-bg {
          position: fixed; inset: 0; z-index: 0;
          background:
            radial-gradient(ellipse at 50% 0%, rgba(30,60,120,0.35) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 20%, rgba(10,30,80,0.25) 0%, transparent 50%),
            #000;
          overflow: hidden;
        }
        .star {
          position: absolute; background: white; border-radius: 50%;
          animation: twinkle 3s infinite alternate;
        }

        .page {
          position: relative; z-index: 1;
          min-height: 100vh; display: flex;
          align-items: center; justify-content: center; padding: 24px;
        }

        .card {
          background: rgba(18,22,36,0.92);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 24px; padding: 40px 32px 32px;
          width: 100%; max-width: 400px;
          display: flex; flex-direction: column; align-items: center;
          box-shadow: 0 0 0 1px rgba(255,255,255,0.04),
                      0 32px 80px rgba(0,0,0,0.7),
                      0 0 120px rgba(30,100,255,0.07);
        }

        .star-icon-wrap {
          width: 56px; height: 56px; border-radius: 50%;
          background: rgba(30,80,200,0.35);
          border: 1.5px solid rgba(80,140,255,0.4);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 16px;
          box-shadow: 0 0 24px rgba(60,120,255,0.3);
        }

        .title    { color: #fff; font-size: 20px; font-weight: 700; letter-spacing: -0.3px; margin-bottom: 4px; }
        .subtitle { color: rgba(255,255,255,0.45); font-size: 13px; margin-bottom: 6px; }
        .notice   { color: #f0a500; font-size: 12px; margin-bottom: 28px; }

        .connect-btn {
          width: 100%; padding: 9px 16px; border-radius: 8px;
          background: transparent; border: 1px solid rgba(80,140,255,0.5);
          color: #5ba3ff; font-size: 13px; font-weight: 500;
          cursor: pointer; margin-bottom: 10px; transition: background 0.2s;
          font-family: 'Inter', sans-serif;
        }
        .connect-btn:hover { background: rgba(80,140,255,0.1); }

        .wallet-address {
          font-size: 10px; color: #4ade80; text-align: center;
          word-break: break-all; margin-bottom: 12px; padding: 0 4px; width: 100%;
        }

        .field-label {
          align-self: flex-start; width: 100%;
          color: #5ba3ff; font-size: 13px; font-weight: 500; margin-bottom: 8px;
        }

        .amount-row {
          display: flex; align-items: center; width: 100%;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px; overflow: hidden; margin-bottom: 24px;
        }
        .amount-input {
          flex: 1; background: transparent; border: none; outline: none;
          color: #fff; font-size: 16px; font-family: 'Inter',sans-serif; padding: 14px 16px;
        }
        .amount-input::placeholder { color: rgba(255,255,255,0.3); }
        .amount-spinners { display: flex; flex-direction: column; padding: 0 8px; gap: 2px; }
        .spinner-btn {
          background: none; border: none; color: rgba(255,255,255,0.4);
          font-size: 10px; cursor: pointer; line-height: 1; padding: 2px;
        }
        .spinner-btn:hover { color: #fff; }
        .xlm-badge {
          background: #3b82f6; color: #fff; font-size: 13px; font-weight: 600;
          padding: 8px 16px; margin: 6px; border-radius: 6px; letter-spacing: 0.5px;
        }

        .network-row { display: flex; gap: 8px; width: 100%; margin-bottom: 24px; }
        .net-btn {
          flex: 1; padding: 10px 0; border-radius: 8px; background: transparent;
          border: 1px solid rgba(255,255,255,0.12); color: rgba(255,255,255,0.7);
          font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.18s;
          font-family: 'Inter', sans-serif;
        }
        .net-btn:hover  { border-color: rgba(255,255,255,0.25); color: #fff; }
        .net-btn.active { border-color: rgba(255,255,255,0.5); color: #fff; background: rgba(255,255,255,0.06); }

        .generate-btn {
          width: 100%; padding: 16px; border-radius: 12px; border: none;
          background: linear-gradient(90deg,#60a5fa,#a78bfa);
          color: #fff; font-size: 16px; font-weight: 700; cursor: pointer;
          letter-spacing: -0.2px; margin-bottom: 14px;
          transition: opacity 0.2s, transform 0.1s; font-family: 'Inter', sans-serif;
        }
        .generate-btn:hover  { opacity: 0.92; }
        .generate-btn:active { transform: scale(0.99); }

        .pay-btn {
          width: 100%; padding: 11px; border-radius: 8px;
          border: 1px solid rgba(80,200,120,0.4); background: transparent;
          color: #4ade80; font-size: 13px; font-weight: 500; cursor: pointer;
          margin-bottom: 20px; transition: background 0.2s; font-family: 'Inter', sans-serif;
        }
        .pay-btn:hover    { background: rgba(74,222,128,0.08); }
        .pay-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .divider   { width: 100%; height: 1px; background: rgba(255,255,255,0.07); margin-bottom: 16px; }
        .fee-row   { display: flex; justify-content: space-between; align-items: center; width: 100%; }
        .fee-label { color: rgba(255,255,255,0.4); font-size: 13px; }
        .fee-value { color: #5ba3ff; font-size: 13px; font-weight: 500; }
      `}</style>

      {/* Starfield */}
      <div className="stars-bg" aria-hidden="true">
        {STARS.map((s, i) => (
          <div key={i} className="star" style={{
            top: s.top, left: s.left,
            width: s.size, height: s.size,
            animationDelay:    `${s.delay}s`,
            animationDuration: `${2 + s.delay}s`,
          }} />
        ))}
      </div>

      <div className="page">
        <div className="card">

          {/* Icon */}
          <div className="star-icon-wrap">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#5ba3ff">
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17 5.8 21.3l2.4-7.4L2 9.4h7.6z"/>
            </svg>
          </div>

          <h1 className="title">Stellar Merchant</h1>
          <p className="subtitle">Point of Sale Terminal</p>
          <p className="notice">Use Stellar Testnet <em>only</em> (no real money)</p>

          {/* Connect Wallet */}
          <button
            className="connect-btn"
            onClick={async () => {
              try {
                const address = await connectWallet();
                setWallet(address);
              } catch (err) {
                alert("❌ " + err.message);
              }
            }}
          >
            {wallet ? "Wallet Connected ✅" : "Connect Freighter"}
          </button>
          {wallet && <p className="wallet-address">{wallet}</p>}

          {/* Amount */}
          <label className="field-label">Amount</label>
          <div className="amount-row">
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

          {/* Network */}
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

          {/* Generate Payment Page */}
          <button className="generate-btn" onClick={handleGeneratePayment}>
            Generate Payment
          </button>

          {/* Direct Pay */}
          <button className="pay-btn" onClick={handleDirectPay} disabled={paying}>
            {paying ? "Sending…" : "Pay via Freighter"}
          </button>

          <div className="divider" />
          <div className="fee-row">
            <span className="fee-label">Network fee</span>
            <span className="fee-value">~0.00001 XLM</span>
          </div>

        </div>
      </div>
    </>
  );
}