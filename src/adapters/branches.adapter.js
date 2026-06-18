import { api } from "../services/api";

export const getBranchesAdapter = async (ruta) => {
  try {
    const res = await api.get(`/mermas/stores?ruta=${ruta}`);

    console.log("🔥 FULL RESPONSE:", res);
    console.log("🔥 res.data:", res.data);

    return {
      ok: res.status >= 200 && res.status < 300,
      data: res.data?.data ?? [],
      message: res.data?.message || "",
    };

  } catch (error) {
    console.error("❌ ERROR SUCURSALES:", error?.response?.data || error);

    return {
      ok: false,
      data: [],
      message:
        error?.response?.data?.message ||
        "No se pudieron obtener las sucursales",
    };
  }
};

export const getAllBranchesAdapter = async () => {
  const res = await api.get(`/mermas/stores-all`);

  return res.data;
};