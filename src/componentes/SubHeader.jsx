import React from 'react';
import './SubHeader.css';
import {Link} from 'react-router-dom';

function SubHeader() {
  return (
    <div className="subHeaderContenedor">
      <Link className='LinkFondoNaranja' to="/mensajesReportados">Mensajes reportados</Link>
      <Link className='LinkFondoNaranja' to="/nuevosChatsReportados">Nuevos chats reportados</Link>
      <Link className='LinkFondoNaranja' to="/productosreportados">Productos reportados</Link>
      <Link className='LinkFondoNaranja' to="/malasreviews">Malas reviews</Link>
      <Link className='LinkFondoNaranja' to="/ventasNoConcretadas">Ventas no concretadas</Link>
      <Link className='LinkFondoNaranja' to="/posiblesimagenesmanipuladas">Imagenes manipuladas</Link>
      <Link className='LinkFondoNaranja' to="/enviarpagos">Enviar pagos</Link>
      <Link className='LinkFondoNaranja' to="/agregarmoderador">Nuevo moderador</Link>
    </div>
  );
}

export default SubHeader;
