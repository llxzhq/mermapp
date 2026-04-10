
import { CircleChevronLeft, Info, TriangleAlert } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

import ModalAlert from "../../components/modals/ModalAlert";
import ModalSpinner from "../../components/modals/ModelSpinner";
import Select from "../../components/form/Select";
import Input from "../../components/form/Input";

import { newMerma } from "../../adapters/mermas.adapter";

export default function CreateMerma() {

  // Estados de los campos del formulario
  const [store, setStore] = useState("");
  const [product, setProduct] = useState("");
  const [reason, setReason] = useState("");
  const [quantity, setQuantity] = useState("");

  // Modal de alerta
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertSubmit, setShowAlertSubmit] = useState(false);
  const [titleAlert, setTitleAlert] = useState("Atención");
  const [messageAlert1, setMessageAlert1] = useState("");
  const [messageAlert2, setMessageAlert2] = useState("");

  const [iconComponentModalAlert, setIconComponentModalAlert] = useState(
    <TriangleAlert className="text-red-600" size={24} />
  );

  // Opciones temporales mientras tu compañero conecta la API
  const stores = [
    { value: "1", text: "Tienda Centro" },
    { value: "2", text: "Tienda Norte" },
    { value: "3", text: "Tienda Sur" },
  ];

  const products = [
    { value: "101", text: "Café Latte" },
    { value: "102", text: "Capuccino" },
    { value: "103", text: "Americano" },
  ];

  const reasons = [
    { value: "1", text: "Producto vencido" },
    { value: "2", text: "Producto dañado" },
    { value: "3", text: "Derrame" },
    { value: "4", text: "Error de inventario" },
  ];

  const handleAdd = async (e) => {
    e.preventDefault();

    setShowAlertSubmit(true);

    try {
      const formData = new FormData();

      formData.append("idTienda", store);
      formData.append("codigoProducto", product);
      formData.append("idMotivo", reason);
      formData.append("cantidad", quantity);

      const response = await newMerma(formData);

      if (!response.ok) {
        setShowAlertSubmit(false);
        setShowAlert(true);
        setTitleAlert("Error al registrar la merma");
        setMessageAlert1(response.message ?? "Error inesperado");
        return;
      }

      setShowAlertSubmit(false);
      setShowAlert(true);
      setTitleAlert("Merma registrada");
      setIconComponentModalAlert(
        <Info className="text-green-600" size={24} />
      );
      setMessageAlert1("La merma fue registrada correctamente");

      // Limpiar formulario
      setStore("");
      setProduct("");
      setReason("");
      setQuantity("");

    } catch (error) {
      setShowAlertSubmit(false);
      setShowAlert(true);
      setTitleAlert("Error al registrar la merma");
      setMessageAlert1(error.message ?? "Error inesperado");
      setMessageAlert2("");
    }
  };

  return (
    <div className="sm:max-w-3xl mx-auto">

      <Link
        to="/mermas"
        className="inline-flex items-center gap-2 bg-[#47351A] hover:bg-[#604927] text-white px-4 py-2 rounded mb-4"
      >
        <CircleChevronLeft size={16} />
        <span>Regresar</span>
      </Link>

      <div className="relative w-full sm:max-w-3xl mx-auto bg-white shadow-md rounded-lg p-4 sm:p-6">
        <h2 className="text-gray-900 text-2xl font-bold mb-4">
          Registrar Merma
        </h2>

        <form onSubmit={handleAdd} className="flex flex-wrap -mx-2 items-end">

          <div className="px-2 w-full sm:w-full mb-2 mt-2">

            <Select
              widthPercent="50"
              textLabel="Tienda"
              isRequired={true}
              value={store}
              onChange={setStore}
              name="store"
              textFirstOption="Seleccione la tienda"
              options={stores}
            />

            <Select
              widthPercent="50"
              textLabel="Producto"
              isRequired={true}
              value={product}
              onChange={setProduct}
              name="product"
              textFirstOption="Seleccione el producto"
              options={products}
            />

            <Select
              widthPercent="50"
              textLabel="Motivo de Merma"
              isRequired={true}
              value={reason}
              onChange={setReason}
              name="reason"
              textFirstOption="Seleccione el motivo"
              options={reasons}
            />

            <Input
              widthPercent="50"
              textLabel="Cantidad"
              isRequired={true}
              type="number"
              placeholder="Cantidad"
              value={quantity}
              onChange={setQuantity}
              name="quantity"
            />

            <button
              type="submit"
              className="bg-green-600 text-white px-3 py-2 h-10 rounded-md w-full hover:bg-green-700 mt-4"
            >
              Guardar Merma
            </button>
          </div>
        </form>
      </div>

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
          iconComponent={<Info className="text-blue-600" size={24} />}
        />
      )}
    </div>
  );
}


