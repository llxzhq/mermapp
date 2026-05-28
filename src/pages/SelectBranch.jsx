import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Coffee, Check, TriangleAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";

import LogoCafeDuranGris from "../assets/images/Logo_gris.png";
import LogoMermas from "../assets/images/logotipo_mermas.png";

import { getBranchesAdapter } from "../adapters/branches.adapter";
import ModalAlert from "../components/modals/ModalAlert";

export default function SelectBranch() {
  const navigate = useNavigate();

  const [branches, setBranches] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [titleAlert, setTitleAlert] = useState("Atención");
  const [messageAlert1, setMessageAlert1] = useState("");
  const [messageAlert2] = useState("");

  const [iconComponent] = useState(
    <TriangleAlert className="text-red-600" size={24} />,
  );

  const colors = [
    "text-red-500",
    "text-blue-500",
    "text-orange-500",
    "text-green-500",
    "text-purple-500",
    "text-pink-500",
  ];

  // =========================
  // OBTENER SUCURSALES
  // =========================

  const getBranches = async () => {
    console.log("🔥 INICIO getBranches");

    setLoading(true);

    try {
      const ruta = localStorage.getItem("ruta");

      console.log("📍 RUTA:", ruta);

      const response = await getBranchesAdapter(ruta);

      console.log("📦 RESPONSE:", response);

      setBranches(response.data || []);
    } catch (err) {
      console.log("💥 ERROR REAL:", err);
    } finally {
      console.log("🏁 FINALIZA getBranches");
      setLoading(false);
    }
  };

  
  // const getBranches = async () => {

  //   setLoading(true);

  //   try {

  //     const ruta = localStorage.getItem("ruta");

  //     console.log("📍 RUTA GUARDADA:", ruta);

  //     if (!ruta) {
  //       setShowAlert(true);
  //       setTitleAlert("Ruta no encontrada");
  //       setMessageAlert1("No existe ruta asociada al usuario.");
  //       return;
  //     }

  //     const response = await getBranchesAdapter(ruta);

  //     console.log("📦 RESPONSE FINAL:", response);

  //     if (!response.ok) {
  //       throw new Error(response.message);
  //     }

  //     const data = response.data || [];

  //     setBranches(data);

  //     if (data.length === 0) {
  //       setShowAlert(true);
  //       setTitleAlert("Sin sucursales");
  //       setMessageAlert1("No se encontraron sucursales para esta ruta.");
  //     }

  //   } catch (err) {

  //     console.error("❌ ERROR SUCURSALES:", err);

  //     setShowAlert(true);
  //     setTitleAlert("Error al cargar sucursales");
  //     setMessageAlert1(err.message || "Algo salió mal");

  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    getBranches();
  }, []);

  // =========================
  // SELECCIONAR SUCURSAL
  // =========================
  const handleSelect = (branch) => {
    setSelected(branch.idTienda);

    localStorage.setItem("branch", JSON.stringify(branch));
    localStorage.setItem("idTienda", branch.idTienda);
    localStorage.setItem("almacen", branch.almacen);
    localStorage.setItem("tokenClave", branch.tokenClave);

    setTimeout(() => {
      navigate("/home");
    }, 250);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <div className="w-full max-w-sm mx-auto px-5">
        {/* LOGO */}
        <div className="flex flex-col items-center mt-16 mb-8">
          <img src={LogoMermas} className="w-40" />
          <p className="text-gray-400 text-sm text-center mt-5">
            Selecciona la sucursal que deseas administrar
          </p>
        </div>

        {/* LOADING */}
        {loading && (
          <p className="text-center text-gray-400 text-sm">
            Cargando sucursales...
          </p>
        )}

        {/* LISTA */}
        <div className="space-y-3">
          {branches.map((branch, index) => {
            const isSelected = selected === branch.idTienda;

            return (
              <motion.div
                key={branch.idTienda}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelect(branch)}
                className={`
                  flex items-center justify-between p-4 rounded-xl border cursor-pointer transition
                  ${isSelected ? "border-black bg-gray-50" : "border-gray-200"}
                `}
              >
                <div className="flex items-center gap-3">
                  <Coffee size={18} className={colors[index % colors.length]} />

                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {branch.tienda}
                    </p>
                    <p className="text-xs text-gray-400">{branch.almacen}</p>
                  </div>
                </div>

                <div
                  className={`
                    w-5 h-5 rounded-full border flex items-center justify-center
                    ${isSelected ? "border-black bg-black" : "border-gray-300"}
                  `}
                >
                  {isSelected && <Check size={12} className="text-white" />}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* FOOTER */}
      <div className="border-t border-gray-100 py-4 flex justify-center">
        <img src={LogoCafeDuranGris} className="w-20 opacity-70" />
      </div>

      {/* ALERT */}
      {showAlert && (
        <ModalAlert
          titleAlert={titleAlert}
          messageAlert1={messageAlert1}
          messageAlert2={messageAlert2}
          textButton="Cerrar"
          iconComponent={iconComponent}
          onClick={() => setShowAlert(false)}
        />
      )}
    </div>
  );
}
