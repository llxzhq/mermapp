import { useEffect, useState } from "react";

import {
  Package,
  TrendingDown,
  RefreshCw,
  AlertCircle,
  ChevronRight,
  FileSpreadsheet,
  ServerCrash,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { motion } from "framer-motion";

import LogoMermas from "../assets/images/logotipo_mermas.png";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { api } from "../services/api";

export default function Home() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [usuarioNombre, setUsuarioNombre] = useState("Usuario");

  const [sucursal, setSucursal] = useState(null);

  const [mermas, setMermas] = useState([]);

  const [chartData, setChartData] = useState([]);

  const [kpis, setKpis] = useState({
    total: 0,
    cantidad: 0,
    productoCritico: "-",
  });

  // =========================================
  // CONSTANTES
  // =========================================

  const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

  const IMAGE_FALLBACK = "https://placehold.co/300x300/png";

  // =========================================
  // OBTENER BRANCH DE FORMA SEGURA
  // =========================================

  const getStoredBranch = () => {
    try {
      const storedBranch = localStorage.getItem("branch");

      if (!storedBranch) {
        return null;
      }

      const parsedBranch = JSON.parse(storedBranch);

      if (!parsedBranch || typeof parsedBranch !== "object") {
        return null;
      }

      return parsedBranch;
    } catch (error) {
      console.error("ERROR LEYENDO BRANCH:", error);

      localStorage.removeItem("branch");

      return null;
    }
  };

  // =========================================
  // CONSTRUIR URL DE IMAGEN
  // =========================================

  const getImageUrl = (rutaImagenMerma) => {
    if (!rutaImagenMerma || !API_URL) {
      return IMAGE_FALLBACK;
    }

    return `${API_URL}/mermas/image?ruta=${encodeURIComponent(
      rutaImagenMerma,
    )}`;
  };

  // =========================================
  // INIT
  // =========================================

  useEffect(() => {
    const nombre = localStorage.getItem("nombre");

    const branch = getStoredBranch();

    // =========================================
    // USUARIO
    // =========================================

    if (nombre?.trim()) {
      const primerNombre = nombre.trim().split(/\s+/)[0];

      setUsuarioNombre(
        primerNombre.charAt(0).toUpperCase() +
          primerNombre.slice(1).toLowerCase(),
      );
    } else {
      setUsuarioNombre("Usuario");
    }

    // =========================================
    // SUCURSAL
    // =========================================

    if (!branch?.idTienda) {
      navigate("/select-branch", { replace: true });

      return;
    }

    setSucursal(branch);

    loadData(branch.idTienda);
  }, [navigate]);

  // =========================================
  // LOAD DATA
  // =========================================

  const loadData = async (idTienda) => {
    if (!idTienda) {
      setError("No se encontró una sucursal válida.");

      setLoading(false);

      return;
    }

    try {
      setLoading(true);

      setError("");

      const res = await api.get(
        `/mermas/mermas-by-coffee?coffeeId=${encodeURIComponent(idTienda)}`,
      );

      const data = Array.isArray(res.data?.data) ? res.data.data : [];

      console.log("RESPUESTA COMPLETA:", res.data);

      console.log("DATA:", data);

      console.log("PRIMER ITEM:", data[0]);

      // =========================================
      // ORDENAR MERMAS
      // =========================================

      const sortedData = [...data].sort((a, b) => {
        const fechaA = new Date(a?.merma?.fechaHoraActual || 0).getTime();

        const fechaB = new Date(b?.merma?.fechaHoraActual || 0).getTime();

        return fechaB - fechaA;
      });

      console.log("MERMAS ORDENADAS:", sortedData);

      setMermas(sortedData);

      // =========================================
      // TOTAL MERMAS
      // =========================================

      const total = sortedData.length;

      // =========================================
      // TOTAL CANTIDAD
      // =========================================

      const cantidad = sortedData.reduce((acc, item) => {
        const valor = Number(item?.merma?.cantidadICG);

        return acc + (Number.isFinite(valor) ? valor : 0);
      }, 0);

      // =========================================
      // AGRUPAR PRODUCTOS
      // =========================================

      const groupedProducts = {};

      sortedData.forEach((item) => {
        const producto = item?.merma?.producto?.trim() || "Otros";

        const cantidadProducto = Number(item?.merma?.cantidadICG);

        if (!Number.isFinite(cantidadProducto)) {
          return;
        }

        if (!groupedProducts[producto]) {
          groupedProducts[producto] = 0;
        }

        groupedProducts[producto] += cantidadProducto;
      });

      // =========================================
      // CHART
      // =========================================

      const chart = Object.entries(groupedProducts)
        .map(([producto, cantidad]) => ({
          producto,
          cantidad,
        }))
        .sort((a, b) => b.cantidad - a.cantidad)
        .slice(0, 5);

      setChartData(chart);

      // =========================================
      // PRODUCTO CRÍTICO
      // =========================================

      const productoCritico =
        chart.length > 0 ? chart[0].producto : "-";

      // =========================================
      // SET KPIS
      // =========================================

      setKpis({
        total,
        cantidad,
        productoCritico,
      });
    } catch (err) {
      console.error("ERROR DASHBOARD:", err);

      setMermas([]);

      setChartData([]);

      setKpis({
        total: 0,
        cantidad: 0,
        productoCritico: "-",
      });

      setError(
        "No fue posible cargar la información de las mermas.",
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // CHANGE BRANCH
  // =========================================

  const handleChangeBranch = () => {
    localStorage.removeItem("branch");

    navigate("/select-branch");
  };

  // =========================================
  // RETRY
  // =========================================

  const handleRetry = () => {
    const branch = getStoredBranch();

    if (!branch?.idTienda) {
      navigate("/select-branch", { replace: true });

      return;
    }

    setSucursal(branch);

    loadData(branch.idTienda);
  };

  // =========================================
  // RENDER
  // =========================================

  return (
    <div className="min-h-screen bg-[#f5f6fa] overflow-x-hidden">
      {/* ========================================= */}
      {/* HEADER */}
      {/* ========================================= */}

      <div className="sticky top-0 z-20 backdrop-blur-xl bg-white/80 border-b border-gray-100">
        <div className="w-full px-4 sm:px-6 lg:px-10 pt-7 pb-6">
          <motion.img
            src={LogoMermas}
            className="w-28 sm:w-32 mb-5 opacity-90"
            initial={{
              opacity: 0,
              y: -10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
          />

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            {/* TEXT */}

            <div>
              <p className="text-gray-400 text-xs tracking-[0.3em] uppercase">
                Dashboard
              </p>

              <h1 className="font-bold text-3xl sm:text-4xl text-gray-900">
                Hola, {usuarioNombre}
              </h1>

              {sucursal && (
                <p className="text-sm text-gray-500 mt-2">
                  Sucursal:{" "}
                  <span className="font-semibold text-black">
                    {sucursal.tienda}
                  </span>
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* REPORTES */}

              <button
                onClick={() => navigate("/reports")}
                className="
                  w-full sm:w-auto
                  flex items-center justify-center gap-2
                  bg-[#DC2626]
                  text-white
                  px-6 py-3
                  rounded-2xl
                  shadow-lg
                  font-medium
                  hover:opacity-90
                  transition
                "
              >
                <FileSpreadsheet size={16} />

                Reportes
              </button>

              {/* CAMBIAR SUCURSAL */}

              <button
                onClick={handleChangeBranch}
                className="
                  w-full sm:w-auto
                  flex items-center justify-center gap-2
                  bg-[#2E9437]
                  text-white
                  px-6 py-3
                  rounded-2xl
                  shadow-lg
                  font-medium
                  hover:opacity-90
                  transition
                "
              >
                <RefreshCw size={16} />

                Cambiar sucursal
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================= */}
      {/* CONTENT */}
      {/* ========================================= */}

      <div className="w-full px-4 sm:px-6 lg:px-10 py-6 pb-32">
        {loading ? (
          <div className="space-y-5">
            <div className="h-36 bg-white rounded-3xl animate-pulse" />

            <div className="h-80 bg-white rounded-3xl animate-pulse" />

            <div className="h-60 bg-white rounded-3xl animate-pulse" />
          </div>
        ) : error ? (
          /* ========================================= */
          /* ERROR */
          /* ========================================= */

          <div className="min-h-[400px] flex items-center justify-center">
            <div className="w-full max-w-md bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-red-100 flex items-center justify-center">
                <ServerCrash
                  size={30}
                  className="text-red-500"
                />
              </div>

              <h2 className="text-xl font-bold text-gray-900 mt-5">
                No se pudo cargar el dashboard
              </h2>

              <p className="text-sm text-gray-500 mt-2">
                {error}
              </p>

              <button
                onClick={handleRetry}
                className="
                  mt-6
                  w-full
                  flex
                  items-center
                  justify-center
                  gap-2
                  bg-black
                  text-white
                  py-3
                  rounded-2xl
                  font-semibold
                "
              >
                <RefreshCw size={17} />

                Intentar nuevamente
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* ========================================= */}
            {/* KPI */}
            {/* ========================================= */}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {/* TOTAL */}

              <div
                className="
                  bg-white
                  rounded-[26px]
                  border border-gray-100
                  shadow-sm
                  p-4
                  flex items-center gap-3
                  min-w-0
                "
              >
                <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center shrink-0">
                  <Package
                    className="text-red-500"
                    size={22}
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 leading-none">
                    {kpis.total}
                  </p>

                  <p className="text-xs sm:text-sm text-gray-400 mt-1">
                    Total mermas
                  </p>
                </div>
              </div>

              {/* CANTIDAD */}

              <div
                className="
                  bg-white
                  rounded-[26px]
                  border border-gray-100
                  shadow-sm
                  p-4
                  flex items-center gap-3
                  min-w-0
                "
              >
                <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center shrink-0">
                  <TrendingDown
                    className="text-orange-500"
                    size={22}
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 leading-none truncate">
                    {kpis.cantidad}
                  </p>

                  <p className="text-xs sm:text-sm text-gray-400 mt-1">
                    Cantidad desperdiciada
                  </p>
                </div>
              </div>

              {/* PRODUCTO CRÍTICO */}

              <div
                className="
                  bg-white
                  rounded-[26px]
                  border border-gray-100
                  shadow-sm
                  p-4
                  flex items-center gap-3
                  min-w-0
                  sm:col-span-2
                  xl:col-span-1
                "
              >
                <div className="w-12 h-12 rounded-2xl bg-yellow-100 flex items-center justify-center shrink-0">
                  <AlertCircle
                    className="text-yellow-500"
                    size={22}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-base sm:text-lg font-bold text-gray-900 line-clamp-2 break-words leading-tight">
                    {kpis.productoCritico}
                  </p>

                  <p className="text-xs sm:text-sm text-gray-400 mt-1">
                    Producto más afectado
                  </p>
                </div>
              </div>
            </div>

            {/* ========================================= */}
            {/* CHART */}
            {/* ========================================= */}

            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="
                bg-white
                rounded-[32px]
                p-5 sm:p-6
                shadow-sm
                border border-gray-100
                mt-7
              "
            >
              <p className="text-lg font-bold text-gray-900 mb-5">
                Productos con más merma
              </p>

              {chartData.length > 0 ? (
                <div className="w-full h-[340px]">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />

                      <XAxis
                        dataKey="producto"
                        fontSize={11}
                        tickFormatter={(value) =>
                          value.length > 18
                            ? `${value.substring(0, 18)}...`
                            : value
                        }
                      />

                      <YAxis fontSize={12} />

                      <Tooltip />

                      <Bar
                        dataKey="cantidad"
                        radius={[10, 10, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[340px] flex items-center justify-center text-sm text-gray-400">
                  No hay datos suficientes para mostrar el gráfico.
                </div>
              )}
            </motion.div>

            {/* ========================================= */}
            {/* ÚLTIMAS MERMAS */}
            {/* ========================================= */}

            <div className="mt-7">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Últimas mermas
                </h2>

                <button
                  onClick={() => navigate("/historial")}
                  className="text-sm text-gray-500 hover:text-black transition"
                >
                  Ver todas
                </button>
              </div>

              {mermas.length === 0 ? (
                <div className="bg-white rounded-[28px] p-8 text-center border border-gray-100">
                  <p className="text-sm text-gray-400">
                    No hay mermas registradas para esta sucursal.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {mermas.slice(0, 5).map((item) => {
                    const detalle = item?.merma;

                    // Evita que un registro inválido rompa todo el dashboard
                    if (!detalle?.id) {
                      return null;
                    }

                    return (
                      <motion.div
                        key={detalle.id}
                        whileTap={{
                          scale: 0.985,
                        }}
                        onClick={() =>
                          navigate(
                            `/mermas/detalle/${detalle.id}`,
                            {
                              state: item,
                            },
                          )
                        }
                        className="
                          bg-white
                          rounded-[28px]
                          p-4
                          border border-gray-100
                          shadow-sm
                          flex items-center gap-4
                          cursor-pointer
                        "
                      >
                        {/* IMAGEN */}

                        <img
                          src={getImageUrl(
                            detalle.rutaImagenMerma,
                          )}
                          alt={
                            detalle.producto ||
                            "Imagen de merma"
                          }
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.onerror = null;

                            e.currentTarget.src =
                              IMAGE_FALLBACK;
                          }}
                          className="
                            w-20 h-20
                            rounded-2xl
                            object-cover
                            shrink-0
                          "
                        />

                        {/* INFORMACIÓN */}

                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 line-clamp-2">
                            {detalle.producto ||
                              "Producto sin nombre"}
                          </p>

                          <p className="text-sm text-gray-400 mt-1">
                            {detalle.nombreTienda ||
                              sucursal?.tienda ||
                              "Sucursal no disponible"}
                          </p>

                          <div className="flex flex-wrap gap-2 mt-3">
                            <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                              {detalle.cantidadICG ?? 0}{" "}
                              {detalle.unidadMedidaICG ||
                                "uds"}
                            </span>

                            <span className="bg-red-100 text-red-600 text-xs px-3 py-1 rounded-full">
                              {detalle.selectMotivo ||
                                "Sin motivo"}
                            </span>
                          </div>
                        </div>

                        <ChevronRight
                          size={18}
                          className="text-gray-300 shrink-0"
                        />
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}