import React, { useState } from "react";
import axios from "axios";

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [link, setLink] = useState("");
  const [expires, setExpires] = useState("1d"); // padrão: 1 dia
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Selecione um arquivo primeiro!");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setProgress(0);
      setLink("");

      const response = await axios.post(`https://file.io/?expires=${expires}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percent);
        },
      });

      if (response.data.success) {
        setLink(response.data.link);
      } else {
        alert("Erro ao enviar arquivo!");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro na conexão com o servidor!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 flex flex-col items-center gap-4 border rounded-xl shadow-lg bg-white w-96">
      <h2 className="text-xl font-bold">Upload Temporário</h2>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="p-2 border rounded-md w-full"
      />

      <div className="flex flex-col items-center gap-2 w-full">
        <label className="font-medium">Tempo de expiração:</label>
        <select
          value={expires}
          onChange={(e) => setExpires(e.target.value)}
          className="border rounded-md p-2 w-full"
        >
          <option value="1h">1 hora</option>
          <option value="1d">1 dia</option>
          <option value="1w">1 semana</option>
        </select>
      </div>

      <button
        onClick={handleUpload}
        disabled={loading}
        className={`px-4 py-2 rounded-lg text-white transition w-full ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Enviando..." : "Enviar para File.io"}
      </button>

      {loading && (
        <div className="w-full bg-gray-200 rounded-full h-5 overflow-hidden relative">
          <div
            className="bg-blue-600 h-5 transition-all text-center text-xs text-white flex items-center justify-center"
            style={{ width: `${progress}%` }}
          >
            {progress}%
          </div>
        </div>
      )}

      {link && (
        <div className="mt-4 text-center">
          <p className="font-medium">✅ Upload concluído!</p>
          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline break-all"
          >
            {link}
          </a>
          <p className="text-sm text-gray-500 mt-2">
            ⚠️ O arquivo será excluído após 1 download ou expiração.
          </p>
        </div>
      )}
    </div>
  );
}