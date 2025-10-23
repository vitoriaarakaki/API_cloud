import React, { useState } from "react";

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [link, setLink] = useState("");
  const [expires, setExpires] = useState("1d"); // padrão: 1 dia

  const handleUpload = async () => {
    if (!file) return alert("Selecione um arquivo primeiro!");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`https://file.io/?expires=${expires}`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setLink(data.link);
      } else {
        alert("Erro ao enviar arquivo!");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro na conexão com o servidor!");
    }
  };

  return (
    <div className="p-6 flex flex-col items-center gap-4 border rounded-xl shadow-lg bg-white">
      <h2 className="text-xl font-bold">Upload Temporário</h2>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="p-2 border rounded-md"
      />

      <div className="flex flex-col items-center gap-2">
        <label className="font-medium">Tempo de expiração:</label>
        <select
          value={expires}
          onChange={(e) => setExpires(e.target.value)}
          className="border rounded-md p-2"
        >
          <option value="1h">1 hora</option>
          <option value="1d">1 dia</option>
          <option value="1w">1 semana</option>
          <option value="1m">1 mês</option>
        </select>
      </div>

      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Enviar para File.io
      </button>

      {link && (
        <div className="mt-4 text-center">
          <p className="font-medium">Link gerado:</p>
          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline break-all"
          >
            {link}
          </a>
          <p className="text-sm text-gray-500">
            ⚠️ O arquivo será excluído após 1 download ou expiração.
          </p>
        </div>
      )}
    </div>
  );
}
