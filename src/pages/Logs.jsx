import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Logs() {
  const [logText, setLogText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        // 👇 Recupera el token guardado al iniciar sesión
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/reports/viewlastlog`,
          {
            responseType: "text",
            headers: {
              Authorization: `Bearer ${token}`, // 👈 envía el token
            },
          }
        );

        setLogText(response.data);
      } catch (err) {
        setError("Error cargando los logs recientes");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  if (loading) return <p>Cargando logs...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>📜 Últimos Logs del Sistema</h2>
      <pre
        style={{
          backgroundColor: "#f9f9f9",
          padding: "10px",
          border: "1px solid #ddd",
          overflowX: "auto",
          whiteSpace: "pre-wrap", // respeta saltos de línea
        }}
      >
        {logText}
      </pre>
    </div>
  );
}
