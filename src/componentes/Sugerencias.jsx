import React from "react";
import './Sugerencias.css'

function Sugerencias(props) {
  return (
    <div className={props.className}>
      {props.content}
    </div>
  );
}

export default Sugerencias;
