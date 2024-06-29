import React from 'react';
import { useNavigate } from 'react-router-dom';
import GhostBtn from '../componentes/GhostBtn.jsx';
import InputText from '../componentes/InputText.jsx';
import InputPassword from '../componentes/InputPassword.jsx';
import LblCentrado from '../componentes/LblCentrado.jsx';
import Header from '../componentes/Header.jsx';
import './LinkRouter.css';
import './formularioGen.css';
import { Link } from 'react-router-dom';
import axios from './axiosConfig.js'
import { useState } from 'react';
import Advertencias from '../componentes/Advertencias.jsx';
import { generarNombreUsuario } from '../componentes/Metodos.js';

const Login = (props) => {
  const [usuarioState, setUsuarioState] = useState("");
  const [contrasenaState, setContrasenaState] = useState("");
  const [datosCorrectosInputClass, setDatosCorrectosInputClass] = useState("inputPass");
  const [advertenciasState, setAdvertenciasState] = useState("");
  const [advertenciasClassState, setAdvertenciasClassState] = useState("advertenciasSinClase");
  const history = useNavigate();
  const [nombreUsuario, setNombreUsuario] = useState(generarNombreUsuario());
  function guardarUsuario(event) {
    limpiarContraseña()
    let usuario = event.target.value;
    setUsuarioState(usuario);
    console.log(usuarioState);
  }

  function guardarContrasena(event) {
    limpiarContraseña();
    let contrasena = event.target.value;
    setContrasenaState(contrasena);
    console.log(contrasenaState);
  }

  function actualizarContraseña(advertencia){
    setAdvertenciasState(advertencia);
    setAdvertenciasClassState("advertenciasClase");
    setDatosCorrectosInputClass("inputAdvertenciaPass");
  }

  function limpiarContraseña(){
    setAdvertenciasClassState("advertenciasSinClase");
    setDatosCorrectosInputClass("inputPass");
  }

  function iniciarSesion(event) {
    event.preventDefault();
    let username = usuarioState;
    let contrasena = contrasenaState;
    console.log("Tu contraseña: " + contrasenaState);
    // Hacemos la solicitud HTTP al backend
    axios.post('login', { usuario: username, contraseña: contrasena })
      .then((response) => {
        console.log(response.status); // 200 si el inicio de sesión fue exitoso
        if(response.status==209)
          actualizarContraseña("No se puede iniciar sesion. Verifica tu usuario y contraseña.");
        if(response.status==208)
          actualizarContraseña("No se puede iniciar sesion. Verifica tu usuario y contraseña.");
        if(response.status==207){
          actualizarContraseña("El usuario esta pendiente de verificacion. Redirigiendo...");
          setTimeout(function() {
            history("/verificacion")
        }, 2000); // Cambiar "10000" por la cantidad de milisegundos que deseas esperar antes de redirigir al usuario
        }
        if(response.status==298){
          actualizarContraseña("Todo cool.");
          history('/'); // Redireccionar al usuario a otra página
        }
      })
      .catch((error) => {
        //console.error(error);
        actualizarContraseña("Algo salio mal, vuelve a intentarlo más tarde.");
      });
  }

    return (
      <div className="login">
        <Header 
        title="Subastalotodo.com"
        />
        <form method='POST' className='formRegistro'>
            <LblCentrado
            tipoLbl="lblTitulo"
            textoLbl="Iniciar sesión"
            />
            <LblCentrado
            tipoLbl="lblCentrado"
            textoLbl="Usuario"
            />
            <InputText
            placeholder={`Por ejemplo: ${nombreUsuario}`}
            onChange={guardarUsuario}
            clase={datosCorrectosInputClass}
            />
            <LblCentrado
            tipoLbl="lblCentrado"
            textoLbl="Contraseña"
            />
            <InputPassword
            placeholder="La contraseña de tu usuario"
            onChange={guardarContrasena}
            clase={datosCorrectosInputClass}
            />
            <Advertencias
            content={advertenciasState}
            className={advertenciasClassState}
            />
            <GhostBtn
            children="Iniciar sesión"
            onClick={iniciarSesion}
            />
            <Link className='LinkIns' to="/Registro">¿No tienes una cuenta? Creala ahora</Link>
        </form>
      </div>
    );
}
  
export default Login;