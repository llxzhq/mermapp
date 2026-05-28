import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, AlertTriangle, CheckCircle } from "lucide-react";
import { createMermaAdapter } from "../../adapters/mermas.adapter";

import LogoMermas from "../../assets/images/logotipo_mermas.png";

export default function CreateMerma() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    store: "",
    product: "",
    reason: "",
    quantity: "",
  });

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const stores = [
    { value: "1", text: "Tienda Centro" },
    { value: "2", text: "Tienda Norte" },
  ];

  const products = [
    { value: "101", text: "Café Latte" },
    { value: "102", text: "Capuccino" },
  ];

  const reasons = [
    { value: "1", text: "Producto vencido" },
    { value: "2", text: "Derrame" },
  ];

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔥 VALIDACIÓN
    if (!form.store || !form.product || !form.reason || !form.quantity) {
      setAlert({
        type: "error",
        message: "Completa todos los campos",
      });
      return;
    }

    try {
      setLoading(true);

      const res = await createMermaAdapter(form);

      if (!res.ok) {
        setAlert({
          type: "error",
          message: res.message || "Error al registrar",
        });
        return;
      }

      setAlert({
        type: "success",
        message: "Merma registrada correctamente",
      });

      // limpiar
      setForm({
        store: "",
        product: "",
        reason: "",
        quantity: "",
      });

      // 🚀 regresar y refrescar Home
      setTimeout(() => {
        navigate("/home");
      }, 1000);

    } catch (err) {
      setAlert({
        type: "error",
        message: "Error inesperado",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6fb] flex justify-center">

      <div className="w-full max-w-md md:max-w-2xl px-4 py-6">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white rounded-xl shadow"
          >
            <ArrowLeft size={18} />
          </button>

          <img src={LogoMermas} className="w-28" />
        </div>

        {/* CARD */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">

          <h2 className="text-lg font-bold mb-4">
            Registrar Merma
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            <select
              name="store"
              value={form.store}
              onChange={handleChange}
              className="w-full p-3 bg-gray-100 rounded-xl"
            >
              <option value="">Seleccione tienda</option>
              {stores.map(s => (
                <option key={s.value} value={s.value}>{s.text}</option>
              ))}
            </select>

            <select
              name="product"
              value={form.product}
              onChange={handleChange}
              className="w-full p-3 bg-gray-100 rounded-xl"
            >
              <option value="">Seleccione producto</option>
              {products.map(p => (
                <option key={p.value} value={p.value}>{p.text}</option>
              ))}
            </select>

            <select
              name="reason"
              value={form.reason}
              onChange={handleChange}
              className="w-full p-3 bg-gray-100 rounded-xl"
            >
              <option value="">Motivo</option>
              {reasons.map(r => (
                <option key={r.value} value={r.value}>{r.text}</option>
              ))}
            </select>

            <input
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              placeholder="Cantidad"
              className="w-full p-3 bg-gray-100 rounded-xl"
            />

            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold
                ${loading ? "bg-gray-300" : "bg-black text-white"}
              `}
            >
              {loading ? "Guardando..." : "Guardar merma"}
            </motion.button>

          </form>

        </div>

        {/* ALERT */}
        <AnimatePresence>
          {alert && (
            <motion.div
              className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              {alert.type === "error" ? (
                <AlertTriangle className="text-red-500" />
              ) : (
                <CheckCircle className="text-green-500" />
              )}

              <p className="text-sm">{alert.message}</p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}