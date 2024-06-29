import React, { useState } from 'react';
import './InputText.css';

const InputNumericoAumentarDisminuir = (props) => {
  const [value, setValue] = useState(props.minValue);

  const handleIncrease = () => {
    if(props.maxValue!= null && props.maxValue != undefined){
      if (value < props.maxValue) {
        // Asegurando que el valor sea un número antes de sumar
        setValue(Number(value) + 1);
      }
    }else{
      setValue(Number(value) + 1);
    }
  };

  const handleDecrease = () => {
    if (value > props.minValue) {
      // Asegurando que el valor sea un número antes de restar
      setValue(Number(value) - 1);
    }
  };

  return (
    <div className='inputAD'>
      <button onClick={handleDecrease}>-</button>
      <input
        type="number"
        value={value}
        onInput={(e) => setValue(parseInt(e.target.value))}
        onChange={props.onChange}
      />
      <button onClick={handleIncrease}>+</button>
    </div>
  );
};

export default InputNumericoAumentarDisminuir;