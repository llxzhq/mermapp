// src/App.jsx

import './App.css';
import { Routes, Route } from "react-router-dom";
import Dashboard from "./layouts/Dashboard";
import Home from "./pages/Home";
import Register  from './pages/Register';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Products from './pages/products/Products';
import CreateProduct from './pages/products/CreateProduct';
import EditProduct from './pages/products/EditProduct';
import SelectBranch from './pages/SelectBranch'
import Mermas from "./pages/Mermas";
import CreateMerma from "./pages/products/CreateMerma";
import Checkout from "./pages/Checkout";
import CargaMerma from "./pages/CargaMerma";
import SeleccionSucursal from "./pages/SeleccionSucursal";
import Historial from "./pages/Historial";
import MermaDetalle from "./pages/MermaDetalle";



export default function App() {

  return (
    <>
      <Routes>

        <Route path="/login" element={<Login />} />

        {/* <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/select-branch" element={<SelectBranch />} />
        <Route path="/mermas" element={<Mermas />} />
        <Route path="/mermas/create" element={<CreateMerma />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/mermas/carga" element={<CargaMerma />} />
        <Route path="/seleccion-sucursal" element={<SeleccionSucursal />} />
        <Route path="/historial" element={<Historial />} />
        <Route path="/mermas/detalle" element={<MermaDetalle />} /> */}

        <Route element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }>
          <Route index element={<Home />} />

          <Route path='/products' element={<Products />} />
          <Route path='/products/create' element={<CreateProduct />} />
          <Route path='/products/edit/:id' element={<EditProduct />} />

          
        </Route>

      </Routes>
    </>
  );
}
