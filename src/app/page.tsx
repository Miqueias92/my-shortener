"use client";

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [custom, setCustom] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const shorten = async () => {
    if (!url) return;
    setLoading(true);
    const res = await fetch("/api/shorten", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, custom: custom || undefined }),
    });
    const data = await res.json();
    setLoading(false);

    if (data.shortUrl) {
      setResult(data.shortUrl);
    } else {
      alert(data.error || "Erro");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Shortener
        </h1>

        <input
          type="url"
          placeholder="Cole sua URL longa aqui"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-4 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Código personalizado (opcional)"
            value={custom}
            onChange={(e) => setCustom(e.target.value.replace(/[^a-zA-Z0-9]/g, ""))}
            className="flex-1 p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <span className="self-center text-gray-500">/{custom || "abc123"}</span>
        </div>

        <button
          onClick={shorten}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 rounded-lg hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Criando..." : "Encurtar"}
        </button>

        {result && (
          <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Seu link curto:</p>
            <a
              href={result}
              target="_blank"
              className="text-xl font-mono text-blue-600 break-all hover:underline"
            >
              {result}
            </a>
            <button
              onClick={() => navigator.clipboard.writeText(result)}
              className="ml-4 text-sm bg-blue-600 text-white px-4 py-2 rounded"
            >
              Copiar
            </button>
          </div>
        )}
      </div>
    </main>
  );
}