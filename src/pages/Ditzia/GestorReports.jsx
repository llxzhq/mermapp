import { useEffect, useMemo, useState } from "react";

import {
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  RefreshCcw,
  Search,
  BarChart3,
  Download,
  Filter,
  CalendarDays,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

import toast, { Toaster } from "react-hot-toast";

import * as XLSX from "xlsx";

import LogoMermas from "../../assets/images/logotipo_mermas.png";

import { api } from "../../services/api";

export default function GestorReports() {
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [data, setData] = useState([]);

  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    estado: "Todas",
    meses: [],
    years: [],
  });

  const apiUrl = import.meta.env.VITE_API_URL;

  // =========================================
  // FETCH
  // =========================================
  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await api.get("/mermas");

      console.log("REPORTES:", res.data?.data?.[0]);

      const mapped = (res.data?.data || []).map((item) => {
        const merma = item.merma;

        const fecha = new Date(merma.fechaHoraActual);

        return {
          id: merma.id,

          producto: merma.producto || "Producto",

          codigoINVU: merma.codigoProducto || "-",

          codigoSAP:
            merma.codigoIntegracionProducto || merma.codigoIntegracion || "-",

          tienda: merma.nombreTienda || "Sin tienda",

          motivo: merma.selectMotivo || "Sin motivo",

          tipo:
            merma.detalleProducto === "materia" ? "Materia prima" : "Preparada",

          cantidad: Number(merma.cantidadICG || 0),

          estado:
            merma.docSapMerma && merma.docSapMerma.trim() !== ""
              ? "Procesada"
              : "Pendiente",

          documentoSAP: merma.docSapMerma || "-",

          fecha,

          mes: fecha.getMonth(),

          year: fecha.getFullYear(),

          fechaTexto: fecha.toLocaleDateString("es-CO", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),

          imagen: merma.rutaImagenMerma
            ? `${apiUrl}/mermas/image?ruta=${merma.rutaImagenMerma}`
            : "https://placehold.co/300x300/png",
        };
      });

      setData(mapped);
    } catch (error) {
      console.error(error);

      toast.error("No se pudieron cargar reportes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // =========================================
  // MESES
  // =========================================
  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  // =========================================
  // YEARS DISPONIBLES
  // =========================================
  const availableYears = useMemo(() => {
    return [...new Set(data.map((item) => item.year))].sort((a, b) => b - a);
  }, [data]);

  // =========================================
  // TOGGLE MULTISELECT
  // =========================================
  const toggleMonth = (month) => {
    setFilters((prev) => ({
      ...prev,
      meses: prev.meses.includes(month)
        ? prev.meses.filter((m) => m !== month)
        : [...prev.meses, month],
    }));
  };

  const toggleYear = (year) => {
    setFilters((prev) => ({
      ...prev,
      years: prev.years.includes(year)
        ? prev.years.filter((y) => y !== year)
        : [...prev.years, year],
    }));
  };

  // =========================================
  // FILTRO
  // =========================================
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchSearch =
        item.producto.toLowerCase().includes(search.toLowerCase()) ||
        item.tienda.toLowerCase().includes(search.toLowerCase()) ||
        item.motivo.toLowerCase().includes(search.toLowerCase());

      const matchEstado =
        filters.estado === "Todas" || item.estado === filters.estado;

      const matchMes =
        filters.meses.length === 0 || filters.meses.includes(meses[item.mes]);

      const matchYear =
        filters.years.length === 0 || filters.years.includes(item.year);

      return matchSearch && matchEstado && matchMes && matchYear;
    });
  }, [data, search, filters]);

  // =========================================
  // KPIS
  // =========================================
  const kpis = useMemo(() => {
    const pendientes = filteredData.filter(
      (item) => item.estado === "Pendiente",
    ).length;

    const procesadas = filteredData.filter(
      (item) => item.estado === "Procesada",
    ).length;

    const totalProductos = filteredData.length;

    return {
      pendientes,
      procesadas,
      totalProductos,
    };
  }, [filteredData]);

  // =========================================
  // EXPORTAR EXCEL
  // =========================================
  const exportExcel = () => {
    if (filteredData.length === 0) {
      toast.error("No hay datos para exportar");

      return;
    }

    const excelData = filteredData.map((item) => ({
      Producto: item.producto,
      CodigoINVU: item.codigoINVU,
      CodigoSAP: item.codigoSAP,
      Tienda: item.tienda,
      Motivo: item.motivo,
      Tipo: item.tipo,
      Cantidad: item.cantidad,
      Estado: item.estado,
      DocumentoSAP: item.documentoSAP,
      Fecha: item.fechaTexto,
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);

    ws["!cols"] = [
      { wch: 40 }, // Producto
      { wch: 15 }, // Código INVU
      { wch: 18 }, // Código SAP
      { wch: 30 }, // Tienda
      { wch: 35 }, // Motivo
      { wch: 15 }, // Tipo
      { wch: 12 }, // Cantidad
      { wch: 15 }, // Estado
      { wch: 20 }, // Documento SAP
      { wch: 15 }, // Fecha
    ];

    const colWidths = Object.keys(excelData[0]).map((key) => ({
      wch:
        Math.max(
          key.length,
          ...excelData.map((row) => String(row[key] || "").length),
        ) + 5,
    }));

    ws["!cols"] = colWidths;

    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Reporte Mermas");

    XLSX.writeFile(wb, `Reporte_Mermas_${new Date().getTime()}.xlsx`);

    toast.success("Reporte exportado");
  };

  return (
    <div className="min-h-screen bg-[#f5f6fa] px-4 sm:px-5 lg:px-8 pt-8 pb-28 overflow-x-hidden">
      <Toaster position="top-center" />

      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="sticky top-0 z-30 backdrop-blur-xl bg-white/80 border border-white/40 px-5 pt-8 pb-5 lg:rounded-[32px]">
          <motion.img
            src={LogoMermas}
            className="w-28 opacity-90 mb-4"
            initial={{
              opacity: 0,
              y: -10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
          />

          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs tracking-widest text-gray-400">
                ANALÍTICA GLOBAL
              </p>

              <h1 className="text-2xl font-bold text-gray-900">Reportes</h1>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-11 h-11 rounded-2xl bg-black text-white flex items-center justify-center shadow-sm"
              >
                <Filter size={18} />
              </button>

              <button
                onClick={fetchData}
                className="w-11 h-11 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center"
              >
                <RefreshCcw
                  size={18}
                  className={`text-gray-600 ${loading ? "animate-spin" : ""}`}
                />
              </button>
            </div>
          </div>

          {/* SEARCH */}
          <div className="mt-5 flex gap-3">
            <div className="flex-1 flex items-center gap-2 bg-white rounded-2xl px-4 py-3 border border-gray-100 shadow-sm">
              <Search size={17} className="text-gray-400" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar producto, tienda o motivo..."
                className="bg-transparent w-full outline-none text-sm"
              />
            </div>

            <button
              onClick={exportExcel}
              className="px-5 rounded-2xl bg-green-600 text-white flex items-center justify-center gap-2 shadow-lg text-sm font-medium"
            >
              <Download size={17} />
              Excel
            </button>
          </div>

          {/* FILTROS */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{
                  opacity: 0,
                  height: 0,
                }}
                animate={{
                  opacity: 1,
                  height: "auto",
                }}
                exit={{
                  opacity: 0,
                  height: 0,
                }}
                className="overflow-hidden"
              >
                <div className="mt-5 bg-white rounded-[28px] border border-gray-100 p-5 shadow-sm">
                  {/* ESTADO */}
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-3">
                      Estado
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {["Todas", "Pendiente", "Procesada"].map((estado) => (
                        <button
                          key={estado}
                          onClick={() =>
                            setFilters({
                              ...filters,
                              estado,
                            })
                          }
                          className={`
                            px-4 py-2 rounded-2xl text-sm transition
                            ${
                              filters.estado === estado
                                ? "bg-black text-white"
                                : "bg-[#f5f6fa] text-gray-700"
                            }
                          `}
                        >
                          {estado}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* MESES */}
                  <div className="mt-6">
                    <div className="flex items-center gap-2 mb-3">
                      <CalendarDays size={16} className="text-gray-500" />

                      <p className="text-sm font-semibold text-gray-700">
                        Meses
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {meses.map((mes) => (
                        <button
                          key={mes}
                          onClick={() => toggleMonth(mes)}
                          className={`
                            px-4 py-2 rounded-2xl text-sm transition
                            ${
                              filters.meses.includes(mes)
                                ? "bg-blue-600 text-white"
                                : "bg-[#f5f6fa] text-gray-700"
                            }
                          `}
                        >
                          {mes}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* YEARS */}
                  <div className="mt-6">
                    <p className="text-sm font-semibold text-gray-700 mb-3">
                      Años
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {availableYears.map((year) => (
                        <button
                          key={year}
                          onClick={() => toggleYear(year)}
                          className={`
                            px-4 py-2 rounded-2xl text-sm transition
                            ${
                              filters.years.includes(year)
                                ? "bg-green-600 text-white"
                                : "bg-[#f5f6fa] text-gray-700"
                            }
                          `}
                        >
                          {year}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* KPIS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {/* TOTAL REGISTROS */}
          <div className="bg-white rounded-[30px] p-5 border border-gray-100 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center">
              <BarChart3 size={24} className="text-red-600" />
            </div>

            <p className="text-3xl font-bold mt-5 text-gray-900">
              {kpis.totalProductos}
            </p>

            <p className="text-sm text-gray-400 mt-1">Total registros</p>
          </div>

          {/* PENDIENTES */}
          <div className="bg-white rounded-[30px] p-5 border border-gray-100 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-yellow-100 flex items-center justify-center">
              <AlertTriangle size={24} className="text-yellow-600" />
            </div>

            <p className="text-3xl font-bold mt-5 text-gray-900">
              {kpis.pendientes}
            </p>

            <p className="text-sm text-gray-400 mt-1">Pendientes</p>
          </div>

          {/* PROCESADAS */}
          <div className="bg-white rounded-[30px] p-5 border border-gray-100 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center">
              <CheckCircle2 size={24} className="text-green-600" />
            </div>

            <p className="text-3xl font-bold mt-5 text-gray-900">
              {kpis.procesadas}
            </p>

            <p className="text-sm text-gray-400 mt-1">Procesadas</p>
          </div>

          {/* SUCURSALES */}
          <div className="bg-white rounded-[30px] p-5 border border-gray-100 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
              <TrendingDown size={24} className="text-blue-600" />
            </div>

            <p className="text-3xl font-bold mt-5 text-gray-900">
              {[...new Set(filteredData.map((item) => item.tienda))].length}
            </p>

            <p className="text-sm text-gray-400 mt-1">Sucursales activas</p>
          </div>
        </div>

        {/* TABLA */}
        <div className="mt-6 bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead className="bg-[#f8f9fc] border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500">
                    Producto
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500">
                    Código INVU
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500">
                    Código SAP
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500">
                    Tienda
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500">
                    Motivo
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500">
                    Estado
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500">
                    Documento SAP
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500">
                    Fecha
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  [...Array(6)].map((_, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td colSpan={6} className="px-6 py-5">
                        <div className="h-6 bg-gray-100 rounded-xl animate-pulse" />
                      </td>
                    </tr>
                  ))
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-16 text-gray-400">
                      No hay resultados
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-100 hover:bg-[#fafbff] transition"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {item.producto}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {item.codigoINVU}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                        {item.codigoSAP}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {item.tienda}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {item.motivo}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`
                            px-3 py-1 rounded-full text-xs font-semibold
                            ${
                              item.estado === "Procesada"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }
                          `}
                        >
                          {item.estado}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                        {item.documentoSAP}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-500">
                        {item.fechaTexto}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
