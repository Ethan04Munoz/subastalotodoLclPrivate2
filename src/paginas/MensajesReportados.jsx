import React, { useState, useEffect } from 'react';
import axios from './axiosConfig.js';
import GhostBtn2 from '../componentes/componentes/GhostBtn2.jsx';
import HeaderMods from '../componentes/componentes/HeaderMods.jsx';
import Label from '../componentes/componentes/LblCentrado.jsx';
import LblCentrado from '../componentes/componentes/LblCentrado.jsx';
import SubHeader from '../componentes/componentes/SubHeader.jsx';
import { profileImagePathMod } from '../componentes/variablesGenerales.js';
import './AgregarNuevoModerador.css';
import './formularioGen.css';
import './Modal-PopUp.css';
import './MensajesReportados.css';
import './ProductosReportados.css';
import { useNavigate } from 'react-router-dom';
import PaginaNoEncontrada from './PaginaNoEncontrada.jsx';

function MensajesReportados(props) {
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
  const [chatsReportados, setChatsReportados] = useState([]);
  const [modalEliminarReporte, setModalEliminarReporte] = useState(false);
  const [modalReporteEliminadoExitosamente, setModalReporteEliminadoExitosamente] = useState(false);
  const [modalAñadirStrike, setModalAñadirStrike] = useState(false);
  const [modalStrikeAñadidoExitosamente, setModalStrikeAñadidoExitosamente] = useState(false);
  const [chatSeleccionado, setChatSeleccionado] = useState(null);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    axios
      .get('/obtenerMensajesReportados')
      .then((response) => {
        setChatsReportados(response.data);
        console.log("Mensajes reportados: ", response.data)
      })
      .catch((error) => {
        console.log('Error: ', error);
      });
  }, [reload, modalReporteEliminadoExitosamente, modalStrikeAñadidoExitosamente]);

  function encenderModalEliminarReporte(chat) {
    setChatSeleccionado(chat);
    setModalEliminarReporte(true);
  }

  function encenderModalAñadirStrike(chat) {
    setChatSeleccionado(chat);
    setModalAñadirStrike(true);
  }

  function eliminarReporte() {
    console.log(chatSeleccionado)
    axios.post("/eliminarReporteMensajeReportado", {idMensaje: chatSeleccionado.mensajeID})
    .then((response) => {
        console.log("Response eliminar reporte: ", response)
        setReload(true);
        setModalEliminarReporte(false);
        setModalReporteEliminadoExitosamente(true)
    }).catch((error) => {
        console.log(error);
        setReload(true);
    });
  }

  function añadirStrikeYEliminarChat() {
    console.log("Añadiendo strike")
    console.log(chatSeleccionado)
    axios.post("/eliminarChatMensajesyAgregarStrike", {chatId: chatSeleccionado.ID}).then((response) => {
        setReload(true);
        setModalAñadirStrike(false);
        setModalStrikeAñadidoExitosamente(true)
    }).catch((error) => {
        console.log(error);
        setReload(true);
    });
    // Aquí tu lógica para añadir un strike y eliminar el chat
  }
  if(renderizar=="Mod"){
    return (
      <div className="nuevosChatsReportados">
        <HeaderMods title="Subastalotodo.com" img={profileImagePathMod} />
        <SubHeader />
        <LblCentrado tipoLbl="lblTituloColor" textoLbl="Mensajes reportados" />
        {chatsReportados.length > 0 ? (
          <table className="tablaMensajesReportados">
            <thead>
              <tr className="gridearTablaMensajesReportados">
                <th className="uno">Mensaje reportado</th>
                <th className="dos">Chat</th>
                <th className="tres">Acciones</th>
                <th className="cuatro"></th>
              </tr>
            </thead>
            <tbody>
              {chatsReportados.map((chat) => (
                <tr key={chat.idReporte} className="gridearTablaMensajesReportados">
                  <td className='uno'>
                  <div className='mensaje-izquierda'>{chat.mensajeReportado}</div>
                  </td>
                  <td className="dos">
                    <div>
                      <p>
                        <span>Miembro 1: </span>
                        {chat.miembro1}
                      </p>
                      <p>
                        <span>Miembro 2: </span>
                        {chat.miembro2}
                      </p>
                      <a target="_blank" className="LinkIns3" href={`/chat/${chat.ID}`}>
                        Revisar chat
                      </a>
                    </div>
                  </td>
                  <td className="tres">
                    <GhostBtn2
                      children="Eliminar reporte"
                      clase="ghostBtnAlto"
                      onClick={() => encenderModalEliminarReporte(chat)}
                    />
                  </td>
                  <td className="cuatro">
                    <GhostBtn2
                      children="Añadir strike y eliminar chat"
                      clase="ghostBtnAlto"
                      onClick={() => encenderModalAñadirStrike(chat)}
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
        {modalEliminarReporte && (
          <div className="modal">
            <div className="modal-content">
              <button className="btnCerrarModal" onClick={() => setModalEliminarReporte(false)}>
                X
              </button>
              <h2>Eliminar el reporte del chat</h2>
              <Label tipoLbl="lblCentrado" textoLbl="¿Deseas eliminar el reporte del mensaje?" />
              <GhostBtn2
                children="Sí, quiero eliminar el reporte."
                clase="ghostBtnAlto"
                onClick={() => eliminarReporte()}
              />
            </div>
          </div>
        )}
        {modalAñadirStrike && (
          <div className="modal">
            <div className="modal-content">
              <button className="btnCerrarModal" onClick={() => setModalAñadirStrike(false)}>
                X
              </button>
              <h2>Añadir Strike y eliminar chat</h2>
              <Label tipoLbl="lblCentrado" textoLbl="¿Deseas añadir un strike y eliminar el chat?" />
              <GhostBtn2
                children="Sí, quiero añadir un strike y eliminar el chat."
                clase="ghostBtnAlto"
                onClick={() => añadirStrikeYEliminarChat()}
              />
            </div>
          </div>
        )}
      {modalReporteEliminadoExitosamente && (
          <div className="modal">
          <div className="modal-content">
          <button className="btnCerrarModal" onClick={() => setModalReporteEliminadoExitosamente(false)}>
              X
          </button>
          <Label tipoLbl="lblCentrado" textoLbl="El reporte fue eliminado exitosamente."/>
          </div>
          </div>
        )}
      {modalStrikeAñadidoExitosamente && (
          <div className="modal">
          <div className="modal-content">
          <button className="btnCerrarModal" onClick={() => setModalStrikeAñadidoExitosamente(false)}>
              X
          </button>
          <Label tipoLbl="lblCentrado" textoLbl="El strike fue añadido exitosamente. El chat también fue eliminado exitosamente."/>
          </div>
          </div>
        )}
      </div>
    )
  }else if(renderizar.length > 1){
    return <PaginaNoEncontrada/>
  }
}

export default MensajesReportados;
