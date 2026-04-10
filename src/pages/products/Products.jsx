// src/pages/Products.jsx

import { useEffect, useState } from "react";
import SpinnerLouder from "../../components/SpinnerLouder";
import { Link, useNavigate } from "react-router-dom";
import { Info, PlusCircle, TriangleAlert } from "lucide-react";
import DataTable from "../../components/DataTable";
import ModalConfirmDelete from "../../components/modals/ModalConfirmDelete";
import ModalSpinner from "../../components/modals/ModelSpinner";
import ModalAlert from "../../components/modals/ModalAlert";
import { deleteProduct, getProductsData } from "../../adapters/products.adapter";


export default function Products() {
  
  const [products, setProducts] = useState({ data: [], columns: [] });
  const [showDataTable, setShowDataTable] = useState(true);

  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertSpinner, setShowAlertSpinner] = useState(false);

  const [titleAlert, setTitleAlert] = useState("Atención.");
  const [messageAlert1, setMessageAlert1] = useState("");
  const [messageAlert2, setMessageAlert2] = useState("");
  const [iconComponent, setIconComponent] = useState(<TriangleAlert className="text-red-600" size={24} />);

  const [productToDelete, setProductToDelete] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [nameProductToDelete, setNameProductToDelete] = useState("");

  const navigate = useNavigate();

  const loadProducts = () => {
    setLoading(true);

    getProductsData()
      .then((data) => {
        if (data.data) {
          setProducts({
            data: data.data,
            columns: data.data.length > 0 ? Object.keys(data.data[0]) : [],
          });
          setShowDataTable(true);
        } else {
          setShowAlert(true);
          setTitleAlert("Error al obtener los productos");
          setMessageAlert1(data.message ?? "Algo falló");
          setShowDataTable(false);
        }
      })
      .catch((err) => {
        setShowAlert(true);
        setTitleAlert("Error al obtener los productos");
        setMessageAlert1(err.message ?? "Algo falló");
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadProducts();
  }, []);

  const handleEdit = (row) => {
    console.log(row.original);
    navigate(`/products/edit/${row.original.id}`);
  }

  const handleConfirmDelete = (row) => {
    setProductToDelete(row.original.id);
    setShowConfirm(true);
    setNameProductToDelete(row.original.Nombre);
  }

  const handleDelete = async () => {
    setShowAlertSpinner(true);

    try {
      const response = await deleteProduct(productToDelete);

      if (!response.ok) {
        setShowAlertSpinner(false);
        setShowAlert(true);
        setTitleAlert("Error al eliminar el rol.");
        setMessageAlert1(response.message);
        return;
      }

      setNameProductToDelete(null);
      setShowAlertSpinner(false);

      loadProducts();
    } catch (error) {
      setShowAlertSpinner(false);
      setTitleAlert("Error al eliminar rol.");
      setMessageAlert1('Algo fallo');
      console.error("Error deleting rol:", error);
    }
  }

  if (loading) return <SpinnerLouder height="h-full" />;

  return (
    <>
      <Link
        to="/products/create"
        className="inline-flex items-center gap-2 bg-[#47351A] hover:bg-[#604927] text-white px-4 py-2 rounded mb-4"
      >
        <PlusCircle size={16} />
        <span>Producto Nuevo</span>
      </Link>

      {/* Tabla */}
      {showDataTable && (
        <DataTable objData={products} onClickEdit={handleEdit} onClickDelete={handleConfirmDelete} />
      )}

      {/* Modales */}
      <>
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

        {showAlertSpinner && (
          <ModalSpinner
            titleModal="Procesando..."
            messageModal=""
            iconComponent={<Info className="text-red-600" size={24} />}
          />
        )}

        {showConfirm && (
          <ModalConfirmDelete
            titleConfirm="¿Eliminar Producto?"
            messageConfirm1="Esta acción no se puede deshacer."
            messageConfirm2="Debe ingresar excatamente el nombre del producto"
            name={nameProductToDelete}
            onClickConfirm={() => {
              handleDelete();
              setShowConfirm(false);
            }}
            onClickCancel={() => setShowConfirm(false)}
          />
        )}
      </>
    </>
  );
}