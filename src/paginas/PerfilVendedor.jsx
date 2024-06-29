import React from 'react';
import './componentes/SubHeader.css';
import LblCentrado from '../componentes/componentes/LblCentrado.jsx';
import HeaderMods from '../componentes/componentes/HeaderMods.jsx';
import SubHeader from '../componentes/componentes/SubHeader.jsx';
import './LinkRouter.css';
import './formularioGen.css';
import { useState, useEffect} from 'react'; 
import HeaderConBarraEnlaces from '../componentes/componentes/HeaderConBarraEnlaces.jsx';
import SubHeaderNormalUser from '../componentes/componentes/SubHeaderNormalUser2.jsx';
import axios from './axiosConfig.js';
import './MenuDeInicio.css';
import './EditarPerfil.css';
import { useParams } from 'react-router-dom';
import { formatearFechaLetras, obtenerFotoPerfilGENERAL, obtenerLinkPerfil } from "../componentes/Metodos.js";
import { Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import './PerfilVendedor.css';
import GhostBtn from '../componentes/componentes/GhostBtn.jsx';
import PaginaNoEncontrada from './PaginaNoEncontrada.jsx';
const ImagenFotoPerfil = lazy(() => import('../componentes/componentes/lazy/ImagenFotoPerfilVendedor.jsx'));
import { profileImagePathMod } from '../componentes/variablesGenerales.js';
import ModalSesionCerrada from './ModalSesiónCerrada.jsx';

function PerfilDelVendedor(){
  const { username } = useParams();    
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
  }, [username]);
  const [sesionCerrada, setSesionCerrada] = useState(false);

  const navegador = useNavigate();
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
      console.log("Le estoy hablandoo wey");
      obtenerLinkPerfil()
        .then(path => {
          setlinkPerfilPath(path);
        });
    }, []);

    function iniciarChat(e){
      e.preventDefault();
      console.log("Iniciar chat: ", usuarioInfo.username);
      axios.post("/crearChat", {miembro2: usuarioInfo.username})
      .then((response) => {
        console.log("RESPONSE CHAT: ", response);
        navegador(`/chat/${response.data.chatID}`)
      })
      .catch((error) => {
        console.error(error);
        if (error.response.data.error== "Usuario no autenticado"){
          setSesionCerrada(true);
        }
      })
    }

    const [usuarioInfo, setUsuarioInfo] = useState({id: null, username: null, user_type: null, email: null, r25: null, r50: null, fecha: null})
    const [productosSubastandoActualmente, setProductosSubastandoActualmente] = useState([]);
    // productosSubastandoActualmente es un arreglo de objetos.

    useEffect(() => {
      console.log("NOMBRE USUARIO: ", username)
      axios
        .get(`/usuario/${username}`)
        .then((response) => {
          if(response.status==277){
            navegador("/*")
          }else{
            console.log("LA RESPONSE DATA: ", response.data);
            let fechaFormateada = formatearFechaLetras(response.data.fecha_registro);
            setUsuarioInfo({id: null, username: response.data.username, user_type: null, email: null, r25: null, r50: (response.data.r50), fecha: fechaFormateada})
          }        
        })
        .catch((error) => {
          console.error('Error al obtener los datos del usuario: ', error);
        });
        console.log("obtenerProductosVendedor")
        axios
          .get(`/obtenerProductosVendedor/${username}`)
          .then((response) => {
            console.log("Response de obtenerProductosVendedor: ", response);
              if(response.data != "Ops! no encontramos la página que estás buscando"){
                setProductosSubastandoActualmente(response.data);
                //productosSubastandoActualmente tiene 
                console.log("Productos Vendedor: ", response.data);
              }
          })
          .catch((error) => {
            console.error('Error al obtener los datos del usuario: ', error);
          });
    }, [username]);

    const [subastasCompletadas, setSubastasCompletadas] = useState(0);
    useEffect(() => {
      // Función que consulta las subastas completadas
      const fetchSubastasCompletadas = () => {
        axios.get(`/subastas/vendido/${username}`)
        .then((response) => {
          console.log("Subastas completadas: ", response.data);
          setSubastasCompletadas(response.data.subastasCompletadas);
        })
      };

      // Ejecuta la función inmediatamente al montar el componente
      fetchSubastasCompletadas();

      // Configura un intervalo para ejecutar la función cada 6 segundos
      const intervalId = setInterval(fetchSubastasCompletadas, 6000); // 6000 milisegundos = 6 segundos

      // Limpieza: elimina el intervalo cuando el componente se desmonte
      return () => {
        clearInterval(intervalId);
      };
    }, [username]);

    const [strikeAñadido, setStrikeAñadido] = useState(false);
    function añadirStrike(){
      axios.post("/anadirStrike", {usuario: usuarioInfo.username})
      .then(response => {
        console.log(`Response añadir strike: ${response.data}`);
        setStrikeAñadido(true);
      })
      .catch(err => {
        console.log("Error al añadir strike: ", err);
      });
    }

    if(renderizar == "Normal" || renderizar == "Mod"){
      return (
        <div className='perfilDelVendedor'>
          {renderizar == "Mod" ? (
            <>
              <HeaderMods title="Subastalotodo.com" img={profileImagePathMod}/>
              <SubHeader />
            </>
          ) : (
            <>
              <HeaderConBarraEnlaces
              title="Subastalotodo.com"
              img={profileImagePath}
              linkAlPerfil={linkPerfilPath}
              />
              <SubHeaderNormalUser/>
            </>
          )}
            <div className='contenerSepacion2080PV'>
                <div className='divLateralIzqPerfilVendedor formBarraIzq'>
                    {/* Añadir foto*/}
                    <Suspense fallback={<div className='pCargando'>Cargando...</div>}>
                      <ImagenFotoPerfil r50={usuarioInfo.r50}/>
                    </Suspense>
                    {/* Vendedor.nombre */}
                    <LblCentrado            
                    tipoLbl="lblTituloColor"
                    textoLbl={usuarioInfo.username}
                    />
                    {/* Fecha de union a la plataforma */}
                    <LblCentrado
                    tipoLbl="lblCentrado"
                    textoLbl={"En la plataforma desde " + usuarioInfo.fecha + "."}
                    />
                    {/* Subastas concretadas con exito */}
                    <LblCentrado
                    tipoLbl="lblCentrado"
                    textoLbl={"Subastas completadas con éxito: " + subastasCompletadas }
                    />

                    {/* Botón de iniciar chat */}
                    <GhostBtn children="Iniciar chat" onClick={iniciarChat}/>
                    {/* Si es un usuario moderador puede añadir un strike */}
                    {renderizar == "Mod" && (
                      <GhostBtn children="Añadir Strike" onClick={añadirStrike}/>
                    )}
                </div>
                <div className='divLateralDerPerfilVendedor'>
                  <LblCentrado tipoLbl="lblTituloColor" textoLbl="Actualmente subastando"/>
                  {productosSubastandoActualmente.length > 0 ? (
                    <table className="tablaCentrarProductos80">
                        <tbody className='gridearEn3Columnas'>
                            {productosSubastandoActualmente.map((resultado) => (
                              <a className='noTextDecoration' href={`/producto/${resultado.id}`}>
                                <tr key={resultado.id} className='gridearRowsPerfilVendedor'> 
                                  <td className='imgTablaPerfilVendedor1'>
                                    <img src={resultado.imagen1Low} className='imgTablaPerfilVendedor'/> 
                                  </td>
                                  <td className='imgTablaPerfilVendedor2'>
                                    {resultado.ultima_oferta == 0 ? (
                                      <p className='precioPerfilVendedor'> <span className='letrapequeña'>desde </span> ${parseFloat(resultado.precio_minimo_aceptable) +1} </p>
                                    ) : (
                                      <p className='precioPerfilVendedor'> <span className='letrapequeña'>desde </span> ${resultado.ultima_oferta +1} </p>
                                    )}
                                  </td>
                                  <td className='imgTablaPerfilVendedor3 '>
                                    <div>
                                      <p className='nombreProductoPerfilVendedor'>{resultado.nombre_producto}</p>
                                      {/* Si los detalles tienen más de 50 caracteres, lo recortamos y añadimos ... al final
                                      Si no, mostramos los detalles completos */}
                                      <p className='detallesProductoPerfilVendedor'>{resultado.detalles.length > 50 ? resultado.detalles.substring(0, 50) + '...' : resultado.detalles}</p>
                                    </div>
                                  </td>
                                </tr>
                              </a>
                            ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="formRegistro">
                        <LblCentrado tipoLbl="lblTitulo" textoLbl={`Ups! Parece que ${usuarioInfo.username} no está subastando nada en este momento.`}/>
                      </div>
                    )}
                </div>
            </div>
            {strikeAñadido && (
              <div className="modal">
                <div className='modalAdv'>
                  <div className="aLaDerechaConGrid">
                    <button className='btnCerrarModal' onClick={() => setStrikeAñadido(false)}>X</button>
                  </div>
                  <h2>Strike añadido.</h2>
                  <LblCentrado tipoLbl="lblCentrado" textoLbl={`Haz añadido un strike a ${usuarioInfo.username}.`}/>
                </div>
              </div>
            )}
            {sesionCerrada && (
              <ModalSesionCerrada/>
            )}
        </div>
      )
    }else if(renderizar.length > 1){
      return <PaginaNoEncontrada/>
    }
}

export default PerfilDelVendedor;