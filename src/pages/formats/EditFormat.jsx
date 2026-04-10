import { CircleChevronLeft, Info, TriangleAlert } from "lucide-react";
import { getUserFromToken } from "../../utils/auth";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ModalAlert from "../../components/modals/ModalAlert";
import ModalSpinner from "../../components/modals/ModelSpinner";
import SpinnerLouder from "../../components/SpinnerLouder";


export default function EditPerson() {

  const navigate = useNavigate();

  const [user] = useState(() => getUserFromToken());
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  const [showAlert, setShowAlert] = useState(false);
  const [showAlertSubmit, setShowAlertSubmit] = useState(false);

  const [titleAlert, setTitleAlert] = useState("Atención.");
  const [messageAlert1, setMessageAlert1] = useState("");
  const [messageAlert2, setMessageAlert2] = useState("");
  const [iconComponentModalAlert, setIconComponentModalAlert] = useState(
    <TriangleAlert className="text-red-600" size={24} />
  );

  const [updateOk, setUpdateOk] = useState(false);

  useEffect(() => {
    getPersonByUUID(id)
      .then((data) => {
        if (data.data) {
          setDocumentType(data.data.document_type);
          setDocument(data.data.document);
          setFirstName(data.data.name);
          setLastName(data.data.last_name);
          setPhone(data.data.phone);
          setEmail(data.data.email);
        } else {
          setShowAlert(true);
          setTitleAlert("Error al obtener el negocio");
          setMessageAlert1(data.message ?? 'Algo fallo');
          setMessageAlert2(data.error?.details ? data.error.details : "");
        }
      })
      .catch((error) => {
        setShowAlert(true);
        setTitleAlert("Error al obtener el negocio");
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
      
      // const formData = new FormData();

      // formData.append("document_type", documentType);
      // formData.append("document", document);
      // formData.append("name", firstName);
      // formData.append("last_name", lastName);
      // formData.append("phone", phone);
      // formData.append("email", email);
      // formData.append("updated_by_id", user.id);
      // formData.append("perfilRemoved", perfilRemoved);

      // if (perfilFile) {
      //   formData.append("perfil", perfilFile);
      // }

      // const response = await updatePerson(id, formData);

      if (!response.ok) {
        const errorMsg = response.message ?? "Error inesperado";
        setShowAlertSubmit(false);
        setShowAlert(true);
        setTitleAlert("Error al editar la persona");
        setMessageAlert1(errorMsg);
        setMessageAlert2(response?.error?.details ?? "");
        console.error("Error adding person:", errorMsg);
        return;
      }

      setUpdateOk(true);
      setShowAlertSubmit(false);
      setShowAlert(true);
      setTitleAlert("Persona editado");
      setIconComponentModalAlert(<Info className="text-green-600" size={24} />);
      setMessageAlert1("La persona ha sido editado correctamente");

    } catch (error) {
      setShowAlertSubmit(false);
      setShowAlert(true);
      setTitleAlert("Error al editar la persona");
      setMessageAlert1(error.message ?? "Error inesperado");
      setMessageAlert2(error.details ? error.details : "");
    }
  }

  if (loading) return <SpinnerLouder height="h-full" />;

  return (
    <div className="sm:max-w-3xl mx-auto">
      <Link
        to="/admin/persons"
        className="relative inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
      >
        <CircleChevronLeft size={16} />
        <span>Regresar</span>
      </Link>

      <div className="relative w-full sm:max-w-3xl mx-auto bg-white shadow-md rounded-lg p-4 sm:p-6">
        <h2 className="text-gray-900 text-2xl font-bold mb-4">Editar Negocio</h2>

        <form onSubmit={handleEdit} className="flex flex-wrap -mx-2 items-end">
          {/* campos del formulario */}

          <div className="px-2 w-full sm:w-full mb-2 mt-2">
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
              updateOk && navigate(`/admin/businesses`);
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