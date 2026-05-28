import { useEffect, useState } from "react";
import {
  Download,
  TrendingUp,
  TrendingDown,
  BarChart3
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid
} from "recharts";

import { motion } from "framer-motion";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function Report() {

  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("Semana");

  const [data, setData] = useState([]);
  const [dailyData, setDailyData] = useState([]);

  const [kpis, setKpis] = useState({
    total: 0,
    perdida: 0,
    tendencia: -5
  });

  useEffect(() => {
    setTimeout(() => {
      setData([
        { categoria: "Bebidas", perdida: 120 },
        { categoria: "Panadería", perdida: 80 },
        { categoria: "Promos", perdida: 40 }
      ]);

      setDailyData([
        { dia: "Lun", perdida: 20 },
        { dia: "Mar", perdida: 35 },
        { dia: "Mié", perdida: 25 },
        { dia: "Jue", perdida: 50 },
        { dia: "Vie", perdida: 30 }
      ]);

      setKpis({
        total: 47,
        perdida: 300,
        tendencia: -12
      });

      setLoading(false);
    }, 700);
  }, []);

  // 📥 EXPORTAR
  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reporte");
    XLSX.writeFile(wb, "reporte_mermas.xlsx");
  };

  const exportPDF = async () => {
    const element = document.getElementById("report-content");

    const canvas = await html2canvas(element, {
      backgroundColor: "#ffffff",
      scale: 2
    });

    const img = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    pdf.addImage(img, "PNG", 10, 10, 180, 0);
    pdf.save("reporte_mermas.pdf");
  };

  return (
    <div className="min-h-screen bg-[#f6f7fb] flex justify-center">

      <div className="w-full max-w-sm flex flex-col">

        {/* HEADER */}
        <div className="px-5 pt-8 pb-4">
          <p className="text-xs text-gray-400">Análisis</p>
          <h1 className="text-xl font-bold text-gray-900">
            Reportes
          </h1>
        </div>

        {/* FILTROS */}
        <div className="flex gap-2 px-5 mb-4">
          {["Semana", "Mes", "Año"].map(f => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition
                ${filtro === f
                  ? "bg-gray-800 text-white"
                  : "bg-gray-100 text-gray-600"
                }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* BOTONES */}
        <div className="flex gap-2 px-5 mb-4">

          <button
            onClick={exportExcel}
            className="flex-1 bg-white border border-gray-200 py-2 rounded-xl text-xs flex items-center justify-center gap-2 font-medium"
          >
            <Download size={14} />
            Excel
          </button>

          <button
            onClick={exportPDF}
            className="flex-1 bg-gray-800 text-white py-2 rounded-xl text-xs flex items-center justify-center gap-2 font-medium active:scale-95 transition"
          >
            <Download size={14} />
            PDF
          </button>

        </div>

        <div id="report-content" className="flex-1 overflow-y-auto pb-24">

          {loading ? (
            <div className="px-5 space-y-3">
              <div className="h-24 bg-white rounded-2xl animate-pulse"/>
              <div className="h-52 bg-white rounded-2xl animate-pulse"/>
              <div className="h-52 bg-white rounded-2xl animate-pulse"/>
            </div>
          ) : (
            <>

              {/* KPI */}
              <div className="grid grid-cols-2 gap-3 px-5 mb-4">

                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex justify-between mb-2">

                    <BarChart3 size={18} className="text-gray-700" />

                    <span className="text-xs text-green-500 flex items-center gap-1 font-medium">
                      <TrendingDown size={12} />
                      {kpis.tendencia}%
                    </span>

                  </div>

                  <p className="text-xl font-bold text-gray-900">
                    {kpis.total}
                  </p>

                  <p className="text-xs text-gray-400">
                    Total mermas
                  </p>
                </div>

                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex justify-between mb-2">
                    <TrendingUp size={18} className="text-red-500" />
                  </div>

                  <p className="text-xl font-bold text-gray-900">
                    ${kpis.perdida}
                  </p>

                  <p className="text-xs text-gray-400">
                    Pérdida total
                  </p>
                </div>

              </div>

              {/* GRÁFICA BARRAS */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-5 mb-4"
              >
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">

                  <p className="text-sm font-semibold mb-3 text-gray-800">
                    Pérdidas por categoría
                  </p>

                  <div className="w-full h-52">
                    <ResponsiveContainer>
                      <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="categoria" fontSize={10} />
                        <YAxis fontSize={10} />
                        <Tooltip />
                        <Bar
                          dataKey="perdida"
                          radius={[8, 8, 0, 0]}
                          fill="#4151a6"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                </div>
              </motion.div>

              {/* GRÁFICA LINEA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="px-5 mb-6"
              >
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">

                  <p className="text-sm font-semibold mb-3 text-gray-800">
                    Evolución diaria
                  </p>

                  <div className="w-full h-52">
                    <ResponsiveContainer>
                      <LineChart data={dailyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="dia" fontSize={10} />
                        <YAxis fontSize={10} />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="perdida"
                          stroke="#16a34a"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                </div>
              </motion.div>

            </>
          )}

        </div>

      </div>
    </div>
  );
}