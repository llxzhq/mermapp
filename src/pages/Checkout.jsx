import { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ChevronLeft,
  Camera,
  Plus,
  Minus,
  Coffee,
  Package,
  CheckCircle2,
  ServerCrash,
  Search,
  AlertTriangle,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

import LogoMermas from "../assets/images/logotipo_mermas.png";

import { api } from "../services/api";

export default function Checkout() {
  const navigate = useNavigate();

  const location = useLocation();

  // =========================================
  // STATES
  // =========================================
  const [tipo, setTipo] = useState(null);

  const [menus, setMenus] = useState([]);

  const [rawMaterials, setRawMaterials] = useState([]);

  const [producto, setProducto] = useState(null);

  const [motivo, setMotivo] = useState(null);

  const [motivos, setMotivos] = useState([]);

  const [unidad, setUnidad] = useState("unidades");

  const [cantidad, setCantidad] = useState("1");

  const [cantidadTouched, setCantidadTouched] = useState(false);

  const [imageFile, setImageFile] = useState(null);

  const [saving, setSaving] = useState(false);

  const [loadingMotivos, setLoadingMotivos] = useState(false);

  const [loadingProducts, setLoadingProducts] = useState(false);

  const [productSearch, setProductSearch] = useState("");

  const [showProducts, setShowProducts] = useState(false);

  const [showSuccessCard, setShowSuccessCard] = useState(false);

  const [savedData, setSavedData] = useState(null);

  const [productoExtra, setProductoExtra] = useState({
    codigoSAP: "",
    precio: "",
  });

  // =========================================
  // BRANCH
  // =========================================
  const branch = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("branch") || "{}");
    } catch {
      return {};
    }
  }, []);

  const idTienda = branch?.idTienda;

  const ruta = branch?.ruta;

    // =========================================
  // CONTROL NAVBAR
  // =========================================
  useEffect(() => {

    navigate(location.pathname, {
      replace: true,
      state: {
        hideNavbar: tipo !== null,
      },
    });

  }, [tipo]);

  // =========================================
  // VALIDAR SESIÓN
  // =========================================
  useEffect(() => {
    if (!idTienda || ruta == null) {
      navigate("/select-branch");
    }
  }, [idTienda, ruta, navigate]);

  // =========================================
  // PRODUCTOS
  // =========================================
  useEffect(() => {
    if (!tipo || !idTienda) return;

    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);

        if (tipo === "preparado") {
          const res = await api.get(
            `/mermas/menus-coffee?idTienda=${idTienda}`,
          );

          setMenus(res.data?.data || []);

          setRawMaterials([]);
        }

        if (tipo === "materia") {
          const res = await api.get(
            `/mermas/modifiers-raw-materials?IdTienda=${idTienda}`,
          );

          setRawMaterials(res.data?.data || []);

          setMenus([]);
        }
      } catch (err) {
        console.error("ERROR PRODUCTOS:", err);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [tipo, idTienda]);

  // =========================================
  // VALIDAR UNIDADES
  // =========================================
  useEffect(() => {
    const current = Number(cantidad);

    if (Number.isNaN(current)) return;

    if (unidad === "unidades") {
      const fixed = Math.max(1, Math.round(current));

      if (String(fixed) !== cantidad) {
        setCantidad(String(fixed));
      }
    } else {
      const fixed = Math.max(0.1, Math.round(current * 10) / 10);

      if (String(fixed) !== cantidad) {
        setCantidad(String(fixed));
      }
    }
  }, [unidad]);

  // =========================================
  // CERRAR DROPDOWN
  // =========================================
  useEffect(() => {
    const handleClickOutside = () => setShowProducts(false);

    window.addEventListener("click", handleClickOutside);

    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  // =========================================
  // FILTRAR PRODUCTOS
  // =========================================
  const filteredProducts = useMemo(() => {
    const source = tipo === "materia" ? rawMaterials : menus;

    return source.filter((m) => {
      const nombre = tipo === "materia" ? m.nombreProd : m.nombre;

      return nombre?.toLowerCase().includes(productSearch.toLowerCase());
    });
  }, [menus, rawMaterials, productSearch, tipo]);

  // =========================================
  // SELECT PRODUCTO
  // =========================================
  const handleSelectProducto = async (prod) => {
    setProducto(prod);

    setMotivo(null);

    setLoadingMotivos(true);

    if (tipo === "materia") {
      setProductoExtra({
        codigoSAP: prod.codigoProd || "",
        precio: prod.costo || "",
      });

      setMotivos([
        {
          value: "Merma",
          text: "Merma",
        },
      ]);

      setLoadingMotivos(false);

      return;
    }

    setProductoExtra({
      codigoSAP: prod.codigoSAP || prod.codigo || "",
      precio: prod.precio ?? prod.precioSugerido ?? "",
    });

    try {
      const res = await api.get(
        `/mermas/modifiers-prepared-products?Nombre=${encodeURIComponent(
          prod.nombre,
        )}&IdMenu=${prod.idMenu}&IdTienda=${idTienda}`,
      );

      const data = res.data?.data?.[0] || {};

      setMotivos(data.select3 || []);
    } catch (err) {
      console.error(err);

      setMotivos([]);
    } finally {
      setLoadingMotivos(false);
    }
  };

  // =========================================
  // VALIDACIONES
  // =========================================
  const quantityNumber = Number(cantidad);

  const isQuantityValid =
    cantidad !== "" &&
    !Number.isNaN(quantityNumber) &&
    (unidad === "unidades"
      ? Number.isInteger(quantityNumber) && quantityNumber > 0
      : quantityNumber > 0);

  const quantityError =
    cantidadTouched && !isQuantityValid
      ? unidad === "unidades"
        ? "Debe ser un entero mayor a 0"
        : "Debe ser un número mayor a 0"
      : "";

  const isValid =
    tipo && producto && motivo && imageFile && isQuantityValid && !saving;

  const stepValue = unidad === "unidades" ? 1 : 0.1;

  // =========================================
  // AUMENTAR
  // =========================================
  const handleIncrease = () => {
    const current = Number(cantidad || 0);

    const next = unidad === "unidades" ? current + 1 : current + stepValue;

    setCantidad(
      unidad === "unidades"
        ? String(Math.max(1, Math.round(next)))
        : String(Math.round(next * 10) / 10),
    );

    setCantidadTouched(true);
  };

  // =========================================
  // DISMINUIR
  // =========================================
  const handleDecrease = () => {
    const current = Number(cantidad || 0);

    const next = unidad === "unidades" ? current - 1 : current - stepValue;

    setCantidad(
      unidad === "unidades"
        ? String(Math.max(1, Math.round(next)))
        : String(Math.max(0.1, Math.round(next * 10) / 10)),
    );

    setCantidadTouched(true);
  };

  // =========================================
  // GUARDAR
  // =========================================
  const handleSave = async () => {
    setCantidadTouched(true);

    if (!isValid) return;

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("NombreTienda", branch.tienda || "");

      formData.append(
        "Producto",
        tipo === "materia" ? producto?.nombreProd : producto?.nombre || "",
      );

      formData.append("CantidadICG", quantityNumber.toString());

      formData.append("Unidad", unidad);

      formData.append("SelectMotivo", motivo?.text || "");

      formData.append("ImagenMerma", imageFile);

      formData.append("DetalleProducto", tipo);

      formData.append("Grabado", "lhernandez.trainee");

      formData.append("UnidadMedidaICG", "Gr");

      formData.append("IdTienda", idTienda);

      const res = await api.post("/mermas/insert-merma", formData);

      const responseData = res.data?.data?.[0];

      setSavedData({
        ...responseData,
        codigoSAP: productoExtra.codigoSAP,
        precio: productoExtra.precio,
        unidad,
        success: true,
      });

      setShowSuccessCard(true);
    } catch (err) {
      console.error(err);

      setSavedData({
        success: false,
      });

      setShowSuccessCard(true);
    } finally {
      setSaving(false);
    }
  };

  // =========================================
  // SUCCESS CARD
  // =========================================
  const SuccessCard = () => {
    if (!showSuccessCard) return null;

    const success = savedData?.success;

    return (
      <AnimatePresence>
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
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4"
        >
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9,
              y: 30,
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
            className="w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden"
          >
            <div
              className={`h-2 w-full ${
                success ? "bg-green-500" : "bg-red-500"
              }`}
            />

            <div className="p-6">
              <div className="flex justify-center mb-5">
                <div
                  className={`w-24 h-24 rounded-[28px] flex items-center justify-center
                    ${success ? "bg-green-100" : "bg-red-100"}
                  `}
                >
                  {success ? (
                    <CheckCircle2 size={48} className="text-green-600" />
                  ) : (
                    <ServerCrash size={48} className="text-red-600" />
                  )}
                </div>
              </div>

              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {success ? "Merma registrada" : "Servidor no disponible"}
                </h2>

                <p className="text-sm text-gray-500 mt-2">
                  {success
                    ? "La información fue guardada correctamente."
                    : "No se pudo conectar con el servidor."}
                </p>
              </div>

              <button
                onClick={() => {
                  setShowSuccessCard(false);

                  if (success) {
                    navigate("/home");
                  }
                }}
                className={`mt-6 w-full py-3 rounded-2xl font-semibold transition
                  ${success ? "bg-black text-white" : "bg-red-500 text-white"}
                `}
              >
                {success ? "Continuar" : "Cerrar"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <>
      <SuccessCard />

      <div className="min-h-screen bg-[#f5f6fa] flex justify-center px-4 lg:px-6 overflow-x-hidden">
        {/* 🔥 CONTENEDOR MÁS GRANDE */}
        <div className="w-full max-w-5xl">
          {/* ========================================= */}
          {/* HEADER */}
          {/* ========================================= */}
          <div className="px-4 pt-6 pb-6">
            <AnimatePresence mode="wait">
              {tipo && (
                <motion.button
                  key="back"
                  initial={{
                    opacity: 0,
                    x: -8,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  exit={{
                    opacity: 0,
                    x: -8,
                  }}
                  onClick={() => {
                    setTipo(null);

                    setProducto(null);

                    setMotivo(null);

                    setMotivos([]);

                    setImageFile(null);

                    setCantidad("1");

                    setCantidadTouched(false);

                    setProductSearch("");
                  }}
                  className="mb-5 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black transition"
                >
                  <ChevronLeft size={18} />
                  Volver
                </motion.button>
              )}
            </AnimatePresence>

            {/* LOGO + SUCURSAL */}
            <div className="flex flex-col items-center">
              <img src={LogoMermas} className="w-36 opacity-95" />

              <div className="mt-3 bg-white border border-gray-200 shadow-sm rounded-2xl px-5 py-2">
                <p className="text-sm font-medium text-gray-700 text-center">
                  {branch?.tienda}
                </p>
              </div>
            </div>

            {/* TITULOS */}
            <div className="mt-7">
              <p className="text-xs uppercase tracking-[0.25em] text-gray-400">
                Registro
              </p>

              <h1 className="text-2xl font-bold text-gray-900 mt-1">
                Nueva merma
              </h1>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {/* ========================================= */}
            {/* TIPO */}
            {/* ========================================= */}
            {!tipo ? (
              <motion.div
                key="tipo"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
              >
                <p className="text-base font-semibold text-gray-700 mb-5">
                  Tipo de merma
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* PREPARADO */}
                  <motion.div
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setTipo("preparado")}
                    className="bg-white p-6 rounded-3xl cursor-pointer border border-gray-200 shadow-sm hover:shadow-md transition"
                  >
                    <div className="w-14 h-14 bg-[#f8f8f8] rounded-2xl flex items-center justify-center mb-4 border border-gray-100">
                      <Coffee className="text-[#8B5E3C]" size={24} />
                    </div>

                    <h2 className="text-lg font-bold text-gray-900">
                      Producto preparado
                    </h2>

                    <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                      Registra bebidas o productos listos para consumo.
                    </p>
                  </motion.div>

                  {/* MATERIA */}
                  <motion.div
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setTipo("materia")}
                    className="bg-white p-6 rounded-3xl cursor-pointer border border-gray-200 shadow-sm hover:shadow-md transition"
                  >
                    <div className="w-14 h-14 bg-[#f8f8f8] rounded-2xl flex items-center justify-center mb-4 border border-gray-100">
                      <Package className="text-[#2E9437]" size={24} />
                    </div>

                    <h2 className="text-lg font-bold text-gray-900">
                      Materia prima
                    </h2>

                    <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                      Registra ingredientes o inventario sin preparar.
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              /* ========================================= */
              /* FORM */
              /* ========================================= */
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 36 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -36 }}
              >
                {/* 🔥 GRID RESPONSIVE */}
                <div className="grid grid-cols-1 xl:grid-cols-[380px_1fr] gap-6">
                  {/* ========================================= */}
                  {/* LEFT */}
                  {/* ========================================= */}
                  <div className="space-y-5">
                    {/* IMAGEN */}
                    <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm">
                      <p className="text-sm font-semibold text-gray-700 mb-4">
                        Evidencia fotográfica
                      </p>

                      <label className="block h-72 bg-[#f7f8fa] rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer overflow-hidden hover:border-black transition">
                        <input
                          type="file"
                          hidden
                          onChange={(e) =>
                            setImageFile(e.target.files[0] || null)
                          }
                        />

                        {imageFile ? (
                          <img
                            src={URL.createObjectURL(imageFile)}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex flex-col items-center gap-3 text-gray-400">
                            <Camera size={28} />

                            <span className="text-sm">Agregar imagen</span>
                          </div>
                        )}
                      </label>
                    </div>

                    {/* INFO EXTRA */}
                    {(productoExtra.codigoSAP || productoExtra.precio) && (
                      <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm">
                        <p className="text-sm font-semibold text-gray-700 mb-4">
                          Información del producto
                        </p>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-400">
                              Código SAP
                            </span>

                            <span className="font-semibold text-sm">
                              {productoExtra.codigoSAP || "N/A"}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-400">
                              Precio
                            </span>

                            <span className="font-semibold text-sm">
                              {productoExtra.precio || "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ========================================= */}
                  {/* RIGHT */}
                  {/* ========================================= */}
                  <div className="space-y-5">
                    {/* PRODUCTO */}
                    <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm">
                      <p className="text-sm font-semibold text-gray-700 mb-4">
                        Producto
                      </p>

                      <div className="relative">
                        <input
                          value={productSearch}
                          onChange={(e) => {
                            setProductSearch(e.target.value);
                            setShowProducts(true);
                          }}
                          onFocus={() => setShowProducts(true)}
                          placeholder={
                            loadingProducts
                              ? "Cargando productos..."
                              : "Buscar producto"
                          }
                          className="w-full p-4 bg-[#f7f8fa] rounded-2xl border border-gray-200 outline-none focus:border-black transition"
                        />

                        {showProducts && (
                          <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl max-h-64 overflow-auto">
                            {filteredProducts.length === 0 ? (
                              <div className="p-4 text-sm text-gray-400">
                                Sin resultados
                              </div>
                            ) : (
                              filteredProducts.map((m) => (
                                <div
                                  key={m.id}
                                  onClick={(e) => {
                                    e.stopPropagation();

                                    handleSelectProducto(m);

                                    setProductSearch(
                                      tipo === "materia"
                                        ? m.nombreProd
                                        : m.nombre,
                                    );

                                    setShowProducts(false);
                                  }}
                                  className="p-4 text-sm hover:bg-gray-100 cursor-pointer transition"
                                >
                                  {tipo === "materia" ? m.nombreProd : m.nombre}
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* MOTIVO */}
                    <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm">
                      <p className="text-sm font-semibold text-gray-700 mb-4">
                        Motivo
                      </p>

                      <select
                        value={motivo?.value || ""}
                        onChange={(e) =>
                          setMotivo(
                            motivos.find((m) => m.value === e.target.value) ||
                              null,
                          )
                        }
                        className="w-full p-4 bg-[#f7f8fa] rounded-2xl border border-gray-200 outline-none"
                      >
                        <option value="">Selecciona motivo</option>

                        {motivos.map((m, i) => (
                          <option key={i} value={m.value}>
                            {m.text}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* UNIDAD + CANTIDAD */}
                    <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm">
                      <p className="text-sm font-semibold text-gray-700 mb-4">
                        Cantidad
                      </p>

                      {/* UNIDADES */}
                      <div className="grid grid-cols-3 gap-3 mb-5">
                        {["unidades", "gramos", "oz"].map((u) => (
                          <button
                            key={u}
                            type="button"
                            onClick={() => {
                              setUnidad(u);
                              setCantidadTouched(true);
                            }}
                            className={`py-3 rounded-2xl text-sm font-medium transition ${
                              unidad === u
                                ? "bg-black text-white shadow-lg"
                                : "bg-[#f4f5f7] text-gray-600"
                            }`}
                          >
                            {u}
                          </button>
                        ))}
                      </div>

                      {/* CONTADOR */}
                      <div className="flex items-center justify-between gap-4">
                        <button
                          type="button"
                          onClick={handleDecrease}
                          className="w-12 h-12 rounded-2xl bg-[#f4f5f7] flex items-center justify-center"
                        >
                          <Minus size={18} />
                        </button>

                        <div className="flex-1">
                          <input
                            type="number"
                            value={cantidad}
                            onChange={(e) => {
                              setCantidad(e.target.value);
                              setCantidadTouched(true);
                            }}
                            className="w-full text-center bg-transparent outline-none text-3xl font-bold"
                          />

                          {quantityError && (
                            <p className="text-xs text-red-500 text-center mt-2">
                              {quantityError}
                            </p>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={handleIncrease}
                          className="w-12 h-12 rounded-2xl bg-[#f4f5f7] flex items-center justify-center"
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                    </div>

                    {/* ALERT */}
                    {!isValid && (
                      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4">
                        <AlertTriangle
                          size={18}
                          className="text-amber-600 mt-0.5"
                        />

                        <div>
                          <p className="text-sm font-semibold text-amber-700">
                            Completa todos los campos
                          </p>

                          <p className="text-xs text-amber-600 mt-1">
                            Debes seleccionar producto, motivo, cantidad e
                            imagen.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* BUTTON */}
                    <button
                      disabled={!isValid}
                      onClick={handleSave}
                      className={`w-full py-4 rounded-2xl font-semibold text-sm transition shadow-lg ${
                        isValid
                          ? "bg-black text-white hover:scale-[1.01]"
                          : "bg-gray-300 text-gray-500"
                      }`}
                    >
                      {saving ? "Guardando..." : "Guardar merma"}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
