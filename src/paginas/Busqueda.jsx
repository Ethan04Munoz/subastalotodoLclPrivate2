import React from 'react';
import '../componentes/SubHeader.css';
import './LinkRouter.css';
import './formularioGen.css';
import { useState, useEffect} from 'react'; 
import HeaderConBarraEnlaces from '../componentes/HeaderConBarraEnlaces.jsx';
import SubHeaderNormalUser from '../componentes/SubHeaderNormalUser.jsx';
import LblCentrado from '../componentes/LblCentrado.jsx';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import './MenuDeInicio.css';
import { obtenerFotoPerfilGENERAL, obtenerLinkPerfil } from '../componentes/Metodos.js';
import axios from './axiosConfig.js';
import {Link} from 'react-router-dom';
import FiltrosComponenteBusqueda from '../componentes/Filtros.jsx';
import './Busqueda.css';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../componentes/Slider.css'
import PaginaNoEncontrada from './PaginaNoEncontrada.jsx';
import ModalSesionCerrada from './ModalSesiónCerrada.jsx';

function Busqueda(){
    const params = useParams();
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
    }, [params]);
    const [sesionCerrada, setSesionCerrada] = useState(false);

    const [resultadosBusqueda, setResultadosBusqueda] = useState('');
    useEffect(() => {
        console.log('Componente montado');
        return () => {
          console.log('Componente desmontado');
        };
      }, [params]);


    
    const NextArrow = ({ onClick }) => {
        return (
        <button className="arrow next" onClick={onClick}>
            {'>'}
        </button>
        );
    };
    
    const PrevArrow = ({ onClick }) => {
        return (
        <button className="arrow prev" onClick={onClick}>
            {'<'}
        </button>
        );
    };
  

    const settings = {
        infinite: true,
        speed: 350,
        slidesToShow: 3,
        slidesToScroll: 1,
        nextArrow: <NextArrow/>,
        prevArrow: <PrevArrow/>
    };
      
    //Obtener foto de perfil y link al perfil
    const [profileImagePath, setProfileImagePath] = useState(null);
    const[linkPerfilPath, setlinkPerfilPath] = useState(null);
    useEffect(() => 
    {
        obtenerFotoPerfilGENERAL()
            .then(path => {
                setProfileImagePath(path);
            });
        obtenerLinkPerfil()
            .then(path => {
                  setlinkPerfilPath(path);
            });
        axios.post('/busqueda', { 
                textBusqueda: params.busqueda, 
                categoriaBusqueda: params.categoria, 
                fPrecio: params.fPrecio, 
                fOfertantes: params.fOfertantes, 
                fTiempo: params.fTiempo, 
                fComprarAhora: params.fComprarAhora
            })
            .then((response) => {
                console.log("Response de busqueda: ", response);
                let resultadosAxios = response;
                if(resultadosAxios.data=="No hay resultados."){
                    setResultadosBusqueda('')
                }else{
                    setResultadosBusqueda(resultadosAxios.data); // Guardamos los resultados en un state
                }
            })
            .catch((error) => {
                console.log("Error en tambien busqueda: ", error);
                if (error.response && error.response.status === 401) {
                    setSesionCerrada(true);
                }
            });
    }, [params, history]);

    const [productosTambienTePuedeInteresar, setProductosTambienTePuedeInteresar] = useState([]);
    useEffect(() => {
        axios.post("/tambienTePuedeInteresar",
            { 
                textBusqueda: params.busqueda, 
                categoriaBusqueda: params.categoria, 
                fPrecio: params.fPrecio, 
                fOfertantes: params.fOfertantes, 
                fTiempo: params.fTiempo, 
                fComprarAhora: params.fComprarAhora
            })
            .then((response) => {
                console.log("Response interesar: ", response.data);
                setProductosTambienTePuedeInteresar(response.data);
            })
            .catch((error) => {
                console.log("Error en tambien te puede interesar: ", error);
                if (error.response && error.response.status === 401) {
                    setSesionCerrada(true);
                }
            });
    }, [params]);

    if(renderizar=="Normal"){
        return(
            <div className='Busqueda'>
                <HeaderConBarraEnlaces
                title="Subastalotodo.com"
                img={profileImagePath}
                linkAlPerfil={linkPerfilPath}
                />
                <SubHeaderNormalUser/>
                <div className='dividirGrid2080'>
                    <div className='hijo1'>
                        <FiltrosComponenteBusqueda/>
                    </div>
                    <div className='hijo2'>
                        {resultadosBusqueda.length > 0 ? (
                            <table className="tablaCentrarProductos">
                                <tbody>
                                    {resultadosBusqueda.map((resultado) => (
                                        <Link to={`/producto/${resultado.id}`} className='noTextDecoration'>
                                            <tr key={resultado.id} className='gridearTablaProductosReportados productoResultado'> 
                                                <td className='uno'>
                                                    <img src={resultado.imagen1Low} className='imgTablaProductosReportados'/> 
                                                </td>
                                                <td className='dos'>
                                                    <div>
                                                        <LblCentrado tipoLbl="lblTituloIzquierda" textoLbl={resultado.nombre_producto}/>
                                                        {/* Si los detalles tienen más de 50 caracteres, lo recortamos y añadimos ... al final
                                                            Si no, mostramos los detalles completos */}
                                                        <p className='textoBloque'>{resultado.detalles.length > 50 ? resultado.detalles.substring(0, 50) + '...' : resultado.detalles}</p>
                                                    </div>
                                                </td>
                                                <td className='tres textoVerde'>
                                                    {resultado.ultima_oferta > 0 ? (
                                                        <p className='textoVerde'>{parseInt(resultado.ultima_oferta) + 1 } </p>
                                                    ) : (
                                                        <p className='textoVerde'>{parseInt(resultado.precio_minimo_aceptable) + 1} </p>
                                                    )}
                                                </td>
                                            </tr>   
                                        </Link>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                        <div className="formRegistro">
                            <LblCentrado tipoLbl="lblTitulo" textoLbl="Ey! No hemos encontrado productos relacionados. Intenta reducir tus filtros o buscar términos más generales."/>
                        </div>
                        )}
                        <div className="contenerSlider">
                        <LblCentrado tipoLbl="lblTitulo" textoLbl="También te puede interesar"/>
    
                        <div className="slider-container">
                            {productosTambienTePuedeInteresar.length < 3 ? ( 
                                <div className="formRegistro">
                                    <LblCentrado tipoLbl="lblTitulo" textoLbl="Lo sentimos! :( Aún no te conocemos lo suficiente para recomendarte algo."/>
                                </div>
                            ) : (
                                <Slider {...settings}>
                                    {productosTambienTePuedeInteresar.map((resultado, index) => (
                                        <div key={index} className="slider-element">
                                            <a className='noTextDecoration' href={`/producto/${resultado.id}`}>
                                                <tr key={resultado.id} className='gridearRowsBusquedaTambienTPI marginLeft10ProductosMasQueridos'> 
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
                                        </div>
                                    ))}
                                </Slider>
                            )}
                        </div>
                        </div>
                    </div>
                </div>
                {sesionCerrada && (
                    <ModalSesionCerrada/>
                )}
            </div>
        )
    }else if(renderizar.length > 1){
        return <PaginaNoEncontrada/>
    }
    
}

export default Busqueda;