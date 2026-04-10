import { CircleChevronLeft, Info, TriangleAlert } from "lucide-react";
import { getUserFromToken } from "../../utils/auth";
import { Link } from "react-router-dom";
import { useState } from "react";
import ModalAlert from "../../components/modals/ModalAlert";
import ModalSpinner from "../../components/modals/ModelSpinner";


export default function CreateFormat() {

  const [user, setUser] = useState(() => getUserFromToken());

  // Campos Formulario

  // Variables para Modales
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertSubmit, setShowAlertSubmit] = useState(false);
  const [titleAlert, setTitleAlert] = useState("Atención.");
  const [messageAlert1, setMessageAlert1] = useState("");
  const [messageAlert2, setMessageAlert2] = useState("");
  const [iconComponentModalAlert, setIconComponentModalAlert] = useState(
    <TriangleAlert className="text-red-600" size={24} />
  );

  const handleAdd = async (e) => {
    e.preventDefault();
    setShowAlertSubmit(true);

    try {
     
      //const formData = new FormData();

      /*
      1. Agregar campos al FormData

      Ejemplo:
    
      formData.append("business_id", selectedBusiness);
      */
     

      /*
      2. Enviar los datos por medio de adaptador

      Ejemplo:
    
      const response = await newUser(formData);
      */

      if (!response.ok) {
        const errorMsg = response.message ?? "Error inesperado";
        setShowAlertSubmit(false);
        setShowAlert(true);
        setTitleAlert("Error al agregar.....");
        setMessageAlert1(errorMsg);
        setMessageAlert2(typeof response?.error?.details === "string" ? response?.error?.details : "Error inesperado");
        console.error("Error adding...:", errorMsg);
        return;
      }

      setShowAlertSubmit(false);
      setShowAlert(true);
      setTitleAlert("Negocio agregado");
      setIconComponentModalAlert(<Info className="text-green-600" size={24} />);
      setMessageAlert1("El negocio ha sido agregado correctamente");

      // Limpieza de inputs

      /*
      2. Limpiar inputs

      Ejemplo:
    
      setUserName("");
      */
      
    } catch (error) {
      setShowAlertSubmit(false);
      setShowAlert(true);
      setTitleAlert("Error al agregar Usuario.");
      setMessageAlert1(error.message ?? "Error inesperado");
      setMessageAlert2(response?.error?.details ?? "");
      console.error("Error adding user:", error);
    }
  }

  return (
    <div className="sm:max-w-3xl mx-auto">
      <Link
        to="/admin/persons"
        className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
      >
        <CircleChevronLeft size={16} />
        <span>Regresar</span>
      </Link>

      {/* Formulario */}
      <div className="relative w-full sm:max-w-3xl mx-auto bg-white shadow-md rounded-lg p-4 sm:p-6">
        <h2 className="text-gray-900 text-2xl font-bold mb-4">Crear....</h2>

        <form onSubmit={handleAdd} className="flex flex-wrap -mx-2 items-end">
          {/* Agregar los campos se necesiten para el formulario */}

          <div className="px-2 w-full sm:w-full mb-2 mt-2">
            <button type="submit" className="bg-green-600 text-white px-3 py-2 h-10 rounded-md w-full hover:bg-green-700">
              Agregar
            </button>
          </div>
        </form>
      </div>

      {/* Modales */}
      <>
        {showAlert && (
          <ModalAlert
            titleAlert={titleAlert}
            messageAlert1={messageAlert1}
            messageAlert2={messageAlert2}
            textButton="Cerrar"
            iconComponent={iconComponentModalAlert}
            onClick={() => setShowAlert(false)}
          />
        )}

        {showAlertSubmit && (
          <ModalSpinner
            titleModal="Procesando..."
            messageModal=""
            iconComponent={<Info className="text-red-600" size={24} />}
          />
        )}
      </>
    </div>
  );
}