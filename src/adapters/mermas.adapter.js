export async function newMerma(formData) {
  try {
    // Esto es temporal mientras tu compañero hace la API
    console.log("Datos enviados:");

    for (let dato of formData.entries()) {
      console.log(dato[0], dato[1]);
    }

    // Simular respuesta exitosa
    return {
      ok: true,
      message: "Merma creada correctamente"
    };

  } catch (error) {
    return {
      ok: false,
      message: error.message
    };
  }
}