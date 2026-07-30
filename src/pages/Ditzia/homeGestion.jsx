import { useEffect, useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  Package,
  TrendingDown,
  RefreshCw,
  Building2,
  ClipboardCheck,
  Trash2,
  AlertTriangle,
  ShieldCheck,
  BarChart3,
  Activity,
  LogOut,
} from "lucide-react";

import { motion } from "framer-motion";

import LogoMermas from "../../assets/images/logotipo_mermas.png";

import LogoMermo from "../../assets/images/logotipo_mermo.png";

import { api } from "../../services/api";

import { useMsal } from "@azure/msal-react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
  ResponsiveContainer,
} from "recharts";

export default function GestoraHome() {
  const [loading, setLoading] = useState(true);

  const [filtro, setFiltro] = useState("Semana");

  const [usuarioNombre, setUsuarioNombre] = useState("");

  const [mermas, setMermas] = useState([]);

  const { instance } = useMsal();

  const navigate = useNavigate();

  const usersMap = {
    ovelez: "Omar Velez",
    driquelme: "David Riquelme",
    asanchez: "Andrés Sánchez",
    osaez: "Orlando Saenz",
    dbonilla: "Ditzia Bonilla",
  };

  // =========================================
  // LOGOUT
  // =========================================
  const handleLogout = async () => {
    try {
      localStorage.clear();

      sessionStorage.clear();

      await instance.logoutRedirect({
        postLogoutRedirectUri: `${import.meta.env.VITE_BASE_URL}/login`,
      });
    } catch (error) {
      console.error("LOGOUT ERROR:", error);
    }
  };

  // =========================================
  // USER
  // =========================================
  useEffect(() => {
    const user = localStorage.getItem("usuario");

    if (user) {
      const clean = user.toLowerCase().trim();

      setUsuarioNombre(usersMap[clean] || clean);
    } else {
      setUsuarioNombre("Gestora");
    }

    loadData();
  }, []);

  // =========================================
  // LOAD DATA
  // =========================================
  const loadData = async () => {
    try {
      setLoading(true);

      const res = await api.get("/mermas");

      console.log("Respuesta API:", res.data);

      const mapped = (res.data?.data || [])
        .map((item) => item?.merma)
        .filter(Boolean);

      console.log("Mermas:", mapped);

      setMermas(mapped);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // FILTRO FECHA
  // =========================================
  const filteredMermas = useMemo(() => {
    const today = new Date();

    return mermas.filter((item) => {
      if (!item?.fechaHoraActual) return false;

      const fecha = new Date(item.fechaHoraActual);

      const diffTime = today - fecha;
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      if (filtro === "Semana") return diffDays <= 7;

      if (filtro === "Mes") return diffDays <= 30;

      return diffDays <= 365;
    });
  }, [mermas, filtro]);

  // =========================================
  // KPIS
  // =========================================
  const kpis = useMemo(() => {
    const total = filteredMermas.length;

    const pendientes = filteredMermas.filter(
      (m) => !m.docSapMerma || m.docSapMerma.trim() === "",
    ).length;

    const procesadas = filteredMermas.filter(
      (m) => m.docSapMerma && m.docSapMerma.trim() !== "",
    ).length;

    const productosPerdidos = Math.round(
      filteredMermas.reduce((acc, item) => {
        return acc + Number(item.cantidadICG || 0);
      }, 0),
    );

    const sucursales = new Set(filteredMermas.map((m) => m.nombreTienda)).size;

    const motivos = {};

    filteredMermas.forEach((item) => {
      const motivo = item.selectMotivo || "Sin motivo";

      if (!motivos[motivo]) {
        motivos[motivo] = 0;
      }

      motivos[motivo]++;
    });

    const motivoTop =
      Object.entries(motivos).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      "Sin datos";

    return {
      total,
      pendientes,
      procesadas,
      productosPerdidos,
      sucursales,
      motivoTop,
    };
  }, [filteredMermas]);

  // =========================================
  // PIE DATA
  // =========================================
  const pieData = [
    {
      name: "Procesadas",
      value: kpis.procesadas,
      color: "#22c55e",
    },
    {
      name: "Pendientes",
      value: kpis.pendientes,
      color: "#f59e0b",
    },
  ];

  // =========================================
  // TOP SUCURSALES
  // =========================================
  const topSucursales = useMemo(() => {
    const grouped = {};

    filteredMermas.forEach((item) => {
      const tienda = item.nombreTienda || "Sin tienda";

      const cantidad = Number(item.cantidadICG || 0);

      if (!grouped[tienda]) {
        grouped[tienda] = {
          tienda,
          total: 0,
        };
      }

      grouped[tienda].total += cantidad;
    });

    return Object.values(grouped)
      .sort((a, b) => b.total - a.total)
      .slice(0, 6);
  }, [filteredMermas]);

  return (
    <div className="min-h-screen bg-[#f5f6fa] pb-32 overflow-x-hidden">
      {/* HEADER */}
      <div className="sticky top-0 z-20 backdrop-blur-xl bg-white/70 border-b border-white/30">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
          <motion.img
            src={LogoMermas}
            className="w-28 sm:w-32 mb-4 opacity-90"
            initial={{
              opacity: 0,
              y: -10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
          />

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="min-w-0">
              <p className="text-gray-400 text-xs tracking-widest">
                PANEL GESTIÓN
              </p>

              <p className="font-bold text-2xl sm:text-3xl text-gray-900 truncate">
                Hola, {usuarioNombre}
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Analítica global de mermas
              </p>
            </div>

            <motion.button
              whileTap={{
                scale: 0.95,
              }}
              onClick={loadData}
              className="w-full sm:w-auto flex items-center justify-center gap-2 text-sm bg-[#2E9437] text-white px-5 py-3 rounded-2xl shadow-lg"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Actualizar
            </motion.button>
          </div>
        </div>
      </div>

      {/* FILTROS */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-5">
        <div className="flex gap-2 flex-wrap">
          {["Semana", "Mes", "Año"].map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition
              ${
                filtro === f
                  ? "bg-black text-white"
                  : "bg-white text-gray-600 shadow-sm"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {loading ? (
          <div className="space-y-4">
            <div className="h-32 bg-white rounded-3xl animate-pulse" />

            <div className="h-72 bg-white rounded-3xl animate-pulse" />
          </div>
        ) : (
          <>
            {/* KPIS */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4">
              {/* TOTAL */}
              <div className="bg-white p-5 rounded-[30px] shadow-sm border border-gray-100 min-w-0">
                <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center">
                  <Package className="text-red-500" />
                </div>

                <p className="text-3xl font-bold mt-5 break-words">
                  {kpis.total}
                </p>

                <p className="text-sm text-gray-400 mt-1">Total mermas</p>
              </div>

              {/* PRODUCTOS PERDIDOS */}
              <div className="bg-white p-5 rounded-[30px] shadow-sm border border-gray-100 min-w-0">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center">
                  <Trash2 className="text-emerald-600" />
                </div>

                <p className="text-2xl sm:text-3xl font-bold mt-5">
                  {kpis.productosPerdidos}
                </p>

                <p className="text-sm text-gray-400 mt-1">Productos perdidos</p>
              </div>

              {/* PENDIENTES */}
              <div className="bg-white p-5 rounded-[30px] shadow-sm border border-gray-100 min-w-0">
                <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center">
                  <AlertTriangle className="text-amber-500" />
                </div>

                <p className="text-3xl font-bold mt-5">{kpis.pendientes}</p>

                <p className="text-sm text-gray-400 mt-1">Pendientes</p>
              </div>

              {/* SUCURSALES */}
              <div className="bg-white p-5 rounded-[30px] shadow-sm border border-gray-100 min-w-0">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
                  <Building2 className="text-blue-500" />
                </div>

                <p className="text-3xl font-bold mt-5">{kpis.sucursales}</p>

                <p className="text-sm text-gray-400 mt-1">Sucursales</p>
              </div>

              {/* MOTIVO TOP */}
              <div
                className="
  bg-white p-5 rounded-[30px] shadow-sm border border-gray-100 min-w-0
  col-span-2 md:col-span-2 xl:col-span-1
"
              >
                <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center">
                  <Activity className="text-purple-600" />
                </div>

                <p className="text-lg font-bold mt-5 break-words">
                  {kpis.motivoTop}
                </p>

                <p className="text-sm text-gray-400 mt-1">
                  Motivo más frecuente
                </p>
              </div>
            </div>

            {/* GRÁFICAS */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mt-6">
              {/* PIE */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[32px] p-4 sm:p-6 border border-gray-100 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-5">
                  <Activity size={20} className="text-green-600" />

                  <h2 className="font-bold text-gray-900 text-sm sm:text-base">
                    Estado de mermas
                  </h2>
                </div>

                <div className="w-full h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>

                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* TOP SUCURSALES */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[32px] p-4 sm:p-6 border border-gray-100 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-5">
                  <BarChart3 size={20} className="text-blue-600" />

                  <h2 className="font-bold text-gray-900 text-sm sm:text-base">
                    Sucursales con más mermas
                  </h2>
                </div>

                <div className="w-full h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topSucursales}>
                      <CartesianGrid strokeDasharray="3 3" />

                      <XAxis dataKey="tienda" fontSize={10} />

                      <YAxis fontSize={10} />

                      <Tooltip />

                      <Bar
                        dataKey="total"
                        fill="#3b82f6"
                        radius={[10, 10, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>

            {/* BOTONES */}
            <div className="mt-8 flex flex-col gap-4">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() =>
                  navigate("/gestion-mermo", {
                    state: {
                      from: "/home-gestion",
                    },
                  })
                }
                className="
                  w-full
                  p-5
                  rounded-[28px]
                  bg-gradient-to-r
                  from-[#d73c26]
                  to-[#bf331f]
                  text-white
                  shadow-xl
                  border
                  flex
                  items-center
                  gap-4
                "
              >
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center overflow-hidden">
                  <img
                    src={LogoMermo}
                    alt="Mermo AI"
                    className="w-9 h-9 object-contain"
                  />
                </div>

                <div className="flex flex-col items-start">
                  <span className="font-bold text-base">Mermo AI</span>

                  <span className="text-sm text-white/80">
                    Asistente inteligente
                  </span>
                </div>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleLogout}
                className="
                  w-full
                  py-4
                  rounded-2xl
                  bg-white
                  border
                  border-red-100
                  text-red-600
                  font-semibold
                  flex
                  items-center
                  justify-center
                  gap-2
                  shadow-sm
                "
              >
                <LogOut size={18} />
                Cerrar sesión
              </motion.button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
