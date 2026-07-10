import {
  ChevronLeft,
  AlertTriangle,
  CheckCircle2,
  Store,
  Boxes,
  Hash,
  CalendarDays,
  Trash2,
} from "lucide-react";

import { useNavigate, useParams, useLocation } from "react-router-dom";

import { motion, AnimatePresence } from "framer-motion";

import { useEffect, useState } from "react";

import toast, { Toaster } from "react-hot-toast";

import { api } from "../services/api";

export default function MermaDetalle() {
  const navigate = useNavigate();

  const { id } = useParams();

  const location = useLocation();

  const [loading, setLoading] = useState(true);

  const [merma, setMerma] = useState(location.state || null);

  // =========================================
  // MODAL IMAGEN
  // =========================================
  const [showImageModal, setShowImageModal] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const apiUrl = "http://192.168.212.8:8080";

  // =========================================
  // FETCH
  // =========================================
  const fetchMerma = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/mermas`);

      const found = res.data?.data?.find(
        (item) => String(item.merma?.id) === String(id),
      );

      if (!found) {
        toast.error("Merma no encontrada");

        return;
      }

      console.log("FOUND:", found);
      console.log("FOUND MENUS:", found?.menus);

      setMerma(found);
    } catch (error) {
      console.error(error);

      toast.error("No se pudo cargar la merma");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/mermas/${detalle.id}`);

      toast.success("Merma eliminada");

      navigate(-1);
    } catch (error) {
      console.error(error);

      toast.error("No se pudo eliminar");
    }
  };

  useEffect(() => {
    if (location.state) {
      setLoading(false);
    } else {
      fetchMerma();
    }
  }, [id]);

  // =========================================
  // LOADING
  // =========================================
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f6fa] flex items-center justify-center">
        <div className="animate-pulse bg-white rounded-3xl w-[360px] h-[620px]" />
      </div>
    );
  }

  // =========================================
  // NOT FOUND
  // =========================================
  if (!merma) {
    return (
      <div className="min-h-screen bg-[#f5f6fa] flex items-center justify-center px-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm text-center max-w-sm">
          <AlertTriangle size={40} className="mx-auto text-yellow-500 mb-4" />

          <h2 className="text-lg font-semibold text-gray-800">
            No se encontró la merma
          </h2>

          <p className="text-sm text-gray-400 mt-2">
            La información no está disponible.
          </p>

          <button
            onClick={() => navigate(-1)}
            className="mt-5 bg-black text-white px-5 py-3 rounded-2xl text-sm"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  const detalle = merma.merma || merma;
  console.log("DETALLE:", detalle);

  const receta = merma.menus || [];
  console.log("RECETA:", receta);

  const procesada = detalle?.docSapMerma && detalle.docSapMerma.trim() !== "";

  const imageUrl = detalle.rutaImagenMerma
    ? `${apiUrl}/mermas/image?ruta=${detalle.rutaImagenMerma}`
    : "https://placehold.co/600x400/png";

  return (
    <div className="min-h-screen bg-[#f5f6fa] flex justify-center px-3 py-4">
      <Toaster position="top-center" />
      <motion.div
        initial={{
          opacity: 0,
          y: 18,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.35,
        }}
        className="w-full max-w-sm lg:max-w-7xl"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between mb-5 px-1">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-center"
          >
            <ChevronLeft size={18} className="text-gray-700" />
          </button>

          <div className="text-center">
            <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400">
              Historial
            </p>

            <h1 className="text-lg font-semibold text-gray-900">
              Detalle de merma
            </h1>
          </div>

          <div
            className={`px-3 py-1 rounded-full text-[10px] font-semibold
            ${
              procesada
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }
          `}
          >
            {procesada ? "Procesada" : "Pendiente"}
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-2 lg:gap-6">
          {/* =========================================
              COLUMNA IZQUIERDA
          ========================================= */}
          <div>
            {/* IMAGEN */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 }}
              className="relative overflow-hidden rounded-[28px] bg-white border border-gray-200 shadow-sm mb-4"
            >
              <motion.img
                whileTap={{ scale: 0.98 }}
                src={imageUrl}
                alt={detalle.producto}
                onClick={() => setShowImageModal(true)}
                className="w-full h-64 lg:h-[420px] object-cover cursor-zoom-in"
              />

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <p className="text-white text-lg font-semibold leading-tight">
                  {detalle.producto}
                </p>

                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span
                    className={`text-[10px] px-2 py-1 rounded-full font-semibold
                    ${
                      detalle.detalleProducto === "preparado"
                        ? "bg-blue-500/90 text-white"
                        : "bg-orange-500/90 text-white"
                    }`}
                  >
                    {detalle.detalleProducto || "Sin tipo"}
                  </span>

                  <span className="text-[10px] bg-white/20 backdrop-blur-md text-white px-2 py-1 rounded-full">
                    {detalle.cantidadICG} {detalle.unidadMedidaICG || "Und"}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* RECETA SOLO DESKTOP */}
            <div className="hidden lg:block">
              {receta.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-[28px] border border-gray-200 shadow-sm p-5"
                >
                  <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-4">
                    Explosión de receta ({receta.length} componentes)
                  </p>

                  <div className="space-y-3">
                    {receta.map((item, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 rounded-2xl p-4 border border-gray-100"
                      >
                        <div className="flex justify-between items-start gap-3">
                          <div className="flex-1">
                            <p className="font-semibold text-sm text-gray-900">
                              {item.nombreProd}
                            </p>

                            <p className="text-xs text-gray-500 mt-1">
                              Código agrupación: {item.codigoBarraAgrupacion}
                            </p>

                            <p className="text-xs text-gray-500">
                              Descripción receta: {item.descripcionProd}
                            </p>

                            <p className="text-xs text-gray-500">
                              Status:{" "}
                              {item.statusProd === 1
                                ? "Materia Prima"
                                : "Insumo"}
                            </p>
                          </div>

                          <div className="bg-white px-3 py-1 rounded-full text-xs font-semibold border">
                            {item.cantidadProd} {item.unidad}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* =========================================
              COLUMNA DERECHA
          ========================================= */}
          <div>
            {/* INFO */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="bg-white rounded-[28px] border border-gray-200 shadow-sm p-5 mb-4"
            >
              <div className="space-y-5">
                {/* PRODUCTO */}
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gray-100 flex items-center justify-center">
                    <Boxes size={18} className="text-gray-700" />
                  </div>

                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-gray-400">
                      Producto
                    </p>

                    <p className="text-sm font-semibold text-gray-900 mt-1">
                      {detalle.producto}
                    </p>
                  </div>
                </div>

                {/* CANTIDAD */}
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-purple-100 flex items-center justify-center">
                    <Hash size={18} className="text-purple-700" />
                  </div>

                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-gray-400">
                      Cantidad
                    </p>

                    <p className="text-sm font-semibold text-gray-900 mt-1">
                      {detalle.cantidadICG} {detalle.unidadMedidaICG || "Und"}
                    </p>
                  </div>
                </div>

                {/* TIENDA */}
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-blue-100 flex items-center justify-center">
                    <Store size={18} className="text-blue-700" />
                  </div>

                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-gray-400">
                      Tienda
                    </p>

                    <p className="text-sm font-semibold text-gray-900 mt-1">
                      {detalle.nombreTienda}
                    </p>
                  </div>
                </div>

                {/* MOTIVO */}
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-red-100 flex items-center justify-center">
                    <AlertTriangle size={18} className="text-red-700" />
                  </div>

                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-gray-400">
                      Motivo
                    </p>

                    <p className="text-sm font-semibold text-gray-900 mt-1">
                      {detalle.selectMotivo}
                    </p>
                  </div>
                </div>

                {/* FECHA */}
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-yellow-100 flex items-center justify-center">
                    <CalendarDays size={18} className="text-yellow-700" />
                  </div>

                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-gray-400">
                      Fecha de registro
                    </p>

                    <p className="text-sm font-semibold text-gray-900 mt-1">
                      {new Date(detalle.fechaHoraActual).toLocaleString(
                        "es-CO",
                      )}
                    </p>
                  </div>
                </div>

                {/* USUARIO */}
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-green-100 flex items-center justify-center">
                    <Hash size={18} className="text-green-700" />
                  </div>

                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-gray-400">
                      Registrado por
                    </p>

                    <p className="text-sm font-semibold text-gray-900 mt-1">
                      {detalle.grabado || "N/A"}
                    </p>
                  </div>
                </div>

                {/* DOCUMENTO SAP */}
                {procesada && (
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-100 flex items-center justify-center">
                      <CheckCircle2 size={18} className="text-emerald-700" />
                    </div>

                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-gray-400">
                        Documento SAP
                      </p>

                      <p className="text-sm font-semibold text-gray-900 mt-1">
                        {detalle.docSapMerma}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* RECETA SOLO MÓVIL */}
            <div className="lg:hidden">
              {receta.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-[28px] border border-gray-200 shadow-sm p-5 mb-4"
                >
                  <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-4">
                    Explosión de receta ({receta.length} componentes)
                  </p>

                  <div className="space-y-3">
                    {receta.map((item, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 rounded-2xl p-4 border border-gray-100"
                      >
                        <div className="flex justify-between items-start gap-3">
                          <div className="flex-1">
                            <p className="font-semibold text-sm text-gray-900">
                              {item.nombreProd}
                            </p>

                            <p className="text-xs text-gray-500 mt-1">
                              Código agrupación: {item.codigoBarraAgrupacion}
                            </p>

                            <p className="text-xs text-gray-500">
                              Descripción receta: {item.descripcionProd}
                            </p>

                            <p className="text-xs text-gray-500">
                              Status:{" "}
                              {item.statusProd === 1
                                ? "Materia Prima"
                                : "Insumo"}
                            </p>
                          </div>

                          <div className="bg-white px-3 py-1 rounded-full text-xs font-semibold border">
                            {item.cantidadProd} {item.unidad}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* BOTÓN ELIMINAR */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowDeleteModal(true)}
              className="w-full bg-red-500 text-white py-4 rounded-2xl font-medium shadow-lg"
            >
              Eliminar merma
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* =========================================
      MODAL IMAGEN
      ========================================= */}
      <AnimatePresence>
        {showImageModal && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            onClick={() => setShowImageModal(false)}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.img
              initial={{
                scale: 0.85,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              exit={{
                scale: 0.85,
                opacity: 0,
              }}
              transition={{
                type: "spring",
                damping: 20,
              }}
              src={imageUrl}
              alt={detalle.producto}
              onClick={(e) => e.stopPropagation()}
              className="max-w-full max-h-full rounded-[32px] object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4"
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.85,
                y: 40,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
              }}
              transition={{
                type: "spring",
                damping: 18,
              }}
              className="bg-white rounded-[32px] overflow-hidden shadow-2xl w-full max-w-sm"
            >
              <div className="h-1.5 bg-red-500" />

              <div className="p-6">
                <div className="flex justify-center mb-5">
                  <div
                    className="
                w-24 h-24
                rounded-[30px]
                bg-gradient-to-br
                from-red-100
                to-red-50
                border
                border-red-200
                flex
                items-center
                justify-center
                shadow-lg
              "
                  >
                    <Trash2 size={46} className="text-red-600" />
                  </div>
                </div>

                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Eliminar merma
                  </h2>

                  <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                    Esta acción no se puede deshacer.
                  </p>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="
                flex-1
                py-3
                rounded-2xl
                bg-gray-100
                text-gray-700
                font-semibold
              "
                  >
                    Cancelar
                  </button>

                  <button
                    onClick={handleDelete}
                    className="
                flex-1
                py-3
                rounded-2xl
                bg-red-500
                text-white
                font-semibold
                shadow-lg
              "
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
