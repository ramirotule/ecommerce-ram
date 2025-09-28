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
import OtherProducts from "./pages/OtherProducts";
import "./animations.css";

function App() {
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
          <Route path="/precios" element={<Prices />} />
          <Route path="/otros-productos" element={<OtherProducts />} />

          <Route path="/admin" element={

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