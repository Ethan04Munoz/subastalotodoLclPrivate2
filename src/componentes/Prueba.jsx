import React, { useState } from 'react';

// Se define un componente de función llamado InputWithBorderColor que acepta dos propiedades: value y onChange
function Prueba({ value, onChange }) {
  // Se utiliza el hook useState para mantener un estado local borderColor
  const [borderColor, setBorderColor] = useState('black');

  // La función handleOnChange se llama cada vez que el usuario escribe en el input
  function handleOnChange(event) {
    // Se llama a la función onChange pasada como propiedad
    onChange(event);
    // Se cambia el valor del estado local borderColor a orange
    setBorderColor('orange');
  }

  // Se devuelve un elemento input con las siguientes propiedades:
  return (
    <input 
      type="text" 
      // value es igual a la prop value pasada
      value={value} 
      // onChange es igual a la función handleOnChange
      onChange={handleOnChange} 
      // Se establece un estilo inline para el color del borde igual a borderColor
      style={{ borderColor: borderColor }} 
    />
  );
}

// Se exporta el componente InputWithBorderColor para su uso en otras partes de la aplicación
export default Prueba;
