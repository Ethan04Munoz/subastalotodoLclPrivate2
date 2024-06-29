import React from 'react';
import LblCentrado from '../componentes/componentes/LblCentrado.jsx';
import './LinkRouter.css';
import './formularioGen.css';
import { useState, useEffect} from 'react'; 
import HeaderConBarraEnlacesUsuario from '../componentes/componentes/HeaderConBarraEnlaces.jsx';
import SubHeaderNormalUser from '../componentes/componentes/SubHeaderNormalUser2.jsx';
import GhostBtn from '../componentes/componentes/GhostBtn.jsx';
import axios from './axiosConfig.js';
import { Link, useParams } from 'react-router-dom';
import { obtenerFotoPerfilGENERAL, obtenerLinkPerfil } from "../componentes/Metodos.js";
import './ProductoSeleccionado.css';
import { Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEstrellasImage } from '../componentes/Metodos.js';
import '../componentes/componentes/Slider.css';
import Slider from 'react-slick';
import Advertencias from '../componentes/componentes/Advertencias.jsx';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import LazyImage from '../componentes/componentes/lazy/LazyImage.jsx';
import NormalBtn from '../componentes/componentes/NormalBtn.jsx';
import PaginaNoEncontrada from './PaginaNoEncontrada.jsx';
import ModalSesionCerrada from './ModalSesiónCerrada.jsx';
import HeaderMods from '../componentes/componentes/HeaderMods.jsx';
import SubHeader from '../componentes/componentes/SubHeader.jsx';
import {profileImagePathMod} from '../componentes/variablesGenerales.js';

const ImagenVendedorProductoSeleccionado = lazy(() => import('../componentes/componentes/lazy/ImagenVendedorProductoSeleccionado.jsx'));

function ProductoSeleccionado(){
  const { id } = useParams();    
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
    }, [id]);
    
  const [sesionCerrada, setSesionCerrada] = useState(false);
  let [permitir, setPermitir] = useState(true);
  let [primeraOferta, setPrimeraOferta] = useState(false);
  let [ofertaUsuarioLcl, setOfertaUsuarioLcl] = useState(0);
  const [advertenciaGeneral, setAdvertenciaGeneral] = useState("");
  const [advertenciaGeneralClass, setAdvertenciaGeneralClass] = useState("advertenciasSinClase");
  const [reload, setReload] = useState(false);

  useEffect(() => {
    axios.get(`/productoseleccionado/${id}`)
      .then(response => {
        console.log("Productos seleccionados: ", response);
        if(response.data=="Producto con cantidad de ofertantes válida."){
          setPermitir(true);
        }else{
          setPermitir(false);
        }
      })
      .catch(error => {
        console.log("Error en los productos seleccionados: ", error)
        setPermitir(false);
      });
    }, [])

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

  const [modalEresModerador, setModalEresModerador] = useState(false);

  const [productoInfo, setProductoInfo] = useState(
    {
      nombre_producto: null,
      detalles: null, 
      calidad_producto: null, 
      permitir_ventas_instantaneas: null,
      usuario_vendedor: null,
      r25: null,
      coeficienteVendedor: null,
      imagenesProducto: [null, null, null, null]
    })
  
  useEffect(() => {
  console.log("Producto USUARIO: ", id)
  axios
    .get(`/producto/${id}`)
      .then((response) => 
      {
        if(response.status==277){
          history("/*")
        }
        else
        {
          const r = response.data;
          console.log("LA RESPONSE DATA JODER", r);
          // Filter out the null image paths before setting the state
          const imagenesProductoFiltered = [r.imagen1, r.imagen2, r.imagen3, r.imagen4].filter((ruta) => ruta !== null);
          let precioMinimoProv = parseFloat(r.precio_minimo_aceptable);
          let precioActualProv;
          console.log("Ultima oferta: ", r.ultima_oferta);
          if(r.ultima_oferta == 0 || r.ultima_oferta == null){
            precioActualProv = parseFloat(r.precio_minimo_aceptable) + 1; 
            setPrimeraOferta(true)
          }else{
            precioActualProv = parseFloat(r.ultima_oferta) + 1; 
          }
          setProductoInfo
          ({
            nombre_producto: r.nombre_producto,
            detalles: r.detalles, 
            calidad_producto: r.calidad_producto, 
            permitir_ventas_instantaneas: r.permitir_ventas_instantaneas,
            precioVentaDirecta: r.precio_venta_directa,
            usuario_vendedor: r.usuario_vendedor,
            r25: (r.r25),
            coeficienteVendedor: r.Coeficientevendedor,
            imagenesProducto: imagenesProductoFiltered,
            precioMinimo: precioMinimoProv,
            precioActual: precioActualProv,
          });
          setOfertaUsuarioLcl(precioActualProv);
        }
      })
      .catch((error) => 
      {
        console.error('Error al obtener los datos del usuario: ', error);
      });
  }, [id, reload]);
  
  useEffect(() => {
    console.log("ImagenesProducto: ", productoInfo);
    console.log("ImagenesProducto img :", productoInfo.imagenesProducto);
  }, [productoInfo])

  function limpiarGeneral(){
    setAdvertenciaGeneral('');
    setAdvertenciaGeneralClass('advertenciasSinClase')
  }

  function enviarOferta(e){
    e.preventDefault();
    if (renderizar == "Normal"){
      console.log("Estamos enviando la oferta");
      if(ofertaUsuarioLcl < productoInfo.precioActual){
        setAdvertenciaGeneral("Parece que mientras preparabas tu oferta, ¡alguien fue más rápido y ofreció una cantidad mayor que tú! Vuelve a intentar una oferta");
        setAdvertenciaGeneralClass('advertenciasClase');
      }else{
        let objetoOferta = {
          idProducto: id,
          nuevaOferta: ofertaUsuarioLcl
        }
        axios.put("/realizarUnaOferta", objetoOferta)
        .then((response) =>{
          console.log(response);
          setAdvertenciaGeneral(response.data);
          setReload(!reload);
          if(response.status==202){
            setAdvertenciaGeneralClass('advertenciasClase');
          }
          if(response.status==203 && response.data=="Redirigir.")
            history("/");
          if(response.status==298)
            setAdvertenciaGeneralClass('advertenciasVerdes');
        })
        .catch((error) => {
          if (error.response.data.error== "Usuario no autenticado"){
              setSesionCerrada(true);
          }
        })
      }
    } else if(renderizar == "Mod"){
      setModalEresModerador(true);
    }
  }

  function functionActualizarPrecio(nuevoValor){
    //Debe poderse establecer un precio del que no se puede bajar
    console.log("New value: ", nuevoValor)
    setOfertaUsuarioLcl(Math.max(nuevoValor, productoInfo.precioActual));
    limpiarGeneral();
  }

  function confirmarSuperiorAlMinimo(){
    limpiarGeneral();
    console.log("confirmarSuperiorAlMinimo\nOferta: ", parseInt(ofertaUsuarioLcl), "\nPrecio actual: ", productoInfo.precioActual)
    if(parseInt(ofertaUsuarioLcl) < productoInfo.precioActual){
      setOfertaUsuarioLcl(productoInfo.precioActual);
    }
  }

  function realizarCompraDirecta(){
    if (renderizar == "Normal"){
      axios.post("/realizarUnaCompraDirecta", {productoId: id})
      .then((response) => {
        console.log("Response compra directa: ", response);
        setAdvertenciaGeneral(response.data.message)
        if(response.data.success == true) {
          setAdvertenciaGeneralClass('advertenciasVerdes');
        } else {
          setAdvertenciaGeneralClass('advertenciasClase');
          setTimeout(() => {
            history("/")
          }, 2000)
        }
      })
      .catch((error) => {
        if (error.response.data.error== "Usuario no autenticado"){
            setSesionCerrada(true);
        }
      })
    } else if(renderizar == "Mod"){
      setModalEresModerador(true);
    }
  }
    
  function irAReportarProducto(event){
    event.preventDefault();
    if (renderizar == "Normal"){
      history(("/reportarproducto/" + id));
    } else if(renderizar == "Mod"){
      setModalEresModerador(true);
    }
  }

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
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  if((renderizar=="Normal" || renderizar == "Mod") && permitir == true){
    return(
      <div className='productoSeleccionado'>
        {renderizar=="Normal" ? (
          <>
            <HeaderConBarraEnlacesUsuario title="Subastalotodo.com" img={profileImagePath} linkAlPerfil={linkPerfilPath}/>
            <SubHeaderNormalUser/>
          </>
        ):(
          <>
            <HeaderMods title="Subastalotodo.com" img={profileImagePathMod}/>
            <SubHeader/>
          </>
        )}

        <div className="partirEn2">
  
          <div className='izquierda'>
            {/* Slider de fotos */}
            {productoInfo.imagenesProducto.length > 1 ? (
              <div className="slider-container contenedorSlider">
                <Slider {...settings}>
                  {productoInfo.imagenesProducto.map((ruta, index) => (
                    <div key={index}>
                      <Suspense fallback={<div className='divCargando'>Cargando...</div>}>
                        <LazyImage src={ruta} alt={`Imagen ${index}`} />
                      </Suspense>
                    </div>
                  ))}
                </Slider>
              </div>
            ) : (
              productoInfo.imagenesProducto.length > 0 && (
                <Suspense fallback={<div className='divCargando'>Cargando...</div>}>
                  <LazyImage src={productoInfo.imagenesProducto[0]} alt="Imagen" />
                </Suspense>
              )
            )}
            <div className='cajaVendedor'>
              <LblCentrado tipoLbl="lblCentrado" textoLbl="Vendido por"/>
              <Suspense fallback={<div className='pCargando'>Cargando...</div>}>
                <Link to={"/usuario/" + productoInfo.usuario_vendedor}>
                <div className='gridearCajaVendedor'>
                  <ImagenVendedorProductoSeleccionado r25={productoInfo.r25}/>
                  <LblCentrado tipoLbl="lblSmall" textoLbl={productoInfo.usuario_vendedor}/>
                  <div className='contenedorImagenEstrellas'>
                    <img src={getEstrellasImage(productoInfo.coeficienteVendedor)} alt='' className='imagenEstrellas'/>
                  </div>
                </div>
                </Link>
              </Suspense>
            </div>
            <GhostBtn children="Reportar" onClick={irAReportarProducto}/>
          </div>
  
          <div className="derecha">
            <LblCentrado tipoLbl="lblTituloIzquierda" textoLbl={productoInfo.nombre_producto}/>
            <LblCentrado tipoLbl="lblSmallIzquierda" textoLbl={productoInfo.calidad_producto}/>
            <LblCentrado tipoLbl="lblIZquierda" textoLbl={"Descripción: "}/>
            <LblCentrado tipoLbl="lblIZquierda" textoLbl={productoInfo.detalles}/>
            <div className='gridearPrecio2CuartosALaIzquierda'>
              {
                primeraOferta == true ? 
                (
                  <>
                    <p className='precioActual'>$ {productoInfo.precioActual}</p>
                    <p></p>
                    <p></p>
                  </>
                ) : (
                  <>
                    <p className='precioActual'>$ {productoInfo.precioActual}</p>
                    <p className='precioViejo'>$ {productoInfo.precioMinimo}</p>
                    <p></p>
                  </>
              )}
            </div>
            <div className='gridearOfertas3070'>
              <div className='gridearInputAD'>
                <button onClick={() => functionActualizarPrecio(ofertaUsuarioLcl-1)}>-</button>
                <input
                  type="number"  
                  value={ofertaUsuarioLcl}
                  onChange={(e) => setOfertaUsuarioLcl(e.target.value)}
                  onBlur={confirmarSuperiorAlMinimo}
                />
                <button onClick={() => functionActualizarPrecio(ofertaUsuarioLcl+1)}>+</button>
              </div>
              <NormalBtn children="Ofertar" onClick={enviarOferta}/>
            </div>
            {
              productoInfo.permitir_ventas_instantaneas == 1 && productoInfo.precioVentaDirecta > productoInfo.precioActual ? (
                <>
                  <GhostBtn children={`Comprar ahora por solo $${productoInfo.precioVentaDirecta}`} onClick={realizarCompraDirecta}/>
                </>
              ) : (
                <>
                </>
              )
            }
            <Advertencias
              content={advertenciaGeneral}
              className={advertenciaGeneralClass}
            />  
          </div>
        </div>
        {sesionCerrada && (
          <ModalSesionCerrada/>
        )}
        {modalEresModerador && (
          <div className="modal">
            <div className='modalAdvChat'>
              <div className="aLaDerechaConGrid">
                <button className='btnCerrarModal' onClick={() => setModalEresModerador(false)}>X</button>
              </div>
              <h2>Ups! no tienes permiso para hacer eso.</h2>
              <p className=''> 
                Eres un moderador. No tienes permiso para interactuar con los productos de esta manera.
              </p>
            </div>
          </div>
        )}
      </div>
    )
  }else if(renderizar.length > 1){
    return <PaginaNoEncontrada/>
  }
}

export default ProductoSeleccionado;