import { useEffect, useMemo, useState } from "react";

import {
  Search,
  RefreshCcw,
  CheckCircle2,
  AlertTriangle,
  Filter,
  CalendarRange,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

import { useNavigate } from "react-router-dom";

import toast, { Toaster } from "react-hot-toast";

import LogoMermas from "../../assets/images/logotipo_mermas.png";

import { api } from "../../services/api";

import NavbarDitzia from "../../components/NavbarDitzia";

// =========================================
// CARD COMPONENT
// =========================================
function MermaCard({
  item,
  multiSelectMode,
  selectedIds,
  toggleSelection,
  navigate,
}) {
  return (
    <motion.div
      drag={multiSelectMode ? false : "x"}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      whileTap={{ scale: 0.98 }}
      whileHover={{ scale: 1.01 }}
      onDragEnd={(event, info) => {
        if (multiSelectMode) return;

        // swipe hacia la izquierda
        if (info.offset.x < -80) {
          navigate(`/gestion-detalles/${item.id}`, {
            state: {
              merma: {
                ...item.original,
                imagen: item.imagen,
                estado: item.estado,
              },
            },
          });
        }
      }}
      onClick={() => {
        if (multiSelectMode) {
          if (item.estado === "Procesada") {
            return;
          }

          toggleSelection(item.id);

          return;
        }

        navigate(`/gestion-detalles/${item.id}`, {
          state: {
            merma: {
              ...item.original,
              imagen: item.imagen,
              estado: item.estado,
            },
          },
        });
      }}
      className={`
    relative bg-white rounded-[24px] p-3 shadow-sm border cursor-pointer transition-all touch-pan-y
    ${
      selectedIds.includes(item.id)
        ? "border-green-500 ring-4 ring-green-100"
        : "border-gray-100"
    }
  `}
    >
      {/* CHECK */}
      {multiSelectMode && item.estado !== "Procesada" && (
        <div
          className={`
            absolute top-3 right-3 z-20 w-6 h-6 rounded-full border-2 flex items-center justify-center
            ${
              selectedIds.includes(item.id)
                ? "bg-green-500 border-green-500"
                : "bg-white border-gray-300"
            }
          `}
        >
          {selectedIds.includes(item.id) && (
            <CheckCircle2 size={14} className="text-white" />
          )}
        </div>
      )}

      <div className="flex gap-3">
        <img
          src={item.imagen}
          alt={item.producto}
          className="w-16 h-16 rounded-2xl object-cover"
        />

        <div className="flex-1 min-w-0">
          <div className="flex justify-between gap-2">
            <div className="min-w-0">
              <p className="font-semibold text-sm text-gray-900 truncate">
                {item.producto}
              </p>

              <p className="text-xs text-gray-400 truncate mt-1">
                {item.tienda}
              </p>
            </div>

            <span
              className={`text-[10px] px-2 py-1 rounded-full h-fit font-semibold whitespace-nowrap
              ${
                item.estado === "Procesada"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {item.estado}
            </span>
          </div>

          <div className="flex justify-between items-center mt-3">
            <p className="text-[11px] text-gray-500 truncate">{item.usuario}</p>

            <p className="text-[11px] text-gray-400 whitespace-nowrap">
              {item.fecha}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function HistorialGestora() {
  const navigate = useNavigate();

  // =========================================
  // STATES
  // =========================================
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [showFilters, setShowFilters] = useState(false);

  const [showProcessModal, setShowProcessModal] = useState(false);

  const [sapDocument, setSapDocument] = useState("");

  const [processing, setProcessing] = useState(false);

  const [data, setData] = useState([]);

  const [selectedIds, setSelectedIds] = useState([]);

  const [multiSelectMode, setMultiSelectMode] = useState(false);

  // =========================================
  // FILTROS
  // =========================================
  const [filters, setFilters] = useState({
    estado: "Todas",
    tienda: "Todas",
    mes: "Todos",
  });

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  // =========================================
  // FETCH
  // =========================================
  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await api.get("/mermas");

      const mapped = (res.data?.data || []).map((item) => {
        const fecha = new Date(item.fechaHoraActual);

        return {
          id: item.id,

          original: item,

          producto: item.producto || "Producto",

          tienda: item.nombreTienda || "Sin tienda",

          usuario:
            item.grabado ||
            item.usuario ||
            item.nombreUsuario ||
            item.createdBy ||
            "Supervisor",

          motivo: item.selectMotivo,

          tipo:
            item.detalleProducto === "materia" ? "Materia prima" : "Preparada",

          cantidad: item.cantidadICG,

          unidad: item.unidad || "uds",

          total: Number(
            item.totalMerma || item.precioTotal || item.precio || 0,
          ),

          estado:
            item.docSapMerma && item.docSapMerma.trim() !== ""
              ? "Procesada"
              : "Pendiente",

          fechaReal: fecha,

          fecha: fecha.toLocaleDateString("es-CO", {
            day: "numeric",
            month: "short",
          }),

          hora: fecha.toLocaleTimeString("es-CO", {
            hour: "2-digit",
            minute: "2-digit",
          }),

          imagen: item.rutaImagenMerma
            ? `${apiUrl}/mermas/image?ruta=${item.rutaImagenMerma}`
            : "https://placehold.co/300x300/png",
        };
      });

      setData(mapped);
    } catch (err) {
      console.error(err);

      toast.error("No se pudo cargar historial");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // =========================================
  // KPIS
  // =========================================
  const kpis = useMemo(() => {
    const pendientes = data.filter((d) => d.estado === "Pendiente").length;

    const procesadas = data.filter((d) => d.estado === "Procesada").length;

    return {
      pendientes,
      procesadas,
    };
  }, [data]);

  // =========================================
  // TIENDAS
  // =========================================
  const tiendas = useMemo(() => {
    return ["Todas", ...new Set(data.map((item) => item.tienda))];
  }, [data]);

  // =========================================
  // MESES
  // =========================================
  const meses = [
    "Todos",
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
  // FILTRAR
  // =========================================
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchSearch =
        item.producto.toLowerCase().includes(search.toLowerCase()) ||
        item.tienda.toLowerCase().includes(search.toLowerCase()) ||
        item.usuario.toLowerCase().includes(search.toLowerCase());

      const matchEstado =
        filters.estado === "Todas" || item.estado === filters.estado;

      const matchTienda =
        filters.tienda === "Todas" || item.tienda === filters.tienda;

      const nombresMeses = [
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

      const mesItem = nombresMeses[item.fechaReal.getMonth()];

      const matchMes = filters.mes === "Todos" || mesItem === filters.mes;

      return matchSearch && matchEstado && matchTienda && matchMes;
    });
  }, [data, search, filters]);

  // =========================================
  // SELECCIONAR
  // =========================================
  const toggleSelection = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  // =========================================
  // PROCESAR MULTIPLE
  // =========================================
  const handleProcess = async () => {
    if (!sapDocument.trim()) {
      toast.error("Documento SAP obligatorio");

      return;
    }

    if (selectedIds.length === 0) {
      toast.error("Selecciona al menos una merma");

      return;
    }

    try {
      setProcessing(true);

      await Promise.all(
        selectedIds.map((id) =>
          api.patch(`/mermas/${id}`, {
            DocSapMerma: sapDocument,
          }),
        ),
      );

      setData((prev) =>
        prev.map((item) =>
          selectedIds.includes(item.id)
            ? {
                ...item,

                estado: "Procesada",

                original: {
                  ...item.original,

                  docSapMerma: sapDocument,
                },
              }
            : item,
        ),
      );

      toast.success(`${selectedIds.length} mermas procesadas`);

      setSelectedIds([]);

      setShowProcessModal(false);

      setSapDocument("");

      setMultiSelectMode(false);
    } catch {
      toast.error("No se pudieron procesar");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f6fa] lg:px-8 lg:py-6 pb-36">
      <Toaster position="top-center" />

      {/* HEADER */}
      <div className="sticky top-0 z-30 backdrop-blur-xl bg-white/80 border border-white/40 px-5 pt-8 pb-5 lg:rounded-[32px] lg:max-w-7xl lg:mx-auto">
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

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs tracking-widest text-gray-400">
              GESTIÓN GLOBAL
            </p>

            <h1 className="text-2xl font-bold text-gray-900">Historial</h1>
          </div>

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

        {/* SEARCH */}
        <div className="mt-5 flex gap-3">
          <div className="flex-1 flex items-center gap-2 bg-white rounded-2xl px-4 py-3 border border-gray-100 shadow-sm">
            <Search size={17} className="text-gray-400" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar producto, tienda o usuario..."
              className="bg-transparent w-full outline-none text-sm"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-14 rounded-2xl bg-black text-white flex items-center justify-center shadow-lg"
          >
            <Filter size={18} />
          </button>
        </div>

        {/* FILTER PANEL */}
        {/* FILTER PANEL */}
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
              <div className="mt-4 bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* ESTADO */}
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      Estado
                    </p>

                    <select
                      value={filters.estado}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          estado: e.target.value,
                        })
                      }
                      className="w-full bg-[#f6f7fb] p-3 rounded-2xl text-sm outline-none"
                    >
                      <option>Todas</option>
                      <option>Pendiente</option>
                      <option>Procesada</option>
                    </select>
                  </div>

                  {/* TIENDA */}
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      Tienda
                    </p>

                    <select
                      value={filters.tienda}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          tienda: e.target.value,
                        })
                      }
                      className="w-full bg-[#f6f7fb] p-3 rounded-2xl text-sm outline-none"
                    >
                      {tiendas.map((tienda) => (
                        <option key={tienda}>{tienda}</option>
                      ))}
                    </select>
                  </div>

                  {/* MES */}
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      Mes
                    </p>

                    <select
                      value={filters.mes}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          mes: e.target.value,
                        })
                      }
                      className="w-full bg-[#f6f7fb] p-3 rounded-2xl text-sm outline-none"
                    >
                      {meses.map((mes) => (
                        <option key={mes}>{mes}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MULTISELECT */}
        <div className="mt-4 flex gap-3">
          <button
            onClick={() => {
              setMultiSelectMode(!multiSelectMode);

              setSelectedIds([]);
            }}
            className={`
              px-4 py-2 rounded-2xl text-sm font-medium transition
              ${
                multiSelectMode
                  ? "bg-black text-white"
                  : "bg-white text-gray-700 border border-gray-200"
              }
            `}
          >
            {multiSelectMode ? "Cancelar selección" : "Seleccionar múltiples"}
          </button>

          {multiSelectMode && (
            <button
              onClick={() => {
                if (selectedIds.length === 0) {
                  toast.error("Selecciona mermas");

                  return;
                }

                setShowProcessModal(true);
              }}
              className="px-4 py-2 rounded-2xl bg-green-600 text-white text-sm font-medium"
            >
              Procesar ({selectedIds.length})
            </button>
          )}
        </div>
      </div>

      {/* KPIS */}
      <div className="px-5 mt-4 flex gap-3 lg:max-w-7xl lg:mx-auto">
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 px-4 py-3 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-yellow-100 flex items-center justify-center">
              <AlertTriangle className="text-yellow-600" size={18} />
            </div>

            <div>
              <p className="text-lg font-bold leading-none">
                {kpis.pendientes}
              </p>

              <p className="text-xs text-gray-400 mt-1">Pendientes</p>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-white rounded-2xl border border-gray-100 px-4 py-3 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="text-green-600" size={18} />
            </div>

            <div>
              <p className="text-lg font-bold leading-none">
                {kpis.procesadas}
              </p>

              <p className="text-xs text-gray-400 mt-1">Procesadas</p>
            </div>
          </div>
        </div>
      </div>

      {/* LIST */}
      <div className="px-5 mt-5 pb-40 lg:max-w-7xl lg:mx-auto">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-28 rounded-[28px] bg-white animate-pulse"
              />
            ))}
          </div>
        ) : filteredData.length === 0 ? (
          <div className="mt-20 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center shadow-sm">
              <CalendarRange size={30} className="text-gray-300" />
            </div>

            <h2 className="mt-5 font-bold text-gray-800">No hay resultados</h2>

            <p className="text-sm text-gray-400 mt-1">
              Intenta cambiar los filtros
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
            {filteredData.map((item) => (
              <MermaCard
                key={item.id}
                item={item}
                multiSelectMode={multiSelectMode}
                selectedIds={selectedIds}
                toggleSelection={toggleSelection}
                navigate={navigate}
              />
            ))}
          </div>
        )}
      </div>

      {/* MODAL PROCESAR */}
      {showProcessModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-[32px] p-6 w-full max-w-sm">
            <h2 className="text-xl font-bold text-gray-900">Procesar mermas</h2>

            <p className="text-sm text-gray-500 mt-2">
              Se procesarán {selectedIds.length} mermas con el mismo documento
              SAP.
            </p>

            <input
              value={sapDocument}
              onChange={(e) => setSapDocument(e.target.value)}
              placeholder="Documento SAP"
              className="w-full mt-5 bg-[#f6f7fb] border border-gray-100 rounded-2xl p-4 outline-none text-sm"
            />

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowProcessModal(false)}
                className="flex-1 py-3 rounded-2xl bg-gray-100 text-gray-700 font-semibold"
              >
                Cancelar
              </button>

              <button
                disabled={processing}
                onClick={handleProcess}
                className="flex-1 py-3 rounded-2xl bg-black text-white font-semibold"
              >
                {processing ? "Procesando..." : "Procesar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <NavbarDitzia />
    </div>
  );
}
