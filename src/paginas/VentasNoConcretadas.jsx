import React, { useState, useEffect } from 'react';
import './LinkRouter.css';
import './formularioGen.css';
import { useNavigate } from 'react-router-dom';
import './EditarPerfil.css';
import axios from './axiosConfig.js';
import { formatearFechaLetras } from '../componentes/Metodos.js';
import Label from '../componentes/LblCentrado.jsx';
import HeaderMods from '../componentes/HeaderMods.jsx';
import SubHeader from '../componentes/SubHeader.jsx';
import { profileImagePathMod } from '../componentes/variablesGenerales.js';
import './formularioGen.css';
import './Modal-PopUp.css';
import './VentasNoConcretadas.css';
import PaginaNoEncontrada from './PaginaNoEncontrada.jsx';

function VentasNoConcretadas(){
    const history = useNavigate();
    const [renderizar, setRenderizar] = useState("");
    useEffect(() => {
        axios.get('/validaciones/TipoUsuario')
            .then(response => {
                console.log("Validacion: ", response)
                if(response.data.tipoUsuario == 2){
                    setRenderizar('Mod')
                }else if(response.data.tipoUsuario == 3){
                    history('/editarperfilmod')
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

    const [ventasNoConcretadas, setVentasNoConcretadas] = useState([]);
    useEffect(() => {
        const llamarAPI = () => {
            axios.get("/obtenerVentasNoConcretados")
            .then(response => {
                setVentasNoConcretadas(response.data);
                console.log("Ventas no concretadas: ", response)
            })
            .catch(error => {
                console.log("Error: ", error)
            });
        };

        llamarAPI();
    }, []);
    
    if(renderizar=='Mod'){
        return (
            <div className='VentasNoConcretadas'>
                <HeaderMods title="Subastalotodo.com" img={profileImagePathMod}/>
                <SubHeader />
                <Label tipoLbl='lblTituloColor' textoLbl="Ventas no concretadas."/>
                {ventasNoConcretadas.length > 0 ? (
                    <table className="tablaVentasNoConcretadas">
                        <thead>
                            <tr className="gridearTablaVentasNoConcretadas">
                                <th className="">Vendedor</th>
                                <th className="">Comprador</th>
                                <th className="">Vista previa</th>
                                <th className=''>Venta?</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ventasNoConcretadas.map((venta) => (
                                <tr key={venta.id} className="gridearTablaVentasNoConcretadas">
                                    <td className=''>
                                        <a className='perfilVentasNoConcretadas' href={`/usuario/${venta.nombreVendedor}`}>
                                            <div className="dividir50ElGrideoMalasreviews">
                                                <img src={venta.fotoPerfilVendedor} className='imgVentasNoConcretadas'/> 
                                                <p>
                                                    {venta.nombreVendedor}
                                                </p>
                                            </div>
                                        </a>
                                    </td>
                                    <td className="">
                                        <a className='perfilVentasNoConcretadas' href={`/usuario/${venta.nombreComprador}`}>
                                            <div className="dividir80GridVentasNoConcretadas">
                                                <img src={venta.fotoPerfilComprador} className='imgVentasNoConcretadas'/> 
                                                <p>
                                                    {venta.nombreComprador}
                                                </p>
                                            </div>
                                        </a>
                                    </td>
                                    <td className="">
                                        <img src={venta.fotoProducto} className='imgVentasNoConcretadas'/> 
                                        <p>
                                            Nombre del producto: {venta.nombreProducto}
                                        </p>
                                        <p> 
                                            Detalles: {venta.detalles.length > 50 ? venta.detalles.substring(0, 50) + '...' : venta.detalles}
                                        </p>
                                    </td>
                                    <td className="">
                                        <p>Pagado por: ${venta.precioPagado}</p>
                                        <p>Fecha de cierre: {formatearFechaLetras(venta.fechaCierre)}</p>
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
            </div>
        )
    }else if(renderizar.length > 1){
        return <PaginaNoEncontrada/>
    }
}

export default VentasNoConcretadas;