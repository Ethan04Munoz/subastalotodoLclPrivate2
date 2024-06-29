import React from 'react';
import './AgregarNuevoModerador.css';
import HeaderMods from '../componentes/componentes/HeaderMods.jsx';
import LblCentrado from '../componentes/componentes/LblCentrado.jsx'
import GhostBtn2 from '../componentes/componentes/GhostBtn2.jsx';
import './formularioGen.css'; 
import SubHeader from '../componentes/componentes/SubHeader.jsx';
import { useState, useEffect  } from 'react'; 
import axios from './axiosConfig.js'
import { profileImagePathMod} from '../componentes/variablesGenerales.js';
import './ProductosReportados.css';
import Label from '../componentes/componentes/LblCentrado.jsx';
import './Modal-PopUp.css';
import './ImagenesManipuladas.css';
import { useNavigate } from 'react-router-dom';
import PaginaNoEncontrada from './PaginaNoEncontrada.jsx';

function ImagenesManipuladas(){
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
    const [productosImagenes, setProductosImagenes] = useState([]);
    useEffect(() => {
          axios.get('/obtenerImagenesManipuladas')
            .then(response => {
                console.log(response)
                setProductosImagenes(response.data);
                console.log("Productos con imagenes manipuladas: ", productosImagenes)
            })
            .catch(error => {
              console.log("Error: ", error);
            })
    }, []);

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [segundoModalVisible, setSegundoModalVisible] = useState(false);

    function encenderModal(producto) {
      setSelectedProduct(producto);
      setModalVisible(true);
      console.log("Producto seleccionado: ", producto);
    }

    const motivoEliminacionStr = "Tu producto contiene imágenes falsas o parcialmente editadas";

    function eliminarProducto(producto) {
      // Realizar la solicitud de eliminación utilizando Axios
      console.log("Producto ID: ", producto);
      axios.post('/eliminarProducto', {idProducto: producto.id, motivoEliminacion: motivoEliminacionStr})
        .then(response => {
          // Actualizar el estado o realizar otras acciones necesarias
          console.log('Producto eliminado exitosamente');
          // Cerrar el modal y actualizar la lista de productos reportados
          setModalVisible(false);
          setProductosImagenes((prevProductos) =>
            prevProductos.filter((p) => p.id !== producto.id)
          );
          setSegundoModalVisible(true); //Abrir el segundo popup
        })
        .catch(error => {
          console.log("Error al eliminar el producto: ", error);
        });
    } 
    if(renderizar=="Mod"){
      return(
        <div className="ImagenesManipuladas">
            <HeaderMods title="Subastalotodo.com" img= {profileImagePathMod}/>
            <SubHeader/>
            <LblCentrado tipoLbl="lblTituloColor" textoLbl="Publicaciones con posibles imagenes manipuladas." />
            {productosImagenes.length > 0 ? (
              <table className="tablaCentrarProductos">
                <thead>
                  <tr className='gridearTablaProductosReportados'>
                    <th className='uno'></th> {/* Fila para las fotos */}
                    <th className='dos'>Producto</th>
                    <th className='tres'>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productosImagenes.map((avance) => (
                    <>
                      <tr key={avance.id}  className='gridearProductosManipulados'>
                          <a className='noTextDecoration gridearProductoNoBoton' href={avance.linkProducto} target="_blank" rel="noopener noreferrer">
                          <td>
                            <img src={avance.imagen}/> 
                          </td>
                          <td>
                            <div>
                              <p><span>Producto: </span>{avance.nombreProducto}</p>
                              <p>Detalles: {avance.detalles.length > 60 ? avance.detalles.substring(0, 60) + '...' : avance.detalles}</p> 
                            </div>
                          </td>
                          </a>
                          <td>                      <GhostBtn2
                        children="Eliminar"
                        clase="ghostBtnIM"
                        onClick={(e) => encenderModal(avance)}
                      /></td>
                      </tr>

                    </>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="formRegistro">
                <Label tipoLbl="lblTitulo" textoLbl="Ey! Parece que ya terminaste por aquí."/>
              </div>
            )}
            {modalVisible && (
              <div className="modal">
                <div className="modal-content">
                  <button className='btnCerrarModal' onClick={() => setModalVisible(false)}>X</button>
                  <h2>Eliminar producto</h2>
                  <form>
                    <Label tipoLbl="lblCentrado" textoLbl={"Estás por eliminar '" + selectedProduct.nombreProducto + "'"}/>
                    <GhostBtn2
                      clase="ghostBtn"
                      children="Sí, quiero eliminar este producto"
                      onClick={() => eliminarProducto(selectedProduct)}
                    />
                  </form>
                </div>
              </div>
            )}
            {segundoModalVisible && (
              <div className="modal">
                <div className='modalAdv'>
                  <div className="aLaDerechaConGrid">
                    <button className='btnCerrarModal' onClick={() => setSegundoModalVisible(false)}>X</button>
                  </div>
                  <h2>Eliminación exitosa.</h2>
                  <Label tipoLbl="lblCentrado" textoLbl="El producto y el reporte fueron eliminados con éxito. El usuario vendedor ha recibido un strike."/>
                </div>
              </div>
            )}
        </div>
    )
  }else if(renderizar.length > 1){
      return <PaginaNoEncontrada/>
  }
}

export default ImagenesManipuladas;