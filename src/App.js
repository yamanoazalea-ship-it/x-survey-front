import { useState, useEffect } from "react";

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

const HISTORY_KEY = "surveyHistory";

export default function App() {
  const [mode, setMode] = useState("trend");
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch {
      // ignore quota errors
    }
  }, [history]);

  const handleModeChange = (newMode) => {
    if (newMode === "idea") {
      if (result) {
        const ideaInput = result;
        setInput(ideaInput);
        setResult("");
        setMode(newMode);
        runSurvey(newMode, ideaInput);
        return;
      }
    } else {
      setInput("");
    }
    setResult("");
    setMode(newMode);
  };

  const runSurvey = async (currentMode, currentInput) => {
    if (!currentInput.trim()) return;
    setLoading(true);
    setResult("");
    try {
      const res = await fetch("https://x-survey-app.onrender.com/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: currentMode, input: currentInput }),
      });
      const data = await res.json();
      setResult(data.result);
      const entry = {
        id: Date.now(),
        mode: currentMode,
        modeLabel: MODES.find((m) => m.key === currentMode)?.label || currentMode,
        input: currentInput,
        result: data.result,
        timestamp: new Date().toISOString(),
      };
      setHistory((prev) => [entry, ...prev]);
    } catch (e) {
      setResult("エラーが発生しました。バックエンドが起動しているか確認してください。");
    }
    setLoading(false);
  };

  const handleSubmit = () => runSurvey(mode, input);

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

  const deleteHistoryEntry = (id) => {
    setHistory((prev) => prev.filter((h) => h.id !== id));
  };

  const clearAllHistory = () => {
    if (window.confirm("すべての履歴を削除しますか？")) {
      setHistory([]);
    }
  };

  const formatTimestamp = (iso) => {
    const d = new Date(iso);
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: "0 20px", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>📡 X Survey App</h1>
      <p style={{ color: "#666", marginBottom: 24 }}>YouTubeネタ発掘のためのサーベイツール</p>

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {MODES.map((m) => (
          <button
            key={m.key}
            onClick={() => handleModeChange(m.key)}
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

      <div style={{ marginTop: 48, borderTop: "1px solid #e5e7eb", paddingTop: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, margin: 0 }}>🗂 履歴（{history.length}件）</h2>
          {history.length > 0 && (
            <button
              onClick={clearAllHistory}
              style={{
                padding: "6px 12px",
                borderRadius: 8,
                border: "1px solid #ef4444",
                backgroundColor: "white",
                color: "#ef4444",
                cursor: "pointer",
                fontSize: 14,
              }}
            >
              履歴をすべて削除
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <p style={{ color: "#9ca3af", fontSize: 14 }}>履歴はまだありません。</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {history.map((h) => (
              <div
                key={h.id}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  padding: 12,
                  backgroundColor: "#fff",
                  position: "relative",
                }}
              >
                <button
                  onClick={() => deleteHistoryEntry(h.id)}
                  title="この履歴を削除"
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    border: "1px solid #d1d5db",
                    backgroundColor: "white",
                    color: "#6b7280",
                    cursor: "pointer",
                    fontSize: 14,
                    lineHeight: 1,
                  }}
                >
                  ×
                </button>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6, paddingRight: 36 }}>
                  <span style={{ fontWeight: "bold", fontSize: 14 }}>{h.modeLabel}</span>
                  <span style={{ color: "#6b7280", fontSize: 12 }}>{formatTimestamp(h.timestamp)}</span>
                </div>
                <div style={{ fontSize: 13, color: "#374151", marginBottom: 6 }}>
                  <span style={{ color: "#6b7280" }}>入力：</span>
                  {h.input}
                </div>
                <details>
                  <summary style={{ cursor: "pointer", fontSize: 13, color: "#2563eb" }}>結果を表示</summary>
                  <div
                    style={{
                      marginTop: 8,
                      padding: 12,
                      backgroundColor: "#f9fafb",
                      borderRadius: 6,
                      whiteSpace: "pre-wrap",
                      lineHeight: 1.7,
                      fontSize: 13,
                    }}
                  >
                    {h.result}
                  </div>
                </details>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
