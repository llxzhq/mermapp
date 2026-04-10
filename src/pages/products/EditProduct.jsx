import { CircleChevronLeft, Info, TriangleAlert } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import ModalAlert from "../../components/modals/ModalAlert";
import ModalSpinner from "../../components/modals/ModelSpinner";
import SpinnerLouder from "../../components/SpinnerLouder";
import { getProductById, updateProduct } from "../../adapters/products.adapter";
import Select from "../../components/form/Select";
import Input from "../../components/form/Input";
import ImageWithPreview from "../../components/form/ImageWithPreview";


export default function EditProduct() {

  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  // Campos Formulario
  const [categorie, setCategorie] = useState("");
  const [productName, setProductName] = useState("");
  const [preview, setPreview] = useState(null);

  const [showAlert, setShowAlert] = useState(false);
  const [showAlertSubmit, setShowAlertSubmit] = useState(false);

  const [titleAlert, setTitleAlert] = useState("Atención.");
  const [messageAlert1, setMessageAlert1] = useState("");
  const [messageAlert2, setMessageAlert2] = useState("");
  const [iconComponentModalAlert, setIconComponentModalAlert] = useState(
    <TriangleAlert className="text-red-600" size={24} />
  );

  const [updateOk, setUpdateOk] = useState(false);
  const [productRemoved, setProductRemoved] = useState(false);

  useEffect(() => {
    getProductById(id)
      .then((data) => {
        if (data.data) {
          setCategorie(data.data.Categoria.toLowerCase());
          setProductName(data.data.Nombre);
          setPreview(data.data.Imagen);
        } else {
          setShowAlert(true);
          setTitleAlert("Error al obtener el producto");
          setMessageAlert1(data.message ?? 'Algo fallo');
          setMessageAlert2(data.error?.details ? data.error.details : "");
        }
      })
      .catch((error) => {
        setShowAlert(true);
        setTitleAlert("Error al obtener el producto");
        setMessageAlert1(error.message ?? 'Algo fallo');
        setMessageAlert2(error.details ? error.details : "");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleEdit = async (e) => {
    e.preventDefault();
    setShowAlertSubmit(true);

    try {

      // const perfilFile = fileInputRef.current?.files[0];

      const formData = new FormData();

      formData.append("categorie", categorie);
      formData.append("productName", productName);

      // if (perfilFile) {
      //   formData.append("perfil", perfilFile);
      // }

      const response = await updateProduct(id, formData);

      if (!response.ok) {
        const errorMsg = response.message ?? "Error inesperado";
        setShowAlertSubmit(false);
        setShowAlert(true);
        setTitleAlert("Error al editar el producto");
        setMessageAlert1(errorMsg);
        setMessageAlert2(response?.error?.details ?? "");
        console.error("Error editing product:", errorMsg);
        return;
      }

      setUpdateOk(true);
      setShowAlertSubmit(false);
      setShowAlert(true);
      setTitleAlert("Producto editado");
      setIconComponentModalAlert(<Info className="text-green-600" size={24} />);
      setMessageAlert1("El producto ha sido editado correctamente");

    } catch (error) {
      setShowAlertSubmit(false);
      setShowAlert(true);
      setTitleAlert("Error al editar el producto");
      setMessageAlert1(error.message ?? "Error inesperado");
      setMessageAlert2(error.details ? error.details : "");
    }
  }

  if (loading) return <SpinnerLouder height="h-full" />;

  return (
    <div className="sm:max-w-3xl mx-auto">
      <Link
        to="/products"
        className="relative inline-flex items-center gap-2 bg-[#47351A] hover:bg-[#5f4010] text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
      >
        <CircleChevronLeft size={16} />
        <span>Regresar</span>
      </Link>

      <div className="relative w-full sm:max-w-3xl mx-auto bg-white shadow-md rounded-lg p-4 sm:p-6">
        <h2 className="text-gray-900 text-2xl font-bold mb-4">Editar Producto</h2>

        <form onSubmit={handleEdit} className="flex flex-wrap -mx-2 items-end">
          {/* campos del formulario */}

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
              prev={preview}
              setImageRemoved={setProductRemoved}
            />

            <button type="submit" className="bg-green-600 text-white px-3 py-2 h-10 rounded-md w-full hover:bg-green-700">
              Editar
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
            onClick={() => {
              updateOk && navigate(`/products`);
              setShowAlert(false);
            }}
          />
        )}

        {showAlertSubmit && (
          <ModalSpinner titleModal="Procesando..." messageModal="" iconComponent={<Info className="text-red-600" size={24} />} />
        )}
      </>
    </div>
  );
}