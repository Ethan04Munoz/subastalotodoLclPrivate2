import React from 'react';
import './LblCentrado.css'

const Label = (props) => {
  return (
    <div id={props.id} className={props.tipoLbl}>
      <label className={props.tipoLbl}>{props.textoLbl}</label>
    </div>
  );
}

export default Label;