import { useState } from "react";

import {
  ChevronLeft,
  AlertTriangle,
  FileCheck2,
  Trash2,
  Store,
  CheckCircle2,
} from "lucide-react";

import NavbarDitzia from "../../components/NavbarDitzia";

import { useLocation, useNavigate } from "react-router-dom";

import { motion, AnimatePresence } from "framer-motion";

import toast, { Toaster } from "react-hot-toast";

import { api } from "../../services/api";

export default function GestorDetails() {
  const navigate = useNavigate();

  const { state } = useLocation();

  const [processing, setProcessing] = useState(false);

  const [sapDocument, setSapDocument] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [showImageModal, setShowImageModal] = useState(false);

  const apiUrl = import.meta.env.VITE_BASE_URL;

  if (!state) {
    return (
      <div className="min-h-screen bg-[#f6f7fb] flex items-center justify-center px-6">
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

  const { merma, menus = [] } = state;
  console.log("MERMA:", merma);
  console.log("MENUS:", menus);

  // =========================================
  // PROCESAR
  // =========================================
  const handleProcess = async () => {
    if (!sapDocument.trim()) {
      toast.error("Documento SAP obligatorio");

      return;
    }

    try {
      setProcessing(true);

      await api.patch(`/mermas/${merma.id}`, {
        DocSapMerma: sapDocument,
      });

      toast.success("Merma procesada");

      navigate(-1);
    } catch {
      toast.error("No se pudo procesar");
    } finally {
      setProcessing(false);
    }
  };

  // =========================================
  // ELIMINAR
  // =========================================
  const handleDelete = async () => {
    try {
      await api.delete(`/mermas/${merma.id}`);

      toast.success("Merma eliminada");

      navigate(-1);
    } catch {
      toast.error("No se pudo eliminar");
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f6fa] flex justify-center px-3 py-4 pb-32">
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
        className="w-full max-w-sm lg:max-w-6xl mx-auto"
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
              Gestión
            </p>

            <h1 className="text-lg font-semibold text-gray-900">
              Detalle de merma
            </h1>
          </div>

          <div
            className={`px-3 py-1 rounded-full text-[10px] font-semibold
            ${
              merma?.docSapMerma
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }
          `}
          >
            {merma?.docSapMerma ? "Procesada" : "Pendiente"}
          </div>
        </div>
        <div className="lg:grid lg:grid-cols-2 lg:gap-6">
          <div>
            {/* IMAGEN */}
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.96,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                delay: 0.05,
              }}
              className="relative overflow-hidden rounded-[28px] bg-white border border-gray-200 shadow-sm mb-4"
            >
              <div
                onClick={() => setShowImageModal(true)}
                className="relative overflow-hidden cursor-zoom-in group"
              >
                <img
                  src={
                    merma?.rutaImagenMerma
                      ? `${import.meta.env.VITE_API_URL}/mermas/image?ruta=${merma.rutaImagenMerma}`
                      : "https://placehold.co/600x400/png"
                  }
                  alt="Merma"
                  className="
                    w-full h-72 object-cover
                    transition-transform duration-500
                    group-hover:scale-110
                    active:scale-110
                  "
                />

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
              </div>

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <p className="text-white text-lg font-semibold leading-tight">
                  {merma?.producto}
                </p>

                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span
                    className={`text-[10px] px-2 py-1 rounded-full font-semibold
                    ${
                      merma?.detalleProducto === "preparado"
                        ? "bg-blue-500/90 text-white"
                        : "bg-orange-500/90 text-white"
                    }
                  `}
                  >
                    {merma?.detalleProducto || "Sin tipo"}
                  </span>

                  <span className="text-[10px] bg-white/20 backdrop-blur-md text-white px-2 py-1 rounded-full">
                    {merma?.cantidadICG} {merma?.unidadMedidaICG}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* INFO */}
            <motion.div
              initial={{
                opacity: 0,
                y: 14,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.08,
              }}
              className="bg-white rounded-[28px] border border-gray-200 shadow-sm p-5 mb-4"
            >
              <div className="space-y-5">
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-1">
                    Producto
                  </p>

                  <p className="text-sm font-semibold text-gray-900">
                    {merma?.producto}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-1">
                      Cantidad
                    </p>

                    <p className="text-sm font-semibold text-gray-900">
                      {merma?.cantidadICG} {merma?.unidadMedidaICG}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-1">
                      Tipo
                    </p>

                    <p className="text-sm font-semibold text-gray-900 capitalize">
                      {merma?.detalleProducto || "N/A"}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-1">
                    Motivo
                  </p>

                  <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-3 py-2 rounded-2xl text-sm font-medium">
                    <AlertTriangle size={15} />

                    {merma?.selectMotivo}
                  </div>
                </div>

                <div>
                  <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-1">
                    Tienda
                  </p>

                  <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-2xl text-sm font-medium">
                    <Store size={15} />

                    {merma?.nombreTienda}
                  </div>
                </div>

                <div>
                  <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-1">
                    Registrado por
                  </p>

                  <p className="text-sm font-semibold text-gray-900">
                    {merma?.grabado || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-1">
                    Fecha
                  </p>

                  <p className="text-sm font-semibold text-gray-900">
                    {merma?.fechaHoraActual
                      ? new Date(merma.fechaHoraActual).toLocaleString("es-CO")
                      : "N/A"}
                  </p>
                </div>

                {merma?.docSapMerma && (
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-1">
                      Documento SAP
                    </p>

                    <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-2 rounded-2xl text-sm font-semibold">
                      <CheckCircle2 size={15} />

                      {merma.docSapMerma}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>  
        

          <div>
            {menus.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-[28px] border border-gray-200 shadow-sm p-5 mb-4"
              >
                <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-4">
                  Explosión de receta ({menus.length} componentes)
                </p>

                <div className="space-y-3">
                  {menus.map((item, index) => (
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
                            {item.statusProd === 1 ? "Materia Prima" : "Insumo"}
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

            {/* PROCESAR */}
            {!merma?.docSapMerma && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 14,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.12,
                }}
                className="bg-white rounded-[28px] border border-gray-200 shadow-sm p-5 mb-4"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-3xl bg-green-100 flex items-center justify-center">
                    <FileCheck2 size={30} className="text-green-600" />
                  </div>
                </div>

                <h2 className="text-center text-lg font-bold text-gray-900">
                  Procesar merma
                </h2>

                <p className="text-sm text-gray-400 text-center mt-1">
                  Ingresa el documento SAP
                </p>

                <input
                  value={sapDocument}
                  onChange={(e) => setSapDocument(e.target.value)}
                  placeholder="Documento SAP"
                  className="w-full bg-[#f6f7fb] border border-gray-100 rounded-2xl p-4 outline-none text-sm mt-5"
                />

                <button
                  disabled={processing}
                  onClick={handleProcess}
                  className="w-full mt-4 bg-black text-white py-4 rounded-2xl font-medium shadow-lg disabled:opacity-60"
                >
                  {processing ? "Procesando..." : "Procesar merma"}
                </button>
              </motion.div>
            )}

            {/* BOTÓN ELIMINAR */}
            <div className="pb-24">
              <motion.button
                whileTap={{
                  scale: 0.98,
                }}
                onClick={() => setShowDeleteModal(true)}
                className="w-full bg-red-500 text-white py-4 rounded-2xl font-medium shadow-lg"
              >
                Eliminar merma
              </motion.button>
            </div>
          </div>
        </div>  
      </motion.div>

      {/* MODAL IMAGEN */}
      <AnimatePresence>
        {showImageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowImageModal(false)}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
              src={
                merma?.rutaImagenMerma
                  ? `${apiUrl}/mermas/image?ruta=${merma.rutaImagenMerma}`
                  : "https://placehold.co/600x400/png"
              }
              alt="Merma"
              onClick={(e) => e.stopPropagation()}
              className="
                max-w-full
                max-h-[90vh]
                object-contain
                rounded-3xl
                shadow-2xl
              "
            />

            <button
              onClick={() => setShowImageModal(false)}
              className="
                absolute top-5 right-5
                bg-white/10 hover:bg-white/20
                backdrop-blur-md
                text-white
                px-4 py-2
                rounded-2xl
                text-sm
              "
            >
              Cerrar
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NAVBAR */}
      <NavbarDitzia />

      {/* MODAL ELIMINAR */}
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
                  <div className="w-24 h-24 rounded-[30px] bg-gradient-to-br from-red-100 to-red-50 border border-red-200 flex items-center justify-center shadow-lg">
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
                    className="flex-1 py-3 rounded-2xl bg-gray-100 text-gray-700 font-semibold"
                  >
                    Cancelar
                  </button>

                  <button
                    onClick={handleDelete}
                    className="flex-1 py-3 rounded-2xl bg-red-500 text-white font-semibold shadow-lg"
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
