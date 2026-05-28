import {api} from "../services/api";

/**
 * 🔥 CONFIG DESDE .ENV
 */
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

/**
 * 🔥 MOCK BASE
 */
const mockMermas = [
  {
    id: 1,
    name: "Macchiato Doble",
    category: "Bebidas",
    time: "Hace 4 horas",
    image: "https://i.imgur.com/8Km9tLL.jpg",
    leido: false,
    procesado: false,
    impacto: 2.5,
    prioridad: "alta"
  },
  {
    id: 2,
    name: "Latte Vainilla",
    category: "Bebidas",
    time: "Hace 6 horas",
    image: "https://i.imgur.com/1bX5QH6.jpg",
    leido: true,
    procesado: true,
    impacto: 4.2,
    prioridad: "media"
  }
];

/**
 * 🔹 GET MERMAS
 */
export const getMermasAdapter = async () => {

  // 🔥 MODO MOCK (NO LLAMA API)
  if (USE_MOCK) {
    console.log("🟡 MODO MOCK ACTIVO");

    const local = JSON.parse(localStorage.getItem("mermas")) || [];

    return {
      ok: true,
      data: local.length ? local : mockMermas,
    };
  }

  // 🌐 MODO REAL
  try {
    const { data } = await api.get("/mermas");

    return {
      ok: true,
      data: data.data || [],
    };

  } catch (err) {
    console.warn("⚠️ API falló, usando fallback local");

    const local = JSON.parse(localStorage.getItem("mermas")) || [];

    return {
      ok: true,
      data: local.length ? local : mockMermas,
    };
  }
};

/**
 * 🔹 CREATE MERMA
 */
export const createMermaAdapter = async (merma) => {

  // 🔥 MODO MOCK
  if (USE_MOCK) {
    console.log("🟡 Guardando en MOCK (localStorage)");

    const stored = JSON.parse(localStorage.getItem("mermas")) || [];

    const newMerma = {
      ...merma,
      id: Date.now(),
      time: "Ahora",
      leido: false,
      procesado: false,
      impacto: Number(merma.quantity) || 1,
      prioridad: "media"
    };

    const updated = [newMerma, ...stored];

    localStorage.setItem("mermas", JSON.stringify(updated));

    return {
      ok: true,
      data: newMerma,
    };
  }

  // 🌐 MODO REAL
  try {
    const { data } = await api.post("/mermas", merma);

    return {
      ok: true,
      data,
    };

  } catch (err) {
    console.warn("⚠️ API falló, guardando local");

    const stored = JSON.parse(localStorage.getItem("mermas")) || [];

    const newMerma = {
      ...merma,
      id: Date.now(),
      time: "Ahora",
      impacto: Number(merma.quantity) || 1,
    };

    const updated = [newMerma, ...stored];

    localStorage.setItem("mermas", JSON.stringify(updated));

    return {
      ok: true,
      data: newMerma,
    };
  }
};

/**
 * 🔹 GET LOCAL
 */
export const getLocalMermas = () => {
  return JSON.parse(localStorage.getItem("mermas")) || [];
};

/**
 * 🔹 CLEAR STORAGE
 */
export const clearMermas = () => {
  localStorage.removeItem("mermas");
};