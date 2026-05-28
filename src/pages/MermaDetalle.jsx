import {
  ChevronLeft,
  AlertTriangle,
  CheckCircle2,
  Store,
  Boxes,
  Hash,
  CalendarDays,
} from "lucide-react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import { api } from "../services/api";

export default function MermaDetalle() {

  const navigate = useNavigate();

  const { id } = useParams();

  const [loading, setLoading] =
    useState(true);

  const [merma, setMerma] =
    useState(null);

  // =========================================
  // MODAL IMAGEN
  // =========================================
  const [
    showImageModal,
    setShowImageModal,
  ] = useState(false);

  const apiUrl =
    import.meta.env
      .VITE_API_BASE_URL;

  // =========================================
  // FETCH
  // =========================================
  const fetchMerma =
    async () => {

      try {

        setLoading(true);

        const res =
          await api.get(
            "/mermas"
          );

        const found =
          res.data?.data?.find(
            (item) =>
              String(item.id) ===
              String(id)
          );

        if (!found) {

          toast.error(
            "Merma no encontrada"
          );

          return;
        }

        console.log("MERMA DETALLE:", found);
        
        setMerma(found);

      } catch (error) {

        console.error(error);

        toast.error(
          "No se pudo cargar la merma"
        );

      } finally {

        setLoading(false);
      }
    };

  useEffect(() => {

    fetchMerma();

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

          <AlertTriangle
            size={40}
            className="mx-auto text-yellow-500 mb-4"
          />

          <h2 className="text-lg font-semibold text-gray-800">
            No se encontró la merma
          </h2>

          <p className="text-sm text-gray-400 mt-2">
            La información no está disponible.
          </p>

          <button
            onClick={() =>
              navigate(-1)
            }
            className="mt-5 bg-black text-white px-5 py-3 rounded-2xl text-sm"
          >
            Volver
          </button>

        </div>

      </div>
    );
  }

  const procesada =
    merma.docSapMerma &&
    merma.docSapMerma.trim() !== "";

  const imageUrl =
    merma.rutaImagenMerma
      ? `${apiUrl}/mermas/image?ruta=${merma.rutaImagenMerma}`
      : "https://placehold.co/600x400/png";

  return (

    <div className="min-h-screen bg-[#f5f6fa] flex justify-center px-3 py-4">

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
        className="w-full max-w-sm"
      >

        {/* HEADER */}
        <div className="flex items-center justify-between mb-5 px-1">

          <button
            onClick={() =>
              navigate(-1)
            }
            className="w-10 h-10 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-center"
          >

            <ChevronLeft
              size={18}
              className="text-gray-700"
            />

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
            {procesada
              ? "Procesada"
              : "Pendiente"}
          </div>

        </div>

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

          <motion.img
            whileTap={{
              scale: 0.98,
            }}
            src={imageUrl}
            alt={merma.producto}
            onClick={() =>
              setShowImageModal(true)
            }
            className="w-full h-64 object-cover cursor-zoom-in"
          />

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">

            <p className="text-white text-lg font-semibold leading-tight">
              {merma.producto}
            </p>

            <div className="flex items-center gap-2 mt-2 flex-wrap">

              <span
                className={`text-[10px] px-2 py-1 rounded-full font-semibold
                ${
                  merma.detalleProducto ===
                  "preparado"
                    ? "bg-blue-500/90 text-white"
                    : "bg-orange-500/90 text-white"
                }
              `}
              >
                {merma.detalleProducto ||
                  "Sin tipo"}
              </span>

              <span className="text-[10px] bg-white/20 backdrop-blur-md text-white px-2 py-1 rounded-full">

                {merma.cantidadICG} unidades

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

            {/* PRODUCTO */}
            <div className="flex items-start gap-3">

              <div className="w-11 h-11 rounded-2xl bg-gray-100 flex items-center justify-center">

                <Boxes
                  size={18}
                  className="text-gray-700"
                />

              </div>

              <div>

                <p className="text-[11px] uppercase tracking-wide text-gray-400">
                  Producto
                </p>

                <p className="text-sm font-semibold text-gray-900 mt-1">
                  {merma.producto}
                </p>

              </div>

            </div>

            {/* TIENDA */}
            <div className="flex items-start gap-3">

              <div className="w-11 h-11 rounded-2xl bg-blue-100 flex items-center justify-center">

                <Store
                  size={18}
                  className="text-blue-700"
                />

              </div>

              <div>

                <p className="text-[11px] uppercase tracking-wide text-gray-400">
                  Tienda
                </p>

                <p className="text-sm font-semibold text-gray-900 mt-1">
                  {merma.nombreTienda}
                </p>

              </div>

            </div>

            {/* MOTIVO */}
            <div className="flex items-start gap-3">

              <div className="w-11 h-11 rounded-2xl bg-red-100 flex items-center justify-center">

                <AlertTriangle
                  size={18}
                  className="text-red-700"
                />

              </div>

              <div>

                <p className="text-[11px] uppercase tracking-wide text-gray-400">
                  Motivo
                </p>

                <p className="text-sm font-semibold text-gray-900 mt-1">
                  {merma.selectMotivo}
                </p>

              </div>

            </div>

            {/* FECHA */}
            <div className="flex items-start gap-3">

              <div className="w-11 h-11 rounded-2xl bg-yellow-100 flex items-center justify-center">

                <CalendarDays
                  size={18}
                  className="text-yellow-700"
                />

              </div>

              <div>

                <p className="text-[11px] uppercase tracking-wide text-gray-400">
                  Fecha de registro
                </p>

                <p className="text-sm font-semibold text-gray-900 mt-1">
                  {new Date(
                    merma.fechaHoraActual
                  ).toLocaleString(
                    "es-CO"
                  )}
                </p>

              </div>

            </div>

            {/* USUARIO */}
            <div className="flex items-start gap-3">

              <div className="w-11 h-11 rounded-2xl bg-green-100 flex items-center justify-center">

                <Hash
                  size={18}
                  className="text-green-700"
                />

              </div>

              <div>

                <p className="text-[11px] uppercase tracking-wide text-gray-400">
                  Registrado por
                </p>

                <p className="text-sm font-semibold text-gray-900 mt-1">
                  {merma.grabado ||
                    "N/A"}
                </p>

              </div>

            </div>

            {/* DOCUMENTO SAP */}
            {procesada && (

              <div className="flex items-start gap-3">

                <div className="w-11 h-11 rounded-2xl bg-emerald-100 flex items-center justify-center">

                  <CheckCircle2
                    size={18}
                    className="text-emerald-700"
                  />

                </div>

                <div>

                  <p className="text-[11px] uppercase tracking-wide text-gray-400">
                    Documento SAP
                  </p>

                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    {merma.docSapMerma}
                  </p>

                </div>

              </div>

            )}

          </div>

        </motion.div>

        {/* BOTON */}
        <motion.button
          whileTap={{
            scale: 0.98,
          }}
          onClick={() =>
            navigate(-1)
          }
          className="w-full bg-black text-white py-4 rounded-2xl font-medium shadow-lg shadow-black/10"
        >
          Volver al historial
        </motion.button>

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
            onClick={() =>
              setShowImageModal(false)
            }
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
              alt={merma.producto}
              onClick={(e) =>
                e.stopPropagation()
              }
              className="max-w-full max-h-full rounded-[32px] object-contain"
            />

          </motion.div>

        )}

      </AnimatePresence>

    </div>
  );
}