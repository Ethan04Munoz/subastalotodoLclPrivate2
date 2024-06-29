import React, { useState, useEffect, useRef } from 'react';
import GhostBtn from '../componentes/GhostBtn.jsx';
import InputPassword from '../componentes/InputPassword.jsx';
import LblCentrado from '../componentes/LblCentrado.jsx';
import HeaderConBarraEnlaces from '../componentes/HeaderConBarraEnlaces.jsx';
import './LinkRouter.css';
import './formularioGen.css';
import {Link} from 'react-router-dom';
import SubHeaderNormalUser from '../componentes/SubHeaderNormalUser2.jsx';
import { useNavigate } from 'react-router-dom';
import Advertencias from '../componentes/Advertencias.jsx';
import './EditarPerfil.css';
import GhostBtn2 from '../componentes/GhostBtn2.jsx';
import axios from './axiosConfig.js'
import { sugerenciasArray, getOperatingSystem, obtenerLinkPerfil } from '../componentes/Metodos.js';
import { Suspense, lazy } from 'react';
import PaginaNoEncontrada from './PaginaNoEncontrada.jsx';
import ModalSesionCerrada from './ModalSesiónCerrada.jsx';
import { getObtenerFotoPerfilGeneral } from '../funcionesDB/get.js';
const ImagenEditarPerfil = lazy(() => import('../componentes/lazy/ImagenEditarPerfil.jsx'));

const EditarPerfil = (props) => 
{
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
    
    const [botonConectarStripe, setBotonConectarStripe] = useState(false);
    useEffect(() => {
        axios.get('/stripe/tieneStripeID')
            .then(response => {
                console.log("Tiene STRIPE: ", response)
                if(response.data == "True"){
                    setBotonConectarStripe(false)
                }else{
                    setBotonConectarStripe(true)
                }
            })
            .catch((error) => {
                console.error(error);
                if (error.response.data.error== "Usuario no autenticado"){
                  setSesionCerrada(true);
                }
            })
    }, []);

    function createStripeAccount(){
        axios.get('/create-stripe-account')
        .then(response => {
            console.log("Validacion: ", response)  
            window.open(response.data.url);
        })
        .catch(error => {
            console.log(error.response);
            if (error.response.data.error== "Usuario no autenticado"){
                setSesionCerrada(true);
            }
        });
    }

    const [formularioCont, setFormularioCont] = useState({contrasenaActual: '', nuevaContrasena: '', repetirNuevaContrasena: ''})
    const [advertencias, setAdvertencias] = useState({contenido: '', clase: 'advertenciasSinClase'})
    const [advertenciasImagen, setAdvertenciasImagen] = useState('')
    const [advertenciasImagenClase, setAdvertenciasImagenClase] = useState('advertenciasSinClase')
    const clase = "inputPass";
    const inputChange = ({ target }) => {
        const { name, value } = target
        setFormularioCont({
            ...formularioCont,
            [name]: value
        })
        if(name=='nuevaContrasena' && value.length>=10)
            sugerencias(value)
        console.log(formularioCont);
    }

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
      obtenerLinkPerfil()
        .then(path => {
          setlinkPerfilPath(path);
        });
    }, []);

    function sugerencias(password){
        var recommendations = sugerenciasArray(password);
        if(recommendations.length != 0){
            actualizarAdvertencia({contenido: `Se sugiere ${recommendations.join(", además de ")}.`, clase: 'sugerenciasClase'})
        }else{
            actualizarAdvertencia({contenido: '', clase: 'advertenciasSinClase'})
        }
    }
    const [imageKey, setImageKey] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [ghostBtnClase, setGhostBtnClase] = useState("ghostBtn")
    const imagenRef = useRef(null);
    
    function actualizarAdvertencia(advertencia){
        setAdvertencias({
            contenido: advertencia.contenido,
            clase: advertencia.clase
        });
    }

    function actualizarAdvertenciaFoto(advertencia){
        setAdvertenciasImagen(
            <span>
                {advertencia}
                {advertencia.includes("La imagen que estás intentando subir es DEMASIADO GRANDE. El limite por imagen es de 1MB. Te recomendamos usar los siguientes compresores de imagenes: ") && (
                    <>
                        <Link className="LinkVerificacion" to="https://www.iloveimg.com/es/comprimir-imagen">
                        ILoveImage
                        </Link>{", "}
                        <Link className="LinkVerificacion" to="https://imagecompressor.com/es/">
                        Optimizilla
                        </Link>{" o "}
                        <Link className="LinkVerificacion" to="https://compressnow.com/es/">
                        Compressnow
                        </Link>{"."}      
                    </>
                )}
            </span>
        )
        setAdvertenciasImagenClase("advertenciasClase")
    }

    function limpiarAdvertenciaFoto(){
        setAdvertenciasImagen("");
        setAdvertenciasImagenClase("advertenciasSinClase")
    }

    function enviarModificar(event){
        event.preventDefault();
        axios.put("/editarperfilContrasena", formularioCont)
        .then((response) =>{
            console.log(response);
            if(response.status==200)
                actualizarAdvertencia({contenido: response.data, clase: 'advertenciasClase'})
            if(response.status==277){
                history("/login")
            }
            if(response.status==298){
                actualizarAdvertencia({contenido: 'Se ha cambiado tu contraseña exitosamente. Redirigiendo al menú principal...', clase: 'advertenciasVerdes'})
                setTimeout(function() {
                    history("/")
                }, 5000); // Cambiar "10000" por la cantidad de milisegundos que deseas esperar antes de redirigir al usuario
            }
        })
        .catch((error) => {
            console.error(error);
            if (error.response.data.error== "Usuario no autenticado"){
                setSesionCerrada(true);
            }
        })
    }
    function isMobileDevice() {
        // Para navegadores modernos que soportan userAgentData.mobile
        if (navigator.userAgentData && navigator.userAgentData.mobile) {
          return true;
        }
        
        // Verificación de fallback para navegadores que no soportan userAgentData
        const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
        return mobileRegex.test(navigator.userAgent);
      }

      console.log("User agent: ", navigator.userAgent);

      
    
    let sistemaOS = getOperatingSystem()
    console.log("El sistema operativo del usuario es: " + sistemaOS);

    function subirFoto(event) {
        limpiarAdvertenciaFoto();
        let imagen = event.target.files[0];
        setIsUploading(true); // Establece isUploading a true al iniciar la subida de la foto
        setGhostBtnClase("ghostBtn-Dis");
        const formData = new FormData();
        formData.append('imagen', imagen);
        console.log("IsUploading: ", isUploading)
        axios.put("/modificarFotoPerfil", formData)
            .then(response => {
                console.log(response)
                if(response.status==266){
                    actualizarAdvertenciaFoto("La imagen que estás intentando subir es DEMASIADO GRANDE. El limite por imagen es de 1MB. Te recomendamos usar los siguientes compresores de imagenes: ")
                }
                else if(response.status==267){
                    actualizarAdvertenciaFoto("Parece que estas intentando subir un tipo de archivo no compatible. Solo se permiten imagenes en png o jpg.");
                } else{
                    console.log("IsUploading i: ", isUploading)
                    console.log(response);
                    // Agrega un timestamp como query string para evitar problemas de cache en el navegador
                    setProfileImagePath(response.data + `?${Date.now()}`);
                    // Cambia el valor del imageKey para forzar el renderizado de la imagen de perfil
                    setImageKey(imageKey + 1);
                }
                setGhostBtnClase("ghostBtn")
                setIsUploading(false); // Establece isUploading a false una vez que se haya obtenido la respuesta
            })
            .catch(error => {
                //console.log(error);
                setIsUploading(false); // Establece isUploading a false en caso de error
                if (error.response.data.error== "Usuario no autenticado"){
                    setSesionCerrada(true);
                }
            });
    }
    
    if(renderizar== 'Normal'){
        return (
            <div className='editarPerfil'>
                <HeaderConBarraEnlaces title= "Subastalotodo.com" img={profileImagePath} linkAlPerfil={linkPerfilPath}/>
                <SubHeaderNormalUser/>
                <div className='contenerSepacion2Divs'>
                    <div className='divLateralIzqEditarPerfil'>
                        <form className='formBarraIzq' enctype="multipart/form-data">
                            <LblCentrado
                                tipoLbl="lblTitulo"
                                textoLbl="Cambiar foto de perfil"
                                />
                            {/*<img src={profileImagePath} alt="" key={imageKey} />*/}
                            <Suspense fallback={<div className='pCargando'>Cargando...</div>}>
                                <ImagenEditarPerfil src={profileImagePath} key={imageKey} />
                            </Suspense>
                            <GhostBtn2
                                children="Subir foto"
                                onClick={() => { imagenRef.current.click() }}
                                disabled={isUploading}
                                clase={ghostBtnClase}
                            />
                            {isMobileDevice() && (
                            <GhostBtn
                                children="Tomar foto"
                                onClick={() => { imagenRef.current.click() }}
                            />
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                capture="environment"
                                style={{ display: 'none' }}
                                ref={imagenRef}
                                onChange={subirFoto}
                            />
                            <Advertencias 
                            content={advertenciasImagen}
                            className={advertenciasImagenClase}
                            />
                            {botonConectarStripe ? (
                                <GhostBtn
                                    children="Connectar cuenta para recibir fondos."
                                    onClick={createStripeAccount}
                                />
                            ): ( 
                                <GhostBtn
                                    children="Ver mis fondos"
                                    onClick={() => history("/mispagos")}
                                />
                            )}
                        </form>   
                    </div>
                    <div className='divLateralDerEditarPerfil'>
                        <form className='formRegistro bajarFormEditarPerfil'>
                            <LblCentrado tipoLbl="lblTitulo" textoLbl="Cambiar contraseña"/>
                            
                            <LblCentrado tipoLbl="lblCentrado" textoLbl="Contraseña actual"/>
                            <InputPassword
                            placeholder="La contraseña de tu usuario"
                            onChange={inputChange}
                            name="contrasenaActual"
                            clase={clase}
                            />

                            <LblCentrado tipoLbl="lblCentrado" textoLbl="Nueva contraseña"/>
                            <InputPassword
                            placeholder="La nueva contraseña que vas a utilizar"
                            onChange={inputChange}
                            name="nuevaContrasena"
                            clase={clase}
                            />

                            <LblCentrado tipoLbl="lblCentrado" textoLbl="Repitir contraseña"/>
                            <InputPassword
                            placeholder="Lo mismo que en la casilla anterior (La nueva contraseña que vas a utilizar)"
                            onChange={inputChange}
                            name="repetirNuevaContrasena"
                            clase={clase}
                            />

                            <Advertencias content={advertencias.contenido} className={advertencias.clase}/>

                            <GhostBtn children="Cambiar contraseña" onClick={enviarModificar}/>
                        </form>
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

export default EditarPerfil;