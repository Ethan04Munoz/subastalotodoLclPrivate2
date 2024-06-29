import React from 'react';
import GhostBtn from '../componentes/GhostBtn.jsx';
import InputText from '../componentes/InputTextVaciable.jsx';
import LblCentrado from '../componentes/LblCentrado.jsx';
import Header from '../componentes/Header.jsx';
import InputNum from '../componentes/InputNumVaciable.jsx';
import { useState } from 'react'; 
import { isNumber } from "../componentes/Metodos.js";
import axios from './axiosConfig.js'
import Advertencias from '../componentes/Advertencias.jsx';
import { useNavigate  } from 'react-router-dom';

const Verificacion = (props) =>{
    const [sugerenciasState, setSugerenciasState] = useState("");
    const [sugerenciasClassState, setSugerenciasClassState] = useState("sugerenciasSinClase");
    const [inputVerificacionClase, setInputVerificacionClase] = useState("input");
    const [inputUsuario, setInputUsuario] = useState("input");
    const [inputUsuarioContenido, setInputUsuarioContenido] = useState("");
    const [codigo6DigitosS, setCodigo6DigitosS] = useState(0);
    const history = useNavigate();

    function modificacion(event){
        let codigo6DigitosString = event.target.value;
        let codigo6Digitos = parseInt(event.target.value);
        setCodigo6DigitosS(codigo6Digitos);
        if(codigo6DigitosString.length <= 6){
            if(isNumber(codigo6Digitos)==false){
                actualizarAdvertencia("Por favor, ingresa el código de 6 numeros. Parece que no estas ingresando puramente datos numericos"); 
            }else{
                setSugerenciasState(""); 
                setSugerenciasClassState("sugerenciasSinClase"); 
            }
        }else{
            actualizarAdvertencia("Por favor, ingresa el código de 6 numeros. Parece que estas ingresando demasiados caracteres."); 
        }
    }

    function actualizarAdvertencia(advertencia){
        setSugerenciasState(advertencia); 
        setSugerenciasClassState("advertenciasClase"); 
    }

    function guardarUsuarioVer(event){
        setInputUsuarioContenido(event.target.value);
    }

    function advertenciaVerde(advertencia){
        setSugerenciasState(advertencia);
        setSugerenciasClassState("advertenciasVerdes");
        setInputUsuario("input");
    }

    async function enviarVerificacion(event){
        event.preventDefault();
        try {
            const response = await axios.post('/api/verify', {
              username: inputUsuarioContenido,
              verification_code: codigo6DigitosS,
            }); 
            if(response.status==289)
                actualizarAdvertencia("El usuario no existe o ya ha sido verificado.");
            if(response.status==288)
                actualizarAdvertencia("No quedan intentos restantes. El nombre de usuario y correo electronico no podrán ser vinculados a una cuenta de Subastalotodo.com en el futuro.")
            if(response.status==287){
                if(response.data==0){
                    actualizarAdvertencia("No quedan intentos restantes. El nombre de usuario y correo electronico no podrán ser vinculados a una cuenta de Subastalotodo.com en el futuro.")
                }else{
                    actualizarAdvertencia("El usuario y el código de verificacion no coinciden. Te quedan " + response.data + " intentos.");
                    console.log(response.data);
                }
            }
            if (response.status==286)
                actualizarAdvertencia("Ingresar un usuario es obligatorio para la verificacion");
            if (response.status === 200) {
              // Redirige al usuario al login o realiza cualquier otra acción necesaria
              console.log(response.data);
              advertenciaVerde("Felicidades, tu usuario ha sido verificado. Redirigiendo al login...");
              setTimeout(function() {
                history("/login")
            }, 10000); // Cambiar "10000" por la cantidad de milisegundos que deseas esperar antes de redirigir al usuario
            }
          } catch (error) {
            if (error.response) {
              console.log(error.response.data.message);
            } else {
              console.log('Error', error.message);
            }
          }
        }
    return(
        <div className='verificacionPage'>
                <Header title="Subastalotodo.com"/>
                <form className='formRegistro' method="POST">
                    <LblCentrado
                    tipoLbl="lblTitulo"
                    textoLbl="Verifica tu cuenta"
                    />
                    <LblCentrado
                    tipoLbl="lblCentrado"
                    textoLbl="Enviamos un código de 6 numeros a tu correo electronico."
                    />
                    <InputNum 
                    onChange={modificacion}
                    clase={inputVerificacionClase} 
                    value={codigo6DigitosS}
                    placeholder="123456"
                    />
                    <LblCentrado
                    tipoLbl="lblCentrado"
                    textoLbl="Ingresa el nombre de usuario que registraste."
                    />
                    <InputText
                    placeholder="Por ejemplo: pablito123"
                    clase={inputUsuario}
                    onChange={guardarUsuarioVer}
                    value={inputUsuarioContenido}
                    />
                    <Advertencias
                    content={sugerenciasState}
                    className={sugerenciasClassState}
                    />
                    <GhostBtn
                    children="Verificar"
                    onClick={enviarVerificacion}
                    />
                </form>
        </div>
    )
}

export default Verificacion;