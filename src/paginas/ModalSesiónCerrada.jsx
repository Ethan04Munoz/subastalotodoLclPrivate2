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
            <h2>Ups! Parece que no estas conectado.</h2>
            <Label tipoLbl="lblCentrado" textoLbl="Debes volver a iniciar sesión."/>
            <NormalBtn children="Ir al login" onClick={() => history("/login")}/>
            </div>
        </div>
    )
}

export default ModalSesionCerrada;