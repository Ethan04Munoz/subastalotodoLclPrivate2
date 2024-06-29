import React from 'react';
import GhostBtn2 from '../componentes/GhostBtn2.jsx';
import LblCentrado from '../componentes/LblCentrado.jsx';
import Advertencias from '../componentes/Advertencias.jsx';
import HeaderConBarraEnlaces from '../componentes/HeaderConBarraEnlaces.jsx';
import SubHeaderNormalUser from '../componentes/SubHeaderNormalUser.jsx';
import {useParams} from 'react-router-dom';
import axios from './axiosConfig.js'
import { useState, useEffect } from 'react'; 
import { useNavigate  } from 'react-router-dom';
import TextAreaR from '../componentes/TextAreaR.jsx';
import { obtenerFotoPerfilGENERAL, obtenerLinkPerfil } from '../componentes/Metodos.js';
import PaginaNoEncontrada from './PaginaNoEncontrada.jsx';
import ModalSesionCerrada from './ModalSesiónCerrada.jsx';

const ReportarProducto = () => {
  const {id} = useParams();
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
    }, [id]);
    const [sesionCerrada, setSesionCerrada] = useState(false);

    useEffect(() =>{
      console.log("Producto USUARIO: ", id);
      axios
          .get(`/reportarproducto/${id}`)
          .then((response) => {
            if(response.status==277)
            {
              history("/*")
            }
          })
    }, [id]);

    const [botonDeshabilitado, setBotonDehabilitado] = useState(true);
    const [botonReportarClase, setBotonReportarClase] = useState("ghostBtn-Dis");

    const [detallesProductoAdvertencia, setDetallesProductoAdvertencia] = useState({advertencia: '', clase: 'advertenciasSinClase', input: 'textAreaRezisable'});
    const [detallesProductoContenido, setDetallesProductoContenido] = useState('');
    function actualizarDetalles(advertencia){
        setDetallesProductoAdvertencia({advertencia: advertencia, clase: 'advertenciasClase', input: 'textAreaRezisableError'})
    }

    function limpiarAdvertenciasDetallesProducto(){
        setDetallesProductoAdvertencia({advertencia: '', clase: 'advertenciasSinClase', input: 'textAreaRezisable'})
    }

    useEffect(() => {
      if (detallesProductoContenido.length === 0 || detallesProductoContenido === null) {
        setBotonDehabilitado(true);
        setBotonReportarClase("ghostBtn-Dis");
      } else {
        setBotonDehabilitado(false);
        setBotonReportarClase("ghostBtn");
      }
    }, [detallesProductoContenido]);

    function guardarDetallesProducto(event){
        setDetallesProductoContenido(event.target.value);
        limpiarAdvertenciasDetallesProducto();
    }
    
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
      obtenerLinkPerfil()
        .then(path => {
          setlinkPerfilPath(path);
        });
    }, []);

    function enviarReporte(event){
      event.preventDefault();
      console.log("Enviando reporte");
      axios.post('/reportarproducto', {idproducto: id, detallesProducto: detallesProductoContenido})
      .then((response) => {
        console.log(response);
        if (response.data=="Se realizo el reporte con exito.")
          setDetallesProductoAdvertencia({advertencia: 'Producto reportado con éxito. Un moderador revisará tu reporte. Ya puedes cerrar esta ventana y continuar tus compras.', clase: 'advertenciasVerdes', input: 'textAreaRezisable'})
        if (response.data=="Cerrar sesion")
          history("/")
        if (response.data=="Detalles vacio")
          actualizarDetalles("Para reportar un producto debes ingresar un motivo.")
        if (response.data=="Demasiado texto en detalles")
          actualizarDetalles("Estás intentando ingresar demasiado texto. El máximo de caracteres es de 350.")
      })
      .catch((error) => {
        if (error.response.data.error== "Usuario no autenticado"){
          setSesionCerrada(true);
        }
        actualizarDetalles("Ocurrió un error, vuelve a intentar un reporte más tarde.");
      })
    }
    if(renderizar == "Normal"){
      return(
        <div className='reportarProducto'>
            <HeaderConBarraEnlaces
            title="Subastalotodo.com"
            img={profileImagePath} linkAlPerfil={linkPerfilPath}
            />
            <SubHeaderNormalUser/>
            <form className='formRegistro'>
            <LblCentrado
            tipoLbl="lblTitulo"
            textoLbl="Reportar un producto"
            />
            <LblCentrado
            tipoLbl="lblCentrado"
            textoLbl="Cuentanos cuál es el problema"
            />
            <TextAreaR clase={detallesProductoAdvertencia.input} onChange={guardarDetallesProducto}/>
            <Advertencias
            content={detallesProductoAdvertencia.advertencia}
            className={detallesProductoAdvertencia.clase}
            />  
            <GhostBtn2
            children="Enviar reporte"
            onClick={enviarReporte}
            disabled={botonDeshabilitado}
            clase={botonReportarClase}
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

export default ReportarProducto;