import React from 'react';
import './LinkRouter.css';
import './formularioGen.css';
import { useState, useEffect} from 'react'; 
import SubHeaderNormalUser from '../componentes/componentes/SubHeaderNormalUser2.jsx';
import GhostBtn from '../componentes/componentes/GhostBtn.jsx';
import axios from './axiosConfig.js';
import { useParams, useNavigate } from 'react-router-dom';
import { obtenerFotoPerfilGENERAL, obtenerLinkPerfil, formatearFecha } from "../componentes/Metodos.js";
import './ProductoSeleccionado.css';
import '../componentes/componentes/Slider.css';
import HeaderConBarraEnlaces from '../componentes/componentes/HeaderConBarraEnlaces.jsx';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Chat.css';
import InputText from '../componentes/componentes/InputTextVaciable.jsx';
import Label from '../componentes/componentes/LblCentrado.jsx';
import './ChatModal.css';
import CheckoutButton from '../componentes/componentes/CheckoutButton.jsx';
import PaginaNoEncontrada from './PaginaNoEncontrada.jsx';
import ModalSesionCerrada from './ModalSesiónCerrada.jsx';
import './componentes/InputText.css';
import HeaderMods from '../componentes/componentes/HeaderMods.jsx';
import SubHeader from '../componentes/componentes/SubHeader.jsx';
import {profileImagePathMod} from '../componentes/variablesGenerales.js';
import { Suspense, lazy } from 'react';
const LazyImage = React.lazy(() => import('../componentes/componentes/lazy/LazyImage.jsx')); // Asume que tienes un componente LazyImage

function Chat(){
    const params = useParams();
    const history = useNavigate();
    const [renderizar, setRenderizar] = useState("");
    const [permitir, setPermitir] = useState(null);
    const [usuarioReportante, setUsuarioReportante] = useState(null);
    useEffect(() => {
        axios.get('/validaciones/TipoUsuario')
          .then(response => {
            console.log("Validacion: ", response)
            if(response.data.tipoUsuario == 1){
                setRenderizar('Normal')
            }else if (response.data.tipoUsuario == 2){
                setRenderizar('Mod')
            }else{
                setRenderizar('NoEncontrada');
            }
          })
          .catch(error => {
            console.log(error.response);
            if (error.response && error.response.status === 401) {
                history('/login'); // Redirecciona al usuario a la página de inicio de sesión
            }
        });
        axios.get(`/permitirAccesoChat/${params.id}`)
        .then(response => {
            console.log("Response permitir acceso: ", response);
            if(response.data.permitido == false){
                setPermitir(false);
                console.log("Permitir false", response.data.permitido)
            }else {
                setPermitir(true);
                console.log("Permitir true", response.data.permitido)
            }
            if(response.data.usuarioReportador){
                setUsuarioReportante(response.data.usuarioReportador);
            }
        })
    }, [params]);
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

    const [modalVisible, setModalVisible] = useState(false);
    const [modalReportarMensaje, setModalReportarMensaje] = useState(false);
    const [modalReporteExitoso, setModalReporteExitoso] = useState(false);
    const [modalReportarChat, setModalReportarChat] = useState(false);
    const [modalEresModerador, setModalEresModerador] = useState(false);

    //Debe actualizarse cada que llegue un mensaje
    const [mensajes, setMensajes] = useState([]);

    const [mensaje, setMensaje] = useState('')

    const [usuario, setUsuario] = useState('');

    const [reloadChatsUsuario, setReloadChatsUsuario] = useState(false);
    const [chats, setChats] = useState([]);

    const [otroMiembroInfo, setOtroMiembroInfo] = useState('');

    const [mostrarBoton, setMostrarBoton] = useState(false);

    let touchTimer;
    const [isTouchEvent, setIsTouchEvent] = useState(false);
    const [mostrarBotonesProductoVencido, setMostrarBotonesProductoVencido] = useState(false);

    const [mensajeReportar, setMensajeReportar] = useState(null);

    useEffect(() => {
        axios.get("/obtenerUsuario")
        .then((response) => {
            setUsuario(response.data);
        })
        .catch((error) => {
            if (error.response.data.error== "Usuario no autenticado"){
                setSesionCerrada(true);
            }
        })
    }, []);

    useEffect(() => {
        axios.get("/chats/obtenerChatsUsuario")
        .then((response) => {
            setChats(response.data);
            console.log("Chats: ", response.data);
            console.log("Foto chat: ",  response.data[0].ruta_foto_perfil_otro_miembro);
        })
        .catch(error => {
            if (error.response.data.error== "Usuario no autenticado"){
                setSesionCerrada(true);
            }
            console.log("Error al obtener los chats: ", error.response)
        })
    }, [params]);

    useEffect(() => {
        axios.get(`chats/${params.id}/otroMiembro`)
        .then((response) => {
            setOtroMiembroInfo(response.data);
            console.log("otro miembro info: ", response.data)
        })
        .catch((error) => {
            if (error.response.data.error== "Usuario no autenticado"){
                setSesionCerrada(true);
            }
            console.log("Error en la obtención de otro miembro info: ", error)
        });
    }, [params]);

    useEffect(() => {
        console.log("Estas en marcar como leido")
        if (renderizar == "Normal"){
            console.log("Estas dentro de Normal, se debería marcar como leido")
            axios.post(`/marcar_como_leido/${params.id}`)
            .then((response) => {
                console.log("Marcado como leido: ", response.data);
                setReloadChatsUsuario(!reloadChatsUsuario);
            })
            .catch((error) => {
                console.log("Error al marcar como leido: ", error)
                if (error.response.data.error== "Usuario no autenticado"){
                    setSesionCerrada(true);
                }
            });
        } else if(renderizar == "Mod"){
            console.log("Estas en renderizar mod, no se marcara como leido")
            //setModalEresModerador(true);
        }else {
            console.log(`no estas en ningun renderizar. Tu valor de renderizar es:${renderizar}:`)
        }
    }, [params, renderizar, mensajes]);

    // Función que obtiene los mensajes
    const fetchMensajes = () => {
        axios.get(`/chats/${params.id}/mensajes`)
        .then((response) => {
            setMensajes(response.data);
        });
    };

    useEffect(() => {
        // Ejecutar inmediatamente al cargar
        fetchMensajes();
      
        // Luego ejecutar cada 2 segundos
        const interval = setInterval(fetchMensajes, 2000);
      
        // Limpia el intervalo al desmontar el componente
        return () => clearInterval(interval);
    }, []);

    function almacenarMensaje(event){
        setMensaje(event.target.value);
    }

    function enviarMensaje(e){
        e.preventDefault();
        if(renderizar == "Normal"){
            if(mensaje.length >= 255){
                setModalVisible(true);
            }else if(mensaje.length > 0 ){
                //Enviar el mensaje
                console.log("Enviando mensaje: ", mensaje, "Params: ", params);
                axios.post(`/chats/${params.id}/mensajes`, {texto: mensaje}).then((response) => {
                    fetchMensajes();
                    setMensaje('');
                })
                .catch((error) => {
                    console.log("Error al enviar mensaje: ", error)
                    if (error.response.data.error== "Usuario no autenticado"){
                        setSesionCerrada(true);
                    }
                })
            }
        } else if(renderizar == "Mod"){
            setModalEresModerador(true);
        }
    }

    useEffect(() => {
        fetchMensajes();
        console.log("Mensajes: ", mensajes)
        const mensajeDeOtroUsuario = mensajes.some(m => m.usuarioEmisor !== usuario);
        const ningunMensajeDelUsuario = mensajes.every(m => m.usuarioEmisor !== usuario);
        const mensajeSistema = mensajes.every(m => m.usuarioEmisor === "SISTEMA"); //Si el otro usuario es sistema no lo podemos reportar
        //console.log("Mensaje sistema: ", mensajeSistema)
        //console.log("Mensaje de otro usuario: ", mensajeDeOtroUsuario, "\nNingunMensaje: ", ningunMensajeDelUsuario)
        if (mensajeDeOtroUsuario && ningunMensajeDelUsuario && mensajeSistema==false) {
            setMostrarBoton(true);
        } else {
            setMostrarBoton(false);
        }
    }, [ usuario, params, mensajes]);
    

    function desplegarMenuReporte(mensajePar){
        //Desplegar un menú que sea para reportar el mensaje.
        console.log("Desplegando uwu");
        console.log("reportar mensaje: ", mensajePar.ID, "\nQue dice '", mensajePar.texto );
        setMensajeReportar(mensajePar)
        setModalReportarMensaje(true);
    }

    function reportarChat(e){
        e.preventDefault();        
        if (renderizar == "Normal"){
            axios.post(`/reportarChat/${params.id}`)
            .then((response) => {
                setModalReportarChat(false);
                setModalReporteExitoso(true);
                console.log("Chat reportado reportado: ",params.id,"\nResponse: ", response.data);
            })
            .catch((error) => {
                console.log("Error al reportar chat: ", error)
                if (error.response.data.error== "Usuario no autenticado"){
                    setSesionCerrada(true);
                }
            })
        } else if(renderizar == "Mod"){
            setModalEresModerador(true);
        }
    }

    function reportarMensaje(e){
        e.preventDefault();
        if (renderizar == "Normal"){
            axios.post(`/reportarMensaje/${mensajeReportar.ID}`)
            .then((response) => {
                setModalReportarMensaje(false);
                setModalReporteExitoso(true);
                console.log("Mensaje reportado: ", mensajeReportar.ID,"\nResponse: ", response.data);
            })
            .catch((error) => {
                console.log("Error al reportar mensaje: ", error)
                if (error.response.data.error== "Usuario no autenticado"){
                    setSesionCerrada(true);
                }
            })
        } else if(renderizar == "Mod"){
            setModalEresModerador(true);
        }
    }

    function eliminarMensajeRepublicar(){
        axios.post(`/eliminarMensajeRepublicar/${params.id}`)
        .then((response) => {
        });
    }

    function redirigirRepublicar(){
        if (renderizar == "Normal"){
            eliminarMensajeRepublicar();
            history(`/publicarproducto/${otroMiembroInfo.id}`)        
        } else if(renderizar == "Mod"){
            setModalEresModerador(true);
        }
    }

    useEffect(() => {
        //revisar que el otro usuario sea de tipo producto y que su mensaje incluya 'Prueba a repulicarlo cuanto antes!'
        //en caso de que sea verdad mostrarBotonesProductoVencido debe ser igual a true y en caso de que no debe ser false
        
        // Suponiendo que tienes una propiedad en 'otroMiembroInfo' que indique el tipo del usuario
        const esTipoProducto = otroMiembroInfo && otroMiembroInfo.tipoChat === "producto";

        // Revisar si algún mensaje del otro usuario contiene el texto específico
        const mensajeConTexto = mensajes.some((m) => {
            const esDelOtroUsuario = m.usuarioEmisor === "SISTEMA";
            const contieneTexto = m.texto.includes('Prueba a republicarlo cuanto antes!');

            //console.log("Mensaje de otro usuario:", esDelOtroUsuario);
            //console.log("Contiene el texto:", contieneTexto);

            return esDelOtroUsuario && contieneTexto;
        });
        //console.log("Mensajes: ", mensajes)

        //console.log("Variables de mostrar productos vencidos: ", esTipoProducto, mensajeConTexto)

        if (esTipoProducto && mensajeConTexto) {
            setMostrarBotonesProductoVencido(true);
        } else {
            setMostrarBotonesProductoVencido(false);
        }
    }, [ usuario, params, mensajes, mostrarBotonesProductoVencido]);

    function republicar(e){
        e.preventDefault();
        if(renderizar == "Normal"){
            eliminarMensajeRepublicar();
            console.log("ID del producto a republicar: ", otroMiembroInfo.id);
            axios.put(`/producto/${otroMiembroInfo.id}/disponible`)
            .then((response) => {
                console.log("Response republicar: ", response.data);
            })
            .catch((error) => {
                console.log("Error al reportar mensaje: ", error)
                if (error.response.data.error== "Usuario no autenticado"){
                    setSesionCerrada(true);
                }
            })
        }else if(renderizar == "Mod"){
            setModalEresModerador(true);
        }
    }

    const verificarEnter = (event) => {
        if(renderizar == "Normal"){
            if (event.key === 'Enter') {
                console.log('Enter key pressed!');
                if(mensaje.length >= 255){
                    setModalVisible(true);
                }else if(mensaje.length > 0 ){
                    //Enviar el mensaje
                    console.log("Enviando mensaje: ", mensaje, "Params: ", params);
                    axios.post(`/chats/${params.id}/mensajes`, {texto: mensaje}).then((response) => {
                        fetchMensajes();
                        setMensaje('');
                    })
                    .catch((error) => {
                        console.log("Error al enviar mensaje: ", error)
                        if (error.response.data.error== "Usuario no autenticado"){
                            setSesionCerrada(true);
                        }
                    })
                }
            }
        }else if(renderizar == "Mod"){
            setModalEresModerador(true);
        }
    }

    if(renderizar == "Normal" || renderizar == "Mod"){
        return(
            <div className='divChat'>
                {renderizar=="Normal" ? (
                <>
                    <HeaderConBarraEnlaces title="Subastalotodo.com" img={profileImagePath} linkAlPerfil={linkPerfilPath}/>
                    <SubHeaderNormalUser/>
                </>
                ):(
                <>
                    <HeaderMods title="Subastalotodo.com" img={profileImagePathMod}/>
                    <SubHeader/>
                </>
                )}
                    <div className="recuadroChat">
                        <div className="contenedorChats">
                        {chats.map((chat, index) => 
                                {
                                    if(chat.tipo=="producto"){
                                        return(
                                            <a href={`/chat/${chat.ID}`} className='chatEnContenedorEnlace'>
                                                <div key={index} className='chatEnContenedor'>
                                                    <Suspense fallback={<div>Cargando...</div>}>
                                                        <LazyImage src={chat.ruta_foto_perfil_otro_miembro} alt="" />
                                                    </Suspense>
                                                    <p className='nombreOtroMiembroChat'>Producto: {chat.otro_miembro} <i class="bi bi-check-circle-fill"></i></p>
                                                    { chat.mensajes_no_leidos > 0 && <i className="bi bi-circle-fill"></i> }
                                                </div>
                                            </a>
                                        )
                                    }
                                    if(chat.tipo=="usuario"){
                                        return (
                                            <a href={`/chat/${chat.ID}`} className='chatEnContenedorEnlace'>
                                                <div key={index} className='chatEnContenedor'>
                                                    <Suspense fallback={<div>Cargando...</div>}>
                                                        <LazyImage src={chat.ruta_foto_perfil_otro_miembro} alt="" />
                                                    </Suspense>
                                                    <p className='nombreOtroMiembroChat'>{chat.otro_miembro}</p>
                                                    { chat.mensajes_no_leidos > 0 && <i className="bi bi-circle-fill"></i> }
                                                </div>
                                            </a>
                                            );
                                    }
                                    if(chat.tipo=="sistema"){
                                        return(
                                            <a href={`/chat/${chat.ID}`} className='chatEnContenedorEnlace'>
                                                <div key={index} className='chatEnContenedor'>
                                                    <Suspense fallback={<div>Cargando...</div>}>
                                                        <LazyImage src={`https://storage.googleapis.com/imagenes-server-bucket/perfilgenerico.jpg`} alt="" />
                                                    </Suspense>
                                                    <p className='nombreOtroMiembroChat'>{chat.otro_miembro} <i class="bi bi-check-circle-fill"></i></p>
                                                    { chat.mensajes_no_leidos > 0 && <i className="bi bi-circle-fill"></i> }
                                                </div>
                                            </a>
                                        )
                                    }
                                }
                            )}
                        </div>
                        <div className="contenedorConversacion">
                            {!params || Object.keys(params).length === 0 || permitir==false ?(
                                <>
                                    <div></div>
                                    <div className="mensajeDefault">Selecciona un chat para comenzar. </div>
                                </>
                            ) : ( 
                                <>
                                    {otroMiembroInfo.tipoChat== "producto" && (
                                        <div className="infoContacto">
                                            <img src={otroMiembroInfo.ruta_foto_perfil} alt="" />
                                            <p className='nombreOtroMiembroChat'>Producto: {otroMiembroInfo.username}<i class="bi bi-check-circle-fill"></i></p>
                                        </div>
                                    )}
                                    {otroMiembroInfo.tipoChat== "sistema" && (
                                        <div className="infoContacto">
                                            <img src={`https://storage.googleapis.com/imagenes-server-bucket/perfilgenerico.jpg`} alt="" />
                                            <p className='nombreOtroMiembroChat'>SISTEMA Subastalotodo.com <i class="bi bi-check-circle-fill"></i></p>
                                        </div>
                                    )}
                                    {otroMiembroInfo.tipoChat== "usuario" && (
                                        <div className="infoContacto">
                                            <img src={otroMiembroInfo.ruta_foto_perfil} alt="" />
                                            <p className='nombreOtroMiembroChat'>{otroMiembroInfo.username}</p>
                                        </div>
                                    )}
                                    <div className="conversacion">
                                        {modalVisible && (
                                            <div className="modal">
                                                <div className='modalAdv'>
                                                <div className="aLaDerechaConGrid">
                                                    <button className='btnCerrarModal' onClick={() => setModalVisible(false)}>X</button>
                                                </div>
                                                <Label tipoLbl="lblCentrado" textoLbl={"Cada mensaje tiene un limite de 255 carácteres. Tu mensaje actual tiene " + mensaje.length + " carácteres."}/>
                                                </div>
                                            </div>
                                        )}
                                        {modalReportarMensaje && (
                                            <div className="modal">
                                                <div className='modalAdvChat'>
                                                    <div className="aLaDerechaConGrid">
                                                        <button className='btnCerrarModal' onClick={() => setModalReportarMensaje(false)}>X</button>
                                                    </div>
                                                    <p> 
                                                        ¿Quieres reportar el mensaje de <span className='textBold'>{otroMiembroInfo.username}</span> que dice '<span className='textBold'>{mensajeReportar.texto}</span>'?. <br/> Ten en cuenta que 
                                                        se enviará una copia de todo el chat que tienes con <span className='textBold'>{otroMiembroInfo.username}</span> a los moderadores para realizar una revisión manual.
                                                        También ten en cuenta de que, en caso de que los moderadores sancionen con un strike a <span className='textBold'>{otroMiembroInfo.username}</span>, todo el chat que
                                                        tienes con el será eliminado.
                                                    </p>
                                                    <GhostBtn children="Si, reportar el mensaje" onClick={reportarMensaje}/>
                                                </div>
                                            </div>
                                        )}
                                        {modalReportarChat && (
                                            <div className="modal">
                                                <div className='modalAdvChat'>
                                                    <div className="aLaDerechaConGrid">
                                                        <button className='btnCerrarModal' onClick={() => setModalReportarChat(false)}>X</button>
                                                    </div>
                                                    <p> 
                                                        ¿Quieres reportar el chat con <span className='textBold'>{otroMiembroInfo.username}</span>? <br/> Ten en cuenta que 
                                                        se enviará una copia de todo el chat que tienes con <span className='textBold'>{otroMiembroInfo.username}</span> a los moderadores para realizar una revisión manual.
                                                        También ten en cuenta de que, en caso de que los moderadores sancionen con un strike a <span className='textBold'>{otroMiembroInfo.username}</span>, todo el chat que
                                                        tienes con el será eliminado.
                                                    </p>
                                                    <GhostBtn children="Si, reportar el chat" onClick={reportarChat}/>
                                                </div>
                                            </div>
                                        )}
                                        {modalReporteExitoso && (
                                            <div className="modal">
                                                <div className='modalAdvChat'>
                                                    <div className="aLaDerechaConGrid">
                                                        <button className='btnCerrarModal' onClick={() => setModalReporteExitoso(false)}>X</button>
                                                    </div>
                                                    <p className='modalSuccessTexto'> 
                                                        El reporte se llevó a cabo exitosamente.
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        {modalEresModerador && (
                                            <div className="modal">
                                                <div className='modalAdvChat'>
                                                    <div className="aLaDerechaConGrid">
                                                        <button className='btnCerrarModal' onClick={() => setModalEresModerador(false)}>X</button>
                                                    </div>
                                                    <h2>Ups! no tienes permiso para hacer eso.</h2>
                                                    <p className=''> 
                                                        Eres un moderador. No tienes permiso para interactuar con el chat de los usuarios de esta manera.
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        {mensajes.map((mensaje, index) => {
                                            return (
                                                <div 
                                                key={index}
                                                className={(mensaje.usuarioEmisor === usuario || mensaje.usuarioEmisor === usuarioReportante) ? 'mensaje-derecha' : 'mensaje-izquierda'}
                                                onContextMenu={mensaje.usuarioEmisor !== usuario ? (e) => {
                                                    if (!isTouchEvent) {
                                                    e.preventDefault();
                                                    desplegarMenuReporte(mensaje);
                                                    }
                                                } : undefined}
                                                onTouchStart={mensaje.usuarioEmisor !== usuario ? () => {
                                                    setIsTouchEvent(true);
                                                    touchTimer = setTimeout(() => {
                                                    desplegarMenuReporte(mensaje);
                                                    }, 2000); // 2 segundos
                                                } : undefined}
                                                onTouchEnd={() => {
                                                    setIsTouchEvent(false);
                                                    clearTimeout(touchTimer);
                                                }}
                                                >
                                            {
                                                    mensaje.esEnlace ? (
                                                    <a className='enlaceBlancoSinDecoracion' href={`/usuario/${mensaje.texto}`} target="_blank" rel="noopener noreferrer">
                                                        {mensaje.texto}
                                                    </a>
                                                    ) : mensaje.esBoton ? (
                                                        <>
                                                            <CheckoutButton productId={mensaje.texto}/>
                                                        </>
                                                    ) : (   
                                                    mensaje.texto
                                                    )
                                                }
                                                    <div className="fecha-mensaje">
                                                        {formatearFecha(mensaje.fecha)}
                                                        {/*console.log("Fecha mensaje usando formatearFecha: ", formatearFecha(mensaje.fecha))*/}
                                                        {/*console.log("Fecha actual: ", moment().tz('America/Mexico_City').format('YYYY-MM-DD HH:mm:ss'))*/}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        {mostrarBoton && (
                                            <GhostBtn children="Reportar este chat" onClick={() => setModalReportarChat(true)}/>
                                        )}
                                        {mostrarBotonesProductoVencido && (
                                            <>
                                                <GhostBtn children="Republicar"  onClick={republicar}/>
                                                <GhostBtn children="Editar para republicar" onClick={redirigirRepublicar}/>
                                            </>
                                        )}
    
                                    </div>
                                    <div className="enviarMensajes">
                                        <input placeholder="Escribe un mensaje." value={mensaje} className='input' onChange={almacenarMensaje} onKeyDown={verificarEnter} disabled={renderizar === "Mod"}/>
                                        <button className="palomitaEnviar" onClick={enviarMensaje}>
                                            <i className='bi bi-send-fill'></i>
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    {sesionCerrada && (
                        <ModalSesionCerrada/>
                    )}
            </div>
        )
    }else if(renderizar.length > 1){
        return <PaginaNoEncontrada/>
    }
    
}

export default Chat;