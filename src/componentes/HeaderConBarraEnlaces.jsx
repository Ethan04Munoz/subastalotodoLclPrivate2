import React, { useEffect } from 'react';
import './Header.css'
import SearchBar from './BarraBusqueda';
import {Link} from 'react-router-dom';
import './../LinkRouter.css';
import FotoPerfil from './FotoPerfil';
import { Suspense, lazy } from 'react';
import FiltrosComponenteBusqueda from './FiltrosBarra';
import axios from '../paginas/axiosConfig.js';
import { useState } from 'react';

const LogoH = lazy(() => import('./lazy/ImagenLogoHeader'));

const HeaderConBarraEnlaces = (props) => {
  const [usuario, setUsuario] = useState('');
  useEffect(() => {
      axios.get("/obtenerUsuario")
      .then((response) => {
          setUsuario(response.data);
      });
  }, []);

  const [mensajesSinLeer, setMensajesSinLeer] = useState(false);
  useEffect(() => {
    axios.get(`/mensajes_sin_leer/${usuario}`)
    .then((response) => {
        console.log("Mensajes sin leer basic: ", response.data)
        console.log("Mensajes sin leer: ", response.data);
        setMensajesSinLeer(response.data);
    });
  }, [usuario]);
  
  return (
    <div className='supSupTopMenu'>
      <div className='headerHijo1'>
        <Link className='linkRouterHeader' to="/">
          <div className="topMenu2">
            <Suspense fallback={<div className='pCargando'>Cargando...</div>}>
              <LogoH/>
            </Suspense>
            <h1 className="topMenuTitle">{props.title}</h1>
          </div>
        </Link>
      </div>
      <div className='headerHijo2 gridearHeaderHijo2'>
        <SearchBar placeholder="Buscar"/>
        <div></div>
      </div>
      <div className='headerHijo3'>
      <div className='contenerLinks'>
        {mensajesSinLeer ? 
          (
            <>
              <Link className='LinkFondoNaranja linkChatGrid' to="/chat"> <span>Chat</span> <i class="bi bi-circle-fill"></i></Link> <br/>
            </>
          ) : (
            <>
              <Link className='LinkFondoNaranja' to="/chat">Chat</Link> <br/>
            </>
          )}
        <Link className='LinkFondoNaranja' to="/publicarproducto">Vender</Link>
      </div>
      </div>
      <div className='headerHijo4'>
        <FotoPerfil 
          img={props.img}
          linkAlPerfil={props.linkAlPerfil}
        />
      </div>
    </div> 
  );
}

export default HeaderConBarraEnlaces;
