import React from 'react';
import './AgregarNuevoModerador.css';
import HeaderMods from '../componentes/HeaderMods.jsx';
import LblCentrado from '../componentes/LblCentrado.jsx'
import InputEmail from '../componentes/InputEmailVaciable.jsx';
import InputText from '../componentes/InputTextVaciable.jsx';
import GhostBtn from '../componentes/GhostBtn2.jsx';
import './formularioGen.css'; 
import SubHeader from '../componentes/componentes/SubHeader.jsx';
import { useState, useEffect  } from 'react'; 
import Advertencias from '../componentes/Advertencias.jsx';
import axios from './axiosConfig.js'
import { useNavigate } from 'react-router-dom';
import {profileImagePathMod} from '../componentes/variablesGenerales.js';
import { validarCorreoElectronico } from '../componentes/MetodosValidaciones.js';
import PaginaNoEncontrada from './PaginaNoEncontrada.jsx';

function AgregarNuevoModerador(props){
    const [inputUsuarioContenido, setInputUsuarioContenido] = useState(""); 
    const [inputUsuarioAdvertencia, setInputUsuarioAdvertencia] = useState({inputClase: "input", adv: "", advClase: "advertenciasSinClase"});
    const [inputCorreoContenido, setInputCorreoContenido] = useState("");
    const [inputCorreoAdvertencia, setInputCorreoAdvertencia] = useState({inputClase: "input", adv: "", advClase: "advertenciasSinClase"});
    const [botonDeshabilitado, setBotonDehabilitado] = useState(true);
    const [botonReportarClase, setBotonReportarClase] = useState("ghostBtn-Dis");
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
      
    function guardarUsuario(event){
        setInputUsuarioContenido(event.target.value);
        limpiarUsuario();
    }
    function guardarCorreo(event){
        setInputCorreoContenido(event.target.value);
        limpiarCorreo();
    }

    function advertenciaCorreo(advertencia){
        setInputCorreoAdvertencia({inputClase: "inputAdvertencia", adv: advertencia, advClase: "advertenciasClase"})
    }

    function advertenciaUsuario(advertencia){
        setInputUsuarioAdvertencia({inputClase: "inputAdvertencia", adv: advertencia, advClase: "advertenciasClase"})
    }

    function advertenciaVerde(advertencia){
        setInputCorreoAdvertencia({inputClase: "input", adv: advertencia, advClase: "advertenciasVerdes"})
    }

    function limpiarCorreo(){
        setInputCorreoAdvertencia({inputClase: "input", adv: "", advClase: "advertenciasSinClase"})
    }

    function limpiarUsuario(){
        setInputUsuarioAdvertencia({inputClase: "input", adv: "", advClase: "advertenciasSinClase"})
    }

    function limpiarTodo(){
        limpiarUsuario();
        limpiarCorreo();
    }

    function agregarModerador(event){
        event.preventDefault();
        axios.post('/agregarmoderador', { usuario: inputUsuarioContenido, email: inputCorreoContenido })
        .then((response) => {
            console.log(response.status)
            limpiarTodo();
            if(response.status==200)
                advertenciaUsuario(response.data);
            if(response.status==201)
                advertenciaCorreo(response.data);
            if(response.status==298){
                advertenciaVerde("El moderador ha sido agregado y recibió su usuario y contraseña por correo.")
                limpiarUsuario();
                setInputCorreoContenido("");
                setInputUsuarioContenido("");
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }

    useEffect(() => {
        if (inputUsuarioContenido.length === 0 || inputUsuarioContenido === null || inputCorreoContenido.length === 0 || inputCorreoContenido === null ) {
          setBotonDehabilitado(true);
          setBotonReportarClase("ghostBtn-Dis");
        } else {
            if(validarCorreoElectronico(inputCorreoContenido)==0){
                setBotonDehabilitado(true);
                setBotonReportarClase("ghostBtn-Dis");
            }else {
                setBotonDehabilitado(false);
                setBotonReportarClase("ghostBtn");
            }
        }
      }, [inputUsuarioContenido, inputCorreoContenido]);

    if(renderizar== "Mod"){
        return(
            <div className='agregarNuevoModerador'>
                <HeaderMods title="Subastalotodo.com" img= {profileImagePathMod}/>
                <SubHeader/>
                <LblCentrado tipoLbl="lblTituloColor" textoLbl="Agregar nuevo moderador"/>
                <form className='formRegistro' method="POST">
                    <LblCentrado tipoLbl="lblTitulo" textoLbl="Agregar nuevo moderador"/>
                    
                    <LblCentrado tipoLbl="lblCentrado" textoLbl="Usuario"/>
                    <InputText
                    placeholder="El nombre de usuario que tendrá este moderador. Por ejemplo: karencita123"
                    clase={inputUsuarioAdvertencia.inputClase}
                    onChange={guardarUsuario}
                    value={inputUsuarioContenido}
                    />
                    <Advertencias content={inputUsuarioAdvertencia.adv} className={inputUsuarioAdvertencia.advClase}/>

                    <LblCentrado tipoLbl="lblCentrado" textoLbl="Correo electronico"/>
                    <InputEmail
                    placeholder="Correo electronico del nuevo moderador. Por ejemplo: karen123@gmail.com"
                    clase={inputCorreoAdvertencia.inputClase}
                    onChange={guardarCorreo}
                    value={inputCorreoContenido}
                    />
                    <Advertencias content={inputCorreoAdvertencia.adv} className={inputCorreoAdvertencia.advClase}/>

                    <GhostBtn
                    children="Agregar"
                    onClick={agregarModerador}
                    disabled={botonDeshabilitado}
                    clase={botonReportarClase}
                    />
                </form>
            </div>
        )
    }else if(renderizar.length > 1){
        return <PaginaNoEncontrada/>
    }
}
export default AgregarNuevoModerador;