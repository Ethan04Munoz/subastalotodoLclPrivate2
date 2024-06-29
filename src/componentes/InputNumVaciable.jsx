import React, { useState } from 'react';
import './InputText.css';

function InputNum(props) {
  return (
    <input className={props.clase} type="number" max={props.maximo} onKeyUp={props.onChange} placeholder={props.placeholder}/>
  );
}

export default InputNum;