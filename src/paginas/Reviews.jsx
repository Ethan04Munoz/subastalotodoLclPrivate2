import React, { useState, useEffect } from 'react';
import HeaderConBarraEnlaces from '../componentes/componentes/HeaderConBarraEnlaces.jsx';
import './LinkRouter.css';
import './formularioGen.css';
import SubHeaderNormalUser from '../componentes/componentes/SubHeaderNormalUser2.jsx';
import { useNavigate } from 'react-router-dom';
import './EditarPerfil.css';
import GhostBtn2 from '../componentes/componentes/GhostBtn2.jsx';
import axios from './axiosConfig.js'
import { obtenerFotoPerfilGENERAL, obtenerLinkPerfil } from '../componentes/Metodos.js';
import { lazy } from 'react';
import Label from '../componentes/componentes/LblCentrado.jsx';
const ImagenEditarPerfil = lazy(() => import('../componentes/componentes/lazy/ImagenEditarPerfil.jsx'));
import './AgregarNuevoModerador.css';
import './formularioGen.css';
import './Modal-PopUp.css';
import './MensajesReportados.css';
import './ProductosReportados.css';
import './Reviews.css';
import { Rating } from 'react-simple-star-rating';
import PaginaNoEncontrada from './PaginaNoEncontrada.jsx';
import ModalSesionCerrada from './ModalSesiónCerrada.jsx';

function Reviews(){
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
    }, []);
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

    const [productosReviews, setProductosReviews] = useState([]);
    const [modalReviewAñadida, setModalReviewAñadida] = useState(false);
    const [modalReview, setModalReview] = useState(false);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    
    function encenderModalReview(producto) {
        console.log("ModalReview: ", producto)
        setProductoSeleccionado(producto);
        setModalReview(true);
    }
    const [rating, setRating] = useState(0);
    const [placeholder, setPlaceholder] = useState('');
    const [valorTextarea, setValorTextarea] = useState('');
    const [ghostBtnStatus, setGhostBtnStatus] = useState({clase: 'ghostBtn-Dis', deshabilitado: true});
    const [reload, setReload] = useState(false);

    useEffect(() => {
        if(valorTextarea.length >= 5){
            setGhostBtnStatus({clase: 'ghostBtn', deshabilitado: false})
        }else{
            setGhostBtnStatus({clase: 'ghostBtn-Dis', deshabilitado: true})
        }
    }, [valorTextarea])
    
    const handleTextareaChange = (event) => {
        setValorTextarea(event.target.value);
    };

    function cerrarModalCalificar(){
        setModalReview(false);
        setGhostBtnStatus({clase: 'ghostBtn-Dis', deshabilitado: true})
        console.log("Cerrando modal")
    }

    const ratingChanged = (newRating) => {
        console.log(`New rating is: ${parseFloat(newRating)}`);
        setRating(parseFloat(newRating));
    
        if (newRating <= 3) {
            setPlaceholder("Cuéntanos, ¿Qué salió mal?");
            if (newRating <= 2) {
                // Hacer que sea obligatorio escribir si es de 2 estrellas o menos
                setGhostBtnStatus({ clase: 'ghostBtn-Dis', deshabilitado: true });
                setValorTextarea('');
            } else {
                // Si la calificación es de 2.5 a 3 estrellas, habilitar el botón aunque no se haya ingresado texto
                setGhostBtnStatus({ clase: 'ghostBtn', deshabilitado: false });
            }
        } else {
            // Si la calificación es más de 3 estrellas, habilitar el botón
            setGhostBtnStatus({ clase: 'ghostBtn', deshabilitado: false });
        }
    };

    useEffect(() => {
        axios.get("/obtenerProductosReviewables")
        .then(response => {
            console.log("Reviewables: ", response.data);
            setProductosReviews(response.data);
        })
        .catch((error) => {
            if (error.response.data.error== "Usuario no autenticado"){
              setSesionCerrada(true);
            }
        })
    }, [reload]);

    function enviarReview(){
        console.log("ProductoSeleccionado: ", productoSeleccionado)
        let infoReview = {
            idProducto: productoSeleccionado.id, 
            nombreProducto: productoSeleccionado.nombreProducto, 
            nombreVendedor: productoSeleccionado.nombreVendedor,
            nombreComprador: productoSeleccionado.nombreGanador,
            precio: productoSeleccionado.precio,
            estrellas: rating,
            comentarioReview: valorTextarea
        }
        axios.post("/publicarReview", infoReview)
        .then(response => {
            console.log("Response: ", response)
            if(response.status==200){
                setReload(!reload);
                cerrarModalCalificar();
                setModalReviewAñadida(true);
            }
        })
        .catch(error => {
            if (error.response.data.error== "Usuario no autenticado"){
                setSesionCerrada(true);
            }
        })
    }

    if(renderizar=="Normal"){
        return (
            <div className='reviewsProyecto'>
                <HeaderConBarraEnlaces title= "Subastalotodo.com" img={profileImagePath} linkAlPerfil={linkPerfilPath}/>
                <SubHeaderNormalUser/>
                <Label tipoLbl='lblTituloColor' textoLbl="Reviews"/>
                {productosReviews.length > 0 ? (
                    <table className="tablaMensajesReportados">
                        <thead>
                            <tr className="gridearTablaReviews">
                                <th className="uno"></th>
                                <th className="dos"></th>
                                <th className="tres"></th>
                            </tr>
                        </thead>
                    <tbody>
                        {productosReviews.map((producto) => (
                            <tr key={producto.id} className="gridearTablaReviews">
                                <td className='uno'>
                                    {/* Foto de perfil */}
                                    <img src={producto.fotoProducto} className='imgTablaReviews'/> 
                                </td>
                                <td className="dos">
                                    <div>
                                        <p>
                                            {producto.nombreProducto}
                                        </p>
                                        <p>
                                            <span>Vendido por: </span>
                                            {producto.nombreVendedor}
                                        </p>
                                        <p>
                                            <span>Comprado por: </span>
                                            {producto.precio}
                                        </p>
                                    </div>
                                </td>
                                <td className="tres">
                                <GhostBtn2
                                    children="Calificar"
                                    clase="ghostBtnAlto"
                                    onClick={() => encenderModalReview(producto)}
                                />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                ) : (
                    <div className="formRegistro">
                        <Label tipoLbl="lblTitulo" textoLbl="Ey! Parece que ya terminaste por aquí." />
                    </div>
                )}
                {modalReview && (
                    <div className="modal">
                        <div className="modal-content">
                            <button className="btnCerrarModal" onClick={() => cerrarModalCalificar()}>
                                X
                            </button>
                            <h2>Calificar {productoSeleccionado.nombreProducto}</h2>
                            <Rating
                                onClick={ratingChanged}
                                size={100}
                                allowFraction={true}
                            />
                            {(rating < 3.5 && rating > 0) && (
                                <textarea 
                                className='textAreaRezisable' 
                                cols="30" 
                                rows="10" 
                                placeholder={placeholder}
                                onChange={handleTextareaChange}></textarea>
                            )}
                             <GhostBtn2
                                children="EnviarReview"
                                clase={ghostBtnStatus.clase}
                                disabled={ghostBtnStatus.deshabilitado}
                                onClick={() => enviarReview()}
                            />
                        </div>
                    </div>
                )}
                {modalReviewAñadida && (
                    <div className="modal">
                        <div className="modal-content">
                            <button className="btnCerrarModal" onClick={() => setModalReviewAñadida(false)}>
                                X
                            </button>
                            <Label tipoLbl="lblCentrado" textoLbl="Haz añadido una reviews exitosamente."/>
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

export default Reviews;