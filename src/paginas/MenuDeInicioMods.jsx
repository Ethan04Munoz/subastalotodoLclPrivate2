import React from 'react';
import './AgregarNuevoModerador.css';
import HeaderMods from '../componentes/componentes/HeaderMods.jsx';
import LblCentrado from '../componentes/componentes/LblCentrado.jsx'
import './formularioGen.css'; 
import SubHeader from '../componentes/componentes/SubHeader.jsx';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect} from 'react'; 
import axios from './axiosConfig.js';
import {profileImagePathMod} from '../componentes/variablesGenerales.js';
import PaginaNoEncontrada from './PaginaNoEncontrada.jsx';

function MenuDeInicioMods(props){
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

    if(renderizar=="Mod"){
        return (
            <div className='MenuDeInicioMods'>
                <HeaderMods title="Subastalotodo.com" img={profileImagePathMod}/>
                <SubHeader/>
                <div className='formRegistro'>
                <LblCentrado
                tipoLbl="lblTituloColor"
                textoLbl="Tus herramientas de moderación"
                />
                <p>¡Bienvenido al equipo de moderación de <i>Subastalotodo.com</i>! Nos complace que te unas a nosotros para ayudar a mantener nuestra comunidad en línea segura, inclusiva y agradable para todos. A continuación, te presentamos una breve introducción a las herramientas básicas de moderación que utilizarás en tu función como moderador:</p>
                <Link className='LinkGrande' to="/mensajesReportados">Mensajes reportados</Link>
                <p>Aquí encontrarás a tu disposición los chats con mensajes que los usuarios han reportado. Puedes revisar su chat, y con ello tomar la desición de si debes añadir un chat o no.</p>
                <Link className='LinkGrande' to="/nuevosChatsReportados">Nuevos chats reportados</Link>
                <p>Aquí encontrarás a tu disposición los nuevos chats que los usuarios han reportado. Puedes revisar su chat, y con ello tomar la desición de si debes añadir un chat o no.</p>
                <Link className='LinkGrande' to="/productosreportados">Productos reportados</Link>
                <p>
                    Esta sección te muestra los productos reportados por la comunidad. Revisa y valida cada producto, y en caso de infringir las normas, puedes eliminarlo, proporcionando una razón que será visible para el vendedor. Es esencial mantener la plataforma segura y confiable para todos los usuarios.
                </p>
                <Link className='LinkGrande' to="/malasreviews">Malas reviews</Link>
                <p>Aquí encontrarás las malas reviews que han dejado los usuarios (3.5 estrellas o menos). Es una sección más informativa, para que puedas ver que está saliendo mal en la plataforma y que vendedores han recibido las malas reviews. Además te puedes poner en contacto con los usuarios involucrados, tanto vendedor como comprador.</p>
                <Link className='LinkGrande' to="/ventasNoConcretadas">Ventas no concretadas</Link>
                <p>Aquí encontrarás las ventas en las que el usuario ya ha pagado, pero no se ha ingresado el código de finalización de ventas. Te permite ponerte en contacto con los usuarios involucrados, tanto vendedor como comprador.</p>
                <Link className='LinkGrande' to="/posiblesimagenesmanipuladas">Imagenes manipuladas</Link>
                <p>Aquí podrás encontrar las publicaciones que el algoritmo ha identificado como posiblemente manipuladas, para que puedas revisarlas manualmente. En caso de que la imagen sea falsa debes eliminar la publicación.</p>
                <Link className='LinkGrande' to="/agregarmoderador">Nuevo moderador</Link>
                <p>Este módulo te permite agregar un nuevo moderador a la plataforma. Solo necesitas ingresar el nombre de usuario y correo electrónico del candidato, y el sistema generará y enviará automáticamente las credenciales de acceso.</p>
                </div>
                <br/>
            </div>
        )
    }else if(renderizar.length > 1){
        return <PaginaNoEncontrada/>
    }
}

export default MenuDeInicioMods;