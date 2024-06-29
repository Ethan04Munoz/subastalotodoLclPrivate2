import React from 'react';
import GhostBtn from '../componentes/GhostBtn.jsx';
import LblCentrado from '../componentes/LblCentrado.jsx';
import Advertencias from '../componentes/Advertencias.jsx';
import HeaderConBarraEnlaces from '../componentes/HeaderConBarraEnlaces.jsx';
import SubHeaderNormalUser from '../componentes/SubHeaderNormalUser2.jsx';
import axios from './axiosConfig.js'
import InputNum from '../componentes/InputNum.jsx';
import InputTextBlur from '../componentes/InputTextOnBlur.jsx';
import { useState } from 'react'; 
import TextAreaR from '../componentes/TextAreaR.jsx';
import { useEffect , useRef} from 'react';
import './formularioGen.css';
import './PublicarNuevoProducto.css';
import CalidadDelProducto from '../componentes/CalidadDelProducto.jsx';
import InputRadio from '../componentes/InputRadio.jsx';
import CategoriaLista from '../componentes/CategoríaLista.jsx';
import '../componentes/Slider.css';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import smartcrop from 'smartcrop';
import PaginaNoEncontrada from './PaginaNoEncontrada.jsx';
import ModalSesionCerrada from './ModalSesiónCerrada.jsx';
import { getLinkPerfil, getObtenerFotoPerfilGeneral } from '../funcionesDB/get.js';

const PublicarNuevoProducto = () => {  
    const { id } = useParams();
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
    const [nombreProductoContenido, setNombreProductoContenido] = useState("");
    const [detallesProductoContenido, setDetallesProductoContenido] = useState("");
    const [precioMinimoAceptableContenido, setPrecioMinimoAceptableContenido] = useState(0); 
    const [precioVentaDirecta, setPrecioVentaDirecta] = useState(null);
    const [categoria, setCategoria] = useState("nada");
    const [calidadProducto, setCalidadProducto] = useState("nuevo");
    const [tiempoEspera, setTiempoEspera] = useState({h: '0', m: '5', s: '0'});
    const [ventasInstantaneas, setVentasInstantaneas] = useState(false);
    const [detallesProductoAdvertencia, setDetallesProductoAdvertencia] = useState({advertencia: '', clase: 'advertenciasSinClase', input: 'textAreaRezisable'});
    const [nombreProductoAdvertencia, setNombreProductoAdvertencia] = useState({advertencia: '', clase: 'advertenciasSinClase', input: 'input'})
    const [precioMinimoAdvertencia, setPecioMinimoAdvertencia] = useState({advertencia: '', clase: 'advertenciasSinClase', input: 'input'})
    const [categoriaAdvertencia, setCategoriaAdvertencia] = useState({advertencia: '', clase: 'advertenciasSinClase', input: 'input'})
    const [calidadAdvertencia, setCalidadAdvertencia] = useState({advertencia: '', clase: 'advertenciasSinClase', input: 'input'})
    const [tiempoAdvertencia, setTiempoAdvertencia] = useState({advertencia: '', clase: 'advertenciasSinClase', input: 'input'})
    const [advertenciaGeneral, setAdvertenciaGeneral] = useState({advertencia: '', clase: 'advertenciasSinClase'})
    const [precioSugerido, setPrecioSugerido] = useState(0)
    const [imagenes, setImagenes] = useState([]);
    const [imagenesOrigin, setImagenesOrigin] = useState([]);

    const [instantSalesProp, setInstantSalesProps] = useState(false);

    function guardarCategoria(event){
        setCategoria(event.target.value);
    }
    function guardarCalidadProducto(event){
        setCalidadProducto(event.target.value);
    }
    function guardarVentasInstantaneas(event){
        if(ventasInstantaneas==true)
            setVentasInstantaneas(false);
        if(ventasInstantaneas==false){
            setVentasInstantaneas(true);
            setPrecioVentaDirecta(null);
        }
    }

    const imagenRef = useRef(null);

    //Funcion para obtener la foto de perfil
    const [profileImagePath, setProfileImagePath] = useState(null);
    useEffect(() => {
      getObtenerFotoPerfilGeneral()
        .then(path => {
          setProfileImagePath(path);
        });
    }, []);

    const[linkPerfilPath, setlinkPerfilPath] = useState(null);
    useEffect(() => {
      getLinkPerfil()
        .then(path => {
          setlinkPerfilPath(path);
        });
    }, []);

    function obtenerPrecioSugerido(producto){
        console.log(producto)
        axios.post("/obtenerPrecioSugerido", {productoEnv: producto})
        .then((response) => {
          console.log(response);
          setPrecioSugerido(response.data);
        })
    }

    function guardarNombreProducto(event){
        setNombreProductoContenido(event.target.value);
        limpiarAdvertenciasNombreProducto();
        obtenerPrecioSugerido(event.target.value);
    }

    function guardarDetallesProducto(event){
        setDetallesProductoContenido(event.target.value);
        limpiarAdvertenciasDetallesProducto();
    }

    function guardarPrecioMinimo(event){
        setPrecioMinimoAceptableContenido(event.target.value);
    }

    function guardarPrecioVentaDirecta(event){
        setPrecioVentaDirecta(event.target.value)
    }

    function limpiarAdvertenciasNombreProducto(){
        setNombreProductoAdvertencia({advertencia: '', clase: "advertenciasSinClase", input: "input"})
    }

    function limpiarAdvertenciasDetallesProducto(){
        setDetallesProductoAdvertencia({advertencia: '', clase: 'advertenciasSinClase', input: 'textAreaRezisable'})
    }

    function limpiarAdvertenciasCategoria(){
        setCategoriaAdvertencia({advertencia: '', clase: 'advertenciasSinClase', input: 'textAreaRezisable'})
    }

    function limpiarAdvertenciasPrecioMinimo(){
        setPecioMinimoAdvertencia({advertencia: '', clase: "advertenciasSinClase", input: "input"})
    }

    function limpiarAdvertenciasCalidad(){
        setCalidadAdvertencia({advertencia: '', clase: "advertenciasSinClase", input: "input"})
    }

    function limpiarAdvertenciaTiempo(){
        setTiempoAdvertencia({advertencia: '', clase: "advertenciasSinClase", input: "input"})
    }

    function actualizarDetalles(advertencia){
        setDetallesProductoAdvertencia({advertencia: advertencia, clase: 'advertenciasClase', input: 'textAreaRezisableError'})
    }

    function actualizarNombreProducto(advertencia){
        setNombreProductoAdvertencia({advertencia: advertencia, clase: "advertenciasClase", input: "inputAdvertencia"})
    }

    function actualizarPrecioMinimo(advertencia){
        setPecioMinimoAdvertencia({advertencia: advertencia, clase: 'advertenciasClase', input: 'inputAdvertencia'})
    }

    function actualizarCategoria(advertencia){
        setCategoriaAdvertencia({advertencia: advertencia, clase: 'advertenciasClase', input: 'inputAdvertencia'})
    }

    function actualizarCalidad(advertencia){
        setCalidadAdvertencia({advertencia: advertencia, clase: 'advertenciasClase', input: 'inputAdvertencia'})
    }

    function actualizarTiempo(advertencia){
        setTiempoAdvertencia({advertencia:advertencia, clase: 'advertenciasClase', input: 'inputAdvertencia'})
    }

    const inputChange = ({ target }) => {
        const { name, value } = target
        setTiempoEspera({
            ...tiempoEspera,
            [name]: value
        })
        console.log(tiempoEspera);
    }

    useEffect(() => {
        console.log("Tiempo espera en objeto: ", tiempoEspera);
        let minSeg = parseInt(tiempoEspera.m) * 60;
        let horSeg = parseInt(tiempoEspera.h) * 60 * 60;
        let tiempoTotal = parseInt(tiempoEspera.s) + minSeg + horSeg;
        console.log("Tiempo total: ", tiempoTotal);
        if (tiempoTotal > 3600) {
            setTiempoAdvertencia({
                advertencia:"Es recomendable activar las ventas instantaneas si eliges un tiempo superior a una hora. Recuerda que cada que alguien haga una oferta por tu producto, el contador se reinicia, por lo que, para prevenir que tardes demasiado en vender tu producto, te sugerimos activar las ventas instantaneas.", 
                clase: 'advertenciasVerdes', 
                input: 'inputAdvertencia'
            })
        }else{
            limpiarAdvertenciaTiempo();
        }
    }, [tiempoEspera, nombreProductoContenido, detallesProductoContenido, precioMinimoAceptableContenido, precioVentaDirecta, categoria, calidadProducto, ventasInstantaneas]);


    function regresarA72Horas(){
        console.log("ParseInt tiempoEspera: ", parseInt(tiempoEspera.h));
        if(parseInt(tiempoEspera.h) >= 72){
            setTiempoEspera({h: "72", m: "0", s: "0"});
        }
    }

    const [sesionCerrada, setSesionCerrada] = useState(false);
    
    function publicarProducto(event){
        event.preventDefault();
        limpiarAdvertenciasNombreProducto();limpiarAdvertenciasDetallesProducto();limpiarAdvertenciasCategoria();
        limpiarAdvertenciasPrecioMinimo();limpiarAdvertenciasCalidad();limpiarAdvertenciaTiempo();
        const formData = new FormData();
        formData.append('nombreDelProducto', nombreProductoContenido);
        formData.append('detallesProducto', detallesProductoContenido);
        formData.append('precioMinimo', precioMinimoAceptableContenido);
        formData.append('categoriaProducto', categoria);
        formData.append('calidadSeleccionada', calidadProducto);
        formData.append('tiempoEsperaProducto', JSON.stringify(tiempoEspera));
        formData.append('ventasInstantaneasProducto', ventasInstantaneas);
        formData.append('precioVenta', precioVentaDirecta);

        imagenesOrigin.forEach((imagen, index) => {
            formData.append(`imagen`, imagen);
        });
        console.log(formData);
        console.log(imagenes)
        axios.post("/publicarNuevoProducto", formData)
        .then((response) => {
            console.log(response);
            if(response.status==200)
                setAdvertenciaGeneral({advertencia: response.data, clase: "advertenciasClase"});
            if(response.status==201)
                actualizarNombreProducto(response.data)
            if(response.status==202)
                actualizarDetalles(response.data)
            if(response.status==203)
                actualizarCategoria(response.data)
            if(response.status==209)
                actualizarPrecioMinimo(response.data)
            if(response.status==205)
                actualizarCalidad(response.data)
            if(response.status==206)
                actualizarTiempo(response.data)
            if(response.status==207)
                setAdvertenciaGeneral({advertencia: response.data, clase: "advertenciasClase"});
            if(response.status==208){ //Si la imagen es muy grande
                setAdvertenciaGeneral({advertencia:
                        <span>
                            {response.data}
                            {response.data.includes("Cada imagen debe tener un tamaño máximo de 1MB.") && (
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
                    , clase: "advertenciasClase"});
            }
            if(response.status==298){ 
                console.log("Bien");
                setAdvertenciaGeneral({advertencia: "Producto publicado, redirigiendo al menú de inicio...", clase: "advertenciasVerdes"});
                setTimeout(function() {
                    history("/");
                }, 3000);
            }
        })
        .catch((error) => {
            console.log("Error al publicar nuevo producto");
            if (error.response.data.error== "Usuario no autenticado"){
                setSesionCerrada(true);
            }
            console.log("Error en el post de Publicar Nuevo Producto: ", error);
            console.log("Error.response.data: ", error.response.data);
        })
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

      async function cropImage(inputImage) {
        const image = new Image();
        image.src = URL.createObjectURL(inputImage);
      
        return new Promise((resolve) => {
          image.onload = async () => {
            const result = await smartcrop.crop(image, { width: 200, height: 200 });
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
      
            canvas.width = 200;
            canvas.height = 200;
      
            ctx.drawImage(
              image,
              result.topCrop.x,
              result.topCrop.y,
              result.topCrop.width,
              result.topCrop.height,
              0,
              0,
              canvas.width,
              canvas.height
            );
      
            const croppedImageBlob = await new Promise((resolveBlob) => {
              canvas.toBlob((blob) => {
                resolveBlob(blob);
              });
            });
      
            resolve(croppedImageBlob);
          };
        });
      }
      

    async function subirFoto(event){
        const inputImage = event.target.files[0];
        const croppedImageBlob = await cropImage(inputImage);
        setImagenesOrigin([...imagenesOrigin, inputImage]);
        setImagenes([...imagenes, croppedImageBlob]);
    }

    function toBoolean(value) {
        return value === 1 ? true : value === 0 ? false : null;
      }
      

   
    useEffect(() => {
        if( id ){
            console.log("SI hay id: ", id);
            console.log("Categoria: ", categoria);
            axios.get(`/producto/${id}/obtenerInfo`)
            .then((response) => {
                const r = response.data;
                console.log("Response data de obtenerInfo: ", r);
    
                if(response.status == 205){
                    history("/publicarproducto")
                }else{
                    setNombreProductoContenido(r.nombre_producto);
                    setDetallesProductoContenido(r.detalles);
                    setCategoria(r.categoria);
                    setPrecioMinimoAceptableContenido(parseInt(r.precio_minimo_aceptable));
                    setCalidadProducto(r.calidad_producto);
                        
                    //Obtener tiempo espera
                    let hTemp = 0, mTemp = 0, sTemp = 0;
                    hTemp = "" + (Math.floor(r.tiempo_espera_sin_oferta / 3600));
                    mTemp = "" + Math.floor((r.tiempo_espera_sin_oferta - (hTemp*3600))/60);
                    sTemp = "" + Math.floor(r.tiempo_espera_sin_oferta - (hTemp*3600) - (mTemp*60));
                    setTiempoEspera({h: hTemp, m: mTemp, s: sTemp});
                    console.log("Horas minutos segundos: ", hTemp, mTemp, sTemp);
                    console.log(tiempoEspera.h, tiempoEspera.m, tiempoEspera.s);
        
                    setVentasInstantaneas(toBoolean(r.permitir_ventas_instantaneas));
                    setInstantSalesProps(toBoolean(r.permitir_ventas_instantaneas));
                    console.log("Permites ventas instantaneas? : ", ventasInstantaneas, instantSalesProp);
                    setPrecioVentaDirecta(parseInt(r.precio_venta_directa));
                }
            })  
        }else{
            console.log("No hay ID: ", id)
        }
    }, [id] );
    
    
    if(renderizar=='Normal'){
        return(
            <div className='publicarNuevoProducto'> 
                <HeaderConBarraEnlaces title= "Subastalotodo.com" img={profileImagePath} linkAlPerfil={linkPerfilPath}/>
                <SubHeaderNormalUser/>
                
                <form className='formRegistro' method="POST" encType="multipart/form-data">
                    <div className='dividirFormContenedor'>
                        <div className='lateralIzqDividirFormContenedor'>
                            {imagenes.length > 1 ? 
                                (
                                    <div className="slider-container contenedorSlider">
                                        <Slider {...settings}>
                                            {imagenes.map((imagen, index) => (
                                            <div key={index}>
                                                <img className='imagenOOO' src={URL.createObjectURL(imagen)} alt={`Imagen ${index}`} />
                                            </div>
                                            ))}
                                        </Slider>
                                    </div>
                                ) : (
                                    imagenes.length > 0 ? (    
                                        <img className='imagenOOO' src={URL.createObjectURL(imagenes[0])} alt="Imagen" />
                                    ) : (
                                        <div className='divCuadradoImagenes'>Sube tus imágenes no mayores a 1Mb. <br/> Las dimensiones no deben exceder los 1000x1000.</div>
                                    )               
                                )
                            }
                            <GhostBtn children="Subir foto(s)" onClick={() => { imagenRef.current.click() }}/>
                            <input ref={imagenRef} type="file" name="imagen" accept="image/jpeg, image/png" style={{ display: 'none' }} onChange={subirFoto} />
                        </div>
                        <div className='lateralDerDividirFormContenedor'>
                            <LblCentrado tipoLbl="lblTitulo" textoLbl="Nuevo producto"/>
                            
                            <LblCentrado tipoLbl="lblCentrado" textoLbl="Nombre del producto"/>
                            <InputTextBlur defaultValue={nombreProductoContenido} placeholder="Por ejemplo: Regla T 120 cm" onChange={guardarNombreProducto} clase={nombreProductoAdvertencia.input}/>
                            <Advertencias content={nombreProductoAdvertencia.advertencia} className={nombreProductoAdvertencia.clase}/>
                            
                            <LblCentrado tipoLbl="lblCentrado" textoLbl="Detalles"/>
                            <TextAreaR defaultValue={detallesProductoContenido} clase={detallesProductoAdvertencia.input} onChange={guardarDetallesProducto}/>
                            <Advertencias content={detallesProductoAdvertencia.advertencia} className={detallesProductoAdvertencia.clase}/>

                            <LblCentrado tipoLbl="lblCentrado" textoLbl="Categoría"/>
                            <CategoriaLista defaultValue={categoria} onChange={guardarCategoria} claseDesplegable="selectListaDesp"/>
                            <Advertencias content={categoriaAdvertencia.advertencia} className={categoriaAdvertencia.clase}/>

                            <LblCentrado tipoLbl="lblCentrado" textoLbl="Precio minimo aceptable"/>
                            <InputNum clase={precioMinimoAdvertencia.input} onChange={guardarPrecioMinimo} placeholder={precioSugerido}/>
                            <Advertencias content={precioMinimoAdvertencia.advertencia} className={precioMinimoAdvertencia.clase}/>
                            
                            <LblCentrado tipoLbl="lblCentrado" textoLbl="Calidad del producto"/>
                            <CalidadDelProducto defaultValue={calidadProducto} onChange={guardarCalidadProducto}/>
                            <Advertencias content={calidadAdvertencia.advertencia} className={calidadAdvertencia.clase}/>
                            
                            <LblCentrado tipoLbl="lblCentrado" textoLbl="Tiempo a esperar sin recibir una oferta"/>
                            <div className="container">
                                <label className='lblCentrado' htmlFor="horas">Horas</label>
                                <label className='lblCentrado' htmlFor="minutos">Minutos</label>
                                <label className='lblCentrado' htmlFor="segundos">Segundos</label>
                                <input className='input' value={tiempoEspera.h} type="number" id="horas" name="h" min="0" max="72" required onChange={inputChange} onBlur={regresarA72Horas}/>
                                <input className='input' value={tiempoEspera.m} type="number" id="minutos" name="m" min="0" max="59" required onChange={inputChange} onBlur={regresarA72Horas}/>
                                <input className='input' value={tiempoEspera.s} type="number" id="segundos" name="s" min="0" max="59" required onChange={inputChange} onBlur={regresarA72Horas}/>
                            </div>
                            <Advertencias content={tiempoAdvertencia.advertencia} className={tiempoAdvertencia.clase}/>
                            
                            <LblCentrado tipoLbl="lblCentrado" textoLbl="Permitir ventas instantaneas"/>
                            <InputRadio onChangeProp={guardarVentasInstantaneas} instantSalesParametro={instantSalesProp}/>
                            {ventasInstantaneas && (
                                <>
                                    <LblCentrado tipoLbl="lblCentrado" textoLbl="Precio de venta directa" />                            
                                    <InputNum
                                    value={precioVentaDirecta}
                                    clase={precioMinimoAdvertencia.input}
                                    onChange={guardarPrecioVentaDirecta}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                    <Advertencias content={advertenciaGeneral.advertencia} className={advertenciaGeneral.clase}/>
                    <GhostBtn children="Publicar producto" onClick={publicarProducto}
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

export default PublicarNuevoProducto;