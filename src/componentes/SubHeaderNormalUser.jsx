import React from 'react';
import './SubHeader.css';
import {Link} from 'react-router-dom';

function SubHeaderNormalUser(props) {
  return (
    <div className="subHeaderContenedor2">
      <Link className='LinkFondoNaranja' to="#productosmasqueridos">Productos más queridos</Link>
      <Link className='LinkFondoNaranja' to="#losmejoresvendedores">Los mejores vendedores</Link>
      <Link className='LinkFondoNaranja' to="#tepuedeinteresar">Te puede interesar</Link>
    </div>
  );
}

export default SubHeaderNormalUser;
