import { Link, useNavigate } from "react-router-dom";
import { Info, PlusCircle, TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import DataTable from "../../components/DataTable";
import ModalAlert from "../../components/modals/ModalAlert";
import ModalConfirmDelete from "../../components/modals/ModalConfirmDelete";
import ModalSpinner from "../../components/modals/ModelSpinner";
import SpinnerLouder from "../../components/SpinnerLouder";


export default function Formats() {

  const navigate = useNavigate();

  const [data, setData] = useState({ data: [], columns: [] });
  const [showDataTable, setShowDataTable] = useState(false);

  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertSpinner, setShowAlertSpinner] = useState(false);

  const [titleAlert, setTitleAlert] = useState("Atención.");
  const [messageAlert1, setMessageAlert1] = useState("");
  const [messageAlert2, setMessageAlert2] = useState("");
  const [iconComponent, setIconComponent] = useState(<TriangleAlert className="text-red-600" size={24} />);

  const [itemToDelete, setItemToDelete] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [nameItemToDelete, setNameItemToDelete] = useState("");

  const loadData = () => {
    setLoading(true);

    getFormatsData()
      .then((data) => {
        if (data.data) {
          setData({
            data: data.data,
            columns: data.data.length > 0 ? Object.keys(data.data[0]) : [],
          });
          setShowDataTable(true);
        } else {
          setShowAlert(true);
          setTitleAlert("Error al obtener....");
          setMessageAlert1(data.message ?? "Algo falló");
          setShowDataTable(false);
        }
      })
      .catch((err) => {
        setShowAlert(true);
        setTitleAlert("Error al obtener.....");
        setMessageAlert1(err.message ?? "Algo falló");
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleEdit = (row) => {
    console.log(row.original);
    navigate(`/admin/businesses/edit/${row.original.uuid}`);
  }

  const handleConfirmDelete = (row) => {
    setItemToDelete(row.original.uuid);
    setShowConfirm(true);
    setNameItemToDelete(row.original.Nombre);
  }

  const handleDelete = async () => {
    setShowAlertSpinner(true);

    try {
      const response = await deleteItem(itemToDelete);

      if (!response.ok) {
        setShowAlertSpinner(false);
        setShowAlert(true);
        setTitleAlert("Error al eliminar el módulo.");
        setMessageAlert1(response.message ?? "Algo falló");
        setMessageAlert2(response.error?.details || "");
        return;
      }

      setItemToDelete(null);
      setShowAlertSpinner(false);

      loadData();
    } catch (error) {
      setShowAlertSpinner(false);
      setTitleAlert("Error al eliminar el Modulo.");
      setMessageAlert1('Algo fallo');
      console.error("Error deleting person:", error);
    }
  }

  if (loading) return <SpinnerLouder height="h-full" />;

  return (
    <>
      <Link
        to="/admin/persons/create"
        className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-4"
      >
        <PlusCircle size={16} />
        <span>Nueva persona</span>
      </Link>

      {/* Tabla */}
      {showDataTable && (
        <DataTable objData={data} onClickEdit={handleEdit} onClickDelete={handleConfirmDelete} />
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
            titleConfirm="¿Eliminar Permiso?"
            messageConfirm1="Esta acción no se puede deshacer."
            messageConfirm2="Debe ingresar excatamente el nombre del permiso"
            name={nameItemToDelete}
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