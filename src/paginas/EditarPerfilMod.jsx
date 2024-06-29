import React, { useState, useEffect } from 'react';
import GhostBtn from '../componentes/componentes/GhostBtn.jsx';
import InputPassword from '../componentes/componentes/InputPassword.jsx';
import LblCentrado from '../componentes/componentes/LblCentrado.jsx';
import SubHeader from '../componentes/componentes/SubHeader.jsx';
import HeaderMods from '../componentes/componentes/HeaderMods.jsx';
import './LinkRouter.css';
import './formularioGen.css';
import { useNavigate } from 'react-router-dom';
import Advertencias from '../componentes/componentes/Advertencias.jsx';
import './EditarPerfil.css'
import axios from './axiosConfig.js'
import { sugerenciasArray } from '../componentes/Metodos.js';
import PaginaNoEncontrada from './PaginaNoEncontrada.jsx';
import { profileImagePathMod } from '../componentes/variablesGenerales.js';
import ModalSesionCerrada from './ModalSesiónCerrada.jsx';
const EditarPerfil = (props) => 
{
    const history = useNavigate();
    const [renderizar, setRenderizar] = useState("");
    useEffect(() => {
        axios.get('/validaciones/TipoUsuario')
            .then(response => {
                console.log("Validacion: ", response)
                if(response.data.tipoUsuario == 2){
                    setRenderizar('Mod')
                }
                else if(response.data.tipoUsuario == 3){
                    setRenderizar('ModNoVerificado')
                }
                else{
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

    
    const [formularioCont, setFormularioCont] = useState({contrasenaActual: '', nuevaContrasena: '', repetirNuevaContrasena: ''})
    const [advertencias, setAdvertencias] = useState({contenido: '', clase: 'advertenciasSinClase'})
    const clase = "input";
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

    function sugerencias(password){
        var recommendations = sugerenciasArray(password);
        if(recommendations.length != 0){
            actualizarAdvertencia({contenido: `Se sugiere ${recommendations.join(", además de ")}.`, clase: 'sugerenciasClase'})
        }else{
            actualizarAdvertencia({contenido: '', clase: 'advertenciasSinClase'})
        }
    }

    function actualizarAdvertencia(advertencia){
        setAdvertencias({
            contenido: advertencia.contenido,
            clase: advertencia.clase
        });
    }

    function enviarModificar(event){
        event.preventDefault();
        axios.put("/modificarcontrasenaMOD", formularioCont)
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
    if(renderizar=="Mod"  || renderizar=="ModNoVerificado"){
        return (
            <div className='editarPerfilMod'>
                <HeaderMods title= "Subastalotodo.com" img={profileImagePathMod}/>
                <SubHeader/>
                        <form className='formRegistro bajarFormEditarPerfil'>
                            <LblCentrado
                            tipoLbl="lblTitulo"
                            textoLbl="Cambiar contraseña"
                            />
                            <LblCentrado
                            tipoLbl="lblCentrado"
                            textoLbl="Contraseña actual"
                            />
                            <InputPassword
                            placeholder="La contraseña de tu usuario"
                            onChange={inputChange}
                            name="contrasenaActual"
                            clase={clase}
                            />
                            <LblCentrado
                            tipoLbl="lblCentrado"
                            textoLbl="Nueva contraseña"
                            />
                            <InputPassword
                            placeholder="La nueva contraseña que vas a utilizar"
                            onChange={inputChange}
                            name="nuevaContrasena"
                            clase={clase}
                            />
                            <LblCentrado
                            tipoLbl="lblCentrado"
                            textoLbl="Repitir contraseña"
                            />
                            <InputPassword
                            placeholder="Lo mismo que en la casilla anterior (La nueva contraseña que vas a utilizar)"
                            onChange={inputChange}
                            name="repetirNuevaContrasena"
                            clase={clase}
                            />
                            <Advertencias 
                            content={advertencias.contenido}
                            className={advertencias.clase}
                            />
                            <GhostBtn
                            children="Cambiar contraseña"
                            onClick={enviarModificar}
                            />
                        </form>
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