// src/modals/ModalInventoryOut.jsx

import { getProductsByBusinessIdData } from "../../adapters/products.adapter";
import { getUserFromToken } from "../../utils/auth";
import { Info, Minus, Plus, TriangleAlert } from "lucide-react";
import { stockOut } from "../../adapters/inventory.adapter";
import { useEffect, useState } from "react";
import Input from "../form/Input";
import ModalAlert from "./ModalAlert";
import ModalSpinner from "./ModelSpinner";
import Select from "../form/Select";
import SpinnerLouder from "../SpinnerLouder";
import Textarea from "../form/Textarea";

export default function ModalInventoryOut({ businesId, onCancel, stockActual }) {

  const [user] = useState(() => getUserFromToken());
  const [products, setProducts] = useState([]);
  const [insertOk, setInsertOk] = useState(false);

  const [productId, setProductId] = useState(0);
  const [name, setName] = useState("");
  const [stock, setStock] = useState("");
  const [referenceType, setReferenceType] = useState("");
  const [obs, setObs] = useState("");
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [showRegistrationfields, setShowRegistrationfields] = useState(false);
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

  useEffect(() => {

    if (items.length === 0) return;

    setTotal(items.reduce((acc, item) => acc + (item.price * item.stock), 0));

  }, [items]);


  const handlerAddProduct = () => {

    if (productId !== 0 && stock !== "") {

      setItems(prev => {

        const product = products.find(p => p.id === productId);

        if (Number(stock) > stockActual) {
          setErrorMsg(`La cantidad ingresada para ${product.Nombre} supera el stock disponible (${stockActual} ${product["Unidad de Medida"] === "Unidad" ? product["Unidad de Medida"] + "es" : ""})`);
          return [...prev]
        }

        setErrorMsg("");

        const exists = prev.find(p => p.productId === productId);

        if (exists) {
          return prev.map(p =>
            p.productId === productId
              ? { ...p, stock: p.stock + Number(stock) }
              : p
          );
        }

        return [
          ...prev,
          {
            productId,
            name,
            stock: Number(stock),
            price: product.Precio
          }
        ];
      });

      setProductId("");
      setName("");
      setStock("");
      setReferenceType("");
      setObs("");
    }
  }

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

const handleChangeStock = (accion, item) => {
  setItems(prev => {
    return prev
      .map(p => {
        if (p.productId !== item.productId) return p;

        if (accion === "sumar") {
          if (Number(p.stock) >= stockActual) 
            return { ...p, stock: Number(p.stock) };
          else
            return { ...p, stock: Number(p.stock) + 1 };
        } else {
          const newStock = Number(p.stock) - 1;

          if (newStock > 0) {
            return { ...p, stock: newStock }
          } else {
            setTotal(0);
            return null;
          }
        }
      })
      .filter(p => p !== null);
  });
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowAlertSubmit(true);


    try {

      const transformedItems = items.map(item => ({
        productId: item.productId,
        out: item.stock
      }));

      const data = {
        userId: user.id,
        referenceType,
        items: transformedItems,
        obs,
      }

      const response = await stockOut(data);

      if (!response.ok) {
        const errorMsg = response.message ?? "Error inesperado";
        setShowAlertSubmit(false);
        setShowAlert(true);
        setTitleAlert("Error efectuando el movimiento de stock");
        setMessageAlert1(errorMsg);
        setMessageAlert2(typeof response?.error?.details === "string" ? response?.error?.details : "Error inesperado");
        console.error("Error adding stock:", errorMsg);
        return;
      }

      setInsertOk(true);

      setShowAlertSubmit(false);
      setShowAlert(true);
      setTitleAlert("Registro exitoso");
      setIconComponentModalAlert(<Info className="text-green-600" size={24} />);
      setMessageAlert1("El movimiento de inventario se registro exitosamente");

      // Limpieza de inputs
      setProductId("");
      setName("");
      setStock("");
      setReferenceType("");
      setObs("");
      setItems("");
      setTotal("");

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
      <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">

        <div className="relative w-full max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6">

          <h2 className="text-2xl font-bold mb-6">Salida</h2>

          {loading && (
            <SpinnerLouder height="h-full" />
          )}

          {/* Contenedor padre */}
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-6">

            {/* Contenedor izquierda ancho 50% */}
            <div className="w-full md:w-1/2 flex flex-col justify-between h-[80vh] max-h-[80vh] gap-4">
              {/* Contenedor Campos */}
              {products.length > 0 && (
                <div className="flex-1 overflow-y-auto">
                  <div className="flex flex-wrap">
                    <Input
                      widthPercent="100"
                      textLabel="Producto"
                      isRequired={true}
                      type="text"
                      placeholder="Producto"
                      value={name}
                      onChange={(e) => handleSearch(e)}
                      name="name"
                      disabled={showRegistrationfields}
                    />

                    {showList && filteredProducts.length > 0 && (
                      <div className="absolute z-50 mt-18 ml-2 w-[46%] bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
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

                    <Input
                      widthPercent="50"
                      textLabel="Cantidad"
                      isRequired={true}
                      type="number"
                      placeholder="Cantidad"
                      value={stock}
                      onChange={setStock}
                      name="stock"
                      isFormatCOP={false}
                      disabled={showRegistrationfields}
                    />

                    {errorMsg && (
                      <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-400 text-red-300 animate-fadeIn">
                        {errorMsg}
                      </div>
                    )}

                    <div className="px-2 w-full sm:w-1/2 mb-2 mt-2">
                      <button
                        type="button"
                        onClick={handlerAddProduct}
                        className="bg-amber-600 text-white px-3 py-2 h-full rounded-md w-full hover:bg-amber-700"

                      >
                        Agregar
                      </button>
                    </div>

                    {showRegistrationfields && (
                      <>
                        <Select
                          widthPercent="100"
                          textLabel="Tipo de salida"
                          isRequired={true}
                          value={referenceType}
                          onChange={setReferenceType}
                          name="reference_type"
                          textFirstOption={"Seleccione el tipo de salida"}
                          options={[
                            { value: "venta", text: "Venta" },
                            { value: "ajuste", text: "Ajuste" },
                            { value: "otro", text: "Otro" }
                          ]}
                        />

                        <Textarea
                          widthPercent="100"
                          textLabel="Observaciones"
                          isRequired={referenceType !== "venta"}
                          onChange={setObs}
                          name="obs"
                          value={obs}
                          minHeight="10"
                        />

                        <div className="px-2 w-full sm:w-full mb-2 mt-2">
                          <button type="submit" className="bg-green-600 text-white px-3 py-2 h-10 rounded-md w-full hover:bg-green-700">
                            Registrar
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Contenedor botones */}
              <div className="mt-4 pt-3 border-t shrink-0">
                <div className="flex flex-wrap -mx-2">

                  <div className="px-2 w-full sm:w-full mb-2 mt-2">
                    <button
                      type="button"
                      onClick={onCancel}
                      className="bg-gray-300 text-gray-800 px-3 py-2 h-10 rounded-md w-full hover:bg-gray-400"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Contenedor derecha 50% */}
            <div className="w-full md:w-1/2 md:border-l md:pl-4 flex flex-col md:h-[500px]">


              {/* Título */}
              <h3 className="text-lg font-semibold mb-3 shrink-0">
                Productos agregados
              </h3>

              {/* LISTA (scroll) */}
              <div className="flex-1 overflow-y-auto bg-gray-50 rounded-md p-3">
                <ul className="space-y-2 text-sm">

                  {items && items.length > 0 && items.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 border-b pb-2"
                    >
                      {/* Texto */}
                      <span className="flex-1 min-w-0">
                        <span className="block text-sm text-gray-800 truncate">
                          {`$ ${Number(item.price).toLocaleString("es-CO")}` || "Sin precio"} -  {item.name}
                        </span>
                      </span>

                      {/* Controles */}
                      <span className="flex items-center gap-1 shrink-0">
                        <span className="text-gray-500 text-sm">x{item.stock}</span>

                        <button
                          type="button"
                          className="p-1 rounded bg-green-300 hover:bg-green-500"
                          onClick={() => handleChangeStock("sumar", item)}
                        >
                          <Plus size={16} />
                        </button>

                        <button
                          type="button"
                          className="p-1 rounded bg-red-300 hover:bg-red-500"
                          onClick={() => handleChangeStock("restar", item)}
                        >
                          <Minus size={16} />
                        </button>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* TOTAL */}
              <div className="mt-3 pt-2 border-t shrink-0">
                <div className="flex justify-between font-semibold text-sm">
                  <span>Total</span>
                  <span>$ {Number(total).toLocaleString("es-CO")}</span>
                </div>
              </div>

              {/* BOTÓN */}
              <div className="mt-2 shrink-0">
                <button
                  type="button"
                  className="bg-green-600 text-white px-3 py-2 h-10 rounded-md w-full hover:bg-green-700"
                  onClick={() => setShowRegistrationfields(true)}
                >
                  Confirmar cantidades y valores
                </button>
              </div>
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
