import React, { useState } from 'react';
import './InputText.css';

function InputNum(props) {
  return (
    <input value={props.value} className={props.clase} type="number" required max={props.maximo} onChange={props.onChange} placeholder={props.placeholder}/>
  );
}

export default InputNum;
