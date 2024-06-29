import React, { useState, useEffect } from 'react';
import './LinkRouter.css';
import './formularioGen.css';
import { useNavigate } from 'react-router-dom';
import './EditarPerfil.css';
import GhostBtn2 from '../componentes/componentes/GhostBtn2.jsx';
import axios from './axiosConfig.js';
import Label from '../componentes/componentes/LblCentrado.jsx';
import HeaderMods from '../componentes/componentes/HeaderMods.jsx';
import SubHeader from '../componentes/componentes/SubHeader.jsx';
import { profileImagePathMod } from '../componentes/variablesGenerales.js';
import './formularioGen.css';
import './Modal-PopUp.css';
import './EnviarPagos.css';
import PaginaNoEncontrada from './PaginaNoEncontrada.jsx';

function EnviarPagos(){
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

    const [reload, setReload] = useState(false);

    const [pagosEnviables, setPagosEnviables] = useState([]);
    useEffect(() => {
        axios.get("/pagosEnviables")
        .then(response => {
            console.log("pagos enviables: ", response.data);
            setPagosEnviables(response.data);
        })
        .catch(error => {
            console.log("Eror obteniendo pagos enviables: ", error);
        })
    }, [reload]);

    //Tiene que haber algo para eliminar el pago de ser enviable
    const [modalVisible, setModalVisible] = useState(false);

    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    function enviarPago(pagoEnviable){
        console.log("Entrando a la funcion enviarPago. Pago enviable: ", pagoEnviable);
        setProductoSeleccionado(pagoEnviable);
        axios.post("/transferir/Pagos/pagarAUnVendedor", {idProducto: pagoEnviable.id})
        .then(response => {
            console.log("Response transferir: ", response);
            setModalVisible(true);
            setReload(!reload);
        })
        .catch(error => {
            console.log("Transferir error: ", error);
            setReload(!reload);
        });
    }

    if(renderizar=="Mod"){
        return(
            <div className='EnviarPagos'>
                <HeaderMods title="Subastalotodo.com" img={profileImagePathMod}/>
                <SubHeader />
                <Label tipoLbl='lblTituloColor' textoLbl="Enviar pagos."/>
                {pagosEnviables.length > 0 ? (
                    <table className="tablaEnviarPagos">
                        <thead>
                            <tr className="gridearTablaEnviarPagos">
                                <th className="">Productos</th>
                                <th className="">Vendedor</th>
                                <th className=""></th>
                            </tr>
                        </thead>
                        <tbody>
                            {pagosEnviables.map((pago) => (
                                <tr key={pago.id} className="gridearTablaEnviarPagos">
                                    <td className=''>
                                    <img src={pago.fotoProducto} className='imgEnviarPagos'/> 
                                        <p>
                                            Nombre del producto: {pago.nombreProducto}
                                        </p>
                                        <p> 
                                            Detalles: {pago.detalles.length > 50 ? pago.detalles.substring(0, 30) + '...' : pago.detalles}
                                        </p>
                                        <p className=''>
                                            Total pagado: ${pago.ultimaOferta} MXN
                                        </p>
                                        <p className='textoVerde'>
                                            Total a pagar al vendedor: ${pago.pagoAlVendedor} MXN
                                        </p>
                                    </td>
                                    <td className="">
                                    <a className='perfilEnviarPagos' href={`/usuario/${pago.usuarioVendedor}`}>
                                            <div className="dividir50ElGrideoMalasreviews">
                                                <img src={pago.fotoPerfilVendedor} className='imgEnviarPagos'/> 
                                                <p>
                                                    {pago.usuarioVendedor}
                                                </p>
                                            </div>
                                        </a>
                                    </td>
                                    <td className="">
                                    <GhostBtn2
                                        clase="ghostBtnAltoNoMax"
                                        children="Enviar pago"
                                        onClick={(e) => enviarPago(pago)}
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
                {modalVisible && (
                <div className="modal">
                    <div className='modalAdv'>
                    <div className="aLaDerechaConGrid">
                        <button className='btnCerrarModal' onClick={() => setModalVisible(false)}>X</button>
                    </div>
                    <h2>Pago exitoso.</h2>
                    <Label tipoLbl="lblCentrado" textoLbl={`El pago al vendedor ${productoSeleccionado.usuarioVendedor} por el producto ${productoSeleccionado.nombreProducto} con id ${productoSeleccionado.id} ha sido realizado exitosamente.`}/>
                    </div>
                </div>
                )}
            </div>
        )
    }else if(renderizar.length > 1){
        return <PaginaNoEncontrada/>
    }
}

export default EnviarPagos;