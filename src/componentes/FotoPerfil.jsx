import React, { useState } from "react";
import './FotoPerfil.css'
import {Link} from 'react-router-dom';
import './../LinkRouter.css';
import axios from '../paginas/axiosConfig.js';
import { useNavigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';

const ImagenFotoPerfil = lazy(() => import('./lazy/ImagenFotoPerfil'));

function FotoPerfil(props) {
  const [claseSubmenu, setClaseSubMenu] = useState("noMostrar");
  const history = useNavigate();

  function handleMouseEnter() {
    setClaseSubMenu("siMostrar");
  }

  function handleMouseLeave() {
    setClaseSubMenu("noMostrar");
  }

  function cerrarSesion(event){
    event.preventDefault();
    axios.post('/cerrarsesion')
    .then((response) => {
      history("/login");
    });
  }
  const propsImg = props.img;
  return (
    <div className="contenedorFotoPerfil" onMouseLeave={handleMouseLeave} onMouseEnter={handleMouseEnter}>
      <div className="centrarFotoPerfilMasIcono">
        <Suspense fallback={<div className='pCargando'>Cargando...</div>}>
            <ImagenFotoPerfil img={propsImg}/>
        </Suspense>
        <i className="bi bi-caret-down-fill iconoBlanco" />
      </div>
      <div className={claseSubmenu}>
        <Link className='linkFotoPerfil' to="/editarperfil">Editar perfil</Link>
        <Link className="linkFotoPerfil" to={props.linkAlPerfil}>Ir a mi perfil</Link>
        <Link className="linkFotoPerfil" to="/reviews">Añadir reviews</Link>
        <Link className="linkFotoPerfil" to="/finalizarunaventa">Finalizar ventas</Link>
        <Link className='linkFotoPerfil' to="/" onClick={cerrarSesion}>Cerrar sesión</Link>
      </div>
    </div>
  );
}

export default FotoPerfil;
