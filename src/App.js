import { useState } from "react";

const MODES = [
  { key: "trend", label: "🔥 トレンド分析" },
  { key: "account", label: "👤 アカウント分析" },
  { key: "keyword", label: "🔍 キーワード調査" },
  { key: "idea", label: "💡 ネタ生成" },
];

const PLACEHOLDERS = {
  trend: "例：AI、音楽制作、ショート動画",
  account: "例：@elonmusk",
  keyword: "例：生成AI、YouTube Shorts、自動化",
  idea: "前の分析結果をここに貼り付けてください",
};

export default function App() {
  const [mode, setMode] = useState("trend");
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult("");
    try {
      const res = await fetch("https://x-survey-app.onrender.com/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, input }),
      });
      const data = await res.json();
      setResult(data.result);
    } catch (e) {
      setResult("エラーが発生しました。バックエンドが起動しているか確認してください。");
    }
    setLoading(false);
  };

  const saveTxt = () => {
    const blob = new Blob([result], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `survey_${mode}_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
  };

  const savePdf = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(
      `<pre style="font-family:sans-serif;line-height:1.8;padding:40px;">${result}</pre>`
    );
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: "0 20px", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>📡 X Survey App</h1>
      <p style={{ color: "#666", marginBottom: 24 }}>YouTubeネタ発掘のためのサーベイツール</p>

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {MODES.map((m) => (
          <button
            key={m.key}
            onClick={() => { setMode(m.key); setInput(""); setResult(""); }}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              backgroundColor: mode === m.key ? "#2563eb" : "#e5e7eb",
              color: mode === m.key ? "white" : "#333",
              fontWeight: mode === m.key ? "bold" : "normal",
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={PLACEHOLDERS[mode]}
        rows={4}
        style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #d1d5db", fontSize: 16, boxSizing: "border-box" }}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          marginTop: 12,
          padding: "10px 24px",
          backgroundColor: loading ? "#9ca3af" : "#2563eb",
          color: "white",
          border: "none",
          borderRadius: 8,
          fontSize: 16,
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "調査中..." : "調査する"}
      </button>

      {result && (
        <div style={{ marginTop: 32 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <button
              onClick={saveTxt}
              style={{ padding: "6px 16px", borderRadius: 8, border: "1px solid #d1d5db", cursor: "pointer", backgroundColor: "white" }}
            >
              📄 TXTで保存
            </button>
            <button
              onClick={savePdf}
              style={{ padding: "6px 16px", borderRadius: 8, border: "1px solid #d1d5db", cursor: "pointer", backgroundColor: "white" }}
            >
              🖨️ PDFで保存
            </button>
          </div>
          <div style={{ padding: 20, backgroundColor: "#f9fafb", borderRadius: 8, border: "1px solid #e5e7eb", whiteSpace: "pre-wrap", lineHeight: 1.8 }}>
            {result}
          </div>
        </div>
      )}
    </div>
  );
}