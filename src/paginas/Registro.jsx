import React from 'react';
import GhostBtn from '../componentes/componentes/GhostBtn.jsx';
import InputText from '../componentes/componentes/InputText.jsx';
import InputPassword from '../componentes/componentes/InputPassword.jsx';
import LblCentrado from '../componentes/componentes/LblCentrado.jsx';
import Header from '../componentes/componentes/Header.jsx';
import Sugerencias from '../componentes/componentes/Sugerencias.jsx';
import Advertencias from '../componentes/componentes/Advertencias.jsx';
import InputEmail from '../componentes/componentes/InputEmail.jsx';
import './formularioGen.css';
import './LinkRouter.css';
import { sugerenciasArray, generarNombreUsuario} from '../componentes/Metodos.js';
import {Link} from 'react-router-dom';
import axios from './axiosConfig.js';
import { useState, useRef } from 'react'; 
import { useNavigate  } from 'react-router-dom';

const Registro = (props) => 
{
    const [formulario, setFormulario] = useState({usuario: '', correoElectronico: '', contraseña: '', repContraseña: ''});
    const [advertenciaCorreo, setAdvertenciaCorreo] = useState({adv: '', clase: 'advertenciasSinClase', input: 'input'});
    const [advertenciaContraseña, setAdvertenciaContraseña] = useState({adv: '', clase: 'advertenciasSinClase', input: 'inputPass'});
    const [contrasenaMinima, setContrasenaMinima] = useState(false);
    const [sugerenciasState, setSugerenciasState] = useState("");
    const [sugerenciasClassState, setSugerenciasClassState] = useState("sugerenciasSinClase");
    const [advertenciaRepetirContraseña, setAdvertenciaRepetirContraseña] = useState({adv: '', clase: 'advertenciasSinClase', input: 'inputPass'});
    const [advertenciasUsuarioState, setAdvertenciasUsuarioState] = useState("");
    const [advertenciasUsuarioClassState, setAdvertenciasUsuarioClassState] = useState("advertenciasSinClase");
    const [usuarioCorrectosInputClass, setUsuarioCorrectosInputClass] = useState("input");
    const [advertenciaGeneral, setAdvertenciaGeneral] = useState("");
    const [advertenciaGeneralClass, setAdvertenciaGeneralClass] = useState("advertenciasSinClase");
    const [nombreUsuario, setNombreUsuario] = useState(generarNombreUsuario());

    const history = useNavigate ();

    const inputChange = ({ target }) => {
        const { name, value } = target;
        limpiarGeneral();
        setFormulario({
            ...formulario,
            [name]: value
        });
        if(name == "usuario")
            limpiarUsuario();
        if(name == "correoElectronico")
            limpiarCorreo();
        if(name == "contraseña"){
            limpiarPassword();
            setContrasenaMinima(false);
            if(contrasenaMinima)
                sugerencias(value);
            if(value.length>=10)
                sugerencias(value);
        }
        if(name == "repContraseña")
            limpiarRepetirContraseña();
        console.log("FORMAAAAAAAAAAAA: ", formulario);
    }

    function sugerencias(password){
        var recommendations = sugerenciasArray(password);
        if(recommendations.length != 0){
            setSugerenciasState(`Se sugiere ${recommendations.join(", además de ")}.`); //Se usa el .join() para unir todos los elementos de una regla con el texto que se pasa en los parametros, así se mostrarán todos los elementos separados por un ", además de "
            setSugerenciasClassState("sugerenciasClase"); //Se añade la clase que permite que el elemento se visualice
            return false;
        }else{
            setSugerenciasState(''); //Se vacía por completo el contenido del div sugerencias
            setSugerenciasClassState("sugerenciasSinClase"); //Se asigna una clase que hace que el div sugerencias no tenga un display, por ende no se muestre en pantalla
        }
    }
    const [imagenState, setImagenState] = useState(null);

    function guardarImagen(event) {
        limpiarGeneral();
        const archivoImagen = event.target.files[0];
        setImagenState(archivoImagen);
    }

      function limpiarUsuario(){
        setAdvertenciasUsuarioState("");
        setAdvertenciasUsuarioClassState("advertenciasSinClase");
        setUsuarioCorrectosInputClass("input");
      }

      function limpiarCorreo(){
        setAdvertenciaCorreo({adv: '', clase: 'advertenciasSinClase', input: 'input'});
      }

      function limpiarPassword(){
        setAdvertenciaContraseña({adv: '', clase: 'advertenciasSinClase', input: 'inputPass'})
      }

      function limpiarRepetirContraseña(){
        setAdvertenciaRepetirContraseña({adv: '', clase: 'advertenciasSinClase', input: 'inputPass'})
      }

      function limpiarGeneral(){
        setAdvertenciaGeneral('');
        setAdvertenciaGeneralClass('advertenciasSinClase')
      }

      function actualizarRepetirContraseña(advertencia){
        setAdvertenciaRepetirContraseña({adv: advertencia, clase: 'advertenciasClase', input: 'inputAdvertenciaPass'});
      }

      function actualizarPassword(advertencia){
        setAdvertenciaContraseña({adv: advertencia, clase: 'advertenciasClase', input: 'inputAdvertenciaPass'});
        setContrasenaMinima(false);
      }

      function actualizarCorreo(advertencia){
        setAdvertenciaCorreo({adv: advertencia, clase: "advertenciasClase", input: "inputAdvertencia"});
      }

      function actualizarUsuario(advertencia){
        setAdvertenciasUsuarioState(
            <span>
                {advertencia}
                {advertencia.includes("Si es tu usuario, revisa tu email y accede ") && (
                    <Link className="LinkVerificacion" to="/verificacion">
                        aquí
                    </Link>
                )}
            </span>
        );
        setAdvertenciasUsuarioClassState("advertenciasClase");
        setUsuarioCorrectosInputClass("inputAdvertencia");
    }
    
      function actualizarAdvertenciaGeneral(advertencia, clase){
        setAdvertenciaGeneral(
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
        );
        setAdvertenciaGeneralClass(clase);
      }

    function enviarRegistro(event){
        event.preventDefault();
        const formData = new FormData();
        formData.append('usuario', formulario.usuario);
        formData.append('email', formulario.correoElectronico);
        formData.append('contrasena', formulario.contraseña);
        formData.append('repcontrasena', formulario.repContraseña);
        formData.append("imagen", imagenState);
        console.log("FORM DATAAAA" , formData)
        axios.post('/registro', formData)
        .then((response) =>{
            console.log(response);
            if(response.status==200)
                actualizarUsuario(response.data)
            if(response.status==201)
                actualizarCorreo(response.data)
            if(response.status==202)
                actualizarPassword(response.data)
            if(response.status==203)
                actualizarRepetirContraseña(response.data)
            if(response.status==246)
                actualizarAdvertenciaGeneral("La imagen que estás intentando subir es DEMASIADO GRANDE. El limite por imagen es de 1MB. Te recomendamos usar los siguientes compresores de imagenes: ", "advertenciasClase")
            if(response.status==266)
                actualizarAdvertenciaGeneral("La imagen que estás intentando subir es DEMASIADO GRANDE. El limite por imagen es de 1MB. Te recomendamos usar los siguientes compresores de imagenes: ", "advertenciasClase")
            if(response.status==267)
                actualizarAdvertenciaGeneral("Parece que estas intentando subir un tipo de archivo no compatible. Solo se permiten imagenes en png o jpg.", "advertenciasClase");
            if(response.status==298){
                history("/verificacion");
            }
            if(response.status==501){
                actualizarAdvertenciaGeneral("No se pudo enviar el correo electronico. Revisa que tus datos sean validos e intentalo más tarde.", "advertenciasClase")
            }
        })
        .catch((error) => {
            console.error(error);
            actualizarAdvertenciaGeneral("Algo salió mal, intentalo más tarde.", "advertenciasClase")
        })
    }

    function crearModerador(){
        axios.post('/crearModerador')
        .then((response) =>{
            console.log(response);})
        .catch((error) => {
            console.error(error);
            actualizarAdvertenciaGeneral("Algo salió mal, intentalo más tarde.", "advertenciasClase")
        })
    }

    return(
        <div className="registro">
            <Header 
            title="Subastalotodo.com"
            />
            <form className='formRegistro' method="POST" encType="multipart/form-data">
                <LblCentrado
                tipoLbl="lblTitulo"
                textoLbl="Crear una cuenta"
                />
                <LblCentrado
                tipoLbl="lblCentrado"
                textoLbl="Usuario"
                />
                <InputText
                placeholder={`Tu nombre de usuario. Por ejemplo: ${nombreUsuario}`}
                onChange={inputChange}
                name="usuario"
                clase={usuarioCorrectosInputClass}
                />
                <Advertencias
                content={advertenciasUsuarioState}
                className={advertenciasUsuarioClassState}
                />
                <LblCentrado
                tipoLbl="lblCentrado"
                textoLbl="Correo electronico"
                />
                <InputEmail
                placeholder={`Tu correo electrónico. Por ejemplo: ${nombreUsuario}@gmail.com`}
                clase={advertenciaCorreo.input}
                name="correoElectronico"
                onChange={inputChange}
                />
                <Advertencias
                content={advertenciaCorreo.adv}
                className={advertenciaCorreo.clase}
                />
                <LblCentrado id="contrasena"
                tipoLbl="lblCentrado"
                textoLbl="Contraseña"
                />
                <InputPassword
                placeholder="La contraseña que establecerás para tu usuario"
                clase={advertenciaContraseña.input}
                onChange={inputChange} 
                name="contraseña"
                />
                <Advertencias
                content={advertenciaContraseña.adv}
                className={advertenciaContraseña.clase}
                />
                <Sugerencias
                content={sugerenciasState}
                className={sugerenciasClassState}
                />
                <LblCentrado
                tipoLbl="lblCentrado"
                textoLbl="Repite tu contraseña"
                />
                <InputPassword
                placeholder="Ingresa tu contraseña nuevamente"
                clase={advertenciaRepetirContraseña.input}
                onChange={inputChange}
                name="repContraseña"
                />
                <Advertencias
                content={advertenciaRepetirContraseña.adv}
                className={advertenciaRepetirContraseña.clase}
                />
                <LblCentrado
                tipoLbl="lblCentrado"
                textoLbl="Subir una foto de perfil"
                />
                <input onChange={guardarImagen} type="file" name="imagen" accept="image/jpeg, image/png" id="imagenInput" crossOrigin="anonymous"/>
                <Advertencias
                content={advertenciaGeneral}
                className={advertenciaGeneralClass}
                />  
                <GhostBtn
                children="Crear perfil"
                onClick={enviarRegistro}
                />
                {/*<GhostBtn children="Crear mod" onClick={crearModerador} />*/}
                <Link className='LinkIns' to="/">¿Ya tienes una cuenta? Inicia sesión</Link>
            </form>
        </div>
    );
}

export default Registro;