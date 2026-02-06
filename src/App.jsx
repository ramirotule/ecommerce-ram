import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import About from "./pages/About";
import HowToBuy from "./pages/HowToBuy";
import Login from "./pages/Login";
import Prices from "./pages/Prices";
import Products from "./pages/Products";
import OtherProducts from "./pages/OtherProducts";
  import ReactGA from 'react-ga4';

import "./animations.css";

function App() {
  ReactGA.initialize("G-EJS5RRQKC8"); // Reemplaza con tu ID de seguimiento
  ReactGA.send("pageview");

 useEffect(() => {
     ReactGA.send({ hitType: "pageview", page: window.location.pathname });
   }, []);
  

  return (
    <Router>
      <div style={{ 
        minHeight: '100vh',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
      }}>
        {/* Header con navegación */}
        <Header />

        {/* Rutas */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/nosotros" element={<About />} />
          <Route path="/como-comprar" element={<HowToBuy />} />
          <Route path="/login" element={<Login />} />
          <Route path="/productos" element={<Products />} />
          <Route path="/precios" element={<Prices />} />
          <Route path="/otros-productos" element={<OtherProducts />} />

          <Route path="/dashboard" element={

            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          } />
        </Routes>

        {/* Botón flotante de WhatsApp */}
        <FloatingWhatsApp />
      </div>
    </Router>
  );
}

export default App;