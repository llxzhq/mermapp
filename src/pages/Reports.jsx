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
} from "lucide-react";

import * as XLSX from "xlsx";

import { motion } from "framer-motion";

import toast, { Toaster } from "react-hot-toast";

import LogoMermas from "../assets/images/logotipo_mermas.png";

import { api } from "../services/api";

export default function Reports() {
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [data, setData] = useState([]);

  const [showFilters, setShowFilters] = useState(false);

  const [selectedStore, setSelectedStore] = useState("Todas");

  const [isGlobal, setIsGlobal] = useState(false);

  // =========================================
  // FETCH
  // =========================================
  const fetchData = async () => {
    try {
      setLoading(true);

      const ruta = localStorage.getItem("ruta");

      if (!ruta) {
        toast.error("No se encontró la ruta del supervisor");
        return;
      }

      // ============================
      // SUCURSALES DE LA RUTA
      // ============================
      const storesResponse = await api.get(`/mermas/stores?ruta=${ruta}`);

      const stores = storesResponse.data?.data || [];

      const tiendasPermitidas = stores.map((store) => Number(store.idTienda));

      // ============================
      // MERMAS
      // ============================
      const mermasResponse = await api.get("/mermas");

      const mermas = mermasResponse.data?.data || [];

      const filtered = mermas
        .filter((item) => {
          if (isGlobal) return true;

          return tiendasPermitidas.includes(Number(item.idTienda));
        })
        .map((item) => ({
          id: item.id,

          producto: item.producto,

          tienda: item.nombreTienda,

          motivo: item.selectMotivo,

          cantidad: item.cantidadICG,

          unidad: item.unidadMedidaICG,

          estado:
            item.docSapMerma && item.docSapMerma.trim() !== ""
              ? "Procesada"
              : "Pendiente",

          documentoSAP: item.docSapMerma || "-",

          fecha: new Date(item.fechaHoraActual),
        }))
        .sort((a, b) => b.fecha - a.fecha);

      setData(filtered);
    } catch (error) {
      console.error(error);

      toast.error("No se pudieron cargar los reportes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isGlobal]);

  // =========================================
  // FILTRO BUSQUEDA
  // =========================================
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchSearch =
        item.producto?.toLowerCase().includes(search.toLowerCase()) ||
        item.tienda?.toLowerCase().includes(search.toLowerCase()) ||
        item.motivo?.toLowerCase().includes(search.toLowerCase());

      const matchStore =
        selectedStore === "Todas" || item.tienda === selectedStore;

      return matchSearch && matchStore;
    });
  }, [data, search, selectedStore]);

  const stores = useMemo(() => {
    return ["Todas", ...new Set(data.map((item) => item.tienda))];
  }, [data]);

  // =========================================
  // KPIS
  // =========================================
  const kpis = useMemo(() => {
    return {
      total: filteredData.length,

      pendientes: filteredData.filter((item) => item.estado === "Pendiente")
        .length,

      procesadas: filteredData.filter((item) => item.estado === "Procesada")
        .length,

      sucursales: [...new Set(filteredData.map((item) => item.tienda))].length,
    };
  }, [filteredData]);

  const exportExcel = () => {
    if (filteredData.length === 0) {
      toast.error("No hay datos para exportar");
      return;
    }

    const excelData = filteredData.map((item) => ({
      Fecha: item.fecha.toLocaleDateString("es-CO"),

      Id: item.id,

      Centro: item.tienda || "",

      Referencia: item.producto || "",

      "Motivo de descarte": item.motivo || "",

      Cantidad: item.cantidad || "",

      Unidad: item.unidad || "",

      DocSap: item.documentoSAP || "",
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);

    ws["!cols"] = [
      { wch: 14 }, // Fecha
      { wch: 10 }, // Id
      { wch: 25 }, // Centro
      { wch: 55 }, // Referencia
      { wch: 30 }, // Motivo
      { wch: 12 }, // Cantidad
      { wch: 12 }, // Unidad
      { wch: 18 }, // DocSap
    ];

    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Reporte Supervisor");

    XLSX.writeFile(wb, `Reporte_Supervisor_${Date.now()}.xlsx`);

    toast.success("Reporte exportado");
  };

  return (
    <div className="min-h-screen bg-[#f5f6fa] px-5 pt-8 pb-20">
      <Toaster position="top-center" />

      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="sticky top-0 z-30 backdrop-blur-xl bg-white/80 border border-white/40 px-5 pt-8 pb-5 rounded-[32px]">
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

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <p className="text-xs tracking-widest text-gray-400">
                REPORTES SUPERVISOR
              </p>

              <h1 className="text-2xl font-bold text-gray-900">
                Mis sucursales
              </h1>
            </div>

            <div className="flex gap-2">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setIsGlobal(!isGlobal)}
                  className={`
      h-11 px-4 rounded-2xl flex items-center gap-2 transition-all font-medium
      ${
        isGlobal
          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
          : "bg-white border border-gray-200 text-gray-700"
      }
    `}
                >
                  <BarChart3 size={16} />
                  <span className="hidden sm:block">
                    {isGlobal ? "Global" : "Ruta"}
                  </span>
                </button>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="w-11 h-11 rounded-2xl bg-black text-white flex items-center justify-center"
                >
                  <Filter size={18} />
                </button>

                <button
                  onClick={exportExcel}
                  className="h-11 px-4 rounded-2xl bg-green-600 text-white flex items-center gap-2"
                >
                  <Download size={16} />
                  <span className="hidden sm:block">Excel</span>
                </button>

                <button
                  onClick={fetchData}
                  className="w-11 h-11 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center"
                >
                  <RefreshCcw
                    size={18}
                    className={`text-gray-600 ${loading ? "animate-spin" : ""}`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* SEARCH */}
          <div className="mt-5 flex items-center gap-2 bg-white rounded-2xl px-4 py-3 border border-gray-100 shadow-sm">
            <Search size={17} className="text-gray-400" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar producto, tienda o motivo..."
              className="bg-transparent w-full outline-none text-sm"
            />
          </div>

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
              className="overflow-hidden"
            >
              <div className="mt-4 bg-white rounded-3xl p-4 border border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-3">
                  Sucursal
                </p>

                <select
                  value={selectedStore}
                  onChange={(e) => setSelectedStore(e.target.value)}
                  className="w-full bg-[#f5f6fa] rounded-2xl p-3 text-sm outline-none"
                >
                  {stores.map((store) => (
                    <option key={store}>{store}</option>
                  ))}
                </select>

                <button
                  onClick={() => setSelectedStore("Todas")}
                  className="mt-3 text-sm text-red-500 font-medium"
                >
                  Limpiar filtros
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* KPIS */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mt-6">
          <div className="bg-white rounded-[24px] sm:rounded-[30px] p-4 sm:p-5 border border-gray-100">
            <BarChart3 className="text-red-500" />

            <p className="text-3xl font-bold mt-3">{kpis.total}</p>

            <p className="text-sm text-gray-400">Total registros</p>
          </div>

          <div className="bg-white rounded-[24px] sm:rounded-[30px] p-4 sm:p-5 border border-gray-100">
            <AlertTriangle className="text-yellow-500" />

            <p className="text-3xl font-bold mt-3">{kpis.pendientes}</p>

            <p className="text-sm text-gray-400">Pendientes</p>
          </div>

          <div className="bg-white rounded-[24px] sm:rounded-[30px] p-4 sm:p-5 border border-gray-100">
            <CheckCircle2 className="text-green-500" />

            <p className="text-3xl font-bold mt-3">{kpis.procesadas}</p>

            <p className="text-sm text-gray-400">Procesadas</p>
          </div>

          <div className="bg-white rounded-[24px] sm:rounded-[30px] p-4 sm:p-5 border border-gray-100">
            <TrendingDown className="text-blue-500" />

            <p className="text-3xl font-bold mt-3">{kpis.sucursales}</p>

            <p className="text-sm text-gray-400">Sucursales</p>
          </div>
        </div>

        {/* TABLA */}
        <div className="mt-6 bg-white rounded-[32px] border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-[#f8f9fc]">
                <tr>
                  <th className="px-6 py-4 text-left">Producto</th>

                  <th className="px-6 py-4 text-left">Tienda</th>

                  <th className="px-6 py-4 text-left">Motivo</th>

                  <th className="px-6 py-4 text-left">Cantidad</th>

                  <th className="px-6 py-4 text-left">Estado</th>

                  <th className="px-6 py-4 text-left">Fecha</th>
                </tr>
              </thead>

              <tbody>
                {filteredData.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="px-6 py-4">{item.producto}</td>

                    <td className="px-6 py-4">{item.tienda}</td>

                    <td className="px-6 py-4">{item.motivo}</td>

                    <td className="px-6 py-4">{item.cantidad}</td>

                    <td className="px-6 py-4">{item.estado}</td>

                    <td className="px-6 py-4">
                      {item.fecha.toLocaleDateString("es-CO")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
