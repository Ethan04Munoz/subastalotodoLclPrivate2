import React from 'react';
import './Header.css';
import { Link } from 'react-router-dom';
import { Suspense, lazy } from 'react';

const LogoH = lazy(() => import('./lazy/ImagenLogoHeader'));

const TopMenu = (props) => {
  return (
    <Link className='linkRouterHeader' to="/">
      <div className="topMenu">
        <Suspense fallback={<div className='pCargando'>Cargando...</div>}>
          <LogoH/>
        </Suspense>
        <h1 className="topMenuTitle">{props.title}</h1>
      </div>
    </Link>
  );
}

export default TopMenu;