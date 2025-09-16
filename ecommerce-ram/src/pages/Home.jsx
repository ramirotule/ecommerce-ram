import React from "react";
import BannerSlider from "../components/BannerSlider";
import { COLORS } from '../utils/colors';
import { Link } from 'react-router-dom';


const Home = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: COLORS.background.main,
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      padding: '0',
      margin: '0'
    }}>
      <div style={{
        width: '100vw',
        maxWidth: '100vw',
        margin: '0',
        padding: '0',
        position: 'relative',
        left: '50%',
        right: '50%',
        transform: 'translateX(-50%)'
      }}>
        <BannerSlider />
      </div>
      <div style={{
        marginTop: '40px',
        textAlign: 'center',
        color: COLORS.text.primary,
        fontSize: '25px',
        fontWeight: '500'
      }}>

        <p>
          Para ver precios y buscar productos, dirigite a la sección <b>Lista de Precios PDF</b> en el menú.<br/>
          <span style={{fontSize: '22px', color: COLORS.primary[500]}}>
             <Link to="/prices" style={{color: COLORS.primary[500], textDecoration: 'underline', fontWeight: '600', cursor: 'pointer'}}>haz click aquí para verla</Link>
          </span>
        </p>
      </div>
    </div>
  );
}

export default Home;