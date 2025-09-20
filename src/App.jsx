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
          <Route path="/about" element={<About />} />
          <Route path="/how-to-buy" element={<HowToBuy />} />
          <Route path="/login" element={<Login />} />
          <Route path="/prices" element={<Prices />} />
          <Route path="/other-products" element={<OtherProducts />} />

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