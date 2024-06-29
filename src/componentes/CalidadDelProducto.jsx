import React from 'react';
import './CalidadDelProducto.css'
function CalidadDelProducto(props) {
  return (
    <select value={props.defaultValue} className='selectListaDesp' onChange={props.onChange} >
      <option value="nuevo">Nuevo</option>
      <option value="usado-comoNuevo">Usado - Como nuevo</option>
      <option value="usado-muyBueno">Usado - Muy bueno</option>
      <option value="usado-bueno">Usado - Bueno</option>
      <option value="usado-aceptable">Usado - Aceptable</option>
    </select>
  );
}

export default CalidadDelProducto;
