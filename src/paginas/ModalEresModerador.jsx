import React, { useState } from 'react';
import NormalBtn from '../componentes/NormalBtn';
import { useNavigate, useParams } from 'react-router-dom';
import Label from '../componentes/LblCentrado';
import './Modal-PopUp.css';

function ModalSesionCerrada(){
    const history = useNavigate();
    return(
        <div className="modal">
            <div className='modalAdv'>
            <h2>Ups! no tienes permiso para hacer eso.</h2>
            <Label tipoLbl="lblCentrado" textoLbl="Eres un moderador. No tienes permiso para interatuar con el chat de los usuarios"/>
            </div>
        </div>
    )
}

export default ModalSesionCerrada;