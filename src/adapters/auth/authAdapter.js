// src/adapters/auth/authAdapter.js

import { api } from "../../services/api";

export const pingAdapter = async () => {
  try {

    const { data } = await api.post("/auth/ping");

    return {
      ok: true,
      token: token: data.data[0].token, 
    };
  } catch (err) {
    return {
      ok: false,
      message: err.response?.data?.message || "Error en el servidor",
    };
  }
};

export const loginAdapter = async ({ Usuario, Password }) => {
  try {

    const { data } = await api.post("/auth/login", { Usuario, Password });

    return {
      ok: true,
      token: data.data.token, 
    };
  } catch (err) {
    return {
      ok: false,
      message: err.response?.data?.message || "Error en el servidor",
    };
  }
};
