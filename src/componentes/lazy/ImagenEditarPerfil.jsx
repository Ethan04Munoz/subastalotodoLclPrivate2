import React from "react";

function ImagenEditarPerfil(props){
    return(
        <img src={props.src} key={props.key} />
    )
}

export default ImagenEditarPerfil;