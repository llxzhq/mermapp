import { useState, useEffect, useMemo } from "react";
import {
  ChevronRight,
  Search,
  Package,
  Coffee,
  Clock3,
  CheckCircle2,
  AlertCircle,
  RefreshCcw,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { motion, AnimatePresence } from "framer-motion";

import toast, { Toaster } from "react-hot-toast";

import { api } from "../services/api";

export default function Historial() {
  const navigate = useNavigate();

  // =========================================
  // STATES
  // =========================================
  const [tipoMerma, setTipoMerma] = useState("Todas");

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [data, setData] = useState([]);

  // =========================================
  // FILTROS
  // =========================================
  const tipos = ["Todas", "Preparada", "Materia prima"];

  // =========================================
  // API URL
  // =========================================
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  // =========================================
  // OBTENER HISTORIAL
  // =========================================
  // =========================================
  // OBTENER HISTORIAL
  // =========================================
  const fetchHistorial = async () => {
    try {
      setLoading(true);

      // =========================================
      // SUCURSAL SELECCIONADA
      // =========================================
      const branch = JSON.parse(localStorage.getItem("branch") || "{}");

      console.log("BRANCH:", branch);

      console.log("URL FINAL:", `/mermas/mermas-by-coffee?coffeeId=${branch?.idTienda}`);

      // =========================================
      // HISTORIAL POR RUTA
      // =========================================
      const res = await api.get(`/mermas/mermas-by-coffee?coffeeId=${branch?.idTienda}`);

      console.log("HISTORIAL:", res.data);

      // =========================================
      // MAP DATA
      // =========================================
      const mappedData = (res.data?.data || []).map((item) => {
        const fecha = new Date(item.fechaHoraActual);

        const hoy = new Date();

        const isToday = fecha.toDateString() === hoy.toDateString();

        const ayer = new Date();

        ayer.setDate(hoy.getDate() - 1);

        const isYesterday = fecha.toDateString() === ayer.toDateString();

        const group = isToday
          ? "Hoy"
          : isYesterday
            ? "Ayer"
            : fecha.toLocaleDateString("es-CO", {
                day: "numeric",
                month: "long",
              });

        const procesado = item.docSapMerma && item.docSapMerma !== "";

        return {
          id: item.id,

          name: item.producto,

          time: fecha.toLocaleTimeString("es-CO", {
            hour: "2-digit",
            minute: "2-digit",
          }),

          group,

          category:
            item.detalleProducto === "materia" ? "Inventario" : "Preparado",

          tipo:
            item.detalleProducto === "materia" ? "Materia prima" : "Preparada",

          // =========================================
          // IMAGEN
          // =========================================
          image: item.rutaImagenMerma
            ? `${apiUrl}/mermas/image?ruta=${item.rutaImagenMerma}`
            : "https://placehold.co/200x200/png",

          leido: false,

          procesado,

          cantidadICG: item.cantidadICG,

          motivo: item.selectMotivo,

          tienda: item.nombreTienda,

          fechaOriginal: item.fechaHoraActual,

          docSapMerma: item.docSapMerma || null,
        };
      });

      console.log("MAPPED:", mappedData);

      setData(mappedData);
    } catch (err) {
      console.error(err);

      toast.error("No se pudo cargar el historial");
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // INIT
  // =========================================
  useEffect(() => {
    fetchHistorial();
  }, []);

  // =========================================
  // FILTRADO
  // =========================================
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchTipo = tipoMerma === "Todas" || item.tipo === tipoMerma;

      const matchSearch = item.name
        .toLowerCase()
        .includes(search.toLowerCase());

      return matchTipo && matchSearch;
    });
  }, [data, tipoMerma, search]);

  // =========================================
  // AGRUPAR
  // =========================================
  const groupedData = useMemo(() => {
    // 🔥 ORDENAR DESCENDENTE
    const sorted = [...filteredData].sort(
      (a, b) => new Date(b.fechaOriginal) - new Date(a.fechaOriginal),
    );

    return sorted.reduce((acc, item) => {
      if (!acc[item.group]) {
        acc[item.group] = [];
      }

      acc[item.group].push(item);

      return acc;
    }, {});
  }, [filteredData]);

  // =========================================
  // NO LEÍDOS
  // =========================================
  const unreadCount = data.filter((d) => !d.leido).length;

  return (
    <div className="min-h-screen bg-[#f6f7fb] overflow-hidden">
      <Toaster position="top-center" />

      {/* ========================================= */}
      {/* CONTAINER */}
      {/* ========================================= */}
      <div className="w-full max-w-[1700px] mx-auto flex flex-col min-h-screen">
        {/* ========================================= */}
        {/* HEADER */}
        {/* ========================================= */}
        <div className="px-4 sm:px-6 lg:px-10 pt-7 pb-5 bg-white border-b border-gray-100 sticky top-0 z-20">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Historial
              </h1>

              <p className="text-sm text-gray-400 mt-1">Registro de mermas</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchHistorial}
                className="w-11 h-11 rounded-2xl bg-gray-100 flex items-center justify-center active:scale-95 transition"
              >
                <RefreshCcw
                  size={18}
                  className={`text-gray-600 ${loading ? "animate-spin" : ""}`}
                />
              </button>

              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-semibold px-2.5 py-1.5 rounded-full shadow-sm">
                  {unreadCount}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ========================================= */}
        {/* SEARCH */}
        {/* ========================================= */}
        <div className="px-4 sm:px-6 lg:px-10 bg-white pt-4 pb-4">
          <div className="flex items-center gap-3 bg-[#f4f5f7] px-4 py-4 rounded-2xl border border-gray-100">
            <Search size={18} className="text-gray-400 shrink-0" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar producto..."
              className="bg-transparent w-full text-sm outline-none"
            />
          </div>
        </div>

        {/* ========================================= */}
        {/* FILTROS */}
        {/* ========================================= */}
        <div className="px-4 sm:px-6 lg:px-10 pb-5 bg-white flex gap-2 overflow-x-auto border-b border-gray-100 no-scrollbar">
          {tipos.map((tipo) => (
            <motion.button
              key={tipo}
              whileTap={{
                scale: 0.95,
              }}
              onClick={() => setTipoMerma(tipo)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all
                ${
                  tipoMerma === tipo
                    ? "bg-black text-white shadow-md"
                    : "bg-gray-100 text-gray-600"
                }
              `}
            >
              {tipo}
            </motion.button>
          ))}
        </div>

        {/* ========================================= */}
        {/* LISTA */}
        {/* ========================================= */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-10 py-5 pb-32">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white h-28 rounded-[32px] animate-pulse"
                />
              ))}
            </div>
          ) : Object.keys(groupedData).length === 0 ? (
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              className="flex flex-col items-center justify-center mt-24 text-center"
            >
              <div className="w-20 h-20 rounded-3xl bg-gray-100 flex items-center justify-center mb-5">
                <Package size={32} className="text-gray-400" />
              </div>

              <h2 className="text-lg font-semibold text-gray-700">
                No se encontraron resultados
              </h2>

              <p className="text-sm text-gray-400 mt-2">
                Intenta cambiar el filtro o búsqueda
              </p>
            </motion.div>
          ) : (
            <AnimatePresence>
              {Object.keys(groupedData).map((group) => (
                <motion.div
                  key={group}
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  className="mb-8"
                >
                  {/* GROUP */}
                  <div className="flex items-center gap-2 mb-4">
                    <Clock3 size={14} className="text-gray-400" />

                    <p className="text-sm text-gray-400 font-medium">{group}</p>
                  </div>

                  {/* ITEMS */}
                  <div className="space-y-4">
                    {groupedData[group].map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{
                          opacity: 0,
                          y: 20,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          delay: index * 0.05,
                        }}
                        whileTap={{
                          scale: 0.985,
                        }}
                        onClick={() =>
                          navigate(`/mermas/detalle/${item.id}`, {
                            state: item,
                          })
                        }
                        className="relative flex items-center gap-4 bg-white rounded-[32px] p-4 shadow-sm border border-gray-100 transition-all cursor-pointer overflow-hidden"
                      >
                        {/* IMAGE */}
                        <div className="relative shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 rounded-2xl object-cover"
                          />

                          <div
                            className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center shadow-md border-2 border-white
                                ${
                                  item.tipo === "Preparada"
                                    ? "bg-[#E8F1FF]"
                                    : "bg-[#FFF3E6]"
                                }
                              `}
                          >
                            {item.tipo === "Preparada" ? (
                              <Coffee size={15} className="text-blue-600" />
                            ) : (
                              <Package size={15} className="text-orange-600" />
                            )}
                          </div>
                        </div>

                        {/* INFO */}
                        <div className="flex-1 min-w-0">
                          {/* TOP */}
                          <div className="flex items-start justify-between gap-3 min-w-0">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2 break-words">
                                {item.name}
                              </p>

                              <p className="text-xs text-gray-400 mt-1 truncate">
                                {item.tienda}
                              </p>
                            </div>

                            {!item.leido && (
                              <div className="w-2.5 h-2.5 rounded-full bg-red-500 mt-2 shrink-0" />
                            )}
                          </div>

                          {/* TAGS */}
                          <div className="flex flex-wrap gap-2 mt-3 max-w-full overflow-hidden">
                            <span
                              className={`text-[10px] px-2.5 py-1 rounded-full font-semibold whitespace-nowrap
                                  ${
                                    item.tipo === "Preparada"
                                      ? "bg-blue-100 text-blue-700"
                                      : "bg-orange-100 text-orange-700"
                                  }
                                `}
                            >
                              {item.tipo}
                            </span>

                            <span className="bg-gray-100 text-gray-600 text-[10px] px-2.5 py-1 rounded-full whitespace-nowrap">
                              {item.cantidadICG} uds
                            </span>

                            <span className="bg-gray-100 text-gray-500 text-[10px] px-2.5 py-1 rounded-full whitespace-nowrap">
                              {item.time}
                            </span>
                          </div>

                          {/* STATUS */}
                          <div className="mt-3">
                            <span
                              className={`inline-flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full font-medium
                                  ${
                                    item.procesado
                                      ? "bg-emerald-100 text-emerald-700"
                                      : "bg-amber-100 text-amber-700"
                                  }
                                `}
                            >
                              {item.procesado ? (
                                <CheckCircle2 size={12} />
                              ) : (
                                <AlertCircle size={12} />
                              )}

                              {item.procesado
                                ? "Procesada por gestora"
                                : "Pendiente de gestión"}
                            </span>
                          </div>
                        </div>

                        {/* ARROW */}
                        <ChevronRight
                          size={18}
                          className="text-gray-300 shrink-0"
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
