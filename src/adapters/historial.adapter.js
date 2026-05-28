import { api } from "../services/api"

export const getHistorial = async () => {
  try {

    const { data } = await api.get("/mermas");

    return data;
  } catch (err) {
    return err
  }
};