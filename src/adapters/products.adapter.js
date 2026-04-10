// src/adapters/products.adapter.js

import productsData from "../data/data.js";


export const getProductsData = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        if(!localStorage.getItem("products")) {
          localStorage.setItem("products", JSON.stringify(productsData));
        }

        const storedProducts = JSON.parse(localStorage.getItem("products"));

        resolve({
          ok: true,
          message: "Productos consultados correctamente",
          data: storedProducts
        });
      } catch (error) {
        resolve({
          ok: false,
          message: "Error consultando productos"
        });
      }
    }, 2000);
  })
};

export const newProduct = (formData) => {
  return new Promise((resolve) => {
    setTimeout(() => {

      try {
        const storedProducts = JSON.parse(localStorage.getItem("products")) || [];

        const newProductObj = {
          id: storedProducts.length > 0
            ? Math.max(...storedProducts.map(p => p.id)) + 1
            : 1,
          Imagen: "",
          Categoria: formData.get("categorie"),
          Nombre: formData.get("productName"),
        };

        storedProducts.push(newProductObj);

        localStorage.setItem("products", JSON.stringify(storedProducts));

        resolve({
          ok: true,
          message: "Producto guardado correctamente",
          data: newProductObj
        });

      } catch (error) {
        resolve({
          ok: false,
          message: "Error guardando producto"
        });
      }

    }, 3);
  });
};

export const getProductById = async (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      
      try {
        const storedProducts = JSON.parse(localStorage.getItem("products"));
        const product = storedProducts.find((item) => item.id == id);

        resolve({
          ok: true,
          message: "Producto consultado correctamente",
          data: product
        });
      } catch (error) {
        resolve({
          ok: false,
          message: "Error consultando producto"
        });
      }
    }, 2000);
  });
};

export const updateProduct = async (id, formData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      
      try {
        const storedProducts = JSON.parse(localStorage.getItem("products"));
        const product = storedProducts.find((item) => item.id == id);
        const data = Object.fromEntries(formData);
        const { categorie, productName } = data;

        product.Categoria = categorie;
        product.Nombre = productName;
        
        localStorage.setItem("products", JSON.stringify(storedProducts));

        resolve({
          ok: true,
          message: "Producto editado correctamente",
          data: []
        });

      } catch (error) {
        resolve({
          ok: false,
          message: "Error editando producto"
        });
      }

    }, 2000);
  });
};

export const deleteProduct = async (id) => {
 return new Promise((resolve) => {
  setTimeout(() => {
    
    try {
      const storedProducts = JSON.parse(localStorage.getItem("products"));
      const storedProductsFiltered = storedProducts.filter(item => item.id != id);
      
      localStorage.setItem("products", JSON.stringify(storedProductsFiltered));

      resolve({
          ok: true,
          message: "Producto elininado correctamente",
          data: []
        });
    } catch (error) {
      resolve({
        ok: false,
        message: "Error al eliminar producto"
      });
    }

  }, 2000);
 });
};