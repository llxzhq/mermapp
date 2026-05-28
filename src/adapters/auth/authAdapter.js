import { api } from "../../services/api"

export const pingAdapter = async () => {
  try {

    const { data } = await api.get("/auth/ping");

    return data;
  } catch (err) {
    return err
  }
};

export const loginAdapter = async ({ Usuario, Password }) => {
  try {

    const { data } = await api.post("/auth/login", { Usuario, Password });

    return data;
  } catch (err) {
    return err;
  }
};