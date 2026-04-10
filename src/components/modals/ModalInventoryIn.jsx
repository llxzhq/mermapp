// src/modals/ModalInventoryIn.jsx

import { useEffect, useState } from "react";
import Input from "../form/Input";
import { getProductsByBusinessIdData } from "../../adapters/products.adapter";
import SpinnerLouder from "../SpinnerLouder";
import { Info, TriangleAlert } from "lucide-react";
import ModalSpinner from "./ModelSpinner";
import ModalAlert from "./ModalAlert";
import { insertStock } from "../../adapters/inventory.adapter";
import { getUserFromToken } from "../../utils/auth";
import Select from "../form/Select";
import Textarea from "../form/Textarea";

export default function ModalInventoryIn({ businesId, onCancel }) {

  const [user] = useState(() => getUserFromToken());
  const [products, setProducts] = useState([]);
  const [insertOk, setInsertOk] = useState(false);

  const [productId, setProductId] = useState(0);
  const [name, setName] = useState("");
  const [lote, setLote] = useState("");
  const [cost, setCost] = useState("");
  const [stock, setStock] = useState("");
  const [referenceType, setReferenceType] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [obs, setObs] = useState("");

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showList, setShowList] = useState(false);

  // Variables para Modales
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertSubmit, setShowAlertSubmit] = useState(false);
  const [titleAlert, setTitleAlert] = useState("Atención.");
  const [messageAlert1, setMessageAlert1] = useState("");
  const [messageAlert2, setMessageAlert2] = useState("");
  const [iconComponentModalAlert, setIconComponentModalAlert] = useState(
    <TriangleAlert className="text-red-600" size={24} />
  );

  const handleSearch = (value) => {
    setName(value);

    if (value.length > 2) {
      const filteredData = products.filter((item) => {
        if (item.Nombre && item.Nombre.toLowerCase().includes(value.toLowerCase())) {
          return item.Nombre.toLowerCase().includes(value.toLowerCase());
        } else if (item.Descripcion && item.Descripcion.toLowerCase().includes(value.toLowerCase())) {
          return item.Descripcion.toLowerCase().includes(value.toLowerCase());
        } else if (item.Sku && item.Sku.toLowerCase().includes(value.toLowerCase())) {
          return item.Sku.toLowerCase().includes(value.toLowerCase());
        }
      });

      setFilteredProducts(filteredData);
      setShowList(true);
    } else {
      setFilteredProducts([]);
      setShowList(false);
    }
  };

  useEffect(() => {
    getProductsByBusinessIdData(businesId)
      .then((data) => {
        if (data.data) {
          setProducts(data.data);
        } else {
          setErrorMsg("Error inesperado al consultar los productos, salga e intentelo nuevamente");
        }
      })
      .catch((error) => {
        setErrorMsg(error.message ? error.message : "Error inesperado al consultar los productos, salga e intentelo nuevamente");
      })
      .finally(() => setLoading(false));
  }, [businesId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowAlertSubmit(true);

    try {

      const formData = new FormData();

      formData.append("product_id", productId);
      formData.append("cost", cost);
      formData.append("stock", stock);
      formData.append("lote", lote);
      formData.append("reference_type", referenceType);
      formData.append("expiration_date", expirationDate);
      formData.append("obs", obs);
      formData.append("created_by_id", user.id);

      const response = await insertStock(formData);

      if (!response.ok) {
        const errorMsg = response.message ?? "Error inesperado";
        setShowAlertSubmit(false);
        setShowAlert(true);
        setTitleAlert("Error al agregar stock");
        setMessageAlert1(errorMsg);
        setMessageAlert2(typeof response?.error?.details === "string" ? response?.error?.details : "Error inesperado");
        console.error("Error adding stock:", errorMsg);
        return;
      }

      setInsertOk(true);

      setShowAlertSubmit(false);
      setShowAlert(true);
      setTitleAlert("Stock agregado");
      setIconComponentModalAlert(<Info className="text-green-600" size={24} />);
      setMessageAlert1("El stock ha sido agregado correctamente");

      // Limpieza de inputs
      setProductId("");
      setName("");
      setLote("");
      setCost("");
      setStock("");
      setReferenceType("");
      setExpirationDate("");
      setObs("");

    } catch (error) {
      setShowAlertSubmit(false);
      setShowAlert(true);
      setTitleAlert("Error al agregar el stock.");
      setMessageAlert1(error.message ?? "Error inesperado");
      setMessageAlert2(error?.details ?? "");
      console.error("Error adding stock:", error);
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="relative w-full max-w-md sm:max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Entrada</h2>

          {loading && (
            <SpinnerLouder height="h-full" />
          )}

          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-400 text-red-300 animate-fadeIn">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-wrap -mx-2"
          >
            {products.length > 0 && (
              <>
                <Input
                  widthPercent="33"
                  textLabel="Producto"
                  isRequired={true}
                  type="text"
                  placeholder="Producto"
                  value={name}
                  onChange={(e) => handleSearch(e)}
                  name="name"
                />

                {showList && filteredProducts.length > 0 && (
                  <div className="absolute z-50 mt-18 ml-2 w-[30%] bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {filteredProducts.map((product) => (
                      <div
                        key={product.uuid}
                        className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => {
                          setName(product.Nombre);
                          setProductId(product.id);
                          setShowList(false);
                        }}
                      >
                        <div className="font-medium">{product.Nombre}</div>
                        <div className="text-xs text-gray-500">
                          {product.Sku} · {product.Categoria}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <Select
                  widthPercent="33"
                  textLabel="Tipo de entrada"
                  isRequired={true}
                  value={referenceType}
                  onChange={setReferenceType}
                  name="reference_type"
                  textFirstOption={"Seleccione el tipo de entrada"}
                  options={[
                    { value: "compra", text: "Compra" },
                    { value: "ajuste", text: "Ajuste" },
                    { value: "devolucion", text: "Devolucion" },
                    { value: "otro", text: "Otro" }
                  ]}
                />

                <Input
                  widthPercent="33"
                  textLabel="Lote"
                  isRequired={false}
                  type="text"
                  placeholder="Lote"
                  value={lote}
                  onChange={setLote}
                  name="lote"
                  isFormatCOP={false}
                />

                <Input
                  widthPercent="33"
                  textLabel="Costo"
                  isRequired={true}
                  type="text"
                  placeholder="Costo"
                  value={cost}
                  onChange={setCost}
                  name="cost"
                  isFormatCOP={true}
                />

                <Input
                  widthPercent="33"
                  textLabel="Cantidad"
                  isRequired={true}
                  type="number"
                  placeholder="Cantidad"
                  value={stock}
                  onChange={setStock}
                  name="stock"
                  isFormatCOP={false}
                />

                <Input
                  widthPercent="33"
                  textLabel="Fecha de vencimiento"
                  isRequired={false}
                  type="date"
                  placeholder=""
                  value={expirationDate}
                  onChange={setExpirationDate}
                  name="expiration_date"
                  isFormatCOP={false}
                />

                <Textarea
                  widthPercent="100"
                  textLabel="Observaciones"
                  isRequired={false}
                  onChange={setObs}
                  name="obs"
                />
              </>
            )}

            <div className="px-2 w-full sm:w-[50%] mb-2 mt-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-3 py-2 h-10 rounded-md w-full hover:bg-green-700"
              >
                Registrar
              </button>
            </div>

            <div className="px-2 w-full sm:w-[50%] mb-2 mt-2">
              <button
                type="button"
                onClick={onCancel}
                className="bg-gray-300 text-gray-800 px-3 py-2 h-10 rounded-md w-full hover:bg-gray-400"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
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
    </>
  );
}
