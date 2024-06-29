import React, { useState, useEffect } from 'react';
import HeaderConBarraEnlaces from '../componentes/HeaderConBarraEnlaces.jsx';
import './LinkRouter.css';
import './formularioGen.css';
import SubHeaderNormalUser from '../componentes/SubHeaderNormalUser2.jsx';
import './EditarPerfil.css';
import { lazy } from 'react';
import Label from '../componentes/LblCentrado.jsx';
import { getLinkPerfil, getObtenerFotoPerfilGeneral } from '../funcionesDB/get.js';
const ImagenEditarPerfil = lazy(() => import('../componentes/lazy/ImagenEditarPerfil.jsx'));

function CancelPayment(){
    //Funcion para obtener la foto de perfil
    const [profileImagePath, setProfileImagePath] = useState(null);
        useEffect(() => {
          getObtenerFotoPerfilGeneral()
            .then(path => {
              setProfileImagePath(path);
            });
    }, []);
    
    const[linkPerfilPath, setlinkPerfilPath] = useState(null);
        useEffect(() => {
          console.log("Le estoy hablandoo wey");
          getLinkPerfil()
            .then(path => {
              setlinkPerfilPath(path);
            });
    }, []);
    return (
        <div className='cancelPayment'>
            <HeaderConBarraEnlaces title= "Subastalotodo.com" img={profileImagePath} linkAlPerfil={linkPerfilPath}/>
            <SubHeaderNormalUser/>
            <Label tipoLbl='lblTituloColor' textoLbl="Lamentamos que no hayas realizado tu pago!"/>
            <Label tipoLbl='lblCentrado' textoLbl="Si cancelaste tu pago por error, accede a tu chat para que puedas concretar tu compra :D"/>
            <Label tipoLbl='lblCentrado' textoLbl="Ya puedes cerrar esta pestaña."/>
        </div>
    )
}

export default CancelPayment;