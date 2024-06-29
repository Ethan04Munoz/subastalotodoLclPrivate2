import React from 'react';
import { useNavigate } from 'react-router-dom';
import GhostBtn from '../componentes/componentes/GhostBtn.jsx';
import InputPassword from '../componentes/componentes/InputPassword.jsx';
import LblCentrado from '../componentes/componentes/LblCentrado.jsx';
import Header from '../componentes/componentes/Header.jsx';
import './LinkRouter.css';
import './formularioGen.css';
import axios from './axiosConfig.js'
import { useState } from 'react';
import Advertencias from '../componentes/componentes/Advertencias.jsx';
import PaginaNoEncontrada from './PaginaNoEncontrada.jsx';
import ModalSesionCerrada from './ModalSesiónCerrada.jsx';

function ModificarContraseña (){
    const history = useNavigate();
    const [renderizar, setRenderizar] = useState("");
    useEffect(() => {
        axios.get('/validaciones/TipoUsuario')
            .then(response => {
                console.log("Validacion: ", response)
                if(response.data.tipoUsuario == 2){
                    setRenderizar('Mod')
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

    const [formulario, setFormulario] = useState({contraseñaInicial: '', nuevaContraseña: '', repetirNuevaContraseña: ''});
    const [advertencias, setAdvertencias] = useState({contenido: '', clase: 'advertenciasSinClase'})
    const [inputPass1, setInputPass1] = useState("input");
    const [inputPass2, setInputPass2] = useState("input");
    const [inputPass3, setInputPass3] = useState("input");

    const inputChange = ({ target }) => {
        const { name, value } = target
        setFormulario({
            ...formulario,
            [name]: value
        })
        console.log(formulario);
    }

    function actualizarAdvertencia(advertencia){
        setAdvertencias({
            contenido: advertencia.contenido,
            clase: advertencia.clase
        });
    }

    function enviarModificar(event){
        event.preventDefault();
        console.log("enviar modificar axios")
        axios.put("/modificarcontrasenaMOD", formulario)
        .then((response) =>{
            console.log(response);
            if(response.status==209)
                actualizarAdvertencia({contenido: 'La contraseña no coincide', clase: 'advertenciasClase'})
            if(response.status==227)
                actualizarAdvertencia({contenido: 'La contraseña debe tener minimo 10 caracteres', clase: 'advertenciasClase'})
            if(response.status==226)
                actualizarAdvertencia({contenido: 'La contraseña debe tener minimo una mayuscula', clase: 'advertenciasClase'})
            if(response.status==225)
                actualizarAdvertencia({contenido: 'La contraseña debe tener minimo una minuscula', clase: 'advertenciasClase'})
            if(response.status==224)
                actualizarAdvertencia({contenido: 'La contraseña debe tener minimo un numero', clase: 'advertenciasClase'})
            if(response.status==238)
                actualizarAdvertencia({contenido: 'Repetir contraseña es un campo obligatorio', clase: 'advertenciasClase'})
            if(response.status==237)
                actualizarAdvertencia({contenido: 'Contraseña y repetir contraseña no coinciden', clase: 'advertenciasClase'})
            if(response.status==236)
                actualizarAdvertencia({contenido: 'Ocurrió un error inesperado', clase: 'advertenciasClase'})
            if(response.status==277){
                history("/login")
            }
            if(response.status==298){
                actualizarAdvertencia({contenido: 'Se ha cambiado tu contraseña exitosamente. Redirigiendo al login...', clase: 'advertenciasVerdes'})
                setTimeout(function() {
                    history("/login")
                }, 3000); // Cambiar "10000" por la cantidad de milisegundos que deseas esperar antes de redirigir al usuario
            }
        })
        .catch(error => {
            if (error.response.data.error== "Usuario no autenticado"){
                setSesionCerrada(true);
            }
        })
    }
    if(renderizar=="Mod"){
        return (
            <div className='modificarContraseñaPag'>
                <Header 
                title="Subastalotodo.com"
                />
                <form method='POST' className='formRegistro'>
                <LblCentrado
                tipoLbl="lblTitulo"
                textoLbl="Modificar contraseña. "
                />
                <LblCentrado
                tipoLbl="lblCentrado"
                textoLbl="Contraseña actual"
                />
                <InputPassword
                placeholder="Es la contraseña que recibiste por correo."
                onChange={inputChange}
                name="contraseñaInicial"
                clase={inputPass1}
                />
                <LblCentrado
                tipoLbl="lblCentrado"
                textoLbl="Nueva contraseña"
                />
                <InputPassword
                placeholder="La nueva contraseña que usaras."
                onChange={inputChange}
                name="nuevaContraseña"
                clase={inputPass2}
                />
                <LblCentrado
                tipoLbl="lblCentrado"
                textoLbl="Repite tu nueva contraseña"
                />
                <InputPassword
                placeholder="La contraseña que acabas de ingresar."
                onChange={inputChange}
                name="repetirNuevaContraseña"
                clase={inputPass3}
                />
                <Advertencias 
                content={advertencias.contenido}
                className={advertencias.clase}
                />
                <GhostBtn
                children="Cambiar contraseña" onClick={enviarModificar}/>
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

export default ModificarContraseña;