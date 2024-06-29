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

function SuccesfulPayment(){
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
        <div className='successfulPayment'>
            <HeaderConBarraEnlaces title= "Subastalotodo.com" img={profileImagePath} linkAlPerfil={linkPerfilPath}/>
            <SubHeaderNormalUser/>
            <Label tipoLbl='lblTituloColor' textoLbl="Gracias por tu pago!"/>
            <Label tipoLbl='lblCentrado' textoLbl="Te enviaremos un código a tu chat. No compartas este codigo con nadie hasta que el vendedor te entregue tu producto."/>
            <Label tipoLbl='lblCentrado' textoLbl="Ya puedes cerrar esta pestaña."/>
        </div>
    )
}

export default SuccesfulPayment;