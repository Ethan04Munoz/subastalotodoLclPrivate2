import React from 'react';
import './AgregarNuevoModerador.css';
import HeaderMods from '../componentes/componentes/HeaderMods.jsx';
import LblCentrado from '../componentes/componentes/LblCentrado.jsx'
import GhostBtn2 from '../componentes/componentes/GhostBtn2.jsx';
import './formularioGen.css'; 
import SubHeader from '../componentes/componentes/SubHeader.jsx';
import { useState, useEffect  } from 'react'; 
import axios from './axiosConfig.js'
import {Link} from 'react-router-dom';
import { profileImagePathMod } from '../componentes/variablesGenerales.js';
import './ProductosReportados.css';
import Label from '../componentes/componentes/LblCentrado.jsx';
import TextAreaR from '../componentes/componentes/TextAreaR.jsx';
import './Modal-PopUp.css';
import { useNavigate } from 'react-router-dom';
import PaginaNoEncontrada from './PaginaNoEncontrada.jsx';
import ModalSesionCerrada from './ModalSesiónCerrada.jsx';

function ProductosReportados(props){
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
  const [sesionCerrada, setSesionCerrada] = useState(false);
  const [productosReportados, setProductosReportados] = useState('');

    useEffect(() => {
      console.log("GETTER")
        axios.get('/obtenerProductosReportados')
          .then(response => {
            setProductosReportados(response.data);
            console.log("Productos reportados: ", productosReportados)
          })
          .catch(error => {
            console.log("Error: ", error);
          })
        }, []);

        const [modalVisible, setModalVisible] = useState(false);
        const [segundoModalVisible, setSegundoModalVisible] = useState(false);
        const [textareaValue, setTextareaValue] = useState('');
        const [isButtonDisabled, setIsButtonDisabled] = useState(true);
        const [selectedProduct, setSelectedProduct] = useState(null);
        

      function encenderModal(producto) {
        setSelectedProduct(producto);
        setModalVisible(true);
        console.log("Producto seleccionado: ", producto);
      }
      function eliminarProducto(producto) {
        // Realizar la solicitud de eliminación utilizando Axios
        console.log("Producto ID: ", producto);
        setIsButtonDisabled(true);
        axios.post('/eliminarProducto', {idProducto: producto.id, motivoEliminacion: textareaValue})
          .then(response => {
            // Actualizar el estado o realizar otras acciones necesarias
            console.log('Producto eliminado exitosamente');
            // Cerrar el modal y actualizar la lista de productos reportados
            setModalVisible(false);
            setProductosReportados((prevProductos) =>
              prevProductos.filter((p) => p.id !== producto.id)
            );
            setSegundoModalVisible(true); //Abrir el segundo popup
          })
          .catch(error => {
            if (error.response.data.error== "Usuario no autenticado"){
              setSesionCerrada(true);
            }
            console.log("Error al eliminar el producto: ", error);
          });
      }              
    if(renderizar=="Mod"){
      return(
        <div className='productosReportados'>
            <HeaderMods title="Subastalotodo.com" img= {profileImagePathMod}/>
            <SubHeader/>
            <LblCentrado tipoLbl="lblTituloColor" textoLbl="Productos reportados" />
            {productosReportados.length > 0 ? (
              <table className="tablaProductosReportados">
                <thead>
                  <tr className='gridearTablaProductosReportados'>
                    <th className='uno'></th> {/* Fila para las fotos */}
                    <th className='dos'>Producto</th>
                    <th className='tres'>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productosReportados.map((avance) => (
                    <tr key={avance.idReporte} className='gridearTablaProductosReportados'>
                        <td className='uno'>
                          <img src={avance.imagenProducto} className='imgTablaProductosReportados'/> 
                        </td>
                        <td className='dos'>
                          <div>
                            <p><span>Producto: </span>{avance.nombreProducto}</p>
                            <p><span>Motivo del reporte: </span>{avance.motivoReporte}</p> 
                            <Link className='LinkIns3' to={avance.linkProducto}>Revisar producto</Link> 
                          </div>
                        </td>
                        <td className='tres'>
                        <GhostBtn2
                          children="Eliminar"
                          clase="ghostBtnAlto"
                          onClick={() => encenderModal(avance)}
                        />
                        </td>
                    </tr>
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
                    <Label tipoLbl="lblCentrado" textoLbl="Ingrese el motivo por el que elimina el producto. El usuario podrá ver esta información."/>
                    <TextAreaR
                      clase="textAreaRezisable"
                      onChange={(e) => {
                        setTextareaValue(e.target.value);
                        setIsButtonDisabled(e.target.value === '');
                      }}
                    />
                    <GhostBtn2
                      children="Sí, quiero eliminar este producto"
                      clase={isButtonDisabled ? "ghostBtn-Dis" : "ghostBtn"}
                      onClick={() => eliminarProducto(selectedProduct)}
                      disabled={isButtonDisabled}
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
            {sesionCerrada && (
              <ModalSesionCerrada/>
            )}
        </div>
      )
    }else if(renderizar.length > 1){
      return <PaginaNoEncontrada/>
    }
}

export default ProductosReportados;