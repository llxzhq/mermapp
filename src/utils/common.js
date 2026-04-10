// src/utils/common.js

export const toTitleCaseSafeES = (str) => {
  if (!str) return "";

  // Normalizar el string para manejar correctamente tildes y Ñ
  const normalized = str.normalize("NFC").toLowerCase();

  // Separar en palabras y capitalizar la primera letra
  const words = normalized.split(/\s+/);

  const titleCased = words.map((word) => {
    if (!word) return "";

    const firstChar = word[0].toLocaleUpperCase("es"); // Primera letra en mayúscula
    const rest = word.slice(1).toLocaleLowerCase("es"); // Resto en minúscula, incluyendo tildes

    return firstChar + rest;
  });

  return titleCased.join(" ");
};

export const widthClasses = {
  20: "sm:w-1/5",
  25: "sm:w-1/4",
  33: "sm:w-1/3",
  50: "sm:w-1/2",
  75: "sm:w-3/4",
  100: "sm:w-full",
};

export const slugify = (text) => {
    return text
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };