import React from 'react';
import LblCentrado from '../componentes/LblCentrado';
import Header from '../componentes/Header';
import './PaginaNoEncontrada.css';
import { sadBookImage } from '../componentes/variablesGenerales';

const PaginaNoEncontrada = (props) =>{
    return(
        <div className='paginaNoEncontrada'>
            <Header 
            title="Subastalotodo.com"
            />
            <LblCentrado
            tipoLbl="lblTitulo"
            textoLbl="Lo sentimos, no encontramos la página que buscas."
            />
            <img src={sadBookImage} className="rotating" alt="Sad Book" />
        </div>
    )
}

export default PaginaNoEncontrada;