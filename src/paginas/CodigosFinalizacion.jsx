import React from 'react';
import './LinkRouter.css';
import './formularioGen.css';
import { useState, useEffect} from 'react'; 
import SubHeaderNormalUser from '../componentes/componentes/SubHeaderNormalUser2.jsx';
import GhostBtn from '../componentes/GhostBtn.jsx';
import axios from './axiosConfig.js';
import { useParams, useNavigate } from 'react-router-dom';
import { obtenerFotoPerfilGENERAL, obtenerLinkPerfil } from "../componentes/Metodos.js";
import './ProductoSeleccionado.css';
import '../componentes/componentes/Slider.css';
import HeaderConBarraEnlaces from '../componentes/HeaderConBarraEnlaces.jsx';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Chat.css';
import InputText from '../componentes/InputTextVaciable.jsx';
import LblCentrado from '../componentes/LblCentrado.jsx';
import InputNum from '../componentes/componentes/InputNumVaciable.jsx';
import Advertencias from '../componentes/Advertencias.jsx';
import './ChatModal.css';
import PaginaNoEncontrada from './PaginaNoEncontrada.jsx';
import ModalSesionCerrada from './ModalSesiónCerrada.jsx';

function CodigosFinalizacion(){
    const params = useParams();
    const history = useNavigate();
    const [renderizar, setRenderizar] = useState("");
    useEffect(() => {
        axios.get('/validaciones/TipoUsuario')
          .then(response => {
            console.log("Validacion: ", response)
            if(response.data.tipoUsuario == 1){
                setRenderizar('Normal')
            }else if (response.data.tipoUsuario == 2){
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
      obtenerLinkPerfil()
        .then(path => {
          setlinkPerfilPath(path);
        });
    }, []);

    const [codigoFinalizacion, setCodigoFinalizacion] = useState(null);
    function guardarCodigo(event){
      setCodigoFinalizacion(parseInt(event.target.value));
    }

    const [idProducto, setIdProducto] = useState(null)
    function guardarID(event){
      setIdProducto(parseInt(event.target.value))
    }

    useEffect(() =>{
      console.log("Valores: ", codigoFinalizacion, idProducto)
    }, [codigoFinalizacion, idProducto]);

    function enviarFinalizarVenta(){
      axios.post("/finalizarUnaVenta", {id: idProducto, codigo: codigoFinalizacion})
      .then(response => {
        console.log("Response finalizar: ", response)
        setAdvertenciasClassState("advertenciasVerdes");
        setAdvertenciasState(response.data.success);
      })
      .catch(error => {
        console.log("Error finalizar: ", error)
        setAdvertenciasClassState("advertenciasClase");
        if (error.response) {
          // Si hay una respuesta del servidor, usa el mensaje de error de esa respuesta
          setAdvertenciasState(error.response.data.error || "Algo salió mal, intentalo más tarde.");
        } else {
          // Si no hay respuesta del servidor, muestra un mensaje genérico
          setAdvertenciasState("Algo salió mal, intentalo más tarde.");
        }
        if (error.response.data.error== "Usuario no autenticado"){
          setSesionCerrada(true);
        }
      })
    }

    
    const [advertenciasState, setAdvertenciasState] = useState("");
    const [advertenciasClassState, setAdvertenciasClassState] = useState("advertenciasSinClase");
    if(renderizar=="Normal"){
      return (
        <div className="codigosFinalizacion">
            <HeaderConBarraEnlaces title= "Subastalotodo.com" img={profileImagePath} linkAlPerfil={linkPerfilPath}/>
            <SubHeaderNormalUser/>
            <form method='POST' className='formRegistro'>
                <LblCentrado
                tipoLbl="lblTitulo"
                textoLbl="Finalizar una venta"
                />
                <p>Al vender un producto, cuando el usuario paga, retenemos el pago temporalmente. Cuando le entregas el producto, debes solicitar a tu cliente el código de finalización.
                    Con tú código de finalización, puedes recibir tu pago.
                </p>
                <LblCentrado  tipoLbl="lblCentrado" textoLbl="ID del producto: "/>
                <InputText placeholder="Lo puedes encontrar en el chat. Por ejemplo: 162" onChange={guardarID} clase='input'/>
                
                <LblCentrado tipoLbl="lblCentrado" textoLbl="Código de finalización:"/>
                <InputNum placeholder="Proporcionado por tu cliente. Por ejemplo: 111204" onChange={guardarCodigo} clase='input'/>
                
                <Advertencias content={advertenciasState} className={advertenciasClassState}/>
                <GhostBtn children="Finalizar" onClick={enviarFinalizarVenta}/>
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

export default CodigosFinalizacion;