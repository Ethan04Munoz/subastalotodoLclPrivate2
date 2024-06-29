import React from 'react';
import './CalidadDelProducto.css';

function CategoriaLista(props) {
  return (
    <select value={props.defaultValue} className={props.claseDesplegable} onChange={props.onChange}>
      <option value="nada" disabled hidden>Selecciona una opción</option>
      <option value="electronicos_perifericos">Electrónicos y periféricos</option>
      <optgroup label="Componentes electrónicos">
        <option value="circuitos_integrados">Circuitos integrados</option>
        <option value="arduino">Arduino y tarjetas de desarrollo</option>
        <option value="general">General</option>
      </optgroup>
      <option value="dibujo_tecnico">Dibujo técnico</option>
      <option value="mochilas_y_bolsas">Mochilas y bolsas</option>
      <option value="geometria">Geometría</option>
      <option value="utiles_generales">Útiles generales</option>
      <option value="libros">Libros</option>
      <option value="herramientas">Herramientas</option>
      <option value="materiales_lab">Materiales de laboratorio</option>
      <option value="dispositivos_de_medicion">Dispositivos de medición</option>
      <option value="otros">Otros</option>
    </select>
  );
}

export default CategoriaLista;
