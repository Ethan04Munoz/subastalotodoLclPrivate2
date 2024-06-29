import React from 'react';
import './Header.css'
import {Link} from 'react-router-dom';
import '../paginas/LinkRouter.css';
import FotoPerfilMod from './FotoPerfilMod';
import { Suspense, lazy } from 'react';

const LogoH = lazy(() => import('./lazy/ImagenLogoHeader'));

const HeaderMods = (props) => {
  return (
    <div className='supSupTopMenu'>
      <div className="modsHeaderHijo1">
        <div className='supTopMenu'>
          <Link className='linkRouterHeader' to="/">
          <div className="topMenu">
            <Suspense fallback={<div className='pCargando'>Cargando...</div>}>
              <LogoH/>
            </Suspense>
            <h1 className="topMenuTitle">{props.title}</h1>
          </div>
          </Link>
        </div>
      </div>
      <div className="modsHeaderHijo2">
        <FotoPerfilMod
          img={props.img}
        />
      </div>
    </div> 
  );
}

export default HeaderMods;
