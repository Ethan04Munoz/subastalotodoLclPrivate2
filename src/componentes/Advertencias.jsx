import React from "react";
import './Advertencias.css'

function Advertencias(props) {
  return (
    <div className={props.className}>
      {props.content}
    </div>
  );
}

export default Advertencias;
