import { CircleChevronLeft, Info, TriangleAlert } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import ModalAlert from "../../components/modals/ModalAlert";
import ModalSpinner from "../../components/modals/ModelSpinner";
import Select from "../../components/form/Select";
import Input from "../../components/form/Input";
import ImageWithPreview from "../../components/form/ImageWithPreview";
import { newProduct } from "../../adapters/products.adapter";


export default function CreateProduct() {

  const fileInputRef = useRef(null);
  const [resetImage, setResetImage] = useState(false);

  // Campos Formulario
  const [categorie, setCategorie] = useState("");
  const [productName, setProductName] = useState("");

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
     
      const formData = new FormData();

      formData.append("categorie", categorie);
      formData.append("productName", productName);
     
      const response = await newProduct(formData);

      if (!response.ok) {
        const errorMsg = response.message ?? "Error inesperado";
        setShowAlertSubmit(false);
        setShowAlert(true);
        setTitleAlert("Error al agregar el producto");
        setMessageAlert1(errorMsg);
        console.error("Error adding product:", errorMsg);
        return;
      }

      setShowAlertSubmit(false);
      setShowAlert(true);
      setTitleAlert("Producto agregado");
      setIconComponentModalAlert(<Info className="text-green-600" size={24} />);
      setMessageAlert1("El producto ha sido agregado correctamente");

      // Limpieza de inputs
      setCategorie("");
      setProductName("");
      
      
    } catch (error) {
      setShowAlertSubmit(false);
      setShowAlert(true);
      setTitleAlert("Error al agregar Producto.");
      setMessageAlert1(error.message ?? "Error inesperado");
      setMessageAlert2(response?.error?.details ?? "");
      console.error("Error adding user:", error);
    }
  }

  return (
    <div className="sm:max-w-3xl mx-auto">
      <Link
        to="/products"
        className="inline-flex items-center gap-2 bg-[#47351A] hover:bg-[#604927] text-white px-4 py-2 rounded mb-4"
      >
        <CircleChevronLeft size={16} />
        <span>Regresar</span>
      </Link>

      {/* Formulario */}
      <div className="relative w-full sm:max-w-3xl mx-auto bg-white shadow-md rounded-lg p-4 sm:p-6">
        <h2 className="text-gray-900 text-2xl font-bold mb-4">Ingresar Producto</h2>

        <form onSubmit={handleAdd} className="flex flex-wrap -mx-2 items-end">
          {/* Agregar los campos se necesiten para el formulario */}

          <div className="px-2 w-full sm:w-full mb-2 mt-2">

            <Select
              widthPercent="50"
              textLabel="Categorías"
              isRequired={true}
              value={categorie}
              onChange={setCategorie}
              name="categorie"
              textFirstOption="Seleccione la categoría"
              options={[
                { value: "espresso", text: "Espresso" },
                { value: "americano", text: "Americano" },
                { value: "cappuccino", text: "Cappuccino" },
                { value: "latte", text: "Latte" },
              ]}
            />

            <Input
              widthPercent="50"
              textLabel="Nombre Producto"
              isRequired={true}
              type="text"
              placeholder="Nombre Producto"
              value={productName}
              onChange={setProductName}
              name="productName"
            />

            <ImageWithPreview
              widthPercent="100"
              textLabel="Imagen"
              isRequired={false}
              name="imagenProduct"
              fileInputRef={fileInputRef}
              reset={resetImage}
              onResetDone={() => setResetImage(false)}
            />

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