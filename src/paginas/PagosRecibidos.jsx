import React, { useState, useEffect } from 'react';
import GhostBtn from '../componentes/GhostBtn.jsx';
import HeaderConBarraEnlaces from '../componentes/HeaderConBarraEnlaces.jsx';
import './LinkRouter.css';
import './formularioGen.css';
import SubHeaderNormalUser from '../componentes/SubHeaderNormalUser2.jsx';
import { useNavigate } from 'react-router-dom';
import './EditarPerfil.css';
import axios from './axiosConfig.js';
import Label from '../componentes/LblCentrado.jsx';
import { obtenerFotoPerfilGENERAL, obtenerLinkPerfil } from '../componentes/Metodos.js';
import './formularioGen.css';
import './PagosRecibidos.css';
import PaginaNoEncontrada from './PaginaNoEncontrada.jsx';
import ModalSesionCerrada from './ModalSesiónCerrada.jsx';

function PagosRecibidos(){
    const history = useNavigate();
    const [renderizar, setRenderizar] = useState("");
    useEffect(() => {
        axios.get('/validaciones/TipoUsuario')
            .then(response => {
                console.log("Validacion: ", response)
                if(response.data.tipoUsuario == 1){
                    setRenderizar('Normal')
                }else{
                    setRenderizar('NoEncontrada')
                }
            })
            .catch(error => {
                console.log(error.response);
                if (error.response && error.response.status === 401) {
                    history('/login'); // Redirecciona al usuario a la página de inicio de sesión
                }
            });
    }, []);
    const [sesionCerrada, setSesionCerrada] = useState(false);


    //Funcion para obtener la foto de perfil
    const [profileImagePath, setProfileImagePath] = useState(null);
    useEffect(() => {
        obtenerFotoPerfilGENERAL()
        .then(path => {
            setProfileImagePath(path);
        });
    }, []);
    
    const[linkPerfilPath, setlinkPerfilPath] = useState(null);
    useEffect(() => {
        console.log("Le estoy hablandoo wey");
        obtenerLinkPerfil()
        .then(path => {
            setlinkPerfilPath(path);
        });
    }, []);    

    const [reload, setReload] = useState(false);

    const [pagosRecibidos, setPagosRecibidos] = useState([]);
    useEffect(() => {
        axios.get("/pagos/pagosRecibidos")
        .then(response => {
            console.log("pagos enviables: ", response.data);
            setPagosRecibidos(response.data);
        })
        .catch(error => {
            if (error.response.data.error== "Usuario no autenticado"){
                setSesionCerrada(true);
            }
            console.log("Eror obteniendo pagos enviables: ", error);
        })
    }, [reload]);

    function verMisFondos(){
        axios.get("/stripe-dashboard-link")
        .then(response => {
            window.open(response.data.url);
        })
        .catch(error => {
            console.log("Error dahsboard link: ", error);
            if (error.response.data.error== "Usuario no autenticado"){
                setSesionCerrada(true);
            }
        }) 
    }

    if(renderizar=="Normal"){
        return(
            <div className='PagosRecibidos'>
                <HeaderConBarraEnlaces title= "Subastalotodo.com" img={profileImagePath} linkAlPerfil={linkPerfilPath}/>
                <SubHeaderNormalUser/>
                <Label tipoLbl='lblTituloColor' textoLbl="Mis pagos recibidos."/>
                
                {pagosRecibidos.length > 0 ? (
                    <table className="tablaPagosRecibidos">
                        <thead>
                            <tr className="gridearTablaPagosRecibidos">
                                <th className=""></th>
                                <th className=""></th>
                            </tr>
                        </thead>
                        <tbody>
                            {pagosRecibidos.map((pago) => (
                                <tr key={pago.id} className="gridearTablaPagosRecibidos">
                                    <td className=''>
                                        <img src={pago.imagen1} className='imgPagosRecibidos'/> 
                                    </td>
                                    <td className="">
                                        <p className=''>
                                            Nombre del producto: {pago.nombre_producto}
                                        </p>
                                        <p> 
                                            Detalles: {pago.detalles.length > 50 ? pago.detalles.substring(0, 30) + '...' : pago.detalles}
                                        </p>
                                        <p className=''>
                                            Vendido por: ${pago.ultima_oferta} MXN
                                        </p>
                                        <p className='textoVerde'>
                                            Pago recibido: ${( (pago.ultima_oferta * 0.914) - 3 ).toFixed(2)} MXN                                        
                                        </p>
                                        <GhostBtn
                                            children="Ver mis fondos en stripe"
                                            onClick={verMisFondos}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="formRegistro">
                        <Label tipoLbl="lblTitulo" textoLbl="Ey! Parece que ya terminaste por aquí." />
                    </div>
                )}
                {sesionCerrada && (
                    <ModalSesionCerrada/>
                )}
            </div>
        )
    }else if(renderizar.length > 1){
        return <PaginaNoEncontrada/>
    }
}

export default PagosRecibidos;