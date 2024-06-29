import React, { useState } from "react";
import './FotoPerfil.css'
import {Link} from 'react-router-dom';
import '../paginas/LinkRouter.css';
import axios from '../paginas/axiosConfig.js';
import { useNavigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';

const ImagenFotoPerfil = lazy(() => import('./lazy/ImagenFotoPerfil'));

function FotoPerfilMod(props) {
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
    <div className="contenedorFotoPerfil"
    onMouseLeave={handleMouseLeave}
    onMouseEnter={handleMouseEnter}
    >
      <Suspense fallback={<div className='pCargando'>Cargando...</div>}>
          <ImagenFotoPerfil img={propsImg}/>
      </Suspense>
      <i className="bi bi-caret-down-fill iconoBlanco" />
      <br/>
      <div className={claseSubmenu}>
      <Link className='linkFotoPerfil' to="/editarperfilmod">Editar perfil</Link>
      <Link className='linkFotoPerfil' to="/" onClick={cerrarSesion}>Cerrar sesión</Link>
      </div>
    </div>
  );
}

export default FotoPerfilMod;
